import type { ReactElement } from 'react'
import { GITHUB_URL } from '../../lib/github.ts'
import { GitHubIcon } from '../icons.tsx'

/* Documentation header: compact and utilitarian, not the marketing
   navbar. Brand + docs identity on the left; search, site link, and
   source link on the right; menu trigger on mobile. */

function MenuIcon(): ReactElement {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function SearchIcon(): ReactElement {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  )
}

export default function DocsHeader({
  onMenu,
  onSearch,
}: {
  onMenu: () => void
  onSearch: () => void
}): ReactElement {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(221,217,240,0.07)] bg-bg-base/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center gap-2 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open documentation navigation"
          className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[8px] text-text-secondary transition-colors duration-200 hover:bg-[rgba(221,217,240,0.04)] hover:text-silver-primary lg:hidden"
        >
          <MenuIcon />
        </button>

        <a
          href="/"
          aria-label="OpenAuth home"
          className="flex min-h-[40px] min-w-0 items-center gap-2.5 rounded-md px-1"
        >
          <span className="text-[16px] font-light tracking-[0.08em] text-silver-primary">
            OpenAuth
          </span>
          <span className="inline-flex items-center rounded-[20px] border border-[rgba(221,217,240,0.12)] bg-[rgba(221,217,240,0.05)] px-2 py-0.5 font-mono text-[10px] tracking-[0.1em] text-text-dim">
            Docs
          </span>
        </a>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onSearch}
            aria-label="Search documentation"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-[8px] border border-[rgba(221,217,240,0.08)] bg-[rgba(221,217,240,0.03)] px-3 text-[13px] text-text-subtle transition-colors duration-200 hover:border-[rgba(221,217,240,0.18)] hover:text-text-dim"
          >
            <SearchIcon />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded-[4px] border border-[rgba(221,217,240,0.1)] px-1.5 py-0.5 font-mono text-[10px] text-text-subtle md:inline">
              ⌘K
            </kbd>
          </button>
          <a
            href="/"
            className="hidden min-h-[40px] items-center rounded-[8px] px-3 text-[13px] text-text-secondary transition-colors duration-200 hover:bg-[rgba(221,217,240,0.04)] hover:text-silver-primary sm:inline-flex"
          >
            Site
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="OpenAuth on GitHub"
            className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[8px] text-text-secondary transition-colors duration-200 hover:bg-[rgba(221,217,240,0.04)] hover:text-silver-primary"
          >
            <GitHubIcon />
          </a>
        </div>
      </div>
    </header>
  )
}
