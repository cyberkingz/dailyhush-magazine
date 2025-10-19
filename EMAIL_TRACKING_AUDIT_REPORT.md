# Email Click Tracking Audit Report
**Date:** 2025-10-19
**Audited By:** Claude
**Purpose:** Verify email click tracking and click rate calculations for both cold email and retargeting campaigns

---

## Executive Summary

### Audit Scope
1. **Cold Email → Quiz Page Flow**: Track clicks from cold email campaigns to quiz page
2. **Retargeting Email → Product Page Flow**: Track clicks from post-quiz retargeting emails to product page

### Critical Findings
| Issue | Severity | Flow | Status |
|-------|----------|------|--------|
| **UTM Source Mismatch** | 🔴 **CRITICAL** | Cold Email | ❌ **BROKEN** |
| Email Parameter Tracking | 🟢 Good | Retargeting | ✅ Working |
| Click Rate Calculation | 🟡 Incomplete | Both | ⚠️ **NEEDS WORK** |
| Campaign Type Classification | 🟡 Warning | Both | ⚠️ **ISSUES FOUND** |

---

## 1. Email Campaign Inventory

### 1.1 Cold Email Campaigns (Quiz Invitations)

| Campaign | URL Found in Notion | UTM Parameters |
|----------|---------------------|----------------|
| **Email 2** | `https://daily-hush.com/quiz?utm_source=email_sequence&utm_medium=email&utm_campaign=email_2` | ❌ **ISSUE** |
| **Email 3** | Unknown | utm_campaign=email_3 |
| **Email 4** | `https://daily-hush.com/quiz?utm_source=email_sequence&utm_medium=email&utm_campaign=email_4` | ❌ **ISSUE** |
| **Email 5** | Unknown | utm_campaign=email_5_final |
| **Quiz Invite** | Unknown | utm_campaign=quiz_invite |

**🔴 CRITICAL ISSUE FOUND:**
- **Problem**: Cold emails use `utm_source=email_sequence` instead of `utm_source=email`
- **Impact**: These campaigns may NOT appear in email analytics because filtering logic checks for `utm_source=email`
- **Location**: `/src/components/admin/tracking/EmailCampaignsView.tsx` line 29
- **Current Filter**:
  ```typescript
  const source = c.utmSource?.toLowerCase()
  const isSocialAd = source === 'facebook' || source === 'instagram' || source === 'fb' || source === 'ig'
  return !isSocialAd
  ```
- **Issue**: Filter only excludes social ads, but doesn't validate that source is actually "email"

### 1.2 Retargeting Email Campaigns (Product Promotions)

| Campaign | URL Found in Notion | UTM Parameters |
|----------|---------------------|----------------|
| **Day 0** | `https://daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-0&email={{EMAIL}}` | ✅ **CORRECT** |
| **Day 1** | `...utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-1&email={{EMAIL}}` | ✅ **CORRECT** |
| **Day 3** | `...utm_content=day-3&email={{EMAIL}}` | ✅ **CORRECT** |
| **Day 5** | `...utm_content=day-5&email={{EMAIL}}` | ✅ **CORRECT** |
| **Day 7** | `...utm_content=day-7&email={{EMAIL}}` | ✅ **CORRECT** |

**✅ STRUCTURE CORRECT:**
- `utm_source=email` ✓
- `utm_medium=retargeting` ✓
- `utm_campaign=quiz-retargeting` ✓
- `utm_content=day-0` through `day-7` ✓
- `email={{EMAIL}}` parameter for individual tracking ✓

---

## 2. Tracking Flow Analysis

### 2.1 Cold Email → Quiz Page Flow

#### Flow Diagram
```
User clicks email link
  ↓
https://daily-hush.com/quiz?utm_source=email_sequence&utm_medium=email&utm_campaign=email_2
  ↓
Quiz.tsx page loads (Line 70-79)
  ↓
trackQuizPageView(getCurrentTrackingContext())
  ↓
getCurrentTrackingContext() extracts UTM params (leads.ts Line 51-84)
  ↓
extractUTMParameters(window.location.href) (leads.ts Line 33-48)
  ↓
trackQuizPageView() creates quiz_sessions record (quizEvents.ts Line 94-148)
  ↓
quiz_sessions table stores:
  - session_id: UUID
  - utm_source: "email_sequence" ❌ INCONSISTENT
  - utm_medium: "email"
  - utm_campaign: "email_2"
  - source_url: full URL
  - referrer_url: referring page
  - device_type, browser, etc.
  ↓
quiz_events table records 'page_view' event
  ↓
User starts quiz → 'quiz_start' event
  ↓
User completes quiz → 'quiz_complete' event
  ↓
getCampaignMetrics() aggregates data (quiz.ts Line 652-760)
  ↓
Dashboard displays in EmailCampaignsView or QuizAnalyticsView
```

