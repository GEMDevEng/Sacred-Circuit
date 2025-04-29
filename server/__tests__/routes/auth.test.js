import request from 'supertest';
import express from 'express';
import authRouter from '../../routes/auth.js';
import { registerUser, loginUser, refreshAccessToken, getUserById } from '../../services/authService.js';
import { validateRequest } from '../../middleware/validation.js';
import { rateLimit } from '../../middleware/security.js';

// Mock dependencies
jest.mock('../../services/authService.js', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  refreshAccessToken: jest.fn(),
  getUserById: jest.fn()
}));

jest.mock('../../middleware/validation.js', () => ({
  validateRequest: jest.fn(() => (req, res, next) => next())
}));

jest.mock('../../middleware/security.js', () => ({
  rateLimit: jest.fn(() => (req, res, next) => next())
}));

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    test('successfully registers a new user', async () => {
      // Mock the registerUser function to return a successful response
      const mockUser = {
        id: 'user-123',
        healingName: 'TestHealer',
        email: 'test@example.com',
        role: 'user'
      };
      
      registerUser.mockResolvedValue(mockUser);
      
      // Make the request
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          healingName: 'TestHealer',
          email: 'test@example.com',
          password: 'Password123!'
        });
      
      // Check the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: { user: mockUser },
        timestamp: expect.any(String),
        status: 200
      });
      
      // Check that registerUser was called with the correct parameters
      expect(registerUser).toHaveBeenCalledWith({
        healingName: 'TestHealer',
        email: 'test@example.com',
        password: 'Password123!'
      });
      
      // Check that rateLimit was used as middleware
      expect(rateLimit).toHaveBeenCalled();
    });
    
    test('returns 400 when required fields are missing', async () => {
      // Make the request with missing fields
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
          // healingName is missing
        });
      
      // Check the response
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Please provide all required fields',
        timestamp: expect.any(String),
        status: 400
      });
      
      // Check that registerUser was not called
      expect(registerUser).not.toHaveBeenCalled();
    });
    
    test('handles errors from registerUser', async () => {
      // Mock the registerUser function to throw an error
      registerUser.mockRejectedValue(new Error('Email already exists'));
      
      // Make the request
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          healingName: 'TestHealer',
          email: 'test@example.com',
          password: 'Password123!'
        });
      
      // Check the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Email already exists',
        timestamp: expect.any(String),
        status: 500
      });
    });
  });

  describe('POST /api/auth/login', () => {
    test('successfully logs in a user', async () => {
      // Mock the loginUser function to return a successful response
      const mockResponse = {
        user: {
          id: 'user-123',
          healingName: 'TestHealer',
          email: 'test@example.com',
          role: 'user'
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      };
      
      loginUser.mockResolvedValue(mockResponse);
      
      // Make the request
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });
      
      // Check the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: {
          user: mockResponse.user,
          accessToken: mockResponse.accessToken
        },
        timestamp: expect.any(String),
        status: 200
      });
      
      // Check that loginUser was called with the correct parameters
      expect(loginUser).toHaveBeenCalledWith('test@example.com', 'Password123!');
      
      // Check that rateLimit was used as middleware
      expect(rateLimit).toHaveBeenCalled();
    });
    
    test('returns 400 when required fields are missing', async () => {
      // Make the request with missing fields
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
          // password is missing
        });
      
      // Check the response
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Please provide email and password',
        timestamp: expect.any(String),
        status: 400
      });
      
      // Check that loginUser was not called
      expect(loginUser).not.toHaveBeenCalled();
    });
    
    test('handles errors from loginUser', async () => {
      // Mock the loginUser function to throw an error
      loginUser.mockRejectedValue(new Error('Invalid credentials'));
      
      // Make the request
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword'
        });
      
      // Check the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid credentials',
        timestamp: expect.any(String),
        status: 500
      });
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('successfully refreshes access token', async () => {
      // Mock the refreshAccessToken function to return a successful response
      const mockResponse = {
        accessToken: 'new-access-token'
      };
      
      refreshAccessToken.mockResolvedValue(mockResponse);
      
      // Mock the request with a refresh token in cookies
      app.use((req, res, next) => {
        req.cookies = { refreshToken: 'valid-refresh-token' };
        next();
      });
      
      // Make the request
      const response = await request(app)
        .post('/api/auth/refresh');
      
      // Check the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: { accessToken: 'new-access-token' },
        timestamp: expect.any(String),
        status: 200
      });
      
      // Check that refreshAccessToken was called with the correct parameters
      expect(refreshAccessToken).toHaveBeenCalledWith('valid-refresh-token');
    });
    
    test('returns 401 when refresh token is missing', async () => {
      // Mock the request without a refresh token in cookies
      app.use((req, res, next) => {
        req.cookies = {};
        next();
      });
      
      // Make the request
      const response = await request(app)
        .post('/api/auth/refresh');
      
      // Check the response
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: 'Refresh token required',
        timestamp: expect.any(String),
        status: 401
      });
      
      // Check that refreshAccessToken was not called
      expect(refreshAccessToken).not.toHaveBeenCalled();
    });
    
    test('handles errors from refreshAccessToken', async () => {
      // Mock the refreshAccessToken function to throw an error
      refreshAccessToken.mockRejectedValue(new Error('Invalid refresh token'));
      
      // Mock the request with a refresh token in cookies
      app.use((req, res, next) => {
        req.cookies = { refreshToken: 'invalid-refresh-token' };
        next();
      });
      
      // Make the request
      const response = await request(app)
        .post('/api/auth/refresh');
      
      // Check the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid refresh token',
        timestamp: expect.any(String),
        status: 500
      });
    });
  });
});
