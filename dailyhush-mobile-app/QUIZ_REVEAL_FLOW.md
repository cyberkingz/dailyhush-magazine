# Quiz Reveal Flow Documentation

## Overview

The quiz reveal flow ensures **ALL new users discover their overthinking type** through a carefully designed investment ladder:

**Universal Flow for New Users:**

1. **Quiz** - Discover your overthinking type (10 questions)
2. **Profile Setup** - Share basic info (name, age, rumination frequency)
3. **Signup** - Create account to unlock results (email + password)
4. **Results Reveal** - See your personalized insights
5. **Home** - Start using the app

**Why This Order Works:**

- ✅ Maximizes psychological investment before asking for credentials
- ✅ User has already invested ~5-10 minutes before seeing signup form
- ✅ Profile info is non-threatening (gathered before email/password)
- ✅ Creates strong desire to "unlock" results they've earned
- ✅ Sunk cost fallacy works in our favor for conversion

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Entry Points                         │
│  • Login → "Sign up" link                                   │
│  • Onboarding → "No, I didn't take quiz"                    │
│  • Direct navigation to /onboarding/quiz                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
          ┌───────────────────────────┐
          │   STEP 1: Quiz            │
          │   (/onboarding/quiz)      │
          │                           │
          │   • 10 questions          │
          │   • Calculates type       │
          │   • Saves to AsyncStorage │
          └───────────┬───────────────┘
                      │
                      ▼
          ┌───────────────────────────────────────┐
          │   STEP 2: Profile Setup               │
          │   (/onboarding/profile-setup)         │
          │                                       │
          │   Collects (no auth required):        │
          │   • Name (optional)                   │
          │   • Age (optional)                    │
          │   • Rumination frequency (required)   │
          │                                       │
          │   Passes data to next screen          │
          └───────────┬───────────────────────────┘
                      │
                      ▼
          ┌───────────────────────────────────────┐
          │   STEP 3: Signup                      │
          │   (/onboarding/quiz/signup)           │
          │                                       │
          │   📱 "Your Results Are Ready! 🎉"    │
          │   📧 Email input                      │
          │   🔒 Password input                   │
          │   ✨ "Unlock My Results" button      │
          │                                       │
          │   Creates:                            │
          │   • Supabase auth account             │
          │   • User profile with quiz + profile  │
          └───────────┬───────────────────────────┘
                      │
                      ▼
          ┌───────────────────────────────────────┐
          │   STEP 4: Results Reveal! 🎊         │
          │   (/onboarding/quiz/results)          │
          │                                       │
          │   Shows with animation:               │
          │   • Overthinker type                  │
          │   • Description                       │
          │   • Insight card                      │
          │   • CTA hook                          │
          │                                       │
          │   Saves to database:                  │
          │   • Quiz submission                   │
          │   • Links to user profile             │
          │   • Marks onboarding complete         │
          └───────────┬───────────────────────────┘
                      │
                      ▼
          ┌───────────────────────────┐
          │   STEP 5: Home Screen     │
          │   (/)                     │
          │                           │
          │   🎉 Onboarding Complete! │
          └───────────────────────────┘


┌──────────────────────────────────────────────────────────┐
│  ALTERNATIVE FLOW: Website Quiz Users                    │
│  ("Yes, I took quiz" from onboarding welcome)            │
└──────────────────────────────────────────────────────────┘
                      │
                      ▼
          ┌───────────────────────────┐
          │   Email Lookup            │
          │   (/onboarding/email)     │
          │   Checks for quiz         │
          └───────────┬───────────────┘
                      │
                      ▼
          ┌───────────────────────────┐
          │   Password Setup          │
          │   Links quiz to account   │
          └───────────┬───────────────┘
                      │
                      ▼
          ┌───────────────────────────┐
          │   Home Screen             │
          │   (Quiz already linked)   │
          └───────────────────────────┘
```

## Key Files

### `/constants/quiz.ts`

Centralized configuration following iOS best practices:

```typescript
// Flow stages
export enum QuizFlowStage {
  IN_PROGRESS = 'in_progress',
  AWAITING_SIGNUP = 'awaiting_signup',
  RESULTS_UNLOCKED = 'results_unlocked',
  COMPLETED = 'completed',
}

// Storage keys for AsyncStorage
export const QUIZ_STORAGE_KEYS = {
  PROGRESS: 'quiz_progress',
  PENDING_RESULTS: 'quiz_pending_results',
  FLOW_STAGE: 'quiz_flow_stage',
};

