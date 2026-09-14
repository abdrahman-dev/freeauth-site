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
} from '../../../components/docs/primitives.tsx'

export default function Adapters(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Core concepts"
        title="Adapters"
        lede={
          <>
            The adapter is the only bridge between the core and a
            database: a small interface with user operations and session
            operations. The core calls the interface; an adapter module
            translates each call to one ORM.
          </>
        }
      />

      <H2 id="interface">The interface</H2>
      <P>
        An <C>AuthAdapter</C> exposes two groups, defined in the core’s
        type contracts: eleven user operations (find, create, update,
        OTP bookkeeping, lockout counters) and four session operations
        (find valid, create, revoke one, revoke all for a user). Method
        names and signatures live in that contract; this page describes
        the shape adapters must honor, not a reprint of it.
      </P>
      <P>
        Two implementations ship with the library:{' '}
        <C>mongooseAdapter()</C> for MongoDB and{' '}
        <C>prismaAdapter(client)</C> for PostgreSQL, where you supply
        your own Prisma client. The reference app runs the Mongoose
        adapter; the Prisma adapter is implemented but not wired into the
        running app.
      </P>

      <H2 id="records">Record shapes</H2>
      <P>
        Adapters normalize both stores to identical record shapes.
        Translation happens inside the adapter, never in the core:
      </P>
      <Code
        language="ts"
        code={
          'UserRecord {\n  id: string; email; name; password;\n  isAccountVerified;\n  verifyOTP: string | null;\n  verifyOTPExpire: number | null;\n  verifyAttempts: number;\n  verifyLockUntil: Date | null;\n  resetOTP: string | null;\n  resetOTPExpire: number | null;\n  resetAttempts: number;\n  resetLockUntil: Date | null;\n}\n\nSessionRecord {\n  userId: string; token: string;\n  isRevoked: boolean;\n  expiresAt: Date; createdAt: Date;\n}'
        }
      />
      <P>
        The Mongoose adapter stringifies document ids; the Prisma adapter
        passes string ids through and converts its millisecond expiries
        from <C>BigInt</C> to numbers at the boundary.
      </P>

      <H2 id="choosing">Choosing an adapter</H2>
      <P>
        The choice happens exactly once, at the composition root where
        the adapter and the secrets are combined into the{' '}
        <C>auth</C> object:
      </P>
      <Code
        language="ts"
        code={'createAuth({ adapter: mongooseAdapter(), secrets })'}
      />
      <P>
        Everything downstream (all ten core operations) is identical
        regardless of the choice. Switching stores later means swapping
        this one call (plus your schema), not rewriting auth logic.
      </P>

      <H2 id="rules">Rules adapters follow</H2>
      <UL
        items={[
          'Revocation is atomic: revoke targets only not-yet-revoked rows, so a null or zero-count result reliably means “already revoked”: the signal reuse detection depends on.',
          'Attempt increments are atomic and the post-increment value decides lockout, so concurrent submissions cannot both slip under the threshold.',
          'Expiry is enforced at query time (valid means exists and expires in the future); revocation is checked afterwards in the core.',
          'Adapters return null-ish for missing rows rather than throwing. The one exception is where the ORM itself throws, which the error layer maps explicitly.',
        ]}
      />
      <Callout title="Store differences are documented, not hidden" tone="note">
        <P>
          The two stores diverge in small ways the adapters do not paper
          over: token uniqueness, timestamp columns, expiry sentinels.
          Each adapter page lists its own: <A href="/docs/adapters/mongoose">Mongoose</A>
          , <A href="/docs/adapters/prisma">Prisma</A>.
        </P>
      </Callout>
    </>
  )
}
