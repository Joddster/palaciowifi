# Supabase Setup Guide for Newsletter Subscribers

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and anon/public API key

## 2. Create Newsletter Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Enable Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for signup form)
CREATE POLICY "Allow public inserts" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Optional: Create policy for reading (if you want to check duplicates client-side)
CREATE POLICY "Allow public read" ON newsletter_subscribers
  FOR SELECT TO anon
  USING (true);
```

## 3. Install Supabase Client

In your project directory:

```bash
npm install @supabase/supabase-js
```

## 4. Create Supabase Config File

Create `supabase-client.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 5. Update app.js

Replace the TODO section in `app.js` with:

```javascript
// Import at the top of file
import { supabase } from './supabase-client.js'

// In the newsletter form submission handler:
const { data, error } = await supabase
  .from('newsletter_subscribers')
  .insert([{
    first_name: formData.firstName,
    last_name: formData.lastName,
    phone: formData.phone,
    email: formData.email,
  }]);

if (error) {
  if (error.code === '23505') {
    // Duplicate email
    alert('This email is already subscribed!');
  } else {
    throw error;
  }
  return;
}
```

## 6. Environment Variables (for Vercel)

In your Vercel project settings, add these environment variables:

```
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
```

Then update your code to use:

```javascript
const supabaseUrl = process.env.SUPABASE_URL || 'fallback_url'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'fallback_key'
```

## 7. Optional: Email Notifications

To get email notifications when someone subscribes, use Supabase Database Webhooks or Edge Functions:

### Option A: Database Webhook (Simple)

1. In Supabase Dashboard → Database → Webhooks
2. Create new webhook on `newsletter_subscribers` table
3. Point to a service like Zapier, Make.com, or your own API endpoint

### Option B: Edge Function (Advanced)

```sql
-- Create function to send notification
CREATE OR REPLACE FUNCTION notify_new_subscriber()
RETURNS trigger AS $$
BEGIN
  -- Add your notification logic here
  -- Could trigger email via SendGrid, Mailgun, etc.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER on_subscriber_created
  AFTER INSERT ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_subscriber();
```

## 8. View Subscribers

To view all subscribers in Supabase:

```sql
SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC;
```

## Security Notes

- The anon key is safe to expose client-side (it's rate-limited)
- RLS policies protect your data
- For admin operations (exporting CSV, etc.), use the service_role key server-side only
- Consider adding reCAPTCHA to prevent spam signups

## Testing

1. Submit the form on your site
2. Check Supabase Dashboard → Table Editor → newsletter_subscribers
3. You should see the new entry

## Export Subscribers (for email campaigns)

```sql
-- Export to CSV via Supabase Dashboard
SELECT 
  first_name, 
  last_name, 
  email, 
  phone,
  subscribed_at
FROM newsletter_subscribers
WHERE status = 'active'
ORDER BY subscribed_at DESC;
```

