import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

// Mock the useAuth hook
jest.mock('../../../contexts/AuthContext', () => {
  const originalModule = jest.requireActual('../../../contexts/AuthContext');
  return {
    ...originalModule,
    useAuth: jest.fn(),
  };
});

describe('ProtectedRoute Component', () => {
  // Test components
  const TestComponent = () => <div>Protected Content</div>;
  const LoginComponent = () => <div>Login Page</div>;
  const UnauthorizedComponent = () => <div>Unauthorized Page</div>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  test('renders children when authenticated', () => {
    // Mock authenticated state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', healingName: 'TestUser', email: 'test@example.com', role: 'user' },
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Should render the protected content
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login when not authenticated', () => {
    // Mock unauthenticated state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to login page
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('shows loading state while checking authentication', () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Should show loading indicator
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  test('redirects to unauthorized page when user does not have required role', () => {
    // Mock authenticated state with user role
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', healingName: 'TestUser', email: 'test@example.com', role: 'user' },
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/unauthorized" element={<UnauthorizedComponent />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Should redirect to unauthorized page
    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('allows access when user has required role', () => {
    // Mock authenticated state with admin role
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', healingName: 'AdminUser', email: 'admin@example.com', role: 'admin' },
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/unauthorized" element={<UnauthorizedComponent />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Should render the protected content
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Unauthorized Page')).not.toBeInTheDocument();
  });
});
