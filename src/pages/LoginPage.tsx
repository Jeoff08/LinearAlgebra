import { useState, type FormEvent, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = (location.state as { message?: string } | null)?.message;

  const [email, setEmail] = useState("Admin@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const err = await login(email, password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    navigate("/");
  }

  return (
    <motion.div
      className="mx-auto max-w-md border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[var(--shadow)] backdrop-blur-md"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="m-0 font-[Fraunces] text-3xl">Sign in</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Sign in with your registered user account to unlock shared resources.
      </p>
      {message && <p className="mt-3 text-sm text-[#7a4a12]">{message}</p>}

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
        <label className="text-sm font-semibold">
          Email
          <input
            className="field mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="text-sm font-semibold">
          Password
          <input
            className="field mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="m-0 text-sm text-[var(--danger)]">{error}</p>}
        <button
          type="submit"
          className="btn primary mt-2"
          disabled={submitting}
        >
          {submitting ? "Signing in…" : "Login"}
        </button>
      </form>

      <p className="mt-5 text-sm text-[var(--muted)]">
        New here? <Link to="/register">Create a user account</Link>
      </p>
    </motion.div>
  );
}
