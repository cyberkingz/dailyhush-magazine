# Mood Entries API Documentation

Complete API documentation for the therapeutic mood capture flow.

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Database Operations](#database-operations)
4. [Client-Side Encryption](#client-side-encryption)
5. [Real-time Subscriptions](#real-time-subscriptions)
6. [Error Handling](#error-handling)

---

## Overview

The Mood Entries API supports a 4-step therapeutic mood capture flow:

1. **Mood Selection**: User selects mood type (calm, anxious, sad, frustrated, mixed)
2. **Intensity Rating**: User rates intensity on 1-5 scale
3. **Free Writing**: User writes therapeutic journal (encrypted)
4. **Gentle Suggestion**: AI/pre-defined suggestion shown with acceptance tracking

### Key Features

- **End-to-end encryption** for journal text and voice transcriptions
- **Auto-save** every 3 seconds while writing
- **Draft management** with 7-day auto-cleanup
- **Voice transcription** support
- **Soft deletes** with 90-day retention
- **Pattern analytics** for insights

---

## API Endpoints

All operations use Supabase client methods with Row Level Security (RLS) policies.

### 1. Create Mood Entry (Start Session)

**Method**: `INSERT`
**Table**: `mood_entries`
**Description**: Creates a new mood entry in draft status

```typescript
import { supabase } from '@/utils/supabase';
import { encryptText } from '@/lib/encryption';
import { MoodType, MoodEntryStatus } from '@/types/mood-entries';

async function createMoodEntry(userId: string) {
  const { data, error } = await supabase
    .from('mood_entries')
    .insert({
      user_id: userId,
      status: MoodEntryStatus.DRAFT,
      created_at: new Date().toISOString(),
      autosave_version: 1,
      journal_word_count: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

**Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "draft",
  "created_at": "2025-02-01T10:30:00Z",
  "autosave_version": 1,
  "journal_word_count": 0
}
```

---

### 2. Update Mood Entry (Auto-Save)

**Method**: `UPDATE`
**Table**: `mood_entries`
**Description**: Updates an existing mood entry (auto-save or step completion)

```typescript
async function updateMoodEntry(
  entryId: string,
  updates: {
    mood_type?: MoodType;
    mood_emoji?: string;
    intensity_rating?: number;
    journal_text?: string; // Will be encrypted
    status?: MoodEntryStatus;
  }
) {
  // Encrypt journal text if provided
  let encrypted_data = null;
  let nonce = null;

  if (updates.journal_text) {
    const encrypted = await encryptText(updates.journal_text);
    encrypted_data = encrypted.ciphertext;
    nonce = encrypted.nonce;
  }

  const { data, error } = await supabase
    .from('mood_entries')
    .update({
      mood_type: updates.mood_type,
      mood_emoji: updates.mood_emoji,
      mood_selected_at: updates.mood_type ? new Date().toISOString() : undefined,
      intensity_rating: updates.intensity_rating,
      intensity_selected_at: updates.intensity_rating ? new Date().toISOString() : undefined,
      journal_text_encrypted: encrypted_data,
      journal_text_nonce: nonce,
      journal_word_count: updates.journal_text?.split(/\s+/).length || 0,
      status: updates.status,
      last_autosave_at: new Date().toISOString(),
      autosave_version: supabase.raw('autosave_version + 1'),
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

### 3. Complete Mood Entry

**Method**: `UPDATE`
**Table**: `mood_entries`
**Description**: Marks entry as completed and records completion time

```typescript
async function completeMoodEntry(
  entryId: string,
  timeSpentSeconds: number,
  suggestionAccepted?: boolean
) {
  const { data, error } = await supabase
    .from('mood_entries')
    .update({
      status: MoodEntryStatus.COMPLETED,
      completed_at: new Date().toISOString(),
      time_spent_seconds: timeSpentSeconds,
      suggestion_accepted: suggestionAccepted,
      suggestion_responded_at: suggestionAccepted !== undefined
        ? new Date().toISOString()
        : undefined,
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

### 4. Get Mood Entry by ID

**Method**: `SELECT`
**Table**: `mood_entries`
**Description**: Retrieves a specific mood entry with decryption

```typescript
async function getMoodEntry(entryId: string) {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (error) throw error;

  // Decrypt journal text if exists
  if (data.journal_text_encrypted && data.journal_text_nonce) {
    data.journal_text = await decryptText(
      data.journal_text_encrypted,
      data.journal_text_nonce
    );
  }

  // Decrypt voice transcription if exists
  if (data.voice_transcription_encrypted && data.voice_transcription_nonce) {
    data.voice_transcription = await decryptText(
      data.voice_transcription_encrypted,
      data.voice_transcription_nonce
    );
  }

  return data;
}
```

---

### 5. List Mood Entries

**Method**: `SELECT` or `RPC`
**Table**: `mood_entries`
**Description**: Lists user's mood entries with pagination

#### Option A: Direct SELECT
```typescript
async function listMoodEntries(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    include_drafts?: boolean;
  }
) {
  let query = supabase
    .from('mood_entries')
    .select('id, mood_type, mood_emoji, intensity_rating, journal_word_count, status, completed_at, created_at, time_spent_seconds')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (!options?.include_drafts) {
    query = query.eq('status', MoodEntryStatus.COMPLETED);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
```

#### Option B: Using RPC Function (Better Performance)
```typescript
async function listMoodEntriesRPC(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    include_drafts?: boolean;
  }
) {
  const { data, error } = await supabase.rpc('get_user_mood_history', {
    p_user_id: userId,
    p_limit: options?.limit || 50,
    p_offset: options?.offset || 0,
    p_include_drafts: options?.include_drafts || false,
  });

  if (error) throw error;
  return data;
}
```

---

### 6. Get Draft Entries

**Method**: `SELECT`
**Table**: `mood_entries`
**Description**: Retrieves user's draft entries for resume functionality

```typescript
async function getDraftEntries(userId: string) {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('status', MoodEntryStatus.DRAFT)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
    .limit(5); // Only show 5 most recent drafts

  if (error) throw error;

  // Decrypt journal text for each draft
  for (const entry of data) {
    if (entry.journal_text_encrypted && entry.journal_text_nonce) {
      entry.journal_text = await decryptText(
        entry.journal_text_encrypted,
        entry.journal_text_nonce
      );
    }
  }

  return data;
}
```

---

### 7. Delete Mood Entry (Soft Delete)

**Method**: `UPDATE`
**Table**: `mood_entries`
**Description**: Soft deletes a mood entry (can be recovered for 90 days)

```typescript
async function deleteMoodEntry(entryId: string) {
  const { data, error } = await supabase
    .from('mood_entries')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

### 8. Clear Draft Entries

**Method**: `UPDATE`
**Table**: `mood_entries`
**Description**: Soft deletes all draft entries for a user

```typescript
async function clearDraftEntries(userId: string) {
  const { data, error } = await supabase
    .from('mood_entries')
    .update({
      deleted_at: new Date().toISOString(),
      status: MoodEntryStatus.ABANDONED,
    })
    .eq('user_id', userId)
    .eq('status', MoodEntryStatus.DRAFT)
    .is('deleted_at', null);

  if (error) throw error;
  return data;
}
```

---

### 9. Get Mood Patterns (Analytics)

**Method**: `RPC`
**Function**: `get_mood_patterns`
**Description**: Retrieves mood pattern analytics for insights

```typescript
async function getMoodPatterns(userId: string, days: number = 30) {
  const { data, error } = await supabase.rpc('get_mood_patterns', {
    p_user_id: userId,
    p_days: days,
  });

  if (error) throw error;
  return data[0]; // Returns single row
}
```

**Response**:
```json
{
  "total_entries": 42,
  "most_common_mood": "anxious",
  "avg_intensity": 3.2,
  "entries_by_mood": {
    "calm": 8,
    "anxious": 18,
    "sad": 10,
    "frustrated": 4,
    "mixed": 2
  },
  "completion_rate": 85.7
}
```

---

### 10. Upload Voice Recording

**Method**: Storage API
**Bucket**: `mood-voice-recordings`
**Description**: Uploads voice recording to Supabase Storage

```typescript
async function uploadVoiceRecording(
  userId: string,
  entryId: string,
  audioFile: File | Blob
) {
  const fileName = `${userId}/${entryId}-${Date.now()}.m4a`;

  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('mood-voice-recordings')
    .upload(fileName, audioFile, {
      contentType: 'audio/mp4',
      cacheControl: '3600',
    });

  if (uploadError) throw uploadError;

  // Update mood entry with audio path
  const { data, error } = await supabase
    .from('mood_entries')
    .update({
      voice_audio_path: uploadData.path,
      voice_duration_seconds: Math.floor(audioFile.size / 16000), // Approximate
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

## Database Operations

### Direct SQL Queries (Advanced)

For advanced analytics or bulk operations, you can use direct SQL:

```typescript
// Get mood trends by time of day
const { data, error } = await supabase.rpc('execute_sql', {
  query: `
    SELECT
      EXTRACT(HOUR FROM created_at) as hour_of_day,
      mood_type,
      COUNT(*) as count,
      AVG(intensity_rating) as avg_intensity
    FROM mood_entries
    WHERE user_id = $1
      AND status = 'completed'
      AND deleted_at IS NULL
      AND created_at >= NOW() - INTERVAL '30 days'
    GROUP BY hour_of_day, mood_type
    ORDER BY hour_of_day, mood_type
  `,
  params: [userId],
});
```

---

## Client-Side Encryption

### Encryption Setup

```typescript
import * as Crypto from 'expo-crypto';

// Constants
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 256;
const NONCE_LENGTH = 12; // 96 bits
const ITERATIONS = 100000;

// Generate encryption key from user password
async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const saltBuffer = new TextEncoder().encode(salt);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

// Encrypt text
async function encryptText(plaintext: string): Promise<{
  ciphertext: Uint8Array;
  nonce: string;
}> {
  const key = await getUserEncryptionKey(); // Retrieve from secure storage
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));
  const plaintextBuffer = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: nonce,
    },
    key,
    plaintextBuffer
  );

  return {
    ciphertext: new Uint8Array(ciphertext),
    nonce: btoa(String.fromCharCode(...nonce)),
  };
}

// Decrypt text
async function decryptText(
  ciphertext: Uint8Array,
  nonceBase64: string
): Promise<string> {
  const key = await getUserEncryptionKey();
  const nonce = Uint8Array.from(atob(nonceBase64), c => c.charCodeAt(0));

  const plaintext = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: nonce,
    },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plaintext);
}
```

---

## Real-time Subscriptions

### Subscribe to Mood Entry Changes

```typescript
import { RealtimeChannel } from '@supabase/supabase-js';

function subscribeToMoodEntries(
  userId: string,
  onInsert: (payload: any) => void,
  onUpdate: (payload: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel('mood-entries-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mood_entries',
        filter: `user_id=eq.${userId}`,
      },
      onInsert
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'mood_entries',
        filter: `user_id=eq.${userId}`,
      },
      onUpdate
    )
    .subscribe();

  return channel;
}

// Usage
const channel = subscribeToMoodEntries(
  userId,
  (payload) => console.log('New entry:', payload.new),
  (payload) => console.log('Updated entry:', payload.new)
);

// Cleanup
channel.unsubscribe();
```

---

## Error Handling

### Common Errors

```typescript
type MoodEntryError =
  | 'ENCRYPTION_FAILED'
  | 'NETWORK_ERROR'
  | 'PERMISSION_DENIED'
  | 'ENTRY_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'STORAGE_QUOTA_EXCEEDED';

class MoodEntryAPIError extends Error {
  code: MoodEntryError;
  details?: any;

  constructor(code: MoodEntryError, message: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'MoodEntryAPIError';
  }
}

// Error handling wrapper
async function withErrorHandling<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (error.code === '42501') {
      throw new MoodEntryAPIError(
        'PERMISSION_DENIED',
        'You do not have permission to access this entry',
        error
      );
    }

    if (error.code === '23505') {
      throw new MoodEntryAPIError(
        'VALIDATION_ERROR',
        'Entry already exists',
        error
      );
    }

    if (error.message?.includes('encryption')) {
      throw new MoodEntryAPIError(
        'ENCRYPTION_FAILED',
        'Failed to encrypt/decrypt data',
        error
      );
    }

    throw new MoodEntryAPIError(
      'NETWORK_ERROR',
      'An unexpected error occurred',
      error
    );
  }
}

// Usage
const entry = await withErrorHandling(() => createMoodEntry(userId));
```

---

## Best Practices

### 1. Auto-Save Implementation

```typescript
import { useEffect, useRef } from 'react';

function useAutoSave(
  entryId: string,
  journalText: string,
  intervalMs: number = 3000
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (journalText.trim()) {
        await updateMoodEntry(entryId, { journal_text: journalText });
      }
    }, intervalMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [entryId, journalText, intervalMs]);
}
```

### 2. Optimistic Updates

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useMoodEntryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMoodEntry,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['mood-entries', variables.entryId]);

      // Snapshot previous value
      const previousEntry = queryClient.getQueryData([
        'mood-entries',
        variables.entryId,
      ]);

      // Optimistically update
      queryClient.setQueryData(['mood-entries', variables.entryId], (old: any) => ({
        ...old,
        ...variables,
      }));

      return { previousEntry };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousEntry) {
        queryClient.setQueryData(
          ['mood-entries', variables.entryId],
          context.previousEntry
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch after mutation
      queryClient.invalidateQueries(['mood-entries', variables.entryId]);
    },
  });
}
```

### 3. Pagination with Infinite Scroll

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

function useMoodEntriesInfinite(userId: string) {
  return useInfiniteQuery({
    queryKey: ['mood-entries-infinite', userId],
    queryFn: ({ pageParam = 0 }) =>
      listMoodEntries(userId, {
        limit: 20,
        offset: pageParam,
        include_drafts: false,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length * 20 : undefined,
  });
}
```

---

## Rate Limits

- **Reads**: No limit (RLS enforced)
- **Writes**: 100 requests per minute per user
- **Storage uploads**: 10 MB per file, 100 MB per hour per user

---

## Security Considerations

1. **Always encrypt** journal text and voice transcriptions client-side
2. **Never log** plaintext journal content
3. **Validate** all inputs before encryption
4. **Rotate encryption keys** every 90 days
5. **Use secure storage** (Keychain/Keystore) for encryption keys
6. **Implement** proper session management
7. **Monitor** for suspicious activity patterns
