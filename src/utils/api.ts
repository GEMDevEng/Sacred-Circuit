import axios from 'axios';
import { toast } from 'react-toastify';
import { ApiResponse, ChatRequest as ChatRequestType, ChatResponse as ChatResponseType, ReflectionRequest as ReflectionRequestType } from '../types';
import { createSuccessResponse, createErrorResponse, handleApiError } from './api-response';
import { isValidChatMessage, isValidHealingName, isValidReflection } from './validators';

// Get API URL from environment or use default
const API_URL = typeof process !== 'undefined' && process.env && process.env.VITE_API_URL
  ? process.env.VITE_API_URL
  : 'http://localhost:3001/api';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    // Add Zero Data Retention header for privacy
    'data-retention': 'none',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with an error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Error: No response received', error.request);
    } else {
      // Error in setting up the request
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Legacy interfaces for backward compatibility
export interface ChatRequest {
  message: string;
  healingName: string;
  storeConversation: boolean;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

export interface ReflectionRequest {
  healingName: string;
  reflectionText: string;
  journeyDay?: string;
  emailConsent?: boolean;
}

/**
 * Sends a chat message to the API
 *
 * @param data - The chat request data
 * @returns A promise resolving to the chat response
 */
export const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
  try {
    // Validate input
    if (!isValidChatMessage(data.message)) {
      toast.error('Please enter a valid message');
      throw new Error('Invalid message');
    }

    if (!isValidHealingName(data.healingName)) {
      toast.error('Please enter a valid healing name');
      throw new Error('Invalid healing name');
    }

    // Map the request to match backend expectations
    const payload: ChatRequestType = {
      message: data.message,
      healingName: data.healingName,
      storeConversation: data.storeConversation
    };

    const response = await api.post<ApiResponse<ChatResponseType>>('/chat', payload);

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to send message');
    }
  } catch (error) {
    console.error('Error sending chat message:', error);
    toast.error('Failed to send message. Please try again.');
    throw error;
  }
};

/**
 * Submits a reflection to the API
 *
 * @param data - The reflection request data
 * @returns A promise that resolves when the reflection is submitted
 */
export const submitReflection = async (data: ReflectionRequest): Promise<void> => {
  try {
    // Validate input
    if (!isValidHealingName(data.healingName)) {
      toast.error('Please enter a valid healing name');
      throw new Error('Invalid healing name');
    }

    if (!isValidReflection(data.reflectionText)) {
      toast.error('Please enter a valid reflection');
      throw new Error('Invalid reflection');
    }

    // Map the request to match backend expectations
    const payload: ReflectionRequestType = {
      healingName: data.healingName,
      content: data.reflectionText,
      milestone: data.journeyDay || 'Not specified',
    };

    const response = await api.post<ApiResponse<void>>('/reflection', payload);

    if (response.data.success) {
      toast.success('Your reflection has been submitted successfully');
    } else {
      throw new Error(response.data.error || 'Failed to submit reflection');
    }
  } catch (error) {
    console.error('Error submitting reflection:', error);
    toast.error('Failed to submit reflection. Please try again.');
    throw error;
  }
};

export default api;