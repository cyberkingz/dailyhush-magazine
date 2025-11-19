# DailyHush Mobile App - Supabase Schema Audit Report

**Date:** 2025-01-25
**Auditor:** Claude Code with Supabase MCP
**Scope:** Complete onboarding flow + database schema verification

---

## Executive Summary

✅ **Database schema is CORRECT** - All quiz connection fields exist in Supabase
❌ **TypeScript types are INCOMPLETE** - Missing 5 critical quiz fields
⚠️ **35 total issues identified** across onboarding flow

### Severity Breakdown

- 🔴 **8 CRITICAL** - Will cause failures or data loss
- 🟠 **15 HIGH** - Affects UX significantly
- 🟡 **12 MEDIUM** - Should be improved

---

## CRITICAL FINDING: TypeScript Type Mismatch

### Issue

The `UserProfile` interface in `types/index.ts` is missing 5 quiz connection fields that **DO exist** in the actual Supabase `user_profiles` table.

### Database Schema (Verified via Supabase MCP)

```sql
-- user_profiles table (public schema)
CREATE TABLE user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text,
  name text,
  age integer,
  quiz_score integer CHECK (quiz_score >= 1 AND quiz_score <= 10),
  has_shift_necklace boolean DEFAULT false,
  shift_paired boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  fire_progress jsonb DEFAULT '{"focus": false, "execute": false, "reframe": false, "interrupt": false}',
  triggers text[] DEFAULT ARRAY[]::text[],
  peak_spiral_time text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- QUIZ CONNECTION FIELDS (EXIST IN DB, MISSING FROM TYPES)
  quiz_email text,
  quiz_connected boolean DEFAULT false,
  quiz_submission_id uuid REFERENCES quiz_submissions(id),
  quiz_overthinker_type text,
  quiz_connected_at timestamptz
);
```

### TypeScript Type (Current - INCOMPLETE)

```typescript
// types/index.ts:10-29
export interface UserProfile {
  user_id: string;
  email: string | null;
  name?: string | null;
  age?: number | null;
  quiz_score?: number;
  has_shift_necklace: boolean;
  shift_paired: boolean;
  onboarding_completed: boolean;
  fire_progress: {
    focus: boolean;
    interrupt: boolean;
    reframe: boolean;
    execute: boolean;
  };
  triggers: string[];
  peak_spiral_time?: string;
  created_at: string;
  updated_at: string;
  // ❌ MISSING 5 FIELDS THAT EXIST IN DATABASE
}
```

### Impact

**File:** `app/onboarding/password-setup.tsx:98-119`

The password setup screen attempts to insert quiz connection data:

```typescript
const { data: profile, error: profileError } = await supabase
  .from('user_profiles')
  .insert([
    {
      user_id: user.id,
      email: email,
      quiz_email: email, // ← TypeScript doesn't know this field exists
      quiz_connected: true, // ← TypeScript doesn't know this field exists
      quiz_submission_id: quizSubmissionId, // ← TypeScript doesn't know this field exists
      quiz_overthinker_type: overthinkerType, // ← TypeScript doesn't know this field exists
      quiz_connected_at: new Date().toISOString(), // ← TypeScript doesn't know this field exists
      onboarding_completed: true,
      // ... other fields
    },
  ])
  .select()
  .single();
```

### Consequences

1. **Type safety bypassed** - Supabase client won't validate these fields
2. **No autocomplete** - Developers won't know these fields exist
3. **Potential typos** - Field names could be misspelled without detection
4. **Schema drift risk** - Types don't reflect actual database

### Fix Required

Update `types/index.ts` UserProfile interface:

```typescript
export interface UserProfile {
  user_id: string;
  email: string | null;
  name?: string | null;
  age?: number | null;
  quiz_score?: number;
  has_shift_necklace: boolean;
  shift_paired: boolean;
  onboarding_completed: boolean;
  fire_progress: {
    focus: boolean;
    interrupt: boolean;
    reframe: boolean;
    execute: boolean;
  };
  triggers: string[];
  peak_spiral_time?: string;
  created_at: string;
  updated_at: string;

  // ✅ ADD THESE QUIZ CONNECTION FIELDS
  quiz_email?: string | null;
  quiz_connected?: boolean;
  quiz_submission_id?: string | null;
  quiz_overthinker_type?: string | null;
  quiz_connected_at?: string | null;
}
```

