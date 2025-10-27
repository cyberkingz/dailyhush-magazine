# n8n Email Tracking Nodes Configuration

Add these Supabase nodes **AFTER** each email send node to track email sends for open rate calculation.

## Prerequisites

1. Run migration: `supabase/migrations/007_create_email_sends_table.sql`
2. Add Supabase credentials to n8n (if not already added)

## Node Placement in Workflow

```
Email Send → Track Email Send (Supabase) → Next Node
```

---

## 1. Track Email 1 (Day 0 - Instant Confirmation)

**Add after:** `Day 1 - Instant Email - Quiz Confirmation`
**Connect to:** `Telegram Notification`

### Node Configuration:

**Node Name:** `Track Email 1 Send`
**Node Type:** `Supabase`
**Operation:** `Insert`
**Table:** `email_sends`

**Fields:**
```json
{
  "recipient_email": "={{ $('Webhook').item.json.query.email }}",
  "email_sequence_day": 0,
  "email_subject": "Those 3 phrases? I said them for 8 years",
  "campaign_name": "necklace-launch",
  "utm_source": "email",
  "utm_medium": "quiz-sequence",
  "utm_campaign": "necklace-launch",
  "utm_content": "quiz-day0-confirmation",
  "quiz_score": "={{ $('Webhook').item.json.query.quiz_score }}",
  "quiz_result_type": "={{ $('Webhook').item.json.query.quiz_result_type }}",
  "quiz_result_title": "={{ $('Webhook').item.json.query.quiz_result_title }}"
}
```

---

## 2. Track Email 2 (Day 1 - Brain Science)

**Add after:** `EMAIL 2 (DAY 2): The "You're Still There" Reminder1`
**Connect to:** `Wait until day 4`

### Node Configuration:

**Node Name:** `Track Email 2 Send`
**Node Type:** `Supabase`
**Operation:** `Insert`
**Table:** `email_sends`

**Fields:**
```json
{
  "recipient_email": "={{ $('Webhook').item.json.query.email }}",
  "email_sequence_day": 1,
  "email_subject": "That email you sent—did you sound stupid?",
  "campaign_name": "necklace-launch",
  "utm_source": "email",
  "utm_medium": "quiz-retargeting",
  "utm_campaign": "necklace-launch",
  "utm_content": "day1-brain-science",
  "quiz_score": "={{ $('Webhook').item.json.query.quiz_score }}",
  "quiz_result_type": "={{ $('Webhook').item.json.query.quiz_result_type }}",
  "quiz_result_title": "={{ $('Webhook').item.json.query.quiz_result_title }}"
}
```

---

## 3. Track Email 3 (Day 2 - Four Patterns)

**Add after:** `EMAIL 3 (DAY 4): Customer Success Story1`
**Connect to:** `Wait until day 6`

### Node Configuration:

**Node Name:** `Track Email 3 Send`
**Node Type:** `Supabase`
**Operation:** `Insert`
**Table:** `email_sends`

**Fields:**
```json
{
  "recipient_email": "={{ $('Webhook').item.json.query.email }}",
  "email_sequence_day": 2,
  "email_subject": "The Pattern I Recognized in Your Quiz",
  "campaign_name": "necklace-launch",
  "utm_source": "email",
  "utm_medium": "quiz-retargeting",
  "utm_campaign": "necklace-launch",
  "utm_content": "day2-four-patterns",
  "quiz_score": "={{ $('Webhook').item.json.query.quiz_score }}",
  "quiz_result_type": "={{ $('Webhook').item.json.query.quiz_result_type }}",
  "quiz_result_title": "={{ $('Webhook').item.json.query.quiz_result_title }}"
}
```

---

## 4. Track Email 4 (Day 3 - Social Proof)

**Add after:** `EMAIL 4 (DAY 6): Risk Reversal + Urgency1`
**Connect to:** `Wait until day 8`

### Node Configuration:

**Node Name:** `Track Email 4 Send`
**Node Type:** `Supabase`
**Operation:** `Insert`
**Table:** `email_sends`

**Fields:**
```json
{
  "recipient_email": "={{ $('Webhook').item.json.query.email }}",
  "email_sequence_day": 3,
  "email_subject": "What if it doesn't work?",
  "campaign_name": "necklace-launch",
  "utm_source": "email",
  "utm_medium": "quiz-retargeting",
  "utm_campaign": "necklace-launch",
  "utm_content": "day3-social-proof",
  "quiz_score": "={{ $('Webhook').item.json.query.quiz_score }}",
  "quiz_result_type": "={{ $('Webhook').item.json.query.quiz_result_type }}",
  "quiz_result_title": "={{ $('Webhook').item.json.query.quiz_result_title }}"
}
```

