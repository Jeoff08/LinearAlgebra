// TopicPage.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  ArrowLeft, 
  Calculator, 
  ChevronDown,
  FlaskConical
} from "lucide-react";
import TOPICS from "../data/topics/index";

// Import all calculators
import SystemOfEquations from "../calculators/SystemOfEquations";
import MatrixCalculator from "../calculators/MatrixCalculator";
import MatrixOperations from "../calculators/MatrixOperations";
import MatrixInverse from "../calculators/MatrixInverse";
import DeterminantCalculator from "../calculators/DeterminantCalculator";
import RankCalculator from "../calculators/RankCalculator";
import EigenCalculator from "../calculators/EigenCalculator";
import VectorCalculator from "../calculators/VectorCalculator";
import DotProduct from "../calculators/DotProduct";
import CrossProduct from "../calculators/CrossProduct";
import VectorProjection from "../calculators/VectorProjection";
import LinearIndependence from "../calculators/LinearIndependence";
import LinearCombination from "../calculators/LinearCombination";
import BasisCalculator from "../calculators/BasisCalculator";
import SpanCalculator from "../calculators/SpanCalculator";
import LUDecomposition from "../calculators/LUDecomposition";
import QRDecomposition from "../calculators/QRDecomposition";
import SVDCalculator from "../calculators/SVDCalculator";
import TransposeCalculator from "../calculators/TransposeCalculator";
import Diagonalization from "../calculators/Diagonalization";
import LeastSquares from "../calculators/LeastSquares";
import LinearTransformation from "../calculators/LinearTransformation";
import QuadraticForm from "../calculators/QuadraticForm";

// Calculator Registry
const CALCULATORS: Record<string, { name: string; description: string; component: React.ReactNode }> = {
  determinant: {
    name: "Determinant Calculator",
    description: "Laplace expansion & cofactor calculation",
    component: <DeterminantCalculator />
  },
  inverse: {
    name: "Matrix Inverse (A⁻¹)",
    description: "Invert 2x2, 3x3, 4x4 matrices step-by-step",
    component: <MatrixInverse />
  },
  equations: {
    name: "System of Linear Equations",
    description: "Solve n equations & n variables (Gaussian elimination)",
    component: <SystemOfEquations />
  },
  matrixops: {
    name: "Matrix Operations",
    description: "A+B, A-B, scalar mult & AB multiplication",
    component: <MatrixOperations />
  },
  matrix: {
    name: "Matrix Calculator",
    description: "Matrix powers, scalar ops & conversions",
    component: <MatrixCalculator />
  },
  rank: {
    name: "Matrix Rank & Nullity",
    description: "Row echelon reduction & rank theorem",
    component: <RankCalculator />
  },
  transpose: {
    name: "Transpose Calculator",
    description: "Compute A^T and symmetry checks",
    component: <TransposeCalculator />
  },
  vector: {
    name: "Vector Calculator",
    description: "Vector magnitudes, angles & normalization",
    component: <VectorCalculator />
  },
  dot: {
    name: "Dot Product (u · v)",
    description: "Inner product, orthogonality & cosine",
    component: <DotProduct />
  },
  cross: {
    name: "Cross Product (u × v)",
    description: "3D vector normal & cross product",
    component: <CrossProduct />
  },
  projection: {
    name: "Vector Projection (proj)",
    description: "Orthogonal projection onto lines & planes",
    component: <VectorProjection />
  },
  independence: {
    name: "Linear Independence",
    description: "Test vector sets for independence & dependence",
    component: <LinearIndependence />
  },
  combination: {
    name: "Linear Combination",
    description: "Express target vector as c1 v1 + c2 v2",
    component: <LinearCombination />
  },
  basis: {
    name: "Basis & Dimension",
    description: "Extract basis vectors and compute dim",
    component: <BasisCalculator />
  },
  span: {
    name: "Span Calculator",
    description: "Determine if vector belongs to span",
    component: <SpanCalculator />
  },
  eigen: {
    name: "Eigenvalues & Eigenvectors",
    description: "det(A - λI) = 0 characteristic polynomial",
    component: <EigenCalculator />
  },
  diagonalization: {
    name: "Matrix Diagonalization (PDP⁻¹)",
    description: "Diagonalize square matrices & compute powers",
    component: <Diagonalization />
  },
  lu: {
    name: "LU Decomposition (PA = LU)",
    description: "Lower-Upper factorization with pivoting",
    component: <LUDecomposition />
  },
  qr: {
    name: "QR Decomposition (A = QR)",
    description: "Gram-Schmidt orthogonal Q and upper R",
    component: <QRDecomposition />
  },
  svd: {
    name: "SVD Calculator (UΣVᵀ)",
    description: "Singular Value Decomposition",
    component: <SVDCalculator />
  },
  leastsquares: {
    name: "Least Squares Solver",
    description: "Overdetermined systems & regression",
    component: <LeastSquares />
  },
  transformation: {
    name: "Linear Transformation",
    description: "Matrix T(v) = Av geometric mappings",
    component: <LinearTransformation />
  },
  quadratic: {
    name: "Quadratic Form",
    description: "Matrix x^T A x analysis & definiteness",
    component: <QuadraticForm />
  }
};

