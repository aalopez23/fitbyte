# Supabase Setup Instructions

## Step 1: Run the SQL Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

This will create:
- All the database tables (profiles, workouts, exercises, goals, nutrition, workout_logs)
- Row Level Security (RLS) policies to ensure users can only access their own data
- A trigger to automatically create a profile when a user signs up

## Step 2: Install Dependencies

```bash
cd client
npm install
```

This will install `@supabase/supabase-js` which is already added to package.json.

## Step 3: Environment Variables (Optional)

The Supabase credentials are already hardcoded in `client/src/lib/supabase.ts`, but you can also create a `.env` file in the `client` folder:

```
REACT_APP_SUPABASE_URL=https://aipyaantkmmamsrhvxae.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpcHlhYW50a21tYW1zcmh2eGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMzU0NTEsImV4cCI6MjA4MTcxMTQ1MX0.H-n0lRcZ5hc68n5Ynk54kYe7Z30hN96yHui_Lb-dRrQ
```

## Step 4: Test the Application

```bash
cd client
npm start
```

You should now be able to:
- Sign up with email/password
- Log in
- Create workouts, goals, and nutrition entries
- View progress dashboards

## Step 5: Deploy to GitHub Pages

1. Build the app:
   ```bash
   cd client
   npm run build
   ```

2. Push to GitHub

3. Go to your GitHub repo settings → Pages

4. Set source to the `client/build` folder (or use GitHub Actions)

The app will now work with Supabase backend instead of the Express server!

