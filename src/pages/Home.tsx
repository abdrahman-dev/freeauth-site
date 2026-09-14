import { useEffect } from 'react'
import type { ReactElement } from 'react'
import Navbar from '../components/Navbar.tsx'
import Hero from '../components/Hero.tsx'
import FeatureCard from '../components/FeatureCard.tsx'
import Footer from '../components/Footer.tsx'
import SectionHeading from '../components/SectionHeading.tsx'
import { GITHUB_URL } from '../lib/github.ts'

/* Guide §27 — thin-line outline icons, currentColor, low visual weight */

interface IconProps {
  className?: string
}

function DatabaseIcon({ className = '' }: IconProps): ReactElement {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="12" cy="5.5" rx="7" ry="2.8" />
      <path d="M5 5.5v13c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-13" />
      <path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" />
    </svg>
  )
}

function DocumentIcon({ className = '' }: IconProps): ReactElement {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M6 2.5h8L19 8v13.5H6z" />
      <path d="M14 2.5V8h5" />
      <path d="M9 12h6M9 15.5h6" />
    </svg>
  )
}

function EllipsisIcon({ className = '' }: IconProps): ReactElement {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="5" cy="12" r="0.75" />
      <circle cx="12" cy="12" r="0.75" />
      <circle cx="19" cy="12" r="0.75" />
    </svg>
  )
}

function Home(): ReactElement {
  useEffect(() => {
    document.title = 'OpenAuth — Authentication for Node.js'
  }, [])

  return (
    <div className="min-h-screen bg-bg-base font-sans text-text-dim">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-bg-card focus:px-4 focus:py-2 focus:text-[13px] focus:text-silver-primary"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />

        <section
          aria-labelledby="features-heading"
          className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-32"
        >
          {/*
            FEATURES VOICE — Set A live (the maintainer who's rewritten
            auth too often). Supabase card removed: the adapter isn't
            implemented yet, so the third slot is an honest dashed
            placeholder instead of a badge wall.
            --
            PLACEHOLDER COPY OPTIONS — C live:
            A. "More, eventually." — next adapter arrives when someone
               needs it badly enough to build it.
            B. "Your database here." — two that work beats twelve that
               mostly do; an invitation, not a gap.
            C. "Two down. Yours next?" [LIVE] — no badge wall; the third
               slot is reserved for real production use.
          */}
          <SectionHeading
            title="Auth shouldn't care what database you use."
            headingId="features-heading"
          />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            <FeatureCard
              title="Prisma"
              description="Your schema already describes your users — sessions just live alongside them. No migration guides, no shadow tables breeding in the dark."
              icon={<DatabaseIcon />}
            />
            <FeatureCard
              title="Mongoose"
              description="It speaks Mongo natively, so your models stay yours. No translation layer to babysit every time a field changes."
              icon={<DocumentIcon />}
            />
            <article className="rounded-[16px] border border-dashed border-[rgba(221,217,240,0.14)] bg-transparent p-7">
              <div
                aria-hidden="true"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-[rgba(221,217,240,0.08)] bg-[rgba(221,217,240,0.02)] text-text-subtle"
              >
                <EllipsisIcon />
              </div>
              <h3 className="mt-5 text-sm font-normal text-text-dim">
                Two down. Yours next?
              </h3>
              <p className="mt-2 text-[13px] leading-[1.65] text-text-subtle">
                No badge wall of half-supported adapters. These two exist
                because they&apos;re used daily; the third slot is reserved
                for whatever a contributor actually runs in production.
              </p>
            </article>
          </div>
        </section>

        <section
          aria-labelledby="opensource-heading"
          className="mx-auto w-full max-w-3xl px-6 pb-20 sm:pb-28"
        >
          <SectionHeading
            title="Free forever. MIT, no asterisk."
            headingId="opensource-heading"
          />
          {/*
            OPEN-SOURCE PARAGRAPH — Option B live. Alternatives kept:
            A. Straightforward two-paragraph version with the contributor
               link inline.
            C. Driest and most breathable — short punchy sentences.
          */}
          <p className="mt-8 text-[15px] leading-[1.75] text-text-dim">
            Free forever, MIT-licensed, no asterisk. There is no paid tier
            quietly holding adapters hostage, and there never will be.
          </p>
          <p className="mt-4 text-[15px] leading-[1.75] text-text-dim">
            Prisma and Mongoose came first because the makers use them
            daily. The next ones come from contributors —{' '}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-text-dim underline decoration-[rgba(221,217,240,0.25)] underline-offset-[3px] transition-colors duration-200 hover:text-silver-primary"
            >
              whoever shows up to build them
            </a>{' '}
            — and whichever stack you bring, OpenAuth meets it where it is.
            No migration. No re-platforming. No new database religion.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
