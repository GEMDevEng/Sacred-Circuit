import { useState, useRef, useEffect } from 'react';
import { Send, Info, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../common/PageTransition';
import Button from '../common/Button';
import { Input, TextArea, Checkbox } from '../common/form';
import { useAuth } from '../../contexts/AuthContext';
import { useChatbot } from '../../hooks/useChatbot';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const ChatbotPage = () => {
  const { isAuthenticated } = useAuth();

  // Use the custom chatbot hook
  const {
    messages,
    isLoading,
    consent,
    input,
    isNameInputVisible,
    setConsent,
    setInput,
    handleSendMessage,
  } = useChatbot(isAuthenticated);

  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <PageTransition>
      <section className="py-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-serif">Sacred Healing Companion</h1>
              {isAuthenticated && (
                <div className="flex items-center text-sm text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                  <Lock size={14} className="mr-1" />
                  <span>Secure Connection</span>
                </div>
              )}
            </div>

            {/* Chat Container */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <span className="font-medium">Active Session</span>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    className="text-white/80 hover:text-white transition-colors"
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
                        <p className="mb-2">This AI companion is designed to support your healing journey.</p>
                        <p>Your conversations are private and only stored with your consent.</p>
                        <div className="absolute top-0 right-4 transform -translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLast={index === messages.length - 1}
                  />
                ))}

                <AnimatePresence>
                  {isLoading && <TypingIndicator />}
                </AnimatePresence>

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