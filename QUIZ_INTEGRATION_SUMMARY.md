# Quiz Supabase Integration - Quick Summary

## ✅ What's Been Done

### 1. Database Tables Created
- `quiz_submissions` - Main table for quiz completions (email, result, score, tracking)
- `quiz_answers` - Individual question answers (13 per submission)
- 3 analytics views for reporting

### 2. Code Files

#### **Created:**
- `/supabase/migrations/003_create_quiz_tables.sql` - Database schema
- `/src/lib/services/quiz.ts` - Quiz submission service
- `/src/lib/types/quiz-db.ts` - TypeScript types

#### **Modified:**
- `/src/pages/Quiz.tsx` - Now saves to Supabase on email submit
- `/src/hooks/useQuiz.ts` - Exposes answers array

## 🚀 Deployment Steps

### 1. Apply Migration

```bash
# Using Supabase CLI
supabase db push

# OR manually via Supabase Dashboard SQL Editor:
# Copy content from: /Users/toni/Downloads/dailyhush-blog/supabase/migrations/003_create_quiz_tables.sql
# Paste and execute in Supabase SQL Editor
```

### 2. Verify Tables

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'quiz%';
```

### 3. Test Submission

Complete a quiz on your site and check:
- Console logs show submission ID
- Supabase dashboard shows new record in `quiz_submissions`
- 13 records appear in `quiz_answers`

## 📊 Data Schema

### quiz_submissions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | User email |
| overthinker_type | VARCHAR(50) | Result type (chronic-planner, research-addict, etc.) |
| score | INTEGER | Quiz score |
| result_title | TEXT | Result title |
| result_description | TEXT | Result description |
| result_insight | TEXT | Result insight |
| result_cta_hook | TEXT | CTA text |
| source_page | VARCHAR(255) | Where quiz was taken (default: 'quiz') |
| utm_* | VARCHAR(100) | UTM tracking parameters |
| browser, device_type | VARCHAR | Device info |
| created_at | TIMESTAMPTZ | Submission timestamp |

### quiz_answers
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| submission_id | UUID | FK to quiz_submissions |
| question_id | VARCHAR(50) | Question ID (q1, q2, etc.) |
| question_section | VARCHAR(50) | Section (mental, action, etc.) |
| question_type | VARCHAR(20) | Type (single, scale, multiple) |
| option_id | VARCHAR(50) | Selected option ID |
| option_text | TEXT | Selected option text |
| option_value | INTEGER | Option scoring value |

## 🔒 Security (RLS Policies)

- ✅ **Anonymous users**: Can INSERT (submit quiz)
- ✅ **Authenticated users**: Can SELECT/UPDATE (admin access)
- ✅ **Public**: Cannot SELECT (data is private)

## 📝 Usage Examples

### In Your Components

```typescript
import { submitQuiz } from '@/lib/services/quiz'

// Already integrated in Quiz.tsx handleEmailSubmit:
const response = await submitQuiz({
  email,
  answers,
  result,
  questions: quizQuestions,
})

console.log('Submission ID:', response.submissionId)
```

### Admin Queries

```typescript
import {
  getQuizSubmissions,
  getQuizAnswers,
  getOverthinkerTypeDistribution
} from '@/lib/services/quiz'

// Get all submissions
const { submissions, count } = await getQuizSubmissions(50, 0)

// Get specific submission answers
const answers = await getQuizAnswers(submissionId)

// Get type distribution
const distribution = await getOverthinkerTypeDistribution()
```

### Direct SQL (in Supabase Dashboard)

```sql
-- Latest submissions
SELECT email, overthinker_type, score, created_at
FROM quiz_submissions
ORDER BY created_at DESC
LIMIT 10;

-- Answer distribution for question 1
SELECT option_text, COUNT(*) as count
FROM quiz_answers
WHERE question_id = 'q1'
GROUP BY option_text
ORDER BY count DESC;

-- Submissions by type
SELECT * FROM overthinker_type_distribution;
```

## 🎯 What Happens When User Submits

1. User completes all 13 quiz questions
2. User enters email on results page
3. **Two submissions happen**:
   - `submitQuiz()` - Saves quiz submission + 13 answers
   - `createLead()` - Saves email to leads table (newsletter)
4. User redirected to `/thank-you` page
5. Existing funnel flow continues (tripwire, upsells, etc.)

## ✨ Key Features

- ✅ Normalized database design (submissions + answers)
- ✅ Complete tracking context (UTM, source, browser)
- ✅ Dual submission (quiz results + newsletter lead)
- ✅ Analytics views pre-built
- ✅ Type-safe TypeScript integration
- ✅ Graceful error handling
- ✅ Anonymous submission (no auth required)
- ✅ Admin-only data access

## 🔍 Monitoring Queries

```sql
-- Submissions per day
SELECT DATE(created_at) as date, COUNT(*) as count
FROM quiz_submissions
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Top overthinker type
SELECT overthinker_type, COUNT(*) as count, ROUND(AVG(score), 2) as avg_score
FROM quiz_submissions
GROUP BY overthinker_type
ORDER BY count DESC;

-- Source performance
SELECT source_page, utm_source, COUNT(*) as submissions
FROM quiz_submissions
GROUP BY source_page, utm_source
ORDER BY submissions DESC;
```

## 📋 Files Reference

### Migration File
```
/Users/toni/Downloads/dailyhush-blog/supabase/migrations/003_create_quiz_tables.sql
```

### Service Files
```
/Users/toni/Downloads/dailyhush-blog/src/lib/services/quiz.ts
/Users/toni/Downloads/dailyhush-blog/src/lib/types/quiz-db.ts
```

### Modified Files
```
/Users/toni/Downloads/dailyhush-blog/src/pages/Quiz.tsx
/Users/toni/Downloads/dailyhush-blog/src/hooks/useQuiz.ts
```

---

**Status**: ✅ Ready to deploy - just apply the migration!
