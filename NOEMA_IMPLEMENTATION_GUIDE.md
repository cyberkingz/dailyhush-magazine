# Noema Design System - Quick Implementation Guide

## Overview
This guide provides senior developers with a fast-track implementation path for the Noema Design System. For full specifications, see `NOEMA_DESIGN_SYSTEM.md`.

---

## 1. Project Setup (30 minutes)

### Install Core Dependencies
```bash
# Fonts
npm install @fontsource/inter @fontsource/instrument-serif

# Icons
npm install lucide-react

# UI Primitives (Radix)
npm install @radix-ui/react-select @radix-ui/react-accordion @radix-ui/react-dialog @radix-ui/react-checkbox

# Utilities
npm install class-variance-authority clsx tailwind-merge

# Already installed: tailwindcss, react, react-router-dom
```

### Update Tailwind Config
Replace `/tailwind.config.js` with `/tailwind.config.ts`:

**Key Changes:**
- Add `forestGreen` and `softLime` color palettes
- Update font families to `Inter` (sans) and `Instrument Serif` (display)
- Add custom animations: `fade-in`, `slide-up`, `breathe`, `float`
- Add semantic colors: `success`, `error`, `warning`, `info`
- Add custom shadows and border radius values

See Appendix A in main spec for complete config.

### Setup Global Styles
Update `/src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import fonts */
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';
@import '@fontsource/instrument-serif/400.css';

@layer base {
  * {
    @apply border-neutral-300;
  }

  body {
    @apply bg-neutral-50 text-neutral-900 font-sans antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-display;
  }
}

/* Reduced motion support */
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

### Create Utils
```tsx
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 2. Core Components (Priority Order)

### Phase 1: Foundational (Week 1)

#### 1. Button Component
**File:** `/src/components/ui/Button.tsx`

**Key Features:**
- 5 variants: primary, secondary, outline, ghost, destructive
- 3 sizes: sm, md, lg
- Loading state with spinner
- Icon support (left/right)
- Polymorphic (button, Link, anchor)
- Full keyboard navigation

**Example Usage:**
```tsx
<Button variant="primary" size="lg" leftIcon={<CheckIcon />}>
  Get Started
</Button>
```

**Critical Details:**
- Primary uses `softLime-500` (accent color)
- Secondary uses `forestGreen-900` (brand color)
- Focus ring: `ring-2 ring-offset-2`
- Hover: slight lift + scale (`-translate-y-1 scale-[1.005]`)

#### 2. Card Component
**File:** `/src/components/ui/Card.tsx` (+ CardHeader, CardContent, CardFooter)

**Key Features:**
- Compound component pattern
- Variants: default, outline, ghost, elevated
- Optional clickable state
- Semantic HTML (`<article>`)

**Example Usage:**
```tsx
<Card variant="elevated" clickable onClick={handleClick}>
  <CardHeader>
    <CardTitle>Feature Name</CardTitle>
    <CardDescription>Description here</CardDescription>
  </CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>
    <Button variant="outline">Learn More</Button>
  </CardFooter>
</Card>
```

#### 3. Container Component
**File:** `/src/components/layout/Container.tsx`

**Key Features:**
- Responsive max-widths
- Automatic centering
- Responsive padding
- Semantic HTML options

**Example Usage:**
```tsx
<Container size="lg" as="section">
  <Heading level={2}>Section Title</Heading>
  {/* Content */}
</Container>
```

#### 4. Typography Components
**Files:**
- `/src/components/ui/Heading.tsx`
- `/src/components/ui/Text.tsx`

**Key Features:**
- Responsive font sizes
- Display vs. sans variants
- Semantic HTML levels
- Color variants

**Example Usage:**
```tsx
<Heading level={1} variant="display">
  Welcome to Noema
</Heading>

<Text color="muted" size="lg">
  Supporting text with optimal readability
</Text>
```

### Phase 2: Layout (Week 1)

#### 5. Header Component
**File:** `/src/components/layout/Header.tsx`

**Key Features:**
- Sticky positioning
- Desktop navigation
- Mobile menu toggle
- Transparent variant (for heroes)
- Logo slot
- CTA button

