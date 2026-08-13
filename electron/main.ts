import { config as loadEnv } from 'dotenv'
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initDatabase, closeDatabase, getDb } from './database'
import { startSyncService, stopSyncService, getSyncStatus, forceSync } from './sync'
import * as db from './database'
import {
  getSessionUser,
  listUsers,
  loginUser,
  logoutUser,
  registerUser,
} from './auth'
import { deletePdf, getPdfData, listPdfs, savePdf } from './pdfs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

loadEnv({ path: path.join(process.cwd(), '.env') })
loadEnv({ path: path.join(__dirname, '../.env') })

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null = null
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

function createWindow() {
  win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    title: 'Linear Algebra',
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST!, 'index.html'))
  }
}

function registerIpc() {
  ipcMain.handle('db:getAll', (_e, table: string) => db.getAll(table))
  ipcMain.handle('db:getById', (_e, table: string, id: string) => db.getById(table, id))
  ipcMain.handle('db:upsert', (_e, table: string, record: Record<string, unknown>) =>
    db.upsert(table, record),
  )
  ipcMain.handle('db:remove', (_e, table: string, id: string) => db.remove(table, id))
  ipcMain.handle('db:query', (_e, sql: string, params?: unknown[]) => db.query(sql, params))
  ipcMain.handle('sync:status', () => getSyncStatus())
  ipcMain.handle('sync:force', () => forceSync())

  ipcMain.handle('auth:register', (_e, input: { email: string; password: string; name: string }) => {
    try {
      registerUser(getDb(), input)
      const session = loginUser(getDb(), { email: input.email, password: input.password })
      return { ok: true as const, user: session.user, token: session.token }
    } catch (err) {
      return { ok: false as const, error: err instanceof Error ? err.message : String(err) }
    }
  })

  ipcMain.handle('auth:login', (_e, input: { email: string; password: string }) => {
    try {
      const session = loginUser(getDb(), input)
      return { ok: true as const, user: session.user, token: session.token }
    } catch (err) {
      return { ok: false as const, error: err instanceof Error ? err.message : String(err) }
    }
  })

  ipcMain.handle('auth:logout', (_e, token: string) => logoutUser(getDb(), token))

  ipcMain.handle('auth:me', (_e, token: string | null) => getSessionUser(getDb(), token))

  ipcMain.handle('auth:listUsers', (_e, token: string) => {
    const user = getSessionUser(getDb(), token)
    if (!user || user.role !== 'admin') throw new Error('Admin only')
    return listUsers(getDb())
  })

  ipcMain.handle('pdfs:list', () => listPdfs(getDb()))

  ipcMain.handle(
    'pdfs:upload',
    (
      _e,
      input: {
        title: string
        description?: string
        fileName: string
        bytes: number[]
        token: string
      },
    ) => {
      const user = getSessionUser(getDb(), input.token)
      if (!user || user.role !== 'admin') throw new Error('Only admin can upload PDFs')
      return savePdf(getDb(), {
        title: input.title,
        description: input.description,
        fileName: input.fileName,
        data: Buffer.from(input.bytes),
        uploadedBy: user.id,
      })
    },
  )

  ipcMain.handle('pdfs:getData', (_e, id: string) => getPdfData(getDb(), id))

  ipcMain.handle('pdfs:delete', (_e, input: { id: string; token: string }) => {
    const user = getSessionUser(getDb(), input.token)
    if (!user || user.role !== 'admin') throw new Error('Only admin can delete PDFs')
    return deletePdf(getDb(), input.id)
  })
}

app.whenReady().then(() => {
  initDatabase(app.getPath('userData'))
  startSyncService()
  registerIpc()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  stopSyncService()
  closeDatabase()
  if (process.platform !== 'darwin') app.quit()
})
