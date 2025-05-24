import { getUserJourneyAnalytics } from './airtableService.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Track user conversion events
 * @param {Object} eventData - The event data to track
 * @returns {Promise<Object>} - The tracking result
 */
export async function trackConversionEvent(eventData) {
  try {
    const {
      eventType,
      userId,
      healingName,
      email,
      source,
      timestamp,
      metadata
    } = eventData;

    // Log the event (in production, this would go to analytics service)
    console.log('Conversion Event Tracked:', {
      eventType,
      userId,
      healingName,
      email: email ? email.substring(0, 3) + '***' : null, // Mask email for privacy
      source,
      timestamp: timestamp || new Date().toISOString(),
      metadata
    });

    // In a production environment, you would send this to:
    // - Google Analytics
    // - Mixpanel
    // - Amplitude
    // - Custom analytics database
    
    return {
      success: true,
      eventId: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: timestamp || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error tracking conversion event:', error);
    throw new Error('Failed to track conversion event');
  }
}

/**
 * Track form submission events
 * @param {Object} formData - The form submission data
 * @returns {Promise<Object>} - The tracking result
 */
export async function trackFormSubmission(formData) {
  try {
    const trackingData = {
      eventType: 'form_submission',
      source: 'google_forms',
      healingName: formData.healingName,
      email: formData.email,
      metadata: {
        hasHealingGoals: !!formData.healingGoals,
        hasFastingExperience: !!formData.fastingExperience,
        emailConsent: formData.emailConsent,
        formCompletionTime: formData.completionTime || null
      }
    };

    return await trackConversionEvent(trackingData);
  } catch (error) {
    console.error('Error tracking form submission:', error);
    throw new Error('Failed to track form submission');
  }
}

/**
 * Track email verification events
 * @param {Object} verificationData - The verification data
 * @returns {Promise<Object>} - The tracking result
 */
export async function trackEmailVerification(verificationData) {
  try {
    const trackingData = {
      eventType: 'email_verification',
      userId: verificationData.userId,
      email: verificationData.email,
      source: 'email_verification',
      metadata: {
        verificationMethod: verificationData.method || 'link',
        timeToVerify: verificationData.timeToVerify || null
      }
    };

    return await trackConversionEvent(trackingData);
  } catch (error) {
    console.error('Error tracking email verification:', error);
    throw new Error('Failed to track email verification');
  }
}

/**
 * Track chatbot engagement events
 * @param {Object} engagementData - The engagement data
 * @returns {Promise<Object>} - The tracking result
 */
export async function trackChatbotEngagement(engagementData) {
  try {
    const trackingData = {
      eventType: 'chatbot_engagement',
      userId: engagementData.userId,
      healingName: engagementData.healingName,
      source: 'chatbot',
      metadata: {
        messageCount: engagementData.messageCount || 1,
        sessionDuration: engagementData.sessionDuration || null,
        firstMessage: engagementData.isFirstMessage || false,
        consentGiven: engagementData.storeConversation || false
      }
    };

    return await trackConversionEvent(trackingData);
  } catch (error) {
    console.error('Error tracking chatbot engagement:', error);
    throw new Error('Failed to track chatbot engagement');
  }
}

/**
 * Track reflection submission events
 * @param {Object} reflectionData - The reflection data
 * @returns {Promise<Object>} - The tracking result
 */
export async function trackReflectionSubmission(reflectionData) {
  try {
    const trackingData = {
      eventType: 'reflection_submission',
      userId: reflectionData.userId,
      healingName: reflectionData.healingName,
      source: 'reflection_form',
      metadata: {
        milestone: reflectionData.milestone || 'unknown',
        contentLength: reflectionData.content ? reflectionData.content.length : 0,
        journeyDay: reflectionData.journeyDay || null
      }
    };

    return await trackConversionEvent(trackingData);
  } catch (error) {
    console.error('Error tracking reflection submission:', error);
    throw new Error('Failed to track reflection submission');
  }
}

/**
 * Get conversion funnel analytics
 * @param {Object} options - Analytics options
 * @returns {Promise<Object>} - Funnel analytics data
 */
export async function getConversionFunnelAnalytics(options = {}) {
  try {
    const {
      startDate,
      endDate,
      source
    } = options;

    // Get user journey analytics from Airtable
    const journeyAnalytics = await getUserJourneyAnalytics();

    // Calculate conversion funnel metrics
    const funnelMetrics = {
      landingPageViews: 0, // Would come from web analytics
      formStarts: 0, // Would track form initiation
      formCompletions: journeyAnalytics.totalUsers,
      emailVerifications: 0, // Would track verified users
      chatbotEngagements: 0, // Would track chatbot usage
      reflectionSubmissions: 0, // Would track reflection submissions
      journeyCompletions: 0 // Would track completed journeys
    };

    // Calculate conversion rates
    const conversionRates = {
      formStartToCompletion: funnelMetrics.formCompletions / Math.max(funnelMetrics.formStarts, 1),
      formCompletionToVerification: funnelMetrics.emailVerifications / Math.max(funnelMetrics.formCompletions, 1),
      verificationToChatbot: funnelMetrics.chatbotEngagements / Math.max(funnelMetrics.emailVerifications, 1),
      chatbotToReflection: funnelMetrics.reflectionSubmissions / Math.max(funnelMetrics.chatbotEngagements, 1),
      reflectionToCompletion: funnelMetrics.journeyCompletions / Math.max(funnelMetrics.reflectionSubmissions, 1),
      overallConversion: funnelMetrics.journeyCompletions / Math.max(funnelMetrics.landingPageViews, 1)
    };

    return {
      funnelMetrics,
      conversionRates,
      journeyAnalytics,
      generatedAt: new Date().toISOString(),
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null
      }
    };
  } catch (error) {
    console.error('Error getting conversion funnel analytics:', error);
    throw new Error('Failed to get conversion funnel analytics');
  }
}

