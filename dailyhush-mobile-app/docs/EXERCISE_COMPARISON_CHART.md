# Mental Health Exercise Comparison Chart

## Quick Reference: All 5 Exercises at a Glance

| Aspect             | Stop Spiraling  | Calm Anxiety     | Process Emotions | Better Sleep  | Gain Focus         |
| ------------------ | --------------- | ---------------- | ---------------- | ------------- | ------------------ |
| **Urgency**        | CRITICAL        | Medium           | Low              | Time-specific | Low                |
| **User State**     | Active distress | Building anxiety | Reflective       | Bedtime/night | Needs clarity      |
| **Duration**       | 90 seconds      | 2-5 minutes      | 5-10 minutes     | 3-15 minutes  | 10-20 minutes      |
| **Cognitive Load** | MINIMAL         | Low-Medium       | Medium           | Minimal-Low   | HIGH               |
| **Auto-Advance**   | Yes             | Partial          | No               | Yes (night)   | No                 |
| **Text Input**     | Optional (post) | No               | Optional         | No            | Required           |
| **Voice Input**    | No              | No               | Recommended      | No            | HIGHLY recommended |
| **Interruptions**  | Allow anytime   | Allow anytime    | Encouraged       | Natural exit  | Save progress      |
| **Progress Shown** | Yes (ring)      | Optional         | No               | Minimal       | Yes (steps)        |
| **Time Display**   | Countdown       | Optional         | Hidden           | Hidden        | Optional           |

## Color Psychology by Exercise

```
STOP SPIRALING (Urgent Calm)
═══════════════════════════════════════
Primary:    #40916C  ██████  Soft emerald
Glow:       #52B788  ██████  Gentle glow
Background: #0A1612  ██████  Deep forest
Text:       #E8F4F0  ██████  High contrast
Mood:       Safe, grounded, immediate relief

CALM ANXIETY (Gentle Energy)
═══════════════════════════════════════
Primary:    #10B981  ██████  Bright emerald
Accent:     #34D399  ██████  Light emerald
Background: #0F1F1A  ██████  Lighter forest
Text:       #E8F4F0  ██████  High contrast
Mood:       Hopeful, energizing calm

PROCESS EMOTIONS (Adaptive)
═══════════════════════════════════════
Dynamic based on selected emotion:
Happy:      #10B981  ██████  Emerald
Sad:        #6B7280  ██████  Gray
Angry:      #DC2626  ██████  Muted red
Anxious:    #F59E0B  ██████  Amber
Mood:       Validating, understanding

BETTER SLEEP (Night-Optimized)
═══════════════════════════════════════
Background: #000000  ██████  Pure black
Text:       #8B7355  ██████  Warm amber
Accent:     #D4A574  ██████  Soft gold
No Blue Light (melatonin-safe)
Mood:       Soothing, restful

GAIN FOCUS (Mental Clarity)
═══════════════════════════════════════
Primary:    #059669  ██████  Dark emerald
Accent:     #047857  ██████  Deep emerald
Text:       #FFFFFF  ██████  Maximum contrast
Background: #0A1612  ██████  Deep focus
Mood:       Clear, concentrated, productive
```

## Interaction Pattern Comparison

### Entry Flow Complexity

```
STOP SPIRALING
┌─────┐
│Start│──→ (Optional Pre-Check) ──→ Protocol (auto) ──→ Done
└─────┘

CALM ANXIETY
┌─────┐
│Start│──→ Intensity ──→ Choose Technique ──→ Practice ──→ Check-In ──→ Done
└─────┘

PROCESS EMOTIONS
┌─────┐
│Start│──→ Emotion Wheel ──→ Intensity ──→ Context ──→ (Optional Journal) ──→ Done
└─────┘

BETTER SLEEP (Evening)
┌─────┐
│Start│──→ Gratitude/Body Scan/Planning ──→ Wind Down ──→ Sleep Cue ──→ Done
└─────┘

BETTER SLEEP (Night)
┌─────┐
│Start│──→ Minimal Protocol (3-5 min) ──→ Return to Sleep
└─────┘

GAIN FOCUS
┌─────┐
│Start│──→ Clutter Check ──→ Brain Dump ──→ Prioritize ──→ Action ──→ (Timer) ──→ Done
└─────┘
```

## Typography Requirements

| Exercise         | Minimum Size | Recommended  | Max Lines/Screen | Reasoning                             |
| ---------------- | ------------ | ------------ | ---------------- | ------------------------------------- |
| Stop Spiraling   | 20pt         | 20-24pt      | 3-5 lines        | Distressed state, arms-length reading |
| Calm Anxiety     | 18pt         | 18-20pt      | 5-8 lines        | Moderate attention capacity           |
| Process Emotions | 18pt         | 18pt         | 8-10 lines       | Reflective reading, longer form       |
| Better Sleep     | 18pt         | 20pt (night) | 2-4 lines        | Drowsy state, minimal text            |
| Gain Focus       | 18pt         | 18pt         | 10-15 lines      | Clear thinking, detail-oriented       |