// Reveal configuration
export const QUIZ_REVEAL_CONFIG = {
  REVEAL_DELAY: 800, // Delay before showing results
  ANIMATION_DURATION: 600, // Duration of reveal animation
  TEASER_TITLE: 'Your Results Are Ready! 🎉',
  TEASER_DESCRIPTION:
    'Create your account to discover your unique overthinking type and unlock personalized strategies.',
};
```

### `/app/onboarding/quiz/index.tsx`

Main quiz screen - STEP 1 of the onboarding flow:

**Key Changes:**

- After completing all questions, saves results to AsyncStorage
- **Always routes to profile setup** - no authentication check needed
- Simple linear flow - all users follow same path
- Button text is "Continue" (not "See Results")

```typescript
// Save quiz results temporarily
await AsyncStorage.setItem(
  QUIZ_STORAGE_KEYS.PENDING_RESULTS,
  JSON.stringify({
    result,
    answers: answersArray,
    timestamp: new Date().toISOString(),
  })
);

// Route to profile setup for ALL users
// This creates maximum investment before asking for email/password
router.push({
  pathname: routes.onboarding.profileSetup,
  params: {
    type: result.type,
    score: result.score.toString(),
    rawScore: result.rawScore.toString(),
    title: result.title,
    description: result.description,
    insight: result.insight,
    ctaHook: result.ctaHook,
    answers: JSON.stringify(answersArray),
  },
});
```

### `/app/onboarding/profile-setup.tsx`

Profile setup screen - STEP 2 of the onboarding flow (NEW BEHAVIOR):

**Key Changes:**

- **No longer requires authentication** - works before account creation
- Accepts quiz params from previous screen
- Collects name, age, rumination frequency
- **Does NOT save to database** - passes data forward via URL params
- Routes to signup screen with quiz + profile data

```typescript
const handleContinue = async () => {
  // Route to signup screen with quiz params + profile data
  // Account creation and database save happens in signup screen
  router.push({
    pathname: routes.onboarding.quizSignup,
    params: {
      // Quiz params passed through
      ...params,
      // Profile data collected here
      profileName: name.trim() || '',
      profileAge: age || '',
      profileRuminationFrequency: ruminationFrequency,
    },
  });
};
```

### `/app/onboarding/quiz/signup.tsx`

Signup screen - STEP 3 of the onboarding flow (ENHANCED):

**Purpose:** Create account after maximum psychological investment

**Features:**

- Teaser messaging: "Your Results Are Ready! 🎉"
- Email and password inputs
- Account existence checking
- Supabase auth account creation
- User profile creation **with quiz + profile data**
- Routes to results with `reveal: 'true'` flag

**Key Changes:**

- Now accepts profile data from params (profileName, profileAge, profileRuminationFrequency)
- Saves ALL collected data in single database operation
- User profile includes quiz data reference + profile data

**Flow:**

1. Collect email and password (quiz + profile data already in params)
2. Validate inputs
3. Check if account exists
4. Create Supabase auth account
5. Create user profile **with quiz + profile data together**
6. Update local store with full profile
7. Navigate to results with reveal animation

```typescript
const handleCreateAccount = async () => {
  // Create auth account
  const { data: authData } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password: password,
  });

  // Create profile with profile data + quiz reference
  await supabase.from('user_profiles').insert({
    user_id: authData.user.id,
    email: email.trim().toLowerCase(),
    // Profile data from profile setup screen
    name: params.profileName || null,
    age: params.profileAge ? parseInt(params.profileAge) : null,
    rumination_frequency: params.profileRuminationFrequency || null,
    // Quiz will be linked after results reveal
    onboarding_completed: false,
  });

  // Update local store with profile data
  setUser({
    user_id: authData.user.id,
    email: email.trim().toLowerCase(),
    name: params.profileName || null,
    age: params.profileAge ? parseInt(params.profileAge) : null,
    rumination_frequency: params.profileRuminationFrequency || null,
    // ... rest of user fields
  });

  // Navigate to results reveal
  setTimeout(() => {
    router.replace({
      pathname: routes.onboarding.quizResults,
      params: { ...params, reveal: 'true' },
    });
  }, QUIZ_REVEAL_CONFIG.REVEAL_DELAY);
};
```

### `/app/onboarding/quiz/results.tsx`

Results screen - STEP 4 of the onboarding flow (UPDATED):

**Key Changes:**

- Removed email input (user already authenticated)
- Added reveal animation detection
- **Routes to home, not profile setup** (profile already collected)
- **Marks onboarding as complete** after linking quiz
- Updated UI messaging: "You're all set! Let's start your journey"
- Button text: "Get Started" (not "Continue to Profile Setup")

**Reveal Detection:**

```typescript
const isReveal = params.reveal === 'true';

