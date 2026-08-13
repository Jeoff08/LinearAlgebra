const topic = {
  id: "svd",
  title: "Singular Value Decomposition (SVD)",
  summary:
    "SVD concepts, singular values/vectors, low-rank approximations and PCA connections.",
  details: `
Singular Value Decomposition (SVD) is one of the most powerful and widely used matrix factorization techniques in Linear Algebra. It allows a matrix to be broken down into three simpler matrices.

The basic formula is:

  A = U Σ Vᵀ

where:
  • A is the original matrix
  • U is an orthogonal matrix containing the left singular vectors
  • Σ is a diagonal matrix containing the singular values
  • Vᵀ is the transpose of an orthogonal matrix V, whose columns contain the right singular vectors

The main idea is:

  SVD breaks a complicated matrix into three simpler parts that describe the directions, scaling, and transformations contained within the matrix.

SVD is extremely important in:
  • Data Science
  • Machine Learning
  • Image Compression
  • Recommendation Systems
  • Principal Component Analysis
  • Signal Processing
  • Statistics
  • Numerical Linear Algebra

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. THE BASIC SVD FORMULA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For a matrix A ∈ ℝ^(m×n), its SVD is:

  A = U Σ Vᵀ

The three matrices have different purposes.

U: Left Singular Vectors
  • Contains orthonormal vectors that describe directions in the output space

Σ: Singular Values
  • Contains nonnegative values called singular values
  • These values describe how strongly the matrix stretches different directions

Vᵀ: Right Singular Vectors
  • Describes the directions in the input space

Therefore:

  A = U · Σ · Vᵀ
       ↑     ↑     ↑
   directions  scaling  input transformation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. GEOMETRIC MEANING OF SVD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD can be understood geometrically as a sequence of transformations.

When a vector is multiplied by A:

  A x

SVD tells us that this transformation can be viewed as three steps:

  x → Vᵀ x → Σ Vᵀ x → U Σ Vᵀ x

In simple terms:

  Step 1: Vᵀ   → Rotates or reflects the input
  Step 2: Σ    → Stretches or compresses the coordinates
  Step 3: U    → Rotates or reflects the result into the final orientation

Therefore:

  SVD = Rotation/Reflection + Scaling + Rotation/Reflection

This geometric interpretation is one of the most important ideas behind SVD.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. SINGULAR VALUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The diagonal entries of Σ are called the singular values.

They are usually written as:

  σ₁, σ₂, ..., σᵣ

and are ordered as:

  σ₁ ≥ σ₂ ≥ ... ≥ σᵣ ≥ 0

Example:

  Σ = [5  0  0]
      [0  3  0]
      [0  0  1]

The singular values are:

  5, 3, 1

The largest singular value tells us the maximum amount by which the matrix can stretch a unit vector.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. HOW ARE SINGULAR VALUES FOUND?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The singular values of A are related to the eigenvalues of Aᵀ A.

If λᵢ are the eigenvalues of Aᵀ A, then the singular values are:

  σᵢ = √λᵢ

Therefore, the process is:

  A → Aᵀ A → Eigenvalues → √Eigenvalues → Singular Values

────────────────────────────────────────────────────────────────────────────────

Example of Finding Singular Values

Consider:

  A = [3  0]
      [0  2]

First calculate Aᵀ A. Since A is diagonal:

  Aᵀ = A

Therefore:

  Aᵀ A = [3  0] [3  0] = [9  0]
          [0  2] [0  2]   [0  4]

The eigenvalues are:

  λ₁ = 9,    λ₂ = 4

Take their square roots:

  σ₁ = √9 = 3
  σ₂ = √4 = 2

Therefore:

  σ₁ = 3,    σ₂ = 2

So:

  Σ = [3  0]
      [0  2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. CONSTRUCTING AN SVD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Consider the matrix:

  A = [3  0]
      [0  2]

Since the matrix is already diagonal and its columns are orthogonal, its SVD is particularly simple.

We can choose:

  U = [1  0]    Σ = [3  0]    V = [1  0]
      [0  1]        [0  2]        [0  1]

Therefore:

  A = U Σ Vᵀ

Since U = I and V = I, we simply have:

  A = Σ

This is a simple example of SVD.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. ORTHOGONAL MATRICES IN SVD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Both U and V are orthogonal matrices.

Therefore:

  Uᵀ U = I    and    Vᵀ V = I

For square orthogonal matrices:

  U⁻¹ = Uᵀ    and    V⁻¹ = Vᵀ

This is why the transpose Vᵀ appears in the SVD formula.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. SVD AND RANK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD provides a very convenient way to determine the rank of a matrix.

The rank of A is equal to the number of nonzero singular values.

Example:

  Σ = [8  0  0]
      [0  4  0]
      [0  0  0]

There are two nonzero singular values: 8 and 4.

Therefore:

  rank(A) = 2

This is especially useful for large matrices.

────────────────────────────────────────────────────────────────────────────────

Example: Rank Using SVD

Suppose:

  Σ = [10  0   0   0]
      [0   5   0   0]
      [0   0   2   0]
      [0   0   0   0]

The singular values are: 10, 5, 2, 0.

There are three nonzero singular values.

Therefore:

  rank(A) = 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. SVD AND LOW-RANK APPROXIMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most important applications of SVD is low-rank approximation.

Suppose:

  A = U Σ Vᵀ

We can keep only the largest singular values.

Example:

  Σ = [10  0  0]
      [0   5  0]
      [0   0  1]

Instead of using all three singular values, we can keep only 10 and 5.

The resulting approximation is:

  A ≈ A₂

where A₂ has rank 2.

This provides a smaller representation of the original matrix while preserving much of its important information.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. SVD AND IMAGE COMPRESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One of the most famous applications of SVD is image compression.

A grayscale image can be represented as a matrix:

  A = [pixel values]

A large image may contain thousands or millions of pixel values.

SVD decomposes the image matrix:

  A = U Σ Vᵀ

The largest singular values usually represent the most significant visual information.

If we keep only the largest singular values:

  A ≈ Uₖ Σₖ Vₖᵀ

we can create a compressed version of the image.

The image may look very similar while requiring fewer values to represent it.

────────────────────────────────────────────────────────────────────────────────

Example of Image Compression

Suppose an image matrix has singular values:

  100, 50, 20, 10, 5, 2, 1

The first few singular values contain much of the important information.

Instead of keeping all seven, we might keep only:

  100, 50, 20

Then we construct:

  A₃ = U₃ Σ₃ V₃ᵀ

The result is a rank-3 approximation of the original image.

The image is compressed while maintaining much of its overall structure.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. SVD AND DATA COMPRESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD is useful for compression because many datasets contain redundant information.

Suppose a matrix has dimensions 1000×1000 but its important information can be represented using a rank-20 approximation.

Instead of storing all 1,000,000 entries directly, we can store the smaller matrices involved in the rank-20 representation.

This can significantly reduce storage requirements.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

11. SVD AND PRINCIPAL COMPONENT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD is closely connected to Principal Component Analysis (PCA).

Suppose the centered data matrix is X.

We can compute:

  X = U Σ Vᵀ

The columns of V identify important directions in the feature space.

The singular values indicate how much variation is associated with those directions.

Therefore, SVD can be used to efficiently compute PCA.

The largest singular values correspond to the most important principal components.

────────────────────────────────────────────────────────────────────────────────

Example of PCA Connection

Suppose the singular values of a dataset are:

  10, 5, 1, 0.2

The first singular value is much larger than the others.

This suggests that the first principal direction contains a large amount of the data's variation.

We might reduce the data to the first two principal components:

  Original data → 2-dimensional representation

This is useful for:
  • Visualization
  • Noise reduction
  • Feature reduction
  • Data compression

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

12. SVD AND LEAST SQUARES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD can also be used to solve Least-Squares problems.

Suppose:

  A x ≈ b

If:

  A = U Σ Vᵀ

then the solution can be expressed using the pseudoinverse:

  A⁺ = V Σ⁺ Uᵀ

The least-squares solution can then be written as:

  x = A⁺ b

SVD is especially useful when the matrix is singular or nearly singular.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

13. MOORE-PENROSE PSEUDOINVERSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The Moore-Penrose pseudoinverse extends the concept of a matrix inverse to matrices that may not have ordinary inverses.

Using SVD:

  A = U Σ Vᵀ

the pseudoinverse is:

  A⁺ = V Σ⁺ Uᵀ

To obtain Σ⁺:
  • Take the reciprocal of every nonzero singular value
  • Keep zero singular values as zero
  • Transpose the resulting diagonal structure

Example:

  Σ = [5  0]
      [0  2]

Then:

  Σ⁺ = [1/5   0]
       [0   1/2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

14. SVD AND NUMERICAL STABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD is considered a powerful numerical tool because it can handle matrices that are:
  • Singular
  • Nearly singular
  • Rank-deficient
  • Ill-conditioned

Example: Suppose a matrix has singular values:

  10, 5, 0.00001

The very small singular value indicates that the matrix has a direction in which it produces very little output.

This can indicate numerical sensitivity.

SVD makes this structure visible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

15. CONDITION NUMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For a full-rank matrix, the condition number can be expressed using singular values:

  κ(A) = σ_max / σ_min

Example: Suppose σ_max = 100 and σ_min = 2.

Then:

  κ(A) = 100 / 2 = 50

A large condition number generally indicates that a problem may be sensitive to small changes in the input.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

16. SVD AND THE GEOMETRY OF A MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD gives us a powerful geometric interpretation.

Suppose we take the unit circle:

  ||x|| = 1

When the matrix A transforms this circle:

  A x

the result is generally an ellipse.

The singular values determine the lengths of the ellipse's principal axes.

  • The largest singular value gives the length of the longest axis.
  • The smallest nonzero singular value gives the shortest nonzero axis.

Therefore:

  Singular values describe how strongly a matrix stretches different directions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

17. SVD AND EIGENVALUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD is related to eigenvalue decomposition, but they are not the same thing.

For a symmetric matrix A:

  A = Q Λ Qᵀ

is its eigendecomposition.

For a general matrix:

  A = U Σ Vᵀ

is its SVD.

The singular values are related to the eigenvalues of Aᵀ A:

  σᵢ = √(λᵢ(Aᵀ A))

This makes SVD applicable to matrices that may not be square or symmetric.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

18. SVD VS. EIGENVALUE DECOMPOSITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Feature                   SVD                        Eigenvalue Decomposition
----------------------   --------------------------  --------------------------
Form                      A = U Σ Vᵀ                A = P D P⁻¹
Works for rectangular     Yes                        No, generally
Singular values           Nonnegative                Eigenvalues may be negative/complex
Uses two orthogonal bases Yes                        Not always
Rank determination        Excellent                  Less direct
Image compression         Excellent                  Less common
PCA                       Common                     Also related
Numerical applications    Very important             Important

SVD is generally more broadly applicable.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

19. COMPACT SVD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the rank of A is r, we can write a smaller decomposition:

  A = Uᵣ Σᵣ Vᵣᵀ

Here:
  • Uᵣ ∈ ℝ^(m×r)
  • Σᵣ ∈ ℝ^(r×r)
  • Vᵣ ∈ ℝ^(n×r)

This is called the compact SVD.

It removes unnecessary zero singular values and is useful for low-rank computations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

20. TRUNCATED SVD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A truncated SVD keeps only the largest k singular values:

  Aₖ = Uₖ Σₖ Vₖᵀ

The rank of Aₖ is:

  rank(Aₖ) = k

This is widely used for dimensionality reduction and compression.

────────────────────────────────────────────────────────────────────────────────

Example of Truncated SVD

Suppose:

  A = U [20  0  0] Vᵀ
        [0  10  0]
        [0   0  1]

If we keep only the two largest singular values: 20, 10.

Then:

  Σ₂ = [20  0]
       [0  10]

The approximation becomes:

  A ≈ U₂ Σ₂ V₂ᵀ

This is a rank-2 approximation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

21. SVD AND RECOMMENDATION SYSTEMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD is also used in recommendation systems.

Suppose we have a user-item matrix:

  A = [ratings]

Rows may represent users and columns may represent products, movies, or songs.

The matrix may be extremely large and contain many missing values.

Low-rank factorization can identify hidden patterns such as:
  • User preferences
  • Product characteristics
  • Movie genres
  • Purchasing behavior

The system can then use these latent factors to predict what a user might like.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

22. SVD IN NATURAL LANGUAGE PROCESSING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD can also be applied to text matrices.

For example, a document-term matrix can be constructed:

  A = [term frequencies]

SVD can reduce the dimensions of this matrix while preserving important relationships.

This idea is used in Latent Semantic Analysis (LSA).

It can help identify hidden relationships between words and documents.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

23. SVD IN SIGNAL PROCESSING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Signals can often be represented as matrices or collections of measurements.

SVD can help with:
  • Noise reduction
  • Feature extraction
  • Signal compression
  • Pattern recognition

Small singular values may represent weak or noisy components.

Removing those components can produce a cleaner approximation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

24. SVD IN COMPUTER VISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SVD is useful in Computer Vision for:
  • Image compression
  • Feature extraction
  • Noise reduction
  • Face recognition
  • Dimensionality reduction

For example, an image can be converted into a matrix and decomposed using SVD.

The dominant singular vectors can capture major visual patterns.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

25. IMPORTANT SVD CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When studying Singular Value Decomposition, make sure you understand:

  • A = U Σ Vᵀ
  • Singular Values
  • Left Singular Vectors
  • Right Singular Vectors
  • Orthogonal Matrices
  • Rank
  • Low-Rank Approximation
  • Truncated SVD
  • Compact SVD
  • Pseudoinverse
  • Least Squares
  • PCA
  • Condition Number
  • Image Compression

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In summary, Singular Value Decomposition (SVD) is a powerful matrix factorization that decomposes a matrix into three matrices:

  A = U Σ Vᵀ

The matrices have the following roles:

  U = left singular vectors
  Σ = singular values
  V = right singular vectors

The singular values are obtained from the eigenvalues of Aᵀ A:

  σᵢ = √(λᵢ(Aᵀ A))

SVD can be used to determine rank because:

  rank(A) = number of nonzero singular values

It is also used for:
  • Low-rank approximation
  • Image compression
  • PCA
  • Least Squares
  • Pseudoinverse
  • Data compression
  • Machine Learning
  • Recommendation systems
  • Natural Language Processing
  • Signal processing
  • Computer Vision

Key Properties:

  • Uᵀ U = I, Vᵀ V = I
  • σ₁ ≥ σ₂ ≥ ... ≥ σᵣ ≥ 0
  • rank(A) = number of nonzero singular values
  • A⁺ = V Σ⁺ Uᵀ (pseudoinverse)
  • κ(A) = σ_max / σ_min (condition number)
  • ||A||₂ = σ₁ (largest singular value)

The key idea to remember:

  SVD breaks a matrix into U Σ Vᵀ, separating the transformation into orthogonal directions and scaling factors. Because of this, SVD provides a powerful way to understand, simplify, compress, and solve problems involving matrices and high-dimensional data.
  `,
  examples: [
    "SVD: A = U Σ Vᵀ",
    "Example: A = [[3,0],[0,2]] → U = I, Σ = [[3,0],[0,2]], V = I",
    "Singular values: σ₁ ≥ σ₂ ≥ ... ≥ σᵣ ≥ 0",
    "Singular values from eigenvalues: σᵢ = √(λᵢ(AᵀA))",
    "Rank: number of nonzero singular values",
    "Low-rank approximation: A ≈ Uₖ Σₖ Vₖᵀ",
    "Image compression: keep largest singular values",
    "PCA: use SVD on centered data matrix",
    "Pseudoinverse: A⁺ = V Σ⁺ Uᵀ",
    "Condition number: κ(A) = σ_max / σ_min",
    "Orthogonal matrices: Uᵀ U = I, Vᵀ V = I",
    "Compact SVD: A = Uᵣ Σᵣ Vᵣᵀ",
    "Truncated SVD: keep k largest singular values",
    "Recommendation systems: user-item matrix factorization",
    "LSA: document-term matrix with SVD",
    "Compute a low-rank approximation of a matrix",
    "Use SVD for a simple image compression example.",
  ],
};

export default topic;