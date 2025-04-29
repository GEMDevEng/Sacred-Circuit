import request from 'supertest';
import express from 'express';
import webhookRouter from '../../routes/webhook.js';
import { processTypeformSubmission } from '../../services/airtableService.js';
import { validateRequest } from '../../middleware/validation.js';
import { verifyTypeformSignature, rateLimit } from '../../middleware/security.js';

// Mock dependencies
jest.mock('../../services/airtableService.js', () => ({
  processTypeformSubmission: jest.fn()
}));

jest.mock('../../middleware/validation.js', () => ({
  validateRequest: jest.fn(() => (req, res, next) => next()),
  webhookRequestSchema: {}
}));

jest.mock('../../middleware/security.js', () => ({
  verifyTypeformSignature: jest.fn(() => (req, res, next) => next()),
  rateLimit: jest.fn(() => (req, res, next) => next())
}));

// Mock environment variables
const originalEnv = process.env;

describe('Webhook Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/webhook', webhookRouter);

    // Reset mocks
    jest.clearAllMocks();

    // Set NODE_ENV to development for testing
    process.env = { ...originalEnv, NODE_ENV: 'development' };
  });

  afterAll(() => {
    // Restore environment
    process.env = originalEnv;
  });

  describe('POST /api/webhook/typeform', () => {
    test('successfully processes a Typeform submission', async () => {
      // Mock the processTypeformSubmission function to return a successful response
      const mockUser = {
        id: 'rec123',
        healingName: 'TestHealer',
        email: 'test@example.com',
        created: true
      };

      processTypeformSubmission.mockResolvedValue(mockUser);

      // Create a mock Typeform submission
      const mockSubmission = {
        form_response: {
          answers: [
            {
              field: { ref: 'healing_name' },
              text: 'TestHealer'
            },
            {
              field: { ref: 'email' },
              email: 'test@example.com'
            }
          ],
          submitted_at: '2023-06-01T12:00:00Z'
        }
      };

      // Make the request
      const response = await request(app)
        .post('/api/webhook/typeform')
        .send(mockSubmission);

      // Check the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          message: 'Webhook processed successfully',
          user: mockUser
        },
        timestamp: expect.any(String),
        status: 200
      });

      // Check that processTypeformSubmission was called with the correct parameters
      expect(processTypeformSubmission).toHaveBeenCalledWith(mockSubmission.form_response);

      // Check that middleware was used
      expect(validateRequest).toHaveBeenCalled();
      expect(verifyTypeformSignature).toHaveBeenCalled();
      expect(rateLimit).toHaveBeenCalled();
    });

    test('handles errors from processTypeformSubmission', async () => {
      // Mock the processTypeformSubmission function to throw an error
      processTypeformSubmission.mockRejectedValue(new Error('Test error'));

      // Create a mock Typeform submission
      const mockSubmission = {
        form_response: {
          answers: [],
          submitted_at: '2023-06-01T12:00:00Z'
        }
      };

      // Make the request
      const response = await request(app)
        .post('/api/webhook/typeform')
        .send(mockSubmission);

      // Check the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Test error',
        timestamp: expect.any(String),
        status: 500
      });
    });

    test('uses rate limiting middleware with correct options', () => {
      // Check that rateLimit was called with the correct options
      expect(rateLimit).toHaveBeenCalledWith({
        maxRequests: 10,
        windowMs: 60 * 1000
      });
    });

    test('uses signature verification middleware', () => {
      // Check that verifyTypeformSignature was called
      expect(verifyTypeformSignature).toHaveBeenCalled();
    });
  });
});
