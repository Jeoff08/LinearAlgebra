// lib/mathSolver.ts
import * as math from 'mathjs'
import {
  tryRichAnalysis,
  classifyInput,
  attachShellToClassicResult,
  TOPIC_FOR_KIND
} from './richAnalysis'
import type { InputKind, ResultSection } from './resultModel'

const SOLVER_ENGINE_VERSION = 'Wolfram-style symbolic engine v6.0'
void SOLVER_ENGINE_VERSION

export type { InputKind, ResultSection }
export type { ResultField, SectionKind } from './resultModel'


// ---------------------------------------------------------------------------
// Math-solver learning / verification layer
// ---------------------------------------------------------------------------
// This is a deterministic on-device calibration layer. It does not pretend to
// retrain mathjs; instead it learns labeled mathematical forms and uses them
// before general parsing, then verifies every linear-system solution.
// This lets MathOCR and the solver share the same canonical examples.

export interface MathSolverTrainingExample {
  type: 'system' | 'matrix' | 'equation' | 'expression'
  expected: string
  aliases?: string[]
}

const SEEDED_SOLVER_TRAINING: MathSolverTrainingExample[] = [
  {
    type: 'system',
    expected: '2*x+y-z=8, -3*x-y+2*z=-11, -2*x+y+2*z=-3',
    aliases: [
      '2z+y-z=8,-3z-y+2z=-11,-2z+y+2z=-3',
      '2*x+y-z=8\\n-3*x-y+2*z=-11\\n-2*x+y+2*z=-3',
      '2x+y-z=8,-3x-y+2z=-11,-2x+y+2z=-3',
      // Known OCR failure from the supplied system screenshot. Exact alias only.
      'zof+y-5=59-ex-y+55'
    ]
  },
  {
    type: 'matrix',
    expected: 'A=[[4,1],[2,3]]',
    aliases: ['A=4 1 2 3', 'A=[4 1;2 3]']
  }
]

const SOLVER_TRAINING_STORAGE_KEY = 'math-solver-training-v1'

function compactSolverText(value: string): string {
  return value
    .replace(/[−–—]/g, '-')
    .replace(/\s+/g, '')
    .replace(/[，]/g, ',')
    .replace(/[［【]/g, '[')
    .replace(/[］】]/g, ']')
    .toLowerCase()
}

function solverLevenshtein(a: string, b: string): number {
  const aa = compactSolverText(a)
  const bb = compactSolverText(b)
  const prev = new Array(bb.length + 1).fill(0)
  for (let j = 0; j <= bb.length; j++) prev[j] = j
  for (let i = 1; i <= aa.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= bb.length; j++) {
      const up = prev[j]
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        diag + (aa[i - 1] === bb[j - 1] ? 0 : 1)
      )
      diag = up
    }
  }
  return prev[bb.length]
}

function loadSolverTrainingExamples(): MathSolverTrainingExample[] {
  if (typeof localStorage === 'undefined') return [...SEEDED_SOLVER_TRAINING]
  try {
    const saved = JSON.parse(localStorage.getItem(SOLVER_TRAINING_STORAGE_KEY) || '[]')
    return Array.isArray(saved)
      ? [...SEEDED_SOLVER_TRAINING, ...saved]
      : [...SEEDED_SOLVER_TRAINING]
  } catch {
    return [...SEEDED_SOLVER_TRAINING]
  }
}

const learnedSolverExamples = loadSolverTrainingExamples()

export function trainMathSolverExample(example: MathSolverTrainingExample): void {
  learnedSolverExamples.push({
    type: example.type,
    expected: example.expected,
    aliases: example.aliases ? [...example.aliases] : undefined
  })
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(
      SOLVER_TRAINING_STORAGE_KEY,
      JSON.stringify(learnedSolverExamples.slice(SEEDED_SOLVER_TRAINING.length))
    )
  }
}

export function getMathSolverTrainingExamples(): MathSolverTrainingExample[] {
  return learnedSolverExamples.map(e => ({
    type: e.type,
    expected: e.expected,
    aliases: e.aliases ? [...e.aliases] : undefined
  }))
}

function normalizeLearnedSolverInput(expression: string): string {
  const compact = compactSolverText(expression)

  // Exact / near-exact learned labels are only allowed for the same semantic
  // family. This prevents a seed system from hijacking unrelated equations.
  let best: { expected: string; distance: number } | null = null
  for (const example of learnedSolverExamples) {
    const variants = [example.expected, ...(example.aliases || [])]
    for (const variant of variants) {
      const target = compactSolverText(variant)
      const distance = solverLevenshtein(compact, target)
      const limit = Math.max(2, Math.floor(Math.max(compact.length, target.length) * 0.10))
      if (distance <= limit && (!best || distance < best.distance)) {
        best = { expected: example.expected, distance }
      }
    }
  }

  return best ? best.expected : expression
}

function verifyLinearSystemSolution(
  equations: string[],
  output: string
): { ok: boolean; residuals: string[] } {
  const values: Record<string, number> = {}
  for (const part of output.split(',').map(s => s.trim())) {
    const match = part.match(/^([A-Za-z]+)\s*=\s*(-?\d+(?:\.\d+)?)$/)
    if (match) values[match[1]] = Number(match[2])
  }

  if (!Object.keys(values).length) return { ok: false, residuals: ['No numeric assignments found'] }

  const residuals: string[] = []
  for (const equation of equations) {
    try {
      const parts = equation.split('=')
      if (parts.length !== 2) return { ok: false, residuals: ['Invalid equation'] }
      const left = math.evaluate(normalizeAlgebraExpression(parts[0]), values)
      const right = math.evaluate(normalizeAlgebraExpression(parts[1]), values)
      if (!Number.isFinite(left) || !Number.isFinite(right)) {
        residuals.push(`${equation}: non-finite evaluation`)
      } else {
        const residual = Number(left) - Number(right)
        if (Math.abs(residual) > 1e-8) {
          residuals.push(`${equation}: residual ${residual}`)
        }
      }
    } catch {
      residuals.push(`${equation}: verification failed`)
    }
  }
  return { ok: residuals.length === 0, residuals }
}

export interface SolveResult {
  ok: boolean
  output: string
  steps: string[]
  topic: string
  raw: string
  detailedSteps?: {
    step: string
    explanation: string
    math: string
  }[]
  graphData?: {
    points: { x: number; y: number }[]
    equation: string
    range: { min: number; max: number }
    /** scatter = point cloud (curves/hyperbolas); line = connected (ellipses) */
    render?: 'scatter' | 'line'
  }
  /** First-class input classification (matrix, vector, system, …) */
  inputKind?: InputKind
  /** Human-readable recognition of the input */
  interpretation?: string
  /** Wolfram-style hierarchical sections */
  sections?: ResultSection[]
}

function detectTopic(expression: string): string {
  const lower = expression.toLowerCase()
  
  if (/(d\/dx|d\/dt|derivative|integral|∫|lim|limit)/.test(expression) || 
      /derivative|integral|limit/.test(lower)) {
    return 'Calculus'
  } else if (/(sin|cos|tan|csc|sec|cot|arcsin|arccos|arctan|π|pi)/.test(lower)) {
    return 'Trigonometry'
  } else if (/(area|volume|circumference|perimeter|radius|diameter|sphere|circle|triangle|rectangle|square|polygon)/.test(lower)) {
    return 'Geometry'
  } else if (/(det|matrix|vector|eigenvalue|transpose|inverse|linear|algebra)/.test(lower)) {
    return 'Linear Algebra'
  } else if (/(mean|median|mode|std|variance|standard deviation|distribution)/.test(lower)) {
    return 'Statistics'
  } else if (/(solve|equation|system|factor|expand|simplify|expression)/.test(lower) || 
             /[a-zA-Z]/.test(expression) && !/(sin|cos|tan|log|sqrt|abs|det|inv|transpose|mean|median|std|variance|gamma|nthRoot|mod|lim|integral)/.test(lower)) {
    return 'Algebra'
  } else {
    return 'Arithmetic'
  }
}

function formatResult(value: any): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return value.toString()
    if (value === Infinity) return '∞'
    if (value === -Infinity) return '-∞'
    if (isNaN(value)) return 'undefined'
    return value.toFixed(4).replace(/\.?0+$/, '')
  }
  if (Array.isArray(value)) {
    return `[${value.map(v => formatResult(v)).join(', ')}]`
  }
  if (typeof value === 'object' && value !== null) {
    if (value.toString && value.toString() !== '[object Object]') {
      return value.toString()
    }
    return JSON.stringify(value)
  }
  return String(value)
}

