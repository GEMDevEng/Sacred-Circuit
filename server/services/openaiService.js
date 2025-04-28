import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
 * Process a chat message and get a response from OpenAI
 * @param {string} message - The user's message
 * @param {string} healingName - The user's healing name
 * @param {boolean} storeConversation - Whether to store the conversation
 * @returns {Promise<Object>} - The AI response
 */
export async function processChat(message, healingName, storeConversation = false) {
  try {
    // Create conversation context
    const userIdentifier = healingName || 'Seeker';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `${userIdentifier}: ${message}` }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    // If user doesn't consent to storage, don't save the conversation
    if (!storeConversation) {
      console.log('User opted out of conversation storage (Zero Data Retention)');
    }
    
    return {
      message: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to process chat message');
  }
}
