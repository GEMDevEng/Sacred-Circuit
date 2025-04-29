import { verifyTypeformSignature, rateLimit } from '../../middleware/security.js';
import { sendErrorResponse } from '../../utils/response-utils.js';
import crypto from 'crypto';

// Mock dependencies
jest.mock('../../utils/response-utils.js', () => ({
  sendErrorResponse: jest.fn()
}));

// Mock environment variables
const originalEnv = process.env;

describe('Security Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock request, response, and next
    req = {
      headers: {},
      body: {},
      ip: '127.0.0.1',
      connection: { remoteAddress: '127.0.0.1' }
    };
    res = {};
    next = jest.fn();
    
    // Reset environment
    process.env = { ...originalEnv };
  });
  
  afterAll(() => {
    // Restore environment
    process.env = originalEnv;
  });

  describe('verifyTypeformSignature', () => {
    test('calls next() when signature is valid', () => {
      // Set up test data
      const secret = 'test-secret';
      const body = { test: 'data' };
      const rawBody = JSON.stringify(body);
      
      // Calculate expected signature
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(rawBody);
      const signature = 'sha256=' + hmac.digest('hex');
      
      // Set up request
      req.headers['typeform-signature'] = signature;
      req.body = body;
      
      // Create middleware
      const middleware = verifyTypeformSignature({ secret });
      
      // Call middleware
      middleware(req, res, next);
      
      // Check that next was called
      expect(next).toHaveBeenCalled();
      expect(sendErrorResponse).not.toHaveBeenCalled();
    });
    
    test('sends error response when signature is missing', () => {
      // Set up test data
      const secret = 'test-secret';
      
      // Create middleware
      const middleware = verifyTypeformSignature({ secret });
      
      // Call middleware
      middleware(req, res, next);
      
      // Check that error response was sent
      expect(next).not.toHaveBeenCalled();
      expect(sendErrorResponse).toHaveBeenCalledWith(
        res,
        'Webhook verification failed: Missing signature',
        401
      );
    });
    
    test('sends error response when signature is invalid', () => {
      // Set up test data
      const secret = 'test-secret';
      const body = { test: 'data' };
      
      // Set up request with invalid signature
      req.headers['typeform-signature'] = 'invalid-signature';
      req.body = body;
      
      // Create middleware
      const middleware = verifyTypeformSignature({ secret });
      
      // Call middleware
      middleware(req, res, next);
      
      // Check that error response was sent
      expect(next).not.toHaveBeenCalled();
      expect(sendErrorResponse).toHaveBeenCalledWith(
        res,
        'Webhook verification failed: Invalid signature',
        401
      );
    });
    
    test('skips verification in development when no secret is provided', () => {
      // Set NODE_ENV to development
      process.env.NODE_ENV = 'development';
      
      // Create middleware with no secret
      const middleware = verifyTypeformSignature();
      
      // Call middleware
      middleware(req, res, next);
      
      // Check that next was called
      expect(next).toHaveBeenCalled();
      expect(sendErrorResponse).not.toHaveBeenCalled();
    });
    
    test('sends error response in production when no secret is provided', () => {
      // Set NODE_ENV to production
      process.env.NODE_ENV = 'production';
      
      // Create middleware with no secret
      const middleware = verifyTypeformSignature();
      
      // Call middleware
      middleware(req, res, next);
      
      // Check that error response was sent
      expect(next).not.toHaveBeenCalled();
      expect(sendErrorResponse).toHaveBeenCalledWith(
        res,
        'Webhook verification failed: Secret not configured',
        500
      );
    });
    
    test('uses custom header name when provided', () => {
      // Set up test data
      const secret = 'test-secret';
      const headerName = 'custom-signature';
      const body = { test: 'data' };
      const rawBody = JSON.stringify(body);
      
      // Calculate expected signature
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(rawBody);
      const signature = 'sha256=' + hmac.digest('hex');
      
      // Set up request with custom header
      req.headers[headerName] = signature;
      req.body = body;
      
      // Create middleware with custom header name
      const middleware = verifyTypeformSignature({ headerName, secret });
      
      // Call middleware
      middleware(req, res, next);
      
      // Check that next was called
      expect(next).toHaveBeenCalled();
      expect(sendErrorResponse).not.toHaveBeenCalled();
    });
  });
  
  describe('rateLimit', () => {
    test('calls next() when under rate limit', () => {
      // Create middleware
      const middleware = rateLimit({ maxRequests: 5 });
      
      // Call middleware multiple times
      for (let i = 0; i < 5; i++) {
        middleware(req, res, next);
      }
      
      // Check that next was called each time
      expect(next).toHaveBeenCalledTimes(5);
      expect(sendErrorResponse).not.toHaveBeenCalled();
    });
    
    test('sends error response when rate limit exceeded', () => {
      // Create middleware with low limit
      const middleware = rateLimit({ maxRequests: 3 });
      
      // Call middleware multiple times
      for (let i = 0; i < 3; i++) {
        middleware(req, res, next);
      }
      
      // Call one more time to exceed limit
      middleware(req, res, next);
      
      // Check that next was called only for the first 3 requests
      expect(next).toHaveBeenCalledTimes(3);
      expect(sendErrorResponse).toHaveBeenCalledWith(
        res,
        'Too many requests, please try again later',
        429
      );
    });
    
    test('resets rate limit after window expires', () => {
      // Mock Date.now to control time
      const originalNow = Date.now;
      const mockNow = jest.fn();
      Date.now = mockNow;
      
      // Set initial time
      mockNow.mockReturnValue(1000);
      
      // Create middleware with short window
      const middleware = rateLimit({ windowMs: 100, maxRequests: 2 });
      
      // Call middleware twice to reach limit
      middleware(req, res, next);
      middleware(req, res, next);
      
      // Advance time beyond window
      mockNow.mockReturnValue(1200);
      
      // Call middleware again
      middleware(req, res, next);
      
      // Check that next was called for all 3 requests
      expect(next).toHaveBeenCalledTimes(3);
      expect(sendErrorResponse).not.toHaveBeenCalled();
      
      // Restore Date.now
      Date.now = originalNow;
    });
    
    test('uses fallback IP when req.ip is not available', () => {
      // Remove req.ip
      delete req.ip;
      
      // Create middleware
      const middleware = rateLimit({ maxRequests: 2 });
      
      // Call middleware twice to reach limit
      middleware(req, res, next);
      middleware(req, res, next);
      
      // Call one more time to exceed limit
      middleware(req, res, next);
      
      // Check that next was called only for the first 2 requests
      expect(next).toHaveBeenCalledTimes(2);
      expect(sendErrorResponse).toHaveBeenCalled();
    });
  });
});
