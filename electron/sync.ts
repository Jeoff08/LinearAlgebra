import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import {
  countPendingSync,
  getPendingSyncItems,
  markSynced,
  markSyncFailed,
} from './database'

let supabase: SupabaseClient | null = null
let syncTimer: ReturnType<typeof setInterval> | null = null
let syncing = false
let online = true
let lastSyncAt: string | null = null
let lastError: string | null = null

const SYNC_INTERVAL_MS = 5_000

function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key || url.includes('your-project')) {
    return null
  }

  if (!supabase) {
    supabase = createClient(url, key)
  }
  return supabase
}

async function checkOnline(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    await fetch('https://www.google.com/generate_204', {
      method: 'HEAD',
      signal: controller.signal,
    })
    clearTimeout(timeout)
    online = true
    return true
  } catch {
    online = false
    return false
  }
}

async function pushQueueItem(client: SupabaseClient, item: ReturnType<typeof getPendingSyncItems>[number]) {
  const table = item.table_name

  if (item.operation === 'delete') {
    const { error } = await client.from(table).delete().eq('id', item.record_id)
    if (error) throw error
  } else {
    const payload = item.payload ? JSON.parse(item.payload) : null
    if (!payload) throw new Error('Missing payload for upsert')

    // Soft-delete locally → hard delete remotely, or upsert live rows
    if (payload.deleted_at) {
      const { error } = await client.from(table).delete().eq('id', item.record_id)
      if (error) throw error
    } else {
      const { synced_at: _s, ...row } = payload
      const { error } = await client.from(table).upsert(row, { onConflict: 'id' })
      if (error) throw error
    }
  }

  markSynced(table, item.record_id, item.id)
}

export async function forceSync(): Promise<{
  ok: boolean
  synced: number
  pending: number
  online: boolean
  error?: string
}> {
  if (syncing) {
    return { ok: false, synced: 0, pending: countPendingSync(), online, error: 'Sync already running' }
  }

  syncing = true
  let synced = 0

  try {
    const isOnline = await checkOnline()
    if (!isOnline) {
      return { ok: false, synced: 0, pending: countPendingSync(), online: false, error: 'Offline' }
    }

    const client = getSupabase()
    if (!client) {
      return {
        ok: false,
        synced: 0,
        pending: countPendingSync(),
        online: true,
        error: 'Supabase not configured. Copy .env.example to .env and add your keys.',
      }
    }

    const items = getPendingSyncItems(50)
    for (const item of items) {
      try {
        await pushQueueItem(client, item)
        synced += 1
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        markSyncFailed(item.id, message)
        lastError = message
      }
    }

    lastSyncAt = new Date().toISOString()
    if (synced > 0) lastError = null

    return { ok: true, synced, pending: countPendingSync(), online: true }
  } finally {
    syncing = false
  }
}

export function getSyncStatus() {
  return {
    online,
    syncing,
    pending: countPendingSync(),
    lastSyncAt,
    lastError,
    configured: Boolean(getSupabase()),
  }
}

export function startSyncService() {
  if (syncTimer) return

  // Initial attempt shortly after launch
  setTimeout(() => {
    void forceSync()
  }, 1500)

  syncTimer = setInterval(() => {
    void forceSync()
  }, SYNC_INTERVAL_MS)
}

export function stopSyncService() {
  if (syncTimer) {
    clearInterval(syncTimer)
    syncTimer = null
  }
}
