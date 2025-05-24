/**
 * Performance monitoring utilities for tracking application performance
 */

import { trackEvent, startTiming, endTiming } from './monitoring';
import { captureMessage } from './sentry';

// Performance thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  SLOW_API_CALL: 2000,
  SLOW_COMPONENT_RENDER: 100,
  SLOW_PAGE_LOAD: 3000,
  SLOW_INTERACTION: 500,
};

// Performance metrics storage
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'api' | 'render' | 'navigation' | 'interaction' | 'custom';
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 100; // Keep only the last 100 metrics

  /**
   * Track API call performance
   */
  trackApiCall = async <T>(
    apiCall: () => Promise<T>,
    endpoint: string,
    metadata?: Record<string, any>
  ): Promise<T> => {
    startTiming(`api_${endpoint}`);

    try {
      const result = await apiCall();
      const duration = endTiming(`api_${endpoint}`) || 0;

      this.addMetric({
        name: `api_${endpoint}`,
        value: duration,
        timestamp: Date.now(),
        type: 'api',
        metadata: { ...metadata, success: true },
      });

      // Track slow API calls
      if (duration > PERFORMANCE_THRESHOLDS.SLOW_API_CALL) {
        trackEvent('Performance', 'Slow API Call', endpoint, duration);
        captureMessage(`Slow API call: ${endpoint} took ${duration}ms`, 'warning', {
          endpoint,
          duration,
          ...metadata,
        });
      }

      return result;
    } catch (error) {
      const duration = endTiming(`api_${endpoint}`) || 0;

      this.addMetric({
        name: `api_${endpoint}`,
        value: duration,
        timestamp: Date.now(),
        type: 'api',
        metadata: { ...metadata, success: false, error: (error as Error).message },
      });

      throw error;
    }
  };

  /**
   * Track component render performance
   */
  trackComponentRender = (componentName: string, renderTime: number, metadata?: Record<string, any>) => {
    this.addMetric({
      name: `render_${componentName}`,
      value: renderTime,
      timestamp: Date.now(),
      type: 'render',
      metadata,
    });

    // Track slow component renders
    if (renderTime > PERFORMANCE_THRESHOLDS.SLOW_COMPONENT_RENDER) {
      trackEvent('Performance', 'Slow Component Render', componentName, renderTime);
      captureMessage(`Slow component render: ${componentName} took ${renderTime}ms`, 'warning', {
        componentName,
        renderTime,
        ...metadata,
      });
    }
  };

  /**
   * Track page navigation performance
   */
  trackPageNavigation = (fromPath: string, toPath: string, duration: number) => {
    this.addMetric({
      name: 'page_navigation',
      value: duration,
      timestamp: Date.now(),
      type: 'navigation',
      metadata: { fromPath, toPath },
    });

    // Track slow page loads
    if (duration > PERFORMANCE_THRESHOLDS.SLOW_PAGE_LOAD) {
      trackEvent('Performance', 'Slow Page Load', toPath, duration);
      captureMessage(`Slow page navigation: ${fromPath} -> ${toPath} took ${duration}ms`, 'warning', {
        fromPath,
        toPath,
        duration,
      });
    }
  };

  /**
   * Track user interaction performance
   */
  trackInteraction = (interactionType: string, duration: number, metadata?: Record<string, any>) => {
    this.addMetric({
      name: `interaction_${interactionType}`,
      value: duration,
      timestamp: Date.now(),
      type: 'interaction',
      metadata,
    });

    // Track slow interactions
    if (duration > PERFORMANCE_THRESHOLDS.SLOW_INTERACTION) {
      trackEvent('Performance', 'Slow Interaction', interactionType, duration);
      captureMessage(`Slow interaction: ${interactionType} took ${duration}ms`, 'warning', {
        interactionType,
        duration,
        ...metadata,
      });
    }
  };

  /**
   * Track custom performance metric
   */
  trackCustomMetric = (name: string, value: number, metadata?: Record<string, any>) => {
    this.addMetric({
      name,
      value,
      timestamp: Date.now(),
      type: 'custom',
      metadata,
    });

    trackEvent('Performance', 'Custom Metric', name, value);
  };

  /**
   * Add a metric to the storage
   */
  private addMetric = (metric: PerformanceMetric) => {
    this.metrics.push(metric);

    // Keep only the last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  };

  /**
   * Get performance summary
   */
  getPerformanceSummary = () => {
    const now = Date.now();
    const last5Minutes = now - 5 * 60 * 1000;
    const recentMetrics = this.metrics.filter(m => m.timestamp > last5Minutes);

    const summary = {
      totalMetrics: recentMetrics.length,
      apiCalls: recentMetrics.filter(m => m.type === 'api').length,
      renders: recentMetrics.filter(m => m.type === 'render').length,
      navigations: recentMetrics.filter(m => m.type === 'navigation').length,
      interactions: recentMetrics.filter(m => m.type === 'interaction').length,
      averageApiTime: this.getAverageTime(recentMetrics.filter(m => m.type === 'api')),
      averageRenderTime: this.getAverageTime(recentMetrics.filter(m => m.type === 'render')),
      slowOperations: recentMetrics.filter(m => this.isSlowOperation(m)).length,
    };

    return summary;
  };

  /**
   * Check if an operation is considered slow
   */
  private isSlowOperation = (metric: PerformanceMetric): boolean => {
    switch (metric.type) {
      case 'api':
        return metric.value > PERFORMANCE_THRESHOLDS.SLOW_API_CALL;
      case 'render':
        return metric.value > PERFORMANCE_THRESHOLDS.SLOW_COMPONENT_RENDER;
      case 'navigation':
        return metric.value > PERFORMANCE_THRESHOLDS.SLOW_PAGE_LOAD;
      case 'interaction':
        return metric.value > PERFORMANCE_THRESHOLDS.SLOW_INTERACTION;
      default:
        return false;
    }
  };

  /**
   * Calculate average time for a set of metrics
   */
  private getAverageTime = (metrics: PerformanceMetric[]): number => {
    if (metrics.length === 0) return 0;
    const total = metrics.reduce((sum, metric) => sum + metric.value, 0);
    return Math.round(total / metrics.length);
  };

  /**
   * Get all metrics (for debugging)
   */
  getAllMetrics = (): PerformanceMetric[] => {
    return [...this.metrics];
  };

  /**
   * Clear all metrics
   */
  clearMetrics = () => {
    this.metrics = [];
  };
}

