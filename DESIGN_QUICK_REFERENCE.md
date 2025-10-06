# Gray Liquid Glass - Quick Reference
## Copy-Paste Component Styles

---

## 🎨 CSS Variables Available

### Colors
```css
/* Gray Liquid Glass Spectrum */
var(--liquid-glass-050)  /* Barely-there mist */
var(--liquid-glass-100)  /* Delicate fog */
var(--liquid-glass-200)  /* Light vapor */
var(--liquid-glass-250)  /* Subtle transition */
var(--liquid-glass-300)  /* Soft liquid */
var(--liquid-glass-400)  /* Medium liquid */
var(--liquid-glass-500)  /* Core liquid */
var(--liquid-glass-600)  /* Deep liquid */
var(--liquid-glass-700)  /* Rich water */

/* Emerald Accents (use sparingly!) */
var(--emerald-accent-subtle)   /* 0.08 opacity */
var(--emerald-accent-soft)     /* 0.15 opacity */
var(--emerald-accent-medium)   /* 0.25 opacity */
var(--emerald-accent-strong)   /* 0.40 opacity */
var(--emerald-accent-glow)     /* 0.20 opacity, lighter */
```

### Effects
```css
/* Blur Levels */
var(--blur-whisper)   /* 8px - ultra delicate */
var(--blur-soft)      /* 16px - buttons, inputs */
var(--blur-medium)    /* 24px - cards */
var(--blur-heavy)     /* 32px - primary cards */
var(--blur-ultra)     /* 48px - sidebar, modals */

/* Saturation */
var(--saturate-subtle)   /* 150% */
var(--saturate-medium)   /* 180% */
var(--saturate-strong)   /* 200% */

/* Shadows */
var(--shadow-surface)         /* Inner glow */
var(--shadow-inner-glow)      /* Subtle inner light */
var(--shadow-xs)              /* Minimal elevation */
var(--shadow-sm)              /* Small elevation */
var(--shadow-md)              /* Medium elevation */
var(--shadow-lg)              /* Large elevation */
var(--shadow-xl)              /* Extra large elevation */
var(--shadow-emerald-subtle)  /* Emerald glow - soft */
var(--shadow-emerald-medium)  /* Emerald glow - medium */
var(--shadow-emerald-strong)  /* Emerald glow - strong */

/* Borders */
var(--border-whisper)         /* 0.5px, ultra subtle */
var(--border-soft)            /* 1px, standard */
var(--border-medium)          /* 1px, visible */
var(--border-strong)          /* 1px, prominent */
var(--border-emerald-subtle)  /* Emerald border */
var(--border-emerald-glow)    /* Emerald glow border */

/* Sizing */
var(--radius-sm)     /* 8px */
var(--radius-md)     /* 12px */
var(--radius-lg)     /* 16px */
var(--radius-xl)     /* 20px */
var(--radius-2xl)    /* 24px */

/* Transitions */
var(--transition-instant)  /* 100ms */
var(--transition-fast)     /* 150ms */
var(--transition-normal)   /* 250ms */
var(--transition-slow)     /* 350ms */
```

---

## 📦 Component Classes (Copy & Paste)

### Primary Button (Emerald - CTA Only)
```tsx
className="
  h-[36px] px-4 py-2 text-sm
  bg-emerald-500/85 text-white
  backdrop-blur-[var(--blur-soft)] backdrop-saturate-[var(--saturate-medium)]
  border border-emerald-400/20
  shadow-[var(--shadow-sm),var(--shadow-surface)]
  rounded-[var(--radius-md)]
  transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
  hover:bg-emerald-500/95
  hover:shadow-[var(--shadow-md),var(--shadow-emerald-subtle),var(--shadow-inner-glow)]
  hover:border-emerald-400/30
  hover:-translate-y-[1px] hover:scale-[1.005]
  active:translate-y-0 active:scale-[0.995]
  focus-visible:ring-2 focus-visible:ring-emerald-400/40
"
```

