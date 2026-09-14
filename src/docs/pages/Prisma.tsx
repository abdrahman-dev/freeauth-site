import type { ReactElement } from 'react'
import {
  A,
  C,
  Callout,
  Code,
  H2,
  P,
  PageHeader,
  UL,
} from '../../components/docs/primitives.tsx'

export default function Prisma(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Adapters"
        title="Prisma"
        lede={
          <>
            The PostgreSQL adapter: implemented, type-checked, and
            shipped with the library, but not connected in the reference
            app. Read this page for exactly what it covers and where its
            deployment story ends.
          </>
        }
      />

      <H2 id="usage">Usage</H2>
      <Code
        language="ts"
        code={'createAuth({ adapter: prismaAdapter(client), secrets })'}
      />
      <P>
        Install <C>@prisma/client</C> as your peer dependency and pass
        your own configured client in. The adapter translates the same
        user and session operations to Prisma queries: unique lookups,
        creates, updates, and a count-based reuse check on revocation.
      </P>

      <H2 id="schema">Reference schema</H2>
      <P>
        The repository’s reference schema declares the two entities for
        PostgreSQL. Note the deliberate details: the token is unique
        here, both models carry timestamps, and there is intentionally no
        relation (and therefore no foreign key or cascade) between a
        session row and its user:
      </P>
      <Code
        language="prisma"
        code={
          'model User {\n  id                String    @id @default(cuid())\n  name              String\n  email             String    @unique\n  password          String\n  isAccountVerified Boolean   @default(false)\n  verifyOTP         String?\n  verifyOTPExpire   BigInt?\n  verifyAttempts    Int       @default(0)\n  verifyLockUntil   DateTime?\n  resetOTP          String?\n  resetOTPExpire    BigInt?\n  resetAttempts     Int       @default(0)\n  resetLockUntil    DateTime?\n  createdAt         DateTime  @default(now())\n  updatedAt         DateTime  @updatedAt\n}\n\nmodel RefreshToken {\n  id        String   @id @default(cuid())\n  userId    String\n  token     String   @unique\n  isRevoked Boolean  @default(false)\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n}'
        }
      />
      <P>
        Millisecond expiries arrive as <C>BigInt</C> and are converted to
        numbers at the adapter boundary, which is lossless for
        epoch-millisecond values.
      </P>

      <H2 id="differences">Differences from Mongoose</H2>
      <UL
        items={[
          'Refresh-token strings are unique; duplicate rows for one token are impossible.',
          'Both models carry timestamps; the Mongoose user model carries none.',
          'Record-not-found surfaces as a thrown Prisma error rather than a null return. Account for the divergence on write paths that assume nullable results.',
          'Ids are generated strings rather than database object ids; the adapter passes them through untouched.',
        ]}
      />

      <H2 id="limits">Current limits</H2>
      <UL
        items={[
          'Nothing in the reference app instantiates a Prisma client or runs a Prisma query at runtime.',
          'The repository holds no Postgres connection configuration, so how a Prisma-backed deployment wires its connection is currently unverified.',
          'The adapter is therefore exercised by types, not by traffic. Adopt it expecting to own its first real deployment.',
        ]}
      />
      <Callout title="Scope, stated once" tone="warn">
        <P>
          Documenting the adapter is not the same as supporting the
          deployment. If you ship Prisma to production, you own
          connection management, migrations, and verification. The{' '}
          <A href="/docs/guides/production">production guide</A>’s
          checklist still applies on top.
        </P>
      </Callout>

      <H2 id="related">Related</H2>
      <UL
        items={[
          <>
            <A href="/docs/concepts/adapters">Adapters</A>: the contract
            both implementations honor.
          </>,
          <>
            <A href="/docs/adapters/mongoose">Mongoose</A>: the adapter
            the reference app actually runs.
          </>,
        ]}
      />
    </>
  )
}
