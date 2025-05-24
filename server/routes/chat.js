import express from 'express';
import { processChat, storeConversation } from '../services/openaiService.js';
import { findUserByHealingName } from '../services/airtableService.js';
import { validateRequest, chatRequestSchema } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { rateLimit } from '../middleware/security.js';
import { sendSuccessResponse, handleAndSendError } from '../utils/response-utils.js';
import {
  createConversation,
  getUserConversations,
  getConversationThread,
  updateConversation,
  archiveConversation,
  searchConversations,
  getConversationAnalytics
} from '../services/conversationService.js';

const router = express.Router();

/**
 * @route POST /api/chat
 * @desc Process a chat message and get a response
 * @access Public (with rate limiting)
 */
router.post('/',
  rateLimit({ maxRequests: 20, windowMs: 60 * 1000 }), // 20 requests per minute
  validateRequest(chatRequestSchema),
  async (req, res) => {
    try {
      const { message, healingName, storeConversation: consentToStore = false } = req.body;

      // Check if user exists in Airtable (optional)
      const user = await findUserByHealingName(healingName);

      // Get or create conversation ID
      const { conversationId, context } = req.body;

      // Process the chat message with enhanced context
      const response = await processChat(
        message,
        healingName,
        consentToStore,
        user?.id,
        conversationId,
        context
      );

      // Legacy conversation storage (for backward compatibility)
      if (consentToStore && !conversationId) {
        try {
          await storeConversation({
            healingName,
            userMessage: message,
            aiResponse: response.message,
            timestamp: response.timestamp,
            userId: user?.id
          });
        } catch (storageError) {
          console.error('Failed to store conversation:', storageError);
        }
      }

      return sendSuccessResponse(res, response);
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route POST /api/chat/secure
 * @desc Process a chat message with authentication
 * @access Private
 */
router.post('/secure',
  authenticateToken(),
  validateRequest(chatRequestSchema),
  async (req, res) => {
    try {
      const { message, healingName, storeConversation: consentToStore = false } = req.body;

      // Include user ID from token in the context
      const userId = req.userId;

      // Get or create conversation ID
      const { conversationId, context } = req.body;

      // Process the chat message with enhanced context
      const response = await processChat(
        message,
        healingName,
        consentToStore,
        userId,
        conversationId,
        context
      );

      // Legacy conversation storage (for backward compatibility)
      if (consentToStore && !conversationId) {
        try {
          await storeConversation({
            healingName,
            userMessage: message,
            aiResponse: response.message,
            timestamp: response.timestamp,
            userId
          });
        } catch (storageError) {
          console.error('Failed to store conversation:', storageError);
        }
      }

      return sendSuccessResponse(res, response);
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route POST /api/chat/conversations
 * @desc Create a new conversation
 * @access Private
 */
router.post('/conversations',
  authenticateToken,
  rateLimit({ maxRequests: 10, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      const { healingName, title, tags, metadata } = req.body;
      const userId = req.user.id;

      const conversation = await createConversation({
        userId,
        healingName: healingName || req.user.healingName,
        title: title || 'New Conversation',
        tags: tags || [],
        metadata: metadata || {}
      });

      return sendSuccessResponse(res, conversation);
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route GET /api/chat/conversations
 * @desc Get user conversations with filtering
 * @access Private
 */
router.get('/conversations',
  authenticateToken,
  rateLimit({ maxRequests: 30, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const filters = {
        searchQuery: req.query.search,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        tags: req.query.tags ? req.query.tags.split(',') : undefined,
        archived: req.query.archived === 'true',
        limit: parseInt(req.query.limit) || 50
      };

      const conversations = await getUserConversations(userId, filters);
      return sendSuccessResponse(res, { conversations });
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route GET /api/chat/conversations/:id
 * @desc Get conversation thread with messages
 * @access Private
 */
router.get('/conversations/:id',
  authenticateToken,
  rateLimit({ maxRequests: 50, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      const conversationId = req.params.id;
      const messageLimit = parseInt(req.query.limit) || 100;

      const thread = await getConversationThread(conversationId, messageLimit);
      return sendSuccessResponse(res, thread);
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route PATCH /api/chat/conversations/:id
 * @desc Update conversation metadata
 * @access Private
 */
router.patch('/conversations/:id',
  authenticateToken,
  rateLimit({ maxRequests: 20, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      const conversationId = req.params.id;
      const updates = req.body;

      const conversation = await updateConversation(conversationId, updates);
      return sendSuccessResponse(res, conversation);
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route POST /api/chat/conversations/:id/archive
 * @desc Archive/unarchive a conversation
 * @access Private
 */
router.post('/conversations/:id/archive',
  authenticateToken,
  rateLimit({ maxRequests: 20, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      const conversationId = req.params.id;
      const { archived = true } = req.body;

      const conversation = await archiveConversation(conversationId, archived);
      return sendSuccessResponse(res, conversation);
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route GET /api/chat/search
 * @desc Search conversations and messages
 * @access Private
 */
router.get('/search',
  authenticateToken,
  rateLimit({ maxRequests: 20, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { q: query, includeMessages = false, limit = 20 } = req.query;

      if (!query) {
        return sendSuccessResponse(res, { results: [] });
      }

      const results = await searchConversations(userId, query, {
        includeMessages: includeMessages === 'true',
        limit: parseInt(limit)
      });

      return sendSuccessResponse(res, { results });
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route GET /api/chat/analytics
 * @desc Get conversation analytics
 * @access Private
 */
router.get('/analytics',
  authenticateToken,
  rateLimit({ maxRequests: 10, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { days = 30 } = req.query;

      const analytics = await getConversationAnalytics(userId, {
        days: parseInt(days)
      });

      return sendSuccessResponse(res, analytics);
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route GET /api/chat/health
 * @desc Health check endpoint for the chat service
 * @access Public
 */
router.get('/health', (req, res) => {
  return sendSuccessResponse(res, {
    status: 'ok',
    message: 'Chat service is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