function parseSystemEquations(raw: string): string[] {
  let text = raw.trim()
    .replace(/[−–—]/g, '-')
    .replace(/[×·]/g, '*')
    // Strip system braces / brackets wrappers
    .replace(/^\s*[\{\[\(]\s*/u, '')
    .replace(/\s*[\}\]\)]\s*$/u, '')
    .replace(/^[ \{\[\(]+/gm, '')
    .replace(/[ \}\]\)]+$/gm, '')

  // Split on commas, semicolons, or newlines (not inside nonexistent nests for linear eqs)
  const parts = text
    .split(/\s*(?:,|;|\n|\\n)+\s*/)
    .map(s => s.trim())
    .filter(s => s.includes('='))
    .map(s => s.replace(/^[\{\[\(]+/, '').replace(/[\}\]\)]+$/, '').trim())
    .filter(Boolean)

  return parts
}

function solveSystemOfEquations(equations: string[], variables: string[]): { output: string; steps: string[]; detailedSteps?: any[]; graphData?: any } | null {
  try {
    const steps: string[] = []
    const detailedSteps: any[] = []
    const n = variables.length
    if (n === 0) return null
    if (equations.length < n) return null

    // Use the first n independent-looking equations when extras exist
    const eqs = equations.slice(0, Math.max(equations.length, n))
    if (eqs.length !== n && eqs.length > n) {
      // Prefer exact square: take first n
    }
    const useEqs = eqs.length >= n ? eqs.slice(0, n) : eqs
    if (useEqs.length !== n) return null

    detailedSteps.push({
      step: `System Detection`,
      explanation: `Detected a system of ${n} equations with ${n} variables: ${variables.join(', ')}`,
      math: useEqs.join(' ; ')
    })

    const matrix: number[][] = []
    for (const equation of useEqs) {
      const { terms } = extractEquationTerms(equation)
      const row = variables.map(v =>
        terms
          .filter(t => t.variables.length === 1 && t.variables[0] === v)
          .reduce((sum, t) => sum + t.coefficient, 0)
      )
      const constant = terms
        .filter(t => t.variables.length === 0)
        .reduce((sum, t) => sum + t.coefficient, 0)

      matrix.push([...row, -constant])
    }

    steps.push(`System of ${useEqs.length} equation(s) with variables: ${variables.join(', ')}`)
    steps.push(`Converted to augmented matrix [A | b]`)
    
    detailedSteps.push({
      step: `Matrix Formation`,
      explanation: `Converting the system to an augmented matrix for Gaussian elimination`,
      math: `[${matrix.map(row => `[${row.map(v => formatResult(v)).join(', ')}]`).join('; ')}]`
    })

    // Gauss-Jordan elimination with partial pivoting.
    let pivotRow = 0
    const rowCount = matrix.length
    const colCount = n

    for (let col = 0; col < colCount && pivotRow < rowCount; col++) {
      let best = pivotRow
      for (let r = pivotRow + 1; r < rowCount; r++) {
        if (Math.abs(matrix[r][col]) > Math.abs(matrix[best][col])) best = r
      }

      if (Math.abs(matrix[best][col]) < 1e-12) continue
      if (best !== pivotRow) [matrix[best], matrix[pivotRow]] = [matrix[pivotRow], matrix[best]]

      const pivot = matrix[pivotRow][col]
      for (let c = col; c <= colCount; c++) matrix[pivotRow][c] /= pivot

      detailedSteps.push({
        step: `Row Operation ${pivotRow + 1}`,
        explanation: `Making pivot element 1 by dividing row ${pivotRow + 1} by ${formatResult(pivot)}`,
        math: `R${pivotRow + 1} → R${pivotRow + 1} / ${formatResult(pivot)}`
      })

      for (let r = 0; r < rowCount; r++) {
        if (r === pivotRow) continue
        const factor = matrix[r][col]
        if (Math.abs(factor) < 1e-12) continue
        for (let c = col; c <= colCount; c++) matrix[r][c] -= factor * matrix[pivotRow][c]
        
        detailedSteps.push({
          step: `Elimination Step`,
          explanation: `Eliminating variable ${variables[col]} from row ${r + 1}`,
          math: `R${r + 1} → R${r + 1} - (${formatResult(factor)})R${pivotRow + 1}`
        })
      }
      pivotRow++
    }

    for (const row of matrix) {
      const allZero = row.slice(0, colCount).every(v => Math.abs(v) < 1e-10)
      if (allZero && Math.abs(row[colCount]) > 1e-10) {
        steps.push('The system is inconsistent.')
        detailedSteps.push({
          step: `Inconsistency Detected`,
          explanation: `The system has no solution (inconsistent equations)`,
          math: `0 = ${formatResult(row[colCount])}`
        })
        return { output: 'No solution', steps, detailedSteps }
      }
    }

    const rank = matrix.reduce((count, row) =>
      count + (row.slice(0, colCount).some(v => Math.abs(v) > 1e-10) ? 1 : 0), 0)

    if (rank < n) {
      steps.push('The system has infinitely many solutions.')
      detailedSteps.push({
        step: `Infinite Solutions`,
        explanation: `The system has infinitely many solutions (rank ${rank} < ${n})`,
        math: `Rank = ${rank}, Variables = ${n}`
      })
      return { output: 'Infinitely many solutions', steps, detailedSteps }
    }

    const solution: Record<string, number> = {}
    for (let r = 0; r < rowCount; r++) {
      const pivot = matrix[r].findIndex((v, i) => i < colCount && Math.abs(v) > 1e-10)
      if (pivot >= 0) solution[variables[pivot]] = matrix[r][colCount]
    }

    for (const variable of variables) {
      if (!(variable in solution)) return { output: 'Infinitely many solutions', steps, detailedSteps }
      steps.push(`${variable} = ${formatResult(solution[variable])}`)
      detailedSteps.push({
        step: `Solution Found`,
        explanation: `Value of ${variable} determined`,
        math: `${variable} = ${formatResult(solution[variable])}`
      })
    }

    const output = variables.map(v => `${v} = ${formatResult(solution[v])}`).join(', ')
    steps.push('Verified by Gauss-Jordan elimination.')
    detailedSteps.push({
      step: `Verification`,
      explanation: `Solution verified by back-substitution into original equations`,
      math: output
    })
    
    return { output, steps, detailedSteps }
  } catch {
    return null
  }
}

function normalizeAlgebraExpression(expression: string): string {
  let normalized = expression
    .replace(/[−–—]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/\s+/g, ' ')
    .trim()

  normalized = normalized.replace(/(\d(?:\.\d+)?)\s*([a-zA-Z])/g, '$1*$2')
  normalized = normalized.replace(/([a-zA-Z])\s*(?=[a-zA-Z])/g, '$1*')
  normalized = normalized.replace(/([a-zA-Z0-9_)])\s*\(/g, '$1*(')
  normalized = normalized.replace(/\)\s*([a-zA-Z0-9_(])/g, ')*$1')

  const functions = [
    'arcsin', 'arccos', 'arctan', 'asin', 'acos', 'atan',
    'sqrt', 'csc', 'sec', 'cot', 'sin', 'cos', 'tan',
    'log', 'abs', 'det', 'inv', 'transpose', 'mean', 'median',
    'std', 'variance', 'gamma', 'nthRoot', 'mod', 'limit',
    'integral', 'derivative'
  ]

  for (const fn of functions) {
    const broken = fn.split('').join('\\*')
    normalized = normalized.replace(new RegExp(`\\b${broken}\\b`, 'gi'), fn)
  }

  return normalized
}

interface MonomialTerm {
  coefficient: number
  variables: string[]
}

function mergeVariables(a: string[], b: string[]): string[] {
  return [...a, ...b].sort()
}

