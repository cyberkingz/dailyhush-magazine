/* Authentication Component Types & Interfaces - Admin Only */

// Common Types
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'tel' | 'url';
export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type ValidationState = 'default' | 'valid' | 'invalid';

// Admin Authentication Context
export interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (token: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

// Loading States
export interface LoadingState {
  login: boolean;
  resetPassword: boolean;
  updatePassword: boolean;
}

// Admin Page Props
export interface AuthPageProps {
  onSuccess?: () => void;
  redirectTo?: string;
  className?: string;
}

// Form Validation
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}