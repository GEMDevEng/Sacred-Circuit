/// <reference types="cypress" />

describe('Navigation Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it('should navigate to all public pages from the landing page', () => {
    cy.visit('/');
    
    // Verify landing page loaded
    cy.contains('Sacred Healing Companion').should('be.visible');
    
    // Navigate to About page
    cy.contains('About').click();
    cy.url().should('include', '/about');
    cy.contains('About Our Journey').should('be.visible');
    
    // Navigate to Privacy page
    cy.contains('Privacy').click();
    cy.url().should('include', '/privacy');
    cy.contains('Privacy Policy').should('be.visible');
    
    // Navigate back to home
    cy.contains('Home').click();
    cy.url().should('not.include', '/privacy');
    cy.url().should('not.include', '/about');
  });

  it('should navigate to authentication pages from the landing page', () => {
    cy.visit('/');
    
    // Navigate to Login page
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.contains('Welcome Back').should('be.visible');
    
    // Navigate to Register page from Login
    cy.contains('Create an account').click();
    cy.url().should('include', '/register');
    cy.contains('Create Your Account').should('be.visible');
    
    // Navigate to Forgot Password page from Login
    cy.visit('/login');
    cy.contains('Forgot password?').click();
    cy.url().should('include', '/forgot-password');
    cy.contains('Reset Your Password').should('be.visible');
  });

  it('should navigate to chatbot from the landing page', () => {
    cy.visit('/');
    
    // Click on the chatbot CTA
    cy.contains('Start Chatting').click();
    
    // Verify navigation to chatbot
    cy.url().should('include', '/chatbot');
    cy.contains('Sacred Healing Companion').should('be.visible');
    cy.get('#message').should('be.visible');
  });

  it('should navigate to reflection page from the chatbot', () => {
    cy.visit('/chatbot');
    
    // Click on the reflection link
    cy.contains('Submit Reflection').click();
    
    // Verify navigation to reflection page
    cy.url().should('include', '/reflection');
    cy.contains('Reflection Milestone').should('be.visible');
  });

  it('should navigate back to chatbot from the reflection page', () => {
    cy.visit('/reflection');
    
    // Click on the back link
    cy.contains('Back to Chatbot').click();
    
    // Verify navigation to chatbot
    cy.url().should('include', '/chatbot');
    cy.contains('Sacred Healing Companion').should('be.visible');
  });

  it('should show 404 page for non-existent routes', () => {
    cy.visit('/non-existent-page', { failOnStatusCode: false });
    
    // Verify 404 page
    cy.contains('Page Not Found').should('be.visible');
    cy.contains('The page you are looking for does not exist').should('be.visible');
    
    // Verify navigation back to home
    cy.contains('Return to Home').click();
    cy.url().should('not.include', '/non-existent-page');
  });

  it('should navigate to profile when logged in', () => {
    // Register and login
    const testUser = {
      healingName: 'TestHealer',
      email: `test-${Date.now()}@example.com`,
      password: 'Password123!'
    };
    
    cy.register(testUser.healingName, testUser.email, testUser.password);
    
    // Navigate to profile
    cy.contains('Profile').click();
    
    // Verify profile page
    cy.url().should('include', '/profile');
    cy.contains(testUser.healingName).should('be.visible');
  });

  it('should update navigation menu when logged in/out', () => {
    // When not logged in
    cy.visit('/');
    cy.contains('Login').should('be.visible');
    cy.contains('Register').should('be.visible');
    cy.contains('Profile').should('not.exist');
    cy.contains('Logout').should('not.exist');
    
    // Register and login
    const testUser = {
      healingName: 'TestHealer',
      email: `test-${Date.now()}@example.com`,
      password: 'Password123!'
    };
    
    cy.register(testUser.healingName, testUser.email, testUser.password);
    
    // When logged in
    cy.visit('/');
    cy.contains('Login').should('not.exist');
    cy.contains('Register').should('not.exist');
    cy.contains('Profile').should('be.visible');
    cy.contains('Logout').should('be.visible');
    
    // Logout
    cy.contains('Logout').click();
    
    // Verify logged out state
    cy.contains('Login').should('be.visible');
    cy.contains('Register').should('be.visible');
  });
});
