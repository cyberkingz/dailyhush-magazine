/**
 * Noema Design System - TypeScript Component Types
 *
 * This file contains all TypeScript interfaces and types for the Noema Design System.
 * Import these into your components for type safety and consistency.
 *
 * Usage:
 *   import type { ButtonProps, CardProps } from '@/types/components'
 */

import React from 'react'

// ============================================================================
// COMMON TYPES
// ============================================================================

export type Size = 'sm' | 'md' | 'lg'
export type Alignment = 'left' | 'center' | 'right'
export type Variant = 'default' | 'outline' | 'ghost'

// Color variants based on design system
export type SemanticColor = 'success' | 'error' | 'warning' | 'info'
export type TextColor = 'default' | 'muted' | 'subtle'

// Polymorphic component helpers
export type PolymorphicRef<T extends React.ElementType> =
  React.ComponentPropsWithRef<T>['ref']

export type PolymorphicComponentProps<
  T extends React.ElementType,
  Props = object
> = Props &
  Omit<React.ComponentPropsWithoutRef<T>, keyof Props> & {
    as?: T
  }

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseButtonProps {
  // Appearance
  variant?: ButtonVariant
  size?: ButtonSize

  // State
  disabled?: boolean
  loading?: boolean

  // Layout
  fullWidth?: boolean

  // Icons
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode

  // Content
  children: React.ReactNode
  className?: string

  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
}

interface ButtonAsButton extends BaseButtonProps {
  as?: 'button'
  type?: 'button' | 'submit' | 'reset'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  to?: never
  href?: never
}

interface ButtonAsLink extends BaseButtonProps {
  as: 'link'
  to: string
  type?: never
  onClick?: never
  href?: never
}

interface ButtonAsAnchor extends BaseButtonProps {
  as: 'anchor'
  href: string
  target?: string
  rel?: string
  to?: never
  type?: never
  onClick?: never
}

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

// ============================================================================
// CARD COMPONENT
// ============================================================================

export type CardVariant = 'default' | 'outline' | 'ghost' | 'elevated'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps {
  // Variants
  variant?: CardVariant

  // Interaction
  clickable?: boolean
  onClick?: () => void
  href?: string

  // Layout
  padding?: CardPadding

  // Content
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode

  // Styling
  className?: string

  // Accessibility
  'aria-label'?: string
}

export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export interface CardTitleProps {
  children: React.ReactNode
  className?: string
}

export interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

// ============================================================================
// CONTAINER COMPONENT
// ============================================================================

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'content' | 'narrow' | 'wide'
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg'
export type ContainerElement = 'div' | 'section' | 'main' | 'article' | 'aside' | 'header' | 'footer'

export interface ContainerProps {
  // Width variants
  size?: ContainerSize

  // Padding
  padding?: ContainerPadding

  // Semantic element
  as?: ContainerElement

  // Content
  children: React.ReactNode
  className?: string

  // HTML attributes
  id?: string
}

// ============================================================================
// TYPOGRAPHY COMPONENTS
// ============================================================================

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingVariant = 'display' | 'default'
export type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'

export interface HeadingProps {
  // Required
  level: HeadingLevel

  // Variants
  variant?: HeadingVariant

  // Styling
  align?: Alignment
  color?: TextColor

  // Content
  children: React.ReactNode
  className?: string

  // Semantic override (use 'as' to render a different tag than semantic level)
  as?: HeadingElement

  // HTML attributes
  id?: string
}

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'
export type TextElement = 'p' | 'span' | 'div' | 'label'

export interface TextProps {
  // Sizes
  size?: TextSize

  // Weights
  weight?: TextWeight

  // Colors
  color?: TextColor

  // Alignment
  align?: Alignment

  // Semantic element
  as?: TextElement

  // Content
  children: React.ReactNode
  className?: string

  // HTML attributes
  id?: string
  htmlFor?: string // For label elements
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

export type InputType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number'

export interface InputProps {
  // Input attributes
  type?: InputType
  name: string
  id?: string
  value?: string
  defaultValue?: string
  placeholder?: string

  // State
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  autoComplete?: string
  autoFocus?: boolean

  // Validation
  error?: string
  success?: boolean
  pattern?: string
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  step?: number

  // Label & Help
  label?: string
  helpText?: string

  // Icons
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode

  // Events
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void

  // Styling
  className?: string

  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export interface TextareaProps {
  // Input attributes
  name: string
  id?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  rows?: number

  // State
  disabled?: boolean
  required?: boolean
  readOnly?: boolean
  autoFocus?: boolean

  // Validation
  error?: string
  maxLength?: number
  minLength?: number

  // Label & Help
  label?: string
  helpText?: string

  // Events
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void

  // Styling
  className?: string

  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  // Input attributes
  name: string
  id?: string
  value?: string
  defaultValue?: string
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
  onBlur?: () => void

  // Styling
  className?: string

  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export interface CheckboxProps {
  // Input attributes
  name: string
  id?: string
  checked?: boolean
  defaultChecked?: boolean

  // State
  disabled?: boolean
  required?: boolean

  // Label
  label: string | React.ReactNode

  // Validation
  error?: string

  // Events
  onChange?: (checked: boolean) => void
  onBlur?: () => void

  // Styling
  className?: string

  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
}

export interface RadioProps {
  // Input attributes
  name: string
  id?: string
  value: string
  checked?: boolean
  defaultChecked?: boolean

  // State
  disabled?: boolean
  required?: boolean

  // Label
  label: string | React.ReactNode

  // Events
  onChange?: (value: string) => void

  // Styling
  className?: string

  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
}

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

export interface NavItem {
  label: string
  href: string
  active?: boolean
  external?: boolean
  items?: NavItem[] // For dropdown menus
}

export interface HeaderProps {
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
    variant?: ButtonVariant
  }

  // Mobile menu
  mobileMenuOpen?: boolean
  onMobileMenuToggle?: () => void

  // Styling
  className?: string
}

export interface FooterSection {
  title: string
  links: {
    label: string
    href: string
    external?: boolean
  }[]
}

export interface SocialLink {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'github'
  href: string
  label?: string
}

export interface LegalLink {
  label: string
  href: string
}

export interface FooterProps {
  // Links
  links?: FooterSection[]

