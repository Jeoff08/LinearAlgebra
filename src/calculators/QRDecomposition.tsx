// components/QRDecomposition.tsx
import React, { useState } from 'react';

interface Step {
  title: string;
  description: string;
  matrix?: number[][];
  label?: string;
  explanation?: string;
}

const QRDecomposition: React.FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([[1, 2], [3, 4], [5, 6]]);
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [showExplanation, setShowExplanation] = useState(true);

  const calculateQR = () => {
    const m = matrix.length;
    const n = matrix[0]?.length || 0;
    const Q: number[][] = Array.from({ length: m }, () => Array(n).fill(0));
    const R: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const stepsList: Step[] = [];

    // Add initial matrix
    stepsList.push({
      title: 'Step 1: Original Matrix',
      description: `We start with the ${m}×${n} matrix A that we want to decompose into Q (orthogonal) and R (upper triangular).`,
      matrix: matrix,
      label: 'A =',
      explanation: 'QR decomposition factors a matrix A into Q (orthogonal matrix) and R (upper triangular matrix). This is useful for solving linear systems and eigenvalue problems.'
    });

    // Gram-Schmidt process
    for (let j = 0; j < n; j++) {
      // Copy column j
      const v = matrix.map(row => row[j]);
      
      stepsList.push({
        title: `Step ${j + 2}: Process Column ${j + 1}`,
        description: `Taking column ${j + 1} of matrix A as vector v${j+1} = [${v.map(val => val.toFixed(2)).join(', ')}]^T`,
        matrix: matrix.map(row => [row[j]]),
        label: `v${j+1} =`,
        explanation: 'The Gram-Schmidt process takes each column of A and orthogonalizes it against all previous columns.'
      });

      // Orthogonalize against previous columns
      for (let i = 0; i < j; i++) {
        // Calculate R[i][j]
        R[i][j] = 0;
        for (let k = 0; k < m; k++) {
          R[i][j] += Q[k][i] * matrix[k][j];
        }
        
        // Subtract projection
        for (let k = 0; k < m; k++) {
          v[k] -= R[i][j] * Q[k][i];
        }

        stepsList.push({
          title: `  Projection onto q${i+1}`,
          description: `r${i+1}${j+1} = q${i+1}^T · v${j+1} = ${R[i][j].toFixed(4)}\nSubtracting projection from v${j+1}: v${j+1} = v${j+1} - ${R[i][j].toFixed(4)}·q${i+1}`,
          matrix: v.map(val => [val]),
          label: `v${j+1} (after orthogonalization) =`,
          explanation: `Remove the component of v${j+1} that lies along q${i+1} to make it orthogonal to q${i+1}.`
        });
      }

      // Calculate norm for R[j][j]
      let norm = 0;
      for (let k = 0; k < m; k++) {
        norm += v[k] * v[k];
      }
      R[j][j] = Math.sqrt(norm);
      
      // Normalize to get Q column
      for (let k = 0; k < m; k++) {
        Q[k][j] = v[k] / R[j][j];
      }

      stepsList.push({
        title: `  Normalize v${j+1}`,
        description: `r${j+1}${j+1} = ||v${j+1}|| = ${R[j][j].toFixed(4)}\nq${j+1} = v${j+1} / r${j+1}${j+1} = [${Q.map(row => row[j].toFixed(4)).join(', ')}]^T`,
        matrix: Q.map(row => [row[j]]),
        label: `q${j+1} =`,
        explanation: `Normalize the orthogonalized vector v${j+1} to get a unit vector q${j+1}. This forms the next column of Q.`
      });
    }

    // Add final Q and R matrices
    stepsList.push({
      title: 'Step 5: Final Results',
      description: `The QR decomposition is complete!\nQ is an orthogonal matrix (Q^T·Q = I)\nR is an upper triangular matrix`,
      matrix: Q,
      label: 'Q =',
      explanation: 'Q is an orthogonal matrix where each column is a unit vector and all columns are mutually perpendicular.'
    });

    stepsList.push({
      title: 'Final R Matrix',
      description: 'R is the upper triangular matrix from the decomposition.',
      matrix: R,
      label: 'R =',
      explanation: 'R is upper triangular with the orthogonalization coefficients on and above the diagonal.'
    });

    // Verify the decomposition
    const reconstructed: number[][] = Array.from({ length: m }, () => Array(n).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < n; k++) {
          reconstructed[i][j] += Q[i][k] * R[k][j];
        }
      }
    }

    let maxDiff = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        maxDiff = Math.max(maxDiff, Math.abs(matrix[i][j] - reconstructed[i][j]));
      }
    }

    stepsList.push({
      title: '✅ Verification',
      description: `Checking if Q·R = A (original matrix)\nMaximum difference: ${maxDiff.toFixed(10)}\n${maxDiff < 1e-10 ? '✅ Decomposition is correct!' : '⚠️ Decomposition has errors'}`,
      explanation: 'Multiplying Q by R should reconstruct the original matrix A. The maximum difference indicates the accuracy of the decomposition.'
    });

    setSteps(stepsList);

    // Set result for display
    const resultText = 
      '=== QR DECOMPOSITION STEPS ===\n\n' +
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
        <div className="inline-block mt-1">
          {matrix.map((row, i) => (
            <div key={i} className="flex">
              {row.map((val, j) => (
                <div key={j} className="w-16 px-2 py-1 text-center font-mono text-sm border border-blue-200 bg-white">
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
          onClick={calculateQR}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Calculate QR Decomposition
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
                <p className="font-medium text-green-800">QR Decomposition Complete</p>
                <div className="mt-2 text-sm text-green-700">
                  The matrix has been decomposed into Q (orthogonal) and R (upper triangular).
                </div>
                <div className="mt-3 flex flex-wrap gap-4">
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Matrix Size</span>
                    <span className="font-mono text-sm">{matrix.length}×{matrix[0]?.length || 0}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Q Size</span>
                    <span className="font-mono text-sm">{matrix.length}×{matrix[0]?.length || 0}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">R Size</span>
                    <span className="font-mono text-sm">{matrix[0]?.length || 0}×{matrix[0]?.length || 0}</span>
                  </div>
                </div>
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
                <span className="text-xs text-blue-600 ml-auto">Gram-Schmidt Process</span>
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
                          <div className="mt-2 overflow-x-auto">
                            <div className="inline-block border border-blue-200 rounded overflow-hidden">
                              {step.matrix.map((row, i) => (
                                <div key={i} className="flex">
                                  {row.map((val, j) => (
                                    <div key={j} className="w-20 px-3 py-1.5 text-center font-mono text-sm border-r border-blue-200 last:border-0 bg-white">
                                      {val.toFixed(4)}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                            {step.label && (
                              <p className="mt-1 text-xs text-blue-600 font-mono">{step.label}</p>
                            )}
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
          QR decomposition factors a matrix A into Q (orthogonal) and R (upper triangular)
        </p>
        <p className="mt-1 text-xs">The Gram-Schmidt process is used to compute the decomposition step by step.</p>
      </div>
    </div>
  );
};

export default QRDecomposition;