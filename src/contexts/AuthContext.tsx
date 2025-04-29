import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '../utils/api';

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

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
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
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
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
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register account');
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
    } catch (err) {
      console.error('Logout error:', err);
      // Clear user state even if API call fails
      setUser(null);
    }
  };

  // Provide the auth context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
  };

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
