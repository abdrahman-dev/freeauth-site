import { useEffect, useRef, useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import Footer from '../Footer.tsx'
import DocsHeader from './DocsHeader.tsx'
import DocsSidebar from './DocsSidebar.tsx'
import DocsToc from './DocsToc.tsx'
import type { TocHeading } from './DocsToc.tsx'
import DocsBreadcrumbs from './DocsBreadcrumbs.tsx'
import DocsPagination from './DocsPagination.tsx'
import DocsSearch from './DocsSearch.tsx'
import { DOCS_DESCRIPTIONS } from '../../docs/nav.ts'

/* Every /docs/* page renders inside this layout: sticky docs header,
   sticky scrollable sidebar, readable article column, generated "On
   this page" outline, prev/next, shared footer. Mobile gets a drawer
   instead of a squeezed sidebar. */

function CloseIcon(): ReactElement {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export default function DocsLayout({
  path,
  title,
  children,
}: {
  path: string
  title: string
  children: ReactNode
}): ReactElement {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [headings, setHeadings] = useState<TocHeading[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const articleRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.title = `${title}: OpenAuth Docs`
    const description = DOCS_DESCRIPTIONS[path]
    if (description !== undefined) {
      let tag = document.querySelector('meta[name="description"]')
      if (tag === null) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [path, title])

  /* Collect the article's own h2/h3 headings so the outline is
     generated, never hand-duplicated. A MutationObserver re-collects
     when lazily-loaded page content resolves after first paint. */
  useEffect(() => {
    const root = articleRef.current
    if (root === null) return
    const collect = (): void => {
      const found: TocHeading[] = []
      root.querySelectorAll('h2[id], h3[id]').forEach((node) => {
        const id = node.getAttribute('id')
        const text = (node.textContent ?? '').replace(/#$/, '').trim()
        if (id === null || id === '' || text === '') return
        found.push({
          id,
          text,
          level: node.tagName === 'H3' ? 3 : 2,
        })
      })
      setHeadings((prev) => {
        if (
          prev.length === found.length &&
          prev.every(
            (item, index) =>
              item.id === found[index].id &&
              item.text === found[index].text &&
              item.level === found[index].level,
          )
        ) {
          return prev
        }
        return found
      })
    }
    collect()
    const observer = new MutationObserver(collect)
    observer.observe(root, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
    }
  }, [path])

  /* Scroll-spy: the heading crossing a thin band under the sticky
     header marks its TOC entry active. All state updates happen in the
     observer callback, so scrolling never drives React renders
     directly. Latest-in-document-order wins ties for stability. */
  useEffect(() => {
    const root = articleRef.current
    if (root === null || headings.length === 0) return
    const nodes = Array.from(
      root.querySelectorAll('h2[id], h3[id]'),
    )
    if (nodes.length === 0) return
    const order = new Map(nodes.map((node, index) => [node.id, index]))
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id)
        if (visible.length > 0) {
          let best = visible[0]
          for (const id of visible) {
            if ((order.get(id) ?? 0) > (order.get(best) ?? 0)) best = id
          }
          setActiveId(best)
        } else if (window.scrollY < 200) {
          const first = headings[0]?.id
          if (first !== undefined) setActiveId(first)
        }
      },
      { rootMargin: '-72px 0px -70% 0px', threshold: 0 },
    )
    nodes.forEach((node) => {
      spy.observe(node)
    })
    return () => {
      spy.disconnect()
    }
  }, [path, headings])

  /* ⌘K / Ctrl+K opens search from anywhere in the docs. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault()
        setSearchOpen((prev) => !prev)
      } else if (event.key === 'Escape') {
        setSearchOpen(false)
        setDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  /* Drawer: lock body scroll + move focus to the close control. */
  useEffect(() => {
    if (!drawerOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = previous
    }
  }, [drawerOpen])

  return (
    <div className="flex min-h-screen flex-col bg-bg-base font-sans text-text-dim">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-md focus:bg-bg-card focus:px-4 focus:py-2 focus:text-[13px] focus:text-silver-primary"
      >
        Skip to content
      </a>
      <DocsHeader
        onMenu={() => {
          setDrawerOpen(true)
        }}
        onSearch={() => {
          setSearchOpen(true)
        }}
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 items-start px-4 sm:px-6 lg:gap-12 lg:px-8">
        <aside className="docs-scroll sticky top-14 hidden max-h-[calc(100vh-3.5rem)] w-[248px] shrink-0 overflow-y-auto py-10 lg:block">
          <DocsSidebar path={path} />
        </aside>

        <main id="main" className="min-w-0 flex-1 py-10 lg:py-12">
          <div className="mx-auto w-full max-w-[740px]">
            <DocsBreadcrumbs path={path} />
            <article ref={articleRef}>{children}</article>
            <DocsPagination path={path} />
          </div>
        </main>

        <aside className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] w-[216px] shrink-0 overflow-y-auto py-12 xl:block">
          <DocsToc headings={headings} activeId={activeId} />
        </aside>
      </div>

      <Footer />

      {drawerOpen && (
        <div
          className="fixed inset-0 z-[70] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Documentation navigation"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[rgba(13,11,26,0.72)]"
            onClick={() => {
              setDrawerOpen(false)
            }}
          />
          <div className="docs-scroll absolute left-0 top-0 h-full w-[300px] max-w-[85vw] overflow-y-auto border-r border-[rgba(221,217,240,0.08)] bg-bg-base px-4 py-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-subtle">
                Browse docs
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => {
                  setDrawerOpen(false)
                }}
                aria-label="Close documentation navigation"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-[8px] text-text-secondary transition-colors duration-200 hover:bg-[rgba(221,217,240,0.04)] hover:text-silver-primary"
              >
                <CloseIcon />
              </button>
            </div>
            <DocsSidebar path={path} />
          </div>
        </div>
      )}

      {searchOpen && (
        <DocsSearch
          onClose={() => {
            setSearchOpen(false)
          }}
        />
      )}
    </div>
  )
}
