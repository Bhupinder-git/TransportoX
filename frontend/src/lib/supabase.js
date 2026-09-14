import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
)?.trim();
const hasPlaceholder = (value) =>
  !value ||
  value.includes("YOUR_PROJECT_REF") ||
  value.includes("YOUR_SUPABASE");

export const supabaseConfigError = hasPlaceholder(url)
  ? "VITE_SUPABASE_URL is missing or invalid."
  : hasPlaceholder(key)
    ? "Set VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) in Vercel and redeploy."
    : null;
export const isSupabaseConfigured = !supabaseConfigError;
export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
