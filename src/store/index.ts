import { LocalAdapter } from './local'
import { SupabaseAdapter } from './supabase'
import type { Store } from './types'

export function createStore(): Store {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  if (url && key) return new SupabaseAdapter(url, key)
  return new LocalAdapter()
}

export type { Store, RegisterInput } from './types'