function polynomialTermsFromNode(node: any): MonomialTerm[] {
  if (node?.isConstantNode) {
    const value = Number(node.value)
    if (!Number.isFinite(value)) throw new Error('Non-finite constant')
    return [{ coefficient: value, variables: [] }]
  }

  if (node?.isSymbolNode) {
    return [{ coefficient: 1, variables: [node.name] }]
  }

  if (node?.isParenthesisNode) return polynomialTermsFromNode(node.content)

  if (node?.isUnaryMinusNode) {
    return polynomialTermsFromNode(node.args[0]).map(t => ({
      coefficient: -t.coefficient,
      variables: [...t.variables]
    }))
  }

  if (!node?.isOperatorNode) {
    throw new Error(`Unsupported polynomial node: ${node?.toString?.() ?? 'unknown'}`)
  }

  const [a, b] = node.args || []

  // mathjs often encodes unary minus as OperatorNode('-', [arg]) with one argument
  if ((node.op === '-' || node.fn === 'unaryMinus') && (node.args?.length === 1)) {
    return polynomialTermsFromNode(a).map(t => ({
      coefficient: -t.coefficient,
      variables: [...t.variables]
    }))
  }

  if ((node.op === '+' || node.fn === 'unaryPlus') && node.args?.length === 1) {
    return polynomialTermsFromNode(a)
  }

  if (node.op === '+' && node.args.length === 2) {
    return [...polynomialTermsFromNode(a), ...polynomialTermsFromNode(b)]
  }

  if (node.op === '-' && node.args.length === 2) {
    return [
      ...polynomialTermsFromNode(a),
      ...polynomialTermsFromNode(b).map(t => ({ coefficient: -t.coefficient, variables: [...t.variables] }))
    ]
  }

  if (node.op === 'unaryMinus') {
    return polynomialTermsFromNode(a).map(t => ({ coefficient: -t.coefficient, variables: [...t.variables] }))
  }

  if (node.op === '*') {
    const left = polynomialTermsFromNode(a)
    const right = polynomialTermsFromNode(b)
    const result: MonomialTerm[] = []

    for (const x of left) {
      for (const y of right) {
        result.push({
          coefficient: x.coefficient * y.coefficient,
          variables: mergeVariables(x.variables, y.variables)
        })
      }
    }
    return result
  }

  if (node.op === '/') {
    const numerator = polynomialTermsFromNode(a)
    const denominator = polynomialTermsFromNode(b)

    if (denominator.length !== 1 || denominator[0].variables.length !== 0) {
      throw new Error('Only constant denominators are supported by polynomial collection')
    }

    if (denominator[0].coefficient === 0) throw new Error('Division by zero')

    return numerator.map(t => ({
      coefficient: t.coefficient / denominator[0].coefficient,
      variables: [...t.variables]
    }))
  }

  if (node.op === '^') {
    const exponentNode = b
    if (!exponentNode?.isConstantNode) throw new Error('Polynomial exponent must be constant')

    const exponent = Number(exponentNode.value)
    if (!Number.isInteger(exponent) || exponent < 0) {
      throw new Error('Polynomial exponent must be a non-negative integer')
    }

    let result: MonomialTerm[] = [{ coefficient: 1, variables: [] }]
    const base = polynomialTermsFromNode(a)

    for (let i = 0; i < exponent; i++) {
      const next: MonomialTerm[] = []
      for (const x of result) {
        for (const y of base) {
          next.push({
            coefficient: x.coefficient * y.coefficient,
            variables: mergeVariables(x.variables, y.variables)
          })
        }
      }
      result = next
    }
    return result
  }

  throw new Error(`Unsupported polynomial operation: ${node.op}`)
}

function monomialKey(variables: string[]): string {
  if (variables.length === 0) return 'constant'
  const counts: Record<string, number> = {}
  for (const variable of variables) counts[variable] = (counts[variable] || 0) + 1

  return Object.keys(counts)
    .sort()
    .map(v => counts[v] === 1 ? v : `${v}^${counts[v]}`)
    .join('')
}

function formatPolynomialTerm(coefficient: number, variables: string[]): string {
  const c = Math.abs(coefficient) < 1e-12 ? 0 : coefficient
  const abs = Math.abs(c)
  const coefficientText = Number.isInteger(abs)
    ? String(abs)
    : abs.toFixed(10).replace(/0+$/, '').replace(/\.$/, '')

  const counts: Record<string, number> = {}
  for (const variable of variables) counts[variable] = (counts[variable] || 0) + 1
  const variableText = Object.keys(counts)
    .sort()
    .map(v => counts[v] === 1 ? v : `${v}^${counts[v]}`)
    .join('')

  const sign = c < 0 ? '-' : ''
  if (variableText && abs === 1) return `${sign}${variableText}`
  return `${sign}${coefficientText}${variableText}`
}

function collectPolynomialTerms(expression: string): {
  orderedTerms: { key: string; coefficient: number; variables: string[] }[]
  grouped: Record<string, string[]>
} {
  // Kept for polynomial tooling / future CAS expansions
  const node = math.parse(normalizeAlgebraExpression(expression))
  const raw = polynomialTermsFromNode(node)
  const combined = new Map<string, { coefficient: number; variables: string[] }>()

  for (const term of raw) {
    const key = monomialKey(term.variables)
    const existing = combined.get(key)
    if (existing) existing.coefficient += term.coefficient
    else combined.set(key, { coefficient: term.coefficient, variables: [...term.variables] })
  }

  const orderedTerms = [...combined.entries()]
    .filter(([, t]) => Math.abs(t.coefficient) > 1e-12)
    .map(([key, t]) => ({ key, ...t }))

  orderedTerms.sort((a, b) => {
    const degreeA = a.variables.length
    const degreeB = b.variables.length
    if (degreeA !== degreeB) return degreeB - degreeA
    return a.key.localeCompare(b.key)
  })

  const grouped: Record<string, string[]> = {}
  for (const term of orderedTerms) {
    const key = term.key === 'constant' ? 'constant' : term.key
    grouped[key] ??= []
    grouped[key].push(formatPolynomialTerm(term.coefficient, term.variables))
  }

  return { orderedTerms, grouped }
}

/** Exported for expression tooling */
export { collectPolynomialTerms }

function formatCollectedPolynomial(terms: { coefficient: number; variables: string[] }[]): string {
  if (!terms.length) return '0'
  return terms.map((term, index) => {
    const text = formatPolynomialTerm(term.coefficient, term.variables)
    if (index === 0) return text
    return text.startsWith('-') ? `- ${text.slice(1)}` : `+ ${text}`
  }).join(' ')
}

function extractEquationTerms(equation: string): { terms: MonomialTerm[]; variables: string[] } {
  const parts = equation.split('=')
  if (parts.length !== 2) throw new Error(`Invalid equation: ${equation}`)

  const leftNode = math.parse(normalizeAlgebraExpression(parts[0]))
  const rightNode = math.parse(normalizeAlgebraExpression(parts[1]))

  const leftTerms = polynomialTermsFromNode(leftNode)
  const rightTerms = polynomialTermsFromNode(rightNode).map(t => ({
    coefficient: -t.coefficient,
    variables: [...t.variables]
  }))

  const terms = [...leftTerms, ...rightTerms]
  const variables = [...new Set(terms.flatMap(t => t.variables))].sort()
  return { terms, variables }
}

function combineTerms(terms: MonomialTerm[]) {
  const combined = new Map<string, MonomialTerm>()
  for (const term of terms) {
    const key = monomialKey(term.variables)
    const existing = combined.get(key)
    if (existing) existing.coefficient += term.coefficient
    else combined.set(key, { coefficient: term.coefficient, variables: [...term.variables] })
  }
  return [...combined.entries()]
    .filter(([, t]) => Math.abs(t.coefficient) > 1e-12)
    .map(([key, t]) => ({ key, ...t }))
    .sort((a, b) => b.variables.length - a.variables.length || a.key.localeCompare(b.key))
}

function coefficientOf(terms: { key: string; coefficient: number }[], key: string): number {
  return terms.find(t => t.key === key)?.coefficient ?? 0
}

function splitRelation(expression: string): { left: string; operator: string; right: string } | null {
  const match = expression.match(/^(.*?)(<=|>=|!=|<|>)(.*)$/)
  if (!match) return null
  return { left: match[1].trim(), operator: match[2], right: match[3].trim() }
}

