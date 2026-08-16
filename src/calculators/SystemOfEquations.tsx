// components/SystemOfEquations.tsx
import React, { useState } from 'react';
import PDFExport from './PDFExport';

interface EquationResult {
  variables: Record<string, number>;
  steps: string[];
  error?: string;
  uniqueSolution: boolean;
}

const SystemOfEquations: React.FC = () => {
  const [equations, setEquations] = useState<string[]>(['2x + y - z = 8', '-3x - y + 2z = -11', '-2x + y + 2z = -3']);
  const [result, setResult] = useState<EquationResult | null>(null);
  const [showExplanation, setShowExplanation] = useState(true);
  const [showSteps, setShowSteps] = useState(true);

  // Parse equation string to coefficients
  const parseEquation = (equation: string): { coefficients: Record<string, number>; constant: number; variables: string[] } | null => {
    const parts = equation.replace(/\s/g, '').split('=');
    if (parts.length !== 2) return null;
    
    const leftSide = parts[0];
    const constant = parseFloat(parts[1]);
    if (isNaN(constant)) return null;

    const coefficients: Record<string, number> = {};
    const variables: string[] = [];
    let currentTerm = '';
    let sign = 1;

    for (let i = 0; i < leftSide.length; i++) {
      const char = leftSide[i];
      
      if (char === '+' || char === '-') {
        if (currentTerm) {
          const { coeff, varName } = parseTerm(currentTerm);
          if (varName) {
            coefficients[varName] = (coefficients[varName] || 0) + sign * coeff;
            if (!variables.includes(varName)) variables.push(varName);
          } else {
            const existingConst = coefficients['constant'] || 0;
            coefficients['constant'] = existingConst + sign * coeff;
          }
          currentTerm = '';
        }
        sign = char === '+' ? 1 : -1;
      } else {
        currentTerm += char;
      }
    }

    if (currentTerm) {
      const { coeff, varName } = parseTerm(currentTerm);
      if (varName) {
        coefficients[varName] = (coefficients[varName] || 0) + sign * coeff;
        if (!variables.includes(varName)) variables.push(varName);
      } else {
        const existingConst = coefficients['constant'] || 0;
        coefficients['constant'] = existingConst + sign * coeff;
      }
    }

    const constValue = coefficients['constant'] || 0;
    delete coefficients['constant'];
    
    return { coefficients, constant: constant - constValue, variables };
  };

  const parseTerm = (term: string): { coeff: number; varName: string | null } => {
    const varMatch = term.match(/[a-zA-Z]/);
    if (!varMatch) {
      const coeff = parseFloat(term);
      return { coeff: isNaN(coeff) ? 0 : coeff, varName: null };
    }

    const varName = varMatch[0];
    const coeffStr = term.replace(varName, '');
    if (coeffStr === '' || coeffStr === '+') return { coeff: 1, varName };
    if (coeffStr === '-') return { coeff: -1, varName };
    const coeff = parseFloat(coeffStr);
    return { coeff: isNaN(coeff) ? 1 : coeff, varName };
  };

  // Solve system using Gaussian elimination with explanation
  const solveSystem = () => {
    const parsed = equations.map(eq => parseEquation(eq));
    
    if (parsed.some(p => p === null)) {
      setResult({
        variables: {},
        steps: ['❌ Please enter valid equations in the format: ax + by + cz = d'],
        uniqueSolution: false
      });
      return;
    }

    const allVariables = new Set<string>();
    parsed.forEach(p => {
      if (p) {
        Object.keys(p.coefficients).forEach(v => allVariables.add(v));
      }
    });
    const variableList = Array.from(allVariables).sort();

    if (parsed.length !== variableList.length) {
      setResult({
        variables: {},
        steps: [`❌ Number of equations (${parsed.length}) must equal number of variables (${variableList.length})`],
        uniqueSolution: false
      });
      return;
    }

    const matrix: number[][] = parsed.map((eq, idx) => {
      const row: number[] = [];
      variableList.forEach(varName => {
        row.push(eq?.coefficients[varName] || 0);
      });
      row.push(eq?.constant || 0);
      return row;
    });

    const steps: string[] = [];
    const n = matrix.length;
    const m = matrix[0].length;

    const augMatrix = matrix.map(row => [...row]);
    
    steps.push(`📝 System of Equations:`);
    equations.forEach((eq, idx) => {
      steps.push(`   ${idx + 1}) ${eq}`);
    });
    steps.push(``);
    steps.push(`📊 Augmented Matrix:`);
    steps.push(formatMatrix(augMatrix, variableList));
    steps.push(``);

    for (let i = 0; i < n; i++) {
      let pivotRow = i;
      let maxVal = Math.abs(augMatrix[i][i]);
      for (let j = i + 1; j < n; j++) {
        const val = Math.abs(augMatrix[j][i]);
        if (val > maxVal) {
          maxVal = val;
          pivotRow = j;
        }
      }

      if (Math.abs(augMatrix[pivotRow][i]) < 1e-10) {
        steps.push(`⚠️ No unique solution: The system has either no solution or infinitely many solutions.`);
        setResult({
          variables: {},
          steps,
          uniqueSolution: false
        });
        return;
      }

      if (pivotRow !== i) {
        [augMatrix[i], augMatrix[pivotRow]] = [augMatrix[pivotRow], augMatrix[i]];
        steps.push(`🔄 Swap Row ${i + 1} with Row ${pivotRow + 1}:`);
        steps.push(formatMatrix(augMatrix, variableList));
        steps.push(``);
      }

      const pivot = augMatrix[i][i];
      for (let j = i + 1; j < n; j++) {
        const factor = augMatrix[j][i] / pivot;
        if (Math.abs(factor) < 1e-10) continue;
        
        for (let k = i; k < m; k++) {
          augMatrix[j][k] -= factor * augMatrix[i][k];
        }
        steps.push(`➖ Row ${j + 1} = Row ${j + 1} - ${factor.toFixed(4)} × Row ${i + 1}:`);
        steps.push(formatMatrix(augMatrix, variableList));
        steps.push(``);
      }
    }

    const solution: Record<string, number> = {};
    const varNames = variableList;
    
    steps.push(`🔄 Back Substitution:`);
    
    for (let i = n - 1; i >= 0; i--) {
      let sum = augMatrix[i][n];
      for (let j = i + 1; j < n; j++) {
        sum -= augMatrix[i][j] * solution[varNames[j]];
      }
      const value = sum / augMatrix[i][i];
      solution[varNames[i]] = value;
      
      const varName = varNames[i];
      steps.push(`   ${varName} = (${augMatrix[i][n].toFixed(4)} - ${augMatrix[i].slice(i+1, n).map((coeff, idx) => 
        `${coeff.toFixed(4)}×${varNames[i+1+idx]}`).join(' - ') || '0'}) / ${augMatrix[i][i].toFixed(4)}`);
      steps.push(`   ${varName} = ${value.toFixed(4)}`);
      steps.push(``);
    }

    steps.push(`✅ Verification:`);
    equations.forEach((eq, idx) => {
      const parsedEq = parseEquation(eq);
      if (!parsedEq) return;
      
      let leftSide = 0;
      Object.entries(parsedEq.coefficients).forEach(([varName, coeff]) => {
        leftSide += coeff * (solution[varName] || 0);
      });
      
      const rightSide = parsedEq.constant;
      const diff = Math.abs(leftSide - rightSide);
      const valid = diff < 1e-6;
      
      steps.push(`   ${eq} → ${leftSide.toFixed(4)} = ${rightSide.toFixed(4)} ${valid ? '✅ Correct' : '❌ Incorrect'}`);
    });

    const formattedSolution: Record<string, number> = {};
    Object.entries(solution).forEach(([varName, value]) => {
      formattedSolution[varName] = Number.isInteger(value) ? value : parseFloat(value.toFixed(4));
    });

    setResult({
      variables: formattedSolution,
      steps,
      uniqueSolution: true
    });
  };

  const formatMatrix = (matrix: number[][], variables: string[]): string => {
    return matrix.map((row, idx) => {
      const coeffs = row.slice(0, -1).map((val, i) => 
        `${val >= 0 ? ' ' : ''}${val.toFixed(2)}${variables[i] || ''}`
      );
      const constVal = row[row.length - 1];
      return `   Row ${idx + 1}: [${coeffs.join(', ')} | ${constVal.toFixed(2)}]`;
    }).join('\n');
  };

  const addEquation = () => {
    setEquations([...equations, '']);
    setResult(null);
  };

  const removeEquation = (index: number) => {
    if (equations.length > 1) {
      const newEqs = equations.filter((_, i) => i !== index);
      setEquations(newEqs);
      setResult(null);
    }
  };

  const clearAll = () => {
    setEquations(equations.map(() => ''));
    setResult(null);
  };

  // Explanation content
  const explanationContent = (
    <div className="space-y-2 text-sm text-blue-900">
      <p><span className="font-semibold">How Gaussian Elimination Works:</span> This method solves systems of linear equations by transforming the augmented matrix into row echelon form through row operations, then solving for variables using back substitution.</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><span className="font-medium">Forward Elimination:</span> Transform the matrix into row echelon form using row operations (swapping rows, multiplying rows, adding multiples of rows).</li>
        <li><span className="font-medium">Back Substitution:</span> Solve for variables starting from the last row and working backwards, substituting known values into previous equations.</li>
        <li><span className="font-medium">Verification:</span> Check the solution by plugging the values back into the original equations.</li>
      </ul>
    </div>
  );

  // Plain text explanation for PDF
  const explanationText = `How Gaussian Elimination Works: This method solves systems of linear equations by transforming the augmented matrix into row echelon form through row operations, then solving for variables using back substitution.

Forward Elimination: Transform the matrix into row echelon form using row operations (swapping rows, multiplying rows, adding multiples of rows).
Back Substitution: Solve for variables starting from the last row and working backwards, substituting known values into previous equations.
Verification: Check the solution by plugging the values back into the original equations.`;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">Enter your equations:</h3>
          <span className="text-xs text-slate-500">{equations.length} equation{equations.length > 1 ? 's' : ''}</span>
        </div>
        {equations.map((eq, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={eq}
                onChange={(e) => {
                  const newEqs = [...equations];
                  newEqs[idx] = e.target.value;
                  setEquations(newEqs);
                  setResult(null);
                }}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-mono text-sm"
                placeholder={`Equation ${idx + 1}: e.g., 2x + y - z = 8`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                {idx + 1}
              </span>
            </div>
            {equations.length > 1 && (
              <button
                onClick={() => removeEquation(idx)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                aria-label="Remove equation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={solveSystem}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Solve
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All
        </button>
        <button
          onClick={addEquation}
          className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Equation
        </button>
        {result && result.uniqueSolution && (
          <>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showExplanation ? 'Hide' : 'Show'} Explanation
            </button>
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {showSteps ? 'Hide' : 'Show'} Steps
            </button>
          </>
        )}
      </div>

      {result && (
        <div className="space-y-4">
          {/* Result */}
          <div className={`p-4 rounded-lg border ${result.uniqueSolution ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} animate-in fade-in duration-300`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {result.uniqueSolution ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                {result.uniqueSolution ? (
                  <>
                    <p className="font-medium text-green-800">Solution Found:</p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {Object.entries(result.variables).map(([varName, value]) => (
                        <span key={varName} className="font-mono text-green-800 bg-green-100 px-3 py-1 rounded-md">
                          {varName} = {value}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-red-800">{result.steps[0]}</p>
                )}
              </div>
              {result.uniqueSolution && (
                <div className="flex-shrink-0">
                  <PDFExport
                    title="System of Linear Equations - Solution"
                    data={Object.entries(result.variables).map(([k, v]) => `${k} = ${v}`).join('\n')}
                    steps={result.steps}
                    explanation={explanationText}
                    fileName="system_of_equations_solution"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Steps with explanation beside */}
          {result.uniqueSolution && showSteps && (
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h4 className="font-medium text-indigo-800">Step-by-Step Solution</h4>
                <span className="text-xs text-indigo-600 ml-auto">Gaussian Elimination</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Steps content - takes 2/3 of the space */}
                <div className="lg:col-span-2 space-y-1 font-mono text-sm text-indigo-900 whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                  {result.steps.map((step, idx) => (
                    <div key={idx} className="py-1">
                      {step}
                    </div>
                  ))}
                </div>
                
                {/* Explanation - takes 1/3 of the space */}
                {showExplanation && (
                  <div className="lg:col-span-1 p-3 bg-blue-50 rounded-lg border border-blue-200 max-h-[400px] overflow-y-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h5 className="font-medium text-blue-800 text-sm">Explanation</h5>
                    </div>
                    {explanationContent}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <p className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Enter equations in the format: <span className="font-mono text-slate-700">ax + by + cz = d</span>
        </p>
        <p className="mt-1 text-xs">The system must have the same number of equations as variables for a unique solution.</p>
      </div>
    </div>
  );
};

export default SystemOfEquations;