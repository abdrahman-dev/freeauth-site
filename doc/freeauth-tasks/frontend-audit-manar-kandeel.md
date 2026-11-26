# Frontend Audit - Manar Kandeel
Date: 2026-11-26
Repo: starkeep-site (the task calls it `freeauth-site`. The project was renamed to Starkeep on 2026-11-26)
Commit audited: `76a8746` (chore: rebrand site from FreeAuth to Starkeep (#2))

> How I worked: I read every file under `src/`, the config files, `docs/ui-guide.md`, and the backend repo (`starkeep`: `README.md`, `doc/backend.md`, `routes/`, `controllers/`, `config/env.js`, `prisma/schema.prisma`). I didn't change any file in the repo. I ran the project locally (Windows 10, Node 24) and checked the pages in Chrome DevTools at 360px and desktop width. Anything I couldn't confirm is marked **not sure**.

## 1. Summary (max 10 lines)

The site is a clean, small Vite + React 19 + TypeScript + Tailwind v4 SPA with a landing page, a FAQ page and 25 hand-written docs pages. The docs structure is good: one navigation model in `src/docs/nav.ts` drives the sidebar, search, breadcrumbs, prev/next and meta descriptions.
The biggest problem is that **the docs and the landing page are behind the backend**. They don't mention Google/GitHub sign-in (3 endpoints), they say Node ≥ 18 (the backend needs ≥ 22), and they still describe the reference app as MongoDB-only with no Docker or CI.
Second, **the rebrand is not complete**: the logo image used in the navbar and as the favicon still says "OpenAuth", and "freeauth" is still in the Ko-fi username and CSS class names.
Third, several text colors and the focus ring are below WCAG contrast, partly because the UI guide itself recommends them.
There's also about 1,100 lines of unused 3D code (`BlackHole`) and 5 dependencies that only that code uses.
TypeScript is strict and has no `any`. A clean `npm ci`, the type-check, the lint and the build all pass on my machine.

## 2. What the project is

Starkeep-site is the public website for Starkeep, a database-agnostic authentication library for Node.js (`README.md:3-5`). It's for Node.js backend developers deciding whether to use the library and learning how. It has a marketing landing page, a FAQ page and a documentation section.

**Routes** (routing is in `src/App.tsx:41-50` and `src/docs/DocsShell.tsx:18-38`):

| Route | Renders |
|---|---|
| `/` | `pages/Home.tsx`: Navbar, Hero (Aurora canvas, badges, headline, CTAs, `npm install` snippet), "Auth shouldn't care what database you use" feature cards, "Wire it up" code example, open-source section, Footer |
| `/faq` | `pages/FaqPage.tsx`: 6-question accordion (`components/Faq.tsx`) and a GitHub CTA |
| `/docs` | Introduction |
| `/docs/installation`, `/docs/quickstart` | Getting started pages |
| `/docs/concepts/{architecture, authentication, adapters, validation-errors, security}` | Core concepts (5 pages) |
| `/docs/api` | API overview |
| `/docs/api/{status, register, login, verify-email, resend-otp, refresh, me, forgot-password, reset-password, change-password, logout}` | 11 endpoint pages, all rendered by one template `components/docs/ApiPage.tsx` from data in `src/docs/api/*.ts` |
| `/docs/adapters`, `/docs/adapters/{mongoose, prisma}` | Adapter pages (3) |
| `/docs/guides/{email-delivery, production}` | Guides (2) |
| any other `/docs/*` | Docs layout with an in-docs "This page isn't in the docs" (`DocsShell.tsx:55-69`) |
| anything else | `pages/NotFound.tsx` (404 page, no navbar) |

Total: 25 docs pages, which matches the 25 entries in `DOCS_NAV` (`src/docs/nav.ts:19-179`).

## 3. Structure

```
src/
  main.tsx, App.tsx      entry + minimal pathname router (no router library)
  pages/                 Home, FaqPage, NotFound
  components/            landing components: Navbar, Hero, Aurora, CodeBlock, FeatureCard,
                         SectionHeading, Faq, Footer, DonateLink, icons
                         + BlackHole.tsx / BlackHole.shader.ts (unused, see §6)
  components/docs/       docs chrome: DocsLayout, DocsHeader, DocsSidebar, DocsToc,
                         DocsBreadcrumbs, DocsPagination, DocsSearch, ApiPage, primitives
  docs/                  docs content: nav.ts (navigation model), DocsShell.tsx (docs router),
                         pages/*.tsx (prose pages), api/*.ts (endpoint data)
  lib/github.ts          repo URL + live GitHub star count hook
  styles/globals.css     Tailwind import, @theme tokens, focus ring, animations
docs/                    ui-guide.md (design source of truth), backend-api-doc.md (copy of backend doc)
public/                  logo PNG, llms.txt, robots.txt, icons.svg
```

**How routing works:** `App.tsx` reads `window.location.pathname` once and on `popstate`/`hashchange`. No component calls `history.pushState`. Every link is a plain `<a href>`, so **every click is a full page load**. This works and is simple, but the whole app re-boots on each navigation (and the navbar re-fetches the GitHub star count).

**How docs are built:** hand-written, not generated. Prose pages are TSX files in `src/docs/pages/` that use shared primitives (`components/docs/primitives.tsx`: `PageHeader`, `H2`, `H3`, `P`, `C`, `Code`, `Callout`, `DataTable`, ...). API pages are data objects (`src/docs/api/*.ts`, typed by `api/types.ts`) rendered by one `ApiPage` template. `api/types.ts:1-3` says the content must trace to `docs/backend-api-doc.md`. Pages are lazy-loaded, one chunk per page (`DocsShell.tsx:18-49`).

**Main reusable components:**
- `Navbar`: floating rounded nav bar with the logo, FAQ, Docs and "Star on GitHub" with a live star count.
- `Hero`: centered hero with the Aurora canvas background and the install snippet.
- `Aurora`: Canvas 2D animated gradient blobs.
- `CodeBlock`: code display with a small custom tokenizer, a copy button and an optional blinking caret.
- `DocsLayout`: the docs shell (sticky header, sidebar, mobile drawer, generated "On this page" TOC with scroll-spy, ⌘K search, breadcrumbs, prev/next).
- `DonateLink`: Ko-fi link in two variants.

## 4. Stack and how to run it

**Verified from `package.json`:**

| Package | Used for |
|---|---|
| `react`, `react-dom` 19.2 | UI |
| `vite` 8.2, `@vitejs/plugin-react` 6.1 | dev server and build |
| `typescript` ~6.0 | types (`tsc -b` runs before the build) |
| `tailwindcss` 4.3, `@tailwindcss/vite` | styling with CSS-first `@theme` tokens (`src/styles/globals.css:5-48`) |
| `@fontsource-variable/geist`, `@fontsource-variable/geist-mono` | self-hosted fonts |
| `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing` (+ `@types/three`) | **only imported by `BlackHole.tsx`, which nothing imports.** `@react-three/drei` isn't imported anywhere |
| `eslint` 10, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-config-prettier`, `prettier` | linting and formatting (there is no `format` script) |

"Last known stack" check: Vite, React, TypeScript, Tailwind `@theme` and the Canvas 2D hero are all correct. One correction to the onboarding guide: the fonts are **Geist / Geist Mono**, not Inter / JetBrains Mono.

**Scripts:** `dev` (vite), `build` (`tsc -b && vite build`), `lint` (`eslint .`), `preview`. There's no `typecheck` script.

**Node version:** there's no `engines` field and no `.nvmrc`. From `package-lock.json`, `vite` and `@vitejs/plugin-react` need Node `^20.19.0 || >=22.12.0`, and `eslint` needs `^20.19.0 || ^22.13.0 || >=24`. CI uses Node 22 (`.github/workflows/ci.yml:17`). So in practice: **Node 20.19+ or 22.13+**.

**Steps from a clean clone:**
```bash
git clone https://github.com/abdrahman-dev/starkeep-site.git
cd starkeep-site
npm ci            # uses the lockfile and doesn't modify it
npm run dev       # http://localhost:5173
```
Optional: `cp .env.example .env` to set `VITE_GITHUB_REPO`. The default works without it (`src/lib/github.ts:8-14`).

**Results on my machine** (Windows 10, Node v24.19.0, npm 12.2.0, clean clone at `76a8746`):
- `npm ci`: works. It added 234 packages in about 6 minutes. npm reported **13 vulnerabilities (9 moderate, 4 high)**. I didn't run `npm audit fix` (read-only task), and I didn't check which packages they come from.
- `npx tsc -b`: **no errors**.
- `npm run lint`: **no errors or warnings**.
- `npm run build`: **succeeds** in 2.5s (68 modules). Main JS `index-*.js` is 266.17 kB (79.81 kB gzip), CSS is 41.43 kB (8.62 kB gzip), and each docs page is its own small chunk (1.6–5.7 kB). Vite printed no chunk-size warnings.
- `npm run dev`: works; the site opens at `http://localhost:5173` with no errors in the browser Console.
- Note: I used Node 24, while CI uses Node 22 (`.github/workflows/ci.yml:17`). Both worked for me, but nothing in the repo tells a new contributor which version to use.

## 5. Design system check

**Tokens are centralized, but not fully used.** `globals.css:5-48` defines the base, neutral, silver and semantic colors, the fonts and the radii in `@theme`, matching the guide's §32 token block. But:
- The guide's §32 also defines `--color-accent-warm*` and `--color-accent-teal*` (`docs/ui-guide.md`, §32). These are **missing from `@theme`**, so the teal is hard-coded as `text-[#8AC8BD]` in 8 places (`Hero.tsx:173`, `Navbar.tsx:52,58,66`, `Footer.tsx:18,26`, `Introduction.tsx:23,39`), and the gold/teal colors are hard-coded in `Aurora.tsx`.
- `rgba(221,217,240,…)` (silver with alpha) is written by hand **66 times** in `.tsx` files instead of using a token or Tailwind's `/opacity` syntax.
- The comment at `globals.css:6` says "Guide §31 — canonical token definition", but the token definition is §32 in the current guide (§31 is "Figma / Prototype vs Production").

**Where the code follows the guide:** the background and surfaces (`#0D0B1A` family), the neutral and silver scales, Geist in light weights for headings, Geist Mono for code and labels, the radius scale (8/12/20 plus 10 for buttons and 16 for cards, guide §7), a single silver primary CTA with a ghost link (guide §8, `Hero.tsx:178-230`), real `<a>`/`<button>` usage (guide §14), and `prefers-reduced-motion` respected for all animations (`globals.css:137-144, 188-197, 258-271`, `Aurora.tsx:113-116`).

**Where the code differs from the guide:**

| Guide says | Code does | Evidence |
|---|---|---|
| Navbar integrated into the page: `#0D0B1A` background, bottom border, no floating (§14) | Floating rounded card navbar with shadow and blur | `Navbar.tsx:26-33` |
| Logo is a thin-line star glyph + "Starkeep" wordmark in Geist 300 (§14) | A PNG image is used, and **the image says "OpenAuth"** | `Navbar.tsx:40-46`, `public/logo/starkeep-logo.png` |
| Nav link hover is silver `#DDD9F0` (§14) | Hover is teal `#8AC8BD` | `Navbar.tsx:52,58,66` |
| Hero on desktop: two columns, text left, code right (§24) | Centered single column (the comment says "was left-aligned grid column") | `Hero.tsx:88-97` |
| Starfield texture (§16) | No starfield. The Aurora canvas plus a faint SVG grain replaced it | `Aurora.tsx:1-12, 198-206` |
| Decorative colors `#524F72`/`#3C3959` must not be used for content users need (§23) | Used for the footer copyright, footer links, Donate link, docs labels and the search button | `Footer.tsx:9,36`, `DonateLink.tsx:39`, `DocsSidebar.tsx:64` |

**Where the guide itself looks outdated or contradicts itself:**
- §14 (integrated navbar, glyph logo) and §24 (two-column hero) describe an older layout than the current code. The onboarding guide also says "a floating navbar" and "a centered hero", so I think the code is the intended state and the UI guide wasn't updated. **not sure**, see §12.
- §18 tells the footer copy to use `#3C3959`, but §23 says not to use `#3C3959` for content users must understand. That text is 1.78:1 on the page background (see §7).
- §16 (starfield) no longer matches anything on the site.

## 6. Code quality

- **TypeScript:** `strict: true`, `noUnusedLocals`, `noUnusedParameters` and `erasableSyntaxOnly` are on (`tsconfig.app.json`). I searched `src/` and found **no `any`**, no `@ts-ignore`, and only one non-null assertion (`main.tsx:6`, the standard root element). The only `eslint-disable` comments are in the unused `BlackHole.tsx`. `npx tsc -b` and `npm run lint` both pass with no errors or warnings (§4).
- **Dead code and unused files:**
  - `src/components/BlackHole.tsx` (411 lines) and `BlackHole.shader.ts` (711 lines) aren't imported anywhere. The CSS for its fallback glow (`globals.css:166-191`, `freeauth-fallback-glow*`) is only used there.
  - `public/icons.svg` isn't referenced anywhere. It contains Vite-template icons (Bluesky, etc.).
  - `src/components/README.md` says "No components yet", which is outdated (there are 13+ components).
  - `src/lib/.gitkeep` is a leftover (`lib/github.ts` exists).
  - `Aurora.tsx:9` mentions "DimensionalField", which doesn't exist in the repo.
  - Commented-out copy alternatives are left in the code (`Home.tsx:108-121, 200-205`, `NotFound.tsx:5-11`).
- **Duplication:**
  - The same "Skip to content" link markup is repeated in 4 files (`Home.tsx`, `FaqPage.tsx`, `NotFound.tsx`, `DocsLayout.tsx`).
  - The primary button class string is copied in `Hero.tsx`, `FaqPage.tsx`, `NotFound.tsx` and `DonateLink.tsx` (there's no Button component).
  - Inline icon components are redefined per file (`Home.tsx`, `DocsHeader.tsx`, `DocsLayout.tsx`, `DocsSearch.tsx`), and the search icon exists twice.
- **Naming and consistency:**
  - Old-name CSS classes `freeauth-status-pulse`, `freeauth-cta-glow` and `freeauth-fallback-glow` (`globals.css:167-265`, used in `Hero.tsx:137,187`).
  - `DonateLink.tsx` uses double quotes while the rest of the code and `.prettierrc` use single quotes.
  - `CodeBlock.tsx:25-40, 71-73` keeps a `KEYWORDS` set and a separate regex that also lists `npm`/`curl`, and only highlights double-quoted strings, so single-quoted TS strings like `'starkeep'` are never highlighted (visible in the "Wire it up" example on the landing page).

## 7. UX / accessibility / responsive

**Good, from the code:**
- Real `<a href>` for all navigation and `<button type="button">` for actions (copy, menu, search, FAQ).
- Skip links on every page.
- `aria-current` in the sidebar, breadcrumbs and TOC.
- The FAQ uses `aria-expanded` and `aria-controls`.
- The search is a combobox with `aria-activedescendant`.
- Touch targets are mostly ≥ 40–44px.
- The heading order on the landing page is correct (one `h1` in the Hero, `h2` sections, `h3` cards).

**Problems:**
- **Color contrast** (WCAG AA needs 4.5:1 for normal text). I calculated these on `#0D0B1A`:
  - `text-text-secondary` (`#6E6B8F`) = **3.85:1**. It's used for the hero supporting paragraph (`Hero.tsx:169`), the FAQ answers, the feature card text and the nav links.
  - `text-text-subtle` (`#524F72`) = **2.52:1**: footer links, Donate link, docs group labels, the search button text.
  - `text-text-muted` (`#3C3959`) = **1.78:1**: the footer "© 2026 Starkeep" and "Built and maintained by…" (`Footer.tsx:9,36`).
- **Focus ring is too weak:** `globals.css:74-79` removes the outline and uses `box-shadow: 0 0 0 3px rgba(221,217,240,0.14)`. On the page background that ring is about **1.35:1**, below the 3:1 needed for non-text indicators. I checked with Tab in the browser: on "View documentation →" the ring is there, but it's a faint grey box that is easy to miss.
- **Docs drawer:** focus moves to the close button when it opens (`DocsLayout.tsx:164-173`), but there's no focus trap, and focus doesn't return to the menu button on close. The search dialog also has no focus trap (`DocsSearch.tsx`).
- The search shortcut is shown as `⌘K` on all systems (`DocsHeader.tsx:85-87`). Ctrl+K works too (`DocsLayout.tsx:146-150`), but Windows users don't see that.
- The 404 page has no navbar (`NotFound.tsx`), unlike every other page.

**Responsive (checked in Chrome DevTools at 360px and desktop width):**
- **Hero headline is broken below 640px (checked in Chrome DevTools at 360px):** it reads **"The auth layeryou actually own."** with no space. The cause is `Hero.tsx:156-158`: the line break is `<br className="hidden sm:block" />`, and JSX removes the newline between "layer" and "you". So when the `<br>` is hidden on mobile, there's no space left between the words.
- **Navbar at 360px (checked in the browser):** it fits. The logo, FAQ, Docs and "Star" are all visible with no overflow (the star count is hidden below 420px as designed). My estimate from the code was wrong here. The logo clearly shows **"OpenAuth"**.
- **Inline code** in the docs uses `whitespace-nowrap` (`primitives.tsx:93`), so in theory long inline code could cause horizontal scroll on phones. I checked `/docs/concepts/adapters` at 360px and there is **no horizontal scroll**, so it's fine today. It's a risk only if longer inline code is added later.
- **Docs:** the sidebar becomes a drawer below `lg` and the TOC is hidden below `xl` (`DocsLayout.tsx:193,205`). Code blocks scroll horizontally (`CodeBlock.tsx:152`). Checked at 360px: the ☰ button opens the drawer from the left, the current page (Adapters) is highlighted, and the X closes it. No Console errors.
- **Hero (checked at 360×526):** the install snippet and even the "Get started" button are below the fold. You need to scroll to see the main install command. With `min-h-[84vh]` (`Hero.tsx:17`) and the top padding, the hero is taller than a small phone screen.

## 8. Performance

- **3D libraries:** `three` and the `@react-three/*` + `postprocessing` packages are only used by the unused `BlackHole.tsx`, so they should **not** be in the production bundle (they're never imported). They still cost install time and CI time, and they confuse readers. The build confirms it: only 68 modules are transformed, and the whole app is one 266 kB JS file (79.8 kB gzip) plus small docs chunks. three.js alone would be much bigger than that.
- **Aurora canvas** (`Aurora.tsx:113-189`): a `requestAnimationFrame` loop draws 5 radial gradients every frame, forever, while the landing page is open. It's capped at DPR 1.5 and stops for reduced motion (good), but it **doesn't pause when the hero is scrolled out of view** (there's no IntersectionObserver). The browser pauses it in background tabs.
- **Infinite CSS animations:** the CTA glow animates `box-shadow` (repaints every frame, `globals.css:248-264`), plus the status dot and the caret. These are small but always running.
- **Logo:** `public/logo/starkeep-logo.png` is **245 KB** at 2171×724, shown at 44px high. It's also the favicon (`index.html:5`).
- **Fonts:** two variable font packages, self-hosted through Fontsource. The build outputs 12 `.woff2` files (about 152 kB in total) for latin, latin-ext, cyrillic, vietnamese and symbols subsets. Fontsource uses `unicode-range`, so an English page should only download the two latin files (29.4 kB + 23.1 kB). **not sure**: I didn't check the network tab to confirm only those load.
- **Network:** the navbar calls `api.github.com` on every landing/FAQ page load (`lib/github.ts:37-78`). Because every navigation is a full reload, this repeats each time. The unauthenticated GitHub limit is 60 requests per hour per IP, and the code fails silently, which is good.
- Docs pages are lazy-loaded per route, which is good.

## 9. Content accuracy

I compared the site with the backend repo (`starkeep` at `0586e17`).

| Site says | Backend actually | Evidence |
|---|---|---|
| "Node.js ≥ 18" badge | Node **≥ 22** required (`engines`, `.nvmrc`, README "Requirements") | `Hero.tsx:115` vs `starkeep/package.json` `engines.node: ">=22"` |
| `npm install starkeep` in the hero | "**not published to npm yet**, so `npm install starkeep` does not work yet" | `Hero.tsx:234` vs `starkeep/README.md:5`. The site's own `Installation.tsx:30` and `Introduction.tsx:77` agree with the backend, so the hero contradicts the docs |
| "Eleven endpoints" (11 API pages) | **14 endpoints**: also `POST /google`, `POST /github/state`, `POST /github` | `ApiOverview.tsx:21`, `nav.ts:201` vs `starkeep/routes/authRoutes.js:38-43` |
| "Not OAuth… no redirects to a provider" | The backend now has Google and GitHub sign-in, and the GitHub flow redirects to GitHub | `Introduction.tsx:66-73` vs `starkeep/doc/backend.md` §4–§5 |
| Reference app = "MongoDB and Mongoose", needs "a reachable MongoDB" and "six variables" | The `ADAPTER` env var selects `mongoose` or `prisma`; 11 variables in `.env.example` | `Introduction.tsx:62`, `Installation.tsx:58-59` vs `starkeep/config/env.js`, `.env.example` |
| Refresh-token string "unique in Prisma but not in Mongoose" | Unique in both now | `AdaptersOverview.tsx:67` vs `starkeep/src/internal/models/refreshToken.js:10-13` |
| Prisma schema shows `password String` (required), with no `provider` fields | `password String?`, plus `provider` and `providerId` | `Prisma.tsx:52` vs `starkeep/prisma/schema.prisma:22-28` |
| Prisma connection "currently unverified"; "no Dockerfile, compose file, CI workflow" | `DATABASE_URL` + `PrismaPg` are wired; `Dockerfile`, `docker-compose.yml` and `.github/workflows/test.yml` exist | `Prisma.tsx:75`, `AdaptersOverview.tsx:76`, `Production.tsx:89-93` vs the backend repo root |

The root cause seems to be that **`docs/backend-api-doc.md` in this repo is an old copy**: it says "Endpoint count: 11" (line 545), while the backend's `doc/backend.md:651` says 14 and has 35 mentions of Google that the copy doesn't have. The last content change to the copy was on 2026-09-14 (`7093691`). The rebrand commit only renamed things.

One thing is correct on the site and wrong in the backend doc: the `GET /me` response. The site shows `data: { id, email, name, isAccountVerified }` (`api/me.ts:18`), which matches the real controller (`starkeep/controllers/auth/authController.js:17`, `data: user`). `doc/backend.md` §18 says `data: { user }`.

**Other content issues:**
- **Logo says "OpenAuth"**: the file was renamed `openauth-logo.png` → `freeauth-logo.png` → `starkeep-logo.png` (git log, commits `b38f321`, `76a8746`), but the image content was never changed. It shows in the navbar on `/` and `/faq` and as the favicon.
- **Ko-fi placeholder**: `KOFI_USERNAME = "freeauth"` (`DonateLink.tsx:4`). It's used in the footer on every page and as a prominent button in `Introduction.tsx:109`. It's not in the navbar yet.
- **Missing punctuation**: `Home.tsx:219-220` renders "…whoever shows up to build them Whichever stack you bring…" (no period between the link and the next sentence).
- **FAQ license answer**: "MIT… No attribution gymnastics required" (`Faq.tsx:39`). MIT does require keeping the copyright and license notice, so "no attribution" can be read wrongly. **not sure** how strict you want this wording to be.
- **FAQ**: "The status badge up top" (`Faq.tsx:24`), but the FAQ page has no status badge. It's on the landing page.
- `Home.tsx:162` "You've installed it" comes right after an install command that doesn't work yet (see the table above).

**Broken links:** I didn't find internal docs links pointing to missing routes. Every `href` in `nav.ts` has a matching loader or API entry. I also opened all 25 docs pages in the browser using the "Next →" links: every page loaded, with no errors in the Console. External links (GitHub, Ko-fi) were not checked live.

## 10. SEO and repo health

**SEO:**
- **Good:** `<title>` and the meta description are set per page (`Home.tsx:81-90`, `FaqPage.tsx:10-21`, `DocsLayout.tsx:51-63` using `DOCS_DESCRIPTIONS`). There are Open Graph and Twitter title/description tags (`index.html:7-28`), `robots.txt`, and an `llms.txt`, which is a nice touch for AI readers.
- **Missing:** `og:image` (the social preview card has no image), `og:url`/canonical, `sitemap.xml`, and a sitemap line in `robots.txt`.
- **Client-only metadata:** titles and descriptions are set with JavaScript after load, so crawlers and link previews that don't run JS see only the `index.html` values for every page.
- **404:** the 404 page is rendered client-side. The server will return 200 for unknown URLs (a "soft 404"). The 404 page doesn't reset the meta description.
- **SPA fallback:** `App.tsx:12-13` says direct loads need an SPA fallback in the host config, but the repo has **no host config** (no `vercel.json`, `netlify.toml`, `_redirects`, etc.). **not sure** where the site is deployed. Without a fallback, opening `/docs/installation` directly would 404.
- **Favicon:** the 245 KB wide "OpenAuth" PNG, which won't be readable at 16×16.

**Repo health:**
- **README:** short and correct, but it has no clone/install steps and no Node version.
- **CONTRIBUTING.md:** clear workflow (issue → branch → small PR → squash). **AGENTS.md:** clear agent rules.
- **CI** (`.github/workflows/ci.yml`): `npm ci` + lint + build on Node 22 for PRs and pushes to main. Good.
- **`.gitignore`:** ignores `.env*` (keeps `.env.example`), `node_modules`, `dist`. Fine. **`.env.example`:** only `VITE_GITHUB_REPO`, and it's documented.
- **LICENSE:** the site says "MIT License" in the footer and on the landing page, but **this repo has no LICENSE file**. **not sure** if the site is meant to be MIT too or only the library.
- **Nothing sensitive is committed:** no `.env`, no keys. The only odd committed files are the unused ones listed in §6.

## 11. My opinion (good / weak / remove / develop / missing)

**1. What is good and should stay**
- **`src/docs/nav.ts` as the single source** for the sidebar, search, breadcrumbs, prev/next and meta descriptions. Adding a page is simple, and nothing gets out of sync inside the site.
- **The honest tone of the docs**: "not published yet", "known concerns", "explicitly out of scope". For an auth library, honesty builds trust.
- **API pages as data + one template** (`src/docs/api/*.ts` + `ApiPage.tsx`): consistent and easy to update.
- **No router library and no heavy runtime.** Lazy docs pages, strict TypeScript, no `any`, and CI that runs lint + build.
- **Accessibility basics done right**: real links and buttons, skip links, `aria-current`, reduced motion.

**2. What is weak or risky (top 5, ranked)**
1. **Docs are behind the backend** (§9): no OAuth endpoints, a wrong Node version, outdated Prisma/Docker claims. The docs are the product's face, and a developer who follows wrong docs leaves.
2. **The first impression is broken**: the navbar logo says "OpenAuth", the hero headline reads "The auth layeryou actually own." on phones, and the hero's `npm install starkeep` doesn't work yet (the docs say so themselves).
3. **Contrast and focus** (§7): the hero paragraph, footer, docs labels and the focus ring are below WCAG. Some of this comes from the UI guide, so fixing only the code won't hold.
4. **No process keeps the docs in sync**: `docs/backend-api-doc.md` is a manual copy that silently went stale for two months.
5. **Deployment and SEO assumptions are hidden**: there's no SPA fallback config in the repo, metadata is client-side only, and there's no `og:image`. **not sure** how it's hosted today.

**3. What we can remove**
- `BlackHole.tsx`, `BlackHole.shader.ts`, the `freeauth-fallback-glow*` CSS, and the dependencies `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `postprocessing`, `@types/three`. Why: about 1,100 unused lines and 6 packages that slow down installs and CI and make new people think the hero uses WebGL.
- `public/icons.svg`, `src/lib/.gitkeep`, `src/components/README.md` (outdated). Why: leftovers that confuse readers.
- The commented-out copy alternatives in `Home.tsx` and `NotFound.tsx`. Why: decisions belong in PR history, not in the code.

**4. How to develop the project next (top 5)**

| # | Improvement | Effort | Impact |
|---|---|---|---|
| 1 | Sync the docs with the backend: add the 3 OAuth endpoint pages and a social sign-in concept page, and fix the stale claims in §9 | medium | high |
| 2 | Fix the first impression: the missing space in the mobile headline, a real Starkeep logo (SVG, which also gives a small favicon), replace the hero install line with "clone the repo" until npm publish (or label it "coming soon"), finish the rename (CSS classes, Ko-fi) | small | high |
| 3 | Accessibility pass: raise the secondary/subtle text colors and the focus ring to WCAG AA, and update the UI guide (§18, §23) so they stay fixed | small–medium | high |
| 4 | Tokens and components cleanup: add the teal/warm tokens from guide §32, replace the 66 hand-written `rgba(221,217,240,…)` with tokens, extract `Button` and `SkipLink` components | medium | medium |
| 5 | Hosting and SEO basics: an SPA fallback config in the repo, `og:image`, canonical, `sitemap.xml`; later, prerender the docs pages | medium | medium |

**5. What is missing for a developer-tool site**
- A **changelog / release notes** page and a visible version number.
- An **"Edit this page on GitHub"** link on each docs page, so contributors can fix docs easily.
- **Full-text search** (current search matches titles and keywords only, `DocsSearch.tsx:6-8`).
- A **social sign-in guide** (Google/GitHub setup), now that the backend supports it.
- A **Prisma quickstart**: the quickstart and reference app docs are Mongoose-first.
- A **social preview image** and a real favicon.
- A **roadmap or status** page ("what's next: npm publish, more adapters").

## 12. Questions I could not answer

1. **Where is the site deployed?** That decides whether the missing SPA fallback is a real bug (§10).
2. **Is the UI guide behind the code, or the code behind the guide?** Specifically: the floating navbar vs §14, the centered hero vs §24, the PNG logo vs the glyph logo, and teal nav hover vs silver.
3. **Is there a new Starkeep logo file?** If not, should the site temporarily use a text wordmark?
4. **Should the docs cover the OAuth endpoints now**, or wait until they're stable?
5. **When is npm publish planned?** That decides whether to change the hero install line or keep it.
6. **Is the site itself MIT-licensed?** There's no LICENSE file in this repo.
7. **Delivery path:** the task says `doc/freeauth-tasks/`, but this repo uses `docs/` and the project is now Starkeep. Also, the branch name `audit/frontend-…` doesn't match the branch types in `CONTRIBUTING.md` (`feat|fix|docs|chore|design`). I followed the task text.