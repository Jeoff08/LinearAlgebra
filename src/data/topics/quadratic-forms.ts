const topic = {
  id: "quadratic-forms",
  title: "Quadratic Forms",
  summary:
    "Quadratic forms, matrix representation, definiteness, and Sylvester's criterion.",
  details: `
Quadratic Forms are mathematical expressions involving variables that are multiplied by themselves or by other variables. In Linear Algebra, quadratic forms provide a convenient way to represent these expressions using vectors and matrices.

A quadratic form can generally be written as:

  Q(x) = xᵀ A x

where:
  • x is a vector of variables
  • A is a square matrix
  • Q(x) is the resulting scalar

The main idea is:

  A quadratic form represents a quadratic expression using matrix multiplication.

Quadratic forms are important in Linear Algebra because they connect matrices, eigenvalues, definiteness, geometry, optimization, and conic surfaces.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. BASIC QUADRATIC FORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider the expression:

  Q(x, y) = x² + 2xy + y²

This is a quadratic form because it contains terms such as x², xy, and y².

We can represent it using a matrix.

Let:

  x = [x]
      [y]

Then we can write:

  Q(x) = xᵀ A x

For this example:

  A = [1  1]
      [1  1]

Therefore:

  Q(x, y) = [x  y] [1  1] [x]
                   [1  1] [y]

Multiplying the matrices gives:

  Q(x, y) = x² + 2xy + y²

Thus:

  x² + 2xy + y² = [x  y] [1  1] [x]
                          [1  1] [y]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. GENERAL TWO-VARIABLE QUADRATIC FORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A general quadratic form involving two variables can be written as:

  Q(x, y) = ax² + 2bxy + cy²

Its matrix representation is:

  A = [a  b]
      [b  c]

Therefore:

  Q(x, y) = [x  y] [a  b] [x]
                   [b  c] [y]

Notice that the matrix is symmetric:

  A = Aᵀ

Symmetric matrices are especially important when studying quadratic forms.

────────────────────────────────────────────────────────────────────────────────

Example

Consider:

  Q(x, y) = 3x² + 4xy + 2y²

We want to write this as:

  Q(x) = xᵀ A x

The general form is:

  ax² + 2bxy + cy²

Comparing terms:

  a = 3
  2b = 4 → b = 2
  c = 2

Therefore:

  A = [3  2]
      [2  2]

Thus:

  3x² + 4xy + 2y² = [x  y] [3  2] [x]
                            [2  2] [y]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. QUADRATIC FORMS IN THREE VARIABLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quadratic forms can also involve three or more variables.

Example:

  Q(x, y, z) = 2x² + 3y² + 4z² + 2xy - 6xz + 8yz

This can be represented as:

  Q(x) = xᵀ A x

where:

  x = [x]
      [y]
      [z]

The corresponding symmetric matrix is:

  A = [2   1  -3]
      [1   3   4]
      [-3  4   4]

The off-diagonal entries are divided by 2 when constructing the matrix because each cross-product appears twice during matrix multiplication.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. WHY IS THE MATRIX SYMMETRIC?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A quadratic form can always be represented using a symmetric matrix.

Suppose A is not symmetric.

We can divide it into its symmetric and skew-symmetric parts:

  A = (A + Aᵀ)/2 + (A - Aᵀ)/2

For a quadratic form:

  xᵀ(A - Aᵀ)x = 0

Therefore:

  xᵀ A x = xᵀ ((A + Aᵀ)/2) x

This means that only the symmetric part of A affects the quadratic form.

Therefore, we generally study quadratic forms using:

  A = Aᵀ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. QUADRATIC FORMS AND GEOMETRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quadratic forms have a strong geometric interpretation.

For two variables:

  Q(x, y) = ax² + 2bxy + cy²

the equation:

  Q(x, y) = 1

can describe different geometric shapes.

Depending on the matrix and its properties, the resulting shape may be related to:
  • Ellipses
  • Hyperbolas
  • Degenerate conics

Examples:

  x² + y² = 1    represents a circle
  x² - y² = 1    represents a hyperbola

Thus, quadratic forms connect Linear Algebra with analytic geometry.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. POSITIVE DEFINITE QUADRATIC FORMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most important classifications is positive definiteness.

A quadratic form:

  Q(x) = xᵀ A x

is positive definite if:

  xᵀ A x > 0

for every nonzero vector x.

In other words, the quadratic form is always positive except at x = 0.

────────────────────────────────────────────────────────────────────────────────

Example of Positive Definite Quadratic Form

Consider:

  Q(x, y) = x² + y²

The matrix is:

  A = [1  0]
      [0  1]

For any nonzero vector:

  x = [x]
      [y]

we have:

  xᵀ A x = x² + y²

Since x² + y² > 0 whenever (x, y) ≠ (0, 0), the matrix is positive definite.

Therefore:

  A is positive definite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. NEGATIVE DEFINITE QUADRATIC FORMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A quadratic form is negative definite if:

  xᵀ A x < 0

for every nonzero x.

Example:

  Q(x, y) = -x² - y²

Its matrix is:

  A = [-1   0]
      [0   -1]

For every nonzero vector:

  xᵀ A x < 0

Therefore:

  A is negative definite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. POSITIVE SEMIDEFINITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A quadratic form is positive semidefinite if:

  xᵀ A x ≥ 0

for every x.

Unlike positive definite matrices, the quadratic form is allowed to equal zero for some nonzero vectors.

Example:

  Q(x, y) = x²

The matrix is:

  A = [1  0]
      [0  0]

We have:

  Q(x, y) = x² ≥ 0

However, when x = 0 and y ≠ 0, the quadratic form becomes zero.

Therefore, it is positive semidefinite rather than positive definite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. NEGATIVE SEMIDEFINITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A quadratic form is negative semidefinite if:

  xᵀ A x ≤ 0

for all x.

Example:

  Q(x, y) = -x²

It is always less than or equal to zero.

Therefore, the corresponding matrix is negative semidefinite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. INDEFINITE QUADRATIC FORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A quadratic form is indefinite if it can be both positive and negative.

Example:

  Q(x, y) = x² - y²

If x = 1, y = 0, then:

  Q(1, 0) = 1

But if x = 0, y = 1, then:

  Q(0, 1) = -1

Therefore, the quadratic form can have both positive and negative values.

Thus:

  Q(x, y) = x² - y² is indefinite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. THE FOUR MAIN TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quadratic forms are commonly classified as:

Type                      Condition
----------------------   ------------------------------
Positive Definite         xᵀ A x > 0 for x ≠ 0
Positive Semidefinite     xᵀ A x ≥ 0
Negative Definite         xᵀ A x < 0 for x ≠ 0
Negative Semidefinite     xᵀ A x ≤ 0
Indefinite                Can be positive and negative

This classification is extremely important in optimization.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. QUADRATIC FORMS AND EIGENVALUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For a symmetric matrix A, the eigenvalues can be used to determine the definiteness of a quadratic form.

  • If all eigenvalues are positive (λᵢ > 0), then A is positive definite.
  • If all eigenvalues are nonnegative (λᵢ ≥ 0), then A is positive semidefinite.
  • If all eigenvalues are negative (λᵢ < 0), then A is negative definite.
  • If the matrix has both positive and negative eigenvalues, it is indefinite.

Therefore:

  Eigenvalues provide a powerful way to classify quadratic forms.

────────────────────────────────────────────────────────────────────────────────

Example Using Eigenvalues

Consider:

  A = [2  0]
      [0  3]

The eigenvalues are:

  λ₁ = 2    and    λ₂ = 3

Both are positive: 2 > 0 and 3 > 0.

Therefore:

  A is positive definite.

The corresponding quadratic form is:

  Q(x, y) = 2x² + 3y²

It is always positive for any nonzero vector.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. DETERMINANT TEST FOR A 2×2 MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For a symmetric matrix:

  A = [a  b]
      [b  c]

positive definiteness can be checked using the leading principal minors.

For a 2×2 matrix, the conditions are:

  a > 0    and    det(A) > 0

Example:

  A = [3  1]
      [1  2]

First:

  a = 3 > 0

Next:

  det(A) = (3)(2) - (1)(1) = 6 - 1 = 5

Since 5 > 0, the matrix is positive definite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. SYLVESTER'S CRITERION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For larger symmetric matrices, Sylvester's Criterion can be used to test positive definiteness.

A symmetric matrix A is positive definite if all its leading principal minors are positive.

For a 2×2 matrix:

  Δ₁ = a > 0    and    Δ₂ = det(A) > 0

For a 3×3 matrix, we check:

  Δ₁ > 0,    Δ₂ > 0,    Δ₃ > 0

This provides an algebraic way to determine whether a symmetric matrix is positive definite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. QUADRATIC FORMS AND OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quadratic forms are extremely important in Optimization.

A quadratic optimization problem can be written as:

  f(x) = ½ xᵀ A x - bᵀ x + c

Here, xᵀ A x is the quadratic part of the objective function.

The matrix A determines the curvature of the function.

If A is positive definite, the function is strictly convex and has a unique global minimum.

Therefore:

  A positive definite → unique minimum under standard unconstrained conditions.

────────────────────────────────────────────────────────────────────────────────

Example of Quadratic Optimization

Consider:

  f(x, y) = x² + y²

We can write this as:

  f(x) = xᵀ A x

where:

  A = [1  0]
      [0  1]

The matrix is positive definite.

Therefore, the function has a unique minimum at:

  (x, y) = (0, 0)

The minimum value is:

  0

This demonstrates how positive definite quadratic forms naturally appear in optimization.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. QUADRATIC FORMS AND HESSIAN MATRICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quadratic forms are also closely connected to the Hessian matrix.

For a function f(x), the Hessian contains its second derivatives.

For a quadratic function:

  f(x) = ½ xᵀ A x - bᵀ x + c

the Hessian is:

  ∇²f(x) = A

when A is symmetric.

Therefore, analyzing the quadratic form xᵀ A x is equivalent to analyzing the curvature of the function.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

17. COMPLETING THE SQUARE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quadratic forms can sometimes be simplified through a change of variables or completing the square.

Example:

  Q(x, y) = x² + 2xy + y²

This can be rewritten as:

  Q(x, y) = (x + y)²

This immediately shows that:

  Q(x, y) ≥ 0

Therefore, the quadratic form is positive semidefinite.

This is another way to analyze the behavior of a quadratic form.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

18. DIAGONALIZATION OF QUADRATIC FORMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A symmetric matrix can be diagonalized using an orthogonal matrix.

If A is symmetric, then:

  A = Q D Qᵀ

where:
  • Q contains orthonormal eigenvectors
  • D is a diagonal matrix containing eigenvalues

Substituting into the quadratic form:

  xᵀ A x = xᵀ Q D Qᵀ x

Let:

  y = Qᵀ x

Then:

  xᵀ A x = yᵀ D y

Therefore:

  yᵀ D y = λ₁y₁² + λ₂y₂² + ... + λₙyₙ²

This makes the behavior of the quadratic form much easier to understand.

────────────────────────────────────────────────────────────────────────────────

Example of Diagonalization

Suppose:

  A = [2  0]
      [0  3]

It is already diagonal.

Therefore:

  Q(x, y) = [x  y] [2  0] [x]
                   [0  3] [y]

This gives:

  Q(x, y) = 2x² + 3y²

The eigenvalues are immediately visible:

  λ₁ = 2,    λ₂ = 3

Since both are positive, the quadratic form is positive definite.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

19. QUADRATIC FORMS AND CONIC SECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In two dimensions, a quadratic equation can have the general form:

  Ax² + Bxy + Cy² + Dx + Ey + F = 0

The quadratic portion:

  Ax² + Bxy + Cy²

can be represented as a quadratic form.

The matrix:

  [A    B/2]
  [B/2  C]

contains the information about the quadratic part.

Depending on its properties, the equation can describe shapes such as:
  • Ellipse
  • Hyperbola
  • Parabola
  • Circle

Thus, quadratic forms provide a bridge between Linear Algebra and geometry.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

20. QUADRATIC FORMS IN MACHINE LEARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quadratic forms appear in many Machine Learning methods.

For example, optimization objectives can contain:

  xᵀ A x

They are used in:
  • Regularization
  • Least Squares
  • Covariance analysis
  • Optimization
  • Statistical modeling
  • Support vector methods
  • Gaussian models

A common example is L2 regularization, where the squared magnitude of a parameter vector is used:

  wᵀ w

This is a simple quadratic form.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

21. QUADRATIC FORMS IN STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quadratic forms are also important in statistics.

For example, the squared distance between a data point x and a mean vector can be measured using a quadratic form.

The Mahalanobis distance is:

  √((x - μ)ᵀ Σ⁻¹ (x - μ))

The expression:

  (x - μ)ᵀ Σ⁻¹ (x - μ)

is a quadratic form.

It accounts for the relationships and scales between variables.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

22. QUADRATIC FORMS IN PHYSICS AND ENGINEERING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quadratic forms are used to represent:
  • Energy
  • Distance
  • Stability
  • Physical systems
  • Mechanical models
  • Electrical systems

For example, energy functions often contain squared quantities, which naturally produce quadratic expressions.

In engineering, positive definite quadratic forms can also be used to analyze whether a system is stable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

23. IMPORTANT QUADRATIC FORM CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When studying Quadratic Forms, it is important to understand:

  • Q(x) = xᵀ A x
  • Symmetric Matrices
  • Positive Definite
  • Positive Semidefinite
  • Negative Definite
  • Negative Semidefinite
  • Indefinite
  • Eigenvalues
  • Sylvester's Criterion
  • Diagonalization
  • Hessian Matrices
  • Optimization
  • Conic Sections

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, a Quadratic Form is an expression that can be represented in matrix form as:

  Q(x) = xᵀ A x

Quadratic forms are especially useful because they allow complicated quadratic expressions to be analyzed using Linear Algebra.

Their behavior can be studied through:
  • Symmetric matrices
  • Eigenvalues
  • Determinants
  • Principal minors
  • Diagonalization
  • Positive and negative definiteness

The main classifications are:

  • Positive Definite:     xᵀ A x > 0 for x ≠ 0
  • Positive Semidefinite: xᵀ A x ≥ 0
  • Negative Definite:     xᵀ A x < 0 for x ≠ 0
  • Negative Semidefinite: xᵀ A x ≤ 0
  • Indefinite:            Can be positive and negative

Key Tests:

  • Eigenvalues: All positive → positive definite
  • Sylvester's Criterion: All leading principal minors positive → positive definite
  • Determinant Test (2×2): a > 0 and det(A) > 0

Quadratic forms are particularly important in Optimization, where the matrix A determines the curvature of a quadratic function.

Key Relationships:

  • Optimization: f(x) = ½ xᵀ A x - bᵀ x + c
  • Hessian: ∇²f(x) = A
  • Diagonalization: A = Q D Qᵀ
  • Change of variables: y = Qᵀ x → xᵀ A x = λ₁y₁² + ... + λₙyₙ²

The key idea to remember:

  A quadratic form represents a quadratic expression using matrix multiplication, allowing Linear Algebra tools such as eigenvalues, diagonalization, and definiteness to be used to understand its geometry and behavior.
  `,
  examples: [
    "Quadratic form: Q(x) = xᵀ A x",
    "Example: Q(x,y) = x² + 2xy + y² → A = [[1,1],[1,1]]",
    "General 2-var: Q(x,y) = ax² + 2bxy + cy² → A = [[a,b],[b,c]]",
    "Example: 3x² + 4xy + 2y² → A = [[3,2],[2,2]]",
    "3 variables: 2x²+3y²+4z²+2xy-6xz+8yz → A = [[2,1,-3],[1,3,4],[-3,4,4]]",
    "Positive definite: x² + y² → A = [[1,0],[0,1]]",
    "Negative definite: -x² - y² → A = [[-1,0],[0,-1]]",
    "Positive semidefinite: x² → A = [[1,0],[0,0]]",
    "Negative semidefinite: -x² → A = [[-1,0],[0,0]]",
    "Indefinite: x² - y² → A = [[1,0],[0,-1]]",
    "Eigenvalues: all positive → positive definite",
    "Sylvester's criterion: leading principal minors > 0",
    "2×2 test: a > 0 and det(A) > 0 → positive definite",
    "Diagonalization: A = Q D Qᵀ",
    "Optimization: f(x) = ½xᵀAx - bᵀx + c",
    "Classify x^T A x for a given symmetric matrix A",
    "Apply Sylvester's criterion to determine definiteness.",
  ],
};

export default topic;