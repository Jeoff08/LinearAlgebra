const topic = {
  id: "lu",
  title: "LU Decomposition",
  summary:
    "LU factorization methods (Doolittle, Crout), pivoting and solving triangular systems.",
  details: `
LU Decomposition is a method in Linear Algebra for breaking a matrix into the product of two simpler matrices: a lower triangular matrix (L) and an upper triangular matrix (U).

The name LU comes from these two matrices:

  L = Lower Triangular Matrix
  U = Upper Triangular Matrix

The basic idea is:

  A = L U

where A is the original matrix.

LU Decomposition is especially useful for solving systems of linear equations efficiently, particularly when the same coefficient matrix is used with different right-hand sides.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. WHAT ARE TRIANGULAR MATRICES?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A lower triangular matrix has zeros above the main diagonal.

Example:

  L = [1  0  0]
      [2  1  0]
      [3  4  1]

The entries above the main diagonal are zero.

An upper triangular matrix has zeros below the main diagonal.

Example:

  U = [2  3  4]
      [0  5  6]
      [0  0  7]

The entries below the main diagonal are zero.

These matrices are easier to work with because they can be solved using forward substitution and back substitution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. THE BASIC IDEA OF LU DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose we have:

  A x = b

If we decompose A as:

  A = L U

then:

  L U x = b

Instead of solving the original system directly, we introduce an intermediate vector y:

  L y = b

After finding y, we solve:

  U x = y

Therefore, the entire process becomes:

  A x = b  →  L U x = b  →  L y = b  →  U x = y

This is the central idea behind LU Decomposition.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. EXAMPLE OF LU DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider the matrix:

  A = [2   1   1]
      [4  -6   0]
      [-2  7   2]

We want to decompose it into:

  A = L U

The goal is to use Gaussian elimination to transform A into an upper triangular matrix U.

The elimination steps are recorded in L.

────────────────────────────────────────────────────────────────────────────────

Step 1: Eliminate the First Column

Start with:

  A = [2   1   1]
      [4  -6   0]
      [-2  7   2]

To eliminate the 4 below the first pivot (2), calculate:

  m₂₁ = 4/2 = 2

Therefore:

  R₂ ← R₂ - 2R₁

Calculate:

  R₂ = [4, -6, 0] - 2[2, 1, 1] = [0, -8, -2]

Now eliminate the -2 below the first pivot:

  m₃₁ = -2/2 = -1

Thus:

  R₃ ← R₃ - (-1)R₁

This becomes:

  R₃ ← R₃ + R₁

Therefore:

  R₃ = [-2, 7, 2] + [2, 1, 1] = [0, 8, 3]

The matrix is now:

  [2   1   1]
  [0  -8  -2]
  [0   8   3]

────────────────────────────────────────────────────────────────────────────────

Step 2: Eliminate the Second Column

Now we need to eliminate the 8 below the second pivot (-8).

Calculate:

  m₃₂ = 8/(-8) = -1

Therefore:

  R₃ ← R₃ - (-1)R₂

So:

  R₃ ← R₃ + R₂

Calculate:

  [0, 8, 3] + [0, -8, -2] = [0, 0, 1]

Therefore, the resulting upper triangular matrix is:

  U = [2   1   1]
      [0  -8  -2]
      [0   0   1]

────────────────────────────────────────────────────────────────────────────────

Constructing the Lower Triangular Matrix

The multipliers used during Gaussian elimination are placed below the diagonal of L.

We found:

  m₂₁ = 2
  m₃₁ = -1
  m₃₂ = -1

Therefore:

  L = [1    0   0]
      [2    1   0]
      [-1  -1   1]

Thus:

  A = L U

where:

  L = [1    0   0]    U = [2   1   1]
      [2    1   0]        [0  -8  -2]
      [-1  -1   1]        [0   0   1]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. VERIFYING THE DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We can verify that L U = A.

Multiply:

  [1    0   0]   [2   1   1]   [2   1   1]
  [2    1   0] · [0  -8  -2] = [4  -6   0]
  [-1  -1   1]   [0   0   1]   [-2  7   2]

The first row becomes:  [2, 1, 1]
The second row becomes: [4, -6, 0]
The third row becomes:  [-2, 7, 2]

Therefore:

  L U = [2   1   1] = A
         [4  -6   0]
         [-2  7   2]

So the decomposition is correct.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. USING LU DECOMPOSITION TO SOLVE A SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose we want to solve:

  A x = b

where:

  A = [2   1   1]    b = [5]
      [4  -6   0]        [-2]
      [-2  7   2]        [9]

Since A = L U, we have:

  L U x = b

Introduce:

  y = U x

Then solve:

  L y = b

────────────────────────────────────────────────────────────────────────────────

Step 1: Forward Substitution

We have:

  [1    0   0] [y₁] = [5]
  [2    1   0] [y₂]   [-2]
  [-1  -1   1] [y₃]   [9]

This produces the equations:

  y₁ = 5
  2y₁ + y₂ = -2
  -y₁ - y₂ + y₃ = 9

Since y₁ = 5, we get:

  2(5) + y₂ = -2
  y₂ = -12

Now:

  -5 - (-12) + y₃ = 9
  7 + y₃ = 9
  y₃ = 2

Therefore:

  y = [5]
      [-12]
      [2]

────────────────────────────────────────────────────────────────────────────────

Step 2: Back Substitution

Now solve:

  U x = y

Therefore:

  [2   1   1] [x₁] = [5]
  [0  -8  -2] [x₂]   [-12]
  [0   0   1] [x₃]   [2]

This gives:

  2x₁ + x₂ + x₃ = 5
  -8x₂ - 2x₃ = -12
  x₃ = 2

Starting with the last equation:

  x₃ = 2

Then:

  -8x₂ - 2(2) = -12
  -8x₂ - 4 = -12
  -8x₂ = -8
  x₂ = 1

Finally:

  2x₁ + 1 + 2 = 5
  2x₁ + 3 = 5
  2x₁ = 2
  x₁ = 1

Thus:

  x = [1]
      [1]
      [2]

This is the solution of the original system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. LU DECOMPOSITION VS. GAUSSIAN ELIMINATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LU Decomposition is closely related to Gaussian Elimination.

Gaussian Elimination transforms A into an upper triangular matrix U.

LU Decomposition goes one step further by recording the elimination multipliers in a lower triangular matrix L.

Therefore:

  A = L U

The relationship can be summarized as:

  Gaussian Elimination:  A → U
  LU Decomposition:      A → L and U

The U matrix contains the result of elimination, while L stores the information about the elimination operations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. LU DECOMPOSITION AND MULTIPLE SYSTEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the biggest advantages of LU Decomposition is that it is very efficient when solving multiple systems with the same coefficient matrix.

Suppose we have:

  A x₁ = b₁
  A x₂ = b₂

and perhaps many more systems using the same A.

Instead of performing Gaussian Elimination repeatedly, we can calculate:

  A = L U

once.

Then for each new b, we solve:

  L y = b
  U x = y

This saves a significant amount of computation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. LU DECOMPOSITION AND MATRIX INVERSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LU Decomposition can also be used to calculate a matrix inverse.

Suppose:

  A = L U

Then:

  A⁻¹ = (L U)⁻¹

Using the inverse product rule:

  A⁻¹ = U⁻¹ L⁻¹

However, in numerical applications, we usually avoid explicitly calculating the inverse when we only need to solve a system.

Instead, we use the LU factors directly.

This is generally more efficient and numerically preferable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. LU DECOMPOSITION WITH PIVOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sometimes Gaussian Elimination encounters a zero or very small pivot.

Example:

  A = [0  2]
      [1  3]

The first pivot is zero, so ordinary elimination cannot proceed directly.

In these situations, we can exchange rows using a permutation matrix P.

The decomposition then becomes:

  P A = L U

rather than simply:

  A = L U

This is called LU Decomposition with partial pivoting.

It is commonly used in numerical computing because pivoting improves numerical stability.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. DOOLITTLE METHOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One common method for calculating LU Decomposition is the Doolittle Method.

In the Doolittle method, the diagonal entries of L are set to 1:

  Lᵢᵢ = 1

Example:

  L = [1    0   0]
      [l₂₁  1   0]
      [l₃₁  l₃₂ 1]

The remaining entries of L and U are calculated so that:

  A = L U

This is one of the standard approaches for teaching and implementing LU Decomposition.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. CROUT METHOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Another approach is the Crout Method.

Unlike the Doolittle method, Crout's method generally sets the diagonal entries of U equal to 1:

  Uᵢᵢ = 1

Example:

  U = [1  u₁₂  u₁₃]
      [0   1   u₂₃]
      [0   0    1]

Both Doolittle and Crout methods produce an LU factorization, but they organize the calculations differently.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. LDU DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LU Decomposition can sometimes be further separated into:

  A = L D U

where:
  • L is lower triangular
  • D is diagonal
  • U is upper triangular

This form is called LDU Decomposition.

It can be useful because separating the diagonal values can make certain matrix properties easier to analyze.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. GEOMETRIC INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LU Decomposition is not primarily a geometric transformation like rotation or reflection. Instead, it provides an efficient way to represent the algebraic process of eliminating variables.

The matrix U represents the simplified system obtained after elimination.

The matrix L records the elimination information needed to reconstruct the original matrix.

Therefore, LU Decomposition can be viewed as a way of breaking a complicated matrix problem into simpler triangular problems.

Instead of directly solving:

  A x = b

we solve:

  L y = b

and then:

  U x = y

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. APPLICATIONS OF LU DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LU Decomposition is widely used in computational Linear Algebra.

  1. Engineering
     • Solving systems involving forces, structures, electrical circuits, and physical models

  2. Scientific Computing
     • Solving large systems of equations efficiently

  3. Computer Simulations
     • Repeatedly solving systems that arise during simulations

  4. Computer Graphics
     • Matrix systems involving transformations and geometric calculations

  5. Data Science
     • Numerical optimization and matrix computations

  6. Numerical Analysis
     • One of the fundamental methods for solving linear systems

  7. Finite Element Analysis
     • Solving large systems of equations using matrix factorization techniques

  8. Economics
     • Input-output analysis
     • Economic modeling

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. ADVANTAGES OF LU DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LU Decomposition has several important advantages.

  1. Efficient for Multiple Right-Hand Sides
     • Once A = L U is calculated, different vectors b can be handled efficiently

  2. Uses Triangular Systems
     • Triangular systems are much easier to solve than general systems

  3. Related to Gaussian Elimination
     • LU Decomposition builds directly on a fundamental Linear Algebra technique

  4. Useful for Numerical Computation
     • Widely implemented in mathematical and scientific software

  5. Can Help Calculate Determinants
     • If A = L U, then det(A) = det(L) · det(U)
     • For triangular matrices, the determinant is the product of the diagonal entries
     • For Doolittle: det(A) = ∏ Uᵢᵢ (if no row permutations)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, LU Decomposition is a method of factoring a matrix into a lower triangular matrix and an upper triangular matrix:

  A = L U

The lower triangular matrix is:

  L = [1    0   0]
      [l₂₁  1   0]
      [l₃₁  l₃₂ 1]

in the common Doolittle form, while the upper triangular matrix has the form:

  U = [u₁₁  u₁₂  u₁₃]
      [0    u₂₂  u₂₃]
      [0     0   u₃₃]

To solve A x = b, we use A = L U and solve two simpler systems:

  L y = b    (forward substitution)
  U x = y    (back substitution)

If row exchanges are required, the decomposition is generally written as:

  P A = L U

Key Methods:

  • Doolittle Method: Lᵢᵢ = 1
  • Crout Method: Uᵢᵢ = 1
  • LDU Decomposition: A = L D U

The key idea to remember:

  LU Decomposition breaks a complicated matrix into two simpler triangular matrices, making systems of linear equations easier and more efficient to solve.

It is closely connected to Gaussian Elimination, forward substitution, back substitution, matrix inverses, determinants, numerical methods, and computational Linear Algebra.
  `,
  examples: [
    "Lower triangular matrix: L = [[1,0,0],[2,1,0],[3,4,1]]",
    "Upper triangular matrix: U = [[2,3,4],[0,5,6],[0,0,7]]",
    "LU decomposition: A = L U",
    "Example: A = [[2,1,1],[4,-6,0],[-2,7,2]] → L and U",
    "Forward substitution: L y = b",
    "Back substitution: U x = y",
    "Doolittle method: Lᵢᵢ = 1",
    "Crout method: Uᵢᵢ = 1",
    "LDU decomposition: A = L D U",
    "Pivoting: P A = L U when pivot is zero",
    "LU for multiple systems: compute once, solve many",
    "det(A) = det(L) · det(U) = ∏ Uᵢᵢ (Doolittle)",
    "Perform LU decomposition on a 3x3 matrix",
    "Use LU factors to solve Ax=b efficiently.",
  ],
};

export default topic;