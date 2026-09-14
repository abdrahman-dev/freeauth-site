/* Documentation navigation model. This is the single source of truth
   for the sidebar, search index, breadcrumbs, and previous/next order.
   Adding a page = one entry here + one route in DocsShell + one content
   module. Groups render in order; items render in order. `children`
   allows one nested level without rewriting the sidebar. */

export interface DocsNavItem {
  title: string
  href: string
  keywords?: string[]
  children?: DocsNavItem[]
}

export interface DocsNavGroup {
  label: string
  items: DocsNavItem[]
}

export const DOCS_NAV: DocsNavGroup[] = [
  {
    label: 'Getting started',
    items: [
      {
        title: 'Introduction',
        href: '/docs',
        keywords: ['overview', 'what is', 'about', 'start here'],
      },
      {
        title: 'Installation',
        href: '/docs/installation',
        keywords: ['npm', 'install', 'setup', 'env', 'prerequisites'],
      },
      {
        title: 'Quickstart',
        href: '/docs/quickstart',
        keywords: ['tutorial', 'register', 'login', 'first app', 'curl'],
      },
    ],
  },
  {
    label: 'Core concepts',
    items: [
      {
        title: 'Architecture',
        href: '/docs/concepts/architecture',
        keywords: ['layers', 'core', 'reference app', 'lifecycle', 'design'],
      },
      {
        title: 'Authentication & sessions',
        href: '/docs/concepts/authentication',
        keywords: [
          'jwt',
          'tokens',
          'cookies',
          'refresh',
          'rotation',
          'otp',
          'password',
          'sessions',
        ],
      },
      {
        title: 'Adapters',
        href: '/docs/concepts/adapters',
        keywords: ['adapter', 'interface', 'database', 'orm', 'contract'],
      },
      {
        title: 'Validation & errors',
        href: '/docs/concepts/validation-errors',
        keywords: ['zod', 'errors', 'status codes', 'apperror', '422'],
      },
      {
        title: 'Security',
        href: '/docs/concepts/security',
        keywords: ['bcrypt', 'hashing', 'lockout', 'csrf', 'secrets', 'safe'],
      },
    ],
  },
  {
    label: 'API reference',
    items: [
      {
        title: 'Overview',
        href: '/docs/api',
        keywords: ['endpoints', 'rest', 'base path', 'conventions'],
      },
      {
        title: 'GET / (status)',
        href: '/docs/api/status',
        keywords: ['health', 'probe', 'ping', 'liveness'],
      },
      {
        title: 'POST /register',
        href: '/docs/api/register',
        keywords: ['signup', 'sign up', 'create user', 'registeruser'],
      },
      {
        title: 'POST /login',
        href: '/docs/api/login',
        keywords: ['signin', 'sign in', 'authenticate', 'loginuser'],
      },
      {
        title: 'POST /verify-email',
        href: '/docs/api/verify-email',
        keywords: ['otp', 'verify', 'confirm email', 'verifyemail'],
      },
      {
        title: 'POST /resend-otp',
        href: '/docs/api/resend-otp',
        keywords: ['resend', 'otp', 'new code', 'resendotp'],
      },
      {
        title: 'POST /refresh',
        href: '/docs/api/refresh',
        keywords: ['refresh token', 'rotate', 'rotation', 'session'],
      },
      {
        title: 'GET /me',
        href: '/docs/api/me',
        keywords: ['profile', 'current user', 'getme'],
      },
      {
        title: 'POST /forgot-password',
        href: '/docs/api/forgot-password',
        keywords: ['forgot', 'reset', 'recover', 'forgotpassword'],
      },
      {
        title: 'POST /reset-password',
        href: '/docs/api/reset-password',
        keywords: ['reset', 'new password', 'otp', 'resetpassword'],
      },
      {
        title: 'POST /change-password',
        href: '/docs/api/change-password',
        keywords: ['change', 'update password', 'changepassword'],
      },
      {
        title: 'POST /logout',
        href: '/docs/api/logout',
        keywords: ['logout', 'log out', 'signout', 'sign out', 'logoutuser'],
      },
    ],
  },
  {
    label: 'Adapters',
    items: [
      {
        title: 'Overview',
        href: '/docs/adapters',
        keywords: ['which database', 'choose', 'compare'],
      },
      {
        title: 'Mongoose',
        href: '/docs/adapters/mongoose',
        keywords: ['mongodb', 'mongoose', 'nosql', 'models'],
      },
      {
        title: 'Prisma',
        href: '/docs/adapters/prisma',
        keywords: ['postgres', 'postgresql', 'prisma', 'sql', 'schema'],
      },
    ],
  },
  {
    label: 'Guides',
    items: [
      {
        title: 'Email delivery',
        href: '/docs/guides/email-delivery',
        keywords: ['email', 'smtp', 'send otp', 'mailer', 'provider'],
      },
      {
        title: 'Going to production',
        href: '/docs/guides/production',
        keywords: ['deploy', 'production', 'checklist', 'env', 'secure'],
      },
    ],
  },
]

/* One-line page summaries for meta descriptions. Factual only: each
   line restates what its page documents, nothing more. */
