import express from 'express';
import { processChat } from '../services/openaiService.js';
import { validateRequest, chatRequestSchema } from '../middleware/validation.js';
import { sendSuccessResponse, handleAndSendError } from '../utils/response-utils.js';

const router = express.Router();

/**
 * @route POST /api/chat
 * @desc Process a chat message and get a response
 * @access Public
 */
router.post('/', validateRequest(chatRequestSchema), async (req, res) => {
  try {
    const { message, healingName, storeConversation = false } = req.body;

    const response = await processChat(message, healingName, storeConversation);

    return sendSuccessResponse(res, response);
  } catch (error) {
    return handleAndSendError(res, error);
  }
});

export default router;
