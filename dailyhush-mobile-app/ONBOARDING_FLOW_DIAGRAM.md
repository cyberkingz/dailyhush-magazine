# DailyHush Mobile App - Onboarding Flow Diagram

## Complete User Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APP LAUNCH (First Time)                           │
│                                                                             │
│                           /onboarding (index)                               │
│                         Welcome Screen - Step 1                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ↓
                         [User taps "Try It Now"]
                                   │
┌──────────────────────────────────┴──────────────────────────────────────────┐
│                                                                             │
│                      /onboarding/quiz-recognition                           │
│                     "Did you take our quiz?"                                │
│                                                                             │
└───────┬─────────────────────────┬────────────────────────┬──────────────────┘
        │                         │                        │
        ↓                         ↓                        ↓
   "Yes, I took             "No, I'm new           "I'm not sure"
    the quiz"                   here"
        │                         │                        │
        │                         └────────────┬───────────┘
        │                                      │
        │                                      ↓
        │                         ┌────────────────────────┐
        │                         │  /onboarding/quiz      │
        │                         │  NATIVE QUIZ (16 Q's)  │
        │                         │  ├─ Progress bar       │
        │                         │  ├─ Back/Next buttons  │
        │                         │  └─ Score calculation  │
        │                         └────────────┬───────────┘
        │                                      │
        │                                      ↓
        │                         ┌────────────────────────────────────┐
        │                         │  /onboarding/quiz/results          │
        │                         │  ├─ Show overthinker type          │
        │                         │  ├─ Display insights               │
        │                         │  ├─ Email input                    │
        │                         │  └─ Submit to Supabase             │
        │                         │     (source_page: 'mobile-app')    │
        │                         └────────────┬───────────────────────┘
        │                                      │
        │                                      ↓
        │                              [Quiz submitted ✓]
        │                                      │
        ↓                                      │
┌───────────────────────────┐                 │
│ /onboarding/email-lookup  │                 │
│ "Find Your Quiz Results"  │                 │
│                           │                 │
│ User enters email →       │                 │
│ Search quiz_submissions   │                 │
└────────┬──────────────────┘                 │
         │                                    │
         ↓                                    │
    [Database Query]                          │
         │                                    │
    ┌────┴────┐                               │
    │         │                               │
FOUND ✓   NOT FOUND ✗                         │
    │         │                               │
    │         ↓                                │
    │    ┌────────────────────────┐           │
    │    │ Error Message:         │           │
    │    │ "Email not found"      │           │
    │    │                        │           │
    │    │ Options:               │           │
    │    │ • Retry with new email │           │
    │    │ • "Take quiz instead" ─┼───────────┘
    │    └────────────────────────┘ (routes to /onboarding/quiz)
    │
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                  /onboarding/password-setup                     │
│                  "Create Account"                               │
│                                                                 │
│  Receives from either:                                          │
│  A) Email lookup (web quiz user)                               │
│     • email                                                     │
│     • quizSubmissionId                                          │
│     • overthinkerType                                           │
│     • score                                                     │
│                                                                 │
│  B) Native quiz results (mobile quiz user)                     │
│     • email                                                     │
│     • quizSubmissionId (just created)                          │
│     • overthinkerType                                           │
│     • score                                                     │
│                                                                 │
│  User enters password (2 fields) →                             │
│  ├─ Validate (8+ chars, match)                                 │
│  ├─ Create Supabase auth account                               │
│  ├─ Create user_profile with quiz fields:                      │
│  │   • quiz_connected: true                                    │
│  │   • quiz_submission_id                                      │
│  │   • quiz_overthinker_type                                   │
│  │   • quiz_connected_at                                       │
│  │   • onboarding_completed: true (skip rest)                  │
│  └─ Update local store                                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ↓
                    [Account Created ✓]
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                         / (Home Screen)                         │
│                                                                 │
│  User lands on main app:                                        │
│  • Quiz results already connected                              │
│  • Onboarding marked complete                                  │
│  • Ready to use F.I.R.E. Protocol                              │
│  • Skips remaining onboarding steps                            │
└─────────────────────────────────────────────────────────────────┘
```

## Flow Summary

### Path A: New User (No Website Quiz)

**Steps: 5**

```
Welcome
  → Quiz Recognition → "No/Not sure"
  → Native Quiz (16 questions)
  → Quiz Results (email + submit)
  → Password Setup
  → Home ✓
```

**Time:** ~3-5 minutes (quiz takes 2-3 min)

---

### Path B: Existing Quiz User (Email Found)

**Steps: 4**

```
Welcome
  → Quiz Recognition → "Yes"
  → Email Lookup → Found ✓
  → Password Setup
  → Home ✓
```

**Time:** ~1-2 minutes

---

### Path C: Existing Quiz User (Email NOT Found → Takes Native Quiz)

**Steps: 6**

```
Welcome
  → Quiz Recognition → "Yes"
  → Email Lookup → Not Found ✗
  → "Take quiz instead"
  → Native Quiz (16 questions)
  → Quiz Results (email + submit)
  → Password Setup
  → Home ✓
