import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthProvider } from '../../contexts/AuthContext';
import LoginPage from '../../components/auth/LoginPage';
import RegisterPage from '../../components/auth/RegisterPage';
import ForgotPasswordPage from '../../components/auth/ForgotPasswordPage';
import ProfilePage from '../../components/profile/ProfilePage';
import * as api from '../../utils/api';

// Mock the API
jest.mock('../../utils/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  requestPasswordReset: jest.fn(),
  getCurrentUser: jest.fn()
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage and reset mocks
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Registration Flow', () => {
    test('successful registration redirects to login page', async () => {
      // Mock successful registration
      (api.register as jest.Mock).mockResolvedValue({
        user: {
          id: 'user-123',
          healingName: 'TestHealer',
          email: 'test@example.com',
          role: 'user'
        },
        accessToken: 'mock-token'
      });

      // Render the registration page
      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthProvider>
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<div>Home Page</div>} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // Fill out the registration form
      fireEvent.change(screen.getByLabelText(/healing name/i), {
        target: { value: 'TestHealer' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password123!' }
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123!' }
      });
      fireEvent.click(screen.getByLabelText(/agree to terms/i));

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      // Wait for the registration to complete
      await waitFor(() => {
        expect(api.register).toHaveBeenCalledWith({
          healingName: 'TestHealer',
          email: 'test@example.com',
          password: 'Password123!'
        });
      });

      // Verify success toast was shown
      expect(toast.success).toHaveBeenCalledWith('Registration successful');

      // Verify redirect to home page
      await waitFor(() => {
        expect(screen.getByText('Home Page')).toBeInTheDocument();
      });

      // Verify token was stored in localStorage
      expect(window.localStorage.getItem('token')).toBe('mock-token');
      expect(window.localStorage.getItem('healingName')).toBe('TestHealer');
    });

    test('registration with invalid data shows validation errors', async () => {
      // Render the registration page
      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthProvider>
            <RegisterPage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Submit the form without filling it out
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      // Verify validation errors
      await waitFor(() => {
        expect(screen.getByText(/healing name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });

      // Fill with invalid data
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'invalid-email' }
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'short' }
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'different' }
      });

      // Submit again
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      // Verify validation errors
      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });

      // Verify API was not called
      expect(api.register).not.toHaveBeenCalled();
    });

    test('registration with existing email shows error', async () => {
      // Mock failed registration
      (api.register as jest.Mock).mockRejectedValue(new Error('Email already exists'));

      // Render the registration page
      render(
        <MemoryRouter initialEntries={['/register']}>
          <AuthProvider>
            <RegisterPage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Fill out the registration form
      fireEvent.change(screen.getByLabelText(/healing name/i), {
        target: { value: 'TestHealer' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'existing@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password123!' }
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123!' }
      });
      fireEvent.click(screen.getByLabelText(/agree to terms/i));

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      // Wait for the registration to fail
      await waitFor(() => {
        expect(api.register).toHaveBeenCalled();
      });

      // Verify error toast was shown
      expect(toast.error).toHaveBeenCalledWith('Email already exists');
    });
  });

  describe('Login Flow', () => {
    test('successful login redirects to home page', async () => {
      // Mock successful login
      (api.login as jest.Mock).mockResolvedValue({
        user: {
          id: 'user-123',
          healingName: 'TestHealer',
          email: 'test@example.com',
          role: 'user'
        },
        accessToken: 'mock-token'
      });

      // Render the login page
      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<div>Home Page</div>} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // Fill out the login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'Password123!' }
      });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));

      // Wait for the login to complete
      await waitFor(() => {
        expect(api.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password123!'
        });
      });

      // Verify success toast was shown
      expect(toast.success).toHaveBeenCalledWith('Login successful');

      // Verify redirect to home page
      await waitFor(() => {
        expect(screen.getByText('Home Page')).toBeInTheDocument();
      });

      // Verify token was stored in localStorage
      expect(window.localStorage.getItem('token')).toBe('mock-token');
      expect(window.localStorage.getItem('healingName')).toBe('TestHealer');
    });

    test('login with invalid credentials shows error', async () => {
      // Mock failed login
      (api.login as jest.Mock).mockRejectedValue(new Error('Invalid email or password'));

      // Render the login page
      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Fill out the login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'WrongPassword' }
      });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));

      // Wait for the login to fail
      await waitFor(() => {
        expect(api.login).toHaveBeenCalled();
      });

      // Verify error message is shown
      expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument();
    });
  });

  describe('Password Reset Flow', () => {
    test('successful password reset request shows success message', async () => {
      // Mock successful password reset request
      (api.requestPasswordReset as jest.Mock).mockResolvedValue({ success: true });

      // Render the forgot password page
      render(
        <MemoryRouter initialEntries={['/forgot-password']}>
          <AuthProvider>
            <ForgotPasswordPage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

      // Wait for the request to complete
      await waitFor(() => {
        expect(api.requestPasswordReset).toHaveBeenCalledWith('test@example.com');
      });

      // Verify success message is shown
      expect(screen.getByText(/password reset instructions sent/i)).toBeInTheDocument();
    });
  });

  describe('Protected Routes', () => {
    test('authenticated user can access protected routes', async () => {
      // Mock authenticated user
      (api.getCurrentUser as jest.Mock).mockResolvedValue({
        id: 'user-123',
        healingName: 'TestHealer',
        email: 'test@example.com',
        role: 'user'
      });

      // Set token in localStorage
      window.localStorage.setItem('token', 'mock-token');

      // Render the profile page (protected route)
      render(
        <MemoryRouter initialEntries={['/profile']}>
          <AuthProvider>
            <Routes>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // Wait for authentication check
      await waitFor(() => {
        expect(api.getCurrentUser).toHaveBeenCalled();
      });

      // Verify profile page is rendered
      expect(screen.getByText(/TestHealer/i)).toBeInTheDocument();
    });

    test('unauthenticated user is redirected to login', async () => {
      // Mock unauthenticated user
      (api.getCurrentUser as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

      // Render the profile page (protected route)
      render(
        <MemoryRouter initialEntries={['/profile']}>
          <AuthProvider>
            <Routes>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      // Wait for authentication check
      await waitFor(() => {
        expect(api.getCurrentUser).toHaveBeenCalled();
      });

      // Verify redirect to login page
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
  });
});
