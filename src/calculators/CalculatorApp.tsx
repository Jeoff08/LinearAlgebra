// components/CalculatorApp.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Calculator, ChevronDown, ChevronUp, X } from 'lucide-react';

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

interface Tool {
  id: string;
  name: string;
  component: React.ReactNode;
  description: string;
}

const tools: Tool[] = [
  { id: 'equations', name: 'System of Linear Equations', component: <SystemOfEquations />, description: '2x+y−z=8, etc.' },
  { id: 'matrix', name: 'Matrix Calculator', component: <MatrixCalculator />, description: 'Matrices such as A=[1 2; 3 4]' },
  { id: 'matrixops', name: 'Matrix Operations', component: <MatrixOperations />, description: 'A+B, A−B, AB' },
  { id: 'inverse', name: 'Matrix Inverse', component: <MatrixInverse />, description: 'A square matrix' },
  { id: 'determinant', name: 'Determinant Calculator', component: <DeterminantCalculator />, description: '2×2, 3×3, 4×4 matrices' },
  { id: 'rank', name: 'Rank Calculator', component: <RankCalculator />, description: 'A matrix' },
  { id: 'eigen', name: 'Eigenvalue & Eigenvector', component: <EigenCalculator />, description: 'A square matrix' },
  { id: 'vector', name: 'Vector Calculator', component: <VectorCalculator />, description: 'Vectors such as (2,3,4)' },
  { id: 'dot', name: 'Dot Product', component: <DotProduct />, description: 'Two vectors' },
  { id: 'cross', name: 'Cross Product', component: <CrossProduct />, description: 'Two 3D vectors' },
  { id: 'projection', name: 'Vector Projection', component: <VectorProjection />, description: 'Two vectors' },
  { id: 'independence', name: 'Linear Independence', component: <LinearIndependence />, description: 'A set of vectors' },
  { id: 'combination', name: 'Linear Combination', component: <LinearCombination />, description: 'Vectors + scalar coefficients' },
  { id: 'basis', name: 'Basis Calculator', component: <BasisCalculator />, description: 'A set of vectors' },
  { id: 'span', name: 'Span Calculator', component: <SpanCalculator />, description: 'A set of vectors' },
  { id: 'lu', name: 'LU Decomposition', component: <LUDecomposition />, description: 'A square matrix' },
  { id: 'qr', name: 'QR Decomposition', component: <QRDecomposition />, description: 'A matrix' },
  { id: 'svd', name: 'SVD Calculator', component: <SVDCalculator />, description: 'A matrix' },
  { id: 'transpose', name: 'Transpose Calculator', component: <TransposeCalculator />, description: 'A matrix' },
  { id: 'diagonalization', name: 'Diagonalization', component: <Diagonalization />, description: 'A square matrix' },
  { id: 'leastsquares', name: 'Least Squares', component: <LeastSquares />, description: 'Matrix A and vector b' },
  { id: 'transformation', name: 'Linear Transformation', component: <LinearTransformation />, description: 'Transformation matrix + vector' },
  { id: 'quadratic', name: 'Quadratic Form', component: <QuadraticForm />, description: 'Matrix + vector' },
];

