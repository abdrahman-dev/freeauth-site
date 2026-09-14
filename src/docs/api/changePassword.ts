import type { ApiEndpoint } from './types.ts'

export const changePasswordEndpoint: ApiEndpoint = {
  slug: 'change-password',
  method: 'POST',
  path: '/api/auth/change-password',
  title: 'Change password',
  summary:
    'Authenticated password change for the token holder. The current password must match, the new one must differ and meet the strength policy. Every session is then revoked, including the caller’s own.',
  auth: 'Access: accessToken cookie first, else Authorization: Bearer header',
  limiter: 'Global only (no dedicated rate limiter)',
  validation: 'changePasswordSchema (body)',
  coreMethod: 'auth.changePassword',
  requestExample:
    "curl -X POST http://localhost:3000/api/auth/change-password \\\n  -H 'Content-Type: application/json' \\\n  -b \"accessToken=<access-token>\" \\\n  -d '{\n    \"currentPassword\": \"<old-password>\",\n    \"newPassword\": \"<new-strong-password>\"\n  }'",
  requestFields: [
    { name: 'currentPassword', rules: 'Non-empty string' },
    {
      name: 'newPassword',
      rules:
        'Full strength policy; must differ from currentPassword (rejected otherwise)',
    },
  ],
  successStatus: '200',
  successBody:
    '{\n  "success": true,\n  "message": "Password changed successfully"\n}',
  errors: [
    {
      status: '401',
      condition:
        'No, invalid, or expired access token (middleware), or the current password is incorrect (core)',
    },
    {
      status: '422',
      condition: 'Weak new password, same-as-current, or missing fields',
    },
    { status: '404', condition: 'User not found' },
    { status: '429', condition: 'Global limiter exceeded' },
    { status: '500', condition: 'Unexpected' },
  ],
  sideEffects:
    'Updates the password hash and revokes all of the user’s refresh sessions, including the session that made the call. The client must log in again.',
  related: [
    { title: 'GET /me', href: '/docs/api/me' },
    { title: 'POST /reset-password', href: '/docs/api/reset-password' },
    { title: 'POST /login', href: '/docs/api/login' },
  ],
}