// Helper: Determine recommended calculator based on topic and active section content
function getRecommendedCalculatorId(topicId: string, sectionTitle: string = "", sectionContent: string = ""): string {
  const combined = `${topicId} ${sectionTitle} ${sectionContent}`.toLowerCase();

  // Section-specific high priority keywords
  if (combined.includes("cross product") || combined.includes("u × v") || combined.includes("u x v")) return "cross";
  if (combined.includes("projection") || combined.includes("proj_") || combined.includes("orthogonal component")) return "projection";
  if (combined.includes("dot product") || combined.includes("inner product") || combined.includes("angle between")) return "dot";
  if (combined.includes("gram-schmidt") || combined.includes("qr decomp")) return "qr";
  if (combined.includes("svd") || combined.includes("singular value")) return "svd";
  if (combined.includes("lu decomp") || combined.includes("lu factor")) return "lu";
  if (combined.includes("diagonaliz")) return "diagonalization";
  if (combined.includes("eigenvalue") || combined.includes("eigenvector") || combined.includes("characteristic equation")) return "eigen";
  if (combined.includes("least square") || combined.includes("normal equation")) return "leastsquares";
  if (combined.includes("quadratic form") || combined.includes("definite")) return "quadratic";
  if (combined.includes("transformation") || combined.includes("kernel") || combined.includes("range")) return "transformation";
  if (combined.includes("basis") || combined.includes("dimension") || combined.includes("subspace")) return "basis";
  if (combined.includes("independence") || combined.includes("linearly dependent") || combined.includes("linearly independent")) return "independence";
  if (combined.includes("linear combination")) return "combination";
  if (combined.includes("span")) return "span";
  if (combined.includes("determinant") || combined.includes("cofactor") || combined.includes("cramer")) return "determinant";
  if (combined.includes("inverse") || combined.includes("invertible") || combined.includes("adjugate") || combined.includes("a^-1") || combined.includes("a⁻¹")) return "inverse";
  if (combined.includes("rank") || combined.includes("nullity") || combined.includes("row echelon")) return "rank";
  if (combined.includes("transpose") || combined.includes("symmetric matrix")) return "transpose";
  if (combined.includes("system of") || combined.includes("gaussian") || combined.includes("gauss-jordan")) return "equations";
  if (combined.includes("multiplication") || combined.includes("addition") || combined.includes("product")) return "matrixops";

  // Topic ID based fallback mappings
  switch (topicId) {
    case "determinants":
      return "determinant";
    case "inverses":
      return "inverse";
    case "systems":
    case "numerical-linear-algebra":
    case "applications":
      return "equations";
    case "matrices":
    case "foundations":
      return "matrixops";
    case "rank":
      return "rank";
    case "vectors":
    case "complex-vector-spaces":
      return "vector";
    case "inner-product":
      return "dot";
    case "orthogonality":
      return "projection";
    case "independence-span":
      return "independence";
    case "change-of-basis":
    case "fundamental-subspaces":
      return "basis";
    case "eigen":
      return "eigen";
    case "diagonalization":
      return "diagonalization";
    case "lu":
    case "matrix-factorizations":
      return "lu";
    case "qr":
      return "qr";
    case "svd":
      return "svd";
    case "least-squares":
    case "optimization":
      return "leastsquares";
    case "linear-transformations":
      return "transformation";
    case "quadratic-forms":
      return "quadratic";
    case "advanced-matrix-topics":
      return "matrix";
    default:
      return "matrixops";
  }
}

