import {
  isValidHealingName,
  isValidEmail,
  isValidChatMessage,
  isValidReflection,
  isValidMilestone,
  hasRequiredFields
} from '../../utils/validators';

describe('Validator Utilities', () => {
  describe('isValidHealingName', () => {
    it('returns true for valid healing names', () => {
      expect(isValidHealingName('Serenity')).toBe(true);
      expect(isValidHealingName('Ocean Heart')).toBe(true);
      expect(isValidHealingName('Mountain Spirit 123')).toBe(true);
    });

    it('returns false for invalid healing names', () => {
      expect(isValidHealingName('')).toBe(false);
      expect(isValidHealingName('a')).toBe(false);
      expect(isValidHealingName('a'.repeat(51))).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isValidHealingName(null)).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isValidHealingName(undefined)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('returns true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('returns false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isValidEmail(null)).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidChatMessage', () => {
    it('returns true for valid chat messages', () => {
      expect(isValidChatMessage('Hello')).toBe(true);
      expect(isValidChatMessage('This is a longer message.')).toBe(true);
    });

    it('returns false for invalid chat messages', () => {
      expect(isValidChatMessage('')).toBe(false);
      expect(isValidChatMessage('   ')).toBe(false);
      expect(isValidChatMessage('a'.repeat(1001))).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isValidChatMessage(null)).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isValidChatMessage(undefined)).toBe(false);
    });
  });

  describe('isValidReflection', () => {
    it('returns true for valid reflections', () => {
      expect(isValidReflection('My reflection')).toBe(true);
      expect(isValidReflection('This is a longer reflection about my journey.')).toBe(true);
    });

    it('returns false for invalid reflections', () => {
      expect(isValidReflection('')).toBe(false);
      expect(isValidReflection('   ')).toBe(false);
      expect(isValidReflection('a'.repeat(5001))).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isValidReflection(null)).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isValidReflection(undefined)).toBe(false);
    });
  });

  describe('isValidMilestone', () => {
    it('returns true for valid milestones', () => {
      expect(isValidMilestone('Day 1')).toBe(true);
      expect(isValidMilestone('Day 7')).toBe(true);
      expect(isValidMilestone('Day 14')).toBe(true);
      expect(isValidMilestone('Day 21')).toBe(true);
      expect(isValidMilestone('Day 30')).toBe(true);
      expect(isValidMilestone('Day 60')).toBe(true);
      expect(isValidMilestone('Day 90')).toBe(true);
    });

    it('returns false for invalid milestones', () => {
      expect(isValidMilestone('')).toBe(false);
      expect(isValidMilestone('Day')).toBe(false);
      expect(isValidMilestone('Day 2')).toBe(false);
      expect(isValidMilestone('day 7')).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isValidMilestone(null)).toBe(false);
      // @ts-expect-error Testing invalid input
      expect(isValidMilestone(undefined)).toBe(false);
    });
  });

  describe('hasRequiredFields', () => {
    it('returns true when all required fields are present', () => {
      const obj = { name: 'Test', email: 'test@example.com', age: 30 };
      expect(hasRequiredFields(obj, ['name', 'email'])).toBe(true);
      expect(hasRequiredFields(obj, ['name', 'email', 'age'])).toBe(true);
    });

    it('returns false when required fields are missing', () => {
      const obj = { name: 'Test', email: '' };
      expect(hasRequiredFields(obj, ['name', 'email'])).toBe(false);
      expect(hasRequiredFields(obj, ['name', 'email', 'age'])).toBe(false);
    });

    it('handles empty objects', () => {
      expect(hasRequiredFields({}, ['name'])).toBe(false);
    });

    it('handles empty required fields array', () => {
      expect(hasRequiredFields({ name: 'Test' }, [])).toBe(true);
    });
  });
});
