# DailyHush Mobile App - Complete To-Do List for Beta Launch

**Generated:** 2025-01-25
**Based on:** Third Comprehensive Audit Report
**Total Tasks:** 23
**Estimated Total Time:** ~6.5 hours

---

## 🔴 BLOCKER TASKS (Must Complete FIRST)

**Total Time:** 30 seconds
**Status:** Blocks ALL other work - TypeScript won't compile

### Task 1: Fix TypeScript Syntax Error

- **File:** `app/onboarding/quiz/results.tsx`
- **Line:** 157
- **Problem:** Extra `}` after `fadeVisibility="always"}`
- **Fix:**

  ```tsx
  // BEFORE (line 157):
  fadeVisibility="always"}

  // AFTER (line 157):
  fadeVisibility="always"
  ```

- **Time:** 30 seconds
- **Priority:** 🔴 BLOCKER
- **Testing:** Run `npx tsc --noEmit` (should return 0 errors)

---

## 🔴 CRITICAL TASKS (Must Complete Before Beta Launch)

**Total Time:** 2 hours 15 minutes
**Status:** Required for feature parity and security

### Task 2: Add Quiz Answers Saving to Mobile App

- **File:** `utils/quizScoring.ts`
- **Function:** `submitQuizToSupabase`
- **Problem:** Mobile app only saves `quiz_submissions`, not individual answers to `quiz_answers` table (web version does both)
- **Impact:** Lost analytics, can't analyze which questions users struggle with
- **Fix:**

  ```typescript
  // After successful submission insert, add:

  // Prepare answers data
  const answersData = answers.map((answer) => ({
    submission_id: submission.id,
    question_id: answer.questionId,
    question_section: 'mobile-quiz', // Or get from quizQuestions
    question_type: 'scale',
    option_id: answer.optionId,
    option_value: answer.value,
    scale_value: answer.value,
  }));

  // Insert all answers
  const { error: answersError } = await supabase.from('quiz_answers').insert(answersData);

  if (answersError) {
    console.error('Error saving quiz answers:', answersError);
    console.warn('Quiz submission successful but answers failed to save');
  }
  ```

- **Time:** 15 minutes
- **Priority:** 🔴 CRITICAL
- **Testing:** Complete quiz → Check Supabase for 16 records in `quiz_answers` with correct `submission_id`

### Task 3-10: Enable Row Level Security (RLS) on All Tables

**Context:** Supabase security audit found RLS policies exist but are not enabled on tables. This is a CRITICAL security vulnerability.

#### Task 3: Enable RLS on quiz_submissions

- **SQL:**
  ```sql
  ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
  ```
- **Time:** 5 minutes
- **Priority:** 🔴 CRITICAL

#### Task 4: Enable RLS on quiz_answers

- **SQL:**
  ```sql
  ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
  ```
- **Time:** 5 minutes
- **Priority:** 🔴 CRITICAL

#### Task 5: Enable RLS on quiz_sessions

- **SQL:**
  ```sql
  ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
  ```
- **Time:** 5 minutes
- **Priority:** 🔴 CRITICAL

#### Task 6: Enable RLS on quiz_events

- **SQL:**
  ```sql
  ALTER TABLE quiz_events ENABLE ROW LEVEL SECURITY;
  ```
- **Time:** 5 minutes
- **Priority:** 🔴 CRITICAL

#### Task 7: Enable RLS on thank_you_page_sessions

- **SQL:**
  ```sql
  ALTER TABLE thank_you_page_sessions ENABLE ROW LEVEL SECURITY;
  ```
- **Time:** 5 minutes
- **Priority:** 🔴 CRITICAL

#### Task 8: Enable RLS on page_views

- **SQL:**
  ```sql
  ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
  ```
- **Time:** 5 minutes
- **Priority:** 🔴 CRITICAL

#### Task 9: Enable RLS on lead_activities

- **SQL:**
  ```sql
  ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
  ```
- **Time:** 5 minutes
- **Priority:** 🔴 CRITICAL

#### Task 10: Enable RLS on revenue_events

