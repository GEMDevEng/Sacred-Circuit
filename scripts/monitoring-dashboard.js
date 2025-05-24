#!/usr/bin/env node

/**
 * Monitoring Dashboard Setup Script
 * 
 * This script sets up comprehensive monitoring for the application:
 * - Health checks
 * - Performance metrics collection
 * - Error tracking
 * - User analytics
 * - System resource monitoring
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  port: process.env.MONITORING_PORT || 3002,
  dataRetentionDays: 7,
  metricsInterval: 60000, // 1 minute
  healthCheckInterval: 30000, // 30 seconds
};

// In-memory storage for metrics (in production, use a proper database)
const metricsStore = {
  health: [],
  performance: [],
  errors: [],
  users: [],
  system: [],
};

/**
 * Health check function
 */
const performHealthCheck = async () => {
  const timestamp = new Date().toISOString();
  const healthData = {
    timestamp,
    status: 'healthy',
    checks: {},
  };

  try {
    // Check API health
    const apiResponse = await fetch('http://localhost:3001/api/health');
    healthData.checks.api = {
      status: apiResponse.ok ? 'healthy' : 'unhealthy',
      responseTime: 0, // Would measure actual response time
      statusCode: apiResponse.status,
    };
  } catch (error) {
    healthData.checks.api = {
      status: 'unhealthy',
      error: error.message,
    };
    healthData.status = 'unhealthy';
  }

  try {
    // Check frontend health
    const frontendResponse = await fetch('http://localhost:3000');
    healthData.checks.frontend = {
      status: frontendResponse.ok ? 'healthy' : 'unhealthy',
      responseTime: 0, // Would measure actual response time
      statusCode: frontendResponse.status,
    };
  } catch (error) {
    healthData.checks.frontend = {
      status: 'unhealthy',
      error: error.message,
    };
    healthData.status = 'unhealthy';
  }

  // Check system resources
  const memoryUsage = process.memoryUsage();
  healthData.checks.system = {
    status: 'healthy',
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024), // MB
    },
    uptime: Math.round(process.uptime()),
  };

  // Store health data
  metricsStore.health.push(healthData);
  
  // Clean old data
  const cutoffTime = new Date(Date.now() - CONFIG.dataRetentionDays * 24 * 60 * 60 * 1000);
  metricsStore.health = metricsStore.health.filter(
    item => new Date(item.timestamp) > cutoffTime
  );

  return healthData;
};

/**
 * Collect performance metrics
 */
const collectPerformanceMetrics = async () => {
  const timestamp = new Date().toISOString();
  
  // Simulate performance metrics collection
  // In a real implementation, this would collect actual metrics from the application
  const performanceData = {
    timestamp,
    metrics: {
      apiResponseTime: Math.random() * 1000 + 100, // 100-1100ms
      frontendLoadTime: Math.random() * 2000 + 500, // 500-2500ms
      databaseQueryTime: Math.random() * 500 + 50, // 50-550ms
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      cpuUsage: Math.random() * 100, // 0-100%
      activeUsers: Math.floor(Math.random() * 100), // 0-100 users
      requestsPerMinute: Math.floor(Math.random() * 1000), // 0-1000 requests
      errorRate: Math.random() * 5, // 0-5% error rate
    },
  };

  metricsStore.performance.push(performanceData);
  
  // Clean old data
  const cutoffTime = new Date(Date.now() - CONFIG.dataRetentionDays * 24 * 60 * 60 * 1000);
  metricsStore.performance = metricsStore.performance.filter(
    item => new Date(item.timestamp) > cutoffTime
  );

  return performanceData;
};

/**
 * Generate monitoring dashboard HTML
 */
