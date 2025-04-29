import { InputHTMLAttributes, forwardRef } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text for the checkbox */
  label: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the checkbox */
  helperText?: string;
  /** Additional class name for the checkbox container */
  containerClassName?: string;
  /** Additional class name for the checkbox element */
  checkboxClassName?: string;
  /** Additional class name for the label */
  labelClassName?: string;
}

/**
 * Reusable checkbox component with label and error display
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      containerClassName = '',
      checkboxClassName = '',
      labelClassName = '',
      id,
      className,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`mb-4 ${containerClassName}`}>
        <div className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`h-4 w-4 text-primary focus:ring-primary rounded transition-colors
              ${error ? 'border-red-500' : 'border-gray-300'}
              ${checkboxClassName}
              ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${checkboxId}-error` : helperText ? `${checkboxId}-helper` : undefined}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={`ml-2 block text-sm text-neutral-700 ${labelClassName}`}
          >
            {label}
          </label>
        </div>
        {error && (
          <p id={`${checkboxId}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${checkboxId}-helper`} className="mt-1 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
