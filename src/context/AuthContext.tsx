import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../lib/api'
import type { PublicUser } from '../types/models'

const TOKEN_KEY = 'la_auth_token'

type AuthContextValue = {
  user: PublicUser | null
  token: string | null
  loading: boolean
  isAdmin: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<string | null>
  register: (name: string, email: string, password: string) => Promise<string | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const me = await api.me(token)
        if (!alive) return
        if (!me) {
          localStorage.removeItem(TOKEN_KEY)
          setToken(null)
          setUser(null)
        } else {
          setUser(me)
        }
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [token])

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login({ email, password })
    if (!result.ok) return result.error
    localStorage.setItem(TOKEN_KEY, result.token)
    setToken(result.token)
    setUser(result.user)
    return null
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = await api.register({ name, email, password })
    if (!result.ok) return result.error
    localStorage.setItem(TOKEN_KEY, result.token)
    setToken(result.token)
    setUser(result.user)
    return null
  }, [])

  const logout = useCallback(async () => {
    if (token) await api.logout(token)
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [token])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAdmin: user?.role === 'admin',
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
