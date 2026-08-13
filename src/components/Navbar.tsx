import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-semibold tracking-wide transition ${
    isActive
      ? "text-(--moss-deep) border-b-2 border-(--moss)"
      : "text-(--muted) hover:text-(--ink)"
  }`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="relative z-20 mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-(--line) pb-4">
      <div>
        <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-(--moss)">
          Linear Algebra Lab
        </p>
        <Link
          to="/"
          className="font-[Fraunces] text-3xl font-bold tracking-tight text-(--ink) no-underline"
        >
          Math Workspace
        </Link>
      </div>

      <nav className="flex flex-wrap items-center gap-1">
        <NavLink to="/" end className={linkClass}>
          Public
        </NavLink>
        {/* Admin panel removed; only login/register remain */}
        {isAuthenticated && (
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
        )}
        {!isAuthenticated ? (
          <>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Register
            </NavLink>
          </>
        ) : (
          <div className="ml-2 flex items-center gap-3">
            <span className="text-sm text-(--muted)">
              {user?.name} ·{" "}
              <strong className="text-(--ink)">{user?.role}</strong>
            </span>
            <button
              type="button"
              className="btn ghost"
              onClick={() => void logout()}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
