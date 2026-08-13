/**
 * Rich multi-section mathematical analysis.
 * Linear Algebra (matrices, vectors, systems) are first-class input types.
 */
import * as math from 'mathjs'
import {
  type InputKind,
  type ResultSection,
  section,
  field
} from './resultModel'

const EPS = 1e-10

function fmt(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return String(value)
    if (Math.abs(value) < EPS) return '0'
    if (Number.isInteger(value)) return String(value)
    return Number(value.toPrecision(10)).toString()
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (math.isComplex(value as any)) {
    const c = value as math.Complex
    const re = fmt(c.re)
    const im = Math.abs(c.im)
    const imText = fmt(im)
    if (Math.abs(c.re) < EPS && Math.abs(c.im) < EPS) return '0'
    if (Math.abs(c.re) < EPS) return c.im < 0 ? `-${imText}i` : `${imText}i`
    if (Math.abs(c.im) < EPS) return re
    return c.im < 0 ? `${re} - ${imText}i` : `${re} + ${imText}i`
  }
  if (math.isMatrix(value as any)) {
    return matrixToString(toNumberMatrix(value))
  }
  if (Array.isArray(value)) {
    if (value.length && Array.isArray(value[0])) {
      return matrixToString(value as number[][])
    }
    return `[${value.map(v => fmt(v)).join(', ')}]`
  }
  if (typeof value === 'object' && value !== null && 'toString' in value) {
    const s = String(value)
    if (s !== '[object Object]') return s
  }
  try {
    return math.format(value as any, { precision: 10 })
  } catch {
    return String(value)
  }
}

function toNumberMatrix(m: unknown): number[][] {
  const arr = math.isMatrix(m as any)
    ? (m as math.Matrix).toArray()
    : (m as unknown[][])
  return (arr as unknown[][]).map(row =>
    (Array.isArray(row) ? row : [row]).map(v => {
      if (typeof v === 'number') return v
      if (math.isComplex(v as any)) return (v as math.Complex).re
      return Number(v)
    })
  )
}

function matrixToString(m: number[][]): string {
  if (!m.length) return '[]'
  const rows = m.map(row => `[${row.map(v => fmt(v)).join(', ')}]`)
  return rows.length === 1 ? rows[0] : `[\n  ${rows.join('\n  ')}\n]`
}

function approxEqual(a: number, b: number, tol = 1e-8): boolean {
  return Math.abs(a - b) <= tol
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    const t = a % b
    a = b
    b = t
  }
  return a || 1
}

function lcm(a: number, b: number): number {
  if (!a || !b) return 0
  return Math.abs(Math.round(a) * Math.round(b)) / gcd(a, b)
}

function primeFactors(n: number): string {
  n = Math.abs(Math.round(n))
  if (n < 2) return String(n)
  const factors: number[] = []
  let d = 2
  while (d * d <= n) {
    while (n % d === 0) {
      factors.push(d)
      n /= d
    }
    d++
  }
  if (n > 1) factors.push(n)
  const counts = new Map<number, number>()
  for (const f of factors) counts.set(f, (counts.get(f) || 0) + 1)
  return [...counts.entries()]
    .map(([p, e]) => (e === 1 ? String(p) : `${p}^${e}`))
    .join(' × ')
}

function toMixedNumber(n: number): string {
  if (!Number.isFinite(n)) return String(n)
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  const whole = Math.floor(abs)
  const frac = abs - whole
  if (frac < EPS) return `${sign}${whole}`
  // continued fraction approx
  let bestP = 0
  let bestQ = 1
  let bestErr = Infinity
  for (let q = 1; q <= 1000; q++) {
    const p = Math.round(frac * q)
    const err = Math.abs(frac - p / q)
    if (err < bestErr) {
      bestErr = err
      bestP = p
      bestQ = q
      if (err < 1e-12) break
    }
  }
  const g = gcd(bestP, bestQ)
  bestP /= g
  bestQ /= g
  if (whole === 0) return `${sign}${bestP}/${bestQ}`
  return `${sign}${whole} ${bestP}/${bestQ}`
}

function toFraction(n: number): string {
  if (!Number.isFinite(n)) return String(n)
  if (Number.isInteger(n)) return String(n)
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  let bestP = 1
  let bestQ = 1
  let bestErr = Infinity
  for (let q = 1; q <= 2000; q++) {
    const p = Math.round(abs * q)
    const err = Math.abs(abs - p / q)
    if (err < bestErr) {
      bestErr = err
      bestP = p
      bestQ = q
      if (err < 1e-12) break
    }
  }
  const g = gcd(bestP, bestQ)
  return `${sign}${bestP / g}/${bestQ / g}`
}

// ─── Input classification & parsing ─────────────────────────────────────────

export interface ClassifiedInput {
  kind: InputKind
  interpretation: string
  matrix?: number[][]
  vector?: number[]
  matrices?: { name: string; data: number[][] }[]
  numbers?: number[]
  expression?: string
}

/** Parse MATLAB / nested-bracket / newline matrix literals. */
export function tryParseMatrix(raw: string): number[][] | null {
  const text = raw.trim()
    .replace(/^[A-Za-z]\s*=\s*/, '')
    .replace(/^matrix\s*\(/i, '')
    .replace(/\)$/, '')
    .trim()

  // Nested [[1,2],[3,4]] or [[1 2][3 4]]
  if (/^\[\[/.test(text) || text.includes('],[')) {
    try {
      const normalized = text
        .replace(/\s+/g, ' ')
        .replace(/\[\s+/g, '[')
        .replace(/\s+\]/g, ']')
        .replace(/\s*,\s*/g, ',')
        .replace(/\]\s*\[/g, '],[')
      const evaluated = math.evaluate(normalized)
      const m = toNumberMatrix(evaluated)
      if (m.length && m.every(r => r.length === m[0].length)) return m
    } catch { /* continue */ }
  }

  // MATLAB: [1 2; 3 4] or [1,2;3,4]
  const matlab = text.match(/^\[([\s\S]+)\]$/)
  if (matlab) {
    const body = matlab[1].trim()
    if (body.includes(';') || body.includes('\n')) {
      const rows = body.split(/;|\n/).map(r => r.trim()).filter(Boolean)
      try {
        const m = rows.map(row =>
          row
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(tok => Number(math.evaluate(tok)))
        )
        if (m.length && m.every(r => r.length === m[0].length && r.every(Number.isFinite))) {
          return m
        }
      } catch { /* continue */ }
    }
  }

  // Plain multiline numbers (2+ rows)
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean)
  if (lines.length >= 2) {
    try {
      const m = lines.map(line =>
        line
          .replace(/^\[|\]$/g, '')
          .split(/[\s,|]+/)
          .filter(Boolean)
          .map(tok => Number(math.evaluate(tok)))
      )
      if (m.length >= 2 && m.every(r => r.length === m[0].length && r.length >= 1 && r.every(Number.isFinite))) {
        return m
      }
    } catch { /* continue */ }
  }

  // Column vector as single-column matrix when written [1;2;3]
  if (/^\[[^\]]*(;[^\]]*)+\]$/.test(text.replace(/\s+/g, ''))) {
    try {
      const body = text.replace(/^\[|\]$/g, '')
      const parts = body.split(';').map(p => Number(math.evaluate(p.trim())))
      if (parts.every(Number.isFinite)) return parts.map(v => [v])
    } catch { /* continue */ }
  }

  return null
}

export function tryParseVector(raw: string): number[] | null {
  const text = raw.trim()
    .replace(/^[A-Za-z]\s*=\s*/, '')
    .replace(/^vector\s*\(/i, '')
    .replace(/\)$/, '')
    .trim()

  // Column vector matrix n×1
  const asMatrix = tryParseMatrix(text)
  if (asMatrix && asMatrix[0]?.length === 1) {
    return asMatrix.map(r => r[0])
  }
  // Row vector 1×n treated as vector only if explicitly one row with commas/spaces in brackets
  if (asMatrix && asMatrix.length === 1 && asMatrix[0].length >= 2) {
    // Prefer matrix for 1×n unless looks like vector notation <a,b> or (a,b)
    // Keep as matrix for [[a,b]] — handled by matrix path first.
  }

  const angle = text.match(/^<\s*([^>]+)\s*>$/)
  const paren = text.match(/^\(\s*([^)]+)\s*\)$/)
  const bracketRow = text.match(/^\[\s*([^\];]+)\s*\]$/)
  const body = angle?.[1] ?? paren?.[1] ?? bracketRow?.[1]
  if (body && !body.includes(';') && !body.includes('\n')) {
    try {
      const comps = body.split(/[\s,]+/).filter(Boolean).map(t => Number(math.evaluate(t)))
      if (comps.length >= 2 && comps.every(Number.isFinite)) return comps
    } catch { /* continue */ }
  }

  return null
}

function looksLikeSystem(raw: string): boolean {
  const text = raw
    .replace(/[−–—]/g, '-')
    .replace(/^\s*[\{\[\(]\s*/u, '')
    .replace(/\s*[\}\]\)]\s*$/u, '')
  const eqs = text.split(/\s*(?:,|;|\n|\\n)+\s*/).filter(s => s.includes('='))
  return eqs.length >= 2
}

function looksLikeStatsDataset(raw: string): boolean {
  const t = raw.trim()
  if (!/^[\d\s,.\-+eE]+$/.test(t)) return false
  const nums = t.split(/[\s,]+/).filter(Boolean).map(Number)
  return nums.length >= 3 && nums.every(Number.isFinite)
}

function looksLikeComplex(raw: string): boolean {
  return /[+-]?\s*\d*\.?\d+\s*[+-]\s*\d*\.?\d+\s*i\b/i.test(raw) || /^[+-]?\s*\d*\.?\d+\s*i$/i.test(raw.trim())
}

