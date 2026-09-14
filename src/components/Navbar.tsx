import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import {
  GITHUB_URL,
  formatStars,
  useGitHubStars,
} from '../lib/github.ts'
import { GitHubIcon } from './icons.tsx'

export default function Navbar(): ReactElement {
  const [scrolled, setScrolled] = useState(false)
  const stars = useGitHubStars()

  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-6">
      <nav
        aria-label="Primary"
        className={`mx-auto flex h-[58px] w-full max-w-5xl items-center justify-between gap-3 rounded-[20px] border px-4 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 sm:px-6 ${
          scrolled
            ? 'border-[rgba(221,217,240,0.12)] bg-bg-card/90 shadow-[0_8px_40px_rgba(13,11,26,0.6)] backdrop-blur-md'
            : 'border-[rgba(221,217,240,0.07)] bg-bg-card/60 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm'
        }`}
      >
        <a
          href="/"
          className="flex min-h-[44px] min-w-0 items-center rounded-md px-2 transition-colors duration-200 hover:bg-[rgba(221,217,240,0.04)]"
          aria-label="OpenAuth home"
        >
          <img
            src="/logo/openauth-logo.png"
            alt=""
            width={2171}
            height={724}
            className="h-11 w-auto"
          />
        </a>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <a
            href="/faq"
            className="inline-flex min-h-[44px] items-center rounded-md px-3 text-[13px] text-text-secondary transition-colors duration-200 hover:bg-[rgba(221,217,240,0.04)] hover:text-silver-primary"
          >
            FAQ
          </a>
          <a
            href="/docs"
            className="inline-flex min-h-[44px] items-center rounded-md px-3 text-[13px] text-text-secondary transition-colors duration-200 hover:bg-[rgba(221,217,240,0.04)] hover:text-silver-primary"
          >
            Docs
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-md px-3 text-[13px] text-text-secondary transition-colors duration-200 hover:bg-[rgba(221,217,240,0.04)] hover:text-silver-primary"
          >
            <GitHubIcon />
            <span className="hidden min-[420px]:inline">Star on GitHub</span>
            <span className="min-[420px]:hidden">Star</span>
            {stars !== null && (
              <span
                title={`${String(stars)} stars on GitHub`}
                className="hidden font-mono text-[11px] tracking-[0.04em] text-text-subtle min-[420px]:inline"
              >
                {formatStars(stars)}
              </span>
            )}
          </a>
        </div>
      </nav>
    </header>
  )
}