---

## 5. Track Email 5 (Day 4 - Final Call)

**Add after:** `EMAIL 5 (DAY 8): FINAL CHANCE1`
**No next connection** (end of sequence)

### Node Configuration:

**Node Name:** `Track Email 5 Send`
**Node Type:** `Supabase`
**Operation:** `Insert`
**Table:** `email_sends`

**Fields:**
```json
{
  "recipient_email": "={{ $('Webhook').item.json.query.email }}",
  "email_sequence_day": 4,
  "email_subject": "Last Call - $67 Expires Tonight",
  "campaign_name": "necklace-launch",
  "utm_source": "email",
  "utm_medium": "quiz-retargeting",
  "utm_campaign": "necklace-launch",
  "utm_content": "day4-final-call",
  "quiz_score": "={{ $('Webhook').item.json.query.quiz_score }}",
  "quiz_result_type": "={{ $('Webhook').item.json.query.quiz_result_type }}",
  "quiz_result_title": "={{ $('Webhook').item.json.query.quiz_result_title }}"
}
```

---

## How to Calculate Open Rate

Once tracking is in place, use this SQL query:

```sql
-- Open rate per email in sequence
SELECT
  es.email_sequence_day,
  es.email_subject,
  COUNT(DISTINCT es.recipient_email) as emails_sent,
  COUNT(DISTINCT CASE
    WHEN pps.email IS NOT NULL OR typs.email IS NOT NULL
    THEN es.recipient_email
  END) as emails_opened,
  ROUND(
    (COUNT(DISTINCT CASE
      WHEN pps.email IS NOT NULL OR typs.email IS NOT NULL
      THEN es.recipient_email
    END)::numeric / COUNT(DISTINCT es.recipient_email)) * 100,
    2
  ) as open_rate_percentage
FROM email_sends es
LEFT JOIN product_page_sessions pps
  ON pps.email = es.recipient_email
  AND pps.utm_content = es.utm_content
  AND pps.created_at >= es.sent_at
  AND pps.created_at <= es.sent_at + INTERVAL '48 hours'
LEFT JOIN thank_you_page_sessions typs
  ON typs.email = es.recipient_email
  AND typs.utm_content = es.utm_content
  AND typs.created_at >= es.sent_at
  AND typs.created_at <= es.sent_at + INTERVAL '48 hours'
WHERE es.campaign_name = 'necklace-launch'
GROUP BY es.email_sequence_day, es.email_subject
ORDER BY es.email_sequence_day;
```

### Expected Output:
```
email_sequence_day | email_subject                           | emails_sent | emails_opened | open_rate_percentage
-------------------+-----------------------------------------+-------------+---------------+---------------------
0                  | Those 3 phrases? I said them for 8 years| 150         | 67            | 44.67
1                  | That email you sent—did you sound stupid| 150         | 45            | 30.00
2                  | The Pattern I Recognized in Your Quiz   | 150         | 38            | 25.33
3                  | What if it doesn't work?                | 150         | 32            | 21.33
4                  | Last Call - $67 Expires Tonight         | 150         | 28            | 18.67
```

---

## Visual in Admin Dashboard

The existing `/admin/dashboard` → "Email Campaigns" view will automatically show this data once the tracking nodes are added. The `getCampaignMetrics` function in `src/lib/services/quiz.ts` already queries the `email_sends` table (lines 681-686).

You'll see:
- Total emails sent per campaign
- Views/opens per campaign
- Completion rates
- Open rate calculation

---

## Testing

1. Run the migration in Supabase
2. Add the 5 tracking nodes in n8n
3. Test the workflow by submitting a quiz
4. Check Supabase table: `SELECT * FROM email_sends ORDER BY sent_at DESC`
5. Verify data appears in admin dashboard

---

## Notes

- **Email 1** goes to thank you page (tracked via `thank_you_page_sessions`)
- **Emails 2-5** go to product page (tracked via `product_page_sessions`)
- Open rate = (Unique email sessions within 48hrs of send) / (Total emails sent)
- Each tracking node adds ~50ms to workflow execution (negligible)
