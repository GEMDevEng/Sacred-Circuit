/// <reference types="cypress" />

describe('Reflection Submission', () => {
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

  it('should load the reflection page', () => {
    cy.visit('/reflection');
    
    // Verify page elements
    cy.contains('Reflection Milestone').should('be.visible');
    cy.get('#healingName').should('be.visible');
    cy.get('#milestone').should('be.visible');
    cy.get('#reflection').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should pre-fill healing name for returning users', () => {
    cy.visit('/reflection');
    
    // Verify healing name is pre-filled
    cy.get('#healingName').should('have.value', testUser.healingName);
  });

  it('should submit a reflection successfully', () => {
    cy.visit('/reflection');
    
    // Fill out the form
    cy.get('#healingName').clear().type(testUser.healingName);
    cy.get('#milestone').select('Day 7');
    cy.get('#reflection').type('This is a test reflection about my healing journey. I have been feeling more connected to nature and my inner self. The meditation practices have been particularly helpful in centering my thoughts and emotions.');
    cy.get('#emailConsent').check();
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.contains('Thank you for sharing!').should('be.visible');
    cy.contains('Your reflection has been recorded as a sacred milestone in your journey').should('be.visible');
    
    // Verify buttons on success screen
    cy.contains('Submit Another').should('be.visible');
    cy.contains('Return to Chatbot').should('be.visible');
  });

  it('should show validation errors when form is incomplete', () => {
    cy.visit('/reflection');
    
    // Clear healing name and submit
    cy.get('#healingName').clear();
    cy.get('button[type="submit"]').click();
    
    // Verify error message
    cy.contains('Please enter your healing name').should('be.visible');
    
    // Fill healing name but leave reflection empty
    cy.get('#healingName').type(testUser.healingName);
    cy.get('button[type="submit"]').click();
    
    // Verify error message
    cy.contains('Please share your reflection').should('be.visible');
  });

  it('should enforce character limit on reflection', () => {
    cy.visit('/reflection');
    
    // Generate a very long text (over 5000 characters)
    const longText = 'A'.repeat(5100);
    
    // Try to type the long text
    cy.get('#healingName').clear().type(testUser.healingName);
    cy.get('#reflection').type(longText, { delay: 0 });
    
    // Verify character count
    cy.contains('5000/5000 characters').should('be.visible');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify error message
    cy.contains('Reflection is too long').should('be.visible');
  });

  it('should allow submitting another reflection after success', () => {
    // Submit first reflection
    cy.visit('/reflection');
    cy.get('#healingName').clear().type(testUser.healingName);
    cy.get('#milestone').select('Day 7');
    cy.get('#reflection').type('First reflection test.');
    cy.get('button[type="submit"]').click();
    
    // Verify success and click "Submit Another"
    cy.contains('Thank you for sharing!').should('be.visible');
    cy.contains('Submit Another').click();
    
    // Verify form is reset and ready for another submission
    cy.get('#healingName').should('have.value', testUser.healingName);
    cy.get('#reflection').should('have.value', '');
    
    // Submit second reflection
    cy.get('#milestone').select('Day 14');
    cy.get('#reflection').type('Second reflection test.');
    cy.get('button[type="submit"]').click();
    
    // Verify success again
    cy.contains('Thank you for sharing!').should('be.visible');
  });

  it('should navigate back to chatbot when requested', () => {
    // Submit reflection
    cy.visit('/reflection');
    cy.get('#healingName').clear().type(testUser.healingName);
    cy.get('#milestone').select('Day 7');
    cy.get('#reflection').type('Test reflection before returning to chatbot.');
    cy.get('button[type="submit"]').click();
    
    // Verify success and click "Return to Chatbot"
    cy.contains('Thank you for sharing!').should('be.visible');
    cy.contains('Return to Chatbot').click();
    
    // Verify navigation to chatbot page
    cy.url().should('include', '/chatbot');
    cy.contains('Sacred Healing Companion').should('be.visible');
  });
});
