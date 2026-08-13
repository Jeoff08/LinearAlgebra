const topic = {
  id: "linear-transformations",
  title: "Linear Transformations",
  summary:
    "Definition, properties, kernels, ranges, and matrix representations of linear maps.",
  details: `
A Linear Transformation is a function between vector spaces that preserves the two fundamental operations of Linear Algebra: vector addition and scalar multiplication. In simple terms, a linear transformation takes a vector as an input and produces another vector as an output while maintaining the basic structure of the vector space.

A linear transformation is commonly written as:

  T: V → W

where V is the domain and W is the codomain.

The transformation takes a vector v from V and maps it to another vector T(v) in W.

The two conditions that must be satisfied are:

  1. T(u + v) = T(u) + T(v)  (preserves addition)
  2. T(c v) = c T(v)         (preserves scalar multiplication)

for all vectors u, v and scalars c.

These properties mean that a linear transformation preserves the structure of vector operations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SIMPLE EXAMPLE OF A LINEAR TRANSFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider the transformation:

  T(x, y) = (2x, 2y)

This transformation simply doubles every component of a vector.

Example:

  v = [2]
      [3]

Applying T:

  T(v) = [4]
         [6]

Therefore:

  T([2]) = [4]
    [3]    [6]

This is a linear transformation because it preserves vector addition and scalar multiplication.

────────────────────────────────────────────────────────────────────────────────

Checking the Addition Property

Suppose:

  u = [1]    v = [3]
      [2]        [4]

First:

  u + v = [4]
          [6]

Applying T:

  T(u + v) = [8]
             [12]

Now calculate them separately:

  T(u) = [2]    T(v) = [6]
         [4]          [8]

Therefore:

  T(u) + T(v) = [8]
                [12]

Thus:

  T(u + v) = T(u) + T(v)

The addition property is satisfied.

────────────────────────────────────────────────────────────────────────────────

Checking the Scalar Multiplication Property

Let:

  c = 3    and    v = [2]
                      [1]

First:

  c v = [6]
        [3]

Applying the transformation:

  T(c v) = [12]
           [6]

Now calculate:

  T(v) = [4]
         [2]

Then:

  c T(v) = [12]
           [6]

Therefore:

  T(c v) = c T(v)

The scalar multiplication property is also satisfied.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. MATRIX REPRESENTATION OF A LINEAR TRANSFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most important facts about Linear Transformations is that many transformations can be represented using matrices.

If T: ℝⁿ → ℝᵐ, then there is an m×n matrix A such that:

  T(x) = A x

This allows us to study transformations using matrix operations.

Example:

  T(x, y) = (2x + y, 3x + 4y)

This can be written as:

  [2x + y]  =  [2  1] [x]
  [3x + 4y]    [3  4] [y]

Therefore, the matrix representing T is:

  A = [2  1]
      [3  4]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. GEOMETRIC INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Linear transformations can change the size, direction, and orientation of vectors and geometric objects.

Common linear transformations include:

  • Scaling
  • Rotation
  • Reflection
  • Shearing
  • Projection

────────────────────────────────────────────────────────────────────────────────

Scaling Transformation

A scaling transformation changes the size of a vector or geometric object.

A general two-dimensional scaling matrix is:

  A = [a  0]
      [0  b]

Example:

  A = [2  0]
      [0  3]

Then:

  T(x, y) = (2x, 3y)

The x-direction is scaled by 2, and the y-direction is scaled by 3.

────────────────────────────────────────────────────────────────────────────────

Rotation Transformation

A rotation transformation changes the direction of vectors while preserving their lengths.

The standard two-dimensional rotation matrix for an angle θ is:

  A = [cos(θ)  -sin(θ)]
      [sin(θ)   cos(θ)]

Example - 90° Counterclockwise Rotation:

  A = [0  -1]
      [1   0]

Consider:

  v = [1]
      [0]

Then:

  A v = [0]
        [1]

Therefore, the vector originally pointing to the right is rotated upward.

────────────────────────────────────────────────────────────────────────────────

Reflection Transformation

A reflection transformation flips a vector or geometric object across a line.

Example - Reflection across the x-axis:

  A = [1   0]
      [0  -1]

For:

  v = [2]
      [3]

We obtain:

  A v = [ 2]
        [-3]

The x-coordinate remains the same while the y-coordinate changes sign.

────────────────────────────────────────────────────────────────────────────────

Shearing Transformation

A shearing transformation shifts one coordinate depending on another coordinate.

Example - Horizontal Shear:

  A = [1  k]
      [0  1]

For k = 2 and:

  v = [1]
      [2]

We obtain:

  A v = [5]
        [2]

The vertical coordinate remains unchanged while the horizontal coordinate shifts.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. ZERO VECTOR PROPERTY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every linear transformation must map the zero vector to the zero vector.

That means:

  T(0) = 0

Why?

Because:

  T(0) = T(0 · v) = 0 · T(v) = 0

This is an important way to quickly determine whether a function could be a linear transformation.

Example:

  T(x) = 2x + 3

is not a linear transformation because:

  T(0) = 3 ≠ 0

Therefore:

  T(x) = 2x + 3 is not linear.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. KERNEL OR NULL SPACE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The kernel of a linear transformation is the set of all vectors that are mapped to the zero vector.

It is written as:

  ker(T) = {v ∈ V | T(v) = 0}

Example:

  T(x, y) = x + y

To find the kernel, set:

  T(x, y) = 0

Therefore:

  x + y = 0

So:

  y = -x

The kernel consists of vectors of the form:

  [ x]
  [-x]

Thus:

  ker(T) = span{ [1] }
                 [-1]

The kernel tells us which input vectors are completely collapsed to zero by the transformation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. RANGE OR IMAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The range or image of a linear transformation is the set of all possible output vectors.

It is written as:

  Range(T) = {T(v) | v ∈ V}

For a matrix transformation:

  T(x) = A x

the range is the column space of A.

Therefore:

  Range(T) = Col(A)

The range tells us which output vectors can actually be produced by the transformation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. ONE-TO-ONE LINEAR TRANSFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A linear transformation is one-to-one if different input vectors always produce different output vectors.

Mathematically:

  T(u) = T(v)  implies  u = v

For a linear transformation, this is equivalent to having a trivial kernel:

  ker(T) = {0}

Therefore, if the only vector mapped to zero is the zero vector itself, the transformation is one-to-one.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. ONTO LINEAR TRANSFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A linear transformation is onto if every vector in the codomain can be produced by the transformation.

In other words:

  Range(T) = W

where W is the codomain.

For a matrix:

  A: ℝⁿ → ℝᵐ

the transformation is onto if the columns of A span ℝᵐ.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. INVERTIBLE LINEAR TRANSFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A linear transformation is invertible if there exists another transformation T⁻¹ that reverses it.

This means:

  T⁻¹(T(v)) = v

For matrix transformations:

  T(x) = A x

the transformation is invertible when A has an inverse:

  A⁻¹ A = A A⁻¹ = I

For a square matrix, this occurs when:

  det(A) ≠ 0

Thus, matrix inverses and linear transformations are closely connected.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. COMPOSITION OF LINEAR TRANSFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Two or more linear transformations can be combined through composition.

Suppose:

  T(x) = A x    and    S(x) = B x

The composition S ∘ T means we apply T first and then S.

Therefore:

  (S ∘ T)(x) = S(T(x)) = S(A x) = B(A x)

So:

  (S ∘ T)(x) = (B A) x

This demonstrates why the order of matrix multiplication matters.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. LINEAR TRANSFORMATIONS AND BASIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A linear transformation is completely determined by what it does to the vectors in a basis.

Example - Standard basis for ℝ²:

  e₁ = [1]    e₂ = [0]
       [0]         [1]

Suppose:

  T(e₁) = [2]    T(e₂) = [1]
          [3]           [4]

Then the matrix representing T is constructed by placing these transformed basis vectors as columns:

  A = [2  1]
      [3  4]

Therefore:

  T(x) = A x

This is a very important principle:

  To understand a linear transformation, it is enough to know how it transforms the basis vectors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. RANK-NULLITY THEOREM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Linear transformations are also connected to the Rank-Nullity Theorem.

For a linear transformation:

  T: V → W

the theorem states:

  dim(ker T) + dim(Range T) = dim(V)

For a matrix A, this becomes:

  nullity(A) + rank(A) = n

where n is the number of columns of A.

This theorem tells us how the dimensions of the kernel and range are related.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. APPLICATIONS OF LINEAR TRANSFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Linear Transformations are used throughout mathematics, science, and technology.

  1. Computer Graphics
     • Rotation, scaling, reflection, projection, and movement of objects

  2. Game Development
     • Transforming position and orientation of characters, cameras, and objects

  3. Robotics
     • Describing position and orientation of robotic arms and components

  4. Computer Vision
     • Manipulating images
     • Converting between coordinate systems

  5. Engineering
     • Modeling physical systems
     • Coordinate changes

  6. Machine Learning
     • Representing changes in feature spaces
     • Manipulating vectors and matrices

  7. Data Science
     • Changing data representations
     • Dimensionality reduction

  8. Physics
     • Describing changes in coordinate systems
     • Physical states

  9. Economics
     • Modeling relationships between variables
     • Input-output analysis

  10. Control Systems
     • System analysis
     • State-space representations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, a Linear Transformation is a function between vector spaces that preserves vector addition and scalar multiplication.

The two defining properties are:

  T(u + v) = T(u) + T(v)
  T(c v) = c T(v)

A linear transformation can often be represented using a matrix:

  T(x) = A x

Important concepts associated with linear transformations:

  • Kernel — vectors mapped to zero
  • Range/Image — all possible outputs
  • Rank — dimension of the range
  • Nullity — dimension of the kernel
  • One-to-one — different inputs produce different outputs
  • Onto — every vector in the codomain can be reached
  • Invertible — the transformation can be reversed
  • Composition — multiple transformations can be combined

Key Matrices for Transformations:

  • Scaling:    A = [a  0]
                    [0  b]

  • Rotation:   A = [cos(θ)  -sin(θ)]
                    [sin(θ)   cos(θ)]

  • Reflection: A = [1   0]
                    [0  -1]

  • Shear:      A = [1  k]
                    [0  1]

The key idea to remember:

  A Linear Transformation is a rule that transforms vectors while preserving the fundamental structure of addition and scalar multiplication. Matrices provide a powerful way to represent and study these transformations.

Understanding Linear Transformations provides a foundation for studying matrix representations, kernel and range, rank-nullity, change of basis, eigenvalues and eigenvectors, diagonalization, projections, and many real-world applications of Linear Algebra.
  `,
  examples: [
    "Linear transformation: T(x,y) = (2x,2y) doubles both components",
    "Matrix representation: T(x) = Ax",
    "Scaling: A = [[2,0],[0,3]] scales x by 2 and y by 3",
    "Rotation: A = [[cos(θ),-sin(θ)],[sin(θ),cos(θ)]]",
    "Reflection: A = [[1,0],[0,-1]] reflects across x-axis",
    "Shear: A = [[1,k],[0,1]] horizontal shear",
    "Kernel: ker(T) = {v | T(v) = 0}",
    "Range: Range(T) = Col(A)",
    "One-to-one iff ker(T) = {0}",
    "Onto iff Range(T) = W",
    "Invertible iff det(A) ≠ 0",
    "Composition: (S∘T)(x) = B A x",
    "Rank-Nullity: dim(ker T) + dim(Range T) = dim(V)",
    "Represent a rotation in R^2 with a matrix",
    "Find the kernel of a projection transformation.",
  ],
};

export default topic;