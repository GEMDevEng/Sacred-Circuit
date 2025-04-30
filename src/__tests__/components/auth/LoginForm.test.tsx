import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginForm from '../../../components/auth/LoginForm';
import { useAuth } from '../../../contexts/AuthContext';

// Mock the useAuth hook
jest.mock('../../../contexts/AuthContext', () => {
  const originalModule = jest.requireActual('../../../contexts/AuthContext');
  return {
    ...originalModule,
    useAuth: jest.fn(),
  };
});

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { from: { pathname: '/dashboard' } } }),
}));

describe('LoginForm Component', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock useAuth return value
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
  });

  test('renders login form', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Check form elements
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Submit form without filling inputs
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Enter invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Check validation error
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid inputs', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Fill form inputs
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Check that login was called with correct values
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  test('shows loading state during submission', async () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Check that the button shows loading state
    expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  test('shows error message when login fails', async () => {
    // Mock error state
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin.mockRejectedValue(new Error('Invalid credentials')),
      isLoading: false,
      error: 'Invalid credentials',
    });

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Fill form inputs
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong-password' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  test('navigates to dashboard after successful login', async () => {
    // Mock successful login
    mockLogin.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Fill form inputs
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Check that toast success was called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login successful');
    });

    // Check that navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  test('navigates to register page when register link is clicked', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Click register link
    fireEvent.click(screen.getByText(/register/i));

    // Check that navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  test('navigates to forgot password page when forgot password link is clicked', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Click forgot password link
    fireEvent.click(screen.getByText(/forgot password/i));

    // Check that navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });
});
