# Linear Algebra

Electron + React (TSX) + Tailwind + Vite math workspace with auth, public calculator, and admin PDF publishing.

## Features

- **Public calculator** (math.js) — algebra, trig, calculus, geometry, linear algebra — no login required
- **Auth** — admin + public users (SQLite in Electron, localStorage fallback in browser)
- **Default admin** — `Admin@gmail.com` / `admin123`
- **Admin PDFs** — upload PDFs that appear on the public page; signed-in users/admin open them in a modal
- Offline SQLite + optional Supabase sync

## Routes

| Path | Access |
|---|---|
| `/` | Public page (calculator + PDF list) |
| `/login` | Login |
| `/register` | Register user |
| `/admin` | Admin only (upload/delete PDFs) |
| `/dashboard` | Signed-in users |

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Stack

React 19 + TypeScript, Vite, Tailwind, React Router, math.js, react-pdf, Framer Motion, Electron, better-sqlite3, Supabase
