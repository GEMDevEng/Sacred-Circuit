import OpenAI from 'openai';
import dotenv from 'dotenv';
import Airtable from 'airtable';
import {
  generateContextualPrompt,
  getPersonalizedExercises,
  generateHealingRecommendations,
  extractContextFromHistory
} from './spiritualGuidanceService.js';
import {
  getConversationMessages,
  addMessageToConversation
} from './conversationService.js';

dotenv.config();

// Initialize OpenAI client
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.warn('OpenAI API key missing or invalid. Chat functionality will return mock responses.');
  // Create a mock OpenAI client for development
  openai = {
    chat: {
      completions: {
        create: async () => ({
          choices: [
            {
              message: {
                content: "This is a mock response. Please set up a valid OpenAI API key to get real responses."
              }
            }
          ]
        })
      }
    }
  };
}

// Initialize Airtable for conversation storage
let base;
let conversationsTable;

try {
  Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY,
  });

  base = Airtable.base(process.env.AIRTABLE_BASE_ID);
  conversationsTable = base('Conversations');
} catch (error) {
  console.warn('Airtable API key or base ID missing or invalid. Conversation storage will be mocked.');
  // Create mock functions for development
  conversationsTable = {
    create: async () => ({
      id: 'mock-id-' + Date.now(),
      fields: {
        'Timestamp': new Date().toISOString()
      }
    })
  };
}

// System prompt for the spiritual guidance chatbot
const SYSTEM_PROMPT = `
You are a compassionate spiritual guide for the Sacred Healing Companion & Journey Hub.
Your purpose is to provide heart-centered guidance to users on their healing journeys.

Guidelines:
- Speak with warmth, compassion, and spiritual wisdom
- Avoid making medical claims or diagnosing conditions
- Encourage self-reflection and personal sovereignty
- Respect all spiritual traditions and beliefs
- Suggest practices like meditation, journaling, and mindfulness
- Use gentle, supportive language
- Respect user privacy and confidentiality
- If users ask about fasting or detoxification, emphasize safety and listening to one's body
- Avoid giving specific medical advice; suggest consulting healthcare providers when appropriate
- Respond to emotional distress with empathy and appropriate resources

The user will interact with you using their "Healing Name" - a pseudonym they've chosen for privacy.
`;

/**
 * Process a chat message and get a response from OpenAI with enhanced context
 * @param {string} message - The user's message
 * @param {string} healingName - The user's healing name
 * @param {boolean} storeConversation - Whether to store the conversation
 * @param {string} [userId] - Optional user ID for authenticated users
 * @param {string} [conversationId] - Optional conversation ID for context
 * @param {Object} [context] - Optional spiritual context
 * @returns {Promise<Object>} - The AI response
 */
export async function processChat(
  message,
  healingName,
  storeConversation = false,
  userId = null,
  conversationId = null,
  context = {}
) {
  const startTime = Date.now();

  try {
    // Create conversation context
    const userIdentifier = healingName || 'Seeker';
    let conversationHistory = [];
    let enhancedContext = { ...context };

    // Get conversation history if conversationId is provided
    if (conversationId && storeConversation) {
      try {
        conversationHistory = await getConversationMessages(conversationId, 10); // Last 10 messages

        // Extract context from history if not provided
        if (Object.keys(context).length === 0) {
          enhancedContext = extractContextFromHistory(conversationHistory);
        }
      } catch (error) {
        console.warn('Could not retrieve conversation history:', error.message);
      }
    }

    // Generate contextual system prompt
    const systemPrompt = generateContextualPrompt(enhancedContext);

    // Build messages array with system prompt and history
    const messages = [{ role: "system", content: systemPrompt }];

    // Add conversation history (convert to OpenAI format)
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.sender === 'user' ? `${userIdentifier}: ${msg.content}` : msg.content
      });
    });

    // Add current user message
    messages.push({ role: "user", content: `${userIdentifier}: ${message}` });

    // Add user ID to system message if available (for authenticated users)
    if (userId) {
      messages[0].content += `\nThis user is authenticated with ID: ${userId}`;
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 800, // Increased for more comprehensive responses
      // Enable Zero Data Retention if user doesn't consent to storage
      user: !storeConversation ? `zdr_${Date.now()}` : undefined
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Log consent status
    if (!storeConversation) {
      console.log('User opted out of conversation storage (Zero Data Retention)');
    }

    const aiResponse = response.choices[0].message.content;
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store messages in conversation if enabled
    if (conversationId && storeConversation) {
      try {
        // Store user message
        await addMessageToConversation({
          conversationId,
          content: message,
          sender: 'user',
          metadata: {
            healingName,
            userId,
            timestamp: new Date().toISOString()
          }
        });

        // Store AI response
        await addMessageToConversation({
          conversationId,
          content: aiResponse,
          sender: 'bot',
          metadata: {
            model: 'gpt-4o',
            tokens: response.usage?.total_tokens,
            responseTime,
            temperature: 0.7,
            context: enhancedContext
          }
        });
      } catch (error) {
        console.warn('Failed to store messages in conversation:', error.message);
      }
    }

    // Get personalized recommendations
    const exercises = getPersonalizedExercises(enhancedContext);
    const recommendations = generateHealingRecommendations(enhancedContext);

    return {
      message: aiResponse,
      timestamp: new Date().toISOString(),
      conversationId,
      messageId,
      metadata: {
        tokens: response.usage?.total_tokens,
        model: 'gpt-4o',
        responseTime,
        context: enhancedContext
      },
      exercises: exercises.slice(0, 2), // Include top 2 exercises
      recommendations: recommendations.slice(0, 1) // Include top recommendation
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to process chat message');
  }
}

/**
 * Store a conversation in Airtable
 * @param {Object} conversationData - The conversation data
 * @param {string} conversationData.healingName - The user's healing name
 * @param {string} conversationData.userMessage - The user's message
 * @param {string} conversationData.aiResponse - The AI's response
 * @param {string} conversationData.timestamp - The timestamp
 * @param {string} [conversationData.userId] - Optional user ID reference
 * @returns {Promise<Object>} - The stored conversation
 */
export async function storeConversation(conversationData) {
  try {
    const { healingName, userMessage, aiResponse, timestamp, userId } = conversationData;

    // Create conversation record
    const conversationRecord = {
      'Healing Name': healingName,
      'User Message': userMessage,
      'AI Response': aiResponse,
      'Timestamp': timestamp || new Date().toISOString(),
      'Consent Given': true
    };

    // Add user reference if available
    if (userId) {
      conversationRecord['User'] = [userId];
    }

    // Store in Airtable
    const record = await conversationsTable.create(conversationRecord);

    return {
      id: record.id,
      timestamp: record.fields['Timestamp'],
      success: true
    };
  } catch (error) {
    console.error('Failed to store conversation:', error);
    throw new Error('Failed to store conversation');
  }
}
