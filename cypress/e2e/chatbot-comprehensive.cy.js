/// <reference types="cypress" />

describe('Chatbot Comprehensive Tests', () => {
  const testUser = {
    healingName: `TestHealer${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!'
  };

  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    
    // Set healing name in localStorage to simulate a returning user
    cy.window().then((win) => {
      win.localStorage.setItem('healingName', testUser.healingName);
    });
  });

  describe('Basic Functionality', () => {
    it('should load the chatbot page with welcome message', () => {
      cy.visit('/chatbot');
      
      // Verify page elements
      cy.contains('Sacred Healing Companion').should('be.visible');
      cy.contains('Welcome to your Sacred Healing space').should('be.visible');
      cy.get('#message').should('be.visible');
      cy.get('button[aria-label="Send message"]').should('be.visible');
    });

    it('should pre-fill healing name for returning users', () => {
      cy.visit('/chatbot');
      
      // Verify healing name is pre-filled
      cy.get('#healingName').should('have.value', testUser.healingName);
    });

    it('should prompt for healing name for new users', () => {
      // Clear localStorage to simulate a new user
      cy.clearLocalStorage();
      
      cy.visit('/chatbot');
      
      // Verify healing name input is visible
      cy.contains('Your Healing Name').should('be.visible');
      cy.get('#healingName').should('be.visible');
      cy.get('button').contains('Begin Journey').should('be.visible');
      
      // Enter healing name
      cy.get('#healingName').type('NewHealer');
      cy.get('button').contains('Begin Journey').click();
      
      // Verify welcome message with name
      cy.contains('Thank you, NewHealer').should('be.visible');
    });
  });

  describe('Message Interaction', () => {
    it('should send a message and receive a response', () => {
      cy.visit('/chatbot');
      
      // Type a message
      cy.get('#message').type('Hello, I need guidance on my healing journey');
      
      // Send the message
      cy.get('button[aria-label="Send message"]').click();
      
      // Verify message appears in chat
      cy.contains('Hello, I need guidance on my healing journey').should('be.visible');
      
      // Wait for response (this may take some time)
      cy.get('.chat-message.ai', { timeout: 15000 }).should('be.visible');
    });

    it('should handle multiple message exchanges', () => {
      cy.visit('/chatbot');
      
      // First message
      cy.get('#message').type('Hello, I need guidance');
      cy.get('button[aria-label="Send message"]').click();
      cy.contains('Hello, I need guidance').should('be.visible');
      cy.get('.chat-message.ai', { timeout: 15000 }).should('be.visible');
      
      // Second message
      cy.get('#message').type('Can you tell me about meditation?');
      cy.get('button[aria-label="Send message"]').click();
      cy.contains('Can you tell me about meditation?').should('be.visible');
      
      // Wait for second response
      cy.get('.chat-message.ai').should('have.length.at.least', 2);
    });

    it('should disable send button when message is empty', () => {
      cy.visit('/chatbot');
      
      // Check that send button is disabled initially
      cy.get('button[aria-label="Send message"]').should('be.disabled');
      
      // Type something
      cy.get('#message').type('Hello');
      
      // Check that send button is enabled
      cy.get('button[aria-label="Send message"]').should('not.be.disabled');
      
      // Clear the input
      cy.get('#message').clear();
      
      // Check that send button is disabled again
      cy.get('button[aria-label="Send message"]').should('be.disabled');
    });
  });

  describe('Consent and Privacy', () => {
    it('should toggle consent for conversation storage', () => {
      cy.visit('/chatbot');
      
      // Check the consent toggle
      cy.get('#storeConversation').check();
      
      // Type and send a message
      cy.get('#message').type('Please remember this conversation');
      cy.get('button[aria-label="Send message"]').click();
      
      // Verify message appears
      cy.contains('Please remember this conversation').should('be.visible');
      
      // Wait for response
      cy.get('.chat-message.ai', { timeout: 15000 }).should('be.visible');
      
      // Verify consent message
      cy.contains('Conversation will be stored').should('be.visible');
    });

    it('should respect privacy when consent is not given', () => {
      cy.visit('/chatbot');
      
      // Ensure consent toggle is unchecked
      cy.get('#storeConversation').should('not.be.checked');
      
      // Type and send a message
      cy.get('#message').type('This should be private');
      cy.get('button[aria-label="Send message"]').click();
      
      // Verify message appears
      cy.contains('This should be private').should('be.visible');
      
      // Wait for response
      cy.get('.chat-message.ai', { timeout: 15000 }).should('be.visible');
      
      // Verify privacy message
      cy.contains('Conversation is private').should('be.visible');
    });
  });

  describe('Authentication Integration', () => {
    it('should allow authenticated users to access secure chat', () => {
      // Register and login
      cy.visit('/register');
      cy.get('#healingName').type(testUser.healingName);
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('#confirmPassword').type(testUser.password);
      cy.get('button[type="submit"]').click();
      
      // Wait for registration to complete
      cy.contains('Registration successful', { timeout: 10000 }).should('be.visible');
      
      // Visit chatbot page
      cy.visit('/chatbot');
      
      // Verify secure chat badge is visible
      cy.contains('Secure Connection').should('be.visible');
      
      // Type and send a message
      cy.get('#message').type('This is a secure message');
      cy.get('button[aria-label="Send message"]').click();
      
      // Verify message appears
      cy.contains('This is a secure message').should('be.visible');
      
      // Wait for response
      cy.get('.chat-message.ai', { timeout: 15000 }).should('be.visible');
    });

    it('should persist chat history for authenticated users', () => {
      // Login
      cy.visit('/login');
      cy.get('#email').type(testUser.email);
      cy.get('#password').type(testUser.password);
      cy.get('button[type="submit"]').click();
      
      // Visit chatbot page
      cy.visit('/chatbot');
      
      // Type a unique message
      const uniqueMessage = `Test message ${Date.now()}`;
      cy.get('#message').type(uniqueMessage);
      cy.get('button[aria-label="Send message"]').click();
      
      // Wait for response
      cy.get('.chat-message.ai', { timeout: 15000 }).should('be.visible');
      
      // Refresh the page
      cy.reload();
      
      // Verify the message is still visible after refresh
      cy.contains(uniqueMessage).should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Intercept API calls to the chat endpoint and force an error
      cy.intercept('POST', '/api/chat', {
        statusCode: 500,
        body: {
          success: false,
          error: 'Internal Server Error'
        }
      }).as('chatApiError');
      
      cy.visit('/chatbot');
      
      // Type and send a message
      cy.get('#message').type('This should trigger an error response');
      cy.get('button[aria-label="Send message"]').click();
      
      // Wait for the intercepted request
      cy.wait('@chatApiError');
      
      // Verify error message is displayed
      cy.contains('Unable to get a response').should('be.visible');
      cy.contains('Please try again later').should('be.visible');
    });

    it('should handle network disconnection', () => {
      cy.visit('/chatbot');
      
      // Simulate offline status
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false);
        win.dispatchEvent(new win.Event('offline'));
      });
      
      // Type and send a message
      cy.get('#message').type('This message is sent while offline');
      cy.get('button[aria-label="Send message"]').click();
      
      // Verify offline message is displayed
      cy.contains('You appear to be offline').should('be.visible');
      
      // Restore online status
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(true);
        win.dispatchEvent(new win.Event('online'));
      });
    });
  });

  describe('Accessibility', () => {
    it('should support keyboard navigation', () => {
      cy.visit('/chatbot');
      
      // Focus on message input
      cy.get('#message').focus();
      
      // Type a message
      cy.get('#message').type('Testing keyboard navigation{enter}');
      
      // Verify message appears in chat
      cy.contains('Testing keyboard navigation').should('be.visible');
      
      // Wait for response
      cy.get('.chat-message.ai', { timeout: 15000 }).should('be.visible');
    });

    it('should have proper ARIA attributes', () => {
      cy.visit('/chatbot');
      
      // Check for proper ARIA attributes
      cy.get('#message').should('have.attr', 'aria-label');
      cy.get('button[aria-label="Send message"]').should('have.attr', 'aria-label');
      cy.get('.chat-container').should('have.attr', 'aria-live', 'polite');
    });
  });
});
