import type { ReactElement } from 'react'
import {
  C,
  Code,
  DataTable,
  H2,
  P,
  PageHeader,
  UL,
} from '../../../components/docs/primitives.tsx'

export default function ValidationErrors(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Core concepts"
        title="Validation & errors"
        lede={
          <>
            Request bodies are validated once at the HTTP boundary with
            Zod; everything downstream throws typed operational errors
            that one central handler maps to JSON. Two layers, no
            surprises.
          </>
        }
      />

      <H2 id="validation">Validation at the boundary</H2>
      <P>
        Seven body-taking routes validate their JSON body before the
        controller runs. Validation parses the body and{' '}
        <em>replaces</em> it with the parsed result (unknown keys are
        silently stripped), and any failure short-circuits to a{' '}
        <C>422</C>. Query strings, path parameters, cookies, and headers
        are never schema-validated; the core performs no schema
        validation at all and trusts the controller’s shape.
      </P>
      <DataTable
        caption="Request schemas"
        head={['Schema', 'Fields & rules']}
        rows={[
          [
            <C key="s-register">registerSchema</C>,
            'name (2–50 chars, letters/spaces, non-blank), email (5–100), password (full strength policy)',
          ],
          [
            <C key="s-login">loginSchema</C>,
            'email (5–100), password (1–100 chars, any content)',
          ],
          [
            <C key="s-forgot">forgotPasswordSchema</C>,
            'email only, no length bounds',
          ],
          [
            <C key="s-reset">resetPasswordSchema</C>,
            'email, 6-digit numeric otp, plus at least one of newPassword / password (legacy alias, same strength policy)',
          ],
          [
            <C key="s-change">changePasswordSchema</C>,
            'currentPassword (non-empty), newPassword (strength policy, must differ from current)',
          ],
          [
            <C key="s-verify">verifyEmailSchema</C>,
            'email plus 6-digit numeric otp',
          ],
          [<C key="s-resend">resendOTPSchema</C>, 'email only'],
        ]}
      />
      <P>
        The shared strength policy behind every new password: 8–100
        characters with an uppercase letter, a lowercase letter, a
        digit, and a special character.
      </P>
      <Code
        language="json"
        code={
          '{\n  "success": false,\n  "message": "Validation failed",\n  "errors": [\n    { "field": "password", "message": "Password must contain at least one number" }\n  ]\n}'
        }
      />

      <H2 id="errors">Operational errors</H2>
      <P>
        Business failures throw <C>AppError</C> (a message plus a status
        code, nothing more), and the central handler renders them
        verbatim with no error array and no stack, even in development.
        Database, token-library, and schema errors map in later branches;
        anything unrecognized becomes a <C>500</C> (with a stack trace
        attached only in development).
      </P>
      <DataTable
        head={['Status', 'Produced by']}
        rows={[
          ['200', 'All successes except register'],
          ['201', 'Register only'],
          [
            '400',
            'Invalid or expired OTP, already-verified account, database validation / cast errors',
          ],
          [
            '401',
            'Missing, invalid, or expired access token; bad credentials; bad, missing, or reused refresh token; wrong current password; orphaned session user',
          ],
          ['403', 'Login before email verification'],
          ['404', 'Unknown route, or user not found'],
          ['409', 'Email already in use, or duplicate key fallback'],
          ['422', 'Any request-body validation failure'],
          ['429', 'OTP lockout or any rate limiter'],
          ['500', 'Everything else'],
        ]}
      />
      <P>
        Every error shares one shape: <C>success: false</C> plus a{' '}
        <C>message</C>, with an <C>errors</C> array only for validation
        failures. There is no error-code enum; match on status plus
        message. One wrinkle to know: the access-token middleware answers
        its own 401s directly, so its three messages (
        <C>No access token provided</C>, <C>Access token expired</C>,{' '}
        <C>Invalid access token</C>) differ slightly from the central
        handler’s token messages.
      </P>

      <H2 id="client-advice">Advice for API clients</H2>
      <UL
        items={[
          'Send Content-Type: application/json on every body. Parsing happens before validation.',
          'Treat 422 as “fix the request”, 429 as “back off”, and 401 on refresh as “log in again”.',
          'Never branch on the absence of an errors array for business errors. Only validation failures carry one.',
        ]}
      />
    </>
  )
}
