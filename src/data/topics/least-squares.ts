const topic = {
  id: "least-squares",
  title: "Least Squares",
  summary:
    "Overdetermined systems, normal equations, projections, and regression basics.",
  details: `
Least Squares is a method in Linear Algebra used to find the best approximate solution to a system of equations when an exact solution does not exist or when the data contains errors or inconsistencies.

In many real-world situations, we have more equations than unknowns, or the data points do not perfectly fit a single equation. Instead of trying to find an exact solution that may not exist, the Least Squares method finds the solution that makes the overall error as small as possible.

The basic idea is:

  Find the solution that minimizes the total squared difference between the actual values and the predicted values.

This makes Least Squares extremely important in statistics, data science, machine learning, engineering, economics, and scientific research.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. WHY DO WE NEED LEAST SQUARES?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider the system:

  x + y = 3
  2x + y = 4

This system has an exact solution.

However, imagine that we have three equations:

  x + y = 3
  2x + y = 4
  3x + y = 7

It may not be possible for one pair of values (x, y) to satisfy all three equations exactly.

Instead of saying that the system has no useful solution, we can find values of x and y that provide the best overall fit.

This is where Least Squares becomes useful.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. THE BASIC IDEA OF ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose we want to predict a value b using a model A x.

The error or residual is:

  r = b - A x

The residual tells us how far the predicted values are from the actual values.

Least Squares attempts to make these residuals as small as possible.

Instead of minimizing the ordinary errors directly, we minimize their squared lengths:

  ||b - A x||²

The Least Squares problem can therefore be written as:

  minₓ ||b - A x||²

This is the central idea of the Least Squares method.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. A SIMPLE EXAMPLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose we have the following data points:

  (1, 2), (2, 3), (3, 5)

We want to find a straight-line equation:

  y = mx + b

that best fits these points.

The problem is that the three points do not lie perfectly on one straight line.

Instead of forcing the line to pass through every point, Least Squares finds the line that minimizes the total squared error.

The predicted values are:

  ŷ = mx + b

For each data point, the residual is:

  rᵢ = yᵢ - ŷᵢ

The goal is to minimize:

  r₁² + r₂² + r₃²

Therefore, Least Squares finds the values of m and b that make the total squared error as small as possible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. MATRIX FORM OF LEAST SQUARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A Least Squares problem can be written in matrix form as:

  A x ≈ b

Here:
  • A is the coefficient matrix
  • x contains the unknown parameters
  • b contains the observed values

Because an exact solution may not exist, we write A x ≈ b.

The Least Squares solution is the vector x̂ that minimizes:

  ||b - A x||²

Thus:

  x̂ = argminₓ ||b - A x||²

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. THE NORMAL EQUATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most common methods for solving a Least Squares problem is the Normal Equations.

The normal equations are obtained by setting the derivative of the squared error to zero.

The result is:

  Aᵀ A x̂ = Aᵀ b

If Aᵀ A is invertible, we can solve for x̂:

  x̂ = (Aᵀ A)⁻¹ Aᵀ b

This formula provides the Least Squares solution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. STEP-BY-STEP EXAMPLE USING NORMAL EQUATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider the system:

  x + y = 2
  x + 2y = 3
  x + 3y = 5

There are three equations and two unknowns, so this is an overdetermined system.

Write the system as A x ≈ b where:

  A = [1  1]    x = [x]    b = [2]
      [1  2]        [y]        [3]
      [1  3]                   [5]

First calculate Aᵀ:

  Aᵀ = [1  1  1]
       [1  2  3]

Now calculate Aᵀ A:

  Aᵀ A = [3   6]
         [6  14]

Next calculate Aᵀ b:

  Aᵀ b = [10]
         [23]

The normal equations become:

  [3   6] [x] = [10]
  [6  14] [y]   [23]

This gives:

  3x + 6y = 10
  6x + 14y = 23

Solving these equations gives:

  y = 3/2    and    x = 1/3

Therefore, the Least Squares solution is:

  x̂ = [1/3]
       [3/2]

This solution does not satisfy every original equation exactly, but it gives the best overall approximation according to the Least Squares criterion.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. RESIDUALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After finding a Least Squares solution, we can calculate the residual vector:

  r = b - A x̂

The residual tells us the difference between the observed values and the values predicted by our model.

Using the previous example:

  x̂ = [1/3]
       [3/2]

The predicted values are:

  A x̂ = [11/6]
        [10/3]
        [29/6]

Therefore, the residual vector is:

  r = [2]   [11/6] = [1/6]
      [3] - [10/3]   [-1/3]
      [5]   [29/6]   [1/6]

Thus:

  r = [1/6]
      [-1/3]
      [1/6]

The residuals represent the prediction errors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. GEOMETRIC INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Least Squares has an important geometric interpretation.

The vector b may not belong to the column space of A.

Therefore, there may be no exact solution to A x = b.

Instead, Least Squares finds a vector A x̂ inside the column space of A that is closest to b.

In other words:

  A x̂ = proj_Col(A) b

The residual:

  r = b - A x̂

is perpendicular to the column space of A.

Therefore:

  Aᵀ r = 0

This relationship is exactly what produces the Normal Equations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. LEAST SQUARES AND LINEAR REGRESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most common applications of Least Squares is Linear Regression.

Suppose we have data points:

  (x₁, y₁), (x₂, y₂), ..., (xₙ, yₙ)

We want to find a line:

  y = mx + b

that best represents the data.

For each data point:

  yᵢ ≈ mxᵢ + b

This can be written as a matrix equation:

  [x₁  1] [m] ≈ [y₁]
  [x₂  1] [b]   [y₂]
  [⋮   ⋮]       [⋮ ]
  [xₙ  1]       [yₙ]

Least Squares finds the values of m and b that minimize the total squared prediction error.

This is the mathematical foundation of ordinary least-squares linear regression.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. LEAST SQUARES AND ORTHOGONALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Least Squares is closely connected to orthogonality.

The residual:

  r = b - A x̂

is orthogonal to every column of A.

Therefore:

  r ⟂ Col(A)

This means the error cannot be reduced further by moving within the column space.

Geometrically, the best approximation occurs when the error vector points directly away from the subspace.

This is why Least Squares is closely connected to Inner Product Spaces, orthogonal projections, and orthonormal bases.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. OVERDETERMINED SYSTEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Least Squares is particularly useful for overdetermined systems.

An overdetermined system has more equations than unknowns.

Example:

  x + y = 2
  2x - y = 1
  3x + 2y = 5
  4x - y = 3

has four equations but only two unknowns.

Usually, there is no exact solution satisfying all four equations simultaneously.

Instead, Least Squares finds the values of x and y that produce the smallest overall squared error.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. UNDERLYING IDEA OF ERROR MINIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose we have errors e₁, e₂, e₃.

Simply adding the errors can be misleading because positive and negative errors can cancel:

  e₁ + e₂ + e₃

For example:

  2 + (-2) = 0

Even though the errors are not actually zero.

Least Squares avoids this problem by squaring the errors:

  e₁² + e₂² + e₃²

Now:

  2² + (-2)² = 4 + 4 = 8

Therefore, the total error remains positive.

The Least Squares method minimizes this total squared error.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. LEAST SQUARES AND THE PSEUDOINVERSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When A is not square or does not have a regular inverse, the Moore-Penrose pseudoinverse can be used.

It is commonly written as A⁺.

The Least Squares solution can be expressed as:

  x̂ = A⁺ b

This is especially useful for large systems and numerical computing.

The pseudoinverse generalizes the idea of an inverse to matrices that are not necessarily square or invertible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. WHY NOT ALWAYS USE THE NORMAL EQUATIONS?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Although the normal equations are mathematically convenient, computing:

  (Aᵀ A)⁻¹

can be numerically unstable when the columns of A are nearly linearly dependent.

For practical numerical computation, methods such as QR decomposition or the Singular Value Decomposition (SVD) are often preferred.

These methods can provide more numerical stability, especially when working with large datasets.

Therefore, while:

  x̂ = (Aᵀ A)⁻¹ Aᵀ b

is an important formula for understanding Least Squares, it is not always the best computational method.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. APPLICATIONS OF LEAST SQUARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Least Squares is used extensively in real-world applications.

  1. Data Science
     • Fitting models to datasets
     • Identifying relationships between variables

  2. Machine Learning
     • Linear regression
     • Optimization techniques based on minimizing squared errors

  3. Statistics
     • Estimating parameters from observed data

  4. Engineering
     • Fitting experimental measurements to mathematical models

  5. Economics
     • Estimating relationships between economic variables
     • Income, consumption, inflation, and prices

  6. Signal Processing
     • Estimating signals
     • Reducing measurement errors

  7. Computer Vision
     • Image reconstruction
     • Geometric estimation
     • Fitting models to visual data

  8. Scientific Research
     • Experimental measurements rarely fit a theoretical model perfectly
     • Determining parameters that best fit observed data

  9. Finance
     • Risk analysis
     • Portfolio optimization

  10. Control Systems
     • System identification
     • Parameter estimation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, Least Squares is a mathematical method for finding the best approximate solution to a system when an exact solution may not exist.

The central problem is:

  minₓ ||b - A x||²

The most common theoretical solution uses the Normal Equations:

  Aᵀ A x̂ = Aᵀ b

and, when Aᵀ A is invertible:

  x̂ = (Aᵀ A)⁻¹ Aᵀ b

The geometric interpretation is that Least Squares finds the point in the column space of A that is closest to b.

Key Points:

  • Residual: r = b - A x
  • Least Squares minimizes ||r||²
  • The residual is orthogonal to Col(A): Aᵀ r = 0
  • Linear regression is a common application
  • The pseudoinverse generalizes the solution: x̂ = A⁺ b

The key idea to remember:

  Least Squares does not try to make every equation exactly correct. Instead, it finds the solution that makes the total squared error as small as possible.

This makes Least Squares one of the most important connections between Linear Algebra, statistics, data science, machine learning, optimization, and real-world data analysis.
  `,
  examples: [
    "Overdetermined system: 3 equations, 2 unknowns",
    "Least squares problem: minₓ ||b - Ax||²",
    "Normal equations: AᵀA x̂ = Aᵀ b",
    "Solution: x̂ = (AᵀA)⁻¹ Aᵀ b",
    "Example: Solve min ||Ax-b|| using normal equations",
    "Residual: r = b - A x̂",
    "Geometric: A x̂ = proj_Col(A) b",
    "Orthogonality: r ⟂ Col(A)",
    "Linear regression: y = mx + b",
    "Use linear regression to fit a line to data.",
    "Overdetermined system example with solution x̂ = [1/3, 3/2]ᵀ",
    "Pseudoinverse: x̂ = A⁺ b for non-square matrices",
    "QR decomposition and SVD for numerical stability",
  ],
};

export default topic;