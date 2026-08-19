import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/database.types';

// Privileged Server-Side Client
// This client bypasses Row Level Security (RLS) entirely.
// NEVER expose this client to the frontend or return it from an action directly.
// Only use it to run internal, secure, and validated server-side logic (e.g. RPC calls).

export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase Service Role/Secret key or URL is not configured.');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
};