/**
 * Get user engagement metrics
 * @param {Object} options - Analytics options
 * @returns {Promise<Object>} - Engagement metrics
 */
export async function getUserEngagementMetrics(options = {}) {
  try {
    const journeyAnalytics = await getUserJourneyAnalytics();

    // Calculate engagement metrics
    const engagementMetrics = {
      totalUsers: journeyAnalytics.totalUsers,
      activeUsers: 0, // Users who engaged in last 30 days
      retentionRate: 0, // Users who continue past day 7
      averageSessionDuration: 0, // Average chatbot session time
      averageMessagesPerSession: 0, // Average messages in chatbot
      reflectionRate: 0, // Percentage who submit reflections
      completionRate: 0, // Percentage who complete journey
      
      // Onboarding metrics
      onboardingStages: journeyAnalytics.onboardingStages,
      registrationSources: journeyAnalytics.registrationSources,
      
      // Recent activity
      recentRegistrations: journeyAnalytics.recentRegistrations
    };

    return {
      engagementMetrics,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting user engagement metrics:', error);
    throw new Error('Failed to get user engagement metrics');
  }
}

/**
 * Track A/B test events
 * @param {Object} testData - The A/B test data
 * @returns {Promise<Object>} - The tracking result
 */
export async function trackABTestEvent(testData) {
  try {
    const {
      testName,
      variant,
      userId,
      eventType,
      metadata
    } = testData;

    const trackingData = {
      eventType: 'ab_test_event',
      userId,
      source: 'ab_test',
      metadata: {
        testName,
        variant,
        originalEventType: eventType,
        ...metadata
      }
    };

    return await trackConversionEvent(trackingData);
  } catch (error) {
    console.error('Error tracking A/B test event:', error);
    throw new Error('Failed to track A/B test event');
  }
}

/**
 * Generate analytics dashboard data
 * @param {Object} options - Dashboard options
 * @returns {Promise<Object>} - Dashboard data
 */
export async function generateAnalyticsDashboard(options = {}) {
  try {
    const [
      funnelAnalytics,
      engagementMetrics
    ] = await Promise.all([
      getConversionFunnelAnalytics(options),
      getUserEngagementMetrics(options)
    ]);

    return {
      dashboard: {
        overview: {
          totalUsers: engagementMetrics.engagementMetrics.totalUsers,
          conversionRate: funnelAnalytics.conversionRates.overallConversion,
          activeUsers: engagementMetrics.engagementMetrics.activeUsers,
          completionRate: engagementMetrics.engagementMetrics.completionRate
        },
        funnel: funnelAnalytics,
        engagement: engagementMetrics,
        trends: {
          // Would include time-series data for charts
          registrationTrend: [],
          engagementTrend: [],
          conversionTrend: []
        }
      },
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating analytics dashboard:', error);
    throw new Error('Failed to generate analytics dashboard');
  }
}

export default {
  trackConversionEvent,
  trackFormSubmission,
  trackEmailVerification,
  trackChatbotEngagement,
  trackReflectionSubmission,
  getConversionFunnelAnalytics,
  getUserEngagementMetrics,
  trackABTestEvent,
  generateAnalyticsDashboard
};