**Example Usage:**
```tsx
<Header
  sticky
  logo={<Logo />}
  nav={[
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ]}
  cta={{ label: 'Get Started', onClick: handleSignup }}
/>
```

#### 6. Footer Component
**File:** `/src/components/layout/Footer.tsx`

**Key Features:**
- Multi-column layout
- Social media links
- Newsletter signup (optional)
- Legal links
- Copyright notice

#### 7. Mobile Menu Component
**File:** `/src/components/layout/MobileMenu.tsx`

**Key Features:**
- Slide-in from right
- Backdrop overlay
- Smooth animations
- Touch-friendly targets

### Phase 3: Form Components (Week 2)

#### 8. Input Component
**File:** `/src/components/ui/Input.tsx`

**Key Features:**
- All input types (text, email, password, etc.)
- Label + help text
- Error/success states
- Icon support (left/right)
- Validation styling

**Example Usage:**
```tsx
<Input
  type="email"
  name="email"
  label="Email address"
  placeholder="you@example.com"
  helpText="We'll never share your email"
  required
  error={errors.email}
/>
```

#### 9. Textarea Component
**File:** `/src/components/ui/Textarea.tsx`

#### 10. Select Component
**File:** `/src/components/ui/Select.tsx`

**Use Radix UI Select for better UX**

#### 11. Checkbox Component
**File:** `/src/components/ui/Checkbox.tsx`

**Use Radix UI Checkbox for accessibility**

### Phase 4: Section Components (Week 2)

#### 12. Hero Component
**File:** `/src/components/sections/Hero.tsx`

**Key Features:**
- Centered or split layout
- Gradient backgrounds
- Primary + secondary CTA
- Image/illustration support

**Example Usage:**
```tsx
<Hero
  headline="Stop overthinking. Start living."
  subheadline="Science-backed tools to calm your mind."
  primaryCta={{ label: "Start Free Trial", onClick: handleSignup }}
  secondaryCta={{ label: "Watch Demo", onClick: handleDemo }}
  align="center"
  size="xl"
  background="gradient"
/>
```

#### 13. CTA Section Component
**File:** `/src/components/sections/CTASection.tsx`

**Key Features:**
- Full-width with background
- Gradient or solid variants
- 1-2 CTA buttons

### Phase 5: Feature Components (Week 3)

#### 14. Feature Card Component
**File:** `/src/components/features/FeatureCard.tsx`

**Key Features:**
- Horizontal or vertical layout
- Icon + title + description
- Optional link
- Grid-ready

#### 15. Testimonial Card Component
**File:** `/src/components/testimonials/TestimonialCard.tsx`

**Key Features:**
- Quote display
- Author info + avatar
- Optional rating
- Elevated variant

#### 16. FAQ Accordion Component
**File:** `/src/components/faq/FAQAccordion.tsx`

**Key Features:**
- Single or multiple open
- Smooth expand/collapse
- Keyboard navigation
- Use Radix UI Accordion

---

## 3. Page Templates

### Homepage Template
```tsx
// src/pages/HomePage.tsx
export default function HomePage() {
  return (
    <>
      <Header {...headerProps} />

      {/* Hero */}
      <Hero
        headline="Stop overthinking. Start living."
        subheadline="Science-backed tools to calm your mind."
        primaryCta={{ label: "Start Free Trial", onClick: handleSignup }}
        align="center"
        size="xl"
        background="gradient"
      />

      {/* Social Proof */}
      <section className="py-12 bg-neutral-50">
        <Container size="lg">
          <Text color="muted" size="sm" align="center" className="mb-8">
            Trusted by 50,000+ overthinkers
          </Text>
          {/* Logo grid */}
        </Container>
      </section>

      {/* Features */}
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
            {features.map(feature => (
              <FeatureCard key={feature.id} {...feature} />
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Heading level={2}>Loved by overthinkers</Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <CTASection
        headline="Ready to quiet your mind?"
        description="Join thousands who found peace with Noema."
        primaryCta={{ label: "Start Free Trial", onClick: handleSignup }}
        variant="gradient"
        size="lg"
      />

      <Footer {...footerProps} />
    </>
  )
}
```

