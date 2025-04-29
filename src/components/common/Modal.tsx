import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FocusTrap from './FocusTrap';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

/**
 * Accessible modal component
 * Includes focus trap, keyboard navigation, and ARIA attributes
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).substr(2, 9)}`).current;

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Determine modal width based on size prop
  const getModalWidth = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      default:
        return 'max-w-md';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <FocusTrap isActive={isOpen} onEscape={onClose}>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <motion.div
              ref={modalRef}
              className={`${getModalWidth()} w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 id={titleId} className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h2>
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </FocusTrap>
      )}
    </AnimatePresence>
  );
};

export default Modal;