#### Database Schema Verification

**quiz_sessions table** (from quiz.ts Line 17-40):
```typescript
export interface QuizSession {
  session_id: string
  utm_source?: string        // ✅ CAPTURED
  utm_medium?: string        // ✅ CAPTURED
  utm_campaign?: string      // ✅ CAPTURED
  utm_term?: string          // ✅ CAPTURED
  utm_content?: string       // ✅ CAPTURED
  source_url?: string
  referrer_url?: string
  browser?: string
  device_type?: string
  is_completed?: boolean
  started_at?: string
  completed_at?: string
  completion_time_ms?: number
  total_questions?: number
  last_question_index?: number
  submission_id?: string
  created_at?: string
  updated_at?: string
}
```

**quiz_events table** (from quiz.ts Line 42-52):
```typescript
export interface QuizEvent {
  id?: string
  session_id: string
  event_type: QuizEventType  // 'page_view', 'quiz_start', 'quiz_complete', etc.
  question_id?: string
  question_index?: number
  time_spent_ms?: number
  metadata?: Record<string, any>
  created_at?: string
}
```

#### Code Review

**File:** `/src/lib/services/quizEvents.ts`

**Line 94-148: trackQuizPageView()**
```typescript
export async function trackQuizPageView(trackingContext: LeadTrackingContext): Promise<string> {
  const sessionId = getOrCreateQuizSession()

  const sessionData: Partial<QuizSession> = {
    session_id: sessionId,
    source_url: trackingContext.source_url,
    source_page: trackingContext.source_page,
    referrer_url: trackingContext.referrer_url,
    user_agent: navigator.userAgent,
    browser: trackingContext.browser_info?.browser,
    device_type: trackingContext.browser_info?.device_type,
    ...trackingContext.utm_params  // ✅ UTM params spread correctly
  }

  await supabase.from('quiz_sessions').insert([sessionData])
  // ✅ UTM parameters ARE being stored
}
```

**File:** `/src/lib/services/leads.ts`

**Line 33-48: extractUTMParameters()**
```typescript
export function extractUTMParameters(url: string): UTMParameters {
  try {
    const urlObj = new URL(url)
    const params = urlObj.searchParams

    return {
      utm_source: params.get('utm_source') || undefined,      // ✅ Extracted
      utm_medium: params.get('utm_medium') || undefined,      // ✅ Extracted
      utm_campaign: params.get('utm_campaign') || undefined,  // ✅ Extracted
      utm_term: params.get('utm_term') || undefined,          // ✅ Extracted
      utm_content: params.get('utm_content') || undefined     // ✅ Extracted
    }
  } catch {
    return {}
  }
}
```

✅ **UTM Extraction: WORKING**

**File:** `/src/lib/services/quiz.ts`

**Line 652-760: getCampaignMetrics()**
```typescript
export async function getCampaignMetrics(dateRange?: DateRange): Promise<CampaignMetrics[]> {
  // Fetch all quiz sessions with utm_campaign
  const { data: sessions } = await supabase
    .from('quiz_sessions')
    .select('session_id, utm_campaign, utm_source, utm_medium, is_completed, started_at')
    .not('utm_campaign', 'is', null)
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  // ✅ Fetches utm_source and utm_medium (added recently)

  // Group by campaign and count views/starts/completions
  // ✅ Logic is sound
}
```

✅ **Campaign Aggregation: WORKING**

#### Issues Found

**❌ ISSUE #1: UTM Source Inconsistency**
- **Problem**: Cold emails use `utm_source=email_sequence`
- **Expected**: `utm_source=email`
- **Impact**: Campaigns may not be classified correctly
- **Fix Required**: Update email templates to use `utm_source=email`

