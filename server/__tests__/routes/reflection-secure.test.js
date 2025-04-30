import request from 'supertest';
import express from 'express';
import reflectionRouter from '../../routes/reflection.js';
import { saveReflection, findUserByHealingName, getReflectionsByHealingName, getReflectionsByUserId } from '../../services/airtableService.js';
import { validateRequest } from '../../middleware/validation.js';
import { authenticateToken } from '../../middleware/auth.js';

// Mock dependencies
jest.mock('../../services/airtableService.js', () => ({
  saveReflection: jest.fn(),
  findUserByHealingName: jest.fn(),
  getReflectionsByHealingName: jest.fn(),
  getReflectionsByUserId: jest.fn()
}));

jest.mock('../../middleware/validation.js', () => ({
  validateRequest: jest.fn(() => (req, res, next) => next()),
  reflectionRequestSchema: {}
}));

jest.mock('../../middleware/auth.js', () => ({
  authenticateToken: jest.fn(() => (req, res, next) => {
    req.userId = 'user-123'; // Mock authenticated user ID
    next();
  })
}));

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/reflection', reflectionRouter);

describe('Secure Reflection Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/reflection/secure', () => {
    test('successfully saves a reflection with authentication', async () => {
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
        .post('/api/reflection/secure')
        .send({
          healingName: 'TestHealer',
          content: 'This is a test reflection',
          milestone: 'Day 7',
          emailConsent: true
        });

      // Check the response
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockReflection);

      // Check that saveReflection was called with the correct parameters
      expect(saveReflection).toHaveBeenCalledWith({
        healingName: 'TestHealer',
        reflectionText: 'This is a test reflection',
        journeyDay: 'Day 7',
        emailConsent: true,
        userId: 'user-123' // Should use the authenticated user ID
      });
    });
  });

  describe('GET /api/reflection/secure', () => {
    test('successfully retrieves reflections for authenticated user with healing name', async () => {
      // Mock findUserByHealingName to return a user
      const mockUser = { id: 'user-123', healingName: 'TestHealer' };
      findUserByHealingName.mockResolvedValue(mockUser);

      // Mock getReflectionsByHealingName to return reflections
      const mockReflections = [
        {
          id: 'rec123',
          healingName: 'TestHealer',
          content: 'Reflection 1',
          journeyDay: 'Day 7',
          createdAt: new Date().toISOString()
        },
        {
          id: 'rec456',
          healingName: 'TestHealer',
          content: 'Reflection 2',
          journeyDay: 'Day 14',
          createdAt: new Date().toISOString()
        }
      ];
      getReflectionsByHealingName.mockResolvedValue(mockReflections);

      // Make the request
      const response = await request(app)
        .get('/api/reflection/secure')
        .query({ healingName: 'TestHealer' });

      // Check the response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({ reflections: mockReflections });

      // Check that findUserByHealingName was called
      expect(findUserByHealingName).toHaveBeenCalledWith('TestHealer');

      // Check that getReflectionsByHealingName was called
      expect(getReflectionsByHealingName).toHaveBeenCalledWith('TestHealer');
    });

    test('successfully retrieves reflections for authenticated user without healing name', async () => {
      // Mock getReflectionsByUserId to return reflections
      const mockReflections = [
        {
          id: 'rec123',
          healingName: 'TestHealer',
          content: 'Reflection 1',
          journeyDay: 'Day 7',
          createdAt: new Date().toISOString()
        },
        {
          id: 'rec456',
          healingName: 'TestHealer',
          content: 'Reflection 2',
          journeyDay: 'Day 14',
          createdAt: new Date().toISOString()
        }
      ];
      getReflectionsByUserId.mockResolvedValue(mockReflections);

      // Make the request
      const response = await request(app)
        .get('/api/reflection/secure');

      // Check the response
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({ reflections: mockReflections });

      // Check that getReflectionsByUserId was called
      expect(getReflectionsByUserId).toHaveBeenCalledWith('user-123');
    });

    test('returns 403 when trying to access reflections for another user', async () => {
      // Mock findUserByHealingName to return a different user
      const mockUser = { id: 'different-user', healingName: 'OtherHealer' };
      findUserByHealingName.mockResolvedValue(mockUser);

      // Make the request
      const response = await request(app)
        .get('/api/reflection/secure')
        .query({ healingName: 'OtherHealer' });

      // Check the response
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Unauthorized access to reflections');
    });
  });
});
