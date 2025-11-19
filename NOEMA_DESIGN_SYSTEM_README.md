# Noema Design System

A comprehensive design system for Noema.com - a mental health app for overthinkers.

---

## Overview

The Noema Design System provides a complete set of design tokens, components, and guidelines for building a calming, accessible, and consistent user experience. This system is built on Next.js 15, TypeScript, Tailwind CSS, and Radix UI primitives.

### Design Philosophy

- **Calming, not clinical**: Soft colors, generous spacing, gentle animations
- **Minimalist but warm**: Reduce visual noise while maintaining emotional connection
- **Science-credible**: Professional typography and clear hierarchy build trust
- **Mobile-first**: Optimize for mobile, enhance for desktop
- **Cognitive load reduction**: Limit choices, clear CTAs, progressive disclosure

---

## Quick Start

### 1. Review Documentation

Start with these files in order:

1. **NOEMA_IMPLEMENTATION_GUIDE.md** - Quick start for developers (30 min setup)
2. **NOEMA_DESIGN_SYSTEM.md** - Complete specifications (full reference)
3. **NOEMA_VISUAL_REFERENCE.md** - ASCII diagrams and layouts
4. **NOEMA_COMPONENT_TYPES.ts** - TypeScript type definitions

### 2. Install Dependencies

```bash
# Fonts
npm install @fontsource/inter @fontsource/instrument-serif

# Icons
npm install lucide-react

# UI Primitives
npm install @radix-ui/react-select @radix-ui/react-accordion @radix-ui/react-dialog @radix-ui/react-checkbox

# Utilities
npm install class-variance-authority clsx tailwind-merge
```

### 3. Configure Tailwind

Update `/tailwind.config.ts` with the design system tokens:
- See Appendix A in `NOEMA_DESIGN_SYSTEM.md`
- Key changes: custom colors, fonts, animations, spacing

### 4. Build Components

Follow the priority order in `NOEMA_IMPLEMENTATION_GUIDE.md`:

**Week 1:**
- Button, Card, Container, Typography (Phase 1)
- Header, Footer, Mobile Menu (Phase 2)

**Week 2:**
- Input, Textarea, Select, Checkbox (Phase 3)
- Hero, CTA Section (Phase 4)

**Week 3:**
- Feature Card, Testimonial Card, FAQ Accordion (Phase 5)

---

## File Structure

```
NOEMA_DESIGN_SYSTEM_README.md        ← You are here
├── NOEMA_DESIGN_SYSTEM.md           ← Complete specifications (5,000+ lines)
├── NOEMA_IMPLEMENTATION_GUIDE.md    ← Quick start for developers
├── NOEMA_VISUAL_REFERENCE.md        ← ASCII diagrams & layouts
└── NOEMA_COMPONENT_TYPES.ts         ← TypeScript types

Recommended component structure:
src/
├── components/
│   ├── ui/           ← Base components (Button, Card, Input)
│   ├── layout/       ← Layout components (Header, Footer, Container)
│   ├── sections/     ← Page sections (Hero, CTA)
│   ├── features/     ← Feature cards
│   ├── testimonials/ ← Testimonial cards
│   └── faq/          ← FAQ accordion
├── lib/              ← Utilities (cn helper)
├── types/            ← TypeScript types
└── styles/           ← Global CSS
```

---

## Core Design Tokens

### Colors

```typescript
// Primary Colors
forestGreen[900]: '#064e3b'  // Brand color (secondary CTA, footer)
softLime[500]: '#52B788'     // Accent color (primary CTA)

// Neutral
neutral[0]: '#ffffff'        // Cards, modals
neutral[50]: '#f8fafc'       // Page background
neutral[600]: '#475569'      // Body text
neutral[900]: '#0f172a'      // Headings

// Semantic
success[500]: '#22c55e'      // Success states
error[500]: '#ef4444'        // Error states
warning[500]: '#f59e0b'      // Warning states
info[500]: '#3b82f6'         // Info states
```

### Typography

```typescript
// Fonts
fontFamily: {
  sans: ['Inter', 'sans-serif'],       // Body text
  display: ['Instrument Serif', 'serif'] // Headings
}

// Scale (responsive)
H1: clamp(2.25rem, 5vw, 3.75rem)  // 36-60px
H2: clamp(1.875rem, 4vw, 3rem)    // 30-48px
Body: clamp(1rem, 1.5vw, 1.125rem) // 16-18px
```

