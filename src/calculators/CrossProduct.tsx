// components/CrossProduct.tsx
import React, { useState } from 'react';

type Operation = 'cross' | 'dot' | 'angle' | 'projection' | 'norm';

const CrossProduct: React.FC = () => {
  const [vectorA, setVectorA] = useState<number[]>([1, 0, 0]);
  const [vectorB, setVectorB] = useState<number[]>([0, 1, 0]);
  const [operation, setOperation] = useState<Operation>('cross');
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<{ step: string; explanation: string }[]>([]);
  const [error, setError] = useState<string>('');
  const [showSteps, setShowSteps] = useState(false);

  const formatVector = (v: number[]): string => {
    return `(${v.map(val => val.toFixed(4)).join(', ')})`;
  };

  const calculateNorm = (v: number[]): number => {
    return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
  };

  const calculateDot = (v1: number[], v2: number[]): number => {
    return v1.reduce((sum, val, i) => sum + val * (v2[i] || 0), 0);
  };

  const calculateCross = (v1: number[], v2: number[]): number[] => {
    if (v1.length !== 3 || v2.length !== 3) {
      return [];
    }
    const [a1, a2, a3] = v1;
    const [b1, b2, b3] = v2;
    return [
      a2 * b3 - a3 * b2,
      a3 * b1 - a1 * b3,
      a1 * b2 - a2 * b1
    ];
  };

  const calculateAngle = (v1: number[], v2: number[]): number => {
    const dot = calculateDot(v1, v2);
    const norm1 = calculateNorm(v1);
    const norm2 = calculateNorm(v2);
    if (norm1 === 0 || norm2 === 0) return 0;
    const cosAngle = dot / (norm1 * norm2);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    return angleRad * 180 / Math.PI;
  };

  const calculateProjection = (v1: number[], v2: number[]): number[] => {
    const dot = calculateDot(v1, v2);
    const norm2 = calculateNorm(v2);
    if (norm2 === 0) return v1.map(() => 0);
    const scalar = dot / (norm2 * norm2);
    return v2.map(val => val * scalar);
  };

  const performOperation = () => {
    setError('');
    setResult('');
    setSteps([]);

    const stepList: { step: string; explanation: string }[] = [];

    try {
      if (vectorA.length !== 3 || vectorB.length !== 3) {
        setError('Cross product requires 3D vectors');
        return;
      }

      stepList.push({
        step: '📊 Input Vectors:',
        explanation: 'The input 3D vectors for the vector operation.'
      });
      stepList.push({
        step: `A = ${formatVector(vectorA)}`,
        explanation: 'Vector A with 3 components.'
      });
      stepList.push({
        step: `B = ${formatVector(vectorB)}`,
        explanation: 'Vector B with 3 components.'
      });
      stepList.push({
        step: '',
        explanation: ''
      });

      let resultValue: string = '';
      let resultData: any = null;

      switch (operation) {
        case 'cross': {
          stepList.push({
            step: '📐 Operation: Cross Product',
            explanation: 'The cross product produces a vector perpendicular to both input vectors.'
          });
          stepList.push({
            step: 'Formula: A × B = (A₂×B₃ - A₃×B₂, A₃×B₁ - A₁×B₃, A₁×B₂ - A₂×B₁)',
            explanation: 'The cross product components using the determinant method.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          const [a1, a2, a3] = vectorA;
          const [b1, b2, b3] = vectorB;
          
          stepList.push({
            step: `A × B = (${a2}×${b3} - ${a3}×${b2}, ${a3}×${b1} - ${a1}×${b3}, ${a1}×${b2} - ${a2}×${b1})`,
            explanation: 'Substitute the vector components into the cross product formula.'
          });
          stepList.push({
            step: `A × B = (${a2*b3} - ${a3*b2}, ${a3*b1} - ${a1*b3}, ${a1*b2} - ${a2*b1})`,
            explanation: 'Calculate the products in each component.'
          });
          
          const cross = calculateCross(vectorA, vectorB);
          stepList.push({
            step: `A × B = ${formatVector(cross)}`,
            explanation: 'The resulting cross product vector.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          const crossNorm = calculateNorm(cross);
          stepList.push({
            step: `||A × B|| = ${crossNorm.toFixed(4)}`,
            explanation: 'The magnitude of the cross product vector.'
          });
          stepList.push({
            step: 'This represents the area of the parallelogram formed by the vectors',
            explanation: 'The magnitude equals the area of the parallelogram spanned by A and B.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          if (crossNorm < 1e-10) {
            stepList.push({
              step: '💡 The cross product is zero → The vectors are parallel',
              explanation: 'Zero cross product indicates parallel vectors.'
            });
          } else {
            stepList.push({
              step: '💡 The cross product is non-zero → The vectors are not parallel',
              explanation: 'Non-zero cross product indicates non-parallel vectors.'
            });
            stepList.push({
              step: '💡 The direction of the cross product is perpendicular to both vectors',
              explanation: 'The cross product vector is orthogonal to both A and B.'
            });
          }
          
          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: `✅ A × B = ${formatVector(cross)}`,
            explanation: 'The final cross product result.'
          });
          
          resultValue = `A × B = ${formatVector(cross)}`;
          resultData = cross;
          break;
        }

        case 'dot': {
          stepList.push({
            step: '📐 Operation: Dot Product',
            explanation: 'The dot product measures the similarity between two vectors.'
          });
          stepList.push({
            step: 'Formula: A · B = A₁×B₁ + A₂×B₂ + A₃×B₃',
            explanation: 'The dot product is the sum of products of corresponding components.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          const products = vectorA.map((v, i) => v * vectorB[i]);
          stepList.push({
            step: `Products: ${formatVector(products)}`,
            explanation: 'Multiply each corresponding component of A and B.'
          });
          const dot = products.reduce((a, b) => a + b, 0);
          stepList.push({
            step: `Sum of products: ${dot.toFixed(4)}`,
            explanation: 'Sum all the products to get the dot product.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          if (dot === 0) {
            stepList.push({
              step: '💡 The dot product is zero → The vectors are orthogonal (perpendicular)',
              explanation: 'Zero dot product indicates the vectors are perpendicular.'
            });
          } else if (dot > 0) {
            stepList.push({
              step: '💡 The dot product is positive → The angle between vectors is acute (< 90°)',
              explanation: 'Positive dot product indicates an acute angle.'
            });
          } else {
            stepList.push({
              step: '💡 The dot product is negative → The angle between vectors is obtuse (> 90°)',
              explanation: 'Negative dot product indicates an obtuse angle.'
            });
          }
          
          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: `✅ A · B = ${dot.toFixed(4)}`,
            explanation: 'The final dot product result.'
          });
          
          resultValue = `A · B = ${dot.toFixed(4)}`;
          resultData = dot;
          break;
        }

        case 'angle': {
          stepList.push({
            step: '📐 Operation: Angle Between Vectors',
            explanation: 'The angle between vectors measures how aligned they are.'
          });
          stepList.push({
            step: 'Formula: θ = arccos((A · B) / (||A|| × ||B||))',
            explanation: 'The angle is found using the cosine relationship with the dot product.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          const dot = calculateDot(vectorA, vectorB);
          const normA = calculateNorm(vectorA);
          const normB = calculateNorm(vectorB);
          
          stepList.push({
            step: `A · B = ${dot.toFixed(4)}`,
            explanation: 'Calculate the dot product of vectors A and B.'
          });
          stepList.push({
            step: `||A|| = ${normA.toFixed(4)}`,
            explanation: 'Calculate the magnitude (norm) of vector A.'
          });
          stepList.push({
            step: `||B|| = ${normB.toFixed(4)}`,
            explanation: 'Calculate the magnitude (norm) of vector B.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          if (normA === 0 || normB === 0) {
            stepList.push({
              step: '⚠️ One of the vectors is zero, angle is undefined',
              explanation: 'Zero vector has no direction, so angle is undefined.'
            });
            setError('Cannot calculate angle with zero vector');
            return;
          }
          
          const cosAngle = dot / (normA * normB);
          stepList.push({
            step: `cos(θ) = ${dot.toFixed(4)} / (${normA.toFixed(4)} × ${normB.toFixed(4)}) = ${cosAngle.toFixed(4)}`,
            explanation: 'Calculate the cosine of the angle using the formula.'
          });
          const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
          const angleDeg = angleRad * 180 / Math.PI;
          stepList.push({
            step: `θ = arccos(${cosAngle.toFixed(4)}) = ${angleDeg.toFixed(4)}°`,
            explanation: 'Find the angle in degrees from the cosine value.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          if (Math.abs(angleDeg) < 1e-6) {
            stepList.push({
              step: '💡 The vectors are parallel and point in the same direction',
              explanation: 'Angle of 0° means vectors point in the same direction.'
            });
          } else if (Math.abs(angleDeg - 180) < 1e-6) {
            stepList.push({
              step: '💡 The vectors are parallel and point in opposite directions',
              explanation: 'Angle of 180° means vectors point in opposite directions.'
            });
          } else if (Math.abs(angleDeg - 90) < 1e-6) {
            stepList.push({
              step: '💡 The vectors are orthogonal (perpendicular)',
              explanation: 'Angle of 90° means vectors are perpendicular.'
            });
          } else if (angleDeg < 90) {
            stepList.push({
              step: `💡 The angle is acute (${angleDeg.toFixed(4)}°) → The vectors point in similar directions`,
              explanation: 'Acute angle means vectors are generally aligned.'
            });
          } else {
            stepList.push({
              step: `💡 The angle is obtuse (${angleDeg.toFixed(4)}°) → The vectors point in different directions`,
              explanation: 'Obtuse angle means vectors are generally opposed.'
            });
          }
          
          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: `✅ θ = ${angleDeg.toFixed(4)}°`,
            explanation: 'The final angle between vectors.'
          });
          
          resultValue = `θ = ${angleDeg.toFixed(4)}°`;
          resultData = angleDeg;
          break;
        }

        case 'projection': {
          stepList.push({
            step: '📐 Operation: Vector Projection',
            explanation: 'Projection finds the component of vector A that lies along vector B.'
          });
          stepList.push({
            step: 'Formula: proj_B(A) = ((A · B) / ||B||²) × B',
            explanation: 'The projection scalar times vector B gives the projection of A onto B.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          const dot = calculateDot(vectorA, vectorB);
          const normB = calculateNorm(vectorB);
          
          stepList.push({
            step: `A · B = ${dot.toFixed(4)}`,
            explanation: 'Calculate the dot product of vectors A and B.'
          });
          stepList.push({
            step: `||B||² = ${(normB * normB).toFixed(4)}`,
            explanation: 'Square the norm of B to get the denominator for the projection scalar.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          if (normB === 0) {
            stepList.push({
              step: '⚠️ Cannot project onto zero vector',
              explanation: 'Projection onto a zero vector is undefined.'
            });
            setError('Cannot project onto zero vector');
            return;
          }
          
          const scalar = dot / (normB * normB);
          stepList.push({
            step: `scalar = ${dot.toFixed(4)} / ${(normB * normB).toFixed(4)} = ${scalar.toFixed(4)}`,
            explanation: 'The scalar that multiplies B to get the projection of A onto B.'
          });
          const projection = vectorB.map(v => v * scalar);
          stepList.push({
            step: `proj = ${scalar.toFixed(4)} × ${formatVector(vectorB)} = ${formatVector(projection)}`,
            explanation: 'Multiply vector B by the scalar to get the projection vector.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          const orthogonal = vectorA.map((v, i) => v - projection[i]);
          stepList.push({
            step: `Orthogonal component = A - proj = ${formatVector(orthogonal)}`,
            explanation: 'The orthogonal component is the part of A that is perpendicular to B.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          const checkDot = calculateDot(orthogonal, vectorB);
          stepList.push({
            step: `Verification: (A - proj) · B = ${checkDot.toFixed(4)} (should be 0)`,
            explanation: 'Check if the orthogonal component is truly perpendicular to B.'
          });
          stepList.push({
            step: Math.abs(checkDot) < 1e-10 ? '✅ Verified! The orthogonal component is perpendicular to B' : '⚠️ Small rounding discrepancy',
            explanation: 'The dot product should be zero if the vectors are perpendicular.'
          });
          
          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: `✅ proj_B(A) = ${formatVector(projection)}`,
            explanation: 'The final projection result.'
          });
          
          resultValue = `proj_B(A) = ${formatVector(projection)}`;
          resultData = projection;
          break;
        }

        case 'norm': {
          stepList.push({
            step: '📐 Operation: Vector Norm (Magnitude)',
            explanation: 'The norm represents the length or magnitude of the vector.'
          });
          stepList.push({
            step: 'Formula: ||A|| = √(A₁² + A₂² + A₃²)',
            explanation: 'The norm is the square root of the sum of squared components.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          const squared = vectorA.map(v => v * v);
          stepList.push({
            step: `Squared components: ${formatVector(squared)}`,
            explanation: 'Square each component of vector A.'
          });
          const sum = squared.reduce((a, b) => a + b, 0);
          stepList.push({
            step: `Sum of squares: ${sum.toFixed(4)}`,
            explanation: 'Sum all the squared components.'
          });
          const norm = Math.sqrt(sum);
          stepList.push({
            step: `√(${sum.toFixed(4)}) = ${norm.toFixed(4)}`,
            explanation: 'Take the square root of the sum to get the norm.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          if (norm > 0) {
            const unit = vectorA.map(v => v / norm);
            stepList.push({
              step: `Unit vector: u = A/||A|| = ${formatVector(unit)}`,
              explanation: 'The unit vector has magnitude 1 and points in the same direction as A.'
            });
          }
          
          stepList.push({
            step: `✅ ||A|| = ${norm.toFixed(4)}`,
            explanation: 'The final norm value.'
          });
          
          resultValue = `||A|| = ${norm.toFixed(4)}`;
          resultData = norm;
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

  const updateVector = (vectorNum: number, index: number, value: string) => {
    if (value === '') {
      if (vectorNum === 1) {
        const newV = [...vectorA];
        newV[index] = 0;
        setVectorA(newV);
      } else {
        const newV = [...vectorB];
        newV[index] = 0;
        setVectorB(newV);
      }
      setResult('');
      setSteps([]);
      setError('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (vectorNum === 1) {
      const newV = [...vectorA];
      newV[index] = isNaN(numValue) ? 0 : numValue;
      setVectorA(newV);
    } else {
      const newV = [...vectorB];
      newV[index] = isNaN(numValue) ? 0 : numValue;
      setVectorB(newV);
    }
    setResult('');
    setSteps([]);
    setError('');
  };

  const resetVectors = () => {
    setVectorA([1, 0, 0]);
    setVectorB([0, 1, 0]);
    setOperation('cross');
    setResult('');
    setSteps([]);
    setError('');
  };

  const loadExample = (example: string) => {
    let vA: number[], vB: number[];
    switch (example) {
      case 'basis': vA = [1, 0, 0]; vB = [0, 1, 0]; break;
      case 'parallel': vA = [2, 4, 6]; vB = [1, 2, 3]; break;
      case 'opposite': vA = [1, 2, 3]; vB = [-1, -2, -3]; break;
      case 'orthogonal': vA = [1, 2, 3]; vB = [3, 0, -1]; break;
      case 'arbitrary': vA = [2, -1, 3]; vB = [4, 2, -1]; break;
      case 'unit': vA = [0.577, 0.577, 0.577]; vB = [-0.577, 0.577, 0.577]; break;
      default: vA = [1, 0, 0]; vB = [0, 1, 0];
    }
    setVectorA(vA);
    setVectorB(vB);
    setResult('');
    setSteps([]);
    setError('');
  };

  const getOperationDescription = (op: Operation): string => {
    const descriptions = {
      'cross': 'Calculate the cross product of two 3D vectors',
      'dot': 'Calculate the dot product of two 3D vectors',
      'angle': 'Calculate the angle between two 3D vectors (in degrees)',
      'projection': 'Project one 3D vector onto another',
      'norm': 'Calculate the magnitude (length) of vector A'
    };
    return descriptions[op] || '';
  };

  const getDisplayValue = (val: number): string => {
    return val === 0 ? '' : val.toString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-800 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Cross Product & 3D Vector Operations
        </h3>
        <p className="text-sm text-indigo-600 mt-1">Calculate cross product, dot product, angle between vectors, projection, and more for 3D vectors with step-by-step explanations</p>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-slate-700">Operation:</span>
        <select value={operation} onChange={(e) => { setOperation(e.target.value as Operation); setResult(''); setSteps([]); setError(''); }} className="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
          <option value="cross">Cross Product</option>
          <option value="dot">Dot Product</option>
          <option value="angle">Angle Between</option>
          <option value="projection">Projection</option>
          <option value="norm">Norm (Magnitude)</option>
        </select>
        <span className="text-xs text-slate-400 ml-2">{getOperationDescription(operation)}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Load example:</span>
        <button onClick={() => loadExample('basis')} className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition">Basis Vectors</button>
        <button onClick={() => loadExample('parallel')} className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition">Parallel</button>
        <button onClick={() => loadExample('opposite')} className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition">Opposite</button>
        <button onClick={() => loadExample('orthogonal')} className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition">Orthogonal</button>
        <button onClick={() => loadExample('arbitrary')} className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition">Arbitrary</button>
        <button onClick={() => loadExample('unit')} className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition">Unit Vectors</button>
        <button onClick={resetVectors} className="px-3 py-1 text-xs border border-slate-300 hover:bg-slate-50 rounded transition">Reset</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Vector A (3D)</h4>
          <div className="flex gap-2 flex-wrap items-center">
            {vectorA.map((val, i) => (
              <div key={i} className="relative">
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-slate-400">{['x', 'y', 'z'][i]}</span>
                <input type="number" value={getDisplayValue(val)} onChange={(e) => updateVector(1, i, e.target.value)} onBlur={(e) => { if (e.target.value === '') updateVector(1, i, ''); }} className="w-20 pl-4 pr-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" step="any" placeholder="0" />
              </div>
            ))}
            <span className="text-xs text-slate-400 self-center">A = {formatVector(vectorA)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Vector B (3D)</h4>
          <div className="flex gap-2 flex-wrap items-center">
            {vectorB.map((val, i) => (
              <div key={i} className="relative">
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-slate-400">{['x', 'y', 'z'][i]}</span>
                <input type="number" value={getDisplayValue(val)} onChange={(e) => updateVector(2, i, e.target.value)} onBlur={(e) => { if (e.target.value === '') updateVector(2, i, ''); }} className="w-20 pl-4 pr-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" step="any" placeholder="0" />
              </div>
            ))}
            <span className="text-xs text-slate-400 self-center">B = {formatVector(vectorB)}</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700">
        <p className="flex items-center gap-1 font-medium">Cross Product Properties:</p>
        <ul className="mt-1 space-y-0.5">
          <li>• Result is perpendicular to both vectors</li>
          <li>• Magnitude = area of parallelogram formed by the vectors</li>
          <li>• A × B = 0 if vectors are parallel</li>
          <li>• A × B = -B × A (anti-commutative)</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <button onClick={performOperation} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Calculate
        </button>
        {steps.length > 0 && (
          <button onClick={() => setShowSteps(!showSteps)} className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showSteps ? 'Hide' : 'Show'} Steps
          </button>
        )}
      </div>

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

      {result && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-green-800">✅ Result:</p>
              <pre className="mt-2 font-mono text-sm text-green-700 whitespace-pre-wrap">{result}</pre>
            </div>
          </div>
        </div>
      )}

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
                <div className="flex-1 font-mono text-sm text-blue-900 whitespace-pre-wrap">{item.step}</div>
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

      <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <p className="flex items-center gap-1 font-medium text-slate-700">Supported Operations (3D Vectors):</p>
        <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-1">
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Cross Product</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Dot Product</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Angle Between</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Vector Projection</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Norm (Magnitude)</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">All operations require 3D vectors. Use the examples to see different vector relationships.</p>
      </div>
    </div>
  );
};

export default CrossProduct;