### Legal Page Template
```tsx
// src/pages/PrivacyPolicy.tsx
export default function PrivacyPolicy() {
  return (
    <>
      <Header {...headerProps} />

      {/* Simple Hero */}
      <section className="py-12 bg-neutral-50 border-b border-neutral-200">
        <Container size="md">
          <Heading level={1}>Privacy Policy</Heading>
          <Text color="muted" className="mt-2">
            Last updated: January 15, 2025
          </Text>
        </Container>
      </section>

      {/* Content with TOC */}
      <section className="py-12">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* TOC Sidebar */}
            <aside className="lg:col-span-3">
              <div className="sticky top-24">
                <Text weight="semibold" className="mb-4">
                  On this page
                </Text>
                <nav className="space-y-2">
                  {sections.map(section => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-neutral-600 hover:text-forestGreen-700"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <article className="lg:col-span-9 prose prose-lg max-w-none">
              {/* Markdown content */}
            </article>
          </div>
        </Container>
      </section>

      <Footer {...footerProps} />
    </>
  )
}
```

### Support Page Template
```tsx
// src/pages/Support.tsx
export default function Support() {
  return (
    <>
      <Header {...headerProps} />

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
                <Input
                  name="name"
                  label="Your name"
                  required
                />
                <Input
                  type="email"
                  name="email"
                  label="Email address"
                  helpText="We'll respond to this email"
                  required
                  className="mt-6"
                />
                <Select
                  name="topic"
                  label="What can we help you with?"
                  options={topicOptions}
                  required
                  className="mt-6"
                />
                <Textarea
                  name="message"
                  label="Message"
                  rows={6}
                  maxLength={1000}
                  required
                  className="mt-6"
                />
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
            {/* Contact method cards */}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <Container size="md">
          <div className="text-center mb-12">
            <Heading level={2}>Common Questions</Heading>
          </div>

          <FAQAccordion items={supportFAQ} />
        </Container>
      </section>

      <Footer {...footerProps} />
    </>
  )
}
```

---

## 4. Color Usage Guidelines

### Primary Actions
- **Primary CTA (Get Started, Sign Up):** `softLime-500`
- **Secondary Actions (Learn More):** `forestGreen-900`
- **Tertiary Actions (Cancel, Skip):** `outline` or `ghost` variant

### Backgrounds
- **Page background:** `neutral-50` (light gray)
- **Card background:** `neutral-0` (white)
- **Alternating sections:** Swap between `neutral-0` and `neutral-50`
- **Hero gradient:** `from-forestGreen-50 via-neutral-50 to-softLime-50`
- **Dark sections:** `forestGreen-900` (for CTAs)

### Text
- **Primary text:** `neutral-900`
- **Secondary text:** `neutral-600`
- **Muted text:** `neutral-500`
- **Placeholder text:** `neutral-400`

### Borders
- **Default borders:** `neutral-300`
- **Subtle borders:** `neutral-200`
- **Focus states:** `forestGreen-500` (ring)

### Semantic Colors
- **Success:** `success-500` (green)
- **Error:** `error-500` (red)
- **Warning:** `warning-500` (amber)
- **Info:** `info-500` (blue)

---

## 5. Responsive Design Strategy

### Mobile-First Approach
All base styles apply to mobile. Use breakpoint prefixes to enhance for larger screens:

```tsx
className="
  text-base        // Mobile: 16px
  sm:text-lg       // Tablet: 18px
  lg:text-xl       // Desktop: 20px
"
```

### Breakpoint Usage
```tsx
// Spacing
py-12 sm:py-16 lg:py-24

// Grid
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Typography
text-4xl sm:text-5xl lg:text-6xl

// Visibility
hidden lg:block  // Hide on mobile, show on desktop
```

### Container Padding
```tsx
<Container>  // Automatically responsive
  // Mobile: px-4 (16px)
  // Tablet: px-6 (24px)
  // Desktop: px-8 (32px)
</Container>
```

---

## 6. Animation Guidelines

### Entrance Animations
```tsx
// Fade in
className="animate-fade-in"

// Slide up
className="animate-slide-up"

// Scale in
className="animate-scale-in"
```

### Hover States
```tsx
// Buttons
hover:-translate-y-1 hover:scale-[1.005]

// Cards
hover:shadow-md hover:-translate-y-1

// Links
hover:text-forestGreen-700
```

