# Contact Form Setup

To make the contact form work, you need to run the database migration to create the contact submissions table.

## Option 1: Using Supabase CLI (Recommended)

If you have Supabase CLI installed:

```bash
supabase db push
```

This will apply the migration file `supabase/migrations/002_create_contact_submissions_table.sql`.

## Option 2: Manual SQL Execution

If you don't have Supabase CLI, you can run the SQL manually in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/002_create_contact_submissions_table.sql`
4. Execute the query

## What This Creates

The migration creates:

- `contact_submissions` table to store form submissions
- Proper indexes for performance
- Row Level Security (RLS) policies allowing:
  - Anonymous users to submit forms
  - Authenticated users (admins) to read/update submissions
- Analytics view for admin dashboard
- Automatic timestamp updates

## Features

The contact form now:

✅ **Saves submissions to database** with full tracking data
✅ **Validates all fields** with proper error messages  
✅ **Shows success/error states** with user-friendly messages
✅ **Tracks analytics** (UTM parameters, browser info, etc.)
✅ **Matches design** with newsletter form styling
✅ **Fully accessible** with ARIA labels and keyboard navigation

## Admin Access

Contact submissions can be viewed and managed through the admin dashboard (when implemented) or directly in the Supabase dashboard under the `contact_submissions` table.

## Next Steps

Consider adding:
- Email notifications when new submissions arrive
- Admin interface to manage submissions
- Auto-reply functionality
- Spam protection (reCAPTCHA)