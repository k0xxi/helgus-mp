import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not configured. Copy .env.local.example to .env.local and add your credentials.'
  )
}

// Custom lock implementation that doesn't use navigator.locks (which can hang in some environments)
const noopLock = async <T>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<T>
): Promise<T> => {
  return fn()
}

// Create typed Supabase client
// When env vars are missing, placeholder values allow the app to load (for design preview)
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      lock: noopLock,
    },
    global: {
      fetch: fetch.bind(globalThis),
    },
  }
)
