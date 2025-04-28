import axios from 'axios';
import { toast } from 'react-toastify';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    // Add Zero Data Retention header for privacy
    'data-retention': 'none',
  },
});

// Interfaces
export interface ChatRequest {
  message: string;
  healingName: string;
  consent: boolean;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

export interface ReflectionRequest {
  healingName: string;
  reflection: string;
  milestone: string;
}

// API Methods
export const sendChatMessage = async (data: ChatRequest): Promise<ChatResponse> => {
  try {
    const response = await api.post<ChatResponse>('/chat', data);
    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    toast.error('Failed to send message. Please try again.');
    throw error;
  }
};

export const submitReflection = async (data: ReflectionRequest): Promise<void> => {
  try {
    await api.post('/reflection', data);
    toast.success('Your reflection has been submitted successfully');
  } catch (error) {
    console.error('Error submitting reflection:', error);
    toast.error('Failed to submit reflection. Please try again.');
    throw error;
  }
};

export default api;