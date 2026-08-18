import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";
import TOPICS from "../data/topics/index";
// Remove the broken import: import mathBg from "../assets/Math bg.jpg";
import linearAlgebraLogo from "../assets/Linear Algebra.png";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Binary, 
  Compass, 
  BookOpen, 
  Cpu, 
  Zap, 
  ChevronRight, 
  TrendingUp, 
  RefreshCw, 
  Search, 
  X 
} from "lucide-react";

// Floating mathematical numbers & symbols for GSAP animation - Deep Graphite & Lime Compute theme
const MATH_PARTICLES = [
  { id: 1, text: "λ", size: "text-3xl sm:text-4xl", top: "10%", left: "8%", colorDark: "text-[#B6FF2E]", colorLight: "text-[#1F2329]", blur: "blur-[0.5px]" },
  { id: 2, text: "det(A)", size: "text-xl sm:text-2xl", top: "18%", left: "85%", colorDark: "text-lime-300", colorLight: "text-slate-800", blur: "none" },
  { id: 3, text: "π ≈ 3.1415", size: "text-sm sm:text-base", top: "68%", left: "6%", colorDark: "text-[#B6FF2E]", colorLight: "text-slate-700", blur: "blur-[0.3px]" },
  { id: 4, text: "Ax = b", size: "text-2xl sm:text-3xl", top: "78%", left: "88%", colorDark: "text-lime-400", colorLight: "text-[#1F2329]", blur: "none" },
  { id: 5, text: "∑ xᵢ", size: "text-2xl sm:text-3xl", top: "42%", left: "4%", colorDark: "text-[#B6FF2E]", colorLight: "text-slate-800", blur: "none" },
  { id: 6, text: "ℝⁿ", size: "text-xl sm:text-2xl", top: "14%", left: "75%", colorDark: "text-lime-300", colorLight: "text-slate-700", blur: "blur-[0.2px]" },
  { id: 7, text: "e^{iπ} + 1 = 0", size: "text-base sm:text-lg", top: "58%", left: "92%", colorDark: "text-[#B6FF2E]", colorLight: "text-[#1F2329]", blur: "blur-[0.5px]" },
  { id: 8, text: "[1  0  0]", size: "text-xs sm:text-sm font-mono", top: "32%", left: "93%", colorDark: "text-lime-400", colorLight: "text-slate-800", blur: "none" },
  { id: 9, text: "rank(A)", size: "text-sm sm:text-base", top: "86%", left: "16%", colorDark: "text-[#B6FF2E]", colorLight: "text-slate-700", blur: "none" },
  { id: 10, text: "∞", size: "text-4xl sm:text-5xl", top: "4%", left: "48%", colorDark: "text-[#B6FF2E]/80", colorLight: "text-slate-700/80", blur: "blur-[0.5px]" },
  { id: 11, text: "v⃗ · w⃗", size: "text-lg sm:text-xl", top: "48%", left: "84%", colorDark: "text-lime-300", colorLight: "text-slate-800", blur: "none" },
  { id: 12, text: "0 1 0 1", size: "text-xs sm:text-sm font-mono", top: "90%", left: "70%", colorDark: "text-[#B6FF2E]/80", colorLight: "text-slate-700/80", blur: "blur-[0.3px]" },
  { id: 13, text: "dim(V)", size: "text-base sm:text-lg", top: "26%", left: "15%", colorDark: "text-lime-400", colorLight: "text-[#1F2329]", blur: "none" },
  { id: 14, text: "σ₁ ≥ σ₂", size: "text-sm sm:text-base", top: "74%", left: "40%", colorDark: "text-[#B6FF2E]", colorLight: "text-slate-800", blur: "blur-[0.2px]" },
];

