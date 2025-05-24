import React from 'react';
import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  isVisible: boolean;
  healingName?: string;
}

/**
 * Typing indicator component for the chatbot
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  isVisible, 
  healingName = 'Sacred Guide' 
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-2 p-4 bg-primary-50 rounded-lg mb-4"
    >
      <div className="flex items-center space-x-1">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-primary-600 text-sm font-medium">
            {healingName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-primary-700 font-medium">{healingName}</span>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-primary-500">is typing</span>
            <div className="flex space-x-1">
              <motion.div
                className="w-1 h-1 bg-primary-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.div
                className="w-1 h-1 bg-primary-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.2
                }}
              />
              <motion.div
                className="w-1 h-1 bg-primary-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: 0.4
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
