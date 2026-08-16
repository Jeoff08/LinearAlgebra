// pages/CalculatorsPage.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CalculatorApp from "../calculators/CalculatorApp";
import { ArrowLeft, Sparkles, Grid, Layers, Loader2 } from "lucide-react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function CalculatorsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show loading for 2 seconds
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  useEffect(() => {
    // Only run animations if not loading
    if (isLoading) return;

    // Create master timeline
    const masterTl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // 1. Animate background decorative elements
    if (decorRef.current) {
      const decorElements = decorRef.current.querySelectorAll('.decor-blob');
      decorElements.forEach((el, i) => {
        gsap.fromTo(
          el,
          {
            scale: 0.6,
            opacity: 0,
            rotation: -20,
          },
          {
            scale: 1,
            opacity: 0.4,
            rotation: 0,
            duration: 1.8,
            delay: i * 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: decorRef.current,
              start: "top bottom",
              toggleActions: "play none none reverse",
            },
          }
        );
        // Floating animation
        gsap.to(el, {
          y: () => (i % 2 === 0 ? 20 : -20),
          x: () => (i % 2 === 0 ? 15 : -15),
          rotation: () => (i % 2 === 0 ? 8 : -8),
          duration: 6 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 1.5,
        });
      });
    }

    // 2. Animate back button
    if (backButtonRef.current) {
      masterTl.fromTo(
        backButtonRef.current,
        {
          opacity: 0,
          scale: 0.5,
          rotation: -10,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(2.5)",
        }
      );
    }

    // 3. Animate title
    if (titleRef.current) {
      const title = titleRef.current.querySelector('h1');
      const description = titleRef.current.querySelector('p');
      const badge = titleRef.current.querySelector('.badge-pill');
      
      if (badge) {
        masterTl.fromTo(
          badge,
          {
            opacity: 0,
            scale: 0.8,
            y: -10,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(2)",
          },
          0
        );
      }
      
      if (title) {
        masterTl.fromTo(
          title,
          {
            opacity: 0,
            y: 50,
            scale: 0.95,
            filter: "blur(12px)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "back.out(2.2)",
          },
          "-=0.2"
        );
      }
      
      if (description) {
        masterTl.fromTo(
          description,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.7"
        );
      }
    }

    // 4. Animate calculator
    if (calculatorRef.current) {
      const calculatorItems = calculatorRef.current.querySelectorAll(
        '.calculator-container > *, [class*="calculator-"], .calc-section, .calc-item'
      );
      
      if (calculatorItems.length > 0) {
        masterTl.fromTo(
          calculatorItems,
          {
            opacity: 0,
            y: 60,
            rotationX: 12,
            transformPerspective: 1000,
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.9,
            stagger: {
              amount: 0.7,
              from: "start",
              ease: "power2.out",
              grid: "auto",
            },
            ease: "back.out(1.6)",
          },
          "-=0.3"
        );

        calculatorItems.forEach((item) => {
          const el = item as HTMLElement;
          
          el.addEventListener('mouseenter', () => {
            gsap.to(el, {
              scale: 1.03,
              y: -6,
              boxShadow: "0 24px 48px -12px rgba(16, 185, 129, 0.25)",
              borderColor: "rgba(16, 185, 129, 0.2)",
              duration: 0.5,
              ease: "power2.out",
            });
          });
          
          el.addEventListener('mouseleave', () => {
            gsap.to(el, {
              scale: 1,
              y: 0,
              boxShadow: "none",
              borderColor: "transparent",
              duration: 0.4,
              ease: "power2.out",
            });
          });
        });
      } else {
        masterTl.fromTo(
          calculatorRef.current,
          {
            opacity: 0,
            y: 70,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: "back.out(1.8)",
          },
          "-=0.3"
        );
      }
    }

    return () => {
      masterTl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [isLoading]);

  const handleBackClick = (e: React.MouseEvent) => {
    const button = e.currentTarget as HTMLElement;
    
    // Create ripple effect
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    gsap.to(ripple, {
      scale: 1.5,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => {
        ripple.remove();
      },
    });
    
    setTimeout(() => {
      navigate(-1);
    }, 250);
  };

  // Hover animation - green glow, no zoom
  const handleBackHover = (isHovering: boolean) => {
    if (backButtonRef.current) {
      gsap.to(backButtonRef.current, {
        backgroundColor: isHovering ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.8)",
        borderColor: isHovering ? "rgba(16, 185, 129, 0.4)" : "rgba(226, 232, 240, 0.8)",
        boxShadow: isHovering 
          ? "0 4px 24px -4px rgba(16, 185, 129, 0.3), inset 0 0 0 1px rgba(16, 185, 129, 0.1)" 
          : "0 1px 3px rgba(0, 0, 0, 0.04)",
        duration: 0.35,
        ease: "power2.out",
      });
      
      const icon = backButtonRef.current.querySelector('svg');
      if (icon) {
        gsap.to(icon, {
          color: isHovering ? "#059669" : "#64748b",
          duration: 0.35,
          ease: "power2.out",
        });
      }
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 flex items-center justify-center z-50">
        <div ref={loadingRef} className="flex flex-col items-center gap-6">
          {/* Animated Logo */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-200/50">
              <Sparkles className="w-12 h-12 text-white animate-pulse" />
            </div>
            {/* Rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-emerald-200/30 animate-spin" style={{ borderTopColor: '#10b981' }} />
          </div>
          
          {/* Loading text with dots animation */}
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
            <span className="text-lg font-semibold text-slate-700">Loading Calculators</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </span>
          </div>
          
          {/* Loading progress bar */}
          <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-loading-bar" />
          </div>
        </div>
        
        {/* Add loading animation keyframes */}
        <style>{`
          @keyframes loading-bar {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
          .animate-loading-bar {
            animation: loading-bar 2s ease-in-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 overflow-hidden">
      {/* Background decorative elements */}
      <div ref={decorRef} className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header with icon-only back button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            ref={backButtonRef}
            onClick={handleBackClick}
            onMouseEnter={() => handleBackHover(true)}
            onMouseLeave={() => handleBackHover(false)}
            className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm transition-all duration-300 hover:border-emerald-300/60 group"
            style={{ opacity: 0, transform: 'scale(0.5)' }}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500 transition-colors duration-300 group-hover:text-emerald-600" strokeWidth={2.5} />
            {/* Tooltip */}
            <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-500 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Back
            </span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-emerald-200/40 ring-1 ring-emerald-300/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent tracking-tight">
                  Calculators
                </h1>
                <span className="badge-pill inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100/80 rounded-full border border-emerald-200/50 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  23 Tools
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5 max-w-2xl">
                Explore intelligent linear algebra tools — from matrices to eigenvectors
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Container */}
        <div 
          ref={calculatorRef}
          className="relative"
          style={{ opacity: 0 }}
        >
          <CalculatorApp />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <Grid className="w-3.5 h-3.5" />
            <span>All tools powered by modern linear algebra algorithms</span>
            <Layers className="w-3.5 h-3.5" />
          </p>
        </div>
      </div>
    </div>
  );
}