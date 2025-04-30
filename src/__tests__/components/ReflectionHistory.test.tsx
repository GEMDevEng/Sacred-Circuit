import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReflectionHistory from '../../components/reflection/ReflectionHistory';
import * as api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

// Mock dependencies
jest.mock('../../utils/api', () => ({
  getReflections: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('ReflectionHistory', () => {
  const mockReflections = [
    {
      id: 'rec123',
      healingName: 'TestHealer',
      content: 'This is my first reflection.',
      journeyDay: 'Day 7',
      createdAt: '2023-06-01T12:00:00Z',
    },
    {
      id: 'rec456',
      healingName: 'TestHealer',
      content: 'This is my second reflection.',
      journeyDay: 'Day 14',
      createdAt: '2023-06-08T12:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useAuth
    (useAuth as jest.Mock).mockReturnValue({
      user: { healingName: 'TestHealer' },
      isAuthenticated: true,
    });
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'TestHealer'),
        setItem: jest.fn(),
      },
      writable: true,
    });
    
    // Mock successful API response
    (api.getReflections as jest.Mock).mockResolvedValue({
      reflections: mockReflections,
    });
  });

  test('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <ReflectionHistory />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Your Reflection Journey')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders reflections after loading', async () => {
    render(
      <BrowserRouter>
        <ReflectionHistory />
      </BrowserRouter>
    );
    
    // Wait for reflections to load
    await waitFor(() => {
      expect(screen.getByText('Your Reflections')).toBeInTheDocument();
    });
    
    // Check that reflections are displayed
    expect(screen.getByText('Day 7 Reflection')).toBeInTheDocument();
    expect(screen.getByText('Day 14 Reflection')).toBeInTheDocument();
    
    // Check that API was called with correct parameters
    expect(api.getReflections).toHaveBeenCalledWith('TestHealer', true);
  });

  test('shows empty state when no reflections', async () => {
    // Mock empty reflections
    (api.getReflections as jest.Mock).mockResolvedValue({
      reflections: [],
    });
    
    render(
      <BrowserRouter>
        <ReflectionHistory />
      </BrowserRouter>
    );
    
    // Wait for reflections to load
    await waitFor(() => {
      expect(screen.getByText('No Reflections Yet')).toBeInTheDocument();
    });
    
    // Check that create button is displayed
    expect(screen.getByText('Create Your First Reflection')).toBeInTheDocument();
  });

  test('shows reflection details when clicked', async () => {
    render(
      <BrowserRouter>
        <ReflectionHistory />
      </BrowserRouter>
    );
    
    // Wait for reflections to load
    await waitFor(() => {
      expect(screen.getByText('Your Reflections')).toBeInTheDocument();
    });
    
    // Click on a reflection
    fireEvent.click(screen.getByText('Day 7 Reflection'));
    
    // Check that reflection details are displayed
    expect(screen.getByText('This is my first reflection.')).toBeInTheDocument();
    expect(screen.getByText('Back to List')).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    // Mock API error
    (api.getReflections as jest.Mock).mockRejectedValue(new Error('API error'));
    
    render(
      <BrowserRouter>
        <ReflectionHistory />
      </BrowserRouter>
    );
    
    // Wait for error to be handled
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load reflections. Please try again.');
    });
  });

  test('uses healing name from localStorage when user is not authenticated', async () => {
    // Mock unauthenticated user
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });
    
    render(
      <BrowserRouter>
        <ReflectionHistory />
      </BrowserRouter>
    );
    
    // Wait for reflections to load
    await waitFor(() => {
      expect(screen.getByText('Your Reflections')).toBeInTheDocument();
    });
    
    // Check that API was called with correct parameters
    expect(api.getReflections).toHaveBeenCalledWith('TestHealer', false);
  });

  test('shows error when no healing name is available', async () => {
    // Mock unauthenticated user and no localStorage value
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });
    
    // Mock empty localStorage
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    
    render(
      <BrowserRouter>
        <ReflectionHistory />
      </BrowserRouter>
    );
    
    // Wait for error to be handled
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter your healing name first');
    });
  });
});
