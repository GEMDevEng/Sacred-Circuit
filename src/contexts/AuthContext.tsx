import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser, fetchCsrfToken } from '../utils/api';

// Define the User type
export interface User {
  id: string;
  healingName: string;
  email: string;
  role: 'user' | 'admin';
}

// Define the AuthContextType
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (healingName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount and fetch CSRF token
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Fetch CSRF token regardless of authentication status
        await fetchCsrfToken();

        const token = localStorage.getItem('token');

        if (token) {
          try {
            // Get user data from API
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (err) {
            // If API call fails, clear token
            localStorage.removeItem('token');
            console.error('Failed to get user data:', err);
          }
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call login API
      const response = await apiLogin({ email, password });

      // Set user data
      setUser(response.user);

      // Fetch a new CSRF token after successful login
      await fetchCsrfToken();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message ?? 'Invalid email or password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (healingName: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call register API
      const response = await apiRegister({ healingName, email, password });

      // Set user data
      setUser(response.user);

      // Fetch a new CSRF token after successful registration
      await fetchCsrfToken();
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message ?? 'Failed to register account');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API
      await apiLogout();

      // Clear user state
      setUser(null);

      // Clear CSRF token
      localStorage.removeItem('csrfToken');

      // Fetch a new CSRF token for anonymous users
      await fetchCsrfToken();
    } catch (err) {
      console.error('Logout error:', err);
      // Clear user state even if API call fails
      setUser(null);

      // Clear CSRF token
      localStorage.removeItem('csrfToken');

      // Fetch a new CSRF token for anonymous users
      try {
        await fetchCsrfToken();
      } catch (csrfErr) {
        console.error('Failed to fetch CSRF token after logout:', csrfErr);
      }
    }
  };

  // Provide the auth context value
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
  }), [user, isLoading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