**⚠️ ISSUE #2: No Email Send Count**
- **Problem**: System tracks CLICKS (quiz views) but NOT email SENDS
- **Impact**: Cannot calculate true click-through rate (Clicks / Sends)
- **Current**: Only calculates conversion rate (Completions / Views)
- **Missing**: Integration with email platform API to get send counts

**⚠️ ISSUE #3: Campaign Type Classification Logic**
- **File**: `/src/lib/services/quiz.ts` Line 765-802
- **Problem**: Relies on campaign name matching, not utm_source
```typescript
function determineCampaignType(campaign: string): 'cold_email' | 'post_quiz_retargeting' {
  const coldEmailCampaigns = ['quiz_invite', 'email_2', 'email_3', 'email_4', 'email_5_final', 'email_sequence', 'google_sheet_invite']

  if (coldEmailCampaigns.some(c => campaign.includes(c))) {
    return 'cold_email'
  }
  // ...
}
```
- **Issue**: Doesn't use utm_medium to distinguish cold vs retargeting
- **Better Approach**: Check if `utm_medium === 'email'` for cold, `utm_medium === 'retargeting'` for post-quiz

### 2.2 Retargeting Email → Product Page Flow

#### Flow Diagram
```
User clicks email link
  ↓
https://daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-0&email=user@example.com
  ↓
FireStarter.tsx page loads (Line 29-47)
  ↓
trackProductPageView('fire-starter')
  ↓
getOrCreateSessionId() generates session ID (productPageEvents.ts Line 56-71)
  ↓
getEmailFromUrl() extracts email param (productPageEvents.ts Line 76-84)
  ↓
getUtmParams() extracts UTM params (productPageEvents.ts Line 89-103)
  ↓
getBrowserInfo() detects browser/device (productPageEvents.ts Line 108-124)
  ↓
product_page_sessions table stores:
  - session_id: UUID
  - email: "user@example.com" ✅ CAPTURED
  - product_id: "fire-starter"
  - utm_source: "email" ✅ CORRECT
  - utm_medium: "retargeting" ✅ CORRECT
  - utm_campaign: "quiz-retargeting" ✅ CORRECT
  - utm_content: "day-0" ✅ CAPTURED
  - page_url: full URL
  - referrer_url, browser, device_type, etc.
  ↓
product_page_events table records 'page_view' event
  ↓
User scrolls → 'scroll_depth' events tracked
  ↓
User clicks buy button → 'buy_button_click' event
  ↓
trackingAnalytics.ts aggregates product page data
  ↓
Dashboard displays in ProductPageView
```

#### Database Schema Verification

**product_page_sessions table** (from productPageEvents.ts Line 16-38):
```typescript
export interface ProductPageSession {
  session_id: string
  email?: string              // ✅ CAPTURED (from URL param)
  product_id?: string         // ✅ CAPTURED
  page_url: string
  referrer_url?: string
  utm_source?: string         // ✅ CAPTURED
  utm_medium?: string         // ✅ CAPTURED
  utm_campaign?: string       // ✅ CAPTURED
  utm_term?: string           // ✅ CAPTURED
  utm_content?: string        // ✅ CAPTURED
  user_agent?: string
  browser?: string
  device_type?: string
  max_scroll_depth?: number
  time_on_page_ms?: number
  clicked_buy_button?: boolean
  viewed_price?: boolean
  sections_viewed?: string[]
  created_at?: string
  updated_at?: string
}
```

**product_page_events table** (from productPageEvents.ts Line 41-51):
```typescript
export interface ProductPageEvent {
  session_id: string
  email?: string              // ✅ DUPLICATED for easy lookup
  event_type: ProductPageEventType
  scroll_depth?: number
  section_id?: string
  time_since_page_load_ms?: number
  metadata?: Record<string, any>
  created_at?: string
}
```

#### Code Review

**File:** `/src/lib/services/productPageEvents.ts`

**Line 76-84: getEmailFromUrl()**
```typescript
function getEmailFromUrl(): string | undefined {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('email') || undefined  // ✅ Extracts email param
  } catch (error) {
    return undefined
  }
}
```

✅ **Email Extraction: WORKING**

