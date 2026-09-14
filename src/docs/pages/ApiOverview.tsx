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

export default function ApiOverview(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="API reference"
        title="Overview"
        lede={
          <>
            Eleven endpoints on the reference app’s Express router,
            mounted at <C>/api/auth</C>. No endpoint uses path or query
            parameters. Inputs are JSON bodies, cookies, or the
            authorization header. Every example below assumes the app on{' '}
            <C>http://localhost:3000</C>.
          </>
        }
      />

      <H2 id="endpoints">Endpoints</H2>
      <DataTable
        head={['Endpoint', 'Purpose']}
        rows={[
          [
            <A key="e-status" href="/docs/api/status">
              GET /
            </A>,
            'Liveness probe: no auth, no validation.',
          ],
          [
            <A key="e-register" href="/docs/api/register">
              POST /register
            </A>,
            'Create an unverified user, issue OTP and first session.',
          ],
          [
            <A key="e-login" href="/docs/api/login">
              POST /login
            </A>,
            'Credential check for verified users; issues a token pair.',
          ],
          [
            <A key="e-verify" href="/docs/api/verify-email">
              POST /verify-email
            </A>,
            'Consume the verification OTP; unblocks login.',
          ],
          [
            <A key="e-resend" href="/docs/api/resend-otp">
              POST /resend-otp
            </A>,
            'Issue a fresh verification OTP for an unverified account.',
          ],
          [
            <A key="e-refresh" href="/docs/api/refresh">
              POST /refresh
            </A>,
            'Rotate the session: revoke the presented token, mint a pair.',
          ],
          [
            <A key="e-me" href="/docs/api/me">
              GET /me
            </A>,
            'Safe profile projection for the access-token holder.',
          ],
          [
            <A key="e-forgot" href="/docs/api/forgot-password">
              POST /forgot-password
            </A>,
            'Start a reset; identical response for unknown emails.',
          ],
          [
            <A key="e-reset" href="/docs/api/reset-password">
              POST /reset-password
            </A>,
            'Consume a reset OTP, set a new password, revoke all sessions.',
          ],
          [
            <A key="e-change" href="/docs/api/change-password">
              POST /change-password
            </A>,
            'Authenticated password change; revokes every session.',
          ],
          [
            <A key="e-logout" href="/docs/api/logout">
              POST /logout
            </A>,
            'Revoke the presented session, clear cookies. Never fails.',
          ]
        ]}
      />

      <H2 id="conventions">Conventions on every page</H2>
      <UL
        items={[
          <>
            <C>Authentication</C> is Public, Access-guarded (cookie first,
            Bearer fallback), or refresh-cookie holder.
          </>,
          <>
            <C>Rate limit</C> names the scoped limiter on top of the
            global 100 req / 15 min / IP bucket.
          </>,
          <>
            <C>Validation</C> names the Zod body schema, or None where the
            core handles a missing input itself.
          </>,
          <>
            <C>Core method</C> maps the route to the single library call
            the controller makes (register →{' '}
            <C>auth.registerUser</C>, and so on).
          </>,
        ]}
      />

      <H2 id="rate-limits">Rate limits at a glance</H2>
      <DataTable
        head={['Limiter', 'Budget', 'Applies to']}
        rows={[
          ['Global', '100 req / 15 min / IP', 'Everything'],
          ['registerLimiter', '10 / hour / IP', 'POST /register'],
          ['authLimiter', '5 / 15 min / IP', 'POST /login'],
          ['refreshLimiter', '20 / 15 min / IP', 'POST /refresh'],
          [
            'resetPasswordLimiter',
            '5 / 30 min / IP (shared)',
            'POST /forgot-password and /reset-password',
          ],
          ['verifyEmailLimiter', '5 / 15 min / IP', 'POST /verify-email'],
          ['resendOtpLimiter', '5 / 30 min / IP', 'POST /resend-otp'],
        ]}
      />
      <P>
        Exceeding any limiter answers <C>429</C> with a plain message;
        exceeding an OTP attempt counter answers <C>429</C> with the
        lockout message instead. Logout, status, profile, and
        change-password carry the global limiter only.
      </P>

      <H2 id="responses">Response shape</H2>
      <P>
        Successes share <C>{'{ success: true, … }'}</C>: message-only
        bodies everywhere except <C>GET /me</C>, which returns a{' '}
        <C>data</C> projection, and register’s <C>201</C>. Errors share{' '}
        <C>{'{ success: false, message }'}</C>, plus an <C>errors</C>{' '}
        array for validation failures only. Details live on{' '}
        <A href="/docs/concepts/validation-errors">
          Validation & errors
        </A>
        .
      </P>
      <Callout title="Tokens never appear in JSON" tone="note">
        <P>
          Access and refresh tokens travel exclusively as{' '}
          <C>Set-Cookie</C> headers. If a response body ever seems to be
          missing them, check the cookies. That is where they are.
        </P>
      </Callout>
    </>
  )
}
