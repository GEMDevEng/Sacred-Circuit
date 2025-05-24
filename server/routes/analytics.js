import express from 'express';
import { 
  generateAnalyticsDashboard,
  getConversionFunnelAnalytics,
  getUserEngagementMetrics,
  trackConversionEvent
} from '../services/analyticsService.js';
import { validateRequest, analyticsRequestSchema } from '../middleware/validation.js';
import { rateLimit } from '../middleware/security.js';
import { sendSuccessResponse, handleAndSendError } from '../utils/response-utils.js';

const router = express.Router();

/**
 * @route GET /api/analytics/dashboard
 * @desc Get analytics dashboard data
 * @access Private (requires API key or admin auth)
 */
router.get('/dashboard',
  rateLimit({ maxRequests: 30, windowMs: 60 * 1000 }), // 30 requests per minute
  async (req, res) => {
    try {
      // Verify API key or admin authentication
      const apiKey = req.headers['x-api-key'];
      const authToken = req.headers['authorization'];
      
      if (!apiKey && !authToken) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      if (apiKey && apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(401).json({ error: 'Invalid API key' });
      }

      const { timeRange, startDate, endDate } = req.query;
      
      const options = {
        timeRange: timeRange || '30d',
        startDate: startDate || null,
        endDate: endDate || null
      };

      const dashboardData = await generateAnalyticsDashboard(options);

      return sendSuccessResponse(res, {
        message: 'Analytics dashboard data retrieved successfully',
        dashboard: dashboardData.dashboard,
        generatedAt: dashboardData.generatedAt
      });
    } catch (error) {
      console.error('Analytics dashboard error:', error);
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route GET /api/analytics/funnel
 * @desc Get conversion funnel analytics
 * @access Private
 */
router.get('/funnel',
  rateLimit({ maxRequests: 20, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      // Verify authentication
      const apiKey = req.headers['x-api-key'];
      if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { startDate, endDate, source } = req.query;
      
      const options = {
        startDate: startDate || null,
        endDate: endDate || null,
        source: source || null
      };

      const funnelData = await getConversionFunnelAnalytics(options);

      return sendSuccessResponse(res, {
        message: 'Conversion funnel analytics retrieved successfully',
        ...funnelData
      });
    } catch (error) {
      console.error('Funnel analytics error:', error);
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route GET /api/analytics/engagement
 * @desc Get user engagement metrics
 * @access Private
 */
router.get('/engagement',
  rateLimit({ maxRequests: 20, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      // Verify authentication
      const apiKey = req.headers['x-api-key'];
      if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { userId } = req.query;
      
      const options = {
        userId: userId || null
      };

      const engagementData = await getUserEngagementMetrics(options);

      return sendSuccessResponse(res, {
        message: 'User engagement metrics retrieved successfully',
        ...engagementData
      });
    } catch (error) {
      console.error('Engagement analytics error:', error);
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route POST /api/analytics/track
 * @desc Track a conversion event
 * @access Public (with rate limiting)
 */
router.post('/track',
  rateLimit({ maxRequests: 100, windowMs: 60 * 1000 }), // 100 events per minute
  async (req, res) => {
    try {
      const {
        eventType,
        userId,
        healingName,
        email,
        source,
        metadata
      } = req.body;

      // Validate required fields
      if (!eventType) {
        return res.status(400).json({ error: 'Event type is required' });
      }

      const eventData = {
        eventType,
        userId: userId || null,
        healingName: healingName || null,
        email: email || null,
        source: source || 'unknown',
        timestamp: new Date().toISOString(),
        metadata: metadata || {}
      };

      const result = await trackConversionEvent(eventData);

      return sendSuccessResponse(res, {
        message: 'Event tracked successfully',
        eventId: result.eventId,
        timestamp: result.timestamp
      });
    } catch (error) {
      console.error('Event tracking error:', error);
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route POST /api/analytics/track/form-submission
 * @desc Track form submission event
 * @access Public
 */
router.post('/track/form-submission',
  rateLimit({ maxRequests: 50, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      const formData = req.body;

      // Import the tracking function
      const { trackFormSubmission } = await import('../services/analyticsService.js');
      const result = await trackFormSubmission(formData);

      return sendSuccessResponse(res, {
        message: 'Form submission tracked successfully',
        eventId: result.eventId,
        timestamp: result.timestamp
      });
    } catch (error) {
      console.error('Form submission tracking error:', error);
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route POST /api/analytics/track/email-verification
 * @desc Track email verification event
 * @access Public
 */
router.post('/track/email-verification',
  rateLimit({ maxRequests: 50, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      const verificationData = req.body;

      const { trackEmailVerification } = await import('../services/analyticsService.js');
      const result = await trackEmailVerification(verificationData);

      return sendSuccessResponse(res, {
        message: 'Email verification tracked successfully',
        eventId: result.eventId,
        timestamp: result.timestamp
      });
    } catch (error) {
      console.error('Email verification tracking error:', error);
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route POST /api/analytics/track/chatbot-engagement
 * @desc Track chatbot engagement event
 * @access Public
 */
router.post('/track/chatbot-engagement',
  rateLimit({ maxRequests: 200, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      const engagementData = req.body;

      const { trackChatbotEngagement } = await import('../services/analyticsService.js');
      const result = await trackChatbotEngagement(engagementData);

      return sendSuccessResponse(res, {
        message: 'Chatbot engagement tracked successfully',
        eventId: result.eventId,
        timestamp: result.timestamp
      });
    } catch (error) {
      console.error('Chatbot engagement tracking error:', error);
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route POST /api/analytics/track/reflection-submission
 * @desc Track reflection submission event
 * @access Public
 */
router.post('/track/reflection-submission',
  rateLimit({ maxRequests: 50, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      const reflectionData = req.body;

      const { trackReflectionSubmission } = await import('../services/analyticsService.js');
      const result = await trackReflectionSubmission(reflectionData);

      return sendSuccessResponse(res, {
        message: 'Reflection submission tracked successfully',
        eventId: result.eventId,
        timestamp: result.timestamp
      });
    } catch (error) {
      console.error('Reflection submission tracking error:', error);
      return handleAndSendError(res, error);
    }
  }
);

/**
 * @route GET /api/analytics/health
 * @desc Health check for analytics service
 * @access Public
 */
router.get('/health',
  rateLimit({ maxRequests: 60, windowMs: 60 * 1000 }),
  async (req, res) => {
    try {
      return sendSuccessResponse(res, {
        message: 'Analytics service is healthy',
        timestamp: new Date().toISOString(),
        status: 'operational'
      });
    } catch (error) {
      return handleAndSendError(res, error);
    }
  }
);

export default router;
