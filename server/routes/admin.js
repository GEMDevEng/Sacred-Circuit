import express from 'express';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response-utils.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { getAllFeedback, updateFeedbackStatus } from '../services/feedbackService.js';
import { getAdminStats } from '../services/adminService.js';

const router = express.Router();

// Apply authentication and admin role middleware to all admin routes
router.use(authenticateToken());
router.use(authorizeRoles('admin'));

/**
 * @route GET /api/admin/stats
 * @desc Get admin dashboard statistics
 * @access Admin
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await getAdminStats();
    return sendSuccessResponse(res, { stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return sendErrorResponse(res, 'Failed to fetch admin statistics', 500);
  }
});

/**
 * @route GET /api/admin/feedback
 * @desc Get all feedback with optional filters
 * @access Admin
 */
router.get('/feedback', async (req, res) => {
  try {
    const { status, type } = req.query;
    const options = {};

    if (status) options.status = status;
    if (type) options.type = type;

    const feedback = await getAllFeedback(options);
    return sendSuccessResponse(res, { feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return sendErrorResponse(res, 'Failed to fetch feedback', 500);
  }
});

/**
 * @route PATCH /api/admin/feedback/:id
 * @desc Update feedback status
 * @access Admin
 */
router.patch('/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return sendErrorResponse(res, 'Status is required', 400);
    }

    const validStatuses = ['New', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      return sendErrorResponse(res, 'Invalid status', 400);
    }

    const updatedFeedback = await updateFeedbackStatus(id, status);
    return sendSuccessResponse(res, { feedback: updatedFeedback });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    return sendErrorResponse(res, 'Failed to update feedback status', 500);
  }
});

export default router;