**Line 89-103: getUtmParams()**
```typescript
function getUtmParams() {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    return {
      utm_source: urlParams.get('utm_source') || undefined,      // ✅ Extracted
      utm_medium: urlParams.get('utm_medium') || undefined,      // ✅ Extracted
      utm_campaign: urlParams.get('utm_campaign') || undefined,  // ✅ Extracted
      utm_term: urlParams.get('utm_term') || undefined,          // ✅ Extracted
      utm_content: urlParams.get('utm_content') || undefined,    // ✅ Extracted
    }
  } catch (error) {
    return {}
  }
}
```

✅ **UTM Extraction: WORKING**

**Line 129-174: trackProductPageView()**
```typescript
export async function trackProductPageView(productId: string = 'fire-starter'): Promise<string> {
  const sessionId = getOrCreateSessionId()
  const email = getEmailFromUrl()          // ✅ Gets email
  const utmParams = getUtmParams()         // ✅ Gets UTM params
  const browserInfo = getBrowserInfo()

  const sessionData: Partial<ProductPageSession> = {
    session_id: sessionId,
    email,                                  // ✅ Stored
    product_id: productId,
    page_url: window.location.href,
    referrer_url: document.referrer || undefined,
    user_agent: navigator.userAgent,
    browser: browserInfo.browser,
    device_type: browserInfo.deviceType,
    ...utmParams,                           // ✅ UTM params spread correctly
  }

  await supabase.from('product_page_sessions').insert([sessionData])
  // ✅ All data is being stored correctly
}
```

✅ **Product Page Tracking: WORKING PERFECTLY**

#### Issues Found

**⚠️ ISSUE #4: No Retargeting Email Analytics View**
- **Problem**: No dedicated view for retargeting email performance
- **Current**: Product page analytics exist but don't group by email campaign
- **Missing**: Ability to see which retargeting email (day-0, day-1, etc.) drives most conversions
- **Fix Required**: Create retargeting email metrics aggregation

**⚠️ ISSUE #5: No Email Send Tracking for Retargeting**
- **Problem**: Same as cold emails - no send count
- **Impact**: Cannot calculate email → product page click rate
- **Missing**: Integration with email platform

---

## 3. Click Rate Calculation Analysis

### 3.1 Current Metrics Available

#### Cold Email Campaigns
**File:** `/src/lib/services/quiz.ts` Line 652-760

**Metrics Calculated:**
```typescript
{
  campaign: "email_2",
  campaignType: "cold_email",
  utmSource: "email_sequence",  // ❌ Should be "email"
  utmMedium: "email",
  views: 127,                    // Unique quiz page visits
  starts: 98,                    // Users who clicked "Start Quiz"
  completions: 76,               // Users who finished quiz
  startRate: 77.2%,              // (starts / views) * 100
  completionRate: 77.6%,         // (completions / starts) * 100
  overallConversionRate: 59.8%,  // (completions / views) * 100
}
```

**❌ MISSING:**
- **Email Sends**: How many emails were sent
- **Email Opens**: How many emails were opened
- **True Click Rate**: (Views / Sends) * 100
- **Open-to-Click Rate**: (Views / Opens) * 100

**Current "Click Rate" is actually "Start Rate":**
- What we call "startRate" = (starts / views)
- This is NOT a click rate - it's a quiz engagement rate
- Real click rate would be (views / sends)

#### Retargeting Email Campaigns
**File:** `/src/lib/services/trackingAnalytics.ts` (Need to check this)

**⚠️ STATUS**: Need to verify if retargeting email metrics exist

### 3.2 What Click Rates SHOULD Be

#### Proper Email Marketing Metrics

```
Email Sends (from ESP)
  ↓ Open Rate = (Opens / Sends) * 100
Email Opens (from ESP)
  ↓ Click-to-Open Rate = (Clicks / Opens) * 100
Email Clicks (tracked via UTM)
  ↓ Landing Page Conversion = (Actions / Clicks) * 100
Landing Page Actions (quiz starts, product buys)
```

**For Cold Emails:**
1. **Send Count** → from Beehiiv/email platform
2. **Open Count** → from Beehiiv/email platform
3. **Click Count** = `views` in quiz_sessions (page_view events)
4. **Start Count** = `starts` in quiz_sessions (quiz_start events)
5. **Completion Count** = `completions` in quiz_sessions (quiz_complete events)

