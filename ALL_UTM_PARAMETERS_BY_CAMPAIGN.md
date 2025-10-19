# Complete UTM Parameters List - All Campaigns

**Generated:** 2025-10-19
**Source:** Notion Email Templates

---

## 📧 Campaign Type 1: Cold Email Campaigns (Quiz Invitations)

**Purpose:** Drive traffic to quiz page from cold leads
**Landing Page:** `https://daily-hush.com/quiz`

### Email 1: Quiz Invitation

| Parameter | Value |
|-----------|-------|
| **utm_source** | `google_sheet_invite` |
| **utm_medium** | `email` |
| **utm_campaign** | `quiz_invite` |
| **utm_term** | _(not used)_ |
| **utm_content** | _(not used)_ |

**Full URL:**
```
https://daily-hush.com/quiz?utm_source=google_sheet_invite&utm_medium=email&utm_campaign=quiz_invite
```

**🔴 ISSUE:** Using `google_sheet_invite` as source instead of `email`

---

### Email 2: Brain Science

| Parameter | Value |
|-----------|-------|
| **utm_source** | `email_sequence` |
| **utm_medium** | `email` |
| **utm_campaign** | `email_2` |
| **utm_term** | _(not used)_ |
| **utm_content** | _(not used)_ |

**Full URL:**
```
https://daily-hush.com/quiz?utm_source=email_sequence&utm_medium=email&utm_campaign=email_2
```

**🔴 ISSUE:** Using `email_sequence` as source instead of `email`

---

### Email 3: Four Patterns

| Parameter | Value |
|-----------|-------|
| **utm_source** | `email_sequence` _(assumed based on pattern)_ |
| **utm_medium** | `email` _(assumed based on pattern)_ |
| **utm_campaign** | `email_3` |
| **utm_term** | _(not used)_ |
| **utm_content** | _(not used)_ |

**Expected Full URL:**
```
https://daily-hush.com/quiz?utm_source=email_sequence&utm_medium=email&utm_campaign=email_3
```

**🔴 ISSUE:** Using `email_sequence` as source instead of `email`

---

### Email 4: Social Proof

| Parameter | Value |
|-----------|-------|
| **utm_source** | `email_sequence` |
| **utm_medium** | `email` |
| **utm_campaign** | `email_4` |
| **utm_term** | _(not used)_ |
| **utm_content** | _(not used)_ |

**Full URL:**
```
https://daily-hush.com/quiz?utm_source=email_sequence&utm_medium=email&utm_campaign=email_4
```

**🔴 ISSUE:** Using `email_sequence` as source instead of `email`

---

### Email 5: Final Call

| Parameter | Value |
|-----------|-------|
| **utm_source** | `email_sequence` _(assumed based on pattern)_ |
| **utm_medium** | `email` _(assumed based on pattern)_ |
| **utm_campaign** | `email_5_final` |
| **utm_term** | _(not used)_ |
| **utm_content** | _(not used)_ |

**Expected Full URL:**
```
https://daily-hush.com/quiz?utm_source=email_sequence&utm_medium=email&utm_campaign=email_5_final
```

**🔴 ISSUE:** Using `email_sequence` as source instead of `email`

---

## 📧 Campaign Type 2: Post-Quiz Retargeting Emails (Product Promotion)

**Purpose:** Drive quiz-takers to product page
**Landing Page:** `https://daily-hush.com/product/fire-starter`

### Day 0: Instant Quiz Confirmation

| Parameter | Value |
|-----------|-------|
| **utm_source** | `email` |
| **utm_medium** | `retargeting` |
| **utm_campaign** | `quiz-retargeting` |
| **utm_term** | _(not used)_ |
| **utm_content** | `day-0` |
| **email** | `{{EMAIL}}` _(dynamic personalization)_ |

**Full URL:**
```
https://daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-0&email={{EMAIL}}
```

**✅ CORRECT:** Proper structure

---

