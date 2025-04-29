import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import SentryErrorBoundary from '../common/SentryErrorBoundary';
import { FormSelect } from '../common/form';

interface Feedback {
  id: string;
  type: string;
  title: string;
  description: string;
  email: string | null;
  timestamp: string;
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
}

const statusOptions = [
  { value: 'New', label: 'New' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Closed', label: 'Closed' }
];

const typeColors: Record<string, string> = {
  general: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  bug: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  feature: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  content: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
};

const FeedbackDashboard: React.FC = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (typeFilter) params.append('type', typeFilter);
        
        const response = await fetch(`/api/admin/feedback?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        
        const data = await response.json();
        setFeedback(data.feedback);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback. Please try again.');
        toast.error('Failed to load feedback');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.token) {
      fetchFeedback();
    }
  }, [user?.token, statusFilter, typeFilter]);

  // Update feedback status
  const updateFeedbackStatus = async (id: string, status: string) => {
    try {
      setIsUpdating(id);
      
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update feedback status');
      }
      
      // Update local state
      setFeedback(prevFeedback => 
        prevFeedback.map(item => 
          item.id === id ? { ...item, status: status as Feedback['status'] } : item
        )
      );
      
      toast.success('Feedback status updated');
    } catch (err) {
      console.error('Error updating feedback status:', err);
      toast.error('Failed to update feedback status');
    } finally {
      setIsUpdating(null);
    }
  };

  // Toggle expanded view for a feedback item
  const toggleExpand = (id: string) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  // Format timestamp
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Filter options
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'general', label: 'General Feedback' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'content', label: 'Content Suggestion' },
    { value: 'other', label: 'Other' }
  ];
  
  const statusFilterOptions = [
    { value: '', label: 'All Statuses' },
    ...statusOptions
  ];

  return (
    <SentryErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Feedback Dashboard</h1>
        
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="w-full md:w-64">
            <FormSelect
              id="statusFilter"
              label="Filter by Status"
              options={statusFilterOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
          <div className="w-full md:w-64">
            <FormSelect
              id="typeFilter"
              label="Filter by Type"
              options={typeOptions}
              value={typeFilter}
              onChange={setTypeFilter}
            />
          </div>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Empty state */}
            {feedback.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No feedback found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  No feedback matches your current filters.
                </p>
              </div>
            ) : (
              /* Feedback list */
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {feedback.map((item) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[item.type] || typeColors.other}`}>
                              {item.type}
                            </span>
                          </div>
                          <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h2>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <span>{formatDate(item.timestamp)}</span>
                              {item.email && (
                                <span className="ml-2 pl-2 border-l border-gray-300 dark:border-gray-600">
                                  {item.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'New' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            item.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            item.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {item.status}
                          </span>
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            aria-expanded={expandedFeedback === item.id}
                            aria-label={expandedFeedback === item.id ? "Collapse feedback details" : "Expand feedback details"}
                          >
                            <svg
                              className={`h-5 w-5 transform transition-transform ${expandedFeedback === item.id ? 'rotate-180' : ''}`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded content */}
                      {expandedFeedback === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {item.description}
                            </p>
                            
                            <div className="mt-4 flex items-center">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                                Update status:
                              </span>
                              <div className="w-40">
                                <select
                                  value={item.status}
                                  onChange={(e) => updateFeedbackStatus(item.id, e.target.value)}
                                  disabled={isUpdating === item.id}
                                  className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
                                >
                                  {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {isUpdating === item.id && (
                                <div className="ml-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </SentryErrorBoundary>
  );
};

export default FeedbackDashboard;