export default function PublicPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  // Active view: "main" (Home Workspace) or "topics" (Full Dedicated Topics Page)
  const [activeView, setActiveView] = useState<"main" | "topics">("main");
  const [topicSearch, setTopicSearch] = useState("");
  const [clickedTopicId, setClickedTopicId] = useState<string | null>(null);

  // Mini Interactive Matrix Sandbox State
  const [matrixVal, setMatrixVal] = useState({ a: 3, b: 2, c: 1, d: 4 });

  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Check if returning from topic page
  useEffect(() => {
    const wasOnTopic = sessionStorage.getItem("returningFromTopic");
    if (wasOnTopic) {
      setActiveView("topics");
      sessionStorage.removeItem("returningFromTopic");
    }
  }, []);

  // GSAP Animations for floating mathematical particles & interactive cursor parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating motion for each particle
      particlesRef.current.forEach((el, index) => {
        if (!el) return;

        // Continuous drifting, floating and subtle rotation
        gsap.to(el, {
          y: () => (index % 2 === 0 ? "+=25" : "-=30"),
          x: () => (index % 3 === 0 ? "+=18" : "-=18"),
          rotation: () => (index % 2 === 0 ? 8 : -8),
          duration: 3 + (index % 4) * 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2,
        });

        // Pulsing glow opacity
        gsap.to(el, {
          opacity: index % 2 === 0 ? 0.9 : 0.6,
          scale: index % 2 === 0 ? 1.08 : 0.94,
          duration: 2.5 + (index % 3),
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.15,
        });
      });

      // Mouse interactive parallax reaction
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        particlesRef.current.forEach((el, index) => {
          if (!el) return;
          const factor = (index % 5 + 1) * 18;
          gsap.to(el, {
            xPercent: mouseX * factor,
            yPercent: mouseY * factor,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      };

      const container = containerRef.current;
      if (container) {
        container.addEventListener("mousemove", handleMouseMove);
      }

      return () => {
        if (container) {
          container.removeEventListener("mousemove", handleMouseMove);
        }
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleTopicClick = (topicId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setClickedTopicId(topicId);
    sessionStorage.setItem("returningFromTopic", "true");
    setTimeout(() => {
      navigate(`/topics/${topicId}`);
    }, 250);
  };

  // Particle click interaction (spins and scales with GSAP)
  const handleParticleClick = (index: number) => {
    const el = particlesRef.current[index];
    if (el) {
      gsap.to(el, {
        scale: 1.5,
        rotation: "+=360",
        duration: 0.6,
        ease: "back.out(2)",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const randomizeMatrix = () => {
    setMatrixVal({
      a: Math.floor(Math.random() * 9) - 4,
      b: Math.floor(Math.random() * 9) - 4,
      c: Math.floor(Math.random() * 9) - 4,
      d: Math.floor(Math.random() * 9) - 4,
    });
  };

  const det = matrixVal.a * matrixVal.d - matrixVal.b * matrixVal.c;
  const trace = matrixVal.a + matrixVal.d;

  // Filtered topics based on search
  const filteredTopics = TOPICS.filter((t) =>
    t.title.toLowerCase().includes(topicSearch.toLowerCase()) ||
    t.summary.toLowerCase().includes(topicSearch.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative min-h-[90vh] overflow-hidden rounded-3xl pb-16 transition-colors duration-300">
      {/* Immersive Background with Math bg.jpg & Deep Graphite / Lime Compute Overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        {/* Use a placeholder div with gradient instead of broken image */}
        <div 
          className={`h-full w-full transition-opacity duration-500 ${
            isDark 
              ? "bg-gradient-to-br from-[#0a0c0f] via-[#14171B] to-[#1a1e24]" 
              : "bg-gradient-to-br from-[#e8eaed] via-[#f0f2f5] to-[#f8f9fa]"
          }`}
        />
        
        {/* Decorative mathematical pattern overlay */}
        <div 
          className={`absolute inset-0 ${
            isDark ? "opacity-[0.03]" : "opacity-[0.02]"
          }`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #B6FF2E 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, #B6FF2E 1px, transparent 1px),
              radial-gradient(circle at 50% 80%, #B6FF2E 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 60px 60px, 40px 40px'
          }}
        />

        {/* Gradient backdrop: Deep Graphite in Dark Mode, Soft slate/white in Light Mode */}
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDark 
            ? "bg-gradient-to-b from-[#14171B]/90 via-[#1F2329]/80 to-[#14171B]/95" 
            : "bg-gradient-to-b from-white/95 via-slate-50/80 to-white/95"
        }`} />

        {/* Ambient Lime Compute and Deep Graphite Radial Highlights */}
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#B6FF2E]/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-10 h-96 w-96 rounded-full bg-[#B6FF2E]/08 blur-3xl" />
        <div className="absolute top-1/2 left-10 h-72 w-72 rounded-full bg-[#1F2329]/40 blur-3xl" />

        {/* Blueprint grid effect with Lime Compute */}
        <div 
          className={`absolute inset-0 ${isDark ? "opacity-[0.06]" : "opacity-[0.03]"}`}
          style={{
            backgroundImage: `linear-gradient(to right, #B6FF2E 1px, transparent 1px), linear-gradient(to bottom, #B6FF2E 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />
      </div>

      {/* Floating Animated Mathematical Numbers & Symbols (GSAP Driven) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        {MATH_PARTICLES.map((particle, i) => (
          <div
            key={particle.id}
            ref={(el) => {
              particlesRef.current[i] = el;
            }}
            onClick={() => handleParticleClick(i)}
            style={{
              top: particle.top,
              left: particle.left,
            }}
            className={`pointer-events-auto absolute cursor-pointer font-serif font-bold tracking-wider transition-colors duration-200 hover:scale-110 ${particle.size} ${
              isDark ? particle.colorDark : particle.colorLight
            } ${particle.blur} opacity-80 drop-shadow-[0_0_12px_rgba(182,255,46,0.35)]`}
            title="Click to interact!"
          >
            {particle.text}
          </div>
        ))}
      </div>

      {/* Swipeable View Container */}
      <div className="relative z-10 overflow-hidden px-2 sm:px-4">
        <AnimatePresence mode="wait" initial={false}>
          {activeView === "main" ? (
            /* ========================================================= */
            /* VIEW 1: MAIN WORKSPACE OVERVIEW VIEW                      */
            /* ========================================================= */
            <motion.div
              key="main-view"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              {/* Top Header Section */}
              <section className="relative pt-2 sm:pt-4 text-center max-w-4xl mx-auto">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md shadow-lg ${
                    isDark 
                      ? "border-[#333A46] bg-[#1F2329]/80 shadow-black/40 text-[#B6FF2E]" 
                      : "border-slate-300 bg-white/90 shadow-slate-200 text-[#1F2329]"
                  }`}
                >
                  <Sparkles className={`w-4 h-4 animate-pulse ${isDark ? "text-[#B6FF2E]" : "text-[#1F2329]"}`} />
                  <span className={`text-xs sm:text-sm font-bold tracking-wide ${
                    isDark 
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-[#B6FF2E] via-lime-300 to-white" 
                      : "text-[#1F2329]"
                  }`}>
                    Interactive Linear Algebra Workspace
                  </span>
                </div>

                <h1 className="mt-4 font-[Fraunces] text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
                  <span className={
                    isDark 
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-[#B6FF2E] via-lime-300 to-white drop-shadow-[0_0_35px_rgba(182,255,46,0.3)]" 
                      : "text-[#1F2329]"
                  }>
                    Linear Algebra
                  </span>
                </h1>

                <p className={`mt-3 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
                  isDark ? "text-slate-200" : "text-slate-700 font-medium"
                }`}>
                  Calculate matrices, solve equations, diagonalize spaces, and understand geometric transformations with step-by-step interactive tools and explanations.
                </p>
              </section>

              {/* Showcase Card with Show All Topics Swipe CTA */}
              <section className="max-w-4xl mx-auto">
                <div
                  className={`relative overflow-hidden rounded-3xl border p-6 sm:p-10 text-center backdrop-blur-2xl shadow-2xl transition-all duration-300 ${
                    isDark
                      ? "border-[#333A46] bg-gradient-to-b from-[#1F2329]/95 via-[#14171B]/90 to-[#1F2329]/95 shadow-black/80"
                      : "border-slate-200 bg-gradient-to-b from-white/95 via-slate-50/80 to-white/95 shadow-slate-300/60"
                  }`}
                >
                  {/* Ambient Background Lights - Deep Graphite & Lime Compute */}
                  <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#B6FF2E]/10 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#1F2329]/50 blur-3xl" />

                  <div className="relative z-10">
                    {/* Logo */}
                    <div className="mx-auto mb-5 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#B6FF2E] via-lime-400 to-[#1F2329] p-1 shadow-xl shadow-[#B6FF2E]/20">
                      <div className={`flex h-full w-full items-center justify-center overflow-hidden rounded-[22px] ${
                        isDark ? "bg-[#14171B]" : "bg-white"
                      }`}>
                        <img
                          src={linearAlgebraLogo}
                          alt="src/assets/Math bg.jpg"
                          className="h-full w-full object-cover p-2"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    </div>

                    <h2 className={`font-[Fraunces] text-2xl sm:text-4xl font-bold tracking-tight ${
                      isDark ? "text-white" : "text-[#1F2329]"
                    }`}>
                      Ready to Solve Complex Math?
                    </h2>

                    <p className={`mt-2.5 text-sm sm:text-base max-w-lg mx-auto leading-relaxed ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}>
                      Unlock over 23 specialized matrix, vector, determinant, and linear system solvers with instant computations and full matrix visuals.
                    </p>

                    {/* Tag Badges - Deep Graphite & Lime Compute */}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium">
                      <span className={`rounded-full border px-3 py-1 font-semibold ${
                        isDark ? "border-[#333A46] bg-[#1F2329] text-[#B6FF2E]" : "border-slate-200 bg-slate-100 text-[#1F2329]"
                      }`}>
                        ✦ Matrix Inversion
                      </span>
                      <span className={`rounded-full border px-3 py-1 font-semibold ${
                        isDark ? "border-[#333A46] bg-[#1F2329] text-[#B6FF2E]" : "border-slate-200 bg-slate-100 text-[#1F2329]"
                      }`}>
                        ✦ Eigenvalues & Eigenvectors
                      </span>
                      <span className={`rounded-full border px-3 py-1 font-semibold ${
                        isDark ? "border-[#333A46] bg-[#1F2329] text-[#B6FF2E]" : "border-slate-200 bg-slate-100 text-[#1F2329]"
                      }`}>
                        ✦ QR & SVD Factorization
                      </span>
                      <span className={`rounded-full border px-3 py-1 font-semibold ${
                        isDark ? "border-[#333A46] bg-[#1F2329] text-[#B6FF2E]" : "border-slate-200 bg-slate-100 text-[#1F2329]"
                      }`}>
                        ✦ Vector Spaces
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => navigate("/calculators")}
                        className="group inline-flex items-center gap-3 rounded-2xl bg-[#B6FF2E] px-7 py-3.5 text-sm sm:text-base font-extrabold text-[#1F2329] shadow-xl shadow-[#B6FF2E]/25 transition-all duration-300 hover:scale-105 hover:bg-[#C6FF4D] hover:shadow-[#B6FF2E]/40 active:scale-95"
                      >
                        <TrendingUp className="w-5 h-5 text-[#1F2329]" />
                        <span>Access All Linear Algebra Calculators</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </button>

                      {/* Click to swipe into dedicated Topics page */}
                      <button
                        onClick={() => setActiveView("topics")}
                        className={`group inline-flex items-center gap-2 rounded-2xl border px-6 py-3.5 text-sm sm:text-base font-bold backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${
                          isDark 
                            ? "border-[#333A46] bg-[#1F2329] text-[#B6FF2E] hover:bg-[#282E37] hover:border-[#B6FF2E]/60 shadow-md shadow-black/60" 
                            : "border-slate-300 bg-white text-[#1F2329] hover:bg-slate-100 shadow-sm shadow-slate-200"
                        }`}
                      >
                        <BookOpen className="w-4 h-4 text-[#B6FF2E]" />
                        <span>Show All Topics</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Interactive Matrix Preview & Live Math Sandbox */}
              <section
                className={`mx-auto max-w-4xl rounded-2xl border p-5 sm:p-6 backdrop-blur-xl shadow-xl transition-all duration-300 ${
                  isDark
                    ? "border-[#333A46] bg-[#1F2329]/90 shadow-black/80"
                    : "border-slate-200 bg-white/95 shadow-slate-200/50"
                }`}
              >
                <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
                  isDark ? "border-[#333A46]" : "border-slate-200"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                      isDark ? "bg-[#14171B] text-[#B6FF2E] border-[#333A46]" : "bg-slate-100 text-[#1F2329] border-slate-200"
                    }`}>
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className={`text-sm sm:text-base font-bold ${isDark ? "text-white" : "text-[#1F2329]"}`}>
                        Live Matrix Property Sandbox
                      </h3>
                      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Interactive real-time 2×2 matrix computation
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={randomizeMatrix}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                      isDark
                        ? "border-[#333A46] bg-[#14171B] text-[#B6FF2E] hover:bg-[#282E37] hover:border-[#B6FF2E]/50"
                        : "border-slate-200 bg-slate-100 text-[#1F2329] hover:bg-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Randomize Matrix</span>
                  </button>
                </div>

                <div className="mt-5 grid gap-6 sm:grid-cols-2 items-center">
                  <div className="flex items-center justify-center gap-3">
                    <span className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Matrix A =</span>
                    <div className={`relative inline-flex items-center rounded-xl border px-4 py-3 shadow-inner ${
                      isDark ? "border-[#333A46] bg-[#14171B]" : "border-slate-200 bg-slate-50"
                    }`}>
                      <div className="absolute -left-1.5 inset-y-1 w-1.5 rounded-l border-l-2 border-y-2 border-[#B6FF2E]" />
                      <div className={`grid grid-cols-2 gap-3 text-center font-mono text-base font-bold ${
                        isDark ? "text-[#B6FF2E]" : "text-[#1F2329]"
                      }`}>
                        <span className={`w-8 rounded p-1 border ${
                          isDark ? "bg-[#1F2329] border-[#333A46]" : "bg-white border-slate-200"
                        }`}>{matrixVal.a}</span>
                        <span className={`w-8 rounded p-1 border ${
                          isDark ? "bg-[#1F2329] border-[#333A46]" : "bg-white border-slate-200"
                        }`}>{matrixVal.b}</span>
                        <span className={`w-8 rounded p-1 border ${
                          isDark ? "bg-[#1F2329] border-[#333A46]" : "bg-white border-slate-200"
                        }`}>{matrixVal.c}</span>
                        <span className={`w-8 rounded p-1 border ${
                          isDark ? "bg-[#1F2329] border-[#333A46]" : "bg-white border-slate-200"
                        }`}>{matrixVal.d}</span>
                      </div>
                      <div className="absolute -right-1.5 inset-y-1 w-1.5 rounded-r border-r-2 border-y-2 border-[#B6FF2E]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-xl border p-3 ${
                      isDark ? "border-[#333A46] bg-[#14171B]" : "border-slate-200 bg-slate-50"
                    }`}>
                      <div className={`text-[0.68rem] font-bold uppercase tracking-wider ${
                        isDark ? "text-[#B6FF2E]" : "text-[#1F2329]"
                      }`}>
                        Determinant det(A)
                      </div>
                      <div className={`mt-1 font-mono text-xl font-bold ${
                        isDark ? "text-[#B6FF2E]" : "text-[#1F2329]"
                      }`}>
                        {det}
                      </div>
                      <div className={`text-[0.65rem] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {det === 0 ? "Singular (Non-invertible)" : "Invertible Matrix"}
                      </div>
                    </div>

                    <div className={`rounded-xl border p-3 ${
                      isDark ? "border-[#333A46] bg-[#14171B]" : "border-slate-200 bg-slate-50"
                    }`}>
                      <div className={`text-[0.68rem] font-bold uppercase tracking-wider ${
                        isDark ? "text-[#B6FF2E]" : "text-[#1F2329]"
                      }`}>
                        Trace tr(A)
                      </div>
                      <div className={`mt-1 font-mono text-xl font-bold ${
                        isDark ? "text-[#B6FF2E]" : "text-[#1F2329]"
                      }`}>
                        {trace}
                      </div>
                      <div className={`text-[0.65rem] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Sum of diagonal elements
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Feature Cards Grid - Deep Graphite & Lime Compute */}
              <section className="grid gap-4 sm:grid-cols-3 max-w-5xl mx-auto">
                <div
                  className={`group rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                    isDark ? "border-[#333A46] bg-[#1F2329]/80 hover:border-[#B6FF2E]/50 hover:shadow-lg hover:shadow-black/60" : "border-slate-200 bg-white/90 hover:border-slate-300 hover:shadow-slate-200/50"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14171B] text-[#B6FF2E] border border-[#333A46] shadow-md">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className={`mt-4 font-[Fraunces] text-lg font-bold transition-colors ${
                    isDark ? "text-white group-hover:text-[#B6FF2E]" : "text-[#1F2329] group-hover:text-black"
                  }`}>
                    Matrix Decompositions
                  </h3>
                  <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    LU, QR, SVD, and Eigendecomposition calculators with complete breakdown matrices.
                  </p>
                </div>

                <div
                  className={`group rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                    isDark ? "border-[#333A46] bg-[#1F2329]/80 hover:border-[#B6FF2E]/50 hover:shadow-lg hover:shadow-black/60" : "border-slate-200 bg-white/90 hover:border-slate-300 hover:shadow-slate-200/50"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14171B] text-[#B6FF2E] border border-[#333A46] shadow-md">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className={`mt-4 font-[Fraunces] text-lg font-bold transition-colors ${
                    isDark ? "text-white group-hover:text-[#B6FF2E]" : "text-[#1F2329] group-hover:text-black"
                  }`}>
                    Vector Projections & Spaces
                  </h3>
                  <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Cross product, dot product, Gram-Schmidt orthogonalization, and basis determination.
                  </p>
                </div>

                <div
                  className={`group rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                    isDark ? "border-[#333A46] bg-[#1F2329]/80 hover:border-[#B6FF2E]/50 hover:shadow-lg hover:shadow-black/60" : "border-slate-200 bg-white/90 hover:border-slate-300 hover:shadow-slate-200/50"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14171B] text-[#B6FF2E] border border-[#333A46] shadow-md">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className={`mt-4 font-[Fraunces] text-lg font-bold transition-colors ${
                    isDark ? "text-white group-hover:text-[#B6FF2E]" : "text-[#1F2329] group-hover:text-black"
                  }`}>
                    Linear System Solvers
                  </h3>
                  <p className={`mt-1.5 text-xs sm:text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Gaussian elimination, Gauss-Jordan reduction, Cramer&apos;s rule, and least squares fit.
                  </p>
                </div>
              </section>
            </motion.div>
          ) : (
            /* ========================================================= */
            /* VIEW 2: DEDICATED FULL TOPICS VIEW (SWIPED IN)            */
            /* ========================================================= */
            <motion.div
              key="topics-view"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 max-w-[92%] mx-auto"
            >
              {/* Back Button & Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={() => setActiveView("main")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold border transition-all duration-200 hover:scale-105 active:scale-95 ${
                      isDark
                        ? "border-[#333A46] bg-[#1F2329] text-[#B6FF2E] hover:bg-[#282E37] hover:border-[#B6FF2E]/60 shadow-md shadow-black/50"
                        : "border-slate-300 bg-white text-[#1F2329] hover:bg-slate-100 shadow-sm shadow-slate-200"
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Workspace</span>
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#B6FF2E] animate-ping" />
                      <h2 className={`m-0 font-[Fraunces] text-2xl sm:text-3xl font-bold ${
                        isDark ? "text-white" : "text-[#1F2329]"
                      }`}>
                        Linear Algebra & Topics
                      </h2>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        isDark ? "bg-[#1F2329] text-[#B6FF2E] border-[#333A46]" : "bg-[#B6FF2E]/20 text-[#1F2329] border-[#B6FF2E]/40"
                      }`}>
                        {TOPICS.length} Topics
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
                      Select any topic below to learn step-by-step mathematical theory, formulas, and verified examples.
                    </p>
                  </div>
                </div>

                {/* Search Topics Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-[#B6FF2E]" : "text-[#1F2329]"}`} />
                  <input
                    type="text"
                    placeholder="Search topics (e.g., Eigen, Inverse, Span)..."
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    className={`w-full rounded-xl border pl-9 pr-8 py-2 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B6FF2E]/30 transition-all ${
                      isDark 
                        ? "border-[#333A46] bg-[#14171B] text-white focus:border-[#B6FF2E]" 
                        : "border-slate-300 bg-white text-[#1F2329] focus:border-[#1F2329]"
                    }`}
                  />
                  {topicSearch && (
                    <button
                      onClick={() => setTopicSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic, index) => {
                    const isClicked = clickedTopicId === topic.id;
                    return (
                      <motion.article
                        key={topic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: isClicked ? 0.4 : 1,
                          y: 0,
                          scale: isClicked ? 0.97 : 1,
                        }}
                        transition={{
                          duration: 0.35,
                          delay: index * 0.04,
                          ease: "easeOut",
                        }}
                        whileHover={{
                          y: -4,
                          borderColor: "rgba(182, 255, 46, 0.5)",
                          boxShadow: isDark
                            ? "0 12px 30px -5px rgba(182, 255, 46, 0.2)"
                            : "0 12px 24px -5px rgba(31, 35, 41, 0.1)",
                        }}
                        className={`group relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 ${
                          isDark
                            ? "border-[#333A46] bg-[#1F2329]/80 hover:bg-[#1F2329]"
                            : "border-slate-200 bg-white/95 hover:bg-white shadow-md shadow-slate-200/40"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <h3 className={`font-[Fraunces] text-lg font-bold transition-colors duration-200 ${
                              isDark ? "text-white group-hover:text-[#B6FF2E]" : "text-[#1F2329] group-hover:text-black"
                            }`}>
                              {topic.title}
                            </h3>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                              isDark ? "border-[#333A46] bg-[#14171B] text-[#B6FF2E]" : "border-slate-200 bg-slate-100 text-[#1F2329]"
                            }`}>
                              <Binary className="w-3 h-3 text-[#B6FF2E]" />
                              {topic.examples.length} ex
                            </span>
                          </div>

                          <p className={`mt-2 text-xs sm:text-sm line-clamp-3 leading-relaxed ${
                            isDark ? "text-slate-300" : "text-slate-600"
                          }`}>
                            {topic.summary}
                          </p>
                        </div>

                        <div className={`mt-5 flex items-center justify-between border-t pt-3 ${
                          isDark ? "border-[#333A46]" : "border-slate-200"
                        }`}>
                          <span className={`text-[0.7rem] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            {topic.examples.length} interactive examples
                          </span>

                          <Link
                            to={`/topics/${topic.id}`}
                            onClick={(e) => handleTopicClick(topic.id, e)}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 no-underline ${
                              isDark 
                                ? "bg-[#B6FF2E] text-[#1F2329] hover:bg-[#C6FF4D]" 
                                : "bg-[#1F2329] text-[#B6FF2E] hover:bg-black"
                            }`}
                            style={{
                              color: isDark ? "#1F2329" : "#B6FF2E"
                            }}
                          >
                            <span>Read Topic</span>
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </motion.article>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-400">
                    <p className="text-base font-semibold">No topics found matching &ldquo;{topicSearch}&rdquo;</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing the search or searching for &quot;matrices&quot; or &quot;vector&quot;</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}