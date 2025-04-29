import React, { forwardRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxLength?: number;
  required?: boolean;
  icon?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      id,
      error,
      helperText,
      showCount = false,
      maxLength,
      required = false,
      icon,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setCharacterCount(e.target.value.length);
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            name={id}
            aria-invalid={!!error}
            aria-describedby={`${id}-error ${id}-helper`}
            required={required}
            maxLength={maxLength}
            className={`
              w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2
              ${icon ? 'pl-10' : ''}
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
              ${className}
            `}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </div>
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

FormInput.displayName = 'FormInput';

export default FormInput;
