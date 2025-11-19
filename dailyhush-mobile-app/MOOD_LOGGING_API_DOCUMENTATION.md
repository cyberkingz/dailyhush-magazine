# Mood Logging API Documentation

**Date**: 2025-11-06
**Version**: 1.0.0
**Author**: Supabase Expert Agent
**Status**: Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Type Definitions](#type-definitions)
5. [Service Layer API](#service-layer-api)
6. [React Hook Usage](#react-hook-usage)
7. [Error Handling](#error-handling)
8. [Offline Support](#offline-support)
9. [Security](#security)
10. [Testing](#testing)
11. [Examples](#examples)
12. [Troubleshooting](#troubleshooting)

---

## Overview

The Mood Logging system provides a comprehensive backend integration for the inline mood widget in the DailyHush mobile app. It captures quick mood logs with mood type, intensity (1-7), and optional notes.

### Key Features

- **Type-Safe**: Full TypeScript support with strict types
- **Offline-First**: Works without network, queues for later sync
- **Optimistic UI**: Instant feedback, rollback on error
- **Retry Logic**: Exponential backoff for network failures
- **Secure**: Row Level Security (RLS) policies, user data isolation
- **Fast**: Optimized indexes, caching, one log per day pattern
- **User-Friendly**: Clear error messages, loading states

### File Structure

```
dailyhush-mobile-app/
├── types/
│   └── mood.types.ts              # Type definitions
├── services/
│   └── moodLogging.ts             # Service layer (API calls)
├── hooks/
│   └── useMoodLogging.ts          # React hook (state + offline)
├── supabase/migrations/
│   └── 20251106_mood_widget_logs.sql  # Database schema
└── MOOD_LOGGING_API_DOCUMENTATION.md  # This file
```

---

## Architecture

### Data Flow

```
┌─────────────────┐
│  React Widget   │  (UI Component)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ useMoodLogging  │  (React Hook)
│  - State Mgmt   │
│  - Caching      │
│  - Offline Q    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ moodLogging.ts  │  (Service Layer)
│  - Validation   │
│  - API Calls    │
│  - Error Handling│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Supabase       │  (Database)
│  - mood_logs    │
│  - RLS Policies │
└─────────────────┘
```

### Offline Support Flow

```
User Action → Check Network
                │
        ┌───────┴───────┐
        │               │
     Online          Offline
        │               │
        ↓               ↓
   Save to DB     Queue in Storage
        │               │
        ↓               │
   Update UI      Update UI (Optimistic)
                        │
                        ↓
                  Background Sync
                  (every 30s when online)
                        │
                        ↓
                   Save to DB
```

---

## Database Schema

### Table: `mood_logs`

Stores quick mood logs from the inline widget.

```sql
CREATE TABLE public.mood_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  mood mood_type NOT NULL,              -- calm | anxious | sad | frustrated | mixed
  mood_emoji TEXT NOT NULL,             -- '😊', '😰', '😢', '😤', '🌤️'
  intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 7),
  notes TEXT,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  UNIQUE (user_id, log_date)  -- One log per user per day
);
```

### Indexes

Optimized for common query patterns:

```sql
-- Primary lookups
idx_mood_logs_user_id (user_id)
idx_mood_logs_user_date (user_id, log_date DESC)
idx_mood_logs_created (user_id, created_at DESC)

-- Today's mood (most common query)
idx_mood_logs_today (user_id, log_date) WHERE deleted_at IS NULL

-- Analytics
idx_mood_logs_mood_type (mood) WHERE deleted_at IS NULL
```

### RLS Policies

Users can only access their own mood logs:

```sql
-- View own logs
CREATE POLICY "Users can view own mood logs"
  ON mood_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Insert own logs
CREATE POLICY "Users can insert own mood logs"
  ON mood_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update own logs
CREATE POLICY "Users can update own mood logs"
  ON mood_logs FOR UPDATE
  USING (auth.uid() = user_id);

-- Delete own logs
CREATE POLICY "Users can delete own mood logs"
  ON mood_logs FOR DELETE
  USING (auth.uid() = user_id);
```

### Helper Functions

**get_today_mood_log(user_id)** - Get today's mood log

```sql
SELECT * FROM get_today_mood_log(auth.uid());
```

**get_mood_log_history(user_id, start_date, end_date, limit)** - Get history

```sql
SELECT * FROM get_mood_log_history(auth.uid(), '2025-10-01', '2025-11-01', 100);
```

**get_mood_stats(user_id, days)** - Get statistics

```sql
SELECT * FROM get_mood_stats(auth.uid(), 30);
```

---

## Type Definitions

### Core Types

#### `MoodSubmitData`

Data structure for submitting a mood log:

```typescript
interface MoodSubmitData {
  mood: MoodChoice; // 'calm' | 'anxious' | 'sad' | 'frustrated' | 'mixed'
  intensity: MoodIntensity; // 1 | 2 | 3 | 4 | 5 | 6 | 7
  notes?: string; // Optional quick notes
  timestamp?: Date; // Defaults to now
  userId?: string; // Auto-populated from auth
}
```

#### `MoodLog`

Complete mood log record from database:

```typescript
interface MoodLog {
  id: string;
  user_id: string;
  mood: MoodChoice;
  mood_emoji: string;
  intensity: MoodIntensity;
  notes: string | null;
  created_at: string;
  updated_at: string;
  log_date: string; // YYYY-MM-DD
}
```

### Error Types

#### `MoodLoggingError`

Custom error class with user-friendly messages:

```typescript
class MoodLoggingError extends Error {
  code: MoodLoggingErrorCode;
  userMessage: string;
  originalError?: unknown;

  isRetryable(): boolean;
  getUserMessage(): string;
}
```

#### `MoodLoggingErrorCode`

Error codes:

```typescript
enum MoodLoggingErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR', // Network failed (retryable)
  TIMEOUT_ERROR = 'TIMEOUT_ERROR', // Request timeout (retryable)
  UNAUTHORIZED = 'UNAUTHORIZED', // Not logged in
  VALIDATION_ERROR = 'VALIDATION_ERROR', // Invalid input
  CONSTRAINT_ERROR = 'CONSTRAINT_ERROR', // DB constraint violation
  PERMISSION_DENIED = 'PERMISSION_DENIED', // RLS violation
  UNKNOWN_ERROR = 'UNKNOWN_ERROR', // Unknown error
  OFFLINE = 'OFFLINE', // Device offline
}
```

---

## Service Layer API

### saveMoodLog

Save a new mood log or update today's existing log.

```typescript
async function saveMoodLog(data: MoodSubmitData, options?: SaveMoodLogOptions): Promise<MoodLog>;
```

**Parameters:**

- `data: MoodSubmitData` - Mood log data (mood, intensity, notes)
- `options?: SaveMoodLogOptions` - Optional configuration
  - `merge?: boolean` - Merge with existing entry (default: false)
  - `skipOfflineQueue?: boolean` - Don't queue if offline (default: false)
  - `timeout?: number` - Request timeout in ms (default: 10000)

**Returns:** `Promise<MoodLog>` - Saved mood log

**Throws:** `MoodLoggingError` if save fails

**Example:**

```typescript
import { saveMoodLog } from '@/services/moodLogging';

try {
  const moodLog = await saveMoodLog({
    mood: 'calm',
    intensity: 4,
    notes: 'Feeling peaceful after meditation',
  });
  console.log('Saved:', moodLog.id);
} catch (error) {
  if (error instanceof MoodLoggingError) {
    console.error(error.getUserMessage());
  }
}
```

---

### getTodayMoodLog

Get today's mood log for current user.

```typescript
async function getTodayMoodLog(
  userId?: string,
  options?: GetTodayMoodLogOptions
): Promise<MoodLog | null>;
```

**Parameters:**

- `userId?: string` - User ID (defaults to current user)
- `options?: GetTodayMoodLogOptions` - Optional configuration
  - `forceFetch?: boolean` - Bypass cache (default: false)
  - `timezone?: string` - User timezone (default: device timezone)

**Returns:** `Promise<MoodLog | null>` - Today's mood log or null

**Throws:** `MoodLoggingError` if fetch fails

**Example:**

```typescript
import { getTodayMoodLog } from '@/services/moodLogging';

const todayLog = await getTodayMoodLog();
if (todayLog) {
  console.log('You logged:', todayLog.mood);
} else {
  console.log('No mood logged today');
}
```

---

### updateMoodLog

Update an existing mood log.

```typescript
async function updateMoodLog(id: string, data: MoodLogUpdate): Promise<MoodLog>;
```

**Parameters:**

- `id: string` - Mood log ID to update
- `data: MoodLogUpdate` - Fields to update (partial)

**Returns:** `Promise<MoodLog>` - Updated mood log

**Throws:** `MoodLoggingError` if update fails

**Example:**

```typescript
import { updateMoodLog } from '@/services/moodLogging';

const updated = await updateMoodLog('log-id-123', {
  intensity: 5,
  notes: 'Feeling better now',
});
```

---

### deleteMoodLog

Delete (soft delete) a mood log.

```typescript
async function deleteMoodLog(id: string): Promise<void>;
```

**Parameters:**

- `id: string` - Mood log ID to delete

**Returns:** `Promise<void>`

**Throws:** `MoodLoggingError` if delete fails

**Example:**

```typescript
import { deleteMoodLog } from '@/services/moodLogging';

await deleteMoodLog('log-id-123');
console.log('Deleted successfully');
```

---

### getMoodHistory

Get mood log history for a date range.

```typescript
async function getMoodHistory(
  startDate?: Date,
  endDate?: Date,
  userId?: string
): Promise<MoodLog[]>;
```

**Parameters:**

- `startDate?: Date` - Start date (default: 30 days ago)
- `endDate?: Date` - End date (default: today)
- `userId?: string` - User ID (default: current user)

**Returns:** `Promise<MoodLog[]>` - Array of mood logs

**Throws:** `MoodLoggingError` if fetch fails

**Example:**

```typescript
import { getMoodHistory } from '@/services/moodLogging';

const last30Days = await getMoodHistory(
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  new Date()
);
console.log(`Found ${last30Days.length} mood logs`);
```

---

### getMoodStats

Get mood statistics for analytics.

```typescript
async function getMoodStats(days?: number, userId?: string): Promise<MoodStats>;
```

**Parameters:**

- `days?: number` - Number of days to analyze (default: 30)
- `userId?: string` - User ID (default: current user)

**Returns:** `Promise<MoodStats>` - Mood statistics

**Example:**

```typescript
import { getMoodStats } from '@/services/moodLogging';

const stats = await getMoodStats(30);
console.log('Most common mood:', stats.most_common_mood);
console.log('Average intensity:', stats.avg_intensity);
console.log('Current streak:', stats.streak_days);
```

---

### validateMoodData

Validate mood submit data (used internally).

```typescript
function validateMoodData(data: Partial<MoodSubmitData>): ValidationResult;
```

**Returns:** `ValidationResult` with validation errors by field

**Example:**

```typescript
import { validateMoodData } from '@/services/moodLogging';

const result = validateMoodData({ mood: 'calm', intensity: 4 });
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

---

## React Hook Usage

### useMoodLogging

React hook for mood logging with offline support and state management.

```typescript
function useMoodLogging(): UseMoodLoggingReturn;
```

**Returns:**

```typescript
interface UseMoodLoggingReturn {
  // State
  isSubmitting: boolean; // Currently submitting
  isFetching: boolean; // Currently fetching
  isSyncing: boolean; // Syncing offline queue
  error: MoodLoggingError | null; // Current error
  todayMood: MoodLog | null; // Today's mood (cached)
  pendingCount: number; // Offline queue count

  // Actions
  submitMood: (data: MoodSubmitData) => Promise<MoodLog | null>;
  getTodayMood: (forceFetch?: boolean) => Promise<MoodLog | null>;
  updateMood: (id: string, data: MoodLogUpdate) => Promise<MoodLog | null>;
  deleteMood: (id: string) => Promise<boolean>;
  syncOfflineQueue: () => Promise<void>;
  clearError: () => void;
  refreshTodayMood: () => Promise<void>;
}
```

### Basic Usage

```typescript
import { useMoodLogging } from '@/hooks/useMoodLogging';

function MoodWidget() {
  const {
    submitMood,
    getTodayMood,
    isSubmitting,
    error,
    todayMood,
    pendingCount
  } = useMoodLogging();

  // Load today's mood on mount
  useEffect(() => {
    getTodayMood();
  }, []);

  const handleSubmit = async () => {
    const result = await submitMood({
      mood: 'calm',
      intensity: 4,
      notes: 'Feeling peaceful'
    });

    if (result) {
      console.log('Saved successfully!');
    }
  };

  return (
    <View>
      {isSubmitting && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error.getUserMessage()}</Text>}
      {pendingCount > 0 && (
        <Text style={styles.pending}>
          {pendingCount} pending sync
        </Text>
      )}
      <Button onPress={handleSubmit} title="Log Mood" />
    </View>
  );
}
```

### With Update Button

```typescript
function MoodDisplay() {
  const { todayMood, updateMood, getTodayMood } = useMoodLogging();

  useEffect(() => {
    getTodayMood();
  }, []);

  const handleUpdate = async () => {
    if (!todayMood) return;

    await updateMood(todayMood.id, {
      intensity: 5,
      notes: 'Updated my mood'
    });

    // Refresh to show updated data
    await getTodayMood(true);
  };

  if (!todayMood) {
    return <Text>No mood logged today</Text>;
  }

  return (
    <View>
      <Text>Mood: {todayMood.mood}</Text>
      <Text>Intensity: {todayMood.intensity}/7</Text>
      <Button onPress={handleUpdate} title="Update" />
    </View>
  );
}
```

### Offline Queue Status

```typescript
function OfflineStatus() {
  const { pendingCount, syncOfflineQueue, isSyncing } = useMoodLogging();

  if (pendingCount === 0) {
    return null;
  }

  return (
    <View style={styles.offlineStatus}>
      <Text>{pendingCount} mood logs pending sync</Text>
      <Button
        onPress={syncOfflineQueue}
        title="Sync Now"
        disabled={isSyncing}
      />
    </View>
  );
}
```

---

## Error Handling

### Error Types

All errors are instances of `MoodLoggingError` with specific codes:

| Code                | Description                   | User Message                                                | Retryable |
| ------------------- | ----------------------------- | ----------------------------------------------------------- | --------- |
| `NETWORK_ERROR`     | Network connection failed     | "Unable to connect. Please check your internet connection." | Yes       |
| `TIMEOUT_ERROR`     | Request timed out             | "Request timed out. Please try again."                      | Yes       |
| `UNAUTHORIZED`      | User not logged in            | "You must be logged in to save mood logs."                  | No        |
| `VALIDATION_ERROR`  | Invalid input data            | Specific field error (e.g., "Mood is required")             | No        |
| `CONSTRAINT_ERROR`  | Database constraint violation | "Invalid data. Please check your input."                    | No        |
| `PERMISSION_DENIED` | RLS policy violation          | "You do not have permission to access this data."           | No        |
| `UNKNOWN_ERROR`     | Unknown error                 | "An unexpected error occurred. Please try again."           | No        |
| `OFFLINE`           | Device offline                | User not shown (queued automatically)                       | N/A       |

### Retry Logic

**Retryable Errors** (NETWORK_ERROR, TIMEOUT_ERROR):

- Automatic retry with exponential backoff
- 3 attempts: 1s → 2s → 4s
- Max delay: 10 seconds
- Queued offline if all retries fail

**Non-Retryable Errors** (VALIDATION_ERROR, UNAUTHORIZED, etc.):

- No retry
- Immediate error shown to user
- User must fix issue

### Error Display

```typescript
function ErrorDisplay({ error }: { error: MoodLoggingError | null }) {
  if (!error) return null;

  return (
    <View style={styles.errorContainer}>
      <Icon name="alert-circle" size={20} color="red" />
      <Text style={styles.errorText}>
        {error.getUserMessage()}
      </Text>
      {error.isRetryable() && (
        <Text style={styles.errorHint}>
          Tap "Try Again" or we'll sync automatically when online
        </Text>
      )}
    </View>
  );
}
```

---

## Offline Support

### How It Works

1. **Detection**: Check network state before operations
2. **Queue**: Store failed/offline submissions in AsyncStorage
3. **Sync**: Background sync every 30 seconds when online
4. **Optimistic UI**: Show success immediately, sync in background

### AsyncStorage Keys

- `@dailyhush/offline_mood_queue` - Queued mood logs
- `@dailyhush/today_mood_cache` - Cached today's mood

### Queue Item Structure

```typescript
interface OfflineMoodLog {
  tempId: string; // Temporary UUID
  data: MoodSubmitData; // Mood log data
  queuedAt: string; // ISO timestamp
  status: OfflineQueueStatus; // 'pending' | 'syncing' | 'synced' | 'failed'
  retryCount: number; // Number of sync attempts
  lastAttempt?: string; // Last sync attempt timestamp
  lastError?: string; // Last error message
}
```

### Manual Sync

```typescript
function SyncButton() {
  const { syncOfflineQueue, isSyncing, pendingCount } = useMoodLogging();

  return (
    <Button
      onPress={syncOfflineQueue}
      title={isSyncing ? 'Syncing...' : `Sync ${pendingCount} Items`}
      disabled={isSyncing || pendingCount === 0}
    />
  );
}
```

### Conflict Resolution

**Conflict**: User edits mood on another device while offline edit is queued.

**Resolution**: Last write wins (upsert pattern ensures consistency).

---

## Security

### Authentication

All operations require authentication:

```typescript
const {
  data: { user },
  error,
} = await supabase.auth.getUser();
if (!user) {
  throw new MoodLoggingError('UNAUTHORIZED', 'Must be logged in');
}
```

### Row Level Security (RLS)

Users can only access their own mood logs:

```sql
-- Automatic filtering by user_id
auth.uid() = user_id
```

No need to manually filter in queries - Supabase enforces this at the database level.

### Data Privacy

- **Notes**: Not encrypted (quick notes are optional and non-therapeutic)
- **Encryption**: Use `mood_entries` table for sensitive therapeutic content
- **Soft Delete**: Deleted logs are marked but not removed (for recovery)

---

## Testing

### Unit Tests (Service Layer)

```typescript
describe('saveMoodLog', () => {
  it('should save a valid mood log', async () => {
    const data: MoodSubmitData = {
      mood: 'calm',
      intensity: 4,
      notes: 'Test note',
    };

    const result = await saveMoodLog(data);

    expect(result.mood).toBe('calm');
    expect(result.intensity).toBe(4);
    expect(result.notes).toBe('Test note');
  });

  it('should throw validation error for invalid intensity', async () => {
    const data: MoodSubmitData = {
      mood: 'calm',
      intensity: 10, // Invalid (max is 7)
    };

    await expect(saveMoodLog(data)).rejects.toThrow(MoodLoggingError);
  });
});
```

### Integration Tests (Hook)

```typescript
describe('useMoodLogging', () => {
  it('should submit mood and update state', async () => {
    const { result } = renderHook(() => useMoodLogging());

    await act(async () => {
      await result.current.submitMood({
        mood: 'calm',
        intensity: 4,
      });
    });

    expect(result.current.todayMood).not.toBeNull();
    expect(result.current.todayMood?.mood).toBe('calm');
  });
});
```

### Test Utilities

```typescript
// Mock mood log
export function createMockMoodLog(): MoodLog {
  return {
    id: 'test-id',
    user_id: 'test-user',
    mood: 'calm',
    mood_emoji: '😊',
    intensity: 4,
    notes: 'Test note',
    log_date: '2025-11-06',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Clear today's mood for tests
export async function clearTodayMoodLog() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const today = new Date().toISOString().split('T')[0];
  await supabase.from('mood_logs').delete().eq('user_id', user.id).eq('log_date', today);
}

// Simulate network error
export async function simulateNetworkError() {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network request failed'));
}
```

---

## Examples

### Complete Widget Implementation

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useMoodLogging } from '@/hooks/useMoodLogging';
import { MOOD_OPTIONS } from '@/constants/moodOptions';
import type { MoodChoice, MoodIntensity } from '@/types/mood.types';

export function MoodWidget() {
  const {
    submitMood,
    getTodayMood,
    todayMood,
    isSubmitting,
    error,
    clearError,
    pendingCount
  } = useMoodLogging();

  const [selectedMood, setSelectedMood] = useState<MoodChoice | null>(null);
  const [intensity, setIntensity] = useState<MoodIntensity>(4);
  const [notes, setNotes] = useState('');
  const [showWidget, setShowWidget] = useState(false);

  // Load today's mood on mount
  useEffect(() => {
    getTodayMood();
  }, []);

  // If mood already logged, show display state
  if (todayMood && !showWidget) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Today's Mood</Text>
        <Text style={styles.emoji}>{todayMood.mood_emoji}</Text>
        <Text style={styles.mood}>{todayMood.mood}</Text>
        <Text style={styles.intensity}>
          Intensity: {todayMood.intensity}/7
        </Text>
        {todayMood.notes && (
          <Text style={styles.notes}>{todayMood.notes}</Text>
        )}
        <Button
          title="Update"
          onPress={() => setShowWidget(true)}
        />
      </View>
    );
  }

  // Widget state - collecting mood
  const handleSubmit = async () => {
    if (!selectedMood) return;

    const result = await submitMood({
      mood: selectedMood,
      intensity,
      notes: notes || undefined
    });

    if (result) {
      // Success - reset form
      setSelectedMood(null);
      setIntensity(4);
      setNotes('');
      setShowWidget(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error.getUserMessage()}
          </Text>
          <Button title="Dismiss" onPress={clearError} />
        </View>
      )}

      {/* Offline Queue Status */}
      {pendingCount > 0 && (
        <View style={styles.offlineStatus}>
          <Text>{pendingCount} pending sync</Text>
        </View>
      )}

      {/* Mood Selection */}
      <View style={styles.moodGrid}>
        {MOOD_OPTIONS.map((option) => (
          <Button
            key={option.id}
            title={`${option.emoji} ${option.label}`}
            onPress={() => setSelectedMood(option.id)}
            color={selectedMood === option.id ? 'blue' : 'gray'}
          />
        ))}
      </View>

      {/* Intensity Slider */}
      {selectedMood && (
        <View style={styles.intensityContainer}>
          <Text>Intensity: {intensity}/7</Text>
          {/* Add slider component here */}
        </View>
      )}

      {/* Notes Input */}
      {selectedMood && (
        <TextInput
          style={styles.notesInput}
          placeholder="Quick notes (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      )}

      {/* Submit Button */}
      <Button
        title={isSubmitting ? 'Saving...' : 'Save Mood'}
        onPress={handleSubmit}
        disabled={!selectedMood || isSubmitting}
      />

      {isSubmitting && <ActivityIndicator />}
    </View>
  );
}
```

---

## Troubleshooting

### Issue: "You must be logged in"

**Cause**: User is not authenticated

**Solution**:

```typescript
import { supabase } from '@/utils/supabase';

const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) {
  // Redirect to login
  router.push('/login');
}
```

---

### Issue: Mood log not saving

**Possible Causes**:

1. Validation error (intensity > 7)
2. Network error
3. RLS policy issue

**Debug**:

```typescript
try {
  await saveMoodLog(data);
} catch (error) {
  if (error instanceof MoodLoggingError) {
    console.log('Error code:', error.code);
    console.log('User message:', error.getUserMessage());
    console.log('Original error:', error.originalError);
  }
}
```

---

### Issue: Offline queue not syncing

**Possible Causes**:

1. Network still offline
2. Max retries reached (3)
3. Authentication expired

**Solution**:

```typescript
const { syncOfflineQueue, pendingCount } = useMoodLogging();

// Check queue status
console.log('Pending items:', pendingCount);

// Manually trigger sync
await syncOfflineQueue();

// Check AsyncStorage
const queueJson = await AsyncStorage.getItem('@dailyhush/offline_mood_queue');
const queue = JSON.parse(queueJson);
console.log('Queue items:', queue);
```

---

### Issue: "Today's mood" shows old data

**Cause**: Cache not refreshed

**Solution**:

```typescript
const { refreshTodayMood } = useMoodLogging();

// Force refresh (bypasses cache)
await refreshTodayMood();
```

---

### Issue: RLS policy violation

**Cause**: Trying to access another user's data

**Debug**:

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'mood_logs';

-- Test query manually
SELECT * FROM mood_logs WHERE user_id = auth.uid();
```

---

## Performance Optimization

### Caching Strategy

- **Today's Mood**: Cached for 5 minutes
- **History**: No automatic caching (query on demand)
- **Stats**: No automatic caching (calculate on demand)

### Index Usage

Queries are optimized to use indexes:

```sql
-- This query uses idx_mood_logs_today
SELECT * FROM mood_logs
WHERE user_id = 'user-id'
  AND log_date = CURRENT_DATE
  AND deleted_at IS NULL;
```

### Batch Operations

For bulk operations, use transactions:

```typescript
// Not recommended (multiple round-trips)
for (const log of logs) {
  await saveMoodLog(log);
}

// Better (single transaction)
await supabase.from('mood_logs').insert(logs);
```

---

## Migration Guide

### From mood_entries to mood_logs

If migrating from the full 4-step flow to the quick widget:

```typescript
// Old (mood_entries)
await supabase.from('mood_entries').insert({
  user_id: userId,
  mood_type: 'calm',
  intensity_rating: 4,
  journal_text_encrypted: encrypted,
});

// New (mood_logs)
await saveMoodLog({
  mood: 'calm',
  intensity: 4,
  notes: 'Quick note',
});
```

---

## API Reference Summary

### Service Functions

| Function           | Parameters              | Returns                    | Throws             |
| ------------------ | ----------------------- | -------------------------- | ------------------ |
| `saveMoodLog`      | `data, options?`        | `Promise<MoodLog>`         | `MoodLoggingError` |
| `getTodayMoodLog`  | `userId?, options?`     | `Promise<MoodLog \| null>` | `MoodLoggingError` |
| `updateMoodLog`    | `id, data`              | `Promise<MoodLog>`         | `MoodLoggingError` |
| `deleteMoodLog`    | `id`                    | `Promise<void>`            | `MoodLoggingError` |
| `getMoodHistory`   | `start?, end?, userId?` | `Promise<MoodLog[]>`       | `MoodLoggingError` |
| `getMoodStats`     | `days?, userId?`        | `Promise<MoodStats>`       | `MoodLoggingError` |
| `validateMoodData` | `data`                  | `ValidationResult`         | -                  |

### Hook Methods

| Method             | Parameters    | Returns                    | Description         |
| ------------------ | ------------- | -------------------------- | ------------------- |
| `submitMood`       | `data`        | `Promise<MoodLog \| null>` | Submit new mood log |
| `getTodayMood`     | `forceFetch?` | `Promise<MoodLog \| null>` | Get today's mood    |
| `updateMood`       | `id, data`    | `Promise<MoodLog \| null>` | Update existing log |
| `deleteMood`       | `id`          | `Promise<boolean>`         | Delete mood log     |
| `syncOfflineQueue` | -             | `Promise<void>`            | Sync offline queue  |
| `clearError`       | -             | `void`                     | Clear error state   |
| `refreshTodayMood` | -             | `Promise<void>`            | Refresh cached mood |

---

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review error codes in [Error Handling](#error-handling)
3. Test with [Testing Utilities](#test-utilities)
4. Contact backend team for RLS/database issues

---

**End of Documentation**
