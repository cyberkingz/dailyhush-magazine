# Settings Page Deep Audit Report
**Date:** 2025-11-01
**Auditor:** Claude Code
**Scope:** Complete functionality audit of app/settings.tsx

---

## Executive Summary

The settings page has **3 critical non-functional features** that appear interactive but do nothing. This creates a poor UX where users think they can control settings but their actions have no effect.

### Critical Issues Found:
1. ✅ **Notifications Toggle** - Appears functional but doesn't save state
2. ✅ **Text Size Setting** - Shows value but can't be changed
3. ✅ **Contact Support** - Email link is not actionable

---

## Detailed Findings

### 1. 🔔 **Notifications Toggle** (CRITICAL)

**Location:** `app/settings.tsx:222-231`

**Current State:**
```tsx
<SettingRow
  title="Notifications"
  subtitle="Daily check-ins and reminders"
  icon={<Bell size={20} color="#52B788" strokeWidth={2} />}
  toggle
  toggleValue={true}  // ❌ HARDCODED - Always ON
  onToggle={(value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // ❌ NO STATE SAVE - Toggle does nothing
  }}
/>
```

**Issues:**
- Toggle is always `true` (hardcoded)
- Toggling only triggers haptics
- No state management
- No AsyncStorage/Supabase persistence
- User can toggle but it resets on remount

**Backend Availability:**
- ✅ Notification service exists (`services/notifications.ts`)
- ✅ Has `cancelAllNotifications()` function
- ✅ Has `scheduleDailyQuoteNotification()` function
- ❌ Missing user preference storage

**Impact:** **HIGH**
Users think they're disabling notifications but they continue receiving them.

---

### 2. 📝 **Text Size Setting** (CRITICAL)

**Location:** `app/settings.tsx:233-238`

**Current State:**
```tsx
<SettingRow
  title="Text Size"
  value="Large"  // ❌ HARDCODED
  icon={<Type size={20} color="#52B788" strokeWidth={2} />}
  onPress={() => Haptics.selectionAsync()}  // ❌ Only haptics
/>
```

**Issues:**
- Shows "Large" value (hardcoded)
- Clicking only triggers haptics
- No modal/sheet to change size
- No implementation of dynamic text sizing
- Text size never changes

**Backend Availability:**
- ❌ No text size service
- ❌ No text scaling system
- ❌ No context provider for font sizes

**Impact:** **MEDIUM**
Setting exists but is completely non-functional. Should either work or be removed.

---

### 3. 📧 **Contact Support** (MEDIUM)

**Location:** `app/settings.tsx:252-257`

**Current State:**
```tsx
<SettingRow
  title="Contact Support"
  subtitle="hello@noema.app"  // Shows email
  icon={<Mail size={20} color="#52B788" strokeWidth={2} />}
  onPress={() => Haptics.selectionAsync()}  // ❌ Only haptics
/>
```

**Issues:**
- Email is shown but not actionable
- Should open email client with pre-filled email
- Currently only triggers haptics

**Backend Availability:**
- ✅ Can use `Linking.openURL('mailto:hello@noema.app')`
- ✅ React Native Linking API available

**Impact:** **MEDIUM**
Users expect to tap and open email client. Currently does nothing.

---

## Working Features (For Reference)

### ✅ Functional Settings:
1. **Profile** - Opens profile screen
2. **Subscription** - Opens subscription management
3. **Sign Out** - Properly logs out user
4. **Delete Account** - Opens delete account flow
5. **Help & FAQs** - Opens FAQ screen
6. **Privacy Policy** - Opens privacy policy
7. **Terms of Service** - Opens terms screen

---

## Database Schema Gaps

### Current `user_profiles` Table Fields:
- `user_id`
- `email`
- `name`
- `age`
- `created_at`
- `updated_at`
- `quiz_*` fields
- `subscription_*` fields

### Missing Fields for Settings:
```sql
ALTER TABLE user_profiles
ADD COLUMN notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN text_size VARCHAR(20) DEFAULT 'medium',
ADD COLUMN last_notification_time TIMESTAMP;
```

---

## Fix Recommendations

### Priority 1: Notifications Toggle (Must Fix)

**Option A: Quick Fix (Remove Feature)**
- Remove the toggle from settings
- Keep notifications always on
- Remove confusion

**Option B: Proper Implementation (Recommended)**

1. **Add State Management:**
```tsx
const [notificationsEnabled, setNotificationsEnabled] = useState(true);

// Load from AsyncStorage on mount
useEffect(() => {
  loadNotificationPreference();
}, []);
```