### Day 1: Follow-up

| Parameter | Value |
|-----------|-------|
| **utm_source** | `email` |
| **utm_medium** | `retargeting` |
| **utm_campaign** | `quiz-retargeting` |
| **utm_term** | _(not used)_ |
| **utm_content** | `day-1` |
| **email** | `{{EMAIL}}` _(dynamic personalization)_ |

**Full URL:**
```
https://daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-1&email={{EMAIL}}
```

**✅ CORRECT:** Proper structure

---

### Day 3: Urgency (4 Days Left)

| Parameter | Value |
|-----------|-------|
| **utm_source** | `email` |
| **utm_medium** | `retargeting` |
| **utm_campaign** | `quiz-retargeting` |
| **utm_term** | _(not used)_ |
| **utm_content** | `day-3` |
| **email** | `{{EMAIL}}` _(dynamic personalization)_ |

**Full URL:**
```
https://daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-3&email={{EMAIL}}
```

**✅ CORRECT:** Proper structure

---

### Day 5: Strong Urgency (2 Days Left)

| Parameter | Value |
|-----------|-------|
| **utm_source** | `email` |
| **utm_medium** | `retargeting` |
| **utm_campaign** | `quiz-retargeting` |
| **utm_term** | _(not used)_ |
| **utm_content** | `day-5` |
| **email** | `{{EMAIL}}` _(dynamic personalization)_ |

**Full URL:**
```
https://daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-5&email={{EMAIL}}
```

**✅ CORRECT:** Proper structure

---

### Day 7: Final Urgency (Final Hours)

| Parameter | Value |
|-----------|-------|
| **utm_source** | `email` |
| **utm_medium** | `retargeting` |
| **utm_campaign** | `quiz-retargeting` |
| **utm_term** | _(not used)_ |
| **utm_content** | `day-7` |
| **email** | `{{EMAIL}}` _(dynamic personalization)_ |

**Full URL:**
```
https://daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-7&email={{EMAIL}}
```

**✅ CORRECT:** Proper structure

---

## 🎯 Campaign Type 3: Facebook/Instagram Ads

**Purpose:** Paid social traffic to quiz or product page
**Landing Page:** TBD (likely quiz page for cold traffic)

### Status

**⚠️ NO UTM PARAMETERS FOUND**

The Facebook Ads Playbook exists in Notion but **does not include specific UTM parameter structure**.

**Recommendation:** Add UTM parameters to Facebook ads:

#### For Quiz Ads (Cold Traffic):
```
utm_source=facebook&utm_medium=paid_social&utm_campaign=quiz_acquisition&utm_content={ad_creative_id}
```

OR

```
utm_source=instagram&utm_medium=paid_social&utm_campaign=quiz_acquisition&utm_content={ad_creative_id}
```

#### For Product Retargeting Ads:
```
utm_source=facebook&utm_medium=retargeting&utm_campaign=product_retargeting&utm_content={ad_creative_id}
```

**Note:** Facebook ads currently tracked by `utm_source` being set automatically to `facebook` or `instagram` by the platform, which is why they're being filtered out correctly from email analytics.

---

## 📊 Summary by Campaign Type

### Cold Email Campaigns (Quiz Traffic)

| Campaign | utm_source | utm_medium | utm_campaign | utm_content | Status |
|----------|------------|------------|--------------|-------------|--------|
| Quiz Invite | `google_sheet_invite` | `email` | `quiz_invite` | - | ❌ Wrong source |
| Email 2 | `email_sequence` | `email` | `email_2` | - | ❌ Wrong source |
| Email 3 | `email_sequence` | `email` | `email_3` | - | ❌ Wrong source |
| Email 4 | `email_sequence` | `email` | `email_4` | - | ❌ Wrong source |
| Email 5 | `email_sequence` | `email` | `email_5_final` | - | ❌ Wrong source |

**🔴 CRITICAL ISSUE:**
All cold emails use wrong `utm_source` values. Should be `utm_source=email` for proper tracking.

