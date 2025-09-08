import React from 'react';
import { cn } from '../../lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  wide = false,
  className,
}) => {
  return (
    <div className="auth-container">
      <div className={cn(
        'auth-card',
        {
          'auth-card-wide': wide,
        },
        className
      )}>
        {children}
      </div>
    </div>
  );
};

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  className,
}) => {
  return (
    <div className={cn('auth-header', className)}>
      <h2 className="auth-title">{title}</h2>
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
    </div>
  );
};

export const AuthForm: React.FC<{ children: React.ReactNode; onSubmit?: (e: React.FormEvent) => void; className?: string }> = ({
  children,
  onSubmit,
  className,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('auth-form', className)} noValidate>
      {children}
    </form>
  );
};

export const AuthDivider: React.FC<{ text?: string; className?: string }> = ({
  text = 'or',
  className,
}) => {
  return (
    <div className={cn('auth-divider', className)} aria-hidden="true">
      <span className="auth-divider-text">{text}</span>
    </div>
  );
};

export const AuthFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('text-center text-sm space-y-2 mt-6', className)}>
      {children}
    </div>
  );
};

export const AuthLink: React.FC<{
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  muted?: boolean;
  className?: string;
}> = ({
  href,
  onClick,
  children,
  muted = false,
  className,
}) => {
  const classes = cn(
    'auth-link',
    {
      'auth-link--muted': muted,
    },
    className
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
};