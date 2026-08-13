const topic = {
  id: "systems",
  title: "Systems of Linear Equations",
  summary:
    "Solving linear systems: Gaussian elimination, row operations, REF/RREF and solution classification.",
  details: `
A System of Linear Equations is a collection of two or more linear equations that involve the same variables. The goal is to find the values of the variables that satisfy all of the equations simultaneously.

In simple terms:

  A system of linear equations is a group of equations that must be solved together to find values that make every equation true at the same time.

Example:

  x + y = 7
  x - y = 1

is a system of two linear equations with two unknowns, x and y.

The solution is the ordered pair (x, y) = (4, 3) because 4 + 3 = 7 and 4 - 3 = 1.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. GENERAL FORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A system of linear equations can be written as:

  a₁₁x₁ + a₁₂x₂ + ... + a₁ₙxₙ = b₁
  a₂₁x₁ + a₂₂x₂ + ... + a₂ₙxₙ = b₂
  ⋮
  aₘ₁x₁ + aₘ₂x₂ + ... + aₘₙxₙ = bₘ

where:
  • x₁, x₂, ..., xₙ are the unknown variables
  • aᵢⱼ are coefficients
  • b₁, b₂, ..., bₘ are constants

The system can be represented compactly as:

  A x = b

where A is the coefficient matrix, x is the vector of unknowns, and b is the constant vector.

────────────────────────────────────────────────────────────────────────────────

Example

Consider:

  2x + y = 7
  x - y = 2

The coefficient matrix is:

  A = [2  1]
      [1 -1]

The variable vector is:

  x = [x]
      [y]

and the constant vector is:

  b = [7]
      [2]

Therefore:

  [2  1] [x] = [7]
  [1 -1] [y]   [2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. WHAT IS A SOLUTION?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A solution to a system is a set of values for the variables that satisfies every equation in the system.

Example:

  x + y = 7
  x - y = 1

has the solution:

  x = 4,    y = 3

Check the first equation:

  4 + 3 = 7  ✓

Check the second equation:

  4 - 3 = 1  ✓

Since both equations are satisfied, (x, y) = (4, 3) is the solution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. THREE POSSIBLE TYPES OF SOLUTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A system of linear equations can have:

  1. One unique solution
  2. Infinitely many solutions
  3. No solution

These possibilities are important when analyzing systems.

────────────────────────────────────────────────────────────────────────────────

1. Unique Solution

A system has a unique solution when exactly one set of values satisfies all equations.

Example:

  x + y = 7
  x - y = 1

has one solution: (x, y) = (4, 3).

Geometrically, if the equations are represented as lines, the lines intersect at exactly one point.

────────────────────────────────────────────────────────────────────────────────

2. Infinitely Many Solutions

A system has infinitely many solutions when the equations represent the same line or otherwise contain dependent equations.

Example:

  x + y = 5
  2x + 2y = 10

The second equation is simply twice the first:

  2(x + y) = 2(5)

Therefore, both equations represent the same line.

Any point satisfying x + y = 5 is a solution.

Examples: (0,5), (1,4), (2,3), (5,0) are all solutions.

Therefore, infinitely many solutions exist.

────────────────────────────────────────────────────────────────────────────────

3. No Solution

A system has no solution when the equations contradict each other.

Example:

  x + y = 5
  x + y = 8

cannot both be true.

The same expression x + y cannot equal both 5 and 8.

Therefore, no solution.

Geometrically, the two lines are parallel and never intersect.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. GRAPHICAL INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For two variables, each linear equation represents a line.

Example:

  y = 2x + 1    represents one line
  y = -x + 4    represents another line

Their intersection represents the solution of the system.

There are three possibilities:

  • One intersection        → One solution
  • Same line                → Infinitely many solutions
  • Parallel lines           → No solution

This geometric interpretation makes the three types of solutions easier to understand.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. METHOD 1: SUBSTITUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Substitution Method involves solving one equation for one variable and substituting that expression into the other equation.

Consider:

  x + y = 7
  x - y = 1

From the first equation:

  x = 7 - y

Substitute this into the second equation:

  (7 - y) - y = 1

Simplify:

  7 - 2y = 1

Therefore:

  -2y = -6

So:

  y = 3

Substitute y = 3 into x + y = 7:

  x + 3 = 7

Therefore:

  x = 4

The solution is (x, y) = (4, 3).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. METHOD 2: ELIMINATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Elimination Method removes one variable by adding or subtracting equations.

Consider:

  2x + y = 7
  x - y = 2

Add the equations:

  (2x + y) + (x - y) = 7 + 2

The y terms cancel:

  3x = 9

Therefore:

  x = 3

Substitute into x - y = 2:

  3 - y = 2

Therefore:

  y = 1

Thus:

  (x, y) = (3, 1)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. METHOD 3: GAUSSIAN ELIMINATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gaussian Elimination is one of the most important methods in Linear Algebra.

Instead of manipulating equations directly, we represent the system as an augmented matrix.

Consider:

  x + y = 5
  2x + 3y = 12

The augmented matrix is:

  [1  1 | 5]
  [2  3 | 12]

Perform R₂ → R₂ - 2R₁:

  [1  1 | 5]
  [0  1 | 2]

The second row gives:

  y = 2

Substitute into the first equation:

  x + 2 = 5

Therefore:

  x = 3

Thus:

  (x, y) = (3, 2)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. ROW ECHELON FORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gaussian Elimination transforms a matrix into Row Echelon Form (REF).

Example:

  [1  2  3]
  [0  1  4]
  [0  0  1]

is in row echelon form.

The important feature is that the pivots move toward the right as we move down the rows.

Row echelon form makes it easier to determine:
  • Rank
  • Solutions
  • Free variables
  • Consistency

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. REDUCED ROW ECHELON FORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A stronger form is the Reduced Row Echelon Form (RREF).

Example:

  [1  0  3]
  [0  1  2]

is in reduced row echelon form.

The pivot entries are 1, and each pivot is the only nonzero entry in its column.

RREF is especially useful because it can directly reveal the solution of a system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. MATRIX FORM OF A SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A system can be represented as:

  A x = b

Example:

  2x + y = 8
  x - y = 1

can be written as:

  [2  1] [x] = [8]
  [1 -1] [y]   [1]

This matrix representation is one of the major reasons systems of equations are important in Linear Algebra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. HOMOGENEOUS SYSTEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A homogeneous system is a system where all constants are zero.

It has the form:

  A x = 0

Example:

  x + 2y = 0
  3x + 6y = 0

A homogeneous system always has at least one solution:

  x = 0

This is called the trivial solution.

────────────────────────────────────────────────────────────────────────────────

Nontrivial Solutions

A homogeneous system may also have solutions other than zero.

Example:

  x + y = 0

We can write:

  x = -y

Therefore, solutions include:
  (1, -1), (2, -2), (3, -3)

These are called nontrivial solutions.

A homogeneous system has nontrivial solutions when the coefficient matrix does not have full column rank.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. RANK AND SYSTEMS OF EQUATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rank provides a powerful way to determine whether a system has a solution.

For A x = b, compare:

  rank(A)    with    rank([A | b])

The system is consistent if:

  rank(A) = rank([A | b])

If they are different:

  rank(A) < rank([A | b])

the system has no solution.

────────────────────────────────────────────────────────────────────────────────

Rank Conditions for Solutions

Suppose there are n unknowns.

  • Unique solution:     rank(A) = rank([A | b]) = n

  • Infinitely many:     rank(A) = rank([A | b]) < n

  • No solution:         rank(A) < rank([A | b])

These conditions are extremely useful when analyzing large systems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. SYSTEMS AND MATRIX INVERSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If A is a square and invertible matrix, then:

  A x = b

can be solved using:

  x = A⁻¹ b

Example:

  A = [2  1]
      [1  1]

If A⁻¹ exists, we can multiply both sides by A⁻¹:

  A⁻¹ A x = A⁻¹ b

Since A⁻¹ A = I, we get:

  x = A⁻¹ b

However, for larger systems, Gaussian Elimination, LU decomposition, or other numerical methods are often more practical than explicitly computing the inverse.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. CRAMER'S RULE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For small square systems, Cramer's Rule can be used.

For A x = b, the solution can be calculated using determinants.

For a two-variable system:

  ax + by = e
  cx + dy = f

the determinant is:

  D = det[a  b]
          [c  d]

If D ≠ 0, then there is a unique solution.

The variables can be calculated using:

  x = D_x / D    and    y = D_y / D

Cramer's Rule is useful for understanding the relationship between determinants and systems, although it is generally inefficient for large systems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. LU DECOMPOSITION AND SYSTEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A system:

  A x = b

can also be solved using LU Decomposition.

The matrix is factored as:

  A = L U

where:
  • L is a lower triangular matrix
  • U is an upper triangular matrix

Then:

  L U x = b

Let:

  U x = y

First solve:

  L y = b

then solve:

  U x = y

This method is particularly useful when solving multiple systems with the same coefficient matrix.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. SYSTEMS AND LINEAR TRANSFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A system:

  A x = b

can also be interpreted as asking:

  Which input vector x is transformed by A into b?

In other words:

  x → A → b

This connects systems of equations directly to Linear Transformations.

If b belongs to the column space of A, then the system has at least one solution.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

17. SYSTEMS AND GEOMETRY IN THREE DIMENSIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For three variables:

  a₁x + b₁y + c₁z = d₁
  a₂x + b₂y + c₂z = d₂
  a₃x + b₃y + c₃z = d₃

each equation represents a plane.

The solution is the point or set of points shared by all planes.

Possible situations include:
  • One common point → unique solution
  • A common line → infinitely many solutions
  • No common point → no solution

Thus, systems of equations connect algebraic calculations with geometry.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

18. EXAMPLE: THREE EQUATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider:

  x + y + z = 6
  2x + y + z = 7
  x + 2y + z = 7

Subtract the first equation from the second:

  x = 1

Subtract the first equation from the third:

  y = 1

Substitute into x + y + z = 6:

  1 + 1 + z = 6

Therefore:

  z = 4

Thus:

  (x, y, z) = (1, 1, 4)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

19. REAL-WORLD APPLICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Systems of linear equations are used throughout science, engineering, technology, economics, and computing.

Engineering
  • Electrical circuits
  • Structural forces
  • Mechanical systems
  • Fluid networks

Computer Science
  • Computer graphics
  • Robotics
  • Machine Learning
  • Computer Vision
  • Network analysis
  • Optimization

Economics
  • Supply and demand
  • Production
  • Resource allocation
  • Economic relationships

Physics
  • Forces
  • Motion
  • Energy
  • Electrical circuits

Data Science
  • Linear regression
  • Least Squares
  • Data fitting
  • Optimization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

20. EXAMPLE: REAL-WORLD APPLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose a store sells notebooks and pens.

Let:
  x = number of notebooks
  y = number of pens

Suppose the store sells 10 items total:

  x + y = 10

A notebook costs ₱50 and a pen costs ₱20, and the total sales are ₱350:

  50x + 20y = 350

The system is:

  x + y = 10
  50x + 20y = 350

From the first equation:

  y = 10 - x

Substitute:

  50x + 20(10 - x) = 350

Simplify:

  50x + 200 - 20x = 350
  30x = 150

Therefore:

  x = 5

Then:

  y = 10 - 5 = 5

So the store sold 5 notebooks and 5 pens.

This demonstrates how systems of linear equations can model real-world situations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

21. IMPORTANT METHODS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When studying Systems of Linear Equations, make sure you understand:

  • Substitution
  • Elimination
  • Gaussian Elimination
  • Gauss-Jordan Elimination
  • Matrix Inverse
  • Cramer's Rule
  • LU Decomposition
  • Rank
  • Augmented Matrix
  • Homogeneous Systems
  • Consistency
  • Unique and Infinite Solutions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, a System of Linear Equations is a group of linear equations that must be satisfied simultaneously.

The most important matrix representation is:

  A x = b

A system can have:

  • One unique solution
  • Infinitely many solutions
  • No solution

Systems can be solved using methods such as:
  • Substitution
  • Elimination
  • Gaussian Elimination
  • Gauss-Jordan Elimination
  • Matrix Inverses
  • Cramer's Rule
  • LU Decomposition

Rank provides an important test for determining the type of solution:

  rank(A) = rank([A | b]) → consistent system
  rank(A) = rank([A | b]) = n → unique solution
  rank(A) = rank([A | b]) < n → infinitely many solutions
  rank(A) < rank([A | b]) → no solution

Key Forms:

  • Row Echelon Form (REF): pivots move right
  • Reduced Row Echelon Form (RREF): pivots are 1 and alone in their columns

Key Concepts:

  • Augmented matrix: [A | b]
  • Homogeneous system: A x = 0 (always has trivial solution)
  • Trivial solution: x = 0
  • Nontrivial solutions: x ≠ 0 (when columns are dependent)

The key idea to remember:

  A system of linear equations represents multiple linear relationships that must hold at the same time. In Linear Algebra, these systems are represented as A x = b, allowing us to use matrices, row reduction, rank, inverses, and factorizations to efficiently find and analyze their solutions.
  `,
  examples: [
    "System: x+y=7, x-y=1 → solution (4,3)",
    "System: x+y=5, 2x+2y=10 → infinitely many solutions",
    "System: x+y=5, x+y=8 → no solution",
    "Substitution: solve x+y=7, x-y=1 → (4,3)",
    "Elimination: solve 2x+y=7, x-y=2 → (3,1)",
    "Gaussian Elimination: augmented matrix [1 1|5; 2 3|12] → (3,2)",
    "REF: [1 2 3; 0 1 4; 0 0 1]",
    "RREF: [1 0 3; 0 1 2]",
    "Matrix form: A x = b",
    "Homogeneous: A x = 0 → trivial solution x = 0",
    "Rank condition: rank(A) = rank([A|b]) → consistent",
    "Cramer's Rule: x = D_x/D, y = D_y/D",
    "LU Decomposition: A = L U, solve L y = b, U x = y",
    "3 equations: x+y+z=6, 2x+y+z=7, x+2y+z=7 → (1,1,4)",
    "Real-world: notebooks and pens → x=5, y=5",
    "Solve by elimination: x+y=3, x-y=1",
    "Identify free variables from a system in RREF.",
  ],
};

export default topic;