```

**Time:** ~4-6 minutes

---

## Key Decision Points

### 1. Quiz Recognition Screen

- **"Yes, I took the quiz"** → Email lookup flow
- **"No, I'm new here"** → Native quiz flow
- **"I'm not sure"** → Native quiz flow (same as "No")

### 2. Email Lookup Screen (Only if user selected "Yes")

- **Email found** → Password setup (quick path)
- **Email not found** → Option to "Take quiz instead"

### 3. Password Setup Screen (Final Step Before Home)

- **Both paths converge here**
- All users create account with quiz data
- All users skip remaining onboarding

---

## Data Flow

### Native Quiz Submission (Mobile App)

```javascript
{
  email: "user@example.com",
  overthinker_type: "gentle-analyzer",
  score: 36,  // raw score 16-80
  result_title: "The Gentle Analyzer",
  result_description: "...",
  result_insight: "...",
  result_cta_hook: "...",
  source_page: "mobile-app",  // ← Key identifier
  source_url: "dailyhush://app/quiz",
  device_type: "mobile",
  created_at: "2025-01-25T..."
}
```

### Website Quiz Submission (For Comparison)

```javascript
{
  email: "user@example.com",
  overthinker_type: "chronic-overthinker",
  score: 52,
  result_title: "The Chronic Overthinker",
  // ... same fields ...
  source_page: "quiz",  // ← Different from mobile
  source_url: "https://noema.app/quiz",
  device_type: "desktop",
  created_at: "2025-01-20T..."
}
```

### Filtering in Analytics

```sql
-- Mobile quiz takers only
SELECT * FROM quiz_submissions
WHERE source_page = 'mobile-app';

-- Web quiz takers only
SELECT * FROM quiz_submissions
WHERE source_page = 'quiz';

-- All quiz submissions
SELECT * FROM quiz_submissions;
```

---

## Screen-by-Screen Breakdown

### 1. `/onboarding` (index.tsx)

**Purpose:** Welcome screen
**Actions:** User taps "Try It Now"
**Next:** `/onboarding/quiz-recognition`

---

### 2. `/onboarding/quiz-recognition`

**Purpose:** Ask if user took website quiz
**Options:**

- "Yes" → `/onboarding/email-lookup`
- "No" → `/onboarding/quiz`
- "I'm not sure" → `/onboarding/quiz`

---

### 3A. `/onboarding/email-lookup` (Web Quiz Path)

**Purpose:** Find existing quiz by email
**Input:** Email address
**Database:** Query `quiz_submissions` table
**Outcomes:**

- Found → `/onboarding/password-setup` (with quiz data)
- Not Found → Show error + "Take quiz instead" link → `/onboarding/quiz`

---

### 3B. `/onboarding/quiz` (Native Quiz Path)

**Purpose:** In-app 16-question quiz
**Features:**

- 16 questions across 5 sections
- Progress bar (Question X of 16, Y%)
- Back/Next navigation
- Answer validation (can't proceed without answer)
- Score calculation on completion

**Next:** `/onboarding/quiz/results`

---

### 4. `/onboarding/quiz/results`

**Purpose:** Show quiz results + collect email
**Display:**

- Overthinker type (title)
- Description
- Insight
- CTA hook

**Input:** Email address
**Action:** Submit to Supabase `quiz_submissions` table
**Next:** `/onboarding/password-setup` (with quiz data)

---

### 5. `/onboarding/password-setup`

**Purpose:** Create account with quiz data
**Receives Params:**

- `email`
- `quizSubmissionId`
- `overthinkerType`
- `score`

**Actions:**

1. User creates password (8+ chars, confirmation)
2. Create Supabase auth account
3. Create `user_profiles` record with:
   - `quiz_connected: true`
   - `quiz_submission_id: [ID]`
   - `quiz_overthinker_type: [type]`
   - `quiz_connected_at: [timestamp]`
   - `onboarding_completed: true`
4. Update local store

**Next:** `/` (Home)

---

### 6. `/` (Home)

**Purpose:** Main app experience
**User State:**

- Authenticated ✓
- Quiz results connected ✓
- Onboarding complete ✓
- Ready to use F.I.R.E. Protocol ✓

---

## Exit Points

**No exit during quiz:**

- User MUST complete quiz once started (no back button on results)
- Can go back during questions, but can't skip quiz

**Only exit after account creation:**

- Once password setup is complete, user is in the app
- Can't return to onboarding (marked complete in database)

---

## Error Handling

### Email Lookup Errors

- **Invalid email format:** Red border + error message
- **Email not found:** Friendly message + option to take quiz
- **Database error:** Generic error + retry option

### Quiz Submission Errors

- **Supabase error:** Error message + retry button
- **Network error:** "Please check connection" message
- **Invalid data:** Should never happen (client-side validation)

### Password Setup Errors

- **Password too short:** "Must be 8+ characters"
- **Passwords don't match:** "Passwords do not match"
- **Email already registered:** "Email already exists, please sign in"
- **Database error:** "Account created but profile setup failed. Contact support."

---

## Technical Notes

### Why Two Quiz Paths?

1. **Web Quiz Users:** Already invested time, have results → Quick account creation
2. **New Users:** No results yet → Need to take quiz in-app for personalization

### Why Same `quiz_submissions` Table?

- Centralized data
- Easy analytics across platforms
- Same quiz, same scoring, same results
- `source_page` field distinguishes origin

### Why Skip Rest of Onboarding?

- Quiz users are already qualified
- They know what they're signing up for
- Faster time-to-value
- Can revisit onboarding later if needed

---

## Future Enhancements

### Potential Additions

1. **Skip quiz option:** Allow users to create account without quiz (mark as incomplete)
2. **Retake quiz:** Let users retake quiz later to update results
3. **Social signup:** Google/Apple sign in with quiz later
4. **Quiz preview:** Show 1-2 sample questions before committing
5. **Save progress:** Allow users to pause quiz and resume later

### Analytics to Track

- % who select "Yes" vs "No" on quiz recognition
- Email lookup success rate
- Quiz completion rate (started vs finished)
- Time spent on quiz
- Overthinker type distribution (mobile vs web)
- Conversion rate at each step