/** Normalize inputs like 2x2−3xy+4y2+6x−3y−4=0 → 2*x^2-3*x*y+4*y^2+... */
export function normalizeConicExpression(raw: string): string {
  let s = raw.trim()
    .replace(/[−–—]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/\s+/g, '')

  // x2 / y2 → x^2 / y^2 (digit power glued to a variable)
  s = s.replace(/([a-zA-Z])(\d+)(?![.a-zA-Z])/g, '$1^$2')

  // Implicit multiplication: 2x → 2*x, xy → x*y, )( → )*(
  s = s.replace(/(\d)([a-zA-Z(])/g, '$1*$2')
  s = s.replace(/([a-zA-Z])(?=[a-zA-Z])/g, '$1*')
  s = s.replace(/\)\(/g, ')*(')
  s = s.replace(/([a-zA-Z0-9)])\(/g, '$1*(')

  return s
}

const RESERVED_SYMBOLS = new Set([
  'pi', 'e', 'i', 'sin', 'cos', 'tan', 'csc', 'sec', 'cot',
  'log', 'ln', 'sqrt', 'abs', 'exp', 'asin', 'acos', 'atan'
])

function extractBivariateVars(normalizedEq: string): string[] | null {
  const left = normalizedEq.split('=')[0] ?? normalizedEq
  const letters = [...new Set(left.match(/[a-zA-Z]+/g) ?? [])]
    .filter(v => !RESERVED_SYMBOLS.has(v.toLowerCase()))
  return letters.length === 2 ? letters : null
}

/** Any F(x,y)=0 polynomial-style equation in exactly two variables. */
function looksLikeBivariatePolynomial(raw: string): boolean {
  const n = normalizeConicExpression(raw)
  if (!n.includes('=')) return false
  const vars = extractBivariateVars(n)
  if (!vars) return false
  // Must look algebraic (powers, products, or both variables present as terms)
  const body = n.replace(/=.*/, '')
  const hasPolyShape =
    /\^/.test(body) ||
    new RegExp(`${vars[0]}\\*?${vars[1]}|${vars[1]}\\*?${vars[0]}`).test(body) ||
    (body.includes(vars[0]) && body.includes(vars[1]))
  return hasPolyShape
}

function polynomialDegree(node: any, vars: Set<string>): number {
  if (!node) return 0
  if (node.isConstantNode) return 0
  if (node.isSymbolNode) return vars.has(node.name) ? 1 : 0
  if (node.isParenthesisNode) return polynomialDegree(node.content, vars)
  if (node.isUnaryMinusNode) return polynomialDegree(node.args?.[0] ?? node.content, vars)
  if (node.isOperatorNode) {
    if (node.op === '+' || node.op === '-') {
      return Math.max(0, ...((node.args || []).map((a: any) => polynomialDegree(a, vars))))
    }
    if (node.op === '*') {
      return (node.args || []).reduce((s: number, a: any) => s + polynomialDegree(a, vars), 0)
    }
    if (node.op === '/') {
      const denDeg = polynomialDegree(node.args[1], vars)
      if (denDeg !== 0) return NaN
      return polynomialDegree(node.args[0], vars)
    }
    if (node.op === '^' || node.fn === 'pow') {
      const expNode = node.args[1]
      const e = expNode?.isConstantNode ? Number(expNode.value) : NaN
      if (!Number.isInteger(e) || e < 0) return NaN
      return polynomialDegree(node.args[0], vars) * e
    }
    if (node.op === 'unaryMinus') return polynomialDegree(node.args[0], vars)
  }
  if (node.isFunctionNode) return NaN
  return 0
}

/** Collect monomial coefficient map: "x^2" -> c, "x*y" -> c, "1" -> const */
function collectMonomials(node: any, vars: string[]): Map<string, number> {
  const map = new Map<string, number>()
  const varSet = new Set(vars)

  function add(key: string, c: number) {
    if (Math.abs(c) < 1e-14) return
    map.set(key, (map.get(key) || 0) + c)
  }

  function keyFromCounts(counts: Record<string, number>): string {
    const parts = vars
      .map(v => {
        const e = counts[v] || 0
        if (e === 0) return ''
        if (e === 1) return v
        return `${v}^${e}`
      })
      .filter(Boolean)
    return parts.length ? parts.join('') : '1'
  }

  function walk(n: any): { c: number; counts: Record<string, number> }[] {
    if (n?.isParenthesisNode) return walk(n.content)
    if (n?.isConstantNode) return [{ c: Number(n.value), counts: {} }]
    if (n?.isSymbolNode) {
      if (varSet.has(n.name)) return [{ c: 1, counts: { [n.name]: 1 } }]
      return [{ c: NaN, counts: {} }]
    }
    if (n?.isUnaryMinusNode || (n?.isOperatorNode && n.op === 'unaryMinus')) {
      return walk(n.args[0]).map(t => ({ c: -t.c, counts: t.counts }))
    }
    if (!n?.isOperatorNode) return [{ c: NaN, counts: {} }]

    if (n.op === '+' && n.args?.length === 2) return [...walk(n.args[0]), ...walk(n.args[1])]
    if (n.op === '-' && n.args?.length === 2) {
      return [...walk(n.args[0]), ...walk(n.args[1]).map(t => ({ c: -t.c, counts: t.counts }))]
    }
    if (n.op === '*') {
      const left = walk(n.args[0])
      const right = walk(n.args[1])
      const out: { c: number; counts: Record<string, number> }[] = []
      for (const a of left) {
        for (const b of right) {
          const counts: Record<string, number> = { ...a.counts }
          for (const [k, v] of Object.entries(b.counts)) counts[k] = (counts[k] || 0) + v
          out.push({ c: a.c * b.c, counts })
        }
      }
      return out
    }
    if (n.op === '^') {
      const exp = n.args[1]?.isConstantNode ? Number(n.args[1].value) : NaN
      if (!Number.isInteger(exp) || exp < 0) return [{ c: NaN, counts: {} }]
      let acc: { c: number; counts: Record<string, number> }[] = [{ c: 1, counts: {} }]
      const base = walk(n.args[0])
      for (let i = 0; i < exp; i++) {
        const next: typeof acc = []
        for (const a of acc) {
          for (const b of base) {
            const counts: Record<string, number> = { ...a.counts }
            for (const [k, v] of Object.entries(b.counts)) counts[k] = (counts[k] || 0) + v
            next.push({ c: a.c * b.c, counts })
          }
        }
        acc = next
      }
      return acc
    }
    if (n.op === '/') {
      const den = walk(n.args[1])
      if (den.length === 1 && Object.keys(den[0].counts).length === 0 && den[0].c !== 0) {
        return walk(n.args[0]).map(t => ({ c: t.c / den[0].c, counts: t.counts }))
      }
    }
    return [{ c: NaN, counts: {} }]
  }

  for (const term of walk(node)) {
    if (!Number.isFinite(term.c)) continue
    add(keyFromCounts(term.counts), term.c)
  }
  return map
}

export function classifyInput(raw: string): ClassifiedInput {
  const clean = raw.trim()
  if (!clean) return { kind: 'unknown', interpretation: 'Empty input' }

  const matrix = tryParseMatrix(clean)
  if (matrix) {
    const rows = matrix.length
    const cols = matrix[0].length
    if (cols === 1 && rows >= 2) {
      return {
        kind: 'vector',
        interpretation: `Column vector in ℝ^${rows}`,
        vector: matrix.map(r => r[0]),
        matrix
      }
    }
    const square = rows === cols
    return {
      kind: 'matrix',
      interpretation: `${rows} × ${cols} ${square ? 'square' : 'rectangular'} matrix`,
      matrix
    }
  }

  const vector = tryParseVector(clean)
  if (vector) {
    return {
      kind: 'vector',
      interpretation: `Vector in ℝ^${vector.length}`,
      vector
    }
  }

  if (looksLikeSystem(clean)) {
    return { kind: 'system', interpretation: 'System of linear equations', expression: clean }
  }

  // Any bivariate polynomial equation F(x,y)=0 (conic or higher-degree curve)
  if (looksLikeBivariatePolynomial(clean)) {
    const normalized = normalizeConicExpression(clean)
    let degree = 2
    try {
      const parts = normalized.split('=')
      const node = math.parse(`(${parts[0]})-(${parts[1]})`)
      const vars = extractBivariateVars(normalized)!
      const ordered = vars.includes('x') && vars.includes('y') ? ['x', 'y'] : vars.slice().sort()
      degree = polynomialDegree(node, new Set(ordered))
    } catch { /* keep default */ }

    if (degree === 2) {
      return {
        kind: 'conic',
        interpretation: 'Quadratic equation in two variables (conic section)',
        expression: normalized
      }
    }
    return {
      kind: 'curve',
      interpretation: `Algebraic curve of degree ${Number.isFinite(degree) ? degree : 'n'} in two variables`,
      expression: normalized
    }
  }

  if (/y'\s*=|dy\/dx|differential/i.test(clean)) {
    return { kind: 'differential', interpretation: 'Differential equation', expression: clean }
  }

  if (/d\/dx|derivative|∫|integral\(|limit\(/i.test(clean)) {
    if (/limit\(/i.test(clean) || /lim\s*[_(]/i.test(clean)) {
      return { kind: 'limit', interpretation: 'Limit expression', expression: clean }
    }
    return { kind: 'calculus', interpretation: 'Calculus expression', expression: clean }
  }

  if (looksLikeComplex(clean)) {
    return { kind: 'complex', interpretation: 'Complex number', expression: clean }
  }

  if (looksLikeStatsDataset(clean)) {
    const numbers = clean.split(/[\s,]+/).filter(Boolean).map(Number)
    return { kind: 'statistics', interpretation: `Dataset with ${numbers.length} values`, numbers, expression: clean }
  }

  if (/=/.test(clean)) {
    if (/\^2|²|[a-zA-Z]2\b/.test(clean) && /[a-zA-Z]/.test(clean)) {
      return { kind: 'quadratic', interpretation: 'Quadratic / polynomial equation', expression: clean }
    }
    return { kind: 'equation', interpretation: 'Equation', expression: clean }
  }

  if (/sin|cos|tan|csc|sec|cot/i.test(clean) && /[a-zA-Z]/.test(clean)) {
    return { kind: 'trigonometry', interpretation: 'Trigonometric expression', expression: clean }
  }

  if (/area of|volume of|circumference|perimeter|Pythagorean/i.test(clean)) {
    return { kind: 'geometry', interpretation: 'Geometry problem', expression: clean }
  }

  if (/f\s*\(\s*x\s*\)\s*=/.test(clean)) {
    return { kind: 'function', interpretation: 'Function definition', expression: clean }
  }

  if (/[a-zA-Z]/.test(clean) && !/^(sin|cos|tan|log|sqrt|abs|pi|e)$/i.test(clean)) {
    if (/\^3|³/.test(clean) || /\^[3-9]/.test(clean)) {
      return { kind: 'polynomial', interpretation: 'Polynomial / algebraic expression', expression: clean }
    }
    return { kind: 'expression', interpretation: 'Algebraic expression', expression: clean }
  }

  // Arithmetic / numeric
  try {
    const val = math.evaluate(clean)
    if (typeof val === 'number' || math.isComplex(val as any)) {
      return { kind: 'arithmetic', interpretation: 'Arithmetic expression', expression: clean }
    }
    if (math.isMatrix(val as any)) {
      const m = toNumberMatrix(val)
      return {
        kind: 'matrix',
        interpretation: `${m.length} × ${m[0].length} matrix`,
        matrix: m
      }
    }
  } catch { /* ignore */ }

  return { kind: 'unknown', interpretation: 'General mathematical input', expression: clean }
}

// ─── Matrix analysis ────────────────────────────────────────────────────────

function matrixTypeLabels(m: number[][]): string[] {
  const rows = m.length
  const cols = m[0]?.length ?? 0
  const labels: string[] = []
  if (rows === cols) labels.push('Square')
  else labels.push('Rectangular')
  if (rows === 1) labels.push('Row matrix')
  if (cols === 1) labels.push('Column matrix')

  if (rows === cols) {
    let identity = true
    let diagonal = true
    let zero = true
    let symmetric = true
    let skew = true
    let upper = true
    let lower = true
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const v = m[i][j]
        if (Math.abs(v) > EPS) zero = false
        if (i !== j && Math.abs(v) > EPS) {
          diagonal = false
          if (i > j) upper = false
          if (i < j) lower = false
        }
        if (i === j) {
          if (!approxEqual(v, 1)) identity = false
        } else if (!approxEqual(v, 0)) {
          identity = false
        }
        if (!approxEqual(m[i][j], m[j][i])) symmetric = false
        if (i !== j && !approxEqual(m[i][j], -m[j][i])) skew = false
        if (i === j && Math.abs(m[i][j]) > EPS) skew = false
      }
    }
    if (zero) labels.push('Zero matrix')
    if (identity) labels.push('Identity')
    else if (diagonal) labels.push('Diagonal')
    if (upper && !diagonal) labels.push('Upper triangular')
    if (lower && !diagonal) labels.push('Lower triangular')
    if (symmetric) labels.push('Symmetric')
    if (skew) labels.push('Skew-symmetric')
  }
  return labels
}

function rrefAndRef(m: number[][]): { ref: number[][]; rref: number[][]; rank: number; ops: string[] } {
  const rows = m.length
  const cols = m[0].length
  const a = m.map(r => [...r])
  const ops: string[] = []
  let pivotRow = 0

  for (let col = 0; col < cols && pivotRow < rows; col++) {
    let best = pivotRow
    for (let r = pivotRow + 1; r < rows; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[best][col])) best = r
    }
    if (Math.abs(a[best][col]) < EPS) continue
    if (best !== pivotRow) {
      ;[a[best], a[pivotRow]] = [a[pivotRow], a[best]]
      ops.push(`Swap R${pivotRow + 1} ↔ R${best + 1}`)
    }
    const pivot = a[pivotRow][col]
    for (let c = col; c < cols; c++) a[pivotRow][c] /= pivot
    ops.push(`R${pivotRow + 1} → R${pivotRow + 1} / ${fmt(pivot)}`)
    for (let r = pivotRow + 1; r < rows; r++) {
      const factor = a[r][col]
      if (Math.abs(factor) < EPS) continue
      for (let c = col; c < cols; c++) a[r][c] -= factor * a[pivotRow][c]
      ops.push(`R${r + 1} → R${r + 1} - (${fmt(factor)}) R${pivotRow + 1}`)
    }
    pivotRow++
  }

  const ref = a.map(r => r.map(v => (Math.abs(v) < EPS ? 0 : v)))

  // Continue to RREF (clear above pivots)
  const rref = ref.map(r => [...r])
  for (let r = rows - 1; r >= 0; r--) {
    const pivotCol = rref[r].findIndex(v => Math.abs(v) > EPS)
    if (pivotCol < 0) continue
    for (let i = 0; i < r; i++) {
      const factor = rref[i][pivotCol]
      if (Math.abs(factor) < EPS) continue
      for (let c = 0; c < cols; c++) rref[i][c] -= factor * rref[r][c]
      ops.push(`R${i + 1} → R${i + 1} - (${fmt(factor)}) R${r + 1}`)
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.abs(rref[i][j]) < EPS) rref[i][j] = 0
    }
  }

  const rank = rref.reduce((count, row) => count + (row.some(v => Math.abs(v) > EPS) ? 1 : 0), 0)
  return { ref, rref, rank, ops }
}

function nullSpaceBasis(m: number[][]): number[][] {
  const { rref, rank } = rrefAndRef(m)
  const rows = rref.length
  const cols = rref[0]?.length ?? 0
  const pivotCols: number[] = []
  for (let r = 0; r < rows; r++) {
    const c = rref[r].findIndex(v => Math.abs(v) > EPS)
    if (c >= 0) pivotCols.push(c)
  }
  const freeCols = [...Array(cols).keys()].filter(c => !pivotCols.includes(c))
  const basis: number[][] = []
  for (const free of freeCols) {
    const vec = Array(cols).fill(0)
    vec[free] = 1
    for (let i = 0; i < pivotCols.length; i++) {
      const pc = pivotCols[i]
      vec[pc] = -rref[i][free]
    }
    basis.push(vec.map(v => (Math.abs(v) < EPS ? 0 : v)))
  }
  if (!basis.length && rank < cols) {
    // fallback empty
  }
  return basis
}

function columnSpaceBasis(m: number[][]): number[][] {
  const { rref } = rrefAndRef(m)
  const pivotCols: number[] = []
  for (const row of rref) {
    const c = row.findIndex(v => Math.abs(v) > EPS)
    if (c >= 0) pivotCols.push(c)
  }
  return pivotCols.map(c => m.map(row => row[c]))
}

function rowSpaceBasis(m: number[][]): number[][] {
  const { rref } = rrefAndRef(m)
  return rref.filter(row => row.some(v => Math.abs(v) > EPS))
}

function cofactorMatrix(m: number[][]): number[][] {
  const n = m.length
  const C: number[][] = Array.from({ length: n }, () => Array(n).fill(0))
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const minor = m.filter((_, r) => r !== i).map(row => row.filter((_, c) => c !== j))
      const detMinor = minor.length ? Number(math.det(minor)) : 1
      C[i][j] = ((i + j) % 2 === 0 ? 1 : -1) * detMinor
    }
  }
  return C
}

