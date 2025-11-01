# Legal Footer Implementation Roadmap

**DailyHush Mobile App - App Store Compliance Enhancement**
**Created:** January 1, 2025
**Estimated Total Time:** 4-5 hours
**Priority:** High (Pre-App Store Submission)

---

## Table of Contents
1. [Overview](#overview)
2. [Available Agents](#available-agents)
3. [Task Breakdown](#task-breakdown)
4. [Agent Assignments](#agent-assignments)
5. [Technical Specifications](#technical-specifications)
6. [Component Architecture](#component-architecture)
7. [Implementation Checklist](#implementation-checklist)

---

## Overview

**Goal:** Enhance App Store compliance and user trust by adding legal footer links to all subscription/paywall screens and account deletion disclosure.

**Scope:**
- Create reusable `LegalFooter` component
- Integrate footer into 3 paywall screens
- Add Privacy Policy disclosure to account deletion screen
- Follow senior developer best practices

**Success Criteria:**
- ✅ Zero hardcoded values
- ✅ Fully reusable components
- ✅ Props-based data flow
- ✅ Consistent with existing design system
- ✅ Accessibility compliant
- ✅ Type-safe (TypeScript)

---

## Available Agents

### Design & UX Agents
1. **ui-design-expert** - UI design, component architecture, design systems
2. **ux-expert** - User experience, usability, interaction design

### Development Agents
3. **general-purpose** - Multi-step implementation tasks
4. **Explore** - Codebase exploration and pattern analysis

### Specialized Agents (Not needed for this task)
- stripe-expert, supabase-expert, notion-specialist, copywriters, etc.

---

## Task Breakdown

### Phase 1: Design & Planning (1 hour)
**Agent:** ui-design-expert + ux-expert

#### Task 1.1: Component Design Specification
**Estimated Time:** 30 minutes
**Assignee:** ui-design-expert

**Deliverables:**
- Visual specifications for `LegalFooter` component
- Typography specifications (font size, weight, color)
- Spacing specifications (padding, margins)
- Responsive behavior
- Dark mode considerations
- Tap target specifications (iOS 44x44pt minimum)

**Requirements:**
- Match existing DailyHush design system (`constants/colors.ts`, `constants/typography.ts`)
- Use emerald green accent color for links
- Ensure WCAG 2.1 AA contrast ratio (4.5:1 minimum)
- Subtle, non-intrusive design

**Output Format:**
```typescript
// Design tokens
fontSize: 11-12px
color: colors.text.tertiary (50-60% opacity)
separator: ' • ' (bullet separator)
linkColor: colors.emerald[400] (on press)
padding: { horizontal: 16px, vertical: 12px }
```

#### Task 1.2: UX Pattern Review
**Estimated Time:** 30 minutes
**Assignee:** ux-expert

**Deliverables:**
- Review existing legal link patterns in app
- Ensure consistent navigation behavior
- Validate accessibility (VoiceOver support)
- Review competitor apps (Calm, Headspace) for best practices
- Recommend optimal placement (above/below CTA buttons)

**Requirements:**
- Footer should NOT distract from primary CTA
- Links should be discoverable but subtle
- Consistent behavior across all screens
- Haptic feedback on link press
- Loading states for navigation

**Output Format:**
```
Placement: Below primary CTA, above safe area
Behavior: Router.push() navigation
Feedback: Light haptic + emerald color flash
Accessibility: aria-label for each link
```

---

### Phase 2: Component Development (2 hours)
**Agent:** general-purpose

#### Task 2.1: Create Reusable LegalFooter Component
**Estimated Time:** 45 minutes
**Assignee:** general-purpose
**File:** `components/legal/LegalFooter.tsx`

**Requirements:**
1. **TypeScript Interface:**
```typescript
interface LegalFooterProps {
  variant?: 'default' | 'compact'; // Optional size variant
  showRestore?: boolean; // Show "Restore Purchases" link
  textAlign?: 'center' | 'left' | 'right'; // Alignment
  containerStyle?: ViewStyle; // Optional custom styles
  onRestorePurchases?: () => void; // Optional restore handler
}
```

2. **Component Features:**
- Props-based configuration (NO hardcoded values)
- Configurable visibility of restore purchases link
- Reusable across all screens
- Responsive to different screen sizes
- Dark mode support (uses theme colors)
- Type-safe with TypeScript
- Haptic feedback on link press
- Accessible (screen reader support)

3. **Navigation Logic:**
- Privacy Policy → `router.push('/legal/privacy')`
- Terms of Service → `router.push('/legal/terms')`
- Restore Purchases → Call `onRestorePurchases` prop or RevenueCat's `restorePurchases()`

4. **Visual Specifications:**
```typescript
// Use design tokens from constants
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';

// Typography
fontSize: 11 (compact) or 12 (default)
color: colors.text.tertiary
lineHeight: 18
fontWeight: '400'

// Spacing
padding: {
  horizontal: spacing.screenPadding,
  vertical: spacing.md
}
marginTop: spacing.lg

// Link styling
linkColor: colors.emerald[400]
pressedOpacity: 0.7
```

5. **Accessibility:**
```typescript
<Pressable
  accessible={true}
  accessibilityRole="link"
  accessibilityLabel="Privacy Policy"
  accessibilityHint="Opens the privacy policy page"
>
```

6. **File Structure:**
```
components/
  legal/
    LegalFooter.tsx        # Main component
    index.ts               # Export
```

7. **Example Usage:**
```typescript
// Basic usage
<LegalFooter />

// With restore purchases
<LegalFooter
  showRestore={true}
  onRestorePurchases={handleRestore}
/>

// Compact variant
<LegalFooter
  variant="compact"
  textAlign="left"
/>

// Custom styling
<LegalFooter
  containerStyle={{ marginTop: 24 }}
/>
```

**Testing Requirements:**
- Test navigation to Privacy Policy
- Test navigation to Terms of Service
- Test restore purchases callback
- Test on different screen sizes (iPhone SE, iPhone 14 Pro Max)
- Test dark mode appearance
- Test VoiceOver compatibility

---

#### Task 2.2: Create Account Deletion Privacy Disclosure Component
**Estimated Time:** 30 minutes
**Assignee:** general-purpose
**File:** `components/legal/PrivacyDisclosure.tsx`

**Requirements:**
1. **TypeScript Interface:**
```typescript
interface PrivacyDisclosureProps {
  type: 'account-deletion' | 'data-retention' | 'generic';
  showIcon?: boolean; // Show warning icon
  containerStyle?: ViewStyle;
}
```

2. **Component Features:**
- Reusable for different disclosure contexts
- Warning icon (optional)
- Link to Privacy Policy
- Clear, concise messaging
- Props-based configuration

3. **Visual Specifications:**
```typescript
// Container
backgroundColor: colors.background.card
borderRadius: 12
padding: spacing.md
borderWidth: 1
borderColor: colors.orange[700] + '40' // Warning color
marginBottom: spacing.lg

// Icon
size: 20
color: colors.orange[500]

// Text
fontSize: 14
color: colors.text.secondary
lineHeight: 22

// Link
fontSize: 14
color: colors.emerald[400]
fontWeight: '600'
```

4. **Content (Props-based):**
```typescript
const DISCLOSURE_CONTENT = {
  'account-deletion': {
    icon: AlertCircle,
    title: 'Important: Data Retention',
    message: 'Deleting your account will remove your login credentials, but some data will be retained for legal and analytics purposes.',
    linkText: 'Review our Privacy Policy',
    linkSection: '#data-retention' // Optional anchor
  },
  'data-retention': {
    // ...
  },
  'generic': {
    // ...
  }
};
```

5. **File Structure:**
```
components/
  legal/
    LegalFooter.tsx
    PrivacyDisclosure.tsx  # New component
    index.ts               # Export both
```

6. **Example Usage:**
```typescript
<PrivacyDisclosure
  type="account-deletion"
  showIcon={true}
/>
```

---

### Phase 3: Integration (1.5 hours)
**Agent:** general-purpose

#### Task 3.1: Integrate LegalFooter into Subscription Screen
**Estimated Time:** 20 minutes
**File:** `app/subscription.tsx`

**Requirements:**
1. Import LegalFooter component
2. Add after ScrollView content, before purchase button
3. Include "Restore Purchases" link
4. Wire up restore purchases handler

**Implementation:**
```typescript
// Import
import { LegalFooter } from '@/components/legal';

// Placement (inside ScrollView, before closing tag)
<ScrollView>
  {/* Existing content */}

  {/* Legal Footer */}
  <LegalFooter
    showRestore={true}
    onRestorePurchases={handleRestore}
    containerStyle={{ marginTop: spacing.xl }}
  />
</ScrollView>

{/* Purchase Button (outside ScrollView) */}
```

**Restore Purchases Handler:**
```typescript
const handleRestore = async () => {
  try {
    setIsRestoring(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const customerInfo = await restorePurchases();
    // ... existing restore logic
  } catch (error) {
    // ... error handling
  } finally {
    setIsRestoring(false);
  }
};
```

---

#### Task 3.2: Integrate LegalFooter into Onboarding Paywall
**Estimated Time:** 20 minutes
**File:** `app/onboarding/quiz/paywall.tsx`

**Requirements:**
1. Import LegalFooter component
2. Add after PricingPreview, before bottom safe area
3. Include "Restore Purchases" link (for users who already purchased)
4. Wire up restore purchases handler

**Implementation:**
```typescript
// Import
import { LegalFooter } from '@/components/legal';

// Placement (inside main View, before closing)
<View style={{ flex: 1 }}>
  {/* Existing content */}

  {/* Pricing Preview */}
  <PricingPreview text="..." />

  {/* Legal Footer */}
  <LegalFooter
    showRestore={true}
    onRestorePurchases={handleRestorePurchases}
  />
</View>
```

**Restore Purchases Handler:**
- Check if user already has Premium access
- If yes, navigate to home screen
- If no, show "No purchases found" message

---

#### Task 3.3: Integrate LegalFooter into Trial Expired Screen
**Estimated Time:** 20 minutes
**File:** `app/trial-expired.tsx`

**Requirements:**
1. Import LegalFooter component
2. Add inside TrialExpiredPaywall component
3. Pass through to TrialExpiredPaywall as optional prop
4. Include "Restore Purchases" link

**Implementation:**

**Option A: Modify TrialExpiredPaywall component**
```typescript
// File: components/TrialExpiredPaywall.tsx
interface TrialExpiredPaywallProps {
  // ... existing props
  showLegalFooter?: boolean; // New prop
  onRestorePurchases?: () => void; // New prop
}

// Add to component
{showLegalFooter && (
  <LegalFooter
    showRestore={true}
    onRestorePurchases={onRestorePurchases}
  />
)}
```

**Option B: Add directly in trial-expired.tsx**
```typescript
// Import
import { LegalFooter } from '@/components/legal';

// Add after TrialExpiredPaywall component
<TrialExpiredPaywall {...props} />
<LegalFooter
  showRestore={true}
  onRestorePurchases={handleRestore}
/>
```

**Recommendation:** Option A (modify component) for consistency

---

#### Task 3.4: Add Privacy Disclosure to Account Deletion Screen
**Estimated Time:** 30 minutes
**File:** `app/settings/delete-account.tsx`

**Requirements:**
1. Import PrivacyDisclosure component
2. Add ABOVE the password input field (so users see it first)
3. Link should open Privacy Policy
4. Show warning icon

**Implementation:**
```typescript
// Import
import { PrivacyDisclosure } from '@/components/legal';

// Placement (inside ScrollView, before password input)
<ScrollView>
  {/* Warning Banner - Existing */}

  {/* Privacy Disclosure - NEW */}
  <PrivacyDisclosure
    type="account-deletion"
    showIcon={true}
  />

  {/* What Will Be Deleted - Existing */}
  {/* What Will Be Retained - Existing */}

  {/* Password Input - Existing */}
  {/* Confirmation Checkbox - Existing */}
  {/* Delete Button - Existing */}
</ScrollView>
```

**Visual Flow:**
1. User sees warning banner (red)
2. User sees privacy disclosure (orange - less alarming)
3. User can review Privacy Policy
4. User proceeds with deletion understanding data retention

---

### Phase 4: Testing & QA (1 hour)
**Agent:** general-purpose

#### Task 4.1: Component Testing
**Estimated Time:** 20 minutes

**Test Cases:**
1. **LegalFooter Component:**
   - [ ] Renders correctly with default props
   - [ ] Renders correctly with `showRestore={true}`
   - [ ] Renders correctly with `showRestore={false}`
   - [ ] Privacy Policy link navigates to `/legal/privacy`
   - [ ] Terms of Service link navigates to `/legal/terms`
   - [ ] Restore Purchases calls `onRestorePurchases` callback
   - [ ] Haptic feedback triggers on each link press
   - [ ] Responsive on small screens (iPhone SE)
   - [ ] Responsive on large screens (iPhone 14 Pro Max)
   - [ ] Dark mode colors are correct
   - [ ] VoiceOver reads links correctly

2. **PrivacyDisclosure Component:**
   - [ ] Renders with warning icon
   - [ ] Renders without icon when `showIcon={false}`
   - [ ] Privacy Policy link navigates correctly
   - [ ] Message text displays correctly
   - [ ] Responsive layout

---

#### Task 4.2: Integration Testing
**Estimated Time:** 20 minutes

**Test Screens:**
1. **Subscription Screen (`/subscription`):**
   - [ ] Legal footer appears at bottom of scroll view
   - [ ] Restore Purchases works correctly
   - [ ] Footer doesn't interfere with purchase button
   - [ ] Links navigate correctly
   - [ ] Layout looks good on iPhone SE and iPhone 14 Pro Max

2. **Onboarding Paywall (`/onboarding/quiz/paywall`):**
   - [ ] Legal footer appears in correct position
   - [ ] Restore Purchases works for returning users
   - [ ] Doesn't distract from trial CTA
   - [ ] Links work correctly

3. **Trial Expired Screen (`/trial-expired`):**
   - [ ] Legal footer appears
   - [ ] Restore Purchases works
   - [ ] Layout is consistent with other paywalls

4. **Account Deletion Screen (`/settings/delete-account`):**
   - [ ] Privacy disclosure appears above password input
   - [ ] Link opens Privacy Policy
   - [ ] Warning is clear and visible
   - [ ] Doesn't break existing delete flow

---

#### Task 4.3: User Flow Testing
**Estimated Time:** 20 minutes

**Scenarios:**
1. **New User Trial Signup:**
   - User completes quiz → sees paywall
   - User sees legal footer
   - User can review Privacy Policy before starting trial
   - User starts trial successfully

2. **Returning User Restore:**
   - User navigates to subscription screen
   - User taps "Restore Purchases"
   - Premium access restored
   - Success message shown

3. **Account Deletion:**
   - User navigates to Settings → Delete Account
   - User sees privacy disclosure
   - User reviews Privacy Policy
   - User understands data retention
   - User proceeds with deletion

---

### Phase 5: Documentation (30 minutes)
**Agent:** general-purpose

#### Task 5.1: Update Component Documentation
**Estimated Time:** 15 minutes

**Files to Create/Update:**
1. `components/legal/README.md` - Component usage guide
2. Update `APP_STORE_COMPLIANCE.md` - Mark items as complete
3. Update `LEGAL_PLACEMENT_COMPLIANCE_RESEARCH.md` - Add implementation notes

**Documentation Content:**
```markdown
# Legal Components

## LegalFooter

Reusable footer component for subscription/paywall screens.

### Usage
\`\`\`typescript
import { LegalFooter } from '@/components/legal';

<LegalFooter
  showRestore={true}
  onRestorePurchases={handleRestore}
/>
\`\`\`

### Props
- `variant` - 'default' | 'compact'
- `showRestore` - boolean
- `textAlign` - 'center' | 'left' | 'right'
- `containerStyle` - ViewStyle
- `onRestorePurchases` - () => void

### Examples
See `/app/subscription.tsx` for implementation example.
```

---

#### Task 5.2: Update Implementation Checklist
**Estimated Time:** 15 minutes

**Update APP_STORE_COMPLIANCE.md:**
```markdown
## Legal Document Placement

### Required (Mandatory)
- [x] Settings → Legal → Privacy Policy
- [x] Settings → Legal → Terms of Service
- [x] Signup screen checkboxes

### Recommended (Best Practice)
- [x] Subscription screen footer (app/subscription.tsx)
- [x] Onboarding paywall footer (app/onboarding/quiz/paywall.tsx)
- [x] Trial expired footer (app/trial-expired.tsx)
- [x] Account deletion disclosure (app/settings/delete-account.tsx)

**Status:** ✅ FULLY COMPLIANT (App Store Best Practices)
```

---

## Technical Specifications

### Design System Integration

**Colors (from `constants/colors.ts`):**
```typescript
text: {
  primary: '#FFFFFF',     // Main text
  secondary: '#D1D5DB',   // Secondary text
  tertiary: '#9CA3AF',    // Footer text (60% opacity)
}

emerald: {
  400: '#34D399',         // Link hover/press color
  500: '#10B981',         // Link default color
}

orange: {
  500: '#F97316',         // Warning icon
  700: '#C2410C',         // Warning border
}
```

**Spacing (from `constants/spacing.ts`):**
```typescript
xs: 4,
sm: 8,
md: 12,
lg: 16,
xl: 24,
xxl: 32,
screenPadding: 16,
safeArea: {
  top: 44,
  bottom: 34,
}
```

**Typography:**
```typescript
fontSize: {
  caption: 11,     // Compact footer
  body: 12,        // Default footer
  small: 14,       // Disclosure text
}

fontWeight: {
  normal: '400',
  semibold: '600',
}

lineHeight: {
  caption: 16,
  body: 18,
  small: 22,
}
```

---

### Component Architecture

```
components/
  legal/
    LegalFooter.tsx          # Reusable footer with links
    PrivacyDisclosure.tsx    # Disclosure with warning
    index.ts                 # Barrel export
    README.md                # Documentation

Implementation Files:
  app/
    subscription.tsx         # Integration point 1
    trial-expired.tsx        # Integration point 2
    onboarding/
      quiz/
        paywall.tsx          # Integration point 3
    settings/
      delete-account.tsx     # Integration point 4
  components/
    TrialExpiredPaywall.tsx  # May need props update
```

---

### Data Flow Architecture

```
User Action (Tap Link)
  ↓
Haptic Feedback (Light)
  ↓
Visual Feedback (Color change)
  ↓
Navigation
  ↓
  ├─ Privacy Policy → router.push('/legal/privacy')
  ├─ Terms of Service → router.push('/legal/terms')
  └─ Restore Purchases → onRestorePurchases() callback
                            ↓
                          RevenueCat API
                            ↓
                          Update User State
                            ↓
                          Show Success/Error
```

---

## Agent Assignments

### Phase 1: Design & Planning

**Task 1.1: Component Design Specification**
- **Agent:** ui-design-expert
- **Duration:** 30 minutes
- **Deliverable:** Design specifications document
- **Command:**
```
Create visual and interaction design specifications for a LegalFooter component for the DailyHush mobile app. The component must:
- Match existing design system (emerald green theme, dark mode)
- Include Privacy Policy, Terms of Service, and optional Restore Purchases links
- Be subtle and non-intrusive
- Follow iOS Human Interface Guidelines
- Support multiple variants (default, compact)
- Specify exact typography, colors, spacing, tap targets

Review existing design system in:
- constants/colors.ts
- constants/spacing.ts
- constants/typography.ts

Output detailed specifications including:
- Visual mockup description
- Typography specs (size, weight, color, opacity)
- Spacing specs (padding, margins, gaps)
- Interactive states (default, pressed, disabled)
- Accessibility requirements (contrast ratios, tap targets)
- Responsive behavior for different screen sizes
```

**Task 1.2: UX Pattern Review**
- **Agent:** ux-expert
- **Duration:** 30 minutes
- **Deliverable:** UX recommendations document
- **Command:**
```
Review UX patterns for legal footer placement in subscription/paywall screens for the DailyHush mobile app. Research:

1. Analyze existing navigation patterns in the app
2. Review competitor apps (Calm, Headspace, Headway) for legal link patterns
3. Ensure compliance with Apple Human Interface Guidelines
4. Recommend optimal placement relative to CTA buttons
5. Specify interaction patterns (haptics, visual feedback, loading states)
6. Ensure VoiceOver accessibility
7. Define error states and edge cases

Focus on:
- User trust and transparency
- Non-intrusive design
- Consistent navigation behavior
- Accessibility compliance
- Industry best practices

Output UX recommendations including:
- Optimal placement strategy
- Interaction patterns
- Navigation behavior
- Accessibility requirements
- Edge case handling
```

---

### Phase 2: Component Development

**Task 2.1: Create LegalFooter Component**
- **Agent:** general-purpose
- **Duration:** 45 minutes
- **Deliverable:** `components/legal/LegalFooter.tsx` + tests
- **Command:**
```
Create a reusable LegalFooter component for the DailyHush mobile app following senior developer best practices:

REQUIREMENTS:
1. File: components/legal/LegalFooter.tsx
2. TypeScript with full type safety
3. Props-based configuration (NO hardcoded values)
4. Reusable across all screens
5. Follows existing design system (constants/colors.ts, constants/spacing.ts)

FEATURES:
- Links: Privacy Policy, Terms of Service, Restore Purchases (optional)
- Navigation: React Router (expo-router)
- Haptic feedback on press (expo-haptics)
- Accessible (screen reader support)
- Dark mode compatible
- Configurable variants (default, compact)
- Custom styling via props

TECHNICAL SPECS:
- Use Pressable for links (not TouchableOpacity)
- Use router.push() for navigation
- Use Haptics.impactAsync(ImpactFeedbackStyle.Light)
- Minimum tap target: 44x44pt (iOS standard)
- Separator: ' • ' between links
- Text color: colors.text.tertiary
- Link color on press: colors.emerald[400]
- Font size: 11-12px
- Responsive layout

PROPS:
interface LegalFooterProps {
  variant?: 'default' | 'compact';
  showRestore?: boolean;
  textAlign?: 'center' | 'left' | 'right';
  containerStyle?: ViewStyle;
  onRestorePurchases?: () => void;
}

BEST PRACTICES:
- No hardcoded strings (use constants if needed)
- Proper TypeScript types
- Component composition
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Accessible (aria labels)
- Error handling

Also create:
- components/legal/index.ts (barrel export)
- Basic usage examples in comments
```

**Task 2.2: Create PrivacyDisclosure Component**
- **Agent:** general-purpose
- **Duration:** 30 minutes
- **Deliverable:** `components/legal/PrivacyDisclosure.tsx`
- **Command:**
```
Create a reusable PrivacyDisclosure component for the DailyHush mobile app:

REQUIREMENTS:
1. File: components/legal/PrivacyDisclosure.tsx
2. TypeScript with full type safety
3. Props-based configuration
4. Reusable for different disclosure contexts
5. Follows existing design system

FEATURES:
- Warning icon (optional, from lucide-react-native)
- Disclosure message (configurable per type)
- Link to Privacy Policy
- Card-style container with border
- Multiple disclosure types: 'account-deletion' | 'data-retention' | 'generic'

TECHNICAL SPECS:
- Container: backgroundColor: colors.background.card, borderRadius: 12
- Border: colors.orange[700] + '40' (warning style)
- Icon: AlertCircle from lucide-react-native, size 20
- Text: fontSize 14, color: colors.text.secondary
- Link: fontSize 14, color: colors.emerald[400], fontWeight '600'
- Haptic feedback on link press

PROPS:
interface PrivacyDisclosureProps {
  type: 'account-deletion' | 'data-retention' | 'generic';
  showIcon?: boolean;
  containerStyle?: ViewStyle;
}

CONTENT:
const DISCLOSURE_CONTENT = {
  'account-deletion': {
    icon: AlertCircle,
    title: 'Important: Data Retention',
    message: 'Deleting your account will remove your login credentials, but some data will be retained for legal and analytics purposes.',
    linkText: 'Review our Privacy Policy'
  }
}

Update components/legal/index.ts to export this component.
```

---

### Phase 3: Integration

**Task 3.1-3.4: Integrate Components into All Screens**
- **Agent:** general-purpose
- **Duration:** 1.5 hours total (20-30 min each)
- **Deliverable:** Updated screens with legal components
- **Command:**
```
Integrate the LegalFooter and PrivacyDisclosure components into the DailyHush app following these requirements:

TASK 3.1: app/subscription.tsx
- Import LegalFooter from '@/components/legal'
- Add inside ScrollView, after existing content, before purchase button
- Props: showRestore={true}, onRestorePurchases={handleRestore}
- Wire up existing handleRestore function
- Ensure proper spacing (marginTop: spacing.xl)

TASK 3.2: app/onboarding/quiz/paywall.tsx
- Import LegalFooter from '@/components/legal'
- Add after PricingPreview component
- Props: showRestore={true}, onRestorePurchases={handleRestorePurchases}
- Create handleRestorePurchases function (check RevenueCat for existing purchases)

TASK 3.3: app/trial-expired.tsx
- Import LegalFooter from '@/components/legal'
- Add inside TrialExpiredPaywall component OR pass as prop
- Recommend: Modify TrialExpiredPaywall to accept showLegalFooter prop
- Props: showRestore={true}, onRestorePurchases={handleRestore}

TASK 3.4: app/settings/delete-account.tsx
- Import PrivacyDisclosure from '@/components/legal'
- Add ABOVE password input field (after warning banner)
- Props: type="account-deletion", showIcon={true}
- Ensure link opens '/legal/privacy'

REQUIREMENTS:
- Follow existing code style and patterns
- Maintain type safety
- Preserve existing functionality
- Test navigation after integration
- Ensure proper spacing and layout
- No breaking changes to existing features

For each integration:
1. Read the file first to understand structure
2. Import the component
3. Add component in correct position
4. Wire up any callbacks
5. Test that it doesn't break existing functionality
```

---

### Phase 4: Testing & QA

**Task 4.1-4.3: Comprehensive Testing**
- **Agent:** general-purpose
- **Duration:** 1 hour
- **Deliverable:** Test report with all checks completed
- **Command:**
```
Perform comprehensive testing of the legal footer implementation:

COMPONENT TESTS (LegalFooter):
1. Test with default props (no errors, renders correctly)
2. Test with showRestore={true} (restore link appears)
3. Test with showRestore={false} (restore link hidden)
4. Test navigation to /legal/privacy (verify route exists)
5. Test navigation to /legal/terms (verify route exists)
6. Test onRestorePurchases callback (mock function called)
7. Test compact variant vs default variant
8. Test on iPhone SE screen size (320x568)
9. Test on iPhone 14 Pro Max screen size (430x932)
10. Verify haptic feedback triggers (check logs)

INTEGRATION TESTS:
1. app/subscription.tsx - Legal footer appears, restore works
2. app/onboarding/quiz/paywall.tsx - Legal footer appears, layout correct
3. app/trial-expired.tsx - Legal footer appears
4. app/settings/delete-account.tsx - Privacy disclosure appears above password

USER FLOW TESTS:
1. New user trial signup flow
2. Returning user restore purchases flow
3. Account deletion with privacy disclosure review

ACCESSIBILITY TESTS:
1. VoiceOver reads all links correctly
2. Tap targets are minimum 44x44pt
3. Contrast ratio meets WCAG 2.1 AA (4.5:1)
4. Focus order is logical

Create a test report documenting:
- All test cases executed
- Pass/fail status
- Any bugs found
- Screenshots of key screens
- Recommendations for fixes

If any tests fail, fix the issues and re-test.
```

---

### Phase 5: Documentation

**Task 5.1-5.2: Create Documentation**
- **Agent:** general-purpose
- **Duration:** 30 minutes
- **Deliverable:** Updated documentation files
- **Command:**
```
Update all documentation to reflect the legal footer implementation:

FILES TO CREATE/UPDATE:

1. components/legal/README.md (NEW)
   - Component overview
   - Usage examples for LegalFooter
   - Usage examples for PrivacyDisclosure
   - Props documentation
   - Best practices
   - Common patterns

2. APP_STORE_COMPLIANCE.md (UPDATE)
   - Mark legal footer tasks as complete
   - Update compliance status
   - Add implementation dates
   - Update "Recommended Locations" section to show ✅

3. LEGAL_PLACEMENT_COMPLIANCE_RESEARCH.md (UPDATE)
   - Add "Implementation Complete" section
   - Document what was implemented
   - Include code examples
   - Add screenshots or visual descriptions

4. Create IMPLEMENTATION_SUMMARY.md (NEW)
   - Summary of changes
   - Components created
   - Files modified
   - Testing results
   - Future recommendations

DOCUMENTATION STANDARDS:
- Use Markdown formatting
- Include code examples with syntax highlighting
- Use emojis for status (✅ ❌ ⚠️)
- Include file paths
- Add table of contents for long documents
- Include "Last Updated" date

Ensure all documentation is:
- Clear and concise
- Technically accurate
- Easy to follow
- Well-organized
- Future-proof (easy to update)
```

---

## Implementation Checklist

### Pre-Implementation
- [ ] Review LEGAL_PLACEMENT_COMPLIANCE_RESEARCH.md
- [ ] Understand App Store requirements
- [ ] Review existing design system
- [ ] Review existing legal pages (/legal/privacy, /legal/terms)

### Phase 1: Design (1 hour)
- [ ] **Task 1.1:** Component design specifications (ui-design-expert)
- [ ] **Task 1.2:** UX pattern review (ux-expert)
- [ ] Review and approve design specs
- [ ] Review and approve UX recommendations

### Phase 2: Development (2 hours)
- [ ] **Task 2.1:** Create LegalFooter component
  - [ ] Create component file
  - [ ] Implement props interface
  - [ ] Implement navigation logic
  - [ ] Implement haptic feedback
  - [ ] Implement accessibility
  - [ ] Create barrel export
  - [ ] Add inline documentation
- [ ] **Task 2.2:** Create PrivacyDisclosure component
  - [ ] Create component file
  - [ ] Implement props interface
  - [ ] Implement disclosure types
  - [ ] Implement warning icon
  - [ ] Update barrel export
  - [ ] Add inline documentation

### Phase 3: Integration (1.5 hours)
- [ ] **Task 3.1:** Integrate into app/subscription.tsx
  - [ ] Import component
  - [ ] Add to layout
  - [ ] Wire up restore purchases
  - [ ] Test navigation
- [ ] **Task 3.2:** Integrate into app/onboarding/quiz/paywall.tsx
  - [ ] Import component
  - [ ] Add to layout
  - [ ] Wire up restore purchases
  - [ ] Test navigation
- [ ] **Task 3.3:** Integrate into app/trial-expired.tsx
  - [ ] Import component
  - [ ] Modify TrialExpiredPaywall (if needed)
  - [ ] Add to layout
  - [ ] Wire up restore purchases
  - [ ] Test navigation
- [ ] **Task 3.4:** Integrate into app/settings/delete-account.tsx
  - [ ] Import PrivacyDisclosure
  - [ ] Add above password input
  - [ ] Test navigation
  - [ ] Verify layout

### Phase 4: Testing (1 hour)
- [ ] **Task 4.1:** Component testing
  - [ ] LegalFooter unit tests
  - [ ] PrivacyDisclosure unit tests
  - [ ] Accessibility tests
  - [ ] Responsive tests
- [ ] **Task 4.2:** Integration testing
  - [ ] Test all 4 screens
  - [ ] Test navigation flow
  - [ ] Test restore purchases
  - [ ] Test on multiple devices
- [ ] **Task 4.3:** User flow testing
  - [ ] New user trial signup
  - [ ] Returning user restore
  - [ ] Account deletion flow
  - [ ] Edge cases

### Phase 5: Documentation (30 minutes)
- [ ] **Task 5.1:** Component documentation
  - [ ] Create components/legal/README.md
  - [ ] Add usage examples
  - [ ] Document props
  - [ ] Add best practices
- [ ] **Task 5.2:** Update compliance docs
  - [ ] Update APP_STORE_COMPLIANCE.md
  - [ ] Update LEGAL_PLACEMENT_COMPLIANCE_RESEARCH.md
  - [ ] Create IMPLEMENTATION_SUMMARY.md

### Post-Implementation
- [ ] Run `npm run lint` (ensure no errors)
- [ ] Run `npm run type-check` (ensure no TypeScript errors)
- [ ] Test on physical device (if available)
- [ ] Create test build and verify
- [ ] Get stakeholder approval
- [ ] Mark tasks complete in project management tool

---

## Best Practices Enforced

### 1. Component Architecture
✅ **Single Responsibility:** Each component has one clear purpose
✅ **Composition:** Components are composable and reusable
✅ **Props Over Configuration:** All configuration via props, no hardcoded values
✅ **Type Safety:** Full TypeScript type coverage

### 2. Code Quality
✅ **DRY Principle:** No repeated code, shared logic extracted
✅ **Naming Conventions:** Clear, descriptive names (LegalFooter, PrivacyDisclosure)
✅ **Modularity:** Components are independent and portable
✅ **Testability:** Easy to test in isolation

### 3. Design System Consistency
✅ **Colors:** Use constants/colors.ts exclusively
✅ **Spacing:** Use constants/spacing.ts exclusively
✅ **Typography:** Use constants/typography.ts exclusively
✅ **Icons:** Use lucide-react-native consistently

### 4. Accessibility
✅ **Screen Reader Support:** Proper aria labels
✅ **Tap Targets:** Minimum 44x44pt (iOS standard)
✅ **Contrast:** WCAG 2.1 AA compliant (4.5:1)
✅ **Focus Order:** Logical and intuitive

### 5. User Experience
✅ **Haptic Feedback:** Light haptics on interactions
✅ **Visual Feedback:** Color change on press
✅ **Loading States:** Indicate async operations
✅ **Error Handling:** Graceful error messages

### 6. Performance
✅ **Lazy Loading:** Components loaded only when needed
✅ **Memoization:** Use React.memo if needed
✅ **Optimization:** No unnecessary re-renders
✅ **Bundle Size:** Minimal impact on app size

---

## Success Metrics

**Code Quality:**
- [ ] 0 ESLint errors
- [ ] 0 TypeScript errors
- [ ] 0 hardcoded values
- [ ] 100% type coverage

**Functionality:**
- [ ] All links navigate correctly
- [ ] Restore purchases works
- [ ] Haptic feedback works
- [ ] Accessibility works

**Design:**
- [ ] Matches design system
- [ ] Responsive on all screen sizes
- [ ] Dark mode compatible
- [ ] Visually consistent

**Compliance:**
- [ ] Meets Apple App Store requirements
- [ ] Meets Google Play Store requirements
- [ ] Follows industry best practices
- [ ] Builds user trust

---

## Timeline

**Total Estimated Time:** 4-5 hours

| Phase | Duration | Agent | Deliverable |
|-------|----------|-------|-------------|
| 1.1 Design Specs | 30 min | ui-design-expert | Design specifications |
| 1.2 UX Review | 30 min | ux-expert | UX recommendations |
| 2.1 LegalFooter | 45 min | general-purpose | LegalFooter component |
| 2.2 PrivacyDisclosure | 30 min | general-purpose | PrivacyDisclosure component |
| 3.1 Subscription | 20 min | general-purpose | Updated subscription.tsx |
| 3.2 Onboarding | 20 min | general-purpose | Updated paywall.tsx |
| 3.3 Trial Expired | 20 min | general-purpose | Updated trial-expired.tsx |
| 3.4 Delete Account | 30 min | general-purpose | Updated delete-account.tsx |
| 4.1 Component Tests | 20 min | general-purpose | Test report |
| 4.2 Integration Tests | 20 min | general-purpose | Test report |
| 4.3 Flow Tests | 20 min | general-purpose | Test report |
| 5.1 Component Docs | 15 min | general-purpose | README.md |
| 5.2 Compliance Docs | 15 min | general-purpose | Updated compliance docs |

**Total:** ~5 hours (allowing buffer for iterations)

---

## Risk Mitigation

### Potential Risks

1. **Design doesn't match existing pattern**
   - Mitigation: Review design system before starting
   - Review: ui-design-expert validates design

2. **Component breaks existing layouts**
   - Mitigation: Test on all screen sizes
   - Review: Test extensively before finalizing

3. **Navigation doesn't work**
   - Mitigation: Test navigation early
   - Review: Verify routes exist before integrating

4. **Restore purchases fails**
   - Mitigation: Review existing restore logic
   - Review: Test with RevenueCat sandbox

5. **Accessibility issues**
   - Mitigation: Follow iOS HIG from start
   - Review: Test with VoiceOver

6. **App Store rejection**
   - Mitigation: Follow official guidelines
   - Review: Compare with approved apps (Calm, Headspace)

---

## Next Steps After Completion

1. **App Store Submission Prep:**
   - Take screenshots showing legal footer
   - Update App Store description
   - Prepare for App Review questions

2. **User Education:**
   - Update onboarding to mention privacy commitment
   - Add to FAQ: "Where can I find Privacy Policy?"
   - Consider in-app tour highlighting legal access

3. **Future Enhancements:**
   - Add "Privacy Dashboard" screen
   - Add "Data Export" feature
   - Add "Cookie Settings" (if web component added)
   - Consider GDPR consent management

4. **Monitoring:**
   - Track user engagement with legal links (analytics)
   - Monitor support tickets about privacy
   - Track app review feedback
   - Monitor competitor updates

---

**Document Version:** 1.0
**Last Updated:** January 1, 2025
**Author:** Claude Code
**Reviewed By:** [Pending]
**Approved By:** [Pending]
