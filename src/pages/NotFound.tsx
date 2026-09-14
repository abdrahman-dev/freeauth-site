import { useEffect } from 'react'
import type { ReactElement } from 'react'
import Footer from '../components/Footer.tsx'

/*
  404 message options (dry-witted, on-brand) — pick together:
  A. "This page drifted beyond the event horizon."                        [LIVE]
     sub: "No auth required to find your way back."
  B. "Nothing here but empty space."
     sub: "Even the black hole couldn't find this page."
*/
const TITLE = 'This page drifted beyond the event horizon.'
const SUBTITLE = 'No auth required to find your way back.'

function NotFound(): ReactElement {
  useEffect(() => {
    document.title = 'Page not found: OpenAuth'
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-bg-base font-sans text-text-dim">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-bg-card focus:px-4 focus:py-2 focus:text-[13px] focus:text-silver-primary"
      >
        Skip to content
      </a>
      <main id="main" className="grid flex-1 place-items-center px-6 py-32">
        <div className="max-w-xl text-center">
          <p className="inline-flex items-center rounded-[20px] border border-[rgba(221,217,240,0.12)] bg-[rgba(221,217,240,0.05)] px-[11px] py-1 font-mono text-[11px] tracking-[0.08em] text-text-dim">
            404
          </p>
          <h1 className="mt-8 text-[clamp(1.75rem,5vw,2.5rem)] font-light leading-[1.15] tracking-[-0.015em] text-silver-primary">
            {TITLE}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-[1.7] text-text-secondary">
            {SUBTITLE}
          </p>
          <div className="mt-10">
            <a
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-silver-primary px-[22px] text-[13px] tracking-[0.06em] text-bg-base transition-all duration-200 hover:bg-silver-bright hover:shadow-[0_0_24px_rgba(221,217,240,0.15)] active:bg-text-body"
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

export default NotFound
