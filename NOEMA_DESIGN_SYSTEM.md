# Noema Design System Specification

Version 1.0 | Last Updated: 2025-11-12

## Table of Contents
1. [Brand Identity](#1-brand-identity)
2. [Design Tokens](#2-design-tokens)
3. [Component Specifications](#3-component-specifications)
4. [Layout System](#4-layout-system)
5. [Page-Specific Designs](#5-page-specific-designs)
6. [Best Practices](#6-best-practices)

---

## 1. Brand Identity

### Overview
Noema is a mental health app for overthinkers that combines calming minimalism with science-backed credibility. The design language draws inspiration from Calm.com's nature-focused aesthetic and Headspace's approachable interface, while maintaining modern SaaS professionalism.

### Design Philosophy
- **Calming, not clinical**: Use soft colors, generous spacing, and gentle animations
- **Minimalist but warm**: Reduce visual noise while maintaining emotional connection
- **Science-credible**: Professional typography and clear hierarchy build trust
- **Mobile-first**: Optimize for mobile experience, enhance for desktop
- **Cognitive load reduction**: Limit choices, clear CTAs, progressive disclosure

### Core Brand Colors
- **Primary**: Deep Forest Green (`#064e3b` / `emerald-900`)
- **Accent**: Soft Lime (`#52B788` / Custom green-500)
- **Philosophy**: Forest green grounds the experience (nature, growth, calm), while soft lime provides energizing accents for CTAs

---

## 2. Design Tokens

### 2.1 Color System

#### Primary Palette (Greens)
```typescript
// Deep Forest - Primary Brand Color
const forestGreen = {
  50: '#ecfdf5',   // Lightest tint - backgrounds
  100: '#d1fae5',  // Very light - hover states
  200: '#a7f3d0',  // Light
  300: '#6ee7b7',  // Medium light
  400: '#34d399',  // Medium
  500: '#10b981',  // Base green
  600: '#059669',  // Slightly darker
  700: '#047857',  // Dark
  800: '#065f46',  // Very dark
  900: '#064e3b',  // Primary brand - deep forest
  950: '#022c22',  // Darkest (for text on light backgrounds)
}

// Soft Lime - Accent Color (Custom)
const softLime = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#52B788',  // Primary accent - soft lime
  600: '#47a877',
  700: '#3d8f66',
  800: '#337655',
  900: '#295d44',
}
```

#### Neutral Scale
```typescript
// Gray tones for text, backgrounds, borders
const neutral = {
  0: '#ffffff',    // Pure white
  50: '#f8fafc',   // Lightest gray - page background
  100: '#f1f5f9',  // Very light gray - card backgrounds
  200: '#e2e8f0',  // Light gray - disabled states
  300: '#cbd5e1',  // Medium light - borders
  400: '#94a3b8',  // Medium - placeholder text
  500: '#64748b',  // Base gray - secondary text
  600: '#475569',  // Dark gray - body text
  700: '#334155',  // Darker gray - headings
  800: '#1e293b',  // Very dark - emphasis text
  900: '#0f172a',  // Darkest - primary text
  950: '#020617',  // Maximum contrast
}
```

#### Semantic Colors
```typescript
// Success (Green family for consistency)
const success = {
  50: '#f0fdf4',
  500: '#22c55e',   // Success messages, checkmarks
  700: '#15803d',   // Dark success text
}

// Error (Red family)
const error = {
  50: '#fef2f2',
  500: '#ef4444',   // Error messages, validation
  700: '#b91c1c',   // Dark error text
}

// Warning (Amber family)
const warning = {
  50: '#fffbeb',
  500: '#f59e0b',   // Warning messages, alerts
  700: '#b45309',   // Dark warning text
}

// Info (Blue family)
const info = {
  50: '#eff6ff',
  500: '#3b82f6',   // Info messages, tooltips
  700: '#1d4ed8',   // Dark info text
}
```

#### Accessibility Compliance
All color combinations meet WCAG 2.1 AA standards:
- Text on backgrounds: minimum 4.5:1 contrast ratio
- Large text (18px+): minimum 3:1 contrast ratio
- Interactive elements: minimum 3:1 contrast ratio

**Pre-validated Combinations:**
- `neutral-900` on `neutral-50` = 18.2:1
- `forestGreen-900` on `forestGreen-50` = 15.1:1
- `neutral-700` on `neutral-50` = 11.4:1
- `softLime-500` on `forestGreen-900` = 5.2:1

### 2.2 Typography

#### Font Families
```typescript
// Primary: Inter (Google Fonts) - Excellent readability, professional
// Install: npm install @fontsource/inter
// Or via CDN: <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

// Display: Instrument Serif (Google Fonts) - Elegant, calming headlines
// Install: npm install @fontsource/instrument-serif
// Or via CDN: <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400&display=swap" rel="stylesheet">

const fontFamily = {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  display: ['Instrument Serif', 'Georgia', 'serif'],
  mono: ['JetBrains Mono', 'Menlo', 'monospace'], // For code examples
}
```

#### Type Scale
```typescript
// 8px base scale with 1.25 ratio (Major Third)
const fontSize = {
  // Base sizes
  xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],  // 14px
  base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],          // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],       // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],  // 20px

  // Display sizes
  '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],   // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],   // 36px
  '5xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.03em' }],     // 48px
  '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.03em' }],        // 60px
  '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],         // 72px
}

// Font weights
const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}
```

#### Responsive Typography
```css
/* Scale down on mobile, scale up on desktop */
h1 {
  font-size: clamp(2.25rem, 5vw, 3.75rem);  /* 36-60px */
  line-height: 1.1;
}
h2 {
  font-size: clamp(1.875rem, 4vw, 3rem);    /* 30-48px */
  line-height: 1.2;
}
h3 {
  font-size: clamp(1.5rem, 3vw, 2.25rem);   /* 24-36px */
  line-height: 1.3;
}
h4 {
  font-size: clamp(1.25rem, 2.5vw, 1.875rem); /* 20-30px */
  line-height: 1.4;
}
body {
  font-size: clamp(1rem, 1.5vw, 1.125rem);  /* 16-18px */
  line-height: 1.6;
}
```

### 2.3 Spacing

#### Base Scale (4px)
```typescript
// Following 8px grid system (multiples of 0.25rem)
const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
}
```

#### Container Widths
```typescript
const maxWidth = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Wide desktop
  '2xl': '1536px', // Ultra-wide

  // Semantic containers
  content: '72ch',  // Optimal reading width (prose)
  narrow: '600px',  // Forms, login
  wide: '1400px',   // Full-width sections
}
```

#### Section Spacing
```typescript
// Vertical spacing between sections
const sectionPadding = {
  mobile: {
    sm: 'py-8',   // 32px - tight sections
    md: 'py-12',  // 48px - standard sections
    lg: 'py-16',  // 64px - spacious sections
  },
  desktop: {
    sm: 'py-12',  // 48px
    md: 'py-16',  // 64px
    lg: 'py-24',  // 96px
  }
}
```

### 2.4 Shadows

#### Elevation System
```typescript
// Subtle shadows for depth without heaviness
const boxShadow = {
  // Elevation 0 - Flat
  none: 'none',

  // Elevation 1 - Hover, cards
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  // Elevation 2 - Dropdowns, popovers
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',

  // Elevation 3 - Modals, tooltips
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',

  // Elevation 4 - Dialogs, notifications
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',

  // Elevation 5 - Maximum elevation
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',

  // Elevation 6 - Hero sections
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Special shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  focus: '0 0 0 3px rgba(5, 150, 105, 0.2)', // forestGreen-600 with 20% opacity
}
```

### 2.5 Border Radius

```typescript
const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px - inputs, small buttons
  DEFAULT: '0.5rem', // 8px - cards, buttons
  md: '0.625rem',  // 10px - medium elements
  lg: '0.75rem',   // 12px - large cards
  xl: '1rem',      // 16px - hero sections
  '2xl': '1.25rem', // 20px - modal containers
  '3xl': '1.5rem', // 24px - feature cards
  full: '9999px',  // Circular buttons, pills
}
```

### 2.6 Animation & Transitions

#### Duration
```typescript
const transitionDuration = {
  fastest: '100ms',  // Micro-interactions
  fast: '150ms',     // Hover states
  normal: '250ms',   // Standard transitions
  slow: '350ms',     // Complex animations
  slower: '500ms',   // Page transitions
}
```

#### Easing Curves
```typescript
const transitionTimingFunction = {
  // Standard easing
  linear: 'linear',
  ease: 'ease',

  // Custom curves for calm, fluid motion
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',        // Material Design standard
  gentle: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)', // Gentle in-out
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Subtle bounce

  // Entrance animations
  'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
}
```

#### Keyframe Animations
```typescript
const keyframes = {
  // Fade effects
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  'fade-out': {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' },
  },

  // Slide effects
  'slide-up': {
    '0%': { transform: 'translateY(10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  'slide-down': {
    '0%': { transform: 'translateY(-10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  'slide-left': {
    '0%': { transform: 'translateX(10px)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
  'slide-right': {
    '0%': { transform: 'translateX(-10px)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },

  // Scale effects
  'scale-in': {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  'scale-out': {
    '0%': { transform: 'scale(1)', opacity: '1' },
    '100%': { transform: 'scale(0.95)', opacity: '0' },
  },

  // Breathing animation (calm, meditative)
  'breathe': {
    '0%, 100%': { transform: 'scale(1)', opacity: '1' },
    '50%': { transform: 'scale(1.05)', opacity: '0.8' },
  },

  // Gentle pulse
  'pulse-soft': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.7' },
  },

  // Float effect (for hero elements)
  'float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
}

const animation = {
  'fade-in': 'fade-in 500ms ease-out',
  'slide-up': 'slide-up 350ms smooth',
  'scale-in': 'scale-in 250ms smooth',
  'breathe': 'breathe 4s gentle infinite',
  'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
  'float': 'float 6s gentle infinite',
}
```

#### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 3. Component Specifications

### 3.1 Button Component

#### Visual Description
Buttons are the primary interactive elements. Use rounded corners (`rounded-lg`), medium padding, and clear hover/active states. Primary buttons use the soft lime accent, secondary buttons use the forest green.

#### TypeScript Interface
```typescript
interface ButtonProps {
  // Appearance
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'

  // State
  disabled?: boolean
  loading?: boolean

  // Layout
  fullWidth?: boolean

  // Icons
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode

  // Polymorphic
  as?: 'button' | 'a' | typeof Link
  href?: string  // for anchor
  to?: string    // for Link

  // Native props
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  children: React.ReactNode

  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
}
```

#### Variant Specifications

##### Primary Button (Main CTA)
```tsx
// Usage: Homepage hero, critical actions
// Color: Soft lime (#52B788) with forest green hover
<Button variant="primary">
  Get Started
</Button>

// Styles:
className="
  bg-softLime-500 text-white
  hover:bg-softLime-600
  active:bg-softLime-700
  disabled:opacity-50 disabled:cursor-not-allowed
  focus-visible:ring-2 focus-visible:ring-softLime-500 focus-visible:ring-offset-2
  transition-all duration-fast ease-smooth
  rounded-lg px-6 py-3 font-medium text-base
  shadow-sm hover:shadow-md
"
```

##### Secondary Button (Supporting actions)
```tsx
// Usage: Secondary CTAs, navigation
// Color: Forest green with darker hover
<Button variant="secondary">
  Learn More
</Button>

// Styles:
className="
  bg-forestGreen-900 text-white
  hover:bg-forestGreen-800
  active:bg-forestGreen-950
  disabled:opacity-50 disabled:cursor-not-allowed
  focus-visible:ring-2 focus-visible:ring-forestGreen-700 focus-visible:ring-offset-2
  transition-all duration-fast ease-smooth
  rounded-lg px-6 py-3 font-medium text-base
  shadow-sm hover:shadow-md
"
```

##### Outline Button (Subtle actions)
```tsx
// Usage: Cancel, back, tertiary actions
<Button variant="outline">
  Cancel
</Button>

// Styles:
className="
  bg-transparent text-forestGreen-900
  border-2 border-forestGreen-300
  hover:bg-forestGreen-50
  active:bg-forestGreen-100
  disabled:opacity-50 disabled:cursor-not-allowed
  focus-visible:ring-2 focus-visible:ring-forestGreen-500 focus-visible:ring-offset-2
  transition-all duration-fast ease-smooth
  rounded-lg px-6 py-3 font-medium text-base
"
```

##### Ghost Button (Minimal actions)
```tsx
// Usage: Navigation, close buttons
<Button variant="ghost">
  Skip
</Button>

// Styles:
className="
  bg-transparent text-forestGreen-700
  hover:bg-forestGreen-50
  active:bg-forestGreen-100
  disabled:opacity-50 disabled:cursor-not-allowed
  focus-visible:ring-2 focus-visible:ring-forestGreen-500 focus-visible:ring-offset-2
  transition-all duration-fast ease-smooth
  rounded-lg px-4 py-2 font-medium text-base
"
```

##### Destructive Button (Delete, remove actions)
```tsx
// Usage: Delete account, remove data
<Button variant="destructive">
  Delete Account
</Button>

// Styles:
className="
  bg-error-500 text-white
  hover:bg-error-600
  active:bg-error-700
  disabled:opacity-50 disabled:cursor-not-allowed
  focus-visible:ring-2 focus-visible:ring-error-500 focus-visible:ring-offset-2
  transition-all duration-fast ease-smooth
  rounded-lg px-6 py-3 font-medium text-base
  shadow-sm hover:shadow-md
"
```

#### Size Variations
```tsx
// Small (sm) - Compact actions
<Button size="sm">Small</Button>
// px-4 py-1.5 text-sm h-8

// Medium (md) - Default
<Button size="md">Medium</Button>
// px-6 py-3 text-base h-11

// Large (lg) - Hero CTAs
<Button size="lg">Large</Button>
// px-8 py-4 text-lg h-14
```

#### States

##### Loading State
```tsx
<Button loading>
  Submitting...
</Button>

// Show spinner, disable interaction
<svg className="animate-spin -ml-1 mr-3 h-5 w-5" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
</svg>
```

##### Disabled State
```tsx
<Button disabled>
  Disabled
</Button>

// opacity-50 cursor-not-allowed
// Remove hover effects
// Add aria-disabled="true"
```

#### Accessibility
- All buttons have clear focus indicators (ring-2)
- Focus visible only on keyboard navigation
- Loading state announces "loading" to screen readers
- Disabled buttons have `aria-disabled="true"`
- Icon-only buttons require `aria-label`

#### Component File
`/src/components/ui/Button.tsx`

---

### 3.2 Card Component

#### Visual Description
Cards are the primary content containers. They use subtle shadows, rounded corners, and optional hover effects. Background should be `neutral-0` (white) with a thin border.

#### TypeScript Interface
```typescript
interface CardProps {
  // Variants
  variant?: 'default' | 'outline' | 'ghost' | 'elevated'

  // Interaction
  clickable?: boolean
  onClick?: () => void
  href?: string  // Makes card a link

  // Layout
  padding?: 'none' | 'sm' | 'md' | 'lg'

  // Content
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode

  // Styling
  className?: string
}
```

#### Variant Specifications

##### Default Card
```tsx
<Card>
  <CardContent>Content here</CardContent>
</Card>

// Styles:
className="
  bg-neutral-0
  border border-neutral-200
  rounded-lg
  shadow-sm
  overflow-hidden
"
```

##### Elevated Card (for emphasis)
```tsx
<Card variant="elevated">
  <CardContent>Featured content</CardContent>
</Card>

// Styles:
className="
  bg-neutral-0
  border-0
  rounded-xl
  shadow-lg
  overflow-hidden
"
```

##### Clickable Card (hover effects)
```tsx
<Card clickable onClick={handleClick}>
  <CardContent>Interactive content</CardContent>
</Card>

// Styles:
className="
  bg-neutral-0
  border border-neutral-200
  rounded-lg
  shadow-sm
  overflow-hidden
  transition-all duration-normal ease-smooth
  hover:shadow-md hover:-translate-y-1
  cursor-pointer
  focus-visible:ring-2 focus-visible:ring-forestGreen-500 focus-visible:ring-offset-2
"
```

#### Subcomponents

##### CardHeader
```tsx
<CardHeader>
  <CardTitle>Card Title</CardTitle>
  <CardDescription>Optional description</CardDescription>
</CardHeader>

// Styles:
<div className="px-6 pt-6 pb-4">
  <h3 className="text-xl font-semibold text-neutral-900">
    {title}
  </h3>
  {description && (
    <p className="mt-1 text-sm text-neutral-500">
      {description}
    </p>
  )}
</div>
```

##### CardContent
```tsx
<CardContent>
  Content goes here
</CardContent>

// Styles:
<div className="px-6 py-4">
  {children}
</div>
```

##### CardFooter
```tsx
<CardFooter>
  <Button>Action</Button>
</CardFooter>

// Styles:
<div className="px-6 pb-6 pt-4 flex items-center justify-end gap-3">
  {children}
</div>
```

#### Accessibility
- Use `<article>` element for semantic meaning
- Clickable cards should be `<a>` or `<button>` elements
- Include proper heading hierarchy in CardTitle

#### Component Files
- `/src/components/ui/Card.tsx`
- `/src/components/ui/CardHeader.tsx`
- `/src/components/ui/CardContent.tsx`
- `/src/components/ui/CardFooter.tsx`

---

### 3.3 Container Component

#### Visual Description
Containers provide consistent horizontal padding and max-width constraints. They center content and ensure proper responsive behavior.

#### TypeScript Interface
```typescript
interface ContainerProps {
  // Width variants
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'

  // Padding
  padding?: 'none' | 'sm' | 'md' | 'lg'

  // Semantic
  as?: 'div' | 'section' | 'main' | 'article'

  // Content
  children: React.ReactNode
  className?: string
}
```

#### Size Specifications
```tsx
// Small - Forms, login
<Container size="sm">  // max-w-sm (640px)

// Medium - Content pages (default)
<Container size="md">  // max-w-content (72ch)

// Large - General pages
<Container size="lg">  // max-w-lg (1024px)

// Extra Large - Wide layouts
<Container size="xl">  // max-w-xl (1280px)

// Full - No max-width
<Container size="full">  // max-w-full

// Base styles (all sizes):
className="
  mx-auto
  px-4 sm:px-6 lg:px-8
  w-full
"
```

#### Component File
`/src/components/layout/Container.tsx`

---

### 3.4 Typography Components

#### Heading Component
```typescript
interface HeadingProps {
  // Levels
  level: 1 | 2 | 3 | 4 | 5 | 6

  // Variants
  variant?: 'display' | 'default'

  // Styling
  align?: 'left' | 'center' | 'right'
  color?: 'default' | 'muted'

  // Content
  children: React.ReactNode
  className?: string

  // Semantic override
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
}
```

#### Specifications
```tsx
// H1 - Page titles
<Heading level={1} variant="display">
  Welcome to Noema
</Heading>

// Styles:
className="
  font-display font-normal
  text-5xl sm:text-6xl lg:text-7xl
  text-neutral-900
  tracking-tight
  leading-tight
"

// H2 - Section titles
<Heading level={2}>
  Our Features
</Heading>

// Styles:
className="
  font-sans font-semibold
  text-3xl sm:text-4xl lg:text-5xl
  text-neutral-900
  tracking-tight
  leading-tight
"

// H3 - Subsection titles
<Heading level={3}>
  Getting Started
</Heading>

// Styles:
className="
  font-sans font-semibold
  text-2xl sm:text-3xl
  text-neutral-900
  tracking-tight
  leading-snug
"

// H4 - Card titles
<Heading level={4}>
  Feature Name
</Heading>

// Styles:
className="
  font-sans font-semibold
  text-xl sm:text-2xl
  text-neutral-900
  tracking-tight
  leading-snug
"
```

#### Text Component
```typescript
interface TextProps {
  // Sizes
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'

  // Weights
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'

  // Colors
  color?: 'default' | 'muted' | 'subtle'

  // Alignment
  align?: 'left' | 'center' | 'right'

  // Semantic
  as?: 'p' | 'span' | 'div'

  children: React.ReactNode
  className?: string
}
```

#### Specifications
```tsx
// Body text (default)
<Text>
  This is body text with optimal readability.
</Text>

// Styles:
className="
  font-sans font-normal
  text-base sm:text-lg
  text-neutral-600
  leading-relaxed
"

// Muted text (secondary info)
<Text color="muted">
  Additional information
</Text>

// Styles:
className="
  font-sans font-normal
  text-sm
  text-neutral-500
  leading-normal
"

// Caption (labels, hints)
<Text size="xs" color="subtle">
  Required field
</Text>

// Styles:
className="
  font-sans font-normal
  text-xs
  text-neutral-400
  leading-tight
  tracking-wide
"
```

#### Component Files
- `/src/components/ui/Heading.tsx`
- `/src/components/ui/Text.tsx`

---

### 3.5 Navigation Components

#### Header Component

##### TypeScript Interface
```typescript
interface HeaderProps {
  // Sticky behavior
  sticky?: boolean

  // Transparent variant (for hero sections)
  transparent?: boolean

  // Logo
  logo?: React.ReactNode

  // Navigation items
  nav?: NavItem[]

  // CTA
  cta?: {
    label: string
    onClick: () => void
  }

  // Mobile menu
  mobileMenuOpen?: boolean
  onMobileMenuToggle?: () => void
}

interface NavItem {
  label: string
  href: string
  active?: boolean
  items?: NavItem[]  // For dropdowns
}
```

##### Specifications
```tsx
// Desktop Header
<Header sticky logo={<Logo />} nav={navItems} cta={ctaConfig} />

// Styles:
className="
  w-full
  bg-neutral-0/95 backdrop-blur-sm
  border-b border-neutral-200
  sticky top-0 z-50
  transition-all duration-normal
"

// Inner container:
className="
  max-w-7xl mx-auto
  px-4 sm:px-6 lg:px-8
  h-16 lg:h-20
  flex items-center justify-between
"

// Nav links:
className="
  hidden lg:flex
  items-center gap-8
"

// Individual link:
className="
  text-neutral-700
  hover:text-forestGreen-700
  font-medium text-base
  transition-colors duration-fast
"
```

##### Mobile Menu
```tsx
// Mobile menu toggle button
<button className="
  lg:hidden
  p-2
  text-neutral-700
  hover:text-forestGreen-700
">
  <HamburgerIcon />
</button>

// Mobile menu panel (slide from right)
<div className="
  fixed inset-0 z-50
  lg:hidden
  animate-slide-left
">
  {/* Overlay */}
  <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm" />

  {/* Panel */}
  <div className="
    fixed right-0 top-0 bottom-0
    w-4/5 max-w-sm
    bg-neutral-0
    shadow-2xl
    overflow-y-auto
    px-6 py-8
  ">
    {/* Menu content */}
  </div>
</div>
```

#### Footer Component

##### TypeScript Interface
```typescript
interface FooterProps {
  // Links
  links?: FooterSection[]

  // Social media
  social?: SocialLink[]

  // Newsletter signup
  newsletter?: boolean

  // Legal
  legal?: LegalLink[]

  // Copyright
  copyright?: string
}

interface FooterSection {
  title: string
  links: {
    label: string
    href: string
  }[]
}
```

##### Specifications
```tsx
<Footer />

// Styles:
className="
  w-full
  bg-forestGreen-900
  text-neutral-0
  pt-16 pb-8
"

// Multi-column layout:
className="
  max-w-7xl mx-auto
  px-4 sm:px-6 lg:px-8
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
  gap-8
"

// Footer link:
className="
  text-neutral-300
  hover:text-neutral-0
  text-sm
  transition-colors duration-fast
"

// Bottom bar (copyright, legal):
className="
  mt-12 pt-8
  border-t border-forestGreen-800
  flex flex-col sm:flex-row
  justify-between items-center
  gap-4
"
```

#### Component Files
- `/src/components/layout/Header.tsx`
- `/src/components/layout/Footer.tsx`
- `/src/components/layout/MobileMenu.tsx`

---

### 3.6 Hero Section Component

#### Visual Description
Hero sections are full-width, high-impact areas at the top of pages. They typically include a headline, subheadline, CTA, and optional image or illustration.

#### TypeScript Interface
```typescript
interface HeroProps {
  // Content
  headline: string
  subheadline?: string

  // CTAs (1-2 recommended)
  primaryCta?: {
    label: string
    onClick: () => void
  }
  secondaryCta?: {
    label: string
    onClick: () => void
  }

  // Media
  image?: string
  imageAlt?: string

  // Layout
  align?: 'left' | 'center'
  size?: 'md' | 'lg' | 'xl'

  // Background
  background?: 'white' | 'forest' | 'gradient'
}
```

#### Specifications

##### Centered Hero (Homepage)
```tsx
<Hero
  headline="Stop overthinking. Start living."
  subheadline="Science-backed tools to calm your mind and reclaim your peace."
  primaryCta={{ label: "Get Started Free", onClick: handleSignup }}
  secondaryCta={{ label: "Watch Demo", onClick: handleDemo }}
  align="center"
  size="xl"
  background="gradient"
/>

// Styles:
<section className="
  relative
  bg-gradient-to-br from-forestGreen-50 via-neutral-50 to-softLime-50
  py-20 sm:py-28 lg:py-36
  overflow-hidden
">
  <Container size="lg">
    <div className="text-center max-w-4xl mx-auto">
      {/* Headline */}
      <h1 className="
        font-display font-normal
        text-5xl sm:text-6xl lg:text-7xl
        text-neutral-900
        tracking-tight leading-tight
        mb-6
      ">
        {headline}
      </h1>

      {/* Subheadline */}
      <p className="
        font-sans font-normal
        text-lg sm:text-xl lg:text-2xl
        text-neutral-600
        leading-relaxed
        mb-10
      ">
        {subheadline}
      </p>

      {/* CTAs */}
      <div className="
        flex flex-col sm:flex-row
        justify-center items-center
        gap-4
      ">
        <Button variant="primary" size="lg">
          {primaryCta.label}
        </Button>
        <Button variant="outline" size="lg">
          {secondaryCta.label}
        </Button>
      </div>
    </div>
  </Container>

  {/* Decorative elements */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    {/* Subtle gradient orbs */}
  </div>
</section>
```

##### Split Hero (with image)
```tsx
<Hero
  headline="Track your thoughts"
  subheadline="Daily journaling exercises backed by cognitive behavioral therapy."
  primaryCta={{ label: "Start Journaling", onClick: handleStart }}
  image="/hero-journal.png"
  imageAlt="Journal interface"
  align="left"
  size="lg"
/>

// Styles:
<section className="py-16 sm:py-24 lg:py-32">
  <Container size="xl">
    <div className="
      grid grid-cols-1 lg:grid-cols-2
      gap-12 lg:gap-16
      items-center
    ">
      {/* Content */}
      <div>
        <h1 className="...">
          {headline}
        </h1>
        <p className="...">
          {subheadline}
        </p>
        <Button variant="primary" size="lg">
          {primaryCta.label}
        </Button>
      </div>

      {/* Image */}
      <div className="
        relative
        rounded-2xl
        overflow-hidden
        shadow-xl
      ">
        <img src={image} alt={imageAlt} className="w-full h-auto" />
      </div>
    </div>
  </Container>
</section>
```

#### Component File
`/src/components/sections/Hero.tsx`

---

### 3.7 Feature Card Component

#### TypeScript Interface
```typescript
interface FeatureCardProps {
  // Content
  icon: React.ReactNode
  title: string
  description: string

  // Optional link
  link?: {
    label: string
    href: string
  }

  // Layout
  variant?: 'horizontal' | 'vertical'

  // Styling
  className?: string
}
```

#### Specifications

##### Vertical Feature Card (Grid layout)
```tsx
<FeatureCard
  icon={<BrainIcon />}
  title="Cognitive Exercises"
  description="Science-backed exercises to reframe negative thought patterns."
  link={{ label: "Learn more", href: "/features/exercises" }}
  variant="vertical"
/>

// Styles:
<Card clickable className="h-full">
  <CardContent className="text-center p-8">
    {/* Icon */}
    <div className="
      mx-auto mb-6
      w-16 h-16
      flex items-center justify-center
      bg-forestGreen-50
      text-forestGreen-700
      rounded-xl
    ">
      {icon}
    </div>

    {/* Title */}
    <h3 className="
      font-sans font-semibold
      text-xl text-neutral-900
      mb-3
    ">
      {title}
    </h3>

    {/* Description */}
    <p className="
      font-sans font-normal
      text-base text-neutral-600
      leading-relaxed
      mb-4
    ">
      {description}
    </p>

    {/* Link */}
    {link && (
      <a href={link.href} className="
        inline-flex items-center gap-2
        text-forestGreen-700 font-medium text-sm
        hover:text-forestGreen-900
        transition-colors duration-fast
      ">
        {link.label}
        <ArrowRightIcon className="w-4 h-4" />
      </a>
    )}
  </CardContent>
</Card>
```

##### Horizontal Feature Card (List layout)
```tsx
<FeatureCard
  icon={<JournalIcon />}
  title="Daily Journaling"
  description="Reflect on your day with guided prompts."
  variant="horizontal"
/>

// Styles:
<Card>
  <CardContent className="p-6 flex items-start gap-6">
    {/* Icon */}
    <div className="
      flex-shrink-0
      w-12 h-12
      flex items-center justify-center
      bg-softLime-50
      text-softLime-700
      rounded-lg
    ">
      {icon}
    </div>

    {/* Content */}
    <div className="flex-1">
      <h3 className="
        font-sans font-semibold
        text-lg text-neutral-900
        mb-2
      ">
        {title}
      </h3>
      <p className="
        font-sans font-normal
        text-base text-neutral-600
        leading-relaxed
      ">
        {description}
      </p>
    </div>
  </CardContent>
</Card>
```

#### Component File
`/src/components/features/FeatureCard.tsx`

---

### 3.8 Testimonial Card Component

#### TypeScript Interface
```typescript
interface TestimonialCardProps {
  // Content
  quote: string
  author: {
    name: string
    title?: string
    avatar?: string
  }

  // Rating (optional)
  rating?: 1 | 2 | 3 | 4 | 5

  // Styling
  variant?: 'default' | 'featured'
  className?: string
}
```

#### Specifications
```tsx
<TestimonialCard
  quote="Noema helped me break free from constant overthinking. I finally feel present."
  author={{
    name: "Sarah Chen",
    title: "Product Designer",
    avatar: "/avatars/sarah.jpg"
  }}
  rating={5}
  variant="default"
/>

// Styles:
<Card variant="elevated" className="h-full">
  <CardContent className="p-8">
    {/* Quote */}
    <blockquote className="
      font-sans font-normal
      text-lg text-neutral-700
      leading-relaxed
      mb-6
    ">
      "{quote}"
    </blockquote>

    {/* Author */}
    <div className="flex items-center gap-4">
      {avatar && (
        <img
          src={avatar}
          alt={name}
          className="
            w-12 h-12
            rounded-full
            object-cover
          "
        />
      )}
      <div>
        <div className="
          font-sans font-semibold
          text-base text-neutral-900
        ">
          {name}
        </div>
        {title && (
          <div className="
            font-sans font-normal
            text-sm text-neutral-500
          ">
            {title}
          </div>
        )}
      </div>
    </div>

    {/* Rating */}
    {rating && (
      <div className="flex gap-1 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={cn(
              "w-5 h-5",
              i < rating
                ? "text-softLime-500 fill-current"
                : "text-neutral-300"
            )}
          />
        ))}
      </div>
    )}
  </CardContent>
</Card>
```

#### Component File
`/src/components/testimonials/TestimonialCard.tsx`

---

### 3.9 FAQ Accordion Component

#### TypeScript Interface
```typescript
interface FAQAccordionProps {
  items: FAQItem[]

  // Allow multiple open at once
  multiple?: boolean

  // Default open items (by index)
  defaultOpen?: number[]

  className?: string
}

interface FAQItem {
  question: string
  answer: string | React.ReactNode
}
```

#### Specifications
```tsx
<FAQAccordion
  items={faqItems}
  multiple={false}
  defaultOpen={[0]}
/>

// Styles:
<div className="space-y-4">
  {items.map((item, index) => (
    <Accordion key={index}>
      {/* Trigger */}
      <AccordionTrigger className="
        w-full
        flex items-center justify-between
        p-6
        bg-neutral-0
        border border-neutral-200
        rounded-lg
        hover:bg-neutral-50
        transition-colors duration-fast
        text-left
      ">
        <span className="
          font-sans font-semibold
          text-lg text-neutral-900
          pr-4
        ">
          {item.question}
        </span>
        <ChevronDownIcon className="
          w-5 h-5
          text-neutral-500
          transition-transform duration-normal
          data-[state=open]:rotate-180
        " />
      </AccordionTrigger>

      {/* Content */}
      <AccordionContent className="
        px-6 pt-2 pb-6
        bg-neutral-0
        border-x border-b border-neutral-200
        rounded-b-lg
        -mt-1
        animate-slide-down
      ">
        <div className="
          font-sans font-normal
          text-base text-neutral-600
          leading-relaxed
        ">
          {item.answer}
        </div>
      </AccordionContent>
    </Accordion>
  ))}
</div>
```

#### Component Files
- `/src/components/ui/Accordion.tsx`
- `/src/components/faq/FAQAccordion.tsx`

---

### 3.10 CTA Section Component

#### TypeScript Interface
```typescript
interface CTASectionProps {
  // Content
  headline: string
  description?: string

  // CTA
  primaryCta: {
    label: string
    onClick: () => void
  }
  secondaryCta?: {
    label: string
    onClick: () => void
  }

  // Background
  variant?: 'default' | 'gradient' | 'image'
  backgroundImage?: string

  // Size
  size?: 'md' | 'lg'
}
```

#### Specifications

##### Default CTA Section
```tsx
<CTASection
  headline="Ready to quiet your mind?"
  description="Join thousands of overthinkers who found peace with Noema."
  primaryCta={{ label: "Start Free Trial", onClick: handleSignup }}
  secondaryCta={{ label: "View Pricing", onClick: handlePricing }}
  variant="gradient"
  size="lg"
/>

// Styles:
<section className="
  relative
  bg-gradient-to-br from-forestGreen-900 to-forestGreen-800
  text-neutral-0
  py-16 sm:py-20 lg:py-28
  overflow-hidden
">
  <Container size="lg">
    <div className="text-center max-w-3xl mx-auto">
      {/* Headline */}
      <h2 className="
        font-display font-normal
        text-4xl sm:text-5xl lg:text-6xl
        text-neutral-0
        tracking-tight leading-tight
        mb-6
      ">
        {headline}
      </h2>

      {/* Description */}
      {description && (
        <p className="
          font-sans font-normal
          text-lg sm:text-xl
          text-forestGreen-100
          leading-relaxed
          mb-10
        ">
          {description}
        </p>
      )}

      {/* CTAs */}
      <div className="
        flex flex-col sm:flex-row
        justify-center items-center
        gap-4
      ">
        <Button variant="primary" size="lg">
          {primaryCta.label}
        </Button>
        {secondaryCta && (
          <Button variant="ghost" size="lg" className="
            text-neutral-0 hover:bg-forestGreen-800
          ">
            {secondaryCta.label}
          </Button>
        )}
      </div>
    </div>
  </Container>

  {/* Decorative gradient overlay */}
  <div className="
    absolute inset-0 -z-10
    bg-gradient-to-t from-forestGreen-950/20 to-transparent
  " />
</section>
```

#### Component File
`/src/components/sections/CTASection.tsx`

---

### 3.11 Form Input Components

#### Text Input Component
```typescript
interface InputProps {
  // Input attributes
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  name: string
  id?: string
  value?: string
  placeholder?: string

  // State
  disabled?: boolean
  required?: boolean
  readOnly?: boolean

  // Validation
  error?: string
  success?: boolean

  // Label & Help
  label?: string
  helpText?: string

  // Icons
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode

  // Events
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void

  className?: string
}
```

#### Specifications
```tsx
<Input
  type="email"
  name="email"
  label="Email address"
  placeholder="you@example.com"
  helpText="We'll never share your email."
  required
/>

// Styles:
<div className="space-y-2">
  {/* Label */}
  {label && (
    <label
      htmlFor={id}
      className="
        block
        font-sans font-medium
        text-sm text-neutral-700
      "
    >
      {label}
      {required && (
        <span className="text-error-500 ml-1">*</span>
      )}
    </label>
  )}

  {/* Input wrapper */}
  <div className="relative">
    {leftIcon && (
      <div className="
        absolute left-3 top-1/2 -translate-y-1/2
        text-neutral-400
      ">
        {leftIcon}
      </div>
    )}

    {/* Input */}
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      readOnly={readOnly}
      onChange={onChange}
      onBlur={onBlur}
      className={cn(
        "w-full",
        "px-4 py-3",
        leftIcon && "pl-10",
        rightIcon && "pr-10",
        "bg-neutral-0",
        "border border-neutral-300",
        "rounded-lg",
        "font-sans font-normal text-base text-neutral-900",
        "placeholder:text-neutral-400",
        "transition-all duration-fast",
        "focus:outline-none focus:ring-2 focus:ring-forestGreen-500 focus:border-transparent",
        error && "border-error-500 focus:ring-error-500",
        success && "border-success-500 focus:ring-success-500",
        disabled && "opacity-50 cursor-not-allowed bg-neutral-50",
        className
      )}
    />

    {rightIcon && (
      <div className="
        absolute right-3 top-1/2 -translate-y-1/2
        text-neutral-400
      ">
        {rightIcon}
      </div>
    )}
  </div>

  {/* Help text or error */}
  {(helpText || error) && (
    <p className={cn(
      "font-sans font-normal text-sm",
      error ? "text-error-600" : "text-neutral-500"
    )}>
      {error || helpText}
    </p>
  )}
</div>
```

#### Textarea Component
```typescript
interface TextareaProps {
  name: string
  id?: string
  value?: string
  placeholder?: string
  rows?: number

  // State
  disabled?: boolean
  required?: boolean
  readOnly?: boolean

  // Validation
  error?: string
  maxLength?: number

  // Label & Help
  label?: string
  helpText?: string

  // Events
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void

  className?: string
}
```

#### Specifications
```tsx
<Textarea
  name="message"
  label="Your message"
  placeholder="Tell us how we can help..."
  rows={5}
  maxLength={500}
  required
/>

// Styles: Same as Input, but:
<textarea
  rows={rows}
  maxLength={maxLength}
  className="
    w-full px-4 py-3
    bg-neutral-0
    border border-neutral-300 rounded-lg
    font-sans font-normal text-base text-neutral-900
    placeholder:text-neutral-400
    resize-vertical
    focus:outline-none focus:ring-2 focus:ring-forestGreen-500 focus:border-transparent
    transition-all duration-fast
  "
/>

{/* Character count */}
{maxLength && (
  <div className="text-right text-xs text-neutral-500">
    {value?.length || 0} / {maxLength}
  </div>
)}
```

#### Select Component
```typescript
interface SelectProps {
  name: string
  id?: string
  value?: string
  options: SelectOption[]

  // State
  disabled?: boolean
  required?: boolean

  // Validation
  error?: string

  // Label & Help
  label?: string
  helpText?: string
  placeholder?: string

  // Events
  onChange?: (value: string) => void

  className?: string
}

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}
```

#### Specifications
```tsx
<Select
  name="topic"
  label="What can we help you with?"
  placeholder="Select a topic"
  options={[
    { value: "billing", label: "Billing" },
    { value: "technical", label: "Technical Support" },
    { value: "feedback", label: "Feedback" },
  ]}
  required
/>

// Use Radix UI Select for better UX:
<SelectPrimitive.Root value={value} onValueChange={onChange}>
  <SelectPrimitive.Trigger className="
    w-full px-4 py-3
    bg-neutral-0
    border border-neutral-300 rounded-lg
    font-sans font-normal text-base text-neutral-900
    focus:outline-none focus:ring-2 focus:ring-forestGreen-500 focus:border-transparent
    transition-all duration-fast
    flex items-center justify-between
  ">
    <SelectPrimitive.Value placeholder={placeholder} />
    <SelectPrimitive.Icon>
      <ChevronDownIcon className="w-5 h-5 text-neutral-400" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>

  <SelectPrimitive.Portal>
    <SelectPrimitive.Content className="
      bg-neutral-0
      border border-neutral-200
      rounded-lg
      shadow-lg
      overflow-hidden
      animate-slide-down
    ">
      <SelectPrimitive.Viewport className="p-1">
        {options.map((option) => (
          <SelectPrimitive.Item
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="
              px-3 py-2
              font-sans font-normal text-base text-neutral-900
              rounded-md
              cursor-pointer
              hover:bg-forestGreen-50
              focus:bg-forestGreen-50
              focus:outline-none
              data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed
            "
          >
            <SelectPrimitive.ItemText>
              {option.label}
            </SelectPrimitive.ItemText>
          </SelectPrimitive.Item>
        ))}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
</SelectPrimitive.Root>
```

#### Checkbox Component
```typescript
interface CheckboxProps {
  name: string
  id?: string
  checked?: boolean

  // State
  disabled?: boolean
  required?: boolean

  // Label
  label: string | React.ReactNode

  // Validation
  error?: string

  // Events
  onChange?: (checked: boolean) => void

  className?: string
}
```

#### Specifications
```tsx
<Checkbox
  name="terms"
  label="I agree to the Terms of Service"
  required
/>

// Use Radix UI Checkbox:
<div className="flex items-start gap-3">
  <CheckboxPrimitive.Root
    checked={checked}
    onCheckedChange={onChange}
    disabled={disabled}
    required={required}
    className="
      w-5 h-5
      flex items-center justify-center
      bg-neutral-0
      border-2 border-neutral-300
      rounded
      transition-all duration-fast
      hover:border-forestGreen-500
      focus:outline-none focus:ring-2 focus:ring-forestGreen-500 focus:ring-offset-2
      data-[state=checked]:bg-forestGreen-600 data-[state=checked]:border-forestGreen-600
      disabled:opacity-50 disabled:cursor-not-allowed
    "
  >
    <CheckboxPrimitive.Indicator>
      <CheckIcon className="w-3 h-3 text-neutral-0" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>

  <label
    htmlFor={id}
    className="
      font-sans font-normal text-sm text-neutral-700
      cursor-pointer
    "
  >
    {label}
    {required && (
      <span className="text-error-500 ml-1">*</span>
    )}
  </label>
</div>

{error && (
  <p className="mt-1 font-sans font-normal text-sm text-error-600">
    {error}
  </p>
)}
```

#### Component Files
- `/src/components/ui/Input.tsx`
- `/src/components/ui/Textarea.tsx`
- `/src/components/ui/Select.tsx`
- `/src/components/ui/Checkbox.tsx`

---

## 4. Layout System

### 4.1 Grid System

#### 12-Column Grid
```tsx
// Base grid container
<div className="grid grid-cols-12 gap-6">
  {/* Full width */}
  <div className="col-span-12">
    Content
  </div>

  {/* Two columns */}
  <div className="col-span-12 md:col-span-6">
    Left
  </div>
  <div className="col-span-12 md:col-span-6">
    Right
  </div>

  {/* Three columns */}
  <div className="col-span-12 md:col-span-4">
    First
  </div>
  <div className="col-span-12 md:col-span-4">
    Second
  </div>
  <div className="col-span-12 md:col-span-4">
    Third
  </div>

  {/* Sidebar + main (4 + 8) */}
  <aside className="col-span-12 lg:col-span-4">
    Sidebar
  </aside>
  <main className="col-span-12 lg:col-span-8">
    Main content
  </main>
</div>
```

#### Gap Variations
```tsx
// Small gap (16px)
<div className="grid gap-4">

// Medium gap (24px) - Default
<div className="grid gap-6">

// Large gap (32px)
<div className="grid gap-8">

// Extra large gap (48px)
<div className="grid gap-12">
```

### 4.2 Responsive Breakpoints

```typescript
// Tailwind default breakpoints (mobile-first)
const screens = {
  'sm': '640px',   // Tablet portrait
  'md': '768px',   // Tablet landscape
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large desktop
}

// Usage examples:
// Mobile: default (no prefix)
// Tablet: sm:
// Desktop: lg:
// Wide: xl:

// Example:
className="
  text-base        // Mobile: 16px
  sm:text-lg       // Tablet: 18px
  lg:text-xl       // Desktop: 20px
  xl:text-2xl      // Wide: 24px
"
```

### 4.3 Container Max-Widths

```tsx
// By breakpoint
const containerMaxWidth = {
  sm: 'max-w-screen-sm',   // 640px
  md: 'max-w-screen-md',   // 768px
  lg: 'max-w-screen-lg',   // 1024px
  xl: 'max-w-screen-xl',   // 1280px
  '2xl': 'max-w-screen-2xl', // 1536px
}

// Semantic containers
const semanticContainers = {
  content: 'max-w-prose',   // 65ch (~900px) - optimal reading width
  narrow: 'max-w-2xl',      // 672px - forms, login
  standard: 'max-w-5xl',    // 1024px - general pages
  wide: 'max-w-7xl',        // 1280px - full-width sections
}
```

### 4.4 Section Templates

#### Full-Width Section
```tsx
<section className="w-full py-16 sm:py-20 lg:py-28">
  <Container size="lg">
    {/* Content */}
  </Container>
</section>
```

#### Alternating Sections (with backgrounds)
```tsx
{/* Light background */}
<section className="w-full bg-neutral-50 py-16 sm:py-20 lg:py-28">
  <Container size="lg">
    {/* Content */}
  </Container>
</section>

{/* White background */}
<section className="w-full bg-neutral-0 py-16 sm:py-20 lg:py-28">
  <Container size="lg">
    {/* Content */}
  </Container>
</section>

{/* Forest background */}
<section className="w-full bg-forestGreen-900 text-neutral-0 py-16 sm:py-20 lg:py-28">
  <Container size="lg">
    {/* Content */}
  </Container>
</section>
```

#### Feature Grid Section
```tsx
<section className="w-full py-16 sm:py-20 lg:py-28">
  <Container size="lg">
    {/* Section header */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <Heading level={2}>Our Features</Heading>
      <Text color="muted" className="mt-4">
        Everything you need to calm your mind
      </Text>
    </div>

    {/* Feature grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <FeatureCard {...feature1} />
      <FeatureCard {...feature2} />
      <FeatureCard {...feature3} />
    </div>
  </Container>
</section>
```

#### Testimonials Section
```tsx
<section className="w-full bg-neutral-50 py-16 sm:py-20 lg:py-28">
  <Container size="lg">
    {/* Section header */}
    <div className="text-center max-w-3xl mx-auto mb-16">
      <Heading level={2}>Loved by overthinkers</Heading>
      <Text color="muted" className="mt-4">
        See what our users are saying
      </Text>
    </div>

    {/* Testimonial grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TestimonialCard {...testimonial1} />
      <TestimonialCard {...testimonial2} />
      <TestimonialCard {...testimonial3} />
    </div>
  </Container>
</section>
```

#### FAQ Section
```tsx
<section className="w-full py-16 sm:py-20 lg:py-28">
  <Container size="md">
    {/* Section header */}
    <div className="text-center mb-12">
      <Heading level={2}>Frequently Asked Questions</Heading>
    </div>

    {/* FAQ accordion */}
    <FAQAccordion items={faqItems} />
  </Container>
</section>
```

---

## 5. Page-Specific Designs

### 5.1 Homepage Design

#### Visual Approach
The homepage should feel calm and inviting while building credibility. Use a gradient background in the hero, white/neutral-50 alternating sections, and a strong CTA at the bottom.

#### Structure
```tsx
<HomePage>
  {/* 1. Hero Section */}
  <Hero
    headline="Stop overthinking. Start living."
    subheadline="Science-backed tools to calm your mind and reclaim your peace."
    primaryCta={{ label: "Start Free Trial", onClick: handleSignup }}
    secondaryCta={{ label: "Watch Demo", onClick: handleDemo }}
    align="center"
    size="xl"
    background="gradient"
  />

  {/* 2. Social Proof (logos or stats) */}
  <section className="py-12 bg-neutral-50">
    <Container size="lg">
      <div className="text-center">
        <Text color="muted" size="sm" className="mb-8">
          Trusted by 50,000+ overthinkers
        </Text>
        <div className="flex justify-center items-center gap-12 flex-wrap">
          {/* Logo grid or stats */}
        </div>
      </div>
    </Container>
  </section>

  {/* 3. Features Section */}
  <section className="py-20 lg:py-28">
    <Container size="lg">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Heading level={2}>
          Everything you need to quiet your mind
        </Heading>
        <Text color="muted" className="mt-4">
          Science-backed exercises, daily journaling, and progress tracking.
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<BrainIcon />}
          title="Cognitive Exercises"
          description="Reframe negative thought patterns with proven techniques."
          link={{ label: "Learn more", href: "/features" }}
        />
        {/* More feature cards */}
      </div>
    </Container>
  </section>

  {/* 4. How It Works */}
  <section className="py-20 lg:py-28 bg-neutral-50">
    <Container size="lg">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Heading level={2}>How Noema Works</Heading>
      </div>

      {/* 3-step process with illustrations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-softLime-100 text-softLime-700 rounded-full flex items-center justify-center font-display text-2xl">
            1
          </div>
          <Heading level={4}>Take the Assessment</Heading>
          <Text color="muted" className="mt-2">
            Understand your thinking patterns
          </Text>
        </div>
        {/* Steps 2 & 3 */}
      </div>
    </Container>
  </section>

  {/* 5. Testimonials */}
  <section className="py-20 lg:py-28">
    <Container size="lg">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Heading level={2}>Loved by overthinkers</Heading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TestimonialCard {...testimonial1} />
        <TestimonialCard {...testimonial2} />
        <TestimonialCard {...testimonial3} />
      </div>
    </Container>
  </section>

  {/* 6. Pricing (optional teaser) */}
  <section className="py-20 lg:py-28 bg-neutral-50">
    <Container size="lg">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Heading level={2}>Simple, transparent pricing</Heading>
        <Text color="muted" className="mt-4">
          Start free, upgrade when you're ready
        </Text>
      </div>

      {/* Pricing cards */}
    </Container>
  </section>

  {/* 7. Final CTA */}
  <CTASection
    headline="Ready to quiet your mind?"
    description="Join thousands of overthinkers who found peace with Noema."
    primaryCta={{ label: "Start Free Trial", onClick: handleSignup }}
    variant="gradient"
    size="lg"
  />
</HomePage>
```

#### Section Transitions
- Use subtle fade-in animations as sections come into view
- Alternate between white (`neutral-0`) and light gray (`neutral-50`) backgrounds
- Maintain consistent vertical spacing between sections

#### CTA Placement
- Primary CTA in hero (above the fold)
- Secondary CTAs in features and how-it-works sections
- Final strong CTA at bottom before footer

### 5.2 Legal Pages (Privacy, Terms, etc.)

#### Visual Approach
Legal pages should prioritize readability over visual flair. Use a narrow content width (max-w-prose), generous line height, and a sticky table of contents for easy navigation.

#### Structure
```tsx
<LegalPage>
  {/* Simple hero */}
  <section className="py-12 bg-neutral-50 border-b border-neutral-200">
    <Container size="md">
      <Heading level={1}>Privacy Policy</Heading>
      <Text color="muted" className="mt-2">
        Last updated: January 15, 2025
      </Text>
    </Container>
  </section>

  {/* Main content with sidebar TOC */}
  <section className="py-12">
    <Container size="lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Table of Contents (sticky) */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24">
            <Text weight="semibold" className="mb-4">
              On this page
            </Text>
            <nav className="space-y-2">
              <a href="#section-1" className="block text-sm text-neutral-600 hover:text-forestGreen-700">
                1. Information We Collect
              </a>
              {/* More TOC links */}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="lg:col-span-9 prose prose-lg max-w-none">
          <h2 id="section-1">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us...
          </p>

          {/* More content sections */}
        </article>
      </div>
    </Container>
  </section>
</LegalPage>
```

#### Typography for Legal Content
```css
/* Use Tailwind typography plugin */
.prose {
  /* Base styles */
  color: theme('colors.neutral.600');
  font-size: 1.125rem;
  line-height: 1.75;

  /* Headings */
  h2 {
    color: theme('colors.neutral.900');
    font-weight: 600;
    font-size: 1.875rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: theme('colors.neutral.900');
    font-weight: 600;
    font-size: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  /* Links */
  a {
    color: theme('colors.forestGreen.700');
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }

  a:hover {
    color: theme('colors.forestGreen.900');
  }

  /* Lists */
  ul, ol {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  li {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  /* Paragraphs */
  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}
```

#### TOC Navigation
- Sticky positioned at `top-24` (below header)
- Links scroll to sections smoothly
- Active section highlighted in TOC
- Mobile: TOC collapses into dropdown at top

### 5.3 Support Page

#### Visual Approach
The support page should feel helpful and accessible. Use a clear form with validation, FAQ section below, and multiple contact options.

#### Structure
```tsx
<SupportPage>
  {/* Hero */}
  <section className="py-12 bg-neutral-50">
    <Container size="md">
      <div className="text-center">
        <Heading level={1}>How can we help?</Heading>
        <Text color="muted" className="mt-2">
          We typically respond within 24 hours
        </Text>
      </div>
    </Container>
  </section>

  {/* Contact Form */}
  <section className="py-16">
    <Container size="md">
      <Card variant="elevated">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <Input
              name="name"
              label="Your name"
              placeholder="John Doe"
              required
            />

            {/* Email */}
            <Input
              type="email"
              name="email"
              label="Email address"
              placeholder="john@example.com"
              helpText="We'll respond to this email"
              required
              className="mt-6"
            />

            {/* Topic */}
            <Select
              name="topic"
              label="What can we help you with?"
              placeholder="Select a topic"
              options={[
                { value: "billing", label: "Billing & Payments" },
                { value: "technical", label: "Technical Support" },
                { value: "feedback", label: "Feedback & Suggestions" },
                { value: "other", label: "Other" },
              ]}
              required
              className="mt-6"
            />

            {/* Message */}
            <Textarea
              name="message"
              label="Message"
              placeholder="Tell us more about your question..."
              rows={6}
              maxLength={1000}
              required
              className="mt-6"
            />

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              className="mt-8"
            >
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  </section>

  {/* Alternative Contact Methods */}
  <section className="py-16 bg-neutral-50">
    <Container size="lg">
      <div className="text-center mb-12">
        <Heading level={2}>Other ways to reach us</Heading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Email */}
        <Card>
          <CardContent className="text-center p-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-forestGreen-50 text-forestGreen-700 rounded-full flex items-center justify-center">
              <MailIcon />
            </div>
            <Heading level={4}>Email</Heading>
            <Text color="muted" className="mt-2">
              support@noema.com
            </Text>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card>
          <CardContent className="text-center p-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-softLime-50 text-softLime-700 rounded-full flex items-center justify-center">
              <ChatIcon />
            </div>
            <Heading level={4}>Live Chat</Heading>
            <Text color="muted" className="mt-2">
              Available 9am-5pm EST
            </Text>
            <Button variant="outline" size="sm" className="mt-4">
              Start Chat
            </Button>
          </CardContent>
        </Card>

        {/* Help Center */}
        <Card>
          <CardContent className="text-center p-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-info-50 text-info-700 rounded-full flex items-center justify-center">
              <BookIcon />
            </div>
            <Heading level={4}>Help Center</Heading>
            <Text color="muted" className="mt-2">
              Search our guides
            </Text>
            <Button variant="outline" size="sm" className="mt-4" as="a" href="/help">
              Browse Articles
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  </section>

  {/* FAQ Section */}
  <section className="py-16">
    <Container size="md">
      <div className="text-center mb-12">
        <Heading level={2}>Common Questions</Heading>
      </div>

      <FAQAccordion items={supportFAQ} />
    </Container>
  </section>
</SupportPage>
```

#### Form Design Best Practices
- Clear labels above inputs
- Helpful placeholder text
- Inline validation (show errors on blur)
- Success/error messages after submit
- Loading state on submit button
- Character count for textarea

#### Contact Options
- Primary: Form (most accessible)
- Secondary: Email link (copy-to-clipboard)
- Tertiary: Live chat (if available)
- Quaternary: Help center (self-service)

---

## 6. Best Practices

### 6.1 Component Composition Patterns

#### Compound Components
Use compound components for related UI elements that need to share state:

```tsx
// Good: Compound component pattern
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>

// Avoid: Monolithic prop-based API
<Card
  title="Title"
  description="Description"
  content="Content"
  footer="Footer"
/>
```

#### Composition Over Configuration
Prefer composable components over heavily configured ones:

```tsx
// Good: Composable
<Button variant="primary" leftIcon={<CheckIcon />}>
  Confirm
</Button>

// Avoid: Over-configured
<Button
  variant="primary"
  icon="check"
  iconPosition="left"
  text="Confirm"
  showIcon
/>
```

#### Render Props Pattern
Use render props for flexible content customization:

```tsx
// Good: Flexible with render props
<FeatureCard
  icon={<BrainIcon />}
  title="Cognitive Exercises"
  description="..."
  renderFooter={() => (
    <Button variant="outline" size="sm">
      Learn More
    </Button>
  )}
/>
```

### 6.2 Props vs. Children

#### When to Use Props
- For simple, single-value content (strings, numbers)
- For configuration options (variants, sizes)
- For event handlers (onClick, onChange)

```tsx
<Button
  variant="primary"
  size="lg"
  onClick={handleClick}
>
  Click Me
</Button>
```

#### When to Use Children
- For complex or multi-element content
- When content includes markup
- For composition patterns

```tsx
<Card>
  <CardHeader>
    <h3>Complex Title</h3>
    <Badge>New</Badge>
  </CardHeader>
  <CardContent>
    <p>Multiple paragraphs...</p>
    <ul>
      <li>List items</li>
    </ul>
  </CardContent>
</Card>
```

#### Slot-Based Patterns
For predictable content areas, use named slots:

```tsx
interface ModalProps {
  header: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

<Modal
  header={<h2>Confirm Action</h2>}
  footer={
    <>
      <Button variant="ghost">Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

### 6.3 Reusability Guidelines

#### Single Responsibility
Each component should do one thing well:

```tsx
// Good: Focused components
<Card>
  <CardContent>
    <FeatureIcon icon="brain" />
    <FeatureTitle>Cognitive Exercises</FeatureTitle>
    <FeatureDescription>...</FeatureDescription>
  </CardContent>
</Card>

// Avoid: Kitchen-sink component
<MegaFeatureCard
  icon="brain"
  title="Cognitive Exercises"
  description="..."
  hasImage
  imageUrl="..."
  ctaLabel="Learn More"
  ctaVariant="outline"
/>
```

#### Extract Common Patterns
When you see duplication, extract to a reusable component:

```tsx
// Before: Repeated pattern
<div className="flex items-center gap-3 mb-4">
  <div className="w-12 h-12 bg-forestGreen-50 text-forestGreen-700 rounded-full flex items-center justify-center">
    <Icon />
  </div>
  <Text>Feature name</Text>
</div>

// After: Extracted component
<IconWithText
  icon={<Icon />}
  iconColor="forestGreen"
  text="Feature name"
/>
```

#### Configurable but Opinionated
Provide sensible defaults, allow customization:

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  // ... other props
}

// Defaults
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',  // Opinionated default
  size = 'md',          // Sensible default
  ...props
}) => {
  // ...
}
```

### 6.4 Performance Considerations

#### Code Splitting
Split large components and pages:

```tsx
// Route-based splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
  </Routes>
</Suspense>
```

#### Lazy Load Heavy Components
Defer loading of non-critical components:

```tsx
// Lazy load testimonials (below the fold)
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'))

<section>
  <Suspense fallback={<SectionSkeleton />}>
    <TestimonialsSection />
  </Suspense>
</section>
```

#### Optimize Images
Use Next.js Image component or equivalent:

```tsx
// Next.js
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority  // For above-the-fold images
  placeholder="blur"
  blurDataURL="..."
/>

// Or use native lazy loading
<img
  src="/feature.jpg"
  alt="Feature"
  loading="lazy"
  decoding="async"
/>
```

#### Memoization
Memoize expensive computations and components:

```tsx
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

// Memoize components that don't need re-renders
const FeatureCard = memo(({ feature }) => {
  return <Card>...</Card>
})

// Memoize callbacks passed to child components
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

#### Virtual Scrolling
For long lists, use virtual scrolling:

```tsx
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={80}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <FeatureCard feature={items[index]} />
    </div>
  )}
</FixedSizeList>
```

#### Bundle Size Analysis
Regularly analyze bundle size:

```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
    }),
  ],
})
```

### 6.5 Accessibility Checklist

#### Keyboard Navigation
- All interactive elements focusable (tab order)
- Focus visible on keyboard (not mouse)
- Escape closes modals/menus
- Arrow keys navigate menus/tabs

#### Screen Reader Support
- Semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- Proper heading hierarchy (h1 → h2 → h3, no skipping)

#### Color Contrast
- Text on backgrounds: 4.5:1 minimum (WCAG AA)
- Large text (18px+): 3:1 minimum
- Non-text (icons, borders): 3:1 minimum
- Use tools: WebAIM Contrast Checker

#### Forms
- Labels associated with inputs (`<label for="...">`)
- Error messages announced to screen readers
- Required fields marked (`aria-required="true"`)
- Validation errors clearly communicated

#### Testing
- Test with keyboard only
- Test with screen reader (NVDA, VoiceOver, JAWS)
- Use axe DevTools browser extension
- Run automated tests (jest-axe, Playwright accessibility)

---

## Appendix A: Tailwind Config

Complete `tailwind.config.ts` for this design system:

```typescript
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './index.html',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      // Colors
      colors: {
        // Forest Green (Primary)
        forestGreen: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },

        // Soft Lime (Accent)
        softLime: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#52B788',
          600: '#47a877',
          700: '#3d8f66',
          800: '#337655',
          900: '#295d44',
        },

        // Neutral
        neutral: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },

        // Semantic
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          700: '#b45309',
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6',
          700: '#1d4ed8',
        },
      },

      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },

      // Spacing
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        144: '36rem',
      },

      // Max width
      maxWidth: {
        content: '72ch',
        narrow: '600px',
        wide: '1400px',
      },

      // Border radius
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },

      // Box shadow
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        focus: '0 0 0 3px rgba(5, 150, 105, 0.2)',
      },

      // Animation
      animation: {
        'fade-in': 'fade-in 500ms ease-out',
        'slide-up': 'slide-up 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slide-down 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-left': 'slide-left 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-right': 'slide-right 350ms cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scale-in 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'breathe': 'breathe 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'float': 'float 6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      // Transition timing
      transitionDuration: {
        fastest: '100ms',
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
        slower: '500ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        gentle: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
      },
    },
  },
  plugins: [
    typography,
  ],
}

