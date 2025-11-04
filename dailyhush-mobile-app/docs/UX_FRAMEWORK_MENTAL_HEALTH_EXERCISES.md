# UX Framework: Mental Health Exercises for Overthinkers (Ages 55-70)

## Executive Summary

This comprehensive UX framework is specifically designed for mental health exercises targeting overthinkers aged 55-70. It addresses the unique needs of this demographic: larger touch targets, higher contrast, simplified interactions, and reduced cognitive load during moments of distress.

**Core Philosophy**: "Calm by design. Simple by necessity. Accessible by default."

---

## 1. STOP SPIRALING (Interrupt Rumination)

### Purpose
Interrupt the rumination loop within seconds. This is the most urgent intervention - users are in active distress.

### Interaction Patterns

#### Entry Flow
```
Trigger Detection → Pre-Check (Optional) → Protocol Start → Active Interruption → Post-Check → Log → Exit
```

**Key Decisions**:
- **Skip Pre-Check When Urgent**: If user comes from "I'm spiraling now" button, skip directly to protocol
- **Auto-Start Option**: Button says "Let's Break This (90 seconds)" - clear time expectation
- **One-Tap Entry**: No navigation maze when someone is spiraling

#### Step Progression
```typescript
// Current proven pattern from spiral.tsx
const protocolSteps = [
  { duration: 5, pattern: 'acknowledge' },    // "You're in a loop"
  { duration: 5, pattern: 'ground' },         // "Notice where you are"
  { duration: 8, pattern: 'sense-5' },        // 5 things you see
  { duration: 8, pattern: 'sense-4' },        // 4 things you hear
  { duration: 8, pattern: 'sense-3' },        // 3 things you touch
  { duration: 10, pattern: 'breathe-in' },    // Slow inhale
  { duration: 15, pattern: 'breathe-out' },   // Extended exhale
  { duration: 5, pattern: 'validate' },       // "You interrupted it"
];

// Auto-progression with haptic feedback at transitions
```

**Why This Works for 55-70**:
- Fixed duration removes decision fatigue
- Haptic feedback confirms transitions without visual attention
- No manual advancing needed during distress
- Familiar grounding technique (5-4-3-2-1)

#### Input Methods Priority
1. **TAP**: Primary interaction (Pause/Resume, Skip)
2. **VOICE**: NOT recommended during active spiral (cognitive load)
3. **SWIPE**: Disabled (accidental triggers when anxious)
4. **TEXT**: Only post-exercise for trigger logging

#### Interruption Handling
```
User Exits Mid-Protocol:
├─ No guilt message
├─ Save progress automatically
├─ Show gentle reminder: "Come back anytime. That loop can wait."
└─ Optional quick exit survey: "What happened?" [1-tap options]
```

**Exit Options**:
- Large "X" in top-left (44x44pt minimum)
- Confirmation: "Take a break?" [Yes] [Keep Going]
- No data loss on exit

#### Pacing Between Steps
- **5-15 seconds per step** (current implementation)
- Visual countdown ring (non-distracting)
- Soft haptic pulse at transitions
- Background audio continues (meditation sound)

### Visual Design

#### Color Psychology
```typescript
// Spiral Interrupt Colors (from spiral.tsx)
const spiralColors = {
  background: '#0A1612',           // Deep forest - maximum calm
  overlay: 'rgba(10, 22, 18, 0.85)', // 85% dark over forest image
  primary: '#40916C',               // Soft emerald - reassuring
  glow: '#52B788',                  // Gentle glow - safe
  text: '#E8F4F0',                  // High contrast white
  textSecondary: '#95B8A8',         // Soft sage - less urgent
  ring: '#40916C',                  // Progress indicator
  ringGlow: '#52B788',              // Glow effect
};
```

**Why These Colors**:
- **Green = Safety**: Evolutionary response to nature
- **Dark Background**: Reduces eye strain, works in bed
- **No Red/Orange**: Avoids alarm response
- **Muted Emerald**: Therapeutic without being clinical

#### Animation Principles

**DO USE**:
```typescript
// Breathing animation (subtle, purposeful)
breathingAnimation = {
  scale: { from: 1.0, to: 1.15 },  // Gentle expansion
  duration: { in: 4000, out: 10000 }, // Natural breathing rhythm
  easing: 'ease-in-out',
  purpose: 'Guide breathing pace',
};

// Progress ring (informative)
progressRing = {
  strokeWidth: 8,                   // Thick enough to see
  color: '#40916C',                 // Consistent branding
  glow: true,                       // Soft radiance
  smooth: true,                     // 60fps
};
```

**DO NOT USE**:
- ❌ Bounce effects (feels playful, not calming)
- ❌ Fast transitions (<300ms is jarring)
- ❌ Pulsing text (creates urgency)
- ❌ Parallax (motion sickness risk)
- ❌ Spinning loaders (increases anxiety)