---

## Database Schema Verification

### ✅ `quiz_submissions` Table - VERIFIED CORRECT

**Actual Schema:**

```sql
CREATE TABLE quiz_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar NOT NULL,
  overthinker_type varchar NOT NULL,
  score integer NOT NULL,
  result_title text NOT NULL,
  result_description text,
  result_insight text,
  result_cta_hook text,
  source_url text,
  source_page varchar DEFAULT 'quiz', -- ✅ Supports 'mobile-app'
  referrer_url text,
  utm_source varchar,
  utm_medium varchar,
  utm_campaign varchar,
  utm_term varchar,
  utm_content varchar,
  user_agent text,
  browser varchar,
  device_type varchar, -- ✅ Can store 'mobile'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Compatibility with Mobile App:** ✅ PERFECT

Mobile quiz submissions use:

- `source_page: 'mobile-app'` (distinguishes from web `'quiz'`)
- `source_url: 'dailyhush://app/quiz'` (custom URI scheme)
- `device_type: 'mobile'`

All fields exist and support the values we're inserting.

### ✅ `user_profiles` Table - Schema Correct, Types Wrong

See CRITICAL FINDING above.

---

## All 8 CRITICAL Issues

### CRITICAL-1: TypeScript Type Mismatch ⭐ DETAILED ABOVE

**Location:** `types/index.ts:10-29`
**Issue:** Missing 5 quiz connection fields that exist in database
**Fix:** Add quiz_email, quiz_connected, quiz_submission_id, quiz_overthinker_type, quiz_connected_at

---

### CRITICAL-2: Orphaned Demo Screen

**Location:** `app/onboarding/demo.tsx`
**Issue:** File exists but is NEVER reached in any flow
**Evidence:**

- Created when "No" button routed to `/onboarding/demo`
- Later changed to route to `/onboarding/quiz`
- File now orphaned, dead code

**Fix:** Delete `app/onboarding/demo.tsx` or integrate it properly

---

### CRITICAL-3: Missing Source Tracking in Anonymous Flow

**Location:** `utils/quizScoring.ts:80-120`
**Issue:** If user creates account without quiz, no source tracking
**Current:** Only quiz flow sets `source_page: 'mobile-app'`
**Missing:** Anonymous onboarding should set `source_page: 'mobile-anonymous'`

**Fix:** Track all signup sources consistently

---

### CRITICAL-4: No Quiz Progress Persistence

**Location:** `app/onboarding/quiz/index.tsx:28`
**Issue:** Quiz answers stored in React state only

```typescript
const [answers, setAnswers] = useState<Map<string, QuizAnswer>>(new Map());
```

**Problem:** If app closes/crashes during quiz, all progress lost

**Fix:** Save to AsyncStorage after each answer:

```typescript
const handleSelectAnswer = async (optionId: string, value: number) => {
  const newAnswers = new Map(answers);
  newAnswers.set(currentQuestion.id, { questionId: currentQuestion.id, optionId, value });
  setAnswers(newAnswers);

  // ✅ Persist to AsyncStorage
  await AsyncStorage.setItem('quiz_progress', JSON.stringify(Array.from(newAnswers.entries())));
};
```

---

### CRITICAL-5: Email Lookup Duplicate Handling

**Location:** `app/onboarding/email-lookup.tsx:55-61`
**Issue:** Query uses `.single()` which throws error if user took quiz multiple times

```typescript
const { data, error } = await supabase
  .from('quiz_submissions')
  .select('*')
  .eq('email', email.trim().toLowerCase())
  .order('created_at', { ascending: false })
  .limit(1)
  .single(); // ❌ Throws error if 0 or 2+ results
```

**Problem:** `.single()` expects EXACTLY one row, fails on duplicates

**Fix:** Remove `.single()`, use array access:

```typescript
const { data, error } = await supabase
  .from('quiz_submissions')
  .select('*')
  .eq('email', email.trim().toLowerCase())
  .order('created_at', { ascending: false })
  .limit(1); // Returns array

