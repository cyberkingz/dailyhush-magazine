# Mood Entries System - Complete Guide

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Usage Examples](#usage-examples)
5. [Encryption Strategy](#encryption-strategy)
6. [Testing](#testing)
7. [Performance Optimization](#performance-optimization)
8. [Security Best Practices](#security-best-practices)

---

## Overview

The Mood Entries system implements a therapeutic 4-step mood capture flow for the DailyHush mobile app:

### The 4-Step Flow

1. **Mood Selection** 😌 😰 😢 😤 🤔
   - User selects one of 5 mood types
   - Timestamp recorded

2. **Intensity Rating** ⭐⭐⭐⭐⭐
   - User rates intensity on 1-5 scale
   - Timestamp recorded

3. **Free Writing** ✍️
   - Therapeutic journaling
   - Auto-save every 3 seconds
   - End-to-end encryption
   - Optional voice transcription

4. **Gentle Suggestion** 💡
   - AI or pre-defined suggestion
   - User acceptance tracking
   - Personalized recommendations

### Key Features

- ✅ **End-to-end encryption** - Journal text never stored in plaintext
- ✅ **Auto-save** - Never lose your thoughts
- ✅ **Draft management** - Resume where you left off
- ✅ **Voice support** - Speak your feelings
- ✅ **Pattern analytics** - Understand your mood patterns
- ✅ **Soft deletes** - Recover accidentally deleted entries
- ✅ **HIPAA compliance ready** - Medical-grade privacy

---

## Architecture

### Database Schema

```
mood_entries
├── id (UUID, PK)
├── user_id (UUID, FK → user_profiles)
├── mood_type (ENUM: calm, anxious, sad, frustrated, mixed)
├── mood_emoji (TEXT)
├── mood_selected_at (TIMESTAMP)
├── intensity_rating (INTEGER 1-5)
├── intensity_selected_at (TIMESTAMP)
├── journal_text_encrypted (BYTEA) ← AES-256-GCM
├── journal_text_nonce (TEXT)
├── journal_word_count (INTEGER)
├── voice_audio_path (TEXT)
├── voice_duration_seconds (INTEGER)
├── voice_transcription_encrypted (BYTEA)
├── voice_transcription_nonce (TEXT)
├── transcription_status (ENUM)
├── last_autosave_at (TIMESTAMP)
├── autosave_version (INTEGER)
├── suggestion_shown (TEXT)
├── suggestion_type (TEXT)
├── suggestion_accepted (BOOLEAN)
├── suggestion_details (JSONB)
├── suggestion_shown_at (TIMESTAMP)
├── suggestion_responded_at (TIMESTAMP)
├── status (ENUM: draft, completed, abandoned)
├── completed_at (TIMESTAMP)
├── time_spent_seconds (INTEGER)
├── deleted_at (TIMESTAMP) ← Soft delete
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── device_type (TEXT)
└── app_version (TEXT)

user_encryption_keys
├── user_id (UUID, PK, FK → user_profiles)
├── encrypted_master_key (BYTEA)
├── key_derivation_salt (TEXT)
├── algorithm (TEXT)
├── key_version (INTEGER)
├── previous_key (BYTEA)
├── rotated_at (TIMESTAMP)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Encryption Flow

```
User Password
     ↓
PBKDF2 (100,000 iterations)
     ↓
Password-Derived Key
     ↓
Decrypt Master Key (stored in DB)
     ↓
Master Key (stored in SecureStore)
     ↓
AES-256-GCM Encryption/Decryption
     ↓
Journal Text / Voice Transcription
```

---

## Quick Start

### 1. Run the Migration

```bash
# Apply the database migration
supabase db push

# Or manually run the SQL file
psql $DATABASE_URL < supabase/migrations/20250201_create_mood_entries.sql
```

### 2. Import Types and Functions

```typescript
import {
  createMoodEntry,
  updateMoodEntry,
  completeMoodEntry,
  getMoodEntry,
  listMoodEntries,
} from '@/lib/mood-entries';

import {
  generateEncryptionKey,
  unlockEncryptionKey,
  encryptText,
  decryptText,
} from '@/lib/encryption';

import { MoodType, MoodEntryStatus } from '@/types/mood-entries';
```

### 3. Initialize Encryption (During Onboarding)

```typescript
async function onOnboarding(userId: string, password: string) {
  // Generate encryption key for user
  await generateEncryptionKey(userId, password);

  console.log('✅ Encryption key generated and stored');
}
```

### 4. Unlock Encryption (During Login)

```typescript
async function onLogin(userId: string, password: string) {
  // Unlock encryption key with password
  await unlockEncryptionKey(userId, password);

  console.log('✅ Encryption key unlocked');
}
```

---

## Usage Examples

### Example 1: Complete Mood Capture Flow

```typescript
import { useState, useEffect } from 'react';
import {
  createMoodEntry,
  updateMoodEntry,
  completeMoodEntry,
} from '@/lib/mood-entries';
import { MoodType, MoodEntryStatus, MoodCaptureStep } from '@/types/mood-entries';

function MoodCaptureFlow({ userId }: { userId: string }) {
  const [currentStep, setCurrentStep] = useState(MoodCaptureStep.MOOD_SELECTION);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [mood, setMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState<number | null>(null);
  const [journalText, setJournalText] = useState('');
  const [startTime] = useState(Date.now());

  // Step 1: Create entry when component mounts
  useEffect(() => {
    async function initEntry() {
      const entry = await createMoodEntry(userId, {
        device_type: 'ios',
        app_version: '1.0.0',
      });
      setEntryId(entry.id);
    }

    initEntry();
  }, [userId]);

  // Step 1: Mood Selection
  async function selectMood(moodType: MoodType) {
    if (!entryId) return;

    setMood(moodType);

    await updateMoodEntry(entryId, {
      mood_type: moodType,
      mood_emoji: getMoodEmoji(moodType),
    });

    setCurrentStep(MoodCaptureStep.INTENSITY_RATING);
  }

  // Step 2: Intensity Rating
  async function rateIntensity(rating: number) {
    if (!entryId) return;

    setIntensity(rating);

    await updateMoodEntry(entryId, {
      intensity_rating: rating,
    });

    setCurrentStep(MoodCaptureStep.FREE_WRITING);
  }

  // Step 3: Free Writing (with auto-save)
  useEffect(() => {
    if (!entryId || !journalText.trim()) return;

    const timeoutId = setTimeout(async () => {
      await updateMoodEntry(entryId, {
        journal_text: journalText,
      });
      console.log('✅ Auto-saved');
    }, 3000); // Auto-save after 3 seconds

    return () => clearTimeout(timeoutId);
  }, [entryId, journalText]);

  async function finishWriting() {
    if (!entryId) return;

    setCurrentStep(MoodCaptureStep.GENTLE_SUGGESTION);
  }

  // Step 4: Complete Entry
  async function completeEntry(suggestionAccepted?: boolean) {
    if (!entryId) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    await completeMoodEntry(entryId, timeSpent, suggestionAccepted);

    console.log('✅ Mood entry completed!');
  }

  // Render UI based on current step
  return (
    <View>
      {currentStep === MoodCaptureStep.MOOD_SELECTION && (
        <MoodSelector onSelect={selectMood} />
      )}

      {currentStep === MoodCaptureStep.INTENSITY_RATING && (
        <IntensityRating onRate={rateIntensity} />
      )}

      {currentStep === MoodCaptureStep.FREE_WRITING && (
        <FreeWriting
          value={journalText}
          onChange={setJournalText}
          onFinish={finishWriting}
        />
      )}

      {currentStep === MoodCaptureStep.GENTLE_SUGGESTION && (
        <GentleSuggestion onComplete={completeEntry} />
      )}
    </View>
  );
}
```

### Example 2: Mood History List

```typescript
import { useQuery } from '@tanstack/react-query';
import { listMoodEntries } from '@/lib/mood-entries';

function MoodHistoryScreen({ userId }: { userId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['mood-entries', userId],
    queryFn: () =>
      listMoodEntries(userId, {
        limit: 50,
        offset: 0,
        include_drafts: false,
      }),
  });

  if (isLoading) return <ActivityIndicator />;

  return (
    <FlatList
      data={data?.entries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MoodEntryCard
          mood={item.mood_type}
          emoji={item.mood_emoji}
          intensity={item.intensity_rating}
          wordCount={item.journal_word_count}
          date={item.created_at}
          onPress={() => navigateToDetail(item.id)}
        />
      )}
    />
  );
}
```

### Example 3: Resume from Draft

```typescript
import { useQuery } from '@tanstack/react-query';
import { getDraftEntries } from '@/lib/mood-entries';

function ResumeDraftBanner({ userId }: { userId: string }) {
  const { data: drafts } = useQuery({
    queryKey: ['mood-drafts', userId],
    queryFn: () => getDraftEntries(userId),
  });

  if (!drafts || drafts.length === 0) return null;

  const latestDraft = drafts[0];

  return (
    <TouchableOpacity onPress={() => navigateToEntry(latestDraft.id)}>
      <View style={styles.banner}>
        <Text>📝 You have an unfinished mood entry</Text>
        <Text style={styles.subtitle}>
          {latestDraft.mood_emoji} {formatRelativeTime(latestDraft.updated_at)}
        </Text>
        <Text style={styles.action}>Tap to continue →</Text>
      </View>
    </TouchableOpacity>
  );
}
```

### Example 4: Mood Patterns Analytics

```typescript
import { useQuery } from '@tanstack/react-query';
import { getMoodPatterns } from '@/lib/mood-entries';
import { PieChart } from 'react-native-chart-kit';

function MoodPatternsScreen({ userId }: { userId: string }) {
  const { data: patterns } = useQuery({
    queryKey: ['mood-patterns', userId, 30],
    queryFn: () => getMoodPatterns(userId, 30),
  });

  if (!patterns) return <ActivityIndicator />;

  const chartData = Object.entries(patterns.entries_by_mood).map(
    ([mood, count]) => ({
      name: mood,
      count: count as number,
      color: getMoodColor(mood as MoodType),
    })
  );

  return (
    <ScrollView>
      <Card>
        <Text style={styles.title}>Your Mood Patterns (Last 30 Days)</Text>

        <View style={styles.stat}>
          <Text style={styles.label}>Total Entries</Text>
          <Text style={styles.value}>{patterns.total_entries}</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.label}>Most Common Mood</Text>
          <Text style={styles.value}>
            {getMoodEmoji(patterns.most_common_mood)}{' '}
            {patterns.most_common_mood}
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.label}>Average Intensity</Text>
          <Text style={styles.value}>
            {patterns.avg_intensity.toFixed(1)} / 5.0
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.label}>Completion Rate</Text>
          <Text style={styles.value}>{patterns.completion_rate}%</Text>
        </View>

        <PieChart
          data={chartData}
          width={300}
          height={200}
          chartConfig={chartConfig}
          accessor="count"
          backgroundColor="transparent"
        />
      </Card>
    </ScrollView>
  );
}
```

### Example 5: Voice Recording

```typescript
import { Audio } from 'expo-av';
import { useState } from 'react';
import { uploadVoiceRecording } from '@/lib/mood-entries';

function VoiceRecorder({ entryId, userId }: { entryId: string; userId: string }) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  async function startRecording() {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    await recording.startAsync();

    setRecording(recording);
    setIsRecording(true);
  }

  async function stopRecording() {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    if (uri) {
      // Get audio file
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload to storage
      const duration = recording.getStatusAsync().durationMillis / 1000;
      await uploadVoiceRecording(userId, entryId, blob, duration);

      console.log('✅ Voice recording uploaded');
    }

    setRecording(null);
    setIsRecording(false);
  }

  return (
    <View>
      {isRecording ? (
        <Button title="🛑 Stop Recording" onPress={stopRecording} />
      ) : (
        <Button title="🎤 Start Recording" onPress={startRecording} />
      )}
    </View>
  );
}
```

---

## Encryption Strategy

### Why End-to-End Encryption?

Therapeutic journal entries are **highly sensitive personal data**. E2EE ensures:

- ✅ **Privacy**: Only the user can read their entries
- ✅ **Compliance**: HIPAA, GDPR, CCPA ready
- ✅ **Trust**: Users know their data is secure
- ✅ **Legal protection**: Company cannot be compelled to decrypt

### How It Works

1. **Key Generation** (Onboarding)
   ```
   User Password → PBKDF2 → Password Key
   Random Generator → Master Key
   Master Key + Password Key → Encrypted Master Key
   Encrypted Master Key → Supabase Database
   Master Key → Secure Device Storage (Keychain/Keystore)
   ```

2. **Encryption** (Writing)
   ```
   Journal Text → AES-256-GCM + Master Key + Random Nonce → Ciphertext
   Ciphertext + Nonce → Supabase Database
   ```

3. **Decryption** (Reading)
   ```
   Ciphertext + Nonce → AES-256-GCM + Master Key → Journal Text
   ```

### Security Guarantees

- **Algorithm**: AES-256-GCM (military-grade)
- **Key Derivation**: PBKDF2-SHA256 (100,000 iterations)
- **Nonce**: 96-bit random (never reused)
- **Authentication**: 128-bit GCM tag (prevents tampering)
- **Key Storage**: Platform SecureStore (Keychain/Keystore)

### Key Rotation

Rotate keys every 90 days or on password change:

```typescript
import { rotateEncryptionKey } from '@/lib/encryption';

