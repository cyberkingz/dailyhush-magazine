/* Authentication Component Types & Interfaces */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'tel' | 'url';
export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type ValidationState = 'default' | 'valid' | 'invalid';

export interface BaseInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

export interface InputFieldProps extends BaseInputProps {
  type: InputType;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  success?: string;
  hint?: string;
  icon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  validationState?: ValidationState;
  showPasswordToggle?: boolean;
}

export interface ButtonProps {
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

export interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  success?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

export interface SocialButtonProps {
  provider: 'google' | 'github' | 'apple' | 'microsoft' | 'facebook' | 'twitter';
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface AuthCardProps {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export interface TwoFactorInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
  className?: string;
}

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showPercentage?: boolean;
}

export interface StepProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
  currentStep: string;
  completedSteps: string[];
  className?: string;
}

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  passwordStrength?: boolean;
  confirmPassword?: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, additionalData?: any) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  updatePassword: (token: string, newPassword: string) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  clearError: () => void;
}

export interface LoadingState {
  login: boolean;
  register: boolean;
  resetPassword: boolean;
  verifyEmail: boolean;
  resendVerification: boolean;
  updatePassword: boolean;
  verify2FA: boolean;
  socialAuth: Record<string, boolean>;
}

export interface AuthPageProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}