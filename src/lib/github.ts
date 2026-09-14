import { useEffect, useState } from 'react'

/* Single source for the public repo identity. The default is the
   official OpenAuth backend repository. Override with
   VITE_GITHUB_REPO (see .env.example) only to point at a different
   repo, e.g. a fork. */

function resolveRepo(): string {
  const raw: unknown = import.meta.env.VITE_GITHUB_REPO
  if (typeof raw === 'string' && raw.length > 0) {
    return raw
  }
  return 'abdrahman-dev/openauth'
}

export const GITHUB_REPO: string = resolveRepo()

export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`

export function formatStars(count: number): string {
  if (count >= 1000) {
    const short = (count / 1000).toFixed(1).replace(/\.0$/, '')
    return `${short}k`
  }
  return String(count)
}

interface StarsResponse {
  stargazers_count?: unknown
}

/**
 * Live star count for the public repo. Returns null while loading or
 * whenever the fetch fails — callers must render nothing in that case
 * (silent degradation, never a broken "0" or an error message).
 */
export function useGitHubStars(): number | null {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      controller.abort()
    }, 8000)

    fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub API responded ${String(response.status)}`)
        }
        return response.json() as Promise<unknown>
      })
      .then((data: unknown) => {
        if (typeof data === 'object' && data !== null) {
          const count = (data as StarsResponse).stargazers_count
          if (typeof count === 'number' && Number.isFinite(count)) {
            setStars(count)
          }
        }
      })
      .catch(() => {
        // Silent: a missing count is simply not shown.
      })
      .finally(() => {
        window.clearTimeout(timer)
      })

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [])

  return stars
}
