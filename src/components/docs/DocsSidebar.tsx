import type { ReactElement } from 'react'
import { DOCS_NAV } from '../../docs/nav.ts'
import type { DocsNavItem } from '../../docs/nav.ts'

/* Sidebar navigation rendered from the docs nav model — no hard-coded
   page blocks. Supports one nested level via `children`. Active state
   is derived from the current route, never from local state. */

const ITEM_CLASS =
  'block rounded-[8px] px-3 py-[7px] text-[13px] leading-[1.5] transition-colors duration-200'

function NavItem({ item, path }: { item: DocsNavItem; path: string }): ReactElement {
  const active = item.href === path
  const childActive =
    item.children?.some((child) => child.href === path) === true

  return (
    <li>
      <a
        href={item.href}
        aria-current={active ? 'page' : undefined}
        className={`${ITEM_CLASS} ${
          active
            ? 'bg-[rgba(221,217,240,0.07)] text-silver-primary'
            : childActive
              ? 'text-text-dim'
              : 'text-text-secondary hover:bg-[rgba(221,217,240,0.04)] hover:text-silver-primary'
        }`}
      >
        {item.title}
      </a>
      {item.children !== undefined && item.children.length > 0 && (
        <ul className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-[rgba(221,217,240,0.08)] pl-2">
          {item.children.map((child) => {
            const childIsActive = child.href === path
            return (
              <li key={child.href}>
                <a
                  href={child.href}
                  aria-current={childIsActive ? 'page' : undefined}
                  className={`${ITEM_CLASS} ${
                    childIsActive
                      ? 'bg-[rgba(221,217,240,0.07)] text-silver-primary'
                      : 'text-text-secondary hover:bg-[rgba(221,217,240,0.04)] hover:text-silver-primary'
                  }`}
                >
                  {child.title}
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

export default function DocsSidebar({ path }: { path: string }): ReactElement {
  return (
    <nav aria-label="Documentation">
      <ul className="flex flex-col gap-7">
        {DOCS_NAV.map((group) => (
          <li key={group.label}>
            <p className="px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
              {group.label}
            </p>
            <ul className="mt-2 flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavItem key={item.href} item={item} path={path} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