#### Typography for Distress
```typescript
// Optimal readability during high anxiety
const spiralTypography = {
  instruction: {
    size: 20,                        // Large enough without glasses
    weight: '500',                   // Medium weight - not bold (less aggressive)
    lineHeight: 1.6,                 // Extra breathing room
    letterSpacing: 0.3,              // Slight spacing for clarity
    font: 'Poppins_500Medium',       // Rounded, friendly
    maxWidth: '85%',                 // Prevent long lines
    textAlign: 'center',             // Easy to scan
  },
  countdown: {
    size: 60,                        // Visible from arms-length
    weight: 'bold',
    color: '#E8F4F0',                // Maximum contrast
    tabularNums: true,               // Consistent width for counting
  },
  secondary: {
    size: 14,
    weight: '400',
    color: '#95B8A8',                // Less prominent
  },
};
```

**Age 55-70 Considerations**:
- **20pt minimum** for body text (many have presbyopia)
- **No serif fonts** (harder to read on screens)
- **No all-caps** (reduces readability by 10-20%)
- **High contrast** (7:1 minimum for WCAG AAA)

#### Iconography
```
Current Implementation (GOOD):
✓ Pause/Play icons (universal)
✓ Skip forward (familiar from media)
✓ Close X (consistent placement)
✓ Checkmark for completion (positive reinforcement)

Avoid:
❌ Abstract symbols (cognitive load)
❌ Icon-only buttons (always include text)
❌ Gradients in icons (reduces clarity)
```

### Accessibility for 55-70 Demographic

#### Touch Target Sizes
```typescript
// From existing implementation
const touchTargets = {
  primary: 56,      // Main CTA buttons (56x56pt)
  secondary: 44,    // Back/close buttons (44x44pt minimum iOS)
  emoji: 48,        // Emotion selection (current: good)
  minimum: 44,      // Never go below this
  spacing: 16,      // Minimum gap between targets
};

// Real implementation from spiral.tsx
<Pressable
  style={{
    width: 44,
    height: 44,
    borderRadius: 22,
  }}
>
  <ArrowLeft size={20} />  // Icon smaller than touch area
</Pressable>
```

**Why This Matters**:
- Reduced fine motor control with age
- Tremor considerations
- "Fat finger" errors cause frustration during distress

#### Text Sizes and Contrast
```typescript
const accessibleText = {
  // Meets WCAG AAA (7:1 contrast minimum)
  heading: {
    size: 28,
    color: '#FFFFFF',      // 21:1 contrast on #0A1612
    weight: 'bold',
  },
  body: {
    size: 18,              // Increased from typical 16px
    color: '#E8F4F0',      // 19.5:1 contrast
    lineHeight: 1.6,
  },
  secondary: {
    size: 16,
    color: '#C8E6DB',      // 9:1 contrast (WCAG AAA)
    lineHeight: 1.5,
  },
  minimum: 14,             // Use only for labels
};
```

**Testing Protocol**:
1. View on device at arms-length (24-30 inches)
2. Test with device brightness at 50%
3. Use iOS Accessibility Inspector for contrast
4. Test with "Larger Text" iOS setting enabled

#### Cognitive Load Considerations
```
Stress Level → Cognitive Capacity
═══════════════════════════════════
High Spiral → 30% capacity  → Show 1 thing at a time
Medium      → 50% capacity  → Max 2 choices
Baseline    → 100% capacity → Normal UI
```

**Design Rules**:
- One instruction per screen
- Maximum 2 buttons visible simultaneously
- No scrolling during active protocol
- Progress indicator optional (can be hidden)
- Timer visible but not prominent

#### Motion Sensitivity
```typescript
// Respect user preferences
const motionConfig = {
  reduceMotion: useReducedMotion(), // iOS accessibility setting
  animations: {
    breathing: reduceMotion ? 'none' : 'gentle',
    transitions: reduceMotion ? 'instant' : 'fade',
    progressRing: reduceMotion ? 'static' : 'animated',
  },
};
```

**Implementation**:
```typescript
import { useReducedMotion } from 'react-native-reanimated';

const breatheAnimation = useReducedMotion()
  ? Animated.Value(1)  // No animation
  : createBreathingAnimation(); // Gentle scale
```

#### Audio Alternatives
```
Visual Element → Audio Equivalent
═══════════════════════════════════
Countdown timer → Soft chime at transitions
Progress ring   → Periodic voice cues
Instructions    → Text-to-speech option
Completion      → Success chime
```

**Audio Guidelines**:
- **Optional by default** (respect silence in public)
- Volume: 60% of system max
- Tone: Nature sounds > synthetic beeps
- Haptics: Always accompany audio for deaf users

### Completion Psychology

