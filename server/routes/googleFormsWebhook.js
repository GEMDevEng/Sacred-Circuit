import express from 'express';
import { google } from 'googleapis';
import crypto from 'crypto';
import { processGoogleFormSubmission } from '../services/airtableService.js';
import { addSubscriberToMailchimp } from '../services/mailchimpService.js';
import { validateRequest, googleFormsWebhookSchema } from '../middleware/validation.js';
import { rateLimit } from '../middleware/security.js';
import { sendSuccessResponse, handleAndSendError } from '../utils/response-utils.js';

const router = express.Router();

/**
 * @route POST /api/webhook/google-forms
 * @desc Process Google Forms webhook for new user registrations
 * @access Public
 */
router.post('/google-forms',
  rateLimit({ maxRequests: 20, windowMs: 60 * 1000 }), // 20 requests per minute
  validateRequest(googleFormsWebhookSchema),
  async (req, res) => {
    try {
      console.log('Received Google Forms webhook:', req.body);

      // Process the Google Forms submission
      const result = await processGoogleFormSubmission(req.body);

      // Add user to Mailchimp if email consent was given
      if (result.emailConsent && result.email) {
        try {
          await addSubscriberToMailchimp({
            email: result.email,
            healingName: result.healingName,
            healingGoals: result.healingGoals,
            fastingExperience: result.fastingExperience
          });
          console.log(`Added ${result.email} to Mailchimp successfully`);
        } catch (mailchimpError) {
          console.error('Mailchimp error:', mailchimpError);
          // Don't fail the entire request if Mailchimp fails
        }
      }

      return sendSuccessResponse(res, {
        message: 'Google Forms webhook processed successfully',
        user: result
      });
    } catch (error) {
      console.error('Google Forms webhook error:', error);
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route GET /api/webhook/google-forms/responses
 * @desc Fetch recent Google Forms responses (for manual processing)
 * @access Private (requires API key)
 */
router.get('/google-forms/responses',
  rateLimit({ maxRequests: 10, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      // Verify API key
      const apiKey = req.headers['x-api-key'];
      if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const responses = await fetchGoogleFormsResponses();
      
      return sendSuccessResponse(res, {
        message: 'Google Forms responses fetched successfully',
        responses: responses,
        count: responses.length
      });
    } catch (error) {
      console.error('Error fetching Google Forms responses:', error);
      return handleAndSendError(res, error);
    }
  }
);

/**
 * Fetch responses from Google Sheets
 * @returns {Promise<Array>} Array of form responses
 */
async function fetchGoogleFormsResponses() {
  try {
    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Fetch data from the Google Sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Form Responses 1!A:F', // Adjust range based on your form structure
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row and process responses
    const headers = rows[0];
    const responses = rows.slice(1).map(row => {
      const response = {};
      headers.forEach((header, index) => {
        response[header] = row[index] || '';
      });
      return response;
    });

    return responses;
  } catch (error) {
    console.error('Error fetching Google Forms responses:', error);
    throw new Error('Failed to fetch Google Forms responses');
  }
}

/**
 * Process a single Google Forms response
 * @param {Object} formData - The form response data
 * @returns {Promise<Object>} - The processed user data
 */
async function processGoogleFormResponse(formData) {
  try {
    // Map Google Forms fields to our data structure
    const userData = {
      healingName: formData['Healing Name'] || formData['healing_name'] || '',
      email: formData['Email'] || formData['email'] || '',
      healingGoals: formData['Healing Goals'] || formData['healing_goals'] || '',
      fastingExperience: formData['Fasting Experience'] || formData['fasting_experience'] || '',
      emailConsent: formData['Email Consent'] === 'Yes' || formData['email_consent'] === 'Yes' || false,
      timestamp: formData['Timestamp'] || new Date().toISOString()
    };

    // Validate required fields
    if (!userData.healingName || !userData.email) {
      throw new Error('Missing required fields: Healing Name and Email are required');
    }

    // Process the submission through Airtable service
    const result = await processGoogleFormSubmission(userData);

    return result;
  } catch (error) {
    console.error('Error processing Google Form response:', error);
    throw error;
  }
}

export default router;
