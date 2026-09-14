import { useState } from 'react'
import type { ReactElement } from 'react'
import { GITHUB_URL } from '../lib/github.ts'

interface FaqItem {
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    question: 'What does OpenAuth actually do?',
    answer:
      "It's the boring plumbing of login: sessions, tokens, password checks, packaged so you stop writing it from scratch. It doesn't host anything or lock you into a platform; it runs inside your Node app, against your database.",
  },
  {
    question: "Why DB-agnostic? Isn't that just extra abstraction?",
    answer:
      'Every ORM has its own idea of what a user looks like, and every auth library picks a favorite. We got tired of re-learning auth each time the database changed, so OpenAuth adapts to the schema you already have instead of demanding its own tables.',
  },
  {
    question: 'Is it ready to use in production?',
    answer:
      "Honestly? Not yet. It's early and the API is still shifting. Perfect for side projects and kicking the tires, not yet for anything holding real user data. The status badge up top will tell you when that changes. It won't throw a party. We'll just quietly update the badge.",
  },
  {
    question: 'Which databases are supported?',
    answer:
      "Prisma and Mongoose today. The two the makers run daily. More adapters are planned, driven by what contributors actually use. If yours is missing, that's a great first issue.",
  },
  {
    question: 'How can I contribute?',
    answer:
      'The usual honest ways: try it, file issues when it breaks, add the adapter you need, fix a typo in the docs. Small PRs from strangers are genuinely welcome.',
  },
  {
    question: 'What license is it under?',
    answer:
      "MIT. Use it anywhere, including the thing you're definitely going to charge money for. No attribution gymnastics required.",
  },
]

function Chevron({ open }: { open: boolean }): ReactElement {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-200 ${
        open ? 'rotate-180' : ''
      }`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function Faq(): ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mt-10 flex flex-col gap-3">
      {FAQS.map((item, index) => {
        const open = openIndex === index
        return (
          <div
            key={item.question}
            className={`rounded-[16px] border bg-bg-card transition-colors duration-200 ${
              open
                ? 'border-[rgba(221,217,240,0.12)]'
                : 'border-[rgba(221,217,240,0.05)]'
            }`}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`faq-panel-${String(index)}`}
              id={`faq-button-${String(index)}`}
              onClick={() => {
                setOpenIndex(open ? null : index)
              }}
              className="flex min-h-[44px] w-full items-center justify-between gap-4 rounded-[16px] px-6 py-4 text-left"
            >
              <span className="text-sm font-normal text-silver-primary">
                {item.question}
              </span>
              <span className="text-text-dim">
                <Chevron open={open} />
              </span>
            </button>
            {open && (
              <div
                id={`faq-panel-${String(index)}`}
                role="region"
                aria-labelledby={`faq-button-${String(index)}`}
                className="px-6 pb-5"
              >
                <p className="text-[13px] leading-[1.7] text-text-secondary">
                  {item.answer}{' '}
                  {item.question === 'How can I contribute?' && (
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-text-dim underline decoration-[rgba(221,217,240,0.25)] underline-offset-[3px] transition-colors duration-200 hover:text-silver-primary"
                    >
                      Find the repo here.
                    </a>
                  )}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
