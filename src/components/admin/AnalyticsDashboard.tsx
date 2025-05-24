import React, { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, Target, Mail, MessageCircle, BookOpen, CheckCircle } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    conversionRate: number;
    activeUsers: number;
    completionRate: number;
  };
  funnel: {
    funnelMetrics: {
      formCompletions: number;
      emailVerifications: number;
      chatbotEngagements: number;
      reflectionSubmissions: number;
      journeyCompletions: number;
    };
    conversionRates: {
      formCompletionToVerification: number;
      verificationToChatbot: number;
      chatbotToReflection: number;
      reflectionToCompletion: number;
      overallConversion: number;
    };
  };
  engagement: {
    engagementMetrics: {
      onboardingStages: Record<string, number>;
      registrationSources: Record<string, number>;
      recentRegistrations: Array<{
        id: string;
        healingName: string;
        email: string;
        registrationDate: string;
        source: string;
      }>;
    };
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, this would call your analytics API
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-neutral-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Analytics</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-6">
        <div className="text-center text-neutral-500">
          No analytics data available
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-neutral-800">Analytics Dashboard</h1>
          <p className="text-neutral-600">Sacred Healing Journey insights and metrics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Users</p>
              <p className="text-2xl font-bold text-neutral-800">
                {formatNumber(analyticsData.overview.totalUsers)}
              </p>
            </div>
            <Users className="w-8 h-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-neutral-800">
                {formatPercentage(analyticsData.overview.conversionRate)}
              </p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Active Users</p>
              <p className="text-2xl font-bold text-neutral-800">
                {formatNumber(analyticsData.overview.activeUsers)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Completion Rate</p>
              <p className="text-2xl font-bold text-neutral-800">
                {formatPercentage(analyticsData.overview.completionRate)}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-secondary-600" />
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-serif text-neutral-800 mb-6">Conversion Funnel</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary-600" />
              <span className="font-medium">Form Completions</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{formatNumber(analyticsData.funnel.funnelMetrics.formCompletions)}</div>
              <div className="text-sm text-neutral-600">100%</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Email Verifications</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{formatNumber(analyticsData.funnel.funnelMetrics.emailVerifications)}</div>
              <div className="text-sm text-neutral-600">
                {formatPercentage(analyticsData.funnel.conversionRates.formCompletionToVerification)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-accent-600" />
              <span className="font-medium">Chatbot Engagements</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{formatNumber(analyticsData.funnel.funnelMetrics.chatbotEngagements)}</div>
              <div className="text-sm text-neutral-600">
                {formatPercentage(analyticsData.funnel.conversionRates.verificationToChatbot)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-5 h-5 text-secondary-600" />
              <span className="font-medium">Reflection Submissions</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{formatNumber(analyticsData.funnel.funnelMetrics.reflectionSubmissions)}</div>
              <div className="text-sm text-neutral-600">
                {formatPercentage(analyticsData.funnel.conversionRates.chatbotToReflection)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-neutral-600" />
              <span className="font-medium">Journey Completions</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{formatNumber(analyticsData.funnel.funnelMetrics.journeyCompletions)}</div>
              <div className="text-sm text-neutral-600">
                {formatPercentage(analyticsData.funnel.conversionRates.reflectionToCompletion)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Sources and Onboarding Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-serif text-neutral-800 mb-4">Registration Sources</h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.engagement.engagementMetrics.registrationSources).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-neutral-600 capitalize">{source.replace('_', ' ')}</span>
                <span className="font-medium">{formatNumber(count)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-serif text-neutral-800 mb-4">Onboarding Stages</h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.engagement.engagementMetrics.onboardingStages).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-neutral-600">{stage}</span>
                <span className="font-medium">{formatNumber(count)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-serif text-neutral-800 mb-4">Recent Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 text-neutral-600">Healing Name</th>
                <th className="text-left py-2 text-neutral-600">Email</th>
                <th className="text-left py-2 text-neutral-600">Source</th>
                <th className="text-left py-2 text-neutral-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.engagement.engagementMetrics.recentRegistrations.slice(0, 10).map((registration) => (
                <tr key={registration.id} className="border-b border-neutral-100">
                  <td className="py-2 font-medium">{registration.healingName}</td>
                  <td className="py-2 text-neutral-600">{registration.email}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                      {registration.source}
                    </span>
                  </td>
                  <td className="py-2 text-neutral-600">
                    {new Date(registration.registrationDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
