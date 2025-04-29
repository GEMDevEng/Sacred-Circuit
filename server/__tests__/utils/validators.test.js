import {
  isValidHealingName,
  isValidEmail,
  isValidChatMessage,
  isValidReflection,
  isValidMilestone,
  hasRequiredFields,
  validateSchema
} from '../../utils/validators.js';

describe('Validator Utilities', () => {
  describe('isValidHealingName', () => {
    test('returns true for valid healing names', () => {
      expect(isValidHealingName('Serenity')).toBe(true);
      expect(isValidHealingName('Ocean Heart')).toBe(true);
      expect(isValidHealingName('Mountain Spirit 123')).toBe(true);
    });

    test('returns false for invalid healing names', () => {
      expect(isValidHealingName('')).toBe(false);
      expect(isValidHealingName('a')).toBe(false);
      expect(isValidHealingName('a'.repeat(51))).toBe(false);
      expect(isValidHealingName(null)).toBe(false);
      expect(isValidHealingName(undefined)).toBe(false);
      expect(isValidHealingName(123)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    test('returns true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    test('returns false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
      expect(isValidEmail(123)).toBe(false);
    });
  });

  describe('isValidChatMessage', () => {
    test('returns true for valid chat messages', () => {
      expect(isValidChatMessage('Hello')).toBe(true);
      expect(isValidChatMessage('This is a longer message.')).toBe(true);
    });

    test('returns false for invalid chat messages', () => {
      expect(isValidChatMessage('')).toBe(false);
      expect(isValidChatMessage('   ')).toBe(false);
      expect(isValidChatMessage('a'.repeat(1001))).toBe(false);
      expect(isValidChatMessage(null)).toBe(false);
      expect(isValidChatMessage(undefined)).toBe(false);
      expect(isValidChatMessage(123)).toBe(false);
    });
  });

  describe('isValidReflection', () => {
    test('returns true for valid reflections', () => {
      expect(isValidReflection('My reflection')).toBe(true);
      expect(isValidReflection('This is a longer reflection about my journey.')).toBe(true);
    });

    test('returns false for invalid reflections', () => {
      expect(isValidReflection('')).toBe(false);
      expect(isValidReflection('   ')).toBe(false);
      expect(isValidReflection('a'.repeat(5001))).toBe(false);
      expect(isValidReflection(null)).toBe(false);
      expect(isValidReflection(undefined)).toBe(false);
      expect(isValidReflection(123)).toBe(false);
    });
  });

  describe('isValidMilestone', () => {
    test('returns true for valid milestones', () => {
      expect(isValidMilestone('Day 1')).toBe(true);
      expect(isValidMilestone('Day 7')).toBe(true);
      expect(isValidMilestone('Day 14')).toBe(true);
      expect(isValidMilestone('Day 21')).toBe(true);
      expect(isValidMilestone('Day 30')).toBe(true);
      expect(isValidMilestone('Day 60')).toBe(true);
      expect(isValidMilestone('Day 90')).toBe(true);
    });

    test('returns false for invalid milestones', () => {
      expect(isValidMilestone('')).toBe(false);
      expect(isValidMilestone('Day')).toBe(false);
      expect(isValidMilestone('Day 2')).toBe(false);
      expect(isValidMilestone('day 7')).toBe(false);
      expect(isValidMilestone(null)).toBe(false);
      expect(isValidMilestone(undefined)).toBe(false);
      expect(isValidMilestone(123)).toBe(false);
    });
  });

  describe('hasRequiredFields', () => {
    test('returns true when all required fields are present', () => {
      const obj = { name: 'Test', email: 'test@example.com', age: 30 };
      expect(hasRequiredFields(obj, ['name', 'email'])).toBe(true);
      expect(hasRequiredFields(obj, ['name', 'email', 'age'])).toBe(true);
    });

    test('returns false when required fields are missing', () => {
      const obj = { name: 'Test', email: '' };
      expect(hasRequiredFields(obj, ['name', 'email'])).toBe(false);
      expect(hasRequiredFields(obj, ['name', 'email', 'age'])).toBe(false);
    });

    test('handles empty objects', () => {
      expect(hasRequiredFields({}, ['name'])).toBe(false);
    });

    test('handles empty required fields array', () => {
      expect(hasRequiredFields({ name: 'Test' }, [])).toBe(true);
    });

    test('handles null or undefined objects', () => {
      expect(hasRequiredFields(null, ['name'])).toBe(false);
      expect(hasRequiredFields(undefined, ['name'])).toBe(false);
    });
  });

  describe('validateSchema', () => {
    test('validates required fields', () => {
      const schema = {
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' }
        }
      };

      // Valid case
      expect(validateSchema({ name: 'Test', email: 'test@example.com' }, schema)).toEqual({
        isValid: true,
        errors: []
      });

      // Missing field
      expect(validateSchema({ name: 'Test' }, schema)).toEqual({
        isValid: false,
        errors: ['email is required']
      });
    });

    test('validates field types', () => {
      const schema = {
        properties: {
          name: { type: 'string' },
          age: { type: 'number' }
        }
      };

      // Valid case
      expect(validateSchema({ name: 'Test', age: 30 }, schema)).toEqual({
        isValid: true,
        errors: []
      });

      // Invalid type
      expect(validateSchema({ name: 'Test', age: 'thirty' }, schema)).toEqual({
        isValid: false,
        errors: ['age must be a number']
      });
    });

    test('validates string constraints', () => {
      const schema = {
        properties: {
          name: { 
            type: 'string',
            minLength: 2,
            maxLength: 10
          },
          email: {
            type: 'string',
            pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
          }
        }
      };

      // Valid case
      expect(validateSchema({ name: 'Test', email: 'test@example.com' }, schema)).toEqual({
        isValid: true,
        errors: []
      });

      // Too short
      expect(validateSchema({ name: 'T', email: 'test@example.com' }, schema)).toEqual({
        isValid: false,
        errors: ['name must be at least 2 characters']
      });

      // Too long
      expect(validateSchema({ name: 'TestTestTest', email: 'test@example.com' }, schema)).toEqual({
        isValid: false,
        errors: ['name must be at most 10 characters']
      });

      // Invalid pattern
      expect(validateSchema({ name: 'Test', email: 'invalid-email' }, schema)).toEqual({
        isValid: false,
        errors: ['email has an invalid format']
      });
    });

    test('validates number constraints', () => {
      const schema = {
        properties: {
          age: { 
            type: 'number',
            minimum: 18,
            maximum: 100
          }
        }
      };

      // Valid case
      expect(validateSchema({ age: 30 }, schema)).toEqual({
        isValid: true,
        errors: []
      });

      // Too small
      expect(validateSchema({ age: 17 }, schema)).toEqual({
        isValid: false,
        errors: ['age must be at least 18']
      });

      // Too large
      expect(validateSchema({ age: 101 }, schema)).toEqual({
        isValid: false,
        errors: ['age must be at most 100']
      });
    });

    test('validates enum constraints', () => {
      const schema = {
        properties: {
          status: { 
            type: 'string',
            enum: ['active', 'inactive', 'pending']
          }
        }
      };

      // Valid case
      expect(validateSchema({ status: 'active' }, schema)).toEqual({
        isValid: true,
        errors: []
      });

      // Invalid value
      expect(validateSchema({ status: 'deleted' }, schema)).toEqual({
        isValid: false,
        errors: ['status must be one of: active, inactive, pending']
      });
    });

    test('validates multiple fields and constraints', () => {
      const schema = {
        required: ['name', 'email', 'age'],
        properties: {
          name: { 
            type: 'string',
            minLength: 2,
            maxLength: 50
          },
          email: {
            type: 'string',
            pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
          },
          age: {
            type: 'number',
            minimum: 18
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive']
          }
        }
      };

      // Valid case
      expect(validateSchema({
        name: 'Test User',
        email: 'test@example.com',
        age: 30,
        status: 'active'
      }, schema)).toEqual({
        isValid: true,
        errors: []
      });

      // Multiple errors
      expect(validateSchema({
        name: 'T',
        email: 'invalid-email',
        age: 17,
        status: 'deleted'
      }, schema)).toEqual({
        isValid: false,
        errors: [
          'name must be at least 2 characters',
          'email has an invalid format',
          'age must be at least 18',
          'status must be one of: active, inactive'
        ]
      });
    });
  });
});
