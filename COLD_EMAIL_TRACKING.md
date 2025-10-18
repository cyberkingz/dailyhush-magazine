# Cold Email Campaign Tracking Guide

## Overview

This document explains how to track cold email campaigns that drive traffic to the quiz page. The system automatically captures UTM parameters and provides detailed analytics on campaign performance.

## How It Works

### 1. UTM Parameter Structure

Cold email campaigns use UTM parameters to track the source of traffic. When a user clicks a link in your email, they should be directed to a URL with the following structure:

```
https://yourdomain.com/quiz?utm_source=email&utm_medium=cold_email&utm_campaign=email_2
```

### 2. UTM Parameters Explained

- **utm_source**: The traffic source (use `email` for email campaigns)
- **utm_medium**: The marketing medium (use `cold_email` for cold outreach)
- **utm_campaign**: The specific campaign identifier

### 3. Campaign Naming Convention

The system recognizes the following cold email campaigns:

| Campaign ID | Description | Example Use Case |
|------------|-------------|------------------|
| `email_2` | Second email in sequence | First follow-up after initial contact |
| `email_3` | Third email in sequence | Second follow-up |
| `email_4` | Fourth email in sequence | Third follow-up |
| `email_5_final` | Final email in sequence | Last attempt to engage |
| `quiz_invite` | Generic quiz invitation | One-off quiz invitations |
| `email_sequence` | General email sequence | Automated drip campaigns |
| `google_sheet_invite` | Invites from Google Sheets | Bulk invites from spreadsheet |

## Sample URLs

### Email Campaign 2
```
https://dailyhush.com/quiz?utm_source=email&utm_medium=cold_email&utm_campaign=email_2
```

### Email Campaign 3
```
https://dailyhush.com/quiz?utm_source=email&utm_medium=cold_email&utm_campaign=email_3
```

### Email Campaign 4
```
https://dailyhush.com/quiz?utm_source=email&utm_medium=cold_email&utm_campaign=email_4
```

### Email Campaign 5 (Final)
```
https://dailyhush.com/quiz?utm_source=email&utm_medium=cold_email&utm_campaign=email_5_final
```

### Quiz Invite (Generic)
```
https://dailyhush.com/quiz?utm_source=email&utm_medium=cold_email&utm_campaign=quiz_invite
```

## Implementation in Email Platforms

### Beehiiv

When creating emails in Beehiiv, add UTM parameters to your quiz link:

1. Insert your quiz link: `https://dailyhush.com/quiz`
2. Add UTM parameters: `?utm_source=email&utm_medium=cold_email&utm_campaign=email_2`
3. Final link: `https://dailyhush.com/quiz?utm_source=email&utm_medium=cold_email&utm_campaign=email_2`

### Manual Email Tools

If manually crafting emails:

```html
<a href="https://dailyhush.com/quiz?utm_source=email&utm_medium=cold_email&utm_campaign=email_2">
  Take the Overthinking Quiz
</a>
```

## Data Flow

### 1. User Clicks Email Link
When a user clicks the link in your email, they land on the quiz page with UTM parameters in the URL.

### 2. Quiz Session Created
The system automatically captures and stores:
- `utm_source`: "email"
- `utm_medium`: "cold_email"
- `utm_campaign`: "email_2" (or whichever campaign)
- Session ID (unique identifier)
- Timestamp
- Device type, browser info

### 3. Quiz Events Tracked
As the user interacts with the quiz:
- `page_view`: User lands on quiz page
- `quiz_start`: User starts the quiz
- `question_view`: User views each question
- `question_answer`: User answers each question
- `quiz_complete`: User completes the quiz
- `email_submit`: User submits their email

### 4. Analytics Calculated
The system groups sessions by `utm_campaign` and calculates:
- **Views**: Unique quiz page visits from this campaign
- **Starts**: How many users started the quiz
- **Completions**: How many users completed the quiz
- **Start Rate**: (Starts / Views) × 100
- **Completion Rate**: (Completions / Starts) × 100
- **Overall Conversion**: (Completions / Views) × 100

## Viewing Analytics

### Dashboard Access
Navigate to `/admin/dashboard` and select one of two tabs:

#### 1. Email Campaigns Tab
Shows all email campaigns (both cold email and post-quiz retargeting) with:
- Total campaigns tracked
- Total views across all campaigns
- Total completions
- Average conversion rate
- Detailed table with per-campaign breakdown

#### 2. Quiz Analytics Tab
Shows comprehensive quiz performance including:
- Overall funnel metrics (Views → Starts → Completions)
- Daily trend charts
- Device breakdown
- Traffic source analysis
- Campaign performance table (filtered to show only email campaigns)
- Question-level dropoff analysis

### Campaign Performance Table

The table displays:

| Column | Description |
|--------|-------------|
| Campaign | Campaign identifier (email_2, email_3, etc.) |
| Type | "Cold Email" or "Post-Quiz Retargeting" |
| Views | Unique quiz page visits |
| Starts | Users who started the quiz |
| Completions | Users who finished the quiz |
| Start Rate | Percentage who started after viewing |
| Completion Rate | Percentage who finished after starting |
| Overall Conv | Percentage who finished after viewing |

## Campaign Classification

The system automatically classifies campaigns into two types:

### Cold Email Campaigns
Target: Users who haven't taken the quiz yet
Goal: Get users to take the quiz

Campaigns identified as cold email:
- `quiz_invite`
- `email_2`
- `email_3`
- `email_4`
- `email_5_final`
- `email_sequence`
- `google_sheet_invite`
- Any campaign containing "email" or "invite" in the name

