import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FormInput, FormTextarea, FormSelect } from './form';
import { toast } from 'react-toastify';

interface FeedbackFormProps {
  onClose?: () => void;
}

const feedbackTypes = [
  { value: 'general', label: 'General Feedback' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'content', label: 'Content Suggestion' },
  { value: 'other', label: 'Other' }
];

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    email: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
    
    // Clear error when field is edited
    if (errors.type) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.type;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.type) {
      newErrors.type = 'Please select a feedback type';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a title';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please provide details';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Please provide more details (at least 10 characters)';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      setIsSuccess(true);
      toast.success('Thank you for your feedback!');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          type: '',
          title: '',
          description: '',
          email: ''
        });
        setIsSuccess(false);
        onClose?.();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Share Your Feedback
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      
      {isSuccess ? (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Thank you for your feedback!
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your input helps us improve the Sacred Healing experience.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormSelect
            id="type"
            label="Feedback Type"
            options={feedbackTypes}
            value={formData.type}
            onChange={handleSelectChange}
            error={errors.type}
            required
          />
          
          <FormInput
            id="title"
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            placeholder="Brief summary of your feedback"
          />
          
          <FormTextarea
            id="description"
            name="description"
            label="Details"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            required
            rows={5}
            placeholder="Please provide as much detail as possible"
            showCount
            maxLength={1000}
          />
          
          <FormInput
            id="email"
            name="email"
            label="Email (optional)"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            helperText="We'll only use this to follow up on your feedback if needed"
            placeholder="your@email.com"
          />
          
          <div className="mt-6 flex justify-end">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default FeedbackForm;
