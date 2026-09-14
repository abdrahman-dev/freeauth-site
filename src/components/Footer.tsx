import type { ReactElement } from 'react'
import { GITHUB_URL } from '../lib/github.ts'

export default function Footer(): ReactElement {
  return (
    <footer className="bg-bg-base px-6 py-12 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-[13px] font-light text-text-muted">
          &copy; 2026 OpenAuth
        </p>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          <a
            href="/docs"
            className="inline-flex min-h-[44px] items-center text-[13px] font-light text-text-subtle transition-colors duration-200 hover:text-silver-primary"
          >
            Docs
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center text-[13px] font-light text-text-subtle transition-colors duration-200 hover:text-silver-primary"
          >
            GitHub
          </a>
          <span className="inline-flex items-center rounded-[20px] border border-[rgba(221,217,240,0.12)] bg-[rgba(221,217,240,0.05)] px-[11px] py-1 text-[11px] tracking-[0.08em] text-text-dim">
            MIT License
          </span>
        </nav>
      </div>
      <p className="mx-auto mt-6 w-full max-w-5xl text-center text-[13px] font-light text-text-muted">
        Built by Abdrahman, one late night at a time.
      </p>
    </footer>
  )
}
