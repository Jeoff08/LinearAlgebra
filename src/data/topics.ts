// export type Topic = {
//   id: string;
//   title: string;
//   summary: string;
//   details: string;
//   examples: string[];
// };

// export const TOPICS: Topic[] = [
//   {
//     id: "foundations",
//     title: "Foundations & Prerequisites",
//     summary:
//       "Core arithmetic and algebra skills: expressions, real/complex numbers, coordinate geometry, functions, basic proof techniques and notation.",
//     details:
//       "Foundations & Prerequisites are the basic mathematical concepts and skills that students need to understand before studying Linear Algebra. They are called “foundations” because they serve as the building blocks for more advanced mathematical ideas. Linear Algebra involves equations, vectors, matrices, functions, and transformations, so having a good understanding of basic mathematics makes these topics much easier to learn.",
//     examples: [
//       "Simplify (2x+3)- (x-5) = x+8",
//       "Prove that the sum of two even integers is even.",
//     ],
//   },
//   {
//     id: "vectors",
//     title: "Vectors",
//     summary:
//       "Vectors, operations, dot and cross products, geometric interpretation, vector spaces and examples.",
//     details:
//       "Explore vector notation, operations, magnitude, direction, dot and cross products, and how these concepts form the basis of vector spaces and geometric reasoning.",
//     examples: [
//       "Compute v+ w for v=[1,2], w=[-3,4]",
//       "Find projection of u onto v.",
//     ],
//   },
//   {
//     id: "matrices",
//     title: "Matrices",
//     summary:
//       "Matrix notation, types, arithmetic, transpose and trace, and special properties.",
//     details:
//       "Learn how matrices are written, classified, and manipulated, including common matrix types and special properties like symmetry and identity structure.",
//     examples: ["Multiply 2x2 matrices", "Identify a symmetric matrix example."],
//   },
//   {
//     id: "systems",
//     title: "Systems of Linear Equations",
//     summary:
//       "Solving linear systems: Gaussian elimination, row operations, REF/RREF and solution classification.",
//     details:
//       "Solve systems of equations with row reduction, learn how pivot positions and free variables determine whether a system has one solution, none, or infinitely many.",
//     examples: [
//       "Solve by elimination: x+y=3, x- y=1",
//       "Identify free variables from RREF.",
//     ],
//   },
//   {
//     id: "inverses",
//     title: "Matrix Inverses",
//     summary:
//       "Definition, conditions for invertibility, methods (Gauss-Jordan, cofactors) and properties.",
//     details:
//       "Understand when a matrix has an inverse, how to calculate it, and how inverse matrices are used to solve systems and transform coordinates.",
//     examples: [
//       "Compute inverse of 2x2 [[a,b],[c,d]]",
//       "Use inverse to solve Ax=b when invertible.",
//     ],
//   },
//   {
//     id: "determinants",
//     title: "Determinants",
//     summary:
//       "How to compute determinants, properties, and applications to volume and invertibility.",
//     details:
//       "The determinant is a scalar value that reveals whether a matrix is invertible and how a linear transformation scales areas or volumes.",
//     examples: [
//       "det([[1,2],[3,4]]) = -2",
//       "Use determinant to check invertibility.",
//     ],
//   },
//   {
//     id: "rank",
//     title: "Rank",
//     summary:
//       "Row rank, column rank, rank-nullity relationship and interpretations.",
//     details:
//       "Rank tells us how many independent rows or columns a matrix has, and it connects directly to the dimensions of solution spaces through the rank-nullity theorem.",
//     examples: [
//       "Find rank by row reduction",
//       "Use rank to determine solution counts.",
//     ],
//   },
//   {
//     id: "independence-span",
//     title: "Linear Independence & Span",
//     summary:
//       "Linear combinations, span of sets, testing independence and bases.",
//     details:
//       "Learn how vector sets generate subspaces, how to test for linear independence, and how to choose bases to describe every vector in a space.",
//     examples: [
//       "Check if vectors are independent",
//       "Find span{[1,0],[0,1]} = R^2",
//     ],
//   },
//   {
//     id: "fundamental-subspaces",
//     title: "Fundamental Subspaces",
//     summary:
//       "Column, row, null and left-null spaces; bases for each and relationships between them.",
//     details:
//       "The four fundamental subspaces describe where a matrix maps vectors and where solutions reside, with bases that explain row, column, and null spaces together.",
//     examples: ["Compute nullspace of a matrix", "Find basis for column space."],
//   },
//   {
//     id: "linear-transformations",
//     title: "Linear Transformations",
//     summary:
//       "Definition, properties, kernels, ranges, and matrix representations of linear maps.",
//     details:
//       "Linear transformations preserve vector addition and scaling. Study their domains, codomains, kernels, ranges, and how to express them with matrices.",
//     examples: [
//       "Represent rotation in R^2 with a matrix",
//       "Find kernel of a projection.",
//     ],
//   },
//   {
//     id: "change-of-basis",
//     title: "Change of Basis",
//     summary:
//       "Coordinate vectors, transition matrices, similar matrices and coordinate transformations.",
//     details:
//       "Change-of-basis explains how the same vector looks different in different bases, and how transition matrices convert coordinates between systems.",
//     examples: [
//       "Change coords from basis B to standard basis",
//       "Compute transition matrix P.",
//     ],
//   },
//   {
//     id: "eigen",
//     title: "Eigenvalues & Eigenvectors",
//     summary:
//       "Characteristic polynomial, finding eigenvalues and eigenspaces, algebraic and geometric multiplicity.",
//     details:
//       "Eigenvalues and eigenvectors reveal how a matrix stretches or rotates space. This topic covers their calculation and multiplicity properties.",
//     examples: [
//       "Find eigenvalues of [[2,0],[0,3]]",
//       "Compute eigenvectors for each eigenvalue.",
//     ],
//   },
//   {
//     id: "diagonalization",
//     title: "Diagonalization",
//     summary:
//       "Diagonalizable matrices, eigenbasis, similarity transforms and applications to matrix powers.",
//     details:
//       "Diagonalization rewrites a matrix in a simpler eigenbasis so that powers and repeated transformations become easy to compute.",
//     examples: [
//       "Diagonalize a matrix with distinct eigenvalues",
//       "Compute A^10 via diagonalization.",
//     ],
//   },
//   {
//     id: "orthogonality",
//     title: "Orthogonality",
//     summary:
//       "Orthogonal and orthonormal sets, complements, orthogonal matrices, and Gram–Schmidt process.",
//     details:
//       "Orthogonality defines perpendicularity in vector spaces. Learn how orthogonal bases simplify projections and how Gram–Schmidt builds orthonormal sets.",
//     examples: [
//       "Apply Gram–Schmidt to two vectors",
//       "Verify orthonormality of a set.",
//     ],
//   },
//   {
//     id: "least-squares",
//     title: "Least Squares",
//     summary:
//       "Overdetermined systems, normal equations, projections, and regression basics.",
//     details:
//       "Least squares finds the best approximate solution when there are more equations than unknowns, using orthogonal projection and normal equations.",
//     examples: [
//       "Solve min||Ax-b|| via normal equations",
//       "Linear regression with two points.",
//     ],
//   },
//   {
//     id: "qr",
//     title: "QR Factorization",
//     summary:
//       "QR decomposition, relation to Gram–Schmidt, and solving least-squares problems.",
//     details:
//       "QR factorization decomposes a matrix into an orthogonal and upper triangular factor, which is useful for solving linear systems and least-squares problems.",
//     examples: ["Compute QR of a 2x2 matrix", "Use QR to solve least-squares."],
//   },
//   {
//     id: "lu",
//     title: "LU Decomposition",
//     summary:
//       "LU factorization methods (Doolittle, Crout), pivoting and solving triangular systems.",
//     details:
//       "LU decomposition expresses a matrix as lower and upper triangular matrices, making it faster to solve systems and understand matrix structure.",
//     examples: [
//       "Perform LU on a 3x3 matrix",
//       "Use LU to solve Ax=b efficiently.",
//     ],
//   },
//   {
//     id: "matrix-factorizations",
//     title: "Matrix Factorizations",
//     summary:
//       "Overview of common factorizations: LU, QR, Cholesky, SVD and eigen decompositions.",
//     details:
//       "This topic compares common matrix factorizations, showing how each decomposes a matrix for solving systems, optimization, and data analysis.",
//     examples: ["When to use Cholesky vs LU", "Compare QR and SVD outputs."],
//   },
//   {
//     id: "svd",
//     title: "Singular Value Decomposition (SVD)",
//     summary:
//       "SVD concepts, singular values/vectors, low-rank approximations and PCA connections.",
//     details:
//       "Singular Value Decomposition factors a matrix into orthogonal components and scaling values, enabling dimensionality reduction and data compression.",
//     examples: [
//       "Compute low-rank approx of a matrix",
//       "Use SVD for image compression demo.",
//     ],
//   },
//   {
//     id: "quadratic-forms",
//     title: "Quadratic Forms",
//     summary:
//       "Quadratic forms, definiteness, and Sylvester’s criterion for classifying matrices.",
//     details:
//       "This topic explains quadratic forms, their matrix representation, and how to classify positive/negative definiteness using Sylvester’s criterion.",
//     examples: ["Classify x^T A x for given A", "Apply Sylvester’s criterion."],
//   },
//   {
//     id: "inner-product",
//     title: "Inner Product Spaces",
//     summary:
//       "Inner products, norms, Cauchy–Schwarz, triangle inequality and orthogonality in abstract spaces.",
//     details:
//       "Inner product spaces generalize dot products to define length, distance, and orthogonality in abstract vector spaces.",
//     examples: [
//       "Verify Cauchy–Schwarz for vectors",
//       "Compute norm induced by inner product.",
//     ],
//   },
//   {
//     id: "complex-vector-spaces",
//     title: "Complex Vector Spaces",
//     summary:
//       "Complex numbers and vectors, Hermitian and unitary matrices, and complex inner products.",
//     details:
//       "This topic extends linear algebra into the complex domain, covering complex vector spaces, Hermitian structure, and unitary transformations.",
//     examples: [
//       "Find eigenvalues of a unitary matrix",
//       "Compute conjugate transpose.",
//     ],
//   },
//   {
//     id: "advanced-matrix-topics",
//     title: "Advanced Matrix Topics",
//     summary:
//       "Block matrices, matrix functions, norms, condition numbers and sparse matrix considerations.",
//     details:
//       "Advanced matrix topics include block structure, matrix functions, condition number analysis, and sparse matrix methods used in large problems.",
//     examples: [
//       "Partition a block matrix and compute inverse",
//       "Estimate condition number of a matrix.",
//     ],
//   },
//   {
//     id: "numerical-linear-algebra",
//     title: "Numerical Linear Algebra",
//     summary:
//       "Numerical stability, floating point errors, and numerical algorithms like iterative methods.",
//     details:
//       "Numerical linear algebra examines how arithmetic errors and conditioning affect solutions, and how iterative methods solve large systems efficiently.",
//     examples: [
//       "Explain round-off vs truncation error",
//       "Apply Jacobi iteration for Ax=b.",
//     ],
//   },
//   {
//     id: "optimization",
//     title: "Optimization",
//     summary:
//       "Linear programming basics: objective functions, constraints, simplex method and duality.",
//     details:
//       "Optimization uses linear algebra to model constrained problems and find optimal solutions with the simplex method and duality theory.",
//     examples: [
//       "Formulate a small LP and solve graphically",
//       "Set up simplex tableau.",
//     ],
//   },
//   {
//     id: "applications",
//     title: "Applications of Linear Algebra",
//     summary:
//       "Applications across CS, data science, engineering and mathematics including PCA, graphics, and control systems.",
//     details:
//       "Discover how linear algebra powers applications like graphics, machine learning, signal processing, and scientific modeling.",
//     examples: [
//       "Use PCA to reduce dataset dimensions",
//       "Describe matrix transforms used in graphics.",
//     ],
//   },
// ];

// export default TOPICS;
