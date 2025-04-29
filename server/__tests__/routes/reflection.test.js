import request from 'supertest';
import express from 'express';
import reflectionRouter from '../../routes/reflection.js';
import { saveReflection, findUserByHealingName, getReflectionsByHealingName } from '../../services/airtableService.js';
import { validateRequest } from '../../middleware/validation.js';
import { authenticateToken } from '../../middleware/auth.js';

// Mock dependencies
jest.mock('../../services/airtableService.js', () => ({
  saveReflection: jest.fn(),
  findUserByHealingName: jest.fn(),
  getReflectionsByHealingName: jest.fn()
}));

jest.mock('../../middleware/validation.js', () => ({
  validateRequest: jest.fn(() => (req, res, next) => next()),
  reflectionRequestSchema: {}
}));

jest.mock('../../middleware/auth.js', () => ({
  authenticateToken: jest.fn(() => (req, res, next) => {
    req.userId = 'test-user-id';
    next();
  })
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

      // Mock findUserByHealingName to return a user
      const mockUser = { id: 'user-123', healingName: 'TestHealer' };
      findUserByHealingName.mockResolvedValue(mockUser);

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

      // Check that findUserByHealingName was called
      expect(findUserByHealingName).toHaveBeenCalledWith('TestHealer');

      // Check that saveReflection was called with the correct parameters
      expect(saveReflection).toHaveBeenCalledWith({
        healingName: 'TestHealer',
        reflectionText: 'This is a test reflection',
        journeyDay: 'Day 7',
        emailConsent: true,
        userId: mockUser.id
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
        emailConsent: false,
        userId: undefined
      });
    });
  });

  describe('POST /api/reflection/secure', () => {
    test('successfully saves an authenticated reflection', async () => {
      // Mock the saveReflection function to return a successful response
      const mockReflection = {
        id: 'rec123',
        healingName: 'TestHealer',
        journeyDay: 'Day 7',
        timestamp: new Date().toISOString(),
        success: true
      };

      saveReflection.mockResolvedValue(mockReflection);

      // Make the request with authentication
      const response = await request(app)
        .post('/api/reflection/secure')
        .set('Authorization', 'Bearer test-token')
        .send({
          healingName: 'TestHealer',
          content: 'This is a secure test reflection',
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

      // Check that authenticateToken middleware was used
      expect(authenticateToken).toHaveBeenCalled();

      // Check that saveReflection was called with the correct parameters including userId from token
      expect(saveReflection).toHaveBeenCalledWith({
        healingName: 'TestHealer',
        reflectionText: 'This is a secure test reflection',
        journeyDay: 'Day 7',
        emailConsent: true,
        userId: 'test-user-id'
      });
    });
  });

  describe('GET /api/reflection', () => {
    test('successfully retrieves reflections by healing name', async () => {
      // Mock findUserByHealingName to return a user
      const mockUser = { id: 'user-123', healingName: 'TestHealer' };
      findUserByHealingName.mockResolvedValue(mockUser);

      // Mock getReflectionsByHealingName to return reflections
      const mockReflections = [
        {
          id: 'rec123',
          healingName: 'TestHealer',
          reflectionText: 'Reflection 1',
          journeyDay: 'Day 7',
          timestamp: new Date().toISOString()
        },
        {
          id: 'rec456',
          healingName: 'TestHealer',
          reflectionText: 'Reflection 2',
          journeyDay: 'Day 14',
          timestamp: new Date().toISOString()
        }
      ];
      getReflectionsByHealingName.mockResolvedValue(mockReflections);

      // Make the request
      const response = await request(app)
        .get('/api/reflection')
        .query({ healingName: 'TestHealer' });

      // Check the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: { reflections: mockReflections },
        timestamp: expect.any(String),
        status: 200
      });

      // Check that findUserByHealingName was called
      expect(findUserByHealingName).toHaveBeenCalledWith('TestHealer');

      // Check that getReflectionsByHealingName was called
      expect(getReflectionsByHealingName).toHaveBeenCalledWith('TestHealer');
    });

    test('returns empty array when user not found', async () => {
      // Mock findUserByHealingName to return null (user not found)
      findUserByHealingName.mockResolvedValue(null);

      // Make the request
      const response = await request(app)
        .get('/api/reflection')
        .query({ healingName: 'NonExistentUser' });

      // Check the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: { reflections: [] },
        timestamp: expect.any(String),
        status: 200
      });

      // Check that getReflectionsByHealingName was not called
      expect(getReflectionsByHealingName).not.toHaveBeenCalled();
    });

    test('returns 400 when healing name is not provided', async () => {
      // Make the request without healing name
      const response = await request(app)
        .get('/api/reflection');

      // Check the response
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Healing name is required',
        timestamp: expect.any(String),
        status: 400
      });
    });
  });
});