async function changePassword(userId: string, newPassword: string) {
  await rotateEncryptionKey(userId, newPassword);
  console.log('✅ Encryption key rotated');
}
```

---

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from '@jest/globals';
import { encryptText, decryptText, testEncryption } from '@/lib/encryption';

describe('Encryption', () => {
  it('should encrypt and decrypt text correctly', async () => {
    const plaintext = 'Hello, this is my journal entry 📝';

    const encrypted = await encryptText(plaintext);
    expect(encrypted.ciphertext).toBeInstanceOf(Uint8Array);
    expect(encrypted.nonce).toBeTruthy();

    const decrypted = await decryptText(encrypted.ciphertext, encrypted.nonce);
    expect(decrypted).toBe(plaintext);
  });

  it('should fail to decrypt with wrong nonce', async () => {
    const encrypted = await encryptText('Test');
    const wrongNonce = 'wrongnonce';

    await expect(
      decryptText(encrypted.ciphertext, wrongNonce)
    ).rejects.toThrow();
  });

  it('should pass encryption test', async () => {
    const result = await testEncryption();
    expect(result).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('Mood Entries', () => {
  it('should create and complete a mood entry', async () => {
    const entry = await createMoodEntry(userId);
    expect(entry.id).toBeTruthy();
    expect(entry.status).toBe(MoodEntryStatus.DRAFT);

    await updateMoodEntry(entry.id, {
      mood_type: MoodType.CALM,
      intensity_rating: 4,
      journal_text: 'I feel peaceful today.',
    });

    const completed = await completeMoodEntry(entry.id, 120, true);
    expect(completed.status).toBe(MoodEntryStatus.COMPLETED);
    expect(completed.completed_at).toBeTruthy();
  });
});
```

