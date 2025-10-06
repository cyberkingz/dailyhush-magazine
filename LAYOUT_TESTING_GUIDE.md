# Layout Testing Guide - Quiz Analytics Dashboard

## Quick Visual Test Checklist

### Desktop (≥ 1024px)

#### ✅ Funnel Section Layout
- [ ] Funnel card is 2/3 width of screen
- [ ] Sidebar is 1/3 width of screen
- [ ] Funnel and Recommendations are side-by-side (50/50 split)
- [ ] Vertical border separator visible between Funnel and Recommendations
- [ ] Sidebar height does NOT match funnel card height
- [ ] Sidebar cards stack vertically with consistent gap
- [ ] No excessive whitespace in any card
- [ ] All text is readable without zooming

#### ✅ Visual Balance
- [ ] Funnel progress bars are clearly visible
- [ ] Recommendation cards have appropriate spacing
- [ ] Device/Source stats are compact but readable
- [ ] Overall section feels balanced (not top-heavy or lopsided)

### Tablet (768px - 1023px)

#### ✅ Responsive Behavior
- [ ] Layout transitions smoothly from desktop to mobile
- [ ] Cards stack properly if space is tight
- [ ] No horizontal scrollbars
- [ ] Touch targets are at least 44px
- [ ] Text remains readable at reduced widths

### Mobile (< 768px)

#### ✅ Stacked Layout
- [ ] Funnel card takes full width
- [ ] Funnel and Recommendations stack vertically (no longer side-by-side)
- [ ] Border separator removed or adjusted for vertical layout
- [ ] Device Performance card is full width
- [ ] Top Sources card is full width
- [ ] Cards have consistent spacing (gap-6)
- [ ] All content is accessible without horizontal scroll

---

## Browser Testing

### Chrome/Edge
```bash
# Open DevTools (F12)
# Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
# Test these viewports:
- 1920x1080 (Desktop)
- 1366x768 (Laptop)
- 768x1024 (Tablet)
- 375x667 (Mobile)
```

### Firefox
```bash
# Open Responsive Design Mode (Ctrl+Shift+M / Cmd+Option+M)
# Test these devices:
- Desktop 1920x1080
- iPad 768x1024
- iPhone 12 Pro 390x844
```

### Safari (Mac/iOS)
- [ ] Test on actual iPhone/iPad if available
- [ ] Check Safari-specific CSS rendering
- [ ] Verify flexbox/grid support (should be fine on modern versions)

---

## Common Issues & Solutions

### Issue 1: Sidebar Stretching to Match Funnel Height

**Symptoms:**
- Sidebar cards have excessive vertical space
- "Device Performance" and "Top Sources" cards are taller than content
- Layout looks imbalanced

**Solution:**
```tsx
// Ensure sidebar has lg:self-start
<div className="space-y-4 lg:self-start">
  {/* sidebar cards */}
</div>
```

**Test:**
```css
/* In DevTools, inspect sidebar div */
/* Should see: */
align-self: start; /* on lg+ breakpoints */
```

---

### Issue 2: No Border Between Funnel and Recommendations

**Symptoms:**
- Funnel and Recommendations blend together
- Hard to distinguish sections

**Solution:**
```tsx
<div className="lg:pr-4 lg:border-r border-gray-100">
  {/* funnel content */}
</div>
```

**Test:**
- Inspect in DevTools: should see `border-right: 1px solid` on large screens
- Should disappear on mobile (<1024px)

---

### Issue 3: Mobile Layout Not Stacking

**Symptoms:**
- Content appears squished side-by-side on mobile
- Horizontal scrollbar appears

**Solution:**
```tsx
// Ensure using grid-cols-1 on mobile
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
```

**Test:**
- Resize to 375px width
- Should see `grid-template-columns: repeat(1, minmax(0, 1fr))`
- All cards should stack vertically

---

### Issue 4: Funnel Chart Looking "Lonely"

**Symptoms:**
- Funnel progress bars are small in large card
- Lots of empty space above/below funnel

**Acceptable (Current Implementation):**
Since recommendations are now side-by-side, the space is utilized. But if still an issue:

**Optional Solution:**
```tsx
<CardContent>
  <div className="grid gap-6 lg:grid-cols-2">
    <div className="lg:pr-4 lg:border-r border-gray-100">
      {/* Add padding or centering */}
      <div className="py-8">
        <QuizFunnelChart steps={funnelSteps} />
      </div>
    </div>
    <div className="lg:pl-2">
      <FunnelActionItems steps={funnelSteps} />
    </div>
  </div>
</CardContent>
```

---

## DevTools Inspection Points

### 1. Grid Structure
```css
/* Parent container: */
.grid.grid-cols-1.lg\:grid-cols-3 {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr)); /* mobile */
}

@media (min-width: 1024px) {
  grid-template-columns: repeat(3, minmax(0, 1fr)); /* desktop */
}
```

### 2. Funnel Card Sizing
```css
/* Funnel card: */
.lg\:col-span-2 {
  grid-column: span 2 / span 2; /* 2/3 of parent */
}
```