## Accessibility Priority Matrix

```
                    Critical  High    Medium   Low
                    (Must)    (Should)(Could)  (Nice)
═══════════════════════════════════════════════════
Stop Spiraling      ████████  ██████  ████     ██
  - Large targets   ✓
  - High contrast   ✓
  - Voice output    ✓
  - Voice input                       ✓
  - Haptics         ✓

Calm Anxiety        ████████  ██████  ████     ██
  - Large targets   ✓
  - High contrast   ✓
  - Voice output              ✓
  - Voice input                       ✓
  - Haptics                   ✓

Process Emotions    ████████  ██████  ████     ██
  - Large targets   ✓
  - High contrast   ✓
  - Voice output              ✓
  - Voice input               ✓
  - Haptics                   ✓

Better Sleep        ████████  ██████  ████     ██
  - Low brightness  ✓
  - Minimal haptics ✓
  - No audio        ✓
  - Large targets   ✓
  - High contrast   ✓

Gain Focus          ████████  ██████  ████     ██
  - Large targets   ✓
  - High contrast   ✓
  - Voice input               ✓✓✓✓
  - Voice output                      ✓
  - Haptics                   ✓
```

## Animation Complexity Scale

```
None  Minimal  Moderate  Complex
 0      1        2         3
═══════════════════════════════════════

Stop Spiraling:    ██  (Breathing circle only)
Calm Anxiety:      ███ (Breathing + transitions)
Process Emotions:  █   (Color shifts)
Better Sleep:      ▓   (Opacity fades only)
Gain Focus:        █   (List reordering)

All respect Reduce Motion: ✓
All use useNativeDriver:   ✓
All maintain 60fps:        ✓
```

## Component Reusability

```
Component              Spiral  Calm  Emotions  Sleep  Focus
════════════════════════════════════════════════════════════
AccessibleButton         ✓      ✓       ✓       ✓      ✓
EmotionScale                    ✓       ✓
BreathingCircle          ✓      ✓               ✓
ProgressTracker          ✓      ✓       ✓       ✓      ✓
ExitConfirmation         ✓      ✓       ✓       ✓      ✓
AccessibleTextInput                     ✓              ✓
VoiceInputButton                        ✓              ✓
NightMode Hook                                  ✓
AutoSave Hook            ✓      ✓       ✓       ✓      ✓
Haptics Util             ✓      ✓       ✓       ✓      ✓
```

## Use Case Scenarios

### When User Should Use Each Exercise

| Time of Day      | Emotional State   | Cognitive Capacity | Best Exercise        |
| ---------------- | ----------------- | ------------------ | -------------------- |
| Anytime          | Spiraling NOW     | 30%                | **Stop Spiraling**   |
| Morning          | Anxious about day | 70%                | Calm Anxiety         |
| Afternoon        | Confused feelings | 80%                | Process Emotions     |
| Evening (8-10pm) | Can't wind down   | 60%                | Better Sleep (prep)  |
| Night (2am)      | Ruminating in bed | 40%                | Better Sleep (night) |
| Workday          | Mental clutter    | 90%                | Gain Focus           |
| Pre-task         | Procrastinating   | 85%                | Gain Focus           |

### User Journey Examples

```
SCENARIO 1: Acute Anxiety Attack
User State: Spiraling, high distress
Path: Home → "I'm Spiraling" → Stop Spiraling → 90s protocol → Post-check
Why: Immediate intervention, minimal decision-making

SCENARIO 2: Pre-Meeting Anxiety
User State: Nervous but functional
Path: Home → "Calm Anxiety" → Choose "Box Breathing" → 2min practice
Why: Preventive, user has capacity to choose technique

SCENARIO 3: Post-Conflict Processing
User State: Upset but reflective
Path: Home → "Process Emotions" → Angry → Context (relationship) → Journal
Why: Understanding emotions, pattern detection

SCENARIO 4: Insomnia at 2am
User State: Tired but ruminating
Path: Auto-detect time → Better Sleep (night mode) → Minimal protocol
Why: Time-aware, partner-safe, return to sleep

SCENARIO 5: Overwhelmed by Tasks
User State: Scattered, can't start work
Path: Home → "Gain Focus" → Brain dump → Top 3 → Focus timer
Why: Clarity needed, can think clearly enough to write
```

## Performance Optimization Priority

