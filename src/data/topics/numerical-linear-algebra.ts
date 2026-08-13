const topic = {
  id: "numerical-linear-algebra",
  title: "Numerical Linear Algebra",
  summary:
    "Numerical stability, floating point errors, and numerical algorithms like iterative methods.",
  details: `
Numerical Linear Algebra is the branch of Linear Algebra that focuses on using computational and numerical methods to solve problems involving vectors, matrices, and systems of linear equations.

While traditional Linear Algebra often focuses on exact mathematical solutions, Numerical Linear Algebra focuses on finding accurate approximations using computers, especially when dealing with very large or complicated problems.

For example, a small system such as:

  2x + y = 5
  3x + 2y = 8

can be solved by hand. However, real-world problems may involve thousands or millions of equations and unknowns. Solving those systems manually would be impractical.

Numerical Linear Algebra provides algorithms that allow computers to solve these problems efficiently.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. WHY IS NUMERICAL LINEAR ALGEBRA IMPORTANT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose a scientific simulation produces the system:

  A x = b

where A contains thousands of rows and columns.

A computer cannot simply "solve for x" in the same way a person solves a small equation on paper. It needs an efficient algorithm.

Numerical Linear Algebra provides methods such as:
  • Gaussian Elimination
  • LU Decomposition
  • QR Decomposition
  • Cholesky Decomposition
  • Iterative Methods
  • Eigenvalue Algorithms
  • Singular Value Decomposition
  • Least-Squares Methods

These methods allow computers to solve large mathematical problems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. EXACT SOLUTIONS VS. NUMERICAL SOLUTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In theoretical Linear Algebra, we may obtain an exact answer such as:

  x = 1/3

A numerical computer algorithm might represent the same value approximately as:

  x ≈ 0.333333

The numerical answer is not necessarily exactly equal to the mathematical value, but it can be extremely close.

This introduces an important concept:

  Approximation

Numerical Linear Algebra is therefore concerned not only with obtaining an answer but also with determining how accurate that answer is.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. EXAMPLE: SOLVING A LINEAR SYSTEM NUMERICALLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider:

  2x + y = 5
  3x + 2y = 8

We can write the system in matrix form:

  A x = b

where:

  A = [2  1]    x = [x]    b = [5]
      [3  2]        [y]        [8]

Using numerical Linear Algebra, we could solve this system using Gaussian Elimination, LU Decomposition, or another numerical method.

The exact solution is:

  x = 2,    y = 1

For a much larger system, the same basic mathematical idea can be implemented using a computer algorithm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. FLOATING-POINT NUMBERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Computers usually cannot represent every real number exactly.

Instead, they use floating-point representation.

For example, a computer may store:

  1/3

approximately as:

  0.3333333333333333

This creates a small difference between the exact mathematical value and the computer's stored value.

This difference is called round-off error.

Example:

  exact value = 1/3
  computer approximation ≈ 0.333333

The difference between the exact value and approximation is an error.

Understanding floating-point arithmetic is one of the most important parts of Numerical Linear Algebra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. NUMERICAL ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Numerical computations can contain different types of errors.

Two important types are:

────────────────────────────────────────────────────────────────────────────────

Round-Off Error

Round-off error occurs because computers use a finite number of digits to represent numbers.

Example: 1/7 cannot be represented exactly using a finite decimal expansion.

The computer must approximate it.

────────────────────────────────────────────────────────────────────────────────

Truncation Error

Truncation error occurs when an infinite or continuous mathematical process is approximated using a finite calculation.

Example: An infinite series might be approximated by keeping only the first few terms:

  1 + 1/2 + 1/4 + 1/8 + ...

If we stop after several terms, the result is an approximation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. FORWARD ERROR AND BACKWARD ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Numerical Linear Algebra also studies how errors affect solutions.

Forward error measures how far the computed answer is from the true answer.

If the exact solution is x and the computed solution is x̂, then the error can be represented as:

  e = x̂ - x

Backward error asks a different question:

  How much would the original problem need to change for the computed answer to be exactly correct?

Backward error is especially important when evaluating the stability of numerical algorithms.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. STABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An algorithm is considered numerically stable when small computational errors do not cause large changes in the final result.

Example: Suppose the exact answer is x = 10.

If a small computational error changes the result to 10.0001, the algorithm may be considered stable for that problem.

However, if the same tiny numerical error causes the answer to become 1000, the algorithm is highly sensitive to numerical errors.

Therefore:

  Stability is about controlling the effect of computational errors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. CONDITIONING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Another important concept is conditioning.

The condition of a problem describes how sensitive its solution is to small changes in the input.

  • A well-conditioned problem does not change much when its input changes slightly.

  • An ill-conditioned problem can change dramatically even when the input changes only a little.

For a matrix A, the condition number is commonly written as κ(A) and, for a nonsingular matrix under a chosen norm:

  κ(A) = ||A|| · ||A⁻¹||

A large condition number generally indicates that the problem is sensitive to errors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. GAUSSIAN ELIMINATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the fundamental numerical methods for solving systems is Gaussian Elimination.

Suppose:

  A x = b

Gaussian Elimination transforms the system into an upper triangular system:

  U x = c

The triangular system can then be solved using back substitution.

Example:

  2x + y = 5
  3x + 2y = 8

We can eliminate x from the second equation and obtain a simpler equation for y.

For large systems, a computer performs these operations systematically.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. LU DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Numerical Linear Algebra also uses LU Decomposition.

The matrix is written as:

  A = L U

where L is lower triangular and U is upper triangular.

Then:

  A x = b

becomes:

  L U x = b

We introduce an intermediate vector y:

  L y = b    followed by    U x = y

LU Decomposition is particularly useful when the same matrix A must be used with many different vectors b.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. PIVOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

During Gaussian Elimination, we sometimes encounter a zero or very small pivot.

Example:

  A = [0  2]
      [1  3]

The first pivot is zero, so we cannot divide by it.

We can exchange the rows:

  [1  3]
  [0  2]

This process is called pivoting.

A common method is partial pivoting, where rows are exchanged so that a suitable large pivot is placed in the current position.

Pivoting helps improve numerical stability.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. ITERATIVE METHODS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Not every large system should be solved using direct methods such as Gaussian Elimination.

For very large systems, iterative methods can be more efficient.

Instead of directly calculating the exact solution in a fixed number of elimination steps, an iterative method starts with an initial approximation and repeatedly improves it.

Example:

  x⁽⁰⁾ is an initial guess.

The algorithm produces:

  x⁽¹⁾, then x⁽²⁾, then x⁽³⁾

and continues until the solution is sufficiently accurate.

Conceptually:

  x⁽⁰⁾ → x⁽¹⁾ → x⁽²⁾ → ... → x

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. JACOBI METHOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Jacobi Method is an iterative technique for solving systems of linear equations.

Consider:

  A x = b

Each variable is isolated using the corresponding equation, and new approximations are calculated repeatedly.

Example:

  4x + y = 9
  x + 3y = 7

We can rewrite these as:

  x = (9 - y) / 4
  y = (7 - x) / 3

Starting with an initial guess such as:

  x⁽⁰⁾ = 0,    y⁽⁰⁾ = 0

we repeatedly calculate improved values.

The process continues until the values converge to the solution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. GAUSS-SEIDEL METHOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Gauss-Seidel Method is another iterative method.

It is similar to Jacobi iteration, but it immediately uses newly calculated values.

Example: If a new value of x is calculated, that new value is immediately used when calculating y.

This can often make Gauss-Seidel converge faster than the basic Jacobi Method for suitable systems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. CONVERGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An iterative method is useful only if the sequence of approximations approaches the desired solution.

Example:

  x⁽¹⁾ = 1.5
  x⁽²⁾ = 1.75
  x⁽³⁾ = 1.875
  x⁽⁴⁾ = 1.9375

and so on.

If the values approach x = 2, then the method is converging.

If the values move farther away from the solution, the method is diverging.

Therefore, convergence is an important consideration when using iterative methods.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. RESIDUAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In numerical Linear Algebra, the residual measures how well a computed solution satisfies the original system.

Suppose we have:

  A x̂ ≈ b

The residual is:

  r = b - A x̂

If r is close to zero, the computed solution satisfies the system closely.

Example: If:

  r = [0.001]
      [-0.002]

the residual is small, indicating that the computed solution is a good fit to the equations.

However, a small residual does not always guarantee that the computed solution is close to the true solution, especially when the problem is ill-conditioned.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

17. QR DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

QR Decomposition expresses a matrix as:

  A = Q R

where Q is orthogonal and R is upper triangular.

QR is particularly useful for:
  • Least-squares problems
  • Orthogonalization
  • Eigenvalue algorithms
  • Numerically stable computations

Because orthogonal transformations preserve lengths and angles, QR methods can have strong numerical stability properties.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

18. CHOLESKY DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For a symmetric positive-definite matrix:

  A = L Lᵀ

This is called Cholesky Decomposition.

Because it takes advantage of the special structure of the matrix, Cholesky can be more efficient than general LU Decomposition.

It is commonly used in numerical optimization, statistics, simulations, and solving systems involving covariance matrices.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

19. EIGENVALUE PROBLEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Numerical Linear Algebra also deals with finding eigenvalues and eigenvectors.

The eigenvalue problem is:

  A v = λ v

The goal is to find the values of λ and corresponding vectors v.

For large matrices, directly solving the characteristic polynomial can be computationally expensive.

Therefore, numerical algorithms such as the QR Algorithm are used to approximate eigenvalues efficiently.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

20. SINGULAR VALUE DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Another important numerical technique is Singular Value Decomposition:

  A = U Σ Vᵀ

SVD is particularly valuable because it works with rectangular matrices and can reveal the important structure of a dataset.

It is used in:
  • Data compression
  • Dimensionality reduction
  • Image processing
  • Machine learning
  • Recommendation systems
  • Least squares
  • Rank approximation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

21. SPARSE MATRICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Large real-world systems often contain matrices where most entries are zero.

Example:

  A = [5  0  0  0]
      [0  3  0  0]
      [0  0  7  0]
      [0  0  0  2]

This is a sparse matrix because most entries are zero.

Instead of storing every zero, numerical software can store only the nonzero values and their locations.

This can greatly reduce:
  • Memory usage
  • Computation time
  • Storage requirements

Sparse matrix methods are extremely important when dealing with very large systems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

22. DIRECT METHODS VS. ITERATIVE METHODS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Numerical Linear Algebra methods can generally be divided into two major categories.

────────────────────────────────────────────────────────────────────────────────

Direct Methods

Direct methods attempt to obtain the solution through a fixed sequence of operations.

Examples include:
  • Gaussian Elimination
  • LU Decomposition
  • QR Decomposition
  • Cholesky Decomposition

For an ideal exact-arithmetic setting, these methods produce the solution after a finite sequence of operations.

────────────────────────────────────────────────────────────────────────────────

Iterative Methods

Iterative methods start with an approximation and repeatedly improve it.

Examples include:
  • Jacobi Method
  • Gauss-Seidel Method
  • Conjugate Gradient Method
  • GMRES

These methods are particularly useful for very large or sparse systems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

23. CONJUGATE GRADIENT METHOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Conjugate Gradient Method is an important iterative method for solving systems of the form:

  A x = b

when A is symmetric positive-definite.

Instead of directly eliminating variables, the method searches for the solution through a sequence of carefully chosen directions.

It is especially useful for large sparse systems where direct factorization would require too much memory or computation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

24. COMPUTATIONAL COMPLEXITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Numerical Linear Algebra also studies how much computational work an algorithm requires.

For example, solving a dense n×n system using standard Gaussian Elimination requires approximately:

  O(n³)

operations.

This means that if the size of the matrix doubles, the computational work can increase by roughly a factor of eight.

This is why algorithm efficiency becomes extremely important for large matrices.

────────────────────────────────────────────────────────────────────────────────

Example of Computational Growth

Suppose a method requires approximately n³ operations.

  For n = 10:    10³ = 1,000
  For n = 100:   100³ = 1,000,000
  For n = 1,000: 1,000³ = 1,000,000,000

This demonstrates why numerical algorithms must be designed carefully when dealing with large matrices.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

25. NUMERICAL LINEAR ALGEBRA IN COMPUTER SCIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Numerical Linear Algebra has many applications in Computer Science.

Machine Learning
  • Neural networks perform enormous numbers of matrix and vector operations

Computer Graphics
  • Matrices are used for transformations such as rotation, scaling, and projection

Computer Vision
  • Images and visual data are represented using matrices and processed using numerical algorithms

Data Science
  • Large datasets are represented as matrices and analyzed using methods such as SVD and PCA

Artificial Intelligence
  • Optimization algorithms frequently require solving systems involving matrices

Scientific Computing
  • Computers use numerical Linear Algebra to simulate physical and mathematical systems

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

26. NUMERICAL LINEAR ALGEBRA IN ENGINEERING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Engineers frequently encounter systems such as:

  A x = b

Examples:
  • Structural engineering: calculating unknown forces in a structure
  • Electrical engineering: solving circuit equations
  • Mechanical engineering: simulations of physical systems
  • Civil engineering: structural models with thousands of variables

Numerical Linear Algebra allows these problems to be solved efficiently using computers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

27. NUMERICAL LINEAR ALGEBRA IN REAL-WORLD SIMULATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose engineers want to simulate the temperature distribution across a building.

The building can be divided into many small regions.

Each region has an unknown temperature.

The relationships between neighboring regions produce a large system:

  A x = b

If the building is divided into thousands of regions, the resulting matrix may have thousands of rows and columns.

A numerical Linear Algebra algorithm can solve the system and determine the approximate temperature at each location.

This demonstrates how a mathematical matrix problem can represent a real physical system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

28. IMPORTANT CONCEPTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The major concepts in Numerical Linear Algebra include:

  • Floating-Point Arithmetic
  • Round-Off Error
  • Truncation Error
  • Conditioning
  • Stability
  • Residuals
  • Gaussian Elimination
  • LU Decomposition
  • QR Decomposition
  • Cholesky Decomposition
  • Iterative Methods
  • Eigenvalue Algorithms
  • Singular Value Decomposition
  • Sparse Matrices
  • Computational Complexity

These concepts form the foundation of computational Linear Algebra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, Numerical Linear Algebra is the study of computational methods for solving problems involving vectors and matrices.

It becomes especially important when the problems are too large or complicated to solve manually.

Instead of focusing only on exact symbolic solutions, Numerical Linear Algebra considers:

  • How to solve problems efficiently
  • How computers represent numbers
  • How much error is introduced
  • How stable an algorithm is
  • How sensitive a problem is to input changes
  • How much computational time and memory are required

Key Methods:

  Direct Methods:
    • Gaussian Elimination
    • LU Decomposition
    • QR Decomposition
    • Cholesky Decomposition

  Iterative Methods:
    • Jacobi Method
    • Gauss-Seidel Method
    • Conjugate Gradient Method

  Factorizations:
    • SVD
    • Eigenvalue Decomposition

Key Concepts:

  • Round-off error: finite precision arithmetic
  • Truncation error: finite approximation of infinite processes
  • Condition number: sensitivity to input changes
  • Stability: robustness to numerical errors
  • Residual: how well the solution satisfies the system
  • Sparse matrices: efficient storage and computation

The key idea to remember:

  Numerical Linear Algebra uses algorithms and computers to obtain accurate and efficient solutions to large-scale problems involving matrices and vectors while carefully managing numerical errors.

It connects theoretical Linear Algebra with practical computing and is fundamental to Computer Science, Artificial Intelligence, Machine Learning, Data Science, Engineering, Scientific Computing, Computer Graphics, and Numerical Simulation.
  `,
  examples: [
    "Floating-point: 1/3 ≈ 0.3333333333333333",
    "Round-off error vs truncation error",
    "Forward error: e = x̂ - x",
    "Condition number: κ(A) = ||A||·||A⁻¹||",
    "Gaussian Elimination: A x = b → U x = c",
    "LU Decomposition: A = L U",
    "Pivoting: exchange rows when pivot is zero",
    "Jacobi Method: iterative approximation",
    "Gauss-Seidel Method: uses updated values immediately",
    "Residual: r = b - A x̂",
    "QR Decomposition: A = Q R",
    "Cholesky: A = L Lᵀ",
    "SVD: A = U Σ Vᵀ",
    "Sparse matrices: store only non-zero entries",
    "Conjugate Gradient: for symmetric positive-definite matrices",
    "O(n³) complexity for dense Gaussian Elimination",
    "Explain round-off vs truncation error",
    "Apply the Jacobi method to solve Ax=b.",
  ],
};

export default topic;