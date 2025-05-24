import { useState } from 'react';
import { toast } from 'react-toastify';
import useForm from '../../hooks/useForm';
import { validateRequired, validatePassword, validateMatch } from '../../utils/validators';
import { Form, Input } from '../common/form';
import Button from '../common/Button';

interface PasswordChangeFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Password change form component
 */
const PasswordChangeForm = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize form with validation
  const formHook = useForm<PasswordChangeFormValues>({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      currentPassword: [validateRequired],
      newPassword: [validateRequired, validatePassword],
      confirmPassword: [validateRequired],
    },
    onSubmit: async (formValues: PasswordChangeFormValues) => {
      try {
        // TODO: Implement actual password change API call
        // For now, we'll just simulate a successful update
        console.log('Changing password with values:', formValues);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSuccess(true);
        toast.success('Password changed successfully');
        resetForm();
      } catch (error) {
        setFormError('Failed to change password. Please try again.');
      }
    },
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldError,
  } = formHook;

  // Custom validation for confirm password
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e);

    // Validate password match after state update
    setTimeout(() => {
      if (e.target.value && values.newPassword) {
        const matchError = validateMatch(values.newPassword, 'new password')(e.target.value);
        if (matchError) {
          setFieldError('confirmPassword', matchError);
        }
      }
    }, 0);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-serif text-primary-600 mb-6 text-center">
        Change Password
      </h2>

      {isSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">Password changed successfully!</p>
        </div>
      )}

      <Form
        onSubmit={handleSubmit}
        error={formError}
        isLoading={isSubmitting}
        className="space-y-4"
      >
        <Input
          label="Current Password"
          name="currentPassword"
          type="password"
          value={values.currentPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.currentPassword ? errors.currentPassword : undefined}
          required
          autoComplete="current-password"
        />

        <Input
          label="New Password"
          name="newPassword"
          type="password"
          value={values.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.newPassword ? errors.newPassword : undefined}
          helperText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
          required
          autoComplete="new-password"
        />

        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleConfirmPasswordChange}
          onBlur={handleBlur}
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
          required
          autoComplete="new-password"
        />

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Changing Password...' : 'Change Password'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PasswordChangeForm;
