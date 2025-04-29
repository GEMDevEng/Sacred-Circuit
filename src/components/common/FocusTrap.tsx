import React, { useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  onEscape?: () => void;
}

/**
 * Focus trap component for modals and dialogs
 * Traps focus within the component when active and restores focus when deactivated
 * Also handles Escape key to close the modal
 */
const FocusTrap: React.FC<FocusTrapProps> = ({ children, isActive, onEscape }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save the previously focused element and focus the first focusable element in the container
  useEffect(() => {
    if (isActive && containerRef.current) {
      // Save the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Find all focusable elements in the container
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      // Focus the first focusable element
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        // If no focusable elements, focus the container itself
        containerRef.current.tabIndex = -1;
        containerRef.current.focus();
      }
    }

    // Restore focus when the component is unmounted or deactivated
    return () => {
      if (isActive && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  // Handle tab key to trap focus within the container
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isActive || !containerRef.current) return;

    // Handle Escape key
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }

    // Handle Tab key
    if (event.key === 'Tab') {
      const focusableElements = Array.from(
        containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[];

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // If shift + tab and first element is focused, move to last element
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // If tab and last element is focused, move to first element
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
};

export default FocusTrap;