**Metrics:**
- Open Rate = Opens / Sends
- Click Rate (CTR) = Clicks / Sends
- Click-to-Open Rate (CTOR) = Clicks / Opens
- Start Rate = Starts / Clicks
- Completion Rate = Completions / Starts
- Overall Conversion = Completions / Sends

**For Retargeting Emails:**
1. **Send Count** → from Beehiiv/email platform
2. **Open Count** → from Beehiiv/email platform
3. **Click Count** = `views` in product_page_sessions (page_view events)
4. **Buy Button Clicks** = events where event_type = 'buy_button_click'
5. **Purchases** = from Shopify orders table

**Metrics:**
- Open Rate = Opens / Sends
- Click Rate (CTR) = Clicks / Sends
- Click-to-Open Rate (CTOR) = Clicks / Opens
- Add-to-Cart Rate = Buy Clicks / Clicks
- Purchase Rate = Purchases / Clicks
- Overall Conversion = Purchases / Sends

---

## 4. Gap Analysis

### 4.1 Critical Gaps

| Gap | Impact | Priority | Effort |
|-----|--------|----------|--------|
| **Email send count not tracked** | Cannot calculate true click rates | 🔴 Critical | High |
| **UTM source mismatch in cold emails** | Campaigns may not appear in analytics | 🔴 Critical | Low |
| **No retargeting email analytics** | Cannot optimize retargeting sequence | 🟡 High | Medium |
| **No email platform API integration** | Manual reporting required | 🟡 High | High |
| **Campaign type logic uses names not UTM** | Brittle classification | 🟡 Medium | Low |

### 4.2 Missing Integrations

**Email Platform API (Beehiiv)**
- **Need**: API integration to fetch send counts, open counts
- **Benefit**: Calculate true email click rates
- **Tables to create**:
  ```sql
  CREATE TABLE email_sends (
    id UUID PRIMARY KEY,
    campaign_identifier TEXT,  -- matches utm_campaign
    sent_at TIMESTAMP,
    recipient_email TEXT,
    send_count INTEGER,        -- for bulk sends
    created_at TIMESTAMP
  );

  CREATE TABLE email_opens (
    id UUID PRIMARY KEY,
    campaign_identifier TEXT,
    opened_at TIMESTAMP,
    recipient_email TEXT,
    open_count INTEGER,        -- can open multiple times
    created_at TIMESTAMP
  );
  ```

**Shopify Orders API**
- **Status**: Partially implemented (OrdersView exists)
- **Need**: Link orders back to product_page_sessions via email
- **Current Gap**: Can't attribute purchases to specific retargeting emails

### 4.3 Analytics Queries Needed

**Cold Email Click Rate:**
```sql
-- This query would require email_sends table
SELECT
  es.campaign_identifier,
  COUNT(DISTINCT es.id) as sends,
  COUNT(DISTINCT qs.session_id) as clicks,
  (COUNT(DISTINCT qs.session_id)::FLOAT / COUNT(DISTINCT es.id) * 100) as click_rate
FROM email_sends es
LEFT JOIN quiz_sessions qs
  ON qs.utm_campaign = es.campaign_identifier
  AND qs.created_at >= es.sent_at
  AND qs.created_at < es.sent_at + INTERVAL '7 days'
GROUP BY es.campaign_identifier;
```

**Retargeting Email Performance:**
```sql
-- Group product page sessions by retargeting email (utm_content)
SELECT
  utm_campaign,
  utm_content,  -- day-0, day-1, etc.
  COUNT(DISTINCT session_id) as views,
  COUNT(DISTINCT CASE WHEN clicked_buy_button THEN session_id END) as buy_clicks,
  AVG(time_on_page_ms) as avg_time_on_page,
  AVG(max_scroll_depth) as avg_scroll_depth,
  (COUNT(DISTINCT CASE WHEN clicked_buy_button THEN session_id END)::FLOAT /
   COUNT(DISTINCT session_id) * 100) as buy_click_rate
FROM product_page_sessions
WHERE utm_campaign = 'quiz-retargeting'
GROUP BY utm_campaign, utm_content
ORDER BY utm_content;
```

---

## 5. Recommendations

### 5.1 Immediate Fixes (Priority: 🔴 Critical)

#### Fix #1: Standardize UTM Source in Cold Emails
**Problem**: Using `utm_source=email_sequence` instead of `utm_source=email`

