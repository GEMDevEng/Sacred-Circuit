import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  id: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  required?: boolean;
  icon?: React.ReactNode;
  onChange?: (value: string) => void;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      id,
      options,
      error,
      helperText,
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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
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
          <select
            ref={ref}
            id={id}
            name={id}
            aria-invalid={!!error}
            aria-describedby={`${id}-error ${id}-helper`}
            required={required}
            className={`
              w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2
              appearance-none
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
          >
            <option value="" disabled>
              Select an option
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="mt-1">
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
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
