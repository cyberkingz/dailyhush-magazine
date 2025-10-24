# Daily Quotes & Push Notifications Setup

## Overview

DailyHush now includes a daily quote system that rotates 31 mindful quotes focused on rumination, self-compassion, and growth. This document explains how the system works and how to set up push notifications.

## Current Implementation

### Quote System ✅ Complete

**Location**: `/data/dailyQuotes.ts`

- 31 curated quotes focused on rumination interruption
- 5 categories: Compassion, Growth, Presence, Interrupt, Wisdom
- Automatic daily rotation based on day of year
- Helper functions for random quotes and category filtering

**Components**:
- `QuoteCard` component displays daily quote on home screen
- Elegant tropical styling with category badges
- Auto-refreshes based on day

### Display ✅ Complete

Daily quote is shown on the home screen below the TipCard, featuring:
- Quote icon with emerald accent
- Category badge (color-coded)
- Italic quote text
- Optional author attribution
- "Daily wisdom • Refreshes tomorrow" indicator

## Push Notifications Setup 🔄 Next Steps

### 1. Install expo-notifications

```bash
npx expo install expo-notifications expo-device expo-constants
```

### 2. Configure app.json

Add notification permissions:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSUserNotificationsUsageDescription": "DailyHush sends daily mindful quotes to help you interrupt rumination patterns."
      }
    },
    "android": {
      "permissions": ["NOTIFICATIONS"]
    },
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#52B788"
    }
  }
}
```

### 3. Create Notification Service

Create `/services/notifications.ts`:

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { getQuoteOfTheDay } from '@/data/dailyQuotes';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request notification permissions
 */
export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push notification permissions');
    return null;
  }

  // For Android, set notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-quotes', {
      name: 'Daily Quotes',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#52B788',
    });
  }

  return true;
}

/**
 * Schedule daily quote notification
 * Sends at 9:00 AM every day
 */
export async function scheduleDailyQuoteNotification() {
  // Cancel existing daily quote notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  const quote = getQuoteOfTheDay();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💚 Daily Wisdom from DailyHush',
      body: quote.text,
      data: {
        type: 'daily-quote',
        quoteId: quote.id,
        category: quote.category
      },
      sound: true,
      badge: 1,
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });

  console.log('Daily quote notification scheduled for 9:00 AM');
}

/**
 * Send immediate inspirational notification
 * Useful for testing or when user completes training
 */
export async function sendInstantQuoteNotification() {
  const quote = getQuoteOfTheDay();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💚 A Reminder',
      body: quote.text,
      data: {
        type: 'instant-quote',
        quoteId: quote.id
      },
    },
    trigger: null, // Send immediately
  });
}

/**
 * Send encouragement notification after spiral interrupt
 */
export async function sendEncouragementNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '✨ Well Done',
      body: "You just interrupted a spiral. That's growth happening in real-time.",
      data: { type: 'encouragement' },
    },
    trigger: {
      seconds: 60, // 1 minute after spiral interrupt
    },
  });
}
```

### 4. Integrate into App

In `app/_layout.tsx`, add notification setup:

```typescript
import { registerForPushNotifications, scheduleDailyQuoteNotification } from '@/services/notifications';

export default function Layout() {
  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await registerForPushNotifications();
      if (granted) {
        await scheduleDailyQuoteNotification();
      }
    };

    setupNotifications();
  }, []);

  // ... rest of layout
}
```

### 5. Optional: Settings Toggle

Add to `/app/settings.tsx`:

```typescript
const [notificationsEnabled, setNotificationsEnabled] = useState(true);

const toggleNotifications = async (enabled: boolean) => {
  setNotificationsEnabled(enabled);

  if (enabled) {
    await scheduleDailyQuoteNotification();
  } else {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Save preference to user profile
  // await updateUserPreference(user.user_id, 'notifications_enabled', enabled);
};
```

## Notification Timing Strategy

### Recommended Schedule

1. **Morning Quote** (9:00 AM)
   - Daily wisdom to start the day
   - Quote from `getQuoteOfTheDay()`

2. **Evening Check-in** (8:00 PM) - Optional
   - "How was your day? Did you interrupt any spirals?"
   - Prompts app engagement

3. **Post-Spiral Encouragement** (1 minute after completion)
   - Automatically triggered after completing spiral protocol
   - Reinforces positive behavior

### Quote Rotation Strategy

- **Daily**: One quote per day, rotates through all 31
- **Smart timing**: Avoid late-night notifications (respect 3AM mode)
- **Context-aware**: Different quotes for different user states
  - New users → Compassion quotes
  - Struggling → Interrupt quotes
  - Progressing → Growth quotes

## Advanced: Server-Side Notifications

For production, consider using:

1. **Expo Push Notification Service**
   - Free tier: 1M notifications/month
   - Scheduled from server
   - Better reliability

2. **Supabase Edge Functions**
   - Schedule daily cron job
   - Send personalized quotes based on user patterns
   - Track notification engagement

Example Edge Function:

```typescript
// supabase/functions/send-daily-quotes/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Get all users with notifications enabled
  const { data: users } = await supabase
    .from('user_profiles')
    .select('user_id, push_token, timezone')
    .eq('notifications_enabled', true);

  // Send personalized quote to each user
  for (const user of users) {
    const quote = getPersonalizedQuote(user);
    await sendPushNotification(user.push_token, quote);
  }

  return new Response("Quotes sent", { status: 200 });
});
```

## Testing

### Test Daily Quote

```typescript
import { sendInstantQuoteNotification } from '@/services/notifications';

// Test button in dev menu
<Button onPress={sendInstantQuoteNotification}>
  Send Test Quote
</Button>
```

### Verify Schedule

```typescript
const scheduled = await Notifications.getAllScheduledNotificationsAsync();
console.log('Scheduled notifications:', scheduled);
```

## Quote Categories

Use categories for targeted notifications:

- **Compassion**: When user has multiple failed interrupts
- **Growth**: When user shows progress
- **Presence**: During high-stress times (3AM mode)
- **Interrupt**: Morning reminder
- **Wisdom**: General daily rotation

## Future Enhancements

1. **Personalized Quotes**
   - Based on user's trigger patterns
   - ML-powered quote selection

2. **Quote Favorites**
   - Let users save favorite quotes
   - Share quotes with friends

3. **Quote Notifications Based on Activity**
   - If no app usage in 3 days → Send encouragement
   - After completing F.I.R.E. module → Send celebration

4. **Interactive Notifications**
   - Quick actions: "I'm spiraling now" button
   - Reply with feeling rating

## Notes

- Notifications require physical device (won't work in simulator)
- iOS requires explicit permission prompt
- Android auto-grants notification permissions
- Test on both platforms before production
- Consider time zones for global users
- Respect "Do Not Disturb" and 3AM mode settings

## Resources

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Push Notification Best Practices](https://developer.apple.com/design/human-interface-guidelines/notifications)
- [Android Notification Channels](https://developer.android.com/develop/ui/views/notifications/channels)