function analyzeMatrix(m: number[][]): { sections: ResultSection[]; output: string; steps: string[]; detailedSteps: { step: string; explanation: string; math: string }[] } {
  const rows = m.length
  const cols = m[0].length
  const square = rows === cols
  const M = math.matrix(m)
  const sections: ResultSection[] = []
  const steps: string[] = []
  const detailedSteps: { step: string; explanation: string; math: string }[] = []

  const types = matrixTypeLabels(m)
  const diagonal = square ? m.map((row, i) => row[i]) : []

  sections.push(
    section('basic', 'Basic Matrix Information', 'properties', [
      field('Matrix', matrixToString(m)),
      field('Dimensions', `${rows} × ${cols}`),
      field('Number of rows', rows),
      field('Number of columns', cols),
      field('Square / rectangular', square ? 'Square' : 'Rectangular'),
      field('Matrix type', types.join(', ')),
      field('Elements', `${rows * cols} entries`),
      ...(square ? [field('Main diagonal', `[${diagonal.map(fmt).join(', ')}]`) ] : [])
    ], { matrixHeatmap: m, mathBlocks: [matrixToString(m)] })
  )

  steps.push(`Recognized ${rows}×${cols} matrix`)
  steps.push(`Type: ${types.join(', ')}`)
  detailedSteps.push({
    step: 'Matrix Recognition',
    explanation: `Parsed a ${rows}×${cols} ${square ? 'square' : 'rectangular'} matrix`,
    math: matrixToString(m)
  })

  const { ref, rref, rank, ops } = rrefAndRef(m)
  let det: number | null = null
  let trace: number | null = null
  let inv: number[][] | null = null
  let invertible = false

  if (square) {
    try {
      det = Number(math.det(M))
      if (Math.abs(det) < EPS) det = 0
    } catch { det = null }
    try {
      trace = Number(math.trace(M))
    } catch { trace = null }
    invertible = det !== null && Math.abs(det) > EPS
    if (invertible) {
      try {
        inv = toNumberMatrix(math.inv(M))
      } catch { inv = null }
    }
  }

  const nullity = cols - rank
  let frobenius = 0
  try {
    frobenius = Number(math.norm(M, 'fro'))
  } catch {
    frobenius = Math.sqrt(m.flat().reduce((s, v) => s + v * v, 0))
  }

  let condition: string = '—'
  try {
    if (square && invertible && inv) {
      // κ₂ ≈ ‖A‖_F · ‖A⁻¹‖_F (Frobenius estimate)
      const invNorm = Math.sqrt(inv.flat().reduce((s, v) => s + v * v, 0))
      condition = fmt(frobenius * invNorm)
    } else if (!square) {
      condition = 'Defined for square invertible matrices'
    } else {
      condition = 'Undefined (singular)'
    }
  } catch {
    condition = '—'
  }

  sections.push(
    section('properties', 'Matrix Properties', 'analysis', [
      ...(det !== null ? [field('Determinant', fmt(det), square && rows === 2 ? 'Signed area scaling of parallelogram' : 'Volume / area scaling factor')] : []),
      ...(trace !== null ? [field('Trace', fmt(trace))] : []),
      field('Rank', rank),
      field('Nullity', nullity, 'By rank-nullity: nullity = n − rank'),
      field('Frobenius norm', fmt(frobenius)),
      field('Condition number', condition),
      field('Invertibility', invertible ? 'Invertible (nonsingular)' : square ? 'Singular (not invertible)' : 'Not square — no two-sided inverse'),
      field('Singularity', square ? (invertible ? 'Nonsingular' : 'Singular') : 'N/A'),
      field('Absolute determinant |det|', det !== null ? fmt(Math.abs(det)) : '—')
    ])
  )

  // Positive definite (symmetric + eigenvalues > 0)
  if (square) {
    try {
      const sym = types.includes('Symmetric')
      if (sym) {
        const e = math.eigs(M) as unknown as {
          values: unknown
          eigenvectors?: { value: unknown; vector: unknown }[]
        }
        const vals = math.isMatrix(e.values as any)
          ? (e.values as math.Matrix).toArray().flat()
          : (Array.isArray(e.values) ? (e.values as unknown[]).flat() : [e.values])
        const nums = vals.map(v => (math.isComplex(v as any) ? (v as math.Complex).re : Number(v)))
        const pd = nums.every(v => v > EPS)
        const psd = nums.every(v => v >= -EPS)
        sections[sections.length - 1].fields.push(
          field('Positive definite', pd),
          field('Positive semidefinite', psd)
        )
      }
    } catch { /* skip */ }
  }

  const transpose = toNumberMatrix(math.transpose(M))
  sections.push(
    section('ops', 'Matrix Operations', 'operations', [
      field('Transpose Aᵀ', matrixToString(transpose)),
      field('Symmetric check', types.includes('Symmetric') ? 'A = Aᵀ' : 'A ≠ Aᵀ'),
      field('Skew-symmetric check', types.includes('Skew-symmetric') ? 'Aᵀ = −A' : 'Not skew-symmetric'),
      ...(inv ? [field('Inverse A⁻¹', matrixToString(inv))] : [field('Inverse A⁻¹', invertible ? '—' : 'Does not exist')]),
      field('Scalar example 2A', matrixToString(m.map(r => r.map(v => 2 * v)))),
      ...(square ? [field('A²', (() => {
        try { return matrixToString(toNumberMatrix(math.multiply(M, M))) } catch { return '—' }
      })())] : [])
    ], { mathBlocks: [`Aᵀ = ${matrixToString(transpose)}`] })
  )

  if (square && rows <= 6) {
    try {
      const C = cofactorMatrix(m)
      const adj = toNumberMatrix(math.transpose(math.matrix(C)))
      sections.push(
        section('inverse-detail', 'Inverse / Reduction Details', 'additional', [
          field('Cofactor matrix', matrixToString(C)),
          field('Adjugate (adj A)', matrixToString(adj)),
          field('REF', matrixToString(ref)),
          field('RREF', matrixToString(rref)),
          ...(inv && det !== null ? [field('Check A⁻¹ = (1/det) adj A', `det = ${fmt(det)}`)] : [])
        ], { mathBlocks: ops.slice(0, 12) })
      )
    } catch {
      sections.push(
        section('reduction', 'Row Reduction', 'additional', [
          field('REF', matrixToString(ref)),
          field('RREF', matrixToString(rref))
        ], { mathBlocks: ops.slice(0, 12) })
      )
    }
  } else {
    sections.push(
      section('reduction', 'Row Reduction', 'additional', [
        field('REF', matrixToString(ref)),
        field('RREF', matrixToString(rref))
      ], { mathBlocks: ops.slice(0, 12) })
    )
  }

  // Vector spaces
  const colBasis = columnSpaceBasis(m)
  const rowBasis = rowSpaceBasis(m)
  const nullBasis = nullSpaceBasis(m)
  sections.push(
    section('spaces', 'Vector Spaces', 'spaces', [
      field('Row space basis', rowBasis.length ? rowBasis.map(v => fmt(v)).join(' ; ') : '{0}'),
      field('Column space basis', colBasis.length ? colBasis.map(v => fmt(v)).join(' ; ') : '{0}'),
      field('Null space basis', nullBasis.length ? nullBasis.map(v => fmt(v)).join(' ; ') : '{0} (trivial)'),
      field('dim(row space)', rowBasis.length),
      field('dim(column space)', colBasis.length),
      field('dim(null space)', nullBasis.length),
      field('Rank–nullity', `${rank} + ${nullity} = ${cols}`)
    ])
  )

  // Eigen analysis
  if (square && rows <= 8) {
    try {
      const eigs = math.eigs(M) as unknown as {
        values: unknown
        eigenvectors?: { value: unknown; vector: unknown }[]
      }
      const valuesArr = math.isMatrix(eigs.values as any)
        ? (eigs.values as math.Matrix).toArray()
        : eigs.values
      const flatVals = (Array.isArray(valuesArr) ? (valuesArr as unknown[]).flat() : [valuesArr]) as unknown[]
      const eigValues = flatVals.map(v => fmt(v))

      let vectorsText = '—'
      const eigenPairs = eigs.eigenvectors ?? []
      if (eigenPairs.length) {
        vectorsText = eigenPairs
          .map((ev, i) => {
            const vec = math.isMatrix(ev.vector as any)
              ? toNumberMatrix(ev.vector).flat()
              : (ev.vector as number[])
            return `λ${i + 1}=${fmt(ev.value)} → ${fmt(vec)}`
          })
          .join('\n')
      }

      const charPoly = `det(A − λI) = 0  with roots λ = ${eigValues.join(', ')}`

      const mult = new Map<string, number>()
      for (const v of eigValues) mult.set(v, (mult.get(v) || 0) + 1)

      const diagonalizable =
        eigenPairs.length >= rows
          ? 'Likely diagonalizable (n eigenvectors returned)'
          : eigenPairs.length > 0
            ? `Returned ${eigenPairs.length} eigenvector(s) for ${rows}×${rows}`
            : 'Not fully determined'

      const spectralRadius = Math.max(
        ...flatVals.map(v => {
          if (typeof v === 'number') return Math.abs(v)
          if (math.isComplex(v as any)) {
            const c = v as math.Complex
            return Math.hypot(c.re, c.im)
          }
          return 0
        }),
        0
      )

      sections.push(
        section('eigen', 'Eigen Analysis', 'eigen', [
          field('Characteristic equation', 'det(A − λI) = 0'),
          field('Characteristic polynomial', charPoly),
          field('Eigenvalues', eigValues.join(', ')),
          field('Eigenvectors', vectorsText),
          field('Algebraic multiplicities', [...mult.entries()].map(([v, c]) => `${v}: ${c}`).join('; ')),
          field('Geometric multiplicity (reported)', String(eigenPairs.length)),
          field('Diagonalizability', diagonalizable),
          field('Spectral radius', fmt(spectralRadius))
        ])
      )

      detailedSteps.push({
        step: 'Eigenvalues',
        explanation: 'Solved det(A − λI) = 0',
        math: `λ = ${eigValues.join(', ')}`
      })
    } catch {
      sections.push(
        section('eigen', 'Eigen Analysis', 'eigen', [
          field('Status', 'Could not compute eigenvalues for this matrix')
        ])
      )
    }
  }

  // Factorizations
  const factorFields: ReturnType<typeof field>[] = []
  const factorBlocks: string[] = []
  if (square) {
    try {
      const lu = math.lup(M) as { L: math.Matrix; U: math.Matrix; p: number[] }
      factorFields.push(
        field('LU — L', matrixToString(toNumberMatrix(lu.L))),
        field('LU — U', matrixToString(toNumberMatrix(lu.U))),
        field('LU — pivot permutation', fmt(lu.p))
      )
      factorBlocks.push('A = P⁻¹ L U (mathjs lup)')
    } catch {
      factorFields.push(field('LU decomposition', 'Not available'))
    }
  }
  try {
    const qr = math.qr(M) as { Q: math.Matrix; R: math.Matrix }
    factorFields.push(
      field('QR — Q', matrixToString(toNumberMatrix(qr.Q))),
      field('QR — R', matrixToString(toNumberMatrix(qr.R)))
    )
  } catch {
    factorFields.push(field('QR decomposition', 'Not available'))
  }
  // SVD via eigenvalues of AᵀA (singular values = √λ)
  try {
    const AtA = math.multiply(math.transpose(M), M)
    const ataEigs = math.eigs(AtA) as unknown as { values: unknown }
    const ataVals = math.isMatrix(ataEigs.values as any)
      ? (ataEigs.values as math.Matrix).toArray().flat()
      : (Array.isArray(ataEigs.values) ? (ataEigs.values as unknown[]).flat() : [ataEigs.values])
    const singular = ataVals
      .map(v => Math.sqrt(Math.max(0, Number(math.isComplex(v as any) ? (v as math.Complex).re : v))))
      .sort((a, b) => b - a)
    factorFields.push(field('SVD — singular values (from √eig(AᵀA))', fmt(singular)))
  } catch {
    factorFields.push(field('SVD', 'Not available'))
  }
  // Cholesky when SPD (best-effort via mathjs if present)
  if (square && types.includes('Symmetric')) {
    try {
      const cholFn = (math as any).chol
      if (typeof cholFn === 'function') {
        const chol = cholFn(M)
        factorFields.push(field('Cholesky L', matrixToString(toNumberMatrix(chol))))
      } else {
        factorFields.push(field('Cholesky', 'Use LU / eigen decomposition for this build'))
      }
    } catch {
      factorFields.push(field('Cholesky', 'Not applicable (not positive definite)'))
    }
  }

  sections.push(section('factor', 'Matrix Factorizations', 'factorizations', factorFields, { mathBlocks: factorBlocks }))

  // Determinant expansion for 2×2 / 3×3
  if (square && (rows === 2 || rows === 3) && det !== null) {
    const blocks: string[] = []
    if (rows === 2) {
      blocks.push(`det(A) = (${fmt(m[0][0])})(${fmt(m[1][1])}) − (${fmt(m[0][1])})(${fmt(m[1][0])}) = ${fmt(det)}`)
    } else {
      blocks.push(`Cofactor expansion along row 1`)
      blocks.push(`det(A) = ${fmt(det)}`)
    }
    sections.push(
      section('determinant', 'Determinants', 'analysis', [
        field('Determinant', fmt(det)),
        field('Invertibility', invertible ? 'det ≠ 0 ⇒ invertible' : 'det = 0 ⇒ singular'),
        field('Geometric interpretation', rows === 2
          ? `|det| = area scaling of unit square under A`
          : `|det| = volume scaling of unit cube under A`),
        field('Rank relation', det === 0 ? 'det = 0 ⇒ rank < n' : 'det ≠ 0 ⇒ full rank')
      ], { mathBlocks: blocks })
    )
  }

  sections.push(
    section('viz', 'Matrix Visualization', 'visualization', [
      field('Heatmap', 'See color grid below'),
      field('Linear map', `T: ℝ^${cols} → ℝ^${rows},  T(x) = Ax`),
      field('Geometric interpretation', square
        ? 'Columns show where basis vectors eᵢ are sent'
        : `Maps ℝ^${cols} into a ${rank}-dimensional subspace of ℝ^${rows}`)
    ], { matrixHeatmap: m })
  )

  const output = square && det !== null
    ? `${rows}×${cols} matrix · det = ${fmt(det)} · rank = ${rank}`
    : `${rows}×${cols} matrix · rank = ${rank}`

  steps.push(`Rank = ${rank}, Nullity = ${nullity}`)
  if (det !== null) steps.push(`det(A) = ${fmt(det)}`)
  if (inv) steps.push(`Inverse computed`)
  steps.push(`RREF computed`)

  return { sections, output, steps, detailedSteps }
}

// ─── Vector analysis ────────────────────────────────────────────────────────

function analyzeVector(v: number[]): { sections: ResultSection[]; output: string; steps: string[] } {
  const n = v.length
  const mag = Math.hypot(...v)
  const unit = mag > EPS ? v.map(x => x / mag) : v.map(() => 0)
  const sections: ResultSection[] = []

  sections.push(
    section('vector', 'Vector', 'result', [
      field('Vector', fmt(v)),
      field('Dimension', n),
      field('Components', v.map((c, i) => `x${i + 1} = ${fmt(c)}`).join(', ')),
      field('Magnitude ‖v‖', fmt(mag)),
      field('Euclidean norm', fmt(mag)),
      field('Unit vector', mag > EPS ? fmt(unit) : 'Undefined (zero vector)'),
      field('Direction', mag > EPS ? `v / ‖v‖ = ${fmt(unit)}` : 'Undefined')
    ], { mathBlocks: [`v = ${fmt(v)}`, `‖v‖ = ${fmt(mag)}`] })
  )

  // 2D / 3D extras
  if (n === 2) {
    const angle = Math.atan2(v[1], v[0])
    sections.push(
      section('angle', 'Direction (2D)', 'analysis', [
        field('Angle from +x-axis', `${fmt((angle * 180) / Math.PI)}°`),
        field('Radians', fmt(angle))
      ])
    )
  }
  if (n === 3) {
    sections.push(
      section('cross-hint', '3D Operations', 'additional', [
        field('Cross product', 'Provide a second vector w to compute v × w'),
        field('Note', 'Enter two vectors as system or use v×w syntax in a future update')
      ])
    )
  }

  sections.push(
    section('viz', 'Visualization', 'visualization', [
      field('Plot', n <= 3 ? `Arrow from origin to ${fmt(v)} in ℝ^${n}` : `High-dimensional vector in ℝ^${n}`)
    ])
  )

  return {
    sections,
    output: `v = ${fmt(v)},  ‖v‖ = ${fmt(mag)}`,
    steps: [
      `Vector in ℝ^${n}`,
      `Components: ${fmt(v)}`,
      `‖v‖ = √(${v.map(x => `(${fmt(x)})²`).join(' + ')}) = ${fmt(mag)}`,
      mag > EPS ? `Unit vector = ${fmt(unit)}` : 'Zero vector has no direction'
    ]
  }
}

