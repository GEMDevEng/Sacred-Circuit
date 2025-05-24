import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import useForm from '../../hooks/useForm';
import { validateRequired, validateEmail, validateHealingName } from '../../utils/validators';
import { Form, Input } from '../common/form';
import Button from '../common/Button';

interface ProfileFormValues {
  healingName: string;
  email: string;
}

/**
 * Profile edit form component
 */
const ProfileForm = () => {
  const { user } = useAuth();
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
  } = useForm<ProfileFormValues>({
    initialValues: {
      healingName: user?.healingName || '',
      email: user?.email || '',
    },
    validators: {
      healingName: [validateRequired, validateHealingName],
      email: [validateRequired, validateEmail],
    },
    onSubmit: async (values) => {
      try {
        // TODO: Implement actual profile update API call
        // For now, we'll just simulate a successful update
        console.log('Updating profile with values:', values);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSuccess(true);
        toast.success('Profile updated successfully');
      } catch (error) {
        setFormError('Failed to update profile. Please try again.');
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-serif text-primary-600 mb-6 text-center">
        Edit Profile
      </h2>

      {isSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">Profile updated successfully!</p>
        </div>
      )}

      <Form
        onSubmit={handleSubmit}
        error={formError}
        isLoading={isSubmitting}
        className="space-y-4"
      >
        <Input
          label="Healing Name"
          name="healingName"
          type="text"
          value={values.healingName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.healingName ? errors.healingName : undefined}
          helperText="This name will be used to preserve your privacy"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
          required
        />

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfileForm;
