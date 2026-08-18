// components/CalculatorApp.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Calculator, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  X, 
  Search, 
  Sparkles, 
  CheckCircle2
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
}

export const tools: Tool[] = [
  // Linear Systems
  { id: 'equations', name: 'System of Linear Equations', category: 'equations', component: <SystemOfEquations />, description: 'Solve n equations & n variables (Gaussian elimination)', badge: 'Popular' },
  { id: 'leastsquares', name: 'Least Squares Solver', category: 'equations', component: <LeastSquares />, description: 'Overdetermined systems Ax = b curve fitting' },
  { id: 'transformation', name: 'Linear Transformation', category: 'equations', component: <LinearTransformation />, description: 'Matrix T(v) = Av geometric mappings' },
  { id: 'quadratic', name: 'Quadratic Form', category: 'equations', component: <QuadraticForm />, description: 'Matrix x^T A x analysis & definiteness' },

  // Matrices & Inverses
  { id: 'matrix', name: 'Matrix Calculator', category: 'matrices', component: <MatrixCalculator />, description: 'Matrix powers, scalar ops & conversions', badge: 'Core' },
  { id: 'matrixops', name: 'Matrix Operations', category: 'matrices', component: <MatrixOperations />, description: 'Matrix addition A+B, subtraction A-B & multiplication AB' },
  { id: 'inverse', name: 'Matrix Inverse (A⁻¹)', category: 'matrices', component: <MatrixInverse />, description: 'Invert 2x2, 3x3, 4x4, nxn matrices step-by-step' },
  { id: 'determinant', name: 'Determinant Calculator', category: 'matrices', component: <DeterminantCalculator />, description: 'Laplace expansion & cofactor calculation', badge: 'Essential' },
  { id: 'rank', name: 'Matrix Rank & Nullity', category: 'matrices', component: <RankCalculator />, description: 'Row echelon reduction & rank theorem' },
  { id: 'transpose', name: 'Transpose Calculator', category: 'matrices', component: <TransposeCalculator />, description: 'Compute A^T and conjugate transpose' },

  // Vectors & Spaces
  { id: 'vector', name: 'Vector Calculator', category: 'vectors', component: <VectorCalculator />, description: 'Vector magnitudes, angles & normalization' },
  { id: 'dot', name: 'Dot Product (u · v)', category: 'vectors', component: <DotProduct />, description: 'Inner product, orthogonality & cosine similarity' },
  { id: 'cross', name: 'Cross Product (u × v)', category: 'vectors', component: <CrossProduct />, description: '3D vector normal, torque & area computation' },
  { id: 'projection', name: 'Vector Projection (proj)', category: 'vectors', component: <VectorProjection />, description: 'Orthogonal projection onto lines & planes' },
  { id: 'independence', name: 'Linear Independence', category: 'vectors', component: <LinearIndependence />, description: 'Test vector sets for independence & dependence' },
  { id: 'combination', name: 'Linear Combination', category: 'vectors', component: <LinearCombination />, description: 'Express target vector as c1 v1 + c2 v2' },
  { id: 'basis', name: 'Basis & Dimension', category: 'vectors', component: <BasisCalculator />, description: 'Extract basis vectors for span(S) and compute dim' },
  { id: 'span', name: 'Span Calculator', category: 'vectors', component: <SpanCalculator />, description: 'Determine if target vector belongs to span' },

  // Eigen & Decompositions
  { id: 'eigen', name: 'Eigenvalues & Eigenvectors', category: 'decompositions', component: <EigenCalculator />, description: 'Characteristic polynomial det(A - λI) = 0', badge: 'Advanced' },
  { id: 'diagonalization', name: 'Matrix Diagonalization (PDP⁻¹)', category: 'decompositions', component: <Diagonalization />, description: 'Diagonalize square matrices & compute powers' },
  { id: 'lu', name: 'LU Decomposition (PA = LU)', category: 'decompositions', component: <LUDecomposition />, description: 'Lower-Upper factorization with partial pivoting' },
  { id: 'qr', name: 'QR Decomposition (A = QR)', category: 'decompositions', component: <QRDecomposition />, description: 'Gram-Schmidt orthogonal Q and upper triangular R' },
  { id: 'svd', name: 'SVD Calculator (UΣVᵀ)', category: 'decompositions', component: <SVDCalculator />, description: 'Singular Value Decomposition for any m×n matrix', badge: 'Pro' },
];

