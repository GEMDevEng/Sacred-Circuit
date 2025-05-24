import { jest } from '@jest/globals';

// Mock googleapis
const mockSheets = {
  spreadsheets: {
    get: jest.fn(),
    values: {
      get: jest.fn(),
      update: jest.fn()
    },
    batchUpdate: jest.fn()
  }
};

const mockAuth = {
  GoogleAuth: jest.fn().mockImplementation(() => ({}))
};

const mockGoogle = {
  auth: mockAuth,
  sheets: jest.fn().mockReturnValue(mockSheets)
};

jest.unstable_mockModule('googleapis', () => ({
  google: mockGoogle
}));

// Mock environment variables
process.env.GOOGLE_SHEETS_SPREADSHEET_ID = 'test-spreadsheet-id';
process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@example.com';
process.env.GOOGLE_PRIVATE_KEY = Buffer.from('test-private-key').toString('base64');

// Import the service after mocking
const {
  findUserByHealingName,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  saveReflection,
  getReflectionsByHealingName,
  getReflectionsByUserId,
  storeConversation,
  saveFeedback,
  getAllFeedback,
  updateFeedbackStatus,
  processTypeformSubmission
} = await import('../../services/googleSheetsService.js');

describe('Google Sheets Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Management', () => {
    describe('findUserByHealingName', () => {
      test('should find user by healing name', async () => {
        const mockUserData = [
          ['ID', 'Healing Name', 'Email', 'Password Hash', 'Role', 'Registration Date', 'Journey Status', 'Email Consent', 'Healing Goals', 'Last Updated'],
          ['user-123', 'TestHealer', 'test@example.com', 'hashed-password', 'user', '2023-01-01T00:00:00Z', 'Active', 'true', 'Test goals', '2023-01-01T00:00:00Z']
        ];

        mockSheets.spreadsheets.values.get.mockResolvedValue({
          data: { values: mockUserData }
        });

        const result = await findUserByHealingName('TestHealer');

        expect(result).toEqual({
          id: 'user-123',
          healingName: 'TestHealer',
          email: 'test@example.com',
          passwordHash: 'hashed-password',
          role: 'user',
          registrationDate: '2023-01-01T00:00:00Z',
          journeyStatus: 'Active',
          emailConsent: true,
          healingGoals: 'Test goals',
          lastUpdated: '2023-01-01T00:00:00Z'
        });

        expect(mockSheets.spreadsheets.values.get).toHaveBeenCalledWith({
          spreadsheetId: 'test-spreadsheet-id',
          range: 'Users!A:J'
        });
      });

      test('should return null if user not found', async () => {
        mockSheets.spreadsheets.values.get.mockResolvedValue({
          data: { values: [['ID', 'Healing Name', 'Email']] }
        });

        const result = await findUserByHealingName('NonExistentUser');
        expect(result).toBeNull();
      });

      test('should handle errors gracefully', async () => {
        mockSheets.spreadsheets.values.get.mockRejectedValue(new Error('API Error'));

        const result = await findUserByHealingName('TestHealer');
        expect(result).toBeNull();
      });
    });

    describe('createUser', () => {
      test('should create a new user', async () => {
        // Mock getting next row
        mockSheets.spreadsheets.values.get.mockResolvedValue({
          data: { values: [['ID'], ['existing-user']] }
        });

        // Mock update operation
        mockSheets.spreadsheets.values.update.mockResolvedValue({
          data: { updatedRows: 1 }
        });

        const userData = {
          healingName: 'NewUser',
          email: 'new@example.com',
          passwordHash: 'hashed-password',
          role: 'user'
        };

        const result = await createUser(userData);

        expect(result).toEqual({
          id: expect.stringMatching(/^gs_\d+_[a-z0-9]+$/),
          healingName: 'NewUser',
          email: 'new@example.com',
          role: 'user',
          created: true
        });

        expect(mockSheets.spreadsheets.values.update).toHaveBeenCalled();
      });
    });
  });

  describe('Reflection Management', () => {
    describe('saveReflection', () => {
      test('should save a reflection', async () => {
        // Mock getting next row
        mockSheets.spreadsheets.values.get.mockResolvedValue({
          data: { values: [['ID'], ['existing-reflection']] }
        });

        // Mock update operation
        mockSheets.spreadsheets.values.update.mockResolvedValue({
          data: { updatedRows: 1 }
        });

        const reflectionData = {
          healingName: 'TestHealer',
          reflectionText: 'This is my reflection',
          journeyDay: 'Day 7',
          emailConsent: true,
          userId: 'user-123'
        };

        const result = await saveReflection(reflectionData);

        expect(result).toEqual({
          id: expect.stringMatching(/^gs_\d+_[a-z0-9]+$/),
          healingName: 'TestHealer',
          journeyDay: 'Day 7',
          timestamp: expect.any(String),
          success: true
        });

        expect(mockSheets.spreadsheets.values.update).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle Google Sheets API errors gracefully', async () => {
      mockSheets.spreadsheets.values.get.mockRejectedValue(new Error('API Error'));

      const result = await findUserByHealingName('TestUser');
      expect(result).toBeNull();
    });

    test('should throw error when creating user fails', async () => {
      mockSheets.spreadsheets.values.get.mockResolvedValue({
        data: { values: [['ID']] }
      });
      mockSheets.spreadsheets.values.update.mockRejectedValue(new Error('Update failed'));

      await expect(createUser({ healingName: 'Test' })).rejects.toThrow('Failed to create user');
    });
  });
});
