import type { ApiEndpoint } from './types.ts'

export const registerEndpoint: ApiEndpoint = {
  slug: 'register',
  method: 'POST',
  path: '/api/auth/register',
  title: 'Register',
  summary:
    'Creates an unverified user, issues a verification OTP, and returns a first session as cookies. Registration succeeds before verification. Login stays blocked until the email is verified.',
  auth: 'Public',
  limiter: 'Global + registerLimiter (10 accounts / hour / IP)',
  validation: 'registerSchema (body)',
  coreMethod: 'auth.registerUser',
  requestExample:
    "curl -X POST http://localhost:3000/api/auth/register \\\n  -H 'Content-Type: application/json' \\\n  -c cookies.txt \\\n  -d '{\n    \"name\": \"Ada Lovelace\",\n    \"email\": \"ada@example.com\",\n    \"password\": \"Str0ng!Pass\"\n  }'",
  requestFields: [
    {
      name: 'name',
      rules: 'String, 2–50 chars, letters and spaces only, non-blank after trim',
    },
    { name: 'email', rules: 'Valid email, 5–100 chars' },
    {
      name: 'password',
      rules:
        '8–100 chars with ≥1 uppercase, ≥1 lowercase, ≥1 digit, ≥1 special character',
    },
  ],
  successStatus: '201',
  successBody:
    '{\n  "success": true,\n  "message": "User registered successfully"\n}',
  errors: [
    {
      status: '422',
      condition:
        'Body validation failed. The response includes an errors array with field and message entries',
    },
    { status: '409', condition: 'Email already in use' },
    { status: '429', condition: 'registerLimiter or global limiter exceeded' },
    { status: '500', condition: 'Unexpected (database down, etc.)' },
  ],
  sideEffects:
    'Creates the user row (unverified) plus one refresh-token session row, sets the accessToken and refreshToken cookies, and logs the verification OTP to the server log. No email is sent. The response body contains neither tokens nor the OTP.',
  related: [
    { title: 'POST /verify-email', href: '/docs/api/verify-email' },
    { title: 'POST /login', href: '/docs/api/login' },
    { title: 'Email delivery', href: '/docs/guides/email-delivery' },
  ],
}
