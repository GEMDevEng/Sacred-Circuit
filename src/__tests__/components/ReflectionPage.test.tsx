import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReflectionPage from '../../components/landing/ReflectionPage';
import { AuthProvider } from '../../contexts/AuthContext';
import * as api from '../../utils/api';

// Mock the API
jest.mock('../../utils/api', () => ({
  submitReflection: jest.fn(),
  getCurrentUser: jest.fn(),
  fetchCsrfToken: jest.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ReflectionPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();

    // Mock the API response
    (api.submitReflection as jest.Mock).mockResolvedValue(undefined);
  });

  test('renders reflection form', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <ReflectionPage />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Reflection Milestone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your healing name')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /milestone/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Share your thoughts, feelings, and insights from your healing journey so far...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit reflection/i })).toBeInTheDocument();
  });

  test('loads healing name from localStorage', () => {
    // Mock localStorage.getItem to return 'TestHealer'
    jest.spyOn(window.localStorage, 'getItem').mockReturnValue('TestHealer');

    render(
      <AuthProvider>
        <BrowserRouter>
          <ReflectionPage />
        </BrowserRouter>
      </AuthProvider>
    );

    const healingNameInput = screen.getByDisplayValue('TestHealer') as HTMLInputElement;
    expect(healingNameInput.value).toBe('TestHealer');
  });

  test('validates form inputs', async () => {
    // Clear localStorage to ensure clean state
    localStorage.clear();

    // Mock toast.error to capture validation messages
    const mockToastError = jest.fn();
    jest.spyOn(require('react-toastify').toast, 'error').mockImplementation(mockToastError);

    render(
      <AuthProvider>
        <BrowserRouter>
          <ReflectionPage />
        </BrowserRouter>
      </AuthProvider>
    );

    // Get form elements
    const healingNameInput = screen.getByPlaceholderText('Enter your healing name');
    const reflectionTextarea = screen.getByPlaceholderText('Share your thoughts, feelings, and insights from your healing journey so far...');
    const submitButton = screen.getByRole('button', { name: /submit reflection/i });

    // Ensure healing name input is empty
    fireEvent.change(healingNameInput, { target: { value: '' } });

    // Try to submit without healing name
    fireEvent.click(submitButton);

    // Check that toast.error was called with the validation message
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Please enter your healing name');
    }, { timeout: 3000 });

    // Clear the mock calls for the next test
    mockToastError.mockClear();

    // Add healing name but no reflection
    fireEvent.change(healingNameInput, { target: { value: 'TestHealer' } });

    // Ensure reflection textarea is empty
    fireEvent.change(reflectionTextarea, { target: { value: '' } });

    fireEvent.click(submitButton);

    // Check that toast.error was called with the validation message
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Please share your reflection');
    }, { timeout: 3000 });
  });

  test('submits reflection successfully', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <ReflectionPage />
        </BrowserRouter>
      </AuthProvider>
    );

    // Fill out the form
    const healingNameInput = screen.getByPlaceholderText('Enter your healing name');
    fireEvent.change(healingNameInput, { target: { value: 'TestHealer' } });

    const milestoneSelect = screen.getByRole('combobox', { name: /milestone/i });
    fireEvent.change(milestoneSelect, { target: { value: 'Day 14' } });

    const reflectionInput = screen.getByPlaceholderText('Share your thoughts, feelings, and insights from your healing journey so far...');
    fireEvent.change(reflectionInput, { target: { value: 'This is my test reflection about my healing journey.' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /submit reflection/i });
    fireEvent.click(submitButton);

    // Check that API was called with correct parameters
    expect(api.submitReflection).toHaveBeenCalledWith({
      healingName: 'TestHealer',
      reflectionText: 'This is my test reflection about my healing journey.',
      journeyDay: 'Day 14',
      emailConsent: true,
    }, false);

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Thank you for sharing!')).toBeInTheDocument();
    });

    // Check that healing name was saved to localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('healingName', 'TestHealer');
  });

  test('toggles email consent checkbox', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <ReflectionPage />
        </BrowserRouter>
      </AuthProvider>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked(); // Default is true

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
