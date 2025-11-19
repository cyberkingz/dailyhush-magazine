# Onboarding Flow Audit: Existing Users

## Executive Summary

**CRITICAL GAP IDENTIFIED:** Users who already have a DailyHush account cannot bypass onboarding to login.

**Impact:** App reinstalls, new devices, or any user trying to access an existing account will be forced through the entire onboarding flow with no clear path to login.

**Priority:** HIGH - This is a blocker for account retention and user experience.

---

## Current Flow Analysis

### ✅ **Flow 1: Brand New User (Works)**

```
Welcome Screen
  ↓
Quiz Recognition: "No, I'm new here"
  ↓
Take Native Quiz (16 questions)
  ↓
Password Setup (create account)
  ↓
Home Screen
```

### ✅ **Flow 2: User Who Took Web Quiz (Works)**

```
Welcome Screen
  ↓
Quiz Recognition: "Yes, I took the quiz"
  ↓
Email Lookup (find quiz in database)
  ↓
Password Setup (create account with quiz data)
  ↓
Home Screen
```

### ❌ **Flow 3: Existing User Trying to Login (BROKEN)**

```
Welcome Screen
  ↓
??? NO PATH TO LOGIN ???
  ↓
User is forced through entire onboarding
  ↓
Creates duplicate account OR gets confused and abandons app
```

---

## User Scenarios Not Handled

### Scenario 1: App Reinstall

**User Story:** Sarah used DailyHush for 2 months, tracked 50+ spirals, then got a new iPhone. She downloads the app again.

**Expected:** "Welcome back! Sign in to restore your data."

**Actual:** Forced through full onboarding. No visible way to login. Her 50 spirals and progress are inaccessible.

---

### Scenario 2: Device Upgrade

**User Story:** Maria upgrades from iPhone 13 to iPhone 15. Transfers most apps, but DailyHush requires fresh install.

**Expected:** Quick login to restore account.

**Actual:** Full onboarding flow. May create second account thinking first one is gone.

---

### Scenario 3: Deleted App, Wants to Return

**User Story:** Jessica deleted DailyHush 3 weeks ago during phone cleanup. Wants to use it again after a stressful day.

**Expected:** Login screen to restore account.

**Actual:** Full onboarding with no mention of existing accounts. Likely creates duplicate.

---

### Scenario 4: Accidental Logout

**User Story:** User accidentally taps logout in settings. Wants to sign back in immediately.

**Expected:** Return to login screen.

**Actual:** Redirected to home screen which checks for onboarding_completed, then loops back to onboarding. Currently there's NO CLEAR LOGIN PATH visible.

---

## File-by-File Analysis

### 📄 `/app/onboarding/index.tsx`

**Current Flow:** Welcome → Quiz Recognition
**Missing:** "I already have an account" button or link

**Recommendation:**
Add a tertiary link below the "Try It Now" button:

```tsx
<Pressable onPress={() => router.push('/auth/login')}>
  <Text style={authTypography.linkText}>Already have an account? Sign in</Text>
</Pressable>
```

---

### 📄 `/app/onboarding/quiz-recognition.tsx`

**Current Flow:** 3 options

- "Yes, I took the quiz" → Email Lookup
- "No, I'm new here" → Native Quiz
- "I'm not sure" → Native Quiz

**Missing:** "I already have a DailyHush account" option

**Recommendation:**
Add a 4th option or replace "I'm not sure" with:

```tsx
<Pressable onPress={() => router.push('/auth/login')}>
  <Text>I already have an account</Text>
</Pressable>
```

---

### 📄 `/app/onboarding/email-lookup.tsx`

**Current Flow:** Email lookup → Password Setup (create new account)

**Missing:** Detection of existing accounts

**Issue:** If user enters email that already exists in `user_profiles`, should route to LOGIN, not password setup!

**Recommendation:**
Check BOTH `quiz_submissions` AND `user_profiles`:

```typescript
// Check if account already exists
const { data: existingUser } = await supabase
  .from('user_profiles')
  .select('user_id, email')
  .eq('email', email.trim().toLowerCase())
  .single();

if (existingUser) {
  // Account exists! Route to login
  router.push({
    pathname: '/auth/login',
    params: { prefillEmail: email },
  });
  return;
}

// Otherwise, look up quiz submission
// ... existing quiz lookup code
```

---

### 📄 `/app/index.tsx` (Home Screen)

**Current Check:**

```typescript
useEffect(() => {
  if (isMounted && !isLoading && (!user || !user.onboarding_completed)) {
    router.replace('/onboarding');
  }
}, [user, isMounted, isLoading]);
```

**Issue:** No differentiation between:

1. Never completed onboarding (new user)
2. Completed onboarding but logged out (existing user)

**Recommendation:**
Check auth state first:

```typescript
useEffect(() => {
  const checkAuthAndOnboarding = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // No session - could be new or returning user
      // Show onboarding with login option
      router.replace('/onboarding');
    } else if (!user?.onboarding_completed) {
      // Has session but incomplete onboarding
      router.replace('/onboarding');
    }
    // Otherwise stay on home
  };

  if (isMounted && !isLoading) {
    checkAuthAndOnboarding();
  }
}, [user, isMounted, isLoading]);
```

---

### 📄 `/app/auth/login.tsx`

**Status:** ✅ WORKS CORRECTLY

**Issue:** Not accessible from onboarding flow!

**Recommendation:** Make this reachable from multiple entry points:

- Welcome screen
- Quiz recognition screen
- Email lookup (if account exists)

---

## Recommended Solutions

