import Database from 'better-sqlite3'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { ensureAuthSchema } from './auth'
import { setPdfsDirectory } from './pdfs'

let db: Database.Database | null = null

/** Tables that sync to Supabase. Add more as your schema grows. */
export const SYNC_TABLES = ['notes', 'documents'] as const
export type SyncTable = (typeof SYNC_TABLES)[number]

export function initDatabase(userDataPath: string) {
  const dbPath = path.join(userDataPath, 'linear-algebra.db')
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      file_path TEXT,
      meta_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced_at TEXT,
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      operation TEXT NOT NULL CHECK(operation IN ('upsert', 'delete')),
      payload TEXT,
      created_at TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_sync_queue_pending ON sync_queue(created_at);
  `)

  ensureAuthSchema(db)
  setPdfsDirectory(path.join(userDataPath, 'pdfs'))

  return db
}

export function getDb() {
  return requireDb()
}

function requireDb(): Database.Database {
  if (!db) throw new Error('Database not initialized')
  return db
}

export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}

function nowIso() {
  return new Date().toISOString()
}

function enqueue(table: string, recordId: string, operation: 'upsert' | 'delete', payload?: object) {
  requireDb()
    .prepare(
      `INSERT INTO sync_queue (table_name, record_id, operation, payload, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(table, recordId, operation, payload ? JSON.stringify(payload) : null, nowIso())
}

export function getAll(table: string) {
  assertTable(table)
  return requireDb()
    .prepare(`SELECT * FROM ${table} WHERE deleted_at IS NULL ORDER BY updated_at DESC`)
    .all()
}

export function getById(table: string, id: string) {
  assertTable(table)
  return requireDb()
    .prepare(`SELECT * FROM ${table} WHERE id = ? AND deleted_at IS NULL`)
    .get(id)
}

export function upsert(table: string, record: Record<string, unknown>) {
  assertTable(table)
  const id = (record.id as string) || randomUUID()
  const ts = nowIso()
  const existing = requireDb().prepare(`SELECT id FROM ${table} WHERE id = ?`).get(id) as
    | { id: string }
    | undefined

  if (table === 'notes') {
    const title = String(record.title ?? '')
    const content = String(record.content ?? '')
    if (existing) {
      requireDb()
        .prepare(
          `UPDATE notes SET title = ?, content = ?, updated_at = ?, synced_at = NULL, deleted_at = NULL WHERE id = ?`,
        )
        .run(title, content, ts, id)
    } else {
      requireDb()
        .prepare(
          `INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
        )
        .run(id, title, content, ts, ts)
    }
  } else if (table === 'documents') {
    const name = String(record.name ?? '')
    const filePath = record.file_path != null ? String(record.file_path) : null
    const metaJson =
      typeof record.meta_json === 'string'
        ? record.meta_json
        : JSON.stringify(record.meta_json ?? {})
    if (existing) {
      requireDb()
        .prepare(
          `UPDATE documents SET name = ?, file_path = ?, meta_json = ?, updated_at = ?, synced_at = NULL, deleted_at = NULL WHERE id = ?`,
        )
        .run(name, filePath, metaJson, ts, id)
    } else {
      requireDb()
        .prepare(
          `INSERT INTO documents (id, name, file_path, meta_json, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .run(id, name, filePath, metaJson, ts, ts)
    }
  }

  const row = requireDb().prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id) as Record<
    string,
    unknown
  >
  enqueue(table, id, 'upsert', row)
  return row
}

export function remove(table: string, id: string) {
  assertTable(table)
  const ts = nowIso()
  requireDb()
    .prepare(`UPDATE ${table} SET deleted_at = ?, updated_at = ?, synced_at = NULL WHERE id = ?`)
    .run(ts, ts, id)
  enqueue(table, id, 'delete')
  return { id, deleted: true }
}

export function query(sql: string, params: unknown[] = []) {
  const stmt = requireDb().prepare(sql)
  if (/^\s*select/i.test(sql)) return stmt.all(...params)
  return stmt.run(...params)
}

export function getPendingSyncItems(limit = 50) {
  return requireDb()
    .prepare(`SELECT * FROM sync_queue ORDER BY created_at ASC LIMIT ?`)
    .all(limit) as Array<{
    id: number
    table_name: string
    record_id: string
    operation: 'upsert' | 'delete'
    payload: string | null
    created_at: string
    attempts: number
    last_error: string | null
  }>
}

export function markSynced(table: string, recordId: string, queueId: number) {
  const ts = nowIso()
  requireDb()
    .prepare(`UPDATE ${table} SET synced_at = ? WHERE id = ?`)
    .run(ts, recordId)
  requireDb().prepare(`DELETE FROM sync_queue WHERE id = ?`).run(queueId)
}

export function markSyncFailed(queueId: number, error: string) {
  requireDb()
    .prepare(
      `UPDATE sync_queue SET attempts = attempts + 1, last_error = ? WHERE id = ?`,
    )
    .run(error, queueId)
}

export function countPendingSync() {
  const row = requireDb().prepare(`SELECT COUNT(*) as count FROM sync_queue`).get() as {
    count: number
  }
  return row.count
}

function assertTable(table: string): asserts table is SyncTable {
  if (!(SYNC_TABLES as readonly string[]).includes(table)) {
    throw new Error(`Unknown or non-syncable table: ${table}`)
  }
}
