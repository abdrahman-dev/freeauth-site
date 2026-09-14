/* Data model for one reference-app endpoint page. Content comes from
   docs/backend-api-doc.md only — field names, statuses, messages, and
   limits below must trace to that reference. */

export interface ApiFieldRow {
  name: string
  rules: string
}

export interface ApiErrorRow {
  status: string
  condition: string
}

export interface ApiRelated {
  title: string
  href: string
}

export interface ApiEndpoint {
  slug: string
  method: string
  path: string
  title: string
  summary: string
  auth: string
  limiter: string
  validation: string
  coreMethod: string
  requestExample: string
  requestBodyExample?: string
  requestFields?: ApiFieldRow[]
  successStatus: string
  successBody: string
  errors: ApiErrorRow[]
  sideEffects?: string
  related: ApiRelated[]
}
