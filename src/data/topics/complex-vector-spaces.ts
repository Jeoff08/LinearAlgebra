const topic = {
  id: "complex-vector-spaces",
  title: "Complex Vector Spaces",
  summary:
    "Complex numbers and vectors, Hermitian and unitary matrices, and complex inner products.",
  details: `
Complex Vector Spaces are vector spaces in which the scalars used to multiply and combine vectors are complex numbers instead of only real numbers. They extend the idea of ordinary vector spaces and are especially important in advanced Linear Algebra, physics, engineering, signal processing, quantum computing, and electrical engineering.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. COMPLEX NUMBERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A complex number has the form:

  z = a + bi

where a and b are real numbers and i is the imaginary unit, defined by:

  i² = -1

Example:

  z = 3 + 2i  ← a = 3 (real part), b = 2 (imaginary part)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. COMPLEX VECTOR SPACE DEFINITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A complex vector space is a set of vectors where:
  • The components can be complex numbers
  • Vectors can be multiplied by complex scalars

Example: A vector in ℂ² can be written as:

  v = [2 + i ]
      [3 - 2i]

Unlike a vector in ℝ², whose components are real numbers, this vector contains complex numbers.

  ℂ² = Set of all two-dimensional vectors with complex-number components
  ℂⁿ = Set of all n-dimensional vectors with complex-number components

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. VECTOR ADDITION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vectors in a complex vector space can be added component by component, just like vectors in a real vector space.

Example: Let

  u = [1 + 2i]    v = [2 - i ]
      [3 - i ]        [1 + 4i]

Adding them gives:

  u + v = [(1+2i) + (2-i)] = [3 + i ]
          [(3-i) + (1+4i)]   [4 + 3i]

The addition follows the same basic rule as ordinary vector addition.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. SCALAR MULTIPLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The major difference is that the scalar can also be a complex number.

Example: Suppose

  v = [1 + i]
      [2 - i]

and we multiply it by c = 2 + i. Then:

  c·v = (2+i)[1 + i] = [(2+i)(1+i)]
              [2 - i]   [(2+i)(2-i)]

For the first component:

  (2+i)(1+i) = 2 + 2i + i + i²
             = 2 + 3i - 1
             = 1 + 3i

For the second component:

  (2+i)(2-i) = 4 - 2i + 2i - i²
             = 4 + 1
             = 5

Therefore:

  c·v = [1 + 3i]
        [5    ]

This demonstrates an important feature of complex vector spaces: complex numbers can be used as scalars.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. BASIS OF A COMPLEX VECTOR SPACE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Just like real vector spaces, complex vector spaces have bases. A basis is a set of linearly independent vectors that can be used to represent every vector in the space.

For ℂ², the standard basis is:

  e₁ = [1]    e₂ = [0]
       [0]         [1]

A vector such as:

  v = [3 + 2i]
      [1 - i ]

can be expressed as:

  v = (3+2i)e₁ + (1-i)e₂

Therefore, the standard basis allows every vector in ℂ² to be represented using complex coefficients.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. COMPLEX INNER PRODUCT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

One important difference between real and complex vector spaces occurs when defining the inner product.

For real vectors, the dot product is:

  u·v = u₁v₁ + ... + uₙvₙ

For complex vectors, we use the complex conjugate of one vector:

  ⟨u,v⟩ = ūᵀ v

Complex Conjugate: Changes the sign of the imaginary part.

Example: If z = 3 + 2i, then its complex conjugate is:

  z̄ = 3 - 2i

Example - Inner Product of a Vector with Itself:

Let:

  v = [1 + i]
      [2    ]

Its conjugate is:

  v̄ = [1 - i]
       [2    ]

The inner product of v with itself is:

  ⟨v,v⟩ = (1-i)(1+i) + (2)(2)

Since:

  (1-i)(1+i) = 1 + i - i - i²
             = 1 + 1
             = 2

We get:

  ⟨v,v⟩ = 2 + 4 = 6

Thus, the squared length of the vector is 6, and its norm is:

  ||v|| = √6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

7. COMPLEX MATRICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A matrix whose entries are complex numbers can act on vectors in ℂⁿ.

Example:

  A = [1    i  ]
      [2  3 - i]

If:

  x = [1]
      [i]

Then multiplying Ax gives:

  Ax = [1    i  ] [1] = [1(1) + i(i)  ]
       [2  3 - i] [i]   [2(1) + (3-i)i]

First component:

  1(1) + i(i) = 1 + i² = 1 - 1 = 0

Second component:

  2(1) + (3-i)i = 2 + 3i - i²
                = 2 + 3i + 1
                = 3 + 3i

Therefore:

  Ax = [0      ]
       [3 + 3i]

This shows how complex matrices can transform complex vectors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

8. EIGENVALUES & EIGENVECTORS IN COMPLEX VECTOR SPACES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Complex vector spaces are especially important when studying eigenvalues and eigenvectors because some real matrices have eigenvalues that are complex numbers.

The eigenvalue equation is:

  A v = λ v

where λ may be real or complex.

Example - Rotation Matrix:

  A = [0  -1]
      [1   0]

This matrix represents a 90° rotation in the real plane. It does not have real eigenvalues, but it has complex eigenvalues:

  λ = i   and   λ = -i

This demonstrates why complex numbers become important when studying eigenvalues and eigenvectors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

9. APPLICATIONS OF COMPLEX VECTOR SPACES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Complex Vector Spaces have many practical applications:

  1. Electrical Engineering
     • Alternating current (AC) circuits
     • Voltage, impedance, and phase analysis

  2. Signal Processing
     • Signals represented using complex numbers
     • Fourier Transform analysis
     • Frequency analysis

  3. Quantum Mechanics & Quantum Computing
     • Quantum states as complex vectors
     • Quantum operations as complex matrices

  4. Physics
     • Wave functions
     • Quantum field theory

  5. Control Systems
     • Stability analysis
     • System modeling

  6. Telecommunications
     • Signal transmission
     • Modulation techniques

  7. Image Processing
     • Fourier domain filtering
     • Image transformations

  8. Differential Equations
     • Solving with complex eigenvalues
     • System analysis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10. REAL VS. COMPLEX VECTOR SPACES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REAL VECTOR SPACE                     COMPLEX VECTOR SPACE
---------------------                  ---------------------
Scalars are real numbers              Scalars are complex numbers
Uses ℝ                                Uses ℂ
Example: ℝ²                           Example: ℂ²
Vectors have real components          Vectors may have complex components
Ordinary dot product                  Complex inner product uses conjugation

Example:

  [2] ∈ ℝ²    vs.    [2 + i ] ∈ ℂ²
  [3]                [3 - 2i]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Complex Vector Space = Vector Space + Complex Scalars

Key concepts covered:

  ✓ Complex Numbers (a + bi)
  ✓ Complex Vector Spaces (ℂⁿ)
  ✓ Vector Addition with Complex Components
  ✓ Scalar Multiplication with Complex Scalars
  ✓ Basis of Complex Vector Spaces
  ✓ Complex Inner Product (using conjugation)
  ✓ Complex Matrices
  ✓ Eigenvalues & Eigenvectors in Complex Spaces
  ✓ Real vs. Complex Vector Spaces

Complex Vector Spaces extend ordinary Linear Algebra and provide the mathematical foundation for many advanced applications, particularly in quantum computing, electrical engineering, signal processing, telecommunications, and physics.
  `,
  examples: [
    "Complex number: z = 3 + 2i with real part 3 and imaginary part 2",
    "Vector in ℂ²: v = [2+i, 3-2i]ᵀ",
    "Vector addition: [1+2i, 3-i]ᵀ + [2-i, 1+4i]ᵀ = [3+i, 4+3i]ᵀ",
    "Scalar multiplication: (2+i)·[1+i, 2-i]ᵀ = [1+3i, 5]ᵀ",
    "Complex inner product: ⟨v,v⟩ = 6, norm = √6",
    "Complex matrix multiplication: A = [[1,i],[2,3-i]] times x = [1,i]ᵀ",
    "Find eigenvalues of a unitary matrix",
    "Rotation matrix A = [[0,-1],[1,0]] has complex eigenvalues λ = ±i",
    "Compute the conjugate transpose of a complex matrix.",
  ],
};

export default topic;