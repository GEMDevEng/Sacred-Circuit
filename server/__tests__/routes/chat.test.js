import request from 'supertest';
import express from 'express';
import chatRouter from '../../routes/chat.js';
import { processChat, storeConversation } from '../../services/openaiService.js';
import { validateRequest } from '../../middleware/validation.js';
import { authenticateToken } from '../../middleware/auth.js';
import { findUserByHealingName } from '../../services/airtableService.js';

// Mock dependencies
jest.mock('../../services/openaiService.js', () => ({
  processChat: jest.fn(),
  storeConversation: jest.fn()
}));

jest.mock('../../services/airtableService.js', () => ({
  findUserByHealingName: jest.fn()
}));

jest.mock('../../middleware/validation.js', () => ({
  validateRequest: jest.fn(() => (req, res, next) => next()),
  chatRequestSchema: {}
}));

jest.mock('../../middleware/auth.js', () => ({
  authenticateToken: jest.fn(() => (req, res, next) => {
    req.userId = 'test-user-id';
    next();
  })
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

    test('stores conversation when storeConversation is true', async () => {
      // Mock the processChat function to return a successful response
      const mockResponse = {
        message: 'This is a test response',
        timestamp: new Date().toISOString()
      };

      processChat.mockResolvedValue(mockResponse);

      // Mock findUserByHealingName to return a user
      const mockUser = { id: 'user-123', healingName: 'TestHealer' };
      findUserByHealingName.mockResolvedValue(mockUser);

      // Make the request with storeConversation=true
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Hello',
          healingName: 'TestHealer',
          storeConversation: true
        });

      // Check the response
      expect(response.status).toBe(200);

      // Check that findUserByHealingName was called
      expect(findUserByHealingName).toHaveBeenCalledWith('TestHealer');

      // Check that storeConversation was called with the correct parameters
      expect(storeConversation).toHaveBeenCalledWith({
        healingName: 'TestHealer',
        userMessage: 'Hello',
        aiResponse: mockResponse.message,
        timestamp: mockResponse.timestamp,
        userId: mockUser.id
      });
    });

    test('continues with response even if storage fails', async () => {
      // Mock the processChat function to return a successful response
      const mockResponse = {
        message: 'This is a test response',
        timestamp: new Date().toISOString()
      };

      processChat.mockResolvedValue(mockResponse);

      // Mock findUserByHealingName to return a user
      findUserByHealingName.mockResolvedValue({ id: 'user-123' });

      // Mock storeConversation to throw an error
      storeConversation.mockRejectedValue(new Error('Storage error'));

      // Make the request with storeConversation=true
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Hello',
          healingName: 'TestHealer',
          storeConversation: true
        });

      // Check the response is still successful despite storage error
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockResponse,
        timestamp: expect.any(String),
        status: 200
      });
    });
  });

  describe('POST /api/chat/secure', () => {
    test('successfully processes an authenticated chat message', async () => {
      // Mock the processChat function to return a successful response
      const mockResponse = {
        message: 'This is a secure test response',
        timestamp: new Date().toISOString()
      };

      processChat.mockResolvedValue(mockResponse);

      // Make the request with authentication
      const response = await request(app)
        .post('/api/chat/secure')
        .set('Authorization', 'Bearer test-token')
        .send({
          message: 'Hello Secure',
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

      // Check that authenticateToken middleware was used
      expect(authenticateToken).toHaveBeenCalled();

      // Check that processChat was called with the correct parameters including userId
      expect(processChat).toHaveBeenCalledWith('Hello Secure', 'TestHealer', false, 'test-user-id');
    });

    test('stores conversation with user ID from token when storeConversation is true', async () => {
      // Mock the processChat function to return a successful response
      const mockResponse = {
        message: 'This is a secure test response',
        timestamp: new Date().toISOString()
      };

      processChat.mockResolvedValue(mockResponse);

      // Make the request with authentication and storeConversation=true
      const response = await request(app)
        .post('/api/chat/secure')
        .set('Authorization', 'Bearer test-token')
        .send({
          message: 'Hello Secure',
          healingName: 'TestHealer',
          storeConversation: true
        });

      // Check the response
      expect(response.status).toBe(200);

      // Check that storeConversation was called with the correct parameters including userId from token
      expect(storeConversation).toHaveBeenCalledWith({
        healingName: 'TestHealer',
        userMessage: 'Hello Secure',
        aiResponse: mockResponse.message,
        timestamp: mockResponse.timestamp,
        userId: 'test-user-id'
      });
    });
  });
});