export default function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const topic = TOPICS.find((t) => t.id === id);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Active calculator state
  const [activeCalcId, setActiveCalcId] = useState<string>("matrixops");
  const [isCalcSelectorOpen, setIsCalcSelectorOpen] = useState(false);

  // Topic order & navigation
  const currentTopicIndex = useMemo(() => TOPICS.findIndex((t) => t.id === id), [id]);
  const prevTopic = currentTopicIndex > 0 ? TOPICS[currentTopicIndex - 1] : null;
  const nextTopic = currentTopicIndex < TOPICS.length - 1 ? TOPICS[currentTopicIndex + 1] : null;

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [id]);

  // Extract sections with numbers (1 to 10 etc)
  const sections = useMemo(() => {
    return Array.from(
      topic?.details.matchAll(/^\s*(\d+)\.\s*(.+)$/gm) || [],
    ).map((match) => ({
      id: `topic-section-${match[1]}`,
      number: parseInt(match[1]),
      title: match[2].trim(),
      content: match[0]
    }));
  }, [topic]);

  // Get the section content (between section headers)
  const getSectionContent = (sectionNumber: number) => {
    if (!topic) return "";
    const details = topic.details;
    const sectionRegex = new RegExp(`^\\s*${sectionNumber}\\.\\s*.+$`, 'gm');
    const nextSectionRegex = new RegExp(`^\\s*${sectionNumber + 1}\\.\\s*.+$`, 'gm');
    
    let startIndex = details.search(sectionRegex);
    let endIndex = details.search(nextSectionRegex);
    
    if (startIndex === -1) return '';
    
    const headerMatch = details.substring(startIndex).match(/^.*$/m);
    if (headerMatch) {
      startIndex += headerMatch[0].length;
    }
    
    if (endIndex !== -1) {
      return details.substring(startIndex, endIndex).trim();
    } else {
      return details.substring(startIndex).trim();
    }
  };

  // ─── Parse an example matrix from section content ────────────────────────────
  const parseExampleMatrix = (content: string): number[][] | null => {
    // Match patterns like: A = [2 1]\n[1 1]  or  [[2, 1], [1, 1]]  or  [2 1; 1 1]
    // Strategy 1: Find rows like "[2 1]" or "[2, 1]" across consecutive lines
    const rowPattern = /\[([\d\s,\.\-]+)\]/g;
    const rows: number[][] = [];
    let match;
    while ((match = rowPattern.exec(content)) !== null) {
      const nums = match[1].split(/[,\s]+/).filter(Boolean).map(Number).filter(n => !isNaN(n));
      if (nums.length >= 2 && nums.length <= 4) {
        rows.push(nums);
      }
      if (rows.length >= 4) break; // cap at 4x4
    }
    if (rows.length >= 2) {
      // Ensure all rows same length
      const colLen = rows[0].length;
      const square = rows.filter(r => r.length === colLen).slice(0, colLen);
      if (square.length >= 2) return square;
    }
    // Strategy 2: consecutive number-only lines like  "2 1" / "1 1"
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
    const numLines: number[][] = [];
    for (const line of lines) {
      const parts = line.split(/[,\s]+/).filter(Boolean).map(Number);
      if (parts.length >= 2 && parts.length <= 4 && parts.every(n => !isNaN(n))) {
        numLines.push(parts);
      }
      if (numLines.length >= 4) break;
    }
    if (numLines.length >= 2) {
      const colLen = numLines[0].length;
      const sq = numLines.filter(r => r.length === colLen).slice(0, colLen);
      if (sq.length >= 2) return sq;
    }
    return null;
  };

  // ─── Try in Calculator handler ────────────────────────────────────────────
  const handleTryInCalculator = (sectionNumber: number) => {
    const content = getSectionContent(sectionNumber);
    const matrix = parseExampleMatrix(content);
    // Fire a custom event that the live calculator listens for
    const event = new CustomEvent('try-in-calculator', {
      detail: { matrix, content, sectionNumber },
      bubbles: true
    });
    document.dispatchEvent(event);
    // Flash a visual hint on the right-side calculator header
    const header = document.getElementById('live-calc-header');
    if (header) {
      header.classList.add('ring-2', 'ring-[#B6FF2E]', 'ring-offset-2');
      setTimeout(() => header.classList.remove('ring-2', 'ring-[#B6FF2E]', 'ring-offset-2'), 1200);
    }
  };

  // Synchronize calculator based on active topic and active slide section
  useEffect(() => {
    if (!topic) return;
    let sectionTitle = "";
    let sectionContent = "";

    if (currentSlide > 0 && sections[currentSlide - 1]) {
      const section = sections[currentSlide - 1];
      sectionTitle = section.title;
      sectionContent = getSectionContent(section.number);
    }

    const recommendedId = getRecommendedCalculatorId(topic.id, sectionTitle, sectionContent);
    setActiveCalcId(recommendedId);
  }, [topic, currentSlide, sections]);

  if (!topic) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="font-[Fraunces] text-3xl text-[var(--heading)]">Topic not found</h2>
        <p className="mt-3 text-[var(--muted)]">
          Return to the <Link to="/" className="text-[#B6FF2E] hover:underline font-bold transition-colors">topics list</Link>.
        </p>
      </div>
    );
  }

  // Navigation functions
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    if (currentSlide < slides.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    } else if (nextTopic) {
      goToTopic(nextTopic.id);
    }
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    if (currentSlide > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev - 1);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    } else if (prevTopic) {
      goToTopic(prevTopic.id);
    }
  };

  const goToTopic = (topicId: string) => {
    setIsExiting(true);
    setTimeout(() => {
      setCurrentSlide(0);
      setIsExiting(false);
      setIsEntering(true);
      navigate(`/topics/${topicId}`);
    }, 250);
  };

  // Create slides
  const slides = [
    {
      id: 'overview',
      type: 'overview' as const,
      number: undefined,
      component: (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 min-h-[420px]">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-[#B6FF2E]/10 blur-2xl pointer-events-none" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center rounded-full bg-[#B6FF2E] px-3 py-1 text-xs font-extrabold text-[#1F2329] shadow-sm">
                  Topic #{currentTopicIndex + 1}
                </span>
                <span className="text-xs font-bold text-[var(--muted)]">
                  {sections.length} sections & lessons
                </span>
              </div>
              
              {nextTopic && (
                <button
                  onClick={() => goToTopic(nextTopic.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B6FF2E] hover:underline"
                >
                  <span>Next Topic: {nextTopic.title}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <h1 className="m-0 font-[Fraunces] text-3xl sm:text-4xl text-[var(--heading)] font-bold mb-3 tracking-tight">
              {topic.title}
            </h1>
            <p className="text-[var(--muted)] leading-relaxed text-sm sm:text-base mb-6">
              {topic.summary}
            </p>
            
            {/* Table of Contents */}
            <div className="mt-6 border-t border-[var(--line)] pt-5">
              <h2 className="font-[Fraunces] text-lg font-bold text-[var(--heading)] flex items-center gap-2 mb-3">
                <span className="text-[#B6FF2E]">📑</span> Table of Contents
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {sections.map((section, index) => {
                  const slideIndex = index + 1;
                  return (
                    <button
                      key={section.id}
                      onClick={() => goToSlide(slideIndex)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-[#B6FF2E]/15 text-left border border-transparent hover:border-[#B6FF2E]/30"
                    >
                      <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 ${
                        hoveredIndex === index
                          ? "bg-[#B6FF2E] text-[#1F2329] shadow-md shadow-[#B6FF2E]/30 scale-105"
                          : "bg-slate-200 text-slate-800 dark:bg-[#14171B] dark:text-[#B6FF2E] border border-[var(--line)]"
                      }`}>
                        {section.number}
                      </span>
                      <span className="text-xs sm:text-sm text-[var(--muted)] group-hover:text-[var(--heading)] font-semibold transition-colors duration-200 truncate">
                        {section.title}
                      </span>
                      <span className="ml-auto text-xs text-[#B6FF2E] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Add each numbered section as a slide with full content visible
    ...sections.map((section) => {
      const content = getSectionContent(section.number);
      
      return {
        id: section.id,
        type: 'section' as const,
        number: section.number,
        title: section.title,
        content: content,
        component: (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 min-h-[420px]">
            {/* Section Header */}
            <div className="flex items-start gap-3.5 mb-5 pb-4 border-b border-[var(--line)]">
              {/* Section Number Badge + Try Button */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B6FF2E] text-lg font-bold text-[#1F2329] shadow-lg shadow-[#B6FF2E]/25">
                  {section.number}
                </div>
                {/* Try in Calculator Button */}
                <button
                  onClick={() => handleTryInCalculator(section.number)}
                  title="Paste example from this section into the calculator →"
                  className="group inline-flex items-center gap-0.5 rounded-lg border border-[#B6FF2E]/40 bg-[#B6FF2E]/10 px-1.5 py-0.5 text-[0.6rem] font-extrabold text-[#B6FF2E] transition-all hover:bg-[#B6FF2E] hover:text-[#1F2329] hover:border-[#B6FF2E] hover:shadow-md hover:shadow-[#B6FF2E]/30 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <FlaskConical className="w-2.5 h-2.5" />
                  <span>Try</span>
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#B6FF2E]">
                  Section {section.number} of {sections.length}
                </span>
                <h2 className="font-[Fraunces] text-xl sm:text-2xl text-[var(--heading)] font-bold truncate mt-0.5">
                  {section.title}
                </h2>
              </div>
            </div>

            {/* Section Content */}
            <div className="pt-2">
              <div
                className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-[Fraunces] prose-headings:text-[var(--heading)] prose-p:text-[var(--muted)] prose-strong:text-[var(--heading)] prose-li:text-[var(--muted)] prose-ul:list-disc prose-ol:list-decimal leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: content
                    .replace(/\n/g, "<br />")
                    .replace(/```([^`]+)```/g, '<pre class="bg-slate-100 dark:bg-[#14171B] p-4 rounded-xl overflow-x-auto text-[#1F2329] dark:text-[#B6FF2E] border border-slate-300 dark:border-[#333A46] font-mono text-xs my-3"><code>$1</code></pre>')
                }}
              />
            </div>
          </div>
        )
      };
    })
  ];

  // Navigate back
  const handleBackToTopics = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isTransitioning, nextTopic, prevTopic]);

  const currentCalculator = CALCULATORS[activeCalcId] || CALCULATORS.determinant;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative max-w-[1680px] mx-auto w-full">
      
      {/* Left side: Topic Content & Slide System (7 of 12 columns) */}
      <div className="lg:col-span-7 space-y-5 relative">
        {/* Reading Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-300 dark:bg-slate-800 z-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#B6FF2E] transition-all duration-300 ease-out"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          <Link 
            to="/"
            onClick={handleBackToTopics}
            className="group flex items-center gap-2 rounded-xl border border-[var(--line)] px-3.5 py-2 text-xs font-bold text-[var(--ink)] transition-all duration-200 hover:border-[#B6FF2E] hover:text-[#B6FF2E] bg-[var(--panel)] shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>All Topics</span>
          </Link>

          {/* Prev / Next Topic Quick Switchers */}
          <div className="flex items-center gap-2">
            {prevTopic && (
              <button
                onClick={() => goToTopic(prevTopic.id)}
                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] hover:border-[#B6FF2E] hover:text-[#B6FF2E] text-[var(--muted)] transition-all"
                title={`Previous Topic: ${prevTopic.title}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{prevTopic.title}</span>
              </button>
            )}
            
            <span className="text-xs font-mono font-bold text-[var(--muted)] px-2">
              {currentSlide === 0 ? 'Overview' : `Section ${currentSlide} / ${slides.length - 1}`}
            </span>

            {nextTopic && (
              <button
                onClick={() => goToTopic(nextTopic.id)}
                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] hover:border-[#B6FF2E] hover:text-[#B6FF2E] text-[#B6FF2E] transition-all"
                title={`Next Topic: ${nextTopic.title}`}
              >
                <span className="hidden sm:inline">{nextTopic.title}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Slide Show Container */}
        <div className="relative overflow-hidden min-h-[460px]">
          <div 
            className={`transition-all duration-500 ease-out ${
              isExiting 
                ? 'opacity-0 -translate-x-6 scale-98' 
                : isEntering 
                ? 'opacity-0 translate-x-6 scale-98' 
                : 'opacity-100 translate-x-0 scale-100'
            }`}
          >
            <div className="relative">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`transition-all duration-300 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 translate-x-0'
                      : index < currentSlide
                      ? 'opacity-0 -translate-x-6 pointer-events-none'
                      : 'opacity-0 translate-x-6 pointer-events-none'
                  } ${isTransitioning ? 'scale-98' : 'scale-100'}`}
                  style={{
                    position: index === currentSlide ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  {slide.component}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Controls Bar */}
        <div className="flex items-center justify-between gap-3 pb-3">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0 && !prevTopic || isTransitioning}
            className={`group flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 bg-[var(--panel)] ${
              currentSlide === 0 && !prevTopic || isTransitioning
                ? 'opacity-50 cursor-not-allowed text-[var(--muted)]'
                : 'hover:border-[#B6FF2E] hover:text-[#B6FF2E] hover:shadow-md text-[var(--ink)]'
            }`}
          >
            <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>{currentSlide === 0 ? (prevTopic ? `Prev Topic` : 'Start') : 'Previous Section'}</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-1.5 flex-wrap justify-center max-w-[220px]">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 bg-[#B6FF2E]' 
                    : 'w-2 bg-[var(--muted)] hover:bg-[#B6FF2E]/60'
                }`}
                aria-label={slide.type === 'overview' ? 'Go to overview' : `Go to section ${slide.number}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1 && !nextTopic || isTransitioning}
            className={`group flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 bg-[var(--panel)] ${
              currentSlide === slides.length - 1 && !nextTopic || isTransitioning
                ? 'opacity-50 cursor-not-allowed text-[var(--muted)]'
                : 'hover:border-[#B6FF2E] hover:text-[#B6FF2E] hover:shadow-md text-[var(--ink)]'
            }`}
          >
            <span>{currentSlide === slides.length - 1 ? (nextTopic ? `Next: ${nextTopic.title}` : 'End') : 'Next Section'}</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Right side: Dynamic Topic-Matched Calculator Sandbox (5 of 12 columns) */}
      <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[var(--line)] pt-6 lg:pt-0 lg:pl-6">
        <div className="sticky top-4 space-y-4">
          
          {/* Header with Calculator Selection Dropdown */}
          <div id="live-calc-header" className="relative z-20 rounded-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#B6FF2E] text-[#1F2329] shadow-sm">
                  <Calculator className="w-4 h-4" />
                </div>
                <span className="font-[Fraunces] font-bold text-base text-[var(--heading)]">
                  Live Topic Calculator
                </span>
              </div>

              <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full border border-[#B6FF2E]/40 text-[#B6FF2E] bg-[#1F2329]">
                Auto-Matched
              </span>
            </div>

            {/* Active Calculator Selector Button */}
            <div className="relative">
              <button
                onClick={() => setIsCalcSelectorOpen(!isCalcSelectorOpen)}
                className="w-full flex items-center justify-between gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3.5 py-2 text-left transition-all hover:border-[#B6FF2E]"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--heading)] truncate">
                    {currentCalculator.name}
                  </p>
                  <p className="text-[0.65rem] text-[var(--muted)] truncate">
                    {currentCalculator.description}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#B6FF2E] transition-transform duration-200 ${isCalcSelectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown to switch calculator manually if desired */}
              {isCalcSelectorOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-72 overflow-y-auto rounded-xl border border-[var(--line)] bg-[var(--panel)] p-1.5 shadow-2xl backdrop-blur-xl">
                  {Object.entries(CALCULATORS).map(([calcId, tool]) => (
                    <button
                      key={calcId}
                      onClick={() => {
                        setActiveCalcId(calcId);
                        setIsCalcSelectorOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                        activeCalcId === calcId
                          ? 'bg-[#B6FF2E] text-[#1F2329] font-bold shadow-sm'
                          : 'text-[var(--ink)] hover:bg-[#B6FF2E]/15'
                      }`}
                    >
                      <span className="truncate">{tool.name}</span>
                      {activeCalcId === calcId && <span className="text-[0.65rem]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Calculator Embed Area */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 sm:p-5 shadow-lg shadow-black/5 overflow-hidden">
            <div className="calculator-wrapper-theme">
              {currentCalculator.component}
            </div>
          </div>

          {/* Quick Help Tip */}
          <div className="p-3 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[0.7rem] text-[var(--muted)] flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#B6FF2E] mt-0.5 flex-shrink-0" />
            <p>
              This calculator automatically synchronizes with the current topic (e.g. Inverses, Determinants, Eigenvalues, SVD, Vectors, Projections) and allows exporting answers to PDF!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}