export const DOCS_DESCRIPTIONS: Record<string, string> = {
  '/docs':
    'OpenAuth is a database-agnostic authentication toolkit for Node.js. Start here for an overview of the library, adapters, and reference app.',
  '/docs/installation':
    'Install the openauth package, add a Mongoose or Prisma peer dependency, and configure the reference app environment.',
  '/docs/quickstart':
    'Register a user, verify email with an OTP, log in, and call an authenticated endpoint against a local reference app.',
  '/docs/concepts/architecture':
    'How OpenAuth is layered: routes, controllers, the database-agnostic core, adapters, and middleware, plus the request lifecycle.',
  '/docs/concepts/authentication':
    'JWT access tokens, server-side refresh sessions with rotation and reuse detection, OTP verification, password hashing, and cookies.',
  '/docs/concepts/adapters':
    'The AuthAdapter interface both stores implement: user and session operations plus the normalized record shapes.',
  '/docs/concepts/validation-errors':
    'Zod body validation at the HTTP boundary, the AppError model, HTTP status mapping, and the shared response format.',
  '/docs/concepts/security':
    'Implemented protections such as bcrypt, rotation, lockouts, and rate limits, plus verified known concerns to review before production.',
  '/docs/api':
    'All eleven reference-app endpoints under /api/auth, with conventions for auth, rate limits, validation, and response shapes.',
  '/docs/api/status':
    'GET /api/auth/ liveness probe. Returns 200 when the server is up.',
  '/docs/api/register':
    'POST /api/auth/register. Create an unverified user, issue a verification OTP, and set the first session cookies.',
  '/docs/api/login':
    'POST /api/auth/login. Check credentials for a verified user and issue a fresh token pair.',
  '/docs/api/verify-email':
    'POST /api/auth/verify-email. Consume the verification OTP and unblock login.',
  '/docs/api/resend-otp':
    'POST /api/auth/resend-otp. Issue a fresh verification OTP for an unverified account.',
  '/docs/api/refresh':
    'POST /api/auth/refresh. Rotate the session: revoke the presented refresh token and mint a new pair.',
  '/docs/api/me':
    'GET /api/auth/me. Return the safe profile projection for the access-token holder.',
  '/docs/api/forgot-password':
    'POST /api/auth/forgot-password. Start a reset with an enumeration-resistant OTP response.',
  '/docs/api/reset-password':
    'POST /api/auth/reset-password. Consume a reset OTP, set a new password, and revoke all sessions.',
  '/docs/api/change-password':
    'POST /api/auth/change-password. Authenticated password change that revokes every session.',
  '/docs/api/logout':
    'POST /api/auth/logout. Revoke the presented session and clear cookies. Never fails.',
  '/docs/adapters':
    'Compare the Mongoose and Prisma adapters and choose the store your app already runs.',
  '/docs/adapters/mongoose':
    'MongoDB adapter: connection, User and RefreshToken models, queries, TTL expiry, and behavior notes.',
  '/docs/adapters/prisma':
    'PostgreSQL adapter: reference schema, usage with your own client, differences, and current limits.',
  '/docs/guides/email-delivery':
    'OpenAuth generates OTPs but sends nothing. Hook issuance points to your email provider.',
  '/docs/guides/production':
    'Checklist for running the reference app beyond localhost: build, environment, secrets, and explicit unknowns.',
}

export interface FlatDocsEntry {
  group: string
  title: string
  href: string
  keywords: string[]
}

function flattenItems(
  group: string,
  items: DocsNavItem[],
  out: FlatDocsEntry[],
): void {
  for (const item of items) {
    out.push({
      group,
      title: item.title,
      href: item.href,
      keywords: item.keywords ?? [],
    })
    if (item.children !== undefined) {
      flattenItems(group, item.children, out)
    }
  }
}

/** Depth-first reading order across groups — drives prev/next. */
export function flattenDocsNav(): FlatDocsEntry[] {
  const out: FlatDocsEntry[] = []
  for (const group of DOCS_NAV) {
    flattenItems(group.label, group.items, out)
  }
  return out
}

export function findDocsEntry(
  href: string,
): { group: string; entry: FlatDocsEntry; index: number } | null {
  const flat = flattenDocsNav()
  const index = flat.findIndex((entry) => entry.href === href)
  if (index === -1) return null
  const entry = flat[index]
  return { group: entry.group, entry, index }
}

export function getDocsPrevNext(href: string): {
  prev: FlatDocsEntry | null
  next: FlatDocsEntry | null
} {
  const found = findDocsEntry(href)
  if (found === null) return { prev: null, next: null }
  const flat = flattenDocsNav()
  return {
    prev: found.index > 0 ? flat[found.index - 1] : null,
    next: found.index < flat.length - 1 ? flat[found.index + 1] : null,
  }
}

export function getDocsBreadcrumbs(
  href: string,
): { label: string; href?: string }[] {
  const crumbs: { label: string; href?: string }[] = [
    { label: 'Docs', href: '/docs' },
  ]
  const found = findDocsEntry(href)
  if (found === null) return crumbs
  if (found.entry.href !== '/docs') {
    crumbs.push({ label: found.group })
    crumbs.push({ label: found.entry.title })
  } else {
    crumbs.push({ label: found.entry.title })
  }
  return crumbs
}
