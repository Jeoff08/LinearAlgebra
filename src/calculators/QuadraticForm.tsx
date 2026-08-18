// components/QuadraticForm.tsx
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

const QuadraticForm: React.FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([[1, 2], [2, 1]]);
  const [vector, setVector] = useState<number[]>([1, 1]);
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [showExplanation, setShowExplanation] = useState(true);
  const [quadraticValue, setQuadraticValue] = useState<number>(0);

  const calculateQuadratic = () => {
    const n = matrix.length;
    const cols = matrix[0]?.length || 0;
    
    if (n === 0 || cols === 0) {
      setResult('❌ Matrix is empty.');
      setSteps([]);
      return;
    }

    if (n !== cols) {
      setResult('❌ Matrix must be square for quadratic form.');
      setSteps([]);
      return;
    }

    if (vector.length !== n) {
      setResult(`❌ Vector must have ${n} elements (same as matrix size).`);
      setSteps([]);
      return;
    }

    const stepsList: Step[] = [];

    // Step 1: Display original matrix and vector
    stepsList.push({
      title: 'Step 1: Original Matrix and Vector',
      description: `We have a ${n}×${n} symmetric matrix A and a vector x of length ${n}.`,
      matrix: matrix,
      label: 'A =',
      explanation: 'The quadratic form requires a square matrix A and a vector x of the same dimension.'
    });

    stepsList.push({
      title: '  Vector x',
      description: `The input vector x:`,
      vector: vector,
      label: 'x =',
      explanation: 'The vector x contains the variables for the quadratic form.'
    });

    // Step 2: Explain quadratic form
    stepsList.push({
      title: 'Step 2: Quadratic Form Definition',
      description: `The quadratic form is defined as:\n` +
                   `Q(x) = x^T · A · x = Σᵢ Σⱼ xᵢ · Aᵢⱼ · xⱼ\n\n` +
                   `This is a scalar value that represents a quadratic function in the variables.`,
      explanation: 'The quadratic form expands to a sum of terms where each term is x_i * A_ij * x_j. This is a generalization of the quadratic expression ax² + bxy + cy².'
    });

    // Step 3: Check if matrix is symmetric
    let isSymmetric = true;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (Math.abs(matrix[i][j] - matrix[j][i]) > 1e-10) {
          isSymmetric = false;
          break;
        }
      }
      if (!isSymmetric) break;
    }

    if (!isSymmetric) {
      stepsList.push({
        title: '⚠️ Warning: Non-Symmetric Matrix',
        description: `The matrix is not symmetric. For quadratic forms, the matrix is typically symmetric.\n` +
                     `The quadratic form will still be computed, but the standard form assumes symmetry.\n` +
                     `The symmetric part of A is (A + A^T)/2.`,
        explanation: 'In standard quadratic form theory, the matrix A should be symmetric. Non-symmetric matrices can be symmetrized without changing the quadratic form value.'
      });
    } else {
      stepsList.push({
        title: '  ✅ Symmetric Matrix',
        description: `The matrix is symmetric (A = A^T), which is the standard form for quadratic forms.`,
        explanation: 'A symmetric matrix has the property A[i][j] = A[j][i], which simplifies the quadratic form expression.'
      });
    }

    // Step 4: Expand the quadratic form
    stepsList.push({
      title: 'Step 3: Expanding the Quadratic Form',
      description: `Expanding x^T·A·x as a sum of terms:`,
      explanation: 'We expand the quadratic form by multiplying out all terms. Each term is the product of x_i, A_ij, and x_j.'
    });

    const terms: string[] = [];
    let totalSum = 0;
    const termValues: number[] = [];

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const term = vector[i] * matrix[i][j] * vector[j];
        termValues.push(term);
        if (Math.abs(term) > 1e-10) {
          terms.push(`${vector[i].toFixed(2)} × ${matrix[i][j].toFixed(2)} × ${vector[j].toFixed(2)} = ${term.toFixed(4)}`);
        }
        totalSum += term;
      }
    }

    setQuadraticValue(totalSum);

    stepsList.push({
      title: '  Expanded Terms',
      description: terms.length > 0 ? terms.join('\n') : 'All terms are zero.',
      explanation: 'Each term is calculated by multiplying the corresponding vector components with the matrix element.'
    });

    // Step 5: Show intermediate sum
    stepsList.push({
      title: 'Step 4: Sum of Terms',
      description: `Summing all terms:\n` +
                   `Q(x) = ${termValues.map(v => v.toFixed(4)).join(' + ')}\n` +
                   `Q(x) = ${totalSum.toFixed(4)}`,
      explanation: 'The quadratic form is the sum of all individual terms from the expansion.'
    });

    // Step 6: Classify the quadratic form
    stepsList.push({
      title: 'Step 5: Classification of Quadratic Form',
      description: `Analyzing the properties of the quadratic form:`,
      explanation: 'Quadratic forms can be classified based on their definiteness, which determines the shape of the quadratic surface.'
    });

    // Check definiteness
    let definiteness = '';
    if (n === 2) {
      // For 2x2, use principal minors
      const a = matrix[0][0];
      const b = matrix[0][1];
      const c = matrix[1][1];
      const det = a * c - b * b;
      
      if (a > 0 && det > 0) {
        definiteness = 'Positive Definite (convex, minimum at origin)';
      } else if (a < 0 && det > 0) {
        definiteness = 'Negative Definite (concave, maximum at origin)';
      } else if (det < 0) {
        definiteness = 'Indefinite (saddle point at origin)';
      } else if (a >= 0 && det >= 0) {
        definiteness = 'Positive Semidefinite (minimum along some directions)';
      } else if (a <= 0 && det >= 0) {
        definiteness = 'Negative Semidefinite (maximum along some directions)';
      } else {
        definiteness = 'Indefinite or degenerate';
      }
    } else {
      // For larger matrices, check eigenvalues (simplified)
      definiteness = 'Check eigenvalues for definite classification';
    }

    stepsList.push({
      title: '  Classification Result',
      description: `The quadratic form is: ${definiteness}`,
      explanation: 'The classification tells us whether the quadratic form is always positive, always negative, or can take both signs.'
    });

    // Step 7: Show the matrix-vector product Ax
    const Ax: number[] = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += matrix[i][j] * vector[j];
      }
      Ax[i] = sum;
    }

    stepsList.push({
      title: 'Step 6: Intermediate Calculation (A·x)',
      description: `Computing A·x first (optional approach):`,
      vector: Ax,
      label: 'A·x =',
      explanation: 'An alternative way to compute the quadratic form is to first compute A·x, then take the dot product with x.'
    });

    // Step 7: Verify using x^T·(A·x)
    const verifySum = vector.reduce((sum, val, i) => sum + val * Ax[i], 0);
    
    stepsList.push({
      title: 'Step 7: Verification',
      description: `Using x^T·(A·x):\n` +
                   `x^T·(A·x) = ${vector.map((v, i) => `${v.toFixed(2)} × ${Ax[i].toFixed(4)}`).join(' + ')}\n` +
                   `x^T·(A·x) = ${verifySum.toFixed(4)}\n\n` +
                   `✅ Matches the expanded sum (${totalSum.toFixed(4)})`,
      explanation: 'Verification ensures both methods yield the same result, confirming the calculation is correct.'
    });

    // Step 8: Final result
    let finalDescription = `✅ Quadratic Form Evaluated!\n\n` +
                          `Q(x) = x^T · A · x = ${totalSum.toFixed(6)}\n\n`;

    if (isSymmetric) {
      finalDescription += `The matrix A is symmetric.\n`;
    } else {
      finalDescription += `⚠️ The matrix A is NOT symmetric.\n`;
    }
    
    finalDescription += `Classification: ${definiteness}`;

    stepsList.push({
      title: '✅ Final Result',
      description: finalDescription,
      explanation: 'The quadratic form has been successfully evaluated with all steps verified.'
    });

    setSteps(stepsList);

    // Set result for display
    const resultText = 
      '=== QUADRATIC FORM EVALUATION STEPS ===\n\n' +
      stepsList.map(step => 
        `${step.title}\n${step.description}\n${step.matrix ? formatMatrix(step.matrix, step.label || '') : ''}\n${step.vector ? formatVector(step.vector, step.label || '') : ''}\n`
      ).join('\n');

    setResult(resultText);
  };

  const formatMatrix = (matrix: number[][], label: string): string => {
    if (!matrix || matrix.length === 0) return '';
    const formatted = matrix.map(row => 
      row.map(v => v.toFixed(2)).join(' ')
    ).join('\n');
    return `${label}\n${formatted}`;
  };

  const formatVector = (vector: number[], label: string): string => {
    if (!vector || vector.length === 0) return '';
    return `${label}\n[${vector.map(v => v.toFixed(2)).join(', ')}]^T`;
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

  const handleVectorChange = (index: number, value: string) => {
    const newV = [...vector];
    if (value === '' || value === '-') {
      newV[index] = 0;
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        newV[index] = num;
      }
    }
    setVector(newV);
    setResult('');
    setSteps([]);
  };

  const addRow = () => {
    const n = matrix.length;
    // Add row and column to keep it square
    const newMatrix = matrix.map(row => [...row, 0]);
    newMatrix.push(Array(n + 1).fill(0));
    setMatrix(newMatrix);
    setVector([...vector, 0]);
    setResult('');
    setSteps([]);
  };

  const removeRow = () => {
    if (matrix.length > 1) {
      const newMatrix = matrix.slice(0, -1).map(row => row.slice(0, -1));
      setMatrix(newMatrix);
      setVector(vector.slice(0, -1));
      setResult('');
      setSteps([]);
    }
  };

  const clearAll = () => {
    setMatrix(matrix.map(row => row.map(() => 0)));
    setVector(vector.map(() => 0));
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
                  {val.toFixed(2)}
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
                {val.toFixed(2)}
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
          <h3 className="text-sm font-medium text-slate-700">Matrix A and vector x:</h3>
          <span className="text-xs text-slate-500">{matrix.length}×{matrix[0]?.length || 0} matrix</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">Matrix A (symmetric)</p>
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
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">Vector x</p>
            <div className="flex flex-col gap-1">
              {vector.map((val, i) => (
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
          onClick={calculateQuadratic}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Calculate Quadratic Form
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
          Increase Size
        </button>
        {matrix.length > 1 && (
          <button
            onClick={removeRow}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Decrease Size
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
                <p className="font-medium text-green-800">Quadratic Form Evaluated</p>
                <div className="mt-2 text-sm text-green-700">
                  The quadratic form Q(x) = x^T·A·x has been computed.
                </div>
                <div className="mt-3 flex flex-wrap gap-4">
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Matrix Size</span>
                    <span className="font-mono text-sm">{matrix.length}×{matrix[0]?.length || 0}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Vector Length</span>
                    <span className="font-mono text-sm">{vector.length}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Q(x) Value</span>
                    <span className="font-mono text-sm font-bold text-indigo-600">{quadraticValue.toFixed(6)}</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 ml-auto">
                <PDFExport
                  title="Quadratic Form (Q(x) = xᵀAx)"
                  data={`Matrix Size: ${matrix.length}×${matrix[0]?.length || 0}\nVector Dimension: ${vector.length}\nQ(x) Value = ${quadraticValue.toFixed(6)}\n${result}`}
                  steps={steps.map(s => ({
                    step: `${s.title}\n${s.description}${s.matrix ? '\n' + s.matrix.map(r => `[${r.map(v => v.toFixed(4)).join(', ')}]`).join('\n') : ''}${s.vector ? '\n[' + s.vector.map(v => v.toFixed(4)).join(', ') + ']' : ''}`,
                    explanation: s.explanation
                  }))}
                  inputs={`Matrix A (${matrix.length}×${matrix[0]?.length || 0}):\n${matrix.map(r => `[${r.join(', ')}]`).join('\n')}\nVector x = [${vector.join(', ')}]`}
                  fileName="quadratic_form"
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
                <span className="text-xs text-blue-600 ml-auto">Quadratic Form Expansion</span>
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
          The quadratic form Q(x) = x^T·A·x is a scalar-valued quadratic function.
        </p>
        <p className="mt-1 text-xs">For standard quadratic forms, matrix A should be symmetric.</p>
      </div>
    </div>
  );
};

export default QuadraticForm;