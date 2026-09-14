import type { ApiEndpoint } from './types.ts'

export const verifyEmailEndpoint: ApiEndpoint = {
  slug: 'verify-email',
  method: 'POST',
  path: '/api/auth/verify-email',
  title: 'Verify email',
  summary:
    'Consumes the 6-digit verification OTP issued at registration (or by resend) and marks the account verified, which unblocks login. A consumed OTP cannot be used twice.',
  auth: 'Public',
  limiter: 'Global + verifyEmailLimiter (5 attempts / 15 min / IP)',
  validation: 'verifyEmailSchema (body)',
  coreMethod: 'auth.verifyEmail',
  requestExample:
    "curl -X POST http://localhost:3000/api/auth/verify-email \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"email\": \"ada@example.com\",\n    \"otp\": \"123456\"\n  }'",
  requestFields: [
    { name: 'email', rules: 'Valid email' },
    { name: 'otp', rules: 'String, exactly 6 chars, all digits' },
  ],
  successStatus: '200',
  successBody:
    '{\n  "success": true,\n  "message": "Email verified successfully"\n}',
  errors: [
    { status: '422', condition: 'Body validation failed' },
    { status: '400', condition: 'Invalid or expired OTP' },
    {
      status: '429',
      condition:
        'Per-flow OTP lockout (too many attempts) or HTTP rate limiter',
    },
    { status: '500', condition: 'Unexpected' },
  ],
  sideEffects:
    'Marks the account verified, clears the stored verification OTP, and resets the verify-flow attempt counter.',
  related: [
    { title: 'POST /register', href: '/docs/api/register' },
    { title: 'POST /resend-otp', href: '/docs/api/resend-otp' },
    { title: 'POST /login', href: '/docs/api/login' },
  ],
}
