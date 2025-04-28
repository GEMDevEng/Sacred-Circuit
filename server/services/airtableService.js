import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Airtable
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const usersTable = base('Users');
const reflectionsTable = base('Reflections');

/**
 * Save a user reflection to Airtable
 * @param {Object} reflectionData - The reflection data
 * @returns {Promise<Object>} - The saved reflection
 */
export async function saveReflection(reflectionData) {
  try {
    const { healingName, reflectionText, journeyDay, emailConsent } = reflectionData;

    // Check if user exists
    const user = await findUserByHealingName(healingName);

    // Create reflection record with safe user linking
    const reflectionData = {
      'Healing Name': healingName,
      'Reflection Text': reflectionText,
      'Journey Day': journeyDay,
      'Timestamp': new Date().toISOString(),
      'Email Consent': emailConsent
    };

    // Only add user reference if user exists and has an id
    if (user && user.id) {
      reflectionData['User'] = [user.id];
    }

    const reflection = await reflectionsTable.create(reflectionData);

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
