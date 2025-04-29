/// <reference types="cypress" />

describe('Feedback Form', () => {
  beforeEach(() => {
    // Visit the home page where the feedback button should be available
    cy.visit('/');
    
    // Intercept API calls to the feedback endpoint
    cy.intercept('POST', '/api/feedback', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Feedback submitted successfully'
      }
    }).as('submitFeedback');
  });

  it('should open the feedback modal when clicking the feedback button', () => {
    // Find and click the feedback button
    cy.get('button[aria-label="Provide feedback"]').click();
    
    // Verify the modal is visible
    cy.contains('Share Your Feedback').should('be.visible');
    cy.get('form').should('be.visible');
  });

  it('should close the modal when clicking the close button', () => {
    // Open the modal
    cy.get('button[aria-label="Provide feedback"]').click();
    
    // Click the close button
    cy.get('button[aria-label="Close modal"]').click();
    
    // Verify the modal is closed
    cy.contains('Share Your Feedback').should('not.exist');
  });

  it('should show validation errors for empty required fields', () => {
    // Open the modal
    cy.get('button[aria-label="Provide feedback"]').click();
    
    // Submit the form without filling in required fields
    cy.contains('button', 'Submit Feedback').click();
    
    // Verify validation errors
    cy.contains('Please select a feedback type').should('be.visible');
    cy.contains('Please enter a title').should('be.visible');
    cy.contains('Please provide details').should('be.visible');
  });

  it('should submit feedback successfully', () => {
    // Open the modal
    cy.get('button[aria-label="Provide feedback"]').click();
    
    // Fill out the form
    cy.get('#type').select('feature');
    cy.get('#title').type('Test Feedback Title');
    cy.get('#description').type('This is a test feedback submission from Cypress. Testing the feedback form functionality.');
    cy.get('#email').type('test@example.com');
    
    // Submit the form
    cy.contains('button', 'Submit Feedback').click();
    
    // Wait for the API call
    cy.wait('@submitFeedback').its('request.body').should('deep.include', {
      type: 'feature',
      title: 'Test Feedback Title'
    });
    
    // Verify success message
    cy.contains('Thank you for your feedback!').should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    // Override the intercept to return an error
    cy.intercept('POST', '/api/feedback', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Internal server error'
      }
    }).as('submitFeedbackError');
    
    // Open the modal
    cy.get('button[aria-label="Provide feedback"]').click();
    
    // Fill out the form
    cy.get('#type').select('bug');
    cy.get('#title').type('Test Error Handling');
    cy.get('#description').type('Testing error handling in the feedback form.');
    
    // Submit the form
    cy.contains('button', 'Submit Feedback').click();
    
    // Wait for the API call
    cy.wait('@submitFeedbackError');
    
    // Verify error message (from toast)
    cy.contains('Failed to submit feedback').should('be.visible');
  });
});
