import { InputHTMLAttributes, forwardRef, useId } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
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
  /** Additional class name for the radio group wrapper */
  radioGroupClassName?: string;
  /** Layout for the radio options */
  layout?: 'horizontal' | 'vertical' | 'cards';
}

/**
 * Reusable radio group component with label and error display
 * Supports vertical, horizontal, and card layouts
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
      radioGroupClassName = '',
      id,
      name,
      layout = 'vertical',
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const generatedId = useId();
    const groupId = id || `radio-group-${generatedId}`;
    const groupName = name || `radio-group-${generatedId}`;

    // Determine layout classes
    const getLayoutClasses = () => {
      switch (layout) {
        case 'horizontal':
          return 'flex flex-row flex-wrap gap-4';
        case 'cards':
          return 'grid grid-cols-1 sm:grid-cols-2 gap-3';
        case 'vertical':
        default:
          return 'flex flex-col space-y-3';
      }
    };

    return (
      <div className={`mb-4 ${containerClassName}`}>
        <div className="mb-1.5">
          <label
            id={`${groupId}-label`}
            className={`block text-sm font-medium text-neutral-700 ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
        <div
          className={`${getLayoutClasses()} ${radioGroupClassName}`}
          role="radiogroup"
          aria-labelledby={`${groupId}-label`}
          aria-invalid={!!error}
          aria-describedby={error ? `${groupId}-error` : helperText ? `${groupId}-helper` : undefined}
        >
          {options.map((option, index) => {
            const optionId = `${groupId}-${option.value}`;
            const isFirstOption = index === 0;
            const isChecked = props.value === option.value;

            if (layout === 'cards') {
              return (
                <div
                  key={option.value}
                  className={`border rounded-lg p-4 transition-colors cursor-pointer hover:bg-gray-50 ${
                    isChecked ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    const input = document.getElementById(optionId) as HTMLInputElement;
                    if (input) {
                      input.checked = true;
                      input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                  }}
                >
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        ref={isFirstOption ? ref : undefined}
                        type="radio"
                        id={optionId}
                        name={groupName}
                        value={option.value}
                        className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 transition-colors
                          ${error ? 'border-red-500' : ''}
                          ${radioClassName}`}
                        required={required && isFirstOption}
                        aria-describedby={option.description ? `${optionId}-description` : undefined}
                        {...props}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor={optionId}
                        className={`font-medium ${isChecked ? 'text-primary-700' : 'text-gray-900'} cursor-pointer`}
                      >
                        <div className="flex items-center">
                          {option.icon && <span className="mr-2">{option.icon}</span>}
                          {option.label}
                        </div>
                      </label>
                      {option.description && (
                        <p id={`${optionId}-description`} className="text-gray-500 mt-1">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={option.value} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    ref={isFirstOption ? ref : undefined}
                    type="radio"
                    id={optionId}
                    name={groupName}
                    value={option.value}
                    className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 transition-colors
                      ${error ? 'border-red-500' : ''}
                      ${radioClassName}`}
                    required={required && isFirstOption}
                    aria-describedby={option.description ? `${optionId}-description` : undefined}
                    {...props}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor={optionId}
                    className="font-medium text-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center">
                      {option.icon && <span className="mr-2">{option.icon}</span>}
                      {option.label}
                    </div>
                  </label>
                  {option.description && (
                    <p id={`${optionId}-description`} className="text-gray-500 mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {error && (
          <p id={`${groupId}-error`} className="mt-1.5 text-sm text-red-600 flex items-center">
            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${groupId}-helper`} className="mt-1.5 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
