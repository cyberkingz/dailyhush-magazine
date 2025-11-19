# Supabase Edge Functions

This directory contains Supabase Edge Functions that run server-side to handle operations requiring elevated privileges.

## Available Functions

### `delete-account`

Securely deletes a user's account including all associated data. Requires server-side execution because it uses the service role key to access `auth.admin.deleteUser()`.

## Prerequisites

1. Install Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:

   ```bash
   supabase login
   ```

3. Link your project (you'll need your project ref from Supabase dashboard):
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

## Deploying Functions

### Deploy All Functions

```bash
supabase functions deploy
```

### Deploy Specific Function

```bash
supabase functions deploy delete-account
```

### Deploy with Environment Variables

The Edge Functions automatically have access to:

- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Your public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (admin privileges)

No additional secrets needed for `delete-account` function.

## Testing Functions Locally

1. Start Supabase locally:

   ```bash
   supabase start
   ```

2. Serve functions locally:

   ```bash
   supabase functions serve delete-account
   ```

3. Test with curl:
   ```bash
   curl -i --location --request POST 'http://localhost:54321/functions/v1/delete-account' \
     --header 'Authorization: Bearer YOUR_USER_ACCESS_TOKEN' \
     --header 'Content-Type: application/json'
   ```

## Required Supabase Setup

### Enable Edge Functions

Make sure Edge Functions are enabled in your Supabase project dashboard:

1. Go to your project dashboard
2. Navigate to Edge Functions
3. Enable if not already enabled

### CORS Configuration

Edge Functions include CORS headers to allow client-side requests from your app.

## Security Notes

- Edge Functions run server-side with access to the service role key
- The `delete-account` function verifies the user is authenticated before deletion
- Users can only delete their own accounts (verified by checking the auth token)
- All deletions are logged in the function logs for audit purposes

## Monitoring

View function logs in the Supabase dashboard:

1. Go to Edge Functions
2. Click on the function name
3. View Logs tab

Or via CLI:

```bash
supabase functions logs delete-account
```

## Troubleshooting

### "Function not found" error

- Make sure you've deployed the function: `supabase functions deploy delete-account`
- Check the function name matches exactly in your client code

### "Unauthorized" error

- Verify the user has a valid access token
- Check that the Authorization header is being sent correctly

### "Service role key not found" error

- Make sure your project is properly linked
- The service role key is automatically injected by Supabase

## Development Workflow

1. Make changes to function code in `supabase/functions/[function-name]/index.ts`
2. Test locally: `supabase functions serve [function-name]`
3. Deploy: `supabase functions deploy [function-name]`
4. Monitor logs for any issues

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Deploy Docs](https://deno.com/deploy/docs)
