// pages/CalculatorsPage.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CalculatorApp from "../calculators/CalculatorApp";
import { useTheme } from "../context/ThemeContext";
import mathBg from "../assets/Math bg.jpg";
import { ArrowLeft, Sparkles, Grid, Layers, Loader2 } from "lucide-react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function CalculatorsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth initial transition
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(loadingTimeout);
  }, []);

  // Keyboard shortcut (ESC) to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    if (isLoading) return;

    const masterTl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // 1. Animate back button
    if (backButtonRef.current) {
      masterTl.fromTo(
        backButtonRef.current,
        {
          opacity: 0,
          scale: 0.8,
          x: -15,
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.6,
          ease: "back.out(2)",
        }
      );
    }

    // 2. Animate title
    if (titleRef.current) {
      masterTl.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }

    // 3. Animate calculator
    if (calculatorRef.current) {
      masterTl.fromTo(
        calculatorRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }

    return () => {
      masterTl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isLoading]);

  const handleBackClick = () => {
    navigate(-1);
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-50 ${
        isDark ? "bg-[#14171B]" : "bg-slate-100"
      }`}>
        <div ref={loadingRef} className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#B6FF2E] via-lime-400 to-[#1F2329] flex items-center justify-center shadow-2xl shadow-[#B6FF2E]/30">
              <Sparkles className="w-10 h-10 text-[#1F2329] animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-[#B6FF2E]/60 animate-ping" />
          </div>
          
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-[#B6FF2E] animate-spin" />
            <span className={`text-base font-bold tracking-wide ${
              isDark ? "text-white" : "text-[#1F2329]"
            }`}>Loading Linear Algebra Suite</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden pb-16 transition-colors duration-300">
      {/* Background with Math bg.jpg and Deep Graphite / Lime Compute ambient mesh */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <img
          src={mathBg}
          alt="Math Background"
          className={`h-full w-full object-cover object-center filter contrast-125 saturate-150 transition-opacity duration-300 ${
            isDark ? "opacity-20" : "opacity-10"
          }`}
        />
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDark 
            ? "bg-gradient-to-b from-[#14171B]/90 via-[#1F2329]/85 to-[#14171B]/95" 
            : "bg-gradient-to-b from-white/90 via-slate-50/75 to-slate-100/90"
        }`} />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#B6FF2E]/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-10 h-96 w-96 rounded-full bg-[#B6FF2E]/08 blur-3xl" />
        <div className="absolute top-1/2 left-10 h-72 w-72 rounded-full bg-[#1F2329]/40 blur-3xl" />
        
        {/* Blueprint grid effect */}
        <div 
          className={`absolute inset-0 ${isDark ? "opacity-[0.06]" : "opacity-[0.03]"}`}
          style={{
            backgroundImage: `linear-gradient(to right, #B6FF2E 1px, transparent 1px), linear-gradient(to bottom, #B6FF2E 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />
      </div>

      {/* Main content - WIDER CONTAINER (1600px max-width) */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-6">
        {/* Top Navigation Row - Special Standalone Back Button */}
        <div className="flex items-center justify-between mb-5">
          <button
            ref={backButtonRef}
            onClick={handleBackClick}
            className={`group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl backdrop-blur-xl transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg ${
              isDark 
                ? "bg-[#1F2329]/95 border border-[#333A46] text-slate-200 hover:border-[#B6FF2E] hover:text-[#B6FF2E] hover:bg-[#282E37] shadow-black/60 hover:shadow-[#B6FF2E]/20" 
                : "bg-white/95 border border-slate-300 text-[#1F2329] hover:border-[#1F2329] hover:text-black hover:bg-white shadow-slate-200/70 hover:shadow-md"
            }`}
            aria-label="Go back to previous page"
          >
            <div className={`flex items-center justify-center w-7 h-7 rounded-xl transition-transform duration-200 group-hover:-translate-x-1 ${
              isDark ? "bg-[#14171B] text-[#B6FF2E] border border-[#333A46] group-hover:border-[#B6FF2E]/50" : "bg-slate-100 text-[#1F2329] border border-slate-200"
            }`}>
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="font-bold tracking-tight">Back to Home</span>
            <span className={`hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-md font-mono ${
              isDark ? "bg-[#14171B] text-slate-400 border border-[#333A46]" : "bg-slate-100 text-slate-500 border border-slate-200"
            }`}>
              ESC
            </span>
          </button>
        </div>

        {/* Header Title Section - Distinct and Spacious */}
        <div ref={titleRef} className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-2">
          <div className="flex items-center gap-3.5">
            <div className="">
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className={`text-2xl sm:text-4xl font-bold font-[Fraunces] tracking-tight ${
                  isDark 
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#B6FF2E] via-lime-300 to-white" 
                    : "text-[#1F2329]"
                }`}>
                  Calculators
                </h1>
                <span className={`badge-pill inline-flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold rounded-full border backdrop-blur-sm shadow-sm ${
                  isDark 
                    ? "text-[#B6FF2E] bg-[#1F2329] border-[#333A46]" 
                    : "text-[#1F2329] bg-[#B6FF2E] border-[#1F2329]"
                }`}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B6FF2E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B6FF2E]"></span>
                  </span>
                  23 Tools
                </span>
              </div>
              <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-slate-300" : "text-slate-700 font-medium"}`}>
                Explore intelligent linear algebra solvers — from matrices to eigenvectors
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Component Container */}
        <div 
          ref={calculatorRef}
          className="relative w-full"
        >
          <CalculatorApp />
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className={`text-xs flex items-center justify-center gap-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            <Grid className="w-3.5 h-3.5 text-[#B6FF2E]" />
            <span>All 23 tools powered by modern linear algebra algorithms</span>
            <Layers className="w-3.5 h-3.5 text-[#B6FF2E]" />
          </p>
        </div>
      </div>
    </div>
  );
}