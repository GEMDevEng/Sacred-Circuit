import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { Message } from '../../hooks/useChatbot';

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

/**
 * Individual chat message component
 * Displays user or bot messages with appropriate styling and animations
 */
const ChatMessage = ({ message, isLast = false }: ChatMessageProps) => {
  const isBot = message.sender === 'bot';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <Bot size={16} className="text-primary-600" />
        </div>
      )}
      
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isBot
            ? 'bg-white border border-gray-200 text-gray-800'
            : 'bg-primary-600 text-white'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <div
          className={`text-xs mt-2 ${
            isBot ? 'text-gray-500' : 'text-primary-100'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