### Secondary Button (Gray Liquid)
```tsx
className="
  h-[36px] px-4 py-2 text-sm
  bg-[var(--liquid-glass-300)] text-white
  backdrop-blur-[var(--blur-soft)] backdrop-saturate-[var(--saturate-medium)]
  border border-[var(--border-soft)]
  shadow-[var(--shadow-xs),var(--shadow-surface)]
  rounded-[var(--radius-md)]
  transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
  hover:bg-[var(--liquid-glass-400)]
  hover:shadow-[var(--shadow-sm),var(--shadow-inner-glow)]
  hover:border-[var(--border-medium)]
  hover:-translate-y-[1px] hover:scale-[1.005]
  active:translate-y-0 active:scale-[0.995]
  focus-visible:ring-2 focus-visible:ring-white/25
"
```

### Ghost Button (Whisper Glass)
```tsx
className="
  h-[36px] px-4 py-2 text-sm
  bg-[var(--liquid-glass-100)] text-white/90
  backdrop-blur-[var(--blur-whisper)] backdrop-saturate-[var(--saturate-subtle)]
  border border-[var(--border-whisper)]
  shadow-[var(--shadow-surface)]
  rounded-[var(--radius-md)]
  transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
  hover:bg-[var(--liquid-glass-200)]
  hover:shadow-[var(--shadow-xs)]
  hover:border-[var(--border-soft)]
  hover:-translate-y-[0.5px] hover:scale-[1.003]
  active:translate-y-0 active:scale-[0.998]
  focus-visible:ring-2 focus-visible:ring-white/20
"
```

### Input Field
```tsx
className="
  h-[36px] w-full px-3 py-2 text-sm
  bg-[var(--liquid-glass-200)]
  backdrop-blur-[var(--blur-soft)] backdrop-saturate-[var(--saturate-medium)]
  border border-[var(--border-soft)]
  shadow-[var(--shadow-xs),var(--shadow-surface)]
  rounded-[var(--radius-md)]
  text-white placeholder:text-white/40
  transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
  focus-visible:outline-none
  focus-visible:ring-2 focus-visible:ring-emerald-400/30
  focus-visible:bg-[var(--liquid-glass-300)]
  focus-visible:border-[var(--border-emerald-subtle)]
  focus-visible:shadow-[var(--shadow-sm),var(--shadow-emerald-subtle),var(--shadow-inner-glow)]
  hover:bg-[var(--liquid-glass-250)]
  hover:border-[var(--border-medium)]
"
```

### Card (Medium Liquid)
```tsx
className="
  p-5 flex flex-col gap-5
  bg-[var(--liquid-glass-400)]
  backdrop-blur-[var(--blur-heavy)] backdrop-saturate-[var(--saturate-strong)]
  border border-[var(--border-medium)]
  shadow-[var(--shadow-lg),var(--shadow-inner-glow)]
  rounded-[var(--radius-lg)]
  text-white
  transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
  hover:shadow-[var(--shadow-xl),var(--shadow-inner-glow)]
  hover:-translate-y-[2px]
"
```

### Sidebar/Navigation Container
```tsx
className="
  bg-[var(--liquid-glass-500)]
  backdrop-blur-[var(--blur-ultra)] backdrop-saturate-[var(--saturate-strong)]
  border-r border-[var(--border-medium)]
  shadow-[var(--shadow-xl),var(--shadow-inner-glow)]
  transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
"
```

### Navigation Item (Inactive)
```tsx
className="
  px-3 py-2 rounded-[var(--radius-md)]
  text-white/80 text-sm
  transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
  hover:bg-[var(--liquid-glass-300)]
  hover:shadow-[var(--shadow-xs),var(--shadow-surface)]
  hover:text-white
  hover:-translate-y-[0.5px]
"
```

### Navigation Item (Active - Emerald Accent)
```tsx
className="
  px-3 py-2 rounded-[var(--radius-md)]
  bg-[var(--emerald-accent-soft)]
  text-white font-medium text-sm
  shadow-[var(--shadow-sm),var(--shadow-emerald-subtle),var(--shadow-surface)]
  border border-[var(--border-emerald-subtle)]
"
```

### Topbar/Header
```tsx
className="
  px-6 py-4
  bg-[var(--liquid-glass-400)]
  backdrop-blur-[var(--blur-ultra)] backdrop-saturate-[var(--saturate-strong)]
  border-b border-[var(--border-medium)]
  shadow-[var(--shadow-lg),var(--shadow-inner-glow)]
  transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
"
```

