# Account Deletion Fix

## Problem

The app was trying to delete user accounts using `supabase.auth.admin.deleteUser()` from the client side, which resulted in the error:

```
AuthApiError: User not allowed
```

This happens because the admin API requires a service role key that cannot be safely exposed on the client side.

## Solution

Created a **Supabase Edge Function** that runs server-side with proper admin privileges to handle account deletion securely.

## What Was Changed

### 1. Created Edge Function (`supabase/functions/delete-account/index.ts`)

A secure server-side function that:

- ✅ Verifies user authentication
- ✅ Uses service role key (admin privileges)
- ✅ Deletes user profile (triggers cascade delete for all data)
- ✅ Deletes auth user
- ✅ Includes proper CORS headers
- ✅ Includes error handling and logging

### 2. Updated Client Code (`app/settings/delete-account.tsx`)

Changed from:

```typescript
// ❌ This doesn't work from client side
const { error: authError } = await supabase.auth.admin.deleteUser(user.user_id);
```

To:

```typescript
// ✅ Calls secure Edge Function
const response = await fetch(
  `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.session.access_token}`,
      'Content-Type': 'application/json',
    },
  }
);
```

## Deployment Instructions

### Prerequisites

1. **Install Supabase CLI**:

   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:

   ```bash
   supabase login
   ```

3. **Link your project** (get project ref from Supabase dashboard):
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

### Deploy the Edge Function

**Option 1: Use the deployment script**

```bash
cd supabase/functions
./deploy.sh delete-account
```

**Option 2: Deploy manually**

```bash
supabase functions deploy delete-account --no-verify-jwt
```

### Verify Deployment

1. Go to your Supabase dashboard
2. Navigate to **Edge Functions**
3. You should see `delete-account` listed
4. Click on it to view logs and status

## Testing

### Test in the App

1. Build and run the app
2. Create a test account
3. Go to Settings → Delete Account
4. Enter password and confirm deletion
5. Check that:
   - ✅ No "User not allowed" error
   - ✅ Account is successfully deleted
   - ✅ User is redirected to welcome screen
   - ✅ Can't log back in with deleted credentials

### Test via API (Optional)

Get a user access token from your app (check the logs when logging in), then:

```bash
curl -i --location --request POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/delete-account' \
  --header 'Authorization: Bearer YOUR_USER_ACCESS_TOKEN' \
  --header 'Content-Type: application/json'
```

Expected response:

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

## Security Notes

✅ **Secure** - Edge Function runs server-side with service role key
✅ **User-Verified** - Function verifies auth token before deletion
✅ **Self-Service Only** - Users can only delete their own accounts
✅ **Audit Trail** - All deletions logged in Edge Function logs
✅ **No Client Secrets** - Service role key never exposed to client

## What Gets Deleted

When a user deletes their account, the Edge Function removes:

1. **Auth User** - From `auth.users` table
2. **User Profile** - From `user_profiles` table
3. **All Associated Data** (via cascade delete):
   - Spiral logs
   - Pattern insights
   - Trigger categories
   - F.I.R.E. progress
   - Shift device pairings
   - Quiz submissions

## Monitoring

### View Logs in Dashboard

1. Go to Supabase Dashboard
2. Navigate to Edge Functions → delete-account
3. Click "Logs" tab

### View Logs via CLI

```bash
supabase functions logs delete-account
```

### Follow Live Logs

```bash
supabase functions logs delete-account --follow
```

## Troubleshooting

### "Function not found" Error

**Problem**: Client gets 404 when calling Edge Function
**Solution**: Make sure function is deployed:

```bash
supabase functions deploy delete-account
```

### "Unauthorized" Error

**Problem**: Function returns 401 Unauthorized
**Solutions**:

- Verify user is logged in
- Check that access token is being sent correctly
- Ensure token hasn't expired

### "Service role key not found" Error

**Problem**: Function can't access service role key
**Solutions**:

- Verify project is linked: `supabase link --project-ref YOUR_REF`
- Re-deploy the function
- Check that Edge Functions are enabled in your project

### Deployment Fails

**Problem**: `supabase functions deploy` fails
**Solutions**:

- Verify Supabase CLI is installed: `supabase --version`
- Login again: `supabase login`
- Check internet connection
- Verify project ref is correct

## File Structure

```
supabase/
├── functions/
│   ├── delete-account/
│   │   └── index.ts          # Edge Function code
│   ├── deploy.sh             # Deployment helper script
│   └── README.md             # Edge Functions documentation
└── migrations/               # Database migrations (existing)
```

## Environment Variables

The Edge Function automatically has access to these environment variables (no setup needed):

- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Admin privileges key

## Next Steps

1. ✅ Deploy the Edge Function (see instructions above)
2. ✅ Test account deletion in your app
3. ✅ Monitor the logs for any issues
4. ✅ Update your app in production

## References

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Auth Admin API](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser)
- [Deno Deploy](https://deno.com/deploy/docs)
