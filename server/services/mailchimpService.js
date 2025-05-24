import Mailchimp from 'mailchimp-api-v3';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Mailchimp client
let mailchimp;
let listId;

try {
  if (!process.env.MAILCHIMP_API_KEY) {
    throw new Error('MAILCHIMP_API_KEY is required');
  }
  
  mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
  listId = process.env.MAILCHIMP_LIST_ID;
  
  if (!listId) {
    throw new Error('MAILCHIMP_LIST_ID is required');
  }
} catch (error) {
  console.warn('Mailchimp configuration error:', error.message);
  
  // Create mock Mailchimp client for development
  mailchimp = {
    post: async () => ({
      id: 'mock-subscriber-' + Date.now(),
      email_address: 'mock@example.com',
      status: 'subscribed'
    }),
    patch: async () => ({
      id: 'mock-subscriber-' + Date.now(),
      email_address: 'mock@example.com',
      merge_fields: {}
    }),
    get: async () => ({
      members: []
    })
  };
  listId = 'mock-list-id';
}

/**
 * Add a new subscriber to Mailchimp
 * @param {Object} subscriberData - The subscriber data
 * @param {string} subscriberData.email - Subscriber email
 * @param {string} subscriberData.healingName - Subscriber healing name
 * @param {string} subscriberData.healingGoals - Subscriber healing goals
 * @param {string} subscriberData.fastingExperience - Subscriber fasting experience
 * @returns {Promise<Object>} - The Mailchimp response
 */
export async function addSubscriberToMailchimp(subscriberData) {
  try {
    const { email, healingName, healingGoals, fastingExperience } = subscriberData;

    // Validate required fields
    if (!email || !healingName) {
      throw new Error('Email and Healing Name are required');
    }

    // Check if subscriber already exists
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    let existingSubscriber;
    try {
      existingSubscriber = await mailchimp.get(`/lists/${listId}/members/${subscriberHash}`);
    } catch (error) {
      // Subscriber doesn't exist, which is fine
      existingSubscriber = null;
    }

    const subscriberPayload = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: healingName.split(' ')[0] || healingName, // First name
        LNAME: healingName.split(' ').slice(1).join(' ') || '', // Last name
        HEALING_NAME: healingName,
        HEALING_GOALS: healingGoals || '',
        FASTING_EXP: fastingExperience || '',
        JOURNEY_START: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        CURRENT_MILESTONE: 'Day 1',
        SIGNUP_SOURCE: 'Google Forms'
      },
      tags: ['Sacred Healing Journey', 'Google Forms Signup']
    };

    let response;
    if (existingSubscriber) {
      // Update existing subscriber
      response = await mailchimp.patch(`/lists/${listId}/members/${subscriberHash}`, {
        merge_fields: subscriberPayload.merge_fields,
        tags: subscriberPayload.tags
      });
      console.log(`Updated existing Mailchimp subscriber: ${email}`);
    } else {
      // Add new subscriber
      response = await mailchimp.post(`/lists/${listId}/members`, subscriberPayload);
      console.log(`Added new Mailchimp subscriber: ${email}`);
    }

    return {
      id: response.id,
      email: response.email_address,
      status: response.status,
      healingName: healingName,
      isNew: !existingSubscriber
    };
  } catch (error) {
    console.error('Mailchimp error:', error);
    
    // If it's a duplicate subscriber error, that's okay
    if (error.title === 'Member Exists') {
      console.log(`Subscriber ${subscriberData.email} already exists in Mailchimp`);
      return {
        email: subscriberData.email,
        status: 'already_subscribed',
        healingName: subscriberData.healingName,
        isNew: false
      };
    }
    
    throw new Error(`Failed to add subscriber to Mailchimp: ${error.message}`);
  }
}

/**
 * Update subscriber milestone in Mailchimp
 * @param {string} email - Subscriber email
 * @param {string} milestone - New milestone (e.g., "Day 7", "Day 14")
 * @returns {Promise<Object>} - The updated subscriber data
 */
