import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Sheet names
const SHEETS = {
  USERS: 'Users',
  REFLECTIONS: 'Reflections',
  CONVERSATIONS: 'Conversations',
  FEEDBACK: 'Feedback'
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
  }
};

// Initialize Google Sheets API
let sheets;
let auth;

/**
 * Initialize Google Sheets authentication
 */
async function initializeAuth() {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn('Google Sheets credentials not found, using mock mode');
      return null;
    }

    // Decode the private key from base64
    const privateKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY, 'base64').toString('utf-8');

    auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: SCOPES,
    });

    sheets = google.sheets({ version: 'v4', auth });

    // Test the connection
    await testConnection();

    console.log('Google Sheets API initialized successfully');
    return sheets;
  } catch (error) {
    console.error('Failed to initialize Google Sheets API:', error.message);
    return null;
  }
}

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
  })
});

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
      [SHEETS.FEEDBACK]: ['ID', 'Type', 'Title', 'Description', 'Email', 'Status', 'Timestamp', 'Client IP', 'User Agent']
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
 * Find a user by their email
 * @param {string} email - The user's email
 * @returns {Promise<Object|null>} - The user record or null
 */
export async function findUserByEmail(email) {
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
      if (row[2] === email) { // Email is in column C (index 2)
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
    console.error('Error finding user by email:', error);
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
 * Update an existing user
 * @param {string} userId - The user's ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} - The updated user
 */
export async function updateUser(userId, updateData) {
  if (!sheets) {
    return createMockService().updateUser(userId, updateData);
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.USERS}!A:J`,
    });

    const rows = response.data.values || [];
    let rowIndex = -1;

    // Find the user row
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === userId) {
        rowIndex = i + 1; // +1 because sheets are 1-indexed
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error('User not found');
    }

    const currentRow = rows[rowIndex - 1];
    const timestamp = new Date().toISOString();

    // Update the row with new data
    const updatedRow = [
      currentRow[0], // ID (unchanged)
      updateData.healingName || currentRow[1],
      updateData.email || currentRow[2],
      updateData.passwordHash || currentRow[3],
      updateData.role || currentRow[4],
      currentRow[5], // Registration date (unchanged)
      updateData.journeyStatus || currentRow[6],
      updateData.emailConsent !== undefined ? (updateData.emailConsent ? 'true' : 'false') : currentRow[7],
      updateData.healingGoals || currentRow[8],
      timestamp // Last updated
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.USERS}!A${rowIndex}:J${rowIndex}`,
      valueInputOption: 'RAW',
      resource: {
        values: [updatedRow]
      }
    });

    return {
      id: userId,
      healingName: updatedRow[1],
      email: updatedRow[2],
      role: updatedRow[4],
      updated: true
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

/**
 * Save a user reflection to Google Sheets
 * @param {Object} reflectionData - The reflection data
 * @returns {Promise<Object>} - The saved reflection
 */
export async function saveReflection(reflectionData) {
  if (!sheets) {
    return createMockService().saveReflection(reflectionData);
  }

  try {
    const { healingName, reflectionText, journeyDay, emailConsent, userId } = reflectionData;
    const id = generateId();
    const timestamp = new Date().toISOString();

    const row = [
      id,
      userId || '',
      healingName,
      reflectionText,
      journeyDay || 'Not specified',
      emailConsent ? 'true' : 'false',
      timestamp
    ];

    const nextRow = await getNextRow(SHEETS.REFLECTIONS);

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.REFLECTIONS}!A${nextRow}:G${nextRow}`,
      valueInputOption: 'RAW',
      resource: {
        values: [row]
      }
    });

    return {
      id,
      healingName,
      journeyDay: journeyDay || 'Not specified',
      timestamp,
      success: true
    };
  } catch (error) {
    console.error('Error saving reflection:', error);
    throw new Error('Failed to save reflection');
  }
}

/**
 * Get reflections by healing name
 * @param {string} healingName - The user's healing name
 * @returns {Promise<Array>} - Array of reflection records
 */
export async function getReflectionsByHealingName(healingName) {
  if (!sheets) return [];

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.REFLECTIONS}!A:G`,
    });

    const rows = response.data.values || [];
    const reflections = [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[2] === healingName) { // Healing Name is in column C (index 2)
        reflections.push({
          id: row[0],
          healingName: row[2],
          content: row[3],
          journeyDay: row[4],
          createdAt: row[6]
        });
      }
    }

    // Sort by timestamp (newest first)
    return reflections.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting reflections by healing name:', error);
    return [];
  }
}

/**
 * Get reflections by user ID
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of reflection records
 */
export async function getReflectionsByUserId(userId) {
  if (!sheets) return [];

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.REFLECTIONS}!A:G`,
    });

    const rows = response.data.values || [];
    const reflections = [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[1] === userId) { // User ID is in column B (index 1)
        reflections.push({
          id: row[0],
          healingName: row[2],
          content: row[3],
          journeyDay: row[4],
          createdAt: row[6]
        });
      }
    }

    // Sort by timestamp (newest first)
    return reflections.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting reflections by user ID:', error);
    return [];
  }
}

/**
 * Store a conversation in Google Sheets
 * @param {Object} conversationData - The conversation data
 * @returns {Promise<Object>} - The stored conversation
 */
export async function storeConversation(conversationData) {
  if (!sheets) {
    return createMockService().storeConversation(conversationData);
  }

  try {
    const { healingName, userMessage, aiResponse, timestamp, userId } = conversationData;
    const id = generateId();

    const row = [
      id,
      userId || '',
      healingName,
      userMessage,
      aiResponse,
      timestamp || new Date().toISOString()
    ];

    const nextRow = await getNextRow(SHEETS.CONVERSATIONS);

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.CONVERSATIONS}!A${nextRow}:F${nextRow}`,
      valueInputOption: 'RAW',
      resource: {
        values: [row]
      }
    });

    return {
      id,
      healingName,
      timestamp: timestamp || new Date().toISOString(),
      success: true
    };
  } catch (error) {
    console.error('Error storing conversation:', error);
    throw new Error('Failed to store conversation');
  }
}

