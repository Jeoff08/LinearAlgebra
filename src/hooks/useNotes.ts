import { useCallback, useEffect, useState } from 'react'

export type Note = {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  synced_at: string | null
  deleted_at: string | null
}

const memoryNotes = new Map<string, Note>()

function isElectron() {
  return Boolean(window.electronAPI)
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (isElectron()) {
        const rows = (await window.electronAPI!.db.getAll('notes')) as Note[]
        setNotes(rows)
      } else {
        setNotes(Array.from(memoryNotes.values()).sort((a, b) => b.updated_at.localeCompare(a.updated_at)))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const save = useCallback(
    async (input: { id?: string; title: string; content: string }) => {
      if (isElectron()) {
        await window.electronAPI!.db.upsert('notes', input)
      } else {
        const now = new Date().toISOString()
        const id = input.id ?? crypto.randomUUID()
        const existing = memoryNotes.get(id)
        memoryNotes.set(id, {
          id,
          title: input.title,
          content: input.content,
          created_at: existing?.created_at ?? now,
          updated_at: now,
          synced_at: null,
          deleted_at: null,
        })
      }
      await load()
    },
    [load],
  )

  const remove = useCallback(
    async (id: string) => {
      if (isElectron()) {
        await window.electronAPI!.db.remove('notes', id)
      } else {
        memoryNotes.delete(id)
      }
      await load()
    },
    [load],
  )

  useEffect(() => {
    void load()
  }, [load])

  return { notes, loading, save, remove, reload: load }
}