// ─── Arithmetic ─────────────────────────────────────────────────────────────

function analyzeArithmetic(expr: string, value: number): { sections: ResultSection[]; output: string; steps: string[] } {
  const exact = Number.isInteger(value) ? String(value) : toFraction(value)
  const decimal = fmt(value)
  const percent = fmt(value * 100) + '%'
  const mixed = toMixedNumber(value)
  const steps = [
    `Evaluating: ${expr}`,
    `Exact result: ${exact}`,
    `Decimal: ${decimal}`
  ]

  const fields = [
    field('Result', decimal),
    field('Exact form', exact),
    field('Decimal form', decimal),
    field('Fraction form', toFraction(value)),
    field('Mixed number', mixed),
    field('Percentage', percent)
  ]

  if (Number.isInteger(value) && Math.abs(value) >= 2) {
    fields.push(field('Prime factorization', primeFactors(value)))
  }

  // GCD/LCM if expression is like a+b or a,b with two integers
  const ints = expr.match(/-?\d+/g)?.map(Number) ?? []
  if (ints.length >= 2 && ints.every(Number.isInteger)) {
    const g = ints.reduce((a, b) => gcd(a, b))
    const l = ints.reduce((a, b) => lcm(a, b))
    fields.push(field('GCD of integers in input', g), field('LCM of integers in input', l))
  }

  const sections = [
    section('result', 'Result', 'result', fields, {
      mathBlocks: [`${expr} = ${exact}`]
    })
  ]

  return { sections, output: exact, steps }
}

// ─── Algebraic expression / polynomial ──────────────────────────────────────

function analyzeExpression(expr: string): { sections: ResultSection[]; output: string; steps: string[]; graphData?: any } | null {
  try {
    const simplified = math.simplify(expr).toString()
    let expanded = simplified
    try {
      const expandedNode = math.simplify(expr, {}, { exactFractions: true })
      expanded = expandedNode.toString()
      // mathjs: use rationalize / rewrite if available
      if (typeof (math as any).rationalize === 'function') {
        try {
          expanded = (math as any).rationalize(expr).toString()
        } catch { /* keep */ }
      }
    } catch { /* keep simplified */ }

    let factored = simplified
    try {
      // Manual quadratic factoring for ax^2+bx+c
      const quad = expr.replace(/\s+/g, '').match(/^([+-]?\d*)\*?([a-zA-Z])\^2([+-]\d*)\*?([a-zA-Z])?([+-]\d+)?$/)
      void quad
      if (typeof (math as any).factor === 'function') {
        factored = (math as any).factor(expr).toString()
      }
    } catch { /* keep */ }

    // Try simple integer quadratic factoring: x^2 + bx + c
    const simpleQuad = simplified.replace(/\s+/g, '').match(/^([a-zA-Z])\^2([+-]\d+)\1([+-]\d+)$/)
      || expr.replace(/\s+/g, '').match(/^([a-zA-Z])\^2([+-]\d+)\1([+-]\d+)$/)
    if (simpleQuad) {
      const variable = simpleQuad[1]
      const b = Number(simpleQuad[2])
      const c = Number(simpleQuad[3])
      for (let i = -Math.abs(c); i <= Math.abs(c); i++) {
        if (i !== 0 && c % i === 0) {
          const j = c / i
          if (i + j === b) {
            const f1 = i < 0 ? `${variable}${i}` : `${variable}+${i}`
            const f2 = j < 0 ? `${variable}${j}` : `${variable}+${j}`
            factored = `(${f1})(${f2})`
            break
          }
        }
      }
    }

    const node = math.parse(expr)
    const symbols = node.filter((n: any) => n.isSymbolNode).map((n: any) => n.name)
    const vars = [...new Set(symbols.filter((s: string) => !['pi', 'e', 'i'].includes(s)))]

    const sections: ResultSection[] = [
      section('result', 'Result', 'result', [
        field('Original expression', expr),
        field('Simplified expression', simplified),
        field('Expanded form', expanded),
        field('Factored form', factored),
        field('Alternative forms', [simplified, expanded, factored].filter((v, i, a) => a.indexOf(v) === i).join(' ; '))
      ])
    ]

    // Univariate polynomial extras
    if (vars.length === 1) {
      const variable = vars[0]
      try {
        const der1 = math.derivative(expr, variable).toString()
        const der2 = math.derivative(der1, variable).toString()
        const integ = `∫(${simplified}) d${variable} + C`

        // Degree / leading coeff via sampling polynomial structure
        let degree = '—'
        let leading = '—'
        let constant = '—'
        try {
          const poly = math.simplify(expr).toString()
          const degMatch = poly.match(new RegExp(`${variable}\\^(\\d+)`))
          degree = degMatch ? degMatch[1] : (poly.includes(variable) ? '1' : '0')
        } catch { /* */ }

        sections.push(
          section('analysis', 'Analysis', 'analysis', [
            field('Variable', variable),
            field('Degree (detected)', degree),
            field('Domain', 'ℝ (assuming polynomial / continuous expression)'),
            field('Derivative', der1),
            field('Second derivative', der2),
            field('Indefinite integral', integ),
            field('Leading coefficient', leading),
            field('Constant term', constant)
          ])
        )

        const points: { x: number; y: number }[] = []
        for (let x = -10; x <= 10; x += 0.1) {
          try {
            const y = Number(math.evaluate(simplified, { [String(variable)]: x } as Record<string, number>))
            if (Number.isFinite(y)) points.push({ x, y })
          } catch { /* */ }
        }

        const steps = [
          `Original: ${expr}`,
          `Simplified: ${simplified}`,
          factored !== simplified ? `Factored: ${factored}` : `Expanded: ${expanded}`,
          `f'(${variable}) = ${der1}`
        ]

        return {
          sections,
          output: factored !== simplified ? factored : simplified,
          steps,
          graphData: points.length ? { points, equation: simplified, range: { min: -10, max: 10 } } : undefined
        }
      } catch { /* fall through */ }
    }

    return {
      sections,
      output: simplified,
      steps: [`Original: ${expr}`, `Simplified: ${simplified}`, `Expanded: ${expanded}`]
    }
  } catch {
    return null
  }
}

// ─── Complex numbers ────────────────────────────────────────────────────────

function analyzeComplex(expr: string): { sections: ResultSection[]; output: string; steps: string[] } | null {
  try {
    const z = math.complex(math.evaluate(expr) as any)
    const re = z.re
    const im = z.im
    const abs = Math.hypot(re, im)
    const arg = Math.atan2(im, re)
    const sections = [
      section('complex', 'Complex Number', 'result', [
        field('Rectangular form', fmt(z)),
        field('Real part', fmt(re)),
        field('Imaginary part', fmt(im)),
        field('Complex conjugate', fmt(math.conj(z))),
        field('Absolute value |z|', fmt(abs)),
        field('Magnitude', fmt(abs)),
        field('Argument', `${fmt(arg)} rad = ${fmt((arg * 180) / Math.PI)}°`),
        field('Polar form', `${fmt(abs)} (cos(${fmt(arg)}) + i sin(${fmt(arg)}))`),
        field('Exponential form', `${fmt(abs)} e^(i·${fmt(arg)})`)
      ])
    ]
    return {
      sections,
      output: fmt(z),
      steps: [
        `z = ${fmt(z)}`,
        `|z| = ${fmt(abs)}`,
        `arg(z) = ${fmt(arg)}`,
        `conjugate = ${fmt(math.conj(z))}`
      ]
    }
  } catch {
    return null
  }
}

// ─── Statistics ─────────────────────────────────────────────────────────────

function analyzeStatistics(nums: number[]): { sections: ResultSection[]; output: string; steps: string[] } {
  const sorted = [...nums].sort((a, b) => a - b)
  const n = nums.length
  const sum = nums.reduce((a, b) => a + b, 0)
  const mean = sum / n
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2
  const freq = new Map<number, number>()
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1)
  const maxF = Math.max(...freq.values())
  const modes = [...freq.entries()].filter(([, f]) => f === maxF).map(([v]) => v)
  const variance = nums.reduce((s, x) => s + (x - mean) ** 2, 0) / n
  const std = Math.sqrt(variance)
  const q = (p: number) => {
    const idx = (n - 1) * p
    const lo = Math.floor(idx)
    const hi = Math.ceil(idx)
    if (lo === hi) return sorted[lo]
    return sorted[lo] * (hi - idx) + sorted[hi] * (idx - lo)
  }
  const q1 = q(0.25)
  const q3 = q(0.75)
  const iqr = q3 - q1
  const outliers = nums.filter(x => x < q1 - 1.5 * iqr || x > q3 + 1.5 * iqr)

  const sections = [
    section('stats', 'Statistics', 'result', [
      field('Count', n),
      field('Sum', fmt(sum)),
      field('Mean', fmt(mean)),
      field('Median', fmt(median)),
      field('Mode', modes.map(fmt).join(', ')),
      field('Minimum', fmt(sorted[0])),
      field('Maximum', fmt(sorted[n - 1])),
      field('Range', fmt(sorted[n - 1] - sorted[0])),
      field('Variance (population)', fmt(variance)),
      field('Standard deviation', fmt(std)),
      field('Q1', fmt(q1)),
      field('Q3', fmt(q3)),
      field('IQR', fmt(iqr)),
      field('Outliers', outliers.length ? outliers.map(fmt).join(', ') : 'None')
    ])
  ]

  return {
    sections,
    output: `mean = ${fmt(mean)}, median = ${fmt(median)}, σ = ${fmt(std)}`,
    steps: [`n = ${n}`, `Σ = ${fmt(sum)}`, `x̄ = ${fmt(mean)}`, `median = ${fmt(median)}`]
  }
}

// ─── System enrichment ──────────────────────────────────────────────────────

export function enrichSystemResult(
  raw: string,
  output: string,
  steps: string[],
  detailedSteps?: { step: string; explanation: string; math: string }[]
): ResultSection[] {
  return [
    section('input', 'Input', 'input', [field('Original system', raw)]),
    section('interpretation', 'Input Interpretation', 'interpretation', [
      field('Recognized as', 'System of linear equations')
    ]),
    section('result', 'Result', 'result', [
      field('Solution', output),
      field('Exact solution', output)
    ]),
    section('steps', 'Step-by-Step', 'steps', steps.map((s, i) => field(`Step ${i + 1}`, s)), {
      mathBlocks: detailedSteps?.map(d => d.math).filter(Boolean)
    }),
    section('additional', 'Additional Information', 'additional', [
      field('Method', 'Gaussian / Gauss–Jordan elimination'),
      field('Matrix representation', 'Converted to augmented matrix [A | b]'),
      field('Verification', 'Substitute solution back into each equation')
    ])
  ]
}

// ─── Universal section wrapper ──────────────────────────────────────────────

export function buildUniversalShell(opts: {
  raw: string
  interpretation: string
  kind: InputKind
  resultFields: ReturnType<typeof field>[]
  analysisSections?: ResultSection[]
  steps?: string[]
  additionalFields?: ReturnType<typeof field>[]
  graphNote?: string
}): ResultSection[] {
  const sections: ResultSection[] = [
    section('input', 'Input', 'input', [field('Expression', opts.raw)]),
    section('interpretation', 'Input Interpretation', 'interpretation', [
      field('Recognized as', opts.interpretation),
      field('Input type', opts.kind)
    ]),
    section('result', 'Result', 'result', opts.resultFields)
  ]
  if (opts.analysisSections?.length) sections.push(...opts.analysisSections)
  if (opts.graphNote) {
    sections.push(section('graph', 'Graph', 'graph', [field('Visualization', opts.graphNote)]))
  }
  if (opts.steps?.length) {
    sections.push(
      section('steps', 'Step-by-Step', 'steps', opts.steps.map((s, i) => field(`Step ${i + 1}`, s)))
    )
  }
  if (opts.additionalFields?.length) {
    sections.push(section('additional', 'Additional Information', 'additional', opts.additionalFields))
  }
  return sections
}

export interface RichAnalysis {
  kind: InputKind
  interpretation: string
  output: string
  steps: string[]
  detailedSteps?: { step: string; explanation: string; math: string }[]
  sections: ResultSection[]
  graphData?: {
    points: { x: number; y: number }[]
    equation: string
    range: { min: number; max: number }
    render?: 'scatter' | 'line'
  }
  topic: string
}

const TOPIC_FOR_KIND: Record<InputKind, string> = {
  matrix: 'Linear Algebra — Matrices',
  vector: 'Linear Algebra — Vectors',
  system: 'Linear Algebra — Systems',
  equation: 'Algebra — Equations',
  quadratic: 'Algebra — Quadratic',
  conic: 'Algebra — Conic Sections',
  curve: 'Algebra — Algebraic Curves',
  polynomial: 'Algebra — Polynomials',
  expression: 'Algebra',
  function: 'Functions',
  arithmetic: 'Arithmetic',
  calculus: 'Calculus',
  trigonometry: 'Trigonometry',
  complex: 'Complex Numbers',
  statistics: 'Statistics',
  geometry: 'Geometry',
  limit: 'Calculus — Limits',
  differential: 'Differential Equations',
  series: 'Series & Sequences',
  unknown: 'General'
}

/**
 * Attempt first-class rich analysis before / alongside the classic solver.
 * Returns null if this module should defer to the existing solver path.
 */
