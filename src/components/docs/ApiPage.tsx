import type { ReactElement } from 'react'
import type { ApiEndpoint } from '../../docs/api/types.ts'
import {
  A,
  C,
  Code,
  DataTable,
  H2,
  P,
  PageHeader,
  UL,
} from './primitives.tsx'

/* Data-driven renderer for one reference-app endpoint. Every page in
   /docs/api/* shares this structure (Request → Success response →
   Errors → Side effects → Related), so the section anchors and the
   generated "On this page" outline stay consistent. */

export default function ApiPage({
  endpoint,
}: {
  endpoint: ApiEndpoint
}): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow={`${endpoint.method} ${endpoint.path}`}
        title={endpoint.title}
        lede={endpoint.summary}
      />

      <H2 id="request">Request</H2>
      <DataTable
        caption="Details"
        head={['Detail', 'Value']}
        rows={[
          ['Authentication', endpoint.auth],
          ['Rate limit', endpoint.limiter],
          ['Validation', endpoint.validation],
          [
            'Core method',
            <C key="core-method">{endpoint.coreMethod}</C>,
          ],
        ]}
      />
      {endpoint.requestFields !== undefined && (
        <DataTable
          caption="Body fields"
          head={['Field', 'Rules']}
          rows={endpoint.requestFields.map((field) => [
            <C key={`name-${field.name}`}>{field.name}</C>,
            field.rules,
          ])}
        />
      )}
      <Code language="bash" code={endpoint.requestExample} />
      {endpoint.requestBodyExample !== undefined && (
        <Code language="json" code={endpoint.requestBodyExample} />
      )}

      <H2 id="response">Success response</H2>
      <P>
        Status <C>{endpoint.successStatus}</C>. Tokens, when issued, travel
        as <C>Set-Cookie</C> headers, never in the JSON body.
      </P>
      <Code language="json" code={endpoint.successBody} />

      <H2 id="errors">Errors</H2>
      <DataTable
        head={['Status', 'Condition']}
        rows={endpoint.errors.map((error) => [
          <C key={`status-${error.status}-${error.condition}`}>{error.status}</C>,
          error.condition,
        ])}
      />

      {endpoint.sideEffects !== undefined && (
        <>
          <H2 id="side-effects">Side effects</H2>
          <P>{endpoint.sideEffects}</P>
        </>
      )}

      <H2 id="related">Related</H2>
      <UL
        items={endpoint.related.map((link) => (
          <A key={link.href} href={link.href}>
            {link.title}
          </A>
        ))}
      />
    </>
  )
}
