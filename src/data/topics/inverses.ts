const topic = {
  id: "inverses",
  title: "Matrix Inverses",
  summary:
    "Definition, conditions for invertibility, methods (Gauss-Jordan, cofactors) and properties.",
  details: `
A Matrix Inverse is a matrix that reverses the effect of another matrix. It is similar to the reciprocal of a number. For example, the reciprocal of 5 is 1/5 because:

  5(1/5) = 1

In the same way, a matrix A has an inverse A⁻¹ if multiplying the two matrices produces the identity matrix:

  A A⁻¹ = A⁻¹ A = I

The inverse of a matrix is therefore written as A⁻¹.

Not every matrix has an inverse. A matrix must satisfy certain conditions before its inverse exists.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. IDENTITY MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before understanding matrix inverses, we need to understand the identity matrix.

The identity matrix is the matrix equivalent of the number 1.

For a 2×2 matrix, the identity matrix is:

  I = [1  0]
      [0  1]

For a 3×3 matrix:

  I = [1  0  0]
      [0  1  0]
      [0  0  1]

When a matrix is multiplied by the identity matrix, it remains unchanged:

  A I = I A = A

Therefore, the inverse is defined using the identity matrix:

  A A⁻¹ = I

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. WHAT DOES A MATRIX INVERSE DO?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose we have:

  A x = b

If A has an inverse, we can multiply both sides by A⁻¹:

  A⁻¹ A x = A⁻¹ b

Since A⁻¹ A = I, we obtain:

  I x = A⁻¹ b

Therefore:

  x = A⁻¹ b

This makes matrix inverses extremely useful for solving systems of linear equations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. INVERSE OF A 2×2 MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For a matrix:

  A = [a  b]
      [c  d]

the inverse is:

  A⁻¹ = (1/(ad-bc)) · [d  -b]
                      [-c  a]

provided that ad - bc ≠ 0.

The value ad - bc is the determinant of the matrix.

Therefore, det(A) ≠ 0 is required for the inverse to exist.

────────────────────────────────────────────────────────────────────────────────

Example: Finding a 2×2 Inverse

Consider:

  A = [2  1]
      [3  2]

First, calculate the determinant:

  det(A) = (2)(2) - (1)(3) = 4 - 3 = 1

Since det(A) ≠ 0, the matrix has an inverse.

Using the inverse formula:

  A⁻¹ = (1/1) · [2  -1]
                 [-3  2]

Therefore:

  A⁻¹ = [2  -1]
        [-3  2]

We can verify this by multiplying:

  A A⁻¹ = [2  1] [2  -1] = [1  0]
          [3  2] [-3  2]   [0  1]

Therefore, A A⁻¹ = I.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. WHEN DOES AN INVERSE EXIST?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A square matrix has an inverse if and only if its determinant is nonzero.

  det(A) ≠ 0  ⟺  A⁻¹ exists

A matrix with an inverse is called invertible or nonsingular.

A matrix without an inverse is called singular.

Example:

  A = [1  2]
      [2  4]

Its determinant is:

  det(A) = (1)(4) - (2)(2) = 4 - 4 = 0

Since det(A) = 0, the matrix does not have an inverse.

Therefore:

  A is singular

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. WHY DOES A ZERO DETERMINANT PREVENT AN INVERSE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A determinant of zero means that the matrix transformation loses some information.

Example:

  A = [1  2]
      [2  4]

The second row is simply twice the first row:

  [2  4] = 2[1  2]

Therefore, the rows do not provide two independent directions.

The transformation effectively collapses the plane into a lower-dimensional space.

Because information has been lost, there is no unique operation that can reverse the transformation.

Therefore:

  det(A) = 0  →  A⁻¹ does not exist

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. FINDING AN INVERSE USING GAUSS-JORDAN ELIMINATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Another important method for finding a matrix inverse is Gauss-Jordan elimination.

Suppose:

  A = [2  1]
      [3  2]

We create an augmented matrix by placing the identity matrix beside A:

  [2  1 | 1  0]
  [3  2 | 0  1]

The goal is to transform the left side into the identity matrix.

After performing elementary row operations, we obtain:

  [1  0 | 2  -1]
  [0  1 | -3  2]

The right side is therefore the inverse:

  A⁻¹ = [2  -1]
        [-3  2]

The general process is:

  [A | I]  →  [I | A⁻¹]

This method is especially useful for larger matrices because the 2×2 shortcut formula does not apply directly to 3×3, 4×4, and larger matrices.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. USING THE INVERSE TO SOLVE A SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider the system:

  2x + y = 5
  3x + 2y = 8

We can write this as A x = b where:

  A = [2  1]    x = [x]    b = [5]
      [3  2]        [y]        [8]

We already know that:

  A⁻¹ = [2  -1]
        [-3  2]

Therefore:

  x = A⁻¹ b

Substitute:

  x = [2  -1] [5] = [2(5) - 1(8)] = [10 - 8] = [2]
      [-3  2] [8]   [-3(5) + 2(8)]   [-15 + 16]   [1]

Therefore:

  x = 2    and    y = 1

We can verify:

  2(2) + 1 = 5  ✓
  3(2) + 2(1) = 8  ✓

So the solution is correct.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. PROPERTIES OF MATRIX INVERSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrix inverses have several important properties.

Property 1: Inverse of an inverse

  (A⁻¹)⁻¹ = A

Taking the inverse twice returns the original matrix.

Property 2: Inverse of a product

If A and B are invertible, then:

  (AB)⁻¹ = B⁻¹ A⁻¹

Notice that the order is reversed.

Property 3: Inverse of a transpose

  (Aᵀ)⁻¹ = (A⁻¹)ᵀ

Property 4: Inverse of a scalar multiple

For a nonzero scalar c:

  (cA)⁻¹ = (1/c) · A⁻¹

These properties are useful when simplifying complicated matrix expressions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. INVERSE AND LINEAR TRANSFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix can represent a linear transformation:

  T(x) = A x

If A is invertible, then there is another transformation:

  T⁻¹(x) = A⁻¹ x

that reverses the original transformation.

Therefore:

  A⁻¹ reverses the transformation performed by A

For example, if A transforms an object by stretching it and rotating it, A⁻¹ can reverse those operations.

This is why matrix inverses are extremely important in computer graphics, robotics, geometry, and transformations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. INVERSE MATRIX AND LINEAR INDEPENDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

There is also a strong relationship between matrix inverses and linear independence.

For a square matrix A, the following statements are equivalent:

  • A is invertible
  • det(A) ≠ 0
  • The columns of A are linearly independent
  • The rows of A are linearly independent
  • rank(A) = n
  • A x = 0 has only the trivial solution

These are different ways of describing the same fundamental property of a square matrix.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. INVERSE AND THE NULL SPACE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An invertible matrix has a very important property concerning its null space.

If A x = 0, we can multiply both sides by A⁻¹:

  A⁻¹ A x = A⁻¹ 0

Therefore:

  I x = 0

So:

  x = 0

Thus, an invertible matrix has a trivial null space:

  Null(A) = {0}

This is another way of understanding why invertible matrices do not lose information.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. GEOMETRIC INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix with an inverse represents a transformation that can be completely reversed.

For example, imagine a square or grid being transformed by a matrix.

If the transformation stretches, rotates, or shears the object without collapsing its dimension, an inverse transformation exists.

However, if the transformation squashes a two-dimensional object into a single line, information is lost.

That transformation cannot be reversed uniquely.

This is reflected mathematically by det(A) = 0.

Therefore:

  det(A) ≠ 0  →  transformation is reversible
  det(A) = 0  →  transformation is not reversible

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. APPLICATIONS OF MATRIX INVERSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Matrix inverses have many applications in mathematics, science, and technology.

  1. Systems of Equations
     • Solving A x = b using x = A⁻¹ b

  2. Computer Graphics
     • Reversing transformations (rotations, translations, scaling)

  3. Robotics
     • Converting between coordinate systems
     • Calculating robot movement

  4. Engineering
     • Solving mathematical models involving forces, circuits, structures, and systems

  5. Data Science & Statistics
     • Regression calculations
     • Covariance calculations
     • Optimization

  6. Machine Learning
     • Optimization algorithms
     • Linear regression
     • Transformations and numerical algorithms

  7. Cryptography
     • Encoding and decoding information
     • Invertible matrices allow original data to be recovered

  8. Physics
     • Reversing physical transformations
     • Coordinate transformations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, a Matrix Inverse is a matrix that reverses another matrix.

For a matrix A, its inverse A⁻¹ satisfies:

  A A⁻¹ = A⁻¹ A = I

For a 2×2 matrix:

  A = [a  b]
      [c  d]

the inverse is:

  A⁻¹ = (1/(ad-bc)) · [d  -b]
                      [-c  a]

when ad - bc ≠ 0.

The most important condition is:

  det(A) ≠ 0  ⟺  A is invertible

An invertible matrix has:
  • Linearly independent columns
  • Full rank
  • A trivial null space

Key Properties:

  • (A⁻¹)⁻¹ = A
  • (AB)⁻¹ = B⁻¹ A⁻¹
  • (Aᵀ)⁻¹ = (A⁻¹)ᵀ
  • (cA)⁻¹ = (1/c) · A⁻¹

The key idea to remember:

  A matrix inverse reverses the effect of a matrix. If a matrix does not lose information, its transformation can be reversed, and its inverse exists.

Matrix inverses are therefore fundamental to systems of linear equations, determinants, linear transformations, Gaussian elimination, linear independence, rank, computer graphics, engineering, and many applications of Linear Algebra.
  `,
  examples: [
    "Identity matrix: I = [[1,0],[0,1]]",
    "2×2 inverse formula: A⁻¹ = (1/(ad-bc))·[[d,-b],[-c,a]]",
    "Find inverse of A = [[2,1],[3,2]] → A⁻¹ = [[2,-1],[-3,2]]",
    "Check: A A⁻¹ = I",
    "Singular matrix: A = [[1,2],[2,4]] → det = 0 → no inverse",
    "Solve system: 2x+y=5, 3x+2y=8 using inverse → x=2, y=1",
    "Property: (AB)⁻¹ = B⁻¹ A⁻¹",
    "Property: (A⁻¹)⁻¹ = A",
    "Property: (Aᵀ)⁻¹ = (A⁻¹)ᵀ",
    "Invertible ⟺ det(A) ≠ 0 ⟺ columns linearly independent",
    "Invertible matrix has trivial null space: Null(A) = {0}",
    "Compute the inverse of a 2x2 matrix [[a,b],[c,d]]",
    "Use the inverse to solve Ax=b when A is invertible.",
  ],
};

export default topic;