---

### Retargeting Email Campaigns (Product Traffic)

| Campaign | utm_source | utm_medium | utm_campaign | utm_content | email param | Status |
|----------|------------|------------|--------------|-------------|-------------|--------|
| Day 0 | `email` | `retargeting` | `quiz-retargeting` | `day-0` | `{{EMAIL}}` | ✅ Perfect |
| Day 1 | `email` | `retargeting` | `quiz-retargeting` | `day-1` | `{{EMAIL}}` | ✅ Perfect |
| Day 3 | `email` | `retargeting` | `quiz-retargeting` | `day-3` | `{{EMAIL}}` | ✅ Perfect |
| Day 5 | `email` | `retargeting` | `quiz-retargeting` | `day-5` | `{{EMAIL}}` | ✅ Perfect |
| Day 7 | `email` | `retargeting` | `quiz-retargeting` | `day-7` | `{{EMAIL}}` | ✅ Perfect |

**✅ ALL CORRECT:**
Retargeting emails have perfect UTM structure + email personalization parameter.

---

### Facebook/Instagram Ads

| Campaign | Status |
|----------|--------|
| All ads | ⚠️ UTM parameters not defined in Notion playbook |

**Recommendation:** Define UTM structure for Facebook ads when campaigns launch.

---

## 🎯 Recommended UTM Parameter Standards

### Standard Structure

```
https://[landing-page]?utm_source=[source]&utm_medium=[medium]&utm_campaign=[campaign]&utm_content=[content]&utm_term=[term]
```

### Source Values (utm_source)

| Value | Usage |
|-------|-------|
| `email` | All email campaigns (cold + retargeting) |
| `facebook` | Facebook ads |
| `instagram` | Instagram ads |
| `google` | Google ads (if used) |
| `organic` | Organic social posts |
| `direct` | Direct traffic |

**❌ DO NOT USE:**
- `email_sequence` (too specific)
- `google_sheet_invite` (too specific)
- Use `utm_campaign` to distinguish campaign types instead

---

### Medium Values (utm_medium)

| Value | Usage |
|-------|-------|
| `email` | Cold email outreach |
| `retargeting` | Post-action retargeting emails |
| `paid_social` | Facebook/Instagram paid ads |
| `organic_social` | Organic social posts |
| `referral` | Referral traffic |

---

### Campaign Values (utm_campaign)

**For Cold Emails:**
- `quiz_invite` - Generic quiz invitation
- `email_2` - Specific email in sequence
- `email_3` - Specific email in sequence
- `email_4` - Specific email in sequence
- `email_5_final` - Final email in sequence

**For Retargeting:**
- `quiz-retargeting` - All post-quiz retargeting emails
- Use `utm_content` to distinguish days (day-0, day-1, etc.)

**For Facebook Ads:**
- `quiz_acquisition` - Cold traffic to quiz
- `product_retargeting` - Retargeting to product page
- Use `utm_content` for creative ID or variation

---

### Content Values (utm_content)

**For Retargeting Emails:**
- `day-0` - Sent immediately after quiz
- `day-1` - Sent 1 day after quiz
- `day-3` - Sent 3 days after quiz
- `day-5` - Sent 5 days after quiz
- `day-7` - Sent 7 days after quiz (final)

**For Facebook Ads:**
- `{ad_creative_id}` - Use Facebook's dynamic parameter
- `variation-a` - Manual A/B test tracking
- `video-hook-1` - Creative type tracking

---

### Term Values (utm_term)

**Currently not used in any campaigns.**

**Future use cases:**
- A/B test variations
- Audience segments
- Keyword targeting (for search ads)

---

## 🔧 Required Fixes

### 1. Update Cold Email URLs

**Change FROM:**
```
utm_source=email_sequence&utm_medium=email&utm_campaign=email_2
```

