// components/Diagonalization.tsx
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

const Diagonalization: React.FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([[4, -2], [1, 1]]);
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [showExplanation, setShowExplanation] = useState(true);

  const calculateDiagonalization = () => {
    const m = matrix.length;
    const n = matrix[0]?.length || 0;
    
    // Check if matrix is square
    if (m !== n) {
      setResult('❌ Matrix must be square for diagonalization.');
      setSteps([]);
      return;
    }

    // Check if matrix is 2x2
    if (m !== 2) {
      setResult('❌ Diagonalization currently supports 2×2 matrices only.');
      setSteps([]);
      return;
    }

    const [[a, b], [c, d]] = matrix;
    const stepsList: Step[] = [];

    // Step 1: Display original matrix
    stepsList.push({
      title: 'Step 1: Original Matrix',
      description: `We start with the ${m}×${n} matrix A.`,
      matrix: matrix,
      label: 'A =',
      explanation: 'The original matrix A that we want to diagonalize.'
    });

    // Step 2: Compute trace and determinant
    const trace = a + d;
    const det = a * d - b * c;
    
    stepsList.push({
      title: 'Step 2: Characteristic Equation',
      description: `For a 2×2 matrix, the characteristic equation is:\n` +
                   `λ² - trace(A)·λ + det(A) = 0\n\n` +
                   `trace(A) = ${a} + ${d} = ${trace.toFixed(4)}\n` +
                   `det(A) = ${a}·${d} - ${b}·${c} = ${det.toFixed(4)}\n\n` +
                   `λ² - ${trace.toFixed(4)}λ + ${det.toFixed(4)} = 0`,
      explanation: 'The characteristic equation det(A - λI) = 0 gives the eigenvalues. For 2×2 matrices, it simplifies to λ² - trace(A)·λ + det(A) = 0.'
    });

    // Step 3: Compute discriminant
    const discriminant = trace * trace - 4 * det;
    
    stepsList.push({
      title: 'Step 3: Discriminant',
      description: `Δ = trace² - 4·det\n` +
                   `Δ = ${trace.toFixed(4)}² - 4·${det.toFixed(4)}\n` +
                   `Δ = ${discriminant.toFixed(4)}`,
      explanation: 'The discriminant determines the nature of the eigenvalues. If Δ > 0, eigenvalues are real and distinct.'
    });

    // Check for real eigenvalues
    if (discriminant < 0) {
      stepsList.push({
        title: '⚠️ Complex Eigenvalues',
        description: `The matrix has complex eigenvalues (Δ < 0).\n` +
                     `Real matrices with complex eigenvalues cannot be diagonalized over real numbers.\n` +
                     `However, they can be diagonalized over complex numbers.`,
        explanation: 'Complex eigenvalues mean the matrix cannot be diagonalized over real numbers. It may still be diagonalizable over complex numbers.'
      });
      setSteps(stepsList);
      setResult('❌ Complex eigenvalues (not supported in this demo)');
      return;
    }

    // Step 4: Compute eigenvalues
    const sqrtD = Math.sqrt(discriminant);
    const λ1 = (trace + sqrtD) / 2;
    const λ2 = (trace - sqrtD) / 2;
    
    stepsList.push({
      title: 'Step 4: Eigenvalues',
      description: `λ₁ = (${trace.toFixed(4)} + √${discriminant.toFixed(4)}) / 2 = ${λ1.toFixed(4)}\n` +
                   `λ₂ = (${trace.toFixed(4)} - √${discriminant.toFixed(4)}) / 2 = ${λ2.toFixed(4)}`,
      explanation: 'The eigenvalues are the roots of the characteristic equation. They are the values that satisfy A·v = λ·v.'
    });

    // Step 5: Compute eigenvectors
    stepsList.push({
      title: 'Step 5: Eigenvectors',
      description: `For each eigenvalue λ, solve (A - λI)v = 0\n\n` +
                   `For λ₁ = ${λ1.toFixed(4)}:`,
      explanation: 'For each eigenvalue, we find the corresponding eigenvector by solving (A - λI)v = 0.'
    });

    // Find eigenvector for λ1
    let v1: number[];
    const A1 = [
      [a - λ1, b],
      [c, d - λ1]
    ];

    // Solve (A - λI)v = 0
    if (Math.abs(A1[0][0]) > Math.abs(A1[0][1])) {
      v1 = [A1[0][1], -A1[0][0]];
    } else {
      v1 = [A1[0][1], -A1[0][0]];
    }

    // Normalize
    const norm1 = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1]);
    if (norm1 > 1e-10) {
      v1 = [v1[0]/norm1, v1[1]/norm1];
    }

    stepsList.push({
      title: '  Eigenvector for λ₁',
      description: `v₁ = [${v1[0].toFixed(4)}, ${v1[1].toFixed(4)}]^T\n` +
                   `(Normalized to unit vector)`,
      explanation: `The eigenvector for λ₁ = ${λ1.toFixed(4)} is normalized to have length 1.`
    });

    stepsList.push({
      title: `For λ₂ = ${λ2.toFixed(4)}:`,
      description: `Solving (A - λ₂I)v = 0`,
      explanation: `Finding the eigenvector for the second eigenvalue λ₂.`
    });

    // Find eigenvector for λ2
    let v2: number[];
    const A2 = [
      [a - λ2, b],
      [c, d - λ2]
    ];

    if (Math.abs(A2[0][0]) > Math.abs(A2[0][1])) {
      v2 = [A2[0][1], -A2[0][0]];
    } else {
      v2 = [A2[0][1], -A2[0][0]];
    }

    const norm2 = Math.sqrt(v2[0]*v2[0] + v2[1]*v2[1]);
    if (norm2 > 1e-10) {
      v2 = [v2[0]/norm2, v2[1]/norm2];
    }

    stepsList.push({
      title: '  Eigenvector for λ₂',
      description: `v₂ = [${v2[0].toFixed(4)}, ${v2[1].toFixed(4)}]^T\n` +
                   `(Normalized to unit vector)`,
      explanation: `The eigenvector for λ₂ = ${λ2.toFixed(4)} is normalized to have length 1.`
    });

    // Step 6: Check if diagonalizable
    stepsList.push({
      title: 'Step 6: Diagonalizability Check',
      description: `A matrix is diagonalizable if it has n linearly independent eigenvectors.\n` +
                   `For a 2×2 matrix, this means we need 2 linearly independent eigenvectors.\n\n` +
                   `v₁ = [${v1[0].toFixed(4)}, ${v1[1].toFixed(4)}]^T\n` +
                   `v₂ = [${v2[0].toFixed(4)}, ${v2[1].toFixed(4)}]^T`,
      explanation: 'A matrix is diagonalizable if it has a full set of linearly independent eigenvectors. For 2×2 matrices, we need 2 independent eigenvectors.'
    });

    // Check if eigenvectors are linearly independent (determinant of P ≠ 0)
    const detP = v1[0] * v2[1] - v1[1] * v2[0];
    const isDiagonalizable = Math.abs(detP) > 1e-10;

    if (isDiagonalizable) {
      stepsList.push({
        title: '  ✅ Matrix is Diagonalizable',
        description: `The eigenvectors are linearly independent (det(P) = ${detP.toFixed(4)} ≠ 0).`,
        explanation: 'Non-zero determinant of P means the eigenvectors are linearly independent, so the matrix is diagonalizable.'
      });
    } else {
      stepsList.push({
        title: '  ❌ Matrix is NOT Diagonalizable',
        description: `The eigenvectors are linearly dependent (det(P) = ${detP.toFixed(4)} ≈ 0).\n` +
                     `This means the matrix has repeated eigenvalues but is not diagonalizable.`,
        explanation: 'Zero determinant of P means the eigenvectors are dependent, so the matrix cannot be diagonalized. It may be similar to a Jordan form.'
      });
    }

    // Step 7: Construct P and D
    const P = [
      [v1[0], v2[0]],
      [v1[1], v2[1]]
    ];

    const D = [
      [λ1, 0],
      [0, λ2]
    ];

    stepsList.push({
      title: 'Step 7: Diagonalization Matrices',
      description: `P contains the eigenvectors as columns:\n` +
                   `P = [v₁ v₂]`,
      matrix: P,
      label: 'P =',
      explanation: 'P is the matrix of eigenvectors (column-wise). It diagonalizes A: A = P·D·P⁻¹.'
    });

    stepsList.push({
      title: '  Diagonal Matrix D',
      description: `D contains the eigenvalues on the diagonal:`,
      matrix: D,
      label: 'D =',
      explanation: 'D is the diagonal matrix with the eigenvalues on the main diagonal.'
    });

    // Step 8: Verify diagonalization
    stepsList.push({
      title: 'Step 8: Verify A = P·D·P⁻¹',
      description: 'Checking if the diagonalization is correct.',
      explanation: 'We verify the diagonalization by checking if A = P·D·P⁻¹ holds.'
    });

    // Compute P⁻¹ for 2x2
    const detP_inv = P[0][0] * P[1][1] - P[0][1] * P[1][0];
    if (Math.abs(detP_inv) > 1e-10) {
      const P_inv = [
        [P[1][1] / detP_inv, -P[0][1] / detP_inv],
        [-P[1][0] / detP_inv, P[0][0] / detP_inv]
      ];

      // Compute P·D
      const PD = [
        [P[0][0]*D[0][0] + P[0][1]*D[1][0], P[0][0]*D[0][1] + P[0][1]*D[1][1]],
        [P[1][0]*D[0][0] + P[1][1]*D[1][0], P[1][0]*D[0][1] + P[1][1]*D[1][1]]
      ];

      // Compute (P·D)·P⁻¹
      const reconstructed = [
        [
          PD[0][0]*P_inv[0][0] + PD[0][1]*P_inv[1][0],
          PD[0][0]*P_inv[0][1] + PD[0][1]*P_inv[1][1]
        ],
        [
          PD[1][0]*P_inv[0][0] + PD[1][1]*P_inv[1][0],
          PD[1][0]*P_inv[0][1] + PD[1][1]*P_inv[1][1]
        ]
      ];

      let maxDiff = 0;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          maxDiff = Math.max(maxDiff, Math.abs(matrix[i][j] - reconstructed[i][j]));
        }
      }

      stepsList.push({
        title: '  Verification Results',
        description: `Maximum difference between A and P·D·P⁻¹: ${maxDiff.toFixed(10)}\n` +
                     `${maxDiff < 1e-8 ? '✅ Diagonalization is correct!' : '⚠️ Diagonalization has errors'}`,
        explanation: 'The maximum difference between A and P·D·P⁻¹. A small value confirms the diagonalization is correct.'
      });
    }

    // Step 9: Final result
    let finalDescription = `✅ A = P·D·P⁻¹\n\n` +
                          `D = diag(${λ1.toFixed(4)}, ${λ2.toFixed(4)})\n\n` +
                          `P = [[${v1[0].toFixed(4)}, ${v2[0].toFixed(4)}],\n` +
                          `    [${v1[1].toFixed(4)}, ${v2[1].toFixed(4)}]]\n\n`;

    if (isDiagonalizable) {
      finalDescription += `✅ The matrix is diagonalizable over real numbers.`;
    } else {
      finalDescription += `❌ The matrix is NOT diagonalizable over real numbers.\n` +
                          `(It may be similar to a Jordan form instead.)`;
    }

    stepsList.push({
      title: '✅ Final Result',
      description: finalDescription,
      explanation: 'The diagonalization is complete. The matrix A = P·D·P⁻¹ where D is diagonal.'
    });

    setSteps(stepsList);

    // Set result for display
    const resultText = 
      '=== DIAGONALIZATION STEPS ===\n\n' +
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
        {label && <span className="font-mono text-xs font-bold text-[#B6FF2E]">{label}</span>}
        <div className="inline-block mt-1 border border-[var(--line)] rounded-xl overflow-hidden bg-slate-100 dark:bg-[#14171B]">
          {matrix.map((row, i) => (
            <div key={i} className="flex">
              {row.map((val, j) => (
                <div key={j} className="w-20 px-3 py-1.5 text-center font-mono text-sm border-r border-[var(--line)] last:border-0 text-[var(--heading)]">
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--heading)]">Enter your square matrix:</h3>
          <span className="text-xs text-[var(--muted)] font-mono">{matrix.length}×{matrix[0]?.length || 0} matrix</span>
        </div>
        
        <div className="overflow-x-auto p-3 rounded-xl border border-[var(--line)] bg-[var(--panel)] inline-block min-w-full sm:min-w-0">
          <table className="border-collapse mx-auto">
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} className="p-1">
                      <input
                        type="text"
                        value={val === 0 ? '' : val}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (inputValue === '' || inputValue === '-' || /^-?\d*\.?\d*$/.test(inputValue)) {
                            handleMatrixChange(i, j, inputValue);
                          }
                        }}
                        className="w-14 sm:w-16 px-2 py-1.5 text-center font-mono font-bold text-sm bg-slate-100 dark:bg-[#14171B] text-[var(--heading)] border border-[var(--line)] rounded-lg focus:ring-2 focus:ring-[#B6FF2E] focus:border-[#B6FF2E] outline-none transition"
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

      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={calculateDiagonalization}
          className="px-5 py-2 bg-[#B6FF2E] text-[#1F2329] font-extrabold rounded-xl hover:brightness-105 transition shadow-lg shadow-[#B6FF2E]/20 flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Diagonalize
        </button>
        <button
          onClick={clearMatrix}
          className="px-3.5 py-2 border border-[var(--line)] bg-[var(--panel)] text-[var(--heading)] font-semibold rounded-xl hover:border-[#B6FF2E] transition text-xs flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All
        </button>
        <button
          onClick={addRow}
          className="px-3.5 py-2 border border-[var(--line)] bg-[var(--panel)] text-[var(--heading)] font-semibold rounded-xl hover:border-[#B6FF2E] transition text-xs flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Row
        </button>
        <button
          onClick={addColumn}
          className="px-3.5 py-2 border border-[var(--line)] bg-[var(--panel)] text-[var(--heading)] font-semibold rounded-xl hover:border-[#B6FF2E] transition text-xs flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Column
        </button>
        {matrix.length > 1 && (
          <button
            onClick={removeRow}
            className="px-3.5 py-2 border border-red-500/30 bg-[var(--panel)] text-red-500 font-semibold rounded-xl hover:border-red-500 transition text-xs flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove Row
          </button>
        )}
        {(matrix[0]?.length || 0) > 1 && (
          <button
            onClick={removeColumn}
            className="px-3.5 py-2 border border-red-500/30 bg-[var(--panel)] text-red-500 font-semibold rounded-xl hover:border-red-500 transition text-xs flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove Column
          </button>
        )}
        {steps.length > 0 && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="px-3.5 py-2 border border-[var(--line)] bg-[var(--panel)] text-[var(--heading)] font-semibold rounded-xl hover:border-[#B6FF2E] transition text-xs flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showExplanation ? 'Hide' : 'Show'} Steps
          </button>
        )}
      </div>

      {steps.length > 0 && (
        <div className="space-y-4">
          {/* Result Summary */}
          <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--panel)] animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#B6FF2E]">Diagonalization Complete</p>
                <div className="mt-1 text-xs text-[var(--muted)]">
                  The matrix has been diagonalized (if possible).
                </div>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <div className="bg-slate-100 dark:bg-[#14171B] px-3 py-2 rounded-xl border border-[var(--line)]">
                    <span className="text-[0.65rem] uppercase font-bold text-[var(--muted)] block">Matrix Size</span>
                    <span className="font-mono text-xs font-bold text-[var(--heading)]">{matrix.length}×{matrix[0]?.length || 0}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-[#14171B] px-3 py-2 rounded-xl border border-[var(--line)]">
                    <span className="text-[0.65rem] uppercase font-bold text-[var(--muted)] block">Diagonalizable</span>
                    <span className="font-mono text-xs font-bold text-[var(--heading)]">
                      {steps.some(step => step.title.includes('✅ Matrix is Diagonalizable')) ? 'Yes ✅' : 'No ❌'}
                    </span>
                  </div>
                  {steps.some(step => step.title.includes('Eigenvalues')) && (
                    <div className="bg-slate-100 dark:bg-[#14171B] px-3 py-2 rounded-xl border border-[var(--line)]">
                      <span className="text-[0.65rem] uppercase font-bold text-[var(--muted)] block">Eigenvalues</span>
                      <span className="font-mono text-xs font-bold text-[var(--heading)]">
                        {steps.find(step => step.title.includes('Eigenvalues'))?.description
                          ?.split('\n')
                          .filter(line => line.includes('λ'))
                          .map(line => line.trim())
                          .join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <PDFExport
                  title="Matrix Diagonalization (A = PDP⁻¹)"
                  data={`Matrix Size: ${matrix.length}×${matrix[0]?.length || 0}\nDiagonalizable: ${steps.some(step => step.title.includes('✅ Matrix is Diagonalizable')) ? 'Yes' : 'No'}\nResult: ${result}`}
                  steps={steps.map(s => ({
                    step: `${s.title}\n${s.description}${s.matrix ? '\n' + s.matrix.map(r => `[${r.map(v => v.toFixed(4)).join(', ')}]`).join('\n') : ''}`,
                    explanation: s.explanation
                  }))}
                  inputs={`Matrix A:\n${matrix.map(r => `[${r.join(', ')}]`).join('\n')}`}
                  fileName="matrix_diagonalization"
                />
              </div>
            </div>
          </div>

          {/* Step-by-Step Explanation with explanation beside */}
          {showExplanation && (
            <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--panel)] animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--line)]">
                <svg className="w-4 h-4 text-[#B6FF2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--heading)]">Step-by-Step Solution</h4>
                <span className="text-xs text-[var(--muted)] ml-auto">Diagonalization Algorithm</span>
              </div>
              
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="border-b border-[var(--line)] last:border-0 pb-4 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#B6FF2E]/20 text-[#B6FF2E] font-mono text-xs font-bold">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[var(--heading)] text-sm">{step.title}</p>
                        <div className="mt-1 text-xs text-[var(--muted)] whitespace-pre-wrap leading-relaxed">
                          {step.description}
                        </div>
                        {step.matrix && step.matrix.length > 0 && (
                          <div className="mt-2">
                            {renderMatrix(step.matrix, step.label)}
                          </div>
                        )}
                      </div>
                      {step.explanation && (
                        <div className="flex-shrink-0 mt-2 sm:mt-0">
                          <details className="group">
                            <summary className="text-xs text-[var(--muted)] hover:text-[#B6FF2E] cursor-pointer font-bold px-2.5 py-1 rounded-lg border border-[var(--line)] bg-slate-100 dark:bg-[#14171B] transition">
                              <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Explanation
                              </span>
                            </summary>
                            <div className="mt-2 p-3 bg-slate-100 dark:bg-[#14171B] rounded-lg border border-[var(--line)] text-xs text-[var(--muted)] max-w-xs leading-relaxed">
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

      <div className="text-xs text-[var(--muted)] p-3.5 rounded-xl border border-[var(--line)] bg-[var(--panel)]">
        <p className="flex items-center gap-1.5 font-bold text-[var(--heading)]">
          <svg className="w-4 h-4 text-[#B6FF2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Diagonalization requirements:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-[0.7rem]">
          <li>Matrix must be square (n×n)</li>
          <li>Matrix must have n linearly independent eigenvectors</li>
          <li>If all eigenvalues are distinct, matrix is guaranteed diagonalizable</li>
        </ul>
      </div>
    </div>
  );
};

export default Diagonalization;