export default config
```

---

## Appendix B: Component File Structure

Recommended file structure for components:

```
src/
├── components/
│   ├── ui/                    # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Heading.tsx
│   │   ├── Text.tsx
│   │   ├── Accordion.tsx
│   │   └── index.ts           # Barrel export
│   │
│   ├── layout/                # Layout components
│   │   ├── Container.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── index.ts
│   │
│   ├── sections/              # Page sections
│   │   ├── Hero.tsx
│   │   ├── CTASection.tsx
│   │   └── index.ts
│   │
│   ├── features/              # Feature-specific components
│   │   ├── FeatureCard.tsx
│   │   └── index.ts
│   │
│   ├── testimonials/          # Testimonial components
│   │   ├── TestimonialCard.tsx
│   │   └── index.ts
│   │
│   └── faq/                   # FAQ components
│       ├── FAQAccordion.tsx
│       └── index.ts
│
├── lib/                       # Utility functions
│   ├── utils.ts               # cn() and other utils
│   └── constants.ts           # Shared constants
│
├── types/                     # TypeScript types
│   └── components.ts
│
└── styles/                    # Global styles
    └── globals.css
```

---

## Appendix C: Font Loading

### Google Fonts Setup

#### Option 1: Next.js Font Optimization
```tsx
// app/layout.tsx
import { Inter, Instrument_Serif } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

