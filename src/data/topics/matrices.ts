const topic = {
  id: "matrices",
  title: "Matrices",
  summary:
    "Matrix notation, types, arithmetic, transpose and trace, and special properties.",
  details: `
A Matrix is a rectangular arrangement of numbers, symbols, or expressions organized into rows and columns. Matrices are one of the most important objects in Linear Algebra because they provide an efficient way to organize and manipulate mathematical information.

A matrix is usually represented by a capital letter such as A, B, or C and its entries are written inside brackets.

Example:

  A = [1  2  3]
      [4  5  6]

This matrix has 2 rows and 3 columns, so it is called a 2×3 matrix.

Matrices are used to represent systems of equations, linear transformations, data, relationships between variables, and many other mathematical structures.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ELEMENTS OF A MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The individual numbers inside a matrix are called entries or elements.

Consider:

  A = [2  5  7]
      [1  4  9]

The entry in the first row and first column is:

  a₁₁ = 2

The entry in the first row and second column is:

  a₁₂ = 5

The entry in the second row and third column is:

  a₂₃ = 9

In general, aᵢⱼ represents the entry located in the i-th row and j-th column.

The first subscript identifies the row, while the second identifies the column.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. ORDER OR DIMENSION OF A MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The order or dimension of a matrix describes the number of rows and columns it has.

If a matrix has m rows and n columns, its order is m × n.

Example:

  A = [1  2]
      [3  4]
      [5  6]

has 3 rows and 2 columns.

Therefore, A is a 3×2 matrix.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. ROW MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix with only one row is called a row matrix.

Example:

  A = [2  4  6  8]

It has dimension 1×4.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. COLUMN MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix with only one column is called a column matrix.

Example:

  B = [2]
      [4]
      [6]
      [8]

It has dimension 4×1.

Column matrices are particularly important because vectors are commonly represented as column matrices.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. SQUARE MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix with the same number of rows and columns is called a square matrix.

Example:

  A = [1  2]
      [3  4]

It has two rows and two columns, so it is a 2×2 square matrix.

Square matrices are especially important because concepts such as determinants, eigenvalues, eigenvectors, inverses, and diagonalization are primarily associated with square matrices.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. ZERO MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix in which every entry is zero is called a zero matrix.

Example:

  0 = [0  0]
      [0  0]

The zero matrix acts similarly to the number 0.

For compatible matrices:

  A + 0 = A

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. IDENTITY MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The identity matrix is the matrix equivalent of the number 1.

A 2×2 identity matrix is:

  I₂ = [1  0]
       [0  1]

A 3×3 identity matrix is:

  I₃ = [1  0  0]
       [0  1  0]
       [0  0  1]

When a matrix is multiplied by the appropriate identity matrix, it remains unchanged:

  A I = I A = A

The identity matrix is especially important when studying matrix inverses.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. DIAGONAL MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A diagonal matrix is a square matrix in which every entry outside the main diagonal is zero.

Example:

  A = [2  0  0]
      [0  5  0]
      [0  0  7]

The entries 2, 5, 7 form the main diagonal.

An identity matrix is a special type of diagonal matrix where every diagonal entry is 1.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. SCALAR MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A scalar matrix is a diagonal matrix in which all diagonal entries are equal.

Example:

  A = [4  0  0]
      [0  4  0]
      [0  0  4]

This can be written as:

  A = 4I

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. UPPER TRIANGULAR MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An upper triangular matrix has zeros below the main diagonal.

Example:

  A = [2  3  4]
      [0  5  6]
      [0  0  7]

Upper triangular matrices are important in Gaussian Elimination, LU Decomposition, and solving systems of equations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. LOWER TRIANGULAR MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A lower triangular matrix has zeros above the main diagonal.

Example:

  A = [2  0  0]
      [3  5  0]
      [4  6  7]

Lower triangular matrices are also important in LU Decomposition and forward substitution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. MATRIX EQUALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Two matrices are equal if they have:

  1. The same dimensions
  2. Corresponding entries that are equal

Example:

  A = [1  2]    B = [1  2]
      [3  4]        [3  4]

are equal.

Therefore:

  A = B

However:

  [1  2]    and    [1  2  3]
  [3  4]           [4  5  6]

cannot be equal because they have different dimensions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. MATRIX ADDITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Two matrices can be added only if they have the same dimensions.

Suppose:

  A = [1  2]    B = [5  6]
      [3  4]        [7  8]

Add corresponding entries:

  A + B = [1+5  2+6] = [6   8]
          [3+7  4+8]   [10 12]

Therefore:

  A + B = [6   8]
          [10 12]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. MATRIX SUBTRACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrix subtraction works in the same way as addition.

Using the same matrices:

  A - B = [1-5  2-6] = [-4  -4]
          [3-7  4-8]   [-4  -4]

Therefore:

  A - B = [-4  -4]
          [-4  -4]

Again, the matrices must have the same dimensions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. SCALAR MULTIPLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix can be multiplied by a scalar by multiplying every entry by that scalar.

Example:

  A = [1  2]
      [3  4]

Multiplying by 3:

  3A = 3[1  2] = [3   6]
       [3  4]   [9  12]

Therefore:

  3A = [3   6]
       [9  12]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. MATRIX MULTIPLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrix multiplication is different from ordinary multiplication.

Two matrices A and B can be multiplied when the number of columns of A equals the number of rows of B.

If A is m×n and B is n×p, then AB will have dimension m×p.

Example:

  A = [1  2]    B = [5  6]
      [3  4]        [7  8]

Calculate the first entry:

  (1)(5) + (2)(7) = 19

The second entry is:

  (1)(6) + (2)(8) = 22

The third entry is:

  (3)(5) + (4)(7) = 43

The fourth entry is:

  (3)(6) + (4)(8) = 50

Therefore:

  AB = [19 22]
       [43 50]

Matrix multiplication follows the row-by-column rule.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

17. MATRIX MULTIPLICATION IS NOT COMMUTATIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For ordinary numbers:

  ab = ba

However, for matrices, this is generally not true.

In general:

  AB ≠ BA

This is one of the most important differences between ordinary arithmetic and matrix arithmetic.

Sometimes AB exists while BA does not even exist because of incompatible dimensions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

18. TRANSPOSE OF A MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The transpose of a matrix is obtained by changing its rows into columns and its columns into rows.

The transpose of A is written as Aᵀ.

Example:

  A = [1  2  3]
      [4  5  6]

Then:

  Aᵀ = [1  4]
       [2  5]
       [3  6]

A 2×3 matrix becomes a 3×2 matrix after transposition.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

19. SYMMETRIC MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A square matrix is symmetric if:

  Aᵀ = A

Example:

  A = [1  2  3]
      [2  4  5]
      [3  5  6]

Taking the transpose gives the same matrix.

Therefore:

  A is symmetric.

Symmetric matrices appear frequently in optimization, statistics, geometry, and many areas of applied Linear Algebra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

20. DETERMINANT OF A MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The determinant is a scalar value associated with a square matrix.

For a 2×2 matrix:

  A = [a  b]
      [c  d]

the determinant is:

  det(A) = ad - bc

Example:

  A = [2  3]
      [1  4]

Then:

  det(A) = (2)(4) - (3)(1) = 8 - 3 = 5

Therefore:

  det(A) = 5

The determinant is important for determining whether a square matrix has an inverse.

If det(A) ≠ 0, then A is invertible.

If det(A) = 0, then A is singular and does not have an inverse.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

21. MATRIX INVERSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The inverse of a square matrix A is written as A⁻¹.

It satisfies:

  A A⁻¹ = A⁻¹ A = I

Example:

  A = [2  1]
      [3  2]

Its inverse is:

  A⁻¹ = [2  -1]
        [-3  2]

Multiplying them gives:

  [2  1] [2  -1] = [1  0] = I
  [3  2] [-3  2]   [0  1]

Matrix inverses are useful for solving systems of equations:

  A x = b

If A⁻¹ exists:

  x = A⁻¹ b

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

22. MATRICES AND SYSTEMS OF LINEAR EQUATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most important uses of matrices is representing systems of linear equations.

Consider:

  2x + y = 5
  3x + 2y = 8

This can be written as:

  [2  1] [x] = [5]
  [3  2] [y]   [8]

In compact form:

  A x = b

This representation allows us to use techniques such as:
  • Gaussian Elimination
  • Gauss-Jordan Elimination
  • Matrix Inverses
  • LU Decomposition
  • Cramer's Rule
  • Least Squares

to solve systems efficiently.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

23. AUGMENTED MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A system of equations can also be represented using an augmented matrix.

For:

  2x + y = 5
  3x + 2y = 8

the augmented matrix is:

  [2  1 | 5]
  [3  2 | 8]

The vertical line separates the coefficient matrix from the constants.

Row operations can then be applied to solve the system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

24. ROW OPERATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

There are three elementary row operations:

  1. Row Swap: Exchange two rows
     R₁ ↔ R₂

  2. Row Scaling: Multiply a row by a nonzero scalar
     R₁ → cR₁

  3. Row Replacement: Add a multiple of one row to another
     R₂ → R₂ + cR₁

These operations form the foundation of Gaussian Elimination and Gauss-Jordan Elimination.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

25. RANK OF A MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The rank of a matrix is the maximum number of linearly independent rows or columns.

It can also be described as the dimension of the matrix's column space:

  rank(A) = dim(Col(A))

Example:

  A = [1  2]
      [2  4]

The second row is twice the first:

  [2  4] = 2[1  2]

Therefore, there is only one independent row.

Thus:

  rank(A) = 1

Rank provides important information about whether a system has unique solutions, infinitely many solutions, or no solutions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

26. MATRICES AS LINEAR TRANSFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrices are not only tables of numbers. They can also represent linear transformations.

If:

  A = [2  0]
      [0  3]

then:

  T(x, y) = (2x, 3y)

This transformation stretches the x-direction by 2 and the y-direction by 3.

Therefore:

  T(x) = A x

provides a connection between matrices and geometry.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

27. MATRIX AND VECTOR RELATIONSHIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A vector can be represented as a column matrix:

  x = [x₁]
      [x₂]
      [⋮ ]
      [xₙ]

When a matrix multiplies a vector, A x, the matrix transforms the vector.

Example:

  A = [1  2]    x = [2]
      [3  4]        [1]

Then:

  A x = [1(2) + 2(1)] = [4]
        [3(2) + 4(1)]   [10]

Therefore:

  A x = [4 ]
        [10]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

28. MATRICES AND EIGENVALUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrices also play an important role in eigenvalues and eigenvectors.

An eigenvector v of a matrix A satisfies:

  A v = λ v

where λ is the eigenvalue.

This means that applying the matrix to an eigenvector changes its magnitude but does not change its fundamental direction.

Eigenvalues and eigenvectors are important in:
  • Differential equations
  • Physics
  • Data science
  • Machine learning
  • Stability analysis
  • Principal Component Analysis
  • Quantum mechanics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

29. MATRICES AND DIAGONALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Some matrices can be expressed in the form:

  A = P D P⁻¹

where D is a diagonal matrix.

This process is called diagonalization.

Diagonal matrices are much easier to work with than general matrices, which is why diagonalization is useful for simplifying matrix powers and many other calculations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

30. APPLICATIONS OF MATRICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrices are used in many fields.

Computer Graphics
  • Rotation, scaling, reflection, projection
  • Translation using homogeneous coordinates
  • Transforming images and 3D objects efficiently

Computer Science
  • Algorithms, graphs, image processing
  • Artificial intelligence and computer vision

Machine Learning
  • Data represented as matrices
  • Large numbers of matrix operations during training and prediction

Engineering
  • Modeling forces, circuits, structures
  • Control systems and physical systems

Economics
  • Representing relationships between industries
  • Resources, prices, and economic variables

Statistics
  • Covariance matrices, regression
  • Data analysis and multivariate statistics

Robotics
  • Describing position, orientation, and movement of robotic components

Image Processing
  • Digital image as a matrix of pixel values

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

31. IMPORTANT MATRIX CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When studying matrices, it is important to understand the following concepts:

  • Matrix Dimensions
  • Matrix Addition
  • Scalar Multiplication
  • Matrix Multiplication
  • Transpose
  • Determinant
  • Inverse
  • Rank
  • Row Reduction
  • Matrix Factorization
  • Linear Transformations
  • Eigenvalues and Eigenvectors

These concepts form the foundation for more advanced topics in Linear Algebra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, a Matrix is a rectangular arrangement of numbers, symbols, or expressions organized into rows and columns.

A matrix can be used to represent mathematical information and perform operations efficiently.

Example:

  A = [1  2]
      [3  4]

is a 2×2 matrix.

Matrices can be:
  • Added and subtracted
  • Multiplied by scalars
  • Multiplied by other matrices
  • Transposed
  • Inverted, when possible
  • Reduced using row operations
  • Used to calculate determinants
  • Used to represent linear transformations
  • Used to solve systems of equations
  • Used to study eigenvalues and eigenvectors

Common Matrix Types:

  • Row Matrix:   1 × n
  • Column Matrix: m × 1
  • Square Matrix: m = n
  • Zero Matrix:  all entries are 0
  • Identity Matrix: I (diagonal entries = 1)
  • Diagonal Matrix: non-diagonal entries = 0
  • Scalar Matrix: diagonal entries all equal
  • Upper Triangular: zeros below diagonal
  • Lower Triangular: zeros above diagonal
  • Symmetric Matrix: Aᵀ = A

The key idea to remember:

  A matrix is more than just an arrangement of numbers; it is a powerful mathematical tool for representing data, solving systems of equations, and describing transformations between vector spaces.

Matrices form one of the central foundations of Linear Algebra and connect directly to vectors, systems of equations, linear transformations, determinants, inverses, LU Decomposition, eigenvalues, diagonalization, least squares, and many real-world applications.
  `,
  examples: [
    "Matrix addition: A + B = [[1+5,2+6],[3+7,4+8]] = [[6,8],[10,12]]",
    "Scalar multiplication: 3A = [[3,6],[9,12]]",
    "Matrix multiplication: [[1,2],[3,4]] × [[5,6],[7,8]] = [[19,22],[43,50]]",
    "Transpose: Aᵀ = [[1,4],[2,5],[3,6]] for A = [[1,2,3],[4,5,6]]",
    "Symmetric matrix: A = [[1,2,3],[2,4,5],[3,5,6]]",
    "Determinant: det([[2,3],[1,4]]) = 5",
    "Inverse: A⁻¹ = [[2,-1],[-3,2]] for A = [[2,1],[3,2]]",
    "Rank: rank([[1,2],[2,4]]) = 1",
    "Identity matrix: I₂ = [[1,0],[0,1]]",
    "Zero matrix: 0 = [[0,0],[0,0]]",
    "Diagonal matrix: [[2,0,0],[0,5,0],[0,0,7]]",
    "Upper triangular: [[2,3,4],[0,5,6],[0,0,7]]",
    "Lower triangular: [[2,0,0],[3,5,0],[4,6,7]]",
    "Multiply 2x2 matrices",
    "Identify an example of a symmetric matrix.",
  ],
};

export default topic;