export function tryRichAnalysis(raw: string): RichAnalysis | null {
  const classified = classifyInput(raw)

  if (classified.kind === 'matrix' && classified.matrix) {
    const result = analyzeMatrix(classified.matrix)
    const shell = buildUniversalShell({
      raw,
      interpretation: classified.interpretation,
      kind: 'matrix',
      resultFields: [
        field('Summary', result.output),
        field('Exact forms', 'See Analysis sections below')
      ],
      analysisSections: result.sections,
      steps: result.steps
    })
    return {
      kind: 'matrix',
      interpretation: classified.interpretation,
      output: result.output,
      steps: result.steps,
      detailedSteps: result.detailedSteps,
      sections: shell,
      topic: TOPIC_FOR_KIND.matrix
    }
  }

  if (classified.kind === 'vector' && classified.vector) {
    const result = analyzeVector(classified.vector)
    const shell = buildUniversalShell({
      raw,
      interpretation: classified.interpretation,
      kind: 'vector',
      resultFields: [field('Summary', result.output)],
      analysisSections: result.sections,
      steps: result.steps,
      graphNote: classified.vector.length <= 3 ? 'Vector arrow in coordinate space' : undefined
    })
    return {
      kind: 'vector',
      interpretation: classified.interpretation,
      output: result.output,
      steps: result.steps,
      sections: shell,
      topic: TOPIC_FOR_KIND.vector
    }
  }

  if (classified.kind === 'statistics' && classified.numbers) {
    const result = analyzeStatistics(classified.numbers)
    return {
      kind: 'statistics',
      interpretation: classified.interpretation,
      output: result.output,
      steps: result.steps,
      sections: buildUniversalShell({
        raw,
        interpretation: classified.interpretation,
        kind: 'statistics',
        resultFields: result.sections[0]?.fields ?? [field('Result', result.output)],
        steps: result.steps
      }),
      topic: TOPIC_FOR_KIND.statistics
    }
  }

  if (classified.kind === 'complex') {
    const result = analyzeComplex(raw)
    if (result) {
      return {
        kind: 'complex',
        interpretation: classified.interpretation,
        output: result.output,
        steps: result.steps,
        sections: buildUniversalShell({
          raw,
          interpretation: classified.interpretation,
          kind: 'complex',
          resultFields: result.sections[0]?.fields ?? [],
          steps: result.steps,
          graphNote: 'Point in the complex plane'
        }),
        topic: TOPIC_FOR_KIND.complex
      }
    }
  }

  if (classified.kind === 'arithmetic' && classified.expression) {
    try {
      const value = Number(math.evaluate(classified.expression))
      if (Number.isFinite(value)) {
        const result = analyzeArithmetic(classified.expression, value)
        return {
          kind: 'arithmetic',
          interpretation: classified.interpretation,
          output: result.output,
          steps: result.steps,
          sections: buildUniversalShell({
            raw,
            interpretation: classified.interpretation,
            kind: 'arithmetic',
            resultFields: result.sections[0]?.fields ?? [],
            steps: result.steps
          }),
          topic: TOPIC_FOR_KIND.arithmetic
        }
      }
    } catch { /* defer */ }
  }

  if (
    classified.kind === 'conic' ||
    classified.kind === 'curve' ||
    (classified.kind === 'quadratic' && looksLikeBivariatePolynomial(raw))
  ) {
    const result = analyzeBivariateEquation(classified.expression ?? raw, raw)
    if (result) {
      return {
        kind: result.kind,
        interpretation: result.interpretation,
        output: result.output,
        steps: result.steps,
        detailedSteps: result.detailedSteps,
        sections: result.sections,
        graphData: result.graphData,
        topic: TOPIC_FOR_KIND[result.kind]
      }
    }
  }

  if (classified.kind === 'quadratic' && classified.expression?.includes('=')) {
    // Univariate quadratic — defer to classic solver path
    return null
  }

  // Pure algebraic expression (no equation) — enrich
  if (
    (classified.kind === 'expression' || classified.kind === 'polynomial' || classified.kind === 'function' || classified.kind === 'trigonometry') &&
    classified.expression &&
    !classified.expression.includes('=')
  ) {
    const result = analyzeExpression(classified.expression)
    if (result) {
      return {
        kind: classified.kind,
        interpretation: classified.interpretation,
        output: result.output,
        steps: result.steps,
        sections: buildUniversalShell({
          raw,
          interpretation: classified.interpretation,
          kind: classified.kind,
          resultFields: [
            field('Simplified', result.output),
            ...(result.sections[0]?.fields ?? [])
          ],
          analysisSections: result.sections.slice(1),
          steps: result.steps,
          graphNote: result.graphData ? 'Interactive graph available' : undefined
        }),
        graphData: result.graphData,
        topic: TOPIC_FOR_KIND[classified.kind]
      }
    }
  }

  // System / equation / calculus: defer to classic solver but classification available
  return null
}

function pt(x: number, y: number): string {
  return `(${fmt(x)}, ${fmt(y)})`
}

function unitVec(vx: number, vy: number): { x: number; y: number } {
  const n = Math.hypot(vx, vy) || 1
  return { x: vx / n, y: vy / n }
}

type BivariateAnalysis = {
  kind: 'conic' | 'curve'
  interpretation: string
  sections: ResultSection[]
  output: string
  steps: string[]
  detailedSteps: { step: string; explanation: string; math: string }[]
  graphData?: {
    points: { x: number; y: number }[]
    equation: string
    range: { min: number; max: number }
    render?: 'scatter' | 'line'
  }
}

/** Route bivariate F(x,y)=0 to conic analyzer (deg 2) or general algebraic-curve analyzer. */
function analyzeBivariateEquation(normalizedOrRaw: string, displayRaw: string): BivariateAnalysis | null {
  try {
    const normalized = normalizeConicExpression(normalizedOrRaw)
    const parts = normalized.split('=')
    if (parts.length !== 2) return null
    const expression = `(${parts[0]})-(${parts[1]})`
    const node = math.parse(expression)
    const vars = extractBivariateVars(normalized)
    if (!vars) return null
    const [x, y] = vars.includes('x') && vars.includes('y') ? ['x', 'y'] : vars.slice().sort()
    const degree = polynomialDegree(node, new Set([x, y]))

    if (degree === 2) {
      const conic = analyzeConicEquation(normalized, displayRaw)
      if (!conic) return null
      return {
        kind: 'conic',
        interpretation: 'Quadratic equation in two variables → conic section',
        ...conic
      }
    }

    const curve = analyzeAlgebraicCurve(normalized, displayRaw, expression, node, x, y, degree)
    return curve
  } catch {
    return null
  }
}

function evalXY(expr: string, xName: string, yName: string, x: number, y: number): number {
  try {
    const v = Number(math.evaluate(expr, { [xName]: x, [yName]: y }))
    return Number.isFinite(v) ? v : NaN
  } catch {
    return NaN
  }
}

function powerInKey(key: string, variable: string): number {
  if (key === '1' || !key) return 0
  // Match variable with optional ^n, not as a prefix of a longer name
  const re = new RegExp(`(?:^|[^a-zA-Z])${variable}(?:\\^(\\d+))?(?![a-zA-Z])`, 'g')
  // Keys are like "x^2", "xy", "y", "x^3y^2" without separators — handle tightly
  const tight = new RegExp(`${variable}(?:\\^(\\d+))?`, 'g')
  let total = 0
  let m: RegExpExecArray | null
  const src = key
  // Prefer scanning the compact monomial key
  while ((m = tight.exec(src))) {
    // Avoid double-counting overlapping — for "xy" first match x then y separately when called per var
    total += m[1] ? Number(m[1]) : 1
    // Only one occurrence of each variable in our keys
    break
  }
  void re
  return total
}

/** Coefficients of F(t,0) or F(0,t): c0 + c1 t + c2 t^2 + … */
function axisPolynomialCoeffs(
  monos: Map<string, number>,
  activeVar: string,
  inactiveVar: string
): number[] {
  const byDeg = new Map<number, number>()
  for (const [key, c] of monos) {
    if (Math.abs(c) < 1e-14) continue
    const inactivePow = powerInKey(key, inactiveVar)
    if (inactivePow !== 0) continue
    const deg = powerInKey(key, activeVar)
    byDeg.set(deg, (byDeg.get(deg) || 0) + c)
  }
  const maxDeg = byDeg.size ? Math.max(...byDeg.keys()) : 0
  const coeffs = Array.from({ length: maxDeg + 1 }, (_, i) => byDeg.get(i) || 0)
  return coeffs
}

/** Real roots of c0 + c1 t + … + cn t^n = 0 */
function solveRealPolynomial(coeffsIn: number[]): number[] {
  let coeffs = [...coeffsIn]
  while (coeffs.length > 1 && Math.abs(coeffs[coeffs.length - 1]) < 1e-12) coeffs.pop()
  // Strip trailing zero constant-only leading from low end only if entire poly is 0
  if (coeffs.every(c => Math.abs(c) < 1e-12)) return [] // identically 0 → whole axis (handled by caller)

  const n = coeffs.length - 1
  if (n < 0) return []
  if (n === 0) return [] // nonzero constant → no root
  if (n === 1) {
    return Number.isFinite(-coeffs[0] / coeffs[1]) ? [-coeffs[0] / coeffs[1]] : []
  }
  if (n === 2) {
    const [c, b, a] = coeffs
    const disc = b * b - 4 * a * c
    if (disc < -1e-12) return []
    if (Math.abs(disc) <= 1e-12) return [-b / (2 * a)]
    const s = Math.sqrt(Math.max(0, disc))
    return [(-b + s) / (2 * a), (-b - s) / (2 * a)]
  }
  if (n === 3) {
    // Cardano / numeric fallback via companion
  }

  // Companion-matrix eigenvalues for degree >= 3 (and as fallback)
  try {
    const an = coeffs[n]
    if (Math.abs(an) < 1e-14) return solveRealPolynomial(coeffs.slice(0, -1))
    const monic = coeffs.map(c => c / an) // t^n + a_{n-1} t^{n-1} + ... + a0
    // Companion matrix (Frobenius): size n×n
    const M: number[][] = Array.from({ length: n }, () => Array(n).fill(0))
    for (let i = 0; i < n - 1; i++) M[i + 1][i] = 1
    for (let j = 0; j < n; j++) M[j][n - 1] = -monic[j]
    const eigs = math.eigs(math.matrix(M)) as unknown as { values: unknown }
    const valuesArr = math.isMatrix(eigs.values as any)
      ? (eigs.values as math.Matrix).toArray().flat()
      : (Array.isArray(eigs.values) ? (eigs.values as unknown[]).flat() : [eigs.values])
    const roots: number[] = []
    for (const v of valuesArr) {
      if (typeof v === 'number' && Number.isFinite(v)) {
        roots.push(v)
      } else if (math.isComplex(v as any)) {
        const c = v as math.Complex
        if (Math.abs(c.im) < 1e-8) roots.push(c.re)
      }
    }
    return roots
  } catch {
    return []
  }
}

function polishRoot(g: (t: number) => number, t0: number, iters = 20): number | null {
  let t = t0
  for (let i = 0; i < iters; i++) {
    const gt = g(t)
    if (!Number.isFinite(gt)) return null
    if (Math.abs(gt) < 1e-12) return t
    const h = Math.max(1e-7, Math.abs(t) * 1e-7)
    const gp = (g(t + h) - g(t - h)) / (2 * h)
    if (!Number.isFinite(gp) || Math.abs(gp) < 1e-14) break
    const step = gt / gp
    t -= step
    if (Math.abs(step) < 1e-12) break
  }
  return Math.abs(g(t)) < 1e-7 ? t : null
}

/**
 * Accurate axis intercepts via univariate polynomial restriction + numeric polish.
 * x-intercepts: F(x,0)=0; y-intercepts: F(0,y)=0.
 */
function findAxisInterceptsAccurate(
  expression: string,
  monos: Map<string, number> | null,
  xName: string,
  yName: string,
  search: { min: number; max: number } = { min: -20, max: 20 }
): { xIntercepts: number[]; yIntercepts: number[]; xAxisIdenticallyZero: boolean; yAxisIdenticallyZero: boolean } {
  const collect = (active: string, inactive: string, g: (t: number) => number) => {
    let identicallyZero = false
    const roots: number[] = []

    if (monos) {
      const coeffs = axisPolynomialCoeffs(monos, active, inactive)
      identicallyZero = coeffs.every(c => Math.abs(c) < 1e-12)
      if (identicallyZero) return { roots: [], identicallyZero: true }
      for (const r of solveRealPolynomial(coeffs)) {
        if (Number.isFinite(r)) roots.push(r)
      }
    }

    // Dense scan + Newton to catch anything the companion missed / no monos
    const step = 0.02
    let prevT = search.min
    let prevV = g(prevT)
    for (let t = search.min + step; t <= search.max + 1e-12; t += step) {
      const v = g(t)
      if (Number.isFinite(prevV) && Number.isFinite(v)) {
        if (Math.abs(prevV) < 1e-10) {
          roots.push(prevT)
        } else if (prevV * v < 0) {
          const tLin = prevT - prevV * (t - prevT) / (v - prevV)
          const polished = polishRoot(g, tLin)
          if (polished !== null) roots.push(polished)
        } else if (Math.abs(v) < 1e-10) {
          roots.push(t)
        }
      }
      prevT = t
      prevV = v
    }

    // Polish algebraic roots too
    const polished = roots
      .map(r => polishRoot(g, r) ?? r)
      .filter(r => Number.isFinite(r) && Math.abs(g(r)) < 1e-6)

    // Unique
    polished.sort((a, b) => a - b)
    const uniq: number[] = []
    for (const r of polished) {
      if (!uniq.some(u => Math.abs(u - r) < 1e-5)) uniq.push(r)
    }
    return { roots: uniq, identicallyZero: false }
  }

  const xRes = collect(xName, yName, t => evalXY(expression, xName, yName, t, 0))
  const yRes = collect(yName, xName, t => evalXY(expression, xName, yName, 0, t))

  return {
    xIntercepts: xRes.roots,
    yIntercepts: yRes.roots,
    xAxisIdenticallyZero: xRes.identicallyZero,
    yAxisIdenticallyZero: yRes.identicallyZero
  }
}

/** Newton polish a point toward F=0 along ∇F. */
function polishCurvePoint(
  expression: string,
  fx: string,
  fy: string,
  xName: string,
  yName: string,
  p: { x: number; y: number },
  iters = 8
): { x: number; y: number } | null {
  let { x, y } = p
  for (let i = 0; i < iters; i++) {
    const F = evalXY(expression, xName, yName, x, y)
    if (!Number.isFinite(F)) return null
    if (Math.abs(F) < 1e-10) return { x, y }
    const Fx = evalXY(fx, xName, yName, x, y)
    const Fy = evalXY(fy, xName, yName, x, y)
    const g2 = Fx * Fx + Fy * Fy
    if (!Number.isFinite(g2) || g2 < 1e-16) return Math.abs(F) < 1e-6 ? { x, y } : null
    x -= (F * Fx) / g2
    y -= (F * Fy) / g2
  }
  const F = evalXY(expression, xName, yName, x, y)
  return Number.isFinite(F) && Math.abs(F) < 1e-5 ? { x, y } : null
}

