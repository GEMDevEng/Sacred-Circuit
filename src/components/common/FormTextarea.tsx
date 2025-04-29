import React, { forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxLength?: number;
  required?: boolean;
  rows?: number;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      id,
      error,
      helperText,
      showCount = false,
      maxLength,
      required = false,
      rows = 4,
      className = '',
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const [value, setValue] = useState(props.value || props.defaultValue || '');

    useEffect(() => {
      if (props.value !== undefined) {
        setValue(props.value);
        setCharacterCount(String(props.value || '').length);
      }
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      setCharacterCount(e.target.value.length);
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          id={id}
          name={id}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={`${id}-error ${id}-helper`}
          required={required}
          maxLength={maxLength}
          className={`
            w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800'
            }
            ${
              isFocused
                ? 'bg-white dark:bg-gray-800'
                : 'bg-gray-50 dark:bg-gray-900'
            }
            dark:text-white
            transition-colors duration-200
            resize-y
            ${className}
          `}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <div className="mt-1 flex justify-between">
          <div>
            {error && (
              <motion.p
                id={`${id}-error`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {error}
              </motion.p>
            )}
            {!error && helperText && (
              <p
                id={`${id}-helper`}
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                {helperText}
              </p>
            )}
          </div>
          {showCount && maxLength && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {characterCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
