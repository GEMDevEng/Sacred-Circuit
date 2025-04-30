import express from 'express';
import { sendSuccessResponse } from '../utils/response.js';

const router = express.Router();

/**
 * @route GET /api/health
 * @desc Health check endpoint for the API
 * @access Public
 */
router.get('/', (req, res) => {
  return sendSuccessResponse(res, {
    status: 'ok',
    message: 'API is running',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString()
  });
});

export default router;
