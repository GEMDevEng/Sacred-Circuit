import { InputHTMLAttributes, forwardRef } from 'react';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text for the radio group */
  label: string;
  /** Options for the radio group */
  options: RadioOption[];
  /** Error message to display */
  error?: string;
  /** Helper text to display below the radio group */
  helperText?: string;
  /** Whether the radio group is required */
  required?: boolean;
  /** Additional class name for the radio group container */
  containerClassName?: string;
  /** Additional class name for the radio elements */
  radioClassName?: string;
  /** Additional class name for the label */
  labelClassName?: string;
  /** Layout direction for the radio options */
  direction?: 'horizontal' | 'vertical';
}

/**
 * Reusable radio group component with label and error display
 */
const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      required = false,
      containerClassName = '',
      radioClassName = '',
      labelClassName = '',
      id,
      name,
      direction = 'vertical',
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const groupId = id || `radio-group-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const groupName = name || `radio-group-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`mb-4 ${containerClassName}`}>
        <div className="mb-2">
          <span className={`block text-sm font-medium text-neutral-700 ${labelClassName}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        <div
          className={`flex ${direction === 'vertical' ? 'flex-col space-y-2' : 'flex-row flex-wrap gap-4'}`}
          role="radiogroup"
          aria-labelledby={`${groupId}-label`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${groupId}-error` : helperText ? `${groupId}-helper` : undefined}
        >
          {options.map((option, index) => {
            const optionId = `${groupId}-${option.value}`;
            const isFirstOption = index === 0;

            return (
              <div key={option.value} className="flex items-center">
                <input
                  ref={isFirstOption ? ref : undefined}
                  type="radio"
                  id={optionId}
                  name={groupName}
                  value={option.value}
                  className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 transition-colors
                    ${radioClassName}`}
                  required={required && isFirstOption}
                  {...props}
                />
                <label
                  htmlFor={optionId}
                  className="ml-2 block text-sm text-neutral-700"
                >
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
        {error && (
          <p id={`${groupId}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${groupId}-helper`} className="mt-1 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
