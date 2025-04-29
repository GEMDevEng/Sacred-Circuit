/// <reference types="cypress" />

describe('Chatbot Edge Cases', () => {
  const testUser = {
    healingName: 'TestHealer',
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!'
  };

  beforeEach(() => {
    // Set healing name in localStorage to simulate a returning user
    cy.window().then((win) => {
      win.localStorage.setItem('healingName', testUser.healingName);
    });
  });

  it('should handle very long messages', () => {
    cy.visit('/chatbot');
    
    // Generate a very long message (1000+ characters)
    const longMessage = 'This is a very long message that tests the chatbot\'s ability to handle lengthy inputs. '.repeat(20);
    
    // Type the long message
    cy.get('#message').type(longMessage, { delay: 0 });
    
    // Send the message
    cy.get('button[aria-label="Send message"]').click();
    
    // Verify message appears in chat (it might be truncated in the UI)
    cy.contains(longMessage.substring(0, 50)).should('be.visible');
    
    // Wait for response
    cy.get('.chat-message.ai', { timeout: 20000 }).should('be.visible');
  });

  it('should handle special characters and emojis', () => {
    cy.visit('/chatbot');
    
    // Message with special characters and emojis
    const specialMessage = '!@#$%^&*()_+ 😊 💖 🙏 ✨ こんにちは 你好';
    
    // Type the special message
    cy.get('#message').type(specialMessage);
    
    // Send the message
    cy.get('button[aria-label="Send message"]').click();
    
    // Verify message appears in chat
    cy.contains(specialMessage).should('be.visible');
    
    // Wait for response
    cy.get('.chat-message.ai', { timeout: 15000 }).should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    // Intercept API calls to the chat endpoint and force an error
    cy.intercept('POST', '/api/chat', {
      statusCode: 500,
      body: {
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

  it('should persist chat history across page refreshes', () => {
    cy.visit('/chatbot');
    
    // Type and send a unique message
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

  it('should show loading state while waiting for response', () => {
    // Intercept API calls to the chat endpoint and delay the response
    cy.intercept('POST', '/api/chat', (req) => {
      // Delay the response by 2 seconds
      req.reply((res) => {
        res.delay = 2000;
        return res;
      });
    }).as('delayedChatApi');
    
    cy.visit('/chatbot');
    
    // Type and send a message
    cy.get('#message').type('This should show a loading state');
    cy.get('button[aria-label="Send message"]').click();
    
    // Verify loading indicator is shown
    cy.get('.typing-indicator').should('be.visible');
    
    // Wait for the response
    cy.wait('@delayedChatApi');
    
    // Verify loading indicator is hidden after response
    cy.get('.typing-indicator').should('not.exist');
  });
});
