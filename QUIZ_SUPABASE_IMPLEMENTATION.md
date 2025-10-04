# Quiz Funnel Supabase Implementation Guide

## Overview

This implementation guide covers the complete Supabase database setup for the quiz funnel, including schema, RLS policies, TypeScript integration, and testing instructions.

## 📋 What Was Implemented

### 1. Database Schema

Created a **two-table normalized design** for optimal data structure and querying:

#### **quiz_submissions** table
- Stores one record per quiz completion
- Captures user email, quiz result (overthinker type), score, and full result details
- Includes tracking context (UTM params, source page, browser info)
- Primary table for quiz analytics and user data

#### **quiz_answers** table
- Stores individual question answers (13 answers per submission)
- Links to quiz_submissions via `submission_id` foreign key
- Captures question details, selected options, and answer values
- Enables question-level analytics and answer distribution analysis

### 2. Security & Access Control

**Row Level Security (RLS) Policies:**
- ✅ **Anonymous INSERT**: Users can submit quiz results without authentication
- ✅ **Authenticated READ**: Only authenticated users (admins) can view submissions
- ✅ **Authenticated UPDATE**: Only authenticated users can update submissions
- ✅ **CASCADE DELETE**: When a submission is deleted, all answers are automatically removed

### 3. Analytics Views

Three analytical views for dashboard reporting:

1. **quiz_analytics**: Daily aggregated quiz submissions by type, source, and UTM
2. **quiz_question_analytics**: Answer distribution and statistics per question
3. **overthinker_type_distribution**: Count and percentage of each overthinker type

### 4. TypeScript Integration

Created comprehensive service layer:
- `/src/lib/services/quiz.ts` - Quiz submission and retrieval functions
- `/src/lib/types/quiz-db.ts` - TypeScript types for all database tables
- Integrated with existing tracking context from leads service

## 🚀 Deployment Instructions

### Step 1: Apply the Migration

Run the migration to create the quiz tables:

```bash
cd /Users/toni/Downloads/dailyhush-blog

# Option A: Using Supabase CLI (recommended)
supabase db push

# Option B: Using Supabase MCP (if configured)
# Apply migration via MCP tools

# Option C: Manual via Supabase Dashboard
# Copy the contents of supabase/migrations/003_create_quiz_tables.sql
# Paste into SQL Editor in Supabase Dashboard
# Execute the query
```

### Step 2: Verify Tables Created

Check that tables exist in Supabase:

```sql
-- Run in Supabase SQL Editor
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('quiz_submissions', 'quiz_answers');
```

### Step 3: Verify RLS Policies

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('quiz_submissions', 'quiz_answers');

-- Check policies exist
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('quiz_submissions', 'quiz_answers');
```

### Step 4: Test Anonymous Insert

Test that anonymous users can submit quiz results:

```javascript
// Test in browser console on your app
const { data, error } = await supabase
  .from('quiz_submissions')
  .insert([{
    email: 'test@example.com',
    overthinker_type: 'chronic-planner',
    score: 15,
    result_title: 'The Chronic Planner',
    result_description: 'Test description',
    result_insight: 'Test insight',
    result_cta_hook: 'Test CTA',
    source_page: 'quiz'
  }])
  .select('id')
  .single()

console.log('Submission ID:', data?.id, 'Error:', error)
```

## 📁 Files Modified/Created

### Created Files:
1. **`/Users/toni/Downloads/dailyhush-blog/supabase/migrations/003_create_quiz_tables.sql`**
   - Complete migration with tables, indexes, RLS policies, and views

2. **`/Users/toni/Downloads/dailyhush-blog/src/lib/services/quiz.ts`**
   - `submitQuiz()` - Submit quiz results and answers
   - `getQuizSubmissions()` - Retrieve submissions (admin)
   - `getQuizAnswers()` - Get answers for a submission
   - `getQuizAnalytics()` - Get analytics data
   - `getOverthinkerTypeDistribution()` - Get type distribution
   - `getSubmissionsByType()` - Filter by overthinker type

3. **`/Users/toni/Downloads/dailyhush-blog/src/lib/types/quiz-db.ts`**
   - TypeScript types for all database tables and views
   - Input types for creating submissions and answers

### Modified Files:
1. **`/Users/toni/Downloads/dailyhush-blog/src/pages/Quiz.tsx`**
   - Added imports for `submitQuiz` and `createLead`
   - Updated `handleEmailSubmit` to save quiz data to Supabase
   - Exposed `answers` array from useQuiz hook
   - Creates both quiz submission and lead entry

2. **`/Users/toni/Downloads/dailyhush-blog/src/hooks/useQuiz.ts`**
   - Exposed `answers` array in return value for submission

## 🔧 How It Works

### Data Flow:

1. **User completes quiz** → answers stored in local state
2. **User enters email** → triggers `handleEmailSubmit()`
3. **Submit to Supabase**:
   - Calls `submitQuiz()` with email, answers, result, questions
   - Creates quiz_submission record (returns submission ID)
   - Creates 13 quiz_answer records linked to submission
   - Also creates lead entry for newsletter subscription
4. **Navigate to thank-you page** → existing funnel flow continues

### Key Features:

- **Dual submission**: Quiz results + newsletter lead in one flow
- **Error handling**: Continues even if one submission fails
- **Tracking context**: Automatically captures UTM params, source, browser info
- **Normalized data**: Separate tables for submissions and answers
- **Analytics ready**: Pre-built views for reporting

## 📊 Querying Quiz Data

### Get All Submissions (Admin)

```typescript
import { getQuizSubmissions } from '@/lib/services/quiz'