/**
 * Save feedback to Google Sheets
 * @param {Object} feedbackData - The feedback data
 * @returns {Promise<Object>} - The saved feedback
 */
export async function saveFeedback(feedbackData) {
  if (!sheets) {
    return createMockService().saveFeedback(feedbackData);
  }

  try {
    const { type, title, description, email, clientIp, userAgent, timestamp } = feedbackData;
    const id = generateId();

    const row = [
      id,
      type,
      title,
      description,
      email || '',
      'New', // Default status
      timestamp || new Date().toISOString(),
      clientIp || '',
      userAgent || ''
    ];

    const nextRow = await getNextRow(SHEETS.FEEDBACK);

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.FEEDBACK}!A${nextRow}:I${nextRow}`,
      valueInputOption: 'RAW',
      resource: {
        values: [row]
      }
    });

    return {
      id,
      type,
      title,
      description,
      email,
      status: 'New',
      timestamp: timestamp || new Date().toISOString(),
      success: true
    };
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw new Error('Failed to save feedback');
  }
}

/**
 * Get all feedback with optional filters
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} - Array of feedback records
 */
export async function getAllFeedback(options = {}) {
  if (!sheets) return [];

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.FEEDBACK}!A:I`,
    });

    const rows = response.data.values || [];
    const feedback = [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const feedbackItem = {
        id: row[0],
        type: row[1],
        title: row[2],
        description: row[3],
        email: row[4],
        status: row[5],
        timestamp: row[6],
        clientIp: row[7],
        userAgent: row[8]
      };

      // Apply filters
      if (options.status && feedbackItem.status !== options.status) continue;
      if (options.type && feedbackItem.type !== options.type) continue;

      feedback.push(feedbackItem);
    }

    // Sort by timestamp (newest first)
    return feedback.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Error getting all feedback:', error);
    return [];
  }
}

/**
 * Update feedback status
 * @param {string} feedbackId - The feedback ID
 * @param {string} status - The new status
 * @returns {Promise<Object>} - The updated feedback
 */
export async function updateFeedbackStatus(feedbackId, status) {
  if (!sheets) {
    return createMockService().updateFeedbackStatus(feedbackId, status);
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.FEEDBACK}!A:I`,
    });

    const rows = response.data.values || [];
    let rowIndex = -1;

    // Find the feedback row
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === feedbackId) {
        rowIndex = i + 1; // +1 because sheets are 1-indexed
        break;
      }
    }

    if (rowIndex === -1) {
      throw new Error('Feedback not found');
    }

    const currentRow = rows[rowIndex - 1];

    // Update only the status column (F)
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEETS.FEEDBACK}!F${rowIndex}`,
      valueInputOption: 'RAW',
      resource: {
        values: [[status]]
      }
    });

    return {
      id: feedbackId,
      type: currentRow[1],
      title: currentRow[2],
      description: currentRow[3],
      email: currentRow[4],
      status: status,
      timestamp: currentRow[6],
      updated: true
    };
  } catch (error) {
    console.error('Error updating feedback status:', error);
    throw new Error('Failed to update feedback status');
  }
}

/**
 * Process a Typeform submission and save user data
 * @param {Object} formResponse - The Typeform form response
 * @returns {Promise<Object>} - The saved user
 */
export async function processTypeformSubmission(formResponse) {
  if (!sheets) {
    return createMockService().processTypeformSubmission(formResponse);
  }

  try {
    const answers = formResponse.answers;

    // Extract data from Typeform answers
    const healingName = answers.find(a => a.field.ref === 'healing_name')?.text || '';
    const email = answers.find(a => a.field.ref === 'email')?.email || '';
    const healingGoals = answers.find(a => a.field.ref === 'healing_goals')?.text || '';
    const emailConsent = answers.find(a => a.field.ref === 'email_consent')?.boolean || false;

    // Check if user already exists
    const existingUser = await findUserByHealingName(healingName);

    if (existingUser && existingUser.id) {
      // Update existing user
      const updatedUser = await updateUser(existingUser.id, {
        email,
        healingGoals,
        emailConsent
      });

      return {
        id: existingUser.id,
        healingName,
        email,
        updated: true
      };
    } else {
      // Create new user
      const newUser = await createUser({
        healingName,
        email,
        healingGoals,
        emailConsent,
        journeyStatus: 'Active'
      });

      return {
        id: newUser.id,
        healingName,
        email,
        created: true
      };
    }
  } catch (error) {
    console.error('Error processing Typeform submission:', error);
    throw new Error('Failed to process Typeform submission');
  }
}

// Initialize the service
let initialized = false;

export async function initializeGoogleSheetsService() {
  if (initialized) return;

  try {
    await initializeAuth();
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
