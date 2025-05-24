/**
 * A/B Testing Utility for Sacred Healing Hub
 * Provides simple A/B testing functionality for form optimization
 */

interface ABTest {
  name: string;
  variants: string[];
  weights?: number[];
  enabled: boolean;
}

interface ABTestResult {
  testName: string;
  variant: string;
  userId?: string;
}

class ABTestingService {
  private tests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map();

  /**
   * Register an A/B test
   */
  registerTest(test: ABTest): void {
    // Validate weights if provided
    if (test.weights && test.weights.length !== test.variants.length) {
      throw new Error('Weights array must match variants array length');
    }

    // Ensure weights sum to 1
    if (test.weights) {
      const sum = test.weights.reduce((acc, weight) => acc + weight, 0);
      if (Math.abs(sum - 1) > 0.001) {
        throw new Error('Weights must sum to 1');
      }
    }

    this.tests.set(test.name, test);
  }

  /**
   * Get variant for a user
   */
  getVariant(testName: string, userId?: string): string {
    const test = this.tests.get(testName);
    if (!test || !test.enabled) {
      return test?.variants[0] || 'control';
    }

    // Use userId for consistent assignment, or generate session-based ID
    const userKey = userId || this.getSessionId();

    // Check if user already has an assignment
    if (!this.userAssignments.has(userKey)) {
      this.userAssignments.set(userKey, new Map());
    }

    const userTests = this.userAssignments.get(userKey)!;
    if (userTests.has(testName)) {
      return userTests.get(testName)!;
    }

    // Assign variant based on weights or equal distribution
    const variant = this.assignVariant(test, userKey);
    userTests.set(testName, variant);

    // Track assignment
    this.trackAssignment(testName, variant, userKey);

    return variant;
  }

  /**
   * Track conversion event for A/B test
   */
  trackConversion(testName: string, eventType: string, userId?: string): void {
    const userKey = userId || this.getSessionId();
    const userTests = this.userAssignments.get(userKey);

    if (!userTests || !userTests.has(testName)) {
      return; // User not in test
    }

    const variant = userTests.get(testName)!;

    // Send tracking event
    this.sendTrackingEvent({
      testName,
      variant,
      eventType,
      userId: userKey,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Check if user is in a specific test variant
   */
  isInVariant(testName: string, variantName: string, userId?: string): boolean {
    const variant = this.getVariant(testName, userId);
    return variant === variantName;
  }

  /**
   * Get all active tests for a user
   */
  getActiveTests(userId?: string): ABTestResult[] {
    const userKey = userId || this.getSessionId();
    const userTests = this.userAssignments.get(userKey);

    if (!userTests) {
      return [];
    }

    return Array.from(userTests.entries()).map(([testName, variant]) => ({
      testName,
      variant,
      userId: userKey
    }));
  }

  /**
   * Assign variant based on weights or hash
   */
  private assignVariant(test: ABTest, userKey: string): string {
    if (test.weights) {
      // Use weighted random assignment
      const random = this.hashToFloat(userKey + test.name);
      let cumulative = 0;

      for (let i = 0; i < test.variants.length; i++) {
        cumulative += test.weights[i];
        if (random <= cumulative) {
          return test.variants[i];
        }
      }

      return test.variants[test.variants.length - 1];
    } else {
      // Equal distribution
      const hash = this.hashString(userKey + test.name);
      const index = hash % test.variants.length;
      return test.variants[index];
    }
  }

  /**
   * Generate session-based ID
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('ab_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('ab_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Hash string to number
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Hash string to float between 0 and 1
   */
  private hashToFloat(str: string): number {
    return this.hashString(str) / 2147483647; // Max 32-bit integer
  }

  /**
   * Track test assignment
   */
  private trackAssignment(testName: string, variant: string, userId: string): void {
    this.sendTrackingEvent({
      testName,
      variant,
      eventType: 'assignment',
      userId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send tracking event to analytics
   */
  private sendTrackingEvent(data: any): void {
    // Send to analytics service
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventType: 'ab_test_event',
          metadata: data
        })
      }).catch(error => {
        console.warn('Failed to track A/B test event:', error);
      });
    }
  }
}

// Create singleton instance
const abTesting = new ABTestingService();

// Register default tests
abTesting.registerTest({
  name: 'landing_page_cta',
  variants: ['original', 'spiritual_focus', 'urgency_focus'],
  weights: [0.4, 0.3, 0.3],
  enabled: true
});

abTesting.registerTest({
  name: 'form_introduction',
  variants: ['standard', 'personal', 'mystical'],
  weights: [0.33, 0.33, 0.34],
  enabled: true
});

abTesting.registerTest({
  name: 'email_consent_copy',
  variants: ['gentle', 'benefits_focused', 'community_focused'],
  enabled: true
});

// Export utility functions
export const getVariant = (testName: string, userId?: string): string => {
  return abTesting.getVariant(testName, userId);
};

export const trackConversion = (testName: string, eventType: string, userId?: string, metadata?: any): void => {
  abTesting.trackConversion(testName, eventType, userId);
};

export const isInVariant = (testName: string, variantName: string, userId?: string): boolean => {
  return abTesting.isInVariant(testName, variantName, userId);
};

export const getActiveTests = (userId?: string): ABTestResult[] => {
  return abTesting.getActiveTests(userId);
};

// React hook for A/B testing
export const useABTest = (testName: string, userId?: string) => {
  const variant = getVariant(testName, userId);

  const trackEvent = (eventType: string) => {
    trackConversion(testName, eventType, userId);
  };

  return {
    variant,
    isVariant: (variantName: string) => variant === variantName,
    trackEvent
  };
};

// Variant content helpers
export const getVariantContent = (testName: string, contentMap: Record<string, any>, userId?: string) => {
  const variant = getVariant(testName, userId);
  return contentMap[variant] || contentMap['control'] || contentMap['original'];
};

export default abTesting;