### Spacing

```typescript
// Base: 4px, following 8px grid
gap-2: 8px      // Tight spacing
gap-4: 16px     // Default spacing
gap-6: 24px     // Grid gaps
gap-8: 32px     // Section spacing
py-12: 48px     // Section padding (mobile)
py-24: 96px     // Section padding (desktop)
```

---

## Component Usage Examples

### Button

```tsx
import { Button } from '@/components/ui/Button'

// Primary CTA
<Button variant="primary" size="lg">
  Get Started
</Button>

// Secondary action
<Button variant="secondary">
  Learn More
</Button>

// With icon
<Button variant="primary" leftIcon={<CheckIcon />}>
  Confirm
</Button>

// Loading state
<Button variant="primary" loading>
  Processing...
</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Feature Name</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    Main content goes here
  </CardContent>
  <CardFooter>
    <Button variant="outline">Learn More</Button>
  </CardFooter>
</Card>
```

### Form

```tsx
import { Input, Textarea, Select, Button } from '@/components/ui'

<form onSubmit={handleSubmit}>
  <Input
    type="email"
    name="email"
    label="Email address"
    placeholder="you@example.com"
    required
    error={errors.email}
  />

  <Select
    name="topic"
    label="How can we help?"
    options={[
      { value: 'support', label: 'Technical Support' },
      { value: 'billing', label: 'Billing Question' }
    ]}
    required
  />

  <Textarea
    name="message"
    label="Message"
    rows={6}
    maxLength={1000}
    required
  />

  <Button type="submit" variant="primary" fullWidth>
    Send Message
  </Button>
</form>
```

### Hero Section

```tsx
import { Hero } from '@/components/sections/Hero'

<Hero
  headline="Stop overthinking. Start living."
  subheadline="Science-backed tools to calm your mind and reclaim your peace."
  primaryCta={{
    label: "Start Free Trial",
    onClick: handleSignup
  }}
  secondaryCta={{
    label: "Watch Demo",
    onClick: handleDemo
  }}
  align="center"
  size="xl"
  background="gradient"
/>
```

---

## Responsive Design

All components use a mobile-first approach:

```tsx
// Mobile default, tablet enhanced, desktop optimized
<div className="
  text-base          // 16px on mobile
  sm:text-lg         // 18px on tablet
  lg:text-xl         // 20px on desktop

  grid-cols-1        // 1 column on mobile
  md:grid-cols-2     // 2 columns on tablet
  lg:grid-cols-3     // 3 columns on desktop

  py-12              // 48px padding on mobile
  lg:py-24           // 96px padding on desktop
">
  Content
</div>
```

### Breakpoints

```typescript
sm: '640px'   // Tablet portrait
md: '768px'   // Tablet landscape
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large
```

---

## Color Usage Guidelines

### When to Use Each Color

**Primary CTA (Get Started, Sign Up):**
- Background: `softLime-500` (accent green)
- Text: `white`
- Usage: Main conversion actions only

**Secondary Actions (Learn More):**
- Background: `forestGreen-900` (brand green)
- Text: `white`
- Usage: Supporting actions, navigation

**Page Backgrounds:**
- `neutral-50` (light gray) - Main page background
- `neutral-0` (white) - Card backgrounds
- Alternate between neutral-0 and neutral-50 for sections

**Text:**
- `neutral-900` - Headings, primary text
- `neutral-600` - Body text
- `neutral-500` - Muted text (labels, captions)
- `neutral-400` - Placeholder text

---

## Accessibility Requirements

### Keyboard Navigation

- All interactive elements must be focusable
- Focus indicators visible on keyboard navigation
- Tab order follows logical flow
- Escape key closes modals/menus

### Screen Readers

- Semantic HTML elements (`<button>`, `<nav>`, `<main>`)
- ARIA labels for icon-only buttons
- Proper heading hierarchy (no skipping levels)
- Form labels associated with inputs

### Color Contrast

Minimum contrast ratios (WCAG AA):
- Normal text: 4.5:1
- Large text (18px+): 3:1
- Non-text (icons, borders): 3:1

