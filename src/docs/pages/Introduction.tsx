import type { ReactElement } from 'react'
import {
  A,
  C,
  Callout,
  DataTable,
  H2,
  P,
  PageHeader,
  UL,
} from '../../components/docs/primitives.tsx'

export default function Introduction(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Getting started"
        title="Introduction"
        lede={
          <>
            OpenAuth is a database-agnostic authentication toolkit for
            Node.js: email OTP verification, JWT access and refresh
            sessions with rotation and reuse detection, and per-flow
            lockouts, behind one core API that never touches your
            database driver directly.
          </>
        }
      />

      <H2 id="what-it-does">What it does</H2>
      <UL
        items={[
          'User registration with email OTP verification.',
          'Login gated on verified email.',
          'JWT access sessions (15 minutes) plus refresh sessions (7 days), stored server-side and rotated on every refresh.',
          'Reuse detection: presenting an already-rotated refresh token wipes all of the user’s sessions.',
          'Forgot-password and reset-password flows over OTP.',
          'Resend verification OTP, authenticated password change, logout, and a current-user profile.',
        ]}
      />

      <H2 id="two-parts">Two parts that ship together</H2>
      <P>
        The project contains a library and a runnable example. They serve
        different roles, and the docs keep them apart:
      </P>
      <DataTable
        head={['Part', 'What it is']}
        rows={[
          [
            <C key="lib">openauth library</C>,
            'The drop-in package published to npm. All business logic lives here and talks only to an adapter interface, never to Mongoose or Prisma directly.',
          ],
          [
            <C key="app">Reference app</C>,
            'A small Express app showing one way to wire the library up with MongoDB and Mongoose. It ships in the repository but is not part of the published package.',
          ]
        ]}
      />
      <Callout title="Not OAuth, not hosted" tone="note">
        <P>
          Despite the name, OpenAuth is not OAuth and not a service you
          sign up for. It runs inside your Node app, against your
          database. There are no redirects to a provider, no API keys to a
          cloud, and no hosted dashboard.
        </P>
      </Callout>

      <H2 id="maturity">Maturity</H2>
      <P>
        OpenAuth is published as <C>v0.1.0</C> and the API is still
        shifting. It is a good fit for side projects and for kicking the
        tires; hold off on anything carrying real user data until the
        status changes. Where behavior is known to be rough, these docs
        say so instead of smoothing it over.
      </P>

      <H2 id="next-steps">Where to go next</H2>
      <UL
        items={[
          <>
            <A href="/docs/installation">Installation</A>: add the
            package, pick an adapter peer, configure the reference app.
          </>,
          <>
            <A href="/docs/quickstart">Quickstart</A>: register, verify,
            and log in against a local server in minutes.
          </>,
          <>
            <A href="/docs/concepts/architecture">Architecture</A>: how
            the core, adapters, and reference app fit together.
          </>,
        ]}
      />
    </>
  )
}
