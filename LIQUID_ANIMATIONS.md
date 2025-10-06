# Liquid Glass Micro-Animations
## Water-Like Interactions & Motion

---

## 🌊 Animation Philosophy

Every interaction should feel like **liquid responding to touch** - smooth, fluid, with subtle resistance and natural flow. Think of water droplets, surface tension, and light refraction through glass.

---

## 🎬 Core Animation Principles

### 1. Easing Curves (Water Physics)
```css
/* Standard smooth curve - most interactions */
cubic-bezier(0.4, 0, 0.2, 1)

/* Gentle acceleration - subtle starts */
cubic-bezier(0.4, 0, 0.6, 1)

/* Spring bounce - playful interactions */
cubic-bezier(0.34, 1.56, 0.64, 1)

/* Ease out - natural deceleration */
cubic-bezier(0, 0, 0.2, 1)
```

### 2. Duration Guidelines
```css
/* Instant - state changes */
100ms - Immediate feedback (toggles, checkboxes)

/* Fast - micro-interactions */
150ms - Button presses, small hover effects

/* Normal - standard interactions */
250ms - Most hover states, transforms, color changes

/* Slow - surface movements */
350ms - Card hovers, container shifts, modal entries
```

---

## 💧 Hover Animations

### Standard Liquid Lift
```tsx
// Small elements (buttons, inputs)
className="
  transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
  hover:-translate-y-[1px] hover:scale-[1.005]
"
```

### Delicate Whisper Lift
```tsx
// Subtle elements (ghost buttons, nav items)
className="
  transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
  hover:-translate-y-[0.5px] hover:scale-[1.003]
"
```

### Prominent Float
```tsx
// Large surfaces (cards, containers)
className="
  transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
  hover:-translate-y-[2px] hover:scale-[1.01]
"
```

### Liquid Shadow Expansion
```tsx
// Shadow grows with hover (adds depth)
className="
  shadow-[var(--shadow-sm)]
  hover:shadow-[var(--shadow-md),var(--shadow-inner-glow)]
  transition-shadow duration-[250ms]
"
```

---

## 🎯 Active/Press Animations

### Gentle Press (Standard)
```tsx
className="
  active:translate-y-0 active:scale-[0.995]
  active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)]
  transition-all duration-[100ms]
"
```

### Subtle Press (Delicate elements)
```tsx
className="
  active:translate-y-0 active:scale-[0.998]
  active:shadow-[inset_0_1px_4px_rgba(0,0,0,0.06)]
  transition-all duration-[100ms]
"
```

### Firm Press (Prominent CTAs)
```tsx
className="
  active:translate-y-[0.5px] active:scale-[0.99]
  active:shadow-[inset_0_3px_12px_rgba(0,0,0,0.12)]
  transition-all duration-[100ms]
"
```

---

## ✨ Focus Animations

### Emerald Focus Ring (Primary interactions)
```tsx
className="
  focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-emerald-400/30
  focus-visible:ring-offset-0
  transition-all duration-[150ms]
"
```

### Neutral Focus Ring (Secondary)
```tsx
className="
  focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-white/25
  focus-visible:ring-offset-0
  transition-all duration-[150ms]
"
```

### Focus with Glow
```tsx
className="
  focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-emerald-400/40
  focus-visible:shadow-[var(--shadow-emerald-medium)]
  transition-all duration-[150ms]
"
```

---

## 🌈 Color Transitions

### Background Fade (Liquid Fill)
```tsx
className="
  bg-[var(--liquid-glass-200)]
  hover:bg-[var(--liquid-glass-300)]
  transition-colors duration-[250ms]
"
```

### Border Glow (Emerald Accent)
```tsx
className="
  border border-[var(--border-soft)]
  hover:border-[var(--border-emerald-subtle)]
  transition-colors duration-[250ms]
"
```

