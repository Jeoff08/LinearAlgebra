import type { PdfItem } from '../types/models'

export default function PdfCard({
  pdf,
  locked,
  onOpen,
  onDelete,
  showDelete,
}: {
  pdf: PdfItem
  locked?: boolean
  onOpen: () => void
  onDelete?: () => void
  showDelete?: boolean
}) {
  return (
    <article className="border border-[var(--line)] bg-[var(--panel)] p-4 shadow-[var(--shadow)] backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="m-0 font-[Fraunces] text-lg">{pdf.title}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {pdf.description || 'Learning resource PDF'}
          </p>
          <p className="mt-2 text-xs uppercase tracking-wider text-[var(--muted)]">{pdf.file_name}</p>
        </div>
        <span className="badge local">PDF</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn primary" onClick={onOpen}>
          {locked ? 'Sign in to open' : 'Open'}
        </button>
        {showDelete && onDelete && (
          <button type="button" className="btn danger" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </article>
  )
}
