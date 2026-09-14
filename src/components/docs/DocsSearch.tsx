import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { flattenDocsNav } from '../../docs/nav.ts'
import type { FlatDocsEntry } from '../../docs/nav.ts'

/* Lightweight ⌘K quick navigation over the docs tree (titles, groups,
   keywords). Title-level only by design — a placeholder-free index that
   a full-text search can replace later without touching the layout. */

function scoreEntry(entry: FlatDocsEntry, query: string): boolean {
  const haystack =
    `${entry.title} ${entry.group} ${entry.keywords.join(' ')}`.toLowerCase()
  return query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .every((word) => haystack.includes(word))
}

export default function DocsSearch({
  onClose,
}: {
  onClose: () => void
}): ReactElement {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const results = useMemo(() => {
    const flat = flattenDocsNav()
    const q = query.trim().toLowerCase()
    if (q === '') return flat.slice(0, 7)
    return flat.filter((entry) => scoreEntry(entry, q)).slice(0, 8)
  }, [query])

  /* Mounted fresh on every open (the parent renders conditionally), so
     initial state is the reset state. This effect only moves DOM focus. */
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const safeActive =
    results.length === 0
      ? 0
      : Math.min(activeIndex, results.length - 1)

  const go = (href: string): void => {
    window.location.assign(href)
  }

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(13,11,26,0.72)]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        className="absolute inset-x-4 top-20 mx-auto w-full max-w-lg overflow-hidden rounded-[12px] border border-[rgba(221,217,240,0.12)] bg-bg-elevated shadow-[0_8px_40px_rgba(13,11,26,0.6)]"
      >
        <div className="flex items-center gap-3 border-b border-divider px-5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
            className="shrink-0 text-text-subtle"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5L21 21" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="docs-search-results"
            aria-activedescendant={
              results.length > 0
                ? `docs-search-option-${String(safeActive)}`
                : undefined
            }
            aria-label="Search documentation"
            placeholder="Search docs…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActiveIndex((prev) =>
                  results.length > 0 ? (prev + 1) % results.length : 0,
                )
              } else if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActiveIndex((prev) =>
                  results.length > 0
                    ? (prev - 1 + results.length) % results.length
                    : 0,
                )
              } else if (event.key === 'Enter') {
                const target = results[safeActive]
                if (target !== undefined) go(target.href)
              } else if (event.key === 'Escape') {
                onClose()
              }
            }}
            className="h-[52px] w-full bg-transparent text-[14px] text-text-body placeholder:text-text-subtle focus:outline-none"
          />
          <kbd className="hidden rounded-[4px] border border-[rgba(221,217,240,0.1)] px-1.5 py-0.5 font-mono text-[10px] text-text-subtle sm:inline">
            esc
          </kbd>
        </div>
        {results.length > 0 ? (
          <ul
            ref={listRef}
            id="docs-search-results"
            role="listbox"
            aria-label="Documentation pages"
            className="max-h-[320px] overflow-y-auto p-2"
          >
            {results.map((entry, index) => (
              <li key={entry.href} role="option" aria-selected={index === safeActive}>
                <a
                  id={`docs-search-option-${String(index)}`}
                  href={entry.href}
                  onMouseEnter={() => {
                    setActiveIndex(index)
                  }}
                  className={`flex items-center justify-between gap-4 rounded-[8px] px-3 py-2.5 ${
                    index === safeActive
                      ? 'bg-[rgba(221,217,240,0.06)]'
                      : ''
                  }`}
                >
                  <span
                    className={`text-[13.5px] ${
                      index === safeActive
                        ? 'text-silver-primary'
                        : 'text-text-dim'
                    }`}
                  >
                    {entry.title}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-text-subtle">
                    {entry.group}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-6 text-[13px] text-text-secondary">
            No pages match “{query}”. Try “login”, “otp”, or “prisma”.
          </p>
        )}
      </div>
    </div>
  )
}
