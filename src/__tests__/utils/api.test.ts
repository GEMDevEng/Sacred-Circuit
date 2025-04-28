import axios from 'axios';
import { toast } from 'react-toastify';
import { sendChatMessage, submitReflection } from '../../utils/api';

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
          message: 'This is a test response',
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
      expect(result).toEqual(mockResponse.data);
    });

    test('handles errors when sending chat message', async () => {
      // Mock error response
      const mockError = new Error('Network error');
      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      // Make sure the mock is properly set up
      expect(mockAxiosInstance.post).toBeDefined();

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
      mockAxiosInstance.post.mockResolvedValueOnce({ data: {} });

      // Make sure the mock is properly set up
      expect(mockAxiosInstance.post).toBeDefined();

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
        reflectionText: 'This is a test reflection',
        journeyDay: 'Day 7',
        emailConsent: true,
      });

      // Check that success toast was shown
      expect(toast.success).toHaveBeenCalledWith('Your reflection has been submitted successfully');
    });

    test('handles errors when submitting reflection', async () => {
      // Mock error response
      const mockError = new Error('Network error');
      mockAxiosInstance.post.mockRejectedValueOnce(mockError);

      // Make sure the mock is properly set up
      expect(mockAxiosInstance.post).toBeDefined();

      // Call the function
      try {
        await submitReflection({
          healingName: 'TestHealer',
          reflectionText: 'This is a test reflection',
          journeyDay: 'Day 7',
          emailConsent: true,
        });
      } catch (error) {
        // This is expected
      }

      // Check that error was logged and toast was shown
      expect(toast.error).toHaveBeenCalledWith('Failed to submit reflection. Please try again.');
    });
  });
});
