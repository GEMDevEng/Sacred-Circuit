import request from 'supertest';
import express from 'express';
import reflectionRouter from '../../routes/reflection.js';
import { saveReflection } from '../../services/airtableService.js';
import { validateRequest } from '../../middleware/validation.js';

// Mock dependencies
jest.mock('../../services/airtableService.js', () => ({
  saveReflection: jest.fn()
}));

jest.mock('../../middleware/validation.js', () => ({
  validateRequest: jest.fn(() => (req, res, next) => next()),
  reflectionRequestSchema: {}
}));

describe('Reflection Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/reflection', reflectionRouter);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('POST /api/reflection', () => {
    test('successfully saves a reflection', async () => {
      // Mock the saveReflection function to return a successful response
      const mockReflection = {
        id: 'rec123',
        healingName: 'TestHealer',
        journeyDay: 'Day 7',
        timestamp: new Date().toISOString(),
        success: true
      };
      
      saveReflection.mockResolvedValue(mockReflection);
      
      // Make the request
      const response = await request(app)
        .post('/api/reflection')
        .send({
          healingName: 'TestHealer',
          content: 'This is a test reflection',
          milestone: 'Day 7',
          emailConsent: true
        });
      
      // Check the response
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        data: mockReflection,
        timestamp: expect.any(String),
        status: 201
      });
      
      // Check that saveReflection was called with the correct parameters
      expect(saveReflection).toHaveBeenCalledWith({
        healingName: 'TestHealer',
        reflectionText: 'This is a test reflection',
        journeyDay: 'Day 7',
        emailConsent: true
      });
      
      // Check that validateRequest was used as middleware
      expect(validateRequest).toHaveBeenCalled();
    });
    
    test('handles errors from saveReflection', async () => {
      // Mock the saveReflection function to throw an error
      saveReflection.mockRejectedValue(new Error('Test error'));
      
      // Make the request
      const response = await request(app)
        .post('/api/reflection')
        .send({
          healingName: 'TestHealer',
          content: 'This is a test reflection',
          milestone: 'Day 7'
        });
      
      // Check the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Test error',
        timestamp: expect.any(String),
        status: 500
      });
    });
    
    test('uses default values for optional fields', async () => {
      // Mock the saveReflection function to return a successful response
      const mockReflection = {
        id: 'rec123',
        healingName: 'TestHealer',
        journeyDay: 'Not specified',
        timestamp: new Date().toISOString(),
        success: true
      };
      
      saveReflection.mockResolvedValue(mockReflection);
      
      // Make the request without optional fields
      const response = await request(app)
        .post('/api/reflection')
        .send({
          healingName: 'TestHealer',
          content: 'This is a test reflection'
        });
      
      // Check that saveReflection was called with default values
      expect(saveReflection).toHaveBeenCalledWith({
        healingName: 'TestHealer',
        reflectionText: 'This is a test reflection',
        journeyDay: 'Not specified',
        emailConsent: false
      });
    });
  });
});
