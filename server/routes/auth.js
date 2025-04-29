import express from 'express';
import { registerUser, loginUser, refreshAccessToken, getUserById } from '../services/authService.js';
import { authenticateToken } from '../middleware/auth.js';
import { rateLimit } from '../middleware/security.js';
import { sendSuccessResponse, handleAndSendError } from '../utils/response-utils.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register',
  rateLimit({ maxRequests: 5, windowMs: 60 * 1000 }), // 5 requests per minute
  async (req, res) => {
    try {
      const { healingName, email, password } = req.body;
      
      // Validate input
      if (!healingName || !email || !password) {
        return sendErrorResponse(res, 'Please provide all required fields', 400);
      }
      
      // Register user
      const user = await registerUser({ healingName, email, password });
      
      return sendSuccessResponse(res, { user });
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login',
  rateLimit({ maxRequests: 10, windowMs: 60 * 1000 }), // 10 requests per minute
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return sendErrorResponse(res, 'Please provide email and password', 400);
      }
      
      // Login user
      const { user, accessToken, refreshToken } = await loginUser(email, password);
      
      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      
      return sendSuccessResponse(res, { user, accessToken });
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return sendErrorResponse(res, 'Refresh token required', 401);
    }
    
    // Refresh access token
    const { accessToken } = await refreshAccessToken(refreshToken);
    
    return sendSuccessResponse(res, { accessToken });
  } catch (error) {
    return handleAndSendError(res, error);
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
router.post('/logout', (req, res) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken');
  
  return sendSuccessResponse(res, { message: 'Logged out successfully' });
});

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me',
  authenticateToken(),
  async (req, res) => {
    try {
      // Get user from database
      const user = await getUserById(req.userId);
      
      if (!user) {
        return sendErrorResponse(res, 'User not found', 404);
      }
      
      return sendSuccessResponse(res, { user });
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

export default router;
