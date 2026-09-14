import type { ApiEndpoint } from './types.ts'

export const logoutEndpoint: ApiEndpoint = {
  slug: 'logout',
  method: 'POST',
  path: '/api/auth/logout',
  title: 'Logout',
  summary:
    'Revokes the presented refresh session and clears both cookies. Logout is idempotent by design: it succeeds even with no cookies at all and never returns 401.',
  auth: 'Public (no middleware; works with or without cookies)',
  limiter: 'Global only',
  validation: 'None',
  coreMethod: 'auth.logoutUser',
  requestExample:
    'curl -X POST http://localhost:3000/api/auth/logout \\\n  -c cookies.txt -b cookies.txt',
  successStatus: '200',
  successBody: '{\n  "success": true,\n  "message": "Logout successful"\n}',
  errors: [
    { status: '429', condition: 'Global limiter exceeded' },
    { status: '500', condition: 'Unexpected' },
  ],
  sideEffects:
    'Revokes that one refresh session (other devices stay signed in) and clears the accessToken and refreshToken cookies. A missing or already-revoked token still returns success.',
  related: [
    { title: 'POST /login', href: '/docs/api/login' },
    { title: 'POST /refresh', href: '/docs/api/refresh' },
  ],
}
