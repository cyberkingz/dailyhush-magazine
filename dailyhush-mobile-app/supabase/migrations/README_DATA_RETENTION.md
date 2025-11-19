# Data Retention Migration - CRITICAL

## Problem

The original schema had this relationship:

```sql
CREATE TABLE public.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    ...
);
```

When a user deletes their account via `supabase.auth.admin.deleteUser()`, the CASCADE DELETE would trigger a chain reaction:

1. ✅ Auth account deleted
2. ❌ user_profiles deleted (cascaded from auth.users)
3. ❌ spiral_logs deleted (cascaded from user_profiles)
4. ❌ pattern_insights deleted (cascaded from user_profiles)
5. ❌ shift_usage_logs deleted (cascaded from user_profiles)
6. ❌ voice_journals deleted (cascaded from user_profiles)
7. ❌ subscriptions deleted (cascaded from user_profiles)
8. ❌ fire_training_progress deleted (cascaded from user_profiles)

**This deletes ALL user data**, which is not what we want.

## Solution

Remove the foreign key constraint from `user_profiles.user_id` to `auth.users.id`:

```sql
ALTER TABLE public.user_profiles
DROP CONSTRAINT user_profiles_user_id_fkey;
```

Now when auth is deleted:

1. ✅ Auth account deleted
2. ✅ user_profiles RETAINED (no cascade)
3. ✅ All child tables RETAINED (they reference user_profiles, which still exists)

## Why Not Use ON DELETE SET NULL?

You might think we could use:

```sql
REFERENCES auth.users(id) ON DELETE SET NULL
```

But this won't work because:

- It would set `user_id` to NULL when auth is deleted
- RLS policies check `auth.uid() = user_id`
- NULL values break queries and relationships to child tables

## Result

After this migration:

- `user_profiles.user_id` will be an "orphaned" UUID (no matching auth account)
- All user data persists for analytics and product improvement
- User cannot sign in (auth account is gone)
- Data is anonymized from user perspective (no access)

## How to Apply This Migration

### For Existing Production Database:

```bash
# Connect to your Supabase project
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push

# Or run the SQL directly in Supabase SQL Editor:
# Copy the contents of 20251025_remove_auth_cascade_delete.sql
```

### For New Database Setup:

The main `schema.sql` has been updated to reflect this change, so new database setups will automatically have the correct structure.

## Verification

After applying the migration, verify it worked:

```sql
-- Check that the foreign key constraint is gone
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.table_name = 'user_profiles'
  AND tc.constraint_type = 'FOREIGN KEY';
```

Expected result: No rows returned (no foreign key from user_profiles to auth.users)

## Testing Account Deletion

1. Create a test user account
2. Add some data (spiral logs, quiz submissions, etc.)
3. Delete the auth account: `supabase.auth.admin.deleteUser(user_id)`
4. Verify:
   - Auth account is gone (cannot sign in)
   - user_profiles record still exists
   - spiral_logs still exist
   - All other user data still exists

## Apple App Store Compliance

This implementation complies with Apple App Store Review Guideline 5.1.1 (v) which requires in-app account deletion. Apple allows data retention for legitimate business purposes (analytics, fraud prevention) as long as users are clearly informed before deletion.

Our implementation:
✅ Deletes authentication credentials (user cannot sign in)
✅ Clearly informs users that data is retained for analytics
✅ Shows what will be deleted vs. retained in the UI
✅ Complies with data retention regulations (GDPR, CCPA allow retention for analytics)

## Important Notes

- This is a **REQUIRED** migration before launching the app
- Without this migration, account deletion will delete all user data (not what we want)
- The migration is safe and reversible (you can re-add the constraint if needed)
- Child tables still have CASCADE DELETE (when user_profiles is manually deleted, child records are cleaned up)