export default function CalculatorApp() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [glowColor, setGlowColor] = useState('green');
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentTool = selectedTool ? tools.find(t => t.id === selectedTool) : null;

  // Filter tools based on search
  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle glow color every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowColor(prev => prev === 'green' ? 'blue' : 'green');
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setSearchTerm('');
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

  const handleClose = () => {
    setSelectedTool(null);
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Calculator Selector with Dropdown */}
        <div className="relative max-w-[90rem] mx-auto mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Linear Algebra Calculator</h1>
                <p className="text-sm text-slate-500">Select a tool to get started</p>
              </div>
            </div>
            
            <div className="relative flex-1 w-full sm:min-w-[280px]">
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`
                  w-full flex items-center justify-between gap-3 px-4 py-3 
                  bg-white border-2 rounded-xl 
                  transition-all duration-300 ease-in-out
                  hover:shadow-lg hover:shadow-green-500/10
                  ${isDropdownOpen 
                    ? 'border-green-500 shadow-lg shadow-green-500/20' 
                    : 'border-slate-200 hover:border-green-300'
                  }
                `}
              >
                <div className="flex-1 text-left">
                  <div className="font-medium text-slate-800">
                    {currentTool ? currentTool.name : 'Browse Calculators'}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {currentTool ? currentTool.description : 'Click to explore all calculators'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">
                    {currentTool ? `${tools.findIndex(t => t.id === selectedTool) + 1}/${tools.length}` : '📐'}
                  </span>
                  {isDropdownOpen ? (
                    <ChevronUp className="w-5 h-5 text-green-500 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-green-500 transition-transform duration-300" />
                  )}
                </div>
              </button>

              {/* Dropdown Menu with Smooth Animation */}
              <div
                ref={dropdownRef}
                className={`
                  absolute z-50 w-full mt-2 bg-white rounded-xl border-2 
                  shadow-2xl shadow-green-500/10 overflow-hidden
                  transition-all duration-300 ease-in-out
                  ${isDropdownOpen 
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto border-green-200' 
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none border-transparent'
                  }
                `}
              >
                <div className="p-3 border-b border-slate-100">
                  <input
                    type="text"
                    placeholder="Search calculators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
                    autoFocus={isDropdownOpen}
                  />
                </div>

                <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                  {filteredTools.length > 0 ? (
                    filteredTools.map((tool, index) => (
                      <button
                        key={tool.id}
                        onClick={() => handleSelect(tool.id)}
                        className={`
                          w-full text-left px-3 py-2.5 rounded-lg 
                          transition-all duration-200 ease-in-out
                          hover:bg-green-50 hover:translate-x-1
                          ${selectedTool === tool.id
                            ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                            : 'text-slate-600 hover:text-slate-900'
                          }
                        `}
                        style={{
                          animation: isDropdownOpen ? `fadeInUp ${0.2 + index * 0.03}s ease-out forwards` : 'none',
                          opacity: 0,
                          transform: 'translateY(10px)'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{tool.name}</div>
                            <div className="text-xs text-slate-400 truncate">{tool.description}</div>
                          </div>
                          {selectedTool === tool.id && (
                            <span className="ml-2 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <p className="text-sm">No calculators found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-between text-xs text-slate-400">
                  <span>{filteredTools.length} calculators available</span>
                  <span>Press ESC to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Calculator Display */}
        <div className="max-w-[90rem] mx-auto">
          {currentTool ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/5">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {currentTool.name}
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {currentTool.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full">
                      Ready
                    </span>
                    <button
                      onClick={handleClose}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Close calculator"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 lg:p-8 transition-all duration-300">
                {currentTool.component}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden transition-all duration-300 w-full">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-12 border-b border-slate-200/60 text-center">
                {/* Logo with Glowing Animation and Hover Effect */}
                <div 
                  className="flex justify-center mb-6"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="relative flex items-center gap-4">
                    <div className="relative">
                      <div className={`
                        w-24 h-24 rounded-full flex items-center justify-center overflow-hidden
                        transition-all duration-1000 ease-in-out
                        ${glowColor === 'green' 
                          ? 'shadow-[0_0_40px_rgba(34,197,94,0.6)]' 
                          : 'shadow-[0_0_40px_rgba(59,130,246,0.6)]'
                        }
                      `}>
                        <img 
                          src="src/assets/Linear Algebra.png" 
                          alt="src/assets/Linear Algebra.png" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className={`
                        absolute inset-0 rounded-full
                        transition-all duration-1000 ease-in-out
                        ${glowColor === 'green' 
                          ? 'animate-pulse shadow-[0_0_60px_rgba(34,197,94,0.4)]' 
                          : 'animate-pulse shadow-[0_0_60px_rgba(59,130,246,0.4)]'
                        }
                      `} />
                    </div>
                    
                    {/* Sliding Text */}
                    <div className={`
                      overflow-hidden
                      transition-all duration-500 ease-in-out
                      ${isHovered ? 'max-w-[600px] opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-10'}
                    `}>
                      <h2 className="text-2xl font-bold text-slate-700 whitespace-nowrap">
                        Welcome to Linear Algebra Calculator
                      </h2>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-500 max-w-md mx-auto">
                  Click the dropdown above to browse and select from different calculators
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Matrix Operations</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Vector Math</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Decompositions</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Linear Systems</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}