  // Social media
  social?: SocialLink[]

  // Newsletter signup
  newsletter?: boolean
  onNewsletterSubmit?: (email: string) => void

  // Legal
  legal?: LegalLink[]

  // Copyright
  copyright?: string

  // Styling
  className?: string
}

export interface MobileMenuProps {
  // State
  open: boolean
  onClose: () => void

  // Navigation items
  nav: NavItem[]

  // CTA
  cta?: {
    label: string
    onClick: () => void
  }

  // Logo (optional, for menu header)
  logo?: React.ReactNode
}

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

export type HeroSize = 'md' | 'lg' | 'xl'
export type HeroAlign = 'left' | 'center'
export type HeroBackground = 'white' | 'forest' | 'gradient' | 'image'

export interface HeroProps {
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
  video?: string

  // Layout
  align?: HeroAlign
  size?: HeroSize

  // Background
  background?: HeroBackground
  backgroundImage?: string

  // Styling
  className?: string
}

export type CTAVariant = 'default' | 'gradient' | 'image'
export type CTASize = 'md' | 'lg'

export interface CTASectionProps {
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
  variant?: CTAVariant
  backgroundImage?: string

  // Size
  size?: CTASize

  // Styling
  className?: string
}

// ============================================================================
// FEATURE COMPONENTS
// ============================================================================

export type FeatureCardVariant = 'horizontal' | 'vertical'

export interface FeatureCardProps {
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
  variant?: FeatureCardVariant

  // Styling
  className?: string
}

export interface FeatureGridProps {
  // Features
  features: FeatureCardProps[]

  // Layout
  columns?: 2 | 3 | 4

  // Styling
  className?: string
}

// ============================================================================
// TESTIMONIAL COMPONENTS
// ============================================================================

export interface Testimonial {
  quote: string
  author: {
    name: string
    title?: string
    company?: string
    avatar?: string
  }
  rating?: 1 | 2 | 3 | 4 | 5
}

export type TestimonialVariant = 'default' | 'featured' | 'compact'

export interface TestimonialCardProps extends Testimonial {
  // Variant
  variant?: TestimonialVariant

  // Styling
  className?: string
}

export interface TestimonialGridProps {
  // Testimonials
  testimonials: Testimonial[]

  // Layout
  columns?: 1 | 2 | 3

  // Styling
  className?: string
}

// ============================================================================
// FAQ COMPONENTS
// ============================================================================

export interface FAQItem {
  question: string
  answer: string | React.ReactNode
}

export interface FAQAccordionProps {
  // Items
  items: FAQItem[]

  // Allow multiple open at once
  multiple?: boolean

  // Default open items (by index)
  defaultOpen?: number[]

  // Styling
  className?: string
}

// ============================================================================
// MODAL & DIALOG COMPONENTS
// ============================================================================

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ModalProps {
  // State
  open: boolean
  onClose: () => void

  // Content slots
  header?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode

  // Size
  size?: ModalSize

  // Behavior
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean

  // Styling
  className?: string

  // Accessibility
  'aria-label'?: string
  'aria-describedby'?: string
}

// ============================================================================
// LOADING & FEEDBACK COMPONENTS
// ============================================================================

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface SpinnerProps {
  // Size
  size?: SpinnerSize

  // Color (defaults to current text color)
  color?: string

  // Styling
  className?: string

  // Accessibility
  'aria-label'?: string
}

export type AlertVariant = 'success' | 'error' | 'warning' | 'info'

export interface AlertProps {
  // Variant
  variant: AlertVariant

  // Content
  title?: string
  children: React.ReactNode

  // Actions
  action?: {
    label: string
    onClick: () => void
  }

  // Dismissible
  dismissible?: boolean
  onDismiss?: () => void

  // Icon
  icon?: React.ReactNode

  // Styling
  className?: string
}

export interface ToastProps extends AlertProps {
  // Toast-specific
  id: string
  duration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

// ============================================================================
// SKELETON & LOADING STATES
// ============================================================================

export interface SkeletonProps {
  // Shape
  variant?: 'text' | 'circular' | 'rectangular'

  // Dimensions
  width?: string | number
  height?: string | number

  // Animation
  animation?: 'pulse' | 'wave' | 'none'

  // Styling
  className?: string
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Common HTML attributes that might be needed
export interface CommonHTMLProps {
  id?: string
  className?: string
  style?: React.CSSProperties
  tabIndex?: number
  role?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

// Responsive value type
export type Responsive<T> = T | { xs?: T; sm?: T; md?: T; lg?: T; xl?: T }

// Color palette type
export type ColorPalette = 'forestGreen' | 'softLime' | 'neutral' | 'success' | 'error' | 'warning' | 'info'
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

// Spacing type (based on Tailwind spacing scale)
export type Spacing = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52 | 56 | 60 | 64 | 72 | 80 | 96

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export common React types for convenience
export type {
  ReactNode,
  ReactElement,
  ComponentType,
  FC,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from 'react'
