/**
 * DailyHush - Notifications Service
 * Handle push notifications for daily quotes and encouragement
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { getQuoteOfTheDay, getQuotesByCategory } from '@/data/dailyQuotes';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the user
 */
export async function registerForPushNotifications(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices');
    return false;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push notification permissions');
    return false;
  }

  // For Android, set notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-quotes', {
      name: 'Daily Quotes',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#52B788',
      description: 'Daily mindful quotes and reminders',
    });
  }

  console.log('Push notifications enabled');
  return true;
}

/**
 * Schedule daily quote notification at 9:00 AM
 */
export async function scheduleDailyQuoteNotification(): Promise<void> {
  try {
    // Cancel existing scheduled notifications for daily quotes
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === 'daily-quote') {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }
    }

    // Get tomorrow's quote
    const quote = getQuoteOfTheDay();

    // Schedule for 9:00 AM daily
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💚 Daily Wisdom from DailyHush',
        body: quote.text,
        data: {
          type: 'daily-quote',
          quoteId: quote.id,
          category: quote.category,
        },
        sound: true,
        badge: 1,
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      } as Notifications.CalendarTriggerInput,
    });

    console.log('Daily quote notification scheduled for 9:00 AM');
  } catch (error) {
    console.error('Failed to schedule daily quote:', error);
  }
}

/**
 * Send immediate inspirational notification (for testing)
 */
export async function sendInstantQuoteNotification(): Promise<void> {
  try {
    const quote = getQuoteOfTheDay();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💚 A Reminder',
        body: quote.text,
        data: {
          type: 'instant-quote',
          quoteId: quote.id,
        },
      },
      trigger: null, // Send immediately
    });

    console.log('Instant quote notification sent');
  } catch (error) {
    console.error('Failed to send instant quote:', error);
  }
}

/**
 * Send encouragement notification after spiral interrupt
 * Triggered 1 minute after completing the protocol
 */
export async function sendEncouragementNotification(): Promise<void> {
  try {
    const growthQuotes = getQuotesByCategory('growth');
    const quote =
      growthQuotes[Math.floor(Math.random() * growthQuotes.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ Well Done',
        body:
          quote?.text ||
          "You just interrupted a spiral. That's growth happening in real-time.",
        data: {
          type: 'encouragement',
          postSpiral: true,
        },
      },
      trigger: {
        seconds: 60, // 1 minute after spiral completion
      } as Notifications.TimeIntervalTriggerInput,
    });

    console.log('Encouragement notification scheduled');
  } catch (error) {
    console.error('Failed to schedule encouragement:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Failed to cancel notifications:', error);
  }
}

/**
 * Get all currently scheduled notifications (for debugging)
 */
export async function getScheduledNotifications(): Promise<
  Notifications.NotificationRequest[]
> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to get scheduled notifications:', error);
    return [];
  }
}

/**
 * Handle notification response (when user taps notification)
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Send a gentle reminder if user hasn't used app in 3 days
 */
export async function scheduleInactivityReminder(
  lastActiveDate: Date
): Promise<void> {
  try {
    const daysSinceActive = Math.floor(
      (Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceActive >= 3) {
      const compassionQuotes = getQuotesByCategory('compassion');
      const quote =
        compassionQuotes[Math.floor(Math.random() * compassionQuotes.length)];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💚 We miss you',
          body:
            quote?.text ||
            'Remember: Progress happens one day at a time. Ready to interrupt today?',
          data: {
            type: 'inactivity-reminder',
          },
        },
        trigger: {
          seconds: 10, // Send shortly after detecting inactivity
        } as Notifications.TimeIntervalTriggerInput,
      });

      console.log('Inactivity reminder scheduled');
    }
  } catch (error) {
    console.error('Failed to schedule inactivity reminder:', error);
  }
}