- **SQL:**
  ```sql
  ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;
  ```
- **Time:** 5 minutes
- **Priority:** 🔴 CRITICAL

**RLS Enable All (Batch Command):**

```sql
-- Run this in Supabase SQL Editor to enable RLS on all tables at once:
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE thank_you_page_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_events ENABLE ROW LEVEL SECURITY;
```

**Total RLS Time:** 40 minutes (includes testing)
**Testing:**

```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
  'quiz_submissions',
  'quiz_answers',
  'quiz_sessions',
  'quiz_events',
  'thank_you_page_sessions',
  'page_views',
  'lead_activities',
  'revenue_events'
);
-- All should show rowsecurity = true
```

---

## 🟡 HIGH PRIORITY TASKS (Should Complete Before Beta Launch)

**Total Time:** 1 hour 15 minutes
**Status:** Improves UX and security significantly

### Task 11: Delete Orphaned Backup File

- **File:** `app/index-old-backup.tsx`
- **Problem:** Orphaned file cluttering codebase
- **Fix:**
  ```bash
  rm app/index-old-backup.tsx
  git add -A
  git commit -m "Remove orphaned backup file"
  ```
- **Time:** 30 seconds
- **Priority:** 🟡 HIGH
- **Testing:** Verify file deleted, app still runs

### Task 12: Add Retry Logic to Quiz Submission

- **File:** `app/onboarding/quiz/results.tsx`
- **Function:** `handleContinue`
- **Problem:** Network failures cause permanent submission failure - user must manually retry
- **Impact:** Poor UX on mobile networks, lost conversions
- **Fix:**

  ```typescript
  // Add state
  const [retryCount, setRetryCount] = useState(0);
  const [showRetryButton, setShowRetryButton] = useState(false);

  // Update submission logic
  const submitWithRetry = async (attempt = 1): Promise<void> => {
    const { success, submissionId, error } = await submitQuizToSupabase(
      email.trim().toLowerCase(),
      answers,
      result,
      supabase
    );

    if (!success) {
      if (attempt < 3) {
        console.log(`Retry attempt ${attempt}/3 after network error`);
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return submitWithRetry(attempt + 1);
      }

      // After 3 attempts, show manual retry button
      setErrorMessage(error || 'Network error. Please check your connection and retry.');
      setShowRetryButton(true);
      setIsSubmitting(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Success!
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push({ ... });
  };

  // Add retry button in UI
  {showRetryButton && (
    <Pressable onPress={() => {
      setShowRetryButton(false);
      setRetryCount(0);
      submitWithRetry(1);
    }}>
      <Text>Retry Submission</Text>
    </Pressable>
  )}
  ```

- **Time:** 30 minutes
- **Priority:** 🟡 HIGH
- **Testing:**
  - Turn off WiFi mid-submission
  - Verify automatic retry (3 attempts)
  - Verify retry button appears after 3 failures

### Task 13: Add Password Strength Validation

- **File:** `app/onboarding/password-setup.tsx`
- **Function:** `validatePassword`
- **Problem:** Only checks 8+ characters, allows weak passwords like "12345678"
- **Impact:** Account security compromised, higher brute force risk
- **Fix:**

  ```typescript
  const validatePassword = (): boolean => {
    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      return false;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setErrorMessage('Password must include uppercase, lowercase, and number');
      return false;
    }

    // Optional: Check for special character
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }

    return true;
  };
  ```

- **Time:** 15 minutes
- **Priority:** 🟡 HIGH
- **Testing:** Try creating account with:
  - "password" → Should fail (no uppercase/number)
  - "PASSWORD" → Should fail (no lowercase/number)
  - "Password" → Should fail (no number)
  - "Password1" → Should succeed ✅

---

## ✅ TESTING TASKS (Must Complete Before Beta Launch)

**Total Time:** 1.5 hours
**Status:** Verify all fixes work correctly

### Task 14: Test TypeScript Compilation

- **Command:**
  ```bash
  npx tsc --noEmit
  ```
