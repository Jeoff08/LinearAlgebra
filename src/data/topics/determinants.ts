const topic = {
  id: "determinants",
  title: "Determinants",
  summary:
    "How to compute determinants, properties, and applications to volume and invertibility.",
  details: `
Determinants are numerical values that can be calculated from square matrices. A determinant provides important information about a matrix, such as whether the matrix has an inverse, whether a system of linear equations has a unique solution, and how a matrix transformation affects area or volume. Determinants are therefore one of the fundamental concepts in Linear Algebra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. DETERMINANT OF A 2×2 MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A determinant can only be calculated for a square matrix (same number of rows and columns).

For a 2×2 matrix:

  A = [a  b]
      [c  d]

The determinant is:

  det(A) = ad - bc

Example:

  A = [3  2]
      [1  4]

  det(A) = (3)(4) - (2)(1) = 12 - 2 = 10

  det(A) = 10

The determinant is not another matrix. It is a single number, also called a scalar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. DETERMINANT OF A 3×3 MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For a 3×3 matrix:

  A = [a  b  c]
      [d  e  f]
      [g  h  i]

The determinant can be calculated using cofactor expansion along the first row:

  det(A) = a·det[e  f] - b·det[d  f] + c·det[d  e]
                   [h  i]        [g  i]        [g  h]

The signs follow the pattern:  +  -  +  across the first row.

Example:

  A = [1  2  3]
      [0  4  5]
      [1  0  6]

Expanding along the first row:

  det(A) = 1·det[4  5] - 2·det[0  5] + 3·det[0  4]
                 [0  6]        [1  6]        [1  0]

Calculate each 2×2 determinant:

  det[4  5] = (4)(6) - (5)(0) = 24
     [0  6]

  det[0  5] = (0)(6) - (5)(1) = -5
     [1  6]

  det[0  4] = (0)(0) - (4)(1) = -4
     [1  0]

Therefore:

  det(A) = 1(24) - 2(-5) + 3(-4)
         = 24 + 10 - 12
         = 22

  det(A) = 22

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. DETERMINANT & INVERTIBILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most important uses of a determinant is determining whether a matrix has an inverse.

  det(A) ≠ 0  →  A is invertible (non-singular)
  det(A) = 0  →  A is NOT invertible (singular)

Example - Invertible Matrix:

  A = [2  3]
      [1  2]

  det(A) = (2)(2) - (3)(1) = 4 - 3 = 1

Since det(A) ≠ 0, the matrix is invertible.

Example - Singular Matrix (Not Invertible):

  B = [1  2]
      [2  4]

  det(B) = (1)(4) - (2)(2) = 4 - 4 = 0

Since det(B) = 0, the matrix does NOT have an inverse.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. DETERMINANT & SYSTEMS OF EQUATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Determinants can help determine whether a system of linear equations has a unique solution.

Consider the system:

  2x + y = 5
  x + 3y = 6

The coefficient matrix is:

  A = [2  1]
      [1  3]

  det(A) = (2)(3) - (1)(1) = 6 - 1 = 5

Since det(A) ≠ 0, the system has a unique solution.

This connection between determinants and systems of equations is also used in Cramer's Rule, which uses determinants to solve systems of linear equations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. GEOMETRIC MEANING OF A DETERMINANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The determinant has an important geometric interpretation:

  • For a 2×2 matrix: |det(A)| = factor by which area changes
  • For a 3×3 matrix: |det(A)| = factor by which volume changes
  • Sign of det(A): Positive = preserves orientation, Negative = reverses orientation

Example - Area Scaling:

  A = [2  0]
      [0  3]

  det(A) = (2)(3) - (0)(0) = 6

This means the transformation multiplies areas by a factor of 6.

If a shape originally has an area of 5, after applying this transformation its area becomes:

  5 × 6 = 30

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. IMPORTANT PROPERTIES OF DETERMINANTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Below is a summary table of the key properties of determinants, followed by detailed explanations with examples for each property.

PROPERTY                                  EXAMPLE
---------                                 -------
det(I) = 1                                det([1 0; 0 1]) = 1
det(AB) = det(A) · det(B)                 det(AB) = det(A) × det(B)
det(A⁻¹) = 1/det(A)                       det(A) = 2 → det(A⁻¹) = 1/2
det(Aᵀ) = det(A)                          det(Aᵀ) = det(A)
Swapping 2 rows changes sign              det = 5 → swap → det = -5
Row/column of zeros → det = 0             det([1 2; 0 0]) = 0
Equal rows/columns → det = 0              det([1 2; 1 2]) = 0
Linearly dependent rows → det = 0         det([1 2; 2 4]) = 0

────────────────────────────────────────────────────────────────────────────────

PROPERTY 1: det(I) = 1
────────────────────────────────────────────────────────────────────────────────

The determinant of the identity matrix is always 1.

Explanation: The identity matrix represents the "do nothing" transformation that leaves all vectors unchanged. Since it doesn't change any areas or volumes, the scaling factor is exactly 1.

Example:

  I = [1  0]  →  det(I) = (1)(1) - (0)(0) = 1
      [0  1]

────────────────────────────────────────────────────────────────────────────────

PROPERTY 2: det(AB) = det(A) · det(B)
────────────────────────────────────────────────────────────────────────────────

The determinant of a product of two matrices equals the product of their individual determinants.

Explanation: When applying two transformations sequentially (first B, then A), the total scaling of area/volume is the product of the individual scalings. This is analogous to multiplying scaling factors.

Example:

  If det(A) = 3 and det(B) = 4, then det(AB) = 3 × 4 = 12

────────────────────────────────────────────────────────────────────────────────

PROPERTY 3: det(A⁻¹) = 1 / det(A)
────────────────────────────────────────────────────────────────────────────────

The determinant of the inverse of a matrix is the reciprocal of the determinant of the original matrix.

Explanation: Since A · A⁻¹ = I, we have det(A) · det(A⁻¹) = det(I) = 1. Therefore, det(A⁻¹) = 1/det(A). This only works when det(A) ≠ 0 (i.e., A is invertible).

Example:

  If det(A) = 5, then det(A⁻¹) = 1/5

────────────────────────────────────────────────────────────────────────────────

PROPERTY 4: det(Aᵀ) = det(A)
────────────────────────────────────────────────────────────────────────────────

The determinant of a matrix and its transpose are equal.

Explanation: Transposing a matrix (swapping rows with columns) does not change the determinant. This is because the determinant can be computed using either rows or columns, and transposition simply exchanges them.

Example:

  A = [2  3]  →  det(A) = (2)(4) - (3)(1) = 8 - 3 = 5
      [1  4]

  Aᵀ = [2  1]  →  det(Aᵀ) = (2)(4) - (1)(3) = 8 - 3 = 5
       [3  4]

────────────────────────────────────────────────────────────────────────────────

PROPERTY 5: Swapping two rows changes the sign of the determinant
────────────────────────────────────────────────────────────────────────────────

If two rows of a matrix are exchanged, the determinant changes sign (multiplies by -1).

Explanation: Swapping rows reverses the orientation of the transformation. A positive determinant becomes negative, and a negative determinant becomes positive. The absolute value (magnitude) stays the same.

Example:

  A = [1  2]  →  det(A) = (1)(4) - (2)(3) = 4 - 6 = -2
      [3  4]

  Swap rows → [3  4]  →  det = (3)(2) - (4)(1) = 6 - 4 = 2
              [1  2]

  Notice: det changes from -2 to +2 (sign flipped, magnitude same)

────────────────────────────────────────────────────────────────────────────────

PROPERTY 6: A row or column of zeros → det = 0
────────────────────────────────────────────────────────────────────────────────

If a matrix contains an entire row or column of zeros, its determinant is 0.

Explanation: A transformation that maps some vector to zero (or collapses a dimension) cannot be invertible. Since area/volume becomes zero in the collapsed dimension, the determinant is zero.

Example:

  A = [1  2]  →  det(A) = (1)(0) - (2)(0) = 0
      [0  0]

────────────────────────────────────────────────────────────────────────────────

PROPERTY 7: Equal rows (or columns) → det = 0
────────────────────────────────────────────────────────────────────────────────

If two rows or two columns of a matrix are identical, the determinant is 0.

Explanation: If two rows are equal, they are linearly dependent, meaning the matrix does not have full rank. This implies the transformation collapses area/volume, so the determinant is zero.

Example:

  A = [1  2]  →  det(A) = (1)(2) - (2)(1) = 2 - 2 = 0
      [1  2]

────────────────────────────────────────────────────────────────────────────────

PROPERTY 8: Linearly dependent rows (or columns) → det = 0
────────────────────────────────────────────────────────────────────────────────

If the rows (or columns) of a matrix are linearly dependent, the determinant is 0.

Explanation: Linear dependence means at least one row can be expressed as a combination of others. This implies the matrix does not have full rank and the transformation reduces dimension, making the determinant zero.

Example:

  A = [1  2]  →  Row 2 = 2 × Row 1, so rows are dependent
      [2  4]

  det(A) = (1)(4) - (2)(2) = 4 - 4 = 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. DETERMINANTS & LINEAR DEPENDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Determinants can tell us whether the columns or rows of a square matrix are linearly independent.

  det(A) ≠ 0  →  Columns are linearly independent
  det(A) = 0  →  Columns are linearly dependent

Example:

  A = [1  2]
      [2  4]

The second column is twice the first:

  2[1] = [2]
    [2]   [4]

Therefore, the columns are linearly dependent, and det(A) = 0.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. APPLICATIONS OF DETERMINANTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Determinants are used in many areas:

  1. Solving Systems of Equations (Cramer's Rule)
  2. Finding Matrix Inverses (using adjugate method)
  3. Studying Linear Transformations
  4. Calculating Areas and Volumes
  5. Analyzing Geometric Transformations
  6. Understanding Eigenvalues

Eigenvalues are found by solving the characteristic equation:

  det(A - λI) = 0

This makes determinants an important part of studying eigenvalues and eigenvectors.

Additional applications:

  • Computer Graphics (scaling, rotation, reflection)
  • Engineering (system analysis, transformations)
  • Physics (coordinate transformations)
  • Differential Equations
  • Calculus (change of variables in multiple integrals)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A determinant is a scalar value associated with a square matrix that provides important information about the matrix.

Key Formulas:

  • 2×2:  det[a b] = ad - bc
              [c d]

  • Invertibility:  det(A) ≠ 0  ↔  A is invertible

  • Linear Independence:  det(A) ≠ 0  ↔  Columns are linearly independent

  • Geometric: |det(A)| = scaling factor for area (2D) or volume (3D)

  det(A) ≠ 0  →  A is invertible
  det(A) = 0  →  A is singular (not invertible)

Determinants are not simply calculations used to obtain a number. They provide valuable information about the structure, behavior, and geometric effect of a matrix, making them an essential topic in Linear Algebra.
  `,
  examples: [
    "Compute det([[1,2],[3,4]]) = (1)(4) - (2)(3) = 4 - 6 = -2",
    "Compute det([[3,2],[1,4]]) = (3)(4) - (2)(1) = 12 - 2 = 10",
    "Compute det([[1,2,3],[0,4,5],[1,0,6]]) = 22",
    "Invertible check: det([[2,3],[1,2]]) = 1 ≠ 0 → invertible",
    "Singular check: det([[1,2],[2,4]]) = 0 → not invertible",
    "Area scaling: det([[2,0],[0,3]]) = 6 → area multiplied by 6",
    "det(I) = 1: det([[1,0],[0,1]]) = 1",
    "det(AB) = det(A)·det(B): Product property",
    "det(A⁻¹) = 1/det(A): Inverse determinant property",
    "det(Aᵀ) = det(A): Transpose property",
    "Swapping rows: det changes sign",
    "Row of zeros: det = 0",
    "Equal rows: det = 0",
    "Linearly dependent rows: det = 0",
    "Cramer's Rule: Solve system using determinants",
    "Characteristic equation: det(A - λI) = 0 for eigenvalues",
    "Use the determinant to check if a matrix is invertible.",
  ],
};

export default topic;