### 3. Sidebar Sizing
```css
/* Sidebar: */
.lg\:self-start {
  align-self: start; /* prevents stretching! */
}
```

### 4. Internal Split
```css
/* Inside funnel card: */
.lg\:grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr)); /* 50/50 */
}
```

---

## Automated Testing (Optional)

### Visual Regression Test
```typescript
// Using Playwright or similar
test('Funnel section layout', async ({ page }) => {
  await page.goto('/admin/quiz-analytics')

  // Desktop
  await page.setViewportSize({ width: 1920, height: 1080 })
  await expect(page.locator('[data-testid="funnel-section"]')).toHaveScreenshot('funnel-desktop.png')

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 })
  await expect(page.locator('[data-testid="funnel-section"]')).toHaveScreenshot('funnel-mobile.png')
})
```

### Layout Test
```typescript
test('Sidebar does not stretch', async ({ page }) => {
  await page.goto('/admin/quiz-analytics')
  await page.setViewportSize({ width: 1440, height: 900 })

  const sidebar = page.locator('.lg\\:self-start').first()
  const funnelCard = page.locator('.lg\\:col-span-2').first()

  const sidebarHeight = await sidebar.boundingBox().then(box => box?.height)
  const funnelHeight = await funnelCard.boundingBox().then(box => box?.height)

  // Sidebar should be shorter than funnel card
  expect(sidebarHeight).toBeLessThan(funnelHeight)
})
```

---

## Performance Checks

### Layout Shift (CLS)
```bash
# Open Chrome DevTools
# Performance tab → Record page load
# Check "Layout Shift" sections
# Should have minimal shifts (< 0.1 CLS score)
```

### Paint Times
```bash
# Lighthouse audit
# Should see:
# - First Contentful Paint < 1.8s
# - Largest Contentful Paint < 2.5s
```

### CSS Bundle Size
```bash
# Check network tab for CSS files
# Tailwind production build should purge unused classes
# Total CSS should be < 50KB gzipped
```

---

## Accessibility Tests

### Keyboard Navigation
- [ ] Tab through all interactive elements in order
- [ ] Focus indicators visible (blue ring)
- [ ] Can collapse/expand recommendations with keyboard
- [ ] No keyboard traps

### Screen Reader
- [ ] Card headers announced correctly
- [ ] Stats and numbers read in logical order
- [ ] Recommendations properly labeled
- [ ] Links/buttons have descriptive text

### Color Contrast
```bash
# Use Chrome DevTools
# Elements → Accessibility → Contrast
# All text should pass WCAG AA (4.5:1)
# Large text should pass WCAG AAA (7:1)
```

---

## Sign-Off Checklist

Before considering layout complete:

### Visual
- [ ] Desktop layout matches design (2/3 + 1/3)
- [ ] Funnel and recommendations are side-by-side
- [ ] Sidebar does not stretch
- [ ] Mobile stacks correctly
- [ ] No horizontal scrollbars at any breakpoint
- [ ] Spacing is consistent (gap-6)

### Functional
- [ ] All data loads correctly
- [ ] Recommendations expand/collapse smoothly
- [ ] Charts render without errors
- [ ] No console warnings/errors

### Performance
- [ ] Page loads in < 3s on 3G
- [ ] No layout shifts (CLS < 0.1)
- [ ] Smooth scrolling on all devices

### Accessibility
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Color contrast passes

### Cross-Browser
- [ ] Chrome ✓
- [ ] Firefox ✓
- [ ] Safari ✓
- [ ] Edge ✓
- [ ] Mobile Safari (iOS) ✓
- [ ] Mobile Chrome (Android) ✓

---

## Quick Test Commands

### Local Development
```bash
# Start dev server
npm run dev

# Open in browser
open http://localhost:5173/admin/quiz-analytics

# Test responsive
# Resize browser or use DevTools device mode
```

### Build Check
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Check bundle size
npm run build -- --analyze
```

### Lighthouse Audit
```bash
# Run Lighthouse
npx lighthouse http://localhost:5173/admin/quiz-analytics \
  --view \
  --preset=desktop

# Check score > 90 for:
# - Performance
# - Accessibility
# - Best Practices
```

---

## Final Verification

**The layout is correct when:**

1. **Desktop (1920x1080):**
   ```
   [    Funnel    |    Recs    ] [ Stats ]
   └─── 66% width ────┘          └─ 33% ─┘
   ```

2. **Mobile (375px):**
   ```
   ┌─────────────────┐
   │     Funnel      │
   ├─────────────────┤
   │      Recs       │
   ├─────────────────┤
   │  Device Stats   │
   ├─────────────────┤
   │  Source Stats   │
   └─────────────────┘
   ```

3. **No Height Stretching:**
   - Sidebar height < Funnel card height
   - Sidebar sits at top of its column (align-self: start)

4. **Visual Balance:**
   - No card feels empty or overstuffed
   - Consistent spacing throughout
   - Clear visual hierarchy
