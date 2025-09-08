# Authentication UI Design System

A comprehensive, accessible, and modern authentication component library built with React, TypeScript, and Tailwind CSS.

## 🎨 Design Philosophy

This authentication design system prioritizes:
- **Accessibility**: WCAG 2.1 AA compliance with proper ARIA labels, keyboard navigation, and screen reader support
- **User Experience**: Intuitive flows, clear feedback, and minimal friction
- **Visual Consistency**: Cohesive design language across all authentication touchpoints
- **Responsive Design**: Mobile-first approach that works seamlessly across all devices
- **Performance**: Optimized components with minimal bundle impact
- **Developer Experience**: Type-safe, well-documented, and easy to implement

## 📁 Project Structure

```
src/components/auth/
├── types.ts                    # TypeScript interfaces and types
├── Button.tsx                  # Button component with variants
├── InputField.tsx              # Input field with validation states
├── Alert.tsx                   # Alert/notification component
├── SocialButton.tsx            # Social authentication buttons
├── TwoFactorInput.tsx          # Two-factor authentication input
├── AuthCard.tsx                # Layout components (Card, Header, Form, etc.)
├── Progress.tsx                # Progress and step components
├── LoginPage.tsx               # Complete login page
├── RegisterPage.tsx            # Complete registration page
├── ForgotPasswordPage.tsx      # Forgot password page
├── ResetPasswordPage.tsx       # Reset password page
├── EmailVerificationPage.tsx   # Email verification page
├── TwoFactorAuthPage.tsx       # Two-factor authentication page
├── index.ts                    # Main export file
└── README.md                   # This file

src/styles/
├── auth-design-system.css      # Complete design system CSS
└── globals.css                 # Global styles with imports

tailwind.config.js              # Extended Tailwind configuration
```

## 🎯 Core Components

### Button Component

The button component supports multiple variants, sizes, and states:

```tsx
import { Button } from '../components/auth';

<Button 
  variant="primary"       // primary | secondary | ghost
  size="lg"               // sm | md | lg
  fullWidth={true}
  loading={isLoading}
  disabled={isDisabled}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  onClick={handleClick}
>
  Sign In
</Button>
```

**Features:**
- Three variants: primary, secondary, ghost
- Three sizes: small, medium, large
- Loading states with spinner
- Icon support (left and right)
- Full accessibility with proper ARIA attributes
- Keyboard navigation support

### InputField Component

A comprehensive input field with validation, icons, and accessibility:

```tsx
import { InputField } from '../components/auth';

<InputField
  type="email"
  label="Email Address"
  value={email}
  onChange={setEmail}
  error={emailError}
  success="Email is valid"
  hint="We'll never share your email"
  icon={<EmailIcon />}
  rightAddon={<VerifyButton />}
  validationState="valid"    // default | valid | invalid
  showPasswordToggle={true}  // for password fields
  required
  autoFocus
/>
```

**Features:**
- Multiple input types (text, email, password, tel, url)
- Built-in validation states and styling
- Password visibility toggle
- Icon support (left icon, right addon)
- Error, success, and hint messages
- Accessibility compliant with proper labeling
- Auto-focus capability

### Alert Component

Contextual alerts for feedback and notifications:

```tsx
import { Alert } from '../components/auth';

<Alert
  type="success"          // success | error | warning | info
  title="Success!"
  message="Your account has been created successfully."
  dismissible={true}
  onDismiss={handleDismiss}
  icon={<CustomIcon />}
/>
```

**Features:**
- Four types: success, error, warning, info
- Optional title and custom icons
- Dismissible with smooth animations
- Proper ARIA roles and live regions
- Automatic color coding and icons

### SocialButton Component

Pre-styled social authentication buttons:

```tsx
import { SocialButton } from '../components/auth';

<SocialButton
  provider="google"       // google | github | apple | microsoft | facebook | twitter
  onClick={handleSocialLogin}
  loading={isGoogleLoading}
  disabled={isDisabled}
/>
```

**Features:**
- Six popular providers with authentic branding
- Consistent styling across all providers
- Loading states
- Accessibility compliant
- SVG icons for crisp display at any size

### TwoFactorInput Component

Specialized input for two-factor authentication codes:

```tsx
import { TwoFactorInput } from '../components/auth';

<TwoFactorInput
  length={6}              // Number of digits
  value={code}
  onChange={setCode}
  error={codeError}
  disabled={isVerifying}
  autoFocus={true}
/>
```

**Features:**
- Configurable length (default: 6)
- Auto-advance between fields
- Paste support with automatic parsing
- Keyboard navigation (arrows, backspace, delete)
- Input validation (numbers/letters only)
- Error states and accessibility

## 📄 Complete Pages

### LoginPage

A complete, production-ready login page:

```tsx
import { LoginPage } from '../components/auth';

<LoginPage
  onSuccess={() => navigate('/dashboard')}
  redirectTo="/dashboard"
  className="custom-styling"
/>
```

**Features:**
- Email/password authentication
- Social login options (Google, GitHub)
- "Remember me" functionality
- "Forgot password" link
- Form validation with real-time feedback
- Loading states and error handling
- Responsive design

### RegisterPage

Multi-step registration with progressive disclosure:

```tsx
import { RegisterPage } from '../components/auth';

<RegisterPage
  onSuccess={() => navigate('/verify-email')}
  redirectTo="/verify-email"
/>
```

**Features:**
- Three-step registration process
- Progress indicator
- Password strength meter
- Real-time validation
- Social registration options
- Terms and conditions acceptance
- Marketing preferences

### ForgotPasswordPage

Password reset request with clear feedback:

```tsx
import { ForgotPasswordPage } from '../components/auth';

<ForgotPasswordPage
  onSuccess={() => setResetSent(true)}
/>
```

**Features:**
- Email validation
- Clear success states
- Resend functionality with cooldown
- Help text and instructions
- Error handling

### ResetPasswordPage

Secure password reset with token validation:

```tsx
import { ResetPasswordPage } from '../components/auth';

<ResetPasswordPage
  token={urlToken}
  onSuccess={() => navigate('/login')}
/>
```

**Features:**
- Token validation
- Password strength requirements
- Confirmation field matching
- Security messaging
- Error states for invalid/expired tokens

### EmailVerificationPage

Email verification with multiple states:

```tsx
import { EmailVerificationPage } from '../components/auth';

<EmailVerificationPage
  token={urlToken}
  email={userEmail}
  onSuccess={() => navigate('/dashboard')}
/>
```

**Features:**
- Automatic token verification
- Resend functionality
- Clear status indicators
- Error handling for expired/invalid tokens
- Help and support links

### TwoFactorAuthPage

Multi-method two-factor authentication:

```tsx
import { TwoFactorAuthPage } from '../components/auth';

<TwoFactorAuthPage
  method="2fa"          // 2fa | sms | email
  email={userEmail}
  onSuccess={() => navigate('/dashboard')}
/>
```

**Features:**
- Multiple 2FA methods (authenticator, SMS, email)
- Account lockout protection
- Alternative method switching
- Resend functionality for SMS/email
- Help and troubleshooting

## 🎨 Design System

### Color Palette

The design system uses a semantic color approach:

```css
/* Brand Colors */
--auth-primary: #0284c7;           /* Primary actions */
--auth-primary-hover: #0369a1;     /* Primary hover state */

/* Surface Colors */
--auth-surface-primary: #ffffff;    /* Main backgrounds */
--auth-surface-secondary: #f8fafc;  /* Secondary backgrounds */

/* Text Colors */
--auth-text-primary: #0f172a;      /* Main text */
--auth-text-secondary: #475569;     /* Secondary text */

/* Status Colors */
--auth-success: #16a34a;           /* Success states */
--auth-error: #dc2626;             /* Error states */
--auth-warning: #d97706;           /* Warning states */
--auth-info: #2563eb;              /* Info states */
```

### Typography Scale

Consistent typography with optimal line heights:

