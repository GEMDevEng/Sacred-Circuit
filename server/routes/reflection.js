import express from 'express';
import { saveReflection, findUserByHealingName, getReflectionsByHealingName } from '../services/airtableService.js';
import { validateRequest, reflectionRequestSchema } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { rateLimit } from '../middleware/security.js';
import { sendSuccessResponse, sendErrorResponse, handleAndSendError } from '../utils/response-utils.js';

const router = express.Router();

/**
 * @route POST /api/reflection
 * @desc Save a user reflection
 * @access Public (with rate limiting)
 */
router.post('/',
  rateLimit({ maxRequests: 10, windowMs: 60 * 1000 }), // 10 requests per minute
  validateRequest(reflectionRequestSchema),
  async (req, res) => {
    try {
      const { healingName, content, milestone, emailConsent = false } = req.body;

      // Check if user exists in Airtable
      const user = await findUserByHealingName(healingName);

      // Save the reflection
      const reflection = await saveReflection({
        healingName,
        reflectionText: content,
        journeyDay: milestone || 'Not specified',
        emailConsent,
        userId: user?.id // Link to user if found
      });

      return sendSuccessResponse(res, reflection, 201);
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route POST /api/reflection/secure
 * @desc Save a user reflection with authentication
 * @access Private
 */
router.post('/secure',
  authenticateToken(),
  validateRequest(reflectionRequestSchema),
  async (req, res) => {
    try {
      const { healingName, content, milestone, emailConsent = false } = req.body;

      // Get user ID from token
      const userId = req.userId;

      // Save the reflection with authenticated user ID
      const reflection = await saveReflection({
        healingName,
        reflectionText: content,
        journeyDay: milestone || 'Not specified',
        emailConsent,
        userId // Use authenticated user ID
      });

      return sendSuccessResponse(res, reflection, 201);
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route GET /api/reflection
 * @desc Get reflections for a healing name
 * @access Public (with rate limiting)
 */
router.get('/',
  rateLimit({ maxRequests: 20, windowMs: 60 * 1000 }), // 20 requests per minute
  async (req, res) => {
    try {
      const { healingName } = req.query;

      if (!healingName) {
        return sendErrorResponse(res, 'Healing name is required', 400);
      }

      // Find user by healing name
      const user = await findUserByHealingName(healingName);

      if (!user) {
        return sendSuccessResponse(res, { reflections: [] });
      }

      // Get reflections for user
      const reflections = await getReflectionsByHealingName(healingName);

      return sendSuccessResponse(res, { reflections });
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

export default router;
