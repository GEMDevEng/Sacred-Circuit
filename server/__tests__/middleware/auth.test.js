import { authenticateToken } from '../../middleware/auth.js';
import { verifyAccessToken } from '../../services/authService.js';
import { sendErrorResponse } from '../../utils/response-utils.js';

// Mock dependencies
jest.mock('../../services/authService.js', () => ({
  verifyAccessToken: jest.fn()
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
      headers: {}
    };
    res = {};
    next = jest.fn();

    // Mock sendErrorResponse to return res
    sendErrorResponse.mockImplementation(() => res);
  });

  describe('authenticateToken', () => {
    test('calls next when token is valid', () => {
      // Set up request with valid token
      req.headers.authorization = 'Bearer valid-token';

      // Mock verifyAccessToken to return decoded token
      const decodedToken = { userId: 'test-user-id' };
      verifyAccessToken.mockReturnValue(decodedToken);

      // Call middleware
      const middleware = authenticateToken();
      middleware(req, res, next);

      // Check that verifyAccessToken was called with the token
      expect(verifyAccessToken).toHaveBeenCalledWith('valid-token');

      // Check that userId was added to request
      expect(req.userId).toBe('test-user-id');

      // Check that next was called
      expect(next).toHaveBeenCalled();

      // Check that sendErrorResponse was not called
      expect(sendErrorResponse).not.toHaveBeenCalled();
    });

    test('returns 401 when authorization header is missing', () => {
      // Call middleware without authorization header
      const middleware = authenticateToken();
      middleware(req, res, next);

      // Check that sendErrorResponse was called with correct parameters
      expect(sendErrorResponse).toHaveBeenCalledWith(res, 'Authentication required', 401);

      // Check that next was not called
      expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 when token is invalid', () => {
      // Set up request with invalid token
      req.headers.authorization = 'Bearer invalid-token';

      // Mock verifyAccessToken to throw an error
      verifyAccessToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Call middleware
      const middleware = authenticateToken();
      middleware(req, res, next);

      // Check that sendErrorResponse was called with correct parameters
      expect(sendErrorResponse).toHaveBeenCalledWith(res, 'Invalid token', 401);

      // Check that next was not called
      expect(next).not.toHaveBeenCalled();
    });

    test('handles malformed authorization header', () => {
      // Set up request with malformed authorization header
      req.headers.authorization = 'malformed-header';

      // Call middleware
      const middleware = authenticateToken();
      middleware(req, res, next);

      // Check that sendErrorResponse was called with correct parameters
      expect(sendErrorResponse).toHaveBeenCalledWith(res, 'Authentication required', 401);

      // Check that next was not called
      expect(next).not.toHaveBeenCalled();
    });
  });
});
