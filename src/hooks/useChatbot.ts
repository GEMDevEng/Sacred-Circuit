import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { sendChatMessage, ChatRequest } from '../utils/api';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface UseChatbotReturn {
  messages: Message[];
  isLoading: boolean;
  healingName: string;
  consent: boolean;
  input: string;
  isNameInputVisible: boolean;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setHealingName: React.Dispatch<React.SetStateAction<string>>;
  setConsent: React.Dispatch<React.SetStateAction<boolean>>;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setIsNameInputVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendMessage: () => Promise<void>;
  clearChat: () => void;
}

/**
 * Custom hook for chatbot functionality
 * Manages chat state, message sending, and conversation flow
 */
export const useChatbot = (isAuthenticated: boolean = false): UseChatbotReturn => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to your Sacred Healing space. How are you feeling today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [healingName, setHealingName] = useState(() => {
    return localStorage.getItem('healingName') || '';
  });
  const [consent, setConsent] = useState(() => {
    const savedConsent = localStorage.getItem('chatConsent');
    return savedConsent ? JSON.parse(savedConsent) : false;
  });
  const [input, setInput] = useState('');
  const [isNameInputVisible, setIsNameInputVisible] = useState(() => {
    return !localStorage.getItem('healingName');
  });

  // Save consent preference to localStorage
  useEffect(() => {
    localStorage.setItem('chatConsent', JSON.stringify(consent));
  }, [consent]);

  // Save healing name to localStorage
  useEffect(() => {
    if (healingName) {
      localStorage.setItem('healingName', healingName);
    }
  }, [healingName]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    // Handle healing name input
    if (!healingName && isNameInputVisible) {
      setHealingName(input.trim());
      setIsNameInputVisible(false);
      setInput('');

      // Add welcome message with name
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Thank you, ${input.trim()}. How can I support your healing journey today?`,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, welcomeMessage]);
      return;
    }

    // Create and add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create chat request
      const chatRequest: ChatRequest = {
        message: input,
        healingName,
        storeConversation: consent
      };

      // Send message to API - use secure endpoint if authenticated
      const response = await sendChatMessage(chatRequest, isAuthenticated);

      // Create bot message from response
      const botMessage: Message = {
        id: Date.now().toString(),
        content: response.message,
        sender: 'bot',
        timestamp: new Date(response.timestamp),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');

      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, healingName, isNameInputVisible, consent, isAuthenticated]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setHealingName('');
    setInput('');
    setIsNameInputVisible(true);
    setConsent(false);
  }, []);

  return {
    messages,
    isLoading,
    healingName,
    consent,
    input,
    isNameInputVisible,
    setMessages,
    setHealingName,
    setConsent,
    setInput,
    setIsNameInputVisible,
    handleSendMessage,
    clearChat,
  };
};
