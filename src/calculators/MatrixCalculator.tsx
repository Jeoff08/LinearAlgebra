// components/MatrixCalculator.tsx
import React, { useState } from 'react';
import PDFExport from './PDFExport';

interface MatrixOperation {
  name: string;
  description: string;
  perform: (matrix: number[][], matrix2?: number[][]) => { result: number[][]; steps: string[]; stepExplanations?: string[] } | null;
}

const MatrixCalculator: React.FC = () => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 10]
  ]);
  const [matrix2, setMatrix2] = useState<number[][]>([
    [10, 8, 6],
    [4, 2, 0],
    [1, 3, 5]
  ]);
  const [operation, setOperation] = useState<string>('determinant');
  const [result, setResult] = useState<{ data: string; steps: string[]; stepExplanations?: string[] } | null>(null);
  const [useSecondMatrix, setUseSecondMatrix] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  const updateMatrix = (matrixNum: number, i: number, j: number, value: string) => {
    const newMatrix = matrixNum === 1 ? [...matrix] : [...matrix2];
    const numValue = value === '' ? 0 : parseFloat(value);
    newMatrix[i][j] = isNaN(numValue) ? 0 : numValue;
    if (matrixNum === 1) {
      setMatrix(newMatrix);
    } else {
      setMatrix2(newMatrix);
    }
    setResult(null);
  };

  const handleResize = () => {
    const newMatrix: number[][] = [];
    for (let i = 0; i < rows; i++) {
      newMatrix[i] = [];
      for (let j = 0; j < cols; j++) {
        newMatrix[i][j] = matrix[i]?.[j] || 0;
      }
    }
    setMatrix(newMatrix);
    
    const newMatrix2: number[][] = [];
    for (let i = 0; i < rows; i++) {
      newMatrix2[i] = [];
      for (let j = 0; j < cols; j++) {
        newMatrix2[i][j] = matrix2[i]?.[j] || 0;
      }
    }
    setMatrix2(newMatrix2);
    setResult(null);
  };

  const formatMatrix = (matrix: number[][], precision: number = 4): string => {
    return matrix.map(row => 
      `[${row.map(val => val.toFixed(precision).padStart(8)).join(', ')}]`
    ).join('\n');
  };

  const getDisplayValue = (value: number): string => {
    return value === 0 ? '' : String(value);
  };

  // Generate explanation text for PDF
  const getExplanationText = (opName: string): string => {
    const explanations: Record<string, string> = {
      'determinant': 'The determinant of a matrix is a scalar value that can be computed from its elements. For a 2×2 matrix, det = ad - bc. For larger matrices, we use Laplace expansion along the first row, which expands the determinant using cofactors.\n\nKey Properties:\n• If det(A) = 0, the matrix is singular (not invertible)\n• If det(A) ≠ 0, the matrix is invertible\n• det(AB) = det(A) × det(B)\n• det(A^T) = det(A)',
      'transpose': 'The transpose of a matrix is obtained by swapping rows with columns. The (i,j) element of A^T is the (j,i) element of A.\n\nKey Properties:\n• (A^T)^T = A\n• (A + B)^T = A^T + B^T\n• (AB)^T = B^T A^T\n• If A is symmetric, then A = A^T',
      'inverse': 'The inverse of a matrix A is denoted A⁻¹ and satisfies A × A⁻¹ = I (identity matrix). A matrix is invertible if and only if its determinant is non-zero.\n\nKey Properties:\n• (A⁻¹)⁻¹ = A\n• (AB)⁻¹ = B⁻¹ A⁻¹\n• (A^T)⁻¹ = (A⁻¹)^T\n• det(A⁻¹) = 1/det(A)',
      'multiply': 'Matrix multiplication is a binary operation that produces a matrix from two matrices. For A (m×n) and B (n×p), the product C = AB is an m×p matrix where each element is the dot product of a row from A and a column from B.\n\nKey Properties:\n• Matrix multiplication is associative: (AB)C = A(BC)\n• Matrix multiplication is not commutative: AB ≠ BA generally\n• The identity matrix acts as the multiplicative identity: AI = IA = A',
      'addition': 'Matrix addition is performed element-wise. Two matrices must have the same dimensions to be added.\n\nKey Properties:\n• Commutative: A + B = B + A\n• Associative: (A + B) + C = A + (B + C)\n• Additive identity: A + 0 = A\n• Distributive: c(A + B) = cA + cB',
      'subtraction': 'Matrix subtraction is performed element-wise. Two matrices must have the same dimensions to be subtracted.\n\nKey Properties:\n• A - B = A + (-B)\n• (A - B)^T = A^T - B^T\n• c(A - B) = cA - cB',
      'rank': 'The rank of a matrix is the maximum number of linearly independent rows or columns. It can be found by performing Gaussian elimination and counting the number of non-zero rows in row echelon form.\n\nKey Properties:\n• rank(A) = rank(A^T)\n• rank(AB) ≤ min(rank(A), rank(B))\n• If A is m×n, then rank(A) ≤ min(m, n)\n• A matrix with full rank is invertible',
      'eigenvalues': 'Eigenvalues are scalar values that satisfy the equation Av = λv, where v is a non-zero vector called an eigenvector. For a matrix A, the eigenvalues are found by solving the characteristic equation det(A - λI) = 0.\n\nKey Properties:\n• The sum of eigenvalues equals the trace of the matrix\n• The product of eigenvalues equals the determinant of the matrix\n• Eigenvalues of symmetric matrices are real\n• Eigenvalues of skew-symmetric matrices are purely imaginary'
    };
    return explanations[opName] || 'Matrix operation performed with step-by-step calculations.';
  };

  const operations: Record<string, MatrixOperation> = {
    determinant: {
      name: 'Determinant',
      description: 'Calculate the determinant of a square matrix',
      perform: (matrix) => {
        if (matrix.length !== matrix[0].length) {
          return null;
        }
        const steps: string[] = [];
        const stepExplanations: string[] = [];
        const n = matrix.length;
        
        if (n === 1) {
          const det = matrix[0][0];
          steps.push(`Det([${matrix[0][0]}]) = ${det}`);
          stepExplanations.push('For a 1×1 matrix, the determinant is simply the single element value.');
          return { result: [[det]], steps, stepExplanations };
        }
        
        if (n === 2) {
          const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
          steps.push(`Det = (${matrix[0][0]} × ${matrix[1][1]}) - (${matrix[0][1]} × ${matrix[1][0]})`);
          stepExplanations.push('For a 2×2 matrix, the determinant formula is ad - bc where a,b,c,d are the matrix elements.');
          steps.push(`Det = ${matrix[0][0] * matrix[1][1]} - ${matrix[0][1] * matrix[1][0]}`);
          stepExplanations.push('Calculate the products and subtract them.');
          steps.push(`Det = ${det}`);
          stepExplanations.push('The final determinant value.');
          return { result: [[det]], steps, stepExplanations };
        }
        
        steps.push(`Using Laplace expansion along first row:`);
        stepExplanations.push('Laplace expansion calculates the determinant by expanding along a row or column, using cofactors.');
        let det = 0;
        for (let j = 0; j < n; j++) {
          const minor = getMinor(matrix, 0, j);
          const cofactor = matrix[0][j] * (j % 2 === 0 ? 1 : -1);
          const minorDet = getDeterminantRecursive(minor);
          const term = cofactor * minorDet;
          det += term;
          steps.push(`Cofactor for element (1,${j+1}): ${matrix[0][j]} × ${j % 2 === 0 ? '+' : '-'} Det(minor)`);
          stepExplanations.push(`The cofactor includes the sign based on position: (-1)^(1+${j+1}) and the minor determinant.`);
          steps.push(`  = ${matrix[0][j]} × ${minorDet} = ${term}`);
          stepExplanations.push(`Multiply the matrix element by its cofactor to get the term contribution.`);
        }
        steps.push(`Total determinant = ${det}`);
        stepExplanations.push('Sum all cofactor terms to get the final determinant.');
        return { result: [[det]], steps, stepExplanations };
      }
    },
    transpose: {
      name: 'Transpose',
      description: 'Swap rows and columns of the matrix',
      perform: (matrix) => {
        const steps: string[] = [];
        const stepExplanations: string[] = [];
        const rows = matrix.length;
        const cols = matrix[0].length;
        const result: number[][] = [];
        
        steps.push(`Original matrix (${rows}×${cols}):`);
        stepExplanations.push('The original matrix we want to transpose.');
        steps.push(formatMatrix(matrix));
        stepExplanations.push('The input matrix displayed in its current form.');
        steps.push(`\nTranspose operation: Aᵀ[i][j] = A[j][i]`);
        stepExplanations.push('The transpose swaps rows with columns. Element at (i,j) moves to (j,i).');
        
        for (let j = 0; j < cols; j++) {
          result[j] = [];
          for (let i = 0; i < rows; i++) {
            result[j][i] = matrix[i][j];
          }
        }
        
        steps.push(`\nResult (${cols}×${rows}):`);
        stepExplanations.push('The resulting transposed matrix with dimensions swapped.');
        steps.push(formatMatrix(result));
        stepExplanations.push('The transposed matrix is complete.');
        return { result, steps, stepExplanations };
      }
    },
    inverse: {
      name: 'Inverse',
      description: 'Calculate the inverse of a square matrix (if it exists)',
      perform: (matrix) => {
        const n = matrix.length;
        if (n !== matrix[0].length) {
          return null;
        }
        
        const steps: string[] = [];
        const stepExplanations: string[] = [];
        const det = getDeterminantRecursive(matrix);
        
        steps.push(`Step 1: Calculate determinant`);
        stepExplanations.push('First we need to check if the matrix is invertible by finding its determinant.');
        steps.push(`Det(A) = ${det}`);
        stepExplanations.push(`The determinant of the matrix is ${det}.`);
        
        if (Math.abs(det) < 1e-10) {
          steps.push(`\n⚠️ Matrix is singular (determinant = 0), inverse does not exist.`);
          stepExplanations.push('A matrix with zero determinant is singular and has no inverse.');
          return { result: [], steps, stepExplanations };
        }
        
        steps.push(`\nStep 2: Calculate cofactor matrix`);
        stepExplanations.push('The cofactor matrix consists of cofactors for each element, which are signed minors.');
        const cofactorMatrix: number[][] = [];
        for (let i = 0; i < n; i++) {
          cofactorMatrix[i] = [];
          for (let j = 0; j < n; j++) {
            const minor = getMinor(matrix, i, j);
            const minorDet = getDeterminantRecursive(minor);
            cofactorMatrix[i][j] = minorDet * ((i + j) % 2 === 0 ? 1 : -1);
          }
        }
        steps.push(`Cofactor matrix C:`);
        stepExplanations.push('The cofactor matrix C where each element is the cofactor of the corresponding matrix element.');
        steps.push(formatMatrix(cofactorMatrix));
        stepExplanations.push('The completed cofactor matrix.');
        
        steps.push(`\nStep 3: Transpose to get adjugate matrix`);
        stepExplanations.push('The adjugate matrix is the transpose of the cofactor matrix.');
        const adjugate = transposeMatrix(cofactorMatrix);
        steps.push(`Adjugate matrix (Cᵀ):`);
        stepExplanations.push('The adjugate matrix is used in the inverse formula.');
        steps.push(formatMatrix(adjugate));
        stepExplanations.push('The transposed cofactor matrix.');
        
        steps.push(`\nStep 4: Divide by determinant (1/${det})`);
        stepExplanations.push(`Multiply the adjugate by 1/det to get the inverse.`);
        const inverse = adjugate.map(row => row.map(val => val / det));
        steps.push(`Inverse matrix A⁻¹:`);
        stepExplanations.push('The final inverse matrix.');
        steps.push(formatMatrix(inverse));
        stepExplanations.push('The inverse matrix has been calculated successfully.');
        
        steps.push(`\n✅ Verification: A × A⁻¹ = I`);
        stepExplanations.push('Verify the result by multiplying the original matrix by its inverse to get the identity matrix.');
        const product = multiplyMatrices(matrix, inverse);
        steps.push(`A × A⁻¹ =`);
        stepExplanations.push('The product should equal the identity matrix (with some rounding error).');
        steps.push(formatMatrix(product));
        stepExplanations.push('Verification complete.');
        
        return { result: inverse, steps, stepExplanations };
      }
    },
    multiply: {
      name: 'Multiplication',
      description: 'Multiply two matrices (requires second matrix)',
      perform: (matrix, matrix2) => {
        if (!matrix2) return null;
        if (matrix[0].length !== matrix2.length) {
          return null;
        }
        
        const steps: string[] = [];
        const stepExplanations: string[] = [];
        const m = matrix.length;
        const n = matrix[0].length;
        const p = matrix2[0].length;
        
        steps.push(`Matrix A (${m}×${n}):`);
        stepExplanations.push('First matrix with its dimensions.');
        steps.push(formatMatrix(matrix));
        stepExplanations.push('The first input matrix.');
        steps.push(`Matrix B (${n}×${p}):`);
        stepExplanations.push('Second matrix - its columns must equal rows of first matrix.');
        steps.push(formatMatrix(matrix2));
        stepExplanations.push('The second input matrix.');
        steps.push(`\nMultiplication: A × B`);
        stepExplanations.push('Matrix multiplication of A and B.');
        steps.push(`Result will be a ${m}×${p} matrix`);
        stepExplanations.push(`The resulting matrix dimensions will be ${m}×${p}.`);
        steps.push(`\nFor each element C[i][j] = Σ(k=1 to ${n}) A[i][k] × B[k][j]`);
        stepExplanations.push('Each element is the sum of products of corresponding row and column elements.');
        
        const result: number[][] = [];
        for (let i = 0; i < m; i++) {
          result[i] = [];
          for (let j = 0; j < p; j++) {
            let sum = 0;
            const calculations: string[] = [];
            for (let k = 0; k < n; k++) {
              const product = matrix[i][k] * matrix2[k][j];
              sum += product;
              calculations.push(`${matrix[i][k]}×${matrix2[k][j]} = ${product}`);
            }
            result[i][j] = sum;
            steps.push(`\nC[${i+1}][${j+1}] = ${calculations.join(' + ')} = ${sum}`);
            stepExplanations.push(`Element at row ${i+1}, column ${j+1}: sum of ${n} products.`);
          }
        }
        
        steps.push(`\nResult matrix:`);
        stepExplanations.push('The final product matrix.');
        steps.push(formatMatrix(result));
        stepExplanations.push('Matrix multiplication complete.');
        return { result, steps, stepExplanations };
      }
    },
    addition: {
      name: 'Addition',
      description: 'Add two matrices (requires second matrix)',
      perform: (matrix, matrix2) => {
        if (!matrix2) return null;
        if (matrix.length !== matrix2.length || matrix[0].length !== matrix2[0].length) {
          return null;
        }
        
        const steps: string[] = [];
        const stepExplanations: string[] = [];
        steps.push(`Matrix A:`);
        stepExplanations.push('First matrix.');
        steps.push(formatMatrix(matrix));
        stepExplanations.push('The first input matrix.');
        steps.push(`Matrix B:`);
        stepExplanations.push('Second matrix - must have same dimensions.');
        steps.push(formatMatrix(matrix2));
        stepExplanations.push('The second input matrix.');
        steps.push(`\nAddition: A + B`);
        stepExplanations.push('Matrix addition adds corresponding elements.');
        steps.push(`For each element: C[i][j] = A[i][j] + B[i][j]`);
        stepExplanations.push('Each resulting element is the sum of the corresponding elements from both matrices.');
        
        const result = matrix.map((row, i) => 
          row.map((val, j) => {
            const sum = val + matrix2[i][j];
            steps.push(`C[${i+1}][${j+1}] = ${val} + ${matrix2[i][j]} = ${sum}`);
            stepExplanations.push(`Sum of elements at position (${i+1},${j+1}).`);
            return sum;
          })
        );
        
        steps.push(`\nResult matrix:`);
        stepExplanations.push('The final sum matrix.');
        steps.push(formatMatrix(result));
        stepExplanations.push('Matrix addition complete.');
        return { result, steps, stepExplanations };
      }
    },
    subtraction: {
      name: 'Subtraction',
      description: 'Subtract two matrices (requires second matrix)',
      perform: (matrix, matrix2) => {
        if (!matrix2) return null;
        if (matrix.length !== matrix2.length || matrix[0].length !== matrix2[0].length) {
          return null;
        }
        
        const steps: string[] = [];
        const stepExplanations: string[] = [];
        steps.push(`Matrix A:`);
        stepExplanations.push('First matrix.');
        steps.push(formatMatrix(matrix));
        stepExplanations.push('The first input matrix.');
        steps.push(`Matrix B:`);
        stepExplanations.push('Second matrix - must have same dimensions.');
        steps.push(formatMatrix(matrix2));
        stepExplanations.push('The second input matrix.');
        steps.push(`\nSubtraction: A - B`);
        stepExplanations.push('Matrix subtraction subtracts corresponding elements.');
        steps.push(`For each element: C[i][j] = A[i][j] - B[i][j]`);
        stepExplanations.push('Each resulting element is the difference of the corresponding elements.');
        
        const result = matrix.map((row, i) => 
          row.map((val, j) => {
            const diff = val - matrix2[i][j];
            steps.push(`C[${i+1}][${j+1}] = ${val} - ${matrix2[i][j]} = ${diff}`);
            stepExplanations.push(`Difference of elements at position (${i+1},${j+1}).`);
            return diff;
          })
        );
        
        steps.push(`\nResult matrix:`);
        stepExplanations.push('The final difference matrix.');
        steps.push(formatMatrix(result));
        stepExplanations.push('Matrix subtraction complete.');
        return { result, steps, stepExplanations };
      }
    },
    rank: {
      name: 'Rank',
      description: 'Calculate the rank of the matrix using row reduction',
      perform: (matrix) => {
        const steps: string[] = [];
        const stepExplanations: string[] = [];
        const m = matrix.length;
        const n = matrix[0].length;
        
        steps.push(`Matrix (${m}×${n}):`);
        stepExplanations.push('The matrix whose rank we want to find.');
        steps.push(formatMatrix(matrix));
        stepExplanations.push('The input matrix.');
        steps.push(`\nStep 1: Perform row reduction (Gaussian elimination)`);
        stepExplanations.push('Gaussian elimination transforms the matrix to row echelon form.');
        
        const mat = matrix.map(row => [...row]);
        let rank = 0;
        let pivotCol = 0;
        
        for (let i = 0; i < m && pivotCol < n; i++) {
          let pivotRow = i;
          let maxVal = Math.abs(mat[i][pivotCol]);
          for (let j = i + 1; j < m; j++) {
            if (Math.abs(mat[j][pivotCol]) > maxVal) {
              maxVal = Math.abs(mat[j][pivotCol]);
              pivotRow = j;
            }
          }
          
          if (maxVal < 1e-10) {
            pivotCol++;
            i--;
            continue;
          }
          
          if (pivotRow !== i) {
            [mat[i], mat[pivotRow]] = [mat[pivotRow], mat[i]];
            steps.push(`Swap row ${i+1} with row ${pivotRow+1}`);
            stepExplanations.push(`Swapping rows to get a non-zero pivot in column ${pivotCol+1}.`);
          }
          
          rank++;
          
          for (let j = i + 1; j < m; j++) {
            const factor = mat[j][pivotCol] / mat[i][pivotCol];
            if (Math.abs(factor) < 1e-10) continue;
            for (let k = pivotCol; k < n; k++) {
              mat[j][k] -= factor * mat[i][k];
            }
            steps.push(`Row ${j+1} = Row ${j+1} - ${factor.toFixed(4)} × Row ${i+1}`);
            stepExplanations.push(`Eliminating below pivot in row ${j+1} using row ${i+1} as reference.`);
          }
          
          steps.push(`\nCurrent matrix:`);
          stepExplanations.push('The current state of the matrix after this elimination step.');
          steps.push(formatMatrix(mat));
          stepExplanations.push('Matrix after row reduction step.');
          pivotCol++;
        }
        
        steps.push(`\n✅ Rank = ${rank} (number of non-zero rows)`);
        stepExplanations.push(`The rank is the number of non-zero rows in the row echelon form, which is ${rank}.`);
        return { result: [[rank]], steps, stepExplanations };
      }
    },
    eigenvalues: {
      name: 'Eigenvalues',
      description: 'Find eigenvalues (for 2×2 and 3×3 matrices)',
      perform: (matrix) => {
        const n = matrix.length;
        if (n !== matrix[0].length) return null;
        if (n > 3) {
          return { result: [], steps: ['Eigenvalues only supported for 2×2 and 3×3 matrices'], stepExplanations: ['Maximum matrix size is 3×3 for eigenvalue calculation.'] };
        }
        
        const steps: string[] = [];
        const stepExplanations: string[] = [];
        steps.push(`Matrix:`);
        stepExplanations.push('The matrix whose eigenvalues we want to find.');
        steps.push(formatMatrix(matrix));
        stepExplanations.push('The input matrix.');
        steps.push(`\nCharacteristic equation: det(A - λI) = 0`);
        stepExplanations.push('Eigenvalues are found by solving the characteristic polynomial det(A - λI) = 0.');
        
        if (n === 2) {
          const a = matrix[0][0], b = matrix[0][1];
          const c = matrix[1][0], d = matrix[1][1];
          
          steps.push(`|${a}-λ  ${b}|`);
          steps.push(`|${c}   ${d}-λ| = 0`);
          stepExplanations.push('The determinant of the 2×2 matrix with λ subtracted from the diagonal.');
          
          const trace = a + d;
          const det = a * d - b * c;
          
          steps.push(`\n(λ² - ${trace}λ + ${det}) = 0`);
          stepExplanations.push('Expanding the determinant gives a quadratic equation in λ.');
          
          const discriminant = trace * trace - 4 * det;
          if (discriminant < 0) {
            const real = trace / 2;
            const imag = Math.sqrt(-discriminant) / 2;
            steps.push(`\nλ₁ = ${real.toFixed(4)} + ${imag.toFixed(4)}i`);
            steps.push(`λ₂ = ${real.toFixed(4)} - ${imag.toFixed(4)}i`);
            stepExplanations.push('The quadratic has complex conjugate eigenvalues (discriminant < 0).');
            return { result: [[real, imag]], steps, stepExplanations };
          } else {
            const sqrtD = Math.sqrt(discriminant);
            const λ1 = (trace + sqrtD) / 2;
            const λ2 = (trace - sqrtD) / 2;
            steps.push(`\nλ₁ = ${λ1.toFixed(4)}`);
            steps.push(`λ₂ = ${λ2.toFixed(4)}`);
            stepExplanations.push('The eigenvalues are the roots of the quadratic equation.');
            return { result: [[λ1, λ2]], steps, stepExplanations };
          }
        }
        
        if (n === 3) {
          const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
          const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
          const g = matrix[2][0], h = matrix[2][1], i_val = matrix[2][2];
          
          const trace = a + e + i_val;
          const cofactorSum = (a*e - b*d) + (a*i_val - c*g) + (e*i_val - f*h);
          const det = a*(e*i_val - f*h) - b*(d*i_val - f*g) + c*(d*h - e*g);
          
          steps.push(`Characteristic polynomial:`);
          stepExplanations.push('For a 3×3 matrix, the characteristic polynomial is cubic.');
          steps.push(`λ³ - ${trace}λ² + ${cofactorSum}λ - ${det} = 0`);
          stepExplanations.push('The cubic equation whose roots are the eigenvalues.');
          
          const eigenvalues = findEigenvalues3x3(trace, cofactorSum, det);
          steps.push(`\nEigenvalues (approximated using numerical method):`);
          stepExplanations.push('Using Newton\'s method to find the roots of the cubic equation.');
          eigenvalues.forEach((λ, idx) => {
            steps.push(`λ${idx+1} = ${λ.toFixed(4)}`);
            stepExplanations.push(`Eigenvalue ${idx+1}: ${λ.toFixed(4)}`);
          });
          
          return { result: [eigenvalues], steps, stepExplanations };
        }
        
        return null;
      }
    }
  };

  const getMinor = (matrix: number[][], row: number, col: number): number[][] => {
    return matrix
      .filter((_, i) => i !== row)
      .map(row => row.filter((_, j) => j !== col));
  };

  const getDeterminantRecursive = (matrix: number[][]): number => {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let j = 0; j < n; j++) {
      const minor = getMinor(matrix, 0, j);
      det += matrix[0][j] * (j % 2 === 0 ? 1 : -1) * getDeterminantRecursive(minor);
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

  const findEigenvalues3x3 = (trace: number, cofactorSum: number, det: number): number[] => {
    const roots: number[] = [];
    const epsilon = 1e-6;
    const maxIter = 1000;
    
    for (let guess = -10; guess <= 10; guess += 0.1) {
      if (roots.length >= 3) break;
      
      let x = guess;
      for (let iter = 0; iter < maxIter; iter++) {
        const f = x*x*x - trace*x*x + cofactorSum*x - det;
        const df = 3*x*x - 2*trace*x + cofactorSum;
        
        if (Math.abs(df) < epsilon) break;
        const xNew = x - f/df;
        if (Math.abs(xNew - x) < epsilon) {
          if (!roots.some(r => Math.abs(r - xNew) < 0.001)) {
            roots.push(xNew);
          }
          break;
        }
        x = xNew;
      }
    }
    
    while (roots.length < 3) {
      roots.push(0);
    }
    
    return roots;
  };

  const performOperation = () => {
    const op = operations[operation];
    if (!op) {
      setResult({ data: 'Operation not found', steps: [] });
      return;
    }

    const result = op.perform(matrix, useSecondMatrix ? matrix2 : undefined);
    
    if (!result) {
      setResult({ 
        data: 'Invalid operation for these matrices. Please check dimensions.', 
        steps: [] 
      });
      return;
    }

    let displayResult = '';
    if (result.result.length === 1 && result.result[0].length === 1) {
      displayResult = `Result: ${result.result[0][0].toFixed(4)}`;
    } else if (result.result.length === 0) {
      displayResult = 'Operation completed (see steps for details)';
    } else {
      displayResult = `Result matrix (${result.result.length}×${result.result[0].length}):\n${formatMatrix(result.result)}`;
    }

    setResult({
      data: displayResult,
      steps: result.steps,
      stepExplanations: result.stepExplanations
    });
  };

  const resetMatrix = () => {
    const newMatrix = Array.from({ length: rows }, () => Array(cols).fill(0));
    setMatrix(newMatrix);
    const newMatrix2 = Array.from({ length: rows }, () => Array(cols).fill(0));
    setMatrix2(newMatrix2);
    setResult(null);
  };

  const getOperationRequiresSecondMatrix = (op: string): boolean => {
    return ['multiply', 'addition', 'subtraction'].includes(op);
  };

  const getOperationDescription = (op: string): string => {
    return operations[op]?.description || '';
  };

  const handleInputBlur = (matrixNum: number, i: number, j: number) => {
    const newMatrix = matrixNum === 1 ? [...matrix] : [...matrix2];
    if (isNaN(newMatrix[i][j]) || newMatrix[i][j] === undefined) {
      newMatrix[i][j] = 0;
      if (matrixNum === 1) {
        setMatrix(newMatrix);
      } else {
        setMatrix2(newMatrix);
      }
    }
  };

  // Format result data for PDF
  const getPDFData = (): string => {
    if (!result) return '';
    return result.data;
  };

  // Get step explanations as string for PDF
  const getPDFExplanations = (): string => {
    if (!result || !result.stepExplanations) return '';
    return result.stepExplanations.join('\n');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center flex-wrap bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Operation:</label>
          <select
            value={operation}
            onChange={(e) => {
              setOperation(e.target.value);
              setUseSecondMatrix(getOperationRequiresSecondMatrix(e.target.value));
              setResult(null);
            }}
            className="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {Object.entries(operations).map(([key, op]) => (
              <option key={key} value={key}>{op.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-700">{getOperationDescription(operation)}</p>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Rows:</label>
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
            className="w-16 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            min="1"
            max="5"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Cols:</label>
          <input
            type="number"
            value={cols}
            onChange={(e) => setCols(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
            className="w-16 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            min="1"
            max="5"
          />
        </div>
        <button
          onClick={handleResize}
          className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
        >
          Resize
        </button>
        <button
          onClick={resetMatrix}
          className="px-4 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm"
        >
          Reset Matrices
        </button>
      </div>

      {/* Matrix 1 */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-2">Matrix A ({rows}×{cols}):</h4>
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
                        onChange={(e) => updateMatrix(1, i, j, e.target.value)}
                        onBlur={() => handleInputBlur(1, i, j)}
                        className="w-16 px-2 py-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 transition"
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
      </div>

      {/* Matrix 2 (if needed) */}
      {useSecondMatrix && (
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Matrix B ({rows}×{cols}):</h4>
          <div className="overflow-x-auto">
            <table className="border-collapse border border-slate-300">
              <tbody>
                {matrix2.map((row, i) => (
                  <tr key={i}>
                    {row.map((val, j) => (
                      <td key={j} className="border border-slate-300 p-1">
                        <input
                          type="text"
                          value={getDisplayValue(val)}
                          onChange={(e) => updateMatrix(2, i, j, e.target.value)}
                          onBlur={() => handleInputBlur(2, i, j)}
                          className="w-16 px-2 py-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none rounded border border-transparent hover:border-slate-300 focus:border-indigo-500 transition"
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
        </div>
      )}

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

      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Result */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  title={`Matrix Calculator - ${operations[operation]?.name || 'Operation'}`}
                  data={getPDFData()}
                  steps={result.steps}
                  explanation={getExplanationText(operation)}
                  fileName={`matrix_${operation}_result`}
                />
              </div>
            </div>
          </div>

          {/* Steps with explanation beside */}
          {showSteps && result.steps.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h4 className="font-medium text-blue-800">Step-by-Step Solution</h4>
                <span className="text-xs text-blue-600 ml-auto">{operations[operation]?.name}</span>
              </div>
              <div className="space-y-3">
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

      <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <p className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Supported operations:
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {Object.values(operations).map(op => (
            <span key={op.name} className="text-xs bg-white px-2 py-1 rounded border border-slate-200">
              {op.name}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs">Max matrix size: 5×5 for most operations, 3×3 for eigenvalues</p>
      </div>
    </div>
  );
};

export default MatrixCalculator;