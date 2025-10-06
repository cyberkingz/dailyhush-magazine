import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

interface ButtonAsButton extends BaseButtonProps {
  as?: 'button';
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  to?: never;
  href?: never;
}

interface ButtonAsLink extends BaseButtonProps {
  as: 'link';
  to: string;
  type?: never;
  onClick?: never;
  href?: never;
}

interface ButtonAsAnchor extends BaseButtonProps {
  as: 'anchor';
  href: string;
  to?: never;
  type?: never;
  onClick?: never;
  target?: string;
  rel?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  as = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-yellow-400 text-black hover:bg-yellow-300 hover:text-black focus:ring-yellow-400 focus:text-black',
    secondary: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500',
    ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-neutral-300 text-gray-700 hover:bg-neutral-50 hover:border-neutral-400 focus:ring-amber-500 focus:border-amber-500'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-1',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2'
  };
  
  const fullWidthClass = fullWidth ? 'w-full' : '';
  
  const combinedClassName = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidthClass,
    className
  );

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z"/>
        </svg>
      )}
      {!loading && leftIcon && leftIcon}
      {children}
      {!loading && rightIcon && rightIcon}
    </>
  );

  if (as === 'link') {
    const { to, ...linkProps } = rest as ButtonAsLink;
    return (
      <Link
        to={to}
        className={combinedClassName}
        aria-label={ariaLabel}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  if (as === 'anchor') {
    const { href, target, rel, ...anchorProps } = rest as ButtonAsAnchor;
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClassName}
        aria-label={ariaLabel}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const { type = 'button', onClick, ...buttonProps } = rest as ButtonAsButton;
  
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
      className={combinedClassName}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      {...buttonProps}
    >
      {content}
    </button>
  );
};

export default Button;