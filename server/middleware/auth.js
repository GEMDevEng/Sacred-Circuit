import { verifyAccessToken, refreshAccessToken } from '../services/authService.js';
import { sendErrorResponse } from '../utils/response-utils.js';

/**
 * Middleware to authenticate JWT token
 * Enhanced with token refresh capability and detailed error handling
 *
 * @param {Object} options - Options for the middleware
 * @param {boolean} options.allowRefresh - Whether to attempt token refresh if the token is expired
 * @returns {Function} Express middleware function
 */
export function authenticateToken(options = {}) {
  const {
    allowRefresh = true
  } = options;

  return async (req, res, next) => {
    // Get authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return sendErrorResponse(res, 'Authentication required', 401);
    }

    try {
      // Verify token
      const decoded = verifyAccessToken(token);

      // Add user ID and token info to request
      req.userId = decoded.userId;
      req.tokenExp = decoded.exp;
      req.tokenIat = decoded.iat;

      // Check if token is about to expire (less than 5 minutes remaining)
      const now = Math.floor(Date.now() / 1000);
      const timeRemaining = decoded.exp - now;

      if (timeRemaining < 300 && allowRefresh) {
        // Token is about to expire, set header to indicate refresh is needed
        res.setHeader('X-Token-Expiring', 'true');
      }

      next();
    } catch (error) {
      // Handle different token errors
      if (error.name === 'TokenExpiredError' && allowRefresh) {
        try {
          // Try to refresh the token using the refresh token in cookies
          const refreshToken = req.cookies.refreshToken;

          if (refreshToken) {
            const { token: newToken, decoded } = await refreshAccessToken(refreshToken);

            // Add user ID to request
            req.userId = decoded.userId;
            req.tokenExp = decoded.exp;
            req.tokenIat = decoded.iat;

            // Set header with new token
            res.setHeader('X-New-Access-Token', newToken);

            // Continue with the request
            return next();
          }
        } catch (refreshError) {
          console.error('Token refresh error:', refreshError.message);
          // Continue to error response
        }
      }

      // Determine the appropriate error message
      let errorMessage = 'Invalid token';
      let statusCode = 401;

      if (error.name === 'TokenExpiredError') {
        errorMessage = 'Token expired';
      } else if (error.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token format';
      } else if (error.name === 'NotBeforeError') {
        errorMessage = 'Token not yet valid';
      }

      console.error('Authentication error:', {
        message: error.message,
        type: error.name,
        path: req.path,
        method: req.method,
        ip: req.ip
      });

      return sendErrorResponse(res, errorMessage, statusCode);
    }
  };
}

/**
 * Middleware to check if user has required role
 * Enhanced with detailed error handling and caching
 *
 * @param {string|string[]} roles - Single role or array of allowed roles
 * @returns {Function} Express middleware function
 */
export function authorizeRoles(roles) {
  // Convert single role to array
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  // Simple in-memory cache for user roles to reduce database queries
  const userRoleCache = new Map();

  // Cache expiration time (5 minutes)
  const CACHE_TTL = 5 * 60 * 1000;

  return async (req, res, next) => {
    try {
      // Get user ID from request (set by authenticateToken middleware)
      const userId = req.userId;

      if (!userId) {
        return sendErrorResponse(res, 'Authentication required', 401);
      }

      let user;

      // Check if user role is in cache
      const cachedUser = userRoleCache.get(userId);
      const now = Date.now();

      if (cachedUser && (now - cachedUser.timestamp) < CACHE_TTL) {
        // Use cached user data
        user = cachedUser.user;
      } else {
        // Get user from database
        const { getUserById } = await import('../services/authService.js');
        user = await getUserById(userId);

        if (user) {
          // Cache user data
          userRoleCache.set(userId, {
            user,
            timestamp: now
          });
        }
      }

      if (!user) {
        return sendErrorResponse(res, 'User not found', 404);
      }

      // Add user to request for convenience
      req.user = user;

      // Check if user has required role
      if (!allowedRoles.includes(user.role)) {
        // Log unauthorized access attempt
        console.warn('Unauthorized access attempt:', {
          userId,
          userRole: user.role,
          requiredRoles: allowedRoles,
          path: req.path,
          method: req.method,
          ip: req.ip
        });

        return sendErrorResponse(res, 'You do not have permission to access this resource', 403);
      }

      next();
    } catch (error) {
      console.error('Authorization error:', {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
      });

      return sendErrorResponse(res, 'Authorization failed', 500);
    }
  };
}

/**
 * Middleware to check if user is accessing their own resources
 * Ensures users can only access their own data
 *
 * @param {Function} getResourceUserId - Function to extract the resource owner's user ID from the request
 * @returns {Function} Express middleware function
 */
export function authorizeOwnership(getResourceUserId) {
  return async (req, res, next) => {
    try {
      // Get authenticated user ID
      const authenticatedUserId = req.userId;

      if (!authenticatedUserId) {
        return sendErrorResponse(res, 'Authentication required', 401);
      }

      // Get resource owner's user ID
      const resourceUserId = await getResourceUserId(req);

      if (!resourceUserId) {
        return sendErrorResponse(res, 'Resource not found', 404);
      }

      // Check if user is the owner of the resource
      if (authenticatedUserId !== resourceUserId) {
        // Log unauthorized access attempt
        console.warn('Unauthorized ownership access attempt:', {
          authenticatedUserId,
          resourceUserId,
          path: req.path,
          method: req.method,
          ip: req.ip
        });

        return sendErrorResponse(res, 'You do not have permission to access this resource', 403);
      }

      next();
    } catch (error) {
      console.error('Authorization ownership error:', {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
      });

      return sendErrorResponse(res, 'Authorization failed', 500);
    }
  };
}