#### Progress Indicators
```typescript
// Current implementation analysis
const progressStrategy = {
  during: {
    show: true,              // User wants to know "how long?"
    type: 'ring',            // Circular feels endless (good)
    number: true,            // Countdown timer (transparency)
    stepCounter: true,       // "Step 3 of 12" (optional, can hide)
  },
  philosophy: 'Show progress, but dont make it feel long',
};
```

**Research-Backed Choices**:
- Countdown (90, 89, 88...) feels faster than count-up
- Circular progress feels infinite (less pressure)
- Step counter can be hidden if user exits frequently
- No percentage (90% feels farther than "9 seconds")

#### Time Remaining vs Hiding It
```
SHOW TIME WHEN:
✓ User chose to start (they consented to duration)
✓ First-time users (builds trust)
✓ Protocol is <2 minutes (feels achievable)

HIDE TIME WHEN:
✓ User is in severe distress (timer creates pressure)
✓ Exercise is open-ended (journaling, meditation)
✓ User has exited multiple times (timer creates anxiety)
```

**Adaptive Approach**:
```typescript
const showTimer = {
  firstSession: true,
  afterExit: false,        // They felt pressured
  userPreference: true,    // Settings option
  spiralSeverity: (level) => level < 8, // Hide if severe
};
```

#### Celebration Moments
```typescript
// From ModuleComplete.tsx - proven pattern
const celebrationPattern = {
  animation: {
    type: 'SuccessRipple',   // Gentle expanding circles
    size: 70,                // Not overwhelming
    duration: 2000,
  },
  haptic: 'success',         // iOS success haptic
  message: {
    primary: 'You Just Interrupted the Loop',
    secondary: 'That pattern wanted to run for 72 hours. You stopped it in 90 seconds.',
    tone: 'empowering, not congratulatory',
  },
  timing: {
    delay: 0,                // Immediate validation
    duration: 3000,          // 3s max, then move on
  },
};
```

**Why This Works**:
- Acknowledges effort without being patronizing
- Frames achievement objectively (90s vs 72hrs)
- Visual feedback confirms completion
- Doesn't linger (user wants to move on)

#### Exit Points Without Guilt
```
Exit Option 1: Mid-Protocol
┌────────────────────────────┐
│  Take a break?             │
│                            │
│  [Keep Going] [Not Now]    │
│                            │
│  "Come back anytime."      │
└────────────────────────────┘

Exit Option 2: Skip to End
┌────────────────────────────┐
│  Skip ahead?               │
│                            │
│  You've done 45 seconds.   │
│  [Finish] [Skip]           │
│                            │
│  "No pressure either way." │
└────────────────────────────┘

Exit Option 3: Post-Protocol
┌────────────────────────────┐
│  How do you feel?          │
│                            │
│  [Worse] [Same] [Better]   │
│                            │
│  [Skip this] ← Always visible
└────────────────────────────┘
```

