/** Shared result model for Wolfram-style multi-section calculator output. */

export type InputKind =
  | 'matrix'
  | 'vector'
  | 'system'
  | 'equation'
  | 'quadratic'
  | 'conic'
  | 'curve'
  | 'polynomial'
  | 'expression'
  | 'function'
  | 'arithmetic'
  | 'calculus'
  | 'trigonometry'
  | 'complex'
  | 'statistics'
  | 'geometry'
  | 'limit'
  | 'differential'
  | 'series'
  | 'unknown'

export type SectionKind =
  | 'input'
  | 'interpretation'
  | 'result'
  | 'analysis'
  | 'properties'
  | 'operations'
  | 'spaces'
  | 'eigen'
  | 'factorizations'
  | 'graph'
  | 'steps'
  | 'additional'
  | 'visualization'
  | 'verification'

export interface ResultField {
  label: string
  value: string
  hint?: string
}

export interface ResultSection {
  id: string
  title: string
  kind: SectionKind
  fields: ResultField[]
  mathBlocks?: string[]
  /** Optional heatmap / matrix display data */
  matrixHeatmap?: number[][]
  defaultOpen?: boolean
}

export function section(
  id: string,
  title: string,
  kind: SectionKind,
  fields: ResultField[],
  extras?: Partial<Pick<ResultSection, 'mathBlocks' | 'matrixHeatmap' | 'defaultOpen'>>
): ResultSection {
  return {
    id,
    title,
    kind,
    fields: fields.filter(f => f.value !== '' && f.value != null),
    ...extras,
    defaultOpen: extras?.defaultOpen ?? true
  }
}

export function field(label: string, value: string | number | boolean | null | undefined, hint?: string): ResultField {
  if (value === null || value === undefined) return { label, value: '—' }
  if (typeof value === 'boolean') return { label, value: value ? 'Yes' : 'No', hint }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return { label, value: String(value), hint }
    const text = Number.isInteger(value)
      ? String(value)
      : value.toPrecision(10).replace(/\.?0+$/, '').replace(/e\+?(-?\d+)/i, 'e$1')
    return { label, value: text, hint }
  }
  return { label, value: String(value), hint }
}