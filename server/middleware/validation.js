import { validateSchema } from '../utils/validators.js';
import { sendErrorResponse } from '../utils/response-utils.js';

/**
 * Creates a middleware function that validates a request against a schema
 *
 * @param {Object} schema - The schema to validate against
 * @param {string} [location='body'] - The request property to validate (body, params, query)
 * @returns {Function} Express middleware function
 */
export function validateRequest(schema, location = 'body') {
  return (req, res, next) => {
    const data = req[location];
    const { isValid, errors } = validateSchema(data, schema);

    if (!isValid) {
      return sendErrorResponse(res, {
        message: 'Validation error',
        errors
      }, 400);
    }

    next();
  };
}

/**
 * Schema for chat request validation
 */
export const chatRequestSchema = {
  required: ['message', 'healingName'],
  properties: {
    message: {
      type: 'string',
      minLength: 1,
      maxLength: 1000
    },
    healingName: {
      type: 'string',
      minLength: 2,
      maxLength: 50
    },
    storeConversation: {
      type: 'boolean'
    }
  }
};

/**
 * Schema for reflection request validation
 */
export const reflectionRequestSchema = {
  required: ['healingName', 'content'],
  properties: {
    healingName: {
      type: 'string',
      minLength: 2,
      maxLength: 50
    },
    content: {
      type: 'string',
      minLength: 1,
      maxLength: 5000
    },
    milestone: {
      type: 'string',
      enum: ['Day 1', 'Day 7', 'Day 14', 'Day 21', 'Day 30', 'Day 60', 'Day 90']
    }
  }
};

/**
 * Schema for webhook request validation (Typeform)
 */
export const webhookRequestSchema = {
  required: ['form_response'],
  properties: {
    form_response: {
      type: 'object',
      required: ['answers', 'submitted_at'],
      properties: {
        answers: {
          type: 'array'
        },
        submitted_at: {
          type: 'string'
        }
      }
    }
  }
};

/**
 * Schema for Google Forms webhook request validation
 */
export const googleFormsWebhookSchema = {
  required: ['healingName', 'email'],
  properties: {
    healingName: {
      type: 'string',
      minLength: 2,
      maxLength: 100
    },
    email: {
      type: 'string',
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' // Email regex pattern
    },
    healingGoals: {
      type: 'string',
      maxLength: 1000
    },
    fastingExperience: {
      type: 'string',
      maxLength: 500
    },
    emailConsent: {
      type: 'boolean'
    },
    timestamp: {
      type: 'string'
    }
  }
};

/**
 * Schema for user analytics request validation
 */
export const analyticsRequestSchema = {
  properties: {
    userId: {
      type: 'string',
      minLength: 1
    },
    startDate: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$' // YYYY-MM-DD format
    },
    endDate: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}$' // YYYY-MM-DD format
    }
  }
};

/**
 * Schema for onboarding stage update validation
 */
export const onboardingUpdateSchema = {
  required: ['userId', 'stage'],
  properties: {
    userId: {
      type: 'string',
      minLength: 1
    },
    stage: {
      type: 'string',
      enum: [
        'Form Submitted',
        'Welcome Email Sent',
        'Email Verified',
        'Chatbot Accessed',
        'First Reflection',
        'Journey Active',
        'Journey Completed'
      ]
    }
  }
};