**Change TO:**
```
utm_source=email&utm_medium=cold_email&utm_campaign=email_2
```

OR (simpler):
```
utm_source=email&utm_medium=email&utm_campaign=email_2
```

### 2. Update Quiz Invite Email

**Change FROM:**
```
utm_source=google_sheet_invite&utm_medium=email&utm_campaign=quiz_invite
```

**Change TO:**
```
utm_source=email&utm_medium=email&utm_campaign=quiz_invite
```

### 3. Add UTM Parameters to Facebook Ads

**Example for Quiz Ad:**
```
https://daily-hush.com/quiz?utm_source=facebook&utm_medium=paid_social&utm_campaign=quiz_acquisition&utm_content=video-hook-1
```

**Example for Product Retargeting Ad:**
```
https://daily-hush.com/product/fire-starter?utm_source=facebook&utm_medium=retargeting&utm_campaign=product_retargeting&utm_content=carousel-v2
```

---

## 📋 Campaign Tracking Matrix

### How Each Campaign is Tracked

| Campaign Type | Destination | Database Table | Key Fields | Analytics View |
|---------------|-------------|----------------|------------|----------------|
| Cold Email | Quiz Page | `quiz_sessions` | utm_source, utm_campaign | Email Campaigns, Quiz Analytics |
| Retargeting Email | Product Page | `product_page_sessions` | utm_source, utm_campaign, utm_content, email | Product Page _(needs retargeting view)_ |
| Facebook Ads | Quiz/Product | `quiz_sessions` or `product_page_sessions` | utm_source=facebook/instagram | Currently filtered out |

---

## 🔍 Testing URLs

Use these URLs to test tracking:

### Test Cold Email Tracking:
```
https://daily-hush.com/quiz?utm_source=email&utm_medium=email&utm_campaign=email_test
```

### Test Retargeting Email Tracking:
```
https://daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-0-test&email=test@example.com
```

### Test Facebook Ad Tracking:
```
https://daily-hush.com/quiz?utm_source=facebook&utm_medium=paid_social&utm_campaign=quiz_test&utm_content=test-creative
```

---

## 📈 Expected Campaign Flow

### Cold Email Journey:
```
Email Send (Beehiiv)
  ↓
User clicks link with UTM parameters
  ↓
Lands on daily-hush.com/quiz?utm_source=email&utm_medium=email&utm_campaign=email_2
  ↓
quiz_sessions table records:
  - utm_source: "email"
  - utm_medium: "email"
  - utm_campaign: "email_2"
  ↓
User completes quiz
  ↓
Dashboard shows campaign "email_2" in Email Campaigns tab
```

### Retargeting Email Journey:
```
Email Send (Beehiiv) with personalized link
  ↓
User clicks link with UTM + email parameter
  ↓
Lands on daily-hush.com/product/fire-starter?utm_source=email&utm_medium=retargeting&utm_campaign=quiz-retargeting&utm_content=day-1&email=user@example.com
  ↓
product_page_sessions table records:
  - utm_source: "email"
  - utm_medium: "retargeting"
  - utm_campaign: "quiz-retargeting"
  - utm_content: "day-1"
  - email: "user@example.com"
  ↓
User clicks buy button
  ↓
product_page_events records "buy_button_click"
  ↓
Dashboard shows performance by day (day-0, day-1, etc.)
```

---

## 🎯 Next Steps

1. **Update all cold email templates in Notion** - Change `utm_source` to `email`
2. **Define Facebook ad UTM structure** - Before launching ads
3. **Create retargeting email analytics view** - Show performance by day-0 through day-7
4. **Test updated URLs** - Verify tracking works correctly
5. **Document in onboarding** - Add to team documentation

---

**Total Campaigns Inventoried:** 10 email campaigns
**Campaigns with Correct UTM:** 5 retargeting emails (50%)
**Campaigns Needing Fixes:** 5 cold emails (50%)
**Missing UTM Definitions:** Facebook/Instagram ads
