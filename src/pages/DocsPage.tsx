import { useEffect } from 'react'
import type { ReactElement } from 'react'
import Navbar from '../components/Navbar.tsx'
import Footer from '../components/Footer.tsx'
import { GITHUB_URL } from '../lib/github.ts'

/*
  Placeholder route for /docs — a real destination for the navbar and
  hero "Get started" links until actual documentation is written.
  Deliberately quiet: same shell as the 404 page, no fake content.
*/
function DocsPage(): ReactElement {
  useEffect(() => {
    document.title = 'Docs — OpenAuth'
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-bg-base font-sans text-text-dim">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-bg-card focus:px-4 focus:py-2 focus:text-[13px] focus:text-silver-primary"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="grid flex-1 place-items-center px-6 py-32">
        <div className="max-w-xl text-center">
          <p className="inline-flex items-center rounded-[20px] border border-[rgba(221,217,240,0.12)] bg-[rgba(221,217,240,0.05)] px-[11px] py-1 font-mono text-[11px] tracking-[0.08em] text-text-dim">
            Docs
          </p>
          <h1 className="mt-8 text-[clamp(1.75rem,5vw,2.5rem)] font-light leading-[1.15] tracking-[-0.015em] text-silver-primary">
            Docs are still being written.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-[1.7] text-text-secondary">
            The code works — the explanations are catching up. Until then,
            the README on GitHub is the documentation.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-silver-primary px-[22px] text-[13px] tracking-[0.06em] text-bg-base transition-all duration-200 hover:bg-silver-bright hover:shadow-[0_0_24px_rgba(221,217,240,0.15)] active:bg-text-body"
            >
              View on GitHub
            </a>
            <a
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] px-[22px] text-[13px] tracking-[0.06em] text-text-dim underline decoration-[rgba(221,217,240,0.25)] underline-offset-[3px] transition-colors duration-200 hover:text-silver-primary"
            >
              Back to homepage
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default DocsPage
