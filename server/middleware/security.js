import crypto from 'crypto';
import { sendErrorResponse } from '../utils/response-utils.js';

/**
 * Middleware to verify Typeform webhook signatures
 *
 * @param {Object} options - Options for the middleware
 * @param {string} options.headerName - The header name containing the signature
 * @param {string} options.secret - The secret used to sign the webhook
 * @returns {Function} Express middleware function
 */
export function verifyTypeformSignature(options = {}) {
  const {
    headerName = 'typeform-signature',
    secret = process.env.TYPEFORM_WEBHOOK_SECRET
  } = options;

  return (req, res, next) => {
    // Skip verification in development if no secret is provided
    if (process.env.NODE_ENV !== 'production' && !secret) {
      console.warn('Typeform webhook signature verification skipped in development');
      return next();
    }

    // Ensure secret is available
    if (!secret) {
      console.error('Typeform webhook secret is not configured');
      return sendErrorResponse(res, 'Webhook verification failed: Secret not configured', 500);
    }

    // Get the signature from the header
    const signature = req.headers[headerName.toLowerCase()];

    if (!signature) {
      return sendErrorResponse(res, 'Webhook verification failed: Missing signature', 401);
    }

    try {
      // Get the raw body
      const rawBody = JSON.stringify(req.body);

      // Create the HMAC
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(rawBody);
      const calculatedSignature = 'sha256=' + hmac.digest('hex');

      // Compare signatures
      if (signature !== calculatedSignature) {
        console.error('Webhook signature mismatch:', {
          received: signature,
          calculated: calculatedSignature
        });
        return sendErrorResponse(res, 'Webhook verification failed: Invalid signature', 401);
      }

      // Signature is valid, proceed
      next();
    } catch (error) {
      console.error('Webhook verification error:', error);
      return sendErrorResponse(res, 'Webhook verification failed: ' + error.message, 500);
    }
  };
}

/**
 * Middleware to add rate limiting to routes
 * Enhanced with user-based rate limiting and proper headers
 *
 * @param {Object} options - Options for the middleware
 * @param {number} options.windowMs - The time window in milliseconds
 * @param {number} options.maxRequests - The maximum number of requests allowed in the window
 * @param {number} options.maxRequestsAuthenticated - The maximum number of requests allowed for authenticated users
 * @returns {Function} Express middleware function
 */
export function rateLimit(options = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute
    maxRequests = 60, // 60 requests per minute for anonymous users
    maxRequestsAuthenticated = 120 // 120 requests per minute for authenticated users
  } = options;

  // Store request counts by IP and user ID
  const requestCounts = {
    ip: {}, // IP-based tracking
    user: {} // User-based tracking
  };

  // Clean up old entries periodically to prevent memory leaks
  setInterval(() => {
    const now = Date.now();

    // Clean up IP-based entries
    Object.keys(requestCounts.ip).forEach(ip => {
      requestCounts.ip[ip] = requestCounts.ip[ip].filter(time => now - time < windowMs);
      if (requestCounts.ip[ip].length === 0) {
        delete requestCounts.ip[ip];
      }
    });

    // Clean up user-based entries
    Object.keys(requestCounts.user).forEach(userId => {
      requestCounts.user[userId] = requestCounts.user[userId].filter(time => now - time < windowMs);
      if (requestCounts.user[userId].length === 0) {
        delete requestCounts.user[userId];
      }
    });
  }, windowMs);

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const userId = req.userId; // From auth middleware
    const now = Date.now();

    // Track requests by IP
    if (!requestCounts.ip[ip]) {
      requestCounts.ip[ip] = [];
    }

    // Clean up old entries for this IP
    requestCounts.ip[ip] = requestCounts.ip[ip].filter(time => now - time < windowMs);

    // For authenticated users, also track by user ID
    if (userId) {
      if (!requestCounts.user[userId]) {
        requestCounts.user[userId] = [];
      }

      // Clean up old entries for this user
      requestCounts.user[userId] = requestCounts.user[userId].filter(time => now - time < windowMs);

      // Check if user-based rate limit exceeded
      if (requestCounts.user[userId].length >= maxRequestsAuthenticated) {
        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', maxRequestsAuthenticated);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
        res.setHeader('Retry-After', Math.ceil(windowMs / 1000));

        return sendErrorResponse(res, 'Too many requests, please try again later', 429);
      }

      // Add current request timestamp to user tracking
      requestCounts.user[userId].push(now);
    }

    // Check if IP-based rate limit exceeded
    if (requestCounts.ip[ip].length >= maxRequests) {
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));

      return sendErrorResponse(res, 'Too many requests, please try again later', 429);
    }

    // Add current request timestamp to IP tracking
    requestCounts.ip[ip].push(now);

    // Set rate limit headers for successful requests
    if (userId) {
      res.setHeader('X-RateLimit-Limit', maxRequestsAuthenticated);
      res.setHeader('X-RateLimit-Remaining', maxRequestsAuthenticated - requestCounts.user[userId].length);
    } else {
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - requestCounts.ip[ip].length);
    }
    res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

    // Proceed with the request
    next();
  };
}

/**
 * Middleware to add security headers to responses
 *
 * @returns {Function} Express middleware function
 */
export function securityHeaders() {
  return (req, res, next) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' https://cdn.vercel-insights.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self'; " +
        "connect-src 'self' https://api.openai.com https://api.airtable.com https://vitals.vercel-insights.com; " +
        "frame-ancestors 'none';"
      );
    }

    next();
  };
}
