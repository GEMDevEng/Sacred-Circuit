import React from 'react';
import { ErrorBoundary } from '@sentry/react';
import { motion } from 'framer-motion';

interface FallbackProps {
  error: Error;
  componentStack: string | null;
  eventId: string | null;
  resetError(): void;
}

interface SentryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<FallbackProps>;
  showDialog?: boolean;
  dialogOptions?: {
    title?: string;
    subtitle?: string;
    subtitle2?: string;
    labelName?: string;
    labelEmail?: string;
    labelComments?: string;
    labelClose?: string;
    labelSubmit?: string;
    errorGeneric?: string;
    errorFormEntry?: string;
    successMessage?: string;
  };
}

/**
 * Default fallback component for error states
 */
const DefaultFallback: React.FC<FallbackProps> = ({ error, resetError }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
    >
      <div className="flex items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-red-500 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
          Something went wrong
        </h3>
      </div>
      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
        {error.message || 'An unexpected error occurred'}
      </p>
      <div className="flex justify-end">
        <button
          onClick={resetError}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Enhanced Sentry error boundary with custom styling and fallback
 */
const SentryErrorBoundary: React.FC<SentryErrorBoundaryProps> = ({
  children,
  fallback = DefaultFallback,
  showDialog = false,
  dialogOptions
}) => {
  return (
    <ErrorBoundary
      fallback={fallback}
      showDialog={showDialog}
      dialogOptions={dialogOptions}
    >
      {children}
    </ErrorBoundary>
  );
};

export default SentryErrorBoundary;
