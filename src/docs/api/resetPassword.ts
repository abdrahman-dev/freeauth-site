import type { ApiEndpoint } from './types.ts'

export const resetPasswordEndpoint: ApiEndpoint = {
  slug: 'reset-password',
  method: 'POST',
  path: '/api/auth/reset-password',
  title: 'Reset password',
  summary:
    'Consumes a reset OTP and sets a new password, revoking every session the user holds. Prefer newPassword; the legacy password alias still works, with newPassword winning when both are sent.',
  auth: 'Public',
  limiter:
    'Global + resetPasswordLimiter (5 attempts / 30 min / IP, shared with forgot-password)',
  validation: 'resetPasswordSchema (body)',
  coreMethod: 'auth.resetPassword',
  requestExample:
    "curl -X POST http://localhost:3000/api/auth/reset-password \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"email\": \"ada@example.com\",\n    \"otp\": \"123456\",\n    \"newPassword\": \"N3w!Strong1\"\n  }'",
  requestFields: [
    { name: 'email', rules: 'Valid email' },
    { name: 'otp', rules: 'String, exactly 6 chars, all digits' },
    {
      name: 'newPassword',
      rules:
        'Preferred field: full strength policy (8–100 chars, upper, lower, digit, special). At least one of newPassword / password is required.',
    },
    {
      name: 'password',
      rules:
        'Legacy alias for newPassword with the same strength policy. Ignored when newPassword is also present.',
    },
  ],
  successStatus: '200',
  successBody:
    '{\n  "success": true,\n  "message": "Password reset successful"\n}',
  errors: [
    {
      status: '422',
      condition:
        'Validation failed: missing both password fields, weak password, or malformed OTP',
    },
    { status: '400', condition: 'Invalid or expired OTP' },
    {
      status: '429',
      condition:
        'Per-flow OTP lockout (too many attempts) or the shared HTTP limiter',
    },
    { status: '500', condition: 'Unexpected' },
  ],
  sideEffects:
    'Updates the stored password hash, clears the reset OTP, and revokes all refresh sessions for the user. Every device is logged out.',
  related: [
    { title: 'POST /forgot-password', href: '/docs/api/forgot-password' },
    { title: 'POST /login', href: '/docs/api/login' },
    { title: 'POST /change-password', href: '/docs/api/change-password' },
  ],
}
