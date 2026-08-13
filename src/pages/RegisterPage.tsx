import { useState, type FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const err = await register(name, email, password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    navigate("/dashboard");
  }

  return (
    <motion.div
      className="mx-auto max-w-md border border-(--line) bg-(--panel) p-8 shadow-(--shadow) backdrop-blur-md"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="m-0 font-[Fraunces] text-3xl">Create account</h1>
      <p className="mt-2 text-sm text-(--muted)">
        Register as a public user to unlock shared PDF resources and your
        dashboard.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
        <label className="text-sm font-semibold">
          Name
          <input
            className="field mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
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
            minLength={6}
            required
          />
        </label>
        {error && <p className="m-0 text-sm text-(--danger)">{error}</p>}
        <button
          type="submit"
          className="btn primary mt-2"
          disabled={submitting}
        >
          {submitting ? "Creating…" : "Register"}
        </button>
      </form>

      <p className="mt-5 text-sm text-(--muted)">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </motion.div>
  );
}
