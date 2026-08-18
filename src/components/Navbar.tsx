import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sparkles, Calculator, LogIn, UserPlus, LogOut, Layers, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
      isActive
        ? isDark
          ? "text-[#B6FF2E] bg-white/10 shadow-sm"
          : "text-[#1F2329] bg-black/10 shadow-sm"
        : isDark
          ? "text-slate-200 hover:text-[#B6FF2E] hover:bg-white/5"
          : "text-slate-800 hover:text-black hover:bg-black/5"
    }`;

  return (
    <header className={`relative z-30 mb-6 py-2 transition-colors duration-300 ${
      isDark ? "text-white" : "text-[#1F2329]"
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <Link to="/" className="group flex items-center gap-3 no-underline">
          <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#B6FF2E] via-lime-400 to-[#1F2329] p-0.5 shadow-lg shadow-[#B6FF2E]/20 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[#B6FF2E]/35">
            <div className={`flex h-full w-full items-center justify-center rounded-[10px] transition-colors ${
              isDark ? "bg-[#14171B] text-[#B6FF2E] group-hover:bg-[#1F2329]" : "bg-[#1F2329] text-[#B6FF2E] group-hover:bg-black"
            }`}>
              <span className="font-mono text-base font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-tr from-[#B6FF2E] to-white">
                λ
              </span>
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B6FF2E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B6FF2E]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[0.68rem] font-bold uppercase tracking-[0.2em] ${
                isDark ? "text-transparent bg-clip-text bg-gradient-to-r from-[#B6FF2E] to-lime-300" : "text-[#1F2329]"
              }`}>
                Linear Algebra Lab
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold ${
                isDark ? "bg-[#14171B] text-[#B6FF2E]" : "bg-[#1F2329] text-[#B6FF2E]"
              }`}>
                v2.0
              </span>
            </div>
            <h1 className={`m-0 font-[Fraunces] text-lg sm:text-2xl font-bold tracking-tight transition-colors ${
              isDark ? "text-white group-hover:text-[#B6FF2E]" : "text-[#1F2329] group-hover:text-black"
            }`}>
              Math Workspace
            </h1>
          </div>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <NavLink
            to="/"
            end
            className={navLinkClass}
            style={({ isActive }) => ({
              color: isActive
                ? (isDark ? "#B6FF2E" : "#FFFFFF")
                : (isDark ? "#F8FAFC" : "#0F172A")
            })}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Public</span>
          </NavLink>

          <NavLink
            to="/calculators"
            className={navLinkClass}
            style={({ isActive }) => ({
              color: isActive
                ? (isDark ? "#B6FF2E" : "#FFFFFF")
                : (isDark ? "#F8FAFC" : "#0F172A")
            })}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculators</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={navLinkClass}
              style={({ isActive }) => ({
                color: isActive
                  ? (isDark ? "#B6FF2E" : "#FFFFFF")
                  : (isDark ? "#F8FAFC" : "#0F172A")
              })}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </NavLink>
          )}

          {/* Theme Toggle Button */}
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200 ${
              isDark
                ? "bg-white/10 text-[#B6FF2E] hover:bg-white/20"
                : "bg-black/10 text-[#1F2329] hover:bg-black/15"
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            <div className="relative flex h-4 w-4 items-center justify-center">
              <Sun
                className={`absolute h-4 w-4 text-[#B6FF2E] transition-all duration-300 ease-out transform ${
                  isDark
                    ? "rotate-0 scale-100 opacity-100 drop-shadow-[0_0_8px_rgba(182,255,46,0.8)]"
                    : "rotate-90 scale-0 opacity-0 pointer-events-none"
                }`}
              />
              <Moon
                className={`absolute h-4 w-4 text-[#1F2329] transition-all duration-300 ease-out transform ${
                  !isDark
                    ? "rotate-0 scale-100 opacity-100 drop-shadow-[0_0_6px_rgba(31,35,41,0.4)]"
                    : "-rotate-90 scale-0 opacity-0 pointer-events-none"
                }`}
              />
            </div>
          </motion.button>

          <div className={`h-5 w-px mx-1 hidden sm:block ${isDark ? "bg-[#333A46]/60" : "bg-slate-300/60"}`} />

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-colors duration-200 flex items-center gap-1.5 rounded-xl ${
                  isDark ? "text-slate-100 hover:text-[#B6FF2E] hover:bg-[#14171B]/60" : "text-slate-900 hover:text-black hover:bg-slate-100"
                }`}
                style={{
                  color: isDark ? "#F8FAFC" : "#0F172A"
                }}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </NavLink>

              <NavLink
                to="/register"
                className="relative inline-flex items-center gap-1.5 rounded-xl bg-[#B6FF2E] px-3.5 py-1.5 text-xs sm:text-sm font-bold text-[#1F2329] shadow-md shadow-[#B6FF2E]/25 transition-all duration-300 hover:scale-105 hover:bg-[#C6FF4D] hover:shadow-lg hover:shadow-[#B6FF2E]/40"
                style={{
                  color: "#1F2329"
                }}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className={`text-xs font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  {user?.name}
                </span>
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#B6FF2E]">
                  {user?.role}
                </span>
              </div>
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-950/20 px-3 py-1.5 text-xs sm:text-sm font-semibold text-rose-400 transition-all duration-200 hover:bg-rose-900/30 hover:text-rose-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
