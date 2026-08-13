import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

export function ProtectedRoute({
  children,
  role,
}: {
  children: ReactNode
  role?: 'admin' | 'user'
}) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <p className="text-[var(--muted)]">Checking session…</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