/** Sample the zero set F(x,y)=0 with adaptive window + Newton polish. */
function sampleImplicitCurve(
  expression: string,
  xName: string,
  yName: string,
  fx: string,
  fy: string,
  seedRange: { xmin: number; xmax: number; ymin: number; ymax: number },
  steps = 100
): { points: { x: number; y: number }[]; range: { xmin: number; xmax: number; ymin: number; ymax: number } } {
  const collectIn = (range: { xmin: number; xmax: number; ymin: number; ymax: number }, n: number) => {
    const raw: { x: number; y: number }[] = []
    const dx = (range.xmax - range.xmin) / n
    const dy = (range.ymax - range.ymin) / n

    for (let i = 0; i <= n; i++) {
      const x = range.xmin + i * dx
      let prevY = range.ymin
      let prevV = evalXY(expression, xName, yName, x, prevY)
      for (let j = 1; j <= n; j++) {
        const y = range.ymin + j * dy
        const v = evalXY(expression, xName, yName, x, y)
        if (Number.isFinite(prevV) && Number.isFinite(v) && prevV * v <= 0) {
          const t = Math.abs(prevV) + Math.abs(v) < 1e-15
            ? 0.5
            : Math.abs(prevV) / (Math.abs(prevV) + Math.abs(v))
          raw.push({ x, y: prevY + t * (y - prevY) })
        }
        prevY = y
        prevV = v
      }
    }
    for (let j = 0; j <= n; j++) {
      const y = range.ymin + j * dy
      let prevX = range.xmin
      let prevV = evalXY(expression, xName, yName, prevX, y)
      for (let i = 1; i <= n; i++) {
        const x = range.xmin + i * dx
        const v = evalXY(expression, xName, yName, x, y)
        if (Number.isFinite(prevV) && Number.isFinite(v) && prevV * v <= 0) {
          const t = Math.abs(prevV) + Math.abs(v) < 1e-15
            ? 0.5
            : Math.abs(prevV) / (Math.abs(prevV) + Math.abs(v))
          raw.push({ x: prevX + t * (x - prevX), y })
        }
        prevX = x
        prevV = v
      }
    }
    return raw
  }

  // Try seed range, then expand if too few hits
  let range = { ...seedRange }
  let raw = collectIn(range, steps)
  if (raw.length < 12) {
    range = {
      xmin: seedRange.xmin * 2,
      xmax: seedRange.xmax * 2,
      ymin: seedRange.ymin * 2,
      ymax: seedRange.ymax * 2
    }
    raw = collectIn(range, steps)
  }
  if (raw.length < 8) {
    range = { xmin: -20, xmax: 20, ymin: -20, ymax: 20 }
    raw = collectIn(range, Math.max(steps, 120))
  }

  // Polish + dedupe
  const polished: { x: number; y: number }[] = []
  for (const p of raw) {
    const q = polishCurvePoint(expression, fx, fy, xName, yName, p)
    if (!q) continue
    if (!polished.some(u => Math.hypot(u.x - q.x, u.y - q.y) < 0.03)) {
      polished.push(q)
    }
  }

  // Tight bounding box around found points (with margin)
  if (polished.length >= 2) {
    const xs = polished.map(p => p.x)
    const ys = polished.map(p => p.y)
    const xmin = Math.min(...xs)
    const xmax = Math.max(...xs)
    const ymin = Math.min(...ys)
    const ymax = Math.max(...ys)
    const mx = Math.max(0.75, (xmax - xmin) * 0.15)
    const my = Math.max(0.75, (ymax - ymin) * 0.15)
    range = { xmin: xmin - mx, xmax: xmax + mx, ymin: ymin - my, ymax: ymax + my }

    // Resample denser in the tight window for a cleaner graph
    const dense = collectIn(range, Math.max(steps, 110))
    for (const p of dense) {
      const q = polishCurvePoint(expression, fx, fy, xName, yName, p)
      if (!q) continue
      if (!polished.some(u => Math.hypot(u.x - q.x, u.y - q.y) < 0.025)) {
        polished.push(q)
      }
    }
  }

  return { points: polished, range }
}

function findCriticalPoints(
  fx: string,
  fy: string,
  xName: string,
  yName: string,
  range: { xmin: number; xmax: number; ymin: number; ymax: number }
): { x: number; y: number }[] {
  const seeds: { x: number; y: number }[] = []
  const n = 28
  const dx = (range.xmax - range.xmin) / n
  const dy = (range.ymax - range.ymin) / n
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      let x = range.xmin + i * dx
      let y = range.ymin + j * dy
      for (let k = 0; k < 14; k++) {
        const Fx = evalXY(fx, xName, yName, x, y)
        const Fy = evalXY(fy, xName, yName, x, y)
        if (!Number.isFinite(Fx) || !Number.isFinite(Fy)) break
        const h = 1e-5
        const fxx = (evalXY(fx, xName, yName, x + h, y) - Fx) / h
        const fxy = (evalXY(fx, xName, yName, x, y + h) - Fx) / h
        const fyx = (evalXY(fy, xName, yName, x + h, y) - Fy) / h
        const fyy = (evalXY(fy, xName, yName, x, y + h) - Fy) / h
        const det = fxx * fyy - fxy * fyx
        if (Math.abs(det) < 1e-14) break
        const dxN = (-Fx * fyy + Fy * fxy) / det
        const dyN = (-fxx * Fy + fyx * Fx) / det
        x += dxN
        y += dyN
        if (Math.hypot(dxN, dyN) < 1e-9) break
      }
      const Fx = evalXY(fx, xName, yName, x, y)
      const Fy = evalXY(fy, xName, yName, x, y)
      if (
        Number.isFinite(x) && Number.isFinite(y) &&
        Math.hypot(Fx, Fy) < 1e-5 &&
        x >= range.xmin - 2 && x <= range.xmax + 2 &&
        y >= range.ymin - 2 && y <= range.ymax + 2
      ) {
        if (!seeds.some(p => Math.hypot(p.x - x, p.y - y) < 0.04)) {
          seeds.push({ x, y })
        }
      }
    }
  }
  return seeds
}

function formatInterceptList(
  values: number[],
  identicallyZero: boolean,
  axisLabel: string
): string {
  if (identicallyZero) return `Entire ${axisLabel}-axis lies on the curve`
  if (!values.length) return 'None (no real intercept in search range)'
  return values.map(v => fmt(v)).join(', ')
}

function analyzeAlgebraicCurve(
  normalized: string,
  displayRaw: string,
  expression: string,
  node: any,
  x: string,
  y: string,
  degree: number
): BivariateAnalysis | null {
  try {
    const monos = collectMonomials(node, [x, y])
    const terms = [...monos.entries()]
      .filter(([, c]) => Math.abs(c) > 1e-12)
      .sort((a, b) => {
        const deg = (k: string) => powerInKey(k, x) + powerInKey(k, y)
        return deg(b[0]) - deg(a[0]) || a[0].localeCompare(b[0])
      })

    const termText = terms
      .map(([k, c], i) => {
        const abs = Math.abs(c)
        const coeff = abs === 1 && k !== '1' ? '' : fmt(abs)
        const body = k === '1' ? (coeff || '1') : `${coeff}${k}`
        if (i === 0) return c < 0 ? `-${body}` : body
        return c < 0 ? ` - ${body}` : ` + ${body}`
      })
      .join('')

    const fx = math.simplify(math.derivative(expression, x)).toString()
    const fy = math.simplify(math.derivative(expression, y)).toString()
    const fxx = math.simplify(math.derivative(fx, x)).toString()
    const fyy = math.simplify(math.derivative(fy, y)).toString()
    const fxy = math.simplify(math.derivative(fx, y)).toString()

    const seedRange = { xmin: -8, xmax: 8, ymin: -8, ymax: 8 }
    const sampled = sampleImplicitCurve(expression, x, y, fx, fy, seedRange, 100)
    const curvePoints = sampled.points
    const range = sampled.range
    const critical = findCriticalPoints(fx, fy, x, y, range)

    const intercepts = findAxisInterceptsAccurate(expression, monos, x, y, { min: -25, max: 25 })

    // Include intercept points in the graph sample
    for (const xi of intercepts.xIntercepts) {
      const p = { x: xi, y: 0 }
      if (Math.abs(evalXY(expression, x, y, p.x, p.y)) < 1e-5) {
        if (!curvePoints.some(u => Math.hypot(u.x - p.x, u.y - p.y) < 0.03)) curvePoints.push(p)
      }
    }
    for (const yi of intercepts.yIntercepts) {
      const p = { x: 0, y: yi }
      if (Math.abs(evalXY(expression, x, y, p.x, p.y)) < 1e-5) {
        if (!curvePoints.some(u => Math.hypot(u.x - p.x, u.y - p.y) < 0.03)) curvePoints.push(p)
      }
    }

    const residuals = curvePoints.map(p => Math.abs(evalXY(expression, x, y, p.x, p.y)))
    const maxResidual = residuals.length ? Math.max(...residuals.filter(Number.isFinite), 0) : 0
    const meanResidual = residuals.length
      ? residuals.filter(Number.isFinite).reduce((a, b) => a + b, 0) / residuals.length
      : 0

    const degLabel = Number.isFinite(degree) ? String(degree) : 'unknown'
    const curveType =
      degree === 1 ? 'Line (linear relation)' :
      degree === 3 ? 'Cubic algebraic curve' :
      degree === 4 ? 'Quartic algebraic curve' :
      `Algebraic curve of degree ${degLabel}`

    const xIntText = formatInterceptList(intercepts.xIntercepts, intercepts.xAxisIdenticallyZero, x)
    const yIntText = formatInterceptList(intercepts.yIntercepts, intercepts.yAxisIdenticallyZero, y)

    const steps = [
      `Input: ${displayRaw}`,
      `Normalize: ${normalized}`,
      `Detect variables: ${x}, ${y}`,
      `Detect degree: ${degLabel}`,
      `Expanded / collected form: ${termText} = 0`,
      `Classification: ${curveType}`,
      `${x}-intercepts (set ${y}=0): ${xIntText}`,
      `${y}-intercepts (set ${x}=0): ${yIntText}`,
      `∂F/∂${x} = ${fx}`,
      `∂F/∂${y} = ${fy}`,
      `Sampled ${curvePoints.length} polished points on F(${x},${y}) = 0`,
      `Max |F| on sample ≈ ${fmt(maxResidual)}, mean ≈ ${fmt(meanResidual)}`
    ]

    const detailedSteps = [
      { step: 'Normalize', explanation: 'Rewrite unicode operators and glued powers into CAS form.', math: normalized },
      { step: 'Variables & degree', explanation: 'Identify the two indeterminates and total polynomial degree.', math: `vars={${x},${y}}, deg=${degLabel}` },
      { step: 'Monomial collection', explanation: 'Expand and combine like terms.', math: `${termText} = 0` },
      {
        step: 'Axis intercepts',
        explanation: `Solve F(${x},0)=0 and F(0,${y})=0 as univariate polynomials, then Newton-polish.`,
        math: `${x}-int: ${xIntText}; ${y}-int: ${yIntText}`
      },
      { step: 'Derivatives', explanation: 'Partials for implicit differentiation and polishing.', math: `F_${x}=${fx}; F_${y}=${fy}` },
      {
        step: 'Zero-set sampling',
        explanation: 'Adaptive grid sign-changes + Newton projection onto F=0.',
        math: `${curvePoints.length} points, window [${fmt(range.xmin)},${fmt(range.xmax)}]×[${fmt(range.ymin)},${fmt(range.ymax)}]`
      }
    ]

    const sections: ResultSection[] = [
      section('input', 'Input', 'input', [
        field('Equation', displayRaw),
        field('Normalized form', normalized)
      ]),
      section('interpretation', 'Input Interpretation', 'interpretation', [
        field('Recognized as', curveType),
        field('Pipeline', 'Input → Normalize → Variables → Degree → Algebraic-curve analyzer'),
        field('Input type', 'curve')
      ]),
      section('result', 'Result', 'result', [
        field('Geometric figure', curveType),
        field('Solution set', `Real algebraic curve F(${x},${y}) = 0 of degree ${degLabel}`),
        field('Standard form', `${termText} = 0`),
        field(`${x}-intercepts`, xIntText),
        field(`${y}-intercepts`, yIntText)
      ]),
      section('analysis', 'Analysis', 'analysis', [
        field('Equation', displayRaw),
        field('Variables', `${x}, ${y}`),
        field('Degree', degLabel),
        field('Number of monomial terms', terms.length),
        field('Collected polynomial', `${termText} = 0`),
        ...terms.slice(0, 24).map(([k, c]) => field(`Coefficient of ${k === '1' ? 'constant' : k}`, fmt(c))),
        field('Curve classification', curveType),
        field('Conic?', 'No — degree ≠ 2 (conic analysis does not apply)')
      ]),
      section('intercepts', 'Intercepts', 'properties', [
        field(`${x}-intercepts (${y}=0)`, xIntText),
        field(`${y}-intercepts (${x}=0)`, yIntText),
        field('Method', 'Univariate polynomial restriction + eigenvalue roots + Newton polish'),
        ...intercepts.xIntercepts.map((v, i) =>
          field(`${x}-intercept point ${i + 1}`, pt(v, 0), `|F|≈${fmt(Math.abs(evalXY(expression, x, y, v, 0)))}`)
        ),
        ...intercepts.yIntercepts.map((v, i) =>
          field(`${y}-intercept point ${i + 1}`, pt(0, v), `|F|≈${fmt(Math.abs(evalXY(expression, x, y, 0, v)))}`)
        )
      ]),
      section('calculus', 'Derivatives', 'additional', [
        field(`∂F/∂${x}`, fx),
        field(`∂F/∂${y}`, fy),
        field(`∂²F/∂${x}²`, fxx),
        field(`∂²F/∂${y}²`, fyy),
        field(`∂²F/∂${x}∂${y}`, fxy),
        field(`Implicit derivative d${y}/d${x}`, `−(${fx}) / (${fy})`),
        field('Singular points hint', 'Where F = Fₓ = Fᵧ = 0 simultaneously')
      ]),
      section('critical', 'Critical Points of F', 'properties', [
        field('Search window', `[${fmt(range.xmin)}, ${fmt(range.xmax)}] × [${fmt(range.ymin)}, ${fmt(range.ymax)}]`),
        field('Critical points ∇F = 0', critical.length ? critical.map(p => pt(p.x, p.y)).join(' ; ') : 'None found in window'),
        field('Note', 'These are extrema of F, not necessarily points on the curve F = 0')
      ]),
      section('graph', 'Graph', 'graph', [
        field('Graph points', `${curvePoints.length} Newton-polished samples`),
        field('Plot window', `[${fmt(range.xmin)}, ${fmt(range.xmax)}] × [${fmt(range.ymin)}, ${fmt(range.ymax)}]`),
        field('Sample residual max |F|', fmt(maxResidual), maxResidual < 1e-4 ? 'High accuracy' : maxResidual < 0.01 ? 'Good fit' : 'Coarse'),
        field('Sample residual mean |F|', fmt(meanResidual))
      ]),
      section('steps', 'Step-by-Step Derivation', 'steps',
        steps.map((s, i) => field(`Step ${i + 1}`, s)),
        { mathBlocks: detailedSteps.map(d => d.math) }
      )
    ]

    const xs = curvePoints.map(p => p.x)
    const graphData = curvePoints.length
      ? {
          points: curvePoints,
          equation: displayRaw,
          range: {
            min: xs.length ? Math.min(...xs) - 0.5 : range.xmin,
            max: xs.length ? Math.max(...xs) + 0.5 : range.xmax
          },
          render: 'scatter' as const
        }
      : undefined

    return {
      kind: 'curve',
      interpretation: `${curveType} in ${x}, ${y}`,
      sections,
      output: `${curveType}: ${termText} = 0 · ${x}-int ${xIntText} · ${y}-int ${yIntText}`,
      steps,
      detailedSteps,
      graphData
    }
  } catch {
    return null
  }
}