### Multi-Property Smooth
```tsx
className="
  bg-[var(--liquid-glass-200)] border border-[var(--border-soft)]
  hover:bg-[var(--liquid-glass-300)] hover:border-[var(--border-medium)]
  transition-all duration-[250ms]
"
```

---

## 💫 Advanced Liquid Effects

### Ripple on Click
```tsx
// Framer Motion variant
const rippleVariants = {
  initial: { scale: 0, opacity: 0.6 },
  animate: {
    scale: 1.5,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}

// Usage in component
<motion.div
  variants={rippleVariants}
  initial="initial"
  animate="animate"
  className="absolute inset-0 bg-white/20 rounded-[var(--radius-md)]"
/>
```

### Liquid Wave Hover
```tsx
// Framer Motion - wave effect on hover
const waveVariants = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  },
  hover: {
    scale: 1.005,
    y: -1,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  }
}

<motion.div
  variants={waveVariants}
  initial="rest"
  whileHover="hover"
>
  {/* Content */}
</motion.div>
```

### Shimmer Effect (Loading)
```tsx
// Tailwind animation
className="
  relative overflow-hidden
  before:absolute before:inset-0
  before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
  before:translate-x-[-100%]
  before:animate-[shimmer_2s_ease-in-out_infinite]
"

// In tailwind.config.js
keyframes: {
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' }
  }
}
```

### Blur Pulse (Attention)
```tsx
// Framer Motion - breathing blur effect
const pulseVariants = {
  initial: {
    backdropFilter: 'blur(var(--blur-soft))'
  },
  animate: {
    backdropFilter: [
      'blur(var(--blur-soft))',
      'blur(var(--blur-medium))',
      'blur(var(--blur-soft))'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}
```

---

## 🎨 State Transitions

### Loading → Success (Emerald Bloom)
```tsx
// State-based animation
const stateVariants = {
  loading: {
    scale: 0.95,
    opacity: 0.6,
    backgroundColor: 'var(--liquid-glass-300)',
    transition: { duration: 0.15 }
  },
  success: {
    scale: 1,
    opacity: 1,
    backgroundColor: 'var(--emerald-accent-soft)',
    transition: {
      duration: 0.4,
      ease: [0.34, 1.56, 0.64, 1] // Spring bounce
    }
  }
}
```

### Expand/Collapse (Accordion)
```tsx
// Framer Motion accordion
const accordionVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    }
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.25, ease: [0.4, 0, 0.2, 1], delay: 0.1 }
    }
  }
}
```

### Modal Entry (Liquid Rise)
```tsx
// Modal appearance animation
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 }
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}
```

---

## 🔄 Continuous Animations

### Gentle Float (Idle state)
```tsx
// Framer Motion - subtle floating
const floatVariants = {
  animate: {
    y: [0, -3, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}
```

### Liquid Glow Pulse
```tsx
// Pulsing glow effect
const glowVariants = {
  animate: {
    boxShadow: [
      'var(--shadow-sm)',
      'var(--shadow-md), var(--shadow-emerald-subtle)',
      'var(--shadow-sm)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}
```

### Rotate Spinner (Loading)
```css
/* Tailwind spin with custom speed */
className="animate-spin"

/* Custom gentle rotation */
@keyframes gentle-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

className="animate-[gentle-spin_1.5s_linear_infinite]"
```

---

## 🎯 Interactive Patterns

### Button Click Sequence
```tsx
// 1. Hover: Lift + glow
className="
  hover:-translate-y-[1px]
  hover:scale-[1.005]
  hover:shadow-[var(--shadow-md),var(--shadow-inner-glow)]
"

// 2. Active: Press down
className="
  active:translate-y-0
  active:scale-[0.995]
  active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)]
"

// 3. Focus: Emerald ring
className="
  focus-visible:ring-2
  focus-visible:ring-emerald-400/30
"

// All combined with transitions
className="
  transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
"
```

