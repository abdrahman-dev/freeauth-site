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

export default function AdaptersOverview(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Adapters"
        title="Overview"
        lede={
          <>
            Two adapters ship with the library: Mongoose for MongoDB and
            Prisma for PostgreSQL. Same core, same operations; the
            adapter decides where the rows live.
          </>
        }
      />

      <H2 id="compare">Choosing one</H2>
      <DataTable
        head={['', 'Mongoose', 'Prisma']}
        rows={[
          [
            'Store',
            'MongoDB',
            'PostgreSQL',
          ],
          [
            'Status',
            'Wired into the reference app and exercised at runtime.',
            'Implemented and type-checked, but not connected in the reference app.',
          ],
          [
            'You supply',
            'A connection string (MONGODB_URL).',
            'Your own Prisma client instance.',
          ],
          [
            'Compose with',
            <C key="c-mongo">mongooseAdapter()</C>,
            <C key="c-prisma">prismaAdapter(client)</C>,
          ]
        ]}
      />

      <H2 id="entities">What both stores hold</H2>
      <P>
        Exactly two entities, in both stores: users and refresh-token
        sessions. No other collections or tables, no migrations on the
        Mongoose side, a declarative reference schema on the Prisma side.
        Both adapters normalize to the same record contracts described in{' '}
        <A href="/docs/concepts/adapters">Adapters</A>.
      </P>

      <H2 id="differences">Honest differences</H2>
      <UL
        items={[
          'The refresh-token string is unique in Prisma but not in Mongoose.',
          'OTP expiry sentinels and timestamp columns differ per store. Each adapter page lists its own.',
          'Neither store cascades: deleting a user orphans session rows, and a later refresh for that user fails closed with “user not found”.',
        ]}
      />
      <Callout title="Prisma needs its own deployment story" tone="warn">
        <P>
          The repository holds no Postgres connection configuration and
          no wired Prisma runtime. How a Prisma-backed deployment gets
          its connection is currently unverified. Treat the Prisma
          adapter as implemented library code awaiting its first real
          deployment, not as a turnkey setup.
        </P>
      </Callout>

      <H2 id="pages">Adapter guides</H2>
      <UL
        items={[
          <>
            <A href="/docs/adapters/mongoose">Mongoose</A>: connection,
            models, queries, and notes.
          </>,
          <>
            <A href="/docs/adapters/prisma">Prisma</A>: reference schema,
            usage, differences, and current limits.
          </>,
        ]}
      />
    </>
  )
}
