import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import useForm from '../../hooks/useForm';
import { validateRequired, validateEmail } from '../../utils/validators';
import { Form, Input } from '../common/form';
import Button from '../common/Button';

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-serif text-primary-600 mb-6 text-center">
        Welcome Back
      </h2>
      
      <Form
        onSubmit={handleSubmit}
        error={formError}
        isLoading={isSubmitting}
        className="space-y-4"
      >
        <Input
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
          required
          autoComplete="email"
        />
        
        <Input
          label="Password"
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
          <Link to="/forgot-password" className="text-primary-600 hover:underline">
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
          <p className="text-neutral-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
