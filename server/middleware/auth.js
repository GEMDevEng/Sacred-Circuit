import { verifyAccessToken } from '../services/authService.js';
import { sendErrorResponse } from '../utils/response-utils.js';

/**
 * Middleware to authenticate JWT token
 * 
 * @returns {Function} Express middleware function
 */
export function authenticateToken() {
  return (req, res, next) => {
    // Get authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return sendErrorResponse(res, 'Authentication required', 401);
    }
    
    try {
      // Verify token
      const decoded = verifyAccessToken(token);
      
      // Add user ID to request
      req.userId = decoded.userId;
      
      next();
    } catch (error) {
      return sendErrorResponse(res, 'Invalid token', 401);
    }
  };
}

/**
 * Middleware to check if user has required role
 * 
 * @param {string[]} roles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
export function authorizeRoles(roles) {
  return (req, res, next) => {
    // Get user from request
    const { user } = req;
    
    if (!user) {
      return sendErrorResponse(res, 'Authentication required', 401);
    }
    
    // Check if user has required role
    if (!roles.includes(user.role)) {
      return sendErrorResponse(res, 'Unauthorized', 403);
    }
    
    next();
  };
}
