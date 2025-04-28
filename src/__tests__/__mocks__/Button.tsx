import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  'aria-label': ariaLabel,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {iconPosition === 'left' && icon && <span className="mr-2">{icon}</span>}
      {children}
      {iconPosition === 'right' && icon && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;
