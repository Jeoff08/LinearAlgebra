const topic = {
  id: "qr",
  title: "QR Factorization",
  summary:
    "QR decomposition, relation to Gram–Schmidt, and solving least-squares problems.",
  details: `
QR Factorization, also called QR Decomposition, is a method in Linear Algebra that factors a matrix into the product of two matrices: an orthogonal matrix (Q) and an upper triangular matrix (R).

The basic formula is:

  A = Q R

where:
  • A is the original matrix
  • Q is an orthogonal matrix whose columns are orthonormal vectors
  • R is an upper triangular matrix

QR Factorization is especially important in Orthogonality, Least Squares, Numerical Linear Algebra, and Eigenvalue Computation.

The main idea is:

  QR Factorization takes a matrix and separates it into an orthogonal part (Q) and an upper triangular part (R).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. WHAT DOES QR MEAN?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The name comes directly from the two matrices involved:

  Q = Orthogonal Matrix
  R = Upper Triangular Matrix

Therefore:

  A = Q R

The columns of Q are orthonormal, which means:

  Qᵀ Q = I

The matrix R has zeros below its main diagonal:

  R = [r₁₁  r₁₂  r₁₃]
      [0    r₂₂  r₂₃]
      [0    0    r₃₃]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. WHY IS QR FACTORIZATION IMPORTANT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QR Factorization is useful because it transforms a general matrix into a form that is easier and more stable to work with.

It is commonly used for:
  • Solving Least-Squares problems
  • Orthogonalization
  • Numerical Linear Algebra
  • Eigenvalue computation
  • Data analysis
  • Scientific computing
  • Machine Learning

One of its biggest advantages is that it can be numerically more stable than directly solving normal equations in many least-squares problems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. RELATIONSHIP TO ORTHOGONALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QR Factorization is closely connected to the concept of orthogonality.

Suppose the columns of A are:

  a₁, a₂, ..., aₙ

QR Factorization transforms these columns into orthonormal vectors:

  q₁, q₂, ..., qₙ

These vectors become the columns of Q:

  Q = [|    |        |]
      [q₁   q₂  ...  qₙ]
      [|    |        |]

Because the columns are orthonormal:

  Qᵀ Q = I

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. EXAMPLE OF QR FACTORIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider:

  A = [1  1]
      [1  0]

We want to factor A into:

  A = Q R

The columns of A are:

  a₁ = [1]    a₂ = [1]
       [1]         [0]

We can use the Gram-Schmidt Process to turn these vectors into an orthonormal set.

────────────────────────────────────────────────────────────────────────────────

Step 1: Find the First Orthogonal Vector

Let:

  u₁ = a₁

Therefore:

  u₁ = [1]
       [1]

Its length is:

  ||u₁|| = √(1² + 1²) = √2

Normalize it:

  q₁ = u₁ / ||u₁||

Therefore:

  q₁ = [1/√2]
       [1/√2]

────────────────────────────────────────────────────────────────────────────────

Step 2: Find the Second Orthogonal Vector

Start with:

  a₂ = [1]
       [0]

Remove its projection onto q₁:

  u₂ = a₂ - (q₁ᵀ a₂) q₁

Calculate:

  q₁ᵀ a₂ = 1/√2

Therefore:

  u₂ = [1] - (1/√2)[1/√2] = [1/2]
       [0]          [1/√2]   [-1/2]

Its length is:

  ||u₂|| = 1/√2

Normalize it:

  q₂ = u₂ / ||u₂||

Thus:

  q₂ = [1/√2]
       [-1/√2]

────────────────────────────────────────────────────────────────────────────────

Step 3: Construct Q

Place the orthonormal vectors into the columns of Q:

  Q = [1/√2   1/√2]
      [1/√2  -1/√2]

Notice that:

  Qᵀ Q = I

Therefore, Q is orthogonal.

────────────────────────────────────────────────────────────────────────────────

Step 4: Find R

The matrix R can be calculated using:

  R = Qᵀ A

For this example:

  R = [√2     1/√2]
      [0      1/√2]

Therefore, the QR Factorization is:

  A = [1/√2   1/√2] [√2     1/√2]
      [1/√2  -1/√2] [0      1/√2]

The first matrix is Q, and the second matrix is R.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. VERIFYING QR FACTORIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We can verify the result by multiplying Q and R:

  Q R = [1/√2   1/√2] [√2     1/√2]
        [1/√2  -1/√2] [0      1/√2]

The result is:

  Q R = [1  1]
        [1  0]

Therefore:

  Q R = A

The factorization is correct.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. QR FACTORIZATION USING GRAM-SCHMIDT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One common way of computing QR Factorization is the Gram-Schmidt Process.

The general idea is:

  A → orthogonal vectors → orthonormal vectors → Q → R

The process takes the columns of A and makes them orthonormal.

The resulting orthonormal vectors form Q, while the coefficients used during the process form R.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. MODIFIED GRAM-SCHMIDT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The standard Gram-Schmidt process can sometimes suffer from numerical errors when implemented on a computer.

A variation called Modified Gram-Schmidt improves numerical behavior.

Instead of performing certain projections all at once, Modified Gram-Schmidt updates the vectors sequentially.

This makes it more suitable for numerical computation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. HOUSEHOLDER REFLECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Another important way to calculate QR Factorization is through Householder transformations.

A Householder transformation uses an orthogonal matrix to introduce zeros below the diagonal.

For example, a column such as:

  [a]
  [b]
  [c]

can be transformed into something like:

  [r]
  [0]
  [0]

Repeated transformations can turn A into an upper triangular matrix R.

The accumulated orthogonal transformations form Q.

Householder QR is often preferred in numerical software because it is generally more numerically stable than classical Gram-Schmidt.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. GIVENS ROTATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Another technique is the Givens Rotation.

A Givens rotation is an orthogonal transformation that can eliminate an individual matrix element.

For example, it can transform:

  [a]
  [b]

into:

  [r]
  [0]

This is useful when we want to eliminate individual entries below the diagonal.

Givens rotations are particularly useful for:
  • Sparse matrices
  • Incremental computations
  • Numerical algorithms
  • QR updates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. QR FACTORIZATION FOR LEAST SQUARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most important applications of QR Factorization is solving Least-Squares Problems.

Suppose we have:

  A x ≈ b

If:

  A = Q R

then:

  Q R x ≈ b

Because Q is orthogonal, we can multiply by Qᵀ:

  Qᵀ Q R x = Qᵀ b

Since:

  Qᵀ Q = I

we obtain:

  R x = Qᵀ b

Because R is upper triangular, we can solve this system efficiently using back substitution.

────────────────────────────────────────────────────────────────────────────────

Example of Least Squares Using QR

Suppose we want to approximate data points using a linear model:

  y = a + bx

The problem can be written as:

  A [a] ≈ y
    [b]

For data points (x₁, y₁), ..., (xₙ, yₙ):

  A = [1  x₁]
      [1  x₂]
      [⋮  ⋮]
      [1  xₙ]

Instead of solving the normal equations directly, we can calculate:

  A = Q R

Then solve:

  R x = Qᵀ y

This gives the coefficients a and b for the best-fitting line.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. WHY QR IS BETTER FOR LEAST SQUARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The normal equations are:

  Aᵀ A x = Aᵀ b

Although this method works, calculating Aᵀ A can make numerical errors worse when A is poorly conditioned.

QR Factorization avoids explicitly forming Aᵀ A.

Instead, we use:

  R x = Qᵀ b

This is often numerically more stable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. QR ALGORITHM FOR EIGENVALUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QR Factorization is also used in one of the most important algorithms for finding eigenvalues: the QR Algorithm.

Starting with a matrix:

  A₀ = A

we factor it:

  Aₖ = Qₖ Rₖ

Then reverse the order:

  Aₖ₊₁ = Rₖ Qₖ

The process is repeated:

  A₀ → A₁ → A₂ → A₃ → ...

Under suitable conditions, the matrices approach a form from which the eigenvalues can be read.

This is one reason QR Factorization is fundamental to numerical Linear Algebra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. QR FACTORIZATION AND MACHINE LEARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QR Factorization can also be used in Machine Learning and Data Science.

It can help with:
  • Least-squares regression
  • Numerical optimization
  • Solving linear systems
  • Orthogonalization
  • Dimensionality-related computations
  • Stable numerical calculations

For example, when fitting a regression model, QR Factorization can provide a stable way to calculate model parameters.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. QR FACTORIZATION AND COMPUTER GRAPHICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Orthogonal matrices are important in computer graphics because they preserve lengths and angles.

Since QR Factorization produces an orthogonal matrix Q, it is connected to geometric transformations.

Orthogonal transformations can represent operations such as:
  • Rotation
  • Reflection
  • Coordinate changes

This makes QR-related methods useful in computational geometry and graphics.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. FULL QR VS. REDUCED QR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

There are two commonly discussed forms of QR Factorization.

────────────────────────────────────────────────────────────────────────────────

Full QR Factorization

For an m×n matrix, a full factorization can have:

  Q ∈ ℝ^(m×m)    and    R ∈ ℝ^(m×n)

────────────────────────────────────────────────────────────────────────────────

Reduced QR Factorization

For many applications, only the first n orthonormal columns are needed.

Then:

  Q ∈ ℝ^(m×n)    and    R ∈ ℝ^(n×n)

The reduced form saves memory and computation when m > n.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. QR FACTORIZATION OF A SQUARE MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If A ∈ ℝ^(n×n), then QR Factorization gives:

  A = Q R

where:

  Q ∈ ℝ^(n×n)    and    R ∈ ℝ^(n×n)

The matrix Q is orthogonal:

  Qᵀ Q = I

The matrix R is upper triangular.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

17. QR FACTORIZATION OF A RECTANGULAR MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QR Factorization also works for rectangular matrices.

Example: A ∈ ℝ^(m×n) where m > n.

This situation is common in least-squares problems because there may be more observations than unknown variables.

The reduced QR factorization is:

  A = Q R

with:

  Q ∈ ℝ^(m×n)    and    R ∈ ℝ^(n×n)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

18. IMPORTANT PROPERTIES OF QR FACTORIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The main properties to remember are:

  1. Factorization:       A = Q R
  2. Orthogonality:       Qᵀ Q = I
  3. Inverse of Q:        Q⁻¹ = Qᵀ (for square Q)
  4. R is Upper Triangular: rᵢⱼ = 0 for i > j
  5. Q Preserves Length:  ||Q x|| = ||x||
  6. Q Preserves Inner Products: (Qx)ᵀ(Qy) = xᵀ y

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

19. QR FACTORIZATION VS. LU DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QR Factorization and LU Decomposition are both matrix factorization techniques, but they have different structures.

Feature              QR Factorization              LU Decomposition
------------------   ---------------------------   ---------------------------
Form                 A = Q R                       A = L U
First matrix         Orthogonal (Q)                Lower triangular (L)
Second matrix        Upper triangular (R)          Upper triangular (U)
Main concept         Orthogonality                 Elimination
Least Squares        Excellent                     Less direct
Numerical stability  Generally very good           Good with pivoting
Eigenvalue algos     Very important                Less central

QR is especially valuable when orthogonality and numerical stability are important.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

20. QR FACTORIZATION VS. SVD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QR Factorization and Singular Value Decomposition are both important matrix factorizations.

SVD has the form:

  A = U Σ Vᵀ

QR has the form:

  A = Q R

SVD provides more detailed information about the structure of a matrix, including singular values and rank.

QR is generally less expensive and is very useful for solving least-squares problems and numerical computations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

21. COMPUTATIONAL COMPLEXITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For a dense m×n matrix, computing QR Factorization generally requires more computational work than a basic LU factorization.

For a square n×n matrix, the standard Householder QR process requires approximately:

  O(n³)

operations.

Although this may seem expensive, QR's numerical stability makes it extremely valuable for many scientific and engineering applications.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

22. IMPORTANT QR FACTORIZATION METHODS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When studying QR Factorization, it is useful to know the main methods:

  • Gram-Schmidt: Uses projections to construct orthogonal vectors
  • Modified Gram-Schmidt: A numerically improved version
  • Householder Transformations: Uses reflections to eliminate entries below the diagonal
  • Givens Rotations: Uses rotations to eliminate individual entries

These methods all produce the same basic goal:

  A = Q R

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

23. REAL-WORLD EXAMPLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose a company collects thousands of data points about product sales.

The company wants to build a mathematical model that predicts sales based on:
  • Advertising
  • Price
  • Customer traffic
  • Season
  • Promotions

The data can be represented as a matrix:

  A x ≈ b

Because there are many observations, the system may be overdetermined.

QR Factorization can be used to calculate the least-squares solution efficiently and with good numerical stability.

The resulting model can then be used to predict future sales.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

24. QR FACTORIZATION IN SCIENTIFIC COMPUTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scientists often need to solve large systems generated from experiments or simulations.

QR Factorization can help with:
  • Data fitting
  • Least squares
  • Numerical modeling
  • Eigenvalue calculations
  • Orthogonalization
  • Stability-sensitive computations

Therefore, QR Factorization is an important bridge between theoretical Linear Algebra and practical numerical computation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

25. IMPORTANT CONCEPTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The major concepts associated with QR Factorization are:

  • QR Decomposition
  • A = Q R
  • Orthogonal Matrix
  • Upper Triangular Matrix
  • Qᵀ Q = I
  • Gram-Schmidt
  • Modified Gram-Schmidt
  • Householder Transformations
  • Givens Rotations
  • Least Squares
  • QR Algorithm
  • Numerical Stability

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, QR Factorization is a matrix factorization technique that represents a matrix as:

  A = Q R

where Q is an orthogonal matrix and R is an upper triangular matrix.

The orthogonal matrix satisfies:

  Qᵀ Q = I

QR Factorization is especially important because it provides a numerically stable way to work with matrices.

It is widely used for:
  • Least-Squares problems
  • Linear systems
  • Orthogonalization
  • Eigenvalue computation
  • Numerical Linear Algebra
  • Data analysis
  • Machine Learning
  • Scientific computing

Key Formulas:

  • QR Decomposition:      A = Q R
  • Orthogonality:         Qᵀ Q = I
  • Least Squares:         R x = Qᵀ b
  • Gram-Schmidt:          u₁ = v₁, u₂ = v₂ - proj_u₁(v₂)
  • Householder:           reflection to eliminate entries
  • Givens Rotation:       rotation to eliminate entries

Key Methods:

  • Gram-Schmidt Process
  • Modified Gram-Schmidt
  • Householder Transformations
  • Givens Rotations

The key idea to remember:

  QR Factorization breaks a matrix into an orthogonal component (Q) and an upper triangular component (R), making many Linear Algebra computations easier, more organized, and often more numerically stable.
  `,
  examples: [
    "QR: A = Q R with Q orthogonal, R upper triangular",
    "Example: A = [[1,1],[1,0]] → QR factorization",
    "Q = [[1/√2, 1/√2],[1/√2, -1/√2]]",
    "R = [[√2, 1/√2],[0, 1/√2]]",
    "Verify: Qᵀ Q = I",
    "Gram-Schmidt: u₁ = v₁, u₂ = v₂ - proj_u₁(v₂)",
    "Modified Gram-Schmidt: numerically improved version",
    "Householder: reflection matrix to introduce zeros",
    "Givens: rotation matrix to eliminate entries",
    "Least squares: R x = Qᵀ b",
    "QR Algorithm: Aₖ = Qₖ Rₖ, Aₖ₊₁ = Rₖ Qₖ for eigenvalues",
    "Full QR vs Reduced QR",
    "Square matrix: Q,R ∈ ℝ^(n×n)",
    "Rectangular matrix: Q ∈ ℝ^(m×n), R ∈ ℝ^(n×n)",
    "QR preserves lengths: ||Q x|| = ||x||",
    "Compute the QR decomposition of a 2x2 matrix",
    "Solve a least-squares problem using QR.",
  ],
};

export default topic;