/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  testMatch: ['**/server/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/index.js',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
