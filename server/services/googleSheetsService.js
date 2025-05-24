import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.GOOGLE_SHEETS_ID;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];

// Sheet names
const SHEETS = {
  USERS: 'Users',
  REFLECTIONS: 'Reflections',
  CONVERSATIONS: 'Conversations',
  FEEDBACK: 'Feedback',
  FORM_RESPONSES: 'Form Responses 1' // For embedded form submissions
};

// Column mappings for each sheet
const COLUMNS = {
  USERS: {
    ID: 'A',
    HEALING_NAME: 'B',
    EMAIL: 'C',
    PASSWORD_HASH: 'D',
    ROLE: 'E',
    REGISTRATION_DATE: 'F',
    JOURNEY_STATUS: 'G',
    EMAIL_CONSENT: 'H',
    HEALING_GOALS: 'I',
    LAST_UPDATED: 'J'
  },
  REFLECTIONS: {
    ID: 'A',
    USER_ID: 'B',
    HEALING_NAME: 'C',
    REFLECTION_TEXT: 'D',
    JOURNEY_DAY: 'E',
    EMAIL_CONSENT: 'F',
    TIMESTAMP: 'G'
  },
  CONVERSATIONS: {
    ID: 'A',
    USER_ID: 'B',
    HEALING_NAME: 'C',
    USER_MESSAGE: 'D',
    AI_RESPONSE: 'E',
    TIMESTAMP: 'F'
  },
  FEEDBACK: {
    ID: 'A',
    TYPE: 'B',
    TITLE: 'C',
    DESCRIPTION: 'D',
    EMAIL: 'E',
    STATUS: 'F',
    TIMESTAMP: 'G',
    CLIENT_IP: 'H',
    USER_AGENT: 'I'
  },
  FORM_RESPONSES: {
    TIMESTAMP: 'A',
    EMAIL: 'B',
    HEALING_NAME: 'C',
    HEALING_GOALS: 'D',
    FASTING_EXPERIENCE: 'E',
    EMAIL_CONSENT: 'F',
    SOURCE: 'G',
    VARIANT: 'H'
  }
};

// Initialize Google Sheets API
let sheets;
let auth;

/**
 * Create mock functions for development/testing
 */
const createMockService = () => ({
  // Users
  findUserByHealingName: async () => null,
  findUserById: async () => null,
  createUser: async (userData) => ({
    id: 'mock-user-' + Date.now(),
    ...userData,
    created: true
  }),
  updateUser: async (id, userData) => ({
    id,
    ...userData,
    updated: true
  }),

  // Reflections
  saveReflection: async (reflectionData) => ({
    id: 'mock-reflection-' + Date.now(),
    ...reflectionData,
    timestamp: new Date().toISOString(),
    success: true
  }),
  getReflectionsByHealingName: async () => [],
  getReflectionsByUserId: async () => [],

  // Conversations
  storeConversation: async (conversationData) => ({
    id: 'mock-conversation-' + Date.now(),
    ...conversationData,
    success: true
  }),

  // Feedback
  saveFeedback: async (feedbackData) => ({
    id: 'mock-feedback-' + Date.now(),
    ...feedbackData,
    success: true
  }),
  getAllFeedback: async () => [],
  updateFeedbackStatus: async (id, status) => ({
    id,
    status,
    updated: true
  }),

  // Typeform processing
  processTypeformSubmission: async (formResponse) => ({
    id: 'mock-user-' + Date.now(),
    healingName: 'Mock User',
    email: 'mock@example.com',
    created: true
  }),

  // Form submissions (from feature branch)
  addFormSubmissionToSheets: async (formData) => ({
    success: true,
    updatedRows: 1,
    updatedRange: 'Form Responses 1!A2:H2',
    rowData: [
      formData.timestamp || new Date().toISOString(),
      formData.email,
      formData.healingName,
      formData.healingGoals || '',
      formData.fastingExperience || '',
      formData.emailConsent ? 'Yes' : 'No',
      formData.source || 'embedded_form',
      formData.variant || 'unknown'
    ]
  }),
  getFormResponsesFromSheets: async () => [],
  getSheetStatistics: async () => ({
    totalResponses: 0,
    emailConsentCount: 0,
    sourceBreakdown: {},
    variantBreakdown: {},
    recentResponses: []
  })
});

