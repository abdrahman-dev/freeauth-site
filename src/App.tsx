import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import Home from './pages/Home.tsx'
import FaqPage from './pages/FaqPage.tsx'
import DocsShell from './docs/DocsShell.tsx'
import NotFound from './pages/NotFound.tsx'

/* Minimal client-side routing (no dependency): "/" renders the landing
   page, "/faq" the FAQ page, "/docs/*" the documentation section
   (one real route per docs page, resolved in DocsShell), any other
   path renders the 404 page.
   Note: direct loads of unknown paths also need an SPA fallback in
   the static host config. */

function getPath(): string {
  const path = window.location.pathname.replace(/\/+$/, '')
  return path === '' ? '/' : path
}

function App(): ReactElement {
  const [path, setPath] = useState<string>(() => getPath())

  useEffect(() => {
    const onPopState = (): void => {
      setPath(getPath())
      window.scrollTo(0, 0)
    }
    const onHashChange = (): void => {
      // Same-document anchor nav: no route change, and no scroll reset —
      // the browser handles scrolling to the anchor.
      setPath(getPath())
    }
    window.addEventListener('popstate', onPopState)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  if (path === '/faq') {
    return <FaqPage />
  }
  if (path === '/docs' || path.startsWith('/docs/')) {
    return <DocsShell path={path} />
  }
  if (path !== '/') {
    return <NotFound />
  }
  return <Home />
}

export default App
