/**
 * Type definitions for the Sacred Healing Companion & Journey Hub
 */

/**
 * User type representing a user in the system
 */
export interface User {
  id: string;
  healingName: string;
  email: string;
  createdAt: string;
  goals?: string;
}

/**
 * Chat message type for the chatbot interface
 */
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

/**
 * Reflection submission type
 */
export interface Reflection {
  id: string;
  userId: string;
  content: string;
  milestone: string;
  createdAt: string;
}

/**
 * API response type for standardized API responses
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Chat request type for sending messages to the chatbot
 */
export interface ChatRequest {
  message: string;
  healingName: string;
  storeConversation: boolean;
}

/**
 * Chat response type from the chatbot API
 */
export interface ChatResponse {
  message: string;
  timestamp: string;
}

/**
 * Reflection submission request type
 */
export interface ReflectionRequest {
  healingName: string;
  content: string;
  milestone: string;
}

/**
 * Webhook payload from Typeform for user onboarding
 */
export interface TypeformWebhookPayload {
  form_response: {
    answers: Array<{
      field: {
        id: string;
        type: string;
      };
      text?: string;
      email?: string;
      choice?: {
        label: string;
      };
    }>;
    submitted_at: string;
  };
}
