import { v4 as uuidv4 } from 'uuid';
import { getAirtableBase } from './airtableService.js';

/**
 * Enhanced conversation management service
 */

// Initialize Airtable tables
let conversationsTable;
let conversationMessagesTable;

try {
  const base = getAirtableBase();
  conversationsTable = base('Conversations');
  conversationMessagesTable = base('ConversationMessages');
} catch (error) {
  console.warn('Airtable conversation tables not available, using mock implementation');
  
  // Mock implementation for development
  const mockData = {
    conversations: new Map(),
    messages: new Map()
  };

  conversationsTable = {
    create: async (data) => ({
      id: uuidv4(),
      fields: { ...data, 'Created At': new Date().toISOString() }
    }),
    select: () => ({
      firstPage: async () => Array.from(mockData.conversations.values()),
      all: async () => Array.from(mockData.conversations.values())
    }),
    find: async (id) => mockData.conversations.get(id),
    update: async (id, data) => {
      const existing = mockData.conversations.get(id);
      if (existing) {
        const updated = { ...existing, fields: { ...existing.fields, ...data } };
        mockData.conversations.set(id, updated);
        return updated;
      }
      throw new Error('Record not found');
    }
  };

  conversationMessagesTable = {
    create: async (data) => ({
      id: uuidv4(),
      fields: { ...data, 'Created At': new Date().toISOString() }
    }),
    select: () => ({
      firstPage: async () => Array.from(mockData.messages.values()),
      all: async () => Array.from(mockData.messages.values())
    })
  };
}

/**
 * Create a new conversation
 * @param {Object} conversationData - Conversation data
 * @returns {Promise<Object>} - Created conversation
 */
export async function createConversation(conversationData) {
  try {
    const {
      userId,
      healingName,
      title = 'New Conversation',
      tags = [],
      metadata = {}
    } = conversationData;

    const conversationRecord = {
      'ID': uuidv4(),
      'User ID': userId,
      'Healing Name': healingName,
      'Title': title,
      'Created At': new Date().toISOString(),
      'Updated At': new Date().toISOString(),
      'Message Count': 0,
      'Tags': tags.join(','),
      'Archived': false,
      'Shared': false,
      'Metadata': JSON.stringify(metadata)
    };

    const record = await conversationsTable.create(conversationRecord);

    return {
      id: record.fields['ID'] || record.id,
      userId: record.fields['User ID'],
      healingName: record.fields['Healing Name'],
      title: record.fields['Title'],
      createdAt: record.fields['Created At'],
      updatedAt: record.fields['Updated At'],
      messageCount: record.fields['Message Count'],
      tags: record.fields['Tags'] ? record.fields['Tags'].split(',') : [],
      archived: record.fields['Archived'],
      shared: record.fields['Shared'],
      metadata: record.fields['Metadata'] ? JSON.parse(record.fields['Metadata']) : {}
    };
  } catch (error) {
    console.error('Failed to create conversation:', error);
    throw new Error('Failed to create conversation');
  }
}

/**
 * Add a message to a conversation
 * @param {Object} messageData - Message data
 * @returns {Promise<Object>} - Created message
 */
export async function addMessageToConversation(messageData) {
  try {
    const {
      conversationId,
      content,
      sender,
      metadata = {}
    } = messageData;

    const messageRecord = {
      'ID': uuidv4(),
      'Conversation ID': conversationId,
      'Content': content,
      'Sender': sender,
      'Timestamp': new Date().toISOString(),
      'Status': 'sent',
      'Metadata': JSON.stringify(metadata)
    };

    const record = await conversationMessagesTable.create(messageRecord);

    // Update conversation message count and last message
    await updateConversationStats(conversationId, content);

    return {
      id: record.fields['ID'] || record.id,
      conversationId: record.fields['Conversation ID'],
      content: record.fields['Content'],
      sender: record.fields['Sender'],
      timestamp: record.fields['Timestamp'],
      status: record.fields['Status'],
      metadata: record.fields['Metadata'] ? JSON.parse(record.fields['Metadata']) : {}
    };
  } catch (error) {
    console.error('Failed to add message to conversation:', error);
    throw new Error('Failed to add message to conversation');
  }
}

/**
 * Update conversation statistics
 * @param {string} conversationId - Conversation ID
 * @param {string} lastMessage - Last message content
 */
