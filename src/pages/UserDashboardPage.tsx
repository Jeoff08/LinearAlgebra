import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserDashboardPage() {
  const { user } = useAuth()

  return (
    <section className="max-w-2xl border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[var(--shadow)] backdrop-blur-md">
      <h1 className="m-0 font-[Fraunces] text-4xl">Welcome, {user?.name}</h1>
      <p className="mt-3 text-[var(--muted)]">
        You are signed in as a public user ({user?.email}). You can use the calculator anytime and open
        admin-uploaded PDFs from the public page.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/" className="btn primary no-underline">
          Go to public page
        </Link>
        <Link to="/topics" className="btn secondary no-underline">
          Browse All Topics
        </Link>
      </div>
    </section>
  )
}