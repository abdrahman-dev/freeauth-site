import type { ReactElement } from 'react'
import { getDocsPrevNext } from '../../docs/nav.ts'

/* Previous / next controls following nav order. Omitted entirely when
   a side has no page (first/last in the tree). */

export default function DocsPagination({
  path,
}: {
  path: string
}): ReactElement | null {
  const { prev, next } = getDocsPrevNext(path)
  if (prev === null && next === null) return null

  return (
    <nav
      aria-label="Documentation pages"
      className="mt-16 grid grid-cols-1 gap-4 border-t border-divider pt-8 sm:grid-cols-2"
    >
      {prev !== null ? (
        <a
          href={prev.href}
          className="group rounded-[12px] border border-[rgba(221,217,240,0.07)] bg-bg-card/40 px-5 py-4 transition-colors duration-200 hover:border-[rgba(221,217,240,0.14)] hover:bg-bg-card"
        >
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle">
            ← Previous
          </span>
          <span className="mt-1.5 block text-[14px] text-text-dim transition-colors duration-200 group-hover:text-silver-primary">
            {prev.title}
          </span>
        </a>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}
      {next !== null && (
        <a
          href={next.href}
          className="group rounded-[12px] border border-[rgba(221,217,240,0.07)] bg-bg-card/40 px-5 py-4 text-right transition-colors duration-200 hover:border-[rgba(221,217,240,0.14)] hover:bg-bg-card"
        >
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-text-subtle">
            Next →
          </span>
          <span className="mt-1.5 block text-[14px] text-text-dim transition-colors duration-200 group-hover:text-silver-primary">
            {next.title}
          </span>
        </a>
      )}
    </nav>
  )
}