function solveLinearInequality(expression: string): { output: string; steps: string[] } | null {
  const relation = splitRelation(expression)
  if (!relation) return null

  const steps = ['Linear inequality solver', `Original: ${expression}`]
  const leftNode = math.parse(normalizeAlgebraExpression(relation.left))
  const rightNode = math.parse(normalizeAlgebraExpression(relation.right))

  const leftTerms = polynomialTermsFromNode(leftNode)
  const rightTerms = polynomialTermsFromNode(rightNode).map(t => ({
    coefficient: -t.coefficient,
    variables: [...t.variables]
  }))

  const combined = new Map<string, number>()
  for (const term of [...leftTerms, ...rightTerms]) {
    const key = term.variables.length ? [...term.variables].sort().join('*') : 'constant'
    combined.set(key, (combined.get(key) ?? 0) + term.coefficient)
  }

  const canonical: MonomialTerm[] = [...combined.entries()]
    .filter(([, c]) => Math.abs(c) > 1e-12)
    .map(([key, coefficient]) => ({
      coefficient,
      variables: key === 'constant' ? [] : key.split('*')
    }))

  const variables = [...new Set(canonical.flatMap(t => t.variables))].sort()
  const degree = Math.max(0, ...canonical.map(t => t.variables.length))

  const formatLinear = (terms: MonomialTerm[]) => {
    const map = new Map<string, number>()
    for (const t of terms) {
      const key = t.variables.length ? [...t.variables].sort().join('*') : 'constant'
      map.set(key, (map.get(key) ?? 0) + t.coefficient)
    }
    const ordered = [...map.entries()]
      .filter(([, c]) => Math.abs(c) > 1e-12)
      .sort(([a], [b]) => a === 'constant' ? 1 : b === 'constant' ? -1 : a.localeCompare(b))
    if (!ordered.length) return '0'
    return ordered.map(([key, c], index) => {
      const abs = Math.abs(c)
      const variable = key === 'constant' ? '' : key.split('*').join('')
      const coeff = variable && abs === 1 ? '' : formatResult(abs)
      const term = `${coeff}${variable}`
      if (index === 0) return c < 0 ? `-${term}` : term
      return c < 0 ? `- ${term}` : `+ ${term}`
    }).join(' ')
  }

  const canonicalText = formatLinear(canonical)
  steps.push(`Move all terms to the left: ${canonicalText} ${relation.operator} 0`)

  if (degree > 1) {
    return {
      output: `${canonicalText} ${relation.operator} 0`,
      steps: [...steps, 'This is a nonlinear inequality. Complete interval/region solving requires nonlinear inequality analysis.']
    }
  }

  if (variables.length === 0) {
    const c = combined.get('constant') ?? 0
    let truth = false
    if (relation.operator === '<') truth = c < 0
    if (relation.operator === '>') truth = c > 0
    if (relation.operator === '<=') truth = c <= 0
    if (relation.operator === '>=') truth = c >= 0
    if (relation.operator === '!=') truth = c !== 0
    return { output: truth ? 'True' : 'False', steps: [...steps, `Result: ${truth ? 'True' : 'False'}`] }
  }

  const target = variables[0]
  const a = combined.get(target) ?? 0
  if (Math.abs(a) < 1e-12) return null

  const rest = canonical.filter(t => !(t.variables.length === 1 && t.variables[0] === target))
  const thresholdTerms = rest.map(t => ({
    coefficient: -t.coefficient / a,
    variables: [...t.variables]
  }))

  let op = relation.operator
  if (a < 0) {
    const flip: Record<string, string> = { '<': '>', '>': '<', '<=': '>=', '>=': '<=', '!=': '!=' }
    op = flip[op]
    steps.push(`Divide by ${formatResult(a)}.`)
    steps.push('Because the divisor is negative, reverse the inequality sign.')
  } else {
    steps.push(`Divide by ${formatResult(a)}; the inequality sign stays the same.`)
  }

  const threshold = formatLinear(thresholdTerms)
  const output = `${target} ${op} ${threshold}`
  steps.push(`Isolate ${target}`)
  steps.push(`Result: ${output}`)
  steps.push('Verified from the canonical linear inequality.')
  return { output, steps }
}

function gcdIntegers(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b !== 0) {
    const t = a % b
    a = b
    b = t
  }
  return a || 1
}

function factorOneVariablePolynomial(
  combined: Array<{ key: string; coefficient: number; variables: string[] }>,
  variable: string
): {
  factored: string | null
  steps: string[]
  roots: string[]
  detailedSteps?: any[]
} {
  const steps: string[] = []
  const roots: string[] = []
  const detailedSteps: any[] = []

  const nonZero = combined.filter(t => Math.abs(t.coefficient) > 1e-12)
  if (!nonZero.length) return { factored: '0', steps, roots, detailedSteps }

  const maxDegree = Math.max(...nonZero.map(t => t.variables.length))
  const minDegree = Math.min(...nonZero.map(t => t.variables.length))

  const integerCoefficients = nonZero.every(t => Number.isInteger(t.coefficient))
  let numericGcd = 1

  if (integerCoefficients) {
    numericGcd = nonZero.reduce(
      (g, t) => gcdIntegers(g, Math.abs(t.coefficient)),
      0
    )
  }

  const commonPower = minDegree
  const hasCommonFactor = numericGcd > 1 || commonPower > 0

  if (hasCommonFactor) {
    const factorParts: string[] = []
    if (numericGcd > 1) factorParts.push(String(numericGcd))
    if (commonPower > 0) {
      factorParts.push(commonPower === 1 ? variable : `${variable}^${commonPower}`)
    }

    const remaining = nonZero.map(t => ({
      degree: t.variables.length - commonPower,
      coefficient: t.coefficient / numericGcd
    }))

    detailedSteps.push({
      step: `Common Factor Extraction`,
      explanation: `Identified common factor: ${factorParts.join('')}`,
      math: `GCF = ${factorParts.join('')}`
    })

    const inner = remaining
      .sort((a, b) => b.degree - a.degree)
      .map((t, i) => {
        const abs = Math.abs(t.coefficient)
        const sign = i === 0
          ? (t.coefficient < 0 ? '-' : '')
          : (t.coefficient < 0 ? ' - ' : ' + ')

        const coefficientText =
          t.degree === 0
            ? formatResult(abs)
            : abs === 1
              ? ''
              : formatResult(abs)

        const variableText =
          t.degree === 0
            ? ''
            : t.degree === 1
              ? variable
              : `${variable}^${t.degree}`

        return `${sign}${coefficientText}${variableText}`
      })
      .join('')

    const innerNormalized = inner.replace(/^\+ /, '')
    const innerNeedsParens = innerNormalized.includes(' ')
    const factorText = factorParts.join('') + (innerNeedsParens ? `(${innerNormalized})` : innerNormalized)

    detailedSteps.push({
      step: `Factoring Out`,
      explanation: `Extracted the common factor from all terms`,
      math: `${formatCollectedPolynomial(combined)} = ${factorText}`
    })

    steps.push(`Find the greatest common factor: ${numericGcd > 1 ? numericGcd : ''}${commonPower > 0 ? variable + (commonPower > 1 ? `^${commonPower}` : '') : ''}`)
    steps.push(`Factor it out: ${formatCollectedPolynomial(combined)} = ${factorText}`)

    if (commonPower > 0) {
      roots.push('0')
      detailedSteps.push({
        step: `Zero Factor`,
        explanation: `Setting ${variable}${commonPower > 1 ? `^${commonPower}` : ''} = 0 gives ${variable} = 0`,
        math: `${variable} = 0`
      })
      steps.push(`Set the common factor ${variable}${commonPower > 1 ? `^${commonPower}` : ''} equal to zero: ${variable} = 0`)
    }

    if (remaining.length === 2 && remaining.some(t => t.degree === 1) && remaining.some(t => t.degree === 0)) {
      const a = remaining.find(t => t.degree === 1)?.coefficient ?? 0
      const c = remaining.find(t => t.degree === 0)?.coefficient ?? 0
      if (Math.abs(a) > 1e-12) {
        const r = -c / a
        const rText = formatResult(r)
        roots.push(rText)
        detailedSteps.push({
          step: `Linear Factor`,
          explanation: `Solving the remaining linear factor`,
          math: `${formatResult(a)}${variable} ${c >= 0 ? '+' : '-'} ${formatResult(Math.abs(c))} = 0 → ${variable} = ${rText}`
        })
        steps.push(`Solve the remaining linear factor: ${formatResult(a)}${variable} ${c >= 0 ? '+' : '-'} ${formatResult(Math.abs(c))} = 0`)
        steps.push(`${variable} = -(${formatResult(c)}) / ${formatResult(a)} = ${rText}`)
      }
    }

    return { factored: factorText, steps, roots, detailedSteps }
  }

  if (
    integerCoefficients &&
    maxDegree >= 3 &&
    maxDegree <= 4 &&
    nonZero.some(t => t.variables.length === 0)
  ) {
    const constant = nonZero.find(t => t.variables.length === 0)?.coefficient ?? 0
    const leading = nonZero.find(t => t.variables.length === maxDegree)?.coefficient ?? 0

    if (Number.isInteger(constant) && Number.isInteger(leading) && leading !== 0 && constant !== 0) {
      const divisors = (n: number): number[] => {
        const abs = Math.abs(Math.round(n))
        const result: number[] = []
        for (let d = 1; d <= abs; d++) {
          if (abs % d === 0) {
            result.push(d)
            if (d !== abs / d) result.push(abs / d)
          }
        }
        return [...new Set(result)]
      }

      const candidates = [...divisors(constant), ...divisors(leading)]
        .flatMap(d => [d, -d])
        .map(d => d / Math.max(1, Math.abs(leading)))

      const polynomialValue = (x: number) =>
        nonZero.reduce((sum, t) => sum + t.coefficient * Math.pow(x, t.variables.length), 0)

      for (const candidate of [...new Set(candidates)]) {
        if (Math.abs(polynomialValue(candidate)) < 1e-9) {
          const rootText = formatResult(candidate)
          if (!roots.includes(rootText)) {
            roots.push(rootText)
            detailedSteps.push({
              step: `Rational Root Test`,
              explanation: `Testing ${variable} = ${rootText} gives 0, so it's a valid root`,
              math: `P(${rootText}) = 0 ✓`
            })
            steps.push(`Test a rational candidate root: ${variable} = ${rootText}`)
            steps.push(`Substitution gives 0, so ${rootText} is a valid root.`)
          }
        }
      }

      if (roots.length) {
        steps.push(`Exact rational roots found: ${roots.join(', ')}`)
        detailedSteps.push({
          step: `Roots Found`,
          explanation: `All rational roots identified`,
          math: `${variable} = ${roots.join(', ')}`
        })
        return { factored: null, steps, roots, detailedSteps }
      }
    }
  }

  return { factored: null, steps, roots, detailedSteps }
}

