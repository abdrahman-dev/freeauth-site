import { useEffect } from 'react'
import type { ReactElement } from 'react'
import Navbar from '../components/Navbar.tsx'
import Faq from '../components/Faq.tsx'
import Footer from '../components/Footer.tsx'
import SectionHeading from '../components/SectionHeading.tsx'
import { GITHUB_URL } from '../lib/github.ts'

function FaqPage(): ReactElement {
  useEffect(() => {
    document.title = 'FAQ — OpenAuth'
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
      <main id="main" className="flex-1">
        <section
          aria-labelledby="faq-heading"
          className="mx-auto w-full max-w-3xl px-6 pt-24 sm:pt-28"
        >
          <h1 className="sr-only">OpenAuth frequently asked questions</h1>
          <SectionHeading
            title="Questions we're actually asked."
            headingId="faq-heading"
          />
          <Faq />
        </section>
        <section
          aria-labelledby="closing-cta-heading"
          className="mx-auto w-full max-w-3xl px-6 pb-24 pt-24 text-center sm:pb-36 sm:pt-32"
        >
          <h2
            id="closing-cta-heading"
            className="text-[clamp(1.5rem,4vw,1.9rem)] font-light leading-[1.2] tracking-[-0.015em] text-silver-primary"
          >
            Still here? Come build with it.
          </h2>
          <div className="mt-8 flex justify-center">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-silver-primary px-[22px] text-[13px] tracking-[0.06em] text-bg-base transition-all duration-200 hover:bg-silver-bright hover:shadow-[0_0_24px_rgba(221,217,240,0.15)] active:bg-text-body"
            >
              View on GitHub
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default FaqPage