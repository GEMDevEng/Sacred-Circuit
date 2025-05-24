import express from 'express';
import { processChat, storeConversation } from '../services/openaiService.js';
import { findUserByHealingName } from '../services/googleSheetsService.js';
import { validateRequest, chatRequestSchema } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { rateLimit } from '../middleware/security.js';
import { sendSuccessResponse, handleAndSendError } from '../utils/response-utils.js';

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

      // Process the chat message
      const response = await processChat(message, healingName, consentToStore);

      // Store conversation if user consented
      if (consentToStore) {
        try {
          await storeConversation({
            healingName,
            userMessage: message,
            aiResponse: response.message,
            timestamp: response.timestamp,
            userId: user?.id // Link to user if found
          });
        } catch (storageError) {
          console.error('Failed to store conversation:', storageError);
          // Continue with response even if storage fails
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

      // Process the chat message
      const response = await processChat(message, healingName, consentToStore, userId);

      // Store conversation if user consented
      if (consentToStore) {
        try {
          await storeConversation({
            healingName,
            userMessage: message,
            aiResponse: response.message,
            timestamp: response.timestamp,
            userId // Use authenticated user ID
          });
        } catch (storageError) {
          console.error('Failed to store conversation:', storageError);
          // Continue with response even if storage fails
        }
      }

      return sendSuccessResponse(res, response);
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