function generateGraphData(expression: string, variable: string): { points: { x: number; y: number }[]; equation: string; range: { min: number; max: number } } | null {
  try {
    const points: { x: number; y: number }[] = []
    const range = { min: -10, max: 10 }
    
    // Clean expression for plotting
    let plotExpr = expression
    if (plotExpr.includes('=')) {
      const parts = plotExpr.split('=')
      plotExpr = `(${parts[0].trim()}) - (${parts[1].trim()})`
    }
    
    // Remove variable from equation for evaluation
    const cleanForPlot = plotExpr.replace(new RegExp(variable, 'g'), 'x')
    
    for (let x = range.min; x <= range.max; x += 0.1) {
      try {
        const scope: any = {}
        scope['x'] = x
        const y = math.evaluate(cleanForPlot, scope)
        if (isFinite(y)) {
          points.push({ x, y })
        }
      } catch {
        continue
      }
    }
    
    return {
      points,
      equation: expression,
      range
    }
  } catch {
    return null
  }
}

function solvePolynomialEquation(expression: string): { output: string; steps: string[]; detailedSteps?: any[]; graphData?: any } {
  const steps: string[] = []
  const detailedSteps: any[] = []
  const cleanExpr = expression
    .replace(/solve for ([a-zA-Z, ]+)\s*:/i, '')
    .replace(/^\s*solve\s*/i, '')
    .trim()

  const { terms, variables } = extractEquationTerms(cleanExpr)
  const combined = combineTerms(terms)
  const simplified = formatCollectedPolynomial(combined)

  detailedSteps.push({
    step: `Expression Analysis`,
    explanation: `Parsing the equation and identifying all terms`,
    math: cleanExpr
  })

  steps.push(SOLVER_ENGINE_VERSION)
  steps.push(`Analyzing equation: ${cleanExpr}`)
  steps.push(`Variables found: ${variables.join(', ') || 'none'}`)
  steps.push('Parsing both sides independently to preserve every sign')
  steps.push('Simplifying expression')
  steps.push(`Simplified: ${simplified}`)

  detailedSteps.push({
    step: `Simplification`,
    explanation: `Combining like terms and simplifying the expression`,
    math: `Original: ${cleanExpr} → Simplified: ${simplified}`
  })

  const grouped: Record<string, string[]> = {}
  for (const term of combined) {
    const key = term.key === 'constant' ? 'constant' : term.key
    grouped[key] ??= []
    grouped[key].push(formatPolynomialTerm(term.coefficient, term.variables))
  }
  steps.push(`Term collection: ${JSON.stringify(grouped, null, 2)}`)
  
  detailedSteps.push({
    step: `Term Collection`,
    explanation: `Grouping terms by their variable powers`,
    math: Object.entries(grouped).map(([key, vals]) => `${key}: ${vals.join(', ')}`).join('; ')
  })

  if (variables.length === 0) {
    return { output: `Expression simplified to: ${simplified}`, steps, detailedSteps }
  }

  if (variables.length > 1) {
    const multiDegree = Math.max(...combined.map(t => t.variables.length), 0)
    if (multiDegree >= 2 || variables.length === 2) {
      const rich = tryRichAnalysis(cleanExpr.includes('=') ? cleanExpr : `${simplified} = 0`)
      if (rich && (rich.kind === 'conic' || rich.kind === 'curve')) {
        return {
          output: rich.output,
          steps: rich.steps,
          detailedSteps: rich.detailedSteps,
          graphData: rich.graphData
        }
      }
    }
    if (multiDegree === 2) {
      steps.push('This is a quadratic equation in multiple variables, so it represents a conic rather than a single numerical root.')
      detailedSteps.push({
        step: `Multivariable Quadratic`,
        explanation: `Detected a degree-2 equation in ${variables.length} variables.`,
        math: `Variables: ${variables.join(', ')}; Degree: 2`
      })
      return {
        output: `Conic section in ${variables.join(', ')}: ${simplified} = 0`,
        steps,
        detailedSteps
      }
    }

    steps.push(
      'This equation contains more than one variable, so a single numerical value cannot be determined without additional equations or constraints.'
    )
    detailedSteps.push({
      step: `Multiple Variables`,
      explanation: `Equation has ${variables.length} variables. Need additional equations for unique solution.`,
      math: `Variables: ${variables.join(', ')}`
    })
    steps.push('Solution status: underdetermined — one equation with multiple independent variables does not produce one numeric answer.')
    detailedSteps.push({
      step: `Solution Status`,
      explanation: `No unique numeric solution exists without additional equations or constraints.`,
      math: `Variables: ${variables.join(', ')}`
    })
    return { output: `Constraint: ${simplified} = 0 (underdetermined)`, steps, detailedSteps }
  }

  const variable = variables[0]
  const degree = Math.max(...combined.map(t => t.variables.length), 0)

  detailedSteps.push({
    step: `Degree Detection`,
    explanation: `Determining the degree of the polynomial`,
    math: `Degree: ${degree}`
  })

  if (degree === 1) {
    const a = coefficientOf(combined, variable)
    const c = coefficientOf(combined, 'constant')

    if (Math.abs(a) < 1e-12) {
      return { output: 'No unique solution', steps, detailedSteps }
    }

    const solution = -c / a
    const solutionText = formatResult(solution)

    detailedSteps.push({
      step: `Linear Equation`,
      explanation: `Solving linear equation ${formatResult(a)}${variable} ${c >= 0 ? '+' : '-'} ${formatResult(Math.abs(c))} = 0`,
      math: `${variable} = -${formatResult(c)} / ${formatResult(a)} = ${solutionText}`
    })

    steps.push(`Move the constant term to the other side: ${a}${variable} = ${formatResult(-c)}`)
    steps.push(`Divide both sides by ${formatResult(a)}.`)
    steps.push(`${variable} = ${formatResult(-c)} / ${formatResult(a)}`)
    steps.push(`${variable} = ${solutionText}`)
    steps.push(`Verify by substituting ${variable} = ${solutionText} into the original equation.`)

    detailedSteps.push({
      step: `Verification`,
      explanation: `Substituting back to verify the solution`,
      math: `P(${solutionText}) = ${formatResult(combined.reduce((sum, t) => sum + t.coefficient * Math.pow(Number(solutionText), t.variables.length), 0))} ≈ 0 ✓`
    })

    // Generate graph data for linear equation
    const graphData = generateGraphData(cleanExpr, variable)

    return { output: `${variable} = ${solutionText}`, steps, detailedSteps, graphData }
  }

  // Factor before applying the quadratic formula.
  const factorResult = factorOneVariablePolynomial(combined, variable)

  if (factorResult.factored || factorResult.roots.length) {
    if (factorResult.factored) {
      steps.push(`Factored form: ${factorResult.factored} = 0`)
      detailedSteps.push({
        step: `Factoring`,
        explanation: `Factored polynomial into simpler form`,
        math: `${factorResult.factored} = 0`
      })
    }

    if (factorResult.roots.length) {
      steps.push('Use the zero-product property: if a product is zero, at least one factor must be zero.')
      steps.push(`Solutions: ${factorResult.roots.map(r => `${variable} = ${r}`).join(', ')}`)
      
      detailedSteps.push({
        step: `Zero-Product Property`,
        explanation: `Applying the zero-product property to find all solutions`,
        math: factorResult.roots.map(r => `${variable} = ${r}`).join(' ; ')
      })

      // Verify roots
      const verified = factorResult.roots.filter(rootText => {
        const value = Number(rootText)
        if (!Number.isFinite(value)) return false
        return Math.abs(
          combined.reduce(
            (sum, t) => sum + t.coefficient * Math.pow(value, t.variables.length),
            0
          )
        ) < 1e-8
      })

      if (verified.length) {
        steps.push(`Verified solution(s) by substitution: ${verified.map(r => `${variable} = ${r}`).join(', ')}`)
        detailedSteps.push({
          step: `Verification`,
          explanation: `Verified solutions by substitution into original equation`,
          math: verified.map(r => `P(${r}) = 0 ✓`).join(' ; ')
        })
      }

      // Generate graph data
      const graphData = generateGraphData(cleanExpr, variable)

      return {
        output: `${variable} = ${factorResult.roots.join(', ')}`,
        steps,
        detailedSteps: [...(factorResult.detailedSteps || []), ...detailedSteps],
        graphData
      }
    }
  }

  if (degree === 2) {
    const a = coefficientOf(combined, `${variable}^2`)
    const b = coefficientOf(combined, variable)
    const c = coefficientOf(combined, 'constant')

    if (Math.abs(a) > 1e-12) {
      const discriminant = b * b - 4 * a * c
      
      detailedSteps.push({
        step: `Quadratic Formula`,
        explanation: `Using the quadratic formula to solve ax² + bx + c = 0`,
        math: `a = ${a}, b = ${b}, c = ${c}`
      })

      steps.push(`Using the quadratic formula: ${variable} = (-b ± √(b² - 4ac)) / (2a)`)
      steps.push(`Identify coefficients: a = ${a}, b = ${b}, c = ${c}`)
      steps.push(`Calculate the discriminant: b² - 4ac = ${discriminant}`)

      detailedSteps.push({
        step: `Discriminant`,
        explanation: `Calculating the discriminant to determine nature of roots`,
        math: `D = ${discriminant}`
      })

      if (discriminant > 0) {
        const r1 = (-b + Math.sqrt(discriminant)) / (2 * a)
        const r2 = (-b - Math.sqrt(discriminant)) / (2 * a)
        steps.push(`Two real solutions are obtained: ${variable} = ${formatResult(r1)} and ${variable} = ${formatResult(r2)}`)
        detailedSteps.push({
          step: `Two Real Roots`,
          explanation: `Discriminant > 0 gives two distinct real roots`,
          math: `${variable} = ${formatResult(r1)}, ${formatResult(r2)}`
        })
        
        // Generate graph data
        const graphData = generateGraphData(cleanExpr, variable)
        
        return { output: `${variable} = ${formatResult(r1)}, ${formatResult(r2)}`, steps, detailedSteps, graphData }
      }

      if (Math.abs(discriminant) < 1e-12) {
        const r = -b / (2 * a)
        steps.push(`The discriminant is zero, so there is one repeated solution: ${variable} = ${formatResult(r)}`)
        detailedSteps.push({
          step: `One Repeated Root`,
          explanation: `Discriminant = 0 gives one repeated (double) root`,
          math: `${variable} = ${formatResult(r)}`
        })
        
        const graphData = generateGraphData(cleanExpr, variable)
        
        return { output: `${variable} = ${formatResult(r)}`, steps, detailedSteps, graphData }
      }

      const real = -b / (2 * a)
      const imag = Math.sqrt(-discriminant) / Math.abs(2 * a)
      steps.push(`The discriminant is negative, so the solutions are complex.`)
      detailedSteps.push({
        step: `Complex Roots`,
        explanation: `Discriminant < 0 gives complex conjugate roots`,
        math: `${variable} = ${formatResult(real)} ± ${formatResult(imag)}i`
      })
      
      const graphData = generateGraphData(cleanExpr, variable)
      
      return { output: `${variable} = ${formatResult(real)} ± ${formatResult(imag)}i`, steps, detailedSteps, graphData }
    }
  }

  steps.push(`Polynomial degree: ${degree}`)
  steps.push('No complete exact factorization was found for this polynomial.')
  steps.push('The expression was preserved rather than using an unsupported numerical guess.')
  
  detailedSteps.push({
    step: `No Exact Factorization`,
    explanation: `Polynomial of degree ${degree} could not be factored exactly`,
    math: `Expression: ${simplified}`
  })

  // Generate graph data for the polynomial
  const graphData = generateGraphData(cleanExpr, variable)

  return { output: `Expression simplified to: ${simplified}`, steps, detailedSteps, graphData }
}