// Create a singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Higher-order function to wrap API calls with performance tracking
 */
export const withPerformanceTracking = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  name: string
): T => {
  return ((...args: any[]) => {
    return performanceMonitor.trackApiCall(() => fn(...args), name);
  }) as T;
};

/**
 * React hook for tracking component render performance
 */
export const usePerformanceTracking = (componentName: string) => {
  const trackRender = (renderTime: number, metadata?: Record<string, any>) => {
    performanceMonitor.trackComponentRender(componentName, renderTime, metadata);
  };

  return { trackRender };
};

/**
 * Utility to measure and track function execution time
 */
export const measureExecutionTime = async <T>(
  fn: () => Promise<T> | T,
  name: string,
  metadata?: Record<string, any>
): Promise<T> => {
  const startTime = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - startTime;

    performanceMonitor.trackCustomMetric(name, duration, metadata);

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    performanceMonitor.trackCustomMetric(name, duration, {
      ...metadata,
      error: (error as Error).message,
    });

    throw error;
  }
};

/**
 * Track Core Web Vitals
 */
export const trackCoreWebVitals = () => {
  // Track Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            performanceMonitor.trackCustomMetric('lcp', entry.startTime, {
              element: (entry as any).element?.tagName,
            });
          }
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('Failed to observe LCP:', e);
    }

    // Track First Input Delay (FID)
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fid = (entry as any).processingStart - entry.startTime;
            performanceMonitor.trackCustomMetric('fid', fid, {
              inputType: (entry as any).name,
            });
          }
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('Failed to observe FID:', e);
    }

    // Track Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });

      // Report CLS when the page is about to be unloaded
      window.addEventListener('beforeunload', () => {
        performanceMonitor.trackCustomMetric('cls', clsValue);
      });
    } catch (e) {
      console.warn('Failed to observe CLS:', e);
    }
  }
};

export default performanceMonitor;
