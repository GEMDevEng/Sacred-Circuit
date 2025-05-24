import React from 'react';

const LoginForm: React.FC = () => {
  return (
    <form data-testid="login-form">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <button type="submit">Sign In</button>
      <a href="/register">Create an account</a>
      <a href="/forgot-password">Forgot your password?</a>
    </form>
  );
};

export default LoginForm;
