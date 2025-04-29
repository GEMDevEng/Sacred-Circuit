import express from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response-utils.js';
import { saveFeedback } from '../services/feedbackService.js';
import { rateLimit } from '../middleware/security.js';

const router = express.Router();

// Apply rate limiting specifically for feedback submissions
// More restrictive than the global rate limit
const feedbackRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 5, // 5 requests per hour
  message: 'Too many feedback submissions, please try again later'
});

/**
 * @route POST /api/feedback
 * @desc Submit user feedback
 * @access Public
 */
router.post('/', feedbackRateLimit, async (req, res) => {
  try {
    const { type, title, description, email } = req.body;

    // Validate required fields
    if (!type || !title || !description) {
      return sendErrorResponse(res, 'Missing required fields', 400);
    }

    // Validate feedback type
    const validTypes = ['general', 'bug', 'feature', 'content', 'other'];
    if (!validTypes.includes(type)) {
      return sendErrorResponse(res, 'Invalid feedback type', 400);
    }

    // Validate description length
    if (description.length < 10) {
      return sendErrorResponse(res, 'Description is too short', 400);
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendErrorResponse(res, 'Invalid email format', 400);
    }

    // Get client IP for abuse prevention (hashed for privacy)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Save feedback
    await saveFeedback({
      type,
      title,
      description,
      email: email || null,
      clientIp,
      userAgent: req.headers['user-agent'] || null,
      timestamp: new Date().toISOString()
    });

    return sendSuccessResponse(res, {
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return sendErrorResponse(res, 'Failed to submit feedback', 500);
  }
});

export default router;
