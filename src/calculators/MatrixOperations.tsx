// components/MatrixOperations.tsx
import React, { useState } from 'react';
import PDFExport from './PDFExport';

type OperationType = 'add' | 'subtract' | 'multiply' | 'scalar' | 'determinant' | 'transpose' | 'inverse' | 'trace' | 'power';

const MatrixOperations: React.FC = () => {
  const [matrixA, setMatrixA] = useState<number[][]>([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]);
  const [matrixB, setMatrixB] = useState<number[][]>([
    [9, 8, 7],
    [6, 5, 4],
    [3, 2, 1]
  ]);
  const [operation, setOperation] = useState<OperationType>('add');
  const [scalarValue, setScalarValue] = useState<number>(2);
  const [powerValue, setPowerValue] = useState<number>(2);
  const [result, setResult] = useState<{ data: string; steps: string[]; stepExplanations?: string[] } | null>(null);
  const [showSteps, setShowSteps] = useState(true);

  const updateMatrix = (matrix: 'A' | 'B', row: number, col: number, value: string) => {
    const newMatrix = matrix === 'A' ? [...matrixA] : [...matrixB];
    const numValue = value === '' ? 0 : parseFloat(value);
    newMatrix[row][col] = isNaN(numValue) ? 0 : numValue;
    if (matrix === 'A') {
      setMatrixA(newMatrix);
    } else {
      setMatrixB(newMatrix);
    }
    setResult(null);
  };

  const addRow = (matrix: 'A' | 'B') => {
    const newMatrix = matrix === 'A' ? [...matrixA] : [...matrixB];
    const cols = newMatrix[0]?.length || 2;
    newMatrix.push(Array(cols).fill(0));
    if (matrix === 'A') {
      setMatrixA(newMatrix);
    } else {
      setMatrixB(newMatrix);
    }
    setResult(null);
  };

  const addCol = (matrix: 'A' | 'B') => {
    const newMatrix = matrix === 'A' ? [...matrixA] : [...matrixB];
    newMatrix.forEach(row => row.push(0));
    if (matrix === 'A') {
      setMatrixA(newMatrix);
    } else {
      setMatrixB(newMatrix);
    }
    setResult(null);
  };

  const removeRow = (matrix: 'A' | 'B') => {
    const newMatrix = matrix === 'A' ? [...matrixA] : [...matrixB];
    if (newMatrix.length > 1) {
      newMatrix.pop();
      if (matrix === 'A') {
        setMatrixA(newMatrix);
      } else {
        setMatrixB(newMatrix);
      }
      setResult(null);
    }
  };

  const removeCol = (matrix: 'A' | 'B') => {
    const newMatrix = matrix === 'A' ? [...matrixA] : [...matrixB];
    if (newMatrix[0]?.length > 1) {
      newMatrix.forEach(row => row.pop());
      if (matrix === 'A') {
        setMatrixA(newMatrix);
      } else {
        setMatrixB(newMatrix);
      }
      setResult(null);
    }
  };

  const formatMatrix = (matrix: number[][], precision: number = 4): string => {
    if (!matrix || matrix.length === 0) return '[]';
    return matrix.map(row => 
      `[${row.map(val => val.toFixed(precision).padStart(8)).join(', ')}]`
    ).join('\n');
  };

  const formatMatrixHTML = (matrix: number[][], precision: number = 4): React.ReactNode => {
    if (!matrix || matrix.length === 0) return '[]';
    return (
      <div className="font-mono text-sm">
        {matrix.map((row, i) => (
          <div key={i} className="py-0.5">
            [ {row.map((val, j) => (
              <span key={j} className="inline-block w-20 text-right">
                {val.toFixed(precision)}
              </span>
            ))} ]
          </div>
        ))}
      </div>
    );
  };

  // Helper function to get display value
  const getDisplayValue = (value: number): string => {
    return value === 0 ? '' : String(value);
  };

  // Handle input blur to ensure empty fields become 0
  const handleInputBlur = (matrix: 'A' | 'B', row: number, col: number) => {
    const newMatrix = matrix === 'A' ? [...matrixA] : [...matrixB];
    if (isNaN(newMatrix[row][col]) || newMatrix[row][col] === undefined) {
      newMatrix[row][col] = 0;
      if (matrix === 'A') {
        setMatrixA(newMatrix);
      } else {
        setMatrixB(newMatrix);
      }
    }
  };

  // Helper functions
  const getMinor = (matrix: number[][], row: number, col: number): number[][] => {
    return matrix
      .filter((_, i) => i !== row)
      .map(row => row.filter((_, j) => j !== col));
  };

  const getDeterminant = (matrix: number[][]): number => {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = getMinor(matrix, 0, j);
      det += matrix[0][j] * (j % 2 === 0 ? 1 : -1) * getDeterminant(minor);
    }
    return det;
  };

  const transposeMatrix = (matrix: number[][]): number[][] => {
    const result: number[][] = [];
    for (let j = 0; j < matrix[0].length; j++) {
      result[j] = [];
      for (let i = 0; i < matrix.length; i++) {
        result[j][i] = matrix[i][j];
      }
    }
    return result;
  };

  const multiplyMatrices = (A: number[][], B: number[][]): number[][] => {
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

  const getInverse = (matrix: number[][]): { inverse: number[][] | null; steps: string[]; stepExplanations: string[] } => {
    const steps: string[] = [];
    const stepExplanations: string[] = [];
    const n = matrix.length;
    if (n !== matrix[0].length) {
      steps.push('❌ Matrix must be square for inverse');
      stepExplanations.push('Only square matrices have inverses.');
      return { inverse: null, steps, stepExplanations };
    }

    const det = getDeterminant(matrix);
    steps.push(`Determinant = ${det.toFixed(4)}`);
    stepExplanations.push('The determinant must be non-zero for the inverse to exist.');
    
    if (Math.abs(det) < 1e-10) {
      steps.push('❌ Matrix is singular (determinant = 0), inverse does not exist');
      stepExplanations.push('A matrix with zero determinant has no inverse.');
      return { inverse: null, steps, stepExplanations };
    }

    steps.push('Calculating cofactor matrix...');
    stepExplanations.push('Cofactors are signed minors of the matrix.');
    const cofactorMatrix: number[][] = [];
    for (let i = 0; i < n; i++) {
      cofactorMatrix[i] = [];
      for (let j = 0; j < n; j++) {
        const minor = getMinor(matrix, i, j);
        const minorDet = getDeterminant(minor);
        cofactorMatrix[i][j] = minorDet * ((i + j) % 2 === 0 ? 1 : -1);
      }
    }
    
    steps.push('Transposing cofactor matrix to get adjugate...');
    stepExplanations.push('The adjugate is the transpose of the cofactor matrix.');
    const adjugate = transposeMatrix(cofactorMatrix);
    
    steps.push(`Dividing each element by determinant (1/${det.toFixed(4)})...`);
    stepExplanations.push(`Multiply the adjugate by 1/det to get the inverse.`);
    const inverse = adjugate.map(row => row.map(val => val / det));
    
    return { inverse, steps, stepExplanations };
  };

  const performOperation = () => {
    const steps: string[] = [];
    const stepExplanations: string[] = [];
    let resultMatrix: number[][] | null = null;
    let resultValue: string = '';

    steps.push(`📝 Operation: ${operation.toUpperCase()}`);
    stepExplanations.push(`The selected operation is ${operation.toUpperCase()}.`);
    steps.push(`Matrix A (${matrixA.length}×${matrixA[0]?.length || 0}):`);
    stepExplanations.push('Matrix A is the first input matrix.');
    steps.push(formatMatrix(matrixA));
    stepExplanations.push('Matrix A displayed in matrix form.');

    if (operation !== 'determinant' && operation !== 'trace' && operation !== 'scalar' && operation !== 'transpose' && operation !== 'inverse' && operation !== 'power') {
      steps.push(`Matrix B (${matrixB.length}×${matrixB[0]?.length || 0}):`);
      stepExplanations.push('Matrix B is the second input matrix (used for binary operations).');
      steps.push(formatMatrix(matrixB));
      stepExplanations.push('Matrix B displayed in matrix form.');
    }

    steps.push('');
    stepExplanations.push('');

    try {
      switch (operation) {
        case 'add': {
          if (matrixA.length !== matrixB.length || matrixA[0]?.length !== matrixB[0]?.length) {
            throw new Error('Matrices must have the same dimensions for addition');
          }
          steps.push('➕ Addition: C[i][j] = A[i][j] + B[i][j]');
          stepExplanations.push('Matrix addition adds corresponding elements from both matrices.');
          steps.push('');
          stepExplanations.push('');
          
          const result = matrixA.map((row, i) =>
            row.map((val, j) => {
              const sum = val + matrixB[i][j];
              steps.push(`C[${i+1}][${j+1}] = ${val} + ${matrixB[i][j]} = ${sum}`);
              stepExplanations.push(`Adding element at position (${i+1},${j+1}).`);
              return sum;
            })
          );
          
          resultMatrix = result;
          steps.push('\n✅ Result Matrix:');
          stepExplanations.push('The final sum matrix.');
          steps.push(formatMatrix(result));
          stepExplanations.push('Matrix addition complete.');
          break;
        }

        case 'subtract': {
          if (matrixA.length !== matrixB.length || matrixA[0]?.length !== matrixB[0]?.length) {
            throw new Error('Matrices must have the same dimensions for subtraction');
          }
          steps.push('➖ Subtraction: C[i][j] = A[i][j] - B[i][j]');
          stepExplanations.push('Matrix subtraction subtracts corresponding elements.');
          steps.push('');
          stepExplanations.push('');
          
          const result = matrixA.map((row, i) =>
            row.map((val, j) => {
              const diff = val - matrixB[i][j];
              steps.push(`C[${i+1}][${j+1}] = ${val} - ${matrixB[i][j]} = ${diff}`);
              stepExplanations.push(`Subtracting element at position (${i+1},${j+1}).`);
              return diff;
            })
          );
          
          resultMatrix = result;
          steps.push('\n✅ Result Matrix:');
          stepExplanations.push('The final difference matrix.');
          steps.push(formatMatrix(result));
          stepExplanations.push('Matrix subtraction complete.');
          break;
        }

        case 'multiply': {
          const aCols = matrixA[0]?.length || 0;
          const bRows = matrixB.length;
          if (aCols !== bRows) {
            throw new Error(`Number of columns in A (${aCols}) must equal number of rows in B (${bRows})`);
          }
          
          steps.push('✖️ Multiplication: C[i][j] = Σ(k) A[i][k] × B[k][j]');
          stepExplanations.push('Matrix multiplication: each element is the sum of products of row elements and column elements.');
          steps.push('');
          stepExplanations.push('');
          
          const result = Array.from({ length: matrixA.length }, () => 
            Array(matrixB[0]?.length || 0).fill(0)
          );
          
          for (let i = 0; i < matrixA.length; i++) {
            for (let j = 0; j < matrixB[0].length; j++) {
              let sum = 0;
              const calculations: string[] = [];
              for (let k = 0; k < aCols; k++) {
                const product = matrixA[i][k] * matrixB[k][j];
                sum += product;
                calculations.push(`${matrixA[i][k]}×${matrixB[k][j]} = ${product.toFixed(4)}`);
              }
              result[i][j] = sum;
              steps.push(`C[${i+1}][${j+1}] = ${calculations.join(' + ')} = ${sum.toFixed(4)}`);
              stepExplanations.push(`Element at position (${i+1},${j+1}) using ${aCols} products.`);
            }
          }
          
          resultMatrix = result;
          steps.push('\n✅ Result Matrix:');
          stepExplanations.push('The final product matrix.');
          steps.push(formatMatrix(result));
          stepExplanations.push('Matrix multiplication complete.');
          break;
        }

        case 'scalar': {
          steps.push(`🔢 Scalar Multiplication: C[i][j] = ${scalarValue} × A[i][j]`);
          stepExplanations.push(`Multiplying every element by scalar value ${scalarValue}.`);
          steps.push('');
          stepExplanations.push('');
          
          const result = matrixA.map((row, i) =>
            row.map((val, j) => {
              const product = scalarValue * val;
              steps.push(`C[${i+1}][${j+1}] = ${scalarValue} × ${val} = ${product}`);
              stepExplanations.push(`Multiplying element at (${i+1},${j+1}) by scalar.`);
              return product;
            })
          );
          
          resultMatrix = result;
          steps.push('\n✅ Result Matrix:');
          stepExplanations.push('The final scaled matrix.');
          steps.push(formatMatrix(result));
          stepExplanations.push('Scalar multiplication complete.');
          break;
        }

        case 'determinant': {
          if (matrixA.length !== matrixA[0]?.length) {
            throw new Error('Matrix must be square for determinant');
          }
          
          steps.push('🧮 Calculating Determinant:');
          stepExplanations.push('The determinant is a scalar value that can be computed from a square matrix.');
          steps.push('');
          stepExplanations.push('');
          
          const n = matrixA.length;
          if (n === 1) {
            const det = matrixA[0][0];
            steps.push(`Det([${matrixA[0][0]}]) = ${det}`);
            stepExplanations.push('For a 1×1 matrix, the determinant is the single element.');
            resultValue = det.toFixed(4);
          } else if (n === 2) {
            const det = matrixA[0][0] * matrixA[1][1] - matrixA[0][1] * matrixA[1][0];
            steps.push(`Det = (${matrixA[0][0]} × ${matrixA[1][1]}) - (${matrixA[0][1]} × ${matrixA[1][0]})`);
            stepExplanations.push('For a 2×2 matrix, determinant = ad - bc.');
            steps.push(`Det = ${matrixA[0][0] * matrixA[1][1]} - ${matrixA[0][1] * matrixA[1][0]}`);
            stepExplanations.push('Calculate the products and subtract.');
            steps.push(`✅ Det = ${det.toFixed(4)}`);
            stepExplanations.push('The final determinant value.');
            resultValue = det.toFixed(4);
          } else {
            const det = getDeterminant(matrixA);
            steps.push(`Using Laplace expansion along first row...`);
            stepExplanations.push('Laplace expansion calculates determinant using cofactors.');
            for (let j = 0; j < n; j++) {
              const minor = getMinor(matrixA, 0, j);
              const minorDet = getDeterminant(minor);
              const sign = j % 2 === 0 ? '+' : '-';
              steps.push(`Term ${j+1}: ${matrixA[0][j]} ${sign} Det(minor) = ${matrixA[0][j]} × ${minorDet.toFixed(4)} = ${(matrixA[0][j] * (j % 2 === 0 ? 1 : -1) * minorDet).toFixed(4)}`);
              stepExplanations.push(`Cofactor term ${j+1} with sign ${sign}.`);
            }
            steps.push(`✅ Determinant = ${det.toFixed(4)}`);
            stepExplanations.push('Sum of all cofactor terms.');
            resultValue = det.toFixed(4);
          }
          break;
        }

        case 'transpose': {
          steps.push('🔄 Transpose: C[i][j] = A[j][i]');
          stepExplanations.push('The transpose swaps rows with columns.');
          steps.push('');
          stepExplanations.push('');
          
          const result = transposeMatrix(matrixA);
          resultMatrix = result;
          steps.push(`Original: ${matrixA.length}×${matrixA[0]?.length || 0}`);
          stepExplanations.push('The original matrix dimensions.');
          steps.push(`Result: ${result.length}×${result[0]?.length || 0}`);
          stepExplanations.push('The transposed matrix dimensions.');
          steps.push('\n✅ Result Matrix:');
          stepExplanations.push('The final transposed matrix.');
          steps.push(formatMatrix(result));
          stepExplanations.push('Transpose operation complete.');
          break;
        }

        case 'inverse': {
          const result = getInverse(matrixA);
          steps.push(...result.steps);
          stepExplanations.push(...(result.stepExplanations || []));
          if (!result.inverse) {
            setResult({ data: 'Inverse does not exist', steps, stepExplanations });
            return;
          }
          resultMatrix = result.inverse;
          steps.push('\n✅ Inverse Matrix:');
          stepExplanations.push('The final inverse matrix.');
          steps.push(formatMatrix(result.inverse));
          stepExplanations.push('Inverse calculation complete.');
          
          // Verification
          steps.push('\n🔍 Verification: A × A⁻¹ = I');
          stepExplanations.push('Verify the result by multiplying the original matrix by its inverse.');
          const identity = multiplyMatrices(matrixA, result.inverse);
          steps.push(formatMatrix(identity));
          stepExplanations.push('The product should be the identity matrix.');
          break;
        }

        case 'trace': {
          if (matrixA.length !== matrixA[0]?.length) {
            throw new Error('Matrix must be square for trace');
          }
          
          steps.push('📐 Trace: Sum of diagonal elements');
          stepExplanations.push('The trace is the sum of the main diagonal elements.');
          steps.push('');
          stepExplanations.push('');
          
          let trace = 0;
          for (let i = 0; i < matrixA.length; i++) {
            trace += matrixA[i][i];
            steps.push(`Element (${i+1},${i+1}) = ${matrixA[i][i]}`);
            stepExplanations.push(`Diagonal element at position (${i+1},${i+1}).`);
          }
          steps.push(`✅ Trace = ${trace.toFixed(4)}`);
          stepExplanations.push('Sum of all diagonal elements.');
          resultValue = trace.toFixed(4);
          break;
        }

        case 'power': {
          if (matrixA.length !== matrixA[0]?.length) {
            throw new Error('Matrix must be square for power');
          }
          
          if (powerValue < 0) {
            throw new Error('Power must be non-negative');
          }
          
          steps.push(`⬆️ Power: A^${powerValue}`);
          stepExplanations.push(`Raising matrix A to the power ${powerValue}.`);
          steps.push('');
          stepExplanations.push('');
          
          let result = matrixA.map(row => [...row]);
          if (powerValue === 0) {
            // Identity matrix
            result = matrixA.map((row, i) => row.map((_, j) => i === j ? 1 : 0));
            steps.push('A^0 = Identity Matrix');
            stepExplanations.push('Any matrix raised to the power 0 is the identity matrix.');
          } else {
            for (let p = 1; p < powerValue; p++) {
              steps.push(`Step ${p}: A^${p+1} = A^${p} × A`);
              stepExplanations.push(`Multiply A^${p} by A to get A^${p+1}.`);
              result = multiplyMatrices(result, matrixA);
              steps.push(formatMatrix(result));
              stepExplanations.push(`Current matrix after ${p+1} multiplications.`);
              steps.push('');
              stepExplanations.push('');
            }
          }
          
          resultMatrix = result;
          steps.push('\n✅ Result Matrix:');
          stepExplanations.push('The final powered matrix.');
          steps.push(formatMatrix(result));
          stepExplanations.push('Matrix power operation complete.');
          break;
        }

        default:
          throw new Error('Operation not supported');
      }

    } catch (error: any) {
      steps.push(`❌ Error: ${error.message}`);
      stepExplanations.push(`Error: ${error.message}`);
      setResult({ data: 'Error in calculation', steps, stepExplanations });
      return;
    }

    let displayResult = '';
    if (resultMatrix) {
      displayResult = `Result Matrix (${resultMatrix.length}×${resultMatrix[0]?.length || 0}):\n${formatMatrix(resultMatrix)}`;
    } else if (resultValue) {
      displayResult = `Result: ${resultValue}`;
    }

    setResult({
      data: displayResult,
      steps: steps,
      stepExplanations: stepExplanations
    });
  };

  const resetMatrices = () => {
    const size = 3;
    setMatrixA(Array.from({ length: size }, (_, i) => 
      Array.from({ length: size }, (_, j) => i * size + j + 1)
    ));
    setMatrixB(Array.from({ length: size }, (_, i) => 
      Array.from({ length: size }, (_, j) => (size - i) * size - j)
    ));
    setResult(null);
    setScalarValue(2);
    setPowerValue(2);
  };

  const renderMatrixInput = (matrix: number[][], label: string, matrixType: 'A' | 'B') => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm text-slate-700">{label}</h4>
          <div className="flex gap-1">
            <button
              onClick={() => addRow(matrixType)}
              className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
              title="Add Row"
            >
              +Row
            </button>
            <button
              onClick={() => removeRow(matrixType)}
              className={`text-xs px-2 py-1 rounded transition ${
                matrix.length > 1 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Remove Last Row"
              disabled={matrix.length <= 1}
            >
              -Row
            </button>
            <button
              onClick={() => addCol(matrixType)}
              className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
              title="Add Column"
            >
              +Col
            </button>
            <button
              onClick={() => removeCol(matrixType)}
              className={`text-xs px-2 py-1 rounded transition ${
                matrix[0]?.length > 1 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Remove Last Column"
              disabled={matrix[0]?.length <= 1}
            >
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
                    <td key={j} className="border border-slate-300 p-1">
                      <input
                        type="text"
                        value={getDisplayValue(val)}
                        onChange={(e) => updateMatrix(matrixType, i, j, e.target.value)}
                        onBlur={() => handleInputBlur(matrixType, i, j)}
                        className="w-16 px-2 py-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none rounded text-sm border border-transparent hover:border-slate-300 focus:border-indigo-500 transition"
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
        <div className="text-xs text-slate-400">
          {matrix.length}×{matrix[0]?.length || 0}
        </div>
      </div>
    );
  };

  const getOperationRequiresB = (op: OperationType): boolean => {
    return ['add', 'subtract', 'multiply'].includes(op);
  };

  return (
    <div className="space-y-6">
      {/* Operation Selection */}
      <div className="flex flex-wrap gap-4 items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Operation:</label>
          <select
            value={operation}
            onChange={(e) => {
              setOperation(e.target.value as OperationType);
              setResult(null);
            }}
            className="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="add">A + B (Addition)</option>
            <option value="subtract">A - B (Subtraction)</option>
            <option value="multiply">A × B (Multiplication)</option>
            <option value="scalar">Scalar × A</option>
            <option value="determinant">det(A)</option>
            <option value="transpose">Aᵀ (Transpose)</option>
            <option value="inverse">A⁻¹ (Inverse)</option>
            <option value="trace">tr(A) (Trace)</option>
            <option value="power">Aⁿ (Power)</option>
          </select>
        </div>

        {operation === 'scalar' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Scalar:</label>
            <input
              type="number"
              value={scalarValue}
              onChange={(e) => setScalarValue(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              step="any"
            />
          </div>
        )}

        {operation === 'power' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Power:</label>
            <input
              type="number"
              value={powerValue}
              onChange={(e) => setPowerValue(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-20 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              min="0"
              step="1"
            />
          </div>
        )}

        <button
          onClick={resetMatrices}
          className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition"
        >
          Reset Matrices
        </button>
      </div>

      {/* Matrix Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderMatrixInput(matrixA, 'Matrix A', 'A')}
        {getOperationRequiresB(operation) && renderMatrixInput(matrixB, 'Matrix B', 'B')}
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
        {result && result.steps.length > 0 && (
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

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Result */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-green-800">Result:</p>
                <pre className="mt-2 font-mono text-sm text-green-700 whitespace-pre-wrap">
                  {result.data}
                </pre>
              </div>
              <div className="flex-shrink-0">
                <PDFExport
                  title={`Matrix Operations - ${operation.toUpperCase()}`}
                  data={result.data}
                  steps={result.steps}
                  inputs={`Matrix A (${matrixA.length}×${matrixA[0]?.length || matrixA.length}):\n${formatMatrix(matrixA)}${['add', 'subtract', 'multiply'].includes(operation) ? `\nMatrix B (${matrixB.length}×${matrixB[0]?.length || matrixB.length}):\n${formatMatrix(matrixB)}` : ''}${operation === 'scalar' ? `\nScalar: ${scalarValue}` : ''}${operation === 'power' ? `\nPower: ${powerValue}` : ''}\nOperation: ${operation}`}
                  fileName={`matrix_operations_${operation}`}
                />
              </div>
            </div>
          </div>

          {/* Steps with explanation beside */}
          {showSteps && result.steps.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h4 className="font-medium text-blue-800">Step-by-Step Solution</h4>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {result.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 border-b border-blue-200 last:border-0 pb-3 last:pb-0">
                    <div className="flex-1 font-mono text-sm text-blue-900 whitespace-pre-wrap">
                      {step}
                    </div>
                    {result.stepExplanations && result.stepExplanations[idx] && (
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
                            {result.stepExplanations[idx]}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help */}
      <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <p className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Supported operations:
        </p>
        <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-1">
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Addition (+)</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Subtraction (-)</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Multiplication (×)</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Scalar Multiplication</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Determinant</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Transpose</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Inverse</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Trace</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Matrix Power</span>
        </div>
      </div>
    </div>
  );
};

export default MatrixOperations;