2. **Add Persistence:**
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveNotificationPreference = async (enabled: boolean) => {
  await AsyncStorage.setItem('notifications_enabled', JSON.stringify(enabled));

  if (enabled) {
    await scheduleDailyQuoteNotification();
  } else {
    await cancelAllNotifications();
  }
};
```

3. **Update Toggle:**
```tsx
<SettingRow
  toggle
  toggleValue={notificationsEnabled}
  onToggle={async (value) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationsEnabled(value);
    await saveNotificationPreference(value);
  }}
/>
```

**Estimated Time:** 2 hours

---

### Priority 2: Contact Support (Quick Win)

**Implementation:**
```tsx
import { Linking, Alert } from 'react-native';

const openEmailClient = async () => {
  await Haptics.selectionAsync();

  const email = 'hello@noema.app';
  const subject = 'DailyHush Support Request';
  const body = `\n\n---\nApp Version: 1.0.0\nUser: ${user?.email || 'Guest'}`;

  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    Alert.alert(
      'Email Client Not Available',
      'Please email us at hello@noema.app',
      [{ text: 'OK' }]
    );
  }
};

<SettingRow
  title="Contact Support"
  subtitle="hello@noema.app"
  icon={<Mail size={20} color="#52B788" strokeWidth={2} />}
  onPress={openEmailClient}
/>
```

**Estimated Time:** 30 minutes

---

### Priority 3: Text Size Setting

**Option A: Remove (Recommended for MVP)**
- Remove the setting entirely
- Keep default text sizes
- Revisit in future version

**Option B: Full Implementation**

1. **Create Text Size Context:**
```tsx
// contexts/TextSizeContext.tsx
const TextSizeContext = createContext<{
  textSize: 'small' | 'medium' | 'large';
  setTextSize: (size: 'small' | 'medium' | 'large') => void;
}>();
```

2. **Create Text Size Modal:**
```tsx
// components/settings/TextSizeModal.tsx
// Radio button group with preview text
```

3. **Update All Text Components:**
```tsx
// components/ui/text.tsx
// Add dynamic sizing based on context
```

**Estimated Time:** 8-12 hours (significant refactor)

---

## Action Plan

### Immediate (This Sprint):
1. ✅ **Fix Contact Support** - 30 min
   - Implement mailto: link

2. ✅ **Fix Notifications Toggle** - 2 hours
   - Add AsyncStorage persistence
   - Wire up to notification service
   - Test enable/disable flow

### Short Term (Next Sprint):
3. ⚠️ **Decide on Text Size** - 0-12 hours
   - **Recommended:** Remove setting for now
   - **Alternative:** Full implementation

### Database Migration:
```sql
-- Run if keeping notifications toggle
ALTER TABLE user_profiles
ADD COLUMN notifications_enabled BOOLEAN DEFAULT true;
```

---

## Testing Checklist

### Notifications Toggle:
- [ ] Toggle ON → Notifications are scheduled
- [ ] Toggle OFF → Notifications are cancelled
- [ ] Preference persists after app restart
- [ ] Works for both authenticated and guest users
- [ ] AsyncStorage fallback if user is guest

### Contact Support:
- [ ] Opens email client on iOS
- [ ] Opens email client on Android
- [ ] Pre-fills email address
- [ ] Pre-fills subject line
- [ ] Shows fallback alert if no email client
- [ ] Works in simulator (shows alert)

### Text Size (If Implemented):
- [ ] Modal opens with current selection
- [ ] Preview shows actual size difference
- [ ] Selection saves to AsyncStorage
- [ ] All text components update dynamically
- [ ] Preference persists after restart

---

## Risk Assessment

| Feature | Current Risk | Post-Fix Risk |
|---------|-------------|---------------|
| Notifications | **HIGH** - Users confused | **LOW** - Works as expected |
| Contact Support | **MEDIUM** - Support friction | **MINIMAL** - Direct contact |
| Text Size | **MEDIUM** - Misleading UI | **NONE** - Feature removed |

---

## Conclusion

The settings page has a **facade of functionality** with features that look interactive but do nothing. This violates user trust and creates frustration.

**Recommended Actions:**
1. ✅ Fix Contact Support (Quick Win - 30 min)
2. ✅ Implement Notifications Toggle (Critical - 2 hours)
3. ⚠️ Remove Text Size Setting (MVP - 5 min)

**Total Implementation Time:** ~3 hours to restore user trust

---

## Files Requiring Changes

### Must Change:
- `app/settings.tsx` - All three fixes

### Should Create:
- `utils/notificationPreferences.ts` - Preference management

### Optional (If keeping Text Size):
- `contexts/TextSizeContext.tsx`
- `components/settings/TextSizeModal.tsx`
- Update all `Text` components

---

**Report Generated:** 2025-11-01
**Status:** Ready for Implementation
