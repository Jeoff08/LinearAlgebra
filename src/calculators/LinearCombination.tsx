// components/LinearCombination.tsx
import React, { useState } from 'react';

type Operation = 'combination' | 'solve' | 'span' | 'independence';

const LinearCombination: React.FC = () => {
  const [vectors, setVectors] = useState<number[][]>([
    [1, 2],
    [3, 4]
  ]);
  const [scalars, setScalars] = useState<number[]>([2, 3]);
  const [targetVector, setTargetVector] = useState<number[]>([5, 7]);
  const [operation, setOperation] = useState<Operation>('combination');
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

  // Calculate linear combination
  const calculateCombination = (vectors: number[][], scalars: number[]): number[] => {
    const dims = vectors[0]?.length || 0;
    const resultVec = Array(dims).fill(0);
    for (let i = 0; i < vectors.length; i++) {
      for (let j = 0; j < dims; j++) {
        resultVec[j] += (vectors[i]?.[j] || 0) * (scalars[i] || 0);
      }
    }
    return resultVec;
  };

  // Perform Gaussian elimination
  const gaussianElimination = (matrix: number[][], augmented: boolean = false): { 
    rank: number; 
    steps: { step: string; explanation: string }[]; 
    reduced: number[][];
    solution?: number[];
  } => {
    const steps: { step: string; explanation: string }[] = [];
    const m = matrix.map(row => [...row]);
    const rows = m.length;
    const cols = m[0]?.length || 0;
    
    steps.push({
      step: 'Augmented Matrix:',
      explanation: 'The augmented matrix combines the coefficients with the right-hand side.'
    });
    steps.push({
      step: formatMatrix(m),
      explanation: 'The augmented matrix displayed in matrix form.'
    });
    steps.push({
      step: '',
      explanation: ''
    });

    let rank = 0;
    let row = 0;

    for (let col = 0; col < (augmented ? cols - 1 : cols) && row < rows; col++) {
      // Find pivot
      let pivot = row;
      let maxVal = Math.abs(m[row][col]);
      for (let i = row + 1; i < rows; i++) {
        if (Math.abs(m[i][col]) > maxVal) {
          maxVal = Math.abs(m[i][col]);
          pivot = i;
        }
      }

      if (maxVal < 1e-10) {
        steps.push({
          step: `Column ${col + 1}: No pivot found (all zeros)`,
          explanation: `No non-zero element found in column ${col + 1}.`
        });
        continue;
      }

      if (pivot !== row) {
        [m[row], m[pivot]] = [m[pivot], m[row]];
        steps.push({
          step: `🔄 Swap Row ${row + 1} with Row ${pivot + 1}`,
          explanation: `Swapping rows for numerical stability.`
        });
      }

      const pivotVal = m[row][col];
      for (let j = col; j < cols; j++) {
        m[row][j] /= pivotVal;
      }
      steps.push({
        step: `➗ Normalize Row ${row + 1}`,
        explanation: `Dividing row ${row+1} by the pivot value to make it 1.`
      });
      steps.push({
        step: formatMatrix(m),
        explanation: 'The matrix after normalizing the pivot row.'
      });
      steps.push({
        step: '',
        explanation: ''
      });

      let eliminated = false;
      for (let i = 0; i < rows; i++) {
        if (i !== row) {
          const factor = m[i][col];
          if (Math.abs(factor) > 1e-10) {
            for (let j = col; j < cols; j++) {
              m[i][j] -= factor * m[row][j];
            }
            eliminated = true;
            steps.push({
              step: `➖ Row ${i + 1} = Row ${i + 1} - ${factor.toFixed(4)} × Row ${row + 1}`,
              explanation: `Eliminating element in row ${i+1}, column ${col+1}.`
            });
          }
        }
      }
      if (eliminated) {
        steps.push({
          step: formatMatrix(m),
          explanation: 'The matrix after elimination.'
        });
        steps.push({
          step: '',
          explanation: ''
        });
      }

      rank++;
      row++;
    }

    // Extract solution if augmented
    let solution: number[] | undefined;
    if (augmented && rank === rows && rank === cols - 1) {
      solution = m.map(row => row[cols - 1]);
    }

    steps.push({
      step: '✅ Row Reduced Echelon Form:',
      explanation: 'The final reduced row echelon form of the matrix.'
    });
    steps.push({
      step: formatMatrix(m),
      explanation: 'The complete reduced row echelon form.'
    });
    steps.push({
      step: '',
      explanation: ''
    });

    return { rank, steps, reduced: m, solution };
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

      // Check if scalars match vectors
      if (scalars.length !== vectors.length) {
        setError(`Number of scalars (${scalars.length}) must match number of vectors (${vectors.length})`);
        return;
      }

      const stepList: { step: string; explanation: string }[] = [];
      let resultValue = '';

      switch (operation) {
        case 'combination': {
          stepList.push({
            step: '📊 Input Vectors and Scalars:',
            explanation: 'The vectors and their corresponding scalars for the linear combination.'
          });
          vectors.forEach((v, i) => {
            stepList.push({
              step: `v${i+1} = ${formatVector(v)},  c${i+1} = ${scalars[i].toFixed(4)}`,
              explanation: `Vector ${i+1} multiplied by scalar ${scalars[i].toFixed(4)}.`
            });
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          stepList.push({
            step: '📐 Linear Combination:',
            explanation: 'A linear combination is the sum of scalar multiples of vectors.'
          });
          stepList.push({
            step: 'c₁v₁ + c₂v₂ + ... + cₙvₙ',
            explanation: 'The general form of a linear combination.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          // Show each term
          vectors.forEach((v, i) => {
            const scalar = scalars[i];
            const term = v.map(val => val * scalar);
            stepList.push({
              step: `c${i+1} × v${i+1} = ${scalar.toFixed(4)} × ${formatVector(v)} = ${formatVector(term)}`,
              explanation: `Multiplying vector ${i+1} by scalar ${scalar.toFixed(4)}.`
            });
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          // Calculate result
          const resultVec = calculateCombination(vectors, scalars);
          
          stepList.push({
            step: 'Summing all terms:',
            explanation: 'Adding all the scaled vectors together.'
          });
          stepList.push({
            step: `Result = ${formatVector(resultVec)}`,
            explanation: 'The final linear combination result.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          stepList.push({
            step: '✅ Final Result:',
            explanation: 'The complete linear combination expression.'
          });
          stepList.push({
            step: `${vectors.map((_, i) => `${scalars[i].toFixed(4)}v${i+1}`).join(' + ')} = ${formatVector(resultVec)}`,
            explanation: 'The linear combination expressed in vector form.'
          });
          
          resultValue = `Result: ${formatVector(resultVec)}`;
          break;
        }

        case 'solve': {
          stepList.push({
            step: '📊 Problem: Find scalars c₁, c₂, ... such that:',
            explanation: 'We want to express the target vector as a linear combination of the given vectors.'
          });
          stepList.push({
            step: 'c₁v₁ + c₂v₂ + ... = w',
            explanation: 'Find coefficients c₁, c₂, ... that satisfy this equation.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: 'Vectors:',
            explanation: 'The input vectors.'
          });
          vectors.forEach((v, i) => {
            stepList.push({
              step: `v${i+1} = ${formatVector(v)}`,
              explanation: `Vector ${i+1}.`
            });
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: `Target vector w = ${formatVector(targetVector)}`,
            explanation: 'The vector we want to represent as a linear combination.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          // Build augmented matrix
          const augmentedMatrix = vectors.map((v, i) => {
            const row = [...v];
            // Add target vector as the last column
            if (i < targetVector.length) {
              row.push(targetVector[i]);
            } else {
              row.push(0);
            }
            return row;
          });

          const { rank, steps: gaussSteps, solution } = gaussianElimination(augmentedMatrix, true);
          stepList.push(...gaussSteps);

          stepList.push({
            step: `📌 Rank = ${rank}`,
            explanation: `The rank of the augmented matrix is ${rank}.`
          });
          stepList.push({
            step: `Number of vectors = ${vectors.length}`,
            explanation: `There are ${vectors.length} vectors in the set.`
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          if (solution && rank === vectors.length) {
            stepList.push({
              step: '✅ Unique solution exists!',
              explanation: 'The system has a unique solution.'
            });
            stepList.push({
              step: 'The scalars are:',
              explanation: 'The coefficients that express w as a linear combination of the vectors.'
            });
            solution.forEach((val, i) => {
              stepList.push({
                step: `  c${i+1} = ${val.toFixed(4)}`,
                explanation: `Coefficient ${i+1} is ${val.toFixed(4)}.`
              });
            });
            stepList.push({
              step: '',
              explanation: ''
            });
            stepList.push({
              step: 'Verification:',
              explanation: 'Verify the solution by plugging the coefficients back in.'
            });
            const check = calculateCombination(vectors, solution);
            stepList.push({
              step: `${solution.map((c, i) => `${c.toFixed(4)}v${i+1}`).join(' + ')} = ${formatVector(check)}`,
              explanation: 'The linear combination result.'
            });
            stepList.push({
              step: `Target w = ${formatVector(targetVector)}`,
              explanation: 'The target vector.'
            });
            stepList.push({
              step: '✅ Verified!',
              explanation: 'The solution is correct.'
            });
            
            resultValue = `Solution: ${solution.map((c, i) => `c${i+1}=${c.toFixed(4)}`).join(', ')}`;
          } else if (rank < vectors.length) {
            stepList.push({
              step: '⚠️ Infinite solutions exist (system is underdetermined)',
              explanation: 'There are infinitely many ways to express w as a linear combination.'
            });
            stepList.push({
              step: `Rank (${rank}) < Number of vectors (${vectors.length})`,
              explanation: 'The system is underdetermined with free variables.'
            });
            stepList.push({
              step: 'There are free variables in the solution',
              explanation: 'Additional degrees of freedom in the solution.'
            });
            resultValue = 'Infinite solutions exist';
          } else if (rank < augmentedMatrix[0].length - 1) {
            stepList.push({
              step: '❌ No solution exists (system is inconsistent)',
              explanation: 'The target vector cannot be expressed as a linear combination.'
            });
            stepList.push({
              step: `Rank (${rank}) < Number of variables (${augmentedMatrix[0].length - 1})`,
              explanation: 'The system is inconsistent.'
            });
            resultValue = 'No solution exists';
          } else {
            stepList.push({
              step: '❌ No solution exists',
              explanation: 'The system has no solution.'
            });
            resultValue = 'No solution exists';
          }
          break;
        }

        case 'span': {
          stepList.push({
            step: '📊 Checking if vectors span the space:',
            explanation: 'Vectors span the space if their linear combinations can reach every vector in the space.'
          });
          vectors.forEach((v, i) => {
            stepList.push({
              step: `v${i+1} = ${formatVector(v)}`,
              explanation: `Vector ${i+1}.`
            });
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          const matrix = vectors.map(v => [...v]);
          const { rank, steps: gaussSteps } = gaussianElimination(matrix);
          stepList.push(...gaussSteps);

          const spans = rank === dim;
          
          stepList.push({
            step: `📌 Rank = ${rank}, Dimension = ${dim}`,
            explanation: `The rank is ${rank} and the space dimension is ${dim}.`
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          if (spans) {
            stepList.push({
              step: '✅ The vectors span the entire space R^' + dim,
              explanation: `The vectors generate the full ${dim}-dimensional space.`
            });
            stepList.push({
              step: `The rank (${rank}) equals the dimension (${dim})`,
              explanation: 'The vectors are sufficient to reach every vector in the space.'
            });
          } else {
            stepList.push({
              step: '❌ The vectors do not span the entire space R^' + dim,
              explanation: `The vectors only generate a ${rank}-dimensional subspace.`
            });
            stepList.push({
              step: `The rank (${rank}) is less than the dimension (${dim})`,
              explanation: 'Some vectors in the space cannot be reached.'
            });
            stepList.push({
              step: `The vectors only span a ${rank}-dimensional subspace`,
              explanation: `The span is a ${rank}-dimensional subspace of R^${dim}.`
            });
          }

          resultValue = spans 
            ? '✅ The vectors span the space' 
            : '❌ The vectors do not span the space';
          break;
        }

        case 'independence': {
          stepList.push({
            step: '📊 Checking linear independence:',
            explanation: 'Vectors are linearly independent if no vector can be expressed as a combination of the others.'
          });
          vectors.forEach((v, i) => {
            stepList.push({
              step: `v${i+1} = ${formatVector(v)}`,
              explanation: `Vector ${i+1}.`
            });
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          const matrix = vectors.map(v => [...v]);
          const { rank, steps: gaussSteps } = gaussianElimination(matrix);
          stepList.push(...gaussSteps);

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
              explanation: 'No vector is redundant.'
            });
            stepList.push({
              step: `Since the rank (${rank}) equals the number of vectors (${vectors.length})`,
              explanation: 'All vectors contribute new directions.'
            });
          } else {
            stepList.push({
              step: '❌ The vectors are linearly dependent!',
              explanation: 'At least one vector is redundant.'
            });
            stepList.push({
              step: `Since the rank (${rank}) is less than the number of vectors (${vectors.length})`,
              explanation: 'Some vectors can be expressed as combinations of others.'
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
    const dim = vectors[0]?.length || 2;
    setVectors([...vectors, Array(dim).fill(0)]);
    setScalars([...scalars, 0]);
    setResult('');
    setSteps([]);
    setError('');
  };

  const removeVector = () => {
    if (vectors.length > 1) {
      setVectors(vectors.slice(0, -1));
      setScalars(scalars.slice(0, -1));
      setResult('');
      setSteps([]);
      setError('');
    }
  };

  const addDimension = () => {
    const newVectors = vectors.map(v => [...v, 0]);
    setVectors(newVectors);
    setTargetVector([...targetVector, 0]);
    setResult('');
    setSteps([]);
    setError('');
  };

  const removeDimension = () => {
    if (vectors[0]?.length > 1) {
      const newVectors = vectors.map(v => v.slice(0, -1));
      setVectors(newVectors);
      setTargetVector(targetVector.slice(0, -1));
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

  const updateScalar = (index: number, value: string) => {
    const newScalars = [...scalars];
    const numValue = parseFloat(value);
    newScalars[index] = isNaN(numValue) ? 0 : numValue;
    setScalars(newScalars);
    setResult('');
    setSteps([]);
    setError('');
  };

  const updateTarget = (index: number, value: string) => {
    const newTarget = [...targetVector];
    const numValue = parseFloat(value);
    newTarget[index] = isNaN(numValue) ? 0 : numValue;
    setTargetVector(newTarget);
    setResult('');
    setSteps([]);
    setError('');
  };

  const resetAll = () => {
    setVectors([
      [1, 2],
      [3, 4]
    ]);
    setScalars([2, 3]);
    setTargetVector([5, 7]);
    setOperation('combination');
    setResult('');
    setSteps([]);
    setError('');
  };

  const loadExample = (example: string) => {
    let v: number[][], s: number[], t: number[];
    switch (example) {
      case 'simple':
        v = [
          [1, 2],
          [3, 4]
        ];
        s = [2, 3];
        t = [5, 7];
        break;
      case '3D':
        v = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ];
        s = [2, -1, 3];
        t = [2, -1, 3];
        break;
      case 'dependent':
        v = [
          [1, 2, 3],
          [2, 4, 6],
          [3, 6, 9]
        ];
        s = [1, 1, 1];
        t = [6, 12, 18];
        break;
      case 'overdetermined':
        v = [
          [1, 0],
          [0, 1],
          [1, 1]
        ];
        s = [2, 3, 1];
        t = [5, 7];
        break;
      case 'solve':
        v = [
          [1, 2],
          [3, 4]
        ];
        s = [0, 0];
        t = [5, 7];
        break;
      default:
        v = [
          [1, 2],
          [3, 4]
        ];
        s = [2, 3];
        t = [5, 7];
    }
    setVectors(v);
    setScalars(s);
    setTargetVector(t);
    setResult('');
    setSteps([]);
    setError('');
  };

  const getOperationDescription = (op: Operation): string => {
    const descriptions = {
      'combination': 'Calculate a linear combination of vectors with given scalars',
      'solve': 'Find scalars to express a target vector as a linear combination',
      'span': 'Check if the vectors span the entire space',
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
          Linear Combination Calculator
        </h3>
        <p className="text-sm text-indigo-600 mt-1">
          Calculate linear combinations, solve for coefficients, check spanning and independence with step-by-step explanations
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
          <option value="combination">Linear Combination</option>
          <option value="solve">Solve for Scalars</option>
          <option value="span">Span Check</option>
          <option value="independence">Independence Check</option>
        </select>
        <span className="text-xs text-slate-400 ml-2">{getOperationDescription(operation)}</span>
      </div>

      {/* Quick Examples */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Load example:</span>
        <button
          onClick={() => loadExample('simple')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          2D Simple
        </button>
        <button
          onClick={() => loadExample('3D')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          3D
        </button>
        <button
          onClick={() => loadExample('dependent')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Dependent
        </button>
        <button
          onClick={() => loadExample('overdetermined')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Overdetermined
        </button>
        <button
          onClick={() => loadExample('solve')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Solve
        </button>
        <button
          onClick={resetAll}
          className="px-3 py-1 text-xs border border-slate-300 hover:bg-slate-50 rounded transition"
        >
          Reset
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        {/* Vectors and Scalars */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-700">
              Vectors and Scalars ({vectors.length} vectors, {vectors[0]?.length || 0}D)
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
                  <th className="border border-slate-300 px-2 py-1 bg-slate-50 text-xs text-slate-500">Scalar</th>
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
                    <td className="border border-slate-300 p-0.5">
                      <input
                        type="number"
                        value={scalars[i] || 0}
                        onChange={(e) => updateScalar(i, e.target.value)}
                        className="w-14 h-10 px-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none rounded text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        step="any"
                        placeholder="0"
                      />
                    </td>
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

        {/* Target Vector (for solve operation) */}
        {operation === 'solve' && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700">Target Vector w ({targetVector.length}D)</h4>
            <div className="flex gap-2 flex-wrap">
              {targetVector.map((val, i) => (
                <input
                  key={i}
                  type="number"
                  value={val}
                  onChange={(e) => updateTarget(i, e.target.value)}
                  className="w-14 h-10 px-1 text-center border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  step="any"
                  placeholder="0"
                />
              ))}
              <span className="text-xs text-slate-400 self-center">w = {formatVector(targetVector)}</span>
            </div>
          </div>
        )}
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
            : result.includes('❌') || result.includes('No solution') || result.includes('Infinite')
              ? 'bg-yellow-50 border-yellow-100'
              : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="flex items-start gap-3">
            {result.includes('✅') ? (
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : result.includes('❌') || result.includes('No solution') || result.includes('Infinite') ? (
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
                result.includes('❌') || result.includes('No solution') || result.includes('Infinite') ? 'text-yellow-800' :
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
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Linear Combination</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Solve for Scalars</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Span Check</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Independence Check</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Add or remove vectors to change the set. Add or remove dimensions to change the vector space.
          For "Solve for Scalars", provide a target vector to find the linear combination coefficients.
        </p>
      </div>
    </div>
  );
};

export default LinearCombination;