useEffect(() => {
  if (isReveal) {
    setIsRevealing(true);
    setTimeout(() => {
      setIsRevealing(false);
    }, QUIZ_REVEAL_CONFIG.ANIMATION_DURATION);
  }
}, [isReveal]);
```

**Results Submission:**

```typescript
const handleContinue = async () => {
  // Get authenticated user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Submit quiz to database
  const { success, submissionId } = await submitQuizToSupabase(
    session.user.email || '',
    answers,
    result,
    supabase
  );

  // Update user profile with quiz data and mark onboarding complete
  await supabase
    .from('user_profiles')
    .update({
      quiz_email: session.user.email,
      quiz_connected: true,
      quiz_submission_id: submissionId,
      quiz_overthinker_type: params.type,
      quiz_connected_at: new Date().toISOString(),
      onboarding_completed: true, // Profile already collected, quiz now linked
    })
    .eq('user_id', session.user.id);

  // Route to home - onboarding complete!
  router.replace('/');
};
```

## Psychological Pattern

### Why This Works

**For Users Who Take Quiz First (Not Authenticated):**

**The "Zeigarnik Effect"**

- People remember uncompleted tasks better than completed ones
- Completing the quiz but not seeing results creates tension
- This tension motivates users to complete the signup

**Investment Escalation**

- User has already invested time in taking the quiz
- They want to see the "payoff" (results)
- Creating an account feels like a small step to complete their investment

**Curiosity Gap**

- Teaser messaging: "Your Results Are Ready!"
- Creates strong desire to see what they got
- Signup becomes the "unlock" mechanism

**For Users Who Create Account First (Authenticated):**

**Immediate Value Delivery**

- User has shown commitment by creating account
- Seeing results immediately rewards this commitment
- Personalizes the experience from the start
- Creates positive first impression of the app's insights

**Universal Benefit:**

- ALL users get their overthinker type
- Consistent experience across all entry points
- Quiz becomes core value proposition, not optional
- Everyone starts with personalized insights

## Data Flow

### AsyncStorage

```typescript
// Quiz in progress
'quiz_progress' → {
  answers: Map<questionId, answer>,
  lastQuestionIndex: number,
  timestamp: string
}

// Quiz completed, awaiting signup
'quiz_pending_results' → {
  result: QuizResult,
  answers: QuizAnswer[],
  timestamp: string
}
```

### Supabase Database

**During Signup:**

```sql
-- Create auth user
INSERT INTO auth.users (email, encrypted_password)
VALUES ('user@example.com', 'hashed_password');

-- Create profile (quiz data added later)
INSERT INTO user_profiles (user_id, email, onboarding_completed)
VALUES ('uuid', 'user@example.com', false);
```

**After Results Reveal:**

```sql
-- Submit quiz results
INSERT INTO quiz_submissions (user_email, answers, result)
VALUES ('user@example.com', '...', '...');

-- Update profile with quiz data
UPDATE user_profiles
SET quiz_email = 'user@example.com',
    quiz_connected = true,
    quiz_submission_id = 'uuid',
    quiz_overthinker_type = 'type',
    quiz_connected_at = NOW()
