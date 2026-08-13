import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import type Database from 'better-sqlite3'

export type PdfRecord = {
  id: string
  title: string
  description: string
  file_name: string
  file_path: string
  uploaded_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  synced_at: string | null
}

let pdfsDir = ''

export function setPdfsDirectory(dir: string) {
  pdfsDir = dir
  fs.mkdirSync(dir, { recursive: true })
}

function nowIso() {
  return new Date().toISOString()
}

export function listPdfs(db: Database.Database): PdfRecord[] {
  return db
    .prepare(
      `SELECT id, title, description, file_name, file_path, uploaded_by, created_at, updated_at, deleted_at, synced_at
       FROM pdfs WHERE deleted_at IS NULL ORDER BY created_at DESC`,
    )
    .all() as PdfRecord[]
}

export function savePdf(
  db: Database.Database,
  input: {
    title: string
    description?: string
    fileName: string
    data: Buffer
    uploadedBy?: string | null
  },
): PdfRecord {
  if (!pdfsDir) throw new Error('PDF storage is not ready')
  const title = input.title.trim() || input.fileName
  const id = randomUUID()
  const safeName = `${id}-${input.fileName.replace(/[^\w.\- ]+/g, '_')}`
  const filePath = path.join(pdfsDir, safeName)
  fs.writeFileSync(filePath, input.data)

  const ts = nowIso()
  db.prepare(
    `INSERT INTO pdfs (id, title, description, file_name, file_path, uploaded_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    title,
    input.description?.trim() ?? '',
    input.fileName,
    filePath,
    input.uploadedBy ?? null,
    ts,
    ts,
  )

  return db.prepare(`SELECT * FROM pdfs WHERE id = ?`).get(id) as PdfRecord
}

export function getPdfData(db: Database.Database, id: string): { fileName: string; base64: string; mime: string } {
  const row = db
    .prepare(`SELECT * FROM pdfs WHERE id = ? AND deleted_at IS NULL`)
    .get(id) as PdfRecord | undefined
  if (!row) throw new Error('PDF not found')
  if (!fs.existsSync(row.file_path)) throw new Error('PDF file is missing on disk')
  const buffer = fs.readFileSync(row.file_path)
  return {
    fileName: row.file_name,
    base64: buffer.toString('base64'),
    mime: 'application/pdf',
  }
}

export function deletePdf(db: Database.Database, id: string) {
  const row = db.prepare(`SELECT * FROM pdfs WHERE id = ?`).get(id) as PdfRecord | undefined
  if (!row) throw new Error('PDF not found')
  const ts = nowIso()
  db.prepare(`UPDATE pdfs SET deleted_at = ?, updated_at = ? WHERE id = ?`).run(ts, ts, id)
  try {
    if (fs.existsSync(row.file_path)) fs.unlinkSync(row.file_path)
  } catch {
    // ignore disk cleanup errors
  }
  return { id, deleted: true }
}
