// components/SpanCalculator.tsx
import React, { useState } from 'react';

type Operation = 'span' | 'basis' | 'dimension' | 'independence';

const SpanCalculator: React.FC = () => {
  const [vectors, setVectors] = useState<number[][]>([
    [1, 0, 0],
    [0, 1, 0]
  ]);
  const [operation, setOperation] = useState<Operation>('span');
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<{ step: string; explanation: string }[]>([]);
  const [error, setError] = useState<string>('');
  const [showSteps, setShowSteps] = useState(false);

  // Format vector for display
  const formatVector = (v: number[]): string => {
    return `(${v.map(val => val.toFixed(4)).join(', ')})`;
  };

  // Format matrix for display
  const formatMatrix = (matrix: number[][]): string => {
    return matrix.map(row => `[${row.map(v => v.toFixed(4)).join(', ')}]`).join('\n');
  };

  // Check if a row is zero
  const isZeroRow = (row: number[]): boolean => {
    return row.every(val => Math.abs(val) < 1e-10);
  };

  // Perform Gaussian elimination to find row echelon form
  const gaussianElimination = (matrix: number[][]): { 
    rank: number; 
    steps: string[]; 
    stepExplanations: string[];
    reduced: number[][];
    pivotColumns: number[];
    basisIndices: number[];
  } => {
    const steps: string[] = [];
    const stepExplanations: string[] = [];
    const m = matrix.map(row => [...row]);
    const rows = m.length;
    const cols = m[0]?.length || 0;
    
    steps.push('Converting to Row Echelon Form:');
    stepExplanations.push('Gaussian elimination transforms the matrix to row echelon form.');
    steps.push(formatMatrix(m));
    stepExplanations.push('The initial matrix of vectors as rows.');
    steps.push('');
    stepExplanations.push('');

    let rank = 0;
    let row = 0;
    const pivotColumns: number[] = [];
    const basisIndices: number[] = [];

    for (let col = 0; col < cols && row < rows; col++) {
      // Find pivot
      let pivot = row;
      let maxVal = Math.abs(m[row][col]);
      for (let i = row + 1; i < rows; i++) {
        if (Math.abs(m[i][col]) > maxVal) {
          maxVal = Math.abs(m[i][col]);
          pivot = i;
        }
      }

      // Check if pivot is zero
      if (maxVal < 1e-10) {
        steps.push(`Column ${col + 1}: No pivot found (all zeros)`);
        stepExplanations.push(`No non-zero element found in column ${col + 1} below the current row.`);
        continue;
      }

      // Swap rows if needed
      if (pivot !== row) {
        [m[row], m[pivot]] = [m[pivot], m[row]];
        steps.push(`🔄 Swap Row ${row + 1} with Row ${pivot + 1}`);
        stepExplanations.push(`Swapping rows to get a non-zero pivot in column ${col + 1}.`);
        steps.push(formatMatrix(m));
        stepExplanations.push('The matrix after swapping rows.');
        steps.push('');
        stepExplanations.push('');
      }

      // Normalize pivot row
      const pivotVal = m[row][col];
      for (let j = col; j < cols; j++) {
        m[row][j] /= pivotVal;
      }
      steps.push(`➗ Normalize Row ${row + 1}`);
      stepExplanations.push(`Dividing the pivot row by ${pivotVal.toFixed(4)} to make the pivot 1.`);
      steps.push(formatMatrix(m));
      stepExplanations.push('The matrix after normalizing the pivot row.');
      steps.push('');
      stepExplanations.push('');

      // Eliminate below
      let eliminated = false;
      for (let i = row + 1; i < rows; i++) {
        const factor = m[i][col];
        if (Math.abs(factor) > 1e-10) {
          for (let j = col; j < cols; j++) {
            m[i][j] -= factor * m[row][j];
          }
          eliminated = true;
          steps.push(`➖ Row ${i + 1} = Row ${i + 1} - ${factor.toFixed(4)} × Row ${row + 1}`);
          stepExplanations.push(`Eliminating element in row ${i+1}, column ${col+1} using the pivot.`);
        }
      }
      if (eliminated) {
        steps.push(formatMatrix(m));
        stepExplanations.push('The matrix after eliminating below the pivot.');
        steps.push('');
        stepExplanations.push('');
      }

      // Eliminate above (for reduced row echelon form)
      for (let i = 0; i < row; i++) {
        const factor = m[i][col];
        if (Math.abs(factor) > 1e-10) {
          for (let j = col; j < cols; j++) {
            m[i][j] -= factor * m[row][j];
          }
          steps.push(`➖ Row ${i + 1} = Row ${i + 1} - ${factor.toFixed(4)} × Row ${row + 1}`);
          stepExplanations.push(`Eliminating above the pivot in row ${i+1}.`);
        }
      }

      pivotColumns.push(col);
      basisIndices.push(row);
      rank++;
      row++;
    }

    steps.push('✅ Row Reduced Echelon Form:');
    stepExplanations.push('The final reduced row echelon form of the matrix.');
    steps.push(formatMatrix(m));
    stepExplanations.push('The matrix in reduced row echelon form.');
    steps.push('');
    stepExplanations.push('');

    // Count zero rows
    let zeroRows = 0;
    for (let i = 0; i < rows; i++) {
      if (isZeroRow(m[i])) {
        zeroRows++;
      }
    }
    if (zeroRows > 0) {
      steps.push(`Found ${zeroRows} zero row(s)`);
      stepExplanations.push('Zero rows indicate linear dependence among the vectors.');
      steps.push('');
      stepExplanations.push('');
    }

    return { rank, steps, stepExplanations, reduced: m, pivotColumns, basisIndices };
  };

  // Check if vectors span the space
  const checkSpan = (vectors: number[][], dim: number): { spans: boolean; rank: number; steps: string[]; stepExplanations: string[] } => {
    const steps: string[] = [];
    const stepExplanations: string[] = [];
    const matrix = vectors.map(v => [...v]);
    const { rank, steps: gaussSteps, stepExplanations: gaussExplanations } = gaussianElimination(matrix);
    steps.push(...gaussSteps);
    stepExplanations.push(...gaussExplanations);
    
    const spans = rank === dim;
    return { spans, rank, steps, stepExplanations };
  };

  const performOperation = () => {
    setError('');
    setResult('');
    setSteps([]);

    try {
      // Validate vectors
      if (vectors.length === 0) {
        setError('Please add at least one vector');
        return;
      }

      const dim = vectors[0].length;
      
      // Check if all vectors have the same dimension
      for (let i = 1; i < vectors.length; i++) {
        if (vectors[i].length !== dim) {
          setError(`All vectors must have the same dimension. Vector ${i+1} has ${vectors[i].length}D but expected ${dim}D`);
          return;
        }
      }

      const stepList: { step: string; explanation: string }[] = [];
      let resultValue = '';

      switch (operation) {
        case 'span': {
          stepList.push({
            step: '📊 Input Vectors:',
            explanation: 'The vectors whose span we want to find.'
          });
          vectors.forEach((v, i) => {
            stepList.push({
              step: `v${i+1} = ${formatVector(v)}`,
              explanation: `Vector ${i+1} with ${v.length} components.`
            });
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: `Number of vectors: ${vectors.length}`,
            explanation: `We have ${vectors.length} vectors in the set.`
          });
          stepList.push({
            step: `Dimension of space: ${dim}D`,
            explanation: `The vectors live in a ${dim}-dimensional space.`
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          stepList.push({
            step: '📝 Checking if the vectors span the space',
            explanation: 'Vectors span the space if their rank equals the dimension of the space.'
          });
          stepList.push({
            step: 'Vectors span the space if their rank equals the dimension of the space',
            explanation: 'The rank is the number of linearly independent vectors in the set.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          const matrix = vectors.map(v => [...v]);
          const { rank, steps: gaussSteps, stepExplanations: gaussExplanations } = gaussianElimination(matrix);
          gaussSteps.forEach((step, idx) => {
            stepList.push({
              step: step,
              explanation: gaussExplanations[idx] || ''
            });
          });

          const spans = rank === dim;
          
          stepList.push({
            step: `📌 Rank = ${rank}`,
            explanation: `The rank of the vector set is ${rank}.`
          });
          stepList.push({
            step: `Dimension = ${dim}`,
            explanation: `The space has dimension ${dim}.`
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          // Find the span description
          stepList.push({
            step: '📐 Span Description:',
            explanation: 'Describing the subspace spanned by the vectors.'
          });
          if (spans) {
            stepList.push({
              step: `✅ The vectors span the entire space R^${dim}`,
              explanation: `The vectors generate the full ${dim}-dimensional space.`
            });
            stepList.push({
              step: `The span is the full ${dim}-dimensional space`,
              explanation: `Every vector in R^${dim} can be expressed as a linear combination of these vectors.`
            });
          } else {
            stepList.push({
              step: `⚠️ The vectors span a ${rank}-dimensional subspace of R^${dim}`,
              explanation: `The vectors generate a ${rank}-dimensional subspace, not the full space.`
            });
            stepList.push({
              step: `The span has ${dim - rank} fewer dimensions than the full space`,
              explanation: `The subspace is missing ${dim - rank} dimensions from the full space.`
            });
            
            // Describe the subspace
            stepList.push({
              step: '',
              explanation: ''
            });
            stepList.push({
              step: '📐 Subspace Description:',
              explanation: 'Visualizing the subspace.'
            });
            if (rank === 0) {
              stepList.push({
                step: 'The span is the zero vector space (dimension 0)',
                explanation: 'All vectors are zero.'
              });
            } else if (rank === 1) {
              stepList.push({
                step: 'The span is a line through the origin',
                explanation: 'All vectors lie on a single line passing through the origin.'
              });
            } else if (rank === 2) {
              stepList.push({
                step: 'The span is a plane through the origin',
                explanation: 'All vectors lie on a plane passing through the origin.'
              });
            } else if (rank === 3) {
              stepList.push({
                step: 'The span is a 3-dimensional subspace (hyperplane)',
                explanation: 'The vectors span a 3-dimensional subspace.'
              });
            } else {
              stepList.push({
                step: `The span is a ${rank}-dimensional subspace`,
                explanation: `The vectors span a ${rank}-dimensional subspace.`
              });
            }
          }

          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: '💡 What this means:',
            explanation: 'Understanding the implications of the span.'
          });
          if (spans) {
            stepList.push({
              step: '• Every vector in R^' + dim + ' can be written as a linear combination of the given vectors',
              explanation: `Any vector in R^${dim} can be expressed using these vectors.`
            });
            stepList.push({
              step: '• The vectors form a spanning set for the entire space',
              explanation: `The vectors are a spanning set for R^${dim}.`
            });
          } else {
            stepList.push({
              step: '• Only vectors in the ' + rank + '-dimensional subspace can be written as linear combinations',
              explanation: `Only vectors in the ${rank}-dimensional subspace can be represented.`
            });
            stepList.push({
              step: '• There exist vectors in R^' + dim + ' that cannot be represented',
              explanation: `Some vectors in R^${dim} are outside the span.`
            });
          }

          resultValue = spans 
            ? `✅ The vectors span R^${dim} (dimension ${rank})` 
            : `⚠️ The vectors span a ${rank}-dimensional subspace of R^${dim}`;
          break;
        }

        case 'basis': {
          stepList.push({
            step: '📊 Input Vectors:',
            explanation: 'The vectors we want to find a basis for.'
          });
          vectors.forEach((v, i) => {
            stepList.push({
              step: `v${i+1} = ${formatVector(v)}`,
              explanation: `Vector ${i+1} with ${v.length} components.`
            });
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          stepList.push({
            step: '📝 Finding a Basis for the Span',
            explanation: 'A basis is a set of linearly independent vectors that span the space.'
          });
          stepList.push({
            step: 'A basis is a set of linearly independent vectors that span the space.',
            explanation: 'The basis vectors are linearly independent and generate the entire span.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          const matrix = vectors.map(v => [...v]);
          const { rank, steps: gaussSteps, stepExplanations: gaussExplanations, basisIndices } = gaussianElimination(matrix);
          gaussSteps.forEach((step, idx) => {
            stepList.push({
              step: step,
              explanation: gaussExplanations[idx] || ''
            });
          });

          // Extract basis vectors
          const basisVectors = basisIndices.map(idx => vectors[idx]);
          
          stepList.push({
            step: `📌 Rank = ${rank}`,
            explanation: `The rank of the vector set is ${rank}.`
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          if (rank === 0) {
            stepList.push({
              step: '⚠️ The span is the zero vector space',
              explanation: 'The span contains only the zero vector.'
            });
            resultValue = 'Basis: The zero vector space (dimension 0)';
            break;
          }

          stepList.push({
            step: '✅ Basis Vectors:',
            explanation: 'The linearly independent vectors that form the basis.'
          });
          basisVectors.forEach((v, i) => {
            stepList.push({
              step: `  b${i+1} = ${formatVector(v)}`,
              explanation: `Basis vector ${i+1}.`
            });
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          if (rank === dim) {
            stepList.push({
              step: `🎉 The vectors form a basis for R^${dim}!`,
              explanation: `The vectors are linearly independent and span the full space.`
            });
            stepList.push({
              step: `Number of basis vectors (${rank}) = Dimension (${dim})`,
              explanation: `The basis has ${rank} vectors, equal to the dimension.`
            });
          } else {
            stepList.push({
              step: `⚠️ The vectors form a basis for a ${rank}-dimensional subspace of R^${dim}`,
              explanation: `The basis spans a ${rank}-dimensional subspace, not the full space.`
            });
            stepList.push({
              step: `Number of basis vectors (${rank}) < Dimension (${dim})`,
              explanation: `The basis has ${rank} vectors, less than the dimension.`
            });
          }

          resultValue = `Basis vectors:\n${basisVectors.map(v => formatVector(v)).join('\n')}`;
          break;
        }

        case 'dimension': {
          stepList.push({
            step: '📊 Input Vectors:',
            explanation: 'The vectors whose span dimension we want to find.'
          });
          vectors.forEach((v, i) => {
            stepList.push({
              step: `v${i+1} = ${formatVector(v)}`,
              explanation: `Vector ${i+1} with ${v.length} components.`
            });
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          stepList.push({
            step: '📐 Finding the Dimension of the Span',
            explanation: 'The dimension is the number of linearly independent vectors in the set.'
          });
          stepList.push({
            step: 'The dimension is the number of linearly independent vectors in the set',
            explanation: 'The dimension equals the rank of the matrix formed by the vectors.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          const matrix = vectors.map(v => [...v]);
          const { rank, steps: gaussSteps, stepExplanations: gaussExplanations } = gaussianElimination(matrix);
          gaussSteps.forEach((step, idx) => {
            stepList.push({
              step: step,
              explanation: gaussExplanations[idx] || ''
            });
          });

          stepList.push({
            step: `📌 Dimension = Rank = ${rank}`,
            explanation: `The dimension of the span is ${rank}.`
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          stepList.push({
            step: '📐 Subspace Description:',
            explanation: 'Visualizing the subspace based on its dimension.'
          });
          if (rank === 0) {
            stepList.push({
              step: 'The span is the zero vector space',
              explanation: 'The span contains only the zero vector.'
            });
          } else if (rank === 1) {
            stepList.push({
              step: 'The span is a line through the origin',
              explanation: 'All vectors lie on a single line.'
            });
          } else if (rank === 2) {
            stepList.push({
              step: 'The span is a plane through the origin',
              explanation: 'All vectors lie on a plane.'
            });
          } else if (rank === 3) {
            stepList.push({
              step: 'The span is a 3-dimensional subspace',
              explanation: 'The vectors span a 3D subspace.'
            });
          } else {
            stepList.push({
              step: `The span is a ${rank}-dimensional subspace`,
              explanation: `The vectors span a ${rank}-dimensional subspace.`
            });
          }
          
          if (rank === dim) {
            stepList.push({
              step: `✅ The span is the entire space R^${dim}`,
              explanation: `The vectors generate the full ${dim}-dimensional space.`
            });
          } else {
            stepList.push({
              step: `⚠️ The span is a proper subspace of R^${dim} (${dim - rank} dimensions less)`,
              explanation: `The span is a proper subspace missing ${dim - rank} dimensions.`
            });
          }

          resultValue = `Dimension of span = ${rank}`;
          break;
        }

        case 'independence': {
          stepList.push({
            step: '📊 Input Vectors:',
            explanation: 'The vectors we want to check for linear independence.'
          });
          vectors.forEach((v, i) => {
            stepList.push({
              step: `v${i+1} = ${formatVector(v)}`,
              explanation: `Vector ${i+1} with ${v.length} components.`
            });
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          stepList.push({
            step: '📝 Checking Linear Independence',
            explanation: 'A set of vectors is linearly independent if the only solution to c₁v₁ + ... + cₙvₙ = 0 is all coefficients zero.'
          });
          stepList.push({
            step: 'c₁v₁ + c₂v₂ + ... + cₙvₙ = 0 is c₁ = c₂ = ... = cₙ = 0',
            explanation: 'Linear independence means no vector can be expressed as a combination of others.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          const matrix = vectors.map(v => [...v]);
          const { rank, steps: gaussSteps, stepExplanations: gaussExplanations } = gaussianElimination(matrix);
          gaussSteps.forEach((step, idx) => {
            stepList.push({
              step: step,
              explanation: gaussExplanations[idx] || ''
            });
          });

          const independent = rank === vectors.length;
          
          stepList.push({
            step: `📌 Rank = ${rank}`,
            explanation: `The rank of the vector set is ${rank}.`
          });
          stepList.push({
            step: `Number of vectors = ${vectors.length}`,
            explanation: `There are ${vectors.length} vectors in the set.`
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          if (independent) {
            stepList.push({
              step: '✅ The vectors are linearly independent!',
              explanation: 'No vector can be written as a linear combination of the others.'
            });
            stepList.push({
              step: `Since the rank (${rank}) equals the number of vectors (${vectors.length})`,
              explanation: `The rank equals the number of vectors, meaning they are all independent.`
            });
            stepList.push({
              step: 'No vector can be written as a linear combination of the others',
              explanation: 'Each vector adds a new dimension to the span.'
            });
          } else {
            stepList.push({
              step: '❌ The vectors are linearly dependent!',
              explanation: 'At least one vector can be written as a combination of the others.'
            });
            stepList.push({
              step: `Since the rank (${rank}) is less than the number of vectors (${vectors.length})`,
              explanation: `The rank is less than the number of vectors, indicating dependence.`
            });
            stepList.push({
              step: `There is a redundancy of ${vectors.length - rank} vector(s)`,
              explanation: `${vectors.length - rank} vectors are redundant in the set.`
            });
          }

          resultValue = independent 
            ? '✅ The vectors are linearly independent' 
            : '❌ The vectors are linearly dependent';
          break;
        }

        default:
          throw new Error('Operation not supported');
      }

      setResult(resultValue);
      setSteps(stepList);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const addVector = () => {
    const dim = vectors[0]?.length || 3;
    setVectors([...vectors, Array(dim).fill(0)]);
    setResult('');
    setSteps([]);
    setError('');
  };

  const removeVector = () => {
    if (vectors.length > 1) {
      setVectors(vectors.slice(0, -1));
      setResult('');
      setSteps([]);
      setError('');
    }
  };

  const addDimension = () => {
    const newVectors = vectors.map(v => [...v, 0]);
    setVectors(newVectors);
    setResult('');
    setSteps([]);
    setError('');
  };

  const removeDimension = () => {
    if (vectors[0]?.length > 1) {
      const newVectors = vectors.map(v => v.slice(0, -1));
      setVectors(newVectors);
      setResult('');
      setSteps([]);
      setError('');
    }
  };

  const updateVector = (vecIndex: number, compIndex: number, value: string) => {
    const newVectors = [...vectors];
    const numValue = parseFloat(value);
    newVectors[vecIndex][compIndex] = isNaN(numValue) ? 0 : numValue;
    setVectors(newVectors);
    setResult('');
    setSteps([]);
    setError('');
  };

  const resetVectors = () => {
    setVectors([
      [1, 0, 0],
      [0, 1, 0]
    ]);
    setOperation('span');
    setResult('');
    setSteps([]);
    setError('');
  };

  const loadExample = (example: string) => {
    let newVectors: number[][];
    switch (example) {
      case 'line':
        newVectors = [
          [1, 0, 0]
        ];
        break;
      case 'plane':
        newVectors = [
          [1, 0, 0],
          [0, 1, 0]
        ];
        break;
      case 'space':
        newVectors = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ];
        break;
      case 'dependent':
        newVectors = [
          [1, 2, 3],
          [2, 4, 6],
          [3, 6, 9]
        ];
        break;
      case '2D_line':
        newVectors = [
          [1, 2]
        ];
        break;
      case '2D_plane':
        newVectors = [
          [1, 0],
          [0, 1]
        ];
        break;
      default:
        newVectors = [
          [1, 0, 0],
          [0, 1, 0]
        ];
    }
    setVectors(newVectors);
    setResult('');
    setSteps([]);
    setError('');
  };

  const getOperationDescription = (op: Operation): string => {
    const descriptions = {
      'span': 'Find the span and dimension of the vector set',
      'basis': 'Find a basis for the span of the vectors',
      'dimension': 'Find the dimension of the span',
      'independence': 'Check if the vectors are linearly independent'
    };
    return descriptions[op] || '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Span Calculator
        </h3>
        <p className="text-sm text-indigo-600 mt-1">
          Find the span, basis, dimension, and check independence of vector sets with step-by-step explanations
        </p>
      </div>

      {/* Operation Selection */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-slate-700">Operation:</span>
        <select
          value={operation}
          onChange={(e) => {
            setOperation(e.target.value as Operation);
            setResult('');
            setSteps([]);
            setError('');
          }}
          className="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
        >
          <option value="span">Span & Dimension</option>
          <option value="basis">Find Basis</option>
          <option value="dimension">Dimension Only</option>
          <option value="independence">Independence Check</option>
        </select>
        <span className="text-xs text-slate-400 ml-2">{getOperationDescription(operation)}</span>
      </div>

      {/* Quick Examples */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Load example:</span>
        <button
          onClick={() => loadExample('line')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Line (1D)
        </button>
        <button
          onClick={() => loadExample('plane')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Plane (2D)
        </button>
        <button
          onClick={() => loadExample('space')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Space (3D)
        </button>
        <button
          onClick={() => loadExample('dependent')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Dependent
        </button>
        <button
          onClick={() => loadExample('2D_line')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          2D Line
        </button>
        <button
          onClick={() => loadExample('2D_plane')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          2D Plane
        </button>
        <button
          onClick={resetVectors}
          className="px-3 py-1 text-xs border border-slate-300 hover:bg-slate-50 rounded transition"
        >
          Reset
        </button>
      </div>

      {/* Vector Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-700">
            Vectors ({vectors.length} vectors, {vectors[0]?.length || 0}D)
          </h4>
          <div className="flex gap-2">
            <button
              onClick={addVector}
              className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Vector
            </button>
            <button
              onClick={removeVector}
              disabled={vectors.length <= 1}
              className={`px-3 py-1.5 text-sm rounded transition flex items-center gap-1 ${
                vectors.length > 1
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Remove Vector
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="border-collapse border border-slate-300">
            <thead>
              <tr>
                <th className="border border-slate-300 px-2 py-1 bg-slate-50 text-xs text-slate-500">Vector</th>
                {vectors[0]?.map((_, j) => (
                  <th key={j} className="border border-slate-300 px-2 py-1 bg-slate-50 text-xs text-slate-500">
                    Dim {j + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vectors.map((vec, i) => (
                <tr key={i}>
                  <td className="border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 text-center">
                    v{i+1}
                  </td>
                  {vec.map((val, j) => (
                    <td key={j} className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => updateVector(i, j, e.target.value)}
                        className="w-14 h-10 px-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none rounded text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        step="any"
                        placeholder="0"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">{vectors.length} vectors, {vectors[0]?.length || 0}D</span>
          <div className="flex gap-2">
            <button
              onClick={addDimension}
              className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
            >
              + Add Dimension
            </button>
            <button
              onClick={removeDimension}
              disabled={vectors[0]?.length <= 1}
              className={`px-2 py-0.5 text-xs rounded transition ${
                vectors[0]?.length > 1
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              - Remove Dimension
            </button>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex gap-3">
        <button
          onClick={performOperation}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Calculate
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
          result.includes('✅') 
            ? 'bg-green-50 border-green-100' 
            : result.includes('⚠️') || result.includes('❌')
              ? 'bg-yellow-50 border-yellow-100'
              : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="flex items-start gap-3">
            {result.includes('✅') ? (
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : result.includes('⚠️') || result.includes('❌') ? (
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                result.includes('✅') ? 'text-green-800' : 
                result.includes('⚠️') || result.includes('❌') ? 'text-yellow-800' :
                'text-blue-800'
              }`}>
                {result}
              </p>
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
            <span className="text-xs text-blue-600 ml-auto">{operation.toUpperCase()}</span>
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
          Supported Operations:
        </p>
        <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-1">
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Span & Dimension</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Find Basis</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Dimension Only</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Independence Check</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Add or remove vectors to change the set. Add or remove dimensions to change the vector space.
          The calculator uses Gaussian elimination to determine the span and related properties.
        </p>
      </div>
    </div>
  );
};

export default SpanCalculator;