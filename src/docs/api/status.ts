import type { ApiEndpoint } from './types.ts'

export const statusEndpoint: ApiEndpoint = {
  slug: 'status',
  method: 'GET',
  path: '/api/auth/',
  title: 'Status probe',
  summary:
    'Liveness check for the reference app. It carries no authentication, no validation, and no rate limiter beyond the global one. If this returns 200, the server is up.',
  auth: 'Public',
  limiter: 'Global only (100 req / 15 min / IP)',
  validation: 'None',
  coreMethod: 'getApiStatus (controller only, no core call)',
  requestExample: 'curl http://localhost:3000/api/auth/',
  successStatus: '200',
  successBody: '{\n  "success": true,\n  "message": "API is working"\n}',
  errors: [
    {
      status: '429',
      condition: 'Global rate limiter exceeded',
    },
  ],
  related: [
    { title: 'API overview', href: '/docs/api' },
    { title: 'POST /register', href: '/docs/api/register' },
  ],
}