if (error) {
  /* handle */
}
if (!data || data.length === 0) {
  /* not found */
}

const submission = data[0]; // Get most recent
```

---

### CRITICAL-6: Password Setup Session Verification

**Location:** `app/onboarding/password-setup.tsx:68-95`
**Issue:** No verification that user email matches session email

**Scenario:**

1. User A starts onboarding with email A
2. User A switches to different device
3. User B logs in on same device
4. User A's session creates account for User B

**Fix:** Verify email param matches expected context

---

### CRITICAL-7: No Back Button on Quiz Results

**Location:** `app/onboarding/quiz/results.tsx:126`
**Issue:** `headerBackVisible: false` prevents going back

```typescript
<Stack.Screen
  options={{
    headerBackVisible: false, // ❌ User trapped if they mistype email
  }}
/>
```

**Problem:** If user enters wrong email, they can't go back to change it

**Fix:** Allow back navigation, re-submit quiz if needed

---

### CRITICAL-8: No Retry Logic for Quiz Submission

**Location:** `app/onboarding/quiz/results.tsx:80-92`
**Issue:** If Supabase insert fails, no retry option

```typescript
const { success, submissionId, error } = await submitQuizToSupabase(...);

if (!success || !submissionId) {
  setErrorMessage(error || 'Failed to save quiz results. Please try again.');
  setIsSubmitting(false);
  return; // ❌ User must manually retry by tapping button again
}
```

**Problem:** Network error = lost quiz results, user frustrated

**Fix:** Add retry button or auto-retry with exponential backoff

---

## HIGH Priority Issues (15 total)

### HIGH-1: No Progress Indicators on All Screens

**Affected:** All onboarding screens
**Issue:** Users don't know how many steps remain
**Fix:** Add "Step X of Y" indicator at top

### HIGH-2: Quiz Length Not Disclosed

**Location:** `app/onboarding/quiz-recognition.tsx`
**Issue:** Users don't know quiz is 16 questions before starting
**Fix:** Add "16 questions, ~3 minutes" to quiz recognition screen

### HIGH-3: Touch Targets Below WCAG AAA

**Location:** Multiple components
**Issue:** Some buttons are 48px instead of 56px minimum for 55-70 demographic
**Examples:**

- `app/onboarding/quiz/index.tsx:211` - 56px ✅
- `components/quiz/QuizQuestion.tsx:64` - 64px ✅
- But some custom pressables are 48px

**Fix:** Audit all `<Pressable>` for `minHeight: 56` (WCAG AAA)

### HIGH-4: Missing Loading States on Navigation

**Issue:** Router.push() has no loading indicator
**Fix:** Add loading state during navigation transitions

### HIGH-5: Weak Password Validation

**Location:** `app/onboarding/password-setup.tsx:56`
**Issue:** Only checks 8+ characters and match
**Missing:**

- No check for common passwords
- No check for email in password
- No strength meter

**Fix:** Add `zxcvbn` library for password strength

### HIGH-6: No Email Validation on Quiz Results

**Location:** `app/onboarding/quiz/results.tsx:42-44`
**Issue:** Basic regex only, doesn't catch typos like `user@gmial.com`

**Fix:** Add email verification step or use `email-validator` library

### HIGH-7: No Duplicate Account Prevention

**Location:** `app/onboarding/password-setup.tsx:68-95`
**Issue:** Doesn't check if email already exists before creating account

**Fix:** Query `auth.users` first:

```typescript
const { data: existingUser } = await supabase.auth.admin.listUsers();
if (existingUser.find((u) => u.email === email)) {
  setErrorMessage('Account already exists. Please sign in instead.');
  return;
}
```

### HIGH-8: Quiz Score Type Mismatch

**Location:** `types/index.ts:15` + `quiz_submissions` schema
**TypeScript:** `quiz_score?: number; // 1-10 from Overthinking Quiz`
**Database:** `score integer` (stores raw score 16-80, not 1-10)
**Database:** `quiz_score integer CHECK (quiz_score >= 1 AND quiz_score <= 10)` in user_profiles

