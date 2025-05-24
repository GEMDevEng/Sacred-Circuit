import axios from 'axios';
import { toast } from 'react-toastify';
import { ApiResponse, ChatRequest as ChatRequestType, ChatResponse as ChatResponseType, ReflectionRequest as ReflectionRequestType } from '../types';
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

// Add request interceptor to include auth token and CSRF token
api.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage
    const token = localStorage.getItem('token');

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Get CSRF token from localStorage
    const csrfToken = localStorage.getItem('csrfToken');

    // If CSRF token exists and this is a mutating request, add it to the headers
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh`);

        if (response.data.success && response.data.data?.accessToken) {
          // Store the new token
          localStorage.setItem('token', response.data.data.accessToken);

          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;

          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Token refresh failed:', refreshError);

        // Clear token and redirect to login
        localStorage.removeItem('token');

        // If we're in a browser environment, redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

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
 * Sends a chat message to the API with enhanced context
 *
 * @param data - The chat request data
 * @param isAuthenticated - Whether the user is authenticated
 * @returns A promise resolving to the chat response
 */
export const sendChatMessage = async (data: ChatRequest & {
  conversationId?: string;
  context?: any;
}, isAuthenticated: boolean = false): Promise<ChatResponse> => {
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
    const payload: ChatRequestType & {
      conversationId?: string;
      context?: any;
    } = {
      message: data.message,
      healingName: data.healingName,
      storeConversation: data.storeConversation,
      conversationId: data.conversationId,
      context: data.context
    };

    // Use secure endpoint if authenticated
    const endpoint = isAuthenticated ? '/chat/secure' : '/chat';
    const response = await api.post<ApiResponse<ChatResponseType>>(endpoint, payload);

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error ?? 'Failed to send message');
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
 * @param isAuthenticated - Whether the user is authenticated
 * @returns A promise that resolves when the reflection is submitted
 */
export const submitReflection = async (data: ReflectionRequest, isAuthenticated: boolean = false): Promise<void> => {
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
      milestone: data.journeyDay ?? 'Not specified',
    };

    // Use secure endpoint if authenticated
    const endpoint = isAuthenticated ? '/reflection/secure' : '/reflection';
    const response = await api.post<ApiResponse<void>>(endpoint, payload);

    if (response.data.success) {
      toast.success('Your reflection has been submitted successfully');
    } else {
      throw new Error(response.data.error ?? 'Failed to submit reflection');
    }
  } catch (error) {
    console.error('Error submitting reflection:', error);
    toast.error('Failed to submit reflection. Please try again.');
    throw error;
  }
};

/**
 * Interface for reflection data returned from the API
 */
export interface ReflectionData {
  id: string;
  healingName: string;
  content: string;
  journeyDay: string;
  createdAt: string;
}

/**
 * Interface for reflection response from the API
 */
export interface ReflectionResponse {
  reflections: ReflectionData[];
}

/**
 * Fetches reflections for a healing name
 *
 * @param healingName - The healing name to fetch reflections for
 * @param isAuthenticated - Whether the user is authenticated
 * @returns A promise resolving to the reflection response
 */
export const getReflections = async (healingName: string, isAuthenticated: boolean = false): Promise<ReflectionResponse> => {
  try {
    // Validate input
    if (!isValidHealingName(healingName)) {
      toast.error('Please enter a valid healing name');
      throw new Error('Invalid healing name');
    }

    // Use secure endpoint if authenticated
    const endpoint = isAuthenticated ? '/reflection/secure' : '/reflection';
    const response = await api.get<ApiResponse<ReflectionResponse>>(`${endpoint}?healingName=${encodeURIComponent(healingName)}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error ?? 'Failed to fetch reflections');
    }
  } catch (error) {
    console.error('Error fetching reflections:', error);
    toast.error('Failed to fetch reflections. Please try again.');
    throw error;
  }
};

/**
 * Fetches reflections for the authenticated user without specifying a healing name
 * This is more secure as it uses the user ID from the JWT token
 *
 * @returns A promise resolving to the reflection response
 */
export const getAuthenticatedUserReflections = async (): Promise<ReflectionResponse> => {
  try {
    const response = await api.get<ApiResponse<ReflectionResponse>>('/reflection/secure');

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error ?? 'Failed to fetch reflections');
    }
  } catch (error) {
    console.error('Error fetching reflections:', error);
    toast.error('Failed to fetch reflections. Please try again.');
    throw error;
  }
};

/**
 * Authentication interfaces
 */
export interface RegisterRequest {
  healingName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    healingName: string;
    email: string;
    role: 'user' | 'admin';
  };
  accessToken: string;
}