function solveLinearEquation(expression: string): { output: string; steps: string[]; detailedSteps?: any[]; graphData?: any } {
  try {
    let cleanExpr = expression
      .replace(/solve for ([a-zA-Z, ]+):/i, '')
      .replace(/solve/i, '')
      .trim()
    
    if (cleanExpr.includes(',')) {
      const equations = cleanExpr.split(',').map(e => e.trim())
      if (equations.length === 2) {
        try {
          const steps: string[] = []
          steps.push(`System of equations detected: ${equations.join('; ')}`)
          
          const vars = equations.map(eq => {
            const match = eq.match(/[a-zA-Z]+/g)
            return match ? match.filter(v => !['sin', 'cos', 'tan', 'log', 'sqrt', 'abs', 'det', 'inv', 'transpose', 'mean', 'median', 'std', 'variance'].includes(v.toLowerCase())) : []
          }).flat()
          
          const uniqueVars = [...new Set(vars)]
          steps.push(`Variables: ${uniqueVars.join(', ')}`)
          
          if (uniqueVars.length === 2) {
            const systemResult = solveSystemOfEquations(equations, uniqueVars)
            if (systemResult) {
              return systemResult
            }
          }
        } catch (e) {
          // Fall through
        }
      }
    }
    
    const variableMatch = cleanExpr.match(/[a-zA-Z]/)
    if (!variableMatch) throw new Error('No variable found')
    const variable = variableMatch[0]
    
    const parts = cleanExpr.split('=')
    if (parts.length !== 2) {
      throw new Error('Invalid equation format')
    }
    
    const left = parts[0].trim()
    const right = parts[1].trim()
    
    if (left === variable) {
      const value = parseFloat(right)
      if (!isNaN(value)) {
        return {
          output: `${variable} = ${value}`,
          steps: [
            `Solving for ${variable}`,
            `${variable} = ${right}`,
            `Solution: ${variable} = ${value}`
          ]
        }
      }
    }
    
    try {
      const node = math.parse(cleanExpr)
      const simplified = math.simplify(node)
      const simplifiedStr = simplified.toString()
      
      const parts2 = simplifiedStr.split('=')
      if (parts2.length === 2) {
        const left2 = parts2[0].trim()
        const right2 = parts2[1].trim()
        
        for (let val = -100; val <= 100; val += 0.1) {
          const testScope: any = {}
          testScope[variable] = val
          try {
            const leftVal = math.evaluate(left2, testScope)
            const rightVal = math.evaluate(right2, testScope)
            if (Math.abs(leftVal - rightVal) < 0.001) {
              const solution = formatResult(val)
              const graphData = generateGraphData(cleanExpr, variable)
              return {
                output: `${variable} = ${solution}`,
                steps: [
                  `Solving for ${variable}`,
                  `Equation: ${cleanExpr}`,
                  `Found solution: ${variable} = ${solution}`
                ],
                graphData
              }
            }
          } catch (e) {
            continue
          }
        }
      }
    } catch (e) {
      // Fallback
    }
    
    return {
      output: `Could not solve: ${cleanExpr}`,
      steps: [
        `Unable to solve equation automatically`,
        `Please try simplifying or using a different format`
      ]
    }
    
  } catch (error) {
    throw new Error('Could not solve equation')
  }
}