### Card Hover Sequence
```tsx
// 1. Hover: Float + expand shadow
className="
  hover:-translate-y-[2px]
  hover:shadow-[var(--shadow-xl),var(--shadow-inner-glow)]
"

// 2. Nested button reveals on card hover
className="
  opacity-0 translate-y-1
  group-hover:opacity-100 group-hover:translate-y-0
  transition-all duration-[300ms] delay-75
"
```

### Input Focus Sequence
```tsx
// 1. Focus: Border + ring + shadow
className="
  focus-visible:border-[var(--border-emerald-subtle)]
  focus-visible:ring-2 focus-visible:ring-emerald-400/30
  focus-visible:shadow-[var(--shadow-sm),var(--shadow-emerald-subtle)]
"

// 2. Background lightens
className="
  focus-visible:bg-[var(--liquid-glass-300)]
"

// 3. All animated smoothly
className="
  transition-all duration-[250ms]
"
```

---

## 🌟 Special Effects

### Glass Reflection Shift
```css
/* Pseudo-element that shifts on hover */
.glass-element::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(255,255,255,0.1) 0%,
    rgba(255,255,255,0) 50%,
    rgba(255,255,255,0.05) 100%
  );
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-100%);
}

.glass-element:hover::before {
  transform: translateX(100%);
}
```

### Liquid Border Flow
```css
/* Animated border gradient */
@keyframes border-flow {
  0%, 100% {
    border-color: var(--border-soft);
  }
  50% {
    border-color: var(--border-emerald-subtle);
  }
}

.flowing-border {
  animation: border-flow 3s ease-in-out infinite;
}
```

### Depth Shift on Scroll
```tsx
// Framer Motion - parallax depth
const { scrollY } = useScroll()
const y = useTransform(scrollY, [0, 300], [0, -50])
const blur = useTransform(scrollY, [0, 300], ['blur(0px)', 'blur(8px)'])

<motion.div
  style={{ y, backdropFilter: blur }}
  className="bg-[var(--liquid-glass-400)]"
>
  {/* Content */}
</motion.div>
```

---

## 📱 Mobile Touch Feedback

### Touch Ripple
```tsx
// React state for touch feedback
const [ripples, setRipples] = useState([])

const handleTouch = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.touches[0].clientX - rect.left
  const y = e.touches[0].clientY - rect.top

  setRipples([...ripples, { x, y, id: Date.now() }])

  setTimeout(() => {
    setRipples(prev => prev.slice(1))
  }, 600)
}

// Render ripples
{ripples.map(ripple => (
  <motion.span
    key={ripple.id}
    initial={{ scale: 0, opacity: 0.6 }}
    animate={{ scale: 2, opacity: 0 }}
    transition={{ duration: 0.6 }}
    style={{ left: ripple.x, top: ripple.y }}
    className="absolute w-24 h-24 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
  />
))}
```

### Active Press Feedback
```css
/* iOS-style press down */
@media (hover: none) {
  .touch-button:active {
    transform: scale(0.95);
    background: var(--liquid-glass-400);
    transition: all 100ms ease-out;
  }
}
```

---

## 🎬 Animation Timing Reference

```
State Change:     100ms - Instant feedback
Micro-Interaction: 150ms - Quick response
Hover Effect:     250ms - Smooth transition
Card Movement:    350ms - Deliberate motion
Modal Entry:      400ms - Graceful appearance
Page Transition:  500ms - Cinematic flow
```

---

## 💡 Pro Tips

1. **Layer animations** - Combine transform, shadow, and color for rich interactions
2. **Stagger delays** - Use `delay-75`, `delay-100` for sequential reveals
3. **Group interactions** - Use `group-hover:` for parent-child effects
4. **Reduce motion** - Respect `prefers-reduced-motion` for accessibility
5. **GPU acceleration** - Use `transform` and `opacity` for smooth 60fps
6. **Test on device** - Mobile animations feel different than desktop

---

Every animation should enhance the liquid glass aesthetic - smooth, fluid, with natural physics and delicate refinement. Make water jealous.
