import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy singleton — only created when env vars are present (at runtime, not at build time)
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a no-op proxy during build / when env vars are not configured
    return null;
  }
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}

// Convenience export — same pattern, returns null if not configured
export const supabase = {
  auth: {
    getSession: async () => {
      const client = getSupabaseClient();
      if (!client) return { data: { session: null }, error: null };
      return client.auth.getSession();
    },
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      const client = getSupabaseClient();
      if (!client) return { data: { user: null }, error: new Error("Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local") };
      return client.auth.signInWithPassword(credentials);
    },
    signOut: async () => {
      const client = getSupabaseClient();
      if (!client) return { error: null };
      return client.auth.signOut();
    },
    onAuthStateChange: (callback: Parameters<ReturnType<typeof createClient>["auth"]["onAuthStateChange"]>[0]) => {
      const client = getSupabaseClient();
      if (!client) return { data: { subscription: { unsubscribe: () => {} } } };
      return client.auth.onAuthStateChange(callback);
    },
  },
};
