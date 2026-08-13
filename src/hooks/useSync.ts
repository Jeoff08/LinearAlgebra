import { useCallback, useEffect, useState } from 'react'
import type { SyncStatus } from '../../electron/preload'

const emptyStatus: SyncStatus = {
  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  syncing: false,
  pending: 0,
  lastSyncAt: null,
  lastError: null,
  configured: false,
}

export function useSync(pollMs = 2000) {
  const [status, setStatus] = useState<SyncStatus>(emptyStatus)

  const refresh = useCallback(async () => {
    if (!window.electronAPI) {
      setStatus((s) => ({
        ...s,
        online: navigator.onLine,
        configured: false,
        lastError: 'Running in browser — open with Electron for offline SQLite + sync',
      }))
      return
    }
    const next = await window.electronAPI.sync.status()
    setStatus(next)
  }, [])

  const forceSync = useCallback(async () => {
    if (!window.electronAPI) return null
    const result = await window.electronAPI.sync.force()
    await refresh()
    return result
  }, [refresh])

  useEffect(() => {
    void refresh()
    const id = setInterval(() => void refresh(), pollMs)
    const onOnline = () => void refresh()
    const onOffline = () => void refresh()
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      clearInterval(id)
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [pollMs, refresh])

  return { status, refresh, forceSync }
}
