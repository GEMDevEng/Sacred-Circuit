/// <reference types="cypress" />

describe('Chatbot Interaction', () => {
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

  it('should load the chatbot page', () => {
    cy.visit('/chatbot');
    
    // Verify page elements
    cy.contains('Sacred Healing Companion').should('be.visible');
    cy.get('#message').should('be.visible');
    cy.get('button[aria-label="Send message"]').should('be.visible');
  });

  it('should pre-fill healing name for returning users', () => {
    cy.visit('/chatbot');
    
    // Verify healing name is pre-filled
    cy.get('#healingName').should('have.value', testUser.healingName);
  });

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

  it('should show typing indicator while waiting for response', () => {
    cy.visit('/chatbot');
    
    // Type a message
    cy.get('#message').type('Can you help me with meditation?');
    
    // Send the message
    cy.get('button[aria-label="Send message"]').click();
    
    // Verify typing indicator appears
    cy.get('.typing-indicator', { timeout: 5000 }).should('be.visible');
    
    // Wait for response
    cy.get('.chat-message.ai', { timeout: 15000 }).should('be.visible');
    
    // Verify typing indicator disappears
    cy.get('.typing-indicator').should('not.exist');
  });

  it('should allow authenticated users to access secure chat', () => {
    // Register and login
    cy.register(testUser.healingName, testUser.email, testUser.password);
    
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
});