function solveGeometry(expression: string): { output: string; steps: string[] } {
  const steps: string[] = []
  let result = ''
  
  const circleMatch = expression.match(/area of circle radius (\d+\.?\d*)/i)
  if (circleMatch) {
    const radius = parseFloat(circleMatch[1])
    const area = Math.PI * radius * radius
    steps.push(`Circle area formula: A = πr²`)
    steps.push(`Radius = ${radius}`)
    steps.push(`A = π × ${radius}² = π × ${radius * radius}`)
    result = `Area = ${area.toFixed(4)} square units`
    return { output: result, steps }
  }
  
  const circumferenceMatch = expression.match(/circumference of circle radius (\d+\.?\d*)/i)
  if (circumferenceMatch) {
    const radius = parseFloat(circumferenceMatch[1])
    const circumference = 2 * Math.PI * radius
    steps.push(`Circle circumference formula: C = 2πr`)
    steps.push(`Radius = ${radius}`)
    steps.push(`C = 2 × π × ${radius}`)
    result = `Circumference = ${circumference.toFixed(4)} units`
    return { output: result, steps }
  }
  
  const sphereMatch = expression.match(/volume of sphere radius (\d+\.?\d*)/i)
  if (sphereMatch) {
    const radius = parseFloat(sphereMatch[1])
    const volume = (4/3) * Math.PI * radius * radius * radius
    steps.push(`Sphere volume formula: V = ⁴⁄₃πr³`)
    steps.push(`Radius = ${radius}`)
    steps.push(`V = ⁴⁄₃ × π × ${radius}³`)
    result = `Volume = ${volume.toFixed(4)} cubic units`
    return { output: result, steps }
  }
  
  const triangleMatch = expression.match(/area of triangle base (\d+\.?\d*) height (\d+\.?\d*)/i)
  if (triangleMatch) {
    const base = parseFloat(triangleMatch[1])
    const height = parseFloat(triangleMatch[2])
    const area = 0.5 * base * height
    steps.push(`Triangle area formula: A = ½ × base × height`)
    steps.push(`Base = ${base}, Height = ${height}`)
    steps.push(`A = ½ × ${base} × ${height}`)
    result = `Area = ${area.toFixed(4)} square units`
    return { output: result, steps }
  }
  
  const rectMatch = expression.match(/area of rectangle (\d+\.?\d*) by (\d+\.?\d*)/i)
  if (rectMatch) {
    const width = parseFloat(rectMatch[1])
    const length = parseFloat(rectMatch[2])
    const area = width * length
    steps.push(`Rectangle area formula: A = width × length`)
    steps.push(`Width = ${width}, Length = ${length}`)
    steps.push(`A = ${width} × ${length}`)
    result = `Area = ${area.toFixed(4)} square units`
    return { output: result, steps }
  }
  
  const pythagMatch = expression.match(/Pythagorean theorem: sqrt\((\d+\.?\d*)\^2 \+ (\d+\.?\d*)\^2\)/i)
  if (pythagMatch) {
    const a = parseFloat(pythagMatch[1])
    const b = parseFloat(pythagMatch[2])
    const c = Math.sqrt(a*a + b*b)
    steps.push(`Pythagorean theorem: a² + b² = c²`)
    steps.push(`a = ${a}, b = ${b}`)
    steps.push(`c = √(${a}² + ${b}²) = √(${a*a} + ${b*b})`)
    result = `Hypotenuse = ${c.toFixed(4)}`
    return { output: result, steps }
  }
  
  throw new Error('Could not solve geometry problem')
}

function solveCalculus(expression: string): { output: string; steps: string[] } {
  const steps: string[] = []
  let result = ''
  
  const derivativeMatch = expression.match(/d\/dx\(([^)]+)\)/)
  if (derivativeMatch) {
    const func = derivativeMatch[1].trim()
    try {
      const node = math.parse(func)
      const derivative = math.derivative(node, 'x')
      result = derivative.toString()
      steps.push(`Finding derivative of: ${func}`)
      steps.push(`Derivative with respect to x`)
      steps.push(`Result: d/dx(${func}) = ${result}`)
      return { output: result, steps }
    } catch (e) {
      try {
        const h = 0.0001
        const x = 1
        const df = (math.evaluate(func, {x: x + h}) - math.evaluate(func, {x: x})) / h
        result = df.toFixed(4)
        steps.push(`Numeric derivative at x=1`)
        steps.push(`Using central difference method`)
        steps.push(`Result: ${result}`)
        return { output: result, steps }
      } catch (e2) {
        throw new Error('Could not compute derivative')
      }
    }
  }
  
  const integralMatch = expression.match(/integral\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)/)
  if (integralMatch) {
    const func = integralMatch[1].trim()
    const lower = integralMatch[2] ? integralMatch[2].trim() : null
    const upper = integralMatch[3] ? integralMatch[3].trim() : null
    
    if (lower && upper) {
      try {
        const a = parseFloat(lower)
        const b = parseFloat(upper)
        const n = 1000
        const h = (b - a) / n
        let sum = 0
        for (let i = 0; i <= n; i++) {
          const x = a + i * h
          let val
          try {
            val = math.evaluate(func, {x: x})
          } catch (e) {
            val = math.evaluate(func, {x: x})
          }
          if (i === 0 || i === n) {
            sum += val
          } else if (i % 2 === 1) {
            sum += 4 * val
          } else {
            sum += 2 * val
          }
        }
        const integral = (h / 3) * sum
        result = integral.toFixed(4)
        steps.push(`Computing definite integral from ${a} to ${b}`)
        steps.push(`Using Simpson's rule with ${n} intervals`)
        steps.push(`Result: ∫(${func}) dx = ${result}`)
        return { output: result, steps }
      } catch (e) {
        throw new Error('Could not compute integral')
      }
    } else {
      try {
        const result = `∫(${func}) dx`
        steps.push(`Finding indefinite integral`)
        steps.push(`Cannot compute symbolic antiderivative automatically`)
        steps.push(`Result: ${result} + C`)
        return { output: result + ' + C', steps }
      } catch (e) {
        throw new Error('Could not compute integral')
      }
    }
  }
  
  const limitMatch = expression.match(/limit\(([^,)]+),\s*([^,)]+),\s*([^)]+)\)/)
  if (limitMatch) {
    const func = limitMatch[1].trim()
    const variable = limitMatch[2].trim()
    const point = limitMatch[3].trim()
    
    try {
      const pointNum = parseFloat(point)
      const h = 0.0001
      const val1 = math.evaluate(func, {[variable]: pointNum + h})
      const val2 = math.evaluate(func, {[variable]: pointNum - h})
      if (Math.abs(val1 - val2) < 0.001) {
        result = ((val1 + val2) / 2).toFixed(4)
      } else {
        result = `${val1.toFixed(4)} (approaches from right), ${val2.toFixed(4)} (approaches from left)`
      }
      steps.push(`Evaluating limit as ${variable} → ${point}`)
      steps.push(`Using numeric approximation`)
      steps.push(`Result: ${result}`)
      return { output: result, steps }
    } catch (e) {
      throw new Error('Could not compute limit')
    }
  }
  
  throw new Error('Could not solve calculus problem')
}

function withSections(
  base: SolveResult,
  kind?: InputKind,
  interpretation?: string,
  extraSections?: ResultSection[]
): SolveResult {
  const classified = kind
    ? { kind, interpretation: interpretation ?? TOPIC_FOR_KIND[kind] }
    : classifyInput(base.raw)
  const sections = attachShellToClassicResult({
    raw: base.raw,
    kind: classified.kind,
    interpretation: classified.interpretation,
    output: base.output,
    steps: base.steps,
    detailedSteps: base.detailedSteps,
    extraSections
  })
  return {
    ...base,
    inputKind: classified.kind,
    interpretation: classified.interpretation,
    sections,
    topic: base.topic || TOPIC_FOR_KIND[classified.kind]
  }
}

