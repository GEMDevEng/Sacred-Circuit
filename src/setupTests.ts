// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { setupTestUtils } from './__tests__/utils/test-utils';

// Setup test utilities
setupTestUtils();

// Mock environment variables
process.env.VITE_API_URL = 'http://localhost:3001';
process.env.VITE_SENTRY_DSN = 'https://test-dsn@sentry.io/test';
process.env.VITE_GA_MEASUREMENT_ID = 'GA-TEST-ID';
process.env.VITE_ENVIRONMENT = 'test';
process.env.VITE_RELEASE_VERSION = '1.0.0-test';

// Mock fetch globally
global.fetch = jest.fn();

// Mock crypto for Node.js environment
if (typeof globalThis.crypto === 'undefined') {
  const { webcrypto } = require('crypto');
  globalThis.crypto = webcrypto;
}

// Suppress console warnings in tests unless explicitly testing them
const originalWarn = console.warn;
const originalError = console.error;

beforeEach(() => {
  // Reset fetch mock
  (global.fetch as jest.Mock).mockClear();
});

afterEach(() => {
  // Clean up any timers
  jest.clearAllTimers();
  jest.useRealTimers();
});

// Suppress specific warnings that are expected in test environment
console.warn = (...args: any[]) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('React Router') ||
     message.includes('Warning: ReactDOM.render') ||
     message.includes('Warning: componentWillReceiveProps'))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

console.error = (...args: any[]) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    (message.includes('Warning: ReactDOM.render') ||
     message.includes('Warning: componentWillReceiveProps') ||
     message.includes('The above error occurred'))
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Mock the IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
  }
  root = null;
  rootMargin = '';
  thresholds = [];
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
  takeRecords = jest.fn().mockReturnValue([]);
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock toast notifications
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}));

// Suppress console errors during tests
console.error = jest.fn();

// Add a simple test to verify Jest is working
describe('Jest Setup', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
