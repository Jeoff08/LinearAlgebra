// MathCalculator.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { useState, type FormEvent, type ChangeEvent, useRef, useEffect, useCallback } from 'react'
import { solveMath, type SolveResult, type ResultSection } from '../lib/mathSolver'

// Floating number particles component for background
function FloatingNumbers({ count = 30, color = 'var(--muted)' }: { count?: number; color?: string }) {
  const [numbers, setNumbers] = useState<Array<{ id: number; x: number; y: number; value: string; speed: number; size: number; opacity: number }>>([])

  useEffect(() => {
    const chars = '0123456789π√∑∫∂∞≈≠≤≥±×÷()+-*/='
    const newNumbers = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      value: chars[Math.floor(Math.random() * chars.length)],
      speed: 0.2 + Math.random() * 0.5,
      size: 10 + Math.random() * 16,
      opacity: 0.04 + Math.random() * 0.08
    }))
    setNumbers(newNumbers)
  }, [count])

  useEffect(() => {
    const interval = setInterval(() => {
      setNumbers(prev => prev.map(n => ({
        ...n,
        y: (n.y + n.speed * 0.12) % 100,
        x: n.x + (Math.random() - 0.5) * 0.08,
        opacity: 0.04 + Math.random() * 0.06
      })))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {numbers.map(n => (
        <span
          key={n.id}
          className="absolute font-mono select-none"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            fontSize: n.size,
            opacity: n.opacity,
            color: color,
            transform: `rotate(${n.id * 5}deg)`,
            transition: 'opacity 0.3s ease'
          }}
        >
          {n.value}
        </span>
      ))}
    </div>
  )
}

// Live preview component that updates as you type
function LivePreview({ expression }: { expression: string }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    if (!expression.trim()) {
      setPreview(null)
      setIsValid(true)
      return
    }

    try {
      const trimmed = expression.trim()
      if (/^[\d\s+\-*/^().xXyYπ√∑∫∂∞≈≠≤≥±×÷]+$/.test(trimmed.replace(/[a-zA-Z]+/g, ''))) {
        setPreview('→ ' + trimmed.replace(/\^/g, '**'))
        setIsValid(true)
      } else {
        setPreview('⏳ processing…')
        setIsValid(true)
      }
    } catch {
      setPreview('⚠️ invalid')
      setIsValid(false)
    }
  }, [expression])

  if (!preview) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`absolute bottom-2 right-3 text-xs font-mono px-2 py-1 rounded ${
        isValid 
          ? 'text-[var(--muted)] bg-[var(--moss)]/10 border border-[var(--moss)]/20' 
          : 'text-red-400 bg-red-50/20 border border-red-400/30'
      }`}
    >
      {preview}
    </motion.div>
  )
}

