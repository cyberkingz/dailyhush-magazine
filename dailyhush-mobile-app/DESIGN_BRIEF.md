# DailyHush Mobile App - Home Screen Design Brief

## Current Status
We've redesigned the home screen with a cleaner, grid-based layout inspired by modern wellness apps. The new design is currently implemented and running on the `feature/new-design-styles` branch.

## Design Direction

### Layout Structure
1. **Header** - Centered "DailyHush" title with settings icon on the right
2. **Progress Card** - Large card showing today's spiral interruptions with big number
3. **Main CTA** - Prominent "I'M SPIRALING" button (emerald green, elevated)
4. **Feature Grid** - 2x2 grid of cards:
   - F.I.R.E. Training
   - Pattern Insights
   - Spiral History
   - Did you know? (tip card)

### Design System

#### Colors (Emerald Theme)
```
Primary Background: #0A1612 (deep forest)
Card Background: #0F1F1A
Emerald Scale:
- emerald[200]: #B7E4C7 (lightest icons)
- emerald[300]: #95D5B2 (light icons)
- emerald[400]: #74C69D (medium icons)
- emerald[500]: #52B788 (primary accent)
- emerald[600]: #40916C (main CTA button)
- emerald[700]: #2D6A4F (pressed state)

Text:
- Primary: #FFFFFF
- Secondary: #C8E6DB (muted text)
```

#### Spacing & Dimensions
- Border Radius: 20-24px (large, friendly curves)
- Card Padding: 20-24px
- Icon Circles: 56x56px with 28px icons
- Main CTA Icon Circle: 64x64px
- Grid Gap: 12px
- Screen Padding: 20px horizontal

#### Typography
- Header: 20px, weight 600
- Card Titles: 16-18px, weight 600
- Card Descriptions: 13px, opacity 0.7
- Main CTA Title: 24px, weight 700, letter-spacing 1px

## Areas to Refine

### 1. Progress Card Enhancement
**Current:** Simple number display with "interruptions today"
**Opportunity:**
- Add visual progress indicator (circular progress bar?)
- Include weekly comparison ("↑ 20% vs last week")
- Add subtle animation when number updates
- Consider mood emoji integration

### 2. Main CTA Button Polish
**Current:** Solid emerald button with infinity icon
**Opportunity:**
- Add subtle pulse/glow animation to draw attention
- Consider gradient overlay for depth
- Experiment with shadow/elevation variations
- Test different icon options (infinity vs spiral icon)

### 3. Grid Card Visual Hierarchy
**Current:** All cards same size, similar styling
**Opportunity:**
- Vary card heights based on content importance
- Add subtle hover/press states with scale
- Consider making "Did you know?" card more visually distinct
- Add micro-interactions (icon animations on press)

### 4. Empty State Design
**Consideration:** What does the home screen look like when:
- User has 0 spirals today (first time experience)
- User hasn't completed onboarding
- No recent activity to show

### 5. Motion & Transitions
**Opportunity:**
- Stagger fade-in animations when screen loads
- Add spring animations to buttons
- Smooth number count-up for progress card
- Card entrance animations (slide up with fade)

## Design Goals

### Target Audience
Women 35-65+ dealing with chronic rumination and anxiety

### Design Principles
1. **Calm & Safe** - No jarring colors, smooth animations, generous spacing
2. **Clear Hierarchy** - Main action (I'M SPIRALING) is obvious
3. **Encouraging** - Progress tracking feels positive, not judgmental
4. **Accessible** - Large touch targets (min 44x44px), high contrast text
5. **Premium Feel** - Polished, not generic

## Technical Constraints
- Built with React Native + Expo
- Uses Lucide icons
- NativeWind (Tailwind for React Native) for styling
- Must work on iOS and Android
- Dark theme only (for now)

## Files to Reference
- Layout: `/app/index.tsx` (current implementation)
- Colors: `/constants/colors.ts`
- Components: `/components/` (PremiumCard, ScrollFadeView, etc.)

## Next Steps for Designer

1. **Review Current Implementation** - Test on device/simulator to feel the interaction
2. **Create Variations** - Design 2-3 alternative layouts in Figma
3. **Focus Areas:**
   - Progress card visual treatment
   - Grid card hierarchy and spacing
   - Empty states and edge cases
   - Micro-interactions and animations
4. **Deliverables:**
   - Figma file with variations
   - Interaction/animation specs
   - Component states (default, pressed, disabled, empty)
   - Responsive behavior notes (different screen sizes)

## Inspiration References
Reference image shows wellness app with:
- Clean grid layout
- Rounded cards with generous spacing
- Calm color palette
- Large, friendly icons
- Clear visual hierarchy

Keep the emerald/forest green theme but explore ways to make it feel more premium and calming.

## Questions to Explore
1. Should the progress card be interactive (tap to see details)?
2. Can we add personality with illustrations or just keep it minimal with icons?
3. Should "Did you know?" rotate daily tips or be interactive?
4. What's the optimal card size ratio for the 2x2 grid?
5. How can we make the CTA button feel more urgent without being aggressive?

---

**Branch:** `feature/new-design-styles`
**Last Updated:** 2025-10-27
**Status:** Initial redesign complete, ready for design refinement
