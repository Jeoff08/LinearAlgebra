// components/MatrixInverse.tsx
import React, { useState, useEffect, useRef } from 'react';
import PDFExport from './PDFExport';

const MatrixInverse: React.FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([
    [4, 7],
    [2, 6]
  ]);
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<{ step: string; explanation: string }[]>([]);
  const [error, setError] = useState<string>('');
  const [showSteps, setShowSteps] = useState(false);
  const [tryFlash, setTryFlash] = useState(false);
  const solveRef = useRef<(() => void) | null>(null);

  // Listen for "Try in Calculator" events dispatched from topic sections
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.matrix && Array.isArray(detail.matrix) && detail.matrix.length >= 2) {
        const mat: number[][] = detail.matrix;
        setMatrix(mat);
        setResult('');
        setSteps([]);
        setError('');
        setTryFlash(true);
        setTimeout(() => setTryFlash(false), 1500);
        // Auto-solve after state update
        setTimeout(() => solveRef.current?.(), 100);
      }
    };
    document.addEventListener('try-in-calculator', handler);
    return () => document.removeEventListener('try-in-calculator', handler);
  }, []);

  // Keep solve function in ref so the event handler always calls the latest version
  useEffect(() => {
    solveRef.current = calculateInverse;
  });

  // Get the determinant of a matrix
  const getDeterminant = (matrix: number[][]): number => {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = matrix
        .filter((_, i) => i !== 0)
        .map(row => row.filter((_, k) => k !== j));
      det += matrix[0][j] * (j % 2 === 0 ? 1 : -1) * getDeterminant(minor);
    }
    return det;
  };

  // Get minor matrix
  const getMinor = (matrix: number[][], row: number, col: number): number[][] => {
    return matrix
      .filter((_, i) => i !== row)
      .map(row => row.filter((_, j) => j !== col));
  };

  // Transpose matrix
  const transpose = (matrix: number[][]): number[][] => {
    const result: number[][] = [];
    for (let j = 0; j < matrix[0].length; j++) {
      result[j] = [];
      for (let i = 0; i < matrix.length; i++) {
        result[j][i] = matrix[i][j];
      }
    }
    return result;
  };

  // Multiply matrices
  const multiply = (A: number[][], B: number[][]): number[][] => {
    const result: number[][] = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < B[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < A[0].length; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  };

  // Format matrix for display
  const formatMatrix = (matrix: number[][]): string => {
    if (!matrix || matrix.length === 0) return '[]';
    return matrix.map(row => `[${row.map(v => v.toFixed(4)).join(', ')}]`).join('\n');
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

  const calculateInverse = () => {
    setError('');
    setResult('');
    setSteps([]);

    const n = matrix.length;
    
    // Check if square
    if (n !== matrix[0]?.length) {
      setError('Matrix must be square (same number of rows and columns)');
      return;
    }

    const stepList: { step: string; explanation: string }[] = [];
    
    // Step 1: Show original matrix
    stepList.push({
      step: 'Step 1: Original Matrix',
      explanation: 'The matrix we want to find the inverse of. It must be square.'
    });
    stepList.push({
      step: formatMatrix(matrix),
      explanation: 'The input matrix A displayed in matrix form.'
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    // Step 2: Calculate determinant
    stepList.push({
      step: 'Step 2: Calculate Determinant',
      explanation: 'The determinant tells us if the matrix is invertible (non-zero determinant).'
    });
    const det = getDeterminant(matrix);
    stepList.push({
      step: `det(A) = ${det.toFixed(4)}`,
      explanation: `The determinant value is ${det.toFixed(4)}.`
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    // Check if determinant is zero
    if (Math.abs(det) < 1e-10) {
      setError(`Matrix is singular (determinant = ${det.toFixed(4)}). No inverse exists.`);
      setSteps(stepList);
      return;
    }

    // For 2x2 matrix
    if (n === 2) {
      const [[a, b], [c, d]] = matrix;
      
      stepList.push({
        step: 'Step 3: Apply 2×2 Inverse Formula',
        explanation: 'For a 2×2 matrix, the inverse formula is A⁻¹ = (1/det) × [d, -b; -c, a].'
      });
      stepList.push({
        step: `A⁻¹ = (1/${det.toFixed(4)}) × [${d}, ${-b}; ${-c}, ${a}]`,
        explanation: 'Substitute the values into the formula.'
      });
      stepList.push({
        step: '',
        explanation: ''
      });

      const inv = [
        [d / det, -b / det],
        [-c / det, a / det]
      ];

      stepList.push({
        step: 'Step 4: Inverse Matrix',
        explanation: 'The calculated inverse matrix.'
      });
      stepList.push({
        step: formatMatrix(inv),
        explanation: 'The inverse matrix A⁻¹.'
      });
      stepList.push({
        step: '',
        explanation: ''
      });

      // Verification
      stepList.push({
        step: 'Step 5: Verification (A × A⁻¹ = I)',
        explanation: 'Verify the result by multiplying the original matrix by its inverse.'
      });
      const identity = multiply(matrix, inv);
      stepList.push({
        step: formatMatrix(identity.map(row => row.map(v => Math.abs(v) < 1e-10 ? 0 : v))),
        explanation: 'The product should be the identity matrix.'
      });
      
      // Check if identity
      let isIdentity = true;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const expected = i === j ? 1 : 0;
          if (Math.abs(identity[i][j] - expected) > 1e-6) {
            isIdentity = false;
            break;
          }
        }
      }
      stepList.push({
        step: isIdentity ? '✅ Verification successful!' : '⚠️ Minor rounding discrepancies',
        explanation: isIdentity ? 'The inverse is correct.' : 'Small rounding errors from floating point calculations.'
      });
      
      setResult(formatMatrix(inv));
      setSteps(stepList);
      return;
    }

    // For 3x3 and above - Cofactor method
    stepList.push({
      step: 'Step 3: Calculate Cofactor Matrix',
      explanation: 'The cofactor matrix consists of signed minors for each element.'
    });
    
    const cofactorMatrix: number[][] = [];
    for (let i = 0; i < n; i++) {
      cofactorMatrix[i] = [];
      for (let j = 0; j < n; j++) {
        const minor = getMinor(matrix, i, j);
        const minorDet = getDeterminant(minor);
        const sign = (i + j) % 2 === 0 ? 1 : -1;
        cofactorMatrix[i][j] = minorDet * sign;
      }
    }
    
    stepList.push({
      step: 'Cofactor Matrix:',
      explanation: 'Each element is the minor determinant multiplied by the sign (-1)^(i+j).'
    });
    stepList.push({
      step: formatMatrix(cofactorMatrix),
      explanation: 'The cofactor matrix C.'
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    stepList.push({
      step: 'Step 4: Calculate Adjugate Matrix (Transpose of Cofactor)',
      explanation: 'The adjugate matrix is the transpose of the cofactor matrix.'
    });
    const adjugate = transpose(cofactorMatrix);
    stepList.push({
      step: formatMatrix(adjugate),
      explanation: 'The adjugate matrix adj(A).'
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    stepList.push({
      step: `Step 5: Calculate Inverse (Multiply by 1/${det.toFixed(4)})`,
      explanation: `The inverse is A⁻¹ = (1/det(A)) × adj(A).`
    });
    const inverse = adjugate.map(row => row.map(val => val / det));
    stepList.push({
      step: formatMatrix(inverse),
      explanation: 'The final inverse matrix.'
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    // Verification
    stepList.push({
      step: 'Step 6: Verification (A × A⁻¹ = I)',
      explanation: 'Verify the result by multiplying the original matrix by its inverse.'
    });
    const identity = multiply(matrix, inverse);
    stepList.push({
      step: formatMatrix(identity.map(row => row.map(v => Math.abs(v) < 1e-10 ? 0 : v))),
      explanation: 'The product should be the identity matrix.'
    });
    
    let isIdentity = true;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const expected = i === j ? 1 : 0;
        if (Math.abs(identity[i][j] - expected) > 1e-6) {
          isIdentity = false;
          break;
        }
      }
    }
    stepList.push({
      step: isIdentity ? '✅ Verification successful!' : '⚠️ Minor rounding discrepancies',
      explanation: isIdentity ? 'The inverse is correct.' : 'Small rounding errors from floating point calculations.'
    });

    setResult(formatMatrix(inverse));
    setSteps(stepList);
  };

  const addRow = () => {
    const newMatrix = [...matrix];
    const cols = newMatrix[0]?.length || 2;
    newMatrix.push(Array(cols).fill(0));
    setMatrix(newMatrix);
    setResult('');
    setSteps([]);
    setError('');
  };

  const removeRow = () => {
    if (matrix.length > 1) {
      const newMatrix = [...matrix];
      newMatrix.pop();
      setMatrix(newMatrix);
      setResult('');
      setSteps([]);
      setError('');
    }
  };

  const addCol = () => {
    const newMatrix = [...matrix];
    newMatrix.forEach(row => row.push(0));
    setMatrix(newMatrix);
    setResult('');
    setSteps([]);
    setError('');
  };

  const removeCol = () => {
    if (matrix[0]?.length > 1) {
      const newMatrix = [...matrix];
      newMatrix.forEach(row => row.pop());
      setMatrix(newMatrix);
      setResult('');
      setSteps([]);
      setError('');
    }
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
    setMatrix([
      [4, 7],
      [2, 6]
    ]);
    setResult('');
    setSteps([]);
    setError('');
  };

  const loadExample = (example: string) => {
    let newMatrix: number[][];
    switch (example) {
      case '2x2':
        newMatrix = [
          [4, 7],
          [2, 6]
        ];
        break;
      case '2x2 singular':
        newMatrix = [
          [1, 2],
          [2, 4]
        ];
        break;
      case '3x3':
        newMatrix = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 10]
        ];
        break;
      case '3x3 singular':
        newMatrix = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ];
        break;
      case '4x4':
        newMatrix = [
          [1, 2, 3, 4],
          [2, 3, 4, 5],
          [3, 4, 5, 6],
          [4, 5, 6, 7]
        ];
        break;
      default:
        newMatrix = [
          [4, 7],
          [2, 6]
        ];
    }
    setMatrix(newMatrix);
    setResult('');
    setSteps([]);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Matrix Inverse Calculator
        </h3>
        <p className="text-sm text-indigo-600 mt-1">
          Calculate the inverse of any square matrix with step-by-step explanations
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

      {/* Matrix Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-700">
            Matrix A ({matrix.length}×{matrix[0]?.length || 0})
          </h4>
          <div className="flex gap-2">
            <button
              onClick={addRow}
              className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              +Row
            </button>
            <button
              onClick={removeRow}
              className={`px-3 py-1.5 text-sm rounded transition flex items-center gap-1 ${
                matrix.length > 1
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={matrix.length <= 1}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              -Row
            </button>
            <button
              onClick={addCol}
              className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              +Col
            </button>
            <button
              onClick={removeCol}
              className={`px-3 py-1.5 text-sm rounded transition flex items-center gap-1 ${
                matrix[0]?.length > 1
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={matrix[0]?.length <= 1}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              -Col
            </button>
          </div>
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

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">{matrix.length}×{matrix[0]?.length || 0} matrix</span>
          {matrix.length !== matrix[0]?.length && (
            <span className="text-red-500">⚠️ Must be square</span>
          )}
          <span className="text-slate-300">Use the buttons above to add or remove rows/columns</span>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex gap-3">
        <button
          onClick={calculateInverse}
          disabled={matrix.length !== matrix[0]?.length}
          className={`px-6 py-2 rounded-lg shadow-sm flex items-center gap-2 transition ${
            matrix.length === matrix[0]?.length
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Calculate Inverse
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
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-green-800">✅ Inverse Matrix A⁻¹:</p>
              <pre className="mt-2 font-mono text-sm text-green-700 whitespace-pre-wrap">
                {result}
              </pre>
            </div>
            <div className="flex-shrink-0">
              <PDFExport
                title={`Matrix Inverse (A⁻¹) - ${matrix.length}×${matrix[0]?.length || matrix.length}`}
                data={result}
                steps={steps}
                inputs={`Matrix A (${matrix.length}×${matrix[0]?.length || matrix.length}):\n${formatMatrix(matrix)}`}
                fileName={`matrix_inverse_${matrix.length}x${matrix[0]?.length || matrix.length}`}
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
            <h4 className="font-medium text-blue-800">Step-by-Step Explanation</h4>
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
          <li>Inverse exists only if determinant ≠ 0 (non-singular matrix)</li>
          <li>For 2×2: A⁻¹ = (1/det) × [d, -b; -c, a]</li>
          <li>For 3×3+: Uses cofactor method: A⁻¹ = (1/det) × adj(A)</li>
          <li>Verification: A × A⁻¹ should equal the identity matrix</li>
          <li>Use +Row/-Row and +Col/-Col buttons to adjust matrix size</li>
          <li>Click on any cell to edit values, press backspace to clear</li>
        </ul>
      </div>
    </div>
  );
};

export default MatrixInverse;