/**
 * Registers a new user
 *
 * @param data - The registration data
 * @returns A promise resolving to the authentication response
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);

    if (response.data.success && response.data.data) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('healingName', response.data.data.user.healingName);

      return response.data.data;
    } else {
      throw new Error(response.data.error ?? 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Logs in a user
 *
 * @param data - The login data
 * @returns A promise resolving to the authentication response
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);

    if (response.data.success && response.data.data) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.data.accessToken);
      localStorage.setItem('healingName', response.data.data.user.healingName);

      return response.data.data;
    } else {
      throw new Error(response.data.error ?? 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logs out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');

    // Clear token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('healingName');
  } catch (error) {
    console.error('Logout error:', error);

    // Clear token from localStorage even if API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('healingName');

    throw error;
  }
};

/**
 * Gets the current user
 *
 * @returns A promise resolving to the user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get<ApiResponse<{ user: AuthResponse['user'] }>>('/auth/me');

    if (response.data.success && response.data.data) {
      return response.data.data.user;
    } else {
      throw new Error(response.data.error ?? 'Failed to get user data');
    }
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

/**
 * Fetches a CSRF token from the server
 *
 * @returns A promise that resolves when the CSRF token is fetched
 */
export const fetchCsrfToken = async (): Promise<void> => {
  try {
    const response = await api.get<ApiResponse<{ csrfToken: string }>>('/csrf-token');

    if (response.data.success && response.data.data) {
      // Store CSRF token in localStorage
      localStorage.setItem('csrfToken', response.data.data.csrfToken);
    } else {
      console.error('Failed to fetch CSRF token');
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

/**
 * Requests a password reset for the specified email
 *
 * @param email - The email address to send the password reset link to
 * @returns A promise that resolves when the password reset request is sent
 */
export const requestPasswordReset = async (email: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.post<ApiResponse<void>>('/auth/request-password-reset', { email });

    if (response.data.success) {
      toast.success('Password reset instructions sent to your email');
      return { success: true };
    } else {
      throw new Error(response.data.error ?? 'Failed to request password reset');
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    toast.error('Failed to send password reset email. Please try again.');
    throw error;
  }
};

// Enhanced conversation management API functions

/**
 * Create a new conversation
 */
export const createConversation = async (data: {
  healingName?: string;
  title?: string;
  tags?: string[];
  metadata?: any;
}): Promise<any> => {
  try {
    const response = await api.post<ApiResponse<any>>('/chat/conversations', data);

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error ?? 'Failed to create conversation');
    }
  } catch (error) {
    console.error('Error creating conversation:', error);
    toast.error('Failed to create conversation. Please try again.');
    throw error;
  }
};

/**
 * Get user conversations with filtering
 */
export const getUserConversations = async (filters: {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string;
  archived?: boolean;
  limit?: number;
} = {}): Promise<any[]> => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<ApiResponse<{ conversations: any[] }>>(
      `/chat/conversations?${params.toString()}`
    );

    if (response.data.success && response.data.data) {
      return response.data.data.conversations;
    } else {
      throw new Error(response.data.error ?? 'Failed to get conversations');
    }
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
};

/**
 * Get conversation thread with messages
 */
export const getConversationThread = async (conversationId: string, limit?: number): Promise<any> => {
  try {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get<ApiResponse<any>>(`/chat/conversations/${conversationId}${params}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error ?? 'Failed to get conversation thread');
    }
  } catch (error) {
    console.error('Error getting conversation thread:', error);
    throw error;
  }
};

/**
 * Update conversation metadata
 */
export const updateConversation = async (conversationId: string, updates: any): Promise<any> => {
  try {
    const response = await api.patch<ApiResponse<any>>(`/chat/conversations/${conversationId}`, updates);

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error ?? 'Failed to update conversation');
    }
  } catch (error) {
    console.error('Error updating conversation:', error);
    toast.error('Failed to update conversation. Please try again.');
    throw error;
  }
};

/**
 * Archive/unarchive conversation
 */
export const archiveConversation = async (conversationId: string, archived: boolean = true): Promise<any> => {
  try {
    const response = await api.post<ApiResponse<any>>(`/chat/conversations/${conversationId}/archive`, { archived });

    if (response.data.success && response.data.data) {
      toast.success(archived ? 'Conversation archived' : 'Conversation unarchived');
      return response.data.data;
    } else {
      throw new Error(response.data.error ?? 'Failed to archive conversation');
    }
  } catch (error) {
    console.error('Error archiving conversation:', error);
    toast.error('Failed to archive conversation. Please try again.');
    throw error;
  }
};

/**
 * Search conversations and messages
 */
export const searchConversations = async (query: string, options: {
  includeMessages?: boolean;
  limit?: number;
} = {}): Promise<any[]> => {
  try {
    const params = new URLSearchParams({ q: query });
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<ApiResponse<{ results: any[] }>>(
      `/chat/search?${params.toString()}`
    );

    if (response.data.success && response.data.data) {
      return response.data.data.results;
    } else {
      throw new Error(response.data.error ?? 'Failed to search conversations');
    }
  } catch (error) {
    console.error('Error searching conversations:', error);
    throw error;
  }
};

/**
 * Get conversation analytics
 */
export const getConversationAnalytics = async (days: number = 30): Promise<any> => {
  try {
    const response = await api.get<ApiResponse<any>>(`/chat/analytics?days=${days}`);

    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error ?? 'Failed to get analytics');
    }
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
};

export default api;