WHERE user_id = 'uuid';
```

## iOS Best Practices

### ✅ Implemented

- **Centralized Constants**: All configuration in `/constants/quiz.ts`
- **No Hardcoding**: Timing, messaging, and routes all configurable
- **Haptic Feedback**: Tactile responses for all user actions
- **Loading States**: Clear visual feedback during async operations
- **Error Handling**: Graceful error messages and recovery
- **Keyboard Avoidance**: Proper iOS keyboard handling
- **Safe Area Support**: Respects notch and home indicator
- **Clean Separation**: Each screen has single responsibility

### 🎨 UI/UX Patterns

- **Progressive Disclosure**: Information revealed step-by-step
- **Visual Hierarchy**: Clear importance indicators
- **Consistent Spacing**: Using spacing constants throughout
- **Icon Communication**: Sparkles for success, locks for security
- **Status Indication**: Activity indicators for loading states
- **Input Validation**: Real-time feedback on form fields

## Testing Checklist

### Path A: Direct Signup First

- [ ] Create account via `/auth/signup`
- [ ] Verify routing to `/onboarding/quiz`
- [ ] Complete quiz while authenticated
- [ ] Confirm auth detection and direct results routing
- [ ] Verify reveal animation shows
- [ ] Test results submission to database
- [ ] Confirm routing to profile-setup
- [ ] Complete profile and reach home

### Path B: Quiz First (No Account)

- [ ] Start quiz without account
- [ ] Complete all 10 questions
- [ ] Verify results saved to AsyncStorage
- [ ] Confirm routing to signup screen (not results)
- [ ] Test email validation on signup screen
- [ ] Test password validation
- [ ] Test account creation
- [ ] Verify profile creation in database
- [ ] Confirm results reveal animation
- [ ] Test results submission to database
- [ ] Verify profile update with quiz data
- [ ] Confirm routing to profile-setup
- [ ] Complete profile and reach home

### Path C: Website Quiz

- [ ] Enter email that has existing quiz
- [ ] Complete password setup
- [ ] Verify routing to profile-setup (skips quiz)
- [ ] Complete profile and reach home

### Cross-Path Testing

- [ ] Test network error during quiz
- [ ] Test account already exists error
- [ ] Verify AsyncStorage cleanup on success
- [ ] Test quiz progress restoration after app restart
- [ ] Verify haptic feedback on all actions
- [ ] Test keyboard avoidance on all forms

## Error Scenarios

### Network Error During Signup

- Show error message
- Allow retry
- Don't lose quiz data

### Account Already Exists

- Show clear error: "This email already has an account"
- Suggest signing in instead
- Quiz data preserved for retry

### Database Error During Profile Creation

- Show error with contact support message
- Log error for debugging
- Auth account created but profile failed

## Implementation Summary

The quiz reveal flow has been implemented as a **linear investment ladder** that maximizes conversion:

### The Universal 5-Step Flow

**STEP 1: Quiz** (`/onboarding/quiz`)

- User answers 10 questions
- No account required - zero friction
- Results calculated and saved to AsyncStorage
- Routes to profile setup with quiz params

**STEP 2: Profile Setup** (`/onboarding/profile-setup`)

- Collects name (optional), age (optional), rumination frequency (required)
- Still no authentication required - building investment
- Data passed via URL params to next screen (not stored in database yet)
- Routes to signup with both quiz + profile params

**STEP 3: Signup** (`/onboarding/quiz/signup`)

- NOW we ask for email and password (after 5-10 min investment)
- Teaser: "Your Results Are Ready! 🎉"
- Creates Supabase auth account
- Creates user profile with ALL collected data (quiz + profile)
- Routes to results with reveal flag

**STEP 4: Results Reveal** (`/onboarding/quiz/results`)

- Shows quiz results with animation
- Submits quiz to database
- Links quiz to user profile
- Marks onboarding as complete
- Routes to home

**STEP 5: Home**

- User starts using the app
- Full onboarding complete

### Alternative Flow: Website Quiz Users

For users who took quiz on website ("Yes, I took quiz"):

1. Email lookup → finds existing quiz
2. Password setup → links quiz to new account
3. Home → quiz already in database

### Key Benefits

✅ **Maximum Investment Before Credentials** - User invests 5-10 min before seeing signup form
✅ **Progressive Commitment** - Quiz → Profile → Credentials → Results
✅ **Psychological Motivation** - Sunk cost fallacy + curiosity gap = high conversion
✅ **Single Universal Path** - All new users go through same optimized flow
✅ **Data Collection Timing** - Non-threatening info first, credentials last
✅ **Results as Reward** - Unlocking results feels like earning value

### Technical Implementation

- **No Early Authentication**: Quiz and profile setup work without auth
- **Data Passing**: Quiz params → Profile Setup → Signup via URL params
- **Bulk Save**: All data (quiz + profile) saved together during signup
- **AsyncStorage**: Quiz results cached temporarily until account creation
- **Onboarding Complete**: Marked true only after results reveal
- **Linear Flow**: No conditional routing - all users follow same path

## Future Enhancements

### Potential Improvements

- Add reveal animation with fade/slide effects
- Implement progress saving across app restarts
- Add email verification flow
- Support social auth (Google, Apple)
- Add quiz retake functionality
- Implement result sharing

## Maintenance Notes

### When Modifying This Flow

1. **Always update** `/constants/quiz.ts` for new configuration
2. **Never hardcode** timing, messaging, or routes
3. **Test all paths** including error scenarios
4. **Maintain async storage** cleanup on success
5. **Preserve user data** on errors for retry
6. **Update this documentation** with changes

### Common Gotchas

- Don't forget to clear AsyncStorage after successful signup
- Always pass `reveal: 'true'` when routing to results
- Ensure user is authenticated before submitting quiz
- Profile must exist before updating with quiz data
- Check for existing accounts before creating new ones

---

**Last Updated:** 2025-10-26
**Version:** 1.0
**Author:** DailyHush Team
