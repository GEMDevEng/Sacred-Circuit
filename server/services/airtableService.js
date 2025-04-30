import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Airtable with error handling
let base;
let usersTable;
let reflectionsTable;

try {
  Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY,
  });

  // Export the function to get the Airtable base
  export function getAirtableBase() {
    try {
      return Airtable.base(process.env.AIRTABLE_BASE_ID);
    } catch (error) {
      console.warn('Airtable base ID missing or invalid. Using mock Airtable base.');
      // Return a mock base for development
      return {
        'Feedback': {
          create: async () => ({ id: 'mock-id-' + Date.now() }),
          select: () => ({
            all: async () => [],
            firstPage: async () => []
          }),
          update: async (id) => ({ id })
        }
      };
    }
  }

  base = getAirtableBase();
  usersTable = base('Users');
  reflectionsTable = base('Reflections');
} catch (error) {
  console.warn('Airtable API key missing or invalid. Using mock Airtable services.');

  // Create mock tables for development
  const createMockTable = () => ({
    create: async () => ({
      id: 'mock-id-' + Date.now(),
      fields: {
        'Timestamp': new Date().toISOString()
      }
    }),
    select: () => ({
      firstPage: async () => []
    }),
    update: async (id) => ({ id })
  });

  usersTable = createMockTable();
  reflectionsTable = createMockTable();

  // Export a function that returns a mock base
  export function getAirtableBase() {
    return {
      'Feedback': createMockTable(),
      'Users': createMockTable(),
      'Reflections': createMockTable(),
      'Conversations': createMockTable()
    };
  }
}

/**
 * Save a user reflection to Airtable
 * @param {Object} reflectionData - The reflection data
 * @returns {Promise<Object>} - The saved reflection
 */
export async function saveReflection(reflectionData) {
  try {
    const { healingName, reflectionText, journeyDay, emailConsent, userId } = reflectionData;

    // Create reflection record
    const reflectionRecord = {
      'Healing Name': healingName,
      'Reflection Text': reflectionText,
      'Journey Day': journeyDay,
      'Timestamp': new Date().toISOString(),
      'Email Consent': emailConsent
    };

    // If userId is provided directly, use it
    if (userId) {
      reflectionRecord['User'] = [userId];
    }
    // Otherwise, check if user exists by healing name
    else if (!userId) {
      const user = await findUserByHealingName(healingName);
      if (user && user.id) {
        reflectionRecord['User'] = [user.id];
      }
    }

    const reflection = await reflectionsTable.create(reflectionRecord);

    return {
      id: reflection.id,
      healingName,
      journeyDay,
      timestamp: reflection.fields['Timestamp'],
      success: true
    };
  } catch (error) {
    console.error('Airtable error:', error);
    throw new Error('Failed to save reflection');
  }
}

/**
 * Get reflections by healing name
 * @param {string} healingName - The user's healing name
 * @returns {Promise<Array>} - Array of reflection records
 */
export async function getReflectionsByHealingName(healingName) {
  try {
    // Query reflections by healing name
    const records = await reflectionsTable.select({
      filterByFormula: `{Healing Name} = '${healingName}'`,
      sort: [{ field: 'Timestamp', direction: 'desc' }],
      maxRecords: 100
    }).firstPage();

    // Format the records
    return records.map(record => ({
      id: record.id,
      healingName: record.fields['Healing Name'],
      content: record.fields['Reflection Text'],
      journeyDay: record.fields['Journey Day'],
      createdAt: record.fields['Timestamp']
    }));
  } catch (error) {
    console.error('Airtable error:', error);
    throw new Error('Failed to retrieve reflections');
  }
}

/**
 * Get reflections by user ID
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of reflection records
 */
export async function getReflectionsByUserId(userId) {
  try {
    // Query reflections by user ID
    const records = await reflectionsTable.select({
      filterByFormula: `SEARCH('${userId}', {User})`,
      sort: [{ field: 'Timestamp', direction: 'desc' }],
      maxRecords: 100
    }).firstPage();

    // Format the records
    return records.map(record => ({
      id: record.id,
      healingName: record.fields['Healing Name'],
      content: record.fields['Reflection Text'],
      journeyDay: record.fields['Journey Day'],
      createdAt: record.fields['Timestamp']
    }));
  } catch (error) {
    console.error('Airtable error:', error);
    throw new Error('Failed to retrieve reflections');
  }
}

/**
 * Find a user by their healing name
 * @param {string} healingName - The user's healing name
 * @returns {Promise<Object|null>} - The user record or null
 */
export async function findUserByHealingName(healingName) {
  try {
    const records = await usersTable.select({
      filterByFormula: `{Healing Name} = '${healingName}'`,
      maxRecords: 1
    }).firstPage();

    if (records && records.length > 0) {
      return {
        id: records[0].id,
        ...records[0].fields
      };
    }

    return null;
  } catch (error) {
    console.error('Airtable error:', error);
    return null;
  }
}

/**
 * Process a Typeform submission and save user data
 * @param {Object} formResponse - The Typeform form response
 * @returns {Promise<Object>} - The saved user
 */
export async function processTypeformSubmission(formResponse) {
  try {
    const answers = formResponse.answers;

    // Extract data from Typeform answers
    // Note: Field references would need to be updated based on actual Typeform structure
    const healingName = answers.find(a => a.field.ref === 'healing_name')?.text || '';
    const email = answers.find(a => a.field.ref === 'email')?.email || '';
    const healingGoals = answers.find(a => a.field.ref === 'healing_goals')?.text || '';
    const emailConsent = answers.find(a => a.field.ref === 'email_consent')?.boolean || false;

    // Check if user already exists
    const existingUser = await findUserByHealingName(healingName);

    if (existingUser && existingUser.id) {
      // Update existing user
      await usersTable.update(existingUser.id, {
        'Email': email,
        'Healing Goals': healingGoals,
        'Email Consent': emailConsent,
        'Last Updated': new Date().toISOString()
      });

      return {
        id: existingUser.id,
        healingName,
        email,
        updated: true
      };
    } else {
      // Create new user
      const newUser = await usersTable.create({
        'Healing Name': healingName,
        'Email': email,
        'Healing Goals': healingGoals,
        'Email Consent': emailConsent,
        'Registration Date': new Date().toISOString(),
        'Journey Status': 'Active'
      });

      return {
        id: newUser.id,
        healingName,
        email,
        created: true
      };
    }
  } catch (error) {
    console.error('Typeform processing error:', error);
    throw new Error('Failed to process Typeform submission');
  }
}
