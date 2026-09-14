import type { ReactElement } from 'react'

export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

/* Right-side "On this page" outline, generated from the article's own
   headings. Hidden on short pages (fewer than three headings) and on
   narrow screens, where it would harm readability. */

export default function DocsToc({
  headings,
  activeId,
}: {
  headings: TocHeading[]
  activeId: string | null
}): ReactElement | null {
  if (headings.length < 3) return null

  return (
    <nav aria-label="On this page">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
        On this page
      </p>
      <ul className="mt-3 flex flex-col gap-1 border-l border-[rgba(221,217,240,0.08)]">
        {headings.map((heading) => {
          const active = heading.id === activeId
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? 'location' : undefined}
                className={`-ml-px block border-l py-[5px] text-[13px] leading-[1.5] transition-colors duration-200 hover:text-silver-primary ${
                  heading.level === 3 ? 'pl-6' : 'pl-4'
                } ${
                  active
                    ? 'border-[rgba(221,217,240,0.5)] text-silver-primary'
                    : 'border-transparent text-text-secondary hover:border-[rgba(221,217,240,0.35)]'
                }`}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