export async function updateSubscriberMilestone(email, milestone) {
  try {
    if (!email || !milestone) {
      throw new Error('Email and milestone are required');
    }

    // Get the subscriber hash (MD5 hash of lowercase email)
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    // Update the subscriber
    const response = await mailchimp.patch(`/lists/${listId}/members/${subscriberHash}`, {
      merge_fields: {
        CURRENT_MILESTONE: milestone,
        LAST_UPDATED: new Date().toISOString().split('T')[0]
      }
    });

    console.log(`Updated milestone for ${email} to ${milestone}`);

    return {
      id: response.id,
      email: response.email_address,
      currentMilestone: response.merge_fields.CURRENT_MILESTONE,
      lastUpdated: response.merge_fields.LAST_UPDATED
    };
  } catch (error) {
    console.error('Mailchimp milestone update error:', error);
    throw new Error(`Failed to update subscriber milestone: ${error.message}`);
  }
}

/**
 * Get subscriber information from Mailchimp
 * @param {string} email - Subscriber email
 * @returns {Promise<Object>} - The subscriber data
 */
export async function getSubscriberInfo(email) {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    // Get the subscriber hash (MD5 hash of lowercase email)
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    // Get the subscriber
    const response = await mailchimp.get(`/lists/${listId}/members/${subscriberHash}`);

    return {
      id: response.id,
      email: response.email_address,
      status: response.status,
      healingName: response.merge_fields.HEALING_NAME,
      currentMilestone: response.merge_fields.CURRENT_MILESTONE,
      journeyStart: response.merge_fields.JOURNEY_START,
      lastUpdated: response.merge_fields.LAST_UPDATED,
      tags: response.tags.map(tag => tag.name)
    };
  } catch (error) {
    if (error.status === 404) {
      return null; // Subscriber not found
    }
    console.error('Mailchimp get subscriber error:', error);
    throw new Error(`Failed to get subscriber info: ${error.message}`);
  }
}

/**
 * Trigger a specific automation email
 * @param {string} email - Subscriber email
 * @param {string} automationId - Mailchimp automation ID
 * @param {string} emailId - Specific email ID within the automation
 * @returns {Promise<Object>} - The trigger response
 */
export async function triggerAutomationEmail(email, automationId, emailId) {
  try {
    if (!email || !automationId || !emailId) {
      throw new Error('Email, automation ID, and email ID are required');
    }

    // Get the subscriber hash
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    // Trigger the automation email
    const response = await mailchimp.post(`/automations/${automationId}/emails/${emailId}/queue`, {
      email_address: email
    });

    console.log(`Triggered automation email for ${email}: ${automationId}/${emailId}`);

    return {
      email: email,
      automationId: automationId,
      emailId: emailId,
      triggered: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Mailchimp automation trigger error:', error);
    throw new Error(`Failed to trigger automation email: ${error.message}`);
  }
}

/**
 * Send a welcome email immediately
 * @param {Object} subscriberData - The subscriber data
 * @returns {Promise<Object>} - The email send response
 */
export async function sendWelcomeEmail(subscriberData) {
  try {
    const { email, healingName } = subscriberData;

    if (!email || !healingName) {
      throw new Error('Email and healing name are required');
    }

    // Create a campaign for the welcome email
    const campaign = await mailchimp.post('/campaigns', {
      type: 'regular',
      recipients: {
        list_id: listId,
        segment_opts: {
          match: 'any',
          conditions: [{
            condition_type: 'EmailAddress',
            field: 'EMAIL',
            op: 'is',
            value: email
          }]
        }
      },
      settings: {
        subject_line: `Welcome to Your Sacred Healing Journey, ${healingName}`,
        from_name: 'Sacred Healing Team',
        reply_to: process.env.REPLY_TO_EMAIL || 'support@sacredhealing.com',
        template_id: parseInt(process.env.MAILCHIMP_WELCOME_TEMPLATE_ID) || undefined
      }
    });

    // Send the campaign
    await mailchimp.post(`/campaigns/${campaign.id}/actions/send`);

    console.log(`Sent welcome email to ${email}`);

    return {
      campaignId: campaign.id,
      email: email,
      healingName: healingName,
      sent: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Welcome email send error:', error);
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
}

export default {
  addSubscriberToMailchimp,
  updateSubscriberMilestone,
  getSubscriberInfo,
  triggerAutomationEmail,
  sendWelcomeEmail
};
