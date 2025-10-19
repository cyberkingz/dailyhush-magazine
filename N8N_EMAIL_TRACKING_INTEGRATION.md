# n8n Email Tracking Integration Guide

This guide shows how to configure your n8n email workflows to track sends in Supabase, enabling CTR (Click-Through Rate) calculation.

## Table of Contents
- [Overview](#overview)
- [Database Schema](#database-schema)
- [n8n Workflow Configuration](#n8n-workflow-configuration)
- [Campaign Type Examples](#campaign-type-examples)
- [Testing & Verification](#testing--verification)

---

## Overview

**Goal:** Track every email send in Supabase to calculate:
- **CTR (Click-Through Rate)** = (Clicks / Sends) × 100
- **CTOR (Click-to-Open Rate)** = (Clicks / Opens) × 100 (future)

**How it works:**
1. n8n sends email via Gmail/SMTP/etc.
2. After successful send, n8n inserts record to Supabase `email_sends` table
3. Dashboard joins `email_sends` with `quiz_sessions` to calculate CTR

---

## Database Schema

The `email_sends` table has been created with the following structure:

```sql
CREATE TABLE email_sends (
  id UUID PRIMARY KEY,

  -- Campaign UTM parameters (must match email link UTMs)
  utm_source TEXT NOT NULL DEFAULT 'email',
  utm_medium TEXT NOT NULL,
  utm_campaign TEXT NOT NULL,
  utm_content TEXT,

  -- Send details
  recipient_email TEXT NOT NULL,
  send_batch_id TEXT,
  email_subject TEXT,

  -- n8n metadata
  n8n_workflow_id TEXT,
  n8n_execution_id TEXT,

  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## n8n Workflow Configuration

### Step 1: Get Supabase Service Key

1. Go to your Supabase project settings
2. Navigate to API settings
3. Copy your **service_role key** (not anon key!)
4. Store in n8n credentials

### Step 2: Add Supabase Node After Email Send

Your workflow should look like:

```
[Trigger/Schedule]
   ↓
[Get Recipients (from Google Sheet/Database/etc.)]
   ↓
[Loop: For each recipient]
   ↓
[Send Email (Gmail/SMTP)]
   ↓
[IF: Email sent successfully]
   ↓
[Supabase: Insert into email_sends] ← NEW NODE
   ↓
[Next recipient]
```

### Step 3: Configure Supabase Node

**Node Type:** Supabase
**Operation:** Insert
**Table:** `email_sends`

**Fields to Insert:**

| Field | Value | Example |
|-------|-------|---------|
| `utm_source` | `"email"` (fixed) | `email` |
| `utm_medium` | Campaign type | `cold_sequence`, `google_sheet_invite`, `retargeting` |
| `utm_campaign` | Specific campaign | `email_2`, `quiz_invite`, `quiz-retargeting` |
| `utm_content` | Sub-campaign (optional) | `day-0`, `day-1`, `version-a` |
| `recipient_email` | `{{ $json.email }}` | `john@example.com` |
| `send_batch_id` | `{{ $execution.id }}` | `abc123...` |
| `email_subject` | `{{ $json.subject }}` | `Your quiz results are in!` |
| `n8n_workflow_id` | `{{ $workflow.id }}` | `workflow_123` |
| `n8n_execution_id` | `{{ $execution.id }}` | `exec_456` |

---

## Campaign Type Examples

### Example 1: Google Sheet Invite Campaign

**Email Link:**
```
https://daily-hush.com/quiz?utm_source=email&utm_medium=google_sheet_invite&utm_campaign=quiz_invite
```

**Supabase Insert Data:**
```json
{
  "utm_source": "email",
  "utm_medium": "google_sheet_invite",
  "utm_campaign": "quiz_invite",
  "utm_content": null,
  "recipient_email": "{{ $json.email }}",
  "send_batch_id": "{{ $execution.id }}",
  "email_subject": "Take your overthinking quiz",
  "n8n_workflow_id": "{{ $workflow.id }}",
  "n8n_execution_id": "{{ $execution.id }}"
}
```

### Example 2: Cold Email Sequence (Email 2)

**Email Link:**
```
https://daily-hush.com/quiz?utm_source=email&utm_medium=cold_sequence&utm_campaign=email_2
```

**Supabase Insert Data:**
```json
{
  "utm_source": "email",
  "utm_medium": "cold_sequence",
  "utm_campaign": "email_2",
  "utm_content": null,
  "recipient_email": "{{ $json.email }}",
  "send_batch_id": "{{ $execution.id }}",
  "email_subject": "The neuroscience behind your overthinking",
  "n8n_workflow_id": "{{ $workflow.id }}",
  "n8n_execution_id": "{{ $execution.id }}"
}
```

### Example 3: Post-Quiz Retargeting (Day 0)

**Email Link:**
```
https://daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-0&email={{EMAIL}}
```

**Supabase Insert Data:**
```json
{
  "utm_source": "email",
  "utm_medium": "retargeting",
  "utm_campaign": "quiz-retargeting",
  "utm_content": "day-0",
  "recipient_email": "{{ $json.email }}",
  "send_batch_id": "{{ $execution.id }}",
  "email_subject": "Your F.I.R.E. Protocol is ready",
  "n8n_workflow_id": "{{ $workflow.id }}",
  "n8n_execution_id": "{{ $execution.id }}"
}
```

---

## UTM Parameter Standards

**IMPORTANT:** The UTM parameters in the Supabase insert **MUST EXACTLY MATCH** the UTM parameters in your email links!

### Recommended UTM Structure by Campaign Type

| Campaign Type | utm_source | utm_medium | utm_campaign | utm_content |
|---------------|------------|------------|--------------|-------------|
| Google Sheet Invites | `email` | `google_sheet_invite` | `quiz_invite` | - |
| Cold Email Sequences | `email` | `cold_sequence` | `email_2`, `email_3`, etc. | - |
| One-off Email Blasts | `email` | `manual_blast` | `[descriptive-name]` | - |
| Post-Quiz Retargeting | `email` | `retargeting` | `quiz-retargeting` | `day-0`, `day-1`, etc. |

---

## Testing & Verification

### Step 1: Send Test Email

1. Trigger your n8n workflow with a test recipient
2. Check that email was sent
3. Verify Supabase insert succeeded

### Step 2: Verify in Supabase

Run this query in Supabase SQL Editor:

```sql
SELECT
  utm_campaign,
  utm_medium,
  recipient_email,
  email_subject,
  sent_at
FROM email_sends
ORDER BY sent_at DESC
LIMIT 10;
```

You should see your test record.

### Step 3: Test CTR Calculation

After someone clicks the email link:

```sql
-- Get sends
SELECT COUNT(*) as total_sends
FROM email_sends
WHERE utm_campaign = 'email_2';

-- Get clicks
SELECT COUNT(*) as total_clicks
FROM quiz_sessions
WHERE utm_campaign = 'email_2';

-- Calculate CTR
SELECT
  (total_clicks::float / total_sends::float) * 100 as ctr_percentage
FROM (
  SELECT
    (SELECT COUNT(*) FROM quiz_sessions WHERE utm_campaign = 'email_2') as total_clicks,
    (SELECT COUNT(*) FROM email_sends WHERE utm_campaign = 'email_2') as total_sends
) metrics;
```

### Step 4: Check Dashboard

The dashboard will automatically show CTR once the analytics queries are updated (next step).

---

## Common Issues & Troubleshooting

### Issue 1: "Cannot insert into email_sends"
**Cause:** Using anon key instead of service_role key
**Fix:** Use service_role key in n8n Supabase credentials

### Issue 2: UTM mismatch
**Cause:** UTM in Supabase insert doesn't match UTM in email link
**Fix:** Ensure exact match between insert data and email link parameters

### Issue 3: Duplicate sends
**Cause:** Workflow retry or loop issue
**Fix:** Use send_batch_id to deduplicate if needed

### Issue 4: Missing records
**Cause:** Email send succeeded but Supabase insert failed
**Fix:** Add error handling node after Supabase insert to log failures

---

## Next Steps

1. ✅ Database table created
2. ✅ n8n integration documented
3. ⏳ Update analytics queries to calculate CTR
4. ⏳ Update dashboard to display CTR metrics
5. ⏳ Update all n8n email workflows with Supabase tracking

---

## Support & Questions

If you have questions about this integration:
1. Check the troubleshooting section above
2. Verify UTM parameters match exactly
3. Test with a single email first before bulk sends
