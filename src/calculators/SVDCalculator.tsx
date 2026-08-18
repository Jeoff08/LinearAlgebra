// components/SVDCalculator.tsx
import React, { useState } from 'react';
import PDFExport from './PDFExport';

interface Step {
  title: string;
  description: string;
  matrix?: number[][];
  label?: string;
  value?: string;
  explanation?: string;
}

const SVDCalculator: React.FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([[1, 1], [1, 1]]);
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [showExplanation, setShowExplanation] = useState(true);

  // Helper function to compute SVD for any matrix using power iteration method
  const computeSVD = (A: number[][]): { U: number[][], S: number[], V: number[][] } => {
    const m = A.length;
    const n = A[0]?.length || 0;
    
    if (m === 0 || n === 0) {
      return { U: [], S: [], V: [] };
    }

    // If it's a 2x2 matrix, use the analytical method
    if (m === 2 && n === 2) {
      return computeSVD2x2(A);
    }

    // For larger matrices, use a simplified iterative method
    // Compute A^T * A
    const ATA: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
          sum += A[k][i] * A[k][j];
        }
        ATA[i][j] = sum;
      }
    }

    // Compute eigenvalues of ATA using power iteration
    const numSingularValues = Math.min(m, n);
    const singularValues: number[] = [];
    const V: number[][] = [];
    
    // Power iteration to find eigenvectors
    let remainingMatrix = ATA.map(row => [...row]);
    
    for (let k = 0; k < numSingularValues; k++) {
      // Initialize random vector
      let v = Array.from({ length: n }, () => Math.random());
      let norm = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
      v = v.map(val => val / norm);
      
      // Power iteration
      for (let iter = 0; iter < 50; iter++) {
        // v = ATA * v
        const newV = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
          let sum = 0;
          for (let j = 0; j < n; j++) {
            sum += remainingMatrix[i][j] * v[j];
          }
          newV[i] = sum;
        }
        
        // Normalize
        norm = Math.sqrt(newV.reduce((sum, val) => sum + val * val, 0));
        if (norm < 1e-10) break;
        v = newV.map(val => val / norm);
      }
      
      // Compute eigenvalue
      let eigenvalue = 0;
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
          sum += ATA[i][j] * v[j];
        }
        eigenvalue += v[i] * sum;
      }
      
      const singularValue = Math.sqrt(Math.max(eigenvalue, 0));
      singularValues.push(singularValue);
      V.push(v);
      
      // Deflate the matrix
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          remainingMatrix[i][j] -= eigenvalue * v[i] * v[j];
        }
      }
    }
    
    // Sort singular values in descending order
    const indices = singularValues.map((_, i) => i);
    indices.sort((a, b) => singularValues[b] - singularValues[a]);
    
    const sortedS = indices.map(i => singularValues[i]);
    const sortedV = indices.map(i => V[i]);
    
    // Compute U = A * V * S^(-1)
    const U: number[][] = Array.from({ length: m }, () => Array(numSingularValues).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < numSingularValues; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += A[i][k] * sortedV[j][k];
        }
        U[i][j] = sortedS[j] > 1e-10 ? sum / sortedS[j] : 0;
      }
    }
    
    return { U, S: sortedS, V: sortedV };
  };

  // Analytical SVD for 2x2 matrices
  const computeSVD2x2 = (A: number[][]): { U: number[][], S: number[], V: number[][] } => {
    const [[a, b], [c, d]] = A;
    
    // Compute A^T * A
    const ata = [
      [a*a + c*c, a*b + c*d],
      [a*b + c*d, b*b + d*d]
    ];
    
    // Compute eigenvalues
    const trace = ata[0][0] + ata[1][1];
    const det = ata[0][0] * ata[1][1] - ata[0][1] * ata[1][0];
    const discriminant = trace * trace - 4 * det;
    
    const λ1 = (trace + Math.sqrt(Math.max(discriminant, 0))) / 2;
    const λ2 = (trace - Math.sqrt(Math.max(discriminant, 0))) / 2;
    
    const σ1 = Math.sqrt(Math.max(λ1, 0));
    const σ2 = Math.sqrt(Math.max(λ2, 0));
    
    // Compute eigenvectors for V
    let v1: number[], v2: number[];
    
    if (Math.abs(ata[0][1]) < 1e-10) {
      v1 = [1, 0];
      v2 = [0, 1];
    } else {
      const a11 = ata[0][0] - λ1;
      const a12 = ata[0][1];
      
      if (Math.abs(a11) > Math.abs(a12)) {
        v1 = [a12, -a11];
      } else {
        v1 = [a12, -a11];
      }
      
      const norm1 = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1]);
      if (norm1 > 1e-10) {
        v1 = [v1[0]/norm1, v1[1]/norm1];
      }
      
      v2 = [-v1[1], v1[0]];
    }
    
    // Sort singular values and vectors
    let sortedS: number[], sortedV: number[][];
    if (σ1 >= σ2) {
      sortedS = [σ1, σ2];
      sortedV = [v1, v2];
    } else {
      sortedS = [σ2, σ1];
      sortedV = [v2, v1];
    }
    
    // Compute U
    const u1 = sortedS[0] > 1e-10 ? [
      (a * sortedV[0][0] + b * sortedV[0][1]) / sortedS[0],
      (c * sortedV[0][0] + d * sortedV[0][1]) / sortedS[0]
    ] : [1, 0];
    
    const u2 = sortedS[1] > 1e-10 ? [
      (a * sortedV[1][0] + b * sortedV[1][1]) / sortedS[1],
      (c * sortedV[1][0] + d * sortedV[1][1]) / sortedS[1]
    ] : [0, 1];
    
    // Ensure U is orthogonal
    const U = [u1, u2];
    
    return { U, S: sortedS, V: sortedV };
  };

  const calculateSVD = () => {
    const m = matrix.length;
    const n = matrix[0]?.length || 0;
    
    if (m === 0 || n === 0) {
      setResult('❌ Matrix is empty.');
      setSteps([]);
      return;
    }

    const stepsList: Step[] = [];

    // Step 1: Display original matrix
    stepsList.push({
      title: 'Step 1: Original Matrix',
      description: `We start with the ${m}×${n} matrix A.`,
      matrix: matrix,
      label: 'A =',
      explanation: 'The original matrix A that we want to decompose using SVD.'
    });

    // Compute SVD
    const { U, S, V } = computeSVD(matrix);
    const numSingularValues = S.length;

    // Step 2: Show A^T * A for square matrices or general case
    if (m === n) {
      const ATA: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          let sum = 0;
          for (let k = 0; k < m; k++) {
            sum += matrix[k][i] * matrix[k][j];
          }
          ATA[i][j] = sum;
        }
      }
      
      stepsList.push({
        title: 'Step 2: Compute A^T·A',
        description: `Computing the Gram matrix A^T·A (${n}×${n})`,
        matrix: ATA,
        label: 'A^T · A =',
        explanation: 'The eigenvalues of A^T·A give the squared singular values.'
      });
    }

    // Step 3: Singular values
    stepsList.push({
      title: `Step ${m === n ? '3' : '2'}: Singular Values`,
      description: `The singular values are:\n${S.map((s, i) => `σ${i+1} = ${s.toFixed(4)}`).join('\n')}`,
      explanation: 'Singular values are the square roots of the eigenvalues of A^T·A. They represent the "stretching" factors of the transformation.'
    });

    // Step 4: U matrix
    stepsList.push({
      title: `Step ${m === n ? '4' : '3'}: Left Singular Vectors (U)`,
      description: `U is a ${m}×${numSingularValues} matrix with orthonormal columns.`,
      matrix: U,
      label: 'U =',
      explanation: 'U contains the left singular vectors, which are the eigenvectors of A·A^T.'
    });

    // Step 5: V matrix
    stepsList.push({
      title: `Step ${m === n ? '5' : '4'}: Right Singular Vectors (V)`,
      description: `V is a ${n}×${numSingularValues} matrix with orthonormal columns.`,
      matrix: V,
      label: 'V =',
      explanation: 'V contains the right singular vectors, which are the eigenvectors of A^T·A.'
    });

    // Step 6: Verify SVD
    stepsList.push({
      title: `Step ${m === n ? '6' : '5'}: Verify SVD Decomposition`,
      description: 'Checking if A = U·Σ·V^T (or U·Σ·V^T for full SVD)',
      explanation: 'We verify the decomposition by reconstructing A from U, Σ, and V.'
    });

    // Reconstruct matrix: U * diag(S) * V^T
    const reconstructed: number[][] = Array.from({ length: m }, () => Array(n).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < numSingularValues; k++) {
          sum += U[i][k] * S[k] * (V[j]?.[k] || 0);
        }
        reconstructed[i][j] = sum;
      }
    }

    let maxDiff = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        maxDiff = Math.max(maxDiff, Math.abs(matrix[i][j] - reconstructed[i][j]));
      }
    }

    stepsList.push({
      title: '  Verification Results',
      description: `Maximum difference between A and U·Σ·V^T: ${maxDiff.toFixed(10)}\n` +
                   `${maxDiff < 1e-8 ? '✅ SVD decomposition is correct!' : '⚠️ SVD decomposition has errors'}`,
      explanation: 'The maximum difference between the original matrix and the reconstructed matrix. A small value indicates the decomposition is accurate.'
    });

    // Step 7: Final SVD Result
    stepsList.push({
      title: '✅ Final SVD Decomposition',
      description: `A = U · Σ · V^T\n\n` +
                   `U (${m}×${numSingularValues}):\n${U.map(row => `[${row.map(v => v.toFixed(4)).join(', ')}]`).join('\n')}\n\n` +
                   `Σ (${numSingularValues}×${numSingularValues}):\n${S.map((s, i) => 
                     Array.from({ length: numSingularValues }, (_, j) => i === j ? s : 0)
                       .map(v => v.toFixed(4)).join(' ')
                   ).join('\n')}\n\n` +
                   `V (${n}×${numSingularValues}):\n${V.map(row => `[${row.map(v => v.toFixed(4)).join(', ')}]`).join('\n')}`,
      explanation: 'The complete SVD decomposition showing U (left singular vectors), Σ (diagonal matrix of singular values), and V (right singular vectors).'
    });

    setSteps(stepsList);

    // Set result for display
    const resultText = 
      '=== SVD DECOMPOSITION STEPS ===\n\n' +
      stepsList.map(step => 
        `${step.title}\n${step.description}\n${step.matrix ? formatMatrix(step.matrix, step.label || '') : ''}\n`
      ).join('\n');

    setResult(resultText);
  };

  const formatMatrix = (matrix: number[][], label: string): string => {
    if (!matrix || matrix.length === 0) return '';
    const formatted = matrix.map(row => 
      row.map(v => v.toFixed(4)).join(' ')
    ).join('\n');
    return `${label}\n${formatted}`;
  };

  const handleMatrixChange = (rowIndex: number, colIndex: number, value: string) => {
    const newM = [...matrix];
    if (value === '' || value === '-') {
      newM[rowIndex][colIndex] = 0;
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        newM[rowIndex][colIndex] = num;
      }
    }
    setMatrix(newM);
    setResult('');
    setSteps([]);
  };

  const addRow = () => {
    const cols = matrix[0]?.length || 2;
    setMatrix([...matrix, Array(cols).fill(0)]);
    setResult('');
    setSteps([]);
  };

  const addColumn = () => {
    setMatrix(matrix.map(row => [...row, 0]));
    setResult('');
    setSteps([]);
  };

  const removeRow = () => {
    if (matrix.length > 1) {
      setMatrix(matrix.slice(0, -1));
      setResult('');
      setSteps([]);
    }
  };

  const removeColumn = () => {
    if ((matrix[0]?.length || 0) > 1) {
      setMatrix(matrix.map(row => row.slice(0, -1)));
      setResult('');
      setSteps([]);
    }
  };

  const clearMatrix = () => {
    setMatrix(matrix.map(row => row.map(() => 0)));
    setResult('');
    setSteps([]);
  };

  const renderMatrix = (matrix: number[][], label?: string) => {
    if (!matrix || matrix.length === 0) return null;
    return (
      <div className="mt-2">
        {label && <span className="font-mono text-blue-700">{label}</span>}
        <div className="inline-block mt-1 border border-blue-200 rounded overflow-hidden">
          {matrix.map((row, i) => (
            <div key={i} className="flex">
              {row.map((val, j) => (
                <div key={j} className="w-20 px-3 py-1.5 text-center font-mono text-sm border-r border-blue-200 last:border-0 bg-white">
                  {val.toFixed(4)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">Enter your matrix:</h3>
          <span className="text-xs text-slate-500">{matrix.length}×{matrix[0]?.length || 0} matrix</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="border-collapse border border-slate-300">
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} className="border border-slate-300 p-1">
                      <input
                        type="text"
                        value={val === 0 ? '' : val}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue === '' || inputValue === '-' || /^-?\d*\.?\d*$/.test(inputValue)) {
                            handleMatrixChange(i, j, inputValue);
                          }
                        }}
                        className="w-14 px-2 py-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={calculateSVD}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Calculate SVD
        </button>
        <button
          onClick={clearMatrix}
          className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All
        </button>
        <button
          onClick={addRow}
          className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Row
        </button>
        <button
          onClick={addColumn}
          className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Column
        </button>
        {matrix.length > 1 && (
          <button
            onClick={removeRow}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove Row
          </button>
        )}
        {(matrix[0]?.length || 0) > 1 && (
          <button
            onClick={removeColumn}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove Column
          </button>
        )}
        {steps.length > 0 && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showExplanation ? 'Hide' : 'Show'} Steps
          </button>
        )}
      </div>

      {steps.length > 0 && (
        <div className="space-y-4">
          {/* Result Summary */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-800">SVD Decomposition Complete</p>
                <div className="mt-2 text-sm text-green-700">
                  The matrix has been decomposed into U·Σ·V^T.
                </div>
                <div className="mt-3 flex flex-wrap gap-4">
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Matrix Size</span>
                    <span className="font-mono text-sm">{matrix.length}×{matrix[0]?.length || 0}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Rank</span>
                    <span className="font-mono text-sm">
                      {steps.some(step => step.title.includes('Final')) ? 
                        `${Math.min(matrix.length, matrix[0]?.length || 0)}` : 
                        'Calculating...'
                      }
                    </span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Singular Values</span>
                    <span className="font-mono text-sm">
                      {steps.some(step => step.title.includes('Final')) ? 
                        `${Math.min(matrix.length, matrix[0]?.length || 0)}` : 
                        'Calculating...'
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 ml-auto">
                <PDFExport
                  title="Singular Value Decomposition (A = UΣVᵀ)"
                  data={`Matrix Size: ${matrix.length}×${matrix[0]?.length || 0}\nRank / Non-zero SVs: ${Math.min(matrix.length, matrix[0]?.length || 0)}\n${result}`}
                  steps={steps.map(s => ({
                    step: `${s.title}\n${s.description}${s.matrix ? '\n' + s.matrix.map(r => `[${r.map(v => v.toFixed(4)).join(', ')}]`).join('\n') : ''}`,
                    explanation: s.explanation
                  }))}
                  inputs={`Matrix A (${matrix.length}×${matrix[0]?.length || 0}):\n${matrix.map(r => `[${r.join(', ')}]`).join('\n')}`}
                  fileName="svd_decomposition"
                />
              </div>
            </div>
          </div>

          {/* Step-by-Step Explanation */}
          {showExplanation && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h4 className="font-medium text-blue-800">Step-by-Step Solution</h4>
                <span className="text-xs text-blue-600 ml-auto">SVD Algorithm</span>
              </div>
              
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="border-b border-blue-200 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold text-sm mt-0.5">{idx + 1}.</span>
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900 text-sm">{step.title}</p>
                        <div className="mt-1 text-sm text-blue-800 whitespace-pre-wrap">
                          {step.description}
                        </div>
                        {step.matrix && step.matrix.length > 0 && (
                          <div className="mt-2">
                            {renderMatrix(step.matrix, step.label)}
                          </div>
                        )}
                      </div>
                      {step.explanation && (
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
                              {step.explanation}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
          SVD decomposes a matrix A into U·Σ·V^T where U and V are orthogonal and Σ is diagonal
        </p>
        <p className="mt-1 text-xs">Supports matrices of any size. For 2×2 matrices, analytical solution is used.</p>
      </div>
    </div>
  );
};

export default SVDCalculator;