import React, { ElementType } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  'aria-label'?: string;
  /** Component to render as (e.g., 'button', 'a', Link) */
  as?: ElementType;
  /** For when 'as' is a Link component */
  to?: string;
  /** Whether the button should take up the full width of its container */
  fullWidth?: boolean;
  /** Whether to show a loading spinner */
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
  as: Component = 'button',
  to,
  fullWidth = false,
  isLoading = false,
  ...props
}) => {
  // Content to render inside the button
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </>
  );

  // If using a custom component (like Link from react-router-dom)
  if (Component !== 'button') {
    return (
      <Component
        className={`btn btn-${variant} btn-${size} ${fullWidth ? 'w-full' : ''} ${className}`}
        to={to}
        aria-label={ariaLabel}
        {...props}
      >
        {content}
      </Component>
    );
  }

  // Default button rendering
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {isLoading ? 'Loading...' : content}
    </button>
  );
};

export default Button;
