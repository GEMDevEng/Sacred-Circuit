/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
    }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^framer-motion$': '<rootDir>/src/__tests__/__mocks__/framer-motion.tsx',
    '^react-router-dom$': '<rootDir>/src/__tests__/__mocks__/react-router-dom.tsx',
    '^../common/Button$': '<rootDir>/src/__tests__/__mocks__/Button.tsx',
    '^../../components/common/Button$': '<rootDir>/src/__tests__/__mocks__/Button.tsx',
    '^../common/SentryErrorBoundary$': '<rootDir>/src/__tests__/__mocks__/SentryErrorBoundary.tsx',
    '^../../components/common/SentryErrorBoundary$': '<rootDir>/src/__tests__/__mocks__/SentryErrorBoundary.tsx',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)', '**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
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
