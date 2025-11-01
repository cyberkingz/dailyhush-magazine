# Mood Entries Quick Reference

**Quick reference for developers implementing the therapeutic mood capture flow.**

---

## 🚀 Quick Start (5 minutes)

```bash
# 1. Run migration
cd supabase && supabase db push

# 2. Install dependencies (if not already installed)
npm install expo-secure-store @tanstack/react-query

# 3. Import in your component
import { createMoodEntry, updateMoodEntry } from '@/lib/mood-entries';
import { MoodType } from '@/types/mood-entries';
```

---

## 📝 Common Operations

### Create Entry
```typescript
const entry = await createMoodEntry(userId);
// Returns: { id: '...', status: 'draft', ... }
```

### Update Entry (Auto-Save)
```typescript
await updateMoodEntry(entryId, {
  mood_type: MoodType.CALM,
  intensity_rating: 4,
  journal_text: 'I feel peaceful today.',
});
```

### Complete Entry
```typescript
await completeMoodEntry(entryId, timeSpentSeconds, suggestionAccepted);
```

### List Entries
```typescript
const { entries, total_count, has_more } = await listMoodEntries(userId, {
  limit: 20,
  offset: 0,
  include_drafts: false,
});
```

### Get Patterns
```typescript
const patterns = await getMoodPatterns(userId, 30);
// Returns: { total_entries, most_common_mood, avg_intensity, ... }
```

---

## 🔐 Encryption

### Setup (Onboarding)
```typescript
await generateEncryptionKey(userId, password);
```

### Unlock (Login)
```typescript
await unlockEncryptionKey(userId, password);
```

### Clear (Logout)
```typescript
await clearEncryptionKeys();
```

### Encrypt/Decrypt
```typescript
const { ciphertext, nonce } = await encryptText('My journal entry');
const plaintext = await decryptText(ciphertext, nonce);
```

---

## 🎨 UI Components

### Mood Selection
```typescript
<MoodSelector
  onSelect={(mood) => {
    setSelectedMood(mood);
    updateMoodEntry(entryId, { mood_type: mood });
  }}
/>
```

### Intensity Rating
```typescript
<IntensityRating
  value={intensity}
  onChange={(value) => {
    setIntensity(value);
    updateMoodEntry(entryId, { intensity_rating: value });
  }}
/>
```

### Free Writing (with Auto-Save)
```typescript
const [journalText, setJournalText] = useState('');

useEffect(() => {
  const timeoutId = setTimeout(() => {
    updateMoodEntry(entryId, { journal_text: journalText });
  }, 3000); // Auto-save after 3 seconds

  return () => clearTimeout(timeoutId);
}, [journalText]);

<TextInput
  value={journalText}
  onChangeText={setJournalText}
  multiline
  placeholder="How are you feeling?"
/>
```

---

## 📊 Analytics Queries

### Mood Distribution
```sql
SELECT mood_type, COUNT(*) as count
FROM mood_entries
WHERE user_id = $1 AND status = 'completed' AND deleted_at IS NULL
GROUP BY mood_type
ORDER BY count DESC;
```

### Average Intensity by Mood
```sql
SELECT mood_type, AVG(intensity_rating) as avg_intensity
FROM mood_entries
WHERE user_id = $1 AND status = 'completed' AND deleted_at IS NULL
GROUP BY mood_type;
```

### Entry Frequency (Last 7 Days)
```sql
SELECT DATE(created_at) as date, COUNT(*) as count
FROM mood_entries
WHERE user_id = $1
  AND status = 'completed'
  AND deleted_at IS NULL
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 🧪 Testing Snippets

### Test Encryption
```typescript
const isWorking = await testEncryption();
console.log('Encryption working:', isWorking); // Should be true
```

### Test CRUD
```typescript
// Create
const entry = await createMoodEntry(userId);

// Update
await updateMoodEntry(entry.id, {
  mood_type: MoodType.CALM,
  intensity_rating: 4,
  journal_text: 'Test entry',
});

// Read
const retrieved = await getMoodEntry(entry.id);
console.log('Journal text:', retrieved.journal_text);

// Delete
await deleteMoodEntry(entry.id);
```

---

## 🐛 Common Issues

### Issue: "Encryption key not found"
**Solution**: User needs to unlock with password
```typescript
await unlockEncryptionKey(userId, password);
```

### Issue: Auto-save not working
**Solution**: Check timeout logic and network
```typescript
// Add retry logic
for (let i = 0; i < 3; i++) {
  try {
    await updateMoodEntry(entryId, updates);
    break;
  } catch (error) {
    if (i === 2) throw error;
    await new Promise(r => setTimeout(r, 1000));
  }
}
```

### Issue: "Decryption failed"
**Solution**: Verify key version and nonce
```typescript
const keyValid = await validateEncryptionKey();
if (!keyValid) {
  // Re-authenticate user
}
```

---

## 📱 React Query Hooks

### Mood History
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['mood-entries', userId],
  queryFn: () => listMoodEntries(userId, { limit: 50 }),
});
```

