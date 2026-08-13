const topic = {
  id: "change-of-basis",
  title: "Change of Basis",
  summary:
    "Coordinate vectors, transition matrices, similar matrices and coordinate transformations.",
  details: `
Change of Basis is a concept in Linear Algebra that involves representing the same vector using a different set of basis vectors. A basis provides a coordinate system for describing vectors in a vector space. Changing the basis does not change the actual vector; instead, it changes the way we describe or represent that vector.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. WHAT IS A BASIS?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A basis is a set of vectors that is linearly independent and can be used to represent every vector in a particular vector space.

Example - Standard Basis of ℝ²:

  E = { [1], [0] }
        [0]   [1]

Using this standard basis, the vector:

  v = [3]
      [2]

can be written as:

  3[1] + 2[0] = [3]
   [0]    [1]   [2]

Therefore, the coordinates of v relative to the standard basis are:

  [v]ₑ = [3]
         [2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. CREATING ANOTHER BASIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We do not always have to use the standard basis. We can create another basis for the same vector space.

Example - Alternative Basis B for ℝ²:

  B = { [1], [ 1] }
        [1]   [-1]

These two vectors form a basis for ℝ² because they are linearly independent.

Now suppose we want to represent:

  v = [3]
      [1]

using basis B. We want to find numbers c₁ and c₂ such that:

  v = c₁[1] + c₂[ 1]
         [1]    [-1]

Expanding gives:

  [3] = [c₁ + c₂]
  [1]   [c₁ - c₂]

Therefore, we need to solve:

  c₁ + c₂ = 3
  c₁ - c₂ = 1

Adding the two equations gives:

  2c₁ = 4
  c₁ = 2

Substituting c₁ = 2 into the first equation:

  2 + c₂ = 3
  c₂ = 1

Therefore, the vector can be represented in basis B as:

  [v]ᴮ = [2]
         [1]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. THE MAIN IDEA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Notice that the actual vector has not changed:

  v = [3]  ← Same vector
      [1]

Only its coordinate representation has changed.

  +---------------------------------------------------------------+
  |      SAME VECTOR, DIFFERENT COORDINATES                      |
  +---------------------------------------------------------------+

A useful analogy: A physical location on Earth does not change when we describe it using latitude and longitude instead of another coordinate system. The location is the same, but its numerical representation is different. Similarly, a vector remains the same even when we change the basis used to describe it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. CHANGE-OF-BASIS MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A change-of-basis matrix is used to convert the coordinates of a vector from one basis to another.

Suppose we have two bases B and C. A change-of-basis matrix allows us to transform:

  [v]ᴮ → [v]ᶜ

The general relationship can be written as:

  [v]ᶜ = P_(C←B) · [v]ᴮ

Here, P_(C←B) is the matrix that converts coordinates from basis B to basis C.

Example: Using basis B:

  B = { [1], [ 1] }
        [1]   [-1]

We can construct the basis matrix:

  P_B = [1   1]
        [1  -1]

The columns of this matrix are the basis vectors.

If [v]ᴮ = [2], then multiplying by P_B gives the standard coordinates:
          [1]

  P_B · [v]ᴮ = [1   1] [2] = [2 + 1] = [3]
                [1  -1] [1]   [2 - 1]   [1]

So the coordinates [2] in basis B represent the same vector as [3] in the standard basis.
                  [1]                              [1]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. WHY IS CHANGE OF BASIS IMPORTANT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Change of Basis is important because some problems become much easier when they are expressed using a suitable basis. A complicated matrix or transformation may become simpler when represented using a different coordinate system.

Applications include:

  1. Diagonalization
  2. Computer Graphics
  3. Physics
  4. Engineering
  5. Robotics
  6. Data Science
  7. Computer Science

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. DIAGONALIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If a matrix has enough linearly independent eigenvectors, we can use those eigenvectors as a new basis. In that basis, the matrix can become diagonal:

  A = P D P⁻¹

The diagonal matrix D is often much easier to work with than the original matrix A.

Example: If D = [2  0]
                 [0  3]

calculating powers of D is simple:

  Dⁿ = [2ⁿ   0 ]
       [0   3ⁿ]

This is one reason Change of Basis is closely connected to eigenvalues, eigenvectors, and diagonalization.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. CHANGE OF BASIS IN ROBOTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Different coordinate systems can make calculations easier depending on the problem.

Example: A robotics system may use:
  • One coordinate system for the robot's base
  • Another for the position of a robotic arm

Transformations between these coordinate systems allow the system to understand how objects are positioned relative to one another.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. CHANGE OF BASIS IN DATA SCIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Principal Component Analysis (PCA) is essentially a change of basis technique:

  • The original data is represented in the standard basis
  • PCA finds a new basis (principal components) that better captures the variance in the data
  • This new basis often requires fewer dimensions to represent the same information

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. CHANGE OF BASIS IN COMPUTER GRAPHICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Different coordinate systems are used in 3D graphics:

  • World coordinates (global scene)
  • Camera coordinates (view from camera)
  • Object coordinates (local to an object)
  • Screen coordinates (pixel positions)

Change of basis matrices transform between these different coordinate systems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT IDEA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The most important thing to remember is:

  +---------------------------------------------------------------+
  |  CHANGING THE BASIS DOES NOT CHANGE THE VECTOR ITSELF.       |
  |  It only changes the coordinates used to describe that vector.|
  +---------------------------------------------------------------+

Example:

  v = [3] in the standard basis can be represented as [v]ᴮ = [2] in another basis.
      [1]                                                  [1]

Both representations describe the same vector.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Change of Basis is the process of converting the coordinates of a vector from one basis to another while keeping the actual vector unchanged. It allows mathematicians, engineers, programmers, and scientists to choose coordinate systems that make calculations simpler and more meaningful.

Key concepts covered:

  ✓ What is a Basis?
  ✓ Coordinate Representations
  ✓ Change-of-Basis Matrix (Transition Matrix)
  ✓ Converting Between Bases
  ✓ Diagonalization
  ✓ Applications in Robotics, Graphics, Data Science

Change of Basis is especially important for understanding:

  • Coordinate Transformations
  • Change-of-Basis Matrices
  • Eigenvectors
  • Diagonalization
  • Linear Transformations
  • Applications involving different coordinate systems
  `,
  examples: [
    "Standard basis: E = {[1,0]ᵀ, [0,1]ᵀ} for ℝ²",
    "Alternative basis: B = {[1,1]ᵀ, [1,-1]ᵀ}",
    "Change coordinates from basis B to the standard basis: [v]ᴮ = [2,1]ᵀ → [3,1]ᵀ",
    "Compute the transition matrix P from one basis to another.",
    "Diagonalization: A = PDP⁻¹ using eigenvectors as basis",
    "PCA as a change of basis technique",
    "Robotics: Transform between base and arm coordinate systems",
    "Computer Graphics: World, camera, and screen coordinate systems",
  ],
};

export default topic;