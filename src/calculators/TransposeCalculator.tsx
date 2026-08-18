// components/TransposeCalculator.tsx
import React, { useState } from "react";
import PDFExport from "./PDFExport";

interface Step {
  title: string;
  description: string;
  matrix?: number[][];
  label?: string;
  explanation?: string;
}

const TransposeCalculator: React.FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 2, 3],
    [4, 5, 6],
  ]);
  const [result, setResult] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [showExplanation, setShowExplanation] = useState(true);

  const calculateTranspose = () => {
    const rows = matrix.length;
    const cols = matrix[0]?.length || 0;

    if (rows === 0 || cols === 0) {
      setResult("❌ Matrix is empty.");
      setSteps([]);
      return;
    }

    const stepsList: Step[] = [];

    // Step 1: Display original matrix
    stepsList.push({
      title: "Step 1: Original Matrix",
      description: `We start with the ${rows}×${cols} matrix A.`,
      matrix: matrix,
      label: "A =",
      explanation:
        "The original matrix is the input we want to transpose. The transpose operation will swap its rows with columns.",
    });

    // Step 2: Explain transpose operation
    stepsList.push({
      title: "Step 2: Transpose Operation",
      description:
        `The transpose of a matrix is obtained by swapping rows with columns.\n` +
        `A^T[i][j] = A[j][i]\n\n` +
        `The resulting matrix will be ${cols}×${rows}.`,
      explanation:
        "When we transpose a matrix, every element at position (i,j) moves to position (j,i). This means the first row becomes the first column, the second row becomes the second column, and so on.",
    });

    // Step 3: Show step-by-step transposition
    stepsList.push({
      title: "Step 3: Transpose Process",
      description: "Each element is moved from position (i,j) to (j,i):",
      explanation:
        "For each element in the original matrix, we record its position and the corresponding position it will occupy in the transposed matrix.",
    });

    // Show the mapping
    const mapping: string[] = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        mapping.push(
          `A[${i + 1}][${j + 1}] = ${matrix[i][j]} → A^T[${j + 1}][${i + 1}] = ${matrix[i][j]}`,
        );
      }
    }
    stepsList.push({
      title: "  Element Mapping",
      description: mapping.join("\n"),
      explanation:
        "This mapping shows exactly where each element from the original matrix goes in the transposed matrix. The position (i,j) in A becomes position (j,i) in A^T.",
    });

    // Step 4: Build the transposed matrix
    const transposed: number[][] = Array.from({ length: cols }, () =>
      Array(rows).fill(0),
    );
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        transposed[j][i] = matrix[i][j];
      }
    }

    stepsList.push({
      title: "Step 4: Transposed Matrix",
      description: `The transposed matrix A^T has size ${cols}×${rows}.`,
      matrix: transposed,
      label: "A^T =",
      explanation:
        "After moving all elements to their new positions, we get the transposed matrix. Notice how the dimensions have swapped from " +
        `${rows}×${cols} to ${cols}×${rows}.`,
    });

    // Step 5: Verify properties (if square matrix)
    if (rows === cols) {
      // Check if symmetric
      let isSymmetric = true;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (matrix[i][j] !== matrix[j][i]) {
            isSymmetric = false;
            break;
          }
        }
        if (!isSymmetric) break;
      }

      stepsList.push({
        title: "Step 5: Matrix Properties",
        description:
          `Since the matrix is ${rows}×${rows} (square), we can check special properties:\n` +
          `${isSymmetric ? "✅ The matrix is SYMMETRIC (A = A^T)" : "❌ The matrix is NOT symmetric (A ≠ A^T)"}\n` +
          `(A^T)^T = A is always true for any matrix.`,
        explanation:
          "For square matrices, we can check if they are symmetric (equal to their transpose). A symmetric matrix has the property A[i][j] = A[j][i] for all i,j.",
      });

      // Check if it's a symmetric matrix
      if (isSymmetric) {
        stepsList.push({
          title: "  Symmetric Matrix",
          description:
            "A symmetric matrix is equal to its transpose. This means the matrix is symmetric about its main diagonal.",
          explanation:
            "In a symmetric matrix, the elements on opposite sides of the main diagonal are equal. The transpose operation leaves a symmetric matrix unchanged.",
        });
      }

      // Check if it's a skew-symmetric matrix
      let isSkewSymmetric = true;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (matrix[i][j] !== -matrix[j][i]) {
            isSkewSymmetric = false;
            break;
          }
        }
        if (!isSkewSymmetric) break;
      }

      if (isSkewSymmetric) {
        stepsList.push({
          title: "  Skew-Symmetric Matrix",
          description:
            "A skew-symmetric matrix satisfies A = -A^T, meaning all diagonal elements are zero.",
          explanation:
            "A skew-symmetric matrix has zero diagonal elements and opposite values across the diagonal. For example, A[0][1] = -A[1][0].",
        });
      }
    }

    // Step 6: Final result with properties
    let finalDescription =
      `The transpose of A is:\n\n` +
      `A^T = \n${transposed.map((row) => row.map((v) => v.toFixed(2)).join(" ")).join("\n")}`;

    if (rows === cols) {
      // Calculate if it's symmetric
      let isSymmetric = true;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (matrix[i][j] !== matrix[j][i]) {
            isSymmetric = false;
            break;
          }
        }
        if (!isSymmetric) break;
      }

      if (isSymmetric) {
        finalDescription += `\n\n✅ This is a SYMMETRIC matrix (A = A^T)`;
      } else {
        finalDescription += `\n\n❌ This is NOT a symmetric matrix (A ≠ A^T)`;
      }
    } else {
      finalDescription += `\n\n📊 The matrix is ${rows}×${cols} (non-square). Transpose gives ${cols}×${rows}.`;
    }

    stepsList.push({
      title: "✅ Final Result",
      description: finalDescription,
      explanation:
        "The transpose operation is complete. The resulting matrix has all elements correctly positioned, and we have identified any special properties of the original matrix.",
    });

    setSteps(stepsList);

    // Set result for display
    const resultText =
      "=== TRANSPOSE CALCULATION STEPS ===\n\n" +
      stepsList
        .map(
          (step) =>
            `${step.title}\n${step.description}\n${step.matrix ? formatMatrix(step.matrix, step.label || "") : ""}\n`,
        )
        .join("\n");

    setResult(resultText);
  };

  const formatMatrix = (matrix: number[][], label: string): string => {
    if (!matrix || matrix.length === 0) return "";
    const formatted = matrix
      .map((row) => row.map((v) => v.toFixed(2)).join(" "))
      .join("\n");
    return `${label}\n${formatted}`;
  };

  const handleMatrixChange = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    const newM = [...matrix];
    if (value === "" || value === "-") {
      newM[rowIndex][colIndex] = 0;
    } else {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        newM[rowIndex][colIndex] = num;
      }
    }
    setMatrix(newM);
    setResult("");
    setSteps([]);
  };

  const addRow = () => {
    const cols = matrix[0]?.length || 2;
    setMatrix([...matrix, Array(cols).fill(0)]);
    setResult("");
    setSteps([]);
  };

  const addColumn = () => {
    setMatrix(matrix.map((row) => [...row, 0]));
    setResult("");
    setSteps([]);
  };

  const removeRow = () => {
    if (matrix.length > 1) {
      setMatrix(matrix.slice(0, -1));
      setResult("");
      setSteps([]);
    }
  };

  const removeColumn = () => {
    if ((matrix[0]?.length || 0) > 1) {
      setMatrix(matrix.map((row) => row.slice(0, -1)));
      setResult("");
      setSteps([]);
    }
  };

  const clearMatrix = () => {
    setMatrix(matrix.map((row) => row.map(() => 0)));
    setResult("");
    setSteps([]);
  };

  const renderMatrix = (matrix: number[][], label?: string) => {
    if (!matrix || matrix.length === 0) return null;
    return (
      <div className="mt-2">
        {label && <span className="font-mono text-blue-700">{label}</span>}
        <div className="inline-block mt-1 border border-blue-200 rounded overflow-hidden">
          {matrix.map((row, i) => (
            <div key={i} className="flex">
              {row.map((val, j) => (
                <div
                  key={j}
                  className="w-20 px-3 py-1.5 text-center font-mono text-sm border-r border-blue-200 last:border-0 bg-white"
                >
                  {val.toFixed(2)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">
            Enter your matrix:
          </h3>
          <span className="text-xs text-slate-500">
            {matrix.length}×{matrix[0]?.length || 0} matrix
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="border-collapse border border-slate-300">
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} className="border border-slate-300 p-1">
                      <input
                        type="text"
                        value={val === 0 ? "" : val}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (
                            inputValue === "" ||
                            inputValue === "-" ||
                            /^-?\d*\.?\d*$/.test(inputValue)
                          ) {
                            handleMatrixChange(i, j, inputValue);
                          }
                        }}
                        className="w-14 px-2 py-1 text-center focus:ring-2 focus:ring-indigo-500 outline-none rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={calculateTranspose}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Calculate Transpose
        </button>
        <button
          onClick={clearMatrix}
          className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear All
        </button>
        <button
          onClick={addRow}
          className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Row
        </button>
        <button
          onClick={addColumn}
          className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Column
        </button>
        {matrix.length > 1 && (
          <button
            onClick={removeRow}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Remove Row
          </button>
        )}
        {(matrix[0]?.length || 0) > 1 && (
          <button
            onClick={removeColumn}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Remove Column
          </button>
        )}
        {steps.length > 0 && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {showExplanation ? "Hide" : "Show"} Steps
          </button>
        )}
      </div>

      {steps.length > 0 && (
        <div className="space-y-4">
          {/* Result Summary */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-800">
                  Transpose Calculation Complete
                </p>
                <div className="mt-2 text-sm text-green-700">
                  The matrix has been transposed successfully.
                </div>
                <div className="mt-3 flex flex-wrap gap-4">
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">
                      Original Size
                    </span>
                    <span className="font-mono text-sm">
                      {matrix.length}×{matrix[0]?.length || 0}
                    </span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded border border-green-200">
                    <span className="text-xs text-green-600 block">
                      Transposed Size
                    </span>
                    <span className="font-mono text-sm">
                      {matrix[0]?.length || 0}×{matrix.length}
                    </span>
                  </div>
                  {matrix.length === matrix[0]?.length && (
                    <div className="bg-white px-3 py-2 rounded border border-green-200">
                      <span className="text-xs text-green-600 block">
                        Matrix Type
                      </span>
                      <span className="font-mono text-sm">
                        {steps.some(
                          (step) =>
                            step.title.includes("Symmetric") &&
                            step.description.includes("✅"),
                        )
                          ? "Symmetric"
                          : "Non-Symmetric"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 ml-auto">
                <PDFExport
                  title="Transpose Calculator (Aᵀ)"
                  data={`Original Size: ${matrix.length}×${matrix[0]?.length || 0}\nTransposed Size: ${matrix[0]?.length || 0}×${matrix.length}\n${result}`}
                  steps={steps.map(s => ({
                    step: `${s.title}\n${s.description}${s.matrix ? '\n' + s.matrix.map(r => `[${r.map(v => v.toFixed(4)).join(', ')}]`).join('\n') : ''}`,
                    explanation: s.explanation
                  }))}
                  inputs={`Matrix A (${matrix.length}×${matrix[0]?.length || 0}):\n${matrix.map(r => `[${r.join(', ')}]`).join('\n')}`}
                  fileName="matrix_transpose"
                />
              </div>
            </div>
          </div>

          {/* Step-by-Step Explanation */}
          {showExplanation && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h4 className="font-medium text-blue-800">
                  Step-by-Step Solution
                </h4>
                <span className="text-xs text-blue-600 ml-auto">
                  Transpose Operation
                </span>
              </div>

              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="border-b border-blue-200 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold text-sm mt-0.5">
                        {idx + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900 text-sm">
                          {step.title}
                        </p>
                        <div className="mt-1 text-sm text-blue-800 whitespace-pre-wrap">
                          {step.description}
                        </div>
                        {step.matrix && step.matrix.length > 0 && (
                          <div className="mt-2">
                            {renderMatrix(step.matrix, step.label)}
                          </div>
                        )}
                      </div>
                      {step.explanation && (
                        <div className="ml-4 flex-shrink-0">
                          <details className="group">
                            <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 font-medium px-3 py-1 rounded border border-blue-200 hover:bg-blue-100 transition">
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Explanation
                              </span>
                            </summary>
                            <div className="mt-2 p-3 bg-white rounded border border-blue-200 text-sm text-blue-800 max-w-xs">
                              {step.explanation}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <p className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          The transpose of a matrix is obtained by swapping rows with columns.
        </p>
        <p className="mt-1 text-xs">
          For square matrices, special properties like symmetry are
          automatically detected.
        </p>
      </div>
    </div>
  );
};

export default TransposeCalculator;
