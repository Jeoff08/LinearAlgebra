import { contextBridge, ipcRenderer } from 'electron'

export type SyncStatus = {
  online: boolean
  syncing: boolean
  pending: number
  lastSyncAt: string | null
  lastError: string | null
  configured: boolean
}

export type PublicUser = {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  created_at: string
}

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

export type AuthResult =
  | { ok: true; user: PublicUser; token: string }
  | { ok: false; error: string }

const api = {
  db: {
    getAll: (table: string) => ipcRenderer.invoke('db:getAll', table),
    getById: (table: string, id: string) => ipcRenderer.invoke('db:getById', table, id),
    upsert: (table: string, record: Record<string, unknown>) =>
      ipcRenderer.invoke('db:upsert', table, record),
    remove: (table: string, id: string) => ipcRenderer.invoke('db:remove', table, id),
    query: (sql: string, params?: unknown[]) => ipcRenderer.invoke('db:query', sql, params),
  },
  sync: {
    status: (): Promise<SyncStatus> => ipcRenderer.invoke('sync:status'),
    force: () => ipcRenderer.invoke('sync:force'),
  },
  auth: {
    register: (input: { email: string; password: string; name: string }): Promise<AuthResult> =>
      ipcRenderer.invoke('auth:register', input),
    login: (input: { email: string; password: string }): Promise<AuthResult> =>
      ipcRenderer.invoke('auth:login', input),
    logout: (token: string) => ipcRenderer.invoke('auth:logout', token),
    me: (token: string | null): Promise<PublicUser | null> => ipcRenderer.invoke('auth:me', token),
    listUsers: (token: string): Promise<PublicUser[]> => ipcRenderer.invoke('auth:listUsers', token),
  },
  pdfs: {
    list: (): Promise<PdfRecord[]> => ipcRenderer.invoke('pdfs:list'),
    upload: (input: {
      title: string
      description?: string
      fileName: string
      bytes: number[]
      token: string
    }): Promise<PdfRecord> => ipcRenderer.invoke('pdfs:upload', input),
    getData: (id: string): Promise<{ fileName: string; base64: string; mime: string }> =>
      ipcRenderer.invoke('pdfs:getData', id),
    delete: (input: { id: string; token: string }) => ipcRenderer.invoke('pdfs:delete', input),
  },
}

contextBridge.exposeInMainWorld('electronAPI', api)

export type ElectronAPI = typeof api