/**
 * Test the Google Sheets connection
 */
async function testConnection() {
  if (!sheets || !SPREADSHEET_ID) {
    throw new Error('Google Sheets not initialized or spreadsheet ID missing');
  }

  try {
    await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
  } catch (error) {
    throw new Error(`Failed to connect to Google Sheets: ${error.message}`);
  }
}

/**
 * Initialize authentication with support for multiple credential formats
 */
async function initializeAuthWithFallback() {
  try {
    // Try the main branch format first (base64 encoded)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const privateKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY, 'base64').toString('utf-8');

      auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: privateKey,
        },
        scopes: SCOPES,
      });

      sheets = google.sheets({ version: 'v4', auth });
      await testConnection();
      console.log('Google Sheets API initialized successfully (main format)');
      return sheets;
    }

    // Try the feature branch format (direct credentials)
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
        scopes: SCOPES
      });

      sheets = google.sheets({ version: 'v4', auth });
      await testConnection();
      console.log('Google Sheets API initialized successfully (feature format)');
      return sheets;
    }

    console.warn('Google Sheets credentials not found, using mock mode');
    return null;
  } catch (error) {
    console.error('Failed to initialize Google Sheets API:', error.message);
    return null;
  }
}

/**
 * Generate a unique ID for new records
 */
function generateId() {
  return 'gs_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get the next available row in a sheet
 */
async function getNextRow(sheetName) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
    });

    const values = response.data.values || [];
    return values.length + 1; // Next available row
  } catch (error) {
    console.error(`Error getting next row for ${sheetName}:`, error);
    return 2; // Start from row 2 (assuming row 1 is headers)
  }
}

/**
 * Add a form submission to Google Sheets
 * @param {Object} formData - The form submission data
 * @returns {Promise<Object>} - The result of the append operation
 */
export async function addFormSubmissionToSheets(formData) {
  if (!sheets) {
    return createMockService().addFormSubmissionToSheets(formData);
  }

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
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.FORM_RESPONSES}!A:H`,
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
  if (!sheets) {
    return createMockService().getFormResponsesFromSheets(options);
  }

  try {
    const {
      limit = 100,
      startDate,
      endDate
    } = options;

    // Get data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.FORM_RESPONSES}!A:H`,
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
 * Get sheet statistics
 * @returns {Promise<Object>} - Sheet statistics
 */
