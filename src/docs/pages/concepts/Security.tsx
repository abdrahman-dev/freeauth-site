import type { ReactElement } from 'react'
import {
  C,
  H2,
  P,
  PageHeader,
  UL,
} from '../../../components/docs/primitives.tsx'

export default function Security(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Core concepts"
        title="Security"
        lede={
          <>
            What OpenAuth does to stay safe, stated plainly, followed by
            the known gaps, stated just as plainly. Read both before
            trusting it with anything that matters.
          </>
        }
      />

      <H2 id="mechanisms">Implemented mechanisms</H2>
      <UL
        items={[
          'Passwords hashed with bcrypt (cost 10) and compared timing-safely; hashes never leave the database.',
          'Separate ≥32-character HMAC secrets for access and refresh tokens, cross-checked unequal at boot; minimal JWT payloads with short access lifetimes.',
          'Refresh tokens bound to server-side rows, single-use rotation, atomic revocation, and wipe-all-sessions on reuse.',
          'OTPs generated cryptographically, stored hashed with a 10-minute expiry, and guarded by per-flow attempt counters with 15-minute lockouts.',
          'Enumeration-resistant forgot-password and resend responses; identical 401s for unknown email versus wrong password.',
          'httpOnly cookies with SameSite=strict and production-only secure flags; single-origin credentialed CORS; default security headers.',
          'Seven rate limiters (one global plus six scoped) and Zod validation with a strong password policy at the boundary.',
        ]}
      />

      <H2 id="known-concerns">Known concerns</H2>
      <P>
        These are verified properties of the current code, not
        hypotheticals. If you deploy or extend OpenAuth, work through
        them first:
      </P>
      <UL
        items={[
          <>
            <C>OTPs reach stdout.</C> The reference app logs full codes
            with email addresses as an explicit development stub, with no
            environment gate. Never retain or ship production logs
            containing them.
          </>,
          <>
            <C>No CSRF layer.</C> Cookie-authenticated POSTs rely on{' '}
            <C>SameSite=strict</C> alone. No double-submit token, no
            origin check.
          </>,
          <>
            <C>Register before verify.</C> New accounts hold usable
            sessions immediately; only login re-checks verification (see{' '}
            Authentication & sessions).
          </>,
          <>
            <C>Cookies travel in cleartext outside production.</C> The{' '}
            <C>secure</C> flag follows <C>NODE_ENV</C>, so any non-prod
            deployment over plain HTTP (or a mis-set environment)
            exposes both tokens.
          </>,
          <>
            <C>Emails are case-sensitive and untrimmed.</C>{' '}
            <C>Ada@x.com</C> and <C>ada@x.com</C> are distinct accounts;
            normalize before calling if your product should not allow
            that.
          </>,
          <>
            <C>Change-password has no dedicated rate limiter.</C> Only
            the global bucket slows online guessing of the current
            password.
          </>,
          <>
            <C>Refresh JWTs are trusted via the database row,</C> not by
            verifying the token’s own signature and expiry at rotation
            time.
          </>,
          <>
            <C>Multi-write flows are not transactional,</C> so a crash
            between steps can leave half-applied state.
          </>,
          <>
            <C>Development 500s include stack traces.</C> Harmless when{' '}
            <C>NODE_ENV</C> is correct; an internals leak when it is not.
          </>,
          <>
            <C>Committed secrets must be rotated.</C> If a working tree
            ever contained live JWT secrets or database credentials
            alongside code, treat them as compromised: rotate all three
            and audit history.
          </>,
        ]}
      />
    </>
  )
}