function MatrixHeatmap({ data }: { data: number[][] }) {
  const flat = data.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat)
  const span = max - min || 1

  return (
    <motion.div 
      className="mt-3 overflow-x-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="inline-grid gap-1 p-2 border border-[var(--line)] bg-[#0f1a14]/70"
        style={{ gridTemplateColumns: `repeat(${data[0]?.length ?? 1}, minmax(2.4rem, 1fr))` }}
      >
        {data.map((row, i) =>
          row.map((v, j) => {
            const t = (v - min) / span
            const bg = `color-mix(in srgb, var(--moss) ${Math.round(18 + t * 72)}%, #0b1210)`
            return (
              <motion.div
                key={`${i}-${j}`}
                title={`a${i + 1}${j + 1} = ${v}`}
                className="min-w-[2.4rem] px-1.5 py-2 text-center font-mono text-xs text-[#e8f0ea] tabular-nums cursor-default"
                style={{ background: bg }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                transition={{ duration: 0.15 }}
              >
                {Number.isInteger(v) ? v : Number(v.toPrecision(4))}
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}

function ResultSectionBlock({
  section,
  index
}: {
  section: ResultSection
  index: number
}) {
  const [open, setOpen] = useState(section.defaultOpen !== false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="border border-[var(--line)] bg-[var(--panel)]/80 hover:border-[var(--moss)]/30 transition-colors"
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-black/[0.03] transition-colors group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--muted)] shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="m-0 font-[Fraunces] text-lg tracking-tight truncate group-hover:text-[var(--moss)] transition-colors">
            {section.title}
          </h3>
        </div>
        <motion.span 
          className="text-[var(--muted)] text-sm shrink-0"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-[var(--line)]">
              {section.fields.length > 0 && (
                <dl className="mt-3 grid gap-2">
                  {section.fields.map((f, fi) => (
                    <motion.div
                      key={`${f.label}-${fi}`}
                      className="grid grid-cols-1 sm:grid-cols-[minmax(8rem,14rem)_1fr] gap-1 sm:gap-3 py-2 border-b border-[var(--line)]/60 last:border-0"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: fi * 0.05 }}
                    >
                      <dt className="text-xs uppercase tracking-wide text-[var(--muted)] pt-0.5">
                        {f.label}
                      </dt>
                      <dd className="m-0">
                        <pre className="m-0 whitespace-pre-wrap break-words font-mono text-sm text-[var(--ink)] leading-relaxed">
                          {f.value}
                        </pre>
                        {f.hint && (
                          <p className="m-0 mt-1 text-xs text-[var(--muted)]">{f.hint}</p>
                        )}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
              )}

              {section.mathBlocks && section.mathBlocks.length > 0 && (
                <div className="mt-3 space-y-2">
                  {section.mathBlocks.map((block, bi) => (
                    <motion.pre
                      key={bi}
                      className="m-0 p-3 bg-[#0f1a14] text-[#d7ebe0] font-mono text-xs whitespace-pre-wrap break-words border border-[var(--line)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: bi * 0.05 }}
                    >
                      {block}
                    </motion.pre>
                  ))}
                </div>
              )}

              {section.matrixHeatmap && section.matrixHeatmap.length > 0 && (
                <MatrixHeatmap data={section.matrixHeatmap} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function MathCalculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<SolveResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  const [showDetailedSteps, setShowDetailedSteps] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [ocrBusy, setOcrBusy] = useState(false)
  const [ocrStatus, setOcrStatus] = useState('')
  const [ocrRaw, setOcrRaw] = useState('')
  const [ocrCandidates, setOcrCandidates] = useState<string[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const savedProblem = sessionStorage.getItem('calculatorProblem')
    if (savedProblem) {
      setExpression(savedProblem)
      sessionStorage.removeItem('calculatorProblem')
      setTimeout(() => {
        const form = document.querySelector('form')
        if (form) {
          const submitButton = form.querySelector('button[type="submit"]')
          if (submitButton) {
            ;(submitButton as HTMLButtonElement).click()
          } else {
            form.dispatchEvent(new Event('submit', { bubbles: true }))
          }
        }
      }, 400)
    }
  }, [])

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            e.preventDefault()
            void handleImageFile(file)
          }
          break
        }
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [])

  function solveExpression(expr: string) {
    const trimmed = expr.trim()
    if (!trimmed) return
    setIsLoading(true)
    setShowSteps(false)
    setShowDetailedSteps(false)
    try {
      const solution = solveMath(trimmed)
      setResult(solution)
      setTimeout(() => {
        setShowSteps(true)
        setShowDetailedSteps(true)
      }, 300)
    } catch {
      setResult({
        ok: false,
        output: 'Error processing expression',
        steps: ['Please check your input and try again'],
        topic: 'Error',
        raw: trimmed
      })
      setShowSteps(true)
    } finally {
      setIsLoading(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    solveExpression(expression)
  }

  async function handleImageFile(file: File | Blob) {
    if (!file.type?.startsWith('image/') && !(file instanceof Blob)) {
      setOcrStatus('Please upload an image file (PNG, JPG, WEBP, …).')
      return
    }
    const url = URL.createObjectURL(file)
    setImagePreview(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
    setOcrBusy(true)
    setOcrStatus('Starting OCR…')
    setOcrRaw('')
    setOcrCandidates([])
    setResult(null)

    try {
      const { recognizeMathFromImage } = await import('../lib/mathOcr')
      const ocr = await recognizeMathFromImage(file, (msg, pct) => {
        setOcrStatus(pct != null ? `${msg} (${Math.round(pct)}%)` : msg)
      })
      setOcrRaw(ocr.rawText)
      setOcrCandidates(ocr.candidates)
      const best = ocr.expression.trim()
      if (!best) {
        setOcrStatus('Could not read math from this image. Try a clearer screenshot.')
        return
      }
      setExpression(best)
      setOcrStatus(
        ocr.confidence >= 70
          ? `High-confidence read (~${Math.round(ocr.confidence)}%). Auto-solving…`
          : ocr.confidence
            ? `Best reading (~${Math.round(ocr.confidence)}%). Review chips if needed — solving…`
            : 'Recognized. Solving…'
      )
      setTimeout(() => solveExpression(best), 250)
    } catch (err) {
      console.error(err)
      setOcrStatus('OCR failed. Check the image or type the expression manually.')
    } finally {
      setOcrBusy(false)
    }
  }

  function onFilePicked(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void handleImageFile(file)
    e.target.value = ''
  }

  function clearResult() {
    setResult(null)
    setExpression('')
    setShowSteps(false)
    setShowDetailedSteps(false)
    setOcrRaw('')
    setOcrCandidates([])
    setOcrStatus('')
    setImagePreview(prev => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (expression.trim()) {
          onSubmit(e as unknown as FormEvent)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [expression])

  useEffect(() => {
    if (!result?.graphData || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { points, equation, range } = result.graphData
    const width = canvas.width
    const height = canvas.height
    const padding = 40
    const asScatter =
      result.graphData.render === 'scatter' ||
      (result.graphData.render !== 'line' && result.inputKind === 'curve')

    ctx.clearRect(0, 0, width, height)

    let minY = Infinity
    let maxY = -Infinity
    let minX = range.min
    let maxX = range.max
    for (const p of points) {
      if (p.y < minY) minY = p.y
      if (p.y > maxY) maxY = p.y
      if (p.x < minX) minX = p.x
      if (p.x > maxX) maxX = p.x
    }
    const padX = (maxX - minX) * 0.08 || 1
    const padY = (maxY - minY) * 0.08 || 1
    minX -= padX
    maxX += padX
    minY -= padY
    maxY += padY
    const yRange = maxY - minY || 1
    const xRange = maxX - minX || 1

    const xScale = (x: number) =>
      padding + ((x - minX) / xRange) * (width - 2 * padding)
    const yScale = (y: number) =>
      padding + ((maxY - y) / yRange) * (height - 2 * padding)

    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 0.5
    const xTickStart = Math.ceil(minX)
    const xTickEnd = Math.floor(maxX)
    for (let i = xTickStart; i <= xTickEnd; i++) {
      const xPos = xScale(i)
      ctx.beginPath()
      ctx.moveTo(xPos, padding)
      ctx.lineTo(xPos, height - padding)
      ctx.stroke()
      ctx.fillStyle = '#6b7280'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(i.toString(), xPos, height - padding + 16)
    }

    ctx.strokeStyle = '#9ca3af'
    ctx.lineWidth = 1.5
    if (minY <= 0 && maxY >= 0) {
      const yZero = yScale(0)
      ctx.beginPath()
      ctx.moveTo(padding, yZero)
      ctx.lineTo(width - padding, yZero)
      ctx.stroke()
    }
    if (minX <= 0 && maxX >= 0) {
      const xZero = xScale(0)
      ctx.beginPath()
      ctx.moveTo(xZero, padding)
      ctx.lineTo(xZero, height - padding)
      ctx.stroke()
    }

    if (points.length > 1) {
      if (asScatter) {
        ctx.fillStyle = '#3d6b4f'
        for (const p of points) {
          ctx.beginPath()
          ctx.arc(xScale(p.x), yScale(p.y), 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
      } else {
        ctx.strokeStyle = '#3d6b4f'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        let started = false
        for (const p of points) {
          const x = xScale(p.x)
          const y = yScale(p.y)
          if (!started) {
            ctx.moveTo(x, y)
            started = true
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }

      ctx.fillStyle = '#1f2937'
      ctx.font = '12px Fraunces, serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Graph of: ${equation}`, width / 2, 18)
    }
  }, [result])

  function getStepIcon(step: string): string {
    if (step.includes('Analyzing')) return '·'
    if (step.includes('Variables')) return '·'
    if (step.includes('Found solution') || step.includes('Result')) return '✓'
    if (step.includes('Error') || step.includes('Unable')) return '!'
    return '·'
  }

  function getStepColor(step: string): string {
    if (step.includes('Error') || step.includes('Unable') || step.includes('Could not')) {
      return 'border-red-400 bg-red-50/50'
    }
    if (step.includes('Found') || step.includes('Solution') || step.includes('Result')) {
      return 'border-[var(--moss)] bg-[var(--moss)]/5'
    }
    return 'border-[var(--line)] bg-white/40'
  }

  const hasSections = Boolean(result?.sections && result.sections.length > 0)

  return (
    <motion.section
      className="rounded-none border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[var(--shadow)] backdrop-blur-md relative overflow-hidden"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* Floating numbers background */}
      <FloatingNumbers count={35} color="var(--muted)" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <motion.h2 
              className="m-0 font-[Fraunces] text-2xl tracking-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Math Calculator
            </motion.h2>
            <p className="mt-2 max-w-xl text-[var(--muted)] text-sm leading-relaxed">
              Type an expression, or upload / paste a screenshot of a problem — OCR reads it, then the
              solver works the same multi-section report.
            </p>
          </div>
          {result && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`shrink-0 px-3 py-1 text-xs font-medium border ${
                result.ok
                  ? 'bg-[var(--moss)]/10 border-[var(--moss)]/40 text-[var(--moss)]'
                  : 'bg-red-50 border-red-300 text-red-700'
              }`}
            >
              {result.ok ? '✓ Solved' : '✗ Error'}
            </motion.div>
          )}
        </div>

        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3">
          {/* Image upload / drop zone */}
          <motion.div
            onDragOver={e => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files?.[0]
              if (file) void handleImageFile(file)
            }}
            className={`border border-dashed p-4 transition-all ${
              dragOver
                ? 'border-[var(--moss)] bg-[var(--moss)]/10 scale-[1.01]'
                : 'border-[var(--line)] bg-white/40'
            }`}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="min-w-0">
                <div className="font-[Fraunces] text-base">Upload screenshot or photo</div>
                <p className="m-0 mt-1 text-xs text-[var(--muted)]">
                  Drop an image here, click Upload, or paste with Ctrl+V. Clear printed equations work best.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={onFilePicked}
                />
                <motion.button
                  type="button"
                  className="btn secondary"
                  disabled={ocrBusy || isLoading}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {ocrBusy ? '📷 Reading…' : '📷 Upload image'}
                </motion.button>
              </div>
            </div>

            {imagePreview && (
              <motion.div 
                className="mt-3 flex flex-col sm:flex-row gap-3 items-start"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <img
                  src={imagePreview}
                  alt="Uploaded math problem"
                  className="max-h-40 max-w-full border border-[var(--line)] object-contain bg-white"
                />
                <div className="text-xs text-[var(--muted)] space-y-1 min-w-0 flex-1">
                  {ocrStatus && <p className="m-0 text-[var(--ink)]">{ocrStatus}</p>}
                  {ocrRaw && (
                    <details className="mt-1">
                      <summary className="cursor-pointer hover:text-[var(--moss)] transition-colors">
                        📝 Raw OCR text
                      </summary>
                      <pre className="m-0 mt-1 whitespace-pre-wrap font-mono text-[11px] bg-[#0f1a14] text-[#d7ebe0] p-2 border border-[var(--line)]">
                        {ocrRaw}
                      </pre>
                    </details>
                  )}
                  {ocrCandidates.length > 1 && (
                    <motion.div 
                      className="mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="mb-1 text-[var(--muted)]">Other readings — click to use:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {ocrCandidates.slice(0, 6).map(c => (
                          <motion.button
                            key={c}
                            type="button"
                            className="px-2 py-0.5 border border-[var(--line)] font-mono text-[11px] hover:border-[var(--moss)] hover:bg-[var(--moss)]/5 transition-colors"
                            onClick={() => {
                              setExpression(c)
                              solveExpression(c)
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {c.length > 42 ? c.slice(0, 42) + '…' : c}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Text input with floating numbers background and live preview - DARKER */}
          <div className="relative">
            <div className="relative border border-[var(--line)] bg-[#0a1210] overflow-hidden transition-colors">
              {/* Background numbers for the textarea - matching dark palette */}
              <FloatingNumbers count={20} color="#2a4a3a" />
              
              <textarea
                ref={textareaRef}
                value={expression}
                onChange={e => setExpression(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={4}
                placeholder="Type math here, or upload a screenshot above… e.g. 5x^2-3xy+8y^2+6x-7y-2=0"
                className="relative z-10 w-full bg-transparent px-4 py-3 outline-none resize-none text-[#d7ebe0] placeholder:text-[#3a5a4a]"
                style={{ 
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', 
                  fontSize: '14px',
                  minHeight: '100px'
                }}
              />
              
              {/* Live preview - matching dark theme */}
              <LivePreview expression={expression} />
              
              {expression && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  type="button"
                  onClick={() => setExpression('')}
                  className="absolute top-2 right-2 text-[#4a6a5a] hover:text-[#d7ebe0] transition-colors p-1 z-20"
                >
                  ✕
                </motion.button>
              )}
            </div>
            
            {/* Keyboard shortcut hint */}
            <div className="mt-1 text-xs text-[var(--muted)] flex justify-end gap-2">
              <span>⌘+Enter to solve</span>
              <span>•</span>
              <span className={`transition-colors ${isFocused ? 'text-[var(--moss)]' : ''}`}>
                {isFocused ? '✏️ typing…' : 'click to start'}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {(result || imagePreview || expression) && (
              <motion.button
                type="button"
                onClick={clearResult}
                className="btn secondary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🗑️ Clear
              </motion.button>
            )}
            <motion.button
              type="submit"
              className="btn primary flex items-center gap-2"
              disabled={isLoading || ocrBusy || !expression.trim()}
              whileHover={!(isLoading || ocrBusy) ? { scale: 1.02 } : {}}
              whileTap={!(isLoading || ocrBusy) ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⟳</span> Solving…
                </>
              ) : ocrBusy ? (
                <>
                  <span className="animate-pulse">📷</span> Reading image…
                </>
              ) : (
                '🚀 Solve'
              )}
            </motion.button>
          </div>
        </form>

        <AnimatePresence>
          {(isLoading || ocrBusy) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 overflow-hidden"
            >
              <div className="border border-[var(--line)] bg-[#0a1210] p-8 flex flex-col items-center justify-center relative">
                <FloatingNumbers count={15} color="#2a4a3a" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 border-2 border-[var(--line)] rounded-full" />
                    <motion.div 
                      className="absolute inset-0 border-2 border-[var(--moss)] rounded-full border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                  <motion.p 
                    className="mt-4 text-[#8aaaaa] text-sm"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {ocrBusy ? ocrStatus || 'Reading image…' : 'Analyzing input…'}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && !isLoading && !ocrBusy && (
            <motion.div
              className="mt-5 space-y-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--line)]">
                <div className="flex flex-wrap items-center gap-2">
                  <motion.span 
                    className="text-xs px-2.5 py-1 border border-[var(--moss)]/30 bg-[var(--moss)]/10 text-[var(--moss)]"
                    whileHover={{ scale: 1.05 }}
                  >
                    {result.topic}
                  </motion.span>
                  {result.inputKind && (
                    <span className="text-xs px-2.5 py-1 border border-[var(--line)] text-[var(--muted)] font-mono">
                      type: {result.inputKind}
                    </span>
                  )}
                </div>
                <button
                  onClick={clearResult}
                  className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors text-sm"
                  title="Remove result"
                >
                  ✕
                </button>
              </div>

              {/* Hero result summary */}
              <motion.div 
                className="p-4 border-l-4 border-[var(--moss)] bg-[var(--moss)]/[0.06]"
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-1">
                  Primary result
                </div>
                <motion.p 
                  className="m-0 font-[Fraunces] text-2xl sm:text-3xl tracking-tight break-words"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {result.output}
                </motion.p>
                {result.interpretation && (
                  <p className="m-0 mt-2 text-sm text-[var(--muted)]">{result.interpretation}</p>
                )}
              </motion.div>

              {/* Hierarchical sections */}
              {hasSections && (
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)] px-1 flex items-center gap-2">
                    <span>📊 Full report</span>
                    <span className="flex-1 h-px bg-[var(--line)]" />
                  </div>
                  {result.sections!.map((sec, i) => (
                    <ResultSectionBlock key={sec.id + i} section={sec} index={i} />
                  ))}
                </div>
              )}

              {/* Graph */}
              {result.graphData && result.graphData.points.length > 0 && (
                <motion.div
                  className="p-3 border border-[var(--line)] bg-white/50"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="m-0 font-[Fraunces] text-base">📈 Graph</h4>
                    <span className="text-xs text-[var(--muted)] font-mono">
                      {result.graphData.equation}
                    </span>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={300}
                    className="w-full h-auto border border-[var(--line)] bg-white"
                    style={{ maxHeight: '300px' }}
                  />
                </motion.div>
              )}

              {/* Fallback detailed steps when no sections */}
              {!hasSections && result.detailedSteps && result.detailedSteps.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="m-0 text-sm font-semibold text-[var(--muted)]">
                      📝 Detailed explanation ({result.detailedSteps.length})
                    </h4>
                    <motion.button
                      onClick={() => setShowDetailedSteps(!showDetailedSteps)}
                      className="text-xs text-[var(--muted)] px-2 py-1 border border-[var(--line)] hover:border-[var(--moss)] transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showDetailedSteps ? 'Hide' : 'Show'}
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {showDetailedSteps && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {result.detailedSteps.map((step, index) => {
                          const stepText = typeof step === 'string' ? step : step.step || String(step)
                          const stepExplanation =
                            typeof step === 'string' ? '' : step.explanation || ''
                          const stepMath = typeof step === 'string' ? null : step.math || null
                          return (
                            <motion.div
                              key={index}
                              className="border-l-4 border-[var(--moss)]/50 bg-[var(--moss)]/5 pl-3 py-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <div className="text-sm font-medium">{stepText}</div>
                              {stepExplanation && (
                                <div className="text-xs text-[var(--muted)] mt-0.5">
                                  {stepExplanation}
                                </div>
                              )}
                              {stepMath && (
                                <pre className="mt-1 m-0 text-sm font-mono bg-white/70 p-2 border border-[var(--line)] whitespace-pre-wrap">
                                  {stepMath}
                                </pre>
                              )}
                            </motion.div>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Compact steps toggle (always available as secondary) */}
              {!hasSections && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="m-0 text-sm font-semibold text-[var(--muted)]">
                      🔄 Solution steps ({result.steps.length})
                    </h4>
                    <motion.button
                      onClick={() => setShowSteps(!showSteps)}
                      className="text-xs text-[var(--muted)] px-2 py-1 border border-[var(--line)] hover:border-[var(--moss)] transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {showSteps ? 'Hide' : 'Show'}
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {showSteps && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {result.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            className={`border-l-4 ${getStepColor(step)} pl-3 py-2`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex gap-2 text-sm">
                              <span className="text-[var(--muted)] font-mono w-4">
                                {getStepIcon(step)}
                              </span>
                              <span>{step}</span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}