// components/LinearTransformation.tsx
import React, { useState } from 'react';

interface Step {
  title: string;
  description: string;
  matrix?: number[][];
  vector?: number[];
  label?: string;
  explanation?: string;
}

const LinearTransformation: React.FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([[1, 2], [3, 4]]);
  const [vector, setVector] = useState<number[]>([1, 1]);
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [showExplanation, setShowExplanation] = useState(true);
  const [resultVector, setResultVector] = useState<number[]>([]);

  const calculateTransform = () => {
    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;
    
    if (rows === 0 || cols === 0) {
      setResult('❌ Matrix is empty.');
      setSteps([]);
      return;
    }

    if (vector.length !== cols) {
      setResult(`❌ Vector must have ${cols} elements (same as columns of matrix).`);
      setSteps([]);
      return;
    }

    const stepsList: Step[] = [];

    // Step 1: Display original matrix and vector
    stepsList.push({
      title: 'Step 1: Original Matrix and Vector',
      description: `We have a ${rows}×${cols} transformation matrix T and a vector v of length ${cols}.`,
      matrix: matrix,
      label: 'T =',
      explanation: 'The transformation matrix T and input vector v define the linear transformation T(v) = T·v.'
    });

    stepsList.push({
      title: '  Vector v',
      description: `The input vector v:`,
      vector: vector,
      label: 'v =',
      explanation: 'The vector v is the input to the linear transformation.'
    });

    // Step 2: Explain the transformation
    stepsList.push({
      title: 'Step 2: Linear Transformation',
      description: `The linear transformation T(v) = T·v is computed as:\n` +
                   `[T·v]_i = Σⱼ T[i][j] · v[j]\n\n` +
                   `Each component of the result is a linear combination of the input vector components.`,
      explanation: 'A linear transformation maps vectors using matrix multiplication. Each output component is a weighted sum of input components.'
    });

    // Step 3: Show detailed calculation
    stepsList.push({
      title: 'Step 3: Component-wise Calculation',
      description: `Computing each component of the result:`,
      explanation: 'We compute each component of the output vector one at a time.'
    });

    const resultVec: number[] = [];
    const calculations: string[] = [];

    for (let i = 0; i < rows; i++) {
      let sum = 0;
      const terms: string[] = [];
      for (let j = 0; j < cols; j++) {
        sum += matrix[i][j] * vector[j];
        terms.push(`${matrix[i][j]} × ${vector[j]}`);
      }
      resultVec.push(sum);
      calculations.push(`T(v)${i+1} = ${terms.join(' + ')} = ${sum.toFixed(4)}`);
    }

    setResultVector(resultVec);

    stepsList.push({
      title: '  Calculation Details',
      description: calculations.join('\n'),
      explanation: 'Each row of the transformation matrix multiplied by the input vector gives one component of the output.'
    });

    // Step 4: Show the result
    stepsList.push({
      title: 'Step 4: Result Vector',
      description: `The transformed vector T(v):`,
      vector: resultVec,
      label: 'T(v) =',
      explanation: 'The output vector after applying the linear transformation.'
    });

    // Step 5: Check if transformation is linear (verify properties)
    stepsList.push({
      title: 'Step 5: Linearity Verification',
      description: `A transformation is linear if it satisfies:\n` +
                   `1. T(u + v) = T(u) + T(v) (Additivity)\n` +
                   `2. T(c·v) = c·T(v) (Homogeneity)\n\n` +
                   `Since T is a matrix multiplication, it is always linear.`,
      explanation: 'Matrix multiplication always defines a linear transformation because it satisfies both additivity and homogeneity properties.'
    });

    // Step 6: Geometric interpretation (if 2x2)
    if (rows === 2 && cols === 2) {
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      const absDet = Math.abs(det);
      
      let transformType = '';
      if (Math.abs(det) < 1e-10) {
        transformType = 'singular (collapses space to a line or point)';
      } else if (det > 0) {
        transformType = 'orientation-preserving (det > 0)';
      } else {
        transformType = 'orientation-reversing (det < 0)';
      }
      
      // Correct area scaling factor: absolute value of determinant
      const areaScale = absDet;
      
      stepsList.push({
        title: 'Step 6: Geometric Interpretation (2×2)',
        description: `For a 2×2 transformation matrix:\n` +
                     `det(T) = ${det.toFixed(4)}\n` +
                     `The transformation is ${transformType}\n` +
                     `Area scaling factor = |det(T)| = ${areaScale.toFixed(4)}`,
        explanation: 'The determinant of a 2×2 matrix gives the area scaling factor and orientation of the transformation.'
      });

      // Check for special transformations
      const isIdentity = Math.abs(matrix[0][0] - 1) < 1e-10 && 
                        Math.abs(matrix[0][1]) < 1e-10 && 
                        Math.abs(matrix[1][0]) < 1e-10 && 
                        Math.abs(matrix[1][1] - 1) < 1e-10;
      
      const isDiagonal = Math.abs(matrix[0][1]) < 1e-10 && Math.abs(matrix[1][0]) < 1e-10;
      const isSymmetric = Math.abs(matrix[0][1] - matrix[1][0]) < 1e-10;
      
      const properties: string[] = [];
      if (isIdentity) properties.push('✅ Identity transformation');
      if (isDiagonal) properties.push('✅ Diagonal matrix (scaling along axes)');
      if (isSymmetric) properties.push('✅ Symmetric matrix');
      if (Math.abs(areaScale - 1) < 1e-10) properties.push('✅ Area-preserving (|det| = 1)');
      
      if (properties.length > 0) {
        stepsList.push({
          title: '  Special Properties',
          description: properties.join('\n'),
          explanation: 'Special properties of the transformation matrix provide geometric insights.'
        });
      }
    }

    // Step 7: Verify result
    stepsList.push({
      title: 'Step 7: Verification',
      description: `The transformed vector has ${rows} components:\n` +
                   `T(v) = [${resultVec.map(v => v.toFixed(4)).join(', ')}]^T`,
      explanation: 'The result vector confirms the transformation was applied correctly.'
    });

    // Step 8: Final result
    let finalDescription = `✅ Transformation Applied Successfully!\n\n` +
                          `v = [${vector.map(v => v.toFixed(2)).join(', ')}]^T\n` +
                          `T(v) = [${resultVec.map(v => v.toFixed(4)).join(', ')}]^T\n\n` +
                          `The matrix transformation T maps R^${cols} → R^${rows}.`;

    if (rows === 2 && cols === 2) {
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      if (Math.abs(det) > 1e-10) {
        finalDescription += `\n\nThe transformation is invertible (det ≠ 0).`;
      } else {
        finalDescription += `\n\nThe transformation is NOT invertible (det = 0).`;
      }
    }

    stepsList.push({
      title: '✅ Final Result',
      description: finalDescription,
      explanation: 'The linear transformation has been successfully applied with all steps verified.'
    });

    setSteps(stepsList);

    // Set result for display
    const resultText = 
      '=== LINEAR TRANSFORMATION STEPS ===\n\n' +
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
    setResultVector([]);
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
    setResultVector([]);
  };

  const addRow = () => {
    const cols = matrix[0]?.length || 2;
    setMatrix([...matrix, Array(cols).fill(0)]);
    setResult('');
    setSteps([]);
    setResultVector([]);
  };

  const addColumn = () => {
    setMatrix(matrix.map(row => [...row, 0]));
    setVector([...vector, 0]);
    setResult('');
    setSteps([]);
    setResultVector([]);
  };

  const removeRow = () => {
    if (matrix.length > 1) {
      setMatrix(matrix.slice(0, -1));
      setResult('');
      setSteps([]);
      setResultVector([]);
    }
  };

  const removeColumn = () => {
    if ((matrix[0]?.length || 0) > 1) {
      setMatrix(matrix.map(row => row.slice(0, -1)));
      setVector(vector.slice(0, -1));
      setResult('');
      setSteps([]);
      setResultVector([]);
    }
  };

  const clearAll = () => {
    setMatrix(matrix.map(row => row.map(() => 0)));
    setVector(vector.map(() => 0));
    setResult('');
    setSteps([]);
    setResultVector([]);
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
          <h3 className="text-sm font-medium text-slate-700">Transformation matrix and vector:</h3>
          <span className="text-xs text-slate-500">{matrix.length}×{matrix[0]?.length || 0} matrix</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">Matrix T</p>
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
            <p className="text-sm font-medium text-slate-600 mb-2">Vector v</p>
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
          onClick={calculateTransform}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Apply Transformation
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
                <p className="font-medium text-green-800">Transformation Applied Successfully</p>
                <div className="mt-2 text-sm text-green-700">
                  The linear transformation T(v) = T·v has been computed.
                </div>
                <div className="mt-3 flex flex-wrap gap-4">
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Input Vector</span>
                    <span className="font-mono text-sm">[{vector.map(v => v.toFixed(2)).join(', ')}]</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Output Vector</span>
                    <span className="font-mono text-sm font-bold text-indigo-600">
                      {resultVector.length > 0 ? 
                        `[${resultVector.map(v => v.toFixed(4)).join(', ')}]` : 
                        'N/A'}
                    </span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">Map</span>
                    <span className="font-mono text-sm">R^{matrix[0]?.length || 0} → R^{matrix.length}</span>
                  </div>
                </div>
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
                <span className="text-xs text-blue-600 ml-auto">Matrix-Vector Multiplication</span>
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
          A linear transformation maps vectors from one space to another using matrix multiplication.
        </p>
        <p className="mt-1 text-xs">The transformation T: R^n → R^m is defined by T(v) = T·v.</p>
      </div>
    </div>
  );
};

export default LinearTransformation;