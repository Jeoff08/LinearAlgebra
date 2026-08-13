import type { AuthResult, PdfItem, PublicUser } from '../types/models'
import { localApi } from './localStore'

function isElectron() {
  return Boolean(window.electronAPI)
}

export const api = {
  async register(input: { email: string; password: string; name: string }): Promise<AuthResult> {
    if (isElectron()) return window.electronAPI!.auth.register(input)
    return localApi.register(input)
  },

  async login(input: { email: string; password: string }): Promise<AuthResult> {
    if (isElectron()) return window.electronAPI!.auth.login(input)
    return localApi.login(input)
  },

  async logout(token: string) {
    if (isElectron()) return window.electronAPI!.auth.logout(token)
    return localApi.logout()
  },

  async me(token: string | null): Promise<PublicUser | null> {
    if (isElectron()) return window.electronAPI!.auth.me(token)
    return localApi.me(token)
  },

  async listPdfs(): Promise<PdfItem[]> {
    if (isElectron()) {
      const rows = await window.electronAPI!.pdfs.list()
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        file_name: r.file_name,
        created_at: r.created_at,
      }))
    }
    return localApi.listPdfs()
  },

  async uploadPdf(input: {
    title: string
    description?: string
    fileName: string
    bytes: number[]
    token: string
  }): Promise<PdfItem> {
    if (isElectron()) {
      const row = await window.electronAPI!.pdfs.upload(input)
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        file_name: row.file_name,
        created_at: row.created_at,
      }
    }
    return localApi.uploadPdf(input)
  },

  async getPdfData(id: string) {
    if (isElectron()) return window.electronAPI!.pdfs.getData(id)
    return localApi.getPdfData(id)
  },

  async deletePdf(id: string, token: string) {
    if (isElectron()) return window.electronAPI!.pdfs.delete({ id, token })
    return localApi.deletePdf(id)
  },
}
