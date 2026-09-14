import { lazy, Suspense } from 'react'
import type {
  ComponentType,
  LazyExoticComponent,
  ReactElement,
} from 'react'
import DocsLayout from '../components/docs/DocsLayout.tsx'
import { A, P, PageHeader } from '../components/docs/primitives.tsx'
import { API_ENDPOINTS } from './api/index.ts'
import { findDocsEntry } from './nav.ts'

/* Docs router: one real route per documentation page, following the
   project's existing pathname-state routing (no new router library).
   Page modules are lazily loaded so each docs visit fetches only the
   page it renders. Unknown /docs/* paths keep the docs shell with a
   scoped not-found article instead of dropping to the marketing 404. */

const pageLoaders: Record<string, () => Promise<{ default: ComponentType }>> =
  {
    '/docs': () => import('./pages/Introduction.tsx'),
    '/docs/installation': () => import('./pages/Installation.tsx'),
    '/docs/quickstart': () => import('./pages/Quickstart.tsx'),
    '/docs/concepts/architecture': () =>
      import('./pages/concepts/Architecture.tsx'),
    '/docs/concepts/authentication': () =>
      import('./pages/concepts/Authentication.tsx'),
    '/docs/concepts/adapters': () => import('./pages/concepts/Adapters.tsx'),
    '/docs/concepts/validation-errors': () =>
      import('./pages/concepts/ValidationErrors.tsx'),
    '/docs/concepts/security': () => import('./pages/concepts/Security.tsx'),
    '/docs/api': () => import('./pages/ApiOverview.tsx'),
    '/docs/adapters': () => import('./pages/AdaptersOverview.tsx'),
    '/docs/adapters/mongoose': () => import('./pages/Mongoose.tsx'),
    '/docs/adapters/prisma': () => import('./pages/Prisma.tsx'),
    '/docs/guides/email-delivery': () =>
      import('./pages/guides/EmailDelivery.tsx'),
    '/docs/guides/production': () => import('./pages/guides/Production.tsx'),
  }

const LazyApiPage = lazy(
  () => import('../components/docs/ApiPage.tsx'),
)

/* Module-level lazy map: one code-split chunk per page, created once —
   never during render. */
const lazyPages: Record<string, LazyExoticComponent<ComponentType>> =
  Object.fromEntries(
    Object.entries(pageLoaders).map(([href, load]) => [href, lazy(load)]),
  )

function LoadingPage(): ReactElement {
  return <p className="mt-8 text-[13px] text-text-subtle">Loading…</p>
}

function DocsNotFound(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="404"
        title="This page isn't in the docs."
        lede="The address doesn't match any documentation page. The sidebar lists everything that exists."
      />
      <P>
        Start from <A href="/docs">Introduction</A> or browse the{' '}
        <A href="/docs/api">API reference</A>.
      </P>
    </>
  )
}

export default function DocsShell({ path }: { path: string }): ReactElement {
  const entry = findDocsEntry(path)
  const title = entry?.entry.title ?? 'Page not found'

  const endpoint =
    path.startsWith('/docs/api/') && path !== '/docs/api'
      ? API_ENDPOINTS[path.slice('/docs/api/'.length)]
      : undefined

  const LazyPage = lazyPages[path] ?? null

  return (
    <DocsLayout path={path} title={title}>
      <Suspense fallback={<LoadingPage />}>
        {endpoint !== undefined ? (
          <LazyApiPage endpoint={endpoint} />
        ) : LazyPage !== null ? (
          <LazyPage />
        ) : (
          <DocsNotFound />
        )}
      </Suspense>
    </DocsLayout>
  )
}
