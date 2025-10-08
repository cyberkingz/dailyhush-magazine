# iOS Liquid Glass Design Patterns - Quick Reference

Use these exact Tailwind patterns for consistent tropical luxury spa + iOS aesthetic.

---

## Glass Morphism Base Pattern

### Standard Glass Card
```tsx
className="
  bg-white/60
  backdrop-blur-xl
  rounded-3xl
  shadow-[0_8px_32px_rgba(16,185,129,0.08)]
  ring-1
  ring-white/40
"
```

### Glass Card with Hover (Interactive)
```tsx
className="
  bg-white/60
  backdrop-blur-xl
  rounded-3xl
  shadow-[0_8px_32px_rgba(16,185,129,0.08)]
  ring-1
  ring-white/40
  hover:shadow-[0_12px_48px_rgba(16,185,129,0.12)]
  hover:-translate-y-1
  transition-all
  duration-500
"
```

### Amber-Tinted Glass
```tsx
className="
  bg-amber-50/60
  backdrop-blur-xl
  rounded-3xl
  shadow-[0_8px_24px_rgba(245,158,11,0.1)]
  ring-1
  ring-white/40
"
```

---

## Button Patterns

### Primary CTA (Amber Glow Pill)
```tsx
className="
  bg-amber-500
  hover:bg-amber-600
  text-white
  font-bold
  py-3
  px-6
  rounded-full
  shadow-[0_4px_20px_rgba(245,158,11,0.4)]
  hover:shadow-[0_6px_28px_rgba(245,158,11,0.5)]
  hover:scale-105
  active:scale-95
  transition-all
"
```

### Badge/Tag with Glow
```tsx
className="
  bg-amber-500
  text-white
  text-xs
  md:text-sm
  font-semibold
  px-2.5
  md:px-3
  py-1
  rounded-full
  shadow-[0_4px_16px_rgba(245,158,11,0.4)]
"
```

---

## Image Container Patterns

### Product Image (Floating in Lagoon)
```tsx
<div className="
  aspect-square
  flex items-center justify-center
  rounded-3xl
  overflow-hidden
  bg-gradient-to-br from-white/70 via-emerald-50/60 to-amber-50/50
  shadow-[0_8px_32px_rgba(16,185,129,0.12),0_16px_48px_rgba(245,158,11,0.08)]
  ring-1
  ring-white/40
  backdrop-blur-xl
  relative
">
  {/* Inner glow layer */}
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-amber-400/10 blur-2xl"></div>

  {/* Image */}
  <img
    src="..."
    alt="..."
    className="w-full h-full object-cover relative z-10"
  />
</div>
```

### Feature Image (Simple Glass)
```tsx
className="
  aspect-square
  flex items-center justify-center
  rounded-3xl
  overflow-hidden
  bg-gradient-to-br from-white/70 via-emerald-50/60 to-teal-50/50
  shadow-[0_8px_24px_rgba(16,185,129,0.1)]
  ring-1
  ring-white/40
  backdrop-blur-md
"
```

---

## FAQ/Accordion Pattern

```tsx
<details className="
  group
  bg-white/60
  backdrop-blur-xl
  rounded-2xl
  border border-emerald-200/30
  shadow-[0_4px_16px_rgba(16,185,129,0.06)]
  ring-1
  ring-white/30
  hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)]
  transition-all
  duration-300
">
  <summary className="
    cursor-pointer
    list-none
    p-4 md:p-6
    font-semibold
    text-emerald-900
    hover:text-amber-700
    transition
    text-sm md:text-base
  ">
    Question text
    <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
  </summary>
  <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
    Answer text
  </div>
</details>
```

---

## Testimonial/Quote Pattern

```tsx
<div className="
  border-l-4
  border-amber-500
  p-6
  bg-amber-50/60
  backdrop-blur-xl
  rounded-r-2xl
  shadow-[0_4px_16px_rgba(245,158,11,0.08)]
  ring-1
  ring-white/30
">
  <p className="text-emerald-800/90 italic">
    "Quote text here"
  </p>
  <p className="text-sm text-emerald-700/70 mt-3">— Attribution</p>
</div>
```

---

## Icon with Glow Pattern

```tsx
<div className="
  w-12
  h-12
  bg-amber-500
  rounded-full
  flex items-center justify-center
  flex-shrink-0
  shadow-[0_4px_20px_rgba(245,158,11,0.4)]
">
  <Shield className="w-6 h-6 text-white" />
</div>
```

---

## Background Pattern (Page-Level)

```tsx
<main className="
  flex-1
  bg-gradient-to-br from-emerald-50/20 via-white to-amber-50/10
  relative
  overflow-hidden
">
  {/* Organic Background Blobs */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
    <div className="absolute top-60 right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
    <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl"></div>
  </div>

  {/* Content needs relative z-10 */}
  <div className="relative z-10">
    {/* Your content */}
  </div>
</main>
```

---

## Mobile Sticky Bar Pattern

```tsx
<div className="
  md:hidden
  fixed bottom-0 left-0 right-0
  bg-white/80
  backdrop-blur-2xl
  border-t border-emerald-200/30
  p-4
  shadow-[0_-8px_32px_rgba(16,185,129,0.12)]
  ring-1
  ring-white/20
  z-50
">
  {/* Content */}
</div>
```

---

## Typography Patterns

### Heading with Tight Leading
```tsx
className="text-3xl font-bold text-emerald-900 mb-4 leading-[1.2]"
```

### Large Body Text (Spacious)
```tsx
className="text-lg text-emerald-800 mb-4 leading-[1.7]"
```

### Regular Body Text
```tsx
className="text-emerald-700/80 leading-[1.6]"
```

### Small Text
```tsx
className="text-sm text-emerald-800/80 leading-[1.6]"
```

---

## Shadow Cheat Sheet

### Emerald Glow (Content/Cards)
```css
/* Light */
shadow-[0_4px_16px_rgba(16,185,129,0.06)]

/* Medium */
shadow-[0_8px_32px_rgba(16,185,129,0.08)]

/* Hover */
shadow-[0_12px_48px_rgba(16,185,129,0.12)]
```

### Amber Glow (CTAs/Highlights)
```css
/* Soft */
shadow-[0_4px_16px_rgba(245,158,11,0.08)]

/* Medium */
shadow-[0_8px_24px_rgba(245,158,11,0.1)]

/* Badge */
shadow-[0_4px_16px_rgba(245,158,11,0.15)]

/* Button */
shadow-[0_4px_20px_rgba(245,158,11,0.4)]

/* Button Hover */
shadow-[0_6px_28px_rgba(245,158,11,0.5)]
```

### Product Image (Layered)
```css
shadow-[0_8px_32px_rgba(16,185,129,0.12),0_16px_48px_rgba(245,158,11,0.08)]
```

---

## Opacity Scale

### Backgrounds
- `bg-white/60` - Standard glass
- `bg-white/70` - Stronger glass
- `bg-white/80` - Mobile sticky bars
- `bg-emerald-50/60` - Tinted glass
- `bg-amber-50/60` - Warm tinted glass

### Organic Blobs
- `bg-emerald-500/5` - Very subtle background shapes
- `bg-amber-500/5` - Very subtle background shapes

### Rings (Shimmer)
- `ring-white/30` - Subtle shimmer
- `ring-white/40` - Standard iOS shimmer

---

## Spacing Scale (Breathing Room)

### Card/Section Spacing
```tsx
mb-20          // Large section gaps
space-y-4      // Between FAQ items (mobile)
space-y-5      // Between FAQ items (desktop)
p-8 md:p-10    // Card padding with responsive increase
```

### Typography Spacing
```tsx
mb-4           // After headings
mb-6           // After paragraphs before lists
mb-8 md:mb-10  // After section titles
```

---

## Animation Timing

### Smooth Card Transitions
```tsx
transition-all duration-500
```

### Quick Interactive Feedback
```tsx
transition-all duration-300
```

### Generic Smooth Transitions
```tsx
transition-all  // Uses default timing
```

---

## Transform Patterns

### Hover Lift
```tsx
hover:-translate-y-1  // Move up 4px
```

### Scale Grow
```tsx
hover:scale-105  // 5% larger
```

### Scale Shrink (Active Press)
```tsx
active:scale-95  // 5% smaller
```

### Rotate (Dropdown Arrow)
```tsx
group-open:rotate-180
```

---

## Complete Component Example

### Glass Feature Card with All Effects
```tsx
<div className="
  p-8 md:p-10
  mb-20
  bg-white/60
  backdrop-blur-xl
  rounded-3xl
  shadow-[0_8px_32px_rgba(16,185,129,0.08)]
  ring-1
  ring-white/40
  hover:shadow-[0_12px_48px_rgba(16,185,129,0.12)]
  transition-all
  duration-500
  hover:-translate-y-1
">
  <div className="grid md:grid-cols-2 gap-12 items-center">
    <div className="order-2 md:order-1">
      <div className="
        aspect-square
        flex items-center justify-center
        rounded-3xl
        overflow-hidden
        bg-gradient-to-br from-white/70 via-emerald-50/60 to-teal-50/50
        shadow-[0_8px_24px_rgba(16,185,129,0.1)]
        ring-1
        ring-white/40
        backdrop-blur-md
      ">
        <img src="..." alt="..." className="w-full h-full object-cover" />
      </div>
    </div>
    <div className="order-1 md:order-2">
      <h2 className="text-3xl font-bold text-emerald-900 mb-4 leading-[1.2]">
        Heading
      </h2>
      <p className="text-lg text-emerald-800 mb-4 leading-[1.7]">
        Large body text
      </p>
      <p className="text-emerald-700/80 mb-6 leading-[1.6]">
        Regular body text
      </p>
    </div>
  </div>
</div>
```

---

## Color Reference

### Emerald Palette
- `emerald-900` - Darkest text/headers
- `emerald-800` - Body text
- `emerald-700` - Secondary text
- `emerald-600` - Muted elements
- `emerald-500` - Organic blobs (5% opacity)
- `emerald-400` - Inner glows (10% opacity)
- `emerald-200` - Borders (30-40% opacity)
- `emerald-50` - Glass tints (60% opacity)

### Amber Palette
- `amber-700` - Bold accent text
- `amber-600` - Icon accents
- `amber-500` - Solid CTAs, badges, icons
- `amber-400` - Borders (30% opacity)
- `amber-200` - Light borders
- `amber-50` - Glass tints (60% opacity)

### Grayscale
- `white` - Base color (60-80% opacity for glass)
- Rings/shimmer: white at 30-40% opacity

---

## Quick Copy-Paste Snippets

**Standard Glass Card:**
```
bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(16,185,129,0.08)] ring-1 ring-white/40
```

**Hoverable Glass Card:**
```
bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(16,185,129,0.08)] ring-1 ring-white/40 hover:shadow-[0_12px_48px_rgba(16,185,129,0.12)] hover:-translate-y-1 transition-all duration-500
```

**Amber CTA Button:**
```
bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all
```

**Amber Badge:**
```
bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-[0_4px_16px_rgba(245,158,11,0.4)]
```

**Image Container:**
```
aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-white/70 via-emerald-50/60 to-teal-50/50 shadow-[0_8px_24px_rgba(16,185,129,0.1)] ring-1 ring-white/40 backdrop-blur-md
```

---

Use these patterns throughout your project to maintain the **tropical luxury spa + iOS liquid design** aesthetic consistently!