### 🎯 **Option A: Add "Sign In" Link to Welcome Screen (RECOMMENDED)**

**Pros:**

- Minimal code changes
- Clear path for existing users
- Doesn't disrupt new user flow

**Implementation:**

```tsx
// In app/onboarding/index.tsx renderWelcome()
// After the "Try It Now" button:

<View style={{ marginTop: 20, alignItems: 'center' }}>
  <Pressable onPress={() => router.push('/auth/login' as any)} style={{ paddingVertical: 12 }}>
    {({ pressed }) => (
      <Text
        style={{
          fontSize: 16,
          color: colors.emerald[400],
          opacity: pressed ? 0.6 : 1,
        }}>
        Already have an account? <Text style={{ fontWeight: '600' }}>Sign in</Text>
      </Text>
    )}
  </Pressable>
</View>
```

---

### 🎯 **Option B: Add Existing Account Detection in Email Lookup**

**Pros:**

- Prevents duplicate accounts
- Routes existing users correctly
- Seamless UX

**Implementation:**

```typescript
// In app/onboarding/email-lookup.tsx handleLookup()
// Before quiz_submissions lookup:

// First, check if this email already has a DailyHush account
const { data: existingAccount } = await supabase
  .from('user_profiles')
  .select('user_id, email, onboarding_completed')
  .eq('email', email.trim().toLowerCase())
  .single();

if (existingAccount && existingAccount.onboarding_completed) {
  // Account exists and onboarding is complete
  setErrorMessage('This email already has an account. Redirecting to sign in...');
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  setTimeout(() => {
    router.replace({
      pathname: '/auth/login',
      params: { prefillEmail: email.trim().toLowerCase() },
    });
  }, 1500);
  return;
}

// Continue with quiz lookup if no account exists...
```

---

### 🎯 **Option C: Smart Routing on App Launch**

**Pros:**

- Automatic detection
- Best UX for returning users
- Reduces friction

**Implementation:**

```typescript
// In app/_layout.tsx initAuth()
// After restoreSession():

if (result.success && result.userId) {
  // Session exists, load profile
  const profileResult = await loadUserProfile(result.userId);

  if (profileResult.success && profileResult.profile) {
    setUser(profileResult.profile);

    if (profileResult.profile.onboarding_completed) {
      // Existing user with completed onboarding
      // Do nothing - let them access home screen
    } else {
      // Session exists but onboarding incomplete
      // Route to onboarding to finish
      router.replace('/onboarding');
    }
  }
} else {
  // No session - could be new or logged out user
  // Route to onboarding (which now has sign-in link)
  router.replace('/onboarding');
}
```

---

## Implementation Priority

### 🔥 **Phase 1: CRITICAL (Implement Immediately)**

1. ✅ Add "Sign in" link to Welcome screen (`app/onboarding/index.tsx`)
2. ✅ Add existing account detection to Email Lookup (`app/onboarding/email-lookup.tsx`)

**Impact:** Fixes 90% of the issue. Existing users can now login.

**Effort:** 30 minutes

---

### 📊 **Phase 2: HIGH (Implement Soon)**

3. ✅ Add "I have an account" option to Quiz Recognition (`app/onboarding/quiz-recognition.tsx`)
4. ✅ Pre-fill email in login screen when redirected from email lookup

**Impact:** Improves UX, reduces friction.

**Effort:** 20 minutes

---

### 🎨 **Phase 3: NICE TO HAVE (Future Enhancement)**

5. Smart routing based on auth state in app launch
6. "Remember me" functionality for faster re-login
7. Biometric login (Face ID / Touch ID)

**Impact:** Premium UX for power users.

**Effort:** 2-3 hours

---

## Testing Scenarios

After implementing fixes, test these scenarios:

### ✅ Test 1: New User

1. Fresh install
2. See welcome screen
3. No account - proceed through onboarding
4. Successfully create account

### ✅ Test 2: Existing User - Reinstall

1. User previously created account
2. Reinstalls app
3. Sees welcome screen with "Sign in" link
4. Taps sign in
5. Enters credentials
6. Successfully logs in to existing account

### ✅ Test 3: Web Quiz User - New to App

1. User took web quiz
2. Installs mobile app
3. Taps "Yes, I took the quiz"
4. Enters quiz email
5. System creates NEW account (no existing account)
6. Successfully onboards

### ✅ Test 4: Web Quiz User - Already Has Account

1. User took web quiz
2. Previously created mobile account
3. Taps "Yes, I took the quiz"
4. Enters email
5. System detects existing account
6. Redirects to login (not password setup)
7. Successfully logs in

### ✅ Test 5: Accidental Logout

1. User logs out from settings
2. Redirected appropriately
3. Can immediately login again
4. Returns to home with data intact

---

## Metrics to Track

After implementing:

- **Account Duplication Rate:** Should decrease to near 0%
- **Onboarding Abandonment:** Should decrease (clearer paths)
- **Time to Login:** Should decrease for returning users
- **Support Tickets:** "Can't find my account" should decrease

---

## Summary

**Current State:** 🔴 BROKEN for existing users

**After Phase 1:** 🟢 FUNCTIONAL with clear login path

**After Phase 2:** 🟢 EXCELLENT UX with smart routing

**Recommendation:** Implement Phase 1 immediately (30 min), Phase 2 within 24 hours.

**Files to Modify:**

1. `app/onboarding/index.tsx` - Add sign-in link
2. `app/onboarding/email-lookup.tsx` - Add existing account detection
3. `app/onboarding/quiz-recognition.tsx` - Add "I have an account" option
4. `app/auth/login.tsx` - Add pre-fill email parameter support
