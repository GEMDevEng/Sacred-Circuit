import axios from 'axios';
import { toast } from 'react-toastify';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
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

// Interfaces
export interface ChatRequest {
  message: string;
  healingName: string;
  storeConversation: boolean; // Renamed from consent to match backend
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

export interface ReflectionRequest {
  healingName: string;
  reflectionText: string; // Changed from reflection to match backend
  journeyDay?: string;    // Changed from milestone to match backend
  emailConsent?: boolean; // Added to match backend
}

// API Methods
export const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
  try {
    // Map the request to match backend expectations
    const payload = {
      message: data.message,
      healingName: data.healingName,
      storeConversation: data.storeConversation
    };

    const response = await api.post<ChatResponse>('/chat', payload);
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    toast.error('Failed to send message. Please try again.');
    throw error;
  }
};

export const submitReflection = async (data: ReflectionRequest): Promise<void> => {
  try {
    // Map the request to match backend expectations
    const payload = {
      healingName: data.healingName,
      reflectionText: data.reflectionText,
      journeyDay: data.journeyDay || 'Not specified',
      emailConsent: data.emailConsent || false
    };

    await api.post('/reflection', payload);
    toast.success('Your reflection has been submitted successfully');
  } catch (error) {
    console.error('Error submitting reflection:', error);
    toast.error('Failed to submit reflection. Please try again.');
    throw error;
  }
};

export default api;