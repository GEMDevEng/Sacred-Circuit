/// <reference types="cypress" />

describe('Reflection History', () => {
  const testUser = {
    healingName: `TestHealer${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!'
  };

  beforeEach(() => {
    // Set healing name in localStorage to simulate a returning user
    cy.window().then((win) => {
      win.localStorage.setItem('healingName', testUser.healingName);
    });

    // Intercept API calls to the reflection endpoint
    cy.intercept('GET', '/api/reflection*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          reflections: [
            {
              id: 'rec123',
              healingName: testUser.healingName,
              content: 'This is my first reflection. I am feeling more connected to nature and my inner self.',
              journeyDay: 'Day 7',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
            },
            {
              id: 'rec456',
              healingName: testUser.healingName,
              content: 'My second reflection. I notice changes in my energy levels and mental clarity.',
              journeyDay: 'Day 14',
              createdAt: new Date().toISOString() // Today
            }
          ]
        },
        timestamp: new Date().toISOString()
      }
    }).as('getReflections');
  });

  it('should navigate to reflection history from reflection page', () => {
    cy.visit('/reflection');
    
    // Click on the history link
    cy.contains('View Your Reflection History').click();
    
    // Verify navigation to history page
    cy.url().should('include', '/reflection/history');
    cy.contains('Your Reflection Journey').should('be.visible');
    
    // Wait for API call
    cy.wait('@getReflections');
  });

  it('should display reflection history', () => {
    cy.visit('/reflection/history');
    
    // Wait for API call
    cy.wait('@getReflections');
    
    // Verify reflections are displayed
    cy.contains('Your Reflections').should('be.visible');
    cy.contains('Day 7 Reflection').should('be.visible');
    cy.contains('Day 14 Reflection').should('be.visible');
  });

  it('should display reflection details when clicked', () => {
    cy.visit('/reflection/history');
    
    // Wait for API call
    cy.wait('@getReflections');
    
    // Click on a reflection
    cy.contains('Day 14 Reflection').click();
    
    // Verify reflection details are displayed
    cy.contains('My second reflection').should('be.visible');
    cy.contains('Back to List').should('be.visible');
  });

  it('should navigate back to reflection form', () => {
    cy.visit('/reflection/history');
    
    // Wait for API call
    cy.wait('@getReflections');
    
    // Click on back link
    cy.contains('Back to Reflection Form').click();
    
    // Verify navigation to reflection page
    cy.url().should('include', '/reflection');
    cy.contains('Reflection Milestone').should('be.visible');
  });

  it('should show empty state when no reflections', () => {
    // Override the intercept to return empty reflections
    cy.intercept('GET', '/api/reflection*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          reflections: []
        },
        timestamp: new Date().toISOString()
      }
    }).as('getEmptyReflections');
    
    cy.visit('/reflection/history');
    
    // Wait for API call
    cy.wait('@getEmptyReflections');
    
    // Verify empty state
    cy.contains('No Reflections Yet').should('be.visible');
    cy.contains('Create Your First Reflection').should('be.visible');
  });

  it('should handle API errors gracefully', () => {
    // Override the intercept to return an error
    cy.intercept('GET', '/api/reflection*', {
      statusCode: 500,
      body: {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }
    }).as('getReflectionsError');
    
    cy.visit('/reflection/history');
    
    // Wait for API call
    cy.wait('@getReflectionsError');
    
    // Verify error message
    cy.contains('Failed to load reflections').should('be.visible');
  });
});
