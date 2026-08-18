// components/CalculatorApp.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight, 
  X, 
  Search, 
  Sparkles, 
  CheckCircle2,
  ArrowLeft,
  Grid,
  Layers,
  Cpu,
  Compass,
  Binary
} from 'lucide-react';

// Import all calculator components
import SystemOfEquations from './SystemOfEquations';
import MatrixCalculator from './MatrixCalculator';
import MatrixOperations from './MatrixOperations';
import MatrixInverse from './MatrixInverse';
import DeterminantCalculator from './DeterminantCalculator';
import RankCalculator from './RankCalculator';
import EigenCalculator from './EigenCalculator';
import VectorCalculator from './VectorCalculator';
import DotProduct from './DotProduct';
import CrossProduct from './CrossProduct';
import VectorProjection from './VectorProjection';
import LinearIndependence from './LinearIndependence';
import LinearCombination from './LinearCombination';
import BasisCalculator from './BasisCalculator';
import SpanCalculator from './SpanCalculator';
import LUDecomposition from './LUDecomposition';
import QRDecomposition from './QRDecomposition';
import SVDCalculator from './SVDCalculator';
import TransposeCalculator from './TransposeCalculator';
import Diagonalization from './Diagonalization';
import LeastSquares from './LeastSquares';
import LinearTransformation from './LinearTransformation';
import QuadraticForm from './QuadraticForm';

export interface Tool {
  id: string;
  name: string;
  category: 'equations' | 'matrices' | 'vectors' | 'decompositions';
  component: React.ReactNode;
  description: string;
  badge?: string;
  categoryLabel: string;
}