/**
 * Full conic-section analyzer for Ax² + Bxy + Cy² + Dx + Ey + F = 0.
 * Pipeline: Input → Normalize → Variables → Degree → Conic analyzer → geometry.
 */
function analyzeConicEquation(normalizedOrRaw: string, displayRaw: string): {
  sections: ResultSection[]
  output: string
  steps: string[]
  detailedSteps: { step: string; explanation: string; math: string }[]
  graphData?: {
    points: { x: number; y: number }[]
    equation: string
    range: { min: number; max: number }
    render?: 'scatter' | 'line'
  }
} | null {
  try {
    const normalized = normalizeConicExpression(normalizedOrRaw)
    const parts = normalized.split('=')
    if (parts.length !== 2) return null

    // Bring to F(x,y) = 0
    const expression = `(${parts[0]})-(${parts[1]})`
    const node = math.parse(expression)
    const vars: string[] = Array.from(new Set<string>(
      node.filter((n: any) => n.isSymbolNode).map((n: any) => String(n.name))
    )).filter(v => !['pi', 'e', 'i'].includes(v))

    if (vars.length !== 2) return null
    // Prefer conventional x,y ordering when present
    const [x, y] = vars.includes('x') && vars.includes('y')
      ? ['x', 'y']
      : vars.slice().sort()

    const at0: Record<string, number> = { [x]: 0, [y]: 0 }
    const evalAt0 = (expr: string) => Number(math.evaluate(expr, at0))

    const fx = math.derivative(expression, x).toString()
    const fy = math.derivative(expression, y).toString()
    const fxx = math.derivative(fx, x).toString()
    const fxy = math.derivative(fx, y).toString()
    const fyy = math.derivative(fy, y).toString()

    // Ax² + Bxy + Cy² + Dx + Ey + F
    const A = evalAt0(fxx) / 2
    const B = evalAt0(fxy)
    const C = evalAt0(fyy) / 2
    const D = evalAt0(fx)
    const E = evalAt0(fy)
    const F = evalAt0(expression)

    if (![A, B, C, D, E, F].every(Number.isFinite)) return null

    // Degenerate check / classification
    const disc = B * B - 4 * A * C
    const I = A + C
    const delta = Number(math.det([
      [A, B / 2, D / 2],
      [B / 2, C, E / 2],
      [D / 2, E / 2, F]
    ]))
    const qDet = A * C - (B * B) / 4

    let type = 'Degenerate conic'
    let typeHint = ''
    if (Math.abs(delta) > EPS) {
      if (disc < -EPS) {
        // Ellipse family
        if (delta / I < 0) {
          type = Math.abs(A - C) < EPS && Math.abs(B) < EPS ? 'Circle' : 'Ellipse'
          typeHint = 'B² − 4AC < 0 and Δ/I < 0 ⇒ real ellipse'
        } else {
          type = 'Imaginary ellipse (no real points)'
          typeHint = 'B² − 4AC < 0 but Δ/I > 0 ⇒ no real locus'
        }
      } else if (disc > EPS) {
        type = 'Hyperbola'
        typeHint = 'B² − 4AC > 0 ⇒ hyperbola'
      } else {
        type = 'Parabola'
        typeHint = 'B² − 4AC = 0 ⇒ parabola'
      }
    } else {
      typeHint = 'Δ = 0 ⇒ degenerate conic (point, lines, empty, …)'
    }

    // Center: solve ∇F = 0  ⇒  [[2A, B],[B, 2C]] [cx,cy]^T = -[D,E]
    let cx = NaN
    let cy = NaN
    let hasCenter = false
    try {
      if (Math.abs(qDet) > EPS) {
        const inv = toNumberMatrix(math.inv([[A, B / 2], [B / 2, C]]))
        cx = -0.5 * (inv[0][0] * D + inv[0][1] * E)
        cy = -0.5 * (inv[1][0] * D + inv[1][1] * E)
        hasCenter = Number.isFinite(cx) && Number.isFinite(cy)
      }
    } catch {
      hasCenter = false
    }

    const centerValue = hasCenter
      ? Number(math.evaluate(expression, { [x]: cx, [y]: cy }))
      : NaN
    // After translation: λ1 X² + λ2 Y² + F(center) = 0  ⇒  λ1 X² + λ2 Y² = −F(center)
    const level = hasCenter ? -centerValue : NaN

    const fxText = math.simplify(fx).toString()
    const fyText = math.simplify(fy).toString()

    const steps: string[] = [
      `Input: ${displayRaw}`,
      `Normalize: ${normalized}`,
      `Detect variables: ${x}, ${y}`,
      `Detect degree: 2 (quadratic in two variables)`,
      `Standard form: A${x}² + B${x}${y} + C${y}² + D${x} + E${y} + F = 0`,
      `Coefficients: A=${fmt(A)}, B=${fmt(B)}, C=${fmt(C)}, D=${fmt(D)}, E=${fmt(E)}, F=${fmt(F)}`,
      `Conic discriminant: B² − 4AC = ${fmt(disc)}`,
      `Augmented determinant Δ = ${fmt(delta)}`,
      `Conic classification: ${type}${typeHint ? ` (${typeHint})` : ''}`
    ]

    const detailedSteps: { step: string; explanation: string; math: string }[] = [
      {
        step: 'Normalize',
        explanation: 'Rewrite glued powers and unicode operators into a CAS-ready polynomial.',
        math: normalized
      },
      {
        step: 'Detect variables & degree',
        explanation: 'Two variables with total degree 2 ⇒ general conic section.',
        math: `variables = {${x}, ${y}}, degree = 2`
      },
      {
        step: 'Extract coefficients',
        explanation: 'Identify A,B,C,D,E,F in Ax²+Bxy+Cy²+Dx+Ey+F=0 via derivatives.',
        math: `A=${fmt(A)}, B=${fmt(B)}, C=${fmt(C)}, D=${fmt(D)}, E=${fmt(E)}, F=${fmt(F)}`
      },
      {
        step: 'Conic discriminant',
        explanation: 'Classify using δ = B²−4AC and the 3×3 determinant Δ.',
        math: `δ = ${fmt(disc)}, Δ = ${fmt(delta)} → ${type}`
      }
    ]

    const sections: ResultSection[] = [
      section('input', 'Input', 'input', [
        field('Equation', displayRaw),
        field('Normalized form', normalized)
      ]),
      section('interpretation', 'Input Interpretation', 'interpretation', [
        field('Recognized as', 'Quadratic equation in two variables'),
        field('Pipeline', 'Input → Normalize → Variables → Degree → Conic analyzer'),
        field('Input type', 'conic')
      ]),
      section('result', 'Result', 'result', [
        field('Geometric figure', type),
        field('Conic classification', type),
        field('Solution set', type === 'Ellipse' || type === 'Circle'
          ? 'Infinite set of real points on the ellipse'
          : type.includes('Imaginary')
            ? 'Empty (no real points)'
            : `Locus of the ${type.toLowerCase()}`)
      ]),
      section('analysis', 'Analysis', 'analysis', [
        field('Equation', displayRaw),
        field('Variables', `${x}, ${y}`),
        field('Degree', 2),
        field('A', fmt(A)),
        field('B', fmt(B)),
        field('C', fmt(C)),
        field('D', fmt(D)),
        field('E', fmt(E)),
        field('F', fmt(F)),
        field('Conic discriminant B² − 4AC', fmt(disc), typeHint || undefined),
        field('Augmented determinant Δ', fmt(delta)),
        field('Conic classification', type),
        field('Quadratic-form determinant (AC − B²/4)', fmt(qDet))
      ])
    ]

    // Center & extrema of F
    if (hasCenter) {
      const isPosDef = qDet > EPS && A > EPS
      const isNegDef = qDet > EPS && A < -EPS
      steps.push(`Center (solve ∂F/∂${x}=0, ∂F/∂${y}=0): ${pt(cx, cy)}`)
      detailedSteps.push({
        step: 'Center',
        explanation: 'Critical point of F from the linear system of first partials.',
        math: `∂F/∂${x} = ${fxText} = 0,  ∂F/∂${y} = ${fyText} = 0  →  ${pt(cx, cy)}`
      })

      sections.push(section('center', 'Center & Extrema', 'properties', [
        field('Center', pt(cx, cy)),
        field('F(center)', fmt(centerValue)),
        field('Global minimum of F', isPosDef ? `${fmt(centerValue)} at ${pt(cx, cy)}` : isNegDef ? '−∞' : 'See Hessian'),
        field('Global maximum of F', isNegDef ? `${fmt(centerValue)} at ${pt(cx, cy)}` : isPosDef ? '+∞' : 'See Hessian')
      ]))
    }

    sections.push(section('calculus', 'Derivatives', 'additional', [
      field(`∂F/∂${x}`, fxText),
      field(`∂F/∂${y}`, fyText),
      field('Partial derivatives (∇F = 0 at center)', hasCenter ? pt(cx, cy) : '—'),
      field(`Implicit derivative d${y}/d${x}`, `−(∂F/∂${x}) / (∂F/∂${y}) = −(${fxText}) / (${fyText})`)
    ]))

    // Accurate axis intercepts for every conic
    const monos = collectMonomials(node, [x, y])
    const intercepts = findAxisInterceptsAccurate(expression, monos, x, y, { min: -30, max: 30 })
    const xIntText = formatInterceptList(intercepts.xIntercepts, intercepts.xAxisIdenticallyZero, x)
    const yIntText = formatInterceptList(intercepts.yIntercepts, intercepts.yAxisIdenticallyZero, y)
    sections.push(section('intercepts', 'Intercepts', 'properties', [
      field(`${x}-intercepts (${y}=0)`, xIntText),
      field(`${y}-intercepts (${x}=0)`, yIntText),
      field('Method', `Solve A${x}²+D${x}+F=0 and C${y}²+E${y}+F=0 (cross terms vanish on axes), Newton-polished`),
      ...intercepts.xIntercepts.map((v, i) =>
        field(`${x}-intercept point ${i + 1}`, pt(v, 0), `|F|≈${fmt(Math.abs(Number(math.evaluate(expression, { [x]: v, [y]: 0 }))))}`)
      ),
      ...intercepts.yIntercepts.map((v, i) =>
        field(`${y}-intercept point ${i + 1}`, pt(0, v), `|F|≈${fmt(Math.abs(Number(math.evaluate(expression, { [x]: 0, [y]: v }))))}`)
      )
    ]))
    steps.push(`${x}-intercepts: ${xIntText}`)
    steps.push(`${y}-intercepts: ${yIntText}`)
    detailedSteps.push({
      step: 'Intercepts',
      explanation: `Restrict to the axes: F(${x},0)=0 and F(0,${y})=0.`,
      math: `${x}-int: ${xIntText}; ${y}-int: ${yIntText}`
    })

    let graphData: {
      points: { x: number; y: number }[]
      equation: string
      range: { min: number; max: number }
      render?: 'scatter' | 'line'
    } | undefined

    // ── Ellipse / Circle geometry ──────────────────────────────────────────
    if ((type === 'Ellipse' || type === 'Circle') && hasCenter && level > EPS && qDet > EPS) {
      // Eigenvalues of [[A, B/2],[B/2, C]]
      const root = Math.sqrt((A - C) * (A - C) + B * B)
      const lambda1 = (A + C - root) / 2 // smaller
      const lambda2 = (A + C + root) / 2 // larger

      if (lambda1 > EPS && lambda2 > EPS) {
        // Semi-axes: a ≥ b, with a² = level/λ_small, b² = level/λ_large
        const a = Math.sqrt(level / lambda1) // semi-major
        const b = Math.sqrt(level / lambda2) // semi-minor

        // Eigenvector for λ1 (major-axis / smaller eigenvalue)
        // (A−λ)x + (B/2)y = 0  ⇒  direction (B/2, λ−A) or (λ−C, B/2)
        let majorRaw = { x: B / 2, y: lambda1 - A }
        if (Math.hypot(majorRaw.x, majorRaw.y) < EPS) {
          majorRaw = { x: lambda1 - C, y: B / 2 }
        }
        if (Math.hypot(majorRaw.x, majorRaw.y) < EPS) {
          majorRaw = Math.abs(A - lambda1) <= Math.abs(C - lambda1) ? { x: 1, y: 0 } : { x: 0, y: 1 }
        }
        let major = unitVec(majorRaw.x, majorRaw.y)

        const majorAngleRaw = Math.atan2(major.y, major.x)
        // Axis direction is undirected → report angle in (−90°, 90°]
        let majorAngleDeg = (majorAngleRaw * 180) / Math.PI
        while (majorAngleDeg <= -90) majorAngleDeg += 180
        while (majorAngleDeg > 90) majorAngleDeg -= 180
        const majorAngle = (majorAngleDeg * Math.PI) / 180
        // Flip major unit vector to match reported angle
        major = { x: Math.cos(majorAngle), y: Math.sin(majorAngle) }
        const minor = { x: -major.y, y: major.x }
        const minorAngleDeg = (Math.atan2(minor.y, minor.x) * 180) / Math.PI
        const cFocal = Math.sqrt(Math.max(0, a * a - b * b))
        const ecc = a > EPS ? cFocal / a : 0

        const focus1 = { x: cx + cFocal * major.x, y: cy + cFocal * major.y }
        const focus2 = { x: cx - cFocal * major.x, y: cy - cFocal * major.y }
        const majV1 = { x: cx + a * major.x, y: cy + a * major.y }
        const majV2 = { x: cx - a * major.x, y: cy - a * major.y }
        const minV1 = { x: cx + b * minor.x, y: cy + b * minor.y }
        const minV2 = { x: cx - b * minor.x, y: cy - b * minor.y }

        // Axis-aligned bounding box of rotated ellipse
        const xHalf = Math.sqrt((a * major.x) ** 2 + (b * minor.x) ** 2)
        const yHalf = Math.sqrt((a * major.y) ** 2 + (b * minor.y) ** 2)
        const xMin = cx - xHalf
        const xMax = cx + xHalf
        const yMin = cy - yHalf
        const yMax = cy + yHalf

        const points: { x: number; y: number }[] = []
        for (let i = 0; i <= 360; i++) {
          const t = (2 * Math.PI * i) / 360
          points.push({
            x: cx + a * Math.cos(t) * major.x + b * Math.sin(t) * minor.x,
            y: cy + a * Math.cos(t) * major.y + b * Math.sin(t) * minor.y
          })
        }
        // Include axis intercepts on the plot
        for (const xi of intercepts.xIntercepts) points.push({ x: xi, y: 0 })
        for (const yi of intercepts.yIntercepts) points.push({ x: 0, y: yi })

        // Verify a sample point nearly satisfies F=0
        const sample = points[0]
        const residual = Number(math.evaluate(expression, { [x]: sample.x, [y]: sample.y }))

        sections.push(section('ellipse', 'Ellipse Properties', 'properties', [
          field('Center', pt(cx, cy)),
          field('Semi-major axis a', fmt(a)),
          field('Semi-minor axis b', fmt(b)),
          field('Major-axis length', fmt(2 * a)),
          field('Minor-axis length', fmt(2 * b)),
          field('Major-axis angle', `${fmt(majorAngleDeg)}°`),
          field('Minor-axis angle', `${fmt(minorAngleDeg)}°`),
          field('Rotation (of major axis)', `${fmt(majorAngleDeg)}°`),
          field('Focal distance c', fmt(cFocal)),
          field('Eccentricity e', fmt(ecc)),
          field('Both foci', `${pt(focus1.x, focus1.y)} ; ${pt(focus2.x, focus2.y)}`),
          field('Major vertices', `${pt(majV1.x, majV1.y)} ; ${pt(majV2.x, majV2.y)}`),
          field('Minor vertices', `${pt(minV1.x, minV1.y)} ; ${pt(minV2.x, minV2.y)}`),
          field(`${x}-intercepts`, xIntText),
          field(`${y}-intercepts`, yIntText),
          field('Domain', `[${fmt(xMin)}, ${fmt(xMax)}]`),
          field('Range', `[${fmt(yMin)}, ${fmt(yMax)}]`),
          field('Eigenvalues λ₁, λ₂', `${fmt(lambda1)}, ${fmt(lambda2)}`),
          field('Level −F(center)', fmt(level)),
          field('Sample residual F(point)', fmt(residual), Math.abs(residual) < 1e-6 ? 'Verified ≈ 0' : 'Check numerics')
        ], {
          mathBlocks: [
            `λ₁ X² + λ₂ Y² = ${fmt(level)}`,
            `X²/${fmt(a * a)} + Y²/${fmt(b * b)} = 1  (after rotation/translation)`,
            `e = c/a = ${fmt(ecc)},  c = √(a² − b²) = ${fmt(cFocal)}`,
            `${x}-intercepts: ${xIntText}`,
            `${y}-intercepts: ${yIntText}`
          ]
        }))

        sections.push(section('axes', 'Axes & Rotation', 'properties', [
          field('Major-axis direction', pt(major.x, major.y)),
          field('Minor-axis direction', pt(minor.x, minor.y)),
          field('Axes', `Major length ${fmt(2 * a)}, minor length ${fmt(2 * b)}`),
          field('Rotation', `${fmt(majorAngleDeg)}° from +${x}-axis`)
        ]))

        sections.push(section('graph', 'Graph', 'graph', [
          field('Graph points', `${points.length} sampled points on the ellipse`),
          field('Plot window (x)', `[${fmt(xMin - 0.5)}, ${fmt(xMax + 0.5)}]`),
          field('Plot window (y)', `[${fmt(yMin - 0.5)}, ${fmt(yMax + 0.5)}]`)
        ]))

        steps.push(`Ellipse confirmed: a=${fmt(a)}, b=${fmt(b)}, e=${fmt(ecc)}`)
        steps.push(`Foci: ${pt(focus1.x, focus1.y)} and ${pt(focus2.x, focus2.y)}`)
        steps.push(`Major vertices: ${pt(majV1.x, majV1.y)} ; ${pt(majV2.x, majV2.y)}`)
        steps.push(`Domain: [${fmt(xMin)}, ${fmt(xMax)}], Range: [${fmt(yMin)}, ${fmt(yMax)}]`)
        detailedSteps.push({
          step: 'Ellipse geometry',
          explanation: 'Diagonalize the quadratic form; semi-axes are √(level/λᵢ).',
          math: `a=${fmt(a)}, b=${fmt(b)}, c=${fmt(cFocal)}, e=${fmt(ecc)}`
        })

        graphData = {
          points,
          equation: displayRaw,
          range: { min: xMin - 1, max: xMax + 1 },
          render: 'line'
        }
      }
    } else if (type === 'Hyperbola' && hasCenter && Math.abs(level) > EPS) {
      steps.push('Hyperbola: asymptotes and branches follow from the eigen-decomposition of the quadratic form.')
      const sampled = sampleImplicitCurve(expression, x, y, fx, fy, {
        xmin: cx - 10, xmax: cx + 10, ymin: cy - 10, ymax: cy + 10
      }, 110)
      for (const xi of intercepts.xIntercepts) sampled.points.push({ x: xi, y: 0 })
      for (const yi of intercepts.yIntercepts) sampled.points.push({ x: 0, y: yi })
      sections.push(section('hyperbola', 'Hyperbola Notes', 'properties', [
        field('Center', pt(cx, cy)),
        field('F(center)', fmt(centerValue)),
        field(`${x}-intercepts`, xIntText),
        field(`${y}-intercepts`, yIntText),
        field('Note', 'Branches open along the eigenvector of the eigenvalue with opposite sign to level'),
        field('Graph samples', `${sampled.points.length} polished points`)
      ]))
      if (sampled.points.length) {
        const xs = sampled.points.map(p => p.x)
        graphData = {
          points: sampled.points,
          equation: displayRaw,
          range: { min: Math.min(...xs) - 1, max: Math.max(...xs) + 1 },
          render: 'scatter'
        }
      }
    } else if (type === 'Parabola') {
      const sampled = sampleImplicitCurve(expression, x, y, fx, fy, {
        xmin: -12, xmax: 12, ymin: -12, ymax: 12
      }, 110)
      for (const xi of intercepts.xIntercepts) sampled.points.push({ x: xi, y: 0 })
      for (const yi of intercepts.yIntercepts) sampled.points.push({ x: 0, y: yi })
      sections.push(section('parabola', 'Parabola Notes', 'properties', [
        field(`${x}-intercepts`, xIntText),
        field(`${y}-intercepts`, yIntText),
        field('Note', 'Parabola has no finite center; complete vertex/focus form uses a rotation that removes the xy term.'),
        field('Graph samples', `${sampled.points.length} polished points`)
      ]))
      if (sampled.points.length) {
        const xs = sampled.points.map(p => p.x)
        graphData = {
          points: sampled.points,
          equation: displayRaw,
          range: { min: Math.min(...xs) - 1, max: Math.max(...xs) + 1 },
          render: 'scatter'
        }
      }
    } else if (!graphData) {
      // Degenerate / other — still try to sample the real locus
      const sampled = sampleImplicitCurve(expression, x, y, fx, fy, {
        xmin: -12, xmax: 12, ymin: -12, ymax: 12
      }, 100)
      if (sampled.points.length) {
        const xs = sampled.points.map(p => p.x)
        graphData = {
          points: sampled.points,
          equation: displayRaw,
          range: { min: Math.min(...xs) - 1, max: Math.max(...xs) + 1 },
          render: 'scatter'
        }
      }
    }

    sections.push(section('steps', 'Step-by-Step Derivation', 'steps',
      steps.map((s, i) => field(`Step ${i + 1}`, s)),
      { mathBlocks: detailedSteps.map(d => d.math) }
    ))

    const output = type === 'Ellipse' || type === 'Circle'
      ? `${type}: center ${hasCenter ? pt(cx, cy) : '—'}; ${x}-int ${xIntText}; ${y}-int ${yIntText}`
      : `${type} (δ = ${fmt(disc)}); ${x}-int ${xIntText}; ${y}-int ${yIntText}`

    return { sections, output, steps, detailedSteps, graphData }
  } catch {
    return null
  }
}

