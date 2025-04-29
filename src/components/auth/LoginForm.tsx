import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import useForm from '../../hooks/useForm';
import { validateRequired, validateEmail } from '../../utils/validators';
import { Form } from '../common/form';
import { FormInput } from '../common/form';
import Button from '../common/Button';
import SentryErrorBoundary from '../common/SentryErrorBoundary';

interface LoginFormValues {
  email: string;
  password: string;
}

/**
 * Login form component
 */
const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);

  // Get the redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  // Initialize form with validation
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validators: {
      email: [validateRequired, validateEmail],
      password: [validateRequired],
    },
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        toast.success('Login successful');
        navigate(from, { replace: true });
      } catch (error) {
        setFormError('Invalid email or password. Please try again.');
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-serif text-primary-600 dark:text-primary-400 mb-6 text-center">
        Welcome Back
      </h2>

      <SentryErrorBoundary>
        <Form
          onSubmit={handleSubmit}
          error={formError}
          isLoading={isSubmitting}
          className="space-y-4"
        >
          <FormInput
            label="Email"
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : undefined}
            required
            autoComplete="email"
          />

          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : undefined}
            required
            autoComplete="current-password"
          />

          <div className="flex justify-between items-center text-sm">
            <Link to="/forgot-password" className="text-primary-600 dark:text-primary-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
            className="mt-6"
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </Button>

          <div className="text-center mt-4">
            <p className="text-neutral-600 dark:text-neutral-300 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </Form>
      </SentryErrorBoundary>
    </div>
  );
};

export default LoginForm;
