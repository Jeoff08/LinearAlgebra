const topic = {
  id: "orthogonality",
  title: "Orthogonality",
  summary:
    "Orthogonal and orthonormal sets, complements, orthogonal matrices, and Gram–Schmidt process.",
  details: `
Orthogonality is an important concept in Linear Algebra that describes when two vectors are perpendicular or at right angles to each other.

In ordinary geometry, two lines are perpendicular when they meet at a 90° angle. In Linear Algebra, we extend this idea to vectors and vector spaces using the inner product, commonly called the dot product.

Two vectors are orthogonal when their inner product is equal to zero:

  u · v = 0

Therefore, the main idea of orthogonality is:

  Two vectors are orthogonal when they are perpendicular to each other, which means their inner product is zero.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. EXAMPLE OF ORTHOGONAL VECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider the vectors:

  u = [1]    v = [0]
      [0]        [1]

Their dot product is:

  u · v = (1)(0) + (0)(1) = 0

Therefore:

  u · v = 0

Since their dot product is zero:

  u ⟂ v

Thus, the vectors are orthogonal.

Geometrically, one vector points horizontally and the other vertically, forming a 90° angle.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. DOT PRODUCT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The dot product is the main tool used to determine whether two vectors are orthogonal.

For two vectors:

  u = [u₁]    v = [v₁]
      [u₂]        [v₂]
      [⋮ ]        [⋮ ]
      [uₙ]        [vₙ]

their dot product is:

  u · v = u₁v₁ + u₂v₂ + ... + uₙvₙ

If u · v = 0, then:

  u ⟂ v

────────────────────────────────────────────────────────────────────────────────

Example Using the Dot Product

Consider:

  u = [2]    v = [ 3]
      [3]        [-2]

Calculate the dot product:

  u · v = (2)(3) + (3)(-2) = 6 - 6 = 0

Therefore:

  u · v = 0

Thus:

  u ⟂ v

The two vectors are orthogonal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. ORTHOGONALITY AND ANGLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The dot product is also related to the angle between two vectors.

The formula is:

  u · v = ||u|| ||v|| cos(θ)

where:
  • ||u|| is the length of u
  • ||v|| is the length of v
  • θ is the angle between the vectors

If the vectors are orthogonal:

  θ = 90°

Since cos(90°) = 0, we obtain:

  u · v = 0

This explains mathematically why the dot product of orthogonal vectors is zero.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. ORTHOGONAL SET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A collection of vectors is called an orthogonal set if every pair of distinct vectors in the set is orthogonal.

Example:

  v₁ = [1]    v₂ = [0]    v₃ = [0]
       [0]         [1]         [0]
       [0]         [0]         [1]

We have:

  v₁ · v₂ = 0
  v₁ · v₃ = 0
  v₂ · v₃ = 0

Therefore:

  {v₁, v₂, v₃} is an orthogonal set.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. ORTHOGONAL BASIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A basis is called an orthogonal basis if all of its basis vectors are mutually orthogonal.

Example:

  e₁ = [1]    e₂ = [0]
       [0]         [1]

form an orthogonal basis for ℝ².

This basis is particularly useful because vectors can be represented using simple projections onto the basis vectors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. ORTHONORMAL VECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Two vectors are orthonormal if they are:
  1. Orthogonal to each other
  2. Each has length 1

For a vector u:

  ||u|| = 1

Therefore, an orthonormal set satisfies:

  uᵢ · uⱼ = 0    when i ≠ j
  ||uᵢ|| = 1

The standard basis vectors:

  [1]    [0]    [0]
  [0],   [1],   [0]
  [0]    [0]    [1]

are an example of an orthonormal basis.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. ORTHOGONAL PROJECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Orthogonality is also used to find the projection of one vector onto another.

The projection of u onto v is:

  proj_v(u) = (u · v / v · v) · v

This gives the component of u that points in the direction of v.

────────────────────────────────────────────────────────────────────────────────

Example of Orthogonal Projection

Consider:

  u = [3]    v = [1]
      [4]        [0]

First calculate the dot product:

  u · v = (3)(1) + (4)(0) = 3

Next:

  v · v = (1)(1) + (0)(0) = 1

Therefore:

  proj_v(u) = (3/1) · [1] = [3]
                      [0]   [0]

Thus:

  proj_v(u) = [3]
              [0]

The remaining component:

  [0]
  [4]

is perpendicular to v.

Therefore:

  u = projection component + orthogonal component

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. ORTHOGONAL DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A vector can often be separated into two perpendicular components.

  u = u_∥ + u_⊥

where:
  • u_∥ is parallel to a given vector or subspace
  • u_⊥ is perpendicular to it

This is called orthogonal decomposition.

It is extremely useful in geometry, Linear Algebra, numerical computation, and least-squares problems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. ORTHOGONAL COMPLEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The orthogonal complement of a subspace W consists of all vectors that are orthogonal to every vector in W.

It is written as:

  W⊥

Example: Suppose:

  W = span{ [1] }
            [0]

The vectors orthogonal to W are vectors of the form:

  [0]
  [y]

Therefore:

  W⊥ = span{ [0] }
              [1]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. ORTHOGONAL MATRICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A square matrix Q is called an orthogonal matrix if:

  Qᵀ Q = I

This also means:

  Q⁻¹ = Qᵀ

Example:

  Q = [0  1]
      [1  0]

Its transpose is:

  Qᵀ = [0  1]
       [1  0]

Multiplying:

  Qᵀ Q = [1  0]
         [0  1]

Therefore:

  Q is orthogonal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. PROPERTIES OF ORTHOGONAL MATRICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Orthogonal matrices have several important properties.

They preserve vector lengths:

  ||Q x|| = ||x||

They also preserve angles:

  (Q x) · (Q y) = x · y

Therefore, multiplying a vector by an orthogonal matrix can rotate or reflect it without changing its length.

This is why orthogonal matrices are extremely important in geometry and numerical Linear Algebra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. ORTHOGONALITY AND QR DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Orthogonality is directly connected to QR Decomposition.

A matrix A can be factored as:

  A = Q R

where Q has orthonormal columns and R is upper triangular.

Example:

  A = [1  1]
      [1  0]

The columns of A can be transformed into orthonormal vectors to construct Q.

The matrix R then contains the coefficients needed to reconstruct A.

QR Decomposition is important for:
  • Least Squares
  • Numerical Linear Algebra
  • Eigenvalue algorithms
  • Orthogonalization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. GRAM-SCHMIDT PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Gram-Schmidt Process is a method for converting a linearly independent set of vectors into an orthogonal or orthonormal set.

Suppose we have v₁, v₂.

First, set:

  u₁ = v₁

Then remove from v₂ its component in the direction of u₁:

  u₂ = v₂ - proj_u₁(v₂)

Now:

  u₁ · u₂ = 0

To make the vectors unit length, normalize them:

  eᵢ = uᵢ / ||uᵢ||

The resulting vectors form an orthonormal set.

────────────────────────────────────────────────────────────────────────────────

Example of Gram-Schmidt

Consider:

  v₁ = [1]    v₂ = [1]
       [1]         [0]

First:

  u₁ = v₁

Calculate the projection:

  proj_u₁(v₂) = (v₂ · u₁ / u₁ · u₁) · u₁

We have:

  v₂ · u₁ = (1)(1) + (0)(1) = 1
  u₁ · u₁ = 1² + 1² = 2

Therefore:

  proj_u₁(v₂) = (1/2) · [1] = [1/2]
                        [1]   [1/2]

Then:

  u₂ = [1] - [1/2] = [1/2]
       [0]   [1/2]   [-1/2]

Thus:

  u₂ = [1/2]
       [-1/2]

Now:

  u₁ · u₂ = 0

so the vectors are orthogonal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. ORTHOGONALITY AND LEAST SQUARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Orthogonality plays an important role in Least Squares.

Suppose a system:

  A x = b

does not have an exact solution.

Instead, we find an approximation:

  A x̂

that is as close as possible to b.

The error vector is:

  e = b - A x̂

At the least-squares solution, the error is orthogonal to the column space of A:

  e ⟂ Col(A)

This gives the fundamental condition:

  Aᵀ(b - A x̂) = 0

Rearranging gives the normal equations:

  Aᵀ A x̂ = Aᵀ b

Therefore, orthogonality provides the mathematical foundation for least-squares approximation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. ORTHOGONALITY IN GEOMETRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Orthogonality is naturally connected to geometry.

Two-dimensional vectors can be perpendicular:

  [1] ⟂ [0]
  [0]    [1]

Three-dimensional vectors can also be perpendicular:

  [1] ⟂ [0]
  [0]    [1]
  [0]    [0]

The concept extends to higher-dimensional vector spaces even though we cannot visualize them directly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. ORTHOGONALITY IN COMPUTER SCIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Orthogonality has many applications in Computer Science.

Computer Graphics
  • Rotation, reflection, coordinate transformations
  • 3D graphics and computer vision
  • Orthogonal transformations help represent and manipulate image and spatial data

Machine Learning
  • Orthogonal vectors and matrices appear in dimensionality reduction
  • Optimization and numerical algorithms

Signal Processing
  • Orthogonal signals can be separated because their inner product is zero

Data Science
  • Orthogonal bases are useful for representing data efficiently

Numerical Linear Algebra
  • Orthogonal transformations preserve numerical accuracy and vector lengths

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

17. ORTHOGONAL SIGNALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Orthogonality is not limited to geometric vectors.

Functions and signals can also be orthogonal.

Two functions f(x) and g(x) can be considered orthogonal over an interval if:

  ∫ₐᵇ f(x)g(x) dx = 0

This is similar to the vector condition:

  u · v = 0

Therefore, the concept of orthogonality extends beyond finite-dimensional vectors.

It is important in:
  • Fourier analysis
  • Signal processing
  • Differential equations
  • Communications

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

18. ORTHONORMAL BASIS AND COORDINATE REPRESENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If {e₁, e₂, ..., eₙ} is an orthonormal basis, then a vector x can be represented as:

  x = (x · e₁)e₁ + (x · e₂)e₂ + ... + (x · eₙ)eₙ

This is extremely useful because the coefficients are obtained simply through dot products.

For an arbitrary basis, finding these coefficients can be more complicated.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

19. WHY ORTHOGONALITY IS USEFUL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Orthogonality makes mathematical calculations easier.

  • If vectors are orthogonal, their contributions can be separated cleanly.
  • An orthonormal basis provides particularly simple coordinates.
  • Orthogonal matrices preserve lengths and angles.
  • Orthogonal projections provide the closest point in a subspace.
  • Orthogonal decomposition separates a vector into independent perpendicular components.

Therefore:

  Orthogonality simplifies geometry, computation, and approximation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

20. IMPORTANT ORTHOGONALITY CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When studying Orthogonality, it is important to understand:

  • Dot Product
  • Orthogonal Vectors
  • Orthogonal Sets
  • Orthogonal Basis
  • Orthonormal Basis
  • Orthogonal Projection
  • Orthogonal Decomposition
  • Orthogonal Complement
  • Orthogonal Matrices
  • Gram-Schmidt Process
  • QR Decomposition
  • Least Squares

These topics form the foundation for more advanced work involving inner product spaces and numerical Linear Algebra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, Orthogonality describes the relationship between vectors, matrices, or other mathematical objects that are perpendicular or independent in a particular inner-product sense.

For vectors, the fundamental condition is:

  u · v = 0

An orthonormal set additionally satisfies:

  ||uᵢ|| = 1

Orthogonality is used to construct:
  • Orthogonal bases
  • Orthonormal bases
  • Orthogonal projections
  • Orthogonal complements
  • Orthogonal matrices

It is also fundamental to:
  • Gram-Schmidt Process
  • QR Decomposition
  • Least Squares
  • Numerical Linear Algebra
  • Computer Graphics
  • Signal Processing
  • Machine Learning
  • Data Analysis

Key Formulas:

  • Dot product:           u · v = u₁v₁ + u₂v₂ + ... + uₙvₙ
  • Orthogonal:            u · v = 0
  • Norm:                  ||u|| = √(u · u)
  • Projection:            proj_v(u) = (u · v / v · v) · v
  • Orthogonal complement: W⊥ = {v | v · w = 0 for all w ∈ W}
  • Orthogonal matrix:     Qᵀ Q = I
  • Gram-Schmidt:          u₁ = v₁, u₂ = v₂ - proj_u₁(v₂)
  • QR Decomposition:      A = Q R

The key idea to remember:

  Orthogonality is the Linear Algebra concept of perpendicularity, where two vectors are orthogonal when their inner product is zero. It provides a powerful way to separate, simplify, and represent mathematical information.
  `,
  examples: [
    "Orthogonal vectors: [1,0]ᵀ · [0,1]ᵀ = 0",
    "Dot product: [2,3]ᵀ · [3,-2]ᵀ = 6 - 6 = 0",
    "Orthogonal set: {[1,0,0]ᵀ, [0,1,0]ᵀ, [0,0,1]ᵀ}",
    "Orthonormal basis: e₁ = [1,0]ᵀ, e₂ = [0,1]ᵀ",
    "Projection: proj_v(u) = (u·v / v·v) · v",
    "Example: proj_[1,0]ᵀ([3,4]ᵀ) = [3,0]ᵀ",
    "Orthogonal complement: W⊥ = {v | v · w = 0 for all w ∈ W}",
    "Orthogonal matrix: Qᵀ Q = I",
    "Gram-Schmidt: u₁ = v₁, u₂ = v₂ - proj_u₁(v₂)",
    "QR Decomposition: A = Q R",
    "Least squares: error e = b - A x̂ is orthogonal to Col(A)",
    "Normal equations: Aᵀ A x̂ = Aᵀ b",
    "Orthogonal signals: ∫ f(x)g(x) dx = 0",
    "Apply Gram–Schmidt to two vectors",
    "Verify whether a set is orthonormal.",
  ],
};

export default topic;