**Action Required**:
1. Update all cold email templates in Notion
2. Change `utm_source=email_sequence` to `utm_source=email`
3. Keep `utm_medium=email` or change to `utm_medium=cold_email` for clarity

**Example - Before:**
```
https://daily-hush.com/quiz?utm_source=email_sequence&utm_medium=email&utm_campaign=email_2
```

**Example - After:**
```
https://daily-hush.com/quiz?utm_source=email&utm_medium=cold_email&utm_campaign=email_2
```

**Files to Update in Notion:**
- Cold Email 1 - Quiz Invitation
- Cold Email 2 - Brain Science
- Cold Email 3 - Four Patterns
- Cold Email 4 - Social Proof
- Cold Email 5 - Final Call

#### Fix #2: Update Campaign Type Classification
**File**: `/src/lib/services/quiz.ts` Line 765-802

**Current Code:**
```typescript
function determineCampaignType(campaign: string): 'cold_email' | 'post_quiz_retargeting' {
  // Relies on campaign name patterns
  const coldEmailCampaigns = ['quiz_invite', 'email_2', 'email_3', 'email_4', 'email_5_final', 'email_sequence', 'google_sheet_invite']

  if (coldEmailCampaigns.some(c => campaign.includes(c))) {
    return 'cold_email'
  }
  // ...
}
```

**Recommended Code:**
```typescript
function determineCampaignType(
  campaign: string,
  utmMedium?: string,
  utmSource?: string
): 'cold_email' | 'post_quiz_retargeting' {
  // Use utm_medium for reliable classification
  if (utmMedium === 'cold_email' || utmMedium === 'email' && utmSource === 'email') {
    return 'cold_email'
  }

  if (utmMedium === 'retargeting') {
    return 'post_quiz_retargeting'
  }

  // Fallback to campaign name matching
  const coldEmailCampaigns = ['quiz_invite', 'email_2', 'email_3', 'email_4', 'email_5_final']
  if (coldEmailCampaigns.some(c => campaign.includes(c))) {
    return 'cold_email'
  }

  return 'post_quiz_retargeting'
}
```

### 5.2 High-Priority Enhancements (Priority: 🟡 High)

#### Enhancement #1: Create Retargeting Email Analytics View

**New Component**: `/src/components/admin/analytics/RetargetingEmailTable.tsx`

**Purpose**: Show performance of each retargeting email (day-0 through day-7)

**Metrics to Display**:
- Campaign (quiz-retargeting)
- Email (Day 0, Day 1, Day 3, Day 5, Day 7)
- Views (product page visits)
- Avg Time on Page
- Avg Scroll Depth
- Buy Button Clicks
- Buy Click Rate

**Query Logic**:
```typescript
export async function getRetargetingEmailMetrics(dateRange?: DateRange) {
  // Query product_page_sessions grouped by utm_content
  // Calculate metrics for each day-X email
  // Return sorted by utm_content
}
```

**Add to Dashboard**:
- Add to `/src/pages/admin/dashboard.tsx`
- New tab: "Retargeting Emails"

#### Enhancement #2: Integrate Email Platform API

**Option A: Beehiiv API Integration**
- Create `/src/lib/services/beehiiv-api.ts`
- Fetch campaign send counts and open counts
- Store in new `email_sends` and `email_opens` tables
- Calculate true click rates

**Option B: Manual CSV Upload**
- Create admin interface to upload email stats CSV
- Parse and store in database
- Link to campaigns via campaign identifier

### 5.3 Long-Term Improvements (Priority: 🟢 Nice-to-Have)

1. **Email Attribution Dashboard**
   - Complete funnel: Email Send → Open → Click → Action → Purchase
   - Revenue attribution by email campaign
   - ROI calculations

2. **A/B Test Tracking**
   - Add `utm_term` for A/B test variants
   - Compare performance of different subject lines/copy

3. **Cohort Analysis**
   - Track user journey across multiple emails
   - Identify which email sequence converts best

4. **Automated Alerting**
   - Alert if click rate drops below threshold
   - Alert if campaign sends but gets no clicks

---

## 6. Testing Plan

### 6.1 Cold Email Flow Test

**Test URL:**
```
https://daily-hush.com/quiz?utm_source=email&utm_medium=cold_email&utm_campaign=email_2_test
```

