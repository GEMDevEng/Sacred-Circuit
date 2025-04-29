/// <reference types="cypress" />

describe('Reflection Form Edge Cases', () => {
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

  it('should handle special characters and emojis in reflection', () => {
    cy.visit('/reflection');
    
    // Fill out the form with special characters and emojis
    cy.get('#healingName').clear().type(testUser.healingName);
    cy.get('#milestone').select('Day 7');
    cy.get('#reflection').type('Special characters: !@#$%^&*()_+ and emojis: 😊 💖 🙏 ✨ and international text: こんにちは 你好');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.contains('Thank you for sharing!').should('be.visible');
  });

  it('should handle pasting large text into reflection', () => {
    cy.visit('/reflection');
    
    // Generate a large text (3000 characters, below the limit)
    const largeText = 'This is a test of pasting a large amount of text into the reflection form. '.repeat(60);
    
    // Fill out the form
    cy.get('#healingName').clear().type(testUser.healingName);
    cy.get('#milestone').select('Day 14');
    
    // Paste the large text
    cy.get('#reflection').invoke('val', largeText);
    cy.get('#reflection').trigger('input');
    
    // Verify character count
    cy.contains(/\d{4}\/5000 characters/).should('be.visible');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.contains('Thank you for sharing!').should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    // Intercept API calls to the reflection endpoint and force an error
    cy.intercept('POST', '/api/reflection', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error'
      }
    }).as('reflectionApiError');
    
    cy.visit('/reflection');
    
    // Fill out the form
    cy.get('#healingName').clear().type(testUser.healingName);
    cy.get('#milestone').select('Day 21');
    cy.get('#reflection').type('This submission should trigger an error response');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Wait for the intercepted request
    cy.wait('@reflectionApiError');
    
    // Verify error message is displayed
    cy.contains('Unable to submit your reflection').should('be.visible');
    cy.contains('Please try again later').should('be.visible');
  });

  it('should handle offline submission attempts', () => {
    // Simulate offline status
    cy.intercept('POST', '/api/reflection', {
      forceNetworkError: true
    }).as('networkError');
    
    cy.visit('/reflection');
    
    // Fill out the form
    cy.get('#healingName').clear().type(testUser.healingName);
    cy.get('#milestone').select('Day 30');
    cy.get('#reflection').type('This is an offline submission test');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Wait for the intercepted request
    cy.wait('@networkError');
    
    // Verify error message about network connectivity
    cy.contains('Network error').should('be.visible');
    cy.contains('Please check your internet connection').should('be.visible');
  });

  it('should validate milestone selection', () => {
    cy.visit('/reflection');
    
    // Fill out the form but don't select a milestone
    cy.get('#healingName').clear().type(testUser.healingName);
    cy.get('#reflection').type('This is a test without selecting a milestone');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify validation error for milestone
    cy.contains('Please select a milestone').should('be.visible');
    
    // Now select a milestone
    cy.get('#milestone').select('Day 7');
    
    // Submit again
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.contains('Thank you for sharing!').should('be.visible');
  });

  it('should show appropriate loading state during submission', () => {
    // Intercept API calls to the reflection endpoint and delay the response
    cy.intercept('POST', '/api/reflection', (req) => {
      // Delay the response by 2 seconds
      req.reply((res) => {
        res.delay = 2000;
        return res;
      });
    }).as('delayedReflectionApi');
    
    cy.visit('/reflection');
    
    // Fill out the form
    cy.get('#healingName').clear().type(testUser.healingName);
    cy.get('#milestone').select('Day 7');
    cy.get('#reflection').type('This should show a loading state during submission');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify loading state is shown
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('button[type="submit"]').contains('Submitting...').should('be.visible');
    
    // Wait for the response
    cy.wait('@delayedReflectionApi');
    
    // Verify success message
    cy.contains('Thank you for sharing!').should('be.visible');
  });
});
