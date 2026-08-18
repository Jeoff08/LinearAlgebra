// components/LeastSquares.tsx
import React, { useState } from 'react';
import PDFExport from './PDFExport';

interface Step {
  title: string;
  description: string;
  matrix?: number[][];
  vector?: number[];
  label?: string;
  explanation?: string;
}

const LeastSquares: React.FC = () => {
  const [matrixA, setMatrixA] = useState<number[][]>([[1, 1], [1, 2], [1, 3]]);
  const [vectorB, setVectorB] = useState<number[]>([1, 2, 2]);
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [showExplanation, setShowExplanation] = useState(true);
  const [residualNorm, setResidualNorm] = useState<number>(0);

  const calculateLeastSquares = () => {
    const m = matrixA.length;
    const n = matrixA[0]?.length || 0;
    
    if (m === 0 || n === 0) {
      setResult('❌ Matrix A is empty.');
      setSteps([]);
      return;
    }

    if (vectorB.length !== m) {
      setResult(`❌ Vector b must have ${m} elements (same as rows of A).`);
      setSteps([]);
      return;
    }

    const stepsList: Step[] = [];

    // Step 1: Display original problem
    stepsList.push({
      title: 'Step 1: Problem Formulation',
      description: `We want to solve the overdetermined system Ax = b, where A is ${m}×${n} and b is ${m}×1.\n` +
                   `Since the system is overdetermined (more equations than unknowns), we find the least squares solution.\n\n` +
                   `Minimize ||Ax - b||²`,
      matrix: matrixA,
      label: 'A =',
      explanation: 'Least squares finds the solution that minimizes the sum of squared residuals when the system is overdetermined.'
    });

    stepsList.push({
      title: '  Vector b',
      description: `The right-hand side vector b:`,
      vector: vectorB,
      label: 'b =',
      explanation: 'The target vector we want to approximate with Ax.'
    });

    // Step 2: Compute A^T * A
    const ATA: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const ATb: number[] = Array(n).fill(0);

    stepsList.push({
      title: 'Step 2: Form the Normal Equations',
      description: `The least squares solution satisfies the normal equations:\n` +
                   `A^T·A·x = A^T·b\n\n` +
                   `First, compute A^T·A (${n}×${n} matrix):`,
      explanation: 'The normal equations are derived by setting the gradient of ||Ax - b||² to zero.'
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
          sum += matrixA[k][i] * matrixA[k][j];
        }
        ATA[i][j] = sum;
      }
    }

    stepsList.push({
      title: '  A^T·A Matrix',
      description: `The Gram matrix A^T·A:`,
      matrix: ATA,
      label: 'A^T·A =',
      explanation: 'A^T·A is the Gram matrix, which is symmetric and positive semidefinite.'
    });

    // Step 3: Compute A^T * b
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let k = 0; k < m; k++) {
        sum += matrixA[k][i] * vectorB[k];
      }
      ATb[i] = sum;
    }

    stepsList.push({
      title: '  A^T·b Vector',
      description: `The vector A^T·b:`,
      vector: ATb,
      label: 'A^T·b =',
      explanation: 'A^T·b is the right-hand side of the normal equations.'
    });

    // Step 4: Show the normal equations
    stepsList.push({
      title: 'Step 3: Normal Equations System',
      description: `The normal equations form the system:\n` +
                   `A^T·A·x = A^T·b\n\n` +
                   `This is a ${n}×${n} system that can be solved for x.`,
      explanation: 'Solving the normal equations gives the least squares solution.'
    });

    // Step 5: Solve the system
    stepsList.push({
      title: 'Step 4: Solve the Normal Equations',
      description: `Solving the ${n}×${n} system using Gaussian elimination.`,
      explanation: 'Gaussian elimination is used to solve the square system efficiently.'
    });

    // Create augmented matrix for solving
    const augMatrix: number[][] = ATA.map((row, i) => [...row, ATb[i]]);
    
    // Show augmented matrix
    stepsList.push({
      title: '  Augmented Matrix',
      description: `The augmented matrix [A^T·A | A^T·b]:`,
      matrix: augMatrix,
      label: '[A^T·A | A^T·b] =',
      explanation: 'The augmented matrix combines the system matrix with the right-hand side.'
    });

    // Solve using Gaussian elimination (works for any size)
    const solution = solveLinearSystem(ATA, ATb);
    
    if (!solution) {
      stepsList.push({
        title: '⚠️ Singular Matrix',
        description: 'The matrix A^T·A is singular (not invertible).\n' +
                     'This means the least squares solution is not unique.',
        explanation: 'A singular A^T·A means the columns of A are linearly dependent.'
      });
      setSteps(stepsList);
      setResult('❌ Matrix A^T·A is singular. The least squares solution is not unique.');
      return;
    }

    // Step 6: Show solution
    const solutionStr = solution.map((val, i) => `x${i+1} = ${val.toFixed(4)}`).join('\n');
    stepsList.push({
      title: 'Step 5: Least Squares Solution',
      description: `The solution to the normal equations is:\n${solutionStr}`,
      vector: solution,
      label: 'x =',
      explanation: 'The solution vector x that minimizes ||Ax - b||².'
    });

    // Step 7: Compute residual
    const residual: number[] = Array(m).fill(0);
    for (let i = 0; i < m; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += matrixA[i][j] * solution[j];
      }
      residual[i] = vectorB[i] - sum;
    }

    const residualNormValue = Math.sqrt(residual.reduce((sum, val) => sum + val * val, 0));
    setResidualNorm(residualNormValue);
    
    stepsList.push({
      title: 'Step 6: Residual Analysis',
      description: `The residual vector r = b - Ax:\n` +
                   `r = [${residual.map(v => v.toFixed(4)).join(', ')}]^T\n\n` +
                   `||r||₂ = ${residualNormValue.toFixed(4)}\n` +
                   `The residual is ${residualNormValue < 1e-6 ? 'zero' : 'non-zero'} because the system is overdetermined.`,
      explanation: 'The residual measures how well the solution fits the data. The norm ||r||₂ is minimized by the least squares solution.'
    });

    // Step 8: Verify solution
    stepsList.push({
      title: 'Step 7: Verify Solution',
      description: `Checking if A^T·A·x = A^T·b:`,
      explanation: 'Verification ensures the solution satisfies the normal equations.'
    });

    // Compute A^T·A·x
    const ATAx: number[] = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += ATA[i][j] * solution[j];
      }
      ATAx[i] = sum;
    }

    // Check if ATAx ≈ ATb
    let maxDiff = 0;
    for (let i = 0; i < n; i++) {
      maxDiff = Math.max(maxDiff, Math.abs(ATAx[i] - ATb[i]));
    }

    stepsList.push({
      title: '  Verification Results',
      description: `Maximum difference between A^T·A·x and A^T·b: ${maxDiff.toFixed(10)}\n` +
                   `${maxDiff < 1e-8 ? '✅ Normal equations are satisfied!' : '⚠️ There might be numerical issues.'}`,
      explanation: 'The difference being small confirms the solution is correct.'
    });

    // Step 9: Final result
    let finalDescription = `✅ Least Squares Solution Found!\n\n` +
                          `x = [${solution.map(v => v.toFixed(4)).join(', ')}]^T\n\n` +
                          `This minimizes ||Ax - b||².\n` +
                          `Minimum residual norm: ${residualNormValue.toFixed(4)}`;

    stepsList.push({
      title: '✅ Final Result',
      description: finalDescription,
      explanation: 'The least squares problem has been solved successfully.'
    });

    setSteps(stepsList);

    // Set result for display
    const resultText = 
      '=== LEAST SQUARES SOLUTION STEPS ===\n\n' +
      stepsList.map(step => 
        `${step.title}\n${step.description}\n${step.matrix ? formatMatrix(step.matrix, step.label || '') : ''}\n${step.vector ? formatVector(step.vector, step.label || '') : ''}\n`
      ).join('\n');

    setResult(resultText);
  };

  const solveLinearSystem = (A: number[][], b: number[]): number[] | null => {
    const n = A.length;
    const aug = A.map((row, i) => [...row, b[i]]);
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let pivotRow = i;
      let maxVal = Math.abs(aug[i][i]);
      for (let j = i + 1; j < n; j++) {
        const val = Math.abs(aug[j][i]);
        if (val > maxVal) {
          maxVal = val;
          pivotRow = j;
        }
      }
      
      if (maxVal < 1e-10) {
        return null; // Singular matrix
      }
      
      // Swap rows
      if (pivotRow !== i) {
        [aug[i], aug[pivotRow]] = [aug[pivotRow], aug[i]];
      }
      
      // Eliminate below
      for (let j = i + 1; j < n; j++) {
        const factor = aug[j][i] / aug[i][i];
        for (let k = i; k <= n; k++) {
          aug[j][k] -= factor * aug[i][k];
        }
      }
    }
    
    // Back substitution
    const x: number[] = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = aug[i][n];
      for (let j = i + 1; j < n; j++) {
        sum -= aug[i][j] * x[j];
      }
      x[i] = sum / aug[i][i];
    }
    
    return x;
  };

  const formatMatrix = (matrix: number[][], label: string): string => {
    if (!matrix || matrix.length === 0) return '';
    const formatted = matrix.map(row => 
      row.map(v => v.toFixed(4)).join(' ')
    ).join('\n');
    return `${label}\n${formatted}`;
  };

  const formatVector = (vector: number[], label: string): string => {
    if (!vector || vector.length === 0) return '';
    return `${label}\n[${vector.map(v => v.toFixed(4)).join(', ')}]^T`;
  };

  const handleMatrixChange = (rowIndex: number, colIndex: number, value: string) => {
    const newM = [...matrixA];
    if (value === '' || value === '-') {
      newM[rowIndex][colIndex] = 0;
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        newM[rowIndex][colIndex] = num;
      }
    }
    setMatrixA(newM);
    setResult('');
    setSteps([]);
  };

  const handleVectorChange = (index: number, value: string) => {
    const newV = [...vectorB];
    if (value === '' || value === '-') {
      newV[index] = 0;
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        newV[index] = num;
      }
    }
    setVectorB(newV);
    setResult('');
    setSteps([]);
  };

  const addRow = () => {
    const cols = matrixA[0]?.length || 2;
    setMatrixA([...matrixA, Array(cols).fill(0)]);
    setVectorB([...vectorB, 0]);
    setResult('');
    setSteps([]);
  };

  const addColumn = () => {
    setMatrixA(matrixA.map(row => [...row, 0]));
    setResult('');
    setSteps([]);
  };

  const removeRow = () => {
    if (matrixA.length > 1) {
      setMatrixA(matrixA.slice(0, -1));
      setVectorB(vectorB.slice(0, -1));
      setResult('');
      setSteps([]);
    }
  };

  const removeColumn = () => {
    if ((matrixA[0]?.length || 0) > 1) {
      setMatrixA(matrixA.map(row => row.slice(0, -1)));
      setResult('');
      setSteps([]);
    }
  };

  const clearAll = () => {
    setMatrixA(matrixA.map(row => row.map(() => 0)));
    setVectorB(vectorB.map(() => 0));
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

  const renderVector = (vector: number[], label?: string) => {
    if (!vector || vector.length === 0) return null;
    return (
      <div className="mt-2">
        {label && <span className="font-mono text-blue-700">{label}</span>}
        <div className="inline-block mt-1 border border-blue-200 rounded overflow-hidden">
          {vector.map((val, i) => (
            <div key={i} className="flex">
              <div className="w-20 px-3 py-1.5 text-center font-mono text-sm border-r border-blue-200 last:border-0 bg-white">
                {val.toFixed(4)}
              </div>
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
          <h3 className="text-sm font-medium text-slate-700">Matrix A and vector b:</h3>
          <span className="text-xs text-slate-500">{matrixA.length}×{matrixA[0]?.length || 0} matrix</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">Matrix A</p>
            <table className="border-collapse border border-slate-300">
              <tbody>
                {matrixA.map((row, i) => (
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
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">Vector b</p>
            <div className="flex flex-col gap-1">
              {vectorB.map((val, i) => (
                <input
                  key={i}
                  type="text"
                  value={val === 0 ? '' : val}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '' || inputValue === '-' || /^-?\d*\.?\d*$/.test(inputValue)) {
                      handleVectorChange(i, inputValue);
                    }
                  }}
                  className="w-14 px-2 py-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={calculateLeastSquares}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Solve Least Squares
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
        {matrixA.length > 1 && (
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
        {(matrixA[0]?.length || 0) > 1 && (
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
                <p className="font-medium text-green-800">Least Squares Solution Complete</p>
                <div className="mt-2 text-sm text-green-700">
                  The overdetermined system has been solved using the normal equations.
                </div>
                <div className="mt-3 flex flex-wrap gap-4">
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Matrix Size</span>
                    <span className="font-mono text-sm">{matrixA.length}×{matrixA[0]?.length || 0}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Unknowns</span>
                    <span className="font-mono text-sm">{matrixA[0]?.length || 0}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Residual Norm (||r||₂)</span>
                    <span className="font-mono text-sm font-bold text-indigo-600">{residualNorm.toFixed(6)}</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 ml-auto">
                <PDFExport
                  title="Least Squares Solver (Ax = b)"
                  data={`Matrix Size: ${matrixA.length}×${matrixA[0]?.length || 0}\nUnknowns: ${matrixA[0]?.length || 0}\nResidual Norm: ${residualNorm.toFixed(6)}\n${result}`}
                  steps={steps.map(s => ({
                    step: `${s.title}\n${s.description}${s.matrix ? '\n' + s.matrix.map(r => `[${r.map(v => v.toFixed(4)).join(', ')}]`).join('\n') : ''}${s.vector ? '\n[' + s.vector.map(v => v.toFixed(4)).join(', ') + ']' : ''}`,
                    explanation: s.explanation
                  }))}
                  inputs={`Matrix A (${matrixA.length}×${matrixA[0]?.length || 0}):\n${matrixA.map(r => `[${r.join(', ')}]`).join('\n')}\nVector b = [${vectorB.join(', ')}]`}
                  fileName="least_squares_solution"
                />
              </div>
            </div>
          </div>

          {/* Step-by-Step Explanation with explanation beside */}
          {showExplanation && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h4 className="font-medium text-blue-800">Step-by-Step Solution</h4>
                <span className="text-xs text-blue-600 ml-auto">Normal Equations Method</span>
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
                        {step.vector && step.vector.length > 0 && (
                          <div className="mt-2">
                            {renderVector(step.vector, step.label)}
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
          Least squares solves overdetermined systems by minimizing ||Ax - b||².
        </p>
        <p className="mt-1 text-xs">Uses the normal equations A^T·A·x = A^T·b for any matrix size.</p>
      </div>
    </div>
  );
};

export default LeastSquares;