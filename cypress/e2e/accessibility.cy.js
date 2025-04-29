/// <reference types="cypress" />

describe('Accessibility Features', () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit('/');
  });

  it('should have a skip to content link that becomes visible on focus', () => {
    // The skip link should exist but be visually hidden
    cy.get('a[href="#main-content"]').should('exist');
    
    // Focus the skip link using tab
    cy.get('body').tab();
    
    // The skip link should now be visible
    cy.get('a[href="#main-content"]').should('be.visible');
    
    // Click the skip link
    cy.get('a[href="#main-content"]').click();
    
    // Focus should be on the main content
    cy.focused().should('have.attr', 'id', 'main-content');
  });

  it('should be able to navigate the feedback modal using keyboard', () => {
    // Open the feedback modal
    cy.get('button[aria-label="Provide feedback"]').click();
    
    // The modal should be visible
    cy.contains('Share Your Feedback').should('be.visible');
    
    // Focus should be trapped in the modal
    // First focusable element should be the close button
    cy.focused().should('have.attr', 'aria-label', 'Close modal');
    
    // Tab to the feedback type dropdown
    cy.focused().tab();
    cy.focused().should('have.attr', 'id', 'type');
    
    // Tab to the title input
    cy.focused().tab();
    cy.focused().should('have.attr', 'id', 'title');
    
    // Tab to the description textarea
    cy.focused().tab();
    cy.focused().should('have.attr', 'id', 'description');
    
    // Tab to the email input
    cy.focused().tab();
    cy.focused().should('have.attr', 'id', 'email');
    
    // Tab to the cancel button
    cy.focused().tab();
    cy.focused().should('contain', 'Cancel');
    
    // Tab to the submit button
    cy.focused().tab();
    cy.focused().should('contain', 'Submit Feedback');
    
    // Tab again should loop back to the close button (focus trap)
    cy.focused().tab();
    cy.focused().should('have.attr', 'aria-label', 'Close modal');
    
    // Press Escape to close the modal
    cy.focused().type('{esc}');
    
    // The modal should be closed
    cy.contains('Share Your Feedback').should('not.exist');
  });

  it('should have proper ARIA attributes on form elements', () => {
    // Open the feedback modal
    cy.get('button[aria-label="Provide feedback"]').click();
    
    // Check ARIA attributes on the modal
    cy.get('[role="dialog"]').should('have.attr', 'aria-modal', 'true');
    cy.get('[role="dialog"]').should('have.attr', 'aria-labelledby');
    
    // Get the labelledby ID and verify it matches the title
    cy.get('[role="dialog"]')
      .invoke('attr', 'aria-labelledby')
      .then((labelId) => {
        cy.get(`#${labelId}`).should('contain', 'Share Your Feedback');
      });
    
    // Check form fields for proper ARIA attributes
    cy.get('#type').should('have.attr', 'aria-required', 'true');
    cy.get('#title').should('have.attr', 'aria-required', 'true');
    cy.get('#description').should('have.attr', 'aria-required', 'true');
    
    // Submit empty form to trigger validation errors
    cy.contains('button', 'Submit Feedback').click();
    
    // Check that error messages are properly associated with form fields
    cy.get('#type').should('have.attr', 'aria-invalid', 'true');
    cy.get('#title').should('have.attr', 'aria-invalid', 'true');
    cy.get('#description').should('have.attr', 'aria-invalid', 'true');
    
    // Error messages should have role="alert"
    cy.get('[role="alert"]').should('have.length.at.least', 3);
  });

  it('should announce toast messages to screen readers', () => {
    // Intercept API calls to the feedback endpoint
    cy.intercept('POST', '/api/feedback', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Feedback submitted successfully'
      }
    }).as('submitFeedback');
    
    // Open the feedback modal
    cy.get('button[aria-label="Provide feedback"]').click();
    
    // Fill out the form
    cy.get('#type').select('general');
    cy.get('#title').type('Accessibility Test');
    cy.get('#description').type('Testing accessibility features of the feedback form.');
    
    // Submit the form
    cy.contains('button', 'Submit Feedback').click();
    
    // Wait for the API call
    cy.wait('@submitFeedback');
    
    // Check for the presence of a live region for screen readers
    cy.get('[aria-live="assertive"]').should('exist');
    
    // The toast should have role="alert"
    cy.get('.Toastify__toast').should('have.attr', 'role', 'alert');
  });
});
