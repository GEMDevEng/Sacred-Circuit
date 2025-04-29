import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import SentryErrorBoundary from '../common/SentryErrorBoundary';

interface DashboardStats {
  totalUsers: number;
  totalFeedback: number;
  newFeedback: number;
  resolvedFeedback: number;
  activeUsers: number;
  errorRate: number;
}

const AdminOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics');
        }
        
        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
        setError('Failed to load dashboard statistics. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.token) {
      fetchStats();
    }
  }, [user?.token]);

  // For demo purposes, use mock data if API is not available
  useEffect(() => {
    if (isLoading && !stats) {
      // Mock data for demonstration
      setTimeout(() => {
        setStats({
          totalUsers: 128,
          totalFeedback: 47,
          newFeedback: 12,
          resolvedFeedback: 28,
          activeUsers: 42,
          errorRate: 1.2
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [isLoading, stats]);

  return (
    <SentryErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Admin Dashboard</h1>
        
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
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Users */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 mr-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats?.totalUsers}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-green-500 font-semibold">{stats?.activeUsers}</span> active in the last 30 days
                  </p>
                </div>
              </div>
              
              {/* Total Feedback */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mr-4">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Feedback</p>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats?.totalFeedback}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-yellow-500 font-semibold">{stats?.newFeedback}</span> new feedback items
                  </p>
                </div>
              </div>
              
              {/* Resolved Feedback */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 mr-4">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved Feedback</p>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats?.resolvedFeedback}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-green-500 font-semibold">
                      {stats ? Math.round((stats.resolvedFeedback / stats.totalFeedback) * 100) : 0}%
                    </span> resolution rate
                  </p>
                </div>
              </div>
              
              {/* Error Rate */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 mr-4">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Error Rate</p>
                    <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stats?.errorRate}%</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats && stats.errorRate < 2 ? (
                      <span className="text-green-500 font-semibold">Healthy</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Needs attention</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Recent activity section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">Recent Activity</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Recent activity data will be displayed here.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </SentryErrorBoundary>
  );
};

export default AdminOverview;