**Confusion:** Two different scores with unclear relationship

**Fix:** Document the difference:

- `user_profiles.quiz_score` = normalized 1-10 score (for display)
- `quiz_submissions.score` = raw 16-80 score (for analytics)

### HIGH-9-15: See full UX audit for remaining HIGH issues

---

## Medium Priority Issues (12 total)

### MEDIUM-1: No Accessibility Labels

**Issue:** Missing `accessibilityLabel` on many interactive elements
**WCAG:** AA requirement for screen readers

### MEDIUM-2: No Haptic Feedback on Errors

**Issue:** Only visual error messages, no haptic warning
**Fix:** Add `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)`

### MEDIUM-3: No Analytics Tracking

**Issue:** No event tracking for onboarding funnel
**Fix:** Add PostHog/Mixpanel events:

- `onboarding_started`
- `quiz_recognition_selected`
- `email_lookup_success`
- `quiz_started`
- `quiz_completed`
- `account_created`

### MEDIUM-4-12: See full UX audit for remaining MEDIUM issues

---

## Source Tracking Analysis

### Mobile Quiz Submission Example

```json
{
  "email": "user@example.com",
  "overthinker_type": "gentle-analyzer",
  "score": 36,
  "result_title": "The Gentle Analyzer",
  "result_description": "...",
  "result_insight": "...",
  "result_cta_hook": "...",
  "source_page": "mobile-app", ← Identifies mobile origin
  "source_url": "dailyhush://app/quiz",
  "device_type": "mobile",
  "created_at": "2025-01-25T..."
}
```

### Web Quiz Submission Example (for comparison)

```json
{
  "email": "user@example.com",
  "overthinker_type": "chronic-overthinker",
  "score": 52,
  "source_page": "quiz", ← Default value, identifies web origin
  "source_url": "https://noema.app/quiz",
  "device_type": "desktop",
  "created_at": "2025-01-20T..."
}
```

### Analytics Queries

```sql
-- Mobile quiz takers only
SELECT * FROM quiz_submissions
WHERE source_page = 'mobile-app';

-- Web quiz takers only
SELECT * FROM quiz_submissions
WHERE source_page = 'quiz';

-- Mobile vs Web conversion comparison
SELECT
  source_page,
  COUNT(*) as submissions,
  COUNT(DISTINCT email) as unique_users
FROM quiz_submissions
GROUP BY source_page;
```

✅ **Source tracking is correctly implemented and ready for analytics**

---

## Recommendations

### Immediate (Fix Before Launch)

1. ✅ Fix TypeScript type mismatch (add 5 quiz fields)
2. ✅ Delete orphaned demo.tsx
3. ✅ Fix email lookup duplicate handling
4. ✅ Add quiz progress persistence
5. ✅ Add back button on quiz results

### High Priority (Fix This Week)

1. Add progress indicators to all onboarding screens
2. Add retry logic for quiz submission
3. Implement password strength validation
4. Add duplicate account prevention
5. Audit all touch targets for WCAG AAA compliance

### Medium Priority (Fix Before 1.0)

1. Add analytics event tracking
2. Add accessibility labels
3. Implement email verification
4. Add haptic feedback on errors
5. Document quiz score types clearly

---

## Database Statistics (from Supabase)

- **quiz_submissions:** 229 rows (web + mobile)
- **user_profiles:** 39 rows
- **RLS enabled on user_profiles:** ✅ Yes
- **RLS enabled on quiz_submissions:** ❌ No (intentional for public quiz)

---

## Conclusion

The onboarding flow is **functional but needs critical fixes** before production:

✅ **What's Working:**

- Database schema is correct
- Quiz questions match web version
- Source tracking properly distinguishes mobile vs web
- All user paths are documented

❌ **What's Broken:**

- TypeScript types missing 5 critical fields
- No quiz progress persistence (data loss risk)
- Email lookup fails on duplicate submissions
- Orphaned demo screen (dead code)

⚠️ **What Needs Improvement:**

- No progress indicators
- Weak password validation
- No retry logic on failures
- Missing accessibility features

**Recommendation:** Fix all 8 CRITICAL issues before beta launch.
