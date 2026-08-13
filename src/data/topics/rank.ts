const topic = {
  id: "rank",
  title: "Rank",
  summary:
    "Row rank, column rank, rank-nullity relationship and interpretations.",
  details: `
Rank is one of the most important concepts in Linear Algebra because it tells us how much independent information is contained in a matrix.

The rank of a matrix is the maximum number of linearly independent rows or columns in that matrix.

In simpler terms:

  The rank of a matrix tells us how many independent directions or pieces of information the matrix contains.

Rank is closely connected to:
  • Linear independence
  • Span
  • Systems of equations
  • Matrix inverses
  • Linear transformations
  • Fundamental subspaces
  • Eigenvalues
  • Least Squares

The rank of a matrix A is written as rank(A).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. BASIC DEFINITION OF RANK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suppose we have a matrix:

  A = [1  2]
      [3  4]

The two rows:

  [1  2]    and    [3  4]

are linearly independent.

The two columns are also linearly independent.

Therefore:

  rank(A) = 2

The matrix contains two independent directions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. RANK AND LINEAR INDEPENDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rank is directly related to linear independence.

If the columns of a matrix are linearly independent, then the matrix has full column rank.

Example:

  A = [1  0]
      [0  1]

Its columns are:

  a₁ = [1]    a₂ = [0]
       [0]         [1]

Neither column can be written as a multiple of the other.

Therefore, they are linearly independent.

Thus:

  rank(A) = 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. RANK USING ROW REDUCTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most common methods for finding the rank of a matrix is Gaussian Elimination or Row Reduction.

The rank is equal to the number of pivot positions in the row-reduced matrix.

Example:

  A = [1  2  3]
      [2  4  6]
      [1  1  2]

Perform the row operation:

  R₂ → R₂ - 2R₁

This gives:

  [1  2  3]
  [0  0  0]
  [1  1  2]

Next:

  R₃ → R₃ - R₁

Therefore:

  [1  2  3]
  [0  0  0]
  [0 -1 -1]

There are two nonzero rows.

Therefore:

  rank(A) = 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. RANK AND PIVOT POSITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A pivot is the first nonzero entry in a nonzero row after row reduction.

Example:

  [1  2  3]
  [0  1  4]
  [0  0  1]

has three pivots at positions (1,1), (2,2), and (3,3).

Therefore:

  rank(A) = 3

The number of pivots is equal to the rank.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. RANK AND NONZERO ROWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After reducing a matrix to row-echelon form, the rank is equal to the number of nonzero rows.

Example:

  A = [1  2  3]
      [0  1  4]
      [0  0  0]

There are two nonzero rows.

Therefore:

  rank(A) = 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. EXAMPLE: RANK OF A 3×3 MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider:

  A = [1  2  3]
      [2  4  6]
      [3  6  9]

Notice that:

  R₂ = 2R₁    and    R₃ = 3R₁

Therefore, all rows depend on the first row.

After row reduction:

  A → [1  2  3]
      [0  0  0]
      [0  0  0]

There is only one pivot.

Therefore:

  rank(A) = 1

The matrix contains only one independent direction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. RANK OF THE IDENTITY MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider the identity matrix:

  Iₙ = [1  0  ...  0]
       [0  1  ...  0]
       [⋮  ⋮  ⋱   ⋮]
       [0  0  ...  1]

Every row and column is linearly independent.

Therefore:

  rank(Iₙ) = n

The identity matrix has full rank.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. FULL RANK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix has full rank when its rank is as large as possible.

For an m×n matrix:

  rank(A) ≤ min(m, n)

Therefore, the maximum possible rank is:

  min(m, n)

Example: A 3×5 matrix can have a maximum rank of:

  min(3, 5) = 3

Therefore, its full rank is 3.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. ROW RANK AND COLUMN RANK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

There are two ways to describe rank:

  • Row Rank: The number of linearly independent rows.
  • Column Rank: The number of linearly independent columns.

A fundamental theorem of Linear Algebra states that:

  Row Rank = Column Rank

Therefore, we simply call this value the rank of the matrix.

────────────────────────────────────────────────────────────────────────────────

Example of Row Rank and Column Rank

Consider:

  A = [1  2  3]
      [2  4  6]

The second row is twice the first:

  R₂ = 2R₁

Therefore, there is only one independent row.

Thus:

  Row Rank = 1

The columns are:

  a₁ = [1]    a₂ = [2]    a₃ = [3]
       [2]         [4]         [6]

Each column is a multiple of [1, 2]ᵀ.

Therefore:

  Column Rank = 1

Hence:

  rank(A) = 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. RANK AND THE NULL SPACE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rank is closely connected to the null space.

For an m×n matrix:

  A x = 0

the set of all solutions is called the null space.

The Rank-Nullity Theorem states:

  rank(A) + nullity(A) = n

where n is the number of columns of A.

This is one of the most important theorems in Linear Algebra.

────────────────────────────────────────────────────────────────────────────────

Example of Rank-Nullity

Suppose A has 5 columns and:

  rank(A) = 3

Using the Rank-Nullity Theorem:

  3 + nullity(A) = 5

Therefore:

  nullity(A) = 2

So the matrix has three independent directions in its column space and two dimensions in its null space.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. RANK AND SYSTEMS OF EQUATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rank can be used to determine whether a system of equations has a solution.

Consider:

  A x = b

A system is consistent if:

  rank(A) = rank([A | b])

Here, [A | b] is the augmented matrix.

────────────────────────────────────────────────────────────────────────────────

Unique Solution

For a system with n unknowns, a unique solution occurs when:

  rank(A) = n

and the system is consistent.

Example: If A is a 3×3 matrix and rank(A) = 3, then the columns are linearly independent.

If the system is consistent, it has a unique solution.

────────────────────────────────────────────────────────────────────────────────

Infinitely Many Solutions

A system can have infinitely many solutions when:

  rank(A) < n

while:

  rank(A) = rank([A | b])

The system is consistent, but there are free variables.

Example: If there are 3 unknowns and rank(A) = 2, then there is at least one free variable.

Therefore, the system has infinitely many solutions if it is consistent.

────────────────────────────────────────────────────────────────────────────────

No Solution

A system has no solution when:

  rank(A) < rank([A | b])

Example:

  x + y = 2
  2x + 2y = 5

has the augmented matrix:

  [1  1 | 2]
  [2  2 | 5]

Row reduction gives:

  [1  1 | 2]
  [0  0 | 1]

The second row represents 0 = 1, which is impossible.

Therefore:

  No solution

because the coefficient matrix and augmented matrix have different ranks.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. RANK AND MATRIX INVERSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For a square matrix A ∈ ℝ^(n×n):

  A is invertible if and only if:

  rank(A) = n

Therefore:

  A⁻¹ exists  ⟺  rank(A) = n

For a 3×3 matrix, full rank means rank(A) = 3.

If the rank is less than 3, the matrix is singular and does not have an inverse.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. RANK AND DETERMINANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For a square matrix A ∈ ℝ^(n×n):

  det(A) ≠ 0  ⟺  rank(A) = n

Therefore, if det(A) = 0, the matrix does not have full rank.

Example:

  A = [1  2]
      [2  4]

Its determinant is:

  det(A) = (1)(4) - (2)(2) = 4 - 4 = 0

Therefore:

  rank(A) < 2

In fact:

  rank(A) = 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. RANK AND LINEAR TRANSFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix can represent a linear transformation:

  T: ℝⁿ → ℝᵐ

The rank of A tells us the dimension of the range or image of the transformation.

Therefore:

  dim(Range(T)) = rank(A)

This tells us how many independent output directions the transformation can produce.

────────────────────────────────────────────────────────────────────────────────

Example of Rank as a Transformation

Consider:

  A = [1  0]
      [0  0]

For:

  x = [x]
      [y]

we get:

  A x = [x]
        [0]

Notice that every output lies along the x-axis.

Therefore, the range has only one independent direction.

Thus:

  rank(A) = 1

The transformation reduces the two-dimensional input into a one-dimensional output space.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. RANK AND FUNDAMENTAL SUBSPACES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rank is connected to the four fundamental subspaces:

  • Column Space
  • Null Space
  • Row Space
  • Left Null Space

The rank gives the dimension of the column space:

  dim(Col(A)) = rank(A)

It also gives the dimension of the row space:

  dim(Row(A)) = rank(A)

If A has n columns:

  dim(Null(A)) = n - rank(A)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. RANK OF A PRODUCT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For matrices A and B where the product AB is defined:

  rank(AB) ≤ min(rank(A), rank(B))

This means multiplying matrices cannot produce more independent directions than the matrices already contain.

Example: If rank(A) = 2 and rank(B) = 3, then:

  rank(AB) ≤ 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

17. RANK AND TRANSPOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The rank of a matrix is unchanged when it is transposed:

  rank(Aᵀ) = rank(A)

This makes sense because the row rank and column rank are equal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

18. RANK AND ELEMENTARY ROW OPERATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Elementary row operations do not change the rank of a matrix.

The three basic row operations are:
  1. Swapping two rows
  2. Multiplying a row by a nonzero scalar
  3. Adding a multiple of one row to another row

Therefore:

  rank(A) = rank(RREF(A))

This is why row reduction is such a useful method for finding rank.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

19. EXAMPLE: FINDING RANK USING RREF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider:

  A = [1  2  3]
      [2  4  6]
      [1  3  4]

Perform:

  R₂ → R₂ - 2R₁
  R₃ → R₃ - R₁

We get:

  [1  2  3]
  [0  0  0]
  [0  1  1]

Swap the second and third rows:

  [1  2  3]
  [0  1  1]
  [0  0  0]

There are two pivot positions.

Therefore:

  rank(A) = 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

20. RANK AND DATA SCIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rank is important in Data Science because datasets are often represented as matrices.

Suppose a dataset contains 100 features, but many of those features are dependent on one another.

The matrix might have 100 columns but a rank of only 60.

This means that although there are 100 recorded features, only 60 independent directions of information exist.

Therefore, rank can help identify:
  • Redundant information
  • Dependent variables
  • Low-dimensional structure
  • Feature relationships

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

21. RANK AND MACHINE LEARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rank appears in Machine Learning through:
  • Linear regression
  • Dimensionality reduction
  • Matrix factorization
  • Neural networks
  • Recommendation systems
  • Principal Component Analysis
  • Low-rank approximation

For example, recommendation systems often use low-rank matrix factorization to represent a large user-item matrix using a smaller number of latent factors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

22. RANK AND IMAGE COMPRESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Images can be represented as matrices of pixel values.

A large image matrix may contain redundant information.

Instead of storing every value exactly, a low-rank approximation can be used.

If:

  A ≈ Aₖ

where Aₖ has a much smaller rank, the image can sometimes be represented using less storage while maintaining much of its visual information.

This idea is closely connected to Singular Value Decomposition (SVD).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

23. RANK AND SVD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Singular Value Decomposition of a matrix is:

  A = U Σ Vᵀ

The rank of A is equal to the number of nonzero singular values in Σ.

Example: If:

  Σ = [5  0  0]
      [0  2  0]
      [0  0  0]

there are two nonzero singular values: 5 and 2.

Therefore:

  rank(A) = 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

24. RANK AND LOW-RANK APPROXIMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix is called low rank when its rank is significantly smaller than its dimensions.

Example: A 1000×1000 matrix could theoretically have rank 1000.

But if its rank is only 20, then it has a strong low-dimensional structure.

This is useful in:
  • Data compression
  • Image processing
  • Recommendation systems
  • Machine Learning
  • Noise reduction

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

25. IMPORTANT RANK CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When studying Rank, make sure you understand:

  • rank(A)
  • Row Rank
  • Column Rank
  • Pivot Positions
  • Full Rank
  • Rank-Nullity Theorem
  • Column Space
  • Null Space
  • Matrix Invertibility
  • Linear Systems
  • Low-Rank Approximation
  • Singular Value Decomposition

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

26. QUICK EXAMPLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider:

  A = [1  2  3]
      [2  4  6]
      [3  6  9]

Since:

  R₂ = 2R₁    and    R₃ = 3R₁

there is only one independent row.

Therefore:

  rank(A) = 1

Since A has 3 columns, the Rank-Nullity Theorem gives:

  1 + nullity(A) = 3

Therefore:

  nullity(A) = 2

This tells us that the matrix has:
  • 1 independent direction in its column space
  • 1 independent row direction
  • 2 dimensions in its null space

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, Rank measures the number of independent rows or columns in a matrix.

The most important formula is:

  rank(A) = number of linearly independent columns
          = number of linearly independent rows

When a matrix is row-reduced:

  rank(A) = number of pivots

Rank is also connected to the Rank-Nullity Theorem:

  rank(A) + nullity(A) = n

For a square matrix:

  rank(A) = n  ⟺  A is invertible

Rank also determines the dimension of the column space and plays a major role in systems of equations, linear transformations, matrix factorization, SVD, data compression, and Machine Learning.

Key Facts:

  • rank(A) ≤ min(m, n)
  • rank(A) = rank(Aᵀ)
  • rank(AB) ≤ min(rank(A), rank(B))
  • rank(A) = n  ⟺  columns are linearly independent
  • rank(A) = n  ⟺  det(A) ≠ 0  ⟺  A is invertible

The key idea to remember:

  Rank tells us how many independent directions or pieces of information a matrix contains. It is one of the fundamental measurements of a matrix and connects Linear Algebra concepts such as independence, span, null spaces, transformations, and matrix invertibility.
  `,
  examples: [
    "Rank: number of linearly independent rows/columns",
    "Example: A = [[1,2],[3,4]] → rank = 2",
    "Example: A = [[1,2,3],[2,4,6],[3,6,9]] → rank = 1",
    "Row reduction: rank = number of pivots",
    "Full rank: rank(A) = min(m,n)",
    "Row rank = Column rank",
    "Rank-Nullity: rank(A) + nullity(A) = n",
    "Identity matrix: rank(Iₙ) = n",
    "Invertible: rank(A) = n  ⟺  A⁻¹ exists",
    "Determinant: det(A) ≠ 0  ⟺  rank(A) = n",
    "Consistent system: rank(A) = rank([A|b])",
    "Unique solution: rank(A) = n and consistent",
    "Infinitely many solutions: rank(A) < n and consistent",
    "No solution: rank(A) < rank([A|b])",
    "Rank of product: rank(AB) ≤ min(rank(A), rank(B))",
    "Transpose: rank(Aᵀ) = rank(A)",
    "SVD: rank = number of nonzero singular values",
    "Find rank by row reduction",
    "Use rank to determine if a system has infinitely many solutions.",
  ],
};

export default topic;