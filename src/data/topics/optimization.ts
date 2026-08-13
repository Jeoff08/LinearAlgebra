const topic = {
  id: "optimization",
  title: "Optimization",
  summary:
    "Linear programming, objective functions, constraints, feasible regions, simplex method, and duality.",
  details: `
Optimization is the process of finding the best possible solution to a problem while satisfying certain conditions or constraints. In mathematics, optimization is used to find the maximum or minimum value of a function.

In simple terms, optimization asks:

  "What is the best possible choice among all available choices?"

For example, a company may want to maximize its profit, a delivery system may want to minimize travel distance, or a machine-learning model may want to minimize its prediction error.

Mathematically, an optimization problem can be written as:

  Minimize or Maximize f(x)

subject to certain constraints.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. OBJECTIVE FUNCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The function that we want to minimize or maximize is called the objective function.

Example:

  f(x) = x² - 4x + 5

Suppose we want to find the minimum value of f(x).

The objective is:

  Minimize f(x)

The function describes what we are trying to optimize.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. EXAMPLE OF OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider:

  f(x) = x² - 4x + 5

To find the minimum, take the derivative:

  f'(x) = 2x - 4

Set the derivative equal to zero:

  2x - 4 = 0

Therefore:

  x = 2

Substitute x = 2:

  f(2) = 2² - 4(2) + 5
  f(2) = 4 - 8 + 5
  f(2) = 1

So the minimum value is 1 and it occurs at x = 2.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. MAXIMUM AND MINIMUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Optimization problems can involve either maximization or minimization.

────────────────────────────────────────────────────────────────────────────────

Maximization

The goal is to find the largest possible value:

  max f(x)

Examples:
  • Profit
  • Production
  • Efficiency
  • Accuracy
  • Performance

────────────────────────────────────────────────────────────────────────────────

Minimization

The goal is to find the smallest possible value:

  min f(x)

Examples:
  • Cost
  • Distance
  • Error
  • Energy consumption
  • Processing time

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. LOCAL AND GLOBAL OPTIMUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An optimization problem can have different types of optimal points.

  • A local minimum is a point where the function is smaller than nearby values.
  • A local maximum is a point where the function is larger than nearby values.
  • A global minimum is the smallest value over the entire domain.
  • A global maximum is the largest value over the entire domain.

Example: A function can have several local minima but only one global minimum.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. DERIVATIVES AND OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calculus is closely connected to optimization.

For a differentiable function f(x), a possible optimum occurs where:

  f'(x) = 0

These points are called critical points.

However, not every critical point is a maximum or minimum.

Example:

  f(x) = x³

Its derivative is:

  f'(x) = 3x²

Setting 3x² = 0 gives x = 0.

But x = 0 is neither a maximum nor a minimum because the function continues increasing through that point.

Therefore, critical points must be analyzed further.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. SECOND DERIVATIVE TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The second derivative can help determine whether a critical point is a local maximum or minimum.

If f'(x) = 0, then examine f''(x).

  • If f''(x) > 0, the point is generally a local minimum.
  • If f''(x) < 0, the point is generally a local maximum.

Example:

  f(x) = x² - 4x + 5

We have:

  f'(x) = 2x - 4    and    f''(x) = 2

Since f''(x) > 0, the critical point is a minimum.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. MULTIVARIABLE OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Optimization becomes more powerful when there are multiple variables.

Example:

  f(x, y) = x² + y²

We want to minimize f(x, y).

The partial derivatives are:

  ∂f/∂x = 2x    and    ∂f/∂y = 2y

Set both equal to zero:

  2x = 0    and    2y = 0

Therefore:

  x = 0,    y = 0

The minimum occurs at (0, 0).

The minimum value is:

  f(0, 0) = 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. GRADIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For a function of several variables, the gradient contains the partial derivatives.

For f(x, y), the gradient is:

  ∇f = [∂f/∂x]
       [∂f/∂y]

For three variables, f(x, y, z), the gradient becomes:

  ∇f = [∂f/∂x]
       [∂f/∂y]
       [∂f/∂z]

The gradient points in the direction of steepest increase of the function.

Therefore, the negative gradient points toward the direction of steepest decrease.

This idea is fundamental to Gradient Descent.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. GRADIENT DESCENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gradient Descent is one of the most important optimization algorithms in Computer Science and Machine Learning.

The basic idea is to repeatedly move in the direction that decreases the objective function.

The update rule is:

  xₖ₊₁ = xₖ - α ∇f(xₖ)

where:
  • xₖ is the current point
  • xₖ₊₁ is the next point
  • α is the learning rate
  • ∇f(xₖ) is the gradient

The learning rate determines how large each step is.

────────────────────────────────────────────────────────────────────────────────

Example of Gradient Descent

Consider:

  f(x) = x²

The derivative is:

  f'(x) = 2x

The gradient descent update becomes:

  xₖ₊₁ = xₖ - α(2xₖ)

Suppose x₀ = 5 and α = 0.1.

Then:

  x₁ = 5 - 0.1(10) = 4
  x₂ = 4 - 0.1(8) = 3.2
  x₃ = 3.2 - 0.1(6.4) = 2.56

The values continue moving toward x = 0, which is the minimum.

Conceptually:

  5 → 4 → 3.2 → 2.56 → ... → 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. LEARNING RATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The learning rate controls how large a step the optimization algorithm takes.

It is usually represented by α.

  • If the learning rate is too small, optimization may be very slow.
  • If the learning rate is too large, the algorithm may overshoot the minimum or even diverge.

Conceptually:

  Small α → slow learning
  Large α → possible instability

Therefore, selecting an appropriate learning rate is important.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. CONVEX OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A function is convex when its graph has a bowl-like structure.

For a convex optimization problem, a local minimum is also a global minimum under appropriate conditions.

Example:

  f(x) = x²

is convex.

Its graph has a single lowest point: x = 0.

Therefore:

  local minimum = global minimum

Convex optimization is important because convex problems are generally easier to solve reliably.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. QUADRATIC OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A quadratic function can be written as:

  f(x) = ½ xᵀ A x - bᵀ x + c

where:
  • x is a vector
  • A is a matrix
  • b is a vector
  • c is a scalar

Quadratic optimization is strongly connected to Linear Algebra.

For example, the gradient is:

  ∇f(x) = A x - b

when A is symmetric.

Setting the gradient equal to zero gives:

  A x - b = 0

Therefore:

  A x = b

This demonstrates an important relationship:

  An optimization problem can sometimes be transformed into a system of linear equations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. HESSIAN MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For multivariable optimization, the Hessian matrix contains the second-order partial derivatives.

For f(x, y), the Hessian is:

  H = [∂²f/∂x²    ∂²f/∂x∂y]
      [∂²f/∂y∂x    ∂²f/∂y²]

The Hessian provides information about the curvature of a function.

  • If the Hessian is positive definite at a critical point, the point is typically a local minimum.
  • If it is negative definite, the point is typically a local maximum.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. CONSTRAINED OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sometimes we cannot choose any value we want. There may be constraints.

Example:

  x + y = 10

Suppose we want to minimize:

  f(x, y) = x² + y²

subject to:

  x + y = 10

The condition x + y = 10 is called a constraint.

The optimization problem can be written as:

  min f(x, y) = x² + y²
  subject to: x + y = 10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. LAGRANGE MULTIPLIERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One method for solving constrained optimization problems is the Lagrange Multiplier Method.

For f(x, y) subject to g(x, y) = c, we construct:

  ℒ(x, y, λ) = f(x, y) + λ(g(x, y) - c)

Then we solve:

  ∂ℒ/∂x = 0
  ∂ℒ/∂y = 0
  ∂ℒ/∂λ = 0

The variable λ is called the Lagrange multiplier.

────────────────────────────────────────────────────────────────────────────────

Example of Lagrange Multipliers

Suppose we want to minimize:

  f(x, y) = x² + y²

subject to:

  x + y = 10

Construct:

  ℒ = x² + y² + λ(x + y - 10)

Take the partial derivatives:

  2x + λ = 0
  2y + λ = 0
  x + y - 10 = 0

From the first two equations:

  2x = 2y

Therefore:

  x = y

Since x + y = 10, we obtain:

  x = y = 5

Thus, (x, y) = (5, 5) gives the minimum.

The minimum value is:

  f(5, 5) = 25 + 25 = 50

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. LINEAR PROGRAMMING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Linear Programming is an optimization method in which the objective function and constraints are linear.

Example:

  Maximize Z = 3x + 2y

subject to:

  x + y ≤ 10
  2x + y ≤ 15
  x ≥ 0
  y ≥ 0

This type of problem is called a linear programming problem.

Linear programming is widely used in:
  • Business
  • Manufacturing
  • Transportation
  • Scheduling
  • Resource allocation
  • Supply-chain management

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

17. INTEGER PROGRAMMING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In some optimization problems, variables must be integers.

Example:

  x ∈ ℤ

Suppose a company needs to determine how many trucks to use.

It cannot use 3.5 trucks.

Therefore, the variable must be an integer.

This leads to Integer Programming.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

18. NONLINEAR OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the objective function or constraints contain nonlinear terms, the problem is called nonlinear optimization.

Example:

  f(x) = x² + 3x + 1

This is nonlinear because of x².

Other examples include:
  • xy
  • sin(x)
  • eˣ

Nonlinear optimization can be significantly more difficult than linear optimization.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

19. UNCONSTRAINED VS. CONSTRAINED OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Optimization problems can be divided into two major categories.

────────────────────────────────────────────────────────────────────────────────

Unconstrained Optimization

There are no explicit restrictions.

  min f(x)

Example:

  min x²

────────────────────────────────────────────────────────────────────────────────

Constrained Optimization

There are restrictions.

  min f(x)

subject to:

  g(x) ≤ 0

Example:

  min x² + y²
  subject to: x + y = 10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

20. OPTIMIZATION AND LINEAR ALGEBRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Optimization is strongly connected to Linear Algebra.

Vectors are used to represent variables:

  x = [x₁]
      [x₂]
      [⋮]
      [xₙ]

Matrices are used to represent relationships between variables.

For example, a quadratic objective can be written as:

  f(x) = ½ xᵀ A x - bᵀ x + c

The gradient is:

  ∇f(x) = A x - b

and the Hessian is:

  ∇²f(x) = A

Therefore, matrices provide the mathematical structure needed for many optimization algorithms.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

21. OPTIMIZATION AND LEAST SQUARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Least Squares is one of the most important optimization problems.

Suppose we have:

  A x ≈ b

We want to find the vector x that minimizes the squared error:

  minₓ ||A x - b||²

This is an optimization problem.

The resulting normal equations are:

  Aᵀ A x = Aᵀ b

QR Decomposition and SVD can provide numerically better approaches for solving least-squares problems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

22. OPTIMIZATION IN MACHINE LEARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Optimization is one of the foundations of Machine Learning.

A machine-learning model makes predictions, compares them with the correct answers, and calculates an error called a loss function.

Example:

  L(θ)

represents the loss depending on model parameters θ.

The goal is:

  minₓ L(θ)

The optimization algorithm changes the model parameters so that the loss becomes smaller.

Gradient Descent is one of the most commonly used methods.

────────────────────────────────────────────────────────────────────────────────

Example: Neural Network Optimization

Suppose a neural network has parameters:

  θ = [w₁]
      [w₂]
      [w₃]

The network produces a prediction, and a loss function measures the error:

  L(θ)

The gradient is:

  ∇L(θ)

The parameters are updated using:

  θ_new = θ_old - α ∇L(θ_old)

This process is repeated many times during training.

Therefore, optimization is one of the mathematical foundations behind modern machine learning.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

23. OPTIMIZATION IN COMPUTER SCIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Optimization appears in many areas of Computer Science.

  • Artificial Intelligence: Finding model parameters that minimize prediction error
  • Machine Learning: Training models using optimization algorithms
  • Computer Graphics: Finding efficient transformations and rendering parameters
  • Networking: Optimizing routing and resource allocation
  • Databases: Optimizing query execution plans
  • Algorithms: Finding solutions that minimize time or memory usage
  • Robotics: Finding efficient paths and movements
  • Scheduling: Assigning tasks while minimizing time or cost

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

24. OPTIMIZATION IN REAL-WORLD PROBLEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider a delivery company.

The company has several warehouses and customers.

It wants to determine:
  • Which vehicle should deliver each package?
  • Which route should each vehicle take?
  • How much fuel will be used?
  • How can delivery time be minimized?

This can be modeled as an optimization problem.

The objective might be:

  Minimize total delivery cost

while satisfying constraints such as:
  • Vehicle capacity
  • Delivery deadlines
  • Available vehicles

This demonstrates how mathematical optimization can solve practical problems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

25. COMMON OPTIMIZATION ALGORITHMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Some important optimization methods include:

  • Gradient Descent
  • Stochastic Gradient Descent
  • Newton's Method
  • Coordinate Descent
  • Conjugate Gradient
  • Lagrange Multipliers
  • Linear Programming
  • Quadratic Programming
  • Interior-Point Methods
  • Sequential Quadratic Programming

Each method is designed for particular types of optimization problems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

26. GRADIENT DESCENT VS. NEWTON'S METHOD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gradient Descent uses first-order information:

  xₖ₊₁ = xₖ - α ∇f(xₖ)

Newton's Method uses both first- and second-order information:

  xₖ₊₁ = xₖ - H(xₖ)⁻¹ ∇f(xₖ)

where H(xₖ) is the Hessian matrix.

Newton's Method can converge very quickly near a solution, but calculating and inverting the Hessian can be computationally expensive for large problems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

27. OPTIMIZATION AND NUMERICAL LINEAR ALGEBRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Optimization and Numerical Linear Algebra are closely connected.

Optimization algorithms frequently require:
  • Matrix multiplication
  • Matrix-vector multiplication
  • Solving linear systems
  • Matrix factorizations
  • Eigenvalue calculations
  • Gradient calculations
  • Hessian calculations

For example, Newton's Method requires solving a system involving the Hessian:

  H(xₖ) pₖ = -∇f(xₖ)

Numerical Linear Algebra provides the computational tools needed to solve this efficiently.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

28. IMPORTANT OPTIMIZATION CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When studying Optimization, it is important to understand:

  • Objective Function
  • Maximum and Minimum
  • Local and Global Optima
  • Gradient
  • Hessian
  • Gradient Descent
  • Learning Rate
  • Convex Optimization
  • Constrained Optimization
  • Lagrange Multipliers
  • Linear Programming
  • Nonlinear Optimization
  • Least Squares
  • Numerical Optimization
  • Optimization in Machine Learning

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, Optimization is the study of finding the best possible solution to a problem by minimizing or maximizing an objective function.

The basic form is:

  minₓ f(x)

or:

  maxₓ f(x)

Optimization can be:
  • Unconstrained or constrained
  • Linear or nonlinear
  • Convex or non-convex
  • Continuous or discrete

Important mathematical tools include:

  • Gradient:         ∇f(x)
  • Hessian:          H(x)
  • Gradient Descent: xₖ₊₁ = xₖ - α ∇f(xₖ)
  • Lagrange Multipliers: ℒ = f + λ(g - c)
  • Linear Programming: maximize linear objective with linear constraints
  • Least Squares: minₓ ||A x - b||²

Key Relationships to Linear Algebra:

  • Quadratic functions use matrices: f(x) = ½ xᵀ A x - bᵀ x + c
  • Gradient: ∇f(x) = A x - b
  • Hessian: ∇²f(x) = A
  • Normal equations: Aᵀ A x = Aᵀ b

The key idea to remember:

  Optimization is the process of finding the best possible solution while minimizing or maximizing a chosen objective, often subject to specific constraints.

In Linear Algebra and Computer Science, optimization is especially important because it connects vectors, matrices, derivatives, numerical methods, machine learning, artificial intelligence, data science, engineering, and real-world decision-making.
  `,
  examples: [
    "Objective function: f(x) = x² - 4x + 5 → min at x = 2, f(2) = 1",
    "Derivative: f'(x) = 2x - 4, set to 0 → x = 2",
    "Second derivative test: f''(x) = 2 > 0 → minimum",
    "Multivariable: f(x,y) = x² + y² → min at (0,0)",
    "Gradient: ∇f = [∂f/∂x, ∂f/∂y]ᵀ",
    "Gradient Descent: xₖ₊₁ = xₖ - α ∇f(xₖ)",
    "Learning rate α controls step size",
    "Convex function: f(x) = x² has global minimum at x = 0",
    "Quadratic: f(x) = ½ xᵀ A x - bᵀ x + c",
    "Hessian: H = [[∂²f/∂x², ∂²f/∂x∂y],[∂²f/∂y∂x, ∂²f/∂y²]]",
    "Lagrange multipliers: ℒ = f + λ(g - c)",
    "Example: min x²+y² subject to x+y=10 → (5,5), min=50",
    "Linear programming: maximize Z = 3x + 2y with constraints",
    "Least squares: minₓ ||A x - b||²",
    "Newton's method: xₖ₊₁ = xₖ - H⁻¹ ∇f",
    "Formulate a small linear program and solve it graphically",
    "Set up a simplex tableau for a simple LP.",
  ],
};

export default topic;