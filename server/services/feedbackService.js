import crypto from 'crypto';
import { saveFeedback as saveFeedbackToSheets, getAllFeedback as getAllFeedbackFromSheets, updateFeedbackStatus as updateFeedbackStatusInSheets } from './googleSheetsService.js';

/**
 * Hash sensitive data for privacy
 * @param {string} data - Data to hash
 * @returns {string} - Hashed data
 */
const hashData = (data) => {
  if (!data) return null;
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Save feedback to Google Sheets
 * @param {Object} feedback - Feedback data
 * @returns {Promise<Object>} - Saved feedback record
 */
export const saveFeedback = async (feedback) => {
  try {
    // Hash IP address for privacy
    const hashedIp = feedback.clientIp ? hashData(feedback.clientIp) : null;

    // Prepare feedback data for Google Sheets
    const feedbackData = {
      type: feedback.type,
      title: feedback.title,
      description: feedback.description,
      email: feedback.email || '',
      clientIp: hashedIp || '',
      userAgent: feedback.userAgent || '',
      timestamp: feedback.timestamp
    };

    // Save to Google Sheets
    const result = await saveFeedbackToSheets(feedbackData);
    return result;
  } catch (error) {
    console.error('Error saving feedback to Google Sheets:', error);
    throw new Error('Failed to save feedback');
  }
};

/**
 * Get all feedback entries
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - List of feedback entries
 */
export const getAllFeedback = async (options = {}) => {
  try {
    // Get feedback from Google Sheets
    const feedback = await getAllFeedbackFromSheets(options);
    return feedback;
  } catch (error) {
    console.error('Error fetching feedback from Google Sheets:', error);
    throw new Error('Failed to fetch feedback');
  }
};

/**
 * Update feedback status
 * @param {string} id - Feedback record ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated feedback record
 */
export const updateFeedbackStatus = async (id, status) => {
  try {
    // Validate status
    const validStatuses = ['New', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    // Update feedback status in Google Sheets
    const result = await updateFeedbackStatusInSheets(id, status);
    return result;
  } catch (error) {
    console.error('Error updating feedback status in Google Sheets:', error);
    throw new Error('Failed to update feedback status');
  }
};