async function updateConversationStats(conversationId, lastMessage) {
  try {
    // Get current message count
    const messages = await getConversationMessages(conversationId);
    const messageCount = messages.length;

    // Update conversation record
    await conversationsTable.update(conversationId, {
      'Message Count': messageCount,
      'Last Message': lastMessage.substring(0, 100), // Truncate for storage
      'Updated At': new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to update conversation stats:', error);
    // Don't throw error as this is not critical
  }
}

/**
 * Get conversation by ID
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Object>} - Conversation data
 */
export async function getConversation(conversationId) {
  try {
    const record = await conversationsTable.find(conversationId);
    
    if (!record) {
      throw new Error('Conversation not found');
    }

    return {
      id: record.fields['ID'] || record.id,
      userId: record.fields['User ID'],
      healingName: record.fields['Healing Name'],
      title: record.fields['Title'],
      createdAt: record.fields['Created At'],
      updatedAt: record.fields['Updated At'],
      messageCount: record.fields['Message Count'],
      lastMessage: record.fields['Last Message'],
      tags: record.fields['Tags'] ? record.fields['Tags'].split(',') : [],
      archived: record.fields['Archived'],
      shared: record.fields['Shared'],
      metadata: record.fields['Metadata'] ? JSON.parse(record.fields['Metadata']) : {}
    };
  } catch (error) {
    console.error('Failed to get conversation:', error);
    throw new Error('Failed to get conversation');
  }
}

/**
 * Get messages for a conversation
 * @param {string} conversationId - Conversation ID
 * @param {number} limit - Maximum number of messages to return
 * @returns {Promise<Array>} - Array of messages
 */
export async function getConversationMessages(conversationId, limit = 100) {
  try {
    const records = await conversationMessagesTable.select({
      filterByFormula: `{Conversation ID} = '${conversationId}'`,
      sort: [{ field: 'Timestamp', direction: 'asc' }],
      maxRecords: limit
    }).all();

    return records.map(record => ({
      id: record.fields['ID'] || record.id,
      conversationId: record.fields['Conversation ID'],
      content: record.fields['Content'],
      sender: record.fields['Sender'],
      timestamp: record.fields['Timestamp'],
      status: record.fields['Status'],
      metadata: record.fields['Metadata'] ? JSON.parse(record.fields['Metadata']) : {}
    }));
  } catch (error) {
    console.error('Failed to get conversation messages:', error);
    throw new Error('Failed to get conversation messages');
  }
}

/**
 * Get conversations for a user
 * @param {string} userId - User ID or healing name
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} - Array of conversations
 */
export async function getUserConversations(userId, filters = {}) {
  try {
    const {
      searchQuery,
      dateFrom,
      dateTo,
      tags,
      archived = false,
      limit = 50
    } = filters;

    let filterFormula = `OR({User ID} = '${userId}', {Healing Name} = '${userId}')`;
    
    if (archived !== undefined) {
      filterFormula += ` AND {Archived} = ${archived ? 'TRUE()' : 'FALSE()'}`;
    }

    if (dateFrom) {
      filterFormula += ` AND IS_AFTER({Created At}, '${dateFrom}')`;
    }

    if (dateTo) {
      filterFormula += ` AND IS_BEFORE({Created At}, '${dateTo}')`;
    }

    if (tags && tags.length > 0) {
      const tagFilters = tags.map(tag => `SEARCH('${tag}', {Tags})`).join(', ');
      filterFormula += ` AND OR(${tagFilters})`;
    }

    const records = await conversationsTable.select({
      filterByFormula: filterFormula,
      sort: [{ field: 'Updated At', direction: 'desc' }],
      maxRecords: limit
    }).all();

    let conversations = records.map(record => ({
      id: record.fields['ID'] || record.id,
      userId: record.fields['User ID'],
      healingName: record.fields['Healing Name'],
      title: record.fields['Title'],
      createdAt: record.fields['Created At'],
      updatedAt: record.fields['Updated At'],
      messageCount: record.fields['Message Count'],
      lastMessage: record.fields['Last Message'],
      tags: record.fields['Tags'] ? record.fields['Tags'].split(',') : [],
      archived: record.fields['Archived'],
      shared: record.fields['Shared'],
      metadata: record.fields['Metadata'] ? JSON.parse(record.fields['Metadata']) : {}
    }));

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      conversations = conversations.filter(conv => 
        conv.title.toLowerCase().includes(query) ||
        (conv.lastMessage && conv.lastMessage.toLowerCase().includes(query)) ||
        conv.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return conversations;
  } catch (error) {
    console.error('Failed to get user conversations:', error);
    throw new Error('Failed to get user conversations');
  }
}

/**
 * Get conversation thread (conversation + messages)
 * @param {string} conversationId - Conversation ID
 * @param {number} messageLimit - Maximum number of messages
 * @returns {Promise<Object>} - Conversation thread
 */
export async function getConversationThread(conversationId, messageLimit = 100) {
  try {
    const [conversation, messages] = await Promise.all([
      getConversation(conversationId),
      getConversationMessages(conversationId, messageLimit)
    ]);

    return {
      conversation,
      messages
    };
  } catch (error) {
    console.error('Failed to get conversation thread:', error);
    throw new Error('Failed to get conversation thread');
  }
}

/**
 * Update conversation metadata
 * @param {string} conversationId - Conversation ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} - Updated conversation
 */
export async function updateConversation(conversationId, updates) {
  try {
    const updateData = {
      'Updated At': new Date().toISOString()
    };

    if (updates.title) updateData['Title'] = updates.title;
    if (updates.tags) updateData['Tags'] = updates.tags.join(',');
    if (updates.archived !== undefined) updateData['Archived'] = updates.archived;
    if (updates.shared !== undefined) updateData['Shared'] = updates.shared;
    if (updates.metadata) updateData['Metadata'] = JSON.stringify(updates.metadata);

    await conversationsTable.update(conversationId, updateData);
    
    return await getConversation(conversationId);
  } catch (error) {
    console.error('Failed to update conversation:', error);
    throw new Error('Failed to update conversation');
  }
}

/**
 * Archive/unarchive conversation
 * @param {string} conversationId - Conversation ID
 * @param {boolean} archived - Archive status
 * @returns {Promise<Object>} - Updated conversation
 */
export async function archiveConversation(conversationId, archived = true) {
  return await updateConversation(conversationId, { archived });
}

/**
 * Share/unshare conversation
 * @param {string} conversationId - Conversation ID
 * @param {boolean} shared - Share status
 * @returns {Promise<Object>} - Updated conversation
 */
export async function shareConversation(conversationId, shared = true) {
  return await updateConversation(conversationId, { shared });
}

/**
 * Search conversations
 * @param {string} userId - User ID or healing name
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Search results
 */
export async function searchConversations(userId, query, options = {}) {
  try {
    const { includeMessages = false, limit = 20 } = options;
    
    // Get user conversations with search filter
    const conversations = await getUserConversations(userId, {
      searchQuery: query,
      limit
    });

    if (!includeMessages) {
      return conversations;
    }

    // Include message search results
    const results = [];
    for (const conversation of conversations) {
      const messages = await getConversationMessages(conversation.id);
      const matchingMessages = messages.filter(msg => 
        msg.content.toLowerCase().includes(query.toLowerCase())
      );

      if (matchingMessages.length > 0) {
        results.push({
          conversation,
          matchingMessages: matchingMessages.slice(0, 5) // Limit matching messages
        });
      } else {
        results.push({ conversation, matchingMessages: [] });
      }
    }

    return results;
  } catch (error) {
    console.error('Failed to search conversations:', error);
    throw new Error('Failed to search conversations');
  }
}

/**
 * Get conversation analytics
 * @param {string} userId - User ID or healing name
 * @param {Object} options - Analytics options
 * @returns {Promise<Object>} - Analytics data
 */
export async function getConversationAnalytics(userId, options = {}) {
  try {
    const { days = 30 } = options;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const conversations = await getUserConversations(userId, {
      dateFrom: startDate.toISOString(),
      limit: 1000
    });

    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messageCount, 0);
    const averageMessagesPerConversation = conversations.length > 0 
      ? totalMessages / conversations.length 
      : 0;

    // Extract topics from conversation metadata
    const topicCounts = {};
    conversations.forEach(conv => {
      if (conv.metadata && conv.metadata.topics) {
        conv.metadata.topics.forEach(topic => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
      }
    });

    const mostCommonTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));

    return {
      totalConversations: conversations.length,
      totalMessages,
      averageMessagesPerConversation: Math.round(averageMessagesPerConversation * 100) / 100,
      averageResponseTime: 0, // Would need to calculate from message timestamps
      mostCommonTopics,
      userEngagement: {
        dailyActive: conversations.filter(conv => {
          const dayAgo = new Date();
          dayAgo.setDate(dayAgo.getDate() - 1);
          return new Date(conv.updatedAt) > dayAgo;
        }).length,
        weeklyActive: conversations.filter(conv => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(conv.updatedAt) > weekAgo;
        }).length,
        monthlyActive: conversations.length
      },
      moodDistribution: {}, // Would extract from conversation metadata
      journeyStageDistribution: {} // Would extract from conversation metadata
    };
  } catch (error) {
    console.error('Failed to get conversation analytics:', error);
    throw new Error('Failed to get conversation analytics');
  }
}
