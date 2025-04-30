import { authenticateToken, authorizeRoles, authorizeOwnership } from '../../middleware/auth.js';
import { verifyAccessToken, refreshAccessToken } from '../../services/authService.js';
import { sendErrorResponse } from '../../utils/response-utils.js';

// Mock dependencies
jest.mock('../../services/authService.js', () => ({
  verifyAccessToken: jest.fn(),
  refreshAccessToken: jest.fn(),
  getUserById: jest.fn()
}));

jest.mock('../../utils/response-utils.js', () => ({
  sendErrorResponse: jest.fn()
}));

describe('Authentication Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up request, response, and next function
    req = {
      headers: {},
      cookies: {},
      path: '/test',
      method: 'GET',
      ip: '127.0.0.1'
    };
    res = {
      setHeader: jest.fn()
    };
    next = jest.fn();

    // Mock sendErrorResponse to return res
    sendErrorResponse.mockImplementation(() => res);
  });

  describe('authenticateToken', () => {
    test('calls next when token is valid', async () => {
      // Set up request with valid token
      req.headers.authorization = 'Bearer valid-token';

      // Mock verifyAccessToken to return decoded token
      const decodedToken = {
        userId: 'test-user-id',
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        iat: Math.floor(Date.now() / 1000) - 60 // 1 minute ago
      };
      verifyAccessToken.mockReturnValue(decodedToken);

      // Call middleware
      const middleware = authenticateToken();
      await middleware(req, res, next);

      // Check that verifyAccessToken was called with the token
      expect(verifyAccessToken).toHaveBeenCalledWith('valid-token');

      // Check that userId was added to request
      expect(req.userId).toBe('test-user-id');

      // Check that next was called
      expect(next).toHaveBeenCalled();

      // Check that sendErrorResponse was not called
      expect(sendErrorResponse).not.toHaveBeenCalled();
    });

    test('returns 401 when authorization header is missing', async () => {
      // Call middleware without authorization header
      const middleware = authenticateToken();
      await middleware(req, res, next);

      // Check that sendErrorResponse was called with correct parameters
      expect(sendErrorResponse).toHaveBeenCalledWith(res, 'Authentication required', 401);

      // Check that next was not called
      expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 when token is invalid', async () => {
      // Set up request with invalid token
      req.headers.authorization = 'Bearer invalid-token';

      // Mock verifyAccessToken to throw an error
      verifyAccessToken.mockImplementation(() => {
        const error = new Error('Invalid token');
        error.name = 'JsonWebTokenError';
        throw error;
      });

      // Call middleware
      const middleware = authenticateToken();
      await middleware(req, res, next);

      // Check that sendErrorResponse was called with correct parameters
      expect(sendErrorResponse).toHaveBeenCalledWith(res, 'Invalid token format', 401);

      // Check that next was not called
      expect(next).not.toHaveBeenCalled();
    });

    test('handles malformed authorization header', async () => {
      // Set up request with malformed authorization header
      req.headers.authorization = 'malformed-header';

      // Call middleware
      const middleware = authenticateToken();
      await middleware(req, res, next);

      // Check that sendErrorResponse was called with correct parameters
      expect(sendErrorResponse).toHaveBeenCalledWith(res, 'Authentication required', 401);

      // Check that next was not called
      expect(next).not.toHaveBeenCalled();
    });

    test('sets X-Token-Expiring header if token is about to expire', async () => {
      // Set up request with token that will expire soon
      req.headers.authorization = 'Bearer expiring-token';

      // Mock verifyAccessToken to return decoded token with near expiration
      const decodedToken = {
        userId: 'test-user-id',
        exp: Math.floor(Date.now() / 1000) + 200, // 200 seconds from now (less than 5 minutes)
        iat: Math.floor(Date.now() / 1000) - 60 // 1 minute ago
      };
      verifyAccessToken.mockReturnValue(decodedToken);

      // Call middleware
      const middleware = authenticateToken();
      await middleware(req, res, next);

      // Check that X-Token-Expiring header was set
      expect(res.setHeader).toHaveBeenCalledWith('X-Token-Expiring', 'true');

      // Check that next was called
      expect(next).toHaveBeenCalled();
    });

    test('refreshes token if expired and refresh token is available', async () => {
      // Set up request with expired token and refresh token
      req.headers.authorization = 'Bearer expired-token';
      req.cookies.refreshToken = 'valid-refresh-token';

      // Mock verifyAccessToken to throw token expired error
      verifyAccessToken.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      // Mock refreshAccessToken to return new token
      refreshAccessToken.mockResolvedValue({
        token: 'new-token',
        decoded: {
          userId: 'test-user-id',
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000)
        }
      });

      // Call middleware
      const middleware = authenticateToken();
      await middleware(req, res, next);

      // Check that refreshAccessToken was called with refresh token
      expect(refreshAccessToken).toHaveBeenCalledWith('valid-refresh-token');

      // Check that X-New-Access-Token header was set
      expect(res.setHeader).toHaveBeenCalledWith('X-New-Access-Token', 'new-token');

      // Check that userId was added to request
      expect(req.userId).toBe('test-user-id');

      // Check that next was called
      expect(next).toHaveBeenCalled();
    });

    test('returns 401 when token is expired and no refresh token is available', async () => {
      // Set up request with expired token and no refresh token
      req.headers.authorization = 'Bearer expired-token';

      // Mock verifyAccessToken to throw token expired error
      verifyAccessToken.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      // Call middleware
      const middleware = authenticateToken();
      await middleware(req, res, next);

      // Check that sendErrorResponse was called with correct parameters
      expect(sendErrorResponse).toHaveBeenCalledWith(res, 'Token expired', 401);

      // Check that next was not called
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorizeRoles', () => {
    // Import getUserById dynamically
    let getUserById;

    beforeEach(() => {
      // Setup for authorizeRoles tests
      req.userId = 'user-123';

      // Mock getUserById function
      getUserById = jest.fn();

      // Mock dynamic import
      jest.mock('../../services/authService.js', () => ({
        getUserById
      }));
    });

    test('calls next if user has required role', async () => {
      // Setup
      const user = { id: 'user-123', role: 'admin' };
      getUserById.mockResolvedValue(user);

      // Execute
      const middleware = authorizeRoles(['admin', 'superadmin']);
      await middleware(req, res, next);

      // Verify
      expect(req.user).toEqual(user);
      expect(next).toHaveBeenCalled();
    });

    test('returns 403 if user does not have required role', async () => {
      // Setup
      const user = { id: 'user-123', role: 'user' };
      getUserById.mockResolvedValue(user);

      // Execute
      const middleware = authorizeRoles(['admin']);
      await middleware(req, res, next);

      // Verify
      expect(sendErrorResponse).toHaveBeenCalledWith(
        res,
        'You do not have permission to access this resource',
        403
      );
      expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 if no user ID is provided', async () => {
      // Setup
      req.userId = undefined;

      // Execute
      const middleware = authorizeRoles(['admin']);
      await middleware(req, res, next);

      // Verify
      expect(sendErrorResponse).toHaveBeenCalledWith(res, 'Authentication required', 401);
      expect(next).not.toHaveBeenCalled();
    });

    test('returns 404 if user is not found', async () => {
      // Setup
      getUserById.mockResolvedValue(null);

      // Execute
      const middleware = authorizeRoles(['admin']);
      await middleware(req, res, next);

      // Verify
      expect(sendErrorResponse).toHaveBeenCalledWith(res, 'User not found', 404);
      expect(next).not.toHaveBeenCalled();
    });

    test('caches user role for subsequent requests', async () => {
      // Setup
      const user = { id: 'user-123', role: 'admin' };
      getUserById.mockResolvedValue(user);

      // Execute first request
      const middleware = authorizeRoles(['admin']);
      await middleware(req, res, next);

      // Reset mocks
      getUserById.mockClear();
      next.mockClear();

      // Execute second request
      await middleware(req, res, next);

      // Verify
      expect(getUserById).not.toHaveBeenCalled(); // Should use cached value
      expect(next).toHaveBeenCalled();
    });
  });

  describe('authorizeOwnership', () => {
    beforeEach(() => {
      // Setup for authorizeOwnership tests
      req.userId = 'user-123';
    });

    test('calls next if user is the owner of the resource', async () => {
      // Setup
      const getResourceUserId = jest.fn().mockResolvedValue('user-123');

      // Execute
      const middleware = authorizeOwnership(getResourceUserId);
      await middleware(req, res, next);

      // Verify
      expect(getResourceUserId).toHaveBeenCalledWith(req);
      expect(next).toHaveBeenCalled();
    });

    test('returns 403 if user is not the owner of the resource', async () => {
      // Setup
      const getResourceUserId = jest.fn().mockResolvedValue('user-456');

      // Execute
      const middleware = authorizeOwnership(getResourceUserId);
      await middleware(req, res, next);

      // Verify
      expect(sendErrorResponse).toHaveBeenCalledWith(
        res,
        'You do not have permission to access this resource',
        403
      );
      expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 if no user ID is provided', async () => {
      // Setup
      req.userId = undefined;
      const getResourceUserId = jest.fn();

      // Execute
      const middleware = authorizeOwnership(getResourceUserId);
      await middleware(req, res, next);

      // Verify
      expect(sendErrorResponse).toHaveBeenCalledWith(res, 'Authentication required', 401);
      expect(getResourceUserId).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test('returns 404 if resource is not found', async () => {
      // Setup
      const getResourceUserId = jest.fn().mockResolvedValue(null);

      // Execute
      const middleware = authorizeOwnership(getResourceUserId);
      await middleware(req, res, next);

      // Verify
      expect(sendErrorResponse).toHaveBeenCalledWith(res, 'Resource not found', 404);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