### Mood Patterns
```typescript
const { data: patterns } = useQuery({
  queryKey: ['mood-patterns', userId, 30],
  queryFn: () => getMoodPatterns(userId, 30),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Draft Entries
```typescript
const { data: drafts } = useQuery({
  queryKey: ['mood-drafts', userId],
  queryFn: () => getDraftEntries(userId),
});
```

### Mutation with Optimistic Update
```typescript
const mutation = useMutation({
  mutationFn: updateMoodEntry,
  onMutate: async (variables) => {
    await queryClient.cancelQueries(['mood-entries', variables.entryId]);
    const previous = queryClient.getQueryData(['mood-entries', variables.entryId]);
    queryClient.setQueryData(['mood-entries', variables.entryId], old => ({
      ...old,
      ...variables,
    }));
    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(
      ['mood-entries', variables.entryId],
      context?.previous
    );
  },
});
```

---

## 🎯 Type Definitions

```typescript
// Mood types
enum MoodType {
  CALM = 'calm',
  ANXIOUS = 'anxious',
  SAD = 'sad',
  FRUSTRATED = 'frustrated',
  MIXED = 'mixed',
}

// Entry status
enum MoodEntryStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

// Main interface
interface MoodEntry {
  id: string;
  user_id: string;
  mood_type?: MoodType;
  mood_emoji?: string;
  intensity_rating?: number;
  journal_text?: string;
  status: MoodEntryStatus;
  completed_at?: string;
  created_at: string;
  // ... more fields
}
```

---

## 🔧 Database Functions

### Get User History
```typescript
const { data } = await supabase.rpc('get_user_mood_history', {
  p_user_id: userId,
  p_limit: 50,
  p_offset: 0,
  p_include_drafts: false,
});
```

### Get Patterns
```typescript
const { data } = await supabase.rpc('get_mood_patterns', {
  p_user_id: userId,
  p_days: 30,
});
```

### Cleanup Old Drafts (Admin)
```typescript
const { data: deletedCount } = await supabase.rpc('cleanup_old_mood_drafts');
console.log(`Deleted ${deletedCount} old drafts`);
```

---

## 🌐 API Endpoints (REST Alternative)

If you prefer REST over Supabase client:

```typescript
// POST /api/mood-entries
fetch('/api/mood-entries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: userId }),
});

// PATCH /api/mood-entries/:id
fetch(`/api/mood-entries/${entryId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mood_type: MoodType.CALM,
    intensity_rating: 4,
  }),
});

// GET /api/mood-entries?user_id=:userId&limit=20
fetch(`/api/mood-entries?user_id=${userId}&limit=20`);

// DELETE /api/mood-entries/:id
fetch(`/api/mood-entries/${entryId}`, { method: 'DELETE' });
```

---

## 🔑 Environment Variables

```env
# .env.local
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📦 File Structure

```
dailyhush-mobile-app/
├── lib/
│   ├── mood-entries.ts          # CRUD operations
│   └── encryption.ts             # Encryption library
├── types/
│   ├── mood-entries.ts           # Type definitions
│   └── mood-database.ts          # Database types
├── supabase/
│   └── migrations/
│       └── 20250201_create_mood_entries.sql
├── docs/
│   ├── MOOD_ENTRIES_API.md       # API docs
│   ├── MOOD_ENTRIES_README.md    # Implementation guide
│   └── MOOD_ENTRIES_IMPLEMENTATION_SUMMARY.md
└── app/
    └── mood/
        ├── capture.tsx           # Main flow
        ├── history.tsx           # List view
        └── [id].tsx              # Detail view
```

---

## ⚡ Performance Tips

1. **Use pagination**: Always limit queries to 20-50 items
2. **Cache aggressively**: Use React Query with 5-10 minute stale time
3. **Lazy decrypt**: Only decrypt when user views detail
4. **Background prefetch**: Prefetch next page while viewing current
5. **Debounce auto-save**: Wait 3 seconds after last keystroke

---

## 🔒 Security Checklist

- [ ] Encryption keys stored in SecureStore (not AsyncStorage)
- [ ] HTTPS enabled for all API calls
- [ ] RLS policies enabled on all tables
- [ ] Password strength requirements (min 8 chars)
- [ ] Keys cleared on logout
- [ ] No plaintext in logs
- [ ] Biometric authentication enabled
- [ ] Rate limiting on API endpoints

---

## 📚 Additional Resources

- **Full API Docs**: `/docs/MOOD_ENTRIES_API.md`
- **Implementation Guide**: `/docs/MOOD_ENTRIES_README.md`
- **Summary**: `/docs/MOOD_ENTRIES_IMPLEMENTATION_SUMMARY.md`
- **Supabase Docs**: https://supabase.com/docs
- **Encryption Guide**: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto

---

**Last Updated**: February 1, 2025
**Status**: Production Ready ✅
