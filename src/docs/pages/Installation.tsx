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

export default function Installation(): ReactElement {
  return (
    <>
      <PageHeader
        eyebrow="Getting started"
        title="Installation"
        lede={
          <>
            Add the library to your own app, or run the reference app to
            explore the full flow locally. Both paths start from npm.
          </>
        }
      />

      <H2 id="library">Use the library in your app</H2>
      <Code language="bash" code="npm install openauth" />
      <P>
        Then install the peer for the database you actually run (one of
        the two, not both):
      </P>
      <Code
        language="bash"
        code={'npm install mongoose\n# or\nnpm install @prisma/client'}
      />
      <P>Entry points resolve to the built package output:</P>
      <Code
        language="ts"
        code={
          "import { createAuth } from 'openauth'\nimport { mongooseAdapter } from 'openauth/mongoose'\nimport { prismaAdapter } from 'openauth/prisma'"
        }
        caption="Subpath exports for each adapter. See Adapters for what each one supports."
      />

      <H2 id="reference-app">Run the reference app</H2>
      <P>
        The reference app is the fastest way to see every flow working.
        It needs three things before it boots:
      </P>
      <UL
        items={[
          'A recent Node.js with native TypeScript type-stripping: the app imports a .ts config file directly.',
          'A reachable MongoDB (a connection string is enough; no tuning required).',
          'A valid environment: six variables, validated fail-fast at startup.',
        ]}
      />
      <Code
        language="bash"
        code={
          'npm install   # postinstall regenerates the Prisma client\nnpm run build # required: the app resolves openauth/* to dist/\nnpm start'
        }
      />
      <Callout title="Rebuild before you run" tone="note">
        <P>
          The reference app consumes the library as an installed package
          that resolves to <C>dist/</C>, not to source. If you change
          anything under the library source, run <C>npm run build</C>{' '}
          first or the app will silently serve the old output.
        </P>
      </Callout>

      <H2 id="environment">Environment variables</H2>
      <P>
        A single validated schema is the only configuration source: the
        app crashes before listening if any required value is missing or
        malformed.
      </P>
      <DataTable
        head={['Variable', 'Required', 'Purpose']}
        rows={[
          [
            <C key="v-port">PORT</C>,
            'Yes',
            'HTTP listen port. Numeric string, 1–65535.',
          ],
          [
            <C key="v-mongo">MONGODB_URL</C>,
            'Yes',
            'MongoDB connection string for Mongoose.',
          ],
          [
            <C key="v-access">ACCESS_TOKEN_SECRET</C>,
            'Yes',
            'HMAC secret for 15-minute access JWTs. At least 32 characters, and different from the refresh secret.',
          ],
          [
            <C key="v-refresh">REFRESH_TOKEN_SECRET</C>,
            'Yes',
            'HMAC secret for 7-day refresh JWTs. At least 32 characters, and different from the access secret.',
          ],
          [
            <C key="v-env">NODE_ENV</C>,
            'No (development)',
            'development, production, or test. Controls secure cookies, dev stack traces, and debug logging.',
          ],
          [
            <C key="v-front">FRONTEND_URL</C>,
            'In production',
            'The single allowed CORS origin. Defaults to http://localhost:5173 in development.',
          ]
        ]}
      />
      <Code
        language="env"
        code={
          'PORT=3000\nMONGODB_URL=<your-mongodb-connection-string>\nACCESS_TOKEN_SECRET=<your-32+-char-access-secret>\nREFRESH_TOKEN_SECRET=<your-different-32+-char-refresh-secret>\nNODE_ENV=development\nFRONTEND_URL=http://localhost:5173'
        }
      />
      <Callout title="Secrets stay out of the repo" tone="warn">
        <P>
          Never commit real values. Use placeholders like the ones above
          and keep the working file local to your machine.
        </P>
      </Callout>

      <H2 id="verify">Verify it works</H2>
      <P>
        With the server running, the liveness probe answers without any
        authentication:
      </P>
      <Code
        language="bash"
        code="curl http://localhost:3000/api/auth/"
      />
      <Code
        language="json"
        code={'{\n  "success": true,\n  "message": "API is working"\n}'}
      />
      <P>
        From here, continue to <A href="/docs/quickstart">Quickstart</A>{' '}
        for the full register → verify → login loop.
      </P>
    </>
  )
}
