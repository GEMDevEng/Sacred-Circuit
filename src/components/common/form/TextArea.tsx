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
          className={`block text-sm font-medium text-neutral-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${textareaClassName}
            ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          required={required}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-1 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