### Loading States
```tsx
// Spinner
<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
  {/* SVG content */}
</svg>

// Pulse
className="animate-pulse"
```

### Calming Animations
```tsx
// Breathe (for meditation elements)
className="animate-breathe"

// Float (for hero elements)
className="animate-float"

// Soft pulse
className="animate-pulse-soft"
```

---

## 7. Accessibility Checklist

### Keyboard Navigation
- [ ] All interactive elements focusable (tab order)
- [ ] Focus visible on keyboard (not mouse)
- [ ] Escape closes modals/menus
- [ ] Arrow keys navigate dropdowns

### Screen Reader Support
- [ ] Semantic HTML elements
- [ ] ARIA labels for icon-only buttons
- [ ] Proper heading hierarchy (no skipping)
- [ ] Form labels associated with inputs

### Color Contrast
- [ ] Text on backgrounds: 4.5:1 minimum
- [ ] Large text (18px+): 3:1 minimum
- [ ] Test with WebAIM Contrast Checker

### Form Accessibility
- [ ] Labels for all inputs
- [ ] Error messages announced
- [ ] Required fields marked
- [ ] Validation errors clear

---

## 8. Performance Optimization

### Code Splitting
```tsx
// Route-based splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
```

### Image Optimization
```tsx
// Use Next.js Image or native lazy loading
<img src="/feature.jpg" loading="lazy" decoding="async" />
```

### Lazy Load Components
```tsx
// Below-the-fold sections
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'))

<Suspense fallback={<SectionSkeleton />}>
  <TestimonialsSection />
</Suspense>
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

## 9. Testing Strategy

### Unit Tests (Jest)
```tsx
// Component tests
describe('Button', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Click me</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-softLime-500')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### Accessibility Tests (jest-axe)
```tsx
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

it('has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Visual Regression Tests (Chromatic)
```bash
npm install --save-dev @chromatic-com/storybook
```

---

## 10. Common Patterns

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
<Button onClick={handleClick}>Click me</Button>

// As Link
<Button as="link" to="/page">Go to page</Button>

// As anchor
<Button as="anchor" href="https://example.com" target="_blank">
  External link
</Button>
```

### Conditional Rendering
```tsx
// Show/hide based on state
{isLoggedIn && <UserMenu />}

// Render different content
{loading ? <Spinner /> : <Content />}

// Multiple conditions
{error ? <Error /> : loading ? <Loading /> : <Content />}
```

### Form Validation
```tsx
const [errors, setErrors] = useState({})

const handleSubmit = (e) => {
  e.preventDefault()
  const newErrors = validateForm(formData)
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }
  // Submit form
}

<Input
  name="email"
  error={errors.email}
  onBlur={() => validateField('email')}
/>
```

---

## 11. Troubleshooting

### Tailwind Not Applying
1. Check `content` paths in `tailwind.config.ts`
2. Restart dev server
3. Clear build cache: `rm -rf .next` or `rm -rf dist`

### Fonts Not Loading
1. Verify font imports in `globals.css`
2. Check font file paths
3. Clear browser cache

### Animation Not Working
1. Check `prefers-reduced-motion` setting
2. Verify animation class exists in Tailwind config
3. Check for conflicting CSS

### Type Errors
1. Install missing types: `npm install --save-dev @types/react`
2. Update TypeScript: `npm install --save-dev typescript@latest`
3. Check for missing imports

---

## 12. Resources

### Documentation
- Tailwind CSS: https://tailwindcss.com/docs
- Radix UI: https://www.radix-ui.com/primitives/docs
- Lucide Icons: https://lucide.dev/icons
- React Router: https://reactrouter.com

### Tools
- Contrast Checker: https://webaim.org/resources/contrastchecker/
- Accessibility Testing: axe DevTools browser extension
- Font Preview: Google Fonts (fonts.google.com)

### Communities
- Tailwind Discord: https://tailwindcss.com/discord
- React Community: https://react.dev/community

---

**Quick Start:** Begin with Phase 1 components (Button, Card, Container, Typography). These are the foundation for all other components.

**Questions?** Refer to the main Design System spec (`NOEMA_DESIGN_SYSTEM.md`) for detailed specifications.
