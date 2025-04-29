import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useForm from '../../hooks/useForm';
import { validateRequired, validateEmail } from '../../utils/validators';
import { Form } from '../common/form';
import { FormInput } from '../common/form';
import Button from '../common/Button';
import SentryErrorBoundary from '../common/SentryErrorBoundary';

interface ForgotPasswordFormValues {
  email: string;
}

/**
 * Forgot password form component
 */
const ForgotPasswordForm = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize form with validation
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<ForgotPasswordFormValues>({
    initialValues: {
      email: '',
    },
    validators: {
      email: [validateRequired, validateEmail],
    },
    onSubmit: async (values) => {
      try {
        // TODO: Implement actual password reset API call
        // For now, we'll just simulate a successful request

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSuccess(true);
        toast.success('Password reset instructions sent to your email');
      } catch (error) {
        setFormError('Failed to send password reset email. Please try again.');
      }
    },
  });

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-serif text-primary-600 dark:text-primary-400 mb-4 text-center">
          Check Your Email
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-6 text-center">
          We've sent password reset instructions to {values.email}. Please check your inbox.
        </p>
        <div className="text-center">
          <Link to="/login">
            <Button variant="outline" type="button">
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-serif text-primary-600 dark:text-primary-400 mb-4 text-center">
        Reset Your Password
      </h2>
      <p className="text-neutral-600 dark:text-neutral-300 mb-6 text-center">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

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

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
            className="mt-6"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
          </Button>

          <div className="text-center mt-4">
            <p className="text-neutral-600 dark:text-neutral-300 text-sm">
              Remember your password?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </Form>
      </SentryErrorBoundary>
    </div>
  );
};

export default ForgotPasswordForm;
