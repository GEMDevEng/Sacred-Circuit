import request from 'supertest';
import express from 'express';
import chatRouter from '../../routes/chat.js';
import { processChat } from '../../services/openaiService.js';
import { validateRequest } from '../../middleware/validation.js';

// Mock dependencies
jest.mock('../../services/openaiService.js', () => ({
  processChat: jest.fn()
}));

jest.mock('../../middleware/validation.js', () => ({
  validateRequest: jest.fn(() => (req, res, next) => next()),
  chatRequestSchema: {}
}));

describe('Chat Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/chat', chatRouter);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('POST /api/chat', () => {
    test('successfully processes a chat message', async () => {
      // Mock the processChat function to return a successful response
      const mockResponse = {
        message: 'This is a test response',
        timestamp: new Date().toISOString()
      };
      
      processChat.mockResolvedValue(mockResponse);
      
      // Make the request
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Hello',
          healingName: 'TestHealer',
          storeConversation: false
        });
      
      // Check the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockResponse,
        timestamp: expect.any(String),
        status: 200
      });
      
      // Check that processChat was called with the correct parameters
      expect(processChat).toHaveBeenCalledWith('Hello', 'TestHealer', false);
      
      // Check that validateRequest was used as middleware
      expect(validateRequest).toHaveBeenCalled();
    });
    
    test('handles errors from processChat', async () => {
      // Mock the processChat function to throw an error
      processChat.mockRejectedValue(new Error('Test error'));
      
      // Make the request
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Hello',
          healingName: 'TestHealer',
          storeConversation: false
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
    
    test('uses default value for storeConversation if not provided', async () => {
      // Mock the processChat function to return a successful response
      const mockResponse = {
        message: 'This is a test response',
        timestamp: new Date().toISOString()
      };
      
      processChat.mockResolvedValue(mockResponse);
      
      // Make the request without storeConversation
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Hello',
          healingName: 'TestHealer'
        });
      
      // Check that processChat was called with storeConversation=false
      expect(processChat).toHaveBeenCalledWith('Hello', 'TestHealer', false);
    });
  });
});
