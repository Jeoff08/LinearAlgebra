const topic = {
  id: "diagonalization",
  title: "Diagonalization",
  summary:
    "Diagonalizable matrices, eigenbasis, similarity transforms and applications to matrix powers.",
  details: `
Diagonalization is an important concept in Linear Algebra that involves rewriting a square matrix as a product of three matrices, where the middle matrix is a diagonal matrix. The main purpose of diagonalization is to transform a complicated matrix into a simpler form that is much easier to analyze and calculate with.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. DEFINITION OF DIAGONALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix A is said to be diagonalizable if it can be written as:

  A = P D P⁻¹

where:
  • A is the original square matrix
  • P is an invertible matrix whose columns are eigenvectors of A
  • D is a diagonal matrix containing the corresponding eigenvalues
  • P⁻¹ is the inverse of P

The important idea is that diagonalization changes the representation of a matrix into a simpler coordinate system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. WHAT IS A DIAGONAL MATRIX?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A diagonal matrix is a square matrix in which all entries outside the main diagonal are zero.

Example:

  D = [2  0  0]
      [0  5  0]
      [0  0  7]

Diagonal matrices are easy to work with because multiplication and powers are much simpler.

For example:

  D² = [2²  0   0  ] = [4  0  0]
       [0   5²  0  ]   [0 25  0]
       [0   0   7² ]   [0  0 49]

In general:

  Dⁿ = [λ₁ⁿ   0    ⋯    0  ]
       [ 0   λ₂ⁿ   ⋯    0  ]
       [ ⋮    ⋮    ⋱    ⋮  ]
       [ 0    0    ⋯   λₙⁿ ]

This simplicity is one of the main reasons diagonalization is useful.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. CONNECTION BETWEEN DIAGONALIZATION AND EIGENVALUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Diagonalization is closely connected to eigenvalues and eigenvectors.

An eigenvector v of a matrix A satisfies:

  A v = λ v

where λ is the corresponding eigenvalue.

  The eigenvectors are used to construct the matrix P.
  The eigenvalues are placed along the diagonal of D.

The basic process is:

  Matrix A → Eigenvalues → Eigenvectors → P → D

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. EXAMPLE OF DIAGONALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider the matrix:

  A = [4  1]
      [2  3]

We want to determine whether A can be diagonalized.

────────────────────────────────────────────────────────────────────────────────

Step 1: Find the Eigenvalues

Eigenvalues are found using the characteristic equation:

  det(A - λI) = 0

First:

  A - λI = [4-λ   1  ]
           [ 2   3-λ]

Calculate the determinant:

  det(A - λI) = (4-λ)(3-λ) - (1)(2)
              = 12 - 4λ - 3λ + λ² - 2
              = λ² - 7λ + 10

Set equal to zero:

  λ² - 7λ + 10 = 0

Factoring gives:

  (λ - 5)(λ - 2) = 0

Therefore, the eigenvalues are:

  λ₁ = 5    and    λ₂ = 2

────────────────────────────────────────────────────────────────────────────────

Step 2: Find the Eigenvectors

For λ = 5:

  (A - 5I)v = 0

  [4-5    1  ] [x] = [0]
  [ 2   3-5 ] [y]   [0]

  [-1   1] [x] = [0]
  [ 2  -2] [y]   [0]

This gives: -x + y = 0, so y = x

Choose x = 1, y = 1

Therefore, one eigenvector is:

  v₁ = [1]
       [1]

For λ = 2:

  (A - 2I)v = 0

  [4-2   1  ] [x] = [0]
  [ 2   3-2 ] [y]   [0]

  [2   1] [x] = [0]
  [2   1] [y]   [0]

This gives: 2x + y = 0, so y = -2x

Choose x = 1, y = -2

Therefore, the second eigenvector is:

  v₂ = [ 1]
       [-2]

────────────────────────────────────────────────────────────────────────────────

Step 3: Construct P

The columns of P are the eigenvectors:

  P = [1   1 ]
      [1  -2 ]

────────────────────────────────────────────────────────────────────────────────

Step 4: Construct D

The corresponding eigenvalues are placed on the main diagonal in the same order as their eigenvectors:

  D = [5  0]
      [0  2]

────────────────────────────────────────────────────────────────────────────────

Step 5: Verify the Diagonalization

Therefore, the diagonalization is:

  A = P D P⁻¹

  [4  1] = [1   1 ] [5  0] [1   1 ]⁻¹
  [2  3]   [1  -2 ] [0  2] [1  -2 ]

The original matrix A = [4 1; 2 3] has been represented using the simpler diagonal matrix D = [5 0; 0 2].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. WHY IS DIAGONALIZATION USEFUL?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the biggest advantages of diagonalization is that it makes matrix powers much easier to calculate.

Suppose we need to calculate A¹⁰. Directly multiplying A by itself ten times would be tedious.

But if A = P D P⁻¹, then:

  A¹⁰ = P D¹⁰ P⁻¹

Since D is diagonal:

  D¹⁰ = [5¹⁰   0  ]
        [ 0   2¹⁰]

This is much easier to calculate than multiplying the original matrix ten times.

  Aⁿ = P Dⁿ P⁻¹

This is one of the most important benefits of diagonalization.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. WHEN IS A MATRIX DIAGONALIZABLE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix is diagonalizable when it has enough linearly independent eigenvectors to form a basis for the vector space.

For an n×n matrix, we need n linearly independent eigenvectors.

  A 2×2 matrix needs 2 linearly independent eigenvectors.
  A 3×3 matrix needs 3 linearly independent eigenvectors.

Key Rules:

  • If a matrix has n distinct eigenvalues, it is diagonalizable.
  • If a matrix has repeated eigenvalues, it may or may not be diagonalizable.
  • The important requirement is whether there are enough linearly independent eigenvectors.

Example - Diagonalizable (Distinct Eigenvalues):

  A = [4  1]  →  λ₁ = 5, λ₂ = 2 (distinct) → Diagonalizable
      [2  3]

Example - Not Diagonalizable (Repeated Eigenvalue, Insufficient Eigenvectors):

  A = [1  1]  →  λ = 1 (repeated), only 1 eigenvector → Not diagonalizable
      [0  1]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. GEOMETRIC MEANING OF DIAGONALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Diagonalization can also be understood geometrically.

A matrix represents a linear transformation. Normally, this transformation may change vectors in a complicated way. However, if we use the eigenvectors as our basis, the transformation becomes much simpler.

Instead of mixing different coordinate directions, the transformation simply stretches or shrinks each eigenvector by its corresponding eigenvalue.

Example:

  A v₁ = 5 v₁  →  The transformation stretches v₁ by a factor of 5
  A v₂ = 2 v₂  →  The transformation stretches v₂ by a factor of 2

This is essentially what the diagonal matrix D represents.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. DIAGONALIZATION AND CHANGE OF BASIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Diagonalization is closely related to Change of Basis.

When we diagonalize a matrix, we are essentially choosing a new basis made up of the matrix's eigenvectors.

  • In the original coordinate system, the transformation is represented by A.
  • After changing to the eigenvector basis, the same transformation is represented by D.

Therefore:

  A = P D P⁻¹

can be understood as:

  Original basis → Eigenvector basis → Simple diagonal transformation

This is why Change of Basis and Diagonalization are strongly connected.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. APPLICATIONS OF DIAGONALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Diagonalization has many applications in mathematics, science, and computer science.

  1. Differential Equations
     • Simplifies systems of equations
     • Makes them easier to solve

  2. Computer Science & Algorithms
     • Makes repeated matrix calculations more efficient
     • Reduces computational complexity

  3. Machine Learning & Data Science
     • Principal Component Analysis (PCA)
     • Analyzing the structure of datasets

  4. Physics
     • Simplifies mathematical models
     • Analyzes physical systems

  5. Computer Graphics
     • Scaling, rotation, and movement transformations
     • Understanding eigenstructure of transformations

  6. Dynamical Systems
     • Repeated application of transformations
     • Matrix powers represent system evolution

  7. Markov Chains
     • Finding steady-state distributions
     • Analyzing long-term behavior

  8. Control Systems
     • Stability analysis
     • System response analysis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Diagonalization is the process of representing a matrix in a simpler diagonal form using its eigenvalues and eigenvectors.

  A = P D P⁻¹

  • P contains the linearly independent eigenvectors
  • D contains the corresponding eigenvalues

The main steps are:

  1. Find the eigenvalues
  2. Find the eigenvectors
  3. Place the eigenvectors into P
  4. Place the corresponding eigenvalues into D
  5. Verify that A = P D P⁻¹

The biggest advantage is that complicated calculations, especially matrix powers, become much easier:

  Aⁿ = P Dⁿ P⁻¹

The key idea to remember:

  Diagonalization changes a complicated matrix into a simpler diagonal matrix by using the matrix's eigenvectors as a new basis.
  `,
  examples: [
    "Diagonalize A = [[4,1],[2,3]] with eigenvalues λ₁=5, λ₂=2",
    "Eigenvector for λ=5: v₁ = [1,1]ᵀ",
    "Eigenvector for λ=2: v₂ = [1,-2]ᵀ",
    "P = [[1,1],[1,-2]], D = [[5,0],[0,2]]",
    "Compute A¹⁰ using diagonalization: A¹⁰ = P D¹⁰ P⁻¹",
    "D¹⁰ = [[5¹⁰,0],[0,2¹⁰]]",
    "2×2 matrix with distinct eigenvalues → diagonalizable",
    "2×2 matrix with repeated eigenvalues → may not be diagonalizable",
    "Diagonalize a matrix with distinct eigenvalues",
    "Compute A^10 using diagonalization.",
  ],
};

export default topic;