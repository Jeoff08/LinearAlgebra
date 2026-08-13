const topic = {
  id: "advanced-matrix-topics",
  title: "Advanced Matrix Topics",
  summary:
    "Block matrices, matrix functions, norms, condition numbers and sparse matrix considerations.",
  details: `
Advanced Matrix Topics are concepts that go beyond basic matrix operations such as addition, subtraction, scalar multiplication, and ordinary matrix multiplication. These topics focus on understanding the deeper properties of matrices and how matrices can be used to solve complex mathematical and real-world problems. They are important in Linear Algebra because matrices are not only collections of numbers; they can also represent transformations, systems of equations, relationships, and computational processes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. MATRIX INVERSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The inverse of a matrix is similar to the reciprocal of a number. If a matrix A has an inverse, it is written as A⁻¹, and multiplying the matrix by its inverse produces the identity matrix:

  A A⁻¹ = A⁻¹ A = I

Example: Consider

  A = [2  1]
      [1  1]

Its inverse is:

  A⁻¹ = [ 1  -1]
        [-1   2]

Therefore:

  A A⁻¹ = [2  1] [ 1  -1] = [1  0]
          [1  1] [-1   2]   [0  1]

The identity matrix acts like the number 1 in ordinary multiplication. Matrix inverses are particularly useful when solving systems of linear equations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. MATRIX RANK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The rank of a matrix tells us how many linearly independent rows or columns the matrix contains. It provides information about the amount of independent information represented by the matrix.

Example:

  A = [1  2]
      [2  4]

The second row is simply two times the first row:

  [2, 4] = 2[1, 2]

Therefore, the rows are not independent, and the matrix has rank 1.

Rank is especially useful when determining whether a system of equations has a unique solution, infinitely many solutions, or no solution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. MATRIX MULTIPLICATION & COMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrix multiplication becomes more important in advanced Linear Algebra because it can represent the composition of transformations.

Example:

  A = [1  2]    B = [2  0]
      [0  1]        [1  3]

The product AB is obtained by multiplying each row of A by each column of B:

  AB = [1·2 + 2·1    1·0 + 2·3] = [4  6]
       [0·2 + 1·1    0·0 + 1·3]   [1  3]

This becomes particularly useful when several matrix transformations need to be performed one after another.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. DETERMINANTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The determinant is a single number calculated from a square matrix. It provides important information about the matrix, such as whether the matrix is invertible and how a transformation affects area or volume.

For a 2×2 matrix:

  A = [a  b]
      [c  d]

the determinant is:

  det(A) = ad - bc

Example:

  A = [3  2]
      [1  4]

Then:

  det(A) = (3)(4) - (2)(1) = 12 - 2 = 10

Because the determinant is not zero, the matrix is invertible. If the determinant were zero, the matrix would be singular and would not have an ordinary inverse.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. MATRIX DECOMPOSITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrix decomposition means breaking a matrix into simpler matrices so that it becomes easier to analyze or compute with. Common decompositions include LU decomposition, QR decomposition, and Singular Value Decomposition (SVD).

Example - LU Decomposition: Expresses a matrix as:

  A = LU

where L is a lower triangular matrix and U is an upper triangular matrix. This technique can make solving systems of equations more efficient, especially when solving many systems involving the same coefficient matrix.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. DIAGONALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix is diagonalizable if it can be written in the form:

  A = P D P⁻¹

where D is a diagonal matrix and P contains eigenvectors of A. Diagonal matrices are much easier to work with, particularly when calculating large powers of a matrix.

Example: If

  D = [2  0]
      [0  3]

then:

  D³ = [2³   0 ] = [8   0 ]
       [0   3³]   [0  27]

This illustrates why diagonalization can simplify complicated matrix calculations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. EIGENVALUES & EIGENVECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An eigenvector is a nonzero vector whose direction remains unchanged when a matrix transformation is applied. The matrix may stretch or shrink the vector, but it does not change its direction. The relationship is expressed as:

  A v = λ v

where A is the matrix, v is the eigenvector, and λ is the eigenvalue.

Example:

  A = [2  0]
      [0  3]

For v = [1], we have:
        [0]

  A v = [2  0] [1] = [2] = 2[1] = 2v
        [0  3] [0]   [0]   [0]

Therefore, [1] is an eigenvector with eigenvalue 2.
         [0]

Similarly, [0] is an eigenvector with eigenvalue 3.
         [1]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. ORTHOGONAL MATRICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix Q is orthogonal when its transpose is also its inverse:

  Qᵀ Q = I

Orthogonal matrices are important because they preserve lengths and angles. They commonly appear in rotations and reflections.

Example: A rotation matrix can transform a vector by changing its direction while preserving its magnitude. This connects matrices to geometry and computer graphics.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. SYMMETRIC MATRICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Symmetric matrices are matrices that are equal to their transpose:

  A = Aᵀ

Example:

  A = [2  3]
      [3  5]

is symmetric because its entries mirror each other across the main diagonal.

Symmetric matrices have important properties, especially concerning eigenvalues and eigenvectors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. OTHER ADVANCED TOPICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Additional advanced matrix topics include:

  • Positive Definite Matrices
  • Matrix Norms
  • Singular Value Decomposition (SVD)
  • Applications of Matrices in Computing and Data Science

These concepts are used in areas such as:

  ✓ Computer Graphics
  ✓ Machine Learning
  ✓ Statistics
  ✓ Optimization
  ✓ Image Processing
  ✓ Engineering
  ✓ Scientific Computing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Advanced Matrix Topics focus on understanding the deeper structure, properties, and applications of matrices. Important topics include:

  ✓ Matrix Inverses
  ✓ Matrix Rank
  ✓ Determinants
  ✓ Matrix Multiplication
  ✓ Matrix Decompositions (LU, QR, SVD)
  ✓ Diagonalization
  ✓ Eigenvalues & Eigenvectors
  ✓ Orthogonal Matrices
  ✓ Symmetric Matrices
  ✓ Positive Definite Matrices
  ✓ Matrix Norms
  ✓ Singular Value Decomposition

These topics build upon the basic matrix operations learned earlier and prepare students for more advanced areas of Linear Algebra. Understanding them is especially important because matrices are widely used in computer science, artificial intelligence, machine learning, graphics, data analysis, engineering, and optimization.
  `,
  examples: [
    "Matrix Inverse: Find A⁻¹ for A = [[2,1],[1,1]]",
    "Matrix Rank: Determine rank of [[1,2],[2,4]] → rank = 1",
    "Determinant: det([[3,2],[1,4]]) = 10",
    "LU Decomposition: Factor a matrix into L and U",
    "Eigenvalues & Eigenvectors: Find λ and v for A = [[2,0],[0,3]]",
    "Estimate the condition number of a matrix.",
    "Partition a block matrix and compute its inverse",
  ],
};

export default topic;