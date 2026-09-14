import type { ApiEndpoint } from './types.ts'

export const loginEndpoint: ApiEndpoint = {
  slug: 'login',
  method: 'POST',
  path: '/api/auth/login',
  title: 'Login',
  summary:
    'Verifies credentials for an already-registered, email-verified user and issues a fresh token pair. Unknown emails and wrong passwords produce the identical 401 so accounts cannot be enumerated.',
  auth: 'Public',
  limiter: 'Global + authLimiter (5 attempts / 15 min / IP)',
  validation: 'loginSchema (body)',
  coreMethod: 'auth.loginUser',
  requestExample:
    "curl -X POST http://localhost:3000/api/auth/login \\\n  -H 'Content-Type: application/json' \\\n  -c cookies.txt -b cookies.txt \\\n  -d '{\n    \"email\": \"ada@example.com\",\n    \"password\": \"Str0ng!Pass\"\n  }'",
  requestFields: [
    { name: 'email', rules: 'Valid email, 5–100 chars' },
    {
      name: 'password',
      rules:
        'String, 1–100 chars. Strength rules are not re-checked at login',
    },
  ],
  successStatus: '200',
  successBody: '{\n  "success": true,\n  "message": "Login successful"\n}',
  errors: [
    { status: '422', condition: 'Body validation failed' },
    {
      status: '401',
      condition: 'Invalid email or password (identical message for both cases)',
    },
    {
      status: '403',
      condition:
        'Account exists but the email is not verified (verify first, then log in)',
    },
    { status: '429', condition: 'authLimiter or global limiter exceeded' },
    { status: '500', condition: 'Unexpected' },
  ],
  sideEffects:
    'Creates one refresh-token session row and overwrites the cookie pair. Previous sessions are not revoked. Signing in on a second device accumulates sessions rather than replacing them.',
  related: [
    { title: 'POST /register', href: '/docs/api/register' },
    { title: 'POST /verify-email', href: '/docs/api/verify-email' },
    { title: 'POST /forgot-password', href: '/docs/api/forgot-password' },
  ],
}
