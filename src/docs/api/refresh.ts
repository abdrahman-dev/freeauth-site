import type { ApiEndpoint } from './types.ts'

export const refreshEndpoint: ApiEndpoint = {
  slug: 'refresh',
  method: 'POST',
  path: '/api/auth/refresh',
  title: 'Refresh session',
  summary:
    'Rotates the session: the presented refresh token is revoked server-side and a fresh pair is issued. Every successful call single-uses the token. Presenting an already-revoked token is treated as theft and wipes all of the user’s sessions.',
  auth: 'Refresh-cookie holder (not the access-token middleware)',
  limiter: 'Global + refreshLimiter (20 attempts / 15 min / IP)',
  validation: 'None (a missing token is handled in core)',
  coreMethod: 'auth.refreshSession',
  requestExample:
    'curl -X POST http://localhost:3000/api/auth/refresh \\\n  -c cookies.txt -b cookies.txt',
  successStatus: '200',
  successBody:
    '{\n  "success": true,\n  "message": "Token refreshed successfully"\n}',
  errors: [
    {
      status: '401',
      condition:
        'No refresh token provided, or an invalid, expired, or already-revoked token',
    },
    {
      status: '401',
      condition:
        'Session invalidated due to suspicious activity: reuse detected, all sessions revoked, log in again',
    },
    { status: '401', condition: 'User not found (orphaned session row)' },
    { status: '429', condition: 'refreshLimiter or global limiter exceeded' },
    { status: '500', condition: 'Unexpected' },
  ],
  sideEffects:
    'Revokes the presented refresh session and creates a new session row on every successful call. The new pair arrives as Set-Cookie headers.',
  related: [
    { title: 'POST /login', href: '/docs/api/login' },
    { title: 'POST /logout', href: '/docs/api/logout' },
    { title: 'GET /me', href: '/docs/api/me' },
    {
      title: 'Authentication & sessions',
      href: '/docs/concepts/authentication',
    },
  ],
}