export const tools: Tool[] = [
  // Linear Systems
  { id: 'equations', name: 'System of Linear Equations', category: 'equations', categoryLabel: 'Linear Systems', component: <SystemOfEquations />, description: 'Solve n equations with n variables using step-by-step Gaussian elimination and augmented matrices.', badge: 'Popular' },
  { id: 'leastsquares', name: 'Least Squares Solver', category: 'equations', categoryLabel: 'Linear Systems', component: <LeastSquares />, description: 'Find best-fit solutions for overdetermined linear systems Ax = b using normal equations and regression.' },
  { id: 'transformation', name: 'Linear Transformation', category: 'equations', categoryLabel: 'Linear Systems', component: <LinearTransformation />, description: 'Compute standard matrix representations T(v) = Av, geometric mappings, kernel, and range.' },
  { id: 'quadratic', name: 'Quadratic Form', category: 'equations', categoryLabel: 'Linear Systems', component: <QuadraticForm />, description: 'Analyze matrix xᵀAx definiteness (positive definite, indefinite) and principal axis theorem.' },

  // Matrices & Inverses
  { id: 'matrix', name: 'Matrix Calculator', category: 'matrices', categoryLabel: 'Matrices & Inverses', component: <MatrixCalculator />, description: 'Compute matrix powers, scalar multiplication, trace, transpose, and general operations.', badge: 'Core' },
  { id: 'matrixops', name: 'Matrix Operations', category: 'matrices', categoryLabel: 'Matrices & Inverses', component: <MatrixOperations />, description: 'Perform addition A+B, subtraction A-B, scalar ops, and matrix multiplication A·B with steps.' },
  { id: 'inverse', name: 'Matrix Inverse (A⁻¹)', category: 'matrices', categoryLabel: 'Matrices & Inverses', component: <MatrixInverse />, description: 'Invert 2x2, 3x3, 4x4, and nxn matrices step-by-step using Gaussian elimination and adjugate matrices.' },
  { id: 'determinant', name: 'Determinant Calculator', category: 'matrices', categoryLabel: 'Matrices & Inverses', component: <DeterminantCalculator />, description: 'Compute matrix determinants using Laplace cofactor expansion and row echelon reductions.', badge: 'Essential' },
  { id: 'rank', name: 'Matrix Rank & Nullity', category: 'matrices', categoryLabel: 'Matrices & Inverses', component: <RankCalculator />, description: 'Determine the rank, nullity, pivot columns, and verify the rank-nullity theorem.' },
  { id: 'transpose', name: 'Transpose Calculator', category: 'matrices', categoryLabel: 'Matrices & Inverses', component: <TransposeCalculator />, description: 'Calculate matrix transpose Aᵀ, conjugate transpose, and verify matrix symmetry.' },

  // Vectors & Spaces
  { id: 'vector', name: 'Vector Calculator', category: 'vectors', categoryLabel: 'Vectors & Spaces', component: <VectorCalculator />, description: 'Calculate vector lengths, magnitudes, unit vector normalizations, and angles in ℝⁿ.' },
  { id: 'dot', name: 'Dot Product (u · v)', category: 'vectors', categoryLabel: 'Vectors & Spaces', component: <DotProduct />, description: 'Compute inner product u·v, angles between vectors, orthogonality tests, and Cauchy-Schwarz.' },
  { id: 'cross', name: 'Cross Product (u × v)', category: 'vectors', categoryLabel: 'Vectors & Spaces', component: <CrossProduct />, description: 'Calculate 3D vector normal cross product u×v, torque vectors, and parallelogram areas.' },
  { id: 'projection', name: 'Vector Projection (proj)', category: 'vectors', categoryLabel: 'Vectors & Spaces', component: <VectorProjection />, description: 'Calculate orthogonal projections of vectors onto lines and subspaces, plus orthogonal complements.' },
  { id: 'independence', name: 'Linear Independence', category: 'vectors', categoryLabel: 'Vectors & Spaces', component: <LinearIndependence />, description: 'Test sets of vectors to determine if they are linearly independent or linearly dependent.' },
  { id: 'combination', name: 'Linear Combination', category: 'vectors', categoryLabel: 'Vectors & Spaces', component: <LinearCombination />, description: 'Express a target vector b as a linear combination c₁v₁ + c₂v₂ + ... + cₖvₖ.' },
  { id: 'basis', name: 'Basis & Dimension', category: 'vectors', categoryLabel: 'Vectors & Spaces', component: <BasisCalculator />, description: 'Extract a linearly independent basis for a spanning set and determine the subspace dimension dim(V).' },
  { id: 'span', name: 'Span Calculator', category: 'vectors', categoryLabel: 'Vectors & Spaces', component: <SpanCalculator />, description: 'Determine whether a given vector belongs to span(v₁,...,vₖ) using augmented matrix rank tests.' },

  // Eigen & Decompositions
  { id: 'eigen', name: 'Eigenvalues & Eigenvectors', category: 'decompositions', categoryLabel: 'Decompositions', component: <EigenCalculator />, description: 'Calculate characteristic polynomials det(A - λI) = 0, eigenvalues, and eigenspaces.' },
  { id: 'diagonalization', name: 'Matrix Diagonalization (PDP⁻¹)', category: 'decompositions', categoryLabel: 'Decompositions', component: <Diagonalization />, description: 'Diagonalize square matrices A = PDP⁻¹ and compute fast matrix powers Aᵏ.' },
  { id: 'lu', name: 'LU Decomposition (PA = LU)', category: 'decompositions', categoryLabel: 'Decompositions', component: <LUDecomposition />, description: 'Factorize matrices into Lower and Upper triangular matrices with partial row pivoting.' },
  { id: 'qr', name: 'QR Decomposition (A = QR)', category: 'decompositions', categoryLabel: 'Decompositions', component: <QRDecomposition />, description: 'Decompose matrices into orthogonal matrix Q and upper triangular matrix R via Gram-Schmidt.' },
  { id: 'svd', name: 'SVD Calculator (UΣVᵀ)', category: 'decompositions', categoryLabel: 'Decompositions', component: <SVDCalculator />, description: 'Perform Singular Value Decomposition A = UΣVᵀ for square or rectangular m×n matrices.', badge: 'Pro' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Tools', count: 23 },
  { id: 'equations', label: 'Linear Systems', count: 4 },
  { id: 'matrices', label: 'Matrices & Inverses', count: 6 },
  { id: 'vectors', label: 'Vectors & Spaces', count: 8 },
  { id: 'decompositions', label: 'Decompositions', count: 5 },
] as const;

interface CalculatorAppProps {
  initialToolId?: string | null;
}

export default function CalculatorApp({ initialToolId = null }: CalculatorAppProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // When null, show the Grid of calculators catalog organized like the All Topics view.
  const [selectedToolId, setSelectedToolId] = useState<string | null>(initialToolId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [clickedToolId, setClickedToolId] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentIndex = selectedToolId ? tools.findIndex(t => t.id === selectedToolId) : -1;
  const currentTool = currentIndex >= 0 ? tools[currentIndex] : null;

  // Filter tools for grid view
  const gridFilteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter tools for dropdown search
  const dropdownFilteredTools = tools.filter(tool => {
    return (
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Navigation handlers for active calculator
  const handlePrevTool = () => {
    if (currentIndex < 0) return;
    const newIdx = (currentIndex - 1 + tools.length) % tools.length;
    setSelectedToolId(tools[newIdx].id);
  };

  const handleNextTool = () => {
    if (currentIndex < 0) return;
    const newIdx = (currentIndex + 1) % tools.length;
    setSelectedToolId(tools[newIdx].id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key: if dropdown open, close it; if inside calculator, go back to grid
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
        } else if (selectedToolId !== null) {
          setSelectedToolId(null);
        }
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isDropdownOpen, selectedToolId]);

  const handleSelectTool = (toolId: string) => {
    setClickedToolId(toolId);
    setTimeout(() => {
      setSelectedToolId(toolId);
      setClickedToolId(null);
      setIsDropdownOpen(false);
      setSearchTerm('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  };

  const handleBackToGrid = () => {
    setSelectedToolId(null);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`space-y-6 ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <AnimatePresence mode="wait">
        {selectedToolId === null || !currentTool ? (
          /* ========================================================= */
          /* VIEW 1: ORGANIZED CALCULATORS CATALOG (ALL TOPICS STYLE)  */
          /* ========================================================= */
          <motion.div
            key="calculators-grid-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Top Filter & Search Controls Bar */}
            <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-5 ${
              isDark ? "border-[#333A46]" : "border-slate-300"
            }`}>
              {/* Category Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? isDark
                            ? 'bg-[#B6FF2E] text-[#1F2329] shadow-md shadow-[#B6FF2E]/25'
                            : 'bg-[#1F2329] text-white shadow-md'
                          : isDark
                            ? 'bg-[#1F2329] text-slate-300 hover:text-[#B6FF2E] hover:bg-[#282E37] border border-[#333A46]'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`rounded-full px-2 py-0.2 text-[10px] font-mono font-bold ${
                        isActive
                          ? isDark ? 'bg-black/20 text-[#1F2329]' : 'bg-white/25 text-white'
                          : isDark ? 'bg-[#14171B] text-[#B6FF2E]' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-[#B6FF2E]" : "text-[#1F2329]"}`} />
                <input
                  type="text"
                  placeholder="Search calculators (e.g., Eigen, Inverse, Span)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full rounded-xl border pl-9 pr-8 py-2 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    isDark 
                      ? "border-[#333A46] bg-[#14171B] text-white focus:border-[#B6FF2E] focus:ring-[#B6FF2E]/20" 
                      : "border-slate-300 bg-white text-[#1F2329] focus:border-[#1F2329] focus:ring-black/10"
                  }`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Calculators Cards Grid (Organized Identical to All Topics Layout) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gridFilteredTools.length > 0 ? (
                gridFilteredTools.map((tool, index) => {
                  const isClicked = clickedToolId === tool.id;
                  return (
                    <motion.article
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: isClicked ? 0.4 : 1,
                        y: 0,
                        scale: isClicked ? 0.97 : 1,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(index * 0.03, 0.3),
                        ease: "easeOut",
                      }}
                      whileHover={{
                        y: -4,
                        borderColor: "rgba(182, 255, 46, 0.5)",
                        boxShadow: isDark
                          ? "0 12px 30px -5px rgba(182, 255, 46, 0.2)"
                          : "0 12px 24px -5px rgba(31, 35, 41, 0.1)",
                      }}
                      onClick={() => handleSelectTool(tool.id)}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 cursor-pointer ${
                        isDark
                          ? "border-[#333A46] bg-[#1F2329]/80 hover:bg-[#1F2329]"
                          : "border-slate-200 bg-white/95 hover:bg-white shadow-md shadow-slate-200/40"
                      }`}
                    >
                      <div>
                        {/* Header: Title + Category/Badge Pill */}
                        <div className="flex items-start justify-between gap-3">
                          <h3 className={`font-[Fraunces] text-lg font-bold transition-colors duration-200 ${
                            isDark ? "text-white group-hover:text-[#B6FF2E]" : "text-[#1F2329] group-hover:text-black"
                          }`}>
                            {tool.name}
                          </h3>
                          
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold flex-shrink-0 ${
                            isDark ? "border-[#333A46] bg-[#14171B] text-[#B6FF2E]" : "border-slate-200 bg-slate-100 text-[#1F2329]"
                          }`}>
                            <Binary className="w-3 h-3 text-[#B6FF2E]" />
                            {tool.badge || tool.category}
                          </span>
                        </div>

                        {/* Summary / Description */}
                        <p className={`mt-2 text-xs sm:text-sm line-clamp-3 leading-relaxed ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}>
                          {tool.description}
                        </p>
                      </div>

                      {/* Footer: Category label + Action Button */}
                      <div className={`mt-5 flex items-center justify-between border-t pt-3 ${
                        isDark ? "border-[#333A46]" : "border-slate-200"
                      }`}>
                        <span className={`text-[0.7rem] font-semibold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          {tool.categoryLabel}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTool(tool.id);
                          }}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition-all duration-200 shadow-sm hover:scale-105 cursor-pointer ${
                            isDark 
                              ? "bg-[#B6FF2E] hover:bg-[#C6FF4D] text-[#14171B]" 
                              : "bg-[#1F2329] hover:bg-black text-[#B6FF2E]"
                          }`}
                        >
                          <span>Open Calculator</span>
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </motion.article>
                  );
                })
              ) : (
                <div className="col-span-full py-16 text-center">
                  <Calculator className="w-10 h-10 mx-auto text-slate-400 mb-3" />
                  <p className={`text-base font-semibold ${isDark ? "text-slate-300" : "text-[#1F2329]"}`}>
                    No calculators found matching &ldquo;{searchTerm}&rdquo;
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Try selecting &quot;All Tools&quot; or clearing the search query.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* ========================================================= */
          /* VIEW 2: ACTIVE CALCULATOR WORKSPACE (WITH DROPDOWN & BACK)*/
          /* ========================================================= */
          <motion.div
            key="calculator-active-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Top Bar: Back to All Calculators + Dropdown Selector + Prev/Next */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
              
              {/* Back to All Calculators Button (Matching TopicPage layout) */}
              <button
                onClick={handleBackToGrid}
                className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-md ${
                  isDark
                    ? 'border-[#333A46] bg-[#1F2329] text-[#B6FF2E] hover:bg-[#282E37] hover:border-[#B6FF2E]/60 shadow-black/50'
                    : 'border-slate-300 bg-white text-[#1F2329] hover:bg-slate-100 hover:border-[#1F2329]'
                }`}
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>All Calculators</span>
                <span className={`hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isDark ? 'bg-[#14171B] text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}>
                  ESC
                </span>
              </button>

              {/* Center Dropdown Tool Switcher Bar */}
              <div className="relative z-40 flex-1 max-w-2xl">
                <button
                  ref={buttonRef}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`group relative w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 backdrop-blur-xl transition-all duration-300 cursor-pointer ${
                    isDark
                      ? isDropdownOpen
                        ? 'border-[#B6FF2E] bg-[#1F2329] shadow-xl shadow-[#B6FF2E]/20 ring-2 ring-[#B6FF2E]/20'
                        : 'border-[#333A46] bg-[#1F2329]/90 hover:border-[#B6FF2E]/60 hover:bg-[#282E37] shadow-md shadow-black/50'
                      : isDropdownOpen
                        ? 'border-[#1F2329] bg-white shadow-xl shadow-black/15 ring-2 ring-black/10'
                        : 'border-slate-300 bg-white/95 hover:border-[#1F2329] hover:bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left min-w-0">
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border ${
                      isDark ? 'bg-[#14171B] text-[#B6FF2E] border-[#333A46]' : 'bg-slate-100 text-[#1F2329] border-slate-200'
                    }`}>
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs sm:text-sm truncate ${
                          isDark ? 'text-white' : 'text-[#1F2329]'
                        }`}>
                          {currentTool.name}
                        </span>
                        {currentTool.badge && (
                          <span className={`hidden sm:inline-flex items-center rounded-full border px-2 py-0.2 text-[0.6rem] font-bold ${
                            isDark ? 'bg-[#14171B] border-[#B6FF2E]/40 text-[#B6FF2E]' : 'bg-[#B6FF2E]/25 border-[#B6FF2E] text-[#1F2329]'
                          }`}>
                            {currentTool.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {currentTool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`rounded-md border px-2 py-0.5 text-[11px] font-mono font-bold ${
                      isDark ? 'bg-[#14171B] border-[#333A46] text-[#B6FF2E]' : 'bg-slate-100 border-slate-200 text-[#1F2329]'
                    }`}>
                      {currentIndex + 1}/{tools.length}
                    </span>
                    <div className={`flex h-6 w-6 items-center justify-center rounded-md ${
                      isDark ? 'text-[#B6FF2E]' : 'text-[#1F2329]'
                    }`}>
                      {isDropdownOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu Drawer */}
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border p-3.5 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 ${
                      isDark
                        ? 'border-[#333A46] bg-[#1F2329]/98 shadow-black/90'
                        : 'border-slate-300 bg-white/98 shadow-slate-300/80'
                    }`}
                  >
                    {/* Search Box */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B6FF2E]" />
                      <input
                        type="text"
                        placeholder="Switch to another calculator..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        className={`w-full rounded-xl border pl-9 pr-8 py-2 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          isDark
                            ? 'border-[#333A46] bg-[#14171B] text-white focus:border-[#B6FF2E] focus:ring-[#B6FF2E]/20'
                            : 'border-slate-300 bg-slate-50 text-[#1F2329] focus:border-[#1F2329] focus:ring-black/10'
                        }`}
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* List of tools */}
                    <div className="grid max-h-[340px] gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
                      {dropdownFilteredTools.map((tool) => {
                        const isSelected = selectedToolId === tool.id;
                        return (
                          <button
                            key={tool.id}
                            onClick={() => handleSelectTool(tool.id)}
                            className={`group flex items-start justify-between gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-200 cursor-pointer ${
                              isDark
                                ? isSelected
                                  ? 'border-[#B6FF2E]/60 bg-[#14171B] text-white shadow-md shadow-black/40'
                                  : 'border-[#333A46]/60 bg-[#1F2329]/50 text-slate-300 hover:border-[#B6FF2E]/40 hover:bg-[#282E37] hover:text-white'
                                : isSelected
                                  ? 'border-[#1F2329] bg-[#B6FF2E]/20 text-[#1F2329] shadow-sm'
                                  : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:border-[#1F2329] hover:bg-white hover:text-black'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold transition-colors ${
                                  isSelected
                                    ? isDark ? 'text-[#B6FF2E]' : 'text-[#1F2329]'
                                    : isDark ? 'group-hover:text-[#B6FF2E]' : 'group-hover:text-black'
                                }`}>
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className={`text-[0.6rem] px-1.5 py-0.2 rounded border font-bold ${
                                    isDark ? 'bg-[#14171B] text-[#B6FF2E] border-[#333A46]' : 'bg-slate-200 text-[#1F2329] border-slate-300'
                                  }`}>
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                {tool.description}
                              </p>
                            </div>

                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#B6FF2E] flex-shrink-0 mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Prev / Next Quick Switchers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevTool}
                  className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    isDark
                      ? 'border-[#333A46] bg-[#1F2329] text-slate-300 hover:border-[#B6FF2E] hover:text-[#B6FF2E] hover:bg-[#282E37]'
                      : 'border-slate-300 bg-white text-[#1F2329] hover:border-black hover:text-black hover:bg-slate-50'
                  }`}
                  title="Previous Calculator"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>
                <button
                  onClick={handleNextTool}
                  className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    isDark
                      ? 'border-[#333A46] bg-[#1F2329] text-slate-300 hover:border-[#B6FF2E] hover:text-[#B6FF2E] hover:bg-[#282E37]'
                      : 'border-slate-300 bg-white text-[#1F2329] hover:border-black hover:text-black hover:bg-slate-50'
                  }`}
                  title="Next Calculator"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Calculator Solver Body Container */}
            <div className={`relative overflow-hidden rounded-3xl border backdrop-blur-2xl transition-all duration-300 ${
              isDark
                ? 'border-[#333A46] bg-[#1F2329]/90 shadow-2xl shadow-black/80 hover:border-[#B6FF2E]/30 text-slate-100'
                : 'border-slate-200 bg-white/95 shadow-xl shadow-slate-200/60 hover:border-slate-300 text-[#1F2329]'
            }`}>
              
              {/* Header Ribbon of Active Tool */}
              <div className={`flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4 ${
                isDark
                  ? 'border-[#333A46] bg-[#14171B]'
                  : 'border-slate-200 bg-slate-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    isDark ? 'bg-[#1F2329] text-[#B6FF2E] border-[#333A46]' : 'bg-white text-[#1F2329] border-slate-200'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`font-[Fraunces] text-lg sm:text-xl font-bold ${
                        isDark ? 'text-white' : 'text-[#1F2329]'
                      }`}>
                        {currentTool.name}
                      </h2>
                      <span className={`rounded-full px-2 py-0.2 text-[0.65rem] font-bold border ${
                        isDark ? 'bg-[#1F2329] text-[#B6FF2E] border-[#333A46]' : 'bg-[#B6FF2E]/25 text-[#1F2329] border-[#B6FF2E]/50'
                      }`}>
                        Ready
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {currentTool.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Calculator Body with Scoped Theme Overrides */}
              <div className={`calculator-wrapper-theme p-5 sm:p-8 ${isDark ? 'dark-mode' : 'light-mode'}`}>
                {currentTool.component}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scoped CSS Rules for Both Light and Dark Modes */}
      <style>{`
        /* DARK MODE STYLES */
        .calculator-wrapper-theme.dark-mode {
          color: #f8fafc;
        }

        .calculator-wrapper-theme.dark-mode input[type="text"],
        .calculator-wrapper-theme.dark-mode input[type="number"],
        .calculator-wrapper-theme.dark-mode textarea,
        .calculator-wrapper-theme.dark-mode select {
          background-color: #14171B !important;
          color: #B6FF2E !important;
          border: 1px solid #333A46 !important;
          border-radius: 0.75rem !important;
          padding: 0.65rem 1rem !important;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
        }

        .calculator-wrapper-theme.dark-mode input:focus,
        .calculator-wrapper-theme.dark-mode textarea:focus,
        .calculator-wrapper-theme.dark-mode select:focus {
          border-color: #B6FF2E !important;
          box-shadow: 0 0 0 3px rgba(182, 255, 46, 0.2) !important;
          background-color: #1F2329 !important;
        }

        .calculator-wrapper-theme.dark-mode button.bg-indigo-600,
        .calculator-wrapper-theme.dark-mode button.bg-blue-600,
        .calculator-wrapper-theme.dark-mode button.bg-green-600,
        .calculator-wrapper-theme.dark-mode button.bg-emerald-600,
        .calculator-wrapper-theme.dark-mode button.bg-emerald-500 {
          background: #B6FF2E !important;
          color: #1F2329 !important;
          font-weight: 700 !important;
          border: none !important;
          box-shadow: 0 4px 15px rgba(182, 255, 46, 0.25) !important;
          border-radius: 0.75rem !important;
          transition: all 0.2s ease-in-out !important;
        }

        .calculator-wrapper-theme.dark-mode button.bg-indigo-600:hover,
        .calculator-wrapper-theme.dark-mode button.bg-blue-600:hover,
        .calculator-wrapper-theme.dark-mode button.bg-green-600:hover,
        .calculator-wrapper-theme.dark-mode button.bg-emerald-600:hover,
        .calculator-wrapper-theme.dark-mode button.bg-emerald-500:hover {
          background: #C6FF4D !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(182, 255, 46, 0.4) !important;
        }

        .calculator-wrapper-theme.dark-mode button.border-slate-300,
        .calculator-wrapper-theme.dark-mode button.border-gray-300,
        .calculator-wrapper-theme.dark-mode button.border-slate-200,
        .calculator-wrapper-theme.dark-mode button.border {
          background-color: #14171B !important;
          color: #cbd5e1 !important;
          border-color: #333A46 !important;
          border-radius: 0.75rem !important;
          transition: all 0.2s ease !important;
        }

        .calculator-wrapper-theme.dark-mode button.border-slate-300:hover,
        .calculator-wrapper-theme.dark-mode button.border-gray-300:hover,
        .calculator-wrapper-theme.dark-mode button.border:hover {
          background-color: #282E37 !important;
          color: #B6FF2E !important;
          border-color: #B6FF2E !important;
        }

        .calculator-wrapper-theme.dark-mode .text-slate-700,
        .calculator-wrapper-theme.dark-mode .text-slate-800,
        .calculator-wrapper-theme.dark-mode .text-gray-800,
        .calculator-wrapper-theme.dark-mode .text-gray-900 {
          color: #f1f5f9 !important;
        }

        .calculator-wrapper-theme.dark-mode .text-slate-500,
        .calculator-wrapper-theme.dark-mode .text-gray-500,
        .calculator-wrapper-theme.dark-mode .text-slate-600,
        .calculator-wrapper-theme.dark-mode .text-gray-600 {
          color: #94a3b8 !important;
        }

        .calculator-wrapper-theme.dark-mode .text-blue-900,
        .calculator-wrapper-theme.dark-mode .text-blue-800,
        .calculator-wrapper-theme.dark-mode .text-indigo-900,
        .calculator-wrapper-theme.dark-mode .text-indigo-800,
        .calculator-wrapper-theme.dark-mode .text-blue-600 {
          color: #B6FF2E !important;
        }

        .calculator-wrapper-theme.dark-mode .bg-slate-50,
        .calculator-wrapper-theme.dark-mode .bg-blue-50,
        .calculator-wrapper-theme.dark-mode .bg-indigo-50 {
          background-color: #14171B !important;
          border: 1px solid #333A46 !important;
          border-radius: 0.85rem !important;
          color: #e2e8f0 !important;
        }

        .calculator-wrapper-theme.dark-mode .bg-green-50,
        .calculator-wrapper-theme.dark-mode .bg-emerald-50 {
          background-color: #1F2329 !important;
          border: 1px solid rgba(182, 255, 46, 0.3) !important;
          border-radius: 0.85rem !important;
          color: #B6FF2E !important;
        }

        .calculator-wrapper-theme.dark-mode .bg-white {
          background-color: #1F2329 !important;
          border-color: #333A46 !important;
          color: #f8fafc !important;
        }

        .calculator-wrapper-theme.dark-mode pre {
          background-color: #14171B !important;
          border: 1px solid #333A46 !important;
          color: #B6FF2E !important;
          border-radius: 0.75rem !important;
          padding: 1rem !important;
        }

        /* LIGHT MODE STYLES */
        .calculator-wrapper-theme.light-mode {
          color: #1F2329;
        }

        .calculator-wrapper-theme.light-mode input[type="text"],
        .calculator-wrapper-theme.light-mode input[type="number"],
        .calculator-wrapper-theme.light-mode textarea,
        .calculator-wrapper-theme.light-mode select {
          background-color: #ffffff !important;
          color: #1F2329 !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 0.75rem !important;
          padding: 0.65rem 1rem !important;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
        }

        .calculator-wrapper-theme.light-mode input:focus,
        .calculator-wrapper-theme.light-mode textarea:focus,
        .calculator-wrapper-theme.light-mode select:focus {
          border-color: #1F2329 !important;
          box-shadow: 0 0 0 3px rgba(31, 35, 41, 0.15) !important;
          background-color: #ffffff !important;
        }

        .calculator-wrapper-theme.light-mode button.bg-indigo-600,
        .calculator-wrapper-theme.light-mode button.bg-blue-600,
        .calculator-wrapper-theme.light-mode button.bg-green-600,
        .calculator-wrapper-theme.light-mode button.bg-emerald-600,
        .calculator-wrapper-theme.light-mode button.bg-emerald-500 {
          background: #1F2329 !important;
          color: #B6FF2E !important;
          font-weight: 700 !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(31, 35, 41, 0.25) !important;
          border-radius: 0.75rem !important;
          transition: all 0.2s ease-in-out !important;
        }

        .calculator-wrapper-theme.light-mode button.bg-indigo-600:hover,
        .calculator-wrapper-theme.light-mode button.bg-blue-600:hover,
        .calculator-wrapper-theme.light-mode button.bg-green-600:hover,
        .calculator-wrapper-theme.light-mode button.bg-emerald-600:hover,
        .calculator-wrapper-theme.light-mode button.bg-emerald-500:hover {
          background: #282E37 !important;
          transform: translateY(-1px) !important;
        }

        .calculator-wrapper-theme.light-mode button.border-gray-300,
        .calculator-wrapper-theme.light-mode button.border-slate-300,
        .calculator-wrapper-theme.light-mode button.border-slate-200,
        .calculator-wrapper-theme.light-mode button.border {
          background-color: #f8fafc !important;
          color: #334155 !important;
          border-color: #cbd5e1 !important;
          border-radius: 0.75rem !important;
          transition: all 0.2s ease !important;
        }

        .calculator-wrapper-theme.light-mode button.border-slate-300:hover,
        .calculator-wrapper-theme.light-mode button.border-gray-300:hover,
        .calculator-wrapper-theme.light-mode button.border:hover {
          background-color: #f1f5f9 !important;
          color: #0f172a !important;
          border-color: #94a3b8 !important;
        }

        .calculator-wrapper-theme.light-mode .text-slate-700,
        .calculator-wrapper-theme.light-mode .text-slate-800,
        .calculator-wrapper-theme.light-mode .text-gray-800 {
          color: #1e293b !important;
          font-weight: 600 !important;
        }

        .calculator-wrapper-theme.light-mode .text-gray-500,
        .calculator-wrapper-theme.light-mode .text-slate-600,
        .calculator-wrapper-theme.light-mode .text-gray-600 {
          color: #64748b !important;
        }

        .calculator-wrapper-theme.light-mode .bg-slate-50,
        .calculator-wrapper-theme.light-mode .bg-blue-50,
        .calculator-wrapper-theme.light-mode .bg-indigo-50 {
          background-color: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 0.85rem !important;
          color: #1e293b !important;
        }

        .calculator-wrapper-theme.light-mode .bg-green-50,
        .calculator-wrapper-theme.light-mode .bg-emerald-50 {
          background-color: #f7fee7 !important;
          border: 1px solid #d9f99d !important;
          border-radius: 0.85rem !important;
          color: #365314 !important;
        }

        .calculator-wrapper-theme.light-mode pre {
          background-color: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          color: #1F2329 !important;
          border-radius: 0.75rem !important;
          padding: 1rem !important;
        }
      `}</style>
    </div>
  );
}