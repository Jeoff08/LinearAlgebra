/// <reference types="vite/client" />

import type { ElectronAPI } from '../electron/preload'

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
