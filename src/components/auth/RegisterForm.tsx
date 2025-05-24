import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import useForm from '../../hooks/useForm';
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validateMatch,
  validateHealingName,
} from '../../utils/validators';
import { Form, Checkbox } from '../common/form';
import { FormInput } from '../common/form';
import Button from '../common/Button';
import SentryErrorBoundary from '../common/SentryErrorBoundary';

interface RegisterFormValues {
  healingName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

/**
 * Registration form component
 */
const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form with validation
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<RegisterFormValues>({
    initialValues: {
      healingName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
    validators: {
      healingName: [validateRequired, validateHealingName],
      email: [validateRequired, validateEmail],
      password: [validateRequired, validatePassword],
      confirmPassword: [
        validateRequired,
        (value: string): string | undefined => validateMatch(values.password, 'password')(value),
      ],
      agreeTerms: [
        (value) => (value ? undefined : 'You must agree to the terms and privacy policy'),
      ],
    },
    onSubmit: async (values) => {
      try {
        await register(values.healingName, values.email, values.password);
        toast.success('Registration successful');
        navigate('/');
      } catch (error) {
        setFormError('Failed to create account. Please try again.');
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-serif text-primary-600 dark:text-primary-400 mb-6 text-center">
        Create Your Account
      </h2>

      <SentryErrorBoundary>
        <Form
          onSubmit={handleSubmit}
          error={formError}
          isLoading={isSubmitting}
          className="space-y-4"
        >
          <FormInput
            label="Healing Name"
            id="healingName"
            name="healingName"
            type="text"
            value={values.healingName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.healingName ? errors.healingName : undefined}
            helperText="This name will be used to preserve your privacy"
            required
            autoComplete="off"
          />

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
            helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
            required
            autoComplete="new-password"
          />

          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            required
            autoComplete="new-password"
          />

        <Checkbox
          label={
            <>
              I agree to the{' '}
              <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
                Privacy Policy
              </Link>
            </>
          }
          name="agreeTerms"
          checked={values.agreeTerms}
          onChange={handleChange}
          error={touched.agreeTerms ? errors.agreeTerms : undefined}
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
          className="mt-6"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center mt-4">
          <p className="text-neutral-600 dark:text-neutral-300 text-sm">
            Already have an account?{' '}
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

export default RegisterForm;