export default function CalculatorApp() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Default to first tool so user sees an active calculator immediately
  const [selectedTool, setSelectedTool] = useState<string>('equations');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentIndex = tools.findIndex(t => t.id === selectedTool);
  const currentTool = tools[currentIndex] || tools[0];

  // Filter tools based on search query
  const filteredTools = tools.filter(tool => {
    return (
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Navigation handlers
  const handlePrevTool = () => {
    const newIdx = (currentIndex - 1 + tools.length) % tools.length;
    setSelectedTool(tools[newIdx].id);
  };

  const handleNextTool = () => {
    const newIdx = (currentIndex + 1) % tools.length;
    setSelectedTool(tools[newIdx].id);
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

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`space-y-6 ${isDark ? 'theme-dark' : 'theme-light'}`}>
      {/* Interactive Tool Selector Bar & Dropdown Menu */}
      <div className="relative z-30">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Main Select Button */}
          <button
            ref={buttonRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`group relative flex-1 flex items-center justify-between gap-3 rounded-2xl border px-4 sm:px-5 py-3.5 backdrop-blur-xl transition-all duration-300 ${
              isDark
                ? isDropdownOpen
                  ? 'border-[#B6FF2E] bg-[#1F2329] shadow-xl shadow-[#B6FF2E]/20 ring-2 ring-[#B6FF2E]/20'
                  : 'border-[#333A46] bg-[#1F2329]/90 hover:border-[#B6FF2E]/60 hover:bg-[#282E37] shadow-lg shadow-black/60'
                : isDropdownOpen
                  ? 'border-[#1F2329] bg-white shadow-xl shadow-[#B6FF2E]/20 ring-2 ring-[#B6FF2E]/30'
                  : 'border-slate-300 bg-white/95 hover:border-[#1F2329] hover:bg-white shadow-md shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-3.5 text-left min-w-0">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#14171B] text-[#B6FF2E] border border-[#333A46] shadow-md shadow-black/40">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm sm:text-base transition-colors truncate ${
                    isDark ? 'text-white group-hover:text-[#B6FF2E]' : 'text-[#1F2329] group-hover:text-black'
                  }`}>
                    {currentTool.name}
                  </span>
                  {currentTool.badge && (
                    <span className={`hidden sm:inline-flex items-center rounded-full border px-2 py-0.2 text-[0.65rem] font-bold ${
                      isDark ? 'bg-[#14171B] border-[#B6FF2E]/40 text-[#B6FF2E]' : 'bg-[#B6FF2E]/25 border-[#B6FF2E] text-[#1F2329]'
                    }`}>
                      {currentTool.badge}
                    </span>
                  )}
                </div>
                <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {currentTool.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <span className={`rounded-lg border px-2.5 py-1 text-xs font-mono font-bold ${
                isDark ? 'bg-[#14171B] border-[#333A46] text-[#B6FF2E]' : 'bg-slate-100 border-slate-300 text-[#1F2329]'
              }`}>
                {currentIndex + 1} / {tools.length}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                isDark ? 'bg-[#14171B] text-[#B6FF2E]' : 'bg-slate-100 text-[#1F2329]'
              }`}>
                {isDropdownOpen ? (
                  <ChevronUp className="w-4 h-4 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Dropdown Floating Drawer Menu */}
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className={`absolute left-0 right-0 top-full mt-2.5 z-50 rounded-2xl border p-3.5 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 ${
              isDark
                ? 'border-[#333A46] bg-[#1F2329]/95 shadow-black/90'
                : 'border-slate-300 bg-white/98 shadow-slate-300/80'
            }`}
          >
            {/* Search Box */}
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B6FF2E]" />
              <input
                type="text"
                placeholder="Search all 23 linear algebra calculators (e.g. eigenvalue, inverse, projection)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className={`w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B6FF2E]/30 transition-all ${
                  isDark
                    ? 'border-[#333A46] bg-[#14171B] text-white focus:border-[#B6FF2E]'
                    : 'border-slate-300 bg-slate-50 text-[#1F2329] focus:border-[#1F2329]'
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List of tools */}
            <div className="grid max-h-[380px] sm:max-h-[420px] gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => {
                  const isSelected = selectedTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleSelect(tool.id)}
                      className={`group flex items-start justify-between gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-200 ${
                        isDark
                          ? isSelected
                            ? 'border-[#B6FF2E]/60 bg-[#14171B] text-white shadow-md shadow-black/40'
                            : 'border-[#333A46]/60 bg-[#1F2329]/50 text-slate-300 hover:border-[#B6FF2E]/40 hover:bg-[#282E37] hover:text-white'
                          : isSelected
                            ? 'border-[#1F2329] bg-[#B6FF2E]/20 text-[#1F2329] shadow-sm shadow-[#B6FF2E]/20'
                            : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:border-[#1F2329] hover:bg-white hover:text-black'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs sm:text-sm font-bold transition-colors ${
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
                        <p className={`text-[0.72rem] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {tool.description}
                        </p>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#B6FF2E] flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-2 py-8 text-center text-slate-400">
                  <p className="text-sm">No calculators found matching &ldquo;{searchTerm}&rdquo;</p>
                  <p className="text-xs text-slate-500 mt-1">Try searching for &quot;determinant&quot;, &quot;inverse&quot;, or &quot;vector&quot;</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`mt-3 flex items-center justify-between border-t pt-2.5 text-[0.7rem] ${
              isDark ? 'border-[#333A46] text-slate-400' : 'border-slate-200 text-slate-600'
            }`}>
              <span className="flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 text-[#B6FF2E]" />
                {filteredTools.length} of {tools.length} calculators ready
              </span>
              <span>Press <kbd className={`rounded px-1.5 py-0.5 font-mono text-[0.65rem] ${
                isDark ? 'bg-[#14171B] text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}>ESC</kbd> to close</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Active Calculator Interactive Card */}
      <div className={`relative overflow-hidden rounded-3xl border backdrop-blur-2xl transition-all duration-300 ${
        isDark
          ? 'border-[#333A46] bg-[#1F2329]/90 shadow-2xl shadow-black/80 hover:border-[#B6FF2E]/30 text-slate-100'
          : 'border-slate-200 bg-white/95 shadow-xl shadow-slate-200/60 hover:border-slate-300 text-[#1F2329]'
      }`}>
        
        {/* Header Ribbon */}
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

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevTool}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
                isDark
                  ? 'border-[#333A46] bg-[#1F2329] text-slate-300 hover:border-[#B6FF2E] hover:text-[#B6FF2E]'
                  : 'border-slate-300 bg-white text-[#1F2329] hover:border-black hover:text-black'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <button
              onClick={handleNextTool}
              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all ${
                isDark
                  ? 'border-[#333A46] bg-[#1F2329] text-slate-300 hover:border-[#B6FF2E] hover:text-[#B6FF2E]'
                  : 'border-slate-300 bg-white text-[#1F2329] hover:border-black hover:text-black'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Calculator Body with Scoped Theme Overrides */}
        <div className={`calculator-wrapper-theme p-5 sm:p-8 ${isDark ? 'dark-mode' : 'light-mode'}`}>
          {currentTool.component}
        </div>
      </div>

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
          font-size: 0.875rem !important;
          outline: none !important;
          transition: all 0.2s ease-in-out !important;
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
        .calculator-wrapper-theme.dark-mode .text-gray-700,
        .calculator-wrapper-theme.dark-mode .text-slate-800,
        .calculator-wrapper-theme.dark-mode .text-gray-800 {
          color: #f1f5f9 !important;
          font-weight: 600 !important;
        }

        .calculator-wrapper-theme.dark-mode .text-slate-500,
        .calculator-wrapper-theme.dark-mode .text-gray-500,
        .calculator-wrapper-theme.dark-mode .text-slate-600,
        .calculator-wrapper-theme.dark-mode .text-gray-600 {
          color: #94a3b8 !important;
        }

        .calculator-wrapper-theme.dark-mode .text-blue-900,
        .calculator-wrapper-theme.dark-mode .text-indigo-900 {
          color: #B6FF2E !important;
        }

        .calculator-wrapper-theme.dark-mode .bg-slate-50,
        .calculator-wrapper-theme.dark-mode .bg-gray-50,
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
          font-size: 0.875rem !important;
          outline: none !important;
          transition: all 0.2s ease-in-out !important;
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

        .calculator-wrapper-theme.light-mode button.border-slate-300,
        .calculator-wrapper-theme.light-mode button.border-gray-300,
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
        .calculator-wrapper-theme.light-mode .text-gray-700,
        .calculator-wrapper-theme.light-mode .text-slate-800,
        .calculator-wrapper-theme.light-mode .text-gray-800 {
          color: #1e293b !important;
          font-weight: 600 !important;
        }

        .calculator-wrapper-theme.light-mode .text-slate-500,
        .calculator-wrapper-theme.light-mode .text-gray-500,
        .calculator-wrapper-theme.light-mode .text-slate-600,
        .calculator-wrapper-theme.light-mode .text-gray-600 {
          color: #64748b !important;
        }

        .calculator-wrapper-theme.light-mode .bg-slate-50,
        .calculator-wrapper-theme.light-mode .bg-gray-50,
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