export function enrichQuadraticResult(
  raw: string,
  output: string,
  steps: string[],
  detailedSteps?: { step: string; explanation: string; math: string }[]
): ResultSection[] {
  // If this is actually a bivariate conic, prefer the dedicated analyzer shell
  if (looksLikeBivariatePolynomial(raw)) {
    const bi = analyzeBivariateEquation(raw, raw)
    if (bi) return bi.sections
  }

  // Parse ax^2+bx+c=0 style coefficients when possible
  let analysisFields = [
    field('Equation', raw),
    field('Solution', output),
    field('Exact roots', output)
  ]

  try {
    const cleaned = raw.replace(/\s+/g, '').replace(/=0$/, '')
    const m = cleaned.match(/^([+-]?\d*)\*?([a-zA-Z])\^2([+-]\d*)\*?([a-zA-Z])?([+-]\d+)?$/)
      || cleaned.match(/^([a-zA-Z])\^2([+-]\d+)\1([+-]\d+)$/)
    if (m) {
      let a = 1, b = 0, c = 0, variable = 'x'
      if (m.length >= 5 && m[2] && /[a-zA-Z]/.test(m[2])) {
        variable = m[2]
        a = m[1] === '' || m[1] === '+' ? 1 : m[1] === '-' ? -1 : Number(m[1])
        b = m[3] ? Number(m[3]) : 0
        c = m[5] ? Number(m[5]) : 0
      } else if (m.length >= 4) {
        variable = m[1]
        a = 1
        b = Number(m[2])
        c = Number(m[3])
      }
      const disc = b * b - 4 * a * c
      const vertexX = -b / (2 * a)
      const vertexY = a * vertexX * vertexX + b * vertexX + c
      analysisFields = [
        field('Standard form', `${a === 1 ? '' : a}${variable}² ${b >= 0 ? '+' : ''} ${b}${variable} ${c >= 0 ? '+' : ''} ${c} = 0`.replace(/  /g, ' ')),
        field('Solution / roots', output),
        field('Exact roots', output),
        field('Discriminant Δ', fmt(disc), disc > 0 ? 'Two distinct real roots' : disc === 0 ? 'One repeated root' : 'Complex conjugate roots'),
        field('Number of real roots', disc > 0 ? 2 : disc === 0 ? 1 : 0),
        field('Vertex', `(${fmt(vertexX)}, ${fmt(vertexY)})`),
        field('Axis of symmetry', `${variable} = ${fmt(vertexX)}`),
        field('y-intercept', `(0, ${fmt(c)})`),
        field('Opening direction', a > 0 ? 'Upward (minimum)' : 'Downward (maximum)'),
        field('Domain', 'ℝ'),
        field('Range', a > 0 ? `[${fmt(vertexY)}, ∞)` : `(−∞, ${fmt(vertexY)}]`),
        field('Maximum/minimum', `${a > 0 ? 'Minimum' : 'Maximum'} value ${fmt(vertexY)} at ${variable}=${fmt(vertexX)}`)
      ]
    }
  } catch { /* keep basic fields */ }

  return [
    section('input', 'Input', 'input', [field('Expression', raw)]),
    section('interpretation', 'Input Interpretation', 'interpretation', [
      field('Recognized as', 'Quadratic equation'),
      field('Input type', 'quadratic')
    ]),
    section('result', 'Result', 'result', [
      field('Exact result', output),
      field('Decimal / display', output)
    ]),
    section('analysis', 'Analysis', 'analysis', analysisFields),
    section('steps', 'Step-by-Step', 'steps', steps.map((s, i) => field(`Step ${i + 1}`, s)), {
      mathBlocks: detailedSteps?.map(d => d.math).filter(Boolean)
    }),
    section('additional', 'Additional Information', 'additional', [
      field('Derivative', 'For f(x)=ax²+bx+c: f′(x)=2ax+b'),
      field('Graph', 'Parabola — see plot when available')
    ])
  ]
}

export function enrichEquationResult(
  raw: string,
  output: string,
  steps: string[],
  detailedSteps?: { step: string; explanation: string; math: string }[]
): ResultSection[] {
  return [
    section('input', 'Input', 'input', [field('Equation', raw)]),
    section('interpretation', 'Input Interpretation', 'interpretation', [
      field('Recognized as', 'Equation'),
      field('Input type', 'equation')
    ]),
    section('result', 'Result', 'result', [
      field('Solution', output),
      field('Exact solution', output),
      field('Decimal solution', output)
    ]),
    section('analysis', 'Analysis', 'analysis', [
      field('Equation', raw),
      field('Number of solutions', output.toLowerCase().includes('no') ? '0' : output.includes(',') ? '2+' : '1'),
      field('Verification', 'Substitute solution(s) into the original equation')
    ]),
    section('steps', 'Step-by-Step', 'steps', steps.map((s, i) => field(`Step ${i + 1}`, s)), {
      mathBlocks: detailedSteps?.map(d => d.math).filter(Boolean)
    }),
    section('additional', 'Additional Information', 'additional', [
      field('Graph', 'See plot of left−right when available')
    ])
  ]
}

export function attachShellToClassicResult(opts: {
  raw: string
  kind: InputKind
  interpretation: string
  output: string
  steps: string[]
  detailedSteps?: { step: string; explanation: string; math: string }[]
  extraSections?: ResultSection[]
  additionalFields?: ReturnType<typeof field>[]
}): ResultSection[] {
  if (opts.kind === 'system') {
    return enrichSystemResult(opts.raw, opts.output, opts.steps, opts.detailedSteps)
  }
  if (opts.kind === 'conic' || opts.kind === 'curve' || (opts.kind === 'quadratic' && looksLikeBivariatePolynomial(opts.raw))) {
    const bi = analyzeBivariateEquation(opts.raw, opts.raw)
    if (bi) return bi.sections
  }
  if (opts.kind === 'quadratic') {
    return enrichQuadraticResult(opts.raw, opts.output, opts.steps, opts.detailedSteps)
  }
  if (opts.kind === 'equation') {
    return enrichEquationResult(opts.raw, opts.output, opts.steps, opts.detailedSteps)
  }
  return buildUniversalShell({
    raw: opts.raw,
    interpretation: opts.interpretation,
    kind: opts.kind,
    resultFields: [
      field('Exact result', opts.output),
      field('Decimal / display', opts.output)
    ],
    analysisSections: opts.extraSections,
    steps: opts.steps,
    additionalFields: opts.additionalFields
  })
}

export { TOPIC_FOR_KIND, fmt as formatMathValue, matrixToString, toNumberMatrix }