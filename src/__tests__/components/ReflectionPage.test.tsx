import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ReflectionPage from '../../components/landing/ReflectionPage';
import * as api from '../../utils/api';

// Mock the API
jest.mock('../../utils/api', () => ({
  submitReflection: jest.fn(),
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
      <BrowserRouter>
        <ReflectionPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Reflection Milestone')).toBeInTheDocument();
    expect(screen.getByLabelText('Healing Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Milestone')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Reflection')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit reflection/i })).toBeInTheDocument();
  });

  test('loads healing name from localStorage', () => {
    // Mock localStorage.getItem to return 'TestHealer'
    jest.spyOn(window.localStorage, 'getItem').mockReturnValue('TestHealer');

    render(
      <BrowserRouter>
        <ReflectionPage />
      </BrowserRouter>
    );

    const healingNameInput = screen.getByLabelText('Healing Name') as HTMLInputElement;
    expect(healingNameInput.value).toBe('TestHealer');
  });

  test('validates form inputs', async () => {
    // Mock toast.error to capture validation messages
    const mockToastError = jest.fn();
    jest.spyOn(require('react-toastify').toast, 'error').mockImplementation(mockToastError);

    render(
      <BrowserRouter>
        <ReflectionPage />
      </BrowserRouter>
    );

    // Try to submit without healing name
    const submitButton = screen.getByRole('button', { name: /submit reflection/i });
    fireEvent.click(submitButton);

    // Check that toast.error was called with the validation message
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Please enter your healing name');
    });

    // Add healing name but no reflection
    const healingNameInput = screen.getByLabelText('Healing Name');
    fireEvent.change(healingNameInput, { target: { value: 'TestHealer' } });
    fireEvent.click(submitButton);

    // Check that toast.error was called with the validation message
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Please share your reflection');
    });
  });

  test('submits reflection successfully', async () => {
    render(
      <BrowserRouter>
        <ReflectionPage />
      </BrowserRouter>
    );

    // Fill out the form
    const healingNameInput = screen.getByLabelText('Healing Name');
    fireEvent.change(healingNameInput, { target: { value: 'TestHealer' } });

    const milestoneSelect = screen.getByLabelText('Milestone');
    fireEvent.change(milestoneSelect, { target: { value: 'Day 14' } });

    const reflectionInput = screen.getByLabelText('Your Reflection');
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
    });

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Thank you for sharing!')).toBeInTheDocument();
    });

    // Check that healing name was saved to localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('healingName', 'TestHealer');
  });

  test('toggles email consent checkbox', () => {
    render(
      <BrowserRouter>
        <ReflectionPage />
      </BrowserRouter>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked(); // Default is true

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
