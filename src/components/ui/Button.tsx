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
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium',
    'transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    // Subtle liquid ripple on interaction
    'active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)]'
  );

  const variantClasses = {
    primary: cn(
      // Muted emerald glass - PRIMARY CTA ONLY
      'bg-emerald-500/85 text-white',
      'backdrop-blur-[16px] backdrop-saturate-[140%]',
      'border border-emerald-500/20',
      'shadow-[0_2px_4px_rgba(16,185,129,0.25),0_1px_0_0_rgba(255,255,255,0.15)_inset]',
      'rounded-[12px]',
      // Refined hover - delicate lift with muted emerald glow
      'hover:bg-emerald-500/95',
      'hover:shadow-[0_4px_8px_rgba(16,185,129,0.3),0_1px_0_0_rgba(255,255,255,0.18)_inset]',
      'hover:border-emerald-500/30',
      'hover:-translate-y-[1px] hover:scale-[1.005]',
      // Active - gentle press
      'active:translate-y-0 active:scale-[0.995]',
      // Focus - muted emerald ring
      'focus-visible:ring-emerald-500/40'
    ),
    secondary: cn(
      // Gray liquid glass - subtle presence
      'bg-[hsla(200,14%,78%,0.18)] text-white',
      'backdrop-blur-[16px] backdrop-saturate-[180%]',
      'border border-[hsla(200,18%,85%,0.14)]',
      'shadow-[0_1px_2px_-1px_rgba(31,45,61,0.04),0_1px_0_0_rgba(255,255,255,0.15)_inset]',
      'rounded-[12px]',
      // Hover - liquid rise
      'hover:bg-[hsla(200,12%,70%,0.22)]',
      'hover:shadow-[0_2px_4px_-2px_rgba(31,45,61,0.06),0_1px_0_0_rgba(255,255,255,0.15)_inset]',
      'hover:border-[hsla(200,16%,80%,0.18)]',
      'hover:-translate-y-[1px] hover:scale-[1.005]',
      // Active
      'active:translate-y-0 active:scale-[0.995]',
      // Focus
      'focus-visible:ring-white/25'
    ),
    ghost: cn(
      // Whisper glass - ultra-subtle
      'bg-[hsla(200,18%,92%,0.10)] text-white/90',
      'backdrop-blur-[8px] backdrop-saturate-[150%]',
      'border border-[hsla(200,20%,98%,0.06)]',
      'shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]',
      'rounded-[12px]',
      // Hover - barely visible rise
      'hover:bg-[hsla(200,16%,85%,0.14)]',
      'hover:shadow-[0_1px_2px_-1px_rgba(31,45,61,0.04)]',
      'hover:border-[hsla(200,18%,85%,0.14)]',
      'hover:-translate-y-[0.5px] hover:scale-[1.003]',
      // Active
      'active:translate-y-0 active:scale-[0.998]',
      // Focus
      'focus-visible:ring-white/20'
    ),
    outline: cn(
      // Outlined liquid glass
      'bg-[hsla(200,20%,98%,0.06)] text-white',
      'backdrop-blur-[8px] backdrop-saturate-[150%]',
      'border-[1.5px] border-[hsla(200,16%,80%,0.18)]',
      'shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]',
      'rounded-[12px]',
      // Hover - fill with liquid
      'hover:bg-[hsla(200,16%,85%,0.14)]',
      'hover:shadow-[0_1px_2px_-1px_rgba(31,45,61,0.04)]',
      'hover:border-[hsla(200,16%,80%,0.25)]',
      'hover:-translate-y-[1px] hover:scale-[1.005]',
      // Active
      'active:translate-y-0 active:scale-[0.995]',
      // Focus
      'focus-visible:ring-white/25'
    )
  };

  const sizeClasses = {
    // Refined, less chunky proportions
    sm: 'px-3 py-1.5 text-sm gap-1.5 h-[32px]',
    md: 'px-4 py-2 text-sm gap-2 h-[36px]',
    lg: 'px-5 py-2.5 text-base gap-2.5 h-[40px]'
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
