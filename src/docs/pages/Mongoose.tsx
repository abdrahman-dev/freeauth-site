import type { ReactElement } from 'react'
import {
  A,
  C,
  Callout,
  Code,
  DataTable,
  H2,
  P,
  PageHeader,
  UL,
} from '../../components/docs/primitives.tsx'

export default function Mongoose(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Adapters"
        title="Mongoose"
        lede={
          <>
            The MongoDB adapter: the one the reference app runs. One
            shared connection opened at boot, two models, and atomic
            operations the core’s safety properties depend on.
          </>
        }
      />

      <H2 id="usage">Usage</H2>
      <Code
        language="ts"
        code={'createAuth({ adapter: mongooseAdapter(), secrets })'}
      />
      <P>
        Install <C>mongoose</C> as your peer dependency. Controllers and
        the core never import models directly. Every query below runs
        inside the adapter.
      </P>

      <H2 id="connection">Connection</H2>
      <P>
        A single shared Mongoose connection opens once at boot from{' '}
        <C>MONGODB_URL</C> with default options, and the app awaits it
        before listening: a failed connection logs and exits the process
        instead of serving half-dead. There is no pool tuning, no retry,
        no database health endpoint, and no disconnect handling.
      </P>

      <H2 id="models">Models</H2>
      <P>
        The <C>user</C> model holds identity plus OTP and lockout
        bookkeeping. Required fields are name, email (unique), and the
        password hash; there are no timestamps and no indexes beyond the
        unique email:
      </P>
      <DataTable
        head={['Field', 'Shape']}
        rows={[
          ['name', 'String, required'],
          ['email', 'String, required, unique'],
          ['password', 'String (bcrypt hash), required'],
          ['verifyOTP / resetOTP', 'String (SHA-256 hex) or null, default null'],
          [
            'verifyOTPExpire / resetOTPExpire',
            'Number (epoch ms), default 0 (note: zero, not null)',
          ],
          ['isAccountVerified', 'Boolean, default false'],
          ['verifyAttempts / resetAttempts', 'Number, default 0'],
          ['verifyLockUntil / resetLockUntil', 'Date or null, default null'],
        ]}
      />
      <P>
        The <C>RefreshToken</C> model holds one row per session: owner,
        the literal refresh JWT, expiry, and revocation flag, with
        timestamps enabled:
      </P>
      <DataTable
        head={['Field', 'Shape']}
        rows={[
          ['userId', 'ObjectId referencing user, required'],
          [
            'token',
            'String (full refresh JWT), required (not unique in Mongoose)',
          ],
          [
            'expiresAt',
            'Date, required, with a TTL index that deletes the row when it passes',
          ],
          ['isRevoked', 'Boolean, default false'],
        ]}
      />
      <P>
        TTL cleanup runs on the database’s usual monitor granularity, so
        treat expiry as “around expiresAt”, and note revoked-but-unexpired
        rows persist until their own expiry.
      </P>

      <H2 id="queries">How the core uses it</H2>
      <UL
        items={[
          <>
            Email lookup is exact and case-sensitive. No collation, no
            lowercasing. <C>User@x.com</C> and <C>user@x.com</C> are
            distinct accounts.
          </>,
          'Malformed ids throw a cast error, which the error layer maps to a 400.',
          'Attempt counters increment atomically and the post-increment value decides lockout.',
          'Session lookup enforces expiry in the query; revocation is checked afterwards in the core.',
          'Revocation is a single atomic update filtered to not-yet-revoked rows. A missed match means “already revoked”, the reuse signal.',
          'Revoking every session for a user is one bulk update.',
        ]}
      />
      <Callout title="No cascading deletes" tone="warn">
        <P>
          The user reference enables population, but population is never
          used and nothing cascades: deleting a user orphans its session
          rows, and refreshing against one later fails with “user not
          found” instead of cleaning up.
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
            <A href="/docs/adapters/prisma">Prisma</A>: where the other
            store diverges.
          </>,
        ]}
      />
    </>
  )
}
