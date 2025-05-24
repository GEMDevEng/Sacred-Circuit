import React, { useState, useRef, useEffect } from 'react';
import { Send, Info, Lock, ArrowRight, MessageSquare, Settings, Heart, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import PageTransition from '../common/PageTransition';
import Button from '../common/Button';
import { Input, TextArea, Checkbox } from '../common/form';
import { sendChatMessage, ChatRequest, createConversation, getUserConversations } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMessage as ChatMessageType, Conversation, SpiritualContext } from '../../types';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ConversationHistory from './ConversationHistory';

interface Message extends ChatMessageType {
  exercises?: any[];
  recommendations?: any[];
}

const ChatbotPage = () => {
  const { user, isAuthenticated } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to your Sacred Healing space. How are you feeling today?',
      sender: 'bot',
      timestamp: new Date().toISOString(),
      status: 'sent'
    },
  ]);
  const [input, setInput] = useState('');
  const [consent, setConsent] = useState(() => {
    const savedConsent = localStorage.getItem('chatConsent');
    return savedConsent ? JSON.parse(savedConsent) : false;
  });
  const [healingName, setHealingName] = useState(() => {
    return user?.healingName || localStorage.getItem('healingName') || '';
  });
  const [isNameInputVisible, setIsNameInputVisible] = useState(!healingName);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [spiritualContext, setSpiritualContext] = useState<SpiritualContext>({});
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom of chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations for authenticated users
  useEffect(() => {
    if (isAuthenticated && showHistory) {
      loadConversations();
    }
  }, [isAuthenticated, showHistory]);

  // Initialize spiritual context
  useEffect(() => {
    if (user) {
      setSpiritualContext({
        journeyStage: 'beginning',
        sessionCount: 1,
        healingGoals: user.goals ? [user.goals] : []
      });
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const userConversations = await getUserConversations();
      setConversations(userConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const createNewConversation = async () => {
    try {
      const conversation = await createConversation({
        healingName: healingName || user?.healingName,
        title: 'New Sacred Conversation',
        tags: ['healing', 'guidance'],
        metadata: { context: spiritualContext }
      });

      setCurrentConversation(conversation);
      setMessages([{
        id: '1',
        content: 'Welcome to your Sacred Healing space. How are you feeling today?',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        status: 'sent'
      }]);
      toast.success('New conversation started');
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const selectConversation = async (conversation: Conversation) => {
    try {
      setCurrentConversation(conversation);
      setMessages([{
        id: '1',
        content: 'Welcome back to your Sacred Healing space.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        status: 'sent'
      }]);
      setShowHistory(false);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const handleRetryMessage = async (messageId: string) => {
    const failedMessage = messages.find(msg => msg.id === messageId);
    if (!failedMessage || failedMessage.sender !== 'user') return;

    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setInput(failedMessage.content);
    await handleSendMessage();
  };

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Message copied to clipboard');
    } catch (error) {
      console.error('Failed to copy message:', error);
      toast.error('Failed to copy message');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!healingName && isNameInputVisible) {
      setHealingName(input.trim());
      setIsNameInputVisible(false);
      setInput('');

      // Add welcome message with name
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Thank you, ${input.trim()}. How can I support your healing journey today?`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      setMessages(prev => [...prev, welcomeMessage]);
      return;
    }

    // Create and add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sending',
      conversationId: currentConversation?.id
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Update user message status to sent
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ));

      // Create enhanced chat request
      const chatRequest = {
        message: input,
        healingName: healingName || user?.healingName || 'Seeker',
        storeConversation: consent,
        conversationId: currentConversation?.id,
        context: {
          ...spiritualContext,
          sessionCount: Math.ceil(messages.length / 2) + 1
        }
      };

      // Send message to API
      const response = await sendChatMessage(chatRequest, isAuthenticated);

      // Create bot message from response
      const botMessage: Message = {
        id: response.messageId || Date.now().toString(),
        content: response.message,
        sender: 'bot',
        timestamp: response.timestamp,
        status: 'sent',
        conversationId: response.conversationId,
        metadata: response.metadata,
        exercises: response.exercises,
        recommendations: response.recommendations
      };

      setMessages(prev => [...prev, botMessage]);

      // Update spiritual context based on response
      if (response.metadata?.context) {
        setSpiritualContext(prev => ({ ...prev, ...response.metadata.context }));
      }

      // If this is the first message after setting healing name, suggest reflection
      if (messages.length === 1 && !isNameInputVisible) {
        setTimeout(() => {
          const suggestionMessage: Message = {
            id: Date.now().toString(),
            content: "As you continue your healing journey, consider recording your reflections. This can help track your progress and insights over time.",
            sender: 'bot',
            timestamp: new Date().toISOString(),
            status: 'sent'
          };
          setMessages(prev => [...prev, suggestionMessage]);
        }, 2000);
      }

    } catch (error) {
      console.error('Error sending message:', error);

      // Update user message status to failed
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id ? { ...msg, status: 'failed' } : msg
      ));

      toast.error('Failed to send message. Please try again.');

      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I couldn't process your message. Please try again.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <PageTransition>
      <section className="py-8">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-serif">Sacred Healing Companion</h1>
              {isAuthenticated && (
                <div className="flex items-center text-sm text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                  <Lock size={14} className="mr-1" />
                  <span>Secure Connection</span>
                </div>
              )}
            </div>

            <div className="flex gap-4 h-[calc(100vh-12rem)]">
              {/* Conversation History Sidebar */}
              <AnimatePresence>
                {showHistory && isAuthenticated && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 320, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <ConversationHistory
                      conversations={conversations}
                      onSelectConversation={selectConversation}
                      onCreateConversation={createNewConversation}
                      onUpdateConversation={() => {}}
                      onArchiveConversation={() => {}}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Container */}
              <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
              {/* Header */}
              <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <div>
                    <span className="font-medium">
                      {currentConversation?.title || 'Active Session'}
                    </span>
                    {healingName && (
                      <p className="text-xs text-white/70 mt-1">
                        Guiding {healingName} on their healing journey
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isAuthenticated && (
                    <>
                      <button
                        type="button"
                        className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                        onClick={() => setShowHistory(!showHistory)}
                        aria-label="Toggle conversation history"
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button
                        type="button"
                        className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                        onClick={createNewConversation}
                        aria-label="Start new conversation"
                      >
                        <Sparkles size={18} />
                      </button>
                    </>
                  )}
                  <div className="relative">
                    <button
                      type="button"
                      className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                      onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                      aria-label="Information about the chatbot"
                    >
                      <Info size={18} />
                    </button>
                    <AnimatePresence>
                      {showInfoTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-8 w-64 bg-white text-neutral-800 p-3 rounded-lg shadow-lg z-10 text-sm"
                        >
                          <p className="mb-2">This enhanced AI companion provides personalized spiritual guidance and healing recommendations.</p>
                          <p>Your conversations are private and only stored with your consent.</p>
                          <div className="absolute top-0 right-4 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={chatContainerRef}
                className="h-[60vh] overflow-y-auto p-4 bg-neutral-50"
              >
                {isNameInputVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary-50 p-4 rounded-lg mb-4 border-l-4 border-primary-500"
                  >
                    <h3 className="font-medium text-primary-700 mb-1">Welcome to Your Sacred Space</h3>
                    <p className="text-neutral-700">
                      Please enter a healing name to begin your journey.
                      This name will be used to preserve your privacy throughout your experience.
                    </p>
                  </motion.div>
                )}

                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    exercises={message.exercises}
                    recommendations={message.recommendations}
                    onRetry={() => handleRetryMessage(message.id)}
                    onCopy={handleCopyMessage}
                  />
                ))}

                <TypingIndicator
                  isVisible={isTyping}
                  healingName="Sacred Guide"
                />

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                {isNameInputVisible ? (
                  <div className="space-y-4">
                    <Input
                      label="Your Healing Name"
                      id="healingName"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter a name that resonates with your journey"
                      helperText="This name will be used throughout your healing experience"
                      required
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSendMessage}
                        disabled={!input.trim()}
                        variant="primary"
                        icon={<ArrowRight size={18} />}
                        iconPosition="right"
                      >
                        Begin Journey
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-end gap-2">
                      <div className="flex-grow">
                        <TextArea
                          id="message"
                          label="Message"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          rows={2}
                          containerClassName="mb-0"
                          labelClassName="sr-only" // Hide label visually but keep it for screen readers
                        />
                      </div>

                      <Button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoading}
                        isLoading={isLoading}
                        aria-label="Send message"
                        variant="primary"
                        className="rounded-full p-3 h-12 w-12 flex items-center justify-center"
                      >
                        {!isLoading && <Send size={20} />}
                      </Button>
                    </div>

                    <div className="mt-3 flex justify-between items-center">
                      <Checkbox
                        id="storeConversation"
                        label="Store conversation for improvement"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        containerClassName="mb-0"
                      />

                      <Link
                        to="/reflection"
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center transition-colors"
                      >
                        Submit a reflection
                        <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mt-6 text-center text-sm text-neutral-500">
              <p>
                Your privacy is sacred. {isAuthenticated
                  ? "Your conversations are securely encrypted."
                  : "Consider creating an account for enhanced security."}
              </p>

              {!isAuthenticated && !isNameInputVisible && (
                <div className="mt-3">
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Login for secure conversations
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ChatbotPage;