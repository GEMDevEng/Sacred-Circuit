import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Google Sheets API
let sheets;
let auth;

try {
  if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
    auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file'
      ]
    });

    sheets = google.sheets({ version: 'v4', auth });
  } else {
    console.warn('Google Sheets credentials not configured. Using mock service.');
    
    // Mock sheets service for development
    sheets = {
      spreadsheets: {
        values: {
          append: async () => ({
            data: {
              updates: {
                updatedRows: 1,
                updatedRange: 'Form Responses 1!A2:F2'
              }
            }
          }),
          get: async () => ({
            data: {
              values: [
                ['Timestamp', 'Email Address', 'Healing Name', 'Healing Goals', 'Fasting Experience', 'Email Consent'],
                ['2024-01-01T00:00:00Z', 'test@example.com', 'Test User', 'Test goals', 'Beginner', 'Yes']
              ]
            }
          })
        }
      }
    };
  }
} catch (error) {
  console.error('Google Sheets initialization error:', error);
  
  // Fallback mock service
  sheets = {
    spreadsheets: {
      values: {
        append: async () => ({ data: { updates: { updatedRows: 1 } } }),
        get: async () => ({ data: { values: [] } })
      }
    }
  };
}

/**
 * Add a form submission to Google Sheets
 * @param {Object} formData - The form submission data
 * @returns {Promise<Object>} - The result of the append operation
 */
export async function addFormSubmissionToSheets(formData) {
  try {
    const {
      healingName,
      email,
      healingGoals,
      fastingExperience,
      emailConsent,
      timestamp,
      source,
      variant
    } = formData;

    // Prepare the row data
    const rowData = [
      timestamp || new Date().toISOString(),
      email,
      healingName,
      healingGoals || '',
      fastingExperience || '',
      emailConsent ? 'Yes' : 'No',
      source || 'embedded_form',
      variant || 'unknown'
    ];

    // Append to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Form Responses 1!A:H', // Adjust range to include new columns
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [rowData]
      }
    });

    console.log(`Added form submission to Google Sheets: ${email}`);

    return {
      success: true,
      updatedRows: response.data.updates?.updatedRows || 1,
      updatedRange: response.data.updates?.updatedRange,
      rowData: rowData
    };
  } catch (error) {
    console.error('Error adding form submission to Google Sheets:', error);
    throw new Error(`Failed to add form submission to Google Sheets: ${error.message}`);
  }
}

/**
 * Get form responses from Google Sheets
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - Array of form responses
 */
export async function getFormResponsesFromSheets(options = {}) {
  try {
    const {
      limit = 100,
      startDate,
      endDate
    } = options;

    // Get data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Form Responses 1!A:H', // Include all columns
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row and process responses
    const headers = rows[0];
    const responses = rows.slice(1).map((row, index) => {
      const response = {
        rowNumber: index + 2, // +2 because we skip header and arrays are 0-indexed
      };
      
      headers.forEach((header, colIndex) => {
        response[header] = row[colIndex] || '';
      });
      
      return response;
    });

    // Filter by date if specified
    let filteredResponses = responses;
    if (startDate || endDate) {
      filteredResponses = responses.filter(response => {
        const responseDate = new Date(response['Timestamp']);
        
        if (startDate && responseDate < new Date(startDate)) {
          return false;
        }
        
        if (endDate && responseDate > new Date(endDate)) {
          return false;
        }
        
        return true;
      });
    }

    // Apply limit
    if (limit && limit > 0) {
      filteredResponses = filteredResponses.slice(0, limit);
    }

    return filteredResponses;
  } catch (error) {
    console.error('Error getting form responses from Google Sheets:', error);
    throw new Error(`Failed to get form responses from Google Sheets: ${error.message}`);
  }
}

/**
 * Initialize Google Sheets with proper headers
 * @returns {Promise<Object>} - The initialization result
 */
export async function initializeGoogleSheets() {
  try {
    // Check if sheet exists and has proper headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Form Responses 1!A1:H1',
    });

    const headers = response.data.values?.[0];
    const expectedHeaders = [
      'Timestamp',
      'Email Address', 
      'Healing Name',
      'Healing Goals',
      'Fasting Experience',
      'Email Consent',
      'Source',
      'Variant'
    ];

    // If headers don't exist or are incomplete, add them
    if (!headers || headers.length < expectedHeaders.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range: 'Form Responses 1!A1:H1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [expectedHeaders]
        }
      });

      console.log('Initialized Google Sheets with proper headers');
    }

    return {
      success: true,
      headers: expectedHeaders,
      message: 'Google Sheets initialized successfully'
    };
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    throw new Error(`Failed to initialize Google Sheets: ${error.message}`);
  }
}

/**
 * Get sheet statistics
 * @returns {Promise<Object>} - Sheet statistics
 */
export async function getSheetStatistics() {
  try {
    const responses = await getFormResponsesFromSheets();
    
    const stats = {
      totalResponses: responses.length,
      emailConsentCount: responses.filter(r => r['Email Consent'] === 'Yes').length,
      sourceBreakdown: {},
      variantBreakdown: {},
      recentResponses: responses.slice(-10).reverse() // Last 10 responses
    };

    // Calculate source breakdown
    responses.forEach(response => {
      const source = response['Source'] || 'unknown';
      stats.sourceBreakdown[source] = (stats.sourceBreakdown[source] || 0) + 1;
    });

    // Calculate variant breakdown
    responses.forEach(response => {
      const variant = response['Variant'] || 'unknown';
      stats.variantBreakdown[variant] = (stats.variantBreakdown[variant] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error getting sheet statistics:', error);
    throw new Error(`Failed to get sheet statistics: ${error.message}`);
  }
}

export default {
  addFormSubmissionToSheets,
  getFormResponsesFromSheets,
  initializeGoogleSheets,
  getSheetStatistics
};
