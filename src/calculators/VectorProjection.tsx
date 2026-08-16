// components/VectorProjection.tsx
import React, { useState } from 'react';

type Operation = 'projection' | 'dot' | 'cross' | 'angle' | 'norm' | 'orthogonal';

const VectorProjection: React.FC = () => {
  const [vectorA, setVectorA] = useState<number[]>([3, 4]);
  const [vectorB, setVectorB] = useState<number[]>([1, 2]);
  const [operation, setOperation] = useState<Operation>('projection');
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<{ step: string; explanation: string }[]>([]);
  const [error, setError] = useState<string>('');
  const [showSteps, setShowSteps] = useState(false);

  // Format vector for display
  const formatVector = (v: number[]): string => {
    return `(${v.map(val => val.toFixed(4)).join(', ')})`;
  };

  // Calculate magnitude (norm) of a vector
  const calculateNorm = (v: number[]): number => {
    return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
  };

  // Calculate dot product
  const calculateDot = (v1: number[], v2: number[]): number => {
    return v1.reduce((sum, val, i) => sum + val * (v2[i] || 0), 0);
  };

  // Calculate cross product (3D only)
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

  // Calculate angle between vectors (in degrees)
  const calculateAngle = (v1: number[], v2: number[]): number => {
    const dot = calculateDot(v1, v2);
    const norm1 = calculateNorm(v1);
    const norm2 = calculateNorm(v2);
    if (norm1 === 0 || norm2 === 0) return 0;
    const cosAngle = dot / (norm1 * norm2);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    return angleRad * 180 / Math.PI;
  };

  // Calculate projection of v1 onto v2
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
      // Validate vectors
      if (vectorA.length === 0 || vectorB.length === 0) {
        setError('Vectors cannot be empty');
        return;
      }

      // Check if vectors have same dimension
      if (vectorA.length !== vectorB.length && operation !== 'norm' && operation !== 'cross') {
        setError(`Vectors must have the same dimension (${vectorA.length} ≠ ${vectorB.length})`);
        return;
      }

      // Check if vectors are 3D for cross product
      if (operation === 'cross' && (vectorA.length !== 3 || vectorB.length !== 3)) {
        setError('Cross product requires 3D vectors');
        return;
      }

      stepList.push({
        step: '📊 Input Vectors:',
        explanation: 'The input vectors that we will perform operations on.'
      });
      stepList.push({
        step: `A = ${formatVector(vectorA)}`,
        explanation: `Vector A with ${vectorA.length} components.`
      });
      stepList.push({
        step: `B = ${formatVector(vectorB)}`,
        explanation: `Vector B with ${vectorB.length} components.`
      });
      stepList.push({
        step: '',
        explanation: ''
      });

      let resultValue: string = '';
      let resultData: any = null;

      switch (operation) {
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
            step: `||B|| = ${normB.toFixed(4)}`,
            explanation: 'Calculate the magnitude (norm) of vector B.'
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
          stepList.push({
            step: '',
            explanation: ''
          });
          
          // Calculate projection
          const projection = vectorB.map(v => v * scalar);
          stepList.push({
            step: `proj_B(A) = ${scalar.toFixed(4)} × ${formatVector(vectorB)}`,
            explanation: 'Multiply vector B by the scalar to get the projection vector.'
          });
          stepList.push({
            step: `proj_B(A) = ${formatVector(projection)}`,
            explanation: 'The resulting projection vector.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          // Calculate the orthogonal component
          const orthogonal = vectorA.map((v, i) => v - projection[i]);
          stepList.push({
            step: `Orthogonal component = A - proj_B(A)`,
            explanation: 'The orthogonal component is the part of A that is perpendicular to B.'
          });
          stepList.push({
            step: `A⊥ = ${formatVector(orthogonal)}`,
            explanation: 'The orthogonal component of A relative to B.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          // Verify the orthogonal component is perpendicular to B
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
          
          // Check if vectors are parallel
          if (Math.abs(scalar) > 0) {
            const normA = calculateNorm(vectorA);
            const projNorm = calculateNorm(projection);
            const ratio = projNorm / normA;
            if (Math.abs(ratio - 1) < 1e-10) {
              stepList.push({
                step: '💡 The projection equals A → A and B are parallel',
                explanation: 'When projection equals A, vectors A and B are parallel.'
              });
            } else if (Math.abs(projNorm) < 1e-10) {
              stepList.push({
                step: '💡 The projection is zero → A and B are orthogonal',
                explanation: 'When projection is zero, vectors A and B are perpendicular.'
              });
            } else {
              stepList.push({
                step: `💡 The projection length is ${(projNorm / normA * 100).toFixed(2)}% of A's length`,
                explanation: 'The percentage of A that lies along B.'
              });
            }
          }
          
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

        case 'dot': {
          stepList.push({
            step: '📐 Operation: Dot Product',
            explanation: 'The dot product measures the similarity and angle between two vectors.'
          });
          stepList.push({
            step: 'Formula: A · B = A₁×B₁ + A₂×B₂ + ... + Aₙ×Bₙ',
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
              explanation: 'Positive dot product indicates an acute angle between vectors.'
            });
          } else {
            stepList.push({
              step: '💡 The dot product is negative → The angle between vectors is obtuse (> 90°)',
              explanation: 'Negative dot product indicates an obtuse angle between vectors.'
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
            step: `This represents the area of the parallelogram formed by the vectors`,
            explanation: 'The magnitude of the cross product equals the area of the parallelogram spanned by A and B.'
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

        case 'angle': {
          stepList.push({
            step: '📐 Operation: Angle Between Vectors',
            explanation: 'The angle between vectors measures how aligned or opposed they are.'
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
          
          // Interpretation
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

        case 'norm': {
          stepList.push({
            step: '📐 Operation: Vector Norm (Magnitude)',
            explanation: 'The norm represents the length or magnitude of the vector.'
          });
          stepList.push({
            step: 'Formula: ||A|| = √(A₁² + A₂² + ... + Aₙ²)',
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

        case 'orthogonal': {
          stepList.push({
            step: '📐 Operation: Orthogonal Component',
            explanation: 'The orthogonal component is the part of A that is perpendicular to B.'
          });
          stepList.push({
            step: 'Formula: A⊥ = A - proj_B(A)',
            explanation: 'Subtract the projection from A to get the orthogonal component.'
          });
          stepList.push({
            step: 'The component of A that is perpendicular to B',
            explanation: 'This is the part of A that B cannot explain.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          const projection = calculateProjection(vectorA, vectorB);
          const orthogonal = vectorA.map((v, i) => v - projection[i]);
          
          stepList.push({
            step: `Projection: proj_B(A) = ${formatVector(projection)}`,
            explanation: 'First calculate the projection of A onto B.'
          });
          stepList.push({
            step: `A⊥ = A - proj_B(A)`,
            explanation: 'Subtract the projection from the original vector A.'
          });
          stepList.push({
            step: `A⊥ = ${formatVector(vectorA)} - ${formatVector(projection)}`,
            explanation: 'Perform the subtraction component by component.'
          });
          stepList.push({
            step: `A⊥ = ${formatVector(orthogonal)}`,
            explanation: 'The resulting orthogonal component.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          // Verify perpendicularity
          const checkDot = calculateDot(orthogonal, vectorB);
          stepList.push({
            step: `Verification: A⊥ · B = ${checkDot.toFixed(4)} (should be 0)`,
            explanation: 'Check if the orthogonal component is perpendicular to B.'
          });
          stepList.push({
            step: Math.abs(checkDot) < 1e-10 ? '✅ Verified! The orthogonal component is perpendicular to B' : '⚠️ Small rounding discrepancy',
            explanation: 'The dot product should be zero if the vectors are perpendicular.'
          });
          stepList.push({
            step: '',
            explanation: ''
          });
          
          const normA = calculateNorm(vectorA);
          const normOrth = calculateNorm(orthogonal);
          stepList.push({
            step: `||A|| = ${normA.toFixed(4)}`,
            explanation: 'The magnitude of vector A.'
          });
          stepList.push({
            step: `||A⊥|| = ${normOrth.toFixed(4)}`,
            explanation: 'The magnitude of the orthogonal component.'
          });
          stepList.push({
            step: `Percentage of A that is orthogonal: ${(normOrth / normA * 100).toFixed(2)}%`,
            explanation: 'How much of A is perpendicular to B.'
          });
          
          stepList.push({
            step: '',
            explanation: ''
          });
          stepList.push({
            step: `✅ A⊥ = ${formatVector(orthogonal)}`,
            explanation: 'The final orthogonal component.'
          });
          
          resultValue = `A⊥ = ${formatVector(orthogonal)}`;
          resultData = orthogonal;
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

  const addComponent = (vectorNum: number) => {
    if (vectorNum === 1) {
      setVectorA([...vectorA, 0]);
    } else {
      setVectorB([...vectorB, 0]);
    }
    setResult('');
    setSteps([]);
    setError('');
  };

  const removeComponent = (vectorNum: number) => {
    if (vectorNum === 1 && vectorA.length > 1) {
      setVectorA(vectorA.slice(0, -1));
    } else if (vectorNum === 2 && vectorB.length > 1) {
      setVectorB(vectorB.slice(0, -1));
    }
    setResult('');
    setSteps([]);
    setError('');
  };

  const updateVector = (vectorNum: number, index: number, value: string) => {
    // If value is empty string, treat as 0 but show empty in input
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
    setVectorA([3, 4]);
    setVectorB([1, 2]);
    setOperation('projection');
    setResult('');
    setSteps([]);
    setError('');
  };

  const loadExample = (example: string) => {
    let vA: number[], vB: number[];
    switch (example) {
      case '2D':
        vA = [3, 4];
        vB = [1, 2];
        break;
      case 'orthogonal':
        vA = [1, 0];
        vB = [0, 1];
        break;
      case 'parallel':
        vA = [2, 4];
        vB = [1, 2];
        break;
      case 'opposite':
        vA = [3, 6];
        vB = [-1, -2];
        break;
      case '3D':
        vA = [2, 3, 4];
        vB = [1, 0, -1];
        break;
      case '3D parallel':
        vA = [2, 4, 6];
        vB = [1, 2, 3];
        break;
      default:
        vA = [3, 4];
        vB = [1, 2];
    }
    setVectorA(vA);
    setVectorB(vB);
    setResult('');
    setSteps([]);
    setError('');
  };

  const getOperationDescription = (op: Operation): string => {
    const descriptions = {
      'projection': 'Project vector A onto vector B',
      'dot': 'Calculate the dot product of two vectors',
      'cross': 'Calculate the cross product of two 3D vectors',
      'angle': 'Calculate the angle between two vectors (in degrees)',
      'norm': 'Calculate the magnitude (length) of vector A',
      'orthogonal': 'Find the component of A orthogonal (perpendicular) to B'
    };
    return descriptions[op] || '';
  };

  // Helper to get display value for input
  const getDisplayValue = (val: number): string => {
    // Return empty string if value is 0 to show empty field
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
          Vector Projection & Operations
        </h3>
        <p className="text-sm text-indigo-600 mt-1">
          Calculate vector projection, orthogonal components, dot product, angle between vectors, and more with step-by-step explanations
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
          <option value="projection">Projection</option>
          <option value="orthogonal">Orthogonal Component</option>
          <option value="dot">Dot Product</option>
          <option value="cross">Cross Product (3D)</option>
          <option value="angle">Angle Between</option>
          <option value="norm">Norm (Magnitude)</option>
        </select>
        <span className="text-xs text-slate-400 ml-2">{getOperationDescription(operation)}</span>
      </div>

      {/* Quick Examples */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">Load example:</span>
        <button
          onClick={() => loadExample('2D')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          2D
        </button>
        <button
          onClick={() => loadExample('orthogonal')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Orthogonal
        </button>
        <button
          onClick={() => loadExample('parallel')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Parallel
        </button>
        <button
          onClick={() => loadExample('opposite')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          Opposite
        </button>
        <button
          onClick={() => loadExample('3D')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          3D
        </button>
        <button
          onClick={() => loadExample('3D parallel')}
          className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded transition"
        >
          3D Parallel
        </button>
        <button
          onClick={resetVectors}
          className="px-3 py-1 text-xs border border-slate-300 hover:bg-slate-50 rounded transition"
        >
          Reset
        </button>
      </div>

      {/* Vector Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vector A */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-700">Vector A ({vectorA.length}D)</h4>
            <div className="flex gap-1">
              <button
                onClick={() => addComponent(1)}
                className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
              >
                + Component
              </button>
              <button
                onClick={() => removeComponent(1)}
                disabled={vectorA.length <= 1}
                className={`px-2 py-0.5 text-xs rounded transition ${
                  vectorA.length > 1
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                - Component
              </button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {vectorA.map((val, i) => (
              <input
                key={i}
                type="number"
                value={getDisplayValue(val)}
                onChange={(e) => updateVector(1, i, e.target.value)}
                onBlur={(e) => {
                  // When user leaves field, if empty, set to 0
                  if (e.target.value === '') {
                    updateVector(1, i, '');
                  }
                }}
                className="w-16 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="any"
                placeholder="0"
              />
            ))}
            <span className="text-xs text-slate-400 self-center">A = {formatVector(vectorA)}</span>
          </div>
        </div>

        {/* Vector B */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-700">Vector B ({vectorB.length}D)</h4>
            <div className="flex gap-1">
              <button
                onClick={() => addComponent(2)}
                className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
              >
                + Component
              </button>
              <button
                onClick={() => removeComponent(2)}
                disabled={vectorB.length <= 1}
                className={`px-2 py-0.5 text-xs rounded transition ${
                  vectorB.length > 1
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                - Component
              </button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {vectorB.map((val, i) => (
              <input
                key={i}
                type="number"
                value={getDisplayValue(val)}
                onChange={(e) => updateVector(2, i, e.target.value)}
                onBlur={(e) => {
                  // When user leaves field, if empty, set to 0
                  if (e.target.value === '') {
                    updateVector(2, i, '');
                  }
                }}
                className="w-16 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                step="any"
                placeholder="0"
              />
            ))}
            <span className="text-xs text-slate-400 self-center">B = {formatVector(vectorB)}</span>
          </div>
        </div>
      </div>

      {/* Dimension mismatch warning */}
      {vectorA.length !== vectorB.length && operation !== 'norm' && operation !== 'cross' && (
        <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200 text-xs text-yellow-700">
          ⚠️ Warning: Vectors have different dimensions ({vectorA.length}D vs {vectorB.length}D).
          {operation === 'projection' && ' Projection requires same dimensions.'}
          {operation === 'dot' && ' Dot product requires same dimensions.'}
          {operation === 'angle' && ' Angle calculation requires same dimensions.'}
          {operation === 'orthogonal' && ' Orthogonal component requires same dimensions.'}
        </div>
      )}

      {/* Cross product warning */}
      {operation === 'cross' && (vectorA.length !== 3 || vectorB.length !== 3) && (
        <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200 text-xs text-yellow-700">
          ⚠️ Cross product requires 3D vectors. Current dimensions: A={vectorA.length}D, B={vectorB.length}D
        </div>
      )}

      {/* Projection Info */}
      {operation === 'projection' && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-700">
          <p className="flex items-center gap-1 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Projection Properties:
          </p>
          <ul className="mt-1 space-y-0.5">
            <li>• proj_B(A) is the component of A that lies along B</li>
            <li>• A = proj_B(A) + A⊥ (orthogonal decomposition)</li>
            <li>• proj_B(A) is parallel to B</li>
            <li>• A⊥ is perpendicular to B</li>
          </ul>
        </div>
      )}

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
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-green-800">✅ Result:</p>
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
        <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-1">
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Projection</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Orthogonal Component</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Dot Product</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Cross Product (3D)</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Angle Between</span>
          <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200">Norm (Magnitude)</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Add or remove components to change vector dimensions. Cross product requires 3D vectors.
          Projection, dot product, angle, and orthogonal component require vectors of the same dimension.
        </p>
      </div>
    </div>
  );
};

export default VectorProjection;