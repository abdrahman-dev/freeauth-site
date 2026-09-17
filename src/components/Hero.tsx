import type { ReactElement } from 'react'
import { GITHUB_URL } from '../lib/github.ts'
import Aurora from './Aurora.tsx'
import CodeBlock from './CodeBlock.tsx'

export default function Hero(): ReactElement {
  return (
    <section
      aria-labelledby="hero-heading"
      className="px-3 pt-[70px] sm:px-6 sm:pt-[30px]"
    >
      <div
        className="
          relative
          mx-auto
          flex
          min-h-[84vh]
          w-full
          max-w-6xl
          flex-col
          justify-center
          overflow-hidden
          rounded-[20px]
          border
          border-[rgba(221,217,240,0.05)]
          bg-bg-base
          px-6
          py-[88px]
          isolate
          sm:min-h-[600px]
          sm:px-16
          sm:py-24
        "
      >
        {/* Aurora — Canvas 2D mesh-gradient blobs, lighter blend, no WebGL dependency */}
        <Aurora />

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

        {/* Hero content — centered (was left-aligned grid column) */}
        <div
          className="
            relative
            z-10
            mx-auto
            max-w-2xl
            text-center
          "
        >
          <div className="flex flex-wrap justify-center gap-2">
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
              text-center
              text-[clamp(2.25rem,6vw,3.35rem)]
              font-light
              leading-[1.06]
              tracking-[-0.025em]
              text-silver-primary
              [text-shadow:0_2px_40px_rgba(13,11,26,0.98)]
            "
          >
            The auth layer
            <br className="hidden sm:block" />
            you actually own.
          </h1>

          <p
            className="
              mx-auto
              mt-6
              max-w-[42rem]
              text-center
              text-base
              leading-[1.7]
              text-text-secondary
              [text-shadow:0_1px_24px_rgba(13,11,26,0.98)]
            "
          >
            <span className="text-[#8AC8BD]">DB-agnostic</span>, open-source,
            and built to be understood quickly. No vendor, no lock-in, just
            your database and your code.
          </p>

          {/*
            HERO CTA HIERARCHY — one primary, one ghost (guide §8, §15):
            "Get started" (primary, silver) leads to /docs; "View on
            GitHub" stays as the quiet secondary ghost link beside it.
          */}
          <div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-6">
            <a
              href="/docs"
              className="
                openauth-cta-glow
                relative
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

          {/* Install command — single npm line for now; pnpm/yarn tabs can be added here later */}
          <div className="mx-auto mt-8 max-w-[360px]">
            <CodeBlock code="npm install openauth" language="bash" showCursor />
          </div>
        </div>

      </div>
    </section>
  )
}