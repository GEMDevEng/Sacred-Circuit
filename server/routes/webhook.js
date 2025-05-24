import express from 'express';
import { processTypeformSubmission } from '../services/airtableService.js';
import { validateRequest, webhookRequestSchema } from '../middleware/validation.js';
import { verifyTypeformSignature, rateLimit } from '../middleware/security.js';
import { sendSuccessResponse, handleAndSendError } from '../utils/response-utils.js';
import googleFormsWebhookRouter from './googleFormsWebhook.js';

const router = express.Router();

/**
 * @route POST /api/webhook/typeform
 * @desc Process Typeform webhook for new user registrations
 * @access Public
 */
router.post('/typeform',
  rateLimit({ maxRequests: 10, windowMs: 60 * 1000 }), // 10 requests per minute
  verifyTypeformSignature(),
  validateRequest(webhookRequestSchema),
  async (req, res) => {
    try {
      // Process the Typeform submission
      const result = await processTypeformSubmission(req.body.form_response);

      return sendSuccessResponse(res, {
        message: 'Webhook processed successfully',
        user: result
      });
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

// Mount Google Forms webhook routes
router.use('/', googleFormsWebhookRouter);

export default router;