| Exercise         | Bundle Priority | Lazy Load | Preload Audio  | Cache Images |
| ---------------- | --------------- | --------- | -------------- | ------------ |
| Stop Spiraling   | HIGH            | No        | Yes (critical) | Yes          |
| Calm Anxiety     | MEDIUM          | Yes       | Yes            | Yes          |
| Process Emotions | LOW             | Yes       | No             | Yes          |
| Better Sleep     | MEDIUM          | Yes       | Yes            | Yes          |
| Gain Focus       | LOW             | Yes       | No             | Minimal      |

**Reasoning**: Stop Spiraling is emergency intervention, must load instantly.

## Battery & Data Considerations

```
Exercise          CPU Usage  Battery Impact  Data Usage  Offline
═══════════════════════════════════════════════════════════════
Stop Spiraling    Medium     Medium          None        ✓
  (animations)

Calm Anxiety      Medium     Medium          None        ✓
  (audio)

Process Emotions  Low        Low             None        ✓
  (static UI)

Better Sleep      Low        Low             None        ✓
  (minimal UI)

Gain Focus        Low        Low             None        ✓
  (text input)

All exercises work offline: ✓
All cache audio locally:    ✓
No CDN dependencies:        ✓
```

## Success Metrics by Exercise

| Exercise         | Primary Metric    | Target     | Secondary Metric     | Target  |
| ---------------- | ----------------- | ---------- | -------------------- | ------- |
| Stop Spiraling   | Feeling reduction | >3 points  | Completion rate      | >60%    |
| Calm Anxiety     | Anxiety reduction | >2 points  | Return usage         | >40%    |
| Process Emotions | Pattern detection | 3+ entries | Journal adoption     | >30%    |
| Better Sleep     | Time to sleep     | <15 min    | Night wake reduction | >50%    |
| Gain Focus       | Task completion   | >70%       | Focus duration       | >20 min |

## Implementation Effort Estimate

```
Exercise          Complexity  Est. Hours  Dependencies
═══════════════════════════════════════════════════════
Stop Spiraling    Low         4-8         Audit existing
  (already built)

Calm Anxiety      Medium      16-24       Audio system
                                          Technique variants

Process Emotions  High        32-40       Emotion wheel
                                          Voice input
                                          Journal system

Better Sleep      Medium      24-32       Time detection
                                          Night mode
                                          Audio system

Gain Focus        High        32-40       Voice input
                                          Prioritization UI
                                          Timer integration

Total estimate:   104-144 hours (13-18 days for 1 developer)
With team:        ~3-4 weeks with testing/iteration
```

## Testing Priority

```
Must Test (All Exercises)
══════════════════════════
✓ Touch targets ≥44pt
✓ Contrast ≥7:1 (WCAG AAA)
✓ Font size ≥18pt
✓ VoiceOver navigation
✓ Dynamic Type max
✓ Reduce Motion
✓ 20% brightness

Exercise-Specific Tests
══════════════════════════
Stop Spiraling:
  ✓ Interruption handling
  ✓ Auto-advance timing
  ✓ Haptic rhythm

Calm Anxiety:
  ✓ Audio sync
  ✓ Technique switching

Process Emotions:
  ✓ Voice dictation
  ✓ Emotion wheel navigation

Better Sleep:
  ✓ Time detection (9pm/2am)
  ✓ Blue light filtering
  ✓ Partner silence test

Gain Focus:
  ✓ Voice input accuracy
  ✓ Long text handling
```

---

## Decision Tree: Which Exercise to Recommend

```
User Says...                               →  Recommend
══════════════════════════════════════════════════════════
"I can't stop thinking about X"           →  Stop Spiraling
"I'm having a panic attack"               →  Stop Spiraling
"I feel anxious"                          →  Calm Anxiety
"I'm stressed but okay"                   →  Calm Anxiety
"I don't know what I'm feeling"           →  Process Emotions
"Why do I feel this way?"                 →  Process Emotions
"I can't sleep" (before bed)              →  Better Sleep (prep)
"I can't sleep" (middle of night)         →  Better Sleep (night)
"I can't focus"                           →  Gain Focus
"I'm overwhelmed with tasks"              →  Gain Focus
"I'm procrastinating"                     →  Gain Focus
```

## Quick Reference: When to Use Each Pattern

### Pattern Selection Guide

```
Need...                                    Use Pattern...
═══════════════════════════════════════════════════════════
Large, accessible button                   Pattern 1
Slider with haptic feedback                Pattern 2
Breathing animation                        Pattern 3
Night/day color switching                  Pattern 4
Auto-save functionality                    Pattern 5
Text input with voice option               Pattern 6
Progress dots or bar                       Pattern 7
Exit confirmation modal                    Pattern 8
Voice dictation button                     Pattern 9
Time-aware haptics                         Pattern 10
```

---

**Last Updated**: 2025-01-04
**Maintained By**: UX Team
**Status**: ✅ Production Ready
