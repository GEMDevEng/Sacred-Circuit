/// <reference types="cypress" />

describe('Authentication Flow', () => {
  const testUser = {
    healingName: 'TestHealer',
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!'
  };

  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it('should allow a user to register', () => {
    cy.visit('/register');
    
    // Fill out the registration form
    cy.get('#healingName').type(testUser.healingName);
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('#confirmPassword').type(testUser.password);
    cy.get('#agreeTerms').check();
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify successful registration
    cy.url().should('not.include', '/register');
    cy.contains('Registration successful').should('be.visible');
  });

  it('should show validation errors on the registration form', () => {
    cy.visit('/register');
    
    // Submit empty form
    cy.get('button[type="submit"]').click();
    
    // Verify validation errors
    cy.contains('Healing Name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
    
    // Fill with invalid data
    cy.get('#email').type('invalid-email');
    cy.get('#password').type('short');
    cy.get('#confirmPassword').type('different');
    
    // Verify validation errors
    cy.contains('Invalid email address').should('be.visible');
    cy.contains('Password must be at least 8 characters').should('be.visible');
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should allow a user to login', () => {
    // Register a user first
    cy.register(testUser.healingName, testUser.email, testUser.password);
    
    // Log out
    cy.clearLocalStorage();
    
    // Visit login page
    cy.visit('/login');
    
    // Fill out the login form
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify successful login
    cy.url().should('not.include', '/login');
    cy.contains('Login successful').should('be.visible');
    
    // Verify user is logged in
    cy.visit('/profile');
    cy.contains(testUser.healingName).should('be.visible');
  });

  it('should show error for invalid login credentials', () => {
    cy.visit('/login');
    
    // Fill out the login form with invalid credentials
    cy.get('#email').type(testUser.email);
    cy.get('#password').type('WrongPassword123!');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify error message
    cy.contains('Invalid email or password').should('be.visible');
    
    // URL should still be login page
    cy.url().should('include', '/login');
  });

  it('should redirect to login when accessing protected routes', () => {
    // Try to access protected route without being logged in
    cy.visit('/profile');
    
    // Should redirect to login
    cy.url().should('include', '/login');
    
    // Should show message
    cy.contains('Please log in to access this page').should('be.visible');
  });

  it('should allow a user to reset password', () => {
    cy.visit('/forgot-password');
    
    // Fill out the form
    cy.get('#email').type(testUser.email);
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.contains('Password reset instructions sent').should('be.visible');
  });
});