const { submissions, count } = await getQuizSubmissions(50, 0)
console.log(`Total: ${count}, Retrieved: ${submissions.length}`)
```

### Get Answers for a Submission

```typescript
import { getQuizAnswers } from '@/lib/services/quiz'

const answers = await getQuizAnswers(submissionId)
console.log('Answers:', answers)
```

### Get Analytics

```typescript
import { getQuizAnalytics, getOverthinkerTypeDistribution } from '@/lib/services/quiz'

// Last 30 days analytics
const analytics = await getQuizAnalytics(30)

// Type distribution
const distribution = await getOverthinkerTypeDistribution()
```

### Direct SQL Queries

```sql
-- Get submission count by overthinker type
SELECT overthinker_type, COUNT(*) as count
FROM quiz_submissions
GROUP BY overthinker_type
ORDER BY count DESC;

-- Get most popular answer for each question
SELECT
  question_id,
  option_text,
  COUNT(*) as answer_count
FROM quiz_answers
WHERE option_id IS NOT NULL
GROUP BY question_id, option_text
ORDER BY question_id, answer_count DESC;

-- Get conversion rate by source
SELECT
  source_page,
  utm_source,
  COUNT(*) as submissions,
  COUNT(DISTINCT email) as unique_emails
FROM quiz_submissions
GROUP BY source_page, utm_source
ORDER BY submissions DESC;
```

## 🔒 Security Considerations

### What's Protected:
- ✅ Anonymous users can ONLY insert (submit quiz)
- ✅ Anonymous users CANNOT read any submissions
- ✅ Anonymous users CANNOT update or delete
- ✅ Authenticated users (admins) have full read/update access

### What to Monitor:
- Check for duplicate email submissions (intentional duplicates allowed for retakes)
- Monitor submission volume for spam/abuse
- Review RLS policies periodically

### Run Security Advisor:

If you have Supabase MCP configured:
```bash
# Check for security issues
mcp__supabase__get_advisors --type security

# Check for performance issues
mcp__supabase__get_advisors --type performance
```

## 🧪 Testing Checklist

### Manual Testing:

- [ ] Complete quiz flow as anonymous user
- [ ] Submit email and verify redirect to /thank-you
- [ ] Check Supabase dashboard for new submission record
- [ ] Verify 13 answer records created linked to submission
- [ ] Verify lead record also created in leads table
- [ ] Check console logs for submission ID

### Database Testing:

```sql
-- Verify latest submission
SELECT * FROM quiz_submissions ORDER BY created_at DESC LIMIT 1;

-- Count answers for latest submission
SELECT submission_id, COUNT(*) as answer_count
FROM quiz_answers
WHERE submission_id = (
  SELECT id FROM quiz_submissions ORDER BY created_at DESC LIMIT 1
)
GROUP BY submission_id;

-- Check analytics views work
SELECT * FROM quiz_analytics LIMIT 10;
SELECT * FROM overthinker_type_distribution;
```

### Error Testing:

- [ ] Test with invalid email format (should show validation error)
- [ ] Test network failure (submissions should fail gracefully)
- [ ] Test duplicate email (should still create submission, lead may warn duplicate)

## 📈 Next Steps

### Optional Enhancements:

1. **Admin Dashboard**: Build React admin panel to view submissions
   - Use `getQuizSubmissions()` to fetch data
   - Display overthinker type distribution chart
   - Show question analytics

2. **Email Automation**: Trigger based on overthinker type
   - Use submission webhook or edge function
   - Send personalized email based on result type

3. **A/B Testing**: Track quiz variations
   - Add `quiz_version` column to track iterations
   - Compare conversion rates between versions

4. **Retake Logic**: Allow users to retake quiz
   - Already supported (duplicate emails allowed)
   - Optional: Add `is_latest` flag to mark most recent submission

## 🐛 Troubleshooting

### Issue: Migration fails to apply
**Solution**: Check for syntax errors, ensure previous migrations are applied first

### Issue: Anonymous users can't submit
**Solution**: Verify RLS policies are created, check Supabase logs

### Issue: Answers not being saved
**Solution**: Check submission ID is returned before inserting answers, verify FK constraint

### Issue: TypeScript errors
**Solution**: Ensure all imports are correct, rebuild TypeScript with `npm run build`

## 📚 Additional Resources

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Foreign Keys](https://supabase.com/docs/guides/database/tables#foreign-key-constraints)
- [PostgreSQL Views](https://www.postgresql.org/docs/current/sql-createview.html)

---

**Implementation Status**: ✅ Complete

All code has been implemented and is ready for deployment. Follow the deployment instructions above to activate the quiz funnel database.
