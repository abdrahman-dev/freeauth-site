import type { ReactElement } from 'react'
import {
  A,
  C,
  Callout,
  Code,
  DataTable,
  H2,
  H3,
  P,
  PageHeader,
  UL,
} from '../../../components/docs/primitives.tsx'

export default function Authentication(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Core concepts"
        title="Authentication & sessions"
        lede={
          <>
            Short-lived stateless access tokens plus long-lived
            server-side refresh sessions. Every refresh rotates the pair;
            replaying an old token burns every session the user holds.
          </>
        }
      />

      <H2 id="tokens">Tokens</H2>
      <P>
        Both tokens are JWTs signed with <C>HS256</C> under separate
        secrets, and both carry exactly one claim besides timestamps:
      </P>
      <Code
        language="ts"
        code={
          'generateAccessToken(user, secret)  // jwt.sign({ userId: user.id }, secret, { expiresIn: "15m" })\ngenerateRefreshToken(user, secret) // jwt.sign({ userId: user.id }, secret, { expiresIn: 604800 }) // 7 days'
        }
      />
      <P>
        No email, no name, no role, no token id. Secrets come from
        validated environment and must each be at least 32 characters and
        different from each other. The app refuses to boot otherwise.
      </P>

      <H3 id="access-vs-refresh">Access is stateless, refresh is not</H3>
      <P>
        The access token is never stored server-side: it is accepted from
        the <C>accessToken</C> cookie first, else the{' '}
        <C>Authorization: Bearer</C> header, and it cannot be revoked,
        only outwaited for up to 15 minutes. The refresh token is a JWT{' '}
        <em>plus</em> a database row holding the token string, owner,
        expiry, and revocation flag. Every refresh, logout, and password
        change mutates those rows.
      </P>

      <H2 id="cookies">Cookies</H2>
      <DataTable
        head={['Cookie', 'Lifetime', 'Flags', 'Set on', 'Cleared on']}
        rows={[
          [
            <C key="c-access">accessToken</C>,
            '15 minutes',
            'httpOnly always · SameSite=strict · secure in production',
            'Register, login, refresh',
            'Logout',
          ],
          [
            <C key="c-refresh">refreshToken</C>,
            '7 days',
            'httpOnly always · SameSite=strict · secure in production',
            'Register, login, refresh',
            'Logout',
          ]
        ]}
      />
      <P>
        Clearing reuses the same cookie options so path and flags match
        for proper removal. No custom path, domain, or prefix is set.
      </P>

      <H2 id="rotation">Rotation and reuse detection</H2>
      <P>
        Every successful refresh revokes the presented token and mints a
        fresh pair, so a refresh token is single-use. The revocation is
        one atomic operation, and its result is the theft detector: if
        the token was already revoked, someone is replaying it. The core
        then revokes <em>all</em> of the user’s sessions, logs a security
        warning, and answers <C>401</C> telling the client to log in
        again.
      </P>
      <P>
        Parallel legitimate use is unaffected. Each login simply adds a
        session row, and only the token actually presented rotates. Full
        logout-everywhere happens on password reset, password change, and
        reuse detection. Never on plain login or logout.
      </P>
      <Callout title="Refresh expiry is checked against the database" tone="note">
        <P>
          Rotation looks the token up in the session store and enforces
          the row’s expiry there; it does not cryptographically verify
          the refresh JWT itself. The database row is the source of
          truth for refresh validity.
        </P>
      </Callout>

      <H2 id="passwords">Passwords</H2>
      <P>
        Passwords are hashed with bcrypt at cost 10 and verified with a
        timing-safe compare. Plaintext passwords never reach the
        database, and hashes never leave it. The profile projection
        exposes only id, email, name, and verification state. Registration
        and both password changes enforce the same strength policy:
        8–100 characters with an uppercase, a lowercase, a digit, and a
        special character. Login checks the password but does not
        re-evaluate strength.
      </P>

      <H2 id="otp">One-time codes</H2>
      <P>
        Verification and reset codes are 6-digit numbers from a
        cryptographic generator, stored as SHA-256 hashes with a 10-minute
        expiry, never as plaintext. Each flow tracks its own attempt
        counter: 5 failures lock that flow for 15 minutes, then grant 5
        fresh tries. Success clears the code and resets the counter.
      </P>
      <UL
        items={[
          'Verify codes are issued at registration and refreshed by resend.',
          'Reset codes are issued by forgot-password and consumed by reset-password.',
          'Forgot-password and resend answer identically for unknown emails, so addresses cannot be probed.',
        ]}
      />
      <Callout title="Delivery is your application’s job" tone="note">
        <P>
          OpenAuth generates, hashes, verifies, and consumes codes, but
          it sends nothing. The raw code is returned to your controller,
          which must hand it to an email provider. See{' '}
          <A href="/docs/guides/email-delivery">Email delivery</A>.
        </P>
      </Callout>

      <H2 id="login-gating">Login gating</H2>
      <P>
        Login checks three things in order: the account exists, the
        password matches (both failures share one identical 401), and the
        email is verified. Unverified accounts stop here with a{' '}
        <C>403</C>.
      </P>
      <Callout title="Registered is not verified" tone="warn">
        <P>
          Registration issues usable cookies immediately, before
          verification. A newly registered client holds a working session
          until it expires or is revoked. Only login re-checks the
          verified flag. Treat the register response as unverified until
          the verify step completes.
        </P>
      </Callout>
    </>
  )
}
