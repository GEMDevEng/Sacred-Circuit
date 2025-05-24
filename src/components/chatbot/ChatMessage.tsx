import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  Check, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  Heart,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ChatMessage as ChatMessageType, SpiritualExercise, HealingRecommendation } from '../../types';
import { Button } from '../common/Button';

interface ChatMessageProps {
  message: ChatMessageType;
  exercises?: SpiritualExercise[];
  recommendations?: HealingRecommendation[];
  onRetry?: () => void;
  onCopy?: (content: string) => void;
}

/**
 * Enhanced chat message component with spiritual exercises and recommendations
 */
export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  exercises = [],
  recommendations = [],
  onRetry,
  onCopy 
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);

  const isUser = message.sender === 'user';
  const isBot = message.sender === 'bot';

  const handleCopy = async () => {
    if (onCopy) {
      onCopy(message.content);
    } else {
      try {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy message:', error);
      }
    }
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock size={12} className="text-gray-400" />;
      case 'sent':
        return <Check size={12} className="text-green-500" />;
      case 'failed':
        return <AlertCircle size={12} className="text-red-500" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Message bubble */}
        <div
          className={`
            relative px-4 py-3 rounded-2xl shadow-sm
            ${isUser 
              ? 'bg-primary-500 text-white rounded-br-md' 
              : 'bg-white border border-gray-200 rounded-bl-md'
            }
          `}
        >
          {/* Message content */}
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>

          {/* Message actions */}
          <div className={`flex items-center justify-between mt-2 text-xs ${
            isUser ? 'text-primary-100' : 'text-gray-500'
          }`}>
            <div className="flex items-center space-x-2">
              <span>{formatTimestamp(message.timestamp)}</span>
              {getStatusIcon()}
              {message.metadata?.responseTime && (
                <span className="opacity-75">
                  {message.metadata.responseTime}ms
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {message.status === 'failed' && onRetry && (
                <button
                  onClick={onRetry}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                  title="Retry message"
                >
                  <RefreshCw size={12} />
                </button>
              )}
              
              <button
                onClick={handleCopy}
                className={`p-1 rounded transition-colors ${
                  isUser 
                    ? 'hover:bg-primary-400' 
                    : 'hover:bg-gray-100'
                }`}
                title="Copy message"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>

        {/* Spiritual exercises (only for bot messages) */}
        {isBot && exercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-3 space-y-2"
          >
            <div className="flex items-center space-x-2 text-sm text-primary-600 font-medium">
              <Sparkles size={16} />
              <span>Suggested Practices</span>
            </div>
            
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-primary-50 border border-primary-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart size={16} className="text-primary-500" />
                    <h4 className="font-medium text-primary-700">{exercise.title}</h4>
                    {exercise.duration && (
                      <span className="text-xs bg-primary-200 text-primary-700 px-2 py-1 rounded">
                        {exercise.duration} min
                      </span>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedExercise(
                      expandedExercise === exercise.id ? null : exercise.id
                    )}
                  >
                    {expandedExercise === exercise.id ? 'Hide' : 'Show'}
                  </Button>
                </div>
                
                <p className="text-sm text-primary-600 mt-1">{exercise.description}</p>
                
                {expandedExercise === exercise.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-2"
                  >
                    <div>
                      <h5 className="font-medium text-primary-700 mb-1">Instructions:</h5>
                      <ol className="text-sm text-primary-600 space-y-1">
                        {exercise.instructions.map((instruction, index) => (
                          <li key={index} className="flex">
                            <span className="mr-2 text-primary-400">{index + 1}.</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    {exercise.benefits && exercise.benefits.length > 0 && (
                      <div>
                        <h5 className="font-medium text-primary-700 mb-1">Benefits:</h5>
                        <ul className="text-sm text-primary-600 space-y-1">
                          {exercise.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-primary-400">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Healing recommendations (only for bot messages) */}
        {isBot && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="mt-3 space-y-2"
          >
            <div className="flex items-center space-x-2 text-sm text-secondary-600 font-medium">
              <BookOpen size={16} />
              <span>Personalized Recommendations</span>
            </div>
            
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="bg-secondary-50 border border-secondary-200 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      recommendation.priority === 'high' ? 'bg-red-400' :
                      recommendation.priority === 'medium' ? 'bg-yellow-400' :
                      'bg-green-400'
                    }`} />
                    <h4 className="font-medium text-secondary-700">{recommendation.title}</h4>
                    {recommendation.estimatedTime && (
                      <span className="text-xs bg-secondary-200 text-secondary-700 px-2 py-1 rounded">
                        {recommendation.estimatedTime} min
                      </span>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedRecommendation(
                      expandedRecommendation === recommendation.id ? null : recommendation.id
                    )}
                  >
                    {expandedRecommendation === recommendation.id ? 'Hide' : 'Show'}
                  </Button>
                </div>
                
                <p className="text-sm text-secondary-600 mt-1">{recommendation.description}</p>
                <p className="text-xs text-secondary-500 mt-1 italic">{recommendation.reason}</p>
                
                {expandedRecommendation === recommendation.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-2"
                  >
                    {recommendation.exercises && recommendation.exercises.length > 0 && (
                      <div>
                        <h5 className="font-medium text-secondary-700 mb-1">Recommended Exercises:</h5>
                        <div className="space-y-1">
                          {recommendation.exercises.map((exercise, index) => (
                            <div key={index} className="text-sm text-secondary-600 bg-white p-2 rounded">
                              <span className="font-medium">{exercise.title}</span>
                              {exercise.duration && (
                                <span className="text-xs text-secondary-500 ml-2">
                                  ({exercise.duration} min)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {recommendation.resources && recommendation.resources.length > 0 && (
                      <div>
                        <h5 className="font-medium text-secondary-700 mb-1">Resources:</h5>
                        <div className="space-y-1">
                          {recommendation.resources.map((resource, index) => (
                            <div key={index} className="text-sm text-secondary-600 bg-white p-2 rounded">
                              <span className="font-medium">{resource.title}</span>
                              <p className="text-xs text-secondary-500 mt-1">{resource.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