---

## Performance Optimization

### 1. Pagination

Always use pagination for lists:

```typescript
const { entries, has_more } = await listMoodEntries(userId, {
  limit: 20,
  offset: page * 20,
});
```

### 2. Selective Field Loading

Only load encrypted fields when needed:

```typescript
// Summary view (fast)
SELECT id, mood_type, mood_emoji, intensity_rating, created_at
FROM mood_entries
WHERE user_id = $1 AND deleted_at IS NULL

// Detail view (includes decryption)
SELECT *
FROM mood_entries
WHERE id = $1
```

### 3. Caching

Cache decrypted entries:

```typescript
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

### 4. Background Decryption

Decrypt in background for better UX:

```typescript
import { useEffect } from 'react';

function prefetchMoodEntries(userId: string) {
  useEffect(() => {
    // Prefetch recent entries
    queryClient.prefetchQuery(['mood-entries', userId], () =>
      listMoodEntries(userId, { limit: 10 })
    );
  }, [userId]);
}
```

---

## Security Best Practices

### ✅ DO

- Store encryption keys in SecureStore (Keychain/Keystore)
- Rotate encryption keys every 90 days
- Use password strength requirements (min 8 chars, uppercase, lowercase, number)
- Clear encryption keys on logout
- Validate user input before encryption
- Use HTTPS for all API calls
- Enable RLS policies on all tables
- Log security events (failed decryption attempts)
- Implement rate limiting on API endpoints
- Use biometric authentication where available

### ❌ DON'T

- Never log plaintext journal content
- Never store encryption keys in AsyncStorage
- Never send plaintext over network
- Never reuse nonces
- Never skip encryption for "convenience"
- Never expose encryption keys in error messages
- Never store passwords in plaintext
- Never disable HTTPS in production
- Never share encryption keys between users
- Never implement custom crypto algorithms

---

## Troubleshooting

### "Encryption key not found"

**Solution**: User needs to re-authenticate

```typescript
await unlockEncryptionKey(userId, password);
```

### "Decryption failed"

**Possible causes**:
1. Wrong encryption key (user changed password without migration)
2. Corrupted ciphertext
3. Wrong nonce

**Solution**: Check key version, attempt recovery with previous_key

### "Auto-save not working"

**Solution**: Check timeout logic and network connection

```typescript
// Add retry logic
async function autoSaveWithRetry(entryId: string, text: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await updateMoodEntry(entryId, { journal_text: text });
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## Next Steps

1. ✅ Run database migration
2. ✅ Implement UI for 4-step flow
3. ✅ Set up encryption during onboarding
4. ✅ Test encryption/decryption
5. ✅ Implement auto-save
6. ✅ Add voice recording support
7. ✅ Build analytics dashboard
8. ✅ Add AI suggestion generation
9. ✅ Implement draft recovery
10. ✅ Test on iOS and Android

---

## Support

For questions or issues:
- Email: support@dailyhush.com
- Docs: https://docs.dailyhush.com
- GitHub: https://github.com/dailyhush/mobile-app

---

## License

Proprietary - DailyHush, Inc. All rights reserved.
