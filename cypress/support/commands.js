// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

/**
 * Custom command to simulate pressing the Tab key for keyboard navigation testing
 * @param {Object} options - Options for the tab command
 * @param {boolean} options.shift - Whether to simulate Shift+Tab (backwards tabbing)
 */
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject, options = {}) => {
  const shift = options.shift || false;

  // If a subject is provided, focus it first
  if (subject) {
    cy.wrap(subject).focus();
  }

  // Create the tab event
  const tabEvent = {
    key: 'Tab',
    code: 'Tab',
    keyCode: 9,
    which: 9,
    shiftKey: shift,
    bubbles: true
  };

  // Dispatch the event
  cy.focused().trigger('keydown', tabEvent);

  // Return the newly focused element
  return cy.focused();
});

/**
 * Custom command to login via the UI
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

/**
 * Custom command to register via the UI
 */
Cypress.Commands.add('register', (healingName, email, password) => {
  cy.visit('/register');
  cy.get('#healingName').type(healingName);
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('#confirmPassword').type(password);
  cy.get('#agreeTerms').check();
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/register');
});

/**
 * Custom command to submit a reflection
 */
Cypress.Commands.add('submitReflection', (healingName, milestone, reflectionText) => {
  cy.visit('/reflection');
  cy.get('#healingName').type(healingName);
  cy.get('#milestone').select(milestone);
  cy.get('#reflection').type(reflectionText);
  cy.get('button[type="submit"]').click();
  cy.contains('Thank you for sharing!').should('be.visible');
});

/**
 * Custom command to interact with the chatbot
 */
Cypress.Commands.add('chatbotInteraction', (healingName, message) => {
  cy.visit('/chatbot');
  cy.get('#healingName').type(healingName);
  cy.get('#message').type(message);
  cy.get('button[aria-label="Send message"]').click();
  cy.contains(message).should('be.visible');
  // Wait for response
  cy.get('.chat-message.ai').should('be.visible');
});
