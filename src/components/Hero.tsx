import { Suspense, lazy } from 'react'
import type { ReactElement } from 'react'
import { GITHUB_URL } from '../lib/github.ts'

const BlackHole = lazy(() => import('./BlackHole'))

function HeroFallback(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-[-10%]
        bg-[radial-gradient(circle_at_center,rgba(175,169,236,0.10)_0%,rgba(82,70,140,0.05)_28%,transparent_62%)]
        opacity-90
      "
    />
  )
}

export default function Hero(): ReactElement {
  return (
    <section
      aria-labelledby="hero-heading"
      className="px-3 pt-24 sm:px-6 sm:pt-28"
    >
      <div
        className="
          relative
          mx-auto
          grid
          min-h-[78vh]
          w-full
          max-w-6xl
          grid-cols-1
          items-center
          gap-10
          md:grid-cols-[minmax(0,46%)_minmax(0,54%)]
          md:gap-6
          overflow-hidden
          rounded-[20px]
          border
          border-[rgba(221,217,240,0.05)]
          bg-bg-base
          px-6
          py-[72px]
          isolate
          sm:px-16
        "
      >
        {/* Black hole */}
        <Suspense fallback={<HeroFallback />}>
          <BlackHole />
        </Suspense>

        {/* Atmospheric vignette */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            bg-[radial-gradient(circle_at_center,transparent_0%,transparent_42%,rgba(13,11,26,0.28)_76%,rgba(13,11,26,0.72)_100%)]
          "
        />

        {/* Text readability layer — tracks the copy: left column on
            desktop, top block on the mobile stack */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[26%]
            z-[2]
            h-[24rem]
            w-[min(92%,52rem)]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[radial-gradient(ellipse_at_center,rgba(13,11,26,0.52)_0%,rgba(13,11,26,0.24)_35%,transparent_72%)]
            blur-2xl
            md:left-[24%]
            md:top-1/2
          "
        />

        {/* Bottom blend */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-[3]
            h-32
            bg-gradient-to-b
            from-transparent
            to-bg-base
          "
        />

        {/* Hero content — left column on desktop, top block on mobile */}
        <div
          className="
            relative
            z-10
            max-w-xl
            text-left
          "
        >
          <div className="flex flex-wrap items-center gap-2">
            <p
              className="
                inline-flex
                items-center
                rounded-[20px]
                border
                border-[rgba(221,217,240,0.12)]
                bg-[rgba(221,217,240,0.05)]
                px-[11px]
                py-1
                text-[11px]
                tracking-[0.08em]
                text-text-dim
                backdrop-blur-[2px]
              "
            >
              DB-agnostic&nbsp;&middot;&nbsp;Node.js&nbsp;&ge;&nbsp;18
            </p>
            <p
              title="OpenAuth is pre-release. The API may still change, but it's already fun to try."
              className="
                inline-flex
                items-center
                gap-2
                rounded-[20px]
                border
                border-[rgba(221,217,240,0.12)]
                bg-[rgba(221,217,240,0.05)]
                px-[11px]
                py-1
                text-[11px]
                tracking-[0.08em]
                text-text-dim
                backdrop-blur-[2px]
              "
            >
              <span
                aria-hidden="true"
                className="openauth-status-pulse inline-block h-[6px] w-[6px] rounded-full bg-success"
              />
              Early development
            </p>
          </div>

          <h1
            id="hero-heading"
            className="
              mt-8
              text-[clamp(2.25rem,6vw,3.35rem)]
              font-light
              leading-[1.06]
              tracking-[-0.025em]
              text-silver-primary
              [text-shadow:0_2px_40px_rgba(13,11,26,0.98)]
            "
          >
            Authentication that gets out of your way.
          </h1>

          <p
            className="
              mt-6
              max-w-xl
              text-base
              leading-[1.7]
              text-text-secondary
              [text-shadow:0_1px_24px_rgba(13,11,26,0.98)]
            "
          >
            Setup is suspiciously short. Describe it
            to your coding agent and come back to
            working auth.
          </p>

          {/*
            HERO CTA HIERARCHY — one primary, one ghost (guide §8, §15):
            "Get started" (primary, silver) leads to /docs; "View on
            GitHub" stays as the quiet secondary ghost link beside it.
          */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="/docs"
              className="
                inline-flex
                min-h-[44px]
                items-center
                justify-center
                rounded-[10px]
                bg-silver-primary
                px-[22px]
                py-[9px]
                text-[13px]
                tracking-[0.06em]
                text-bg-base
                transition-all
                duration-200
                hover:bg-silver-bright
                hover:shadow-[0_0_28px_rgba(221,217,240,0.18)]
                active:bg-text-body
              "
            >
              Get started
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="
                inline-flex
                min-h-[44px]
                items-center
                text-[13px]
                tracking-[0.06em]
                text-text-dim
                underline
                decoration-[rgba(221,217,240,0.25)]
                underline-offset-[3px]
                transition-colors
                duration-200
                hover:text-silver-primary
              "
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Right column — reserves the hole's half on desktop, gives it
            room below the copy on the mobile stack. The canvas itself
            stays full-bleed behind everything; the hole is positioned
            into this half via the uCenter uniform. */}
        <div
          aria-hidden="true"
          className="relative z-0 h-[42vh] min-h-[320px] md:h-auto md:min-h-[58vh]"
        />
      </div>
    </section>
  )
}