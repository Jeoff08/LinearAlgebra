const topic = {
  id: "vectors",
  title: "Vectors",
  summary:
    "Vectors, operations, dot and cross products, geometric interpretation, vector spaces and examples.",
  details: `
A vector is a mathematical object that represents a quantity with both magnitude and direction. Unlike a scalar, which only has a magnitude, a vector tells us not only how much of something there is but also which direction it points.

In simple terms:

  A vector represents a quantity that has both size and direction.

Vectors are one of the most fundamental concepts in Linear Algebra because they are used to represent points, directions, forces, velocities, transformations, data, and many other mathematical and real-world quantities.

A vector is commonly represented using bold letters such as v or an arrow: →v.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SCALAR VS. VECTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before understanding vectors, it is important to distinguish them from scalars.

A scalar has only magnitude.

Examples include:
  • Temperature
  • Mass
  • Time
  • Distance
  • Speed

Example: 50 kg is a scalar because it only tells us the amount of mass.

A vector has both magnitude and direction.

Example: 50 km/h east is a vector because it tells us both the speed and the direction.

Therefore:

  Scalar = Magnitude
  Vector = Magnitude + Direction

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. REPRESENTING A VECTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A vector in two dimensions can be written as:

  v = [v₁]
      [v₂]

Example:

  v = [3]
      [4]

This vector means that we move:
  • 3 units in the x-direction
  • 4 units in the y-direction

It can also be written as:

  v = 3i + 4j

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. VECTORS IN THREE DIMENSIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A vector in three-dimensional space can be written as:

  v = [v₁]
      [v₂]
      [v₃]

Example:

  v = [2]
      [3]
      [5]

This vector has components:
  v₁ = 2,  v₂ = 3,  v₃ = 5

The three components represent movement along the x-, y-, and z-axes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. COMPONENTS OF A VECTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The individual values of a vector are called its components.

For:

  v = [4]
      [-2]
      [7]

the components are 4, -2, 7.

The negative value indicates movement in the negative direction of that coordinate axis.

Example: -2 means movement in the negative y-direction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. GEOMETRIC REPRESENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vectors can be represented graphically as arrows.

  • Length of the arrow represents the magnitude.
  • Direction of the arrow represents the vector's direction.
  • Starting point can vary without changing the vector, as long as its length and direction remain the same.

Example: v = [3, 4]ᵀ can be represented by an arrow moving 3 units horizontally and 4 units vertically.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. MAGNITUDE OF A VECTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The magnitude or length of a vector is written as ||v||.

For a two-dimensional vector:

  v = [x]
      [y]

the magnitude is:

  ||v|| = √(x² + y²)

For a three-dimensional vector:

  v = [x]
      [y]
      [z]

the magnitude is:

  ||v|| = √(x² + y² + z²)

────────────────────────────────────────────────────────────────────────────────

Example: Magnitude

Consider:

  v = [3]
      [4]

Its magnitude is:

  ||v|| = √(3² + 4²) = √(9 + 16) = √25 = 5

Thus:

  ||v|| = 5

This is the familiar 3-4-5 right triangle.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. VECTOR ADDITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vectors can be added by adding their corresponding components.

Suppose:

  u = [2]    v = [4]
      [3]        [1]

Then:

  u + v = [2 + 4] = [6]
          [3 + 1]   [4]

Therefore:

  u + v = [6]
          [4]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. VECTOR SUBTRACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vectors can also be subtracted component by component.

Suppose:

  u = [5]    v = [2]
      [7]        [3]

Then:

  u - v = [5 - 2] = [3]
          [7 - 3]   [4]

Therefore:

  u - v = [3]
          [4]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. SCALAR MULTIPLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A vector can be multiplied by a scalar.

Suppose:

  v = [2]
      [3]

Multiplying it by 4 gives:

  4v = 4[2] = [8]
        [3]   [12]

Scalar multiplication changes the magnitude of the vector.

If the scalar is negative, it also reverses the direction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. ZERO VECTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The zero vector is a vector whose components are all zero.

In two dimensions:

  0 = [0]
      [0]

In three dimensions:

  0 = [0]
      [0]
      [0]

The zero vector has magnitude:

  ||0|| = 0

It does not have a specific direction because its length is zero.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. UNIT VECTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A unit vector is a vector whose magnitude is exactly 1.

Therefore:

  ||u|| = 1

To convert a nonzero vector into a unit vector, divide it by its magnitude:

  u = v / ||v||

────────────────────────────────────────────────────────────────────────────────

Example: Unit Vector

Consider:

  v = [3]
      [4]

We already know that ||v|| = 5.

Therefore, the unit vector in the same direction is:

  u = (1/5)[3] = [3/5]
           [4]   [4/5]

Its magnitude is 1.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. STANDARD BASIS VECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The standard basis vectors in ℝ² are:

  i = [1]    j = [0]
      [0]        [1]

Any two-dimensional vector can be written using them.

Example:

  v = [3] = 3[1] + 4[0] = 3i + 4j
      [4]    [0]    [1]

In ℝ³, the standard basis vectors are:

  i = [1]    j = [0]    k = [0]
      [0]        [1]        [0]
      [0]        [0]        [1]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. DOT PRODUCT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The dot product, also called the inner product, multiplies two vectors and produces a scalar.

For:

  u = [u₁]    v = [v₁]
      [u₂]        [v₂]

the dot product is:

  u · v = u₁v₁ + u₂v₂

For three-dimensional vectors:

  u · v = u₁v₁ + u₂v₂ + u₃v₃

────────────────────────────────────────────────────────────────────────────────

Example: Dot Product

Let:

  u = [2]    v = [4]
      [3]        [5]

Then:

  u · v = (2)(4) + (3)(5) = 8 + 15 = 23

Therefore:

  u · v = 23

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. DOT PRODUCT AND ANGLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The dot product can be used to find the angle between two vectors.

The formula is:

  u · v = ||u|| ||v|| cos(θ)

Therefore:

  cos(θ) = (u · v) / (||u|| ||v||)

So:

  θ = cos⁻¹((u · v) / (||u|| ||v||))

This allows us to determine how closely two vectors point in the same direction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. ORTHOGONAL VECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Two vectors are orthogonal if they are perpendicular.

Two vectors are orthogonal when their dot product is zero:

  u · v = 0

Example:

  u = [1]    v = [0]
      [0]        [1]

Their dot product is:

  (1)(0) + (0)(1) = 0

Therefore:

  u ⟂ v

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. CROSS PRODUCT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The cross product is mainly used with three-dimensional vectors.

For:

  u = [u₁]    v = [v₁]
      [u₂]        [v₂]
      [u₃]        [v₃]

their cross product is:

  u × v = [u₂v₃ - u₃v₂]
          [u₃v₁ - u₁v₃]
          [u₁v₂ - u₂v₁]

and produces another vector that is perpendicular to both u and v.

────────────────────────────────────────────────────────────────────────────────

Example: Cross Product

Let:

  u = [1]    v = [0]
      [0]        [1]
      [0]        [0]

Then:

  u × v = [0·0 - 0·1] = [0]
          [0·0 - 1·0]   [0]
          [1·1 - 0·0]   [1]

Therefore:

  u × v = k

The resulting vector is perpendicular to both original vectors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

17. PROJECTION OF A VECTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A vector can be projected onto another vector.

The projection of u onto v is:

  proj_v(u) = (u · v / v · v) · v

This tells us how much of u points in the direction of v.

Projection is important in:
  • Geometry
  • Physics
  • Computer Graphics
  • Machine Learning
  • Least Squares

────────────────────────────────────────────────────────────────────────────────

Example of Projection

Let:

  u = [3]    v = [1]
      [4]        [0]

First calculate:

  u · v = (3)(1) + (4)(0) = 3

Then:

  v · v = 1² + 0² = 1

Therefore:

  proj_v(u) = (3/1)[1] = [3]
                   [0]   [0]

Thus:

  proj_v(u) = [3]
              [0]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

18. LINEAR COMBINATION OF VECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A linear combination is an expression formed by multiplying vectors by scalars and adding the results.

Example:

  2u + 3v

Suppose:

  u = [1]    v = [3]
      [2]        [1]

Then:

  2u = [2]    3v = [9]
       [4]         [3]

Therefore:

  2u + 3v = [2 + 9] = [11]
            [4 + 3]   [7]

So:

  2u + 3v = [11]
            [7]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

19. SPAN OF VECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The span of a set of vectors is the collection of all possible linear combinations of those vectors.

Example:

  u = [1]    v = [0]
      [0]        [1]

Any vector [x, y]ᵀ can be written as:

  x u + y v

Therefore:

  span{u, v} = ℝ²

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

20. LINEAR INDEPENDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vectors are linearly independent if none of them can be written as a linear combination of the others.

Example:

  [1]    and    [0]
  [0]           [1]

are linearly independent.

However:

  [1]    and    [2]
  [2]           [4]

are linearly dependent because:

  [2] = 2[1]
  [4]   [2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

21. VECTORS AND LINEAR ALGEBRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vectors are the foundation of many important Linear Algebra concepts.

  • Matrices can operate on vectors: A x
  • Linear transformations map vectors to other vectors: T(x)
  • Systems of equations can be written as: A x = b
  • The columns of a matrix are vectors
  • The rows of a matrix can also be viewed as vectors

Therefore, understanding vectors is essential for understanding almost every major topic in Linear Algebra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

22. VECTORS AND MATRICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix can be viewed as a collection of column vectors.

Example:

  A = [1  3]
      [2  4]

Its columns are:

  v₁ = [1]    v₂ = [3]
       [2]         [4]

Therefore:

  A = [|   |]
      [v₁  v₂]
      [|   |]

This gives a direct connection between matrices and vectors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

23. VECTORS AND LINEAR TRANSFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix can transform a vector.

Example:

  A = [2  0]    x = [1]
      [0  3]        [2]

Then:

  A x = [2  0] [1] = [2]
        [0  3] [2]   [6]

The transformation stretches the vector differently along the two coordinate directions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

24. VECTORS IN PHYSICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vectors are extremely important in Physics.

Example: Force is a vector.

Suppose a force is:

  F = [10] N
      [5]

This means the force has components:
  • 10 N in one direction
  • 5 N in another direction

Other physical quantities represented by vectors include:
  • Velocity
  • Acceleration
  • Displacement
  • Momentum
  • Electric fields
  • Magnetic fields

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

25. VECTORS IN COMPUTER GRAPHICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vectors are heavily used in Computer Graphics.

They can represent:
  • Position
  • Direction
  • Movement
  • Surface normals
  • Camera orientation
  • Lighting
  • Object transformations

Example: A character's movement might be represented by:

  [5]
  [0]
  [2]

This could represent movement in the x, y, and z directions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

26. VECTORS IN MACHINE LEARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In Machine Learning, data is frequently represented using vectors.

Example: A student is represented by:

  [85]
  [90]
  [78]

These values could represent scores in three different subjects.

A larger dataset can then be represented as a matrix whose rows or columns contain vectors.

Machine Learning algorithms use vector operations for:
  • Feature representation
  • Similarity calculations
  • Classification
  • Regression
  • Neural networks
  • Optimization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

27. VECTORS AND NEURAL NETWORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Neural networks perform many operations involving vectors and matrices.

Example:

  z = W x + b

Here:
  • x is an input vector
  • W is a weight matrix
  • b is a bias vector
  • z is the resulting vector

This equation is fundamental to how many neural network layers operate.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

28. VECTORS AND DISTANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The distance between two points can be calculated using vectors.

Suppose:

  P = (1, 2)    and    Q = (4, 6)

The displacement vector from P to Q is:

  Q - P = [4 - 1] = [3]
          [6 - 2]   [4]

The distance is the magnitude:

  ||Q - P|| = √(3² + 4²) = √25 = 5

Thus:

  Distance = 5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

29. IMPORTANT VECTOR CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When studying Vectors, make sure you understand:

  • Magnitude
  • Direction
  • Vector Components
  • Vector Addition
  • Vector Subtraction
  • Scalar Multiplication
  • Unit Vectors
  • Zero Vector
  • Dot Product
  • Cross Product
  • Orthogonality
  • Projection
  • Linear Combination
  • Span
  • Linear Independence
  • Basis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, a vector is a mathematical object that represents a quantity with both magnitude and direction.

A vector in ℝⁿ can be represented as:

  v = [v₁]
      [v₂]
      [⋮]
      [vₙ]

Its magnitude is determined by:

  ||v|| = √(v₁² + v₂² + ... + vₙ²)

Vectors can be:
  • Added
  • Subtracted
  • Multiplied by scalars
  • Normalized
  • Projected
  • Combined linearly

The dot product is:

  u · v = Σᵢ uᵢvᵢ

and can be used to determine angles and orthogonality.

Key Formulas:

  • Magnitude:       ||v|| = √(v · v)
  • Unit vector:     u = v / ||v||
  • Dot product:     u · v = Σ uᵢvᵢ
  • Orthogonal:      u · v = 0
  • Cross product:   u × v (3D only)
  • Projection:      proj_v(u) = (u · v / v · v) · v
  • Linear combo:    c₁v₁ + c₂v₂ + ... + cₖvₖ

Vectors form the foundation of Linear Algebra and are essential for understanding matrices, linear transformations, systems of equations, vector spaces, eigenvectors, projections, optimization, Machine Learning, Computer Graphics, and Physics.

The key idea to remember:

  A vector represents magnitude and direction, and in Linear Algebra it serves as one of the fundamental building blocks for representing data, solving equations, describing transformations, and understanding multidimensional spaces.
  `,
  examples: [
    "Vector: v = [3,4]ᵀ with magnitude 5",
    "Scalar vs Vector: 50 kg (scalar) vs 50 km/h east (vector)",
    "Vector addition: [2,3]ᵀ + [4,1]ᵀ = [6,4]ᵀ",
    "Vector subtraction: [5,7]ᵀ - [2,3]ᵀ = [3,4]ᵀ",
    "Scalar multiplication: 4[2,3]ᵀ = [8,12]ᵀ",
    "Zero vector: 0 = [0,0]ᵀ",
    "Unit vector: u = v/||v|| = [3/5,4/5]ᵀ",
    "Standard basis: i = [1,0]ᵀ, j = [0,1]ᵀ",
    "Dot product: [2,3]ᵀ · [4,5]ᵀ = 23",
    "Orthogonal: [1,0]ᵀ · [0,1]ᵀ = 0",
    "Cross product: [1,0,0]ᵀ × [0,1,0]ᵀ = [0,0,1]ᵀ",
    "Projection: proj_v(u) = (u·v/v·v)v",
    "Linear combination: 2u + 3v",
    "Span: span{[1,0]ᵀ, [0,1]ᵀ} = ℝ²",
    "Linear independence: [1,0]ᵀ and [0,1]ᵀ are independent",
    "Distance: between (1,2) and (4,6) = 5",
    "Compute v+w for v=[1,2], w=[-3,4]",
    "Find the projection of u onto v.",
  ],
};

export default topic;