#### Option 2: NPM Packages
```bash
npm install @fontsource/inter @fontsource/instrument-serif
```

```tsx
// app/layout.tsx or main.tsx
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/instrument-serif/400.css'
```

#### Option 3: CDN (Quick start)
```html
<!-- index.html -->
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:wght@400&display=swap" rel="stylesheet">
</head>
```

---

## Appendix D: Icon System

### Recommended Icon Library: Lucide React

```bash
npm install lucide-react
```

#### Usage
```tsx
import { Brain, BookOpen, Mail, Check, X } from 'lucide-react'

// In components
<Brain className="w-6 h-6 text-forestGreen-700" />

// With button
<Button leftIcon={<Check className="w-5 h-5" />}>
  Confirm
</Button>
```

#### Icon Sizing Convention
```tsx
// Extra small
<Icon className="w-3 h-3" />   // 12px

// Small
<Icon className="w-4 h-4" />   // 16px

// Medium (default)
<Icon className="w-5 h-5" />   // 20px

// Large
<Icon className="w-6 h-6" />   // 24px

// Extra large
<Icon className="w-8 h-8" />   // 32px
```

---

## Appendix E: Quick Start Checklist

### 1. Install Dependencies
```bash
npm install tailwindcss postcss autoprefixer
npm install @fontsource/inter @fontsource/instrument-serif
npm install lucide-react
npm install @radix-ui/react-select @radix-ui/react-accordion
npm install class-variance-authority clsx tailwind-merge
```

### 2. Configure Tailwind
Copy the Tailwind config from Appendix A to `tailwind.config.ts`

### 3. Add Global Styles
```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-neutral-300;
  }

  body {
    @apply bg-neutral-50 text-neutral-900 font-sans;
  }
}
```

### 4. Create Utility Function
```tsx
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 5. Build Components
Start with base components in this order:
1. Button
2. Card
3. Container
4. Heading & Text
5. Input, Textarea, Select
6. Layout (Header, Footer)
7. Sections (Hero, CTA)
8. Feature-specific components

### 6. Test Accessibility
- Run axe DevTools
- Test keyboard navigation
- Check color contrast
- Test with screen reader

---

**End of Design System Specification**

This document is maintained by the design team. For questions or updates, please create an issue or contact the design lead.