### Post-Quiz Retargeting
Target: Users who already took the quiz
Goal: Get users to purchase the product

Campaigns identified as post-quiz retargeting:
- `quiz-retargeting`
- `day-0`, `day-1`, `day-3`, `day-5`, `day-7`
- Other campaigns not matching cold email patterns

## Filtering Social Ads

The Email Campaigns and Quiz Analytics tabs automatically filter out Facebook/Instagram ad campaigns to show only genuine email campaigns.

Campaigns are excluded if `utm_source` is:
- `facebook`
- `instagram`
- `fb`
- `ig`

This ensures that paid social ads don't pollute your email campaign analytics.

## Best Practices

### 1. Consistent Naming
Always use lowercase for campaign names and maintain consistency:
- ✅ `email_2`, `email_3`, `email_4`
- ❌ `Email2`, `EMAIL_3`, `email-4`

### 2. Always Include All Three Parameters
- `utm_source=email` (identifies traffic source)
- `utm_medium=cold_email` (identifies campaign type)
- `utm_campaign=email_2` (identifies specific campaign)

### 3. Test Your Links
Before sending an email campaign:
1. Copy your URL with UTM parameters
2. Paste it into a browser
3. Complete the quiz
4. Check the dashboard to verify the campaign appears

### 4. Track Campaign Performance
After sending each email:
1. Wait 24-48 hours for responses
2. Check the Email Campaigns tab
3. Compare performance across campaigns
4. Identify which messaging resonates best

### 5. Date Range Filtering
Use the date picker in the dashboard to:
- View today's performance
- Compare week-over-week trends
- Analyze specific campaign send dates
- Calculate ROI for specific time periods

## Technical Details

### Database Schema

#### quiz_sessions table
Stores one record per quiz session:
```typescript
{
  session_id: string          // Unique session identifier
  utm_source: string          // "email"
  utm_medium: string          // "cold_email"
  utm_campaign: string        // "email_2"
  is_completed: boolean       // Did they finish?
  started_at: timestamp       // When did they start?
  completed_at: timestamp     // When did they finish?
  completion_time_ms: number  // How long did it take?
  created_at: timestamp       // Session creation time
  updated_at: timestamp       // Last update time
}
```

#### quiz_events table
Stores individual events within a session:
```typescript
{
  event_id: string           // Unique event identifier
  session_id: string         // Links to quiz_sessions
  event_type: string         // "page_view", "quiz_start", etc.
  question_id: string        // For question events
  question_index: number     // Question position
  time_spent_ms: number      // Time spent on this step
  created_at: timestamp      // When event occurred
}
```

### Query Logic

The `getCampaignMetrics()` function:
1. Fetches all quiz sessions with `utm_campaign` not null
2. Filters by date range
3. Fetches related quiz events (page_view, quiz_start, quiz_complete)
4. Groups sessions by `utm_campaign`
5. Counts unique sessions for each metric
6. Calculates conversion rates
7. Classifies campaign type
8. Returns sorted by views (descending)

## Troubleshooting

### Campaign Not Appearing in Dashboard

**Problem**: Sent email campaign but it's not showing in analytics.

**Solutions**:
1. Verify UTM parameters are in the URL
2. Check that you used `utm_source=email` (not facebook/instagram)
3. Ensure users actually clicked the link
4. Wait a few minutes for database sync
5. Check the date range filter in dashboard

### Campaign Classified Incorrectly

**Problem**: Campaign showing as "Post-Quiz Retargeting" instead of "Cold Email".

**Solutions**:
1. Ensure campaign name includes one of the recognized patterns (email_2, email_3, etc.)
2. Or ensure campaign name contains "email" or "invite"
3. Check the `determineCampaignType()` function in `/src/lib/services/quiz.ts` (line 765)

### Zero Completions

**Problem**: Campaign has views but no completions.

**Possible Reasons**:
1. Quiz is too long or difficult
2. Users dropping off at specific questions (check Question Analysis in Quiz Analytics tab)
3. Technical issues with quiz
4. Email audience not well-targeted
5. Quiz page loading slowly

**Next Steps**:
1. Check Quiz Analytics tab > Question Dropoff section
2. Identify where users are abandoning
3. Test the quiz yourself with the campaign URL
4. Review quiz questions for clarity

### Facebook Ads Showing in Email Analytics

**Problem**: Seeing Facebook ad campaigns in Email Campaigns tab.

**Solution**: This should be automatically filtered. If you're seeing them:
1. Check that Facebook ads have `utm_source=facebook` or `utm_source=instagram`
2. Verify the filtering logic in `EmailCampaignsView.tsx` (line 28)
3. Campaigns are excluded if utm_source matches: facebook, instagram, fb, ig

## Future Enhancements

Potential improvements to the tracking system:

1. **A/B Testing**: Track multiple variations of the same email
2. **Email Platform Integration**: Auto-sync with Beehiiv API
3. **Revenue Attribution**: Track which campaigns lead to purchases
4. **Cohort Analysis**: Compare performance across different audience segments
5. **Automated Reporting**: Weekly email summaries of campaign performance
6. **Conversion Funnel**: Track Email Click → Quiz View → Quiz Start → Quiz Complete → Email Submit → Purchase

## Support

For questions or issues with cold email tracking:

1. Check this documentation first
2. Review the code in `/src/lib/services/quiz.ts`
3. Inspect the database tables in Supabase
4. Review the dashboard components in `/src/components/admin/tracking/`

---

**Last Updated**: 2025-10-19
**Version**: 1.0.0
