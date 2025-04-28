import express from 'express';
import { processTypeformSubmission } from '../services/airtableService.js';

const router = express.Router();

/**
 * @route POST /api/webhook/typeform
 * @desc Process Typeform webhook for new user registrations
 * @access Public
 */
router.post('/typeform', async (req, res) => {
  try {
    const formData = req.body;
    
    if (!formData || !formData.form_response) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid webhook data' 
      });
    }
    
    // Process the Typeform submission
    await processTypeformSubmission(formData.form_response);
    
    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({
      success: false,
      error: 'Error processing webhook'
    });
  }
});

export default router;
