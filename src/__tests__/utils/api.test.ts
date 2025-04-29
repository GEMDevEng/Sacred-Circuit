import axios from 'axios';
import { toast } from 'react-toastify';
import { sendChatMessage, submitReflection } from '../../utils/api';
import * as validators from '../../utils/validators';

// Mock axios
jest.mock('axios', () => {
  const mockAxiosInstance = {
    post: jest.fn().mockImplementation(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };
  return {
    create: jest.fn(() => mockAxiosInstance),
  };
});

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock validators
jest.mock('../../utils/validators', () => ({
  isValidChatMessage: jest.fn().mockReturnValue(true),
  isValidHealingName: jest.fn().mockReturnValue(true),
  isValidReflection: jest.fn().mockReturnValue(true),
  isValidMilestone: jest.fn().mockReturnValue(true),
  hasRequiredFields: jest.fn().mockReturnValue(true),
}));

describe('API Utilities', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Get the mocked axios instance
    mockAxiosInstance = (axios.create as jest.Mock)();
  });

  describe('sendChatMessage', () => {
    test('sends chat message and returns response data', async () => {
      // Mock successful response
      const mockResponse = {
        data: {
          success: true,
          data: {
            message: 'This is a test response',
            timestamp: '2023-04-28T12:00:00Z',
          },
          timestamp: '2023-04-28T12:00:00Z',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      // Make sure the mock is properly set up
      expect(mockAxiosInstance.post).toBeDefined();

      // Call the function
      const result = await sendChatMessage({
        message: 'Hello',
        healingName: 'TestHealer',
        storeConversation: false,
      });

      // Check that axios.post was called with correct parameters
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/chat', {
        message: 'Hello',
        healingName: 'TestHealer',
        storeConversation: false,
      });

      // Check that the function returns the response data
      expect(result).toEqual(mockResponse.data.data);
    });

    test('validates input before sending', async () => {
      // Mock validators to fail
      (validators.isValidChatMessage as jest.Mock).mockReturnValueOnce(false);

      // Call the function and expect it to throw
      await expect(
        sendChatMessage({
          message: '',
          healingName: 'TestHealer',
          storeConversation: false,
        })
      ).rejects.toThrow('Invalid message');

      // Check that error toast was shown
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid message');

      // Reset mock and test healing name validation
      (validators.isValidChatMessage as jest.Mock).mockReturnValueOnce(true);
      (validators.isValidHealingName as jest.Mock).mockReturnValueOnce(false);

      await expect(
        sendChatMessage({
          message: 'Hello',
          healingName: '',
          storeConversation: false,
        })
      ).rejects.toThrow('Invalid healing name');

      expect(toast.error).toHaveBeenCalledWith('Please enter a valid healing name');
    });

    test('handles API error responses', async () => {
      // Mock error response from API
      const mockResponse = {
        data: {
          success: false,
          error: 'API error message',
          timestamp: '2023-04-28T12:00:00Z',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      // Call the function and expect it to throw
      await expect(
        sendChatMessage({
          message: 'Hello',
          healingName: 'TestHealer',
          storeConversation: false,
        })
      ).rejects.toThrow('API error message');

      // Check that error was logged
      expect(console.error).toHaveBeenCalled();
    });

    test('handles network errors', async () => {
      // Mock network error
      const mockError = new Error('Network error');
      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      // Call the function and expect it to throw
      await expect(
        sendChatMessage({
          message: 'Hello',
          healingName: 'TestHealer',
          storeConversation: false,
        })
      ).rejects.toThrow();

      // Check that error was logged and toast was shown
      expect(toast.error).toHaveBeenCalledWith('Failed to send message. Please try again.');
    });
  });

  describe('submitReflection', () => {
    test('submits reflection successfully', async () => {
      // Mock successful response
      const mockResponse = {
        data: {
          success: true,
          timestamp: '2023-04-28T12:00:00Z',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      // Call the function
      await submitReflection({
        healingName: 'TestHealer',
        reflectionText: 'This is a test reflection',
        journeyDay: 'Day 7',
        emailConsent: true,
      });

      // Check that axios.post was called with correct parameters
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/reflection', {
        healingName: 'TestHealer',
        content: 'This is a test reflection',
        milestone: 'Day 7',
      });

      // Check that success toast was shown
      expect(toast.success).toHaveBeenCalledWith('Your reflection has been submitted successfully');
    });

    test('validates input before submitting', async () => {
      // Mock validators to fail
      (validators.isValidHealingName as jest.Mock).mockReturnValueOnce(false);

      // Call the function and expect it to throw
      await expect(
        submitReflection({
          healingName: '',
          reflectionText: 'This is a test reflection',
          journeyDay: 'Day 7',
        })
      ).rejects.toThrow('Invalid healing name');

      // Check that error toast was shown
      expect(toast.error).toHaveBeenCalledWith('Please enter a valid healing name');

      // Reset mock and test reflection validation
      (validators.isValidHealingName as jest.Mock).mockReturnValueOnce(true);
      (validators.isValidReflection as jest.Mock).mockReturnValueOnce(false);

      await expect(
        submitReflection({
          healingName: 'TestHealer',
          reflectionText: '',
          journeyDay: 'Day 7',
        })
      ).rejects.toThrow('Invalid reflection');

      expect(toast.error).toHaveBeenCalledWith('Please enter a valid reflection');
    });

    test('handles API error responses', async () => {
      // Mock error response from API
      const mockResponse = {
        data: {
          success: false,
          error: 'API error message',
          timestamp: '2023-04-28T12:00:00Z',
        },
      };

      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      // Call the function and expect it to throw
      await expect(
        submitReflection({
          healingName: 'TestHealer',
          reflectionText: 'This is a test reflection',
          journeyDay: 'Day 7',
        })
      ).rejects.toThrow('API error message');

      // Check that error was logged
      expect(console.error).toHaveBeenCalled();
    });

    test('handles network errors', async () => {
      // Mock network error
      const mockError = new Error('Network error');
      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      // Call the function and expect it to throw
      await expect(
        submitReflection({
          healingName: 'TestHealer',
          reflectionText: 'This is a test reflection',
          journeyDay: 'Day 7',
        })
      ).rejects.toThrow();

      // Check that error was logged and toast was shown
      expect(toast.error).toHaveBeenCalledWith('Failed to submit reflection. Please try again.');
    });
  });
});
