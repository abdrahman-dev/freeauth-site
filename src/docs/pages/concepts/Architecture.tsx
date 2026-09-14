import type { ReactElement } from 'react'
import {
  A,
  C,
  Callout,
  DataTable,
  H2,
  H3,
  OL,
  P,
  PageHeader,
} from '../../../components/docs/primitives.tsx'

export default function Architecture(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Core concepts"
        title="Architecture"
        lede={
          <>
            All auth decisions live in one database-agnostic core. A thin
            Express app translates HTTP into core calls, and an adapter
            translates core calls into database operations. Nothing else
            holds domain logic.
          </>
        }
      />

      <H2 id="layers">Layers</H2>
      <DataTable
        head={['Layer', 'Responsibility']}
        rows={[
          [
            'Routes',
            'URL to middleware-chain declaration only. No logic.',
          ],
          [
            'Controllers',
            'HTTP translation: read body, cookies, and user; call exactly one core method; set or clear cookies; send JSON. No database access, no hashing, no JWT handling.',
          ],
          [
            'Core',
            'Every auth decision: existence checks, password verification, OTP consume, lockouts, session rotation and reuse detection, token issuance. Throws operational errors; imports no ORM, driver, or model.',
          ],
          [
            'Adapters',
            'Pure data access translating adapter calls to one ORM: Mongoose or Prisma.',
          ],
          [
            'Internals',
            'Stateless crypto and logging primitives: password hashing, OTP, JWT issuance, errors, logger.',
          ],
          [
            'Middleware',
            'Cross-cutting HTTP concerns: auth check, body validation, rate limits, error mapping.',
          ]
        ]}
      />
      <P>
        The practical consequence: business-rule bugs are fixed in the
        core, HTTP-shape bugs in controllers or middleware. There is no
        separate service layer in the Express app. The core{' '}
        <em>is</em> the service layer, shared by any consumer of the
        library.
      </P>

      <H2 id="request-lifecycle">Request lifecycle</H2>
      <P>A registration request travels the full stack like this:</P>
      <OL
        items={[
          <>
            <C>express.json()</C>, <C>helmet()</C>, <C>cors()</C>, then{' '}
            <C>cookieParser()</C>: parsing and headers before anything
            route-specific.
          </>,
          <>
            The global rate limiter, then the router chain for the
            endpoint. For register, a scoped limiter plus body
            validation.
          </>,
          <>
            Validation parses the JSON body against a Zod schema and{' '}
            <em>replaces</em> the body with the parsed result; failures
            become a <C>422</C>.
          </>,
          <>
            The controller calls exactly one core method (
            <C>auth.registerUser</C>), which reads and writes through the
            adapter only.
          </>,
          <>
            The controller sets cookies, sends the JSON response, and any
            thrown error falls through to the central error handler.
          </>,
        ]}
      />
      <Callout title="Middleware order matters" tone="note">
        <P>
          JSON parsing must precede validation, cookie parsing must
          precede anything reading cookies, the global limiter precedes
          all routes, and the error handler stays last. Reordering these
          breaks auth flows.
        </P>
      </Callout>

      <H2 id="adapter-boundary">The adapter boundary</H2>
      <P>
        The core talks to storage exclusively through the{' '}
        <C>AuthAdapter</C> interface (user operations plus session
        operations), and the runtime adapter is chosen once at the
        composition root, where secrets and adapter are combined into the{' '}
        <C>auth</C> object controllers use. By convention (not tooling),
        the core never imports a database driver, ORM, or model.
      </P>
      <P>
        <A href="/docs/concepts/adapters">Adapters</A> covers the
        contract in detail.
      </P>

      <H2 id="reference-app">The reference app, precisely</H2>
      <P>
        Route → rate limiter → Zod validation → controller → core method
        → adapter → database → cookies plus JSON. The app adds no
        service or repository layer of its own.
      </P>
      <H3 id="deliberately-absent">Deliberately absent</H3>
      <P>
        There is no caching layer, queue or worker, WebSocket server,
        file storage, mailer, or roles service. Authorization in
        particular does not exist: no roles, permissions, ownership
        checks, or admin guards anywhere. Any valid access token calls
        the two guarded routes as itself.
      </P>
      <Callout title="No transactions across multi-write flows" tone="warn">
        <P>
          Core flows that write several records in sequence (verifying an
          account, changing a password) await each step with no database
          transaction. A crash between steps can leave half-applied
          state. Plan retries and reconciliation accordingly.
        </P>
      </Callout>
    </>
  )
}
