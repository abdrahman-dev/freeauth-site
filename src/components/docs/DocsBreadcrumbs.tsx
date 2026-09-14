import type { ReactElement } from 'react'
import { getDocsBreadcrumbs } from '../../docs/nav.ts'

/* Lightweight contextual trail reflecting the route hierarchy. */

export default function DocsBreadcrumbs({
  path,
}: {
  path: string
}): ReactElement {
  const crumbs = getDocsBreadcrumbs(path)

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-[12px] tracking-[0.02em]">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1
          return (
            <li key={crumb.label} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-text-muted">
                  /
                </span>
              )}
              {last || crumb.href === undefined ? (
                <span
                  aria-current={last ? 'page' : undefined}
                  className="text-text-dim"
                >
                  {crumb.label}
                </span>
              ) : (
                <a
                  href={crumb.href}
                  className="text-text-secondary transition-colors duration-200 hover:text-silver-primary"
                >
                  {crumb.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
