#!/usr/bin/env node

/**
 * Performance and Load Testing Script
 * 
 * This script performs various performance tests on the application:
 * - API endpoint load testing
 * - Frontend performance testing
 * - Database performance testing
 * - Memory usage monitoring
 */

import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.TEST_API_URL || 'http://localhost:3001',
  concurrentUsers: parseInt(process.env.CONCURRENT_USERS) || 10,
  testDuration: parseInt(process.env.TEST_DURATION) || 60000, // 1 minute
  requestDelay: parseInt(process.env.REQUEST_DELAY) || 1000, // 1 second
};

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  config: CONFIG,
  tests: [],
  summary: {},
};

/**
 * Utility function to measure execution time
 */
const measureTime = async (fn, name) => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    return { success: true, duration, result, name };
  } catch (error) {
    const duration = performance.now() - start;
    return { success: false, duration, error: error.message, name };
  }
};

/**
 * Test API endpoint performance
 */
const testApiEndpoint = async (endpoint, method = 'GET', body = null, headers = {}) => {
  const url = `${CONFIG.apiUrl}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return measureTime(async () => {
    const response = await fetch(url, options);
    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }, `API ${method} ${endpoint}`);
};

/**
 * Load test an API endpoint with multiple concurrent requests
 */
const loadTestEndpoint = async (endpoint, method = 'GET', body = null, headers = {}) => {
  console.log(`\n🔄 Load testing ${method} ${endpoint} with ${CONFIG.concurrentUsers} concurrent users...`);
  
  const results = [];
  const startTime = performance.now();
  const endTime = startTime + CONFIG.testDuration;

  // Create concurrent user simulations
  const userPromises = Array.from({ length: CONFIG.concurrentUsers }, async (_, userId) => {
    const userResults = [];
    
    while (performance.now() < endTime) {
      const result = await testApiEndpoint(endpoint, method, body, headers);
      userResults.push({
        ...result,
        userId,
        timestamp: new Date().toISOString(),
      });
      
      // Wait before next request
      await new Promise(resolve => setTimeout(resolve, CONFIG.requestDelay));
    }
    
    return userResults;
  });

  // Wait for all users to complete
  const allUserResults = await Promise.all(userPromises);
  const flatResults = allUserResults.flat();

  // Calculate statistics
  const successfulRequests = flatResults.filter(r => r.success);
  const failedRequests = flatResults.filter(r => !r.success);
  const durations = successfulRequests.map(r => r.duration);
  
  const stats = {
    endpoint,
    method,
    totalRequests: flatResults.length,
    successfulRequests: successfulRequests.length,
    failedRequests: failedRequests.length,
    successRate: (successfulRequests.length / flatResults.length) * 100,
    averageResponseTime: durations.reduce((a, b) => a + b, 0) / durations.length,
    minResponseTime: Math.min(...durations),
    maxResponseTime: Math.max(...durations),
    medianResponseTime: durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)],
    requestsPerSecond: flatResults.length / (CONFIG.testDuration / 1000),
    errors: failedRequests.map(r => ({ error: r.error, userId: r.userId })),
  };

  console.log(`✅ Completed load test for ${method} ${endpoint}`);
  console.log(`   Total requests: ${stats.totalRequests}`);
  console.log(`   Success rate: ${stats.successRate.toFixed(2)}%`);
  console.log(`   Average response time: ${stats.averageResponseTime.toFixed(2)}ms`);
  console.log(`   Requests per second: ${stats.requestsPerSecond.toFixed(2)}`);

  return stats;
};

/**
 * Test memory usage during load
 */
const testMemoryUsage = async (testFunction, testName) => {
  const initialMemory = process.memoryUsage();
  
  console.log(`\n🧠 Testing memory usage for ${testName}...`);
  
  const result = await testFunction();
  
  const finalMemory = process.memoryUsage();
  const memoryDelta = {
    rss: finalMemory.rss - initialMemory.rss,
    heapTotal: finalMemory.heapTotal - initialMemory.heapTotal,
    heapUsed: finalMemory.heapUsed - initialMemory.heapUsed,
    external: finalMemory.external - initialMemory.external,
  };

  console.log(`   Memory usage delta:`);
  console.log(`   RSS: ${(memoryDelta.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Heap Total: ${(memoryDelta.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Heap Used: ${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)} MB`);

  return {
    ...result,
    memoryUsage: {
      initial: initialMemory,
      final: finalMemory,
      delta: memoryDelta,
    },
  };
};

/**
 * Test database performance (if applicable)
 */
const testDatabasePerformance = async () => {
  console.log('\n🗄️  Testing database performance...');
  
  const tests = [
    // Test user authentication
    () => testApiEndpoint('/api/auth/login', 'POST', {
      email: 'test@example.com',
      password: 'testpassword123',
    }),
    
    // Test reflection submission
    () => testApiEndpoint('/api/reflection', 'POST', {
      content: 'This is a test reflection for performance testing',
      milestone: 'daily',
    }),
    
    // Test chat interaction
    () => testApiEndpoint('/api/chat', 'POST', {
      message: 'Hello, this is a test message for performance testing',
      healingName: 'TestUser',
    }),
    
    // Test reflection history retrieval
    () => testApiEndpoint('/api/reflection/history'),
  ];

  const results = [];
  for (const test of tests) {
    const result = await test();
    results.push(result);
  }

  return results;
};

/**
 * Test frontend performance using Lighthouse-style metrics
 */
const testFrontendPerformance = async () => {
  console.log('\n🌐 Testing frontend performance...');
  
  // This would typically use Puppeteer or Playwright to test actual frontend performance
  // For now, we'll simulate by testing static asset loading
  
  const staticAssets = [
    '/favicon.ico',
    '/manifest.json',
    // Add more static assets as needed
  ];

  const results = [];
  for (const asset of staticAssets) {
    const result = await measureTime(async () => {
      const response = await fetch(`${CONFIG.baseUrl}${asset}`);
      return {
        status: response.status,
        size: parseInt(response.headers.get('content-length') || '0'),
        contentType: response.headers.get('content-type'),
      };
    }, `Static Asset ${asset}`);
    
    results.push(result);
  }

  return results;
};

/**
 * Run comprehensive performance test suite
 */
const runPerformanceTests = async () => {
  console.log('🚀 Starting comprehensive performance test suite...');
  console.log(`Configuration:`);
  console.log(`  Base URL: ${CONFIG.baseUrl}`);
  console.log(`  API URL: ${CONFIG.apiUrl}`);
  console.log(`  Concurrent Users: ${CONFIG.concurrentUsers}`);
  console.log(`  Test Duration: ${CONFIG.testDuration}ms`);
  console.log(`  Request Delay: ${CONFIG.requestDelay}ms`);

  try {
    // Test 1: API Endpoint Load Testing
    console.log('\n📊 Phase 1: API Endpoint Load Testing');
    const apiLoadTests = await Promise.all([
      loadTestEndpoint('/api/health'),
      loadTestEndpoint('/api/chat', 'POST', {
        message: 'Performance test message',
        healingName: 'TestUser',
      }),
      loadTestEndpoint('/api/reflection', 'POST', {
        content: 'Performance test reflection',
        milestone: 'daily',
      }),
    ]);
    testResults.tests.push({ phase: 'API Load Testing', results: apiLoadTests });

    // Test 2: Database Performance
    console.log('\n📊 Phase 2: Database Performance Testing');
    const dbPerformance = await testMemoryUsage(testDatabasePerformance, 'Database Operations');
    testResults.tests.push({ phase: 'Database Performance', results: dbPerformance });

    // Test 3: Frontend Performance
    console.log('\n📊 Phase 3: Frontend Performance Testing');
    const frontendPerformance = await testMemoryUsage(testFrontendPerformance, 'Frontend Assets');
    testResults.tests.push({ phase: 'Frontend Performance', results: frontendPerformance });

    // Calculate overall summary
    const allApiTests = apiLoadTests.flat();
    testResults.summary = {
      totalApiRequests: allApiTests.reduce((sum, test) => sum + test.totalRequests, 0),
      overallSuccessRate: allApiTests.reduce((sum, test) => sum + test.successRate, 0) / allApiTests.length,
      averageResponseTime: allApiTests.reduce((sum, test) => sum + test.averageResponseTime, 0) / allApiTests.length,
      totalRequestsPerSecond: allApiTests.reduce((sum, test) => sum + test.requestsPerSecond, 0),
      testDuration: CONFIG.testDuration,
      concurrentUsers: CONFIG.concurrentUsers,
    };

    console.log('\n📈 Performance Test Summary:');
    console.log(`  Total API Requests: ${testResults.summary.totalApiRequests}`);
    console.log(`  Overall Success Rate: ${testResults.summary.overallSuccessRate.toFixed(2)}%`);
    console.log(`  Average Response Time: ${testResults.summary.averageResponseTime.toFixed(2)}ms`);
    console.log(`  Total Requests/Second: ${testResults.summary.totalRequestsPerSecond.toFixed(2)}`);

    // Save results to file
    const resultsPath = path.join(__dirname, '../test-results/performance-test-results.json');
    await fs.mkdir(path.dirname(resultsPath), { recursive: true });
    await fs.writeFile(resultsPath, JSON.stringify(testResults, null, 2));
    
    console.log(`\n💾 Results saved to: ${resultsPath}`);
    console.log('✅ Performance testing completed successfully!');

    // Check if performance meets thresholds
    const performanceThresholds = {
      maxAverageResponseTime: 2000, // 2 seconds
      minSuccessRate: 95, // 95%
      minRequestsPerSecond: 10,
    };

    const issues = [];
    if (testResults.summary.averageResponseTime > performanceThresholds.maxAverageResponseTime) {
      issues.push(`Average response time (${testResults.summary.averageResponseTime.toFixed(2)}ms) exceeds threshold (${performanceThresholds.maxAverageResponseTime}ms)`);
    }
    if (testResults.summary.overallSuccessRate < performanceThresholds.minSuccessRate) {
      issues.push(`Success rate (${testResults.summary.overallSuccessRate.toFixed(2)}%) below threshold (${performanceThresholds.minSuccessRate}%)`);
    }
    if (testResults.summary.totalRequestsPerSecond < performanceThresholds.minRequestsPerSecond) {
      issues.push(`Requests per second (${testResults.summary.totalRequestsPerSecond.toFixed(2)}) below threshold (${performanceThresholds.minRequestsPerSecond})`);
    }

    if (issues.length > 0) {
      console.log('\n⚠️  Performance Issues Detected:');
      issues.forEach(issue => console.log(`   - ${issue}`));
      process.exit(1);
    } else {
      console.log('\n✅ All performance thresholds met!');
    }

  } catch (error) {
    console.error('\n❌ Performance testing failed:', error);
    process.exit(1);
  }
};

// Run the tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPerformanceTests().catch(console.error);
}

export {
  runPerformanceTests,
  testApiEndpoint,
  loadTestEndpoint,
  testMemoryUsage,
  testDatabasePerformance,
  testFrontendPerformance,
};
