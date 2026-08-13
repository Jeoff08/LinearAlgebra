import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { randomUUID } from 'node:crypto'
import type Database from 'better-sqlite3'

export type UserRole = 'admin' | 'user'

export type PublicUser = {
  id: string
  email: string
  name: string
  role: UserRole
  created_at: string
}

type DbUser = PublicUser & { password_hash: string; salt: string }

const DEFAULT_ADMIN_EMAIL = 'Admin@gmail.com'
const DEFAULT_ADMIN_PASSWORD = 'admin123'

function nowIso() {
  return new Date().toISOString()
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString('hex')
}

function verifyPassword(password: string, salt: string, hash: string) {
  const incoming = Buffer.from(hashPassword(password, salt), 'hex')
  const stored = Buffer.from(hash, 'hex')
  if (incoming.length !== stored.length) return false
  return timingSafeEqual(incoming, stored)
}

export function ensureAuthSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'user')),
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pdfs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      uploaded_by TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      deleted_at TEXT,
      synced_at TEXT,
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    );
  `)

  seedDefaultAdmin(db)
}

function seedDefaultAdmin(db: Database.Database) {
  const existing = db
    .prepare(`SELECT id FROM users WHERE email = ? COLLATE NOCASE`)
    .get(DEFAULT_ADMIN_EMAIL) as { id: string } | undefined

  if (existing) return

  const salt = randomBytes(16).toString('hex')
  const password_hash = hashPassword(DEFAULT_ADMIN_PASSWORD, salt)
  db.prepare(
    `INSERT INTO users (id, email, name, role, password_hash, salt, created_at)
     VALUES (?, ?, ?, 'admin', ?, ?, ?)`,
  ).run(randomUUID(), DEFAULT_ADMIN_EMAIL, 'Administrator', password_hash, salt, nowIso())
}

function toPublic(user: DbUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    created_at: user.created_at,
  }
}

export function registerUser(
  db: Database.Database,
  input: { email: string; password: string; name: string },
): PublicUser {
  const email = input.email.trim()
  const name = input.name.trim() || 'User'
  if (!email || !input.password) throw new Error('Email and password are required')
  if (input.password.length < 6) throw new Error('Password must be at least 6 characters')

  const exists = db
    .prepare(`SELECT id FROM users WHERE email = ? COLLATE NOCASE`)
    .get(email) as { id: string } | undefined
  if (exists) throw new Error('An account with this email already exists')

  const salt = randomBytes(16).toString('hex')
  const password_hash = hashPassword(input.password, salt)
  const id = randomUUID()
  const created_at = nowIso()

  db.prepare(
    `INSERT INTO users (id, email, name, role, password_hash, salt, created_at)
     VALUES (?, ?, ?, 'user', ?, ?, ?)`,
  ).run(id, email, name, password_hash, salt, created_at)

  return { id, email, name, role: 'user', created_at }
}

export function loginUser(
  db: Database.Database,
  input: { email: string; password: string },
): { user: PublicUser; token: string } {
  const user = db
    .prepare(`SELECT * FROM users WHERE email = ? COLLATE NOCASE`)
    .get(input.email.trim()) as DbUser | undefined

  if (!user || !verifyPassword(input.password, user.salt, user.password_hash)) {
    throw new Error('Invalid email or password')
  }

  const token = createHash('sha256').update(randomBytes(32)).digest('hex')
  const created_at = nowIso()
  const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString()

  db.prepare(
    `INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)`,
  ).run(token, user.id, created_at, expires_at)

  return { user: toPublic(user), token }
}

export function logoutUser(db: Database.Database, token: string) {
  db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token)
  return { ok: true }
}

export function getSessionUser(db: Database.Database, token: string | null): PublicUser | null {
  if (!token) return null
  const row = db
    .prepare(
      `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > ?`,
    )
    .get(token, nowIso()) as DbUser | undefined
  return row ? toPublic(row) : null
}

export function listUsers(db: Database.Database): PublicUser[] {
  return (
    db.prepare(`SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC`).all() as PublicUser[]
  )
}
