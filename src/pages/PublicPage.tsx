import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";
import TOPICS from "../data/topics/index";
import mathBg from "../assets/math.jpeg";
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
  X,
  Globe,
  Monitor,
  Smartphone,
  PieChart,
  Settings,
  Grid,
  Box,
  Sliders
} from "lucide-react";

// Floating mathematical numbers & symbols for GSAP animation
const MATH_PARTICLES = [
  { id: 1, text: "λ", size: "text-3xl sm:text-4xl", top: "8%", left: "58%", colorDark: "text-[#B6FF2E]", colorLight: "text-[#1F2329]", blur: "blur-[0.5px]" },
  { id: 2, text: "det(A)", size: "text-xl sm:text-2xl", top: "18%", left: "85%", colorDark: "text-lime-300", colorLight: "text-slate-800", blur: "none" },
  { id: 3, text: "π ≈ 3.1415", size: "text-sm sm:text-base", top: "68%", left: "62%", colorDark: "text-[#B6FF2E]", colorLight: "text-slate-700", blur: "blur-[0.3px]" },
  { id: 4, text: "Ax = b", size: "text-2xl sm:text-3xl", top: "78%", left: "88%", colorDark: "text-lime-400", colorLight: "text-[#1F2329]", blur: "none" },
  { id: 5, text: "∑ xᵢ", size: "text-2xl sm:text-3xl", top: "42%", left: "55%", colorDark: "text-[#B6FF2E]", colorLight: "text-slate-800", blur: "none" },
  { id: 6, text: "ℝⁿ", size: "text-xl sm:text-2xl", top: "14%", left: "75%", colorDark: "text-lime-300", colorLight: "text-slate-700", blur: "blur-[0.2px]" },
  { id: 7, text: "e^{iπ} + 1 = 0", size: "text-base sm:text-lg", top: "58%", left: "92%", colorDark: "text-[#B6FF2E]", colorLight: "text-[#1F2329]", blur: "blur-[0.5px]" },
  { id: 8, text: "[1  0  0]", size: "text-xs sm:text-sm font-mono", top: "32%", left: "93%", colorDark: "text-lime-400", colorLight: "text-slate-800", blur: "none" },
  { id: 9, text: "rank(A)", size: "text-sm sm:text-base", top: "86%", left: "68%", colorDark: "text-[#B6FF2E]", colorLight: "text-slate-700", blur: "none" },
  { id: 10, text: "∞", size: "text-4xl sm:text-5xl", top: "4%", left: "48%", colorDark: "text-[#B6FF2E]/80", colorLight: "text-slate-700/80", blur: "blur-[0.5px]" },
  { id: 11, text: "v⃗ · w⃗", size: "text-lg sm:text-xl", top: "48%", left: "84%", colorDark: "text-lime-300", colorLight: "text-slate-800", blur: "none" },
  { id: 12, text: "0 1 0 1", size: "text-xs sm:text-sm font-mono", top: "90%", left: "70%", colorDark: "text-[#B6FF2E]/80", colorLight: "text-slate-700/80", blur: "blur-[0.3px]" },
  { id: 13, text: "dim(V)", size: "text-base sm:text-lg", top: "26%", left: "66%", colorDark: "text-lime-400", colorLight: "text-[#1F2329]", blur: "none" },
  { id: 14, text: "σ₁ ≥ σ₂", size: "text-sm sm:text-base", top: "74%", left: "46%", colorDark: "text-[#B6FF2E]", colorLight: "text-slate-800", blur: "blur-[0.2px]" },
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
    <div ref={containerRef} className="relative min-h-[90vh] pb-16 transition-colors duration-300">

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
              isDark 
                ? "text-blue-300/70 hover:text-white" 
                : "text-blue-900/60 hover:text-blue-950"
            } ${particle.blur} drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]`}
            title="Click to interact!"
          >
            {particle.text}
          </div>
        ))}
      </div>

      {/* Swipeable View Container */}
      <div className="relative z-10 overflow-hidden pl-3 sm:pl-4 md:pl-8 pr-2 pt-1 pb-12">
        <AnimatePresence mode="wait" initial={false}>
          {activeView === "main" ? (
            /* ========================================================= */
            /* VIEW 1: MAIN WORKSPACE OVERVIEW VIEW (LEFT-ALIGNED)       */
            /* ========================================================= */
            <motion.div
              key="main-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12 w-full"
            >
              {/* HERO SECTION (SEAMLESS AND BORDERLESS OVER FULL-SCREEN math.jpeg) */}
              <section className={`relative text-left transition-all duration-300 pt-0 pb-6 ${
                isDark ? "text-white" : "text-[#1F2329]"
              }`}>

                {/* Hero Content (Left Aligned) */}
                <div className="relative z-10 max-w-2xl">
                  <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold backdrop-blur-sm mb-4 ${
                    isDark 
                      ? "border-blue-400/30 bg-blue-900/40 text-blue-200" 
                      : "border-blue-300 bg-blue-100/80 text-blue-900"
                  }`}>
                    <Sparkles className={`w-3.5 h-3.5 ${isDark ? "text-blue-300" : "text-blue-700"}`} />
                    <span>Interactive Mathematics Suite</span>
                  </div>

                  <h1 className={`font-[Fraunces] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] ${
                    isDark ? "text-white" : "text-[#1F2329]"
                  }`}>
                    Modern Linear Algebra Made Easy
                  </h1>

                  <p className={`mt-5 text-base sm:text-lg leading-relaxed ${
                    isDark ? "text-blue-100/90" : "text-slate-700 font-medium"
                  }`}>
                    Build <span className={`rounded px-1.5 py-0.5 font-semibold border ${
                      isDark 
                        ? "bg-blue-900/80 text-white border-blue-400/30" 
                        : "bg-blue-100 text-blue-950 border-blue-300"
                    }`}>feature-rich</span> experiences for Matrices, Vectors, and Linear Systems, faster than ever with step-by-step visual components.
                  </p>

                  {/* Primary CTA Button */}
                  <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <button
                      onClick={() => navigate("/calculators")}
                      className="group inline-flex items-center gap-3 rounded-xl bg-[#ff5722] hover:bg-[#f4511e] px-7 py-3.5 text-base font-bold text-white shadow-xl shadow-[#ff5722]/30 transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
                    >
                      <span>Explore Calculators</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      onClick={() => setActiveView("topics")}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold backdrop-blur-md transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                        isDark 
                          ? "bg-blue-950/60 hover:bg-blue-900/70 text-blue-100 shadow-md" 
                          : "bg-white/90 hover:bg-slate-100 text-slate-800 shadow-md"
                      }`}
                    >
                      <BookOpen className={`w-4 h-4 ${isDark ? "text-blue-300" : "text-blue-600"}`} />
                      <span>Show All Topics</span>
                    </button>
                  </div>

                  <p className={`mt-3 text-xs font-medium ${
                    isDark ? "text-blue-200/70" : "text-slate-600"
                  }`}>
                    Includes 23+ specialized matrix, vector, determinant, and linear system solvers.
                  </p>
                </div>

                {/* BOTTOM CATEGORIES & 6 CARDS SECTION (MATCHING REFERENCE LAYOUT) */}
                <div className={`relative z-10 mt-14 pt-8 border-t ${
                  isDark ? "border-blue-500/20" : "border-slate-200"
                }`}>
                  <div className="grid gap-8 lg:grid-cols-2">
                    {/* Group 1: CORE SOLVERS (UI COMPONENTS Style) */}
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-wider mb-3.5 flex items-center gap-2 ${
                        isDark ? "text-blue-200/80" : "text-slate-700"
                      }`}>
                        <span>Core Solvers</span>
                        <div className={`h-[1px] flex-1 ${isDark ? "bg-blue-500/20" : "bg-slate-200"}`} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Card 1 */}
                        <div
                          onClick={() => navigate("/calculators")}
                          className={`group flex flex-col justify-between p-4 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer min-h-[110px] ${
                            isDark 
                              ? "bg-[#2a45b8] hover:bg-[#3453d8] text-white" 
                              : "bg-[#1e40af] hover:bg-[#1d3896] text-white"
                          }`}
                        >
                          <Globe className="w-6 h-6 text-blue-200 group-hover:text-white transition-colors" />
                          <div className="mt-3">
                            <span className="block text-sm font-bold leading-tight">Matrix Solvers</span>
                            <span className="text-[11px] text-blue-200/90">Inversion & Rank</span>
                          </div>
                        </div>

                        {/* Card 2 */}
                        <div
                          onClick={() => navigate("/calculators")}
                          className={`group flex flex-col justify-between p-4 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer min-h-[110px] ${
                            isDark 
                              ? "bg-[#2a45b8] hover:bg-[#3453d8] text-white" 
                              : "bg-[#1e40af] hover:bg-[#1d3896] text-white"
                          }`}
                        >
                          <Monitor className="w-6 h-6 text-blue-200 group-hover:text-white transition-colors" />
                          <div className="mt-3">
                            <span className="block text-sm font-bold leading-tight">Eigen Systems</span>
                            <span className="text-[11px] text-blue-200/90">Values & Vectors</span>
                          </div>
                        </div>

                        {/* Card 3 */}
                        <div
                          onClick={() => navigate("/calculators")}
                          className={`group flex flex-col justify-between p-4 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer min-h-[110px] ${
                            isDark 
                              ? "bg-[#2a45b8] hover:bg-[#3453d8] text-white" 
                              : "bg-[#1e40af] hover:bg-[#1d3896] text-white"
                          }`}
                        >
                          <Smartphone className="w-6 h-6 text-blue-200 group-hover:text-white transition-colors" />
                          <div className="mt-3">
                            <span className="block text-sm font-bold leading-tight">Vector Spaces</span>
                            <span className="text-[11px] text-blue-200/90">Projections & Span</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Group 2: ADVANCED SOLUTIONS (DEVELOPER SOLUTIONS Style) */}
                    <div>
                      <div className={`text-xs font-bold uppercase tracking-wider mb-3.5 flex items-center gap-2 ${
                        isDark ? "text-blue-200/80" : "text-slate-700"
                      }`}>
                        <span>Advanced Solutions</span>
                        <div className={`h-[1px] flex-1 ${isDark ? "bg-blue-500/20" : "bg-slate-200"}`} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Card 4 */}
                        <div
                          onClick={() => navigate("/calculators")}
                          className={`group flex flex-col justify-between p-4 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer min-h-[110px] ${
                            isDark 
                              ? "bg-[#2a45b8] hover:bg-[#3453d8] text-white" 
                              : "bg-[#1e40af] hover:bg-[#1d3896] text-white"
                          }`}
                        >
                          <PieChart className="w-6 h-6 text-blue-200 group-hover:text-white transition-colors" />
                          <div className="mt-3">
                            <span className="block text-sm font-bold leading-tight">Decompositions</span>
                            <span className="text-[11px] text-blue-200/90">LU, QR & SVD</span>
                          </div>
                        </div>

                        {/* Card 5 */}
                        <div
                          onClick={() => navigate("/calculators")}
                          className={`group flex flex-col justify-between p-4 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer min-h-[110px] ${
                            isDark 
                              ? "bg-[#2a45b8] hover:bg-[#3453d8] text-white" 
                              : "bg-[#1e40af] hover:bg-[#1d3896] text-white"
                          }`}
                        >
                          <Settings className="w-6 h-6 text-blue-200 group-hover:text-white transition-colors" />
                          <div className="mt-3">
                            <span className="block text-sm font-bold leading-tight">System Solvers</span>
                            <span className="text-[11px] text-blue-200/90">Gaussian & Cramer</span>
                          </div>
                        </div>

                        {/* Card 6 */}
                        <div
                          onClick={() => setActiveView("topics")}
                          className={`group flex flex-col justify-between p-4 rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer min-h-[110px] ${
                            isDark 
                              ? "bg-[#2a45b8] hover:bg-[#3453d8] text-white" 
                              : "bg-[#1e40af] hover:bg-[#1d3896] text-white"
                          }`}
                        >
                          <Sliders className="w-6 h-6 text-blue-200 group-hover:text-white transition-colors" />
                          <div className="mt-3">
                            <span className="block text-sm font-bold leading-tight">Theory Topics</span>
                            <span className="text-[11px] text-blue-200/90">Lessons & Proofs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Interactive Matrix Preview & Live Math Sandbox */}
              <section
                className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-2xl ${
                  isDark 
                    ? "border-blue-500/20 bg-[#141b4d]/80 text-white" 
                    : "border-blue-300/30 bg-white/90 text-[#1F2329]"
                }`}
              >
                <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
                  isDark ? "border-blue-500/20" : "border-blue-300/20"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-md ${
                      isDark 
                        ? "bg-[#2a45b8] text-white border-blue-400/30" 
                        : "bg-[#1a237e] text-white border-blue-300/40"
                    }`}>
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-base sm:text-lg font-bold ${
                        isDark ? "text-white" : "text-[#1F2329]"
                      }`}>
                        Live Matrix Property Sandbox
                      </h3>
                      <p className={`text-xs ${
                        isDark ? "text-blue-200/80" : "text-slate-600"
                      }`}>
                        Interactive real-time 2×2 matrix computation
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={randomizeMatrix}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md ${
                      isDark 
                        ? "border-blue-400/30 bg-[#2a45b8] hover:bg-[#3453d8] text-white" 
                        : "border-blue-300/40 bg-[#1a237e] hover:bg-[#283593] text-white"
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Randomize Matrix</span>
                  </button>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2 items-center">
                  <div className="flex items-center justify-center gap-4">
                    <span className={`text-sm font-semibold ${
                      isDark ? "text-blue-200" : "text-slate-700"
                    }`}>Matrix A =</span>
                    <div className={`relative inline-flex items-center rounded-2xl border px-5 py-4 shadow-inner ${
                      isDark 
                        ? "border-blue-400/30 bg-[#0d1236]" 
                        : "border-blue-300/40 bg-slate-50"
                    }`}>
                      <div className={`absolute -left-1.5 inset-y-1.5 w-1.5 rounded-l border-l-2 border-y-2 ${
                        isDark ? "border-blue-400" : "border-blue-500"
                      }`} />
                      <div className="grid grid-cols-2 gap-3 text-center font-mono text-lg font-bold">
                        <span className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
                          isDark 
                            ? "bg-[#1a237e]/60 border-blue-400/30 text-blue-100" 
                            : "bg-blue-50 border-blue-300/40 text-[#1F2329]"
                        }`}>{matrixVal.a}</span>
                        <span className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
                          isDark 
                            ? "bg-[#1a237e]/60 border-blue-400/30 text-blue-100" 
                            : "bg-blue-50 border-blue-300/40 text-[#1F2329]"
                        }`}>{matrixVal.b}</span>
                        <span className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
                          isDark 
                            ? "bg-[#1a237e]/60 border-blue-400/30 text-blue-100" 
                            : "bg-blue-50 border-blue-300/40 text-[#1F2329]"
                        }`}>{matrixVal.c}</span>
                        <span className={`w-9 h-9 flex items-center justify-center rounded-lg border ${
                          isDark 
                            ? "bg-[#1a237e]/60 border-blue-400/30 text-blue-100" 
                            : "bg-blue-50 border-blue-300/40 text-[#1F2329]"
                        }`}>{matrixVal.d}</span>
                      </div>
                      <div className={`absolute -right-1.5 inset-y-1.5 w-1.5 rounded-r border-r-2 border-y-2 ${
                        isDark ? "border-blue-400" : "border-blue-500"
                      }`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`rounded-2xl border p-4 shadow-md ${
                      isDark 
                        ? "border-blue-400/20 bg-[#0d1236]/90" 
                        : "border-blue-300/20 bg-slate-50"
                    }`}>
                      <div className={`text-[0.7rem] font-bold uppercase tracking-wider ${
                        isDark ? "text-blue-300" : "text-blue-700"
                      }`}>
                        Determinant det(A)
                      </div>
                      <div className={`mt-1.5 font-mono text-2xl font-bold ${
                        isDark ? "text-white" : "text-[#1F2329]"
                      }`}>
                        {det}
                      </div>
                      <div className={`text-xs mt-1 ${
                        isDark ? "text-blue-200/70" : "text-slate-600"
                      }`}>
                        {det === 0 ? "Singular (Non-invertible)" : "Invertible Matrix"}
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-4 shadow-md ${
                      isDark 
                        ? "border-blue-400/20 bg-[#0d1236]/90" 
                        : "border-blue-300/20 bg-slate-50"
                    }`}>
                      <div className={`text-[0.7rem] font-bold uppercase tracking-wider ${
                        isDark ? "text-blue-300" : "text-blue-700"
                      }`}>
                        Trace tr(A)
                      </div>
                      <div className={`mt-1.5 font-mono text-2xl font-bold ${
                        isDark ? "text-white" : "text-[#1F2329]"
                      }`}>
                        {trace}
                      </div>
                      <div className={`text-xs mt-1 ${
                        isDark ? "text-blue-200/70" : "text-slate-600"
                      }`}>
                        Sum of diagonal elements
                      </div>
                    </div>
                  </div>
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
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition-all duration-200 no-underline shadow-sm hover:scale-105 ${
                              isDark 
                                ? "bg-[#B6FF2E] hover:bg-[#C6FF4D]" 
                                : "bg-[#1F2329] hover:bg-black"
                            }`}
                            style={{
                              color: isDark ? "#14171B" : "#B6FF2E",
                              backgroundColor: isDark ? "#B6FF2E" : "#1F2329"
                            }}
                          >
                            <span style={{ color: isDark ? "#14171B" : "#B6FF2E", fontWeight: 800 }}>Read Topic</span>
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" style={{ color: isDark ? "#14171B" : "#B6FF2E" }} />
                          </Link>
                        </div>
                      </motion.article>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <p className={`text-base font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      No topics found matching &ldquo;{topicSearch}&rdquo;
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      Try clearing the search or searching for &quot;matrices&quot; or &quot;vector&quot;
                    </p>
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