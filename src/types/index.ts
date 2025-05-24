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
  role: 'user' | 'admin';
}

/**
 * Chat message type for the chatbot interface
 */
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  conversationId?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
  metadata?: {
    tokens?: number;
    model?: string;
    temperature?: number;
    responseTime?: number;
  };
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
  conversationId?: string;
  messageId?: string;
  metadata?: {
    tokens?: number;
    model?: string;
    responseTime?: number;
  };
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

/**
 * Authentication request types
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

/**
 * Authentication response type
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
}

/**
 * Conversation type for managing chat sessions
 */
export interface Conversation {
  id: string;
  userId?: string;
  healingName: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: string;
  tags?: string[];
  archived?: boolean;
  shared?: boolean;
  metadata?: {
    totalTokens?: number;
    averageResponseTime?: number;
    mood?: string;
    topics?: string[];
  };
}

/**
 * Conversation thread with messages
 */
export interface ConversationThread {
  conversation: Conversation;
  messages: ChatMessage[];
}

/**
 * Conversation search and filter options
 */
export interface ConversationFilters {
  searchQuery?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  archived?: boolean;
  shared?: boolean;
}

/**
 * Conversation export options
 */
export interface ConversationExportOptions {
  format: 'pdf' | 'json' | 'txt' | 'csv';
  includeMetadata?: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
  conversations?: string[];
}

/**
 * Spiritual guidance context
 */
export interface SpiritualContext {
  journeyStage?: 'beginning' | 'exploring' | 'deepening' | 'integrating';
  currentMood?: 'peaceful' | 'anxious' | 'curious' | 'struggling' | 'grateful';
  practicePreferences?: string[];
  healingGoals?: string[];
  previousTopics?: string[];
  sessionCount?: number;
}

/**
 * Enhanced chat request with context
 */
export interface EnhancedChatRequest extends ChatRequest {
  conversationId?: string;
  context?: SpiritualContext;
  includeHistory?: boolean;
  maxHistoryMessages?: number;
}

/**
 * Conversation analytics data
 */
export interface ConversationAnalytics {
  totalConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  averageResponseTime: number;
  mostCommonTopics: Array<{ topic: string; count: number }>;
  userEngagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
  };
  moodDistribution: Record<string, number>;
  journeyStageDistribution: Record<string, number>;
}

/**
 * Typing indicator status
 */
export interface TypingStatus {
  isTyping: boolean;
  userId?: string;
  healingName?: string;
  timestamp: string;
}

/**
 * Meditation and breathing exercise
 */
export interface SpiritualExercise {
  id: string;
  type: 'meditation' | 'breathing' | 'reflection' | 'affirmation';
  title: string;
  description: string;
  duration?: number; // in minutes
  instructions: string[];
  benefits?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

/**
 * Personalized healing recommendation
 */
export interface HealingRecommendation {
  id: string;
  type: 'exercise' | 'practice' | 'reflection' | 'resource';
  title: string;
  description: string;
  reason: string; // Why this is recommended
  priority: 'low' | 'medium' | 'high';
  estimatedTime?: number;
  exercises?: SpiritualExercise[];
  resources?: Array<{
    title: string;
    url?: string;
    description: string;
  }>;
}
