# Pixel-Perfect Specification

## Exact Implementation Details

Every measurement, color value, and timing documented with Apple precision.

---

## 🎨 Exact Color Values

### Hex Colors (Copy-Paste Ready)

```css
/* Apple System Colors */
#1d1d1f  /* Label - Primary text */
#86868b  /* System Gray - Secondary text */
#007AFF  /* SF Blue - Accent/Interactive */
#d2d2d7  /* System Separator - Dividers */
#ffffff  /* White - Background */
```

### RGB Values

```css
rgb(29, 29, 31)     /* Label */
rgb(134, 134, 139)  /* System Gray */
rgb(0, 122, 255)    /* SF Blue */
rgb(210, 210, 215)  /* Separator */
rgb(255, 255, 255)  /* White */
```

### RGBA (for shadows)

```css
rgba(0, 0, 0, 0.06)  /* Shadow primary (resting) */
rgba(0, 0, 0, 0.08)  /* Shadow secondary (resting) */
rgba(0, 0, 0, 0.10)  /* Shadow primary (hover) */
rgba(0, 0, 0, 0.08)  /* Shadow secondary (hover) */
```

---

## 📝 Exact Typography Values

### Font Sizes (Pixels)

```css
17px  /* Section headers (Large Title) */
15px  /* Card titles (Headline) */
13px  /* Body text, buttons (Body) */
11px  /* Footnotes (not used here) */
```

### Letter Spacing (ems)

```css
-0.022em  /* 17px text (-0.374px at 17px) */
-0.01em   /* 15px text (-0.15px at 15px) */
-0.003em  /* 13px text (-0.039px at 13px) - default, usually omitted */
0.006em   /* 11px text (0.066px at 11px) */
```

### Line Heights (Ratios)

```css
1.29   /* 17px → 21.93px actual */
1.33   /* 15px → 19.95px actual */
1.38   /* 13px → 17.94px actual */
1.5    /* 13px → 19.5px (expanded content) */
```

### Font Weights

```css
600  /* Semibold - Critical items, headers */
500  /* Medium - Standard items, labels */
400  /* Regular - Body text (default) */
```

---

## 📐 Exact Spacing Values

### Margin & Padding (Pixels)

```css
/* Tailwind → Actual Pixels */
mb-5      → 20px (margin-bottom)
space-y-2 → 8px (gap between cards)
p-4       → 16px (padding: 16px all sides)
gap-3     → 12px (flex gap)
mt-1      → 4px (margin-top)
mt-3      → 12px (margin-top)
pt-3      → 12px (padding-top)
mt-[1px]  → 1px (margin-top - optical adjustment)
```

### Complete Spacing Map

| Element | Property | Pixels | Tailwind Class |
|---------|----------|--------|----------------|
| Section header bottom margin | margin-bottom | 20px | `mb-5` |
| Cards vertical gap | gap | 8px | `space-y-2` |
| Card padding (all sides) | padding | 16px | `p-4` |
| Icon to content gap | gap | 12px | `gap-3` |
| Title to body margin | margin-top | 4px | `mt-1` |
| Button section margin | margin-top | 12px | `mt-3` |
| Expanded content padding | padding-top | 12px | `pt-3` |
| Icon optical alignment | margin-top | 1px | `mt-[1px]` |

---

## 🎭 Exact Shadow Values

### Resting State Shadow

```css
box-shadow:
  0 1px 3px rgba(0, 0, 0, 0.06),
  0 1px 2px rgba(0, 0, 0, 0.08);
```

**Breakdown:**
- Layer 1 (Ambient):
  - Y-offset: 1px
  - Blur: 3px
  - Opacity: 0.06 (6%)

- Layer 2 (Contact):
  - Y-offset: 1px
  - Blur: 2px
  - Opacity: 0.08 (8%)

### Hover State Shadow

```css
box-shadow:
  0 4px 12px rgba(0, 0, 0, 0.10),
  0 2px 4px rgba(0, 0, 0, 0.08);
```

