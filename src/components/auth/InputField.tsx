import React, { useState, useCallback } from 'react';
import { InputFieldProps } from './types';
import { cn } from '../../lib/utils';

const InputField: React.FC<InputFieldProps> = ({
  type,
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  hint,
  icon,
  rightAddon,
  validationState = 'default',
  showPasswordToggle = false,
  id,
  name,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
  autoFocus = false,
  className,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const successId = `${inputId}-success`;
  const hintId = `${inputId}-hint`;

  const actualType = type === 'password' && showPassword ? 'text' : type;
  const hasError = validationState === 'invalid' || !!error;
  const hasSuccess = validationState === 'valid' || !!success;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const inputClasses = cn(
    'auth-input',
    {
      'auth-input--with-icon': !!icon,
      'auth-input--error': hasError,
      'auth-input--success': hasSuccess,
    },
    className
  );

  const containerClasses = cn(
    'auth-form-group',
    {
      'auth-field-invalid': hasError,
      'auth-field-valid': hasSuccess,
    }
  );

  const describedBy = [
    ariaDescribedBy,
    error ? errorId : null,
    success ? successId : null,
    hint ? hintId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn('auth-label', {
            'auth-label--required': required,
          })}
        >
          {label}
        </label>
      )}

      <div className="auth-input-group">
        {icon && (
          <div className="auth-input-icon" aria-hidden="true">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          name={name || inputId}
          type={actualType}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={inputClasses}
          aria-describedby={describedBy}
          aria-invalid={ariaInvalid || hasError}
          {...rest}
        />

        <div className="auth-input-addon">
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              className="auth-password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}
          {rightAddon}
        </div>
      </div>

      {hint && !error && !success && (
        <p id={hintId} className="text-sm text-neutral-500 mt-1">
          {hint}
        </p>
      )}

      {error && (
        <div id={errorId} className="auth-error-message" role="alert">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div id={successId} className="auth-success-message" role="status">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {success}
        </div>
      )}
    </div>
  );
};

export default InputField;