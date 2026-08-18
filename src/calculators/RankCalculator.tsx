// components/RankCalculator.tsx
import React, { useState } from 'react';
import PDFExport from './PDFExport';

const RankCalculator: React.FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
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

  // Check if matrix is a zero row
  const isZeroRow = (row: number[]): boolean => {
    return row.every(val => Math.abs(val) < 1e-10);
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

  // Calculate rank using Gaussian elimination
  const calculateRank = () => {
    setError('');
    setResult('');
    setSteps([]);

    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;

    if (rows === 0 || cols === 0) {
      setError('Matrix is empty');
      return;
    }

    const stepList: { step: string; explanation: string }[] = [];
    const m = matrix.map(row => [...row]);
    
    stepList.push({
      step: '📊 Step 1: Original Matrix',
      explanation: 'The original matrix A whose rank we want to find.'
    });
    stepList.push({
      step: formatMatrix(m),
      explanation: 'The input matrix displayed in matrix form.'
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    stepList.push({
      step: '📝 Step 2: Gaussian Elimination (Row Reduction)',
      explanation: 'Converting to Row Echelon Form using row operations.'
    });
    stepList.push({
      step: 'Converting to Row Echelon Form:',
      explanation: 'The rank is the number of non-zero rows in Row Echelon Form.'
    });
    stepList.push({
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
        stepList.push({
          step: `Column ${col + 1}: No pivot found (all zeros)`,
          explanation: 'This column has no non-zero elements below the current row, so we move to the next column.'
        });
        continue;
      }

      // Swap rows if needed
      if (pivot !== row) {
        [m[row], m[pivot]] = [m[pivot], m[row]];
        stepList.push({
          step: `🔄 Swap Row ${row + 1} with Row ${pivot + 1}`,
          explanation: 'Swapping rows to get a non-zero pivot in the current position.'
        });
      }

      // Normalize pivot row
      const pivotVal = m[row][col];
      stepList.push({
        step: `➗ Normalize Row ${row + 1} by dividing by ${pivotVal.toFixed(4)}`,
        explanation: 'Dividing the pivot row by the pivot value to make the pivot equal to 1.'
      });
      for (let j = col; j < cols; j++) {
        m[row][j] /= pivotVal;
      }
      stepList.push({
        step: formatMatrix(m),
        explanation: 'The matrix after normalizing the pivot row.'
      });
      stepList.push({
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
          stepList.push({
            step: `➖ Row ${i + 1} = Row ${i + 1} - ${factor.toFixed(4)} × Row ${row + 1}`,
            explanation: `Eliminating the element in column ${col + 1} of row ${i + 1} using the pivot row.`
          });
        }
      }
      if (eliminated) {
        stepList.push({
          step: formatMatrix(m),
          explanation: 'The matrix after eliminating below the pivot.'
        });
        stepList.push({
          step: '',
          explanation: ''
        });
      }

      rank++;
      row++;
    }

    // Count non-zero rows
    let nonZeroRows = 0;
    for (let i = 0; i < rows; i++) {
      if (!isZeroRow(m[i])) {
        nonZeroRows++;
      }
    }

    stepList.push({
      step: '✅ Step 3: Row Echelon Form',
      explanation: 'The matrix in Row Echelon Form with leading 1s.'
    });
    stepList.push({
      step: formatMatrix(m),
      explanation: 'The final Row Echelon Form matrix.'
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    stepList.push({
      step: `📌 Step 4: Count Non-Zero Rows`,
      explanation: 'The rank is the number of non-zero rows in the Row Echelon Form.'
    });
    stepList.push({
      step: `Number of non-zero rows = ${nonZeroRows}`,
      explanation: `There are ${nonZeroRows} rows with at least one non-zero element.`
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    // Check for zero rows
    const zeroRows = rows - nonZeroRows;
    if (zeroRows > 0) {
      stepList.push({
        step: `Found ${zeroRows} zero row(s)`,
        explanation: 'Zero rows are removed when calculating the rank.'
      });
    }

    stepList.push({
      step: `🎯 Final Result: Rank = ${nonZeroRows}`,
      explanation: `The matrix has rank ${nonZeroRows}.`
    });
    stepList.push({
      step: '',
      explanation: ''
    });

    // Explanation of rank
    stepList.push({
      step: '💡 What does this mean?',
      explanation: 'The rank tells us about the linear independence of the matrix.'
    });
    if (nonZeroRows === Math.min(rows, cols)) {
      stepList.push({
        step: `✅ The matrix has full rank (${nonZeroRows}).`,
        explanation: `The rank equals the maximum possible rank of ${Math.min(rows, cols)}.`
      });
      stepList.push({
        step: 'This means the rows/columns are linearly independent.',
        explanation: 'All rows and columns are linearly independent.'
      });
    } else {
      stepList.push({
        step: `⚠️ The matrix does NOT have full rank.`,
        explanation: `Rank (${nonZeroRows}) is less than the maximum possible rank of ${Math.min(rows, cols)}.`
      });
      stepList.push({
        step: `Rank (${nonZeroRows}) < ${Math.min(rows, cols)}`,
        explanation: 'There are linearly dependent rows or columns.'
      });
      stepList.push({
        step: 'This means the rows/columns are linearly dependent.',
        explanation: 'Some rows or columns can be expressed as combinations of others.'
      });
    }

    setResult(`Rank = ${nonZeroRows}`);
    setSteps(stepList);
  };

  const addRow = () => {
    const newMatrix = [...matrix];
    const cols = newMatrix[0]?.length || 2;
    newMatrix.push(Array(cols).fill(0));
    setMatrix(newMatrix);
    setResult('');
    setSteps([]);
    setError('');
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
    const newMatrix = [...matrix];
    newMatrix.forEach(row => row.push(0));
    setMatrix(newMatrix);
    setResult('');
    setSteps([]);
    setError('');
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
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ]);
    setResult('');
    setSteps([]);
    setError('');
  };

  const loadExample = (example: string) => {
    let newMatrix: number[][];
    switch (example) {
      case '2x3':
        newMatrix = [
          [1, 2, 3],
          [4, 5, 6]
        ];
        break;
      case '3x3 full':
        newMatrix = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 10]
        ];
        break;
      case '3x3 singular':
        newMatrix = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ];
        break;
      case '3x4':
        newMatrix = [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12]
        ];
        break;
      case 'identity':
        newMatrix = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ];
        break;
      case '4x4':
        newMatrix = [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 16]
        ];
        break;
      default:
        newMatrix = [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
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
          Matrix Rank Calculator
        </h3>
        <p className="text-sm text-indigo-600 mt-1">
          Calculate the rank of any matrix using Gaussian elimination with step-by-step explanations
        </p>
      </div>

      {/* Quick Examples */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Load example:</span>
        <button
          onClick={() => loadExample('2x3')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          2×3
        </button>
        <button
          onClick={() => loadExample('3x3 full')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          3×3 (Full Rank)
        </button>
        <button
          onClick={() => loadExample('3x3 singular')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          3×3 (Singular)
        </button>
        <button
          onClick={() => loadExample('3x4')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          3×4
        </button>
        <button
          onClick={() => loadExample('identity')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Identity
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
              className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              +Row
            </button>
            <button
              onClick={removeRow}
              className={`px-3 py-1.5 text-sm rounded transition flex items-center gap-1 ${
                matrix.length > 1
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={matrix.length <= 1}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              -Row
            </button>
            <button
              onClick={addCol}
              className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              +Col
            </button>
            <button
              onClick={removeCol}
              className={`px-3 py-1.5 text-sm rounded transition flex items-center gap-1 ${
                matrix[0]?.length > 1
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={matrix[0]?.length <= 1}
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
          <span className="text-slate-300">Use the buttons above to add or remove rows/columns</span>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex gap-3">
        <button
          onClick={calculateRank}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Calculate Rank
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
              <p className="font-medium text-green-800">✅ {result}</p>
            </div>
            <div className="flex-shrink-0">
              <PDFExport
                title={`Matrix Rank & Nullity (${matrix.length}×${matrix[0]?.length || matrix.length})`}
                data={result}
                steps={steps}
                inputs={`Matrix A (${matrix.length}×${matrix[0]?.length || matrix.length}):\n${formatMatrix(matrix)}`}
                fileName={`matrix_rank_${matrix.length}x${matrix[0]?.length || matrix.length}`}
              />
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
            <h4 className="font-medium text-blue-800">Step-by-Step Calculation</h4>
            <span className="text-xs text-blue-600 ml-auto">Gaussian Elimination</span>
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
          <li>Rank = number of linearly independent rows/columns</li>
          <li>Uses Gaussian elimination to convert to Row Echelon Form</li>
          <li>Rank = number of non-zero rows in Row Echelon Form</li>
          <li>Full rank = rank = min(rows, columns)</li>
          <li>If rank &lt; min(rows, columns), the matrix is singular</li>
          <li>The matrix can have any dimensions (m×n)</li>
          <li>Use +Row/-Row and +Col/-Col buttons to adjust matrix size</li>
          <li>Click on any cell to edit values, press backspace to clear</li>
        </ul>
      </div>
    </div>
  );
};

export default RankCalculator;