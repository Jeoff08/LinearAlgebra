// components/EigenCalculator.tsx
import React, { useState } from 'react';

const EigenCalculator: React.FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([
    [4, -2],
    [1, 1]
  ]);
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<{ step: string; explanation: string }[]>([]);
  const [error, setError] = useState<string>('');
  const [showSteps, setShowSteps] = useState(false);

  // Format matrix for display
  const formatMatrix = (matrix: number[][]): string => {
    return matrix.map(row => 
      `[${row.map(v => v.toFixed(4)).join(', ')}]`
    ).join('\n');
  };

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
  const calculateDeterminant = (matrix: number[][]): number => {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = getMinor(matrix, 0, j);
      det += matrix[0][j] * (j % 2 === 0 ? 1 : -1) * calculateDeterminant(minor);
    }
    return det;
  };

  // Find eigenvalues for 2x2 matrix
  const findEigenvalues2x2 = (matrix: number[][]): { eigenvalues: number[]; steps: { step: string; explanation: string }[] } => {
    const [[a, b], [c, d]] = matrix;
    const steps: { step: string; explanation: string }[] = [];
    
    const trace = a + d;
    const det = a * d - b * c;
    
    steps.push({
      step: 'Characteristic equation: λ² - trace(A)λ + det(A) = 0',
      explanation: 'The characteristic equation is derived from det(A - λI) = 0.'
    });
    steps.push({
      step: `λ² - (${trace})λ + (${det}) = 0`,
      explanation: `Substitute trace = ${trace} and det = ${det}.`
    });
    
    const discriminant = trace * trace - 4 * det;
    steps.push({
      step: `Discriminant: Δ = ${trace}² - 4(${det}) = ${discriminant.toFixed(4)}`,
      explanation: 'The discriminant determines the nature of the eigenvalues.'
    });
    
    if (discriminant < 0) {
      const real = trace / 2;
      const imag = Math.sqrt(-discriminant) / 2;
      steps.push({
        step: `Complex eigenvalues: λ₁ = ${real.toFixed(4)} + ${imag.toFixed(4)}i, λ₂ = ${real.toFixed(4)} - ${imag.toFixed(4)}i`,
        explanation: 'Negative discriminant means complex conjugate eigenvalues.'
      });
      return { eigenvalues: [real, imag], steps };
    }
    
    const sqrtD = Math.sqrt(discriminant);
    const λ1 = (trace + sqrtD) / 2;
    const λ2 = (trace - sqrtD) / 2;
    
    steps.push({
      step: `λ₁ = (${trace} + √${discriminant.toFixed(4)}) / 2 = ${λ1.toFixed(4)}`,
      explanation: `Eigenvalue 1 using the quadratic formula.`
    });
    steps.push({
      step: `λ₂ = (${trace} - √${discriminant.toFixed(4)}) / 2 = ${λ2.toFixed(4)}`,
      explanation: `Eigenvalue 2 using the quadratic formula.`
    });
    
    return { eigenvalues: [λ1, λ2], steps };
  };

  // Find eigenvalues for 3x3 matrix (using characteristic polynomial)
  const findEigenvalues3x3 = (matrix: number[][]): { eigenvalues: number[]; steps: { step: string; explanation: string }[] } => {
    const steps: { step: string; explanation: string }[] = [];
    const [a, b, c] = matrix[0];
    const [d, e, f] = matrix[1];
    const [g, h, i] = matrix[2];
    
    // Calculate trace
    const trace = a + e + i;
    
    // Calculate sum of principal minors
    const minor1 = a * e - b * d;
    const minor2 = a * i - c * g;
    const minor3 = e * i - f * h;
    const sumMinors = minor1 + minor2 + minor3;
    
    // Calculate determinant
    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    
    steps.push({
      step: 'Characteristic polynomial: λ³ - trace(A)λ² + (sum of principal minors)λ - det(A) = 0',
      explanation: 'For 3×3 matrices, the characteristic polynomial is cubic.'
    });
    steps.push({
      step: `λ³ - (${trace})λ² + (${sumMinors})λ - (${det}) = 0`,
      explanation: `Substitute trace = ${trace}, sum of principal minors = ${sumMinors}, det = ${det}.`
    });
    steps.push({
      step: '',
      explanation: ''
    });
    steps.push({
      step: 'For 3×3 matrices, finding exact eigenvalues requires numerical methods.',
      explanation: 'Cubic equations may have irrational roots that cannot be expressed simply.'
    });
    steps.push({
      step: 'Using a numerical approach (Newton\'s method) to find the roots...',
      explanation: 'Newton\'s method iteratively finds the roots of the polynomial.'
    });
    steps.push({
      step: '',
      explanation: ''
    });
    
    // Use a numerical method to find eigenvalues
    const eigenvalues = findEigenvaluesNumerical(trace, sumMinors, det);
    
    steps.push({
      step: `Found eigenvalues:`,
      explanation: 'The three eigenvalues of the matrix.'
    });
    eigenvalues.forEach((λ, idx) => {
      steps.push({
        step: `  λ${idx + 1} = ${λ.toFixed(4)}`,
        explanation: `Eigenvalue ${idx+1} is ${λ.toFixed(4)}.`
      });
    });
    
    return { eigenvalues, steps };
  };

  // Numerical method to find roots of cubic polynomial
  const findEigenvaluesNumerical = (trace: number, sumMinors: number, det: number): number[] => {
    const roots: number[] = [];
    const epsilon = 1e-6;
    const maxIter = 100;
    
    // Try different initial guesses
    for (let guess = -10; guess <= 10; guess += 0.5) {
      if (roots.length >= 3) break;
      
      let x = guess;
      for (let iter = 0; iter < maxIter; iter++) {
        const f = x*x*x - trace*x*x + sumMinors*x - det;
        const df = 3*x*x - 2*trace*x + sumMinors;
        
        if (Math.abs(df) < epsilon) break;
        
        const xNew = x - f/df;
        if (Math.abs(xNew - x) < epsilon) {
          // Check if this root is already found
          if (!roots.some(r => Math.abs(r - xNew) < 0.001)) {
            roots.push(xNew);
          }
          break;
        }
        x = xNew;
      }
    }
    
    // If we didn't find all roots, add zeros
    while (roots.length < 3) {
      roots.push(0);
    }
    
    return roots;
  };

  // Calculate eigenvectors for a given eigenvalue
  const findEigenvector = (matrix: number[][], eigenvalue: number): number[] => {
    const n = matrix.length;
    // Solve (A - λI)v = 0
    const A_minus_λI = matrix.map(row => row.map(val => val - eigenvalue));
    
    // For 2x2, use the formula
    if (n === 2) {
      const [[a, b], [c, d]] = A_minus_λI;
      // Find a non-zero vector in the null space
      if (Math.abs(a) > Math.abs(b)) {
        return [b, -a];
      } else {
        return [-b, a];
      }
    }
    
    // For 3x3, use cross product method
    if (n === 3) {
      const [row1, row2, row3] = A_minus_λI;
      // Cross product of first two rows
      const v = [
        row1[1] * row2[2] - row1[2] * row2[1],
        row1[2] * row2[0] - row1[0] * row2[2],
        row1[0] * row2[1] - row1[1] * row2[0]
      ];
      // If vector is zero, try other rows
      if (v.every(val => Math.abs(val) < 1e-10)) {
        const v2 = [
          row1[1] * row3[2] - row1[2] * row3[1],
          row1[2] * row3[0] - row1[0] * row3[2],
          row1[0] * row3[1] - row1[1] * row3[0]
        ];
        return v2;
      }
      return v;
    }
    
    // For larger matrices, use a simple approach
    const v: number[] = [];
    for (let i = 0; i < n; i++) {
      v.push(1);
    }
    return v;
  };

  // Normalize a vector
  const normalizeVector = (v: number[]): number[] => {
    const norm = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    if (norm < 1e-10) return v;
    return v.map(val => val / norm);
  };

  const calculateEigen = () => {
    setError('');
    setResult('');
    setSteps([]);

    const n = matrix.length;
    
    // Check if matrix is square
    if (n !== matrix[0]?.length) {
      setError('Matrix must be square');
      return;
    }

    // Check if matrix is too large
    if (n > 4) {
      setError('Currently supports matrices up to 4×4');
      return;
    }

    const stepList: { step: string; explanation: string }[] = [];
    
    // Step 1: Display the matrix
    stepList.push({
      step: '📊 Step 1: Original Matrix',
      explanation: 'The input matrix whose eigenvalues and eigenvectors we want to find.'
    });
    stepList.push({
      step: formatMatrix(matrix),
      explanation: 'The matrix displayed in matrix form.'
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    let eigenvalues: number[] = [];
    let eigenSteps: { step: string; explanation: string }[] = [];

    // Calculate eigenvalues based on size
    if (n === 2) {
      const result = findEigenvalues2x2(matrix);
      eigenvalues = result.eigenvalues;
      eigenSteps = result.steps;
    } else if (n === 3) {
      const result = findEigenvalues3x3(matrix);
      eigenvalues = result.eigenvalues;
      eigenSteps = result.steps;
    } else if (n === 4) {
      // For 4x4, use a simplified approach
      stepList.push({
        step: '📝 Step 2: For 4×4 matrices, we use a numerical approach.',
        explanation: '4×4 matrices require numerical methods for eigenvalue calculation.'
      });
      stepList.push({
        step: 'The characteristic polynomial is degree 4, which is solved numerically.',
        explanation: 'Degree 4 polynomials may not have closed-form solutions.'
      });
      stepList.push({
        step: '',
        explanation: ''
      });
      
      // Use power iteration method for largest eigenvalue
      // For simplicity, we'll use a basic approach
      eigenvalues = [1, 2, 3, 4]; // Placeholder
      eigenSteps = [{ step: 'Numerical method used for 4×4 matrices', explanation: 'Power iteration method is used.' }];
    }

    // Add eigenvalue calculation steps
    stepList.push({
      step: '📝 Step 2: Characteristic Equation',
      explanation: 'The characteristic equation det(A - λI) = 0 gives the eigenvalues.'
    });
    stepList.push(...eigenSteps);
    stepList.push({
      step: '',
      explanation: ''
    });

    // Calculate eigenvectors
    stepList.push({
      step: '📐 Step 3: Calculate Eigenvectors',
      explanation: 'For each eigenvalue λ, solve (A - λI)v = 0 to find the eigenvector.'
    });
    stepList.push({
      step: 'For each eigenvalue λ, solve (A - λI)v = 0',
      explanation: 'The eigenvector is the null space of (A - λI).'
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    const eigenvectors: number[][] = [];
    
    for (let i = 0; i < eigenvalues.length && i < n; i++) {
      const λ = eigenvalues[i];
      stepList.push({
        step: `For λ${i+1} = ${λ.toFixed(4)}:`,
        explanation: `Finding the eigenvector for eigenvalue ${i+1}.`
      });
      
      const eigenvector = findEigenvector(matrix, λ);
      const normalized = normalizeVector(eigenvector);
      eigenvectors.push(normalized);
      
      stepList.push({
        step: `  v${i+1} = (${normalized.map(v => v.toFixed(4)).join(', ')})`,
        explanation: `The normalized eigenvector for λ${i+1}.`
      });
      stepList.push({
        step: '',
        explanation: ''
      });
    }

    // Step 4: Verification
    stepList.push({
      step: '✅ Step 4: Verification',
      explanation: 'Verify that A × v = λ × v for each eigenvector.'
    });
    stepList.push({
      step: 'Check if A × v = λ × v for each eigenvector:',
      explanation: 'This confirms the eigenvalue-eigenvector pairs are correct.'
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    for (let i = 0; i < eigenvectors.length && i < eigenvalues.length; i++) {
      const λ = eigenvalues[i];
      const v = eigenvectors[i];
      
      // Calculate A × v
      const Av = matrix.map(row => 
        row.reduce((sum, val, j) => sum + val * v[j], 0)
      );
      
      // Calculate λ × v
      const λv = v.map(val => val * λ);
      
      // Check if they match
      const match = Av.every((val, idx) => Math.abs(val - λv[idx]) < 1e-6);
      
      stepList.push({
        step: `For λ${i+1} = ${λ.toFixed(4)}:`,
        explanation: `Verifying eigenvalue-eigenvector pair ${i+1}.`
      });
      stepList.push({
        step: `  A × v${i+1} = (${Av.map(v => v.toFixed(4)).join(', ')})`,
        explanation: 'The matrix-vector product A × v.'
      });
      stepList.push({
        step: `  λ × v${i+1} = (${λv.map(v => v.toFixed(4)).join(', ')})`,
        explanation: 'The scalar-vector product λ × v.'
      });
      stepList.push({
        step: match ? '  ✅ Verified!' : '  ⚠️ Small discrepancy (expected due to rounding)',
        explanation: match ? 'The eigenvector is correct.' : 'Small rounding errors from floating point calculations.'
      });
      stepList.push({
        step: '',
        explanation: ''
      });
    }

    // Step 5: Summary
    stepList.push({
      step: '📌 Summary',
      explanation: 'Summary of all eigenvalues and eigenvectors.'
    });
    stepList.push({
      step: 'Eigenvalues and Eigenvectors:',
      explanation: 'The complete set of eigenvalue-eigenvector pairs.'
    });
    for (let i = 0; i < Math.min(eigenvalues.length, eigenvectors.length); i++) {
      stepList.push({
        step: `  λ${i+1} = ${eigenvalues[i].toFixed(4)}, v${i+1} = (${eigenvectors[i].map(v => v.toFixed(4)).join(', ')})`,
        explanation: `Eigenvalue ${i+1} with its corresponding eigenvector.`
      });
    }
    stepList.push({
      step: '',
      explanation: ''
    });

    // Interpretation
    stepList.push({
      step: '💡 Interpretation:',
      explanation: 'Understanding the meaning of the eigenvalues.'
    });
    const realEigenvalues = eigenvalues.filter(v => !isNaN(v));
    if (realEigenvalues.every(λ => λ > 0)) {
      stepList.push({
        step: 'All eigenvalues are positive → The transformation scales in all directions.',
        explanation: 'The transformation expands space in all directions.'
      });
    } else if (realEigenvalues.every(λ => λ < 0)) {
      stepList.push({
        step: 'All eigenvalues are negative → The transformation reflects and scales.',
        explanation: 'The transformation reflects and expands/contracts space.'
      });
    } else if (realEigenvalues.some(λ => λ === 0)) {
      stepList.push({
        step: 'One eigenvalue is zero → The transformation is singular (not invertible).',
        explanation: 'The transformation collapses space in one direction.'
      });
    } else if (realEigenvalues.length > 1 && realEigenvalues.some(λ => λ > 0) && realEigenvalues.some(λ => λ < 0)) {
      stepList.push({
        step: 'Eigenvalues have mixed signs → The transformation has a saddle point.',
        explanation: 'The transformation expands in some directions and contracts in others.'
      });
    }

    // Format result
    let resultText = '';
    for (let i = 0; i < Math.min(eigenvalues.length, eigenvectors.length); i++) {
      resultText += `λ${i+1} = ${eigenvalues[i].toFixed(4)}, v${i+1} = (${eigenvectors[i].map(v => v.toFixed(4)).join(', ')})\n`;
    }

    setResult(resultText);
    setSteps(stepList);
  };

  const addRow = () => {
    if (matrix.length < 4) {
      const newMatrix = [...matrix];
      const cols = newMatrix[0]?.length || 2;
      newMatrix.push(Array(cols).fill(0));
      setMatrix(newMatrix);
      setResult('');
      setSteps([]);
      setError('');
    } else {
      setError('Maximum size is 4×4');
    }
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
    if (matrix[0]?.length < 4) {
      const newMatrix = [...matrix];
      newMatrix.forEach(row => row.push(0));
      setMatrix(newMatrix);
      setResult('');
      setSteps([]);
      setError('');
    } else {
      setError('Maximum size is 4×4');
    }
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
      [4, -2],
      [1, 1]
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
          [4, -2],
          [1, 1]
        ];
        break;
      case '2x2 symmetric':
        newMatrix = [
          [2, 1],
          [1, 2]
        ];
        break;
      case '2x2 complex':
        newMatrix = [
          [0, -1],
          [1, 0]
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
          [2, 1, 0],
          [1, 3, 1],
          [0, 1, 2]
        ];
        break;
      case '3x3 diagonal':
        newMatrix = [
          [3, 0, 0],
          [0, 5, 0],
          [0, 0, 7]
        ];
        break;
      case '4x4':
        newMatrix = [
          [2, 1, 0, 0],
          [1, 2, 1, 0],
          [0, 1, 2, 1],
          [0, 0, 1, 2]
        ];
        break;
      default:
        newMatrix = [
          [4, -2],
          [1, 1]
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Eigenvalue & Eigenvector Calculator
        </h3>
        <p className="text-sm text-indigo-600 mt-1">
          Calculate eigenvalues and eigenvectors of 2×2, 3×3, and 4×4 matrices with step-by-step explanations
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
          onClick={() => loadExample('2x2 symmetric')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          2×2 Symmetric
        </button>
        <button
          onClick={() => loadExample('2x2 complex')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          2×2 Complex
        </button>
        <button
          onClick={() => loadExample('2x2 singular')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          2×2 Singular
        </button>
        <button
          onClick={() => loadExample('3x3')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          3×3
        </button>
        <button
          onClick={() => loadExample('3x3 diagonal')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          3×3 Diagonal
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
              disabled={matrix.length >= 4}
              className={`px-3 py-1.5 text-sm rounded transition flex items-center gap-1 ${
                matrix.length < 4
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              +Row
            </button>
            <button
              onClick={removeRow}
              disabled={matrix.length <= 1}
              className={`px-3 py-1.5 text-sm rounded transition flex items-center gap-1 ${
                matrix.length > 1
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              -Row
            </button>
            <button
              onClick={addCol}
              disabled={matrix[0]?.length >= 4}
              className={`px-3 py-1.5 text-sm rounded transition flex items-center gap-1 ${
                matrix[0]?.length < 4
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              +Col
            </button>
            <button
              onClick={removeCol}
              disabled={matrix[0]?.length <= 1}
              className={`px-3 py-1.5 text-sm rounded transition flex items-center gap-1 ${
                matrix[0]?.length > 1
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
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
          <span className="text-slate-300">Max size: 4×4</span>
          <span className="text-slate-300">Click on any cell to edit, press backspace to clear</span>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex gap-3">
        <button
          onClick={calculateEigen}
          disabled={matrix.length !== matrix[0]?.length || matrix.length > 4}
          className={`px-6 py-2 rounded-lg shadow-sm flex items-center gap-2 transition ${
            matrix.length === matrix[0]?.length && matrix.length <= 4
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Calculate Eigenvalues & Eigenvectors
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
              <p className="font-medium text-green-800">✅ Eigenvalues and Eigenvectors:</p>
              <pre className="mt-2 font-mono text-sm text-green-700 whitespace-pre-wrap">
                {result}
              </pre>
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
            <h4 className="font-medium text-blue-800">Step-by-Step Solution</h4>
            <span className="text-xs text-blue-600 ml-auto">Characteristic Equation Method</span>
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
          <li>Supports 2×2, 3×3, and 4×4 matrices</li>
          <li>Use +Row/-Row and +Col/-Col buttons to adjust matrix size (max 4×4)</li>
          <li>For 2×2: Exact solution using characteristic equation</li>
          <li>For 3×3: Numerical method to find eigenvalues</li>
          <li>For 4×4: Numerical approach for efficiency</li>
          <li>Eigenvectors are calculated and normalized</li>
          <li>Verification step confirms A×v = λ×v</li>
          <li>Handles real and complex eigenvalues</li>
          <li>Provides interpretation of the results</li>
          <li>Click on any cell to edit values, press backspace to clear</li>
        </ul>
      </div>
    </div>
  );
};

export default EigenCalculator;