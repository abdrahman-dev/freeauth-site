import type { ApiEndpoint } from './types.ts'

export const forgotPasswordEndpoint: ApiEndpoint = {
  slug: 'forgot-password',
  method: 'POST',
  path: '/api/auth/forgot-password',
  title: 'Forgot password',
  summary:
    'Starts a password reset by issuing a reset OTP. The response is always the same 200 message whether or not the email exists. Unknown addresses never produce a 404 or 401, by design.',
  auth: 'Public',
  limiter:
    'Global + resetPasswordLimiter (5 attempts / 30 min / IP, shared with reset-password)',
  validation: 'forgotPasswordSchema (body)',
  coreMethod: 'auth.forgotPassword',
  requestExample:
    "curl -X POST http://localhost:3000/api/auth/forgot-password \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"email\": \"ada@example.com\"\n  }'",
  requestFields: [{ name: 'email', rules: 'Valid email (no length bounds)' }],
  successStatus: '200',
  successBody:
    '{\n  "success": true,\n  "message": "If this email exists, an OTP has been sent"\n}',
  errors: [
    { status: '422', condition: 'Malformed email shape' },
    { status: '429', condition: 'Shared reset limiter or global limiter' },
    { status: '500', condition: 'Unexpected' },
  ],
  sideEffects:
    'For a known email, stores a reset OTP and logs it to the server log. No email is sent. For an unknown email, nothing happens internally; the HTTP response is identical either way.',
  related: [
    { title: 'POST /reset-password', href: '/docs/api/reset-password' },
    { title: 'POST /resend-otp', href: '/docs/api/resend-otp' },
    { title: 'Email delivery', href: '/docs/guides/email-delivery' },
  ],
}
