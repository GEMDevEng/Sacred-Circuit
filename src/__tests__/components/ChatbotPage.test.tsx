import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChatbotPage from '../../components/chatbot/ChatbotPage';
import * as api from '../../utils/api';

// Mock the API
jest.mock('../../utils/api', () => ({
  sendChatMessage: jest.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ChatbotPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
    
    // Mock the API response
    (api.sendChatMessage as jest.Mock).mockResolvedValue({
      message: 'This is a test response from the chatbot.',
      timestamp: new Date().toISOString(),
    });
  });

  test('renders welcome message', () => {
    render(
      <BrowserRouter>
        <ChatbotPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Sacred Healing Companion')).toBeInTheDocument();
    expect(screen.getByText('Welcome to your Sacred Healing space. How are you feeling today?')).toBeInTheDocument();
  });

  test('prompts for healing name if not provided', () => {
    render(
      <BrowserRouter>
        <ChatbotPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Welcome to your sacred space. Please enter a healing name to begin your journey.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your healing name...')).toBeInTheDocument();
  });

  test('allows user to set healing name', async () => {
    render(
      <BrowserRouter>
        <ChatbotPage />
      </BrowserRouter>
    );
    
    const input = screen.getByPlaceholderText('Enter your healing name...');
    fireEvent.change(input, { target: { value: 'TestHealer' } });
    
    const sendButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Thank you, TestHealer. How can I support your healing journey today?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    });
    
    // Check that healing name was saved to localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('healingName', 'TestHealer');
  });

  test('sends message and displays response', async () => {
    // Set healing name in localStorage
    localStorage.setItem('healingName', 'TestHealer');
    
    render(
      <BrowserRouter>
        <ChatbotPage />
      </BrowserRouter>
    );
    
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello, I need guidance' } });
    
    const sendButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendButton);
    
    // Check that user message is displayed
    expect(screen.getByText('Hello, I need guidance')).toBeInTheDocument();
    
    // Check that API was called with correct parameters
    expect(api.sendChatMessage).toHaveBeenCalledWith({
      message: 'Hello, I need guidance',
      healingName: 'TestHealer',
      storeConversation: false,
    });
    
    // Wait for bot response
    await waitFor(() => {
      expect(screen.getByText('This is a test response from the chatbot.')).toBeInTheDocument();
    });
  });

  test('toggles consent checkbox', () => {
    localStorage.setItem('healingName', 'TestHealer');
    
    render(
      <BrowserRouter>
        <ChatbotPage />
      </BrowserRouter>
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    // Check that consent was saved to localStorage
    expect(localStorage.setItem).toHaveBeenCalledWith('chatConsent', 'true');
  });
});
