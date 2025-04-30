import { FormHTMLAttributes, ReactNode } from 'react';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /** Form children */
  children: ReactNode;
  /** Form error message */
  error?: string | null;
  /** Whether the form is in a loading state */
  isLoading?: boolean;
  /** Additional class name for the form */
  formClassName?: string;
}

/**
 * Reusable form component with error display
 */
const Form = ({
  children,
  error,
  isLoading = false,
  formClassName = '',
  className,
  ...props
}: FormProps) => {
  return (
    <form
      className={`${formClassName} ${className}`}
      noValidate
      {...props}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <fieldset disabled={isLoading} className="space-y-4">
        {children}
      </fieldset>
    </form>
  );
};

export default Form;
