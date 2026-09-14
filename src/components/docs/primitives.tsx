import type { ReactElement, ReactNode } from 'react'
import CodeBlock from '../CodeBlock.tsx'

/* Shared documentation prose primitives. All visual choices follow
   docs/ui-guide.md: Geist light headings in silver, 14px/1.75 dim body,
   Geist Mono technical details, subtle silver-alpha borders. Pages
   compose these — no page invents its own type scale. */

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: string
  lede: ReactNode
}): ReactElement {
  return (
    <header>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-subtle">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-[30px] font-light leading-[1.2] tracking-[-0.015em] text-silver-primary sm:text-[34px]">
        {title}
      </h1>
      <div className="mt-5 max-w-[62ch] text-[15px] leading-[1.75] text-text-secondary">
        {lede}
      </div>
      <div aria-hidden="true" className="mt-8 h-px w-full bg-border" />
    </header>
  )
}

function AnchorLink({ id }: { id: string }): ReactElement {
  return (
    <a
      href={`#${id}`}
      aria-label="Link to this section"
      className="ml-2 font-mono text-[13px] text-text-subtle opacity-0 transition-opacity duration-200 hover:text-silver-primary focus-visible:opacity-100 group-hover:opacity-100"
    >
      #
    </a>
  )
}

export function H2({
  id,
  children,
}: {
  id: string
  children: ReactNode
}): ReactElement {
  return (
    <h2
      id={id}
      className="group mt-12 scroll-mt-24 text-[20px] font-light tracking-[-0.01em] text-silver-primary"
    >
      {children}
      <AnchorLink id={id} />
    </h2>
  )
}

export function H3({
  id,
  children,
}: {
  id: string
  children: ReactNode
}): ReactElement {
  return (
    <h3
      id={id}
      className="group mt-8 scroll-mt-24 text-[15px] font-medium tracking-normal text-text-body"
    >
      {children}
      <AnchorLink id={id} />
    </h3>
  )
}

export function P({ children }: { children: ReactNode }): ReactElement {
  return (
    <p className="mt-4 max-w-[72ch] text-[14px] leading-[1.75] text-text-dim">
      {children}
    </p>
  )
}

/** Inline code: silver-dim on a quiet elevated chip. */
export function C({ children }: { children: ReactNode }): ReactElement {
  return (
    <code className="whitespace-nowrap rounded-[6px] border border-[rgba(221,217,240,0.08)] bg-[rgba(221,217,240,0.06)] px-[5px] py-[1px] font-mono text-[12.5px] text-silver-dim">
      {children}
    </code>
  )
}

/** Article link: dim with a subtle underline, silver on hover. */
export function A({
  href,
  children,
  external,
}: {
  href: string
  children: ReactNode
  external?: boolean
}): ReactElement {
  return (
    <a
      href={href}
      {...(external === true
        ? { target: '_blank', rel: 'noreferrer' }
        : {})}
      className="text-silver-dim underline decoration-[rgba(221,217,240,0.25)] underline-offset-[3px] transition-colors duration-200 hover:text-silver-bright"
    >
      {children}
    </a>
  )
}

export function UL({ items }: { items: ReactNode[] }): ReactElement {
  return (
    <ul className="mt-4 flex max-w-[72ch] flex-col gap-2.5">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-3 text-[14px] leading-[1.7] text-text-dim"
        >
          <span aria-hidden="true" className="mt-[1px] shrink-0 text-text-subtle">
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function OL({ items }: { items: ReactNode[] }): ReactElement {
  return (
    <ol className="mt-4 flex max-w-[72ch] flex-col gap-2.5">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-3 text-[14px] leading-[1.7] text-text-dim"
        >
          <span
            aria-hidden="true"
            className="shrink-0 font-mono text-[12px] leading-[1.9] text-text-subtle"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  )
}

type CalloutTone = 'note' | 'warn'

const CALLOUT_CLASS: Record<CalloutTone, string> = {
  note: 'border-[rgba(90,86,128,0.4)] bg-[rgba(90,86,128,0.08)]',
  warn: 'border-[rgba(193,112,112,0.35)] bg-[rgba(193,112,112,0.07)]',
}

const CALLOUT_LABEL: Record<CalloutTone, string> = {
  note: 'text-silver-dim',
  warn: 'text-error',
}

export function Callout({
  tone = 'note',
  title,
  children,
}: {
  tone?: CalloutTone
  title: string
  children: ReactNode
}): ReactElement {
  return (
    <aside
      className={`mt-6 max-w-[72ch] rounded-[12px] border px-5 py-4 ${CALLOUT_CLASS[tone]}`}
    >
      <p
        className={`font-mono text-[11px] uppercase tracking-[0.18em] ${CALLOUT_LABEL[tone]}`}
      >
        {title}
      </p>
      <div className="mt-2 text-[13.5px] leading-[1.7] text-text-dim">
        {children}
      </div>
    </aside>
  )
}

export function DataTable({
  head,
  rows,
  caption,
}: {
  head: string[]
  rows: ReactNode[][]
  caption?: string
}): ReactElement {
  return (
    <div className="mt-6 overflow-x-auto rounded-[12px] border border-[rgba(221,217,240,0.07)] bg-bg-elevated/40">
      <table className="w-full min-w-[560px] border-collapse text-left">
        {caption !== undefined && caption !== '' && (
          <caption className="px-5 pb-2 pt-4 text-left font-mono text-[11px] uppercase tracking-[0.16em] text-text-subtle">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-divider">
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-text-secondary"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex < rows.length - 1
                  ? 'border-b border-[rgba(42,40,69,0.6)]'
                  : ''
              }
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-5 py-3 align-top text-[13px] leading-[1.65] text-text-dim"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Docs code sample: the shared CodeBlock with a language label. */
export function Code({
  code,
  language,
  caption,
}: {
  code: string
  language?: string
  caption?: string
}): ReactElement {
  return (
    <div className="mt-6 max-w-[72ch]">
      <CodeBlock code={code} language={language} caption={caption} />
    </div>
  )
}
