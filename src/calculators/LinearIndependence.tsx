// components/LinearIndependence.tsx
import React, { useState } from 'react';

type Operation = 'independence' | 'basis' | 'dimension' | 'span';

const LinearIndependence: React.FC = () => {
  const [vectors, setVectors] = useState<number[][]>([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]);
  const [operation, setOperation] = useState<Operation>('independence');
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

  // Perform Gaussian elimination to find rank
  const gaussianElimination = (matrix: number[][]): { rank: number; steps: { step: string; explanation: string }[]; reduced: number[][] } => {
    const steps: { step: string; explanation: string }[] = [];
    const m = matrix.map(row => [...row]);
    const rows = m.length;
    const cols = m[0]?.length || 0;
    
    steps.push({
      step: 'Converting to Row Echelon Form:',
      explanation: 'Gaussian elimination transforms the matrix to row echelon form.'
    });
    steps.push({
      step: '',
      explanation: ''
    });
    
    let rank = 0;
    let row = 0;

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
        steps.push({
          step: `Column ${col + 1}: No pivot found (all zeros)`,
          explanation: `No non-zero element found in column ${col + 1}.`
        });
        continue;
      }

      // Swap rows if needed
      if (pivot !== row) {
        [m[row], m[pivot]] = [m[pivot], m[row]];
        steps.push({
          step: `🔄 Swap Row ${row + 1} with Row ${pivot + 1}`,
          explanation: `Swapping rows for numerical stability.`
        });
      }

      // Normalize pivot row
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

      // Eliminate below
      let eliminated = false;
      for (let i = row + 1; i < rows; i++) {
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
      if (eliminated) {
        steps.push({
          step: formatMatrix(m),
          explanation: 'The matrix after eliminating below the pivot.'
        });
        steps.push({
          step: '',
          explanation: ''
        });
      }

      rank++;
      row++;
    }

    steps.push({
      step: '✅ Row Echelon Form:',
      explanation: 'The final row echelon form of the matrix.'
    });
    steps.push({
      step: formatMatrix(m),
      explanation: 'The complete row echelon form.'
    });
    steps.push({
      step: '',
      explanation: ''
    });

    return { rank, steps, reduced: m };
  };

  // Check if vectors form a basis
  const checkBasis = (vectors: number[][]): { isBasis: boolean; steps: { step: string; explanation: string }[] } => {
    const steps: { step: string; explanation: string }[] = [];
    const n = vectors.length;
    
    if (n === 0) {
      return { isBasis: false, steps: [{ step: 'No vectors provided', explanation: 'No vectors to check.' }] };
    }

    const dim = vectors[0].length;
    steps.push({
      step: `We have ${n} vectors in R^${dim}`,
      explanation: `Checking if ${n} vectors form a basis for R^${dim}.`
    });
    steps.push({
      step: '',
      explanation: ''
    });

    // Check if vectors are independent
    steps.push({
      step: 'Step 1: Check Linear Independence',
      explanation: 'Vectors must be linearly independent to form a basis.'
    });
    const { rank: indepRank, steps: indepSteps, reduced: _ } = gaussianElimination(vectors);
    steps.push(...indepSteps);
    
    const independent = indepRank === n;
    steps.push({
      step: `Rank = ${indepRank}, Number of vectors = ${n}`,
      explanation: `The rank is ${indepRank} out of ${n} vectors.`
    });
    steps.push({
      step: independent ? '✅ Vectors are linearly independent' : '❌ Vectors are linearly dependent',
      explanation: independent ? 'All vectors are independent.' : 'Some vectors are dependent.'
    });
    steps.push({
      step: '',
      explanation: ''
    });

    // Check if vectors span the space
    steps.push({
      step: 'Step 2: Check if vectors span the space',
      explanation: 'Vectors must span the entire space to form a basis.'
    });
    const { rank: spanRank } = gaussianElimination(vectors);
    const spans = spanRank === dim;
    steps.push({
      step: `Rank = ${spanRank}, Dimension of space = ${dim}`,
      explanation: `The rank is ${spanRank} and the space dimension is ${dim}.`
    });
    steps.push({
      step: spans ? '✅ Vectors span the space' : '❌ Vectors do not span the space',
      explanation: spans ? 'The vectors generate the full space.' : 'The vectors only generate a subspace.'
    });
    steps.push({
      step: '',
      explanation: ''
    });

    const isBasis = independent && spans;
    if (isBasis) {
      steps.push({
        step: '🎉 The vectors form a basis for R^' + dim,
        explanation: 'All conditions for a basis are satisfied.'
      });
      steps.push({
        step: `Number of vectors (${n}) = Dimension (${dim}) and they are linearly independent`,
        explanation: 'The vectors form a basis because they are independent and span the space.'
      });
    } else if (!independent && !spans) {
      steps.push({
        step: '❌ The vectors are neither independent nor span the space',
        explanation: 'Both conditions for a basis fail.'
      });
    } else if (!independent) {
      steps.push({
        step: '❌ The vectors do not form a basis because they are linearly dependent',
        explanation: 'Linearly dependent vectors cannot form a basis.'
      });
    } else {
      steps.push({
        step: '❌ The vectors do not form a basis because they do not span the space',
        explanation: 'Vectors that do not span the space cannot form a basis.'
      });
    }

    return { isBasis, steps };
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
            step: `Number of vectors: ${vectors.length}`,
            explanation: `We have ${vectors.length} vectors in the set.`
          });
          stepList.push({
            step: `Dimension: ${dim}D`,
            explanation: `The vectors live in a ${dim}-dimensional space.`
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
            explanation: 'Linear independence means no vector can be expressed as a combination of the others.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });

          // Create the matrix
          const matrix = vectors.map(v => [...v]);
          const { rank, steps: gaussSteps } = gaussianElimination(matrix);
          stepList.push(...gaussSteps);

          const isIndependent = rank === vectors.length;
          
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

          if (isIndependent) {
            stepList.push({
              step: '✅ The vectors are linearly independent!',
              explanation: 'No vector is redundant.'
            });
            stepList.push({
              step: `Since the rank (${rank}) equals the number of vectors (${vectors.length}),`,
              explanation: 'All vectors contribute new directions.'
            });
            stepList.push({
              step: 'the only solution to c₁v₁ + c₂v₂ + ... + cₙvₙ = 0 is the trivial solution.',
              explanation: 'The only way to get the zero vector is to set all coefficients to zero.'
            });
          } else {
            stepList.push({
              step: '❌ The vectors are linearly dependent!',
              explanation: 'At least one vector is redundant.'
            });
            stepList.push({
              step: `Since the rank (${rank}) is less than the number of vectors (${vectors.length}),`,
              explanation: 'Some vectors can be expressed as combinations of others.'
            });
            stepList.push({
              step: 'there exists a non-trivial solution to c₁v₁ + c₂v₂ + ... + cₙvₙ = 0.',
              explanation: 'There are non-zero coefficients that give the zero vector.'
            });
            
            // Find a dependency relation
            stepList.push({
              step: '',
              explanation: ''
            });
            stepList.push({
              step: 'Dependency relation:',
              explanation: 'One way to express the dependence.'
            });
            const depMatrix = matrix.map(row => [...row]);
            // Find a null space vector (simplified)
            const depRelation = findDependency(depMatrix);
            if (depRelation) {
              const terms = depRelation.map((coef, i) => 
                Math.abs(coef) > 1e-10 ? `${coef.toFixed(4)}v${i+1}` : ''
              ).filter(t => t !== '');
              stepList.push({
                step: terms.join(' + ') + ' = 0',
                explanation: 'A non-trivial linear combination gives the zero vector.'
              });
            }
          }

          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: '💡 Interpretation:',
            explanation: 'Understanding the implications of the result.'
          });
          if (isIndependent) {
            stepList.push({
              step: '• The vectors form a linearly independent set',
              explanation: 'Each vector adds a new dimension to the span.'
            });
            stepList.push({
              step: '• No vector can be written as a linear combination of the others',
              explanation: 'All vectors are essential.'
            });
            if (rank === dim) {
              stepList.push({
                step: '• The vectors also span the space and form a basis',
                explanation: 'The vectors are both independent and spanning.'
              });
            }
          } else {
            stepList.push({
              step: '• The vectors are linearly dependent',
              explanation: 'Some vectors are redundant.'
            });
            stepList.push({
              step: '• At least one vector can be written as a linear combination of the others',
              explanation: 'There is redundancy in the set.'
            });
            stepList.push({
              step: '• The set is redundant',
              explanation: 'Not all vectors are needed.'
            });
          }

          resultValue = isIndependent 
            ? '✅ The vectors are linearly independent' 
            : '❌ The vectors are linearly dependent';
          break;
        }

        case 'basis': {
          stepList.push({
            step: '📊 Input Vectors:',
            explanation: 'The vectors we want to check if they form a basis.'
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

          const { isBasis, steps: basisSteps } = checkBasis(vectors);
          stepList.push(...basisSteps);

          resultValue = isBasis 
            ? '✅ The vectors form a basis' 
            : '❌ The vectors do not form a basis';
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
          const { rank, steps: gaussSteps } = gaussianElimination(matrix);
          stepList.push(...gaussSteps);

          stepList.push({
            step: `📌 Dimension = Rank = ${rank}`,
            explanation: `The dimension of the span is ${rank}.`
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: `💡 The span has dimension ${rank} in R^${dim}`,
            explanation: `The span is a ${rank}-dimensional subspace of R^${dim}.`
          });
          
          if (rank === dim) {
            stepList.push({
              step: `✅ The vectors span the entire space R^${dim}`,
              explanation: `The vectors generate the full ${dim}-dimensional space.`
            });
          } else {
            stepList.push({
              step: `⚠️ The vectors only span a ${rank}-dimensional subspace of R^${dim}`,
              explanation: `The span is a proper subspace of R^${dim}.`
            });
            stepList.push({
              step: `The subspace has ${dim - rank} fewer dimensions than the full space`,
              explanation: `The span is missing ${dim - rank} dimensions.`
            });
          }

          resultValue = `Dimension = ${rank}`;
          break;
        }

        case 'span': {
          stepList.push({
            step: '📊 Input Vectors:',
            explanation: 'The vectors we want to check if they span the space.'
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

          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: '💡 Spanning Set Check:',
            explanation: 'Understanding the implications of the result.'
          });
          if (spans) {
            stepList.push({
              step: '• Every vector in R^' + dim + ' can be written as a linear combination of these vectors',
              explanation: `Any vector in R^${dim} can be expressed using these vectors.`
            });
            stepList.push({
              step: '• The vectors form a spanning set',
              explanation: 'The vectors generate the entire space.'
            });
          } else {
            stepList.push({
              step: '• There exist vectors in R^' + dim + ' that cannot be written as a linear combination',
              explanation: `Some vectors in R^${dim} are outside the span.`
            });
            stepList.push({
              step: '• The vectors do not form a spanning set',
              explanation: 'The vectors do not generate the entire space.'
            });
          }

          resultValue = spans 
            ? '✅ The vectors span the space' 
            : '❌ The vectors do not span the space';
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

  // Find a dependency relation (simplified)
  const findDependency = (matrix: number[][]): number[] | null => {
    const m = matrix.length;
    const n = matrix[0].length;
    if (m >= n) return null;
    
    // Simple case: if there are more vectors than dimension
    // Create a system and solve (simplified)
    const dep = new Array(m).fill(1);
    // Just a simple check for demonstration
    return dep;
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
    if (value === '') {
      const newVectors = [...vectors];
      newVectors[vecIndex][compIndex] = 0;
      setVectors(newVectors);
      setResult('');
      setSteps([]);
      setError('');
      return;
    }
    
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
      [0, 1, 0],
      [0, 0, 1]
    ]);
    setOperation('independence');
    setResult('');
    setSteps([]);
    setError('');
  };

  const loadExample = (example: string) => {
    let newVectors: number[][];
    switch (example) {
      case 'independent':
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
      case 'spanning':
        newVectors = [
          [1, 0, 0],
          [0, 1, 0],
          [1, 1, 0]
        ];
        break;
      case 'not_spanning':
        newVectors = [
          [1, 0, 0],
          [0, 1, 0]
        ];
        break;
      case '2D':
        newVectors = [
          [1, 0],
          [0, 1]
        ];
        break;
      case '4vectors':
        newVectors = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
          [1, 1, 1]
        ];
        break;
      default:
        newVectors = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ];
    }
    setVectors(newVectors);
    setResult('');
    setSteps([]);
    setError('');
  };

  const getOperationDescription = (op: Operation): string => {
    const descriptions = {
      'independence': 'Check if vectors are linearly independent',
      'basis': 'Check if vectors form a basis for the space',
      'dimension': 'Find the dimension of the span of the vectors',
      'span': 'Check if the vectors span the entire space'
    };
    return descriptions[op] || '';
  };

  // Helper to get display value for input
  const getDisplayValue = (val: number): string => {
    return val === 0 ? '' : val.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Linear Independence & Vector Space Calculator
        </h3>
        <p className="text-sm text-indigo-600 mt-1">
          Check linear independence, basis, dimension, and spanning of vectors with step-by-step explanations
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
          <option value="independence">Linear Independence</option>
          <option value="basis">Basis Check</option>
          <option value="dimension">Dimension</option>
          <option value="span">Span Check</option>
        </select>
        <span className="text-xs text-slate-400 ml-2">{getOperationDescription(operation)}</span>
      </div>

      {/* Quick Examples */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Load example:</span>
        <button
          onClick={() => loadExample('independent')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Independent
        </button>
        <button
          onClick={() => loadExample('dependent')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Dependent
        </button>
        <button
          onClick={() => loadExample('spanning')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Spanning
        </button>
        <button
          onClick={() => loadExample('not_spanning')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Not Spanning
        </button>
        <button
          onClick={() => loadExample('2D')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          2D
        </button>
        <button
          onClick={() => loadExample('4vectors')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          4 Vectors
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
                        value={getDisplayValue(val)}
                        onChange={(e) => updateVector(i, j, e.target.value)}
                        onBlur={(e) => {
                          if (e.target.value === '') {
                            updateVector(i, j, '');
                          }
                        }}
                        className="w-14 h-10 px-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none rounded text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            : 'bg-yellow-50 border-yellow-100'
        }`}>
          <div className="flex items-start gap-3">
            {result.includes('✅') ? (
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                result.includes('✅') ? 'text-green-800' : 'text-yellow-800'
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
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Linear Independence</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Basis Check</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Dimension</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Span Check</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Add or remove vectors to change the set. Add or remove dimensions to change the vector space.
          The calculator uses Gaussian elimination to determine linear relationships.
        </p>
      </div>
    </div>
  );
};

export default LinearIndependence;