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
 *
 * @param {Object} options - Options for the middleware
 * @param {number} options.windowMs - The time window in milliseconds
 * @param {number} options.maxRequests - The maximum number of requests allowed in the window
 * @returns {Function} Express middleware function
 */
export function rateLimit(options = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute
    maxRequests = 60 // 60 requests per minute
  } = options;

  // Store request counts by IP
  const requestCounts = {};

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Initialize or clean up old entries
    requestCounts[ip] = requestCounts[ip]
      ? requestCounts[ip].filter(time => now - time < windowMs)
      : [];

    // Check if rate limit exceeded
    if (requestCounts[ip].length >= maxRequests) {
      return sendErrorResponse(res, 'Too many requests, please try again later', 429);
    }

    // Add current request timestamp
    requestCounts[ip].push(now);

    // Proceed with the request
    next();
  };
}
