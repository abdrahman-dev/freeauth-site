import type { ApiEndpoint } from './types.ts'

export const meEndpoint: ApiEndpoint = {
  slug: 'me',
  method: 'GET',
  path: '/api/auth/me',
  title: 'Current user',
  summary:
    'Returns the safe profile projection for the access-token holder. One of two routes guarded by the access-token middleware; sensitive fields such as the password hash are never included.',
  auth: 'Access: accessToken cookie first, else Authorization: Bearer header',
  limiter: 'Global only',
  validation: 'None',
  coreMethod: 'auth.getMe',
  requestExample:
    'curl http://localhost:3000/api/auth/me \\\n  -b "accessToken=<access-token>"',
  successStatus: '200',
  successBody:
    '{\n  "success": true,\n  "data": {\n    "id": "<string>",\n    "email": "ada@example.com",\n    "name": "Ada Lovelace",\n    "isAccountVerified": true\n  }\n}',
  errors: [
    {
      status: '401',
      condition:
        'No access token provided, expired token, or invalid token (from the middleware, not the central error handler)',
    },
    {
      status: '404',
      condition: 'User not found: the token is valid but the user was deleted',
    },
    { status: '429', condition: 'Global limiter exceeded' },
    { status: '500', condition: 'Unexpected' },
  ],
  related: [
    { title: 'POST /login', href: '/docs/api/login' },
    { title: 'POST /refresh', href: '/docs/api/refresh' },
    { title: 'POST /change-password', href: '/docs/api/change-password' },
  ],
}