export async function getSheetStatistics() {
  if (!sheets) {
    return createMockService().getSheetStatistics();
  }

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

/**
 * Find a user by their healing name
 * @param {string} healingName - The user's healing name
 * @returns {Promise<Object|null>} - The user record or null
 */
export async function findUserByHealingName(healingName) {
  if (!sheets) return null;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.USERS}!A:J`,
    });

    const rows = response.data.values || [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[1] === healingName) { // Healing Name is in column B (index 1)
        return {
          id: row[0],
          healingName: row[1],
          email: row[2],
          passwordHash: row[3],
          role: row[4] || 'user',
          registrationDate: row[5],
          journeyStatus: row[6],
          emailConsent: row[7] === 'true',
          healingGoals: row[8],
          lastUpdated: row[9]
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding user by healing name:', error);
    return null;
  }
}

/**
 * Find a user by their ID
 * @param {string} userId - The user's ID
 * @returns {Promise<Object|null>} - The user record or null
 */
export async function findUserById(userId) {
  if (!sheets) return null;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.USERS}!A:J`,
    });

    const rows = response.data.values || [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] === userId) { // ID is in column A (index 0)
        return {
          id: row[0],
          healingName: row[1],
          email: row[2],
          passwordHash: row[3],
          role: row[4] || 'user',
          registrationDate: row[5],
          journeyStatus: row[6],
          emailConsent: row[7] === 'true',
          healingGoals: row[8],
          lastUpdated: row[9]
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
}

/**
 * Create a new user
 * @param {Object} userData - The user data
 * @returns {Promise<Object>} - The created user
 */
export async function createUser(userData) {
  if (!sheets) {
    return createMockService().createUser(userData);
  }

  try {
    const id = generateId();
    const timestamp = new Date().toISOString();

    const row = [
      id,
      userData.healingName,
      userData.email,
      userData.passwordHash || '',
      userData.role || 'user',
      userData.registrationDate || timestamp,
      userData.journeyStatus || 'Active',
      userData.emailConsent ? 'true' : 'false',
      userData.healingGoals || '',
      timestamp
    ];

    const nextRow = await getNextRow(SHEETS.USERS);

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.USERS}!A${nextRow}:J${nextRow}`,
      valueInputOption: 'RAW',
      resource: {
        values: [row]
      }
    });

    return {
      id,
      healingName: userData.healingName,
      email: userData.email,
      role: userData.role || 'user',
      created: true
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

/**
 * Initialize sheets with headers if they don't exist
 */
async function initializeSheets() {
  if (!sheets) return;

  try {
    // Check if sheets exist and create headers
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const existingSheets = spreadsheet.data.sheets.map(sheet => sheet.properties.title);

    // Create headers for each sheet if they don't exist
    const sheetHeaders = {
      [SHEETS.USERS]: ['ID', 'Healing Name', 'Email', 'Password Hash', 'Role', 'Registration Date', 'Journey Status', 'Email Consent', 'Healing Goals', 'Last Updated'],
      [SHEETS.REFLECTIONS]: ['ID', 'User ID', 'Healing Name', 'Reflection Text', 'Journey Day', 'Email Consent', 'Timestamp'],
      [SHEETS.CONVERSATIONS]: ['ID', 'User ID', 'Healing Name', 'User Message', 'AI Response', 'Timestamp'],
      [SHEETS.FEEDBACK]: ['ID', 'Type', 'Title', 'Description', 'Email', 'Status', 'Timestamp', 'Client IP', 'User Agent'],
      [SHEETS.FORM_RESPONSES]: ['Timestamp', 'Email Address', 'Healing Name', 'Healing Goals', 'Fasting Experience', 'Email Consent', 'Source', 'Variant']
    };

    for (const [sheetName, headers] of Object.entries(sheetHeaders)) {
      if (!existingSheets.includes(sheetName)) {
        // Create the sheet
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          resource: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName
                }
              }
            }]
          }
        });
      }

      // Add headers if the sheet is empty
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!1:1`,
      });

      if (!response.data.values || response.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!1:1`,
          valueInputOption: 'RAW',
          resource: {
            values: [headers]
          }
        });
      }
    }
  } catch (error) {
    console.error('Error initializing sheets:', error);
  }
}

/**
 * Initialize Google Sheets with proper headers
 * @returns {Promise<Object>} - The initialization result
 */
export async function initializeGoogleSheets() {
  if (!sheets) {
    return createMockService().initializeGoogleSheets();
  }

  try {
    await initializeSheets();

    return {
      success: true,
      message: 'Google Sheets initialized successfully'
    };
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    throw new Error(`Failed to initialize Google Sheets: ${error.message}`);
  }
}

// Initialize the service
let initialized = false;

export async function initializeGoogleSheetsService() {
  if (initialized) return;

  try {
    await initializeAuthWithFallback();
    if (sheets) {
      await initializeSheets();
    }
    initialized = true;
    console.log('Google Sheets service initialized');
  } catch (error) {
    console.error('Failed to initialize Google Sheets service:', error);
    // Continue with mock service for development
  }
}

// Auto-initialize when the module is imported
initializeGoogleSheetsService();

// Export mock service for testing
export const mockService = createMockService();

export default {
  addFormSubmissionToSheets,
  getFormResponsesFromSheets,
  getSheetStatistics,
  findUserByHealingName,
  findUserById,
  createUser,
  initializeGoogleSheets,
  initializeGoogleSheetsService
};
