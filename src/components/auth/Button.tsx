import React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  className,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const baseClasses = 'auth-button';
  const variantClasses = `auth-button--${variant}`;
  const sizeClasses = `auth-button--${size}`;
  const fullWidthClass = fullWidth ? 'auth-button--full' : '';
  const loadingClass = loading ? 'auth-button--loading' : '';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        baseClasses,
        variantClasses,
        sizeClasses,
        fullWidthClass,
        loadingClass,
        className
      )}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <svg
          className="auth-button-spinner"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;