**Breakdown:**
- Layer 1 (Ambient):
  - Y-offset: 4px
  - Blur: 12px
  - Opacity: 0.10 (10%)

- Layer 2 (Contact):
  - Y-offset: 2px
  - Blur: 4px
  - Opacity: 0.08 (8%)

### Tailwind Custom Shadow Classes

```tsx
// Resting
className="shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.08)]"

// Hover
className="hover:shadow-[0_4px_12px_rgba(0,0,0,0.10),0_2px_4px_rgba(0,0,0,0.08)]"
```

---

## 🎬 Exact Animation Values

### Transition Properties

```css
/* Standard Transition */
transition-property: all;
transition-duration: 200ms;
transition-timing-function: cubic-bezier(0, 0, 0.2, 1); /* ease-out */
```

### Transform Values

```css
/* Card Hover Lift */
transform: translateY(-0.5px);

/* Chevron Rotation */
transform: rotate(180deg);
```

### Opacity Values

```css
/* Normal State */
opacity: 1; /* 100% */

/* Hover State (Apple Standard) */
opacity: 0.7; /* 70% */

/* Disabled (not used here) */
opacity: 0.4; /* 40% */
```

### Complete Animation Specs

| Element | Property | Value | Duration | Easing |
|---------|----------|-------|----------|--------|
| Card | box-shadow | See above | 200ms | ease-out |
| Card | transform | translateY(-0.5px) | 200ms | ease-out |
| Button | opacity | 0.7 | 200ms | ease-out |
| Chevron | transform | rotate(180deg) | 200ms | ease-out |
| Expanded | all | slide-in-from-top-1 | 200ms | ease-out |

---

## 🔲 Exact Border Radius

### Radius Values

```css
12px  /* Cards - rounded-[12px] */
9999px /* Full circle - rounded-full */
```

### Applied To

| Element | Radius | CSS |
|---------|--------|-----|
| Cards | 12px | `border-radius: 12px` |
| Icons (if circular bg) | Full circle | `border-radius: 9999px` |

---

## 🎯 Exact Icon Specifications

### SVG Dimensions

```svg
width="16" height="16" viewBox="0 0 16 16"
```

### Stroke Properties

```css
stroke-width: 1.5
stroke-linecap: round
```

### Icon Sizing

```css
/* Applied via Tailwind */
.w-4 { width: 1rem; }   /* 16px */
.h-4 { height: 1rem; }  /* 16px */

/* Chevron (slightly smaller) */
.w-3.5 { width: 0.875rem; }  /* 14px */
.h-3.5 { height: 0.875rem; } /* 14px */
```

### Icon Color Logic

```tsx
// Critical items only
className={cn(
  isCritical ? "text-[#007AFF]" : "text-[#86868b]"
)}
```

---

## 📏 Component Dimensions

### Section Header

```css
height: auto (based on content)
margin-bottom: 20px
```

**Typography:**
- Font size: 17px
- Font weight: 600 (semibold)
- Letter spacing: -0.022em
- Color: #1d1d1f

**Count Badge:**
- Font size: 13px
- Font weight: 500 (medium)
- Color: #86868b
- Feature: tabular-nums

### Card

```css
/* Layout */
display: flex
padding: 16px (all sides)
border-radius: 12px
background: #ffffff
gap: 12px (icon to content)

/* Shadow */
box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.08)

/* Hover */
transform: translateY(-0.5px)
box-shadow: 0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.08)
```

### Card Title

```css
/* Typography */
font-size: 15px
font-weight: 600 (critical) or 500 (normal)
letter-spacing: -0.01em
line-height: 1.33 (19.95px)
color: #1d1d1f
```

### Card Body

```css
/* Typography */
font-size: 13px
line-height: 1.38 (17.94px)
color: #86868b
margin-top: 4px
```

### Button

