import type { ReactElement } from 'react'
import {
  A,
  Callout,
  Code,
  DataTable,
  H2,
  P,
  PageHeader,
  UL,
} from '../../../components/docs/primitives.tsx'

export default function EmailDelivery(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Guides"
        title="Email delivery"
        lede={
          <>
            OpenAuth creates and verifies one-time codes but sends
            nothing: no mailer, no provider SDK, no SMTP anywhere in the
            codebase. This guide shows exactly where your application
            takes over.
          </>
        }
      />

      <H2 id="split">Who owns what</H2>
      <DataTable
        head={['OpenAuth responsibility', 'Developer responsibility']}
        rows={[
          [
            'Generate the 6-digit code cryptographically.',
            'Transport it to the user’s inbox.',
          ],
          [
            'Store only its SHA-256 hash, with a 10-minute expiry.',
            'Design the email itself: subject, body, branding.',
          ],
          [
            'Verify the submitted code, count attempts, enforce per-flow lockouts.',
            'Handle bounces, retries, and provider failures.',
          ],
          [
            'Return the raw code to your controller at issuance time.',
            'Read that return value and hand it to your provider.',
          ]
        ]}
      />

      <H2 id="hook">Where to hook in</H2>
      <P>
        Three core operations return the raw code to the controller, and
        the reference app currently logs it as an explicit development
        stub. Each log line marks the exact place your provider call
        belongs:
      </P>
      <UL
        items={[
          <>
            Registration: the verification code for a new account (
            <A href="/docs/api/register">POST /register</A>).
          </>,
          <>
            Forgot-password: the reset code, logged only when the email
            belongs to a real account (
            <A href="/docs/api/forgot-password">POST /forgot-password</A>
            ).
          </>,
          <>
            Resend: the replacement verification code (
            <A href="/docs/api/resend-otp">POST /resend-otp</A>).
          </>,
        ]}
      />
      <P>
        The wiring itself is one substitution per flow. Take the value
        the core already hands you and send it instead of logging it:
      </P>
      <Code
        language="ts"
        code={
          '// Illustrative wiring (not backend source).\n// The core returns the raw OTP; the controller decides how it travels.\nconst { otp } = await auth.resendOTP(email)\nawait emailProvider.send({\n  to: email,\n  subject: "Your verification code",\n  text: `Your code is ${otp}. It expires in 10 minutes.`,\n})'
        }
        caption="Replace the dev log line with your provider call. The OTP value, TTL, and attempt rules stay exactly as documented."
      />

      <H2 id="rules">Rules that survive the swap</H2>
      <UL
        items={[
          'Never put the code in an API response. Responses stay code-free; only your server process ever sees the raw value.',
          'Never store the raw code. The hashed-at-rest invariant is yours to keep if you persist anything.',
          'Keep the generic responses: forgot-password and resend must answer identically for unknown emails even once a real provider sits behind them.',
          'Remember the dev stub has no environment gate. When you add the provider, remove the log line rather than leaving both.',
        ]}
      />
      <Callout title="Codes expire in 10 minutes" tone="note">
        <P>
          Say so in the email. A code that outlives its welcome is a
          support ticket; a code with a stated lifetime is a second
          attempt.
        </P>
      </Callout>
    </>
  )
}
