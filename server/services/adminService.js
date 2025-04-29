import { getAirtableBase } from './airtableService.js';
import { getAllFeedback } from './feedbackService.js';

/**
 * Get admin dashboard statistics
 * @returns {Promise<Object>} - Dashboard statistics
 */
export const getAdminStats = async () => {
  try {
    // Get Airtable base
    const base = getAirtableBase();
    
    // Get user statistics
    const usersTable = base('Users');
    const userRecords = await usersTable.select().all();
    const totalUsers = userRecords.length;
    
    // Calculate active users (users who logged in within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = userRecords.filter(record => {
      const lastLoginDate = record.get('Last Login Date');
      return lastLoginDate && new Date(lastLoginDate) >= thirtyDaysAgo;
    }).length;
    
    // Get feedback statistics
    const allFeedback = await getAllFeedback();
    const totalFeedback = allFeedback.length;
    
    // Count new feedback
    const newFeedback = allFeedback.filter(item => item.status === 'New').length;
    
    // Count resolved feedback
    const resolvedFeedback = allFeedback.filter(item => item.status === 'Resolved').length;
    
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
    // Get Airtable base
    const base = getAirtableBase();
    
    // Calculate start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get user login records
    const loginRecordsTable = base('Login Records');
    const loginRecords = await loginRecordsTable.select({
      filterByFormula: `IS_AFTER({Timestamp}, '${startDate.toISOString()}')`
    }).all();
    
    // Group by date
    const activityByDate = {};
    
    loginRecords.forEach(record => {
      const timestamp = record.get('Timestamp');
      const date = new Date(timestamp).toISOString().split('T')[0];
      
      if (!activityByDate[date]) {
        activityByDate[date] = 0;
      }
      
      activityByDate[date]++;
    });
    
    // Convert to array format
    const activityData = Object.entries(activityByDate).map(([date, count]) => ({
      date,
      count
    }));
    
    // Sort by date
    activityData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return activityData;
  } catch (error) {
    console.error('Error getting user activity:', error);
    throw new Error('Failed to get user activity data');
  }
};
