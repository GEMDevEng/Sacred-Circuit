import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PageTransition from '../common/PageTransition';
import Button from '../common/Button';
import { sendChatMessage, ChatRequest } from '../../utils/api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to your Sacred Healing space. How are you feeling today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [consent, setConsent] = useState(() => {
    const savedConsent = localStorage.getItem('chatConsent');
    return savedConsent ? JSON.parse(savedConsent) : false;
  });
  const [healingName, setHealingName] = useState(() => {
    return localStorage.getItem('healingName') || '';
  });
  const [isNameInputVisible, setIsNameInputVisible] = useState(!healingName);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      // Send message to API
      const response = await sendChatMessage(chatRequest);

      // Create bot message from response
      const botMessage: Message = {
        id: Date.now().toString(),
        content: response.message,
        sender: 'bot',
        timestamp: new Date(response.timestamp),
      };

      // Add bot message to chat
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
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
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-serif mb-6 text-center">Sacred Healing Companion</h1>

            {/* Chat Container */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Messages Area */}
              <div className="h-[60vh] overflow-y-auto p-4 bg-neutral-50">
                {isNameInputVisible && (
                  <div className="bg-primary-50 p-4 rounded-lg mb-4">
                    <p className="text-neutral-800 mb-2">
                      Welcome to your sacred space. Please enter a healing name to begin your journey.
                      This name will be used to preserve your privacy.
                    </p>
                  </div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-secondary text-neutral-800 rounded-tl-none'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-neutral-600'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-secondary text-neutral-800 rounded-2xl rounded-tl-none px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end gap-2">
                  <div className="flex-grow">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={isNameInputVisible ? "Enter your healing name..." : "Type your message..."}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      rows={2}
                    />

                    {!isNameInputVisible && (
                      <div className="mt-2 flex items-center">
                        <label className="flex items-center text-sm text-neutral-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className="mr-2 h-4 w-4 text-primary focus:ring-primary rounded"
                          />
                          Store conversation for improvement
                        </label>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="bg-accent hover:bg-accent-600 text-white p-3 rounded-full disabled:opacity-50"
                  >
                    <Send size={20} />
                  </Button>
                </div>

                {!isNameInputVisible && (
                  <p className="mt-3 text-xs text-neutral-500">
                    Your privacy is sacred. Conversations are not stored unless you consent.
                  </p>
                )}
              </div>
            </div>

            {/* Link to Reflection */}
            {!isNameInputVisible && (
              <div className="mt-6 text-center">
                <p className="mb-2 text-neutral-600">
                  Ready to record your journey milestone?
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/reflection'}
                  aria-label="Submit a reflection"
                >
                  Submit a Reflection
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ChatbotPage;