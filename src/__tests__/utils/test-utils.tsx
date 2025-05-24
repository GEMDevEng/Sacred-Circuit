import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock user for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  healingName: 'TestUser',
  role: 'user' as const,
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock admin user for testing
export const mockAdminUser = {
  ...mockUser,
  role: 'admin' as 'user' | 'admin',
  email: 'admin@example.com',
  healingName: 'AdminUser',
};

// Mock auth context value
export const mockAuthContextValue = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  error: null,
  login: jest.fn().mockResolvedValue(undefined),
  register: jest.fn().mockResolvedValue(undefined),
  logout: jest.fn().mockResolvedValue(undefined),
  clearError: jest.fn(),
  updateProfile: jest.fn().mockResolvedValue(undefined),
  changePassword: jest.fn().mockResolvedValue(undefined),
  requestPasswordReset: jest.fn().mockResolvedValue(undefined),
  resetPassword: jest.fn().mockResolvedValue(undefined),
  verifyEmail: jest.fn().mockResolvedValue(undefined),
  resendVerification: jest.fn().mockResolvedValue(undefined),
};

// Mock unauthenticated auth context value
export const mockUnauthenticatedAuthContextValue = {
  ...mockAuthContextValue,
  user: null as any,
  isAuthenticated: false,
};

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  authContextValue?: any;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    initialEntries = ['/'],
    authContextValue = mockAuthContextValue,
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  // Mock AuthContext
  const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const AuthContext = React.createContext(authContextValue);
    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
  };

  const Wrapper = ({ children }: { children?: React.ReactNode }) => {
    return (
      <BrowserRouter>
        <MockAuthProvider>
          {children}
        </MockAuthProvider>
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Helper function to render with unauthenticated state
export const renderWithUnauthenticatedUser = (ui: ReactElement, options?: CustomRenderOptions) => {
  return renderWithProviders(ui, {
    ...options,
    authContextValue: mockUnauthenticatedAuthContextValue,
  });
};

// Helper function to render with admin user
export const renderWithAdminUser = (ui: ReactElement, options?: CustomRenderOptions) => {
  return renderWithProviders(ui, {
    ...options,
    authContextValue: {
      ...mockAuthContextValue,
      user: mockAdminUser as any,
    },
  });
};

// Mock API responses
export const mockApiResponses = {
  login: {
    success: true,
    data: { user: mockUser, token: 'mock-token' },
  },
  register: {
    success: true,
    data: { user: mockUser, token: 'mock-token' },
  },
  getCurrentUser: {
    success: true,
    data: mockUser,
  },
  chatResponse: {
    success: true,
    data: {
      response: 'This is a mock chat response for testing purposes.',
      conversationId: 'mock-conversation-id',
    },
  },
  reflectionSubmit: {
    success: true,
    data: {
      id: 'mock-reflection-id',
      message: 'Reflection submitted successfully',
    },
  },
  reflectionHistory: {
    success: true,
    data: [
      {
        id: 'reflection-1',
        content: 'Test reflection content',
        createdAt: new Date().toISOString(),
        milestone: 'daily',
      },
    ],
  },
};

// Mock fetch function
export const mockFetch = (response: any, ok = true, status = 200) => {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    json: jest.fn().mockResolvedValue(response),
    text: jest.fn().mockResolvedValue(JSON.stringify(response)),
  });
};

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

// Mock window.location
export const mockLocation = (url = 'http://localhost:3000/') => {
  const location = new URL(url);
  Object.defineProperty(window, 'location', {
    value: {
      ...location,
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
    },
    writable: true,
  });
};

// Mock console methods for testing
export const mockConsole = () => {
  const originalConsole = { ...console };

  beforeEach(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.info = jest.fn();
  });

  afterEach(() => {
    Object.assign(console, originalConsole);
  });
};

// Wait for async operations to complete
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock performance.now for consistent timing in tests
export const mockPerformanceNow = () => {
  let time = 0;
  jest.spyOn(performance, 'now').mockImplementation(() => {
    time += 100; // Increment by 100ms each call
    return time;
  });
};

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });
  window.IntersectionObserver = mockIntersectionObserver;
  window.IntersectionObserverEntry = jest.fn();
};

// Mock ResizeObserver
export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });
  window.ResizeObserver = mockResizeObserver;
};

// Mock matchMedia
export const mockMatchMedia = () => {
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
};

// Test data generators
export const generateMockReflection = (overrides = {}) => ({
  id: `reflection-${Math.random().toString(36).substr(2, 9)}`,
  content: 'This is a test reflection content',
  milestone: 'daily',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const generateMockChatMessage = (overrides = {}) => ({
  id: `message-${Math.random().toString(36).substr(2, 9)}`,
  content: 'This is a test chat message',
  role: 'user' as const,
  timestamp: new Date().toISOString(),
  ...overrides,
});

export const generateMockUser = (overrides = {}) => ({
  id: `user-${Math.random().toString(36).substr(2, 9)}`,
  email: 'test@example.com',
  healingName: 'TestUser',
  role: 'user' as const,
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Custom matchers for better assertions
export const customMatchers = {
  toBeValidEmail: (received: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);

    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid email`,
      pass,
    };
  },

  toBeValidHealingName: (received: string) => {
    const pass = received.length >= 2 && received.length <= 50 && /^[a-zA-Z\s]+$/.test(received);

    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid healing name`,
      pass,
    };
  },
};

// Setup function to be called in setupTests.ts
export const setupTestUtils = () => {
  // Mock global objects
  mockIntersectionObserver();
  mockResizeObserver();
  mockMatchMedia();

  // Mock localStorage and sessionStorage
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage() });
  Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage() });

  // Mock location
  mockLocation();

  // Add custom matchers
  expect.extend(customMatchers);
};

export default {
  renderWithProviders,
  renderWithUnauthenticatedUser,
  renderWithAdminUser,
  mockUser,
  mockAdminUser,
  mockAuthContextValue,
  mockUnauthenticatedAuthContextValue,
  mockApiResponses,
  mockFetch,
  mockLocalStorage,
  mockSessionStorage,
  mockLocation,
  mockConsole,
  waitForAsync,
  mockPerformanceNow,
  mockIntersectionObserver,
  mockResizeObserver,
  mockMatchMedia,
  generateMockReflection,
  generateMockChatMessage,
  generateMockUser,
  customMatchers,
  setupTestUtils,
};