- **Expected:** 0 errors
- **Time:** 2 minutes
- **Priority:** ✅ TESTING
- **Depends on:** Task 1 (syntax error fix)

### Task 15: Test Quiz Submission Data Flow

- **Steps:**
  1. Complete quiz in mobile app
  2. Submit with email
  3. Check Supabase dashboard:
     - ✅ 1 record in `quiz_submissions` with `source_page = 'mobile-app'`
     - ✅ 16 records in `quiz_answers` with matching `submission_id`
     - ✅ All answers have correct `question_id`, `option_id`, `option_value`
- **Time:** 10 minutes
- **Priority:** ✅ TESTING
- **Depends on:** Task 2 (quiz answers saving)

### Task 16: Verify RLS Enabled on All Tables

- **SQL:**
  ```sql
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename LIKE '%quiz%' OR tablename LIKE '%lead%' OR tablename LIKE '%revenue%';
  ```
- **Expected:** All tables show `rowsecurity = true`
- **Time:** 5 minutes
- **Priority:** ✅ TESTING
- **Depends on:** Tasks 3-10 (RLS enable)

### Task 17: Test User Journey Path A (Existing Quiz User)

- **Steps:**
  1. Open app → quiz-recognition screen
  2. Tap "Yes, I took the quiz"
  3. Enter email that exists in `quiz_submissions`
  4. Verify routes to password-setup with quiz data
  5. Create password
  6. Verify routes to home
  7. Check Supabase:
     - ✅ Auth user created
     - ✅ User profile created with `quiz_connected = true`
     - ✅ `quiz_submission_id` matches email lookup
- **Time:** 10 minutes
- **Priority:** ✅ TESTING

### Task 18: Test User Journey Path B (New User Taking Quiz)

- **Steps:**
  1. Open app → quiz-recognition screen
  2. Tap "No, I'm new here"
  3. Complete all 16 quiz questions
  4. Enter email on results screen
  5. Verify routes to password-setup with quiz data
  6. Create password
  7. Verify routes to home
  8. Check Supabase:
     - ✅ Quiz submission saved
     - ✅ 16 quiz answers saved
     - ✅ Auth user created
     - ✅ User profile created with quiz connection
- **Time:** 15 minutes
- **Priority:** ✅ TESTING

### Task 19: Test User Journey Path C (Not Sure About Quiz)

- **Steps:**
  1. Open app → quiz-recognition screen
  2. Tap "I'm not sure"
  3. Verify routes to quiz (same as Path B)
  4. Complete flow as Path B
- **Time:** 10 minutes
- **Priority:** ✅ TESTING

### Task 20: Test AsyncStorage Quiz Persistence

- **Steps:**
  1. Start quiz, answer questions 1-5
  2. Close app completely (swipe up from app switcher)
  3. Reopen app
  4. Navigate to quiz
  5. Verify:
     - ✅ Quiz resumes at question 5
     - ✅ Previous answers still selected
  6. Complete quiz
  7. Submit
  8. Start quiz again
  9. Verify:
     - ✅ Quiz starts fresh (progress cleared after submission)
- **Time:** 10 minutes
- **Priority:** ✅ TESTING

---

## 🟡 MEDIUM PRIORITY TASKS (Can Address After Launch)

**Total Time:** 3-4 hours
**Status:** Security hardening for production

### Task 21: Review and Fix SECURITY DEFINER Views

- **Context:** Supabase audit found 14 views with SECURITY DEFINER property
- **Problem:** Views execute with owner privileges, not current user (privilege escalation risk)
- **Steps:**
  1. List all views with SECURITY DEFINER:
     ```sql
     SELECT viewname, viewowner
     FROM pg_views
     WHERE schemaname = 'public';
     ```
  2. Review each view's purpose
  3. Change to SECURITY INVOKER where appropriate:
     ```sql
     ALTER VIEW view_name SET (security_invoker = true);
     ```
- **Time:** 2 hours
- **Priority:** 🟡 MEDIUM

### Task 22: Audit Anonymous User Access Policies