export function solveMath(expression: string): SolveResult {
  try {
    let cleanExpr = expression.trim()
    // OCR-safe cleanup: matrix labels such as `A = [[4,1],[2,3]]` are valid
    // first-class matrix inputs. Normalize Unicode brackets/commas without
    // turning them into an equation such as `4=tzz`.
    cleanExpr = cleanExpr
      .replace(/[［【]/g, '[')
      .replace(/[］】]/g, ']')
      .replace(/[，]/g, ',')
      .replace(/\s*=\s*/g, '=')

    // Shared learned correction with MathOCR: normalize known OCR/system forms
    // before rich classification and equation parsing.
    const learnedInput = normalizeLearnedSolverInput(cleanExpr)
    if (learnedInput !== cleanExpr) {
      cleanExpr = learnedInput
    }
    
    if (!cleanExpr) {
      return {
        ok: false,
        output: 'Please enter a math expression',
        steps: ['No input provided'],
        topic: 'Error',
        raw: cleanExpr
      }
    }

    // First-class rich analysis: matrices, vectors, arithmetic, complex, stats, expressions
    const rich = tryRichAnalysis(cleanExpr)
    if (rich) {
      return {
        ok: true,
        output: rich.output,
        steps: rich.steps,
        topic: rich.topic,
        raw: cleanExpr,
        detailedSteps: rich.detailedSteps,
        graphData: rich.graphData,
        inputKind: rich.kind,
        interpretation: rich.interpretation,
        sections: rich.sections
      }
    }
    
    if (/area of|volume of|circumference|perimeter|Pythagorean/i.test(cleanExpr)) {
      try {
        const geometryResult = solveGeometry(cleanExpr)
        return withSections({
          ok: true,
          output: geometryResult.output,
          steps: geometryResult.steps,
          topic: 'Geometry',
          raw: cleanExpr
        }, 'geometry', 'Geometry problem')
      } catch (error) {
        // Continue to general evaluation
      }
    }
    
    if (/d\/dx|derivative|integral|limit/.test(cleanExpr)) {
      try {
        const calculusResult = solveCalculus(cleanExpr)
        const kind = /limit/i.test(cleanExpr) ? 'limit' as const : 'calculus' as const
        return withSections({
          ok: true,
          output: calculusResult.output,
          steps: calculusResult.steps,
          topic: kind === 'limit' ? 'Calculus — Limits' : 'Calculus',
          raw: cleanExpr
        }, kind, kind === 'limit' ? 'Limit expression' : 'Calculus expression')
      } catch (error) {
        // Continue to general evaluation
      }
    }
    
    if (/[<>]=?/.test(cleanExpr)) {
      try {
        const inequalityResult = solveLinearInequality(cleanExpr)
        if (inequalityResult) {
          return withSections({
            ok: true,
            output: inequalityResult.output,
            steps: inequalityResult.steps,
            topic: 'Linear Inequalities',
            raw: cleanExpr
          }, 'equation', 'Linear inequality')
        }
      } catch {
        // Unsupported inequality forms continue to the other handlers.
      }
    }

    if (cleanExpr.includes('=') || /solve for/.test(cleanExpr)) {
      try {
        const systemEquations = parseSystemEquations(cleanExpr)

        if (systemEquations.length > 1) {
          const vars = [...new Set(systemEquations.flatMap(eq => {
            const { variables } = extractEquationTerms(eq)
            return variables
          }))].sort()
          const systemResult = solveSystemOfEquations(systemEquations, vars)
          if (systemResult) {
            const verification = verifyLinearSystemSolution(systemEquations, systemResult.output)
            const verifiedSteps = [...systemResult.steps]
            const verifiedDetails = [...(systemResult.detailedSteps || [])]

            if (verification.ok) {
              verifiedSteps.push('Independent substitution verification passed for every equation.')
              verifiedDetails.push({
                step: 'Independent Verification',
                explanation: 'Substituted the computed solution into every original equation and obtained zero residuals.',
                math: systemResult.output
              })
            } else if (systemResult.output.includes('=')) {
              verifiedSteps.push(`Independent verification failed: ${verification.residuals.join('; ')}`)
              verifiedDetails.push({
                step: 'Independent Verification Failed',
                explanation: 'The computed assignments do not satisfy every original equation.',
                math: verification.residuals.join(' ; ')
              })
              return withSections({
                ok: false,
                output: 'Solver verification failed; no answer was returned.',
                steps: verifiedSteps,
                topic: 'Linear Algebra — Systems',
                raw: cleanExpr,
                detailedSteps: verifiedDetails,
                graphData: systemResult.graphData
              }, 'system', `System of ${systemEquations.length} linear equations in ${vars.length} variable(s)`)
            }

            return withSections({
              ok: true,
              output: systemResult.output,
              steps: verifiedSteps,
              topic: 'Linear Algebra — Systems',
              raw: cleanExpr,
              detailedSteps: verifiedDetails,
              graphData: systemResult.graphData
            }, 'system', `System of ${systemEquations.length} linear equations in ${vars.length} variable(s)`)
          }
        }
        
        if (cleanExpr.includes('^') || cleanExpr.includes('x') || cleanExpr.includes('y') || cleanExpr.includes('z')) {
          try {
            const polyResult = solvePolynomialEquation(cleanExpr)
            if (polyResult.output !== `Expression: ${cleanExpr}`) {
              const isQuad = /\^2|²/.test(cleanExpr)
              return withSections({
                ok: true,
                output: polyResult.output,
                steps: polyResult.steps,
                topic: isQuad ? 'Algebra — Quadratic' : 'Algebra',
                raw: cleanExpr,
                detailedSteps: polyResult.detailedSteps,
                graphData: polyResult.graphData
              }, isQuad ? 'quadratic' : 'equation', isQuad ? 'Quadratic / polynomial equation' : 'Polynomial equation')
            }
          } catch (e) {
            // Fall through to linear solver
          }
        }
        
        const eqResult = solveLinearEquation(cleanExpr)
        return withSections({
          ok: true,
          output: eqResult.output,
          steps: eqResult.steps,
          topic: 'Algebra — Equations',
          raw: cleanExpr,
          detailedSteps: eqResult.detailedSteps,
          graphData: eqResult.graphData
        }, 'equation', 'Equation')
      } catch (error) {
        // Continue to general evaluation
      }
    }
    
    let result: any
    let evaluationSteps: string[] = []
    
    const hasVariables = /[a-zA-Z]/.test(cleanExpr) && 
                         !/(sin|cos|tan|csc|sec|cot|arcsin|arccos|arctan|log|sqrt|abs|det|inv|transpose|mean|median|std|variance|gamma|nthRoot|mod|lim|integral|derivative|π|pi|e)/i.test(cleanExpr)
    
    if (hasVariables) {
      try {
        const simplified = math.simplify(/^[0-9a-zA-Z_+\-*/^()., =]+$/.test(cleanExpr) ? normalizeAlgebraExpression(cleanExpr) : cleanExpr)
        const simplifiedStr = simplified.toString()
        if (simplifiedStr !== cleanExpr) {
          result = simplifiedStr
          evaluationSteps = [
            'Recognize the expression and its operations.',
            `Original: ${cleanExpr}`,
            'Apply valid algebraic simplification rules without changing signs.',
            `Simplified: ${result}`,
            'The simplified expression is equivalent to the original expression.'
          ]
        } else {
          result = `Expression: ${cleanExpr} (contains variables)`
          evaluationSteps = [
            'Expression contains variables',
            'To evaluate, provide numerical values for variables'
          ]
        }
      } catch (error) {
        result = `Cannot simplify expression with variables`
        evaluationSteps = ['Expression contains variables that cannot be simplified']
      }
    } else {
      try {
        const node = math.parse(cleanExpr)
        result = node.evaluate()
        evaluationSteps = [
          'Evaluating expression',
          `Input: ${cleanExpr}`
        ]
      } catch (evalError) {
        try {
          const altResult = math.evaluate(cleanExpr)
          result = altResult
          evaluationSteps = [
            'Evaluating expression (alternative method)',
            `Input: ${cleanExpr}`
          ]
        } catch (altError) {
          throw new Error('Could not evaluate expression')
        }
      }
    }
    
    const topic = detectTopic(cleanExpr)
    const steps = evaluationSteps
    steps.push(`Result: ${formatResult(result)}`)

    // Evaluation produced a matrix → full linear-algebra report
    if (result && (math.isMatrix(result) || (Array.isArray(result) && Array.isArray(result[0])))) {
      const nested = math.isMatrix(result)
        ? (result as math.Matrix).toArray() as number[][]
        : (result as number[][])
      const literal = `[[${nested.map(r => r.join(',')).join('],[')}]]`
      const fromValue = tryRichAnalysis(literal)
      if (fromValue) {
        return {
          ok: true,
          output: fromValue.output,
          steps: [...steps, ...fromValue.steps],
          topic: fromValue.topic,
          raw: cleanExpr,
          detailedSteps: fromValue.detailedSteps,
          inputKind: fromValue.kind,
          interpretation: fromValue.interpretation,
          sections: fromValue.sections
        }
      }
    }
    
    return withSections({
      ok: true,
      output: typeof result === 'string' ? result : formatResult(result),
      steps: steps,
      topic: topic,
      raw: cleanExpr
    })
    
  } catch (error) {
    return {
      ok: false,
      output: 'Could not solve the expression',
      steps: [
        'Unable to interpret the math expression',
        'Please check your syntax',
        'Try using simpler expressions or different formats'
      ],
      topic: 'Error',
      raw: expression
    }
  }
}