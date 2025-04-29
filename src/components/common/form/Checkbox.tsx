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
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className={`h-5 w-5 text-primary-600 focus:ring-primary-500 rounded transition-colors border-gray-300
                ${error ? 'border-red-500' : 'border-gray-300'}
                ${props.disabled ? 'opacity-60 cursor-not-allowed' : ''}
                ${checkboxClassName}
                ${className}`}
              aria-invalid={error ? true : false}
              aria-describedby={error ? `${checkboxId}-error` : helperText ? `${checkboxId}-helper` : undefined}
              {...props}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor={checkboxId}
              className={`font-medium text-neutral-700 ${props.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${labelClassName}`}
            >
              {label}
            </label>
            {helperText && !error && (
              <p id={`${checkboxId}-helper`} className="text-neutral-500 mt-1">
                {helperText}
              </p>
            )}
          </div>
        </div>
        {error && (
          <p id={`${checkboxId}-error`} className="mt-1.5 text-sm text-red-600 flex items-center">
            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
