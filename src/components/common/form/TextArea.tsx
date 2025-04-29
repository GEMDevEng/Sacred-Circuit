import { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text for the textarea */
  label: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the textarea */
  helperText?: string;
  /** Whether the textarea is required */
  required?: boolean;
  /** Additional class name for the textarea container */
  containerClassName?: string;
  /** Additional class name for the textarea element */
  textareaClassName?: string;
  /** Additional class name for the label */
  labelClassName?: string;
}

/**
 * Reusable textarea component with label and error display
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      containerClassName = '',
      textareaClassName = '',
      labelClassName = '',
      id,
      className,
      rows = 4,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`mb-4 ${containerClassName}`}>
        <label
          htmlFor={textareaId}
          className={`block text-sm font-medium text-neutral-700 mb-1.5 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-vertical
              ${error ? 'border-red-500 focus:ring-red-500 pr-10' : 'border-gray-300 hover:border-gray-400'}
              ${props.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
              ${textareaClassName}
              ${className}`}
            aria-invalid={error ? true : false}
            aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
            required={required}
            {...props}
          />
          {error && (
            <div className="absolute top-3 right-0 flex items-start pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        {error && (
          <p id={`${textareaId}-error`} className="mt-1.5 text-sm text-red-600 flex items-center">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-1.5 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
