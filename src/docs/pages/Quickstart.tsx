import type { ReactElement } from 'react'
import {
  A,
  C,
  Callout,
  Code,
  H2,
  OL,
  P,
  PageHeader,
  UL,
} from '../../components/docs/primitives.tsx'

export default function Quickstart(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Getting started"
        title="Quickstart"
        lede={
          <>
            One full loop against a local reference app in a few minutes:
            register, verify, log in, call an authenticated endpoint. OpenAuth sends no email, so verification codes
            come from the server log in development.
          </>
        }
      />

      <H2 id="prerequisites">Prerequisites</H2>
      <UL
        items={[
          <>
            The reference app running locally (see{' '}
            <A href="/docs/installation">Installation</A>). The examples
            below assume <C>PORT=3000</C>.
          </>,
          <>
            <C>curl</C>. Cookie flags (<C>-c</C> to save, <C>-b</C> to
            send) stand in for the browser cookie jar.
          </>,
        ]}
      />

      <H2 id="register">1. Register</H2>
      <Code
        language="bash"
        code={
          "curl -X POST http://localhost:3000/api/auth/register \\\n  -H 'Content-Type: application/json' \\\n  -c cookies.txt \\\n  -d '{\n    \"name\": \"Ada Lovelace\",\n    \"email\": \"ada@example.com\",\n    \"password\": \"Str0ng!Pass\"\n  }'"
        }
      />
      <Code
        language="json"
        code={'{\n  "success": true,\n  "message": "User registered successfully"\n}'}
      />
      <P>
        Registration returns <C>201</C> with cookies already set, but the
        account is unverified, and login stays blocked until verification
        completes.
      </P>

      <H2 id="verify">2. Verify the email</H2>
      <P>
        Find the code in the server log. Delivering it is your
        application’s job, and in development the reference app logs it
        instead of sending it:
      </P>
      <Code
        language="bash"
        code="[DEV] Account verification OTP for ada@example.com: 123456"
      />
      <Code
        language="bash"
        code={
          "curl -X POST http://localhost:3000/api/auth/verify-email \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"email\": \"ada@example.com\",\n    \"otp\": \"123456\"\n  }'"
        }
      />
      <Code
        language="json"
        code={'{\n  "success": true,\n  "message": "Email verified successfully"\n}'}
      />

      <H2 id="login">3. Log in</H2>
      <Code
        language="bash"
        code={
          "curl -X POST http://localhost:3000/api/auth/login \\\n  -H 'Content-Type: application/json' \\\n  -c cookies.txt -b cookies.txt \\\n  -d '{\n    \"email\": \"ada@example.com\",\n    \"password\": \"Str0ng!Pass\"\n  }'"
        }
      />
      <Code
        language="json"
        code={'{\n  "success": true,\n  "message": "Login successful"\n}'}
      />
      <Callout title="Unverified accounts stop here" tone="note">
        <P>
          Logging in before verifying returns <C>403</C> with a message
          asking for verification first. The account exists, the
          password may even be right, but no session is issued.
        </P>
      </Callout>

      <H2 id="authenticated-request">4. Call an authenticated endpoint</H2>
      <Code
        language="bash"
        code={
          'curl http://localhost:3000/api/auth/me \\\n  -b cookies.txt'
        }
      />
      <Code
        language="json"
        code={
          '{\n  "success": true,\n  "data": {\n    "id": "<string>",\n    "email": "ada@example.com",\n    "name": "Ada Lovelace",\n    "isAccountVerified": true\n  }\n}'
        }
      />
      <P>
        The response is a safe projection. The password hash and OTP
        material are never included.
      </P>

      <H2 id="what-happened">What just happened</H2>
      <OL
        items={[
          'Register created an unverified user, hashed the password with bcrypt, stored a hashed OTP, and issued a first session.',
          'Verify consumed that OTP and flipped the account to verified.',
          'Login re-checked the password and the verified flag, then minted a fresh token pair and session row.',
          'The access cookie authorized /me for up to 15 minutes; the refresh cookie can rotate the pair for up to 7 days.',
        ]}
      />

      <H2 id="next-steps">Next steps</H2>
      <UL
        items={[
          <>
            <A href="/docs/concepts/authentication">
              Authentication & sessions
            </A>{' '}:
            tokens, cookies, rotation, and lockouts in depth.
          </>,
          <>
            <A href="/docs/api">API reference</A>: every endpoint with
            request shapes, errors, and side effects.
          </>,
          <>
            <A href="/docs/guides/email-delivery">Email delivery</A>:
            replacing the dev log line with a real provider.
          </>,
        ]}
      />
    </>
  )
}
