import type { ApiEndpoint } from './types.ts'

export const resendOtpEndpoint: ApiEndpoint = {
  slug: 'resend-otp',
  method: 'POST',
  path: '/api/auth/resend-otp',
  title: 'Resend OTP',
  summary:
    'Issues a fresh verification OTP for an unverified account. Unknown emails get the same generic success message as real ones, so addresses cannot be probed.',
  auth: 'Public',
  limiter: 'Global + resendOtpLimiter (5 attempts / 30 min / IP)',
  validation: 'resendOTPSchema (body)',
  coreMethod: 'auth.resendOTP',
  requestExample:
    "curl -X POST http://localhost:3000/api/auth/resend-otp \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"email\": \"ada@example.com\"\n  }'",
  requestFields: [{ name: 'email', rules: 'Valid email' }],
  successStatus: '200',
  successBody:
    '{\n  "success": true,\n  "message": "If this email exists, a new OTP has been sent"\n}',
  errors: [
    { status: '422', condition: 'Malformed email' },
    { status: '400', condition: 'Account is already verified' },
    { status: '429', condition: 'resendOtpLimiter or global limiter exceeded' },
    { status: '500', condition: 'Unexpected' },
  ],
  sideEffects:
    'Replaces the stored verification OTP (old code stops working) and logs the new OTP to the server log. No email is sent.',
  related: [
    { title: 'POST /verify-email', href: '/docs/api/verify-email' },
    { title: 'POST /register', href: '/docs/api/register' },
    { title: 'Email delivery', href: '/docs/guides/email-delivery' },
  ],
}
