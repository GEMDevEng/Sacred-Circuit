import express from 'express';
import { processChat } from '../services/openaiService.js';

const router = express.Router();

/**
 * @route POST /api/chat
 * @desc Process a chat message and get a response
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const { message, healingName, storeConversation } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }
    
    const response = await processChat(message, healingName, storeConversation);
    
    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      error: 'Error processing chat message'
    });
  }
});

export default router;
