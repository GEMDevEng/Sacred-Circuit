/// <reference types="cypress" />

describe('Authentication Flow', () => {
  const testUser = {
    healingName: `TestHealer${Date.now()}`,
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
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify successful registration
    cy.contains('Registration successful').should('be.visible');
    
    // Should be redirected to home or dashboard
    cy.url().should('not.include', '/register');
    
    // Verify user is logged in
    cy.window().its('localStorage.token').should('exist');
  });

  it('should allow a user to login', () => {
    cy.visit('/login');
    
    // Fill out the login form
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify successful login
    cy.contains('Login successful').should('be.visible');
    
    // Should be redirected to home or dashboard
    cy.url().should('not.include', '/login');
    
    // Verify user is logged in
    cy.window().its('localStorage.token').should('exist');
  });

  it('should allow a user to access protected routes when authenticated', () => {
    // Login first
    cy.visit('/login');
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('button[type="submit"]').click();
    
    // Visit profile page (protected route)
    cy.visit('/profile');
    
    // Verify profile page is accessible
    cy.contains('Profile').should('be.visible');
    cy.contains(testUser.healingName).should('be.visible');
    cy.contains(testUser.email).should('be.visible');
  });

  it('should redirect to login when accessing protected routes without authentication', () => {
    // Clear localStorage to ensure user is logged out
    cy.clearLocalStorage();
    
    // Try to visit profile page (protected route)
    cy.visit('/profile');
    
    // Should be redirected to login
    cy.url().should('include', '/login');
  });

  it('should allow a user to logout', () => {
    // Login first
    cy.visit('/login');
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('button[type="submit"]').click();
    
    // Click logout button
    cy.get('button[aria-label="Logout"]').click();
    
    // Verify successful logout
    cy.contains('Logged out successfully').should('be.visible');
    
    // Verify user is logged out
    cy.window().its('localStorage.token').should('not.exist');
    
    // Try to visit profile page (protected route)
    cy.visit('/profile');
    
    // Should be redirected to login
    cy.url().should('include', '/login');
  });

  it('should handle invalid login credentials', () => {
    cy.visit('/login');
    
    // Fill out the login form with invalid credentials
    cy.get('#email').type(testUser.email);
    cy.get('#password').type('WrongPassword123!');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify error message
    cy.contains('Invalid credentials').should('be.visible');
    
    // Should remain on login page
    cy.url().should('include', '/login');
    
    // Verify user is not logged in
    cy.window().its('localStorage.token').should('not.exist');
  });

  it('should validate registration form inputs', () => {
    cy.visit('/register');
    
    // Submit empty form
    cy.get('button[type="submit"]').click();
    
    // Verify validation errors
    cy.contains('Healing name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
    
    // Fill with invalid email
    cy.get('#email').type('invalid-email');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify email validation error
    cy.contains('Please enter a valid email').should('be.visible');
    
    // Fill with short password
    cy.get('#password').type('short');
    cy.get('#confirmPassword').type('short');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify password validation error
    cy.contains('Password must be at least 8 characters').should('be.visible');
    
    // Fill with mismatched passwords
    cy.get('#password').clear().type('Password123!');
    cy.get('#confirmPassword').clear().type('DifferentPassword123!');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify password match error
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('should handle token refresh', () => {
    // Login first
    cy.visit('/login');
    cy.get('#email').type(testUser.email);
    cy.get('#password').type(testUser.password);
    cy.get('button[type="submit"]').click();
    
    // Simulate token expiration by setting an expired token
    cy.window().then((win) => {
      // This is a mock expired token for testing purposes
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjIzOTAyM30.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';
      win.localStorage.setItem('token', expiredToken);
    });
    
    // Visit profile page which should trigger token refresh
    cy.visit('/profile');
    
    // Intercept the refresh token request
    cy.intercept('POST', '/api/auth/refresh').as('refreshToken');
    
    // Wait for the refresh token request
    cy.wait('@refreshToken');
    
    // Verify profile page is still accessible after token refresh
    cy.contains('Profile').should('be.visible');
    cy.contains(testUser.healingName).should('be.visible');
  });
});
