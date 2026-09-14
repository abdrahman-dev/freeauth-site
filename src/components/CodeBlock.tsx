import { useEffect, useRef, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'

export interface CodeBlockProps {
  code: string
  /** Short note rendered under the block, e.g. an illustrative-API disclaimer. */
  caption?: string
  /** Language label rendered top-left, e.g. "bash", "json", "ts". Purely presentational. */
  language?: string
}

type Tone = 'base' | 'body' | 'dim' | 'subtle'

const TONE_CLASS: Record<Tone, string> = {
  base: 'text-text-dim',
  body: 'text-text-body',
  dim: 'text-silver-dim',
  subtle: 'text-text-subtle',
}

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'const',
  'function',
  'return',
  'await',
  'async',
  'interface',
  'type',
  'new',
  'true',
  'false',
  'null',
])

/**
 * Minimal restrained tokenizer: comments, string literals, a few keywords,
 * and the leading `npm` command each get a quiet tone from the existing
 * neutral/silver palette. No neon editor theme.
 */
function tokenizeLine(line: string, keyPrefix: string): ReactNode[] {
  const trimmed = line.trimStart()
  if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
    return [
      <span key={`${keyPrefix}-c`} className={TONE_CLASS.subtle}>
        {line}
      </span>,
    ]
  }

  const nodes: ReactNode[] = []
  // Split while keeping string literals ("...") as separate parts.
  const parts = line.split(/("[^"]*")/g)
  parts.forEach((part, partIndex) => {
    const key = `${keyPrefix}-${partIndex}`
    if (part.startsWith('"') && part.endsWith('"') && part.length > 1) {
      nodes.push(
        <span key={key} className={TONE_CLASS.dim}>
          {part}
        </span>,
      )
      return
    }
    // Highlight a small keyword set; everything else stays base.
    const words = part.split(
      /(\bimport\b|\bfrom\b|\bexport\b|\bconst\b|\bnpm\b|\bcurl\b|\bfunction\b|\breturn\b|\bawait\b|\basync\b|\binterface\b|\btype\b|\bnew\b|\btrue\b|\bfalse\b|\bnull\b)/g,
    )
    words.forEach((word, wordIndex) => {
      if (word === '') return
      const tone: Tone = KEYWORDS.has(word)
        ? 'body'
        : word === 'npm'
          ? 'body'
          : 'base'
      nodes.push(
        <span key={`${key}-${wordIndex}`} className={TONE_CLASS[tone]}>
          {word}
        </span>,
      )
    })
  })
  return nodes
}

export default function CodeBlock({
  code,
  caption,
  language,
}: CodeBlockProps): ReactElement {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const current = timer.current
    return () => {
      if (current !== undefined) window.clearTimeout(current)
    }
  }, [])

  const onCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const fallback = document.createElement('textarea')
      fallback.value = code
      document.body.appendChild(fallback)
      fallback.select()
      document.execCommand('copy')
      document.body.removeChild(fallback)
    }
    setCopied(true)
    if (timer.current !== undefined) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setCopied(false)
    }, 1600)
  }

  const lines = code.split('\n')

  return (
    <figure className="m-0">
      <div className="relative rounded-[12px] border border-[rgba(221,217,240,0.06)] bg-bg-elevated px-4 py-5 shadow-[0_4px_24px_rgba(0,0,0,0.3)] sm:px-6">
        {language !== undefined && language !== '' && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-4 select-none font-mono text-[10px] uppercase tracking-[0.14em] text-text-subtle sm:left-6"
          >
            {language}
          </span>
        )}
        <button
          type="button"
          onClick={() => void onCopy()}
          aria-live="polite"
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
          className={`absolute right-4 top-4 rounded-[6px] border border-[rgba(221,217,240,0.08)] bg-[rgba(221,217,240,0.05)] px-2 py-[5px] font-mono text-[10px] tracking-[0.1em] transition-colors duration-200 hover:text-silver-primary ${
            copied ? 'text-success' : 'text-text-dim'
          }`}
        >
          {copied ? 'copied' : 'copy'}
        </button>
        <pre
          className={`code-scroll overflow-x-auto pr-16 font-mono text-[13px] leading-[1.75] ${
            language !== undefined && language !== '' ? 'pt-6' : ''
          }`}
        >
          <code>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex} className="block min-h-[1.75em]">
                {tokenizeLine(line, `l${lineIndex}`)}
              </span>
            ))}
          </code>
        </pre>
      </div>
      {caption !== undefined && caption !== '' && (
        <figcaption className="mt-3 text-xs leading-[1.6] tracking-[0.02em] text-text-secondary">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
