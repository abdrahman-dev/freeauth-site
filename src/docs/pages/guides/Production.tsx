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

export default function Production(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Guides"
        title="Going to production"
        lede={
          <>
            The checklist for running the reference app beyond your
            laptop. It covers only what the repository actually
            determines. Anything it does not determine is marked as
            yours to decide.
          </>
        }
      />

      <H2 id="checklist">Checklist</H2>
      <UL
        items={[
          <>
            <C>Rebuild the library from the deployed source.</C> The app
            resolves the package to <C>dist/</C>. Deploy{' '}
            <C>npm run build</C> output generated from the exact source
            you ship, never a stale directory.
          </>,
          <>
            <C>Set NODE_ENV=production.</C> This enables secure cookies
            and silences development stack traces and debug logging.
          </>,
          <>
            <C>Set FRONTEND_URL.</C> Boot fails without it in
            production; it must exactly match the frontend origin that
            sends credentials.
          </>,
          <>
            <C>Use distinct, long secrets.</C> Both JWT secrets need at
            least 32 characters and must differ. Validated at startup,
            fatal if violated.
          </>,
          <>
            <C>Point at a restricted database user.</C> The connection
            string needs no special options, but the credentials in it
            should be scoped to what the app requires.
          </>,
          <>
            <C>Start with npm start</C>: connect to the database, then
            listen on <C>PORT</C>. A failed connection exits the process
            rather than serving.
          </>,
        ]}
      />

      <H2 id="before-first-boot">Before the first boot</H2>
      <UL
        items={[
          <>
            Rotate any credential that ever sat alongside code in a
            working tree (both JWT secrets and the database password),
            and audit history if it was ever pushed.
          </>,
          <>
            Replace the OTP log lines with a real provider (see{' '}
            <A href="/docs/guides/email-delivery">Email delivery</A>) and
            confirm no log pipeline retains old codes.
          </>,
          <>
            Re-read <A href="/docs/concepts/security">Security</A>’s
            known concerns with your deployment in mind: particularly
            CSRF posture, cookie transport, and the missing
            change-password limiter.
          </>,
        ]}
      />

      <H2 id="unknowns">Explicitly out of scope</H2>
      <P>
        The repository contains no Dockerfile, compose file, CI
        workflow, or infrastructure config. Hosting, process
        supervision, TLS termination, and scaling are yours to design.
        Likewise, a Prisma-backed deployment’s connection story is
        currently unverified, so bringing Postgres means owning that
        configuration end to end. These docs will not pretend otherwise.
      </P>
      <Code
        language="bash"
        code={
          'npm run build  # dist/ from deployed src/\nnpm start       # connect, then listen on PORT'
        }
      />
      <Callout title="Verify with the probe" tone="note">
        <P>
          After deploy, <C>GET /api/auth/</C> should answer{' '}
          <C>200 {"{ success: true }"}</C> without credentials. If the
          probe fails, check environment validation first. It crashes
          the process before listening, which is the most common boot
          failure by design.
        </P>
      </Callout>
    </>
  )
}