**Guilt-Free Language**:
- ✅ "Come back anytime"
- ✅ "No pressure"
- ✅ "You did great"
- ❌ "Are you sure?" (implies wrong choice)
- ❌ "Don't give up!" (adds pressure)
- ❌ "Almost there!" (when they're struggling)

### Mobile-First Constraints

#### Works in Bed (Dark Mode, Night Use)
```typescript
const nightOptimizations = {
  colors: {
    background: '#0A1612',    // Already dark-mode optimized
    text: '#E8F4F0',          // Reduced blue light
    avoid: ['#FFFFFF'],       // Pure white is harsh
  },
  brightness: {
    recommendation: 30-40%,
    autoDetect: true,         // Reduce brightness at night
  },
  haptics: {
    intensity: 'light',       // Don't disturb partner
    nightMode: 'reduce',      // 50% intensity after 10pm
  },
  blueLight: {
    filter: 'warmth',         // Shift toward amber
    autoEnable: 'after 9pm',
  },
};
```

**Bed-Use Checklist**:
- ✅ Dark background (no flashbangs)
- ✅ Low blue light (doesn't affect melatonin)
- ✅ Quiet haptics (won't wake partner)
- ✅ Portrait-only (side-lying position)
- ✅ No sudden audio (respects silence)
- ✅ Large touch targets (imprecise when lying down)

#### Works in Public (Silent Modes)
```typescript
const publicModeFeatures = {
  audio: {
    default: 'off',           // User must opt-in
    indicator: '🔇',          // Show audio is off
    quickToggle: true,        // Easy to mute
  },
  haptics: {
    default: 'on',            // Private feedback
    strength: 'light',        // Discrete
  },
  visuals: {
    screenDimming: 'subtle',  // Don't draw attention
    notifyDuration: 'short',  // Quick glances
  },
  privacy: {
    screenContent: 'generic', // No "ANXIETY" headlines
    lockScreen: 'hide',       // Don't show in notifications
  },
};
```

**Public-Space Features**:
- Generic screen titles ("Breathing Exercise" not "Stop Panic Attack")
- Quick minimize/hide
- No audio by default
- Haptic-only guidance option
- Privacy blur when app is backgrounded

#### Works When Anxious (Simplified UI)
```
Anxiety Level → UI Complexity
═══════════════════════════════
Severe (8-10) → 1 button max, auto-advance
Medium (4-7)  → 2 buttons, simple choices
Baseline(1-3) → Normal UI, full features
```

**Anxious-State Design**:
```typescript
const anxiousStateUI = {
  buttons: {
    max: 1,                   // Primary action only
    size: 'large',            // 56pt height minimum
    spacing: 24,              // Wide spacing
  },
  text: {
    words: 50,                // Max per screen
    instructions: 'simple',   // 6th-grade reading level
    chunks: 1,                // One idea at a time
  },
  navigation: {
    back: 'always visible',   // Never trap user
    steps: 'hidden',          // Don't show "5 more screens"
    auto: true,               // Advance automatically
  },
  decisions: {
    perScreen: 1,             // One choice maximum
    default: 'safe',          // Pre-select safe option
    timeout: 'none',          // Never pressure
  },
};
```

#### Battery/Data Considerations
```typescript
const performanceOptimizations = {
  battery: {
    animations: '60fps max',  // No 120fps waste
    gps: 'off',               // No location tracking
    backgroundRefresh: 'off', // User initiated only
    screenOn: 'user controlled',
  },
  data: {
    caching: 'aggressive',    // Cache all audio/images
    offline: 'full support',  // Works without internet
    analytics: 'wifi-only',   // Don't use cellular
    images: 'local first',    // No CDN dependencies
  },
  storage: {
    audioCache: '50MB max',   // Meditation sounds
    imageCache: '20MB max',   // Minimal graphics
    clearStrategy: 'LRU',     // Least recently used
  },
};
```

**Offline-First**:
- All audio preloaded on install
- All images bundled locally
- No required network calls
- Sync data when available (not required)

---

## 2. CALM ANXIETY (Reduce Stress)

### Purpose
Preventive care and maintenance. Used when user feels anxiety building but isn't spiraling yet.

### Interaction Patterns

#### Entry Flow
```
Trigger: "I feel anxious" → Intensity Check → Technique Selection → Guided Practice → Progress Check → Complete
```

**Key Differences from Spiral**:
- Less urgent (user has more capacity)
- Multiple technique options (breathing, progressive relaxation, grounding)
- Longer duration options (2-5 minutes)
- More interactive (user makes choices)

#### Step Progression
```typescript
const calmAnxietyFlow = {
  step1: {
    type: 'intensity-check',
    question: 'How anxious do you feel?',
    scale: '1-10 slider',
    visual: 'thermometer visual',
  },
  step2: {
    type: 'technique-selection',
    options: [
      { name: 'Box Breathing', duration: '2 min', icon: '🌬️' },
      { name: 'Body Scan', duration: '5 min', icon: '🧘' },
      { name: 'Grounding', duration: '3 min', icon: '🌿' },
    ],
    layout: 'large cards',
    selection: 'tap',
  },
  step3: {
    type: 'guided-practice',
    autoProgress: true,
    pauseable: true,
    audioGuided: 'optional',
  },
  step4: {
    type: 'progress-check',
    question: 'How do you feel now?',
    comparison: 'before/after',
  },
};
```

#### Input Methods Priority
1. **TAP**: Primary (select technique, adjust settings)
2. **SLIDER**: Intensity rating (visual + numeric)
3. **VOICE**: Optional for guided meditation
4. **TEXT**: Not used (reduces friction)

### Visual Design

#### Color Psychology
```typescript
const calmColors = {
  background: ['#0F1F1A', '#1A4D3C'],  // Gradient: lighter than spiral
  primary: '#10B981',                   // Brighter emerald - energizing calm
  accent: '#34D399',                    // Light emerald - hope
  text: '#E8F4F0',                      // High contrast
  textSecondary: '#B7D4C7',             // Warmer than spiral
  progress: '#10B981',                  // Positive reinforcement
};
```

**Why Different from Spiral**:
- **Lighter greens** = Less severe, more preventive
- **Gradient backgrounds** = Sense of movement/progress
- **Brighter accents** = Gentle energy (not sedating)

#### Animation Principles
```typescript
const calmAnimations = {
  breathing: {
    visual: 'expanding circle',
    scale: { min: 0.8, max: 1.2 },      // More dramatic than spiral
    timing: {
      inhale: 4,
      hold: 4,
      exhale: 4,
      hold: 4,
    },
    colors: ['#10B981', '#34D399'],     // Pulse through emeralds
  },
  bodyScan: {
    highlight: 'body region',
    movement: 'top to bottom',
    speed: 'slow (30s per region)',
    feedback: 'gentle glow',
  },
  transitions: {
    duration: 400,                       // Slightly faster than spiral
    easing: 'ease-in-out',
  },
};
```

### Completion Psychology

#### Progress Indicators
```
Show Progress:
├─ Circular timer (less pressure than countdown)
├─ Technique name always visible
├─ Step indicator (optional hide)
└─ Audio waveform (if audio enabled)

Hide by Default:
├─ Time remaining (creates pressure)
├─ Percentage complete (feels slow)
└─ Steps remaining (overwhelming)
```

#### Celebration
```typescript
const calmCelebration = {
  completion: {
    animation: 'gentle fade-in',
    icon: '✨',
    message: 'You took time for yourself',
    dataPoint: 'Anxiety reduced by X points',
  },
  encouragement: {
    show: 'if improvement',
    message: '3 sessions this week - you're building the skill',
  },
};
```

---

## 3. PROCESS EMOTIONS (Understand Feelings)

### Purpose
Emotional awareness and labeling. Helps users understand what they're feeling and why.

### Interaction Patterns

#### Entry Flow
```
Trigger → Emotion Wheel → Intensity → Context → Insight → Journal (Optional)
```

**Unique Characteristics**:
- More reflective (requires working memory)
- Open-ended text input (optional)
- Emotion vocabulary building
- Pattern recognition over time

#### Step Progression
```typescript
const processEmotionsFlow = {
  step1: {
    type: 'emotion-wheel',
    categories: ['Happy', 'Sad', 'Angry', 'Anxious', 'Surprised', 'Disgusted'],
    interaction: 'tap to expand',
    depth: 3,  // Category → Emotion → Specific nuance
  },
  step2: {
    type: 'intensity',
    visual: 'color gradient',
    range: '1-10',
    feedback: 'real-time color change',
  },
  step3: {
    type: 'context',
    question: 'What triggered this feeling?',
    input: 'chips + optional text',
    chips: ['Work', 'Family', 'Health', 'Money', 'Social', 'Other'],
  },
  step4: {
    type: 'insight',
    display: 'pattern detection',
    example: 'You often feel this way on Sunday evenings',
    action: 'Would you like to explore why?',
  },
  step5: {
    type: 'journal',
    optional: true,
    prompt: 'Want to write about it?',
    input: 'multiline text',
    wordCount: 'hidden',  // No pressure
  },
};
```

#### Input Methods Priority
1. **TAP**: Emotion selection, chips
2. **SLIDER**: Intensity
3. **TEXT**: Optional journaling
4. **VOICE**: Dictation for journal (recommended for 55-70)

### Visual Design

#### Color Psychology
```typescript
const emotionColors = {
  // Dynamic colors based on emotion selected
  happy: { primary: '#10B981', bg: '#0F1F1A' },
  sad: { primary: '#6B7280', bg: '#1F2937' },
  angry: { primary: '#DC2626', bg: '#1A0F0F' },
  anxious: { primary: '#F59E0B', bg: '#1F1A0A' },
  surprised: { primary: '#8B5CF6', bg: '#1A0F1F' },
  neutral: { primary: '#059669', bg: '#0A1612' },
};
```

**Adaptive Design**:
- Background shifts based on emotion
- Maintains readability (WCAG AAA)
- Smooth color transitions (500ms)

#### Typography
```typescript
const emotionTypography = {
  emotionLabel: {
    size: 24,                 // Large emotion words
    weight: '600',
    letterSpacing: 0.5,
  },
  journalInput: {
    size: 18,                 // Comfortable for extended writing
    lineHeight: 1.8,          // Extra breathing room
    placeholder: '#95B8A8',   // Soft invitation
  },
};
```

### Accessibility

#### Text Input for 55-70
```typescript
const journalAccessibility = {
  input: {
    fontSize: 18,             // Base size
    scaleWithSystemFont: true, // Respect iOS Text Size
    autocorrect: true,        // Help with spelling
    spellcheck: true,
    keyboardType: 'default',
    autoCapitalize: 'sentences',
  },
  dictation: {
    button: 'prominent',      // Large microphone icon
    hint: 'Tap to speak',
    errorHandling: 'graceful',
  },
};
```

---

## 4. BETTER SLEEP (Quiet Nighttime Thoughts)

### Purpose
Bedtime wind-down and middle-of-night rumination interrupt.

### Interaction Patterns

#### Entry Flow
```
Context Detection → Sleep Prep OR Night Wake → Technique → Gentle Exit
```

**Time-Aware Design**:
```typescript
const sleepFlowLogic = {
  evening: {  // 8pm - 11pm
    type: 'preparation',
    techniques: ['Body Scan', 'Gratitude', 'Tomorrow Planning'],
    duration: '10-15 minutes',
  },
  night: {  // 11pm - 6am
    type: 'rumination interrupt',
    techniques: ['Minimal Protocol', 'Breathing Only'],
    duration: '3-5 minutes',
    optimization: 'minimal interaction',
  },
};
```

#### Step Progression - Night Mode
```typescript
const nightProtocol = {
  entry: {
    screen: 'completely black',
    text: 'minimal white',
    brightness: 'auto-dim to 20%',
  },
  steps: [
    { type: 'acknowledge', text: 'You're awake. That's okay.' },
    { type: 'body-check', text: 'Notice you're in bed. Safe.' },
    { type: 'breathing', count: 10, display: 'minimal' },
    { type: 'exit', text: 'Rest now. No pressure.' },
  ],
  audio: {
    default: 'off',  // Don't wake partner
    option: 'white noise',
  },
};
```

### Visual Design

#### Night-Optimized Colors
```typescript
const sleepColors = {
  background: '#000000',        // Pure black (OLED optimization)
  text: '#8B7355',              // Warm amber (minimal blue light)
  textSecondary: '#5C4A3A',     // Darker amber
  accent: '#D4A574',            // Soft gold (not bright)
  avoid: ['#FFFFFF', '#E8F4F0'], // Too bright for night
};
```

**Blue Light Filtering**:
- No blues or cool greens after 9pm
- Amber/orange spectrum only
- Pure black backgrounds (saves OLED battery)

#### Animations - Minimal
```typescript
const sleepAnimations = {
  breathing: {
    visual: 'subtle opacity pulse',
    noScale: true,  // Avoid bright expansions
  },
  transitions: {
    duration: 600,  // Slower = calmer
    easing: 'ease-out',
  },
  disable: {
    bounces: true,
    slides: true,
    scales: true,
  },
};
```

### Mobile-First Constraints

#### Bed-Optimized Interactions
```typescript
const bedOptimizations = {
  orientation: {
    lock: 'portrait',  // No rotation when lying down
  },
  touchTargets: {
    minimum: 60,       // Even larger (imprecise when drowsy)
    spacing: 32,       // Extra spacing
  },
  haptics: {
    intensity: 0.3,    // 30% strength (quiet)
    pattern: 'gentle', // Soft pulses only
  },
  keepAwake: {
    screen: false,     // Allow auto-dim
    device: false,     // Allow auto-lock after 2min
  },
};
```

#### Partner-Aware Features
```
Silent Mode:
├─ No audio (default)
├─ Minimal haptics
├─ No bright flashes
├─ Screen dimming
└─ Quick minimize (if partner wakes)

Privacy:
├─ No notifications during sleep hours
├─ No lock screen previews
└─ App icon doesn't show usage
```

---

## 5. GAIN FOCUS (Clear Mental Clutter)

### Purpose
Cognitive clarity for task initiation or decision-making.

### Interaction Patterns

#### Entry Flow
```
Clutter Check → Brain Dump → Prioritization → Action Plan → Focus Timer
```

**Unique Characteristics**:
- Most cognitive load (requires clear thinking)
- Text input encouraged
- Task management elements
- Productive energy (vs calming)

#### Step Progression
```typescript
const focusFlow = {
  step1: {
    type: 'clutter-assessment',
    question: 'How cluttered does your mind feel?',
    visual: 'messy→clean gradient',
  },
  step2: {
    type: 'brain-dump',
    prompt: 'Write everything on your mind',
    input: 'large text area',
    guidance: 'No filtering. Just dump it all.',
  },
  step3: {
    type: 'prioritization',
    method: 'drag-to-order',
    fallback: 'tap to select top 3',  // Easier for 55-70
  },
  step4: {
    type: 'action-plan',
    output: 'one clear next step',
    option: 'set reminder',
  },
  step5: {
    type: 'focus-timer',
    duration: [15, 25, 45],  // Pomodoro options
    distraction: 'log only (no blocking)',
  },
};
```

#### Input Methods Priority
1. **TEXT**: Primary (brain dump)
2. **TAP**: Selection, prioritization
3. **VOICE**: Dictation (highly recommended)
4. **DRAG**: Optional (hard for older users)

### Visual Design

#### Color Psychology
```typescript
const focusColors = {
  background: ['#0A1612', '#0F2A1F'],  // Slightly energizing gradient
  primary: '#059669',                   // Darker emerald - serious
  accent: '#047857',                    // Deep emerald - concentration
  text: '#FFFFFF',                      // Maximum clarity
  textSecondary: '#C8E6DB',             // Clear secondary
  highlight: '#10B981',                 // Task completion
};
```

**Why These Colors**:
- **Darker emeralds** = Concentration, depth
- **High contrast** = Cognitive clarity
- **No warm tones** = Maintain alertness

#### Typography - Clarity-Focused
```typescript
const focusTypography = {
  taskInput: {
    size: 18,
    weight: '400',
    lineHeight: 1.6,
    placeholder: 'Type or speak your thoughts...',
  },
  taskList: {
    size: 16,
    weight: '500',
    strikethrough: 'on completion',
  },
  priority: {
    size: 20,
    weight: '600',
    color: '#FFFFFF',
  },
};
```

### Accessibility

#### Text Input Optimization
```typescript
const focusInputAccessibility = {
  textarea: {
    minHeight: 200,         // Ample space
    maxHeight: 400,         // Prevent endless scrolling
    fontSize: 18,
    autocorrect: true,
    spellcheck: true,
  },
  voiceInput: {
    prominence: 'high',     // Large mic button
    continuousRecording: true,
    punctuation: 'automatic',
  },
  wordCount: {
    show: false,            // No pressure
  },
};
```

---

## Cross-Cutting Design Patterns

### Universal Touch Target Grid
```
Priority Level → Minimum Size → Use Case
═══════════════════════════════════════════
Critical      → 60x60pt     → Emergency exit, main CTA
Primary       → 56x56pt     → Standard buttons
Secondary     → 44x44pt     → Back, close, options
Tertiary      → 40x40pt     → Small icons (avoid)
```

### Universal Color Contrast Matrix
```
Text Type     → Foreground → Background → Contrast Ratio
═══════════════════════════════════════════════════════
Heading       → #FFFFFF    → #0A1612    → 21:1 (AAA)
Body          → #E8F4F0    → #0A1612    → 19.5:1 (AAA)
Secondary     → #C8E6DB    → #0A1612    → 9:1 (AAA)
Tertiary      → #B7D4C7    → #0A1612    → 6:1 (AA+)
Disabled      → #95B8A8    → #0A1612    → 4.5:1 (AA)
```

### Universal Font Sizing
```typescript
const universalTypography = {
  // Base scale optimized for 55-70
  hero: 32,        // Onboarding, major headings
  h1: 28,          // Screen titles
  h2: 24,          // Section headings
  h3: 20,          // Subsections
  body: 18,        // Primary reading text
  bodySmall: 16,   // Secondary information
  label: 14,       // Input labels, tags
  caption: 12,     // Metadata (use sparingly)

  // Never go below 12pt for any visible text
  minimum: 12,

  // Scale with iOS Dynamic Type
  scaleWithSystem: true,
  maxScale: 1.3,   // Don't break layout
};
```

### Universal Animation Timing
```typescript
const universalTiming = {
  instant: 0,           // State changes
  fast: 200,            // Micro-interactions
  normal: 400,          // Standard transitions
  slow: 600,            // Calming transitions
  breathing: 4000,      // Natural rhythm

  // Respect user preferences
  reduceMotion: {
    fast: 0,
    normal: 0,
    slow: 200,         // Minimal fade
  },
};
```

### Universal Haptic Patterns
```typescript
const universalHaptics = {
  tap: 'light',         // Button press
  selection: 'light',   // Selecting option
  success: 'success',   // Completion
  error: 'error',       // Validation failure
  warning: 'warning',   // Cautionary action

  // Time-aware intensity
  intensity: (hour) => {
    if (hour >= 22 || hour <= 6) return 0.3;  // Night
    if (hour >= 20 || hour <= 8) return 0.6;  // Evening/morning
    return 1.0;  // Day
  },
};
```

---

## Wireframe Concepts

### 1. Stop Spiraling - Protocol Screen
```
┌────────────────────────────────┐
│  ×                             │ ← Back (44x44pt)
│                                │
│     ┌──────────────┐           │
│     │              │           │
│     │   [RING]     │           │ ← Countdown Ring
│     │    45        │           │   260x260pt
│     │  seconds     │           │   60pt number
│     │              │           │
│     └──────────────┘           │
│                                │
│  ┌──────────────────────────┐  │
│  │                          │  │
│  │  Notice where you are    │  │ ← Current Step
│  │  right now.              │  │   20pt font
│  │  Not in that argument.   │  │   Max 85% width
│  │  Here.                   │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────┐  ┌────────────┐  │
│  │ ⏸ Pause  │  │  ⏭ Skip   │  │ ← Controls
│  └──────────┘  └────────────┘  │   56pt height
│                                │
└────────────────────────────────┘
```

### 2. Calm Anxiety - Technique Selection
```
┌────────────────────────────────┐
│  ← Back                        │
│                                │
│  How anxious do you feel?      │ ← 18pt body
│                                │
│  ▓▓▓▓▓▓░░░░  6/10              │ ← Slider
│                                │
│  ┌──────────────────────────┐  │
│  │   🌬️                     │  │
│  │   Box Breathing          │  │ ← Technique Card
│  │   2 minutes              │  │   56pt height
│  │                          │  │   Tap to select
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │   🧘                     │  │
│  │   Body Scan              │  │
│  │   5 minutes              │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │   🌿                     │  │
│  │   Grounding              │  │
│  │   3 minutes              │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
└────────────────────────────────┘
```

### 3. Process Emotions - Emotion Wheel
```
┌────────────────────────────────┐
│  ← Back                        │
│                                │
│  What are you feeling?         │
│                                │
│    ┌────────────────────┐      │
│    │                    │      │
│    │    [WHEEL]         │      │ ← Interactive
│    │                    │      │   Emotion Wheel
│    │  Happy  Sad Angry  │      │   Tap category
│    │                    │      │   Then nuance
│    │  Anxious Surprised │      │
│    │                    │      │
│    └────────────────────┘      │
│                                │
│  Selected: Anxious → Worried   │ ← Breadcrumb
│                                │
│  How intense?                  │
│  ▓▓▓▓▓░░░░░  5/10              │ ← Intensity
│                                │
│  ┌────────────────────────┐    │
│  │      Continue          │    │ ← CTA 56pt
│  └────────────────────────┘    │
│                                │
└────────────────────────────────┘
```

### 4. Better Sleep - Night Protocol
```
┌────────────────────────────────┐
│  ×                             │ ← Amber on black
│                                │
│                                │
│                                │
│        You're awake.           │ ← Minimal text
│        That's okay.            │   Amber #8B7355
│                                │   18pt
│                                │
│                                │
│      ( ○ )                     │ ← Breathing
│                                │   Gentle pulse
│                                │   No countdown
│                                │
│                                │
│                                │
│  ┌────────────────────────┐    │
│  │    [Pause]             │    │ ← 60pt touch
│  └────────────────────────┘    │   Amber outline
│                                │
└────────────────────────────────┘

Background: Pure #000000 (OLED black)
```

### 5. Gain Focus - Brain Dump
```
┌────────────────────────────────┐
│  ← Back                        │
│                                │
│  Write everything on your mind │ ← Prompt 16pt
│                                │
│  ┌──────────────────────────┐  │
│  │  🎤                      │  │ ← Voice input
│  │                          │  │   Prominent
│  │  ___________________     │  │
│  │                          │  │
│  │  Meeting tomorrow        │  │ ← Text area
│  │  Call mom                │  │   18pt font
│  │  Grocery shopping        │  │   200pt height
│  │  Email Sarah             │  │   Auto-expanding
│  │                          │  │
│  │  ___________________     │  │
│  │                          │  │
│  └──────────────────────────┘  │
│                                │
│  ┌────────────────────────┐    │
│  │    Done Dumping        │    │ ← CTA 56pt
│  └────────────────────────┘    │
│                                │
└────────────────────────────────┘
```

---

## Implementation Checklist

### Before Development
- [ ] Accessibility audit with actual 55-70 users
- [ ] Motion sensitivity testing (vestibular issues)
- [ ] Presbyopia testing (reading glasses simulation)
- [ ] Tremor testing (motor control issues)
- [ ] Cognitive load testing during simulated distress

### During Development
- [ ] Use iOS accessibility inspector for contrast
- [ ] Test with Dynamic Type at max size
- [ ] Test with Reduce Motion enabled
- [ ] Test with VoiceOver screen reader
- [ ] Test with AssistiveTouch (motor impairment)
- [ ] Test at 20% brightness (night use)
- [ ] Test in airplane mode (offline)
- [ ] Test with partner nearby (silence requirement)

### After Development
- [ ] User testing with 5+ people aged 55-70
- [ ] A/B test progress indicators (show vs hide)
- [ ] Track exit rates per exercise
- [ ] Monitor completion rates by time of day
- [ ] Analyze which techniques are used when
- [ ] Survey user preferences monthly
- [ ] Iterate based on real usage patterns

---

## Research Citations

**Age-Related Design**:
- Touch target size: [Apple Human Interface Guidelines, 2024]
- Presbyopia font sizing: [Nielsen Norman Group, "Senior Citizens on the Web"]
- Cognitive load during stress: [Yerkes-Dodson Law]

**Mental Health UX**:
- Calm color psychology: [Environmental Psychology, Green = Safety]
- Countdown vs count-up: [Progress Bars Research, Buie & Gittler]
- Guilt-free exits: [Motivational Interviewing, Miller & Rollnick]

**Accessibility**:
- WCAG AAA contrast: [W3C Guidelines 2.1]
- Reduced motion: [WebKit Prefers-Reduced-Motion]
- VoiceOver optimization: [Apple Accessibility Guidelines]

---

## Version History
- v1.0 (2025-01-04): Initial framework based on existing DailyHush patterns
- Built from analysis of: spiral.tsx, focus.tsx, ModuleComplete.tsx
- Color system: colors.ts (dark emerald therapeutic palette)
- Spacing system: spacing.ts (56pt buttons, 44pt minimum touch)

**Next Steps**:
1. User testing with target demographic
2. Iteration based on real usage data
3. A/B testing of key decisions (timers, progress indicators)
4. Accessibility certification (WCAG AAA)
