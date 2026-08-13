const topic = {
  id: "inner-product",
  title: "Inner Product Spaces",
  summary:
    "Inner products, norms, Cauchy–Schwarz, triangle inequality and orthogonality in abstract spaces.",
  details: `
Inner Product Spaces are vector spaces equipped with a special operation called an inner product. The inner product allows us to measure relationships between vectors, such as their length, angle, and orthogonality. In ordinary Euclidean space, the familiar dot product is an example of an inner product.

Inner Product Spaces are important because they extend the familiar ideas of geometry into more general vector spaces. They allow us to talk about concepts such as distance, angles, perpendicularity, projections, orthogonality, and orthonormal bases even when we are working with abstract vectors.

The inner product is commonly written as ⟨u,v⟩ and produces a scalar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. THE STANDARD DOT PRODUCT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The simplest example of an inner product is the dot product in ℝⁿ.

For two vectors:

  u = [u₁]    v = [v₁]
      [u₂]        [v₂]
      [⋮ ]        [⋮ ]
      [uₙ]        [vₙ]

their inner product is:

  ⟨u,v⟩ = u₁v₁ + u₂v₂ + ... + uₙvₙ

Example:

  u = [2]    v = [4]
      [3]        [1]

Their inner product is:

  ⟨u,v⟩ = (2)(4) + (3)(1) = 8 + 3 = 11

Therefore:

  ⟨u,v⟩ = 11

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. PROPERTIES OF AN INNER PRODUCT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An inner product must satisfy several important properties. For real vector spaces, these include linearity, symmetry, and positive definiteness.

────────────────────────────────────────────────────────────────────────────────

Linearity

The inner product behaves linearly with respect to vector addition and scalar multiplication.

  ⟨u + v, w⟩ = ⟨u,w⟩ + ⟨v,w⟩

  ⟨cu, v⟩ = c⟨u,v⟩

This means that we can distribute the inner product over vector operations.

────────────────────────────────────────────────────────────────────────────────

Symmetry

For real vector spaces:

  ⟨u,v⟩ = ⟨v,u⟩

Example:

  ⟨u,v⟩ = (1)(3) + (2)(4) = 3 + 8 = 11

Reversing the vectors gives the same result:

  ⟨v,u⟩ = (3)(1) + (4)(2) = 3 + 8 = 11

────────────────────────────────────────────────────────────────────────────────

Positive Definiteness

For every vector v:

  ⟨v,v⟩ ≥ 0

and:

  ⟨v,v⟩ = 0  only when  v = 0

This property allows us to use the inner product to define the length of a vector.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. NORM OR LENGTH OF A VECTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The norm of a vector represents its length.

The norm is defined using the inner product:

  ||v|| = √⟨v,v⟩

Example:

  v = [3]
      [4]

We calculate:

  ⟨v,v⟩ = 3² + 4² = 9 + 16 = 25

Therefore:

  ||v|| = √25 = 5

Thus:

  ||v|| = 5

This is the familiar Pythagorean theorem expressed using Linear Algebra.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. DISTANCE BETWEEN VECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The inner product can also be used to calculate the distance between two vectors.

The distance between u and v is:

  d(u,v) = ||u - v||

Example:

  u = [5]    v = [2]
      [4]        [1]

First calculate:

  u - v = [3]
          [3]

Then:

  ||u - v|| = √(3² + 3²) = √18 = 3√2

Therefore:

  d(u,v) = 3√2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. ORTHOGONALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most important applications of inner products is determining whether two vectors are orthogonal, meaning perpendicular.

Two vectors are orthogonal if their inner product is zero:

  u ⟂ v  ⟺  ⟨u,v⟩ = 0

Example:

  u = [1]    v = [ 2]
      [2]        [-1]

Calculate their inner product:

  ⟨u,v⟩ = (1)(2) + (2)(-1) = 2 - 2 = 0

Therefore:

  u ⟂ v

This means that the vectors are perpendicular.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. ANGLE BETWEEN VECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The inner product can also be used to find the angle between two nonzero vectors.

The formula is:

  cos(θ) = ⟨u,v⟩ / (||u|| ||v||)

Therefore:

  θ = cos⁻¹( ⟨u,v⟩ / (||u|| ||v||) )

Example:

  u = [1]    v = [1]
      [0]        [1]

Their inner product is:

  ⟨u,v⟩ = 1(1) + 0(1) = 1

Their norms are:

  ||u|| = 1    and    ||v|| = √2

Therefore:

  cos(θ) = 1 / (1 · √2) = 1/√2

Thus:

  θ = 45°

So the angle between the vectors is 45°.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. ORTHOGONAL SETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A set of vectors is called an orthogonal set if every pair of different vectors is orthogonal.

Example:

  v₁ = [1]    v₂ = [0]
       [0]         [1]

Their inner product is:

  ⟨v₁,v₂⟩ = 0

Therefore, they form an orthogonal set.

Orthogonal sets are very useful because their vectors are automatically linearly independent as long as none of the vectors is the zero vector.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. ORTHONORMAL SETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An orthonormal set is a set of vectors that is both:

  • Orthogonal (every pair is perpendicular)
  • Normalized (every vector has length 1)

Example:

  e₁ = [1]    e₂ = [0]
       [0]         [1]

They are orthogonal because:

  ⟨e₁,e₂⟩ = 0

They also have length 1:

  ||e₁|| = 1    and    ||e₂|| = 1

Therefore, they form an orthonormal basis for ℝ².

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. PROJECTION OF ONE VECTOR ONTO ANOTHER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inner products are also used to find the projection of one vector onto another.

The projection of u onto v is:

  proj_v(u) = (⟨u,v⟩ / ⟨v,v⟩) · v

Example:

  u = [3]    v = [1]
      [2]        [0]

First:

  ⟨u,v⟩ = 3(1) + 2(0) = 3

Also:

  ⟨v,v⟩ = 1² + 0² = 1

Therefore:

  proj_v(u) = (3/1) · [1] = [3]
                       [0]   [0]

Thus:

  proj_v(u) = [3]
              [0]

The projection represents the component of u that lies in the direction of v.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. INNER PRODUCT SPACES AND COMPLEX VECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inner products are not limited to real vector spaces. They can also be defined on complex vector spaces.

For complex vectors, the inner product uses the complex conjugate.

For vectors u, v ∈ ℂⁿ, the standard complex inner product is:

  ⟨u,v⟩ = ūᵀ v

where ū is the complex conjugate of u.

Example:

  u = [1 + i]
      [2    ]

Its conjugate is:

  ū = [1 - i]
      [2    ]

The inner product of u with itself is:

  ⟨u,u⟩ = (1-i)(1+i) + (2)(2)

Since:

  (1-i)(1+i) = 2

We get:

  ⟨u,u⟩ = 2 + 4 = 6

Therefore:

  ||u|| = √6

This is one reason Inner Product Spaces are important when working with complex vector spaces and quantum mechanics.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. CAUCHY-SCHWARZ INEQUALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An important theorem involving inner products is the Cauchy-Schwarz Inequality:

  |⟨u,v⟩| ≤ ||u|| · ||v||

This inequality states that the absolute value of the inner product cannot be larger than the product of the lengths of the two vectors.

Example:

  If ||u|| = 3 and ||v|| = 4, then:

  |⟨u,v⟩| ≤ 12

This theorem is important in many areas of mathematics and is also used in proving other important results.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. TRIANGLE INEQUALITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Triangle Inequality is another important result derived from inner products:

  ||u + v|| ≤ ||u|| + ||v||

This inequality states that the length of the sum of two vectors is less than or equal to the sum of their lengths.

Example:

  If ||u|| = 3 and ||v|| = 4, then:

  ||u + v|| ≤ 7

This makes intuitive sense: going from one point to another directly is never longer than taking a detour.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. ORTHOGONAL DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An inner product allows a vector to be separated into components that are parallel and perpendicular to another vector or subspace.

  u = proj_v(u) + u⊥

Here, proj_v(u) is the component parallel to v, while u⊥ is perpendicular to v.

This idea is extremely useful in least-squares approximation, where we find the closest possible vector to a target vector within a particular subspace.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. GRAM-SCHMIDT PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inner Product Spaces also provide the foundation for the Gram-Schmidt Process.

The Gram-Schmidt Process takes a set of linearly independent vectors and converts them into an orthogonal or orthonormal set.

Example: Suppose we have two linearly independent vectors v₁ and v₂.

  u₁ = v₁

Then remove the component of v₂ in the direction of u₁:

  u₂ = v₂ - proj_u₁(v₂)

The resulting vectors u₁ and u₂ are orthogonal.

If we then normalize them, we obtain an orthonormal basis.

This is important in QR decomposition, numerical linear algebra, least-squares problems, computer graphics, and scientific computing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. APPLICATIONS OF INNER PRODUCT SPACES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inner Product Spaces have many practical applications.

  1. Geometry
     • Calculating angles, lengths, distances, and perpendicularity

  2. Computer Graphics
     • Lighting, surface angles, projections, and geometric relationships

  3. Machine Learning
     • Measuring similarity between vectors
     • Fundamental to many algorithms

  4. Data Science
     • Vector representations, projections, dimensionality reduction, and optimization

  5. Signal Processing
     • Measuring similarity between signals

  6. Quantum Mechanics & Quantum Computing
     • Complex inner product spaces
     • Representing quantum states
     • Calculating probabilities and relationships between states

  7. Engineering
     • Signal analysis, optimization, and mathematical modeling

  8. Statistics
     • Covariance and correlation analysis
     • Regression and prediction

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, an Inner Product Space is a vector space equipped with an inner product that allows us to measure relationships between vectors.

The inner product provides the foundation for:

  • Length:      ||v|| = √⟨v,v⟩
  • Distance:    d(u,v) = ||u - v||
  • Angle:       cos(θ) = ⟨u,v⟩ / (||u|| ||v||)
  • Orthogonality: ⟨u,v⟩ = 0
  • Projection:  proj_v(u) = (⟨u,v⟩ / ⟨v,v⟩) · v
  • Orthonormal Bases

For real vectors, the standard inner product is the dot product:

  ⟨u,v⟩ = uᵀ v

and the norm is:

  ||v|| = √⟨v,v⟩

Two vectors are orthogonal when:

  ⟨u,v⟩ = 0

Key Inequalities:

  • Cauchy-Schwarz: |⟨u,v⟩| ≤ ||u|| · ||v||
  • Triangle: ||u + v|| ≤ ||u|| + ||v||

The key idea to remember:

  An Inner Product Space extends the geometry of ordinary vectors to more general vector spaces, allowing us to measure length, angle, distance, and perpendicularity using algebra.

Understanding Inner Product Spaces provides the foundation for more advanced topics such as orthogonal projections, orthonormal bases, Gram-Schmidt, least-squares approximation, QR decomposition, Fourier analysis, and complex vector spaces.
  `,
  examples: [
    "Dot product: ⟨[2,3]ᵀ,[4,1]ᵀ⟩ = 11",
    "Norm: ||[3,4]ᵀ|| = 5",
    "Distance: d([5,4]ᵀ,[2,1]ᵀ) = 3√2",
    "Orthogonality: ⟨[1,2]ᵀ,[2,-1]ᵀ⟩ = 0 → perpendicular",
    "Angle: θ between [1,0]ᵀ and [1,1]ᵀ is 45°",
    "Cauchy-Schwarz: |⟨u,v⟩| ≤ ||u|| ||v||",
    "Triangle: ||u + v|| ≤ ||u|| + ||v||",
    "Projection: proj_v(u) = (⟨u,v⟩/⟨v,v⟩) · v",
    "Complex inner product: ⟨u,v⟩ = ūᵀ v",
    "Gram-Schmidt: Convert vectors to orthonormal basis",
    "Verify Cauchy–Schwarz for vectors",
    "Compute the norm induced by an inner product.",
  ],
};

export default topic;