export type UserRole = 'admin' | 'user'

export type PublicUser = {
  id: string
  email: string
  name: string
  role: UserRole
  created_at: string
}

export type PdfItem = {
  id: string
  title: string
  description: string
  file_name: string
  created_at: string
}

export type AuthResult =
  | { ok: true; user: PublicUser; token: string }
  | { ok: false; error: string }
