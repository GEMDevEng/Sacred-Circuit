import React, { forwardRef, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  accept?: string;
  maxSizeInMB?: number;
  onChange?: (file: File | null) => void;
  onError?: (error: string) => void;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      id,
      error,
      helperText,
      required = false,
      accept = 'image/*',
      maxSizeInMB = 5,
      className = '',
      onChange,
      onError,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    const handleFileChange = (file: File | null) => {
      if (!file) {
        setFileName(null);
        setFilePreview(null);
        onChange?.(null);
        return;
      }

      // Check file size
      if (file.size > maxSizeInBytes) {
        const errorMsg = `File size exceeds ${maxSizeInMB}MB limit`;
        onError?.(errorMsg);
        return;
      }

      setFileName(file.name);
      onChange?.(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFileChange(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      
      const file = e.dataTransfer.files?.[0] || null;
      handleFileChange(file);
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFileName(null);
      setFilePreview(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      onChange?.(null);
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
        <div
          className={`
            border-2 border-dashed rounded-md p-4 text-center cursor-pointer
            transition-colors duration-200
            ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
            }
            ${error ? 'border-red-500 hover:border-red-500' : ''}
            ${className}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-invalid={!!error}
          aria-describedby={`${id}-error ${id}-helper`}
        >
          <input
            ref={(node) => {
              // Handle both the forwarded ref and the local ref
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              inputRef.current = node;
            }}
            id={id}
            name={id}
            type="file"
            accept={accept}
            required={required}
            className="sr-only"
            onChange={handleChange}
            {...props}
          />

          {filePreview ? (
            <div className="relative">
              <img
                src={filePreview}
                alt="Preview"
                className="max-h-40 mx-auto rounded"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                aria-label="Remove file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ) : fileName ? (
            <div className="flex items-center justify-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                {fileName}
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Drag and drop a file, or click to select
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                {accept.replace(/,/g, ', ')} (Max: {maxSizeInMB}MB)
              </p>
            </div>
          )}
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

FileUpload.displayName = 'FileUpload';

export default FileUpload;
