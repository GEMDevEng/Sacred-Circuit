import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import * as api from '../../utils/api';

// Mock the API functions
jest.mock('../../utils/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Clear localStorage
    localStorage.clear();
    
    // Mock localStorage.getItem
    jest.spyOn(Storage.prototype, 'getItem');
    
    // Mock localStorage.setItem
    jest.spyOn(Storage.prototype, 'setItem');
    
    // Mock localStorage.removeItem
    jest.spyOn(Storage.prototype, 'removeItem');
  });

  test('provides authentication state', () => {
    const TestComponent = () => {
      const { isAuthenticated, user, isLoading } = useAuth();
      return (
        <div>
          <div data-testid="auth-status">
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </div>
          <div data-testid="loading-status">
            {isLoading ? 'Loading' : 'Not Loading'}
          </div>
          <div data-testid="user-info">
            {user ? user.healingName : 'No User'}
          </div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially not authenticated and loading
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
  });

  test('checks for existing token on mount', async () => {
    // Mock localStorage to return a token
    localStorage.setItem('token', 'test-token');
    
    // Mock getCurrentUser to return a user
    const mockUser = {
      id: '1',
      healingName: 'TestUser',
      email: 'test@example.com',
      role: 'user',
    };
    (api.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const TestComponent = () => {
      const { isAuthenticated, user, isLoading } = useAuth();
      return (
        <div>
          <div data-testid="auth-status">
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </div>
          <div data-testid="loading-status">
            {isLoading ? 'Loading' : 'Not Loading'}
          </div>
          <div data-testid="user-info">
            {user ? user.healingName : 'No User'}
          </div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for the async check to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
    });

    // Should be authenticated with user info
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-info')).toHaveTextContent('TestUser');
    
    // Should have called getCurrentUser
    expect(api.getCurrentUser).toHaveBeenCalled();
  });

  test('login function authenticates user', async () => {
    // Mock login API response
    const mockUser = {
      id: '1',
      healingName: 'TestUser',
      email: 'test@example.com',
      role: 'user',
    };
    const mockResponse = {
      user: mockUser,
      accessToken: 'test-token',
    };
    (api.login as jest.Mock).mockResolvedValue(mockResponse);

    // Create a wrapper component to access the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    // Render the hook with the wrapper
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Call login
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    // Check that the API was called with correct parameters
    expect(api.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });

    // Check that the user is authenticated
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    
    // Check that the token was stored in localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
  });

  test('register function creates and authenticates user', async () => {
    // Mock register API response
    const mockUser = {
      id: '1',
      healingName: 'NewUser',
      email: 'new@example.com',
      role: 'user',
    };
    const mockResponse = {
      user: mockUser,
      accessToken: 'test-token',
    };
    (api.register as jest.Mock).mockResolvedValue(mockResponse);

    // Create a wrapper component to access the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    // Render the hook with the wrapper
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Call register
    await act(async () => {
      await result.current.register('NewUser', 'new@example.com', 'password');
    });

    // Check that the API was called with correct parameters
    expect(api.register).toHaveBeenCalledWith({
      healingName: 'NewUser',
      email: 'new@example.com',
      password: 'password',
    });

    // Check that the user is authenticated
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    
    // Check that the token was stored in localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
  });

  test('logout function clears authentication', async () => {
    // Set initial authenticated state
    localStorage.setItem('token', 'test-token');
    
    // Mock getCurrentUser to return a user
    const mockUser = {
      id: '1',
      healingName: 'TestUser',
      email: 'test@example.com',
      role: 'user',
    };
    (api.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    
    // Mock logout API
    (api.logout as jest.Mock).mockResolvedValue(undefined);

    // Create a wrapper component to access the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    // Render the hook with the wrapper
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for initial authentication to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify initial authenticated state
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);

    // Call logout
    await act(async () => {
      await result.current.logout();
    });

    // Check that the API was called
    expect(api.logout).toHaveBeenCalled();

    // Check that the user is no longer authenticated
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    
    // Check that the token was removed from localStorage
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  test('handles login errors', async () => {
    // Mock login API to throw an error
    const errorMessage = 'Invalid credentials';
    (api.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Create a wrapper component to access the hook
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    // Render the hook with the wrapper
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Call login and expect it to throw
    await expect(
      act(async () => {
        await result.current.login('test@example.com', 'wrong-password');
      })
    ).rejects.toThrow();

    // Check that the error was set
    expect(result.current.error).toBe(errorMessage);
    
    // Check that the user is not authenticated
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