```css
/* Font Sizes */
--auth-font-size-xs: 0.75rem;     /* 12px */
--auth-font-size-sm: 0.875rem;    /* 14px */
--auth-font-size-base: 1rem;      /* 16px */
--auth-font-size-lg: 1.125rem;    /* 18px */
--auth-font-size-xl: 1.25rem;     /* 20px */
--auth-font-size-2xl: 1.5rem;     /* 24px */
--auth-font-size-3xl: 1.875rem;   /* 30px */
```

### Spacing System

8-point grid system for consistent spacing:

```css
--auth-space-xs: 0.25rem;  /* 4px */
--auth-space-sm: 0.5rem;   /* 8px */
--auth-space-md: 1rem;     /* 16px */
--auth-space-lg: 1.5rem;   /* 24px */
--auth-space-xl: 2rem;     /* 32px */
--auth-space-2xl: 3rem;    /* 48px */
```

### Animation Tokens

Consistent timing and easing:

```css
--auth-duration-fast: 150ms;
--auth-duration-normal: 300ms;
--auth-duration-slow: 500ms;
--auth-easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
```

## 📱 Responsive Design

### Breakpoints

The system uses a mobile-first approach:

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl)

### Responsive Patterns

```css
/* Mobile-first container */
.auth-container {
  @apply px-4 py-8;
}

/* Tablet adjustments */
@media (min-width: 640px) {
  .auth-container {
    @apply px-6 py-12;
  }
}

/* Desktop optimization */
@media (min-width: 1024px) {
  .auth-container {
    @apply px-8;
  }
}
```

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance

- **Color Contrast**: All text meets 4.5:1 contrast ratio minimum
- **Focus Management**: Visible focus indicators and logical tab order
- **Screen Reader Support**: Proper ARIA labels, roles, and live regions
- **Keyboard Navigation**: Full keyboard accessibility
- **Error Handling**: Clear error messages with proper associations

### Implementation Examples

```tsx
// Proper labeling
<InputField
  id="email"
  label="Email Address"
  aria-describedby="email-error email-hint"
  aria-invalid={hasError}
  required
/>

// Error announcements
<div id="email-error" role="alert" className="auth-error-message">
  {errorMessage}
</div>

// Button states
<Button
  aria-label="Sign in to your account"
  aria-disabled={loading}
  type="submit"
>
  {loading ? 'Signing in...' : 'Sign In'}
</Button>
```

## 🌙 Dark Mode Support

The system includes comprehensive dark mode support:

```css
[data-theme="dark"] {
  --auth-surface-primary: #0f172a;
  --auth-surface-secondary: #1e293b;
  --auth-text-primary: #f1f5f9;
  --auth-text-secondary: #cbd5e1;
}
```

Toggle dark mode:

```tsx
// Add to document
document.documentElement.setAttribute('data-theme', 'dark');

// Remove for light mode
document.documentElement.removeAttribute('data-theme');
```

## 🚀 Performance Optimizations

### Bundle Size

- **Tree-shakeable**: Import only what you need
- **Minimal dependencies**: Built with standard React and TypeScript
- **Optimized SVGs**: Inline SVG icons for best performance
- **CSS Variables**: Runtime theming without JavaScript

### Runtime Performance

- **Debounced Validation**: Reduces unnecessary re-renders
- **Memoized Components**: Prevents unnecessary updates
- **Lazy Loading**: Components load only when needed
- **GPU Acceleration**: Smooth animations using transforms

## 🔧 Installation & Setup

### 1. Install Dependencies

The authentication system requires these peer dependencies:

```bash
npm install react react-dom typescript
npm install -D tailwindcss postcss autoprefixer @types/react @types/react-dom
```

### 2. Configure Tailwind CSS

Update your `tailwind.config.js` with the provided configuration:

```javascript
// Use the complete configuration from this project
```

### 3. Import Styles

Add to your main CSS file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Authentication Design System */
@import './styles/auth-design-system.css';
```

### 4. Add Utility Function

Include the `cn` utility function in your utils:

```typescript
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

## 📖 Usage Examples

### Basic Login Implementation

