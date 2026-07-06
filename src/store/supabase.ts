import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Participant } from '../types'
import type { RegisterInput, Store } from './types'

/**
 * Gemeinsames Live-Leaderboard über Supabase (Schema: supabase/schema.sql).
 * Aktivierung: VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in .env setzen.
 */
export class SupabaseAdapter implements Store {
  readonly shared = true
  private client: SupabaseClient

  constructor(url: string, anonKey: string) {
    this.client = createClient(url, anonKey)
  }

  async load(): Promise<Participant[]> {
    const { data, error } = await this.client
      .from('participants')
      .select('id, name, instagram, goal_laps, created_at, laps(id, created_at)')
      .order('created_at', { ascending: true })
    if (error) throw error
    return (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      instagram: row.instagram ?? undefined,
      goalLaps: row.goal_laps ?? undefined,
      createdAt: row.created_at,
      laps: (row.laps ?? [])
        .map((l: { id: string; created_at: string }) => ({ id: l.id, at: l.created_at }))
        .sort((a, b) => a.at.localeCompare(b.at)),
    }))
  }

  async register(input: RegisterInput): Promise<Participant> {
    const { data, error } = await this.client
      .from('participants')
      .insert({
        name: input.name.trim(),
        instagram: input.instagram?.trim().replace(/^@/, '') || null,
        goal_laps: input.goalLaps ?? null,
      })
      .select()
      .single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      instagram: data.instagram ?? undefined,
      goalLaps: data.goal_laps ?? undefined,
      createdAt: data.created_at,
      laps: [],
    }
  }

  async addLap(participantId: string): Promise<void> {
    const { error } = await this.client.from('laps').insert({ participant_id: participantId })
    if (error) throw error
  }

  async removeLastLap(participantId: string): Promise<void> {
    const { data, error } = await this.client
      .from('laps')
      .select('id')
      .eq('participant_id', participantId)
      .order('created_at', { ascending: false })
      .limit(1)
    if (error) throw error
    if (data?.length) {
      const { error: delError } = await this.client.from('laps').delete().eq('id', data[0].id)
      if (delError) throw delError
    }
  }

  subscribe(onChange: () => void): () => void {
    const channel = this.client
      .channel('timo30h-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'laps' }, onChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, onChange)
      .subscribe()
    return () => {
      this.client.removeChannel(channel)
    }
  }
}
