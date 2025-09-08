import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { TwoFactorInputProps } from './types';
import { cn } from '../../lib/utils';

const TwoFactorInput: React.FC<TwoFactorInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  error,
  autoFocus = false,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const values = value.split('').slice(0, length);
  while (values.length < length) {
    values.push('');
  }

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    // Auto-advance to next empty field when value changes
    const nextEmptyIndex = values.findIndex(v => v === '');
    if (nextEmptyIndex !== -1 && nextEmptyIndex !== activeIndex) {
      setActiveIndex(nextEmptyIndex);
      inputRefs.current[nextEmptyIndex]?.focus();
    } else if (nextEmptyIndex === -1 && activeIndex < length - 1) {
      // All fields filled, stay on last field
      setActiveIndex(length - 1);
    }
  }, [value, activeIndex, values, length]);

  const handleChange = (index: number, newValue: string) => {
    // Only allow single digits or letters
    if (newValue.length > 1) return;
    if (newValue && !/^[0-9a-zA-Z]$/.test(newValue)) return;

    const newValues = [...values];
    newValues[index] = newValue.toUpperCase();
    
    const newCode = newValues.join('');
    onChange(newCode);

    // Move to next field if current field has value
    if (newValue && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!values[index] && index > 0) {
        // Move to previous field and clear it
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
        const newValues = [...values];
        newValues[index - 1] = '';
        onChange(newValues.join(''));
      } else if (values[index]) {
        // Clear current field
        const newValues = [...values];
        newValues[index] = '';
        onChange(newValues.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Delete') {
      // Clear current field
      const newValues = [...values];
      newValues[index] = '';
      onChange(newValues.join(''));
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const sanitized = pastedData.replace(/[^0-9a-zA-Z]/g, '').slice(0, length).toUpperCase();
    onChange(sanitized);
  };

  return (
    <div className={cn('auth-2fa-input-group', className)}>
      {values.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            'auth-2fa-input',
            {
              'border-error-500': error,
            }
          )}
          aria-label={`Verification code digit ${index + 1}`}
          aria-describedby={error ? 'auth-2fa-error' : undefined}
          maxLength={1}
        />
      ))}
      {error && (
        <div id="auth-2fa-error" className="auth-error-message w-full text-center mt-2" role="alert">
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
    </div>
  );
};

export default TwoFactorInput;