/**
 * Utility functions for performance monitoring and analytics
 */

// Store performance marks and measures
const performanceMarks: Record<string, number> = {};

/**
 * Start timing a performance metric
 * @param name Name of the metric
 */
export const startTiming = (name: string): void => {
  performanceMarks[name] = performance.now();

  // Also use the browser's Performance API if available
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`${name}_start`);
  }
};

/**
 * End timing a performance metric and return the duration
 * @param name Name of the metric
 * @returns Duration in milliseconds
 */
export const endTiming = (name: string): number | null => {
  const startTime = performanceMarks[name];
  if (!startTime) {
    console.warn(`No start time found for metric: ${name}`);
    return null;
  }

  const endTime = performance.now();
  const duration = endTime - startTime;

  // Use the browser's Performance API if available
  if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
    performance.mark(`${name}_end`);
    try {
      performance.measure(name, `${name}_start`, `${name}_end`);
    } catch (e) {
      console.warn(`Error measuring performance for ${name}:`, e);
    }
  }

  // Log the duration in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
  }

  // Clean up
  delete performanceMarks[name];

  return duration;
};

/**
 * Track a user interaction event
 * @param category Event category
 * @param action Event action
 * @param label Optional event label
 * @param value Optional event value
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
): void => {
  // Log events in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Event: ${category} - ${action}${label ? ` - ${label}` : ''}${value !== undefined ? ` - ${value}` : ''}`);
  }

  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    // If using Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  }
};

/**
 * Track a page view
 * @param path Page path
 * @param title Page title
 */
export const trackPageView = (path: string, title: string): void => {
  // Log page views in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Page view: ${path} - ${title}`);
  }

  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    // If using Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const gaId = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID;
      if (gaId) {
        (window as any).gtag('config', gaId, {
          page_path: path,
          page_title: title,
        });
      }
    }
  }
};

/**
 * Track an error
 * @param error Error object or message
 * @param context Additional context
 */
export const trackError = (error: Error | string, context?: Record<string, any>): void => {
  // Log errors in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', error, context);
  }

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Import and use Sentry dynamically to avoid circular dependencies
    import('./sentry').then(({ captureException, captureMessage }) => {
      if (typeof error === 'string') {
        captureMessage(error, 'error', context);
      } else {
        captureException(error, context);
      }
    }).catch(e => {
      console.error('Failed to load Sentry:', e);
    });
  }
};

/**
 * Create a performance monitoring wrapper for a function
 * @param fn Function to monitor
 * @param name Name of the metric
 * @returns Wrapped function
 */
export function withPerformanceTracking<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    startTiming(name);
    try {
      const result = fn(...args);

      // Handle promises
      if (result instanceof Promise) {
        return result
          .then((value) => {
            endTiming(name);
            return value;
          })
          .catch((error) => {
            endTiming(name);
            throw error;
          }) as ReturnType<T>;
      }

      endTiming(name);
      return result;
    } catch (error) {
      endTiming(name);
      throw error;
    }
  };
}
