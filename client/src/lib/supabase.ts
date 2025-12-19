import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://aipyaantkmmamsrhvxae.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpcHlhYW50a21tYW1zcmh2eGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMzU0NTEsImV4cCI6MjA4MTcxMTQ1MX0.H-n0lRcZ5hc68n5Ynk54kYe7Z30hN96yHui_Lb-dRrQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