```tsx
import React, { useState } from 'react';
import { LoginPage } from './components/auth';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = () => {
    // Handle successful login
    console.log('User logged in successfully');
    // Redirect or update app state
  };

  if (user) {
    return <Dashboard user={user} />;
  }

  return (
    <LoginPage 
      onSuccess={handleLoginSuccess}
      redirectTo="/dashboard"
    />
  );
}
```

### Custom Authentication Flow

```tsx
import React, { useState } from 'react';
import { 
  AuthCard, 
  AuthHeader, 
  AuthForm,
  InputField, 
  Button, 
  Alert 
} from './components/auth';

function CustomLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Your authentication logic
      await authenticate(formData);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader 
        title="Welcome Back" 
        subtitle="Sign in to your account" 
      />
      
      {error && (
        <Alert 
          type="error" 
          message={error}
          dismissible 
          onDismiss={() => setError('')} 
        />
      )}
      
      <AuthForm onSubmit={handleSubmit}>
        <InputField
          type="email"
          label="Email"
          value={formData.email}
          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          required
        />
        
        <InputField
          type="password"
          label="Password"
          value={formData.password}
          onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
          showPasswordToggle
          required
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          fullWidth
          loading={loading}
        >
          Sign In
        </Button>
      </AuthForm>
    </AuthCard>
  );
}
```

## 🎨 Customization

### Theme Customization

Override CSS custom properties to match your brand:

```css
:root {
  /* Override brand colors */
  --auth-primary: #your-primary-color;
  --auth-primary-hover: #your-primary-hover-color;
  
  /* Override typography */
  --auth-font-family: 'Your Font', sans-serif;
  
  /* Override spacing */
  --auth-space-md: 1.25rem; /* Custom spacing */
}
```

### Component Customization

```tsx
// Custom button styling
<Button 
  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
  variant="primary"
>
  Custom Gradient Button
</Button>

// Custom card styling
<AuthCard className="max-w-lg shadow-2xl border-2 border-purple-200">
  {/* Custom card content */}
</AuthCard>
```

## 🧪 Testing

### Component Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './components/auth';

test('button handles click events', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('input field shows validation errors', () => {
  render(
    <InputField 
      label="Email" 
      value="" 
      onChange={() => {}} 
      error="Email is required" 
    />
  );
  
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.getByText('Email is required')).toBeInTheDocument();
});
```

### Accessibility Testing

```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('login page is accessible', async () => {
  const { container } = render(<LoginPage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 📚 Best Practices

### Form Validation

- **Real-time validation**: Provide immediate feedback
- **Clear error messages**: Explain what went wrong and how to fix it
- **Accessible errors**: Use proper ARIA attributes and roles
- **Progressive enhancement**: Basic functionality works without JavaScript

### Security Considerations

- **Password visibility**: Toggle with proper ARIA announcements
- **Auto-complete attributes**: Proper autocomplete for password managers
- **CSRF protection**: Include CSRF tokens in forms
- **Rate limiting**: Implement on the backend
- **Input sanitization**: Always validate and sanitize inputs

### User Experience

- **Loading states**: Show progress for all async operations
- **Error recovery**: Provide clear paths to resolve errors
- **Mobile optimization**: Touch-friendly targets and inputs
- **Keyboard navigation**: Full keyboard accessibility
- **Clear feedback**: Success, error, and progress indicators

## 📝 Contributing

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Maintain accessibility standards
- Write comprehensive tests
- Document all props and methods

### Design Principles

- Maintain visual consistency
- Prioritize accessibility
- Optimize for performance
- Support all modern browsers
- Follow WCAG 2.1 AA guidelines

## 📄 License

This authentication design system is available under the MIT License.

## 🆘 Support

For questions, issues, or contributions:

1. Check the documentation above
2. Review component prop types in `types.ts`
3. Look at implementation examples in page components
4. Test accessibility with screen readers
5. Validate responsive design across devices

## 🚦 Status

✅ **Production Ready**: All components are fully tested and documented  
✅ **Accessible**: WCAG 2.1 AA compliant  
✅ **Responsive**: Mobile-first design  
✅ **Themeable**: Full dark mode support  
✅ **Type Safe**: Complete TypeScript coverage  
✅ **Performant**: Optimized for production use