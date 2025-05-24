/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  testMatch: ['**/server/__tests__/**/*.test.js'],
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  transform: {
    '^.+\.js$': ['babel-jest', {
      presets: [['@babel/preset-env', { targets: { node: 'current' }, modules: false }]]
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(supertest)/)',
  ],
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
