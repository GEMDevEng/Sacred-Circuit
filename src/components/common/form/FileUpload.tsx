import React, { forwardRef, useId, useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, AlertCircle } from 'lucide-react';

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label for the file upload */
  label: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display */
  helperText?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Additional class name for the container */
  containerClassName?: string;
  /** Additional class name for the label */
  labelClassName?: string;
  /** Additional class name for the input */
  inputClassName?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Accepted file types */
  accept?: string;
  /** Whether to allow multiple files */
  multiple?: boolean;
  /** Whether to show a preview of the file (for images) */
  showPreview?: boolean;
  /** Custom validation function */
  validateFile?: (file: File) => string | null;
  /** Callback when files are selected */
  onFilesSelected?: (files: FileList | null) => void;
}

/**
 * FileUpload component for uploading files
 */
const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      error,
      helperText,
      required = false,
      containerClassName = '',
      labelClassName = '',
      inputClassName = '',
      maxSize,
      accept,
      multiple = false,
      showPreview = true,
      validateFile,
      onFilesSelected,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = useId();
    // Create a properly typed mutable ref to allow assignment
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Format file size to human-readable format
    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Get appropriate icon for file type
    const getFileIcon = (file: File) => {
      if (file.type.startsWith('image/')) {
        return <Image size={20} className="text-primary-600" />;
      } else if (file.type.includes('pdf')) {
        return <FileText size={20} className="text-red-600" />;
      } else if (file.type.includes('word') || file.type.includes('document')) {
        return <FileText size={20} className="text-blue-600" />;
      } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
        return <FileText size={20} className="text-green-600" />;
      } else {
        return <File size={20} className="text-gray-600" />;
      }
    };

    // Validate file
    const validateFiles = (files: FileList | null): string | null => {
      if (!files || files.length === 0) return null;

      // Convert FileList to array for easier processing
      const fileArray = Array.from(files);

      // Check file size
      if (maxSize) {
        const oversizedFile = fileArray.find(file => file.size > maxSize);
        if (oversizedFile) {
          return `File "${oversizedFile.name}" exceeds maximum size of ${formatFileSize(maxSize)}`;
        }
      }

      // Check file type if accept is specified
      if (accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const invalidFile = fileArray.find(file => {
          // Check if file type matches any of the accepted types
          return !acceptedTypes.some(type => {
            if (type.startsWith('.')) {
              // Check file extension
              return file.name.toLowerCase().endsWith(type.toLowerCase());
            } else if (type.includes('*')) {
              // Handle wildcards like image/*
              const [category] = type.split('/');
              return file.type.startsWith(`${category}/`);
            } else {
              // Exact MIME type match
              return file.type === type;
            }
          });
        });

        if (invalidFile) {
          return `File "${invalidFile.name}" has an invalid file type`;
        }
      }

      // Run custom validation if provided
      if (validateFile) {
        for (const file of fileArray) {
          const customError = validateFile(file);
          if (customError) return customError;
        }
      }

      return null;
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      // Validate files
      const error = validateFiles(files);
      setValidationError(error);

      if (error || !files || files.length === 0) {
        if (onChange) onChange(e);
        if (onFilesSelected) onFilesSelected(null);
        return;
      }

      // Convert FileList to array
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);

      // Create preview URLs for images
      if (showPreview) {
        const urls = fileArray.map(file => {
          if (file.type.startsWith('image/')) {
            return URL.createObjectURL(file);
          }
          return '';
        });
        setPreviewUrls(urls);
      }

      // Call original onChange handler
      if (onChange) onChange(e);

      // Call onFilesSelected callback
      if (onFilesSelected) onFilesSelected(files);
    };

    // Handle file removal
    const handleRemoveFile = (index: number) => {
      const newFiles = [...selectedFiles];
      newFiles.splice(index, 1);

      // Update selected files
      setSelectedFiles(newFiles);

      // Revoke object URL to prevent memory leaks
      if (previewUrls[index]) {
        URL.revokeObjectURL(previewUrls[index]);
      }

      // Update preview URLs
      const newPreviewUrls = [...previewUrls];
      newPreviewUrls.splice(index, 1);
      setPreviewUrls(newPreviewUrls);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Call onFilesSelected with null if no files left
      if (newFiles.length === 0 && onFilesSelected) {
        onFilesSelected(null);
      }
    };

    // Handle drag events
    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };

    // Handle drop event
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // Update file input value
        if (fileInputRef.current) {
          fileInputRef.current.files = e.dataTransfer.files;

          // Create a synthetic change event
          const event = new Event('change', { bubbles: true });
          fileInputRef.current.dispatchEvent(event);

          // Handle the files
          handleFileChange({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    };

    // Combine error messages
    const displayError = error || validationError;

    // Get aria-describedby attribute value
    const getAriaDescribedBy = () => {
      if (displayError) {
        return `${inputId}-error`;
      } else if (helperText) {
        return `${inputId}-helper`;
      }
      return undefined;
    };

    return (
      <div className={`mb-4 ${containerClassName}`}>
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium text-neutral-700 mb-1.5 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
          } ${displayError ? 'border-red-500' : ''} ${inputClassName}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center py-4 text-center cursor-pointer">
            <Upload size={24} className="text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700">
              {multiple ? 'Drop files here or click to browse' : 'Drop file here or click to browse'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept ? `Accepted formats: ${accept}` : 'All file types accepted'}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
            </p>
            <input
              ref={(node) => {
                // Handle both refs
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
                // Only assign if node is not null
                if (node) {
                  fileInputRef.current = node;
                }
              }}
              id={inputId}
              type="file"
              className="hidden"
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              aria-invalid={displayError ? 'true' : 'false'}
              aria-describedby={getAriaDescribedBy()}
              required={required}
              {...props}
            />
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-2 truncate">
                  {getFileIcon(file)}
                  <div className="truncate">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Image Previews */}
        {showPreview && previewUrls.some(url => url) && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {previewUrls.map((url, index) => {
              if (!url) return null;
              return (
                <div key={`preview-${index}`} className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={url}
                    alt={`Preview of ${selectedFiles[index]?.name}`}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-gray-500 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${selectedFiles[index]?.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Error Message */}
        {displayError && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {displayError}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !displayError && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
