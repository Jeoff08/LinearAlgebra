// components/DeterminantCalculator.tsx
import React, { useState } from 'react';
import PDFExport from './PDFExport';

const DeterminantCalculator: React.FC = () => {
  const [size, setSize] = useState<2 | 3 | 4>(2);
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 2],
    [3, 4]
  ]);
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<{ step: string; explanation: string }[]>([]);
  const [error, setError] = useState<string>('');
  const [showSteps, setShowSteps] = useState(false);

  // Get minor matrix
  const getMinor = (matrix: number[][], row: number, col: number): number[][] => {
    return matrix
      .filter((_, i) => i !== row)
      .map(row => row.filter((_, j) => j !== col));
  };

  // Helper function to get display value
  const getDisplayValue = (value: number): string => {
    return value === 0 ? '' : String(value);
  };

  // Handle input blur to ensure empty fields become 0
  const handleInputBlur = (row: number, col: number) => {
    const newMatrix = [...matrix];
    if (isNaN(newMatrix[row][col]) || newMatrix[row][col] === undefined) {
      newMatrix[row][col] = 0;
      setMatrix(newMatrix);
    }
  };

  // Calculate determinant for any size matrix
  const calculateDeterminant = (matrix: number[][]): { det: number; steps: { step: string; explanation: string }[] } => {
    const n = matrix.length;
    const steps: { step: string; explanation: string }[] = [];

    if (n === 1) {
      steps.push({
        step: `det([${matrix[0][0]}]) = ${matrix[0][0]}`,
        explanation: 'For a 1×1 matrix, the determinant is the single element.'
      });
      return { det: matrix[0][0], steps };
    }

    if (n === 2) {
      const [[a, b], [c, d]] = matrix;
      const det = a * d - b * c;
      steps.push({
        step: `det = (${a} × ${d}) - (${b} × ${c})`,
        explanation: 'For a 2×2 matrix, determinant = ad - bc.'
      });
      steps.push({
        step: `det = ${a*d} - ${b*c}`,
        explanation: 'Calculate the products and subtract them.'
      });
      steps.push({
        step: `det = ${det}`,
        explanation: 'The final determinant value.'
      });
      return { det, steps };
    }

    if (n === 3) {
      const [[a, b, c], [d, e, f], [g, h, i]] = matrix;
      steps.push({
        step: 'Using the 3×3 determinant formula:',
        explanation: 'The determinant of a 3×3 matrix uses the rule of Sarrus or cofactor expansion.'
      });
      steps.push({
        step: `det = a(ei - fh) - b(di - fg) + c(dh - eg)`,
        explanation: 'The formula for the determinant of a 3×3 matrix.'
      });
      steps.push({
        step: `det = ${a}(${e}×${i} - ${f}×${h}) - ${b}(${d}×${i} - ${f}×${g}) + ${c}(${d}×${h} - ${e}×${g})`,
        explanation: 'Substitute the values into the formula.'
      });
      
      const term1 = e * i - f * h;
      const term2 = d * i - f * g;
      const term3 = d * h - e * g;
      
      steps.push({
        step: `det = ${a}(${term1}) - ${b}(${term2}) + ${c}(${term3})`,
        explanation: 'Calculate the three terms inside the parentheses.'
      });
      const det = a * term1 - b * term2 + c * term3;
      steps.push({
        step: `det = ${a*term1} - ${b*term2} + ${c*term3}`,
        explanation: 'Multiply and combine the terms.'
      });
      steps.push({
        step: `det = ${det}`,
        explanation: 'The final determinant value.'
      });
      return { det, steps };
    }

    // For 4x4 and above, use Laplace expansion
    steps.push({
      step: `Using Laplace expansion along first row (size ${n}×${n}):`,
      explanation: 'Laplace expansion calculates the determinant by expanding along a row or column using cofactors.'
    });
    steps.push({
      step: `det = Σ(j=1 to ${n}) (-1)^(1+j) × a₁ⱼ × det(M₁ⱼ)`,
      explanation: 'Each term is the product of the element, its sign, and the determinant of its minor.'
    });
    steps.push({
      step: '',
      explanation: ''
    });

    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = getMinor(matrix, 0, j);
      const minorDet = calculateDeterminant(minor);
      const sign = j % 2 === 0 ? 1 : -1;
      const term = sign * matrix[0][j] * minorDet.det;
      
      steps.push({
        step: `Term ${j+1}: (-1)^(1+${j+1}) × ${matrix[0][j]} × det(M₁${j+1})`,
        explanation: `Cofactor term ${j+1} with sign ${sign > 0 ? '+' : '-'}.`
      });
      steps.push({
        step: `  = ${sign > 0 ? '+' : '-'} × ${matrix[0][j]} × ${minorDet.det.toFixed(4)}`,
        explanation: 'Multiply the sign, element, and minor determinant.'
      });
      steps.push({
        step: `  = ${term.toFixed(4)}`,
        explanation: 'The contribution of this term to the determinant.'
      });
      steps.push({
        step: '',
        explanation: ''
      });
      
      det += term;
    }
    
    steps.push({
      step: `Total determinant = ${det.toFixed(4)}`,
      explanation: 'Sum all the cofactor terms to get the final determinant.'
    });
    return { det, steps };
  };

  const calculateDet = () => {
    setError('');
    setResult('');
    setSteps([]);

    // Check if matrix is square
    if (matrix.length !== matrix[0]?.length) {
      setError('Matrix must be square');
      return;
    }

    const result = calculateDeterminant(matrix);
    
    // Check for singular matrix
    if (Math.abs(result.det) < 1e-10) {
      setResult(`det = ${result.det.toFixed(4)}`);
      setSteps([
        ...result.steps,
        {
          step: '',
          explanation: ''
        },
        {
          step: '⚠️ The determinant is 0 (or very close to 0).',
          explanation: 'A zero determinant means the matrix is singular.'
        },
        {
          step: 'This means the matrix is singular and does not have an inverse.',
          explanation: 'Singular matrices are not invertible.'
        }
      ]);
    } else {
      setResult(`det = ${result.det.toFixed(4)}`);
      setSteps([
        ...result.steps,
        {
          step: '',
          explanation: ''
        },
        {
          step: '✅ The determinant is non-zero.',
          explanation: 'A non-zero determinant means the matrix is invertible.'
        },
        {
          step: 'This means the matrix is invertible and has an inverse.',
          explanation: 'Non-singular matrices have unique inverses.'
        }
      ]);
    }
  };

  const handleResize = (newSize: 2 | 3 | 4) => {
    setSize(newSize);
    const newMatrix: number[][] = [];
    for (let i = 0; i < newSize; i++) {
      newMatrix[i] = [];
      for (let j = 0; j < newSize; j++) {
        newMatrix[i][j] = matrix[i]?.[j] || 0;
      }
    }
    setMatrix(newMatrix);
    setResult('');
    setSteps([]);
    setError('');
  };

  const updateMatrix = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix];
    const numValue = value === '' ? 0 : parseFloat(value);
    newMatrix[row][col] = isNaN(numValue) ? 0 : numValue;
    setMatrix(newMatrix);
    setResult('');
    setSteps([]);
    setError('');
  };

  const resetMatrix = () => {
    let newMatrix: number[][];
    switch (size) {
      case 2:
        newMatrix = [
          [1, 2],
          [3, 4]
        ];
        break;
      case 3:
        newMatrix = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ];
        break;
      case 4:
        newMatrix = [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 16]
        ];
        break;
      default:
        newMatrix = [
          [1, 2],
          [3, 4]
        ];
    }
    setMatrix(newMatrix);
    setResult('');
    setSteps([]);
    setError('');
  };

  const loadExample = (example: string) => {
    let newMatrix: number[][];
    let newSize: 2 | 3 | 4 = 2;
    
    switch (example) {
      case '2x2':
        newMatrix = [
          [4, 7],
          [2, 6]
        ];
        newSize = 2;
        break;
      case '2x2 singular':
        newMatrix = [
          [1, 2],
          [2, 4]
        ];
        newSize = 2;
        break;
      case '3x3':
        newMatrix = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 10]
        ];
        newSize = 3;
        break;
      case '3x3 singular':
        newMatrix = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ];
        newSize = 3;
        break;
      case '4x4':
        newMatrix = [
          [1, 0, 2, -1],
          [3, 1, 0, 2],
          [1, -1, 1, 0],
          [2, 1, -1, 1]
        ];
        newSize = 4;
        break;
      default:
        newMatrix = [
          [4, 7],
          [2, 6]
        ];
        newSize = 2;
    }
    
    setSize(newSize);
    setMatrix(newMatrix);
    setResult('');
    setSteps([]);
    setError('');
  };

  // Format matrix for display
  const formatMatrix = (matrix: number[][]): string => {
    return matrix.map(row => `[${row.join(', ')}]`).join('\n');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Determinant Calculator
        </h3>
        <p className="text-sm text-indigo-600 mt-1">
          Calculate the determinant of any square matrix (2×2, 3×3, or 4×4) with step-by-step explanations
        </p>
      </div>

      {/* Quick Examples */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Load example:</span>
        <button
          onClick={() => loadExample('2x2')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          2×2
        </button>
        <button
          onClick={() => loadExample('2x2 singular')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          2×2 (Singular)
        </button>
        <button
          onClick={() => loadExample('3x3')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          3×3
        </button>
        <button
          onClick={() => loadExample('3x3 singular')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          3×3 (Singular)
        </button>
        <button
          onClick={() => loadExample('4x4')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          4×4
        </button>
        <button
          onClick={resetMatrix}
          className="px-3 py-1 text-xs border border-slate-300 hover:bg-slate-50 rounded transition"
        >
          Reset
        </button>
      </div>

      {/* Size Selection */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-700">Matrix Size:</span>
        <div className="flex gap-2">
          {[2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => handleResize(n as 2 | 3 | 4)}
              className={`px-4 py-1.5 rounded-lg transition ${
                size === n 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {n}×{n}
            </button>
          ))}
        </div>
      </div>

      {/* Matrix Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-700">
            Matrix A ({size}×{size})
          </h4>
          <span className="text-xs text-slate-400">
            {matrix.length}×{matrix[0]?.length || 0} matrix
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="border-collapse border border-slate-300">
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} className="border border-slate-300 p-0.5">
                      <input
                        type="text"
                        value={getDisplayValue(val)}
                        onChange={(e) => updateMatrix(i, j, e.target.value)}
                        onBlur={() => handleInputBlur(i, j)}
                        className="w-14 h-10 px-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none rounded text-sm border border-transparent hover:border-slate-300 focus:border-indigo-500 transition"
                        placeholder="0"
                        step="any"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex gap-3">
        <button
          onClick={calculateDet}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Calculate Determinant
        </button>
        {steps.length > 0 && (
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showSteps ? 'Hide' : 'Show'} Steps
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-lg border ${
          Math.abs(parseFloat(result.split('=')[1]?.trim() || '0')) < 1e-10
            ? 'bg-yellow-50 border-yellow-100'
            : 'bg-green-50 border-green-100'
        }`}>
          <div className="flex items-start gap-3">
            {Math.abs(parseFloat(result.split('=')[1]?.trim() || '0')) < 1e-10 ? (
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                Math.abs(parseFloat(result.split('=')[1]?.trim() || '0')) < 1e-10
                  ? 'text-yellow-800'
                  : 'text-green-800'
              }`}>
                {result}
              </p>
            </div>
            <div className="flex-shrink-0">
              <PDFExport
                title={`Determinant of Matrix (${size}×${size})`}
                data={result}
                steps={steps}
                inputs={`Matrix A (${size}×${size}):\n${matrix.map(row => `[${row.join(', ')}]`).join('\n')}`}
                fileName={`determinant_${size}x${size}`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Steps with explanation beside */}
      {showSteps && steps.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h4 className="font-medium text-blue-800">Step-by-Step Calculation</h4>
            <span className="text-xs text-blue-600 ml-auto">How we got the answer</span>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {steps.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 border-b border-blue-200 last:border-0 pb-3 last:pb-0">
                <div className="flex-1 font-mono text-sm text-blue-900 whitespace-pre-wrap">
                  {item.step}
                </div>
                {item.explanation && (
                  <div className="flex-shrink-0">
                    <details className="group">
                      <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 font-medium px-3 py-1 rounded border border-blue-200 hover:bg-blue-100 transition">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Explanation
                        </span>
                      </summary>
                      <div className="mt-2 p-3 bg-white rounded border border-blue-200 text-sm text-blue-800 max-w-xs">
                        {item.explanation}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help */}
      <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <p className="flex items-center gap-1 font-medium text-slate-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How it works:
        </p>
        <ul className="mt-1 text-xs list-disc list-inside space-y-0.5 text-slate-600">
          <li>Matrix must be square (same number of rows and columns)</li>
          <li>For 2×2: det = ad - bc</li>
          <li>For 3×3: det = a(ei - fh) - b(di - fg) + c(dh - eg)</li>
          <li>For 4×4+: Uses Laplace expansion (cofactor method)</li>
          <li>If determinant = 0, the matrix is singular (no inverse)</li>
          <li>If determinant ≠ 0, the matrix is invertible</li>
          <li>Click on any cell to edit values, press backspace to clear</li>
        </ul>
      </div>
    </div>
  );
};

export default DeterminantCalculator;