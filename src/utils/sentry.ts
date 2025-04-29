import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

/**
 * Initialize Sentry for error tracking and monitoring
 */
export const initSentry = () => {
  if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          // Track navigation between routes
          tracingOrigins: ['localhost', 'sacred-healing-hub.vercel.app'],
          // Customize the sample rate for transactions
          routeTransactionSampleRate: 0.8,
        }),
      ],

      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
      // We recommend adjusting this value in production
      tracesSampleRate: 0.5,

      // Set sampleRate to 1.0 to capture 100% of errors
      sampleRate: 1.0,

      // Enable automatic instrumentation for React components
      // This will track component render times and other performance metrics
      enableComponentTracing: true,

      // Only send errors in production
      enabled: process.env.NODE_ENV === 'production',

      // Set environment
      environment: import.meta.env.VITE_ENVIRONMENT || 'development',

      // Set release version for tracking across deploys
      release: import.meta.env.VITE_RELEASE_VERSION || 'dev',

      // Capture breadcrumbs for better debugging context
      maxBreadcrumbs: 50,

      // Capture user information (but not PII)
      // This helps identify which users are experiencing errors
      beforeSend(event, hint) {
        // Don't send sensitive information
        if (event.user) {
          // Only include healing name, not email or other PII
          event.user = {
            id: event.user.id,
            username: event.user.username,
          };
        }

        // Add custom context to errors
        if (event.exception) {
          // Add browser information
          event.contexts = {
            ...event.contexts,
            browser: {
              name: navigator.userAgent,
              viewport: {
                width: window.innerWidth,
                height: window.innerHeight
              }
            }
          };

          // Add custom fingerprinting for better grouping
          const error = hint?.originalException;
          if (error && error instanceof Error) {
            // Group similar errors together
            if (error.message.includes('Network Error') ||
                error.message.includes('Failed to fetch')) {
              event.fingerprint = ['network-error'];
            }

            // Group API errors by endpoint
            if (error.message.includes('/api/')) {
              const match = error.message.match(/\/api\/([^\/\s]+)/);
              if (match && match[1]) {
                event.fingerprint = [`api-error-${match[1]}`];
              }
            }
          }
        }

        return event;
      },
    });

    // Log Sentry initialization
    console.log('Sentry initialized for error tracking and monitoring');
  }
};

/**
 * Set user information for Sentry
 * @param user User information
 */
export const setSentryUser = (user: { id: string; healingName: string }) => {
  if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.setUser({
      id: user.id,
      username: user.healingName,
    });
  }
};

/**
 * Clear user information from Sentry
 */
export const clearSentryUser = () => {
  if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.setUser(null);
  }
};

/**
 * Capture an exception in Sentry
 * @param error Error to capture
 * @param context Additional context information
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error:', error, context);
  }
};

/**
 * Capture a message in Sentry
 * @param message Message to capture
 * @param level Severity level
 * @param context Additional context information
 */
export const captureMessage = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
) => {
  if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    });
  } else {
    console.log(`[${level}] ${message}`, context);
  }
};

/**
 * Start a new transaction for performance monitoring
 * @param name Transaction name
 * @param op Operation type
 * @returns Transaction object
 */
export const startTransaction = (name: string, op: string) => {
  if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_SENTRY_DSN) {
    return Sentry.startTransaction({
      name,
      op,
    });
  }
  return null;
};

/**
 * Set a tag for the current scope
 * @param key Tag key
 * @param value Tag value
 */
export const setTag = (key: string, value: string) => {
  if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.setTag(key, value);
  }
};

/**
 * Set extra context for the current scope
 * @param key Context key
 * @param value Context value
 */
export const setExtra = (key: string, value: any) => {
  if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.setExtra(key, value);
  }
};

/**
 * Higher-order component to wrap components with Sentry error boundary
 * @param component Component to wrap
 * @param options Error boundary options
 * @returns Wrapped component
 */
export const withErrorBoundary = Sentry.withErrorBoundary;

/**
 * Error boundary component for React
 */
export const ErrorBoundary = Sentry.ErrorBoundary;
