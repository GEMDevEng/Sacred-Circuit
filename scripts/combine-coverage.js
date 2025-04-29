/**
 * Script to combine coverage reports from frontend and backend tests
 */
const fs = require('fs');
const path = require('path');
const { createCoverageMap } = require('istanbul-lib-coverage');
const { createContext } = require('istanbul-lib-report');
const reports = require('istanbul-reports');

// Paths to coverage reports
const frontendCoveragePath = path.resolve(__dirname, '../coverage/frontend/coverage-final.json');
const backendCoveragePath = path.resolve(__dirname, '../coverage/backend/coverage-final.json');
const combinedOutputDir = path.resolve(__dirname, '../coverage/combined');

// Ensure output directory exists
if (!fs.existsSync(combinedOutputDir)) {
  fs.mkdirSync(combinedOutputDir, { recursive: true });
}

// Create a coverage map
const coverageMap = createCoverageMap({});

// Read and merge frontend coverage
if (fs.existsSync(frontendCoveragePath)) {
  const frontendCoverage = JSON.parse(fs.readFileSync(frontendCoveragePath, 'utf8'));
  coverageMap.merge(frontendCoverage);
  console.log('✅ Frontend coverage merged');
} else {
  console.warn('⚠️ Frontend coverage file not found');
}

// Read and merge backend coverage
if (fs.existsSync(backendCoveragePath)) {
  const backendCoverage = JSON.parse(fs.readFileSync(backendCoveragePath, 'utf8'));
  coverageMap.merge(backendCoverage);
  console.log('✅ Backend coverage merged');
} else {
  console.warn('⚠️ Backend coverage file not found');
}

// Create reporting context
const context = createContext({
  dir: combinedOutputDir,
  coverageMap
});

// Generate reports
['lcov', 'text', 'html', 'json-summary'].forEach(reporter => {
  reports.create(reporter).execute(context);
});

// Calculate overall coverage
const summary = coverageMap.getCoverageSummary();
const metrics = {
  statements: summary.statements.pct,
  branches: summary.branches.pct,
  functions: summary.functions.pct,
  lines: summary.lines.pct
};

// Write summary to file
fs.writeFileSync(
  path.join(combinedOutputDir, 'summary.json'),
  JSON.stringify(metrics, null, 2)
);

console.log('\n📊 Combined Coverage Summary:');
console.log(`Statements: ${metrics.statements.toFixed(2)}%`);
console.log(`Branches: ${metrics.branches.toFixed(2)}%`);
console.log(`Functions: ${metrics.functions.toFixed(2)}%`);
console.log(`Lines: ${metrics.lines.toFixed(2)}%`);
console.log(`\nDetailed reports available in: ${combinedOutputDir}`);