- **Context:** 14 tables have policies allowing anonymous access
- **Steps:**
  1. List all policies with anonymous access:
     ```sql
     SELECT schemaname, tablename, policyname, roles
     FROM pg_policies
     WHERE roles @> ARRAY['anon'];
     ```
  2. Review each policy
  3. Restrict where not needed
- **Time:** 1 hour
- **Priority:** 🟡 MEDIUM

### Task 23: Check and Upgrade Postgres Version

- **Context:** Supabase advisor warned "Your Postgres version has security patches available"
- **Steps:**
  1. Check current version in Supabase dashboard
  2. Review release notes for latest version
  3. Schedule maintenance window
  4. Upgrade via Supabase dashboard
  5. Test app after upgrade
- **Time:** 1 hour
- **Priority:** 🟡 MEDIUM

---

## 📊 Task Summary by Priority

| Priority    | Count  | Time           | Status               |
| ----------- | ------ | -------------- | -------------------- |
| 🔴 BLOCKER  | 1      | 30 seconds     | BLOCKS ALL WORK      |
| 🔴 CRITICAL | 9      | 2h 15min       | REQUIRED FOR BETA    |
| 🟡 HIGH     | 3      | 1h 15min       | SHOULD DO FOR BETA   |
| ✅ TESTING  | 7      | 1h 30min       | VERIFY FIXES WORK    |
| 🟡 MEDIUM   | 3      | 3-4 hours      | PRODUCTION HARDENING |
| **TOTAL**   | **23** | **~6.5 hours** |                      |

---

## 🚀 Recommended Execution Order

### Phase 1: Unblock TypeScript (30 seconds)

1. ✅ Task 1: Fix syntax error in results.tsx
2. ✅ Task 14: Test TypeScript compilation

### Phase 2: Critical Security (2 hours)

3. ✅ Tasks 3-10: Enable RLS on all 8 tables (batch command)
4. ✅ Task 16: Verify RLS enabled

### Phase 3: Feature Parity (15 minutes)

5. ✅ Task 2: Add quiz_answers saving
6. ✅ Task 15: Test quiz submission data flow

### Phase 4: High Priority Improvements (1h 15min)

7. ✅ Task 11: Delete orphaned file
8. ✅ Task 12: Add retry logic
9. ✅ Task 13: Add password strength validation

### Phase 5: User Journey Testing (45 minutes)

10. ✅ Task 17: Test Path A (existing quiz)
11. ✅ Task 18: Test Path B (new user)
12. ✅ Task 19: Test Path C (not sure)
13. ✅ Task 20: Test AsyncStorage persistence

**Total time for beta-ready:** ~4 hours

### Phase 6: Production Hardening (3-4 hours) - POST-LAUNCH

14. ✅ Task 21: Review SECURITY DEFINER views
15. ✅ Task 22: Audit anonymous policies
16. ✅ Task 23: Upgrade Postgres version

---

## ✅ Completion Checklist

### Before Beta Launch:

- [ ] TypeScript compiles with 0 errors
- [ ] Mobile quiz saves to both `quiz_submissions` AND `quiz_answers`
- [ ] RLS enabled on all 8 tables
- [ ] All 3 user journey paths tested
- [ ] AsyncStorage persistence working
- [ ] Retry logic implemented
- [ ] Password strength validation added
- [ ] No orphaned files in codebase

### Before Production Launch:

- [ ] SECURITY DEFINER views reviewed
- [ ] Anonymous access policies audited
- [ ] Postgres version upgraded
- [ ] Full security audit passed
- [ ] Load testing completed
- [ ] Error monitoring configured

---

## 📝 Notes

- **Dependencies:** Tasks 3-10 (RLS) can be run in parallel via batch SQL command
- **Critical path:** Task 1 (syntax error) MUST be fixed before any other work
- **Testing:** Each fix should be tested immediately after implementation
- **Rollback plan:** Keep git history clean with one commit per task for easy rollback

---

**Generated:** 2025-01-25
**Last Updated:** 2025-01-25
**Status:** 🔴 NOT READY FOR BETA (4 hours of work remaining)