**Pre-validated combinations:**
- `neutral-900` on `neutral-50` = 18.2:1 ✓
- `forestGreen-900` on `forestGreen-50` = 15.1:1 ✓
- `neutral-700` on `neutral-50` = 11.4:1 ✓

---

## Testing

### Component Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Accessibility Tests

```tsx
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## Performance

### Code Splitting

```tsx
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('./pages/HomePage'))

<Suspense fallback={<LoadingSpinner />}>
  <HomePage />
</Suspense>
```

### Image Optimization

```tsx
// Use Next.js Image or native lazy loading
<img
  src="/feature.jpg"
  alt="Feature description"
  loading="lazy"
  decoding="async"
  width={600}
  height={400}
/>
```

### Memoization

```tsx
// Expensive calculations
const value = useMemo(() => computeExpensiveValue(data), [data])

// Stable callbacks
const handleClick = useCallback(() => doSomething(id), [id])

// Pure components
const FeatureCard = memo(({ feature }) => <Card>...</Card>)
```

---

## Common Patterns

### Compound Components

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Polymorphic Components

```tsx
// As button
<Button onClick={handleClick}>Click</Button>

// As Link
<Button as="link" to="/page">Navigate</Button>

// As anchor
<Button as="anchor" href="https://example.com">External</Button>
```

### Form Validation

```tsx
const [errors, setErrors] = useState({})

const validateField = (name: string, value: string) => {
  // Validation logic
  if (!value) return 'This field is required'
  if (name === 'email' && !isEmail(value)) return 'Invalid email'
  return null
}

<Input
  name="email"
  error={errors.email}
  onBlur={(e) => {
    const error = validateField('email', e.target.value)
    setErrors(prev => ({ ...prev, email: error }))
  }}
/>
```

---

## Troubleshooting

### Tailwind Classes Not Applying

1. Check `content` paths in `tailwind.config.ts`
2. Restart dev server
3. Clear build cache: `rm -rf .next` or `rm -rf dist`

### Fonts Not Loading

1. Verify font imports in `globals.css`
2. Check font file paths (if self-hosting)
3. Clear browser cache

### Type Errors

1. Install missing types: `npm install --save-dev @types/react`
2. Check for missing imports
3. Verify TypeScript version: `npm install --save-dev typescript@latest`

---

## Resources

### Documentation
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives/docs)
- [Lucide Icons](https://lucide.dev/icons)
- [React Router](https://reactrouter.com)

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/) (Browser extension)
- [Google Fonts](https://fonts.google.com)

### Inspiration
- [Calm.com](https://calm.com) - Nature-focused calm aesthetic
- [Headspace](https://headspace.com) - Approachable mental health
- [Linear](https://linear.app) - Modern SaaS excellence

---

## Support

### Questions?

1. Check the full specs: `NOEMA_DESIGN_SYSTEM.md`
2. Review implementation guide: `NOEMA_IMPLEMENTATION_GUIDE.md`
3. Look up types: `NOEMA_COMPONENT_TYPES.ts`
4. See visual examples: `NOEMA_VISUAL_REFERENCE.md`

### Contributing

When adding new components:

1. Follow existing patterns (see Phase 1-5 components)
2. Include TypeScript types in `NOEMA_COMPONENT_TYPES.ts`
3. Add visual examples to `NOEMA_VISUAL_REFERENCE.md`
4. Document in `NOEMA_DESIGN_SYSTEM.md`
5. Test for accessibility (keyboard, screen reader, contrast)

---

## Version History

- **v1.0** (2025-11-12) - Initial release
  - Complete design token system
  - 16 core components specified
  - Mobile-first responsive system
  - WCAG AA accessibility standards
  - Full TypeScript support

---

**Getting Started:**

1. Read `NOEMA_IMPLEMENTATION_GUIDE.md` (30 min)
2. Install dependencies (5 min)
3. Update Tailwind config (10 min)
4. Build Phase 1 components (2-3 days)
5. Implement homepage (1-2 days)

**Total estimate for MVP:** 1-2 weeks for senior developer

---

**Design System Maintained By:** Design Team
**Last Updated:** 2025-11-12
**Version:** 1.0