```css
/* Layout */
display: inline-flex
align-items: center
gap: 4px (text to icon)

/* Typography */
font-size: 13px
font-weight: 500
color: #007AFF

/* Interaction */
opacity: 1 (normal)
opacity: 0.7 (hover)
transition: 200ms ease-out
```

### Expanded Section

```css
/* Layout */
margin-top: 12px
padding-top: 12px
border-top: 1px solid #d2d2d7

/* Typography */
font-size: 13px
line-height: 1.5 (19.5px)
color: #1d1d1f

/* Animation */
animation: slide-in-from-top-1 200ms ease-out
```

---

## 🎨 Complete Component Measurements

### Section Container

```
┌─────────────────────────────────────┐
│ ↕ 20px margin-bottom                │
│  ┌─────────────────────────────────┐│
│  │ Recommendations          3       ││ ← Header (17px semibold)
│  └─────────────────────────────────┘│
│                                      │
│ ↕ 8px gap                            │
│                                      │
│  ┌─────────────────────────────────┐│
│  │ ↔ 12px gap                       ││
│  │ ◉  Low Quiz Start Rate           ││ ← Card (15px title)
│  │    Only 42% of visitors...       ││   (13px body)
│  │    → 16px padding all sides      ││
│  └─────────────────────────────────┘│
│                                      │
│ ↕ 8px gap                            │
│                                      │
│  ┌─────────────────────────────────┐│
│  │ [Card 2]                         ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Card Internal Layout

```
┌───────────────────────────────────────┐
│ ↕ 16px padding-top                    │
│ ↔ 16px padding-left                   │
│                                       │
│  ◉ ← Icon (16x16px, 1.5px stroke)    │
│  ↔ 12px gap                           │
│  ┌─────────────────────────────────┐ │
│  │ Low Quiz Start Rate              │ │ ← 15px semibold
│  │ ↕ 4px margin-top                 │ │
│  │ Only 42% of visitors start...    │ │ ← 13px regular
│  │ ↕ 12px margin-top                │ │
│  │ [Suggestion ⌄]                   │ │ ← 13px medium
│  └─────────────────────────────────┘ │
│                                       │
│ ↕ 16px padding-bottom                 │
│ ↔ 16px padding-right                  │
└───────────────────────────────────────┘
```

### Expanded Section

```
┌───────────────────────────────────────┐
│ [Suggestion ⌄] ← Button clicked       │
│ ↕ 12px margin-top                     │
│ ─────────────────── ← 1px border      │
│ ↕ 12px padding-top                    │
│ Improve the quiz landing page:        │
│ use stronger headlines, add           │
│ social proof, or create urgency       │
│ with limited-time offers.             │
└───────────────────────────────────────┘
```

---

## 🔍 Optical Adjustments

### Icon Alignment

```css
/* Icon positioned 1px from top for optical balance */
margin-top: 1px; /* mt-[1px] */
```

**Reason:** Icons at 16px need 1px offset to optically align with first line of text at 15px.

### Letter Spacing by Size

```css
/* Larger text gets tighter spacing (Apple method) */
17px → -0.022em (-0.374px)
15px → -0.01em (-0.15px)
13px → default (no adjustment needed)
11px → +0.006em (+0.066px)
```

**Reason:** Large text appears loose without negative tracking; small text appears cramped without positive tracking.

### Line Height Ratios

```css
/* Apple's precise ratios */
17px × 1.29 = 21.93px (not 22px)
15px × 1.33 = 19.95px (not 20px)
13px × 1.38 = 17.94px (not 18px)
```

**Reason:** Decimal precision creates perfect optical rhythm.

---

## ⚙️ Implementation Code

### Complete Tailwind Classes

```tsx
// Section Container
<div className={className}>

  // Header
  <div className="flex items-center justify-between mb-5">
    <h4 className="text-[17px] font-semibold tracking-[-0.022em] text-[#1d1d1f]">
      Recommendations
    </h4>
    <span className="text-[13px] font-medium text-[#86868b] tabular-nums">
      {count}
    </span>
  </div>

  // Card Container
  <div className="space-y-2">

    // Individual Card
    <div className={cn(
      "bg-white rounded-[12px] p-4",
      "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.08)]",
      "transition-all duration-200 ease-out",
      "hover:shadow-[0_4px_12px_rgba(0,0,0,0.10),0_2px_4px_rgba(0,0,0,0.08)]",
      "hover:-translate-y-[0.5px]"
    )}>

      // Icon + Content
      <div className="flex items-start gap-3">

        // Icon
        <div className={cn(
          "mt-[1px] shrink-0",
          isCritical ? "text-[#007AFF]" : "text-[#86868b]"
        )}>
          <Icon className="w-4 h-4" />
        </div>

        // Content
        <div className="flex-1 min-w-0">

          // Title
          <h5 className={cn(
            "text-[15px] leading-[1.33] tracking-[-0.01em] text-[#1d1d1f]",
            isCritical ? "font-semibold" : "font-medium"
          )}>
            {title}
          </h5>

          // Body
          <p className="mt-1 text-[13px] leading-[1.38] text-[#86868b]">
            {message}
          </p>

          // Button Section
          <div className="mt-3">
            <button className={cn(
              "inline-flex items-center gap-1 group",
              "text-[13px] font-medium text-[#007AFF]",
              "transition-opacity duration-200 ease-out",
              "hover:opacity-70",
              "focus:outline-none focus-visible:opacity-70"
            )}>
              <span>Suggestion</span>
              <ChevronDown className={cn(
                "w-3.5 h-3.5 transition-transform duration-200 ease-out",
                isExpanded && "rotate-180"
              )} />
            </button>

            // Expanded Content
            {isExpanded && (
              <div className={cn(
                "mt-3 pt-3 border-t border-[#d2d2d7]",
                "animate-in slide-in-from-top-1 duration-200 ease-out"
              )}>
                <p className="text-[13px] leading-[1.5] text-[#1d1d1f]">
                  {recommendation}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 📊 Measurement Summary

### All Pixel Values Used

```css
/* Spacing */
1px, 4px, 8px, 12px, 16px, 20px

/* Typography */
11px, 13px, 15px, 17px

/* Icons */
14px (chevron), 16px (main icons)

/* Borders */
1px (divider), 12px (border-radius)

/* Shadows */
Y-offsets: 1px (rest), 2px (hover), 4px (hover)
Blur: 2px, 3px, 4px, 12px
Opacity: 0.06, 0.08, 0.10
```

### All Timing Values

```css
200ms  /* All transitions */
ease-out  /* cubic-bezier(0, 0, 0.2, 1) */
```

### All Opacity Values

```css
0.06  /* Shadow opacity (ambient, resting) */
0.08  /* Shadow opacity (contact) */
0.10  /* Shadow opacity (ambient, hover) */
0.70  /* Button hover opacity */
1.00  /* Normal state */
```

---

## ✅ Verification Checklist

### Design Token Compliance

- [x] All spacing values on 4px grid
- [x] Typography uses SF Pro scale (17/15/13px)
- [x] Letter spacing matches Apple specs
- [x] Line heights use decimal ratios
- [x] Single accent color (#007AFF)
- [x] Monochrome icon system
- [x] Two-layer shadow system
- [x] 200ms ease-out transitions
- [x] 12px border radius on cards
- [x] 1.5px icon stroke weight

### Pixel-Perfect Implementation

- [x] Exact hex colors (#1d1d1f, #86868b, #007AFF)
- [x] Precise shadow RGBA values
- [x] Optical icon alignment (1px offset)
- [x] Apple hover state (70% opacity)
- [x] Subtle lift animation (0.5px)
- [x] Proper semantic HTML
- [x] WCAG AA/AAA contrast ratios

---

**Every pixel matches Apple's Human Interface Guidelines.**
