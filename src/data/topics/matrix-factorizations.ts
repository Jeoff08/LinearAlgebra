const topic = {
  id: "matrix-factorizations",
  title: "Matrix Factorizations",
  summary:
    "Overview of common factorizations: LU, QR, Cholesky, SVD and eigen decompositions.",
  details: `
Matrix Factorization is the process of breaking a matrix into the product of two or more simpler matrices. Instead of working directly with a large or complicated matrix, we factor it into simpler components that are easier to understand, calculate, and use.

The general idea is:

  A = A₁ A₂ ... Aₖ

where A is the original matrix and A₁, A₂, ..., Aₖ are simpler matrices.

Matrix factorization is one of the most important techniques in computational Linear Algebra because many difficult matrix problems become easier after the matrix has been factorized.

For example, instead of solving a system directly using:

  A x = b

we can factor A into simpler matrices and solve several easier systems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. WHY DO WE FACTOR MATRICES?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrix factorization is useful because complicated matrices can be difficult to work with directly.

For example, suppose:

  A x = b

If we factor A as:

  A = L U

then:

  L U x = b

Instead of solving one complicated system, we can solve:

  L y = b

and then:

  U x = y

This is much easier because L and U are triangular matrices.

Therefore, matrix factorization allows us to simplify calculations, improve efficiency, and reveal important properties of matrices.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. LU DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most important matrix factorizations is LU Decomposition.

In LU Decomposition, a matrix A is factored into:

  A = L U

where:
  • L is a lower triangular matrix
  • U is an upper triangular matrix

Example:

  A = [2   1   1]
      [4  -6   0]
      [-2  7   2]

It can be decomposed as:

  L = [1    0   0]    U = [2   1   1]
      [2    1   0]        [0  -8  -2]
      [-1  -1   1]        [0   0   1]

Thus:

  A = L U

LU Decomposition is closely related to Gaussian Elimination because the elimination multipliers used during elimination are stored in L, while the resulting upper triangular matrix becomes U.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. QR DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Another important factorization is QR Decomposition.

In QR Decomposition:

  A = Q R

where:
  • Q is an orthogonal matrix
  • R is an upper triangular matrix

An orthogonal matrix satisfies:

  Qᵀ Q = I

The columns of Q are therefore orthonormal.

Example:

  A = [1  1]
      [1  0]

QR Decomposition transforms the columns of A into an orthonormal set represented by Q, while R contains the coefficients needed to reconstruct A.

QR Decomposition is especially important for solving least-squares problems.

For example, if we want to approximate a system:

  A x ≈ b

QR Decomposition provides a numerically useful way of finding the best approximation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. CHOLESKY DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cholesky Decomposition is a specialized factorization used for certain symmetric positive-definite matrices.

The decomposition has the form:

  A = L Lᵀ

where L is a lower triangular matrix.

Example:

  A = [4  2]
      [2  5]

We can write:

  L = [2  0]
      [1  2]

Then:

  Lᵀ = [2  1]
       [0  2]

Multiplying:

  L Lᵀ = [2  0] [2  1] = [4  2]
          [1  2] [0  2]   [2  5]

Thus:

  A = L Lᵀ

Cholesky Decomposition is computationally efficient and is widely used in numerical methods.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. EIGENVALUE DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Another important factorization is Eigenvalue Decomposition.

If a square matrix A has enough linearly independent eigenvectors, it can be written as:

  A = P D P⁻¹

where:
  • P contains the eigenvectors of A
  • D is a diagonal matrix containing the eigenvalues
  • P⁻¹ is the inverse of P

Example:

  A = [2  0]
      [0  3]

The eigenvalues are 2 and 3.

Since the matrix is already diagonal:

  P = I    and    D = [2  0]
                      [0  3]

Therefore:

  A = P D P⁻¹

Eigenvalue decomposition is important for understanding the behavior of linear transformations and is used in areas such as differential equations, physics, statistics, and machine learning.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. SINGULAR VALUE DECOMPOSITION (SVD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most powerful matrix factorizations is Singular Value Decomposition, commonly called SVD.

SVD expresses a matrix as:

  A = U Σ Vᵀ

where:
  • U is an orthogonal matrix
  • Σ is a diagonal-like matrix containing the singular values
  • Vᵀ is the transpose of an orthogonal matrix

Unlike eigenvalue decomposition, SVD can be applied to any matrix, including rectangular matrices.

Example: A 3×2 matrix can still have an SVD:

  A = U Σ Vᵀ

This makes SVD extremely useful in practical applications.

────────────────────────────────────────────────────────────────────────────────

Understanding SVD Conceptually

SVD can be understood as breaking a transformation into three simpler operations.

  1. Vᵀ rotates or reflects the input space
  2. Σ scales the resulting vector along specific directions
  3. U rotates or reflects the result into the output space

Conceptually:

  Input → Vᵀ → Σ → U → Output

This makes SVD particularly powerful for understanding how a matrix transforms space.

────────────────────────────────────────────────────────────────────────────────

Example of SVD

Suppose:

  A = [3  0]
      [0  2]

This matrix already has an especially simple SVD.

We can choose:

  U = [1  0]    Σ = [3  0]    Vᵀ = [1  0]
      [0  1]        [0  2]          [0  1]

Therefore:

  A = U Σ Vᵀ

The singular values are 3 and 2.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. SCHUR DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Schur Decomposition is another important matrix factorization.

For a complex square matrix A, Schur Decomposition expresses the matrix as:

  A = Q T Q*

where:
  • Q is a unitary matrix
  • T is an upper triangular matrix
  • Q* is the conjugate transpose of Q

For real matrices, a corresponding real Schur form can also be used.

Schur Decomposition is particularly useful in numerical Linear Algebra because it provides a stable way of analyzing eigenvalues.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. POLAR DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Polar Decomposition expresses a matrix as a product involving an orthogonal or unitary matrix and a positive semidefinite matrix.

For a suitable square matrix:

  A = Q S

where:
  • Q is orthogonal or unitary
  • S is symmetric positive semidefinite

Conceptually, it separates a transformation into a rotation/reflection component and a stretching component.

This makes Polar Decomposition useful when studying the geometric behavior of matrix transformations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. LDLᵀ DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For certain symmetric matrices, we can use LDLᵀ Decomposition:

  A = L D Lᵀ

where:
  • L is lower triangular
  • D is diagonal
  • Lᵀ is the transpose of L

This is closely related to Cholesky Decomposition.

Example:

  A = [4  2]
      [2  5]

can be represented using:

  L = [1    0]    D = [4  0]
      [1/2  1]        [0  4]

Thus:

  A = L D Lᵀ

LDLᵀ Decomposition is useful because it can avoid square roots that appear in Cholesky Decomposition.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. COMPARING THE MAJOR MATRIX FACTORIZATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Factorization      Form              Main Purpose
-----------------  ----------------  ------------------------------------------
LU                 A = L U            Solving systems efficiently
QR                 A = Q R            Least squares and orthogonalization
Cholesky           A = L Lᵀ           Symmetric positive-definite matrices
Eigenvalue         A = P D P⁻¹       Eigenvalues and eigenvectors
SVD                A = U Σ Vᵀ        Data analysis, compression, least squares
Schur              A = Q T Q*        Numerical eigenvalue analysis
Polar              A = Q S            Separating rotation and stretching
LDLᵀ               A = L D Lᵀ        Symmetric matrix factorization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. MATRIX FACTORIZATION AND LINEAR SYSTEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose we have:

  A x = b

Different factorizations can provide different ways to solve the system.

With LU:

  A = L U

We solve:

  L y = b    and then    U x = y

With QR:

  A = Q R

For a least-squares problem:

  A x ≈ b

we can use the orthogonality of Q to obtain a simpler system involving R.

With Cholesky:

  A = L Lᵀ

we can solve:

  L y = b    and then    Lᵀ x = y

Thus, different factorizations are chosen depending on the properties of the matrix and the problem being solved.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. MATRIX FACTORIZATION AND LEAST SQUARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrix factorization is particularly important in least squares.

Suppose a system does not have an exact solution:

  A x = b

Instead, we want the vector x that gives the best approximation:

  A x ≈ b

QR Decomposition and SVD are two important approaches.

For example, QR gives:

  A = Q R

Because Q has orthonormal columns, we can use:

  Qᵀ Q = I

to simplify the problem.

SVD can also solve least-squares problems and provides additional information about the rank and numerical stability of the matrix.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. MATRIX FACTORIZATION AND DATA COMPRESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD is especially important in data compression.

Suppose a large image is represented by a matrix A.

Its SVD is:

  A = U Σ Vᵀ

The singular values in Σ can be arranged from largest to smallest.

The largest singular values usually contain the most important information about the original matrix.

Instead of keeping every singular value, we can keep only the largest k:

  A ≈ Uₖ Σₖ Vₖᵀ

This produces a lower-rank approximation of the original matrix.

Therefore, a large image can sometimes be represented using significantly fewer values while maintaining much of its visual information.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. MATRIX FACTORIZATION IN MACHINE LEARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrix factorization is widely used in machine learning and data science.

For example, SVD can be used for dimensionality reduction.

A large dataset can contain hundreds or thousands of features.

SVD can identify important directions in the data and represent the dataset using fewer dimensions.

This can make data:
  • Easier to visualize
  • Faster to process
  • Less computationally expensive
  • Easier to analyze

SVD is also closely related to Principal Component Analysis (PCA).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. MATRIX FACTORIZATION IN RECOMMENDATION SYSTEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrix factorization is also commonly used in recommendation systems.

Imagine a matrix where rows represent users and columns represent movies:

  R = [5  4  ?  1]
      [4  ?  5  2]
      [?  5  4  4]
      [1  2  ?  5]

A question mark represents a movie that a user has not rated.

Matrix factorization can approximate this large rating matrix using smaller matrices:

  R ≈ U Vᵀ

where U represents hidden characteristics of users and V represents hidden characteristics of movies.

The system can then use these hidden factors to predict missing ratings and recommend movies to users.

This idea is widely associated with collaborative filtering.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. MATRIX FACTORIZATION IN COMPUTER GRAPHICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrix factorizations are also useful in computer graphics.

Transformation matrices can be analyzed or decomposed into components representing:
  • Rotation
  • Scaling
  • Reflection
  • Shearing

This helps computer systems understand and manipulate transformations applied to objects.

For example, a complex transformation may be represented as several simpler transformations:

  A = A₁ A₂ A₃

Instead of viewing the transformation as one complicated operation, we can understand it as a sequence of simpler operations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

17. MATRIX FACTORIZATION IN SCIENTIFIC COMPUTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Large scientific problems often produce systems such as:

  A x = b

Examples include:
  • Physical simulations
  • Structural analysis
  • Fluid dynamics
  • Heat transfer
  • Electrical systems
  • Engineering models

Factoring A can make these systems much more efficient to solve.

For large matrices, specialized numerical algorithms can perform factorizations efficiently and repeatedly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

18. CHOOSING THE APPROPRIATE FACTORIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Different matrix problems require different factorizations.

  • If the goal is to solve a general system of equations → LU Decomposition

  • If the matrix is symmetric positive-definite → Cholesky Decomposition

  • If the problem involves least squares → QR Decomposition

  • If the matrix is being analyzed for eigenvalues → Eigenvalue or Schur Decomposition

  • If the matrix is rectangular, rank-deficient, or requires a robust decomposition → SVD

Therefore, there is no single matrix factorization that is best for every problem.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

19. IMPORTANT RELATIONSHIP BETWEEN FACTORIZATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Many matrix factorizations are connected.

  A = L U          → connected to Gaussian Elimination

  A = Q R          → connected to Gram-Schmidt orthogonalization

  A = L Lᵀ        → related to LU, takes advantage of symmetry

  A = P D P⁻¹     → based on eigenvalues and eigenvectors

  A = U Σ Vᵀ      → more general, applies to rectangular matrices

Understanding these relationships helps show that matrix factorization is not a collection of unrelated techniques; rather, these methods are different ways of breaking matrices into useful mathematical components.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, Matrix Factorization is the process of expressing a complicated matrix as a product of simpler matrices.

The general idea is:

  A = A₁ A₂ ... Aₖ

The most important matrix factorizations include:

  1. LU Decomposition:      A = L U
     • Useful for solving systems of equations

  2. QR Decomposition:      A = Q R
     • Useful for least squares and orthogonalization

  3. Cholesky Decomposition: A = L Lᵀ
     • Useful for symmetric positive-definite matrices

  4. Eigenvalue Decomposition: A = P D P⁻¹
     • Useful for studying eigenvalues and eigenvectors

  5. SVD: A = U Σ Vᵀ
     • Useful for data analysis, compression, dimensionality reduction

  6. Schur Decomposition:   A = Q T Q*
     • Useful for numerical eigenvalue analysis

  7. Polar Decomposition:   A = Q S
     • Separates rotation and stretching

  8. LDLᵀ Decomposition:    A = L D Lᵀ
     • Useful for certain symmetric matrices

Key Applications:

  • Solving linear systems efficiently
  • Least squares approximation
  • Data compression and dimensionality reduction
  • Recommendation systems
  • Computer graphics transformations
  • Machine learning and data science
  • Scientific computing and simulations

The key idea to remember:

  Matrix Factorization breaks a complicated matrix into simpler matrices so that mathematical problems such as solving systems, finding approximations, analyzing data, and understanding transformations become easier and more efficient.

Matrix factorization is therefore an important bridge between basic Matrix Algebra and advanced topics such as LU Decomposition, QR Decomposition, Eigenvalues, SVD, Least Squares, Numerical Linear Algebra, Machine Learning, Data Science, and Scientific Computing.
  `,
  examples: [
    "LU: A = [[2,1,1],[4,-6,0],[-2,7,2]] = L U",
    "QR: A = Q R with Q orthogonal, R upper triangular",
    "Cholesky: A = L Lᵀ for symmetric positive-definite A",
    "Eigenvalue: A = P D P⁻¹ with D diagonal",
    "SVD: A = U Σ Vᵀ for any matrix",
    "Schur: A = Q T Q* with T upper triangular",
    "Polar: A = Q S with Q orthogonal, S symmetric",
    "LDLᵀ: A = L D Lᵀ for symmetric matrices",
    "Choose between Cholesky and LU for a symmetric positive definite matrix",
    "Compare the results of QR and SVD on a simple matrix.",
  ],
};

export default topic;