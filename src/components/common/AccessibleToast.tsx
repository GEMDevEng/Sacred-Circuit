import React, { useEffect, useRef } from 'react';
import { toast, ToastOptions, Id } from 'react-toastify';

interface AccessibleToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  options?: ToastOptions;
}

/**
 * Accessible toast component that announces messages to screen readers
 * @param message - The message to display and announce
 * @param type - The type of toast (info, success, warning, error)
 * @param options - Additional toast options
 * @returns The toast ID
 */
export const showAccessibleToast = ({
  message,
  type = 'info',
  options = {}
}: AccessibleToastProps): Id => {
  // Create a live region for screen readers
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'assertive');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  document.body.appendChild(liveRegion);

  // Set the message in the live region
  liveRegion.textContent = message;

  // Show the toast
  const toastId = toast[type](
    <AccessibleToastContent message={message} type={type} />,
    {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...options
    }
  );

  // Clean up the live region after the toast is closed
  setTimeout(() => {
    document.body.removeChild(liveRegion);
  }, options.autoClose || 5000);

  return toastId;
};

/**
 * Toast content component with proper ARIA attributes
 */
const AccessibleToastContent: React.FC<{ message: string; type: string }> = ({
  message,
  type
}) => {
  const iconRef = useRef<HTMLSpanElement>(null);

  // Set appropriate icon based on toast type
  useEffect(() => {
    if (iconRef.current) {
      switch (type) {
        case 'success':
          iconRef.current.innerHTML = '✓';
          iconRef.current.setAttribute('aria-label', 'Success:');
          break;
        case 'error':
          iconRef.current.innerHTML = '✗';
          iconRef.current.setAttribute('aria-label', 'Error:');
          break;
        case 'warning':
          iconRef.current.innerHTML = '⚠';
          iconRef.current.setAttribute('aria-label', 'Warning:');
          break;
        case 'info':
        default:
          iconRef.current.innerHTML = 'ℹ';
          iconRef.current.setAttribute('aria-label', 'Information:');
          break;
      }
    }
  }, [type]);

  return (
    <div className="flex items-start" role="alert">
      <span
        ref={iconRef}
        className="mr-2 text-lg"
        aria-hidden="true"
      ></span>
      <span>{message}</span>
    </div>
  );
};

export default showAccessibleToast;
