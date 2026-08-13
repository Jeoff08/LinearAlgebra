const topic = {
  id: "foundations",
  title: "Foundations & Prerequisites",
  summary:
    "Core arithmetic and algebra skills: expressions, real/complex numbers, coordinate geometry, functions, basic proof techniques and notation.",
  details: `
Foundations & Prerequisites are the basic mathematical concepts and skills that students need to understand before studying Linear Algebra. They are called "foundations" because they serve as the building blocks for more advanced mathematical ideas. Linear Algebra involves equations, vectors, matrices, functions, and transformations, so having a good understanding of basic mathematics makes these topics much easier to learn.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. BASIC ARITHMETIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Students should be comfortable working with positive and negative numbers, fractions, decimals, and basic operations such as addition, subtraction, multiplication, and division.

Example: Before solving a matrix operation such as:

  [2  3]   [1  2]   [3  5]
  [4  5] + [3  4] = [7  9]

a student must already understand how to add numbers correctly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. ALGEBRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Algebra teaches students how to work with variables, expressions, equations, exponents, and factoring. These skills are frequently used in Linear Algebra.

Example: Consider the equation:

  2x + 5 = 15

To solve it, we subtract 5 from both sides and then divide by 2:

  2x = 10
  x = 5

This basic process of manipulating equations becomes very important when solving systems of linear equations using Linear Algebra methods.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. SYSTEMS OF EQUATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A system contains two or more equations that must be solved together. Systems of equations are one of the main starting points of Linear Algebra.

Example:

  2x + y = 5
  x - y = 1

The goal is to find values of x and y that satisfy both equations.

Solution: x = 2, y = 1

Later in Linear Algebra, this same type of problem can be represented using a matrix and solved using methods such as Gaussian elimination.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. FUNCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A function describes a relationship between an input and an output. Understanding functions helps students later understand linear transformations, which are an important concept in Linear Algebra.

Example: If f(x) = 2x + 3, then when x = 4:

  f(4) = 2(4) + 3 = 11

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. COORDINATE GEOMETRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Coordinate geometry introduces students to points, lines, slopes, and the coordinate plane. The idea of representing mathematical objects using coordinates becomes useful when studying vectors and vector spaces.

Example: The points (2,3) and (4,7) can be used to determine the slope of a line:

  m = (7 - 3) / (4 - 2) = 4 / 2 = 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. BASIC GEOMETRY & TRIGONOMETRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Geometry helps students understand concepts such as distance, angles, and direction, while trigonometry helps when working with vectors and their directions.

Example: The Pythagorean theorem can determine the length of a vector:

  √(3² + 4²) = √(9 + 16) = √25 = 5

Thus, a vector with components (3, 4) has a magnitude of 5.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. MATHEMATICAL NOTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Linear Algebra uses many symbols, such as =, ≠, ∑, ∈, ℝ, and |x|.

Example: x ∈ ℝ means that x belongs to the set of real numbers.

Understanding mathematical notation allows students to read Linear Algebra definitions and formulas more easily.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. PROBLEM-SOLVING & LOGICAL REASONING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Linear Algebra is not only about memorizing formulas; it requires students to understand relationships, follow logical steps, and determine how different mathematical concepts are connected.

Example: When solving a system of equations, students need to decide which equation to manipulate, what operation to perform, and how to verify the final answer.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Foundations & Prerequisites are the mathematical building blocks needed to study Linear Algebra effectively. The most important prerequisites include:

  ✓ Arithmetic
  ✓ Algebra
  ✓ Equations
  ✓ Systems of Equations
  ✓ Functions
  ✓ Coordinate Geometry
  ✓ Basic Geometry
  ✓ Trigonometry
  ✓ Mathematical Notation
  ✓ Problem-Solving Skills

For example, knowing how to solve a simple equation such as 2x + 5 = 15 helps prepare a student for solving systems of equations, while understanding coordinates and slopes prepares them for vectors and geometric interpretations.

Once these foundations are understood, students can move on to the major topics of Linear Algebra, such as:

  • Vectors
  • Matrices
  • Systems of Linear Equations
  • Determinants
  • Vector Spaces
  • Linear Transformations
  • Eigenvalues
  • Eigenvectors
  `,
  examples: [
    "Simplify (2x+3)-(x-5) = x+8",
    "Prove that the sum of two even integers is even.",
    "Solve 2x + 5 = 15 → x = 5",
    "Solve system: 2x+y=5, x-y=1 → x=2, y=1",
    "Find slope: (2,3) and (4,7) → m=2",
    "Vector magnitude: √(3²+4²) = 5",
  ],
};

export default topic;