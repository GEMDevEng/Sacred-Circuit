import csrf from 'csurf';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response-utils.js';

/**
 * Create CSRF protection middleware with enhanced security
 * - Uses cookie-based CSRF protection
 * - Sets secure cookie options in production
 * - Implements token rotation
 */
const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 // 1 hour expiration for CSRF tokens
  }
});

/**
 * Middleware to handle CSRF errors
 * Provides detailed error handling for CSRF token validation failures
 */
export function handleCsrfError(err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }

  // Log the error with request details for security monitoring
  console.error('CSRF token validation failed', {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  // Return a 403 Forbidden response
  return sendErrorResponse(res, 'Invalid or expired security token', 403);
}

/**
 * Middleware to get a new CSRF token
 * Returns a JSON response with the CSRF token
 */
export function getCsrfToken(req, res) {
  // Generate a new CSRF token
  const token = req.csrfToken();

  // Return the token in the response
  return sendSuccessResponse(res, {
    csrfToken: token,
    expires: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
  });
}

/**
 * Middleware to refresh CSRF token
 * Can be used to implement token rotation for enhanced security
 */
export function refreshCsrfToken(req, res, next) {
  // Only refresh for authenticated users on sensitive operations
  if (req.userId) {
    // Generate a new CSRF token
    req.csrfToken();
  }
  next();
}

export default csrfProtection;