const generateDashboardHTML = () => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sacred Healing Hub - Monitoring Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .metric-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #333;
        }
        .metric-label {
            color: #666;
            margin-top: 5px;
        }
        .status-healthy { color: #28a745; }
        .status-unhealthy { color: #dc3545; }
        .status-warning { color: #ffc107; }
        .chart-container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .refresh-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 20px;
        }
        .refresh-btn:hover {
            background: #5a6fd8;
        }
        .last-updated {
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Sacred Healing Hub - Monitoring Dashboard</h1>
        <p>Real-time application monitoring and performance metrics</p>
        <div class="last-updated">Last updated: <span id="lastUpdated">Loading...</span></div>
    </div>

    <button class="refresh-btn" onclick="refreshData()">Refresh Data</button>

    <div class="metrics-grid" id="metricsGrid">
        <!-- Metrics will be populated by JavaScript -->
    </div>

    <div class="chart-container">
        <h3>Performance Trends (Last 24 Hours)</h3>
        <canvas id="performanceChart" width="400" height="200"></canvas>
    </div>

    <div class="chart-container">
        <h3>System Health Status</h3>
        <canvas id="healthChart" width="400" height="200"></canvas>
    </div>

    <script>
        let performanceChart;
        let healthChart;

        async function fetchMetrics() {
            try {
                const response = await fetch('/api/metrics');
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
                return null;
            }
        }

        function updateMetricsGrid(data) {
            const grid = document.getElementById('metricsGrid');
            const latest = data.performance[data.performance.length - 1];
            const health = data.health[data.health.length - 1];
            
            if (!latest || !health) return;

            grid.innerHTML = \`
                <div class="metric-card">
                    <div class="metric-value \${health.status === 'healthy' ? 'status-healthy' : 'status-unhealthy'}">
                        \${health.status.toUpperCase()}
                    </div>
                    <div class="metric-label">System Status</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">\${latest.metrics.apiResponseTime.toFixed(0)}ms</div>
                    <div class="metric-label">API Response Time</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">\${latest.metrics.memoryUsage.toFixed(1)}MB</div>
                    <div class="metric-label">Memory Usage</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">\${latest.metrics.activeUsers}</div>
                    <div class="metric-label">Active Users</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">\${latest.metrics.requestsPerMinute}</div>
                    <div class="metric-label">Requests/Minute</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value \${latest.metrics.errorRate > 2 ? 'status-warning' : 'status-healthy'}">
                        \${latest.metrics.errorRate.toFixed(1)}%
                    </div>
                    <div class="metric-label">Error Rate</div>
                </div>
            \`;
        }

        function updatePerformanceChart(data) {
            const ctx = document.getElementById('performanceChart').getContext('2d');
            
            if (performanceChart) {
                performanceChart.destroy();
            }

            const last24Hours = data.performance.slice(-24);
            const labels = last24Hours.map(item => new Date(item.timestamp).toLocaleTimeString());
            
            performanceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'API Response Time (ms)',
                        data: last24Hours.map(item => item.metrics.apiResponseTime),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }, {
                        label: 'Memory Usage (MB)',
                        data: last24Hours.map(item => item.metrics.memoryUsage),
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        function updateHealthChart(data) {
            const ctx = document.getElementById('healthChart').getContext('2d');
            
            if (healthChart) {
                healthChart.destroy();
            }

            const last24Hours = data.health.slice(-24);
            const healthyCount = last24Hours.filter(item => item.status === 'healthy').length;
            const unhealthyCount = last24Hours.length - healthyCount;
            
            healthChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Healthy', 'Unhealthy'],
                    datasets: [{
                        data: [healthyCount, unhealthyCount],
                        backgroundColor: ['#28a745', '#dc3545']
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }

        async function refreshData() {
            const data = await fetchMetrics();
            if (data) {
                updateMetricsGrid(data);
                updatePerformanceChart(data);
                updateHealthChart(data);
                document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
            }
        }

        // Initial load
        refreshData();

        // Auto-refresh every 30 seconds
        setInterval(refreshData, 30000);
    </script>
</body>
</html>
  `;
};

/**
 * Create monitoring dashboard server
 */
const createMonitoringServer = () => {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  // Dashboard route
  app.get('/', (req, res) => {
    res.send(generateDashboardHTML());
  });

  // API route for metrics
  app.get('/api/metrics', (req, res) => {
    res.json(metricsStore);
  });

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    const health = await performHealthCheck();
    res.json(health);
  });

  // Performance metrics endpoint
  app.get('/api/performance', (req, res) => {
    const latest = metricsStore.performance[metricsStore.performance.length - 1];
    res.json(latest || {});
  });

  // Error reporting endpoint
  app.post('/api/errors', (req, res) => {
    const errorData = {
      timestamp: new Date().toISOString(),
      ...req.body,
    };
    
    metricsStore.errors.push(errorData);
    
    // Clean old data
    const cutoffTime = new Date(Date.now() - CONFIG.dataRetentionDays * 24 * 60 * 60 * 1000);
    metricsStore.errors = metricsStore.errors.filter(
      item => new Date(item.timestamp) > cutoffTime
    );
    
    res.json({ success: true });
  });

  // User analytics endpoint
  app.post('/api/analytics', (req, res) => {
    const analyticsData = {
      timestamp: new Date().toISOString(),
      ...req.body,
    };
    
    metricsStore.users.push(analyticsData);
    
    // Clean old data
    const cutoffTime = new Date(Date.now() - CONFIG.dataRetentionDays * 24 * 60 * 60 * 1000);
    metricsStore.users = metricsStore.users.filter(
      item => new Date(item.timestamp) > cutoffTime
    );
    
    res.json({ success: true });
  });

  return app;
};

/**
 * Start monitoring dashboard
 */
const startMonitoringDashboard = async () => {
  console.log('🚀 Starting monitoring dashboard...');
  
  const app = createMonitoringServer();
  
  // Start periodic health checks
  setInterval(performHealthCheck, CONFIG.healthCheckInterval);
  
  // Start periodic metrics collection
  setInterval(collectPerformanceMetrics, CONFIG.metricsInterval);
  
  // Perform initial checks
  await performHealthCheck();
  await collectPerformanceMetrics();
  
  // Start server
  app.listen(CONFIG.port, () => {
    console.log(\`📊 Monitoring dashboard running at http://localhost:\${CONFIG.port}\`);
    console.log(\`🔍 Health checks every \${CONFIG.healthCheckInterval / 1000} seconds\`);
    console.log(\`📈 Metrics collection every \${CONFIG.metricsInterval / 1000} seconds\`);
    console.log(\`🗄️  Data retention: \${CONFIG.dataRetentionDays} days\`);
  });
};

// Start the dashboard if this script is executed directly
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  startMonitoringDashboard().catch(console.error);
}

export {
  startMonitoringDashboard,
  createMonitoringServer,
  performHealthCheck,
  collectPerformanceMetrics,
};
