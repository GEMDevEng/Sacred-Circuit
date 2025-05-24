import { getAllFeedback } from './feedbackService.js';
import { getAllFeedback as getAllFeedbackFromSheets } from './googleSheetsService.js';

/**
 * Get admin dashboard statistics
 * @returns {Promise<Object>} - Dashboard statistics
 */
export const getAdminStats = async () => {
  try {
    // Get feedback statistics from Google Sheets
    const allFeedback = await getAllFeedback();
    const totalFeedback = allFeedback.length;

    // Count new feedback
    const newFeedback = allFeedback.filter(item => item.status === 'New').length;

    // Count resolved feedback
    const resolvedFeedback = allFeedback.filter(item => item.status === 'Resolved').length;

    // For now, return simplified stats until we implement user tracking in Google Sheets
    // TODO: Implement user statistics when user management is fully migrated
    const totalUsers = 0; // Placeholder - will be implemented with user sheet access
    const activeUsers = 0; // Placeholder - will be implemented with user activity tracking

    // Get error rate (mock data for now)
    // In a real application, this would come from your error tracking system
    const errorRate = 1.2;

    return {
      totalUsers,
      activeUsers,
      totalFeedback,
      newFeedback,
      resolvedFeedback,
      errorRate
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    throw new Error('Failed to get admin statistics');
  }
};

/**
 * Get user activity data
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>} - User activity data
 */
export const getUserActivity = async (days = 30) => {
  try {
    // TODO: Implement user activity tracking with Google Sheets
    // For now, return mock data until we implement login tracking
    console.warn('User activity tracking not yet implemented for Google Sheets');

    // Return mock activity data
    const activityData = [];
    const startDate = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(startDate);
      date.setDate(date.getDate() - i);

      activityData.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10) // Mock data
      });
    }

    return activityData;
  } catch (error) {
    console.error('Error getting user activity:', error);
    throw new Error('Failed to get user activity data');
  }
};