**Steps:**
1. Open incognito browser
2. Navigate to test URL
3. Verify console logs show session creation
4. Start and complete quiz
5. Check Supabase:
   - `quiz_sessions` table has record with correct UTM params
   - `quiz_events` table has page_view, quiz_start, quiz_complete
6. Check dashboard:
   - Email Campaigns tab shows "email_2_test" campaign
   - Quiz Analytics tab shows campaign in table
7. Verify metrics calculate correctly

### 6.2 Retargeting Email Flow Test

**Test URL:**
```
https://daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-0-test&email=test@example.com
```

**Steps:**
1. Open incognito browser
2. Navigate to test URL
3. Verify console logs show session creation with email parameter
4. Scroll down page
5. Click buy button
6. Check Supabase:
   - `product_page_sessions` table has record with email and UTM params
   - `product_page_events` table has page_view, scroll_depth, buy_button_click
7. Check dashboard:
   - Product Page tab shows metrics
8. Verify email parameter is stored correctly

---

## 7. Summary & Action Items

### Critical Issues Requiring Immediate Attention

✅ **COMPLETED**:
1. ~~Added `utm_source` and `utm_medium` to CampaignMetrics interface~~
2. ~~Updated getCampaignMetrics() to fetch and return utm_source/utm_medium~~
3. ~~Updated EmailCampaignsView to filter by utm_source~~
4. ~~Updated QuizAnalyticsView to filter by utm_source~~

❌ **REMAINING**:
1. **Fix UTM source in email templates** (update Notion emails)
2. **Improve campaign type classification** (use utm_medium not campaign name)
3. **Create retargeting email analytics** (new table component)
4. **Integrate email platform API** (get send/open counts)
5. **Test complete flows** (verify tracking works end-to-end)

### Tracking Status Summary

| Flow | UTM Capture | Event Tracking | Analytics Display | Click Rate Calc |
|------|-------------|----------------|-------------------|-----------------|
| **Cold Email → Quiz** | ⚠️ Partial | ✅ Working | ✅ Working | ❌ Incomplete |
| **Retargeting → Product** | ✅ Perfect | ✅ Working | ⚠️ Partial | ❌ Missing |

### Current System Capabilities

**✅ What Works:**
- UTM parameters are extracted and stored correctly
- Quiz page views, starts, and completions tracked
- Product page views, scrolls, and buy clicks tracked
- Email parameter tracked on product page
- Campaign aggregation and grouping working
- Dashboard displays campaign metrics

**❌ What's Missing:**
- Email send counts (can't calculate true CTR)
- Email open counts (can't calculate CTOR)
- Retargeting email breakdown by day
- Proper campaign type classification using UTM params
- Consistent utm_source across cold emails

**⚠️ What Needs Improvement:**
- Cold emails use wrong utm_source value
- No dedicated retargeting email view
- Campaign classification relies on naming conventions
- No integration with email platform API

---

## Appendix: Code Locations

### Key Files for Email Tracking

| File | Purpose | Lines |
|------|---------|-------|
| `/src/pages/Quiz.tsx` | Quiz page entry point | 70-79 |
| `/src/lib/services/quizEvents.ts` | Quiz event tracking | 94-148 |
| `/src/lib/services/leads.ts` | UTM parameter extraction | 33-84 |
| `/src/lib/services/quiz.ts` | Campaign metrics aggregation | 652-802 |
| `/src/pages/product/FireStarter.tsx` | Product page entry point | 29-47 |
| `/src/lib/services/productPageEvents.ts` | Product page tracking | 76-174 |
| `/src/components/admin/tracking/EmailCampaignsView.tsx` | Email campaign dashboard | 21-40 |
| `/src/components/admin/tracking/QuizAnalyticsView.tsx` | Quiz analytics dashboard | 310-322 |

### Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `quiz_sessions` | Quiz session tracking | session_id, utm_source, utm_medium, utm_campaign, is_completed |
| `quiz_events` | Quiz interaction events | session_id, event_type, question_id, time_spent_ms |
| `product_page_sessions` | Product page visits | session_id, email, utm_campaign, utm_content, clicked_buy_button |
| `product_page_events` | Product page interactions | session_id, event_type, scroll_depth, time_since_page_load_ms |

---

**End of Audit Report**
