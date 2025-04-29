import express from 'express';
import { saveReflection } from '../services/airtableService.js';
import { validateRequest, reflectionRequestSchema } from '../middleware/validation.js';
import { sendSuccessResponse, handleAndSendError } from '../utils/response-utils.js';

const router = express.Router();

/**
 * @route POST /api/reflection
 * @desc Save a user reflection
 * @access Public
 */
router.post('/', validateRequest(reflectionRequestSchema), async (req, res) => {
  try {
    const { healingName, content, milestone, emailConsent = false } = req.body;

    const reflection = await saveReflection({
      healingName,
      reflectionText: content,
      journeyDay: milestone || 'Not specified',
      emailConsent
    });

    return sendSuccessResponse(res, reflection, 201);
  } catch (error) {
    return handleAndSendError(res, error);
  }
});

export default router;