### Modal/Popover
```tsx
className="
  p-5
  bg-[var(--liquid-glass-500)]
  backdrop-blur-[var(--blur-ultra)] backdrop-saturate-[var(--saturate-strong)]
  border border-[var(--border-medium)]
  shadow-[var(--shadow-xl),var(--shadow-inner-glow)]
  rounded-[var(--radius-2xl)]
"
```

### Badge/Chip (Subtle)
```tsx
className="
  px-3 py-1.5 text-sm
  bg-[var(--liquid-glass-200)]
  backdrop-blur-[var(--blur-soft)] backdrop-saturate-[var(--saturate-medium)]
  border border-[var(--border-soft)]
  shadow-[var(--shadow-xs),var(--shadow-surface)]
  rounded-[var(--radius-md)]
  text-white/70
"
```

### Emerald Success Badge
```tsx
className="
  px-3 py-1.5 text-sm
  bg-[var(--emerald-accent-soft)]
  backdrop-blur-[var(--blur-soft)] backdrop-saturate-[var(--saturate-medium)]
  border border-[var(--border-emerald-subtle)]
  shadow-[var(--shadow-sm),var(--shadow-emerald-subtle)]
  rounded-[var(--radius-md)]
  text-white font-medium
"
```

---

## 🎯 Common Patterns

### Hover Effect (Delicate Lift)
```css
hover:-translate-y-[1px] hover:scale-[1.005]
```

### Active/Press Effect
```css
active:translate-y-0 active:scale-[0.995]
```

### Focus Ring (Emerald)
```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-emerald-400/30
focus-visible:ring-offset-0
```

### Focus Ring (Neutral)
```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-white/25
focus-visible:ring-offset-0
```

### Standard Transition
```css
transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
```

### Slow Transition (Cards, Containers)
```css
transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]
```

---

## 🚦 Decision Tree

### "Should I use emerald?"

**YES** - Use emerald if:
- ✅ Primary CTA button
- ✅ Active/selected navigation state
- ✅ Success indicator
- ✅ Focus ring
- ✅ Key metric highlight

**NO** - Use gray liquid if:
- ❌ General button
- ❌ Input field
- ❌ Card background
- ❌ Border (unless active)
- ❌ Hover state (use gray lift)
- ❌ Body text

### "Which blur level?"

- **whisper (8px)** → Ghost buttons, subtle overlays
- **soft (16px)** → Buttons, inputs, small elements
- **medium (24px)** → Secondary cards
- **heavy (32px)** → Primary cards, important containers
- **ultra (48px)** → Sidebar, topbar, modals, full-page overlays

### "Which shadow?"

- **xs** → Minimal hover states
- **sm** → Buttons, small elements
- **md** → Active states, medium emphasis
- **lg** → Cards, containers
- **xl** → Modals, sidebars, major surfaces

---

## 📏 Sizing Guide

### Heights
```
Button SM:   32px
Button MD:   36px
Button LG:   40px
Input:       36px
Nav Item:    auto (px-3 py-2)
```

### Padding/Spacing
```
Compact:     px-3 py-1.5
Standard:    px-4 py-2
Generous:    px-5 py-2.5
Card:        p-5
Container:   p-6
```

### Border Radius
```
Subtle:      8px  (radius-sm)
Standard:    12px (radius-md)
Card:        16px (radius-lg)
Large:       20px (radius-xl)
Modal:       24px (radius-2xl)
```

### Gaps
```
Tight:       gap-1   (4px)
Standard:    gap-2   (8px)
Comfortable: gap-3   (12px)
Spacious:    gap-4   (16px)
Card:        gap-5   (20px)
```

---

## 🎨 Color Combinations

### For Buttons
```
Primary:    emerald-500/85 + border emerald-400/20
Secondary:  liquid-glass-300 + border-soft
Ghost:      liquid-glass-100 + border-whisper
Outline:    liquid-glass-050 + border-medium
```

### For Surfaces
```
Input:      liquid-glass-200
Card:       liquid-glass-400
Sidebar:    liquid-glass-500
Popover:    liquid-glass-500
Badge:      liquid-glass-200
```

### For Borders
```
Inactive:   border-soft or border-whisper
Hover:      border-medium
Active:     border-emerald-subtle (if emerald accent)
```

---

This quick reference provides everything you need to build consistent, refined liquid glass UI components. Copy, paste, and customize as needed!
