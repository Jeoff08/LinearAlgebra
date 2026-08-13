const topic = {
  id: "independence-span",
  title: "Linear Independence & Span",
  summary: "Linear combinations, span of sets, testing independence and bases.",
  details: `
Linear Independence and Span are two fundamental concepts in Linear Algebra used to understand how vectors relate to one another. They help us determine whether vectors contain unique information, whether one vector can be created from others, and whether a collection of vectors can generate an entire vector space.

These concepts are closely connected to basis, dimension, vector spaces, rank, and systems of linear equations. Understanding Linear Independence and Span is essential before studying more advanced topics such as eigenvectors, diagonalization, and fundamental subspaces.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SPAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Span of a set of vectors is the collection of all possible linear combinations of those vectors.

Suppose we have vectors v₁, v₂, ..., vₖ. Their span is written as:

  span{v₁, v₂, ..., vₖ}

It represents every vector that can be created by multiplying the given vectors by scalars and adding the results.

Example:

  v₁ = [1]    v₂ = [0]
       [0]         [1]

Their span is:

  span{ [1], [0] }
        [0]  [1]

Any vector in ℝ² can be written as:

  c₁[1] + c₂[0] = [c₁]
    [0]    [1]    [c₂]

Since c₁ and c₂ can be any real numbers, these two vectors span all of ℝ².

Therefore:

  span{ [1], [0] } = ℝ²
        [0]  [1]

────────────────────────────────────────────────────────────────────────────────

Example of Span

Consider the vectors:

  v₁ = [1]    v₂ = [3]
       [2]         [1]

To find their span, we consider all possible combinations:

  c₁[1] + c₂[3] = [c₁ + 3c₂]
    [2]    [1]    [2c₁ + c₂]

As c₁ and c₂ vary, different vectors can be produced.

Because these two vectors are not scalar multiples of each other, they span the entire plane ℝ².

Therefore:

  span{ [1], [3] } = ℝ²
        [2]  [1]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. LINEAR INDEPENDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A set of vectors is linearly independent if none of the vectors can be created as a linear combination of the others.

In other words, every vector contributes a new direction or new piece of information.

Mathematically, vectors v₁, v₂, ..., vₖ are linearly independent if the equation:

  c₁v₁ + c₂v₂ + ... + cₖvₖ = 0

has only the trivial solution:

  c₁ = c₂ = ... = cₖ = 0

If there is another solution where at least one coefficient is not zero, then the vectors are linearly dependent.

────────────────────────────────────────────────────────────────────────────────

Example of Linear Independence

Consider:

  v₁ = [1]    v₂ = [0]
       [0]         [1]

We want to determine whether they are linearly independent.

Set:

  c₁[1] + c₂[0] = [0]
    [0]    [1]    [0]

This gives:

  [c₁] = [0]
  [c₂]   [0]

Therefore:

  c₁ = 0  and  c₂ = 0

Since the only solution is the trivial solution, the vectors are linearly independent.

────────────────────────────────────────────────────────────────────────────────

Example of Linear Dependence

Now consider:

  v₁ = [1]    v₂ = [2]
       [2]         [4]

Notice that v₂ = 2v₁. Therefore, the second vector does not provide a new direction. It can already be created from the first vector.

We can demonstrate this using:

  c₁v₁ + c₂v₂ = 0

Choose c₁ = -2 and c₂ = 1. Then:

  -2[1] + 1[2] = [-2 + 2] = [0]
    [2]    [4]   [-4 + 4]   [0]

Because there is a nontrivial solution, the vectors are linearly dependent.

Therefore:

  v₁, v₂ are linearly dependent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. THE DIFFERENCE BETWEEN SPAN AND LINEAR INDEPENDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Span and Linear Independence answer different questions.

  • Span asks: What vectors can be created using these vectors?

  • Linear Independence asks: Does each vector provide a new, independent direction?

Example:

  v₁ = [1]    v₂ = [0]
       [0]         [1]

They are:
  • Linearly independent
  • They span ℝ²

Now consider:

  v₁ = [1]    v₂ = [2]
       [2]         [4]

They are:
  • Linearly dependent
  • They span only a line in ℝ²

So, having more vectors does not necessarily mean having more independent directions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. SPAN AND BASIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The concepts of Span and Linear Independence come together in the definition of a basis.

A basis of a vector space is a set of vectors that satisfies two conditions:

  1. The vectors span the space
  2. The vectors are linearly independent

Example - Standard Basis of ℝ²:

  e₁ = [1]    e₂ = [0]
       [0]         [1]

These vectors are linearly independent and span all of ℝ².

Therefore, they form a basis for ℝ².

────────────────────────────────────────────────────────────────────────────────

Example: Determining Whether Vectors Form a Basis

Consider:

  v₁ = [1]    v₂ = [3]
       [2]         [1]

To determine whether they form a basis for ℝ², we need to check linear independence.

Put the vectors into a matrix:

  A = [1  3]
      [2  1]

Calculate its determinant:

  det(A) = (1)(1) - (3)(2) = 1 - 6 = -5

Since det(A) ≠ 0, the columns are linearly independent.

Because there are two linearly independent vectors in ℝ², they also span ℝ².

Therefore:

  { [1], [3] } is a basis for ℝ²
    [2]  [1]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. LINEAR INDEPENDENCE AND SYSTEMS OF EQUATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Linear independence is also closely related to systems of equations.

Suppose we have:

  A x = 0

  • If the only solution is x = 0, then the columns of A are linearly independent.

  • If there are infinitely many solutions, then the columns are linearly dependent.

Example:

  A = [1  2]
      [2  4]

The system A x = 0 becomes:

  x + 2y = 0

There are infinitely many solutions because x = -2y.

Therefore, the columns of A are linearly dependent.

This gives us another practical way to test linear independence.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. SPAN AND GEOMETRIC INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Span can also be understood geometrically.

  • A single nonzero vector in ℝ² spans a line.

    span{ [1] } contains all multiples: t[1]
          [2]                       [2]

  • Two linearly independent vectors in ℝ² span the entire plane.

  • In ℝ³:
    • One independent vector spans a line
    • Two independent vectors span a plane
    • Three independent vectors span all of ℝ³

Therefore, the number of independent directions determines the dimension of the space being spanned.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. MAXIMUM NUMBER OF LINEARLY INDEPENDENT VECTORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

An n-dimensional vector space cannot contain more than n linearly independent vectors.

  • ℝ² can have at most 2 linearly independent vectors
  • ℝ³ can have at most 3 linearly independent vectors
  • ℝ⁴ can have at most 4 linearly independent vectors

If you have more than n vectors in ℝⁿ, they must be linearly dependent.

For example, if we have four vectors in ℝ³, at least one of them must be expressible as a combination of the others.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. LINEAR INDEPENDENCE AND RANK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Linear independence is also directly related to the rank of a matrix.

The rank represents the number of linearly independent columns or rows.

Example:

  A = [1  2]
      [2  4]

has two columns, but they are dependent because:

  [2] = 2[1]
  [4]   [2]

Therefore:

  rank(A) = 1

The matrix has two columns, but only one independent direction.

This is an important connection:

  Rank = Number of linearly independent directions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. APPLICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Linear Independence and Span are used throughout mathematics, science, and technology.

  1. Computer Graphics
     • Vectors that span a coordinate system
     • Representing and transforming objects

  2. Machine Learning
     • Independent features
     • Analyzing datasets
     • Reducing redundant information

  3. Data Science
     • Determining whether data contains redundant variables
     • Dimensionality reduction

  4. Engineering
     • Independent forces
     • Directions and system components

  5. Physics
     • Representing physical quantities and states

  6. Computer Science
     • Algorithms involving matrices
     • Graphics, optimization, data analysis
     • Machine learning

They are also essential for understanding:

  • Basis
  • Dimension
  • Rank
  • Null Space
  • Eigenvectors
  • Linear Transformations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, Span describes all the vectors that can be created from a collection of vectors through linear combinations.

  span{v₁, v₂, ..., vₖ} = all linear combinations of the vectors

Linear Independence determines whether each vector contributes a unique direction.

A set of vectors is linearly independent when:

  c₁v₁ + c₂v₂ + ... + cₖvₖ = 0

has only the solution:

  c₁ = c₂ = ... = cₖ = 0

The two concepts work together to define a basis:

  Basis = Linear Independence + Span

Key Points:

  • Span tells you what you can build with the vectors
  • Linear Independence tells you whether the vectors are giving you unique directions or redundant information

Understanding these two concepts provides the foundation for studying basis, dimension, rank, null space, eigenvectors, diagonalization, and other advanced topics in Linear Algebra.
  `,
  examples: [
    "Check if vectors v₁ = [1,0]ᵀ and v₂ = [0,1]ᵀ are linearly independent → Yes",
    "Check if vectors v₁ = [1,2]ᵀ and v₂ = [2,4]ᵀ are linearly independent → No",
    "Find span{[1,0]ᵀ, [0,1]ᵀ} = ℝ²",
    "Find span{[1,2]ᵀ, [2,4]ᵀ} = line in ℝ²",
    "Determine if {[1,2]ᵀ, [3,1]ᵀ} forms a basis for ℝ² → Yes (det = -5 ≠ 0)",
    "Rank = number of linearly independent columns",
    "A x = 0 has only trivial solution → columns are linearly independent",
    "A x = 0 has infinitely many solutions → columns are linearly dependent",
    "ℝ² can have at most 2 linearly independent vectors",
    "Find span{[1,0],[0,1]} = R^2",
  ],
};

export default topic;