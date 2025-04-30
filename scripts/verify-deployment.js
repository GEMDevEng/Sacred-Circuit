#!/usr/bin/env node

/**
 * Post-deployment verification script
 * 
 * This script verifies that the deployment was successful by:
 * 1. Checking that the frontend is accessible
 * 2. Checking that the backend API is accessible
 * 3. Checking that key functionality is working
 */

const https = require('https');
const { URL } = require('url');

// Get the deployment URL from environment variables
const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || 'https://sacred-circuit.vercel.app';

// Define the endpoints to check
const endpoints = [
  { path: '/', name: 'Frontend' },
  { path: '/api/health', name: 'Backend Health Check' },
  { path: '/api/chat/health', name: 'Chatbot Health Check' },
  { path: '/api/reflection/health', name: 'Reflection Health Check' }
];

// Function to make an HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Sacred-Circuit-Deployment-Verification/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Main verification function
async function verifyDeployment() {
  console.log(`Verifying deployment at ${DEPLOYMENT_URL}...`);
  
  let allPassed = true;
  
  for (const endpoint of endpoints) {
    const url = `${DEPLOYMENT_URL}${endpoint.path}`;
    console.log(`\nChecking ${endpoint.name} at ${url}...`);
    
    try {
      const response = await makeRequest(url);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        console.log(`✅ ${endpoint.name} is accessible (${response.statusCode})`);
        
        // For API endpoints, check the response format
        if (endpoint.path.startsWith('/api/')) {
          try {
            const data = JSON.parse(response.data);
            if (data.success === true) {
              console.log(`✅ ${endpoint.name} returned a valid response`);
            } else {
              console.error(`❌ ${endpoint.name} returned an invalid response: ${JSON.stringify(data)}`);
              allPassed = false;
            }
          } catch (error) {
            console.error(`❌ ${endpoint.name} returned invalid JSON: ${error.message}`);
            allPassed = false;
          }
        }
      } else {
        console.error(`❌ ${endpoint.name} returned status code ${response.statusCode}`);
        allPassed = false;
      }
    } catch (error) {
      console.error(`❌ Error checking ${endpoint.name}: ${error.message}`);
      allPassed = false;
    }
  }
  
  console.log('\n--- Verification Summary ---');
  if (allPassed) {
    console.log('✅ All checks passed! Deployment is successful.');
    process.exit(0);
  } else {
    console.error('❌ Some checks failed. Deployment may have issues.');
    process.exit(1);
  }
}

// Run the verification
verifyDeployment().catch((error) => {
  console.error(`Fatal error during verification: ${error.message}`);
  process.exit(1);
});
