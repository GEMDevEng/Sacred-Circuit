import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Airtable with error handling
let base;
let usersTable;
let reflectionsTable;

// Create mock table function
const createMockTable = () => ({
  create: async () => ({
    id: 'mock-id-' + Date.now(),
    fields: {
      'Timestamp': new Date().toISOString()
    }
  }),
  select: () => ({
    all: async () => [],
    firstPage: async () => []
  }),
  update: async (id) => ({ id })
});

// Export the function to get the Airtable base
export function getAirtableBase() {
  try {
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      throw new Error('Missing Airtable credentials');
    }
    return Airtable.base(process.env.AIRTABLE_BASE_ID);
  } catch (error) {
    console.warn('Airtable configuration error:', error.message);
    // Return a mock base for development
    return {
      'Feedback': createMockTable(),
      'Users': createMockTable(),
      'Reflections': createMockTable(),
      'Conversations': createMockTable()
    };
  }
}

// Configure Airtable
try {
  Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY,
  });

  base = getAirtableBase();
  usersTable = base('Users');
  reflectionsTable = base('Reflections');
} catch (error) {
  console.warn('Airtable initialization error:', error.message);

  // Use mock tables for development
  usersTable = createMockTable();
  reflectionsTable = createMockTable();
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

/**
 * Process a Google Forms submission and save user data
 * @param {Object} formData - The Google Forms submission data
 * @returns {Promise<Object>} - The saved user
 */
export async function processGoogleFormSubmission(formData) {
  try {
    const {
      healingName,
      email,
      healingGoals,
      fastingExperience,
      emailConsent,
      timestamp
    } = formData;

    // Validate required fields
    if (!healingName || !email) {
      throw new Error('Healing Name and Email are required fields');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Check if user already exists by email first, then by healing name
    let existingUser = await findUserByEmail(email);
    if (!existingUser) {
      existingUser = await findUserByHealingName(healingName);
    }

    const userData = {
      'Healing Name': healingName,
      'Email': email,
      'Healing Goals': healingGoals || '',
      'Fasting Experience': fastingExperience || '',
      'Email Consent': emailConsent || false,
      'Registration Source': 'Google Forms',
      'Last Updated': new Date().toISOString()
    };

    if (existingUser && existingUser.id) {
      // Update existing user
      await usersTable.update(existingUser.id, userData);

      console.log(`Updated existing user: ${healingName} (${email})`);

      return {
        id: existingUser.id,
        healingName,
        email,
        healingGoals,
        fastingExperience,
        emailConsent,
        updated: true,
        timestamp: userData['Last Updated']
      };
    } else {
      // Create new user
      userData['Registration Date'] = timestamp || new Date().toISOString();
      userData['Journey Status'] = 'Active';
      userData['Onboarding Stage'] = 'Welcome Email Sent';

      const newUser = await usersTable.create(userData);

      console.log(`Created new user: ${healingName} (${email})`);

      return {
        id: newUser.id,
        healingName,
        email,
        healingGoals,
        fastingExperience,
        emailConsent,
        created: true,
        timestamp: userData['Registration Date']
      };
    }
  } catch (error) {
    console.error('Google Forms processing error:', error);
    throw new Error(`Failed to process Google Forms submission: ${error.message}`);
  }
}

/**
 * Find a user by their email address
 * @param {string} email - The user's email address
 * @returns {Promise<Object|null>} - The user record or null
 */
export async function findUserByEmail(email) {
  try {
    if (!email) {
      return null;
    }

    const records = await usersTable.select({
      filterByFormula: `{Email} = '${email.replace(/'/g, "\\'")}'`,
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
    console.error('Airtable error finding user by email:', error);
    return null;
  }
}

/**
 * Update user onboarding stage
 * @param {string} userId - The user's ID
 * @param {string} stage - The new onboarding stage
 * @returns {Promise<Object>} - The updated user
 */
export async function updateUserOnboardingStage(userId, stage) {
  try {
    if (!userId || !stage) {
      throw new Error('User ID and stage are required');
    }

    const updatedUser = await usersTable.update(userId, {
      'Onboarding Stage': stage,
      'Last Updated': new Date().toISOString()
    });

    return {
      id: updatedUser.id,
      onboardingStage: updatedUser.fields['Onboarding Stage'],
      lastUpdated: updatedUser.fields['Last Updated']
    };
  } catch (error) {
    console.error('Error updating user onboarding stage:', error);
    throw new Error('Failed to update user onboarding stage');
  }
}

/**
 * Get user journey analytics
 * @param {string} userId - The user's ID (optional)
 * @returns {Promise<Object>} - Journey analytics data
 */
export async function getUserJourneyAnalytics(userId = null) {
  try {
    let filterFormula = '';
    if (userId) {
      filterFormula = `RECORD_ID() = '${userId}'`;
    }

    const users = await usersTable.select({
      filterByFormula: filterFormula,
      fields: [
        'Healing Name',
        'Email',
        'Registration Date',
        'Registration Source',
        'Onboarding Stage',
        'Journey Status',
        'Last Updated'
      ]
    }).all();

    const analytics = {
      totalUsers: users.length,
      registrationSources: {},
      onboardingStages: {},
      journeyStatuses: {},
      recentRegistrations: []
    };

    users.forEach(user => {
      const fields = user.fields;

      // Count registration sources
      const source = fields['Registration Source'] || 'Unknown';
      analytics.registrationSources[source] = (analytics.registrationSources[source] || 0) + 1;

      // Count onboarding stages
      const stage = fields['Onboarding Stage'] || 'Not Started';
      analytics.onboardingStages[stage] = (analytics.onboardingStages[stage] || 0) + 1;

      // Count journey statuses
      const status = fields['Journey Status'] || 'Unknown';
      analytics.journeyStatuses[status] = (analytics.journeyStatuses[status] || 0) + 1;

      // Add to recent registrations (last 30 days)
      const regDate = new Date(fields['Registration Date']);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (regDate >= thirtyDaysAgo) {
        analytics.recentRegistrations.push({
          id: user.id,
          healingName: fields['Healing Name'],
          email: fields['Email'],
          registrationDate: fields['Registration Date'],
          source: source
        });
      }
    });

    // Sort recent registrations by date (newest first)
    analytics.recentRegistrations.sort((a, b) =>
      new Date(b.registrationDate) - new Date(a.registrationDate)
    );

    return analytics;
  } catch (error) {
    console.error('Error getting user journey analytics:', error);
    throw new Error('Failed to get user journey analytics');
  }
}
