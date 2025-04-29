import crypto from 'crypto';
import { getAirtableBase } from './airtableService.js';

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
 * Save feedback to Airtable
 * @param {Object} feedback - Feedback data
 * @returns {Promise<Object>} - Saved feedback record
 */
export const saveFeedback = async (feedback) => {
  try {
    const base = getAirtableBase();
    const table = base('Feedback');

    // Hash IP address for privacy
    const hashedIp = feedback.clientIp ? hashData(feedback.clientIp) : null;

    // Create record
    const record = await table.create({
      Type: feedback.type,
      Title: feedback.title,
      Description: feedback.description,
      Email: feedback.email || '',
      'IP Hash': hashedIp || '',
      'User Agent': feedback.userAgent || '',
      Timestamp: feedback.timestamp,
      Status: 'New'
    });

    return record;
  } catch (error) {
    console.error('Error saving feedback to Airtable:', error);
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
    const base = getAirtableBase();
    const table = base('Feedback');

    // Build filter formula if status is provided
    let filterByFormula = '';
    if (options.status) {
      filterByFormula = `{Status} = '${options.status}'`;
    }

    // Query parameters
    const params = {
      sort: [{ field: 'Timestamp', direction: 'desc' }],
      ...(filterByFormula && { filterByFormula })
    };

    // Get records
    const records = await table.select(params).all();

    // Format records
    return records.map(record => ({
      id: record.id,
      type: record.get('Type'),
      title: record.get('Title'),
      description: record.get('Description'),
      email: record.get('Email'),
      timestamp: record.get('Timestamp'),
      status: record.get('Status')
    }));
  } catch (error) {
    console.error('Error fetching feedback from Airtable:', error);
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
    const base = getAirtableBase();
    const table = base('Feedback');

    // Validate status
    const validStatuses = ['New', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    // Update record
    const record = await table.update(id, {
      Status: status
    });

    return {
      id: record.id,
      type: record.get('Type'),
      title: record.get('Title'),
      status: record.get('Status')
    };
  } catch (error) {
    console.error('Error updating feedback status in Airtable:', error);
    throw new Error('Failed to update feedback status');
  }
};
