# OpenAuth UI Guide

> **Status:** Canonical UI / UX reference  
> **Scope:** Entire OpenAuth product — frontend, documentation UI, dashboard UI, auth screens, landing pages, reusable components, and future frontend packages.  
> **Priority:** This document is the **first and only visual source of truth** for the project.
>
> When implementing or modifying UI, an agent must follow this guide before introducing any new visual rule, color, typography choice, spacing pattern, component treatment, or interaction style.

---

## 1. Product Visual Identity

OpenAuth is a **DB-agnostic authentication toolkit for Node.js**. Its UI should feel like infrastructure software rather than a generic SaaS marketing site.

The visual language is:

- quiet
- technical
- precise
- restrained
- premium without being flashy
- dark, atmospheric, and slightly cosmic
- documentation/tooling oriented
- confident through simplicity

The design uses a **deep indigo night-sky foundation**, a **purple-tinted neutral scale**, **silver highlights**, and extremely subtle atmospheric glow.

The intended feeling is:

> **“Technical infrastructure that gets out of your way.”**

Do not turn the interface into a generic “AI SaaS” aesthetic.

### Core visual principle

**Restraint is part of the brand.**

Silver is rare. Glow is rare. Accent color is rare. Motion is subtle. Large empty areas are intentional.

The interface should look considered even when very little is happening.

---

# 2. Non-Negotiable Design Rules

These rules have priority over local implementation preferences.

### 2.1 Do not invent a new visual language

Do not introduce:

- neon purple
- saturated violet gradients
- bright cyan
- bright electric blue
- generic SaaS indigo/purple gradients
- glassmorphism as a default treatment
- excessive blur
- excessive glow
- heavy black drop shadows
- extremely rounded “pill everything” UI
- aggressive animations
- oversized bold typography
- decorative UI with no functional purpose

### 2.2 Preserve the purple undertone

The neutral scale is intentionally **not pure gray**.

Every neutral should retain the project's subtle purple/indigo undertone.

Do not replace the neutral palette with Tailwind's default gray/zinc/slate colors unless explicitly approved.

### 2.3 Silver is a highlight

Silver is for:

- primary CTAs
- key headings
- important labels
- high-priority UI emphasis
- selected/highlighted elements

Silver should **not** become the dominant background of large surfaces.

### 2.4 Glow is atmospheric

Glow should be:

- soft
- low opacity
- localized
- secondary to content

Glow must be something the user **feels more than consciously notices**.

### 2.5 Space is intentional

Use generous whitespace.

Do not fill empty regions just because they are available.

---

# 3. Color System

## 3.1 Base & Surface Palette

| Token | Name | Hex | Purpose |
|---|---|---:|---|
| `bg-base` | Cosmic Base | `#0D0B1A` | Primary page/application background |
| `bg-elevated` | Deep Space | `#131128` | Elevated surfaces, code blocks, inputs |
| `bg-card` | Card Surface | `#17152E` | Cards and contained content surfaces |
| `bg-modal` | Modal Surface | `#1C1A38` | Modals, hover-elevated surfaces, highest surface level |

### Surface hierarchy

Use surfaces as a progression rather than arbitrary colors:

```text
#0D0B1A  →  page / root background
#131128  →  elevated content
#17152E  →  cards
#1C1A38  →  modals / highly elevated interaction
```

Do not skip randomly between surface levels.

---

## 3.2 Neutral Scale

The neutral scale carries the project's purple undertone.

| Token | Name | Hex | Semantic Role |
|---|---|---:|---|
| `neutral-100` | Neutral 100 | `#1E1C36` | Borders |
| `neutral-200` | Neutral 200 | `#2A2845` | Dividers |
| `neutral-300` | Neutral 300 | `#3C3959` | Muted foreground |
| `neutral-400` | Neutral 400 | `#524F72` | Subtle text / decorative elements |
| `neutral-500` | Neutral 500 | `#6E6B8F` | Secondary text |
| `neutral-600` | Neutral 600 | `#9896B8` | Dim body text |
| `neutral-700` | Neutral 700 | `#C8C4E0` | Body text |

### Neutral hierarchy

Use the scale intentionally:

```text
neutral-100  → borders
neutral-200  → dividers
neutral-300  → extremely muted UI
neutral-400  → subtle / low-priority copy
neutral-500  → secondary copy
neutral-600  → readable body / technical copy
neutral-700  → primary body copy
```

Do not use `neutral-700` everywhere. Contrast comes from hierarchy.

---

## 3.3 Silver / Highlight Palette

| Token | Name | Hex | Semantic Role |
|---|---|---:|---|
| `silver-primary` | Starlight Silver | `#DDD9F0` | Primary CTA / main highlights |
| `silver-bright` | Silver Bright | `#ECEAF8` | Hover / active emphasis |
| `silver-dim` | Silver Dim | `#B8B4D4` | Secondary silver / restrained highlights |

### Silver behavior

Normal primary highlight:

```text
#DDD9F0
```

Hover / brighter interactive state:

```text
#ECEAF8
```

Dimmed or secondary silver:

```text
#B8B4D4
```

Do not introduce another white/silver unless a specific requirement proves these tokens insufficient.

---

## 3.4 Accent and Semantic Colors

| Token | Name | Hex | Purpose |
|---|---|---:|---|
| `accent-mid` | Indigo Mid | `#5A5680` | Accent, atmospheric indigo, decorative emphasis |
| `error` | Dusty Rose | `#C17070` | Errors, destructive states |
| `success` | Cool Mint | `#7BB8A4` | Success / valid states |

### Semantic philosophy

Semantic colors should remain **muted**.

The UI is not allowed to become:

- pure red
- pure green
- neon green
- alarm red
- highly saturated status UI

Use the semantic colors as part of the night-sky palette.

---

# 4. Recommended Semantic Aliases

The raw palette above is canonical. In implementation, components should consume semantic aliases rather than repeating raw hex values.

Recommended aliases:

```css
--color-bg-base: #0D0B1A;
--color-bg-elevated: #131128;
--color-bg-card: #17152E;
--color-bg-modal: #1C1A38;

--color-border: #1E1C36;
--color-divider: #2A2845;

--color-text-muted: #3C3959;
--color-text-subtle: #524F72;
--color-text-secondary: #6E6B8F;
--color-text-dim: #9896B8;
--color-text-body: #C8C4E0;
--color-text-primary: #DDD9F0;

--color-silver-bright: #ECEAF8;
--color-silver-dim: #B8B4D4;

--color-accent: #5A5680;
--color-error: #C17070;
--color-success: #7BB8A4;
```

### Rule

Components should reference semantic tokens.

Avoid:

```tsx
color: "#9896B8"
```

Prefer:

```tsx
color: "var(--color-text-dim)"
```

or the project's equivalent design-token utility/class.

This keeps the palette centrally controllable.

---

# 5. Typography

## 5.1 Primary Typeface

**Inter**

Use Inter for:

- headings
- body copy
- navigation
- buttons
- labels
- badges
- forms
- general UI

The primary weights used by the system are:

- `300` — light / display
- `400` — regular
- `500` — medium labels and emphasis

Avoid using `600`/`700` for major headlines unless an explicit component requirement exists.

---

## 5.2 Technical Typeface

**JetBrains Mono**

Use JetBrains Mono for:

- code
- package names
- technical metadata
- token labels
- design-system annotations
- terminal/package-installation UI
- compact developer-oriented labels

Primary system weights:

- `400`
- `500`

---

# 6. Canonical Type Scale

| Style | Font | Weight | Size | Line Height | Tracking | Color |
|---|---|---:|---:|---:|---:|---|
| Display / Hero | Inter | 300 | `52px` | `1.10` | `-0.02em` | `#DDD9F0` |
| H1 | Inter | 300 | `36px` | `1.15` | `-0.015em` | `#DDD9F0` |
| H2 | Inter | 300 | `26px` | `1.25` | `-0.01em` | `#DDD9F0` |
| H3 | Inter | 400 | `18px` | `1.40` | `0` | `#C8C4E0` |
| H4 | Inter | 500 | `14px` | `1.40` | `0.03em` | `#C8C4E0` |
| Body Large | Inter | 400 | `16px` | `1.70` | normal | `#9896B8` |
| Body | Inter | 400 | `14px` | `1.70` | normal | `#9896B8` |
| Small / Caption | Inter | 400 | `12px` | `1.60` | `0.02em` | `#6E6B8F` |
| Label / Caps | Inter | 500 | `11px` | `1.00` | `0.18em` | `#6E6B8F` |
| Code | JetBrains Mono | 400 | `13px` | `1.75` | normal | `#9896B8` |

### Display rules

Large headlines should feel light, not heavy.

Preferred:

```text
font-weight: 300
```

Avoid:

```text
font-weight: 700
```

for the primary visual headline.

The project signals confidence through restraint rather than visual weight.

---

# 7. Shape Language

Canonical corner-radius scale:

| Token | Radius | Typical Usage |
|---|---:|---|
| `radius-sm` | `8px` | compact controls, small UI |
| `radius-md` | `12px` | inputs, code blocks, contained controls |
| `radius-lg` | `20px` | heroes, major feature surfaces |

Additional component-specific values may use nearby values such as:

- `10px` for buttons
- `14px` for section demo containers
- `16px` for feature cards
- `20px` for hero surfaces

### Shape principle

Corners should feel **moderate and technical**.

Do not round every element to `9999px`.

Pills are reserved for badges/status labels.

---

# 8. Buttons

The system defines three canonical button variants:

1. Primary
2. Secondary
3. Ghost / Text

---

## 8.1 Shared Button Geometry

Canonical characteristics:

```text
Font: Inter
Weight: 400
Size: 13px
Letter spacing: 0.06em
Radius: 10px
Vertical padding: 9px
Horizontal padding: 22px
Transition: ~0.2s ease
```

Buttons are:

- compact
- controlled
- understated
- not oversized

---

## 8.2 Primary Button

### Default

```text
Background: #DDD9F0
Text:       #0D0B1A
```

### Hover

```text
Background: #ECEAF8
Text:       #0D0B1A
Glow:       subtle
```

### Active

```text
Background: #C8C4E0
Text:       #0D0B1A
```

### Disabled

```text
Background: #1E1C36
Text:       #3C3959
Opacity:    ~45%
Cursor:     not-allowed
Shadow:     none
```

### Primary button philosophy

There should usually be **one confident primary CTA per section**.

The primary CTA is intentionally silver.

---

## 8.3 Secondary Button

### Default

```text
Background: transparent
Text: #9896B8
Border: rgba(221,217,240,0.18)
```

### Hover

```text
Background: rgba(221,217,240,0.04)
Text: #DDD9F0
Border: rgba(221,217,240,0.35)
```

### Active

```text
Background: rgba(221,217,240,0.06)
```

### Disabled

```text
Text: #3C3959
Border: #1E1C36
Opacity: ~45%
```

Secondary is visually quieter than primary.

---

## 8.4 Ghost / Text Button

Default:

```text
Background: transparent
Text: #9896B8
Border: transparent
```

Hover:

```text
Text: #DDD9F0
Underline: yes
Underline offset: 3px
Underline color: subtle silver alpha
```

The ghost button should feel almost like interactive text.

---

# 9. Button State Rule

The design-system showcase may expose:

```text
default
hover
active
disabled
```

But production components must not require a manual `state="hover"` prop just to render a visual state.

Production behavior should normally rely on:

```text
:hover
:active
:focus-visible
:disabled
```

The design guide describes the visual states; it does not require applications to hard-code them.

---

# 10. Inputs / Forms

## 10.1 Standard Input

Canonical geometry:

```text
Background: #131128
Radius: 10px
Padding: 10px 14px
Font: Inter
Font size: 13px
Text: #DDD9F0
```

### Default

Use an extremely subtle border:

```text
rgba(221,217,240,0.07)
```

### Focus

Border:

```text
rgba(221,217,240,0.25)
```

Focus ring:

```text
0 0 0 3px rgba(221,217,240,0.06)
```

The focus state should be visible but soft.

### Error

Border:

```text
rgba(193,112,112,0.35)
```

Focus/error ring:

```text
0 0 0 3px rgba(193,112,112,0.06)
```

Error text:

```text
#C17070
```

Example message:

```text
Please enter a valid email.
```

---

## 10.2 Input Labels

Labels are small and technical:

```text
Font: Inter
Weight: 500
Size: 11px
Letter spacing: 0.12em
Transform: uppercase
Color: #6E6B8F
```

Semantic error labels may use `#C17070`.

---

# 11. Badges & Pills

Badges are **thin bordered**, not chunky filled labels.

Canonical:

```text
Padding: 4px 11px
Radius: 20px
Font: Inter
Weight: 400
Size: 11px
Letter spacing: 0.08em
```

### Default badge

```text
Background: rgba(221,217,240,0.05)
Border: rgba(221,217,240,0.12)
Text: #9896B8
```

### Success badge

```text
Background: rgba(123,184,164,0.07)
Border: rgba(123,184,164,0.20)
Text: #7BB8A4
```

### Error badge

```text
Background: rgba(193,112,112,0.07)
Border: rgba(193,112,112,0.20)
Text: #C17070
```

### Accent badge

```text
Background: rgba(90,86,128,0.12)
Border: rgba(90,86,128,0.30)
Text: #B8B4D4
```

### Badge examples

Valid concepts include:

```text
Open Source
MIT License
v1.0.0
DB-Agnostic
Stable
Deprecated
Node.js ≥ 18
TypeScript
```

---

# 12. Cards

Feature cards establish the main contained-surface pattern.

## Default card

```text
Background: #17152E
Border: rgba(221,217,240,0.05)
Radius: 16px
Padding: 28px
```

Card icon container:

```text
Size: 38px × 38px
Background: rgba(221,217,240,0.04)
Border: rgba(221,217,240,0.08)
Radius: 10px
Icon color: #9896B8
```

Card title:

```text
Inter
400
14px
#DDD9F0
```

Card body:

```text
Inter
400
13px
line-height: 1.65
#6E6B8F
```

---

## Card hover

Hover is subtle:

```text
Background: #1C1A38
Border: slightly brighter
Shadow: soft indigo-toned shadow
```

The hover effect should feel like the card moved one elevation level upward.

### Important

The project intentionally uses:

> **“felt, not seen”**

for hover glow.

Do not create a strong neon outline.

---

# 13. Code Blocks

Code is part of the product identity because OpenAuth is a developer tool.

Canonical code block:

```text
Background: #131128
Border: rgba(221,217,240,0.06)
Radius: 12px
Padding: 20px 24px
Font: JetBrains Mono
Size: 13px
Line height: 1.75
Base text: #9896B8
```

### Shadow

Code blocks may use a restrained depth treatment:

```text
0 4px 24px rgba(0,0,0,0.30)
```

plus a very subtle inner highlight.

This is one of the few places where a dark shadow is part of the original visual treatment.

Do not generalize this into heavy black shadows throughout the rest of the UI.

---

## 13.1 Copy Button

Copy control is compact:

```text
Position: top-right
Background: rgba(221,217,240,0.05)
Border: rgba(221,217,240,0.08)
Radius: 6px
Padding: 5px 8px
Font: JetBrains Mono
Size: 10px
Letter spacing: 0.1em
```

Default label:

```text
copy
```

Success label:

```text
copied
```

Success state:

```text
#7BB8A4
```

---

## 13.2 Syntax Highlighting

Syntax highlighting should remain restrained.

The system explicitly avoids bright neon syntax colors.

Prefer colors from the existing neutral/silver palette.

The code should read as technical content, not as a colorful code editor theme.

---

# 14. Navigation

The navbar is intentionally integrated into the same background as the page.

Canonical:

```text
Height: 58px
Horizontal padding: 32px
Background: #0D0B1A
Bottom border: rgba(221,217,240,0.05)
```

## Logo

The OpenAuth mark is a **thin-line star glyph**.

Primary logo treatment:

```text
Stroke: #DDD9F0
Very thin line
```

Secondary circular center detail may use:

```text
#9896B8
```

Wordmark:

```text
Inter
Weight: 300
Size: 15px
Color: #DDD9F0
Letter spacing: 0.08em
```

---

## Nav links

Default:

```text
Inter
400
13px
#6E6B8F
```

Hover:

```text
#DDD9F0
Background: rgba(221,217,240,0.04)
Subtle silver glow
```

Links should be quiet until interacted with.

### Accessibility / implementation rule

Production navigation items that are links must have real `href` destinations.

Do not use fake anchor elements as buttons.

Use:

```html
<a href="...">Docs</a>
```

for navigation.

Use:

```html
<button type="button">...</button>
```

for actions.

---

# 15. Hero Sections

The hero is one of the strongest expressions of the visual identity.

Canonical structure:

```text
Dark cosmic background
Very subtle starfield
Very subtle indigo radial glow
Small badges
Light-weight headline
Muted supporting text
One primary CTA
Quiet code snippet on the right
```

## Hero surface

Typical:

```text
Background: #0D0B1A
Radius: 20px
Border: rgba(221,217,240,0.05)
Padding: 72px 64px
Min height: ~420px
```

## Headline

Canonical:

```text
52px
Weight 300
Line height 1.12
Color #DDD9F0
Letter spacing -0.02em
```

The headline should be visually strong because of scale and whitespace, not weight.

## Supporting copy

Canonical:

```text
16px
Line height 1.7
Color #6E6B8F
```

The copy is intentionally understated.

## CTA

Use one primary CTA.

Example pattern:

```text
npm install openauth
```

Do not stack multiple visually competing silver CTAs inside the same hero.

---

# 16. Starfield / Atmospheric Texture

The starfield is decorative.

It exists to create a subtle cosmic identity, not to become the subject of the page.

### Rules

- Keep total perceived opacity below roughly `8%`.
- Stars must remain sparse.
- Avoid dense star patterns.
- Avoid large glowing stars.
- Avoid distracting motion.
- Texture must stay behind content.

### Animation philosophy

Motion should be:

- slow
- low contrast
- barely noticeable
- never essential to understanding the interface

### Implementation note

A starfield should use stable generated values rather than regenerating random positions on every React render.

Use memoization or another stable data source so unrelated state changes do not make stars jump.

---

# 17. Atmospheric Glow

Use the accent indigo:

```text
#5A5680
```

as the base for atmospheric gradients.

Typical treatment:

```css
radial-gradient(
  ellipse at center,
  rgba(90, 86, 128, 0.08) 0%,
  transparent 70%
)
```

Hero glow may be slightly stronger, around:

```text
rgba(90,86,128,0.12)
```

### Rule

Glow is a background atmosphere.

It should never compete with:

- headline
- CTA
- input content
- documentation content
- modal actions

---

# 18. Footer

The footer should visually **dissolve into the page**.

Canonical:

```text
Background: #0D0B1A
Top border: rgba(221,217,240,0.05)
Padding: 48px 40px
```

Footer copy:

```text
Inter
Weight 300
13px
#3C3959
```

Footer links:

```text
Default: #524F72
Hover: #DDD9F0
```

The original pattern intentionally keeps footer content minimal.

Typical high-priority links:

```text
Docs
GitHub
```

Do not make the footer visually louder than the main content.

---

# 19. Section Headers

Sections use a technical annotation style.

Canonical pattern:

```text
//
SECTION TITLE
────────────────────────────
```

Style:

### Prefix

```text
JetBrains Mono
10px
letter spacing: 0.20em
color: #5A5680
```

### Section title

```text
Inter
Weight: 300
Size: 13px
Letter spacing: 0.25em
Uppercase
Color: #6E6B8F
```

### Divider

```text
1px
#1E1C36
```

The section heading is intentionally understated.

---

# 20. Do / Don't Guidance

## DO

- Use sparse starlight silver for important highlights, CTAs, and key headlines.
- Prefer one confident CTA per section.
- Use Inter `300` for display text and major headlines.
- Use soft low-opacity silver/indigo glows.
- Keep the starfield subtle.
- Use the `8px / 12px / 20px` radius system as the primary shape language.
- Use generous whitespace.
- Preserve the purple undertone in the neutral scale.
- Keep cards and components visually quiet.
- Use subtle elevation rather than dramatic shadows.
- Use muted semantic colors.
- Make technical content feel first-class.

## DON'T

- Do not use bright neon purple.
- Do not use over-saturated violet accents.
- Do not fill large surfaces with silver.
- Do not use `700+` typography weights for major display headlines.
- Do not use black drop shadows as the default visual effect.
- Do not make the starfield dense.
- Do not add multiple competing CTAs to the same section.
- Do not replace the neutral scale with pure cool gray.
- Do not use fully saturated red or green.
- Do not overuse gradients.
- Do not use decorative glassmorphism as a default.
- Do not turn every component into a glowing panel.

---

# 21. Interaction Philosophy

Interactions must preserve the same restraint as static UI.

## Hover

Hover should generally mean:

- slight brightness increase
- small surface elevation
- subtle border increase
- restrained text color change
- tiny glow when appropriate

Not:

- scale jumps
- giant shadows
- neon borders
- aggressive color shifts

## Active / Pressed

Active should feel like a controlled compression in visual hierarchy.

Use slight darkening or a small shift in surface treatment.

## Focus

Focus must be visibly accessible.

Preferred language:

```text
soft silver ring
low-opacity border increase
```

Error focus uses the muted dusty-rose ring.

## Disabled

Disabled elements:

- reduce contrast
- remove glow
- become visually quieter
- communicate non-interactivity clearly

---

# 22. Accessibility

The visual style is intentionally low-contrast in secondary layers, but functional content must remain readable.

### Priority hierarchy

Primary content:

```text
#DDD9F0
#C8C4E0
```

Secondary content:

```text
#9896B8
#6E6B8F
```

Decorative/muted:

```text
#524F72
#3C3959
```

Do not use the darkest colors for content that a user must understand.

### Focus visibility

Interactive components must have a visible keyboard focus state.

Do not remove outlines without replacing them with an equivalent accessible focus indicator.

### Semantic HTML

Use correct native elements:

- `<button>` for actions
- `<a>` for navigation
- `<label>` for form labels
- semantic headings in order
- meaningful `aria-*` attributes only where needed

### Color is not the only signal

Errors and success states should not rely on color alone.

Use:

- text
- icons where useful
- field messages
- correct semantic state

---

# 23. Responsive Behavior

The desktop composition can be spacious, but the visual identity must survive smaller screens.

## Hero

Desktop:

```text
Two-column composition
Text on the left
Code on the right
```

At narrower widths:

```text
Single column
Text first
Code below
Reduced padding
```

Do not allow the fixed desktop code column to force horizontal scrolling.

### Recommended behavior

```text
> 800px:
two-column hero

≤ 800px:
single-column hero
```

The exact breakpoint may evolve, but the composition rule remains.

## Navigation

On smaller widths:

- reduce horizontal spacing
- preserve logo visibility
- prevent links from colliding
- collapse or simplify navigation when necessary

Do not simply shrink everything until it becomes unreadable.

## Cards

Cards should move from multi-column to fewer columns naturally.

Prefer responsive grids such as:

```text
auto-fit / minmax
```

rather than fixed widths.

---

# 24. Spacing Philosophy

The original visual system uses generous spacing.

Primary observed spacing patterns include:

```text
8px
10px
12px
14px
16px
20px
24px
28px
32px
36px
40px
48px
64px
72px
```

The larger values are deliberate in:

- heroes
- page sections
- major surfaces
- footer
- page-level layout

Do not compress the entire UI simply to fit more content.

Whitespace communicates confidence and separation.

---

# 25. Borders

Borders must generally be subtle.

Primary border family:

```text
#1E1C36
```

Low-opacity silver borders:

```text
rgba(221,217,240,0.05)
rgba(221,217,240,0.06)
rgba(221,217,240,0.07)
rgba(221,217,240,0.08)
rgba(221,217,240,0.10)
```

Interactive emphasis may rise to approximately:

```text
rgba(221,217,240,0.18)
rgba(221,217,240,0.25)
rgba(221,217,240,0.35)
```

Do not default to bright 1px silver outlines everywhere.

---

# 26. Shadows

The project prefers **indigo-tinted, soft depth**.

Examples:

```text
0 4px 20px rgba(0,0,0,0.25)
```

for subtle card depth,

and approximately:

```text
0 8px 40px rgba(13,11,26,0.60)
```

for stronger card hover elevation.

### Rule

Shadows should remain secondary.

Do not turn every component into a floating dark rectangle.

The visual hierarchy should mostly come from:

1. surface color
2. border opacity
3. typography
4. spacing
5. only then shadow/glow

---

# 27. Iconography

Icons should follow a technical, thin-line language.

Preferred characteristics:

- outline icons
- thin strokes
- geometric forms
- low visual weight
- `currentColor` where possible

Avoid:

- oversized filled icons
- cartoon illustrations
- emoji as UI icons
- complex decorative icons
- highly colorful icon systems

The star glyph is a key identity element and should remain thin-line.

---

# 28. Component Architecture for the UI

The visual system should be implemented as reusable layers.

Recommended hierarchy:

```text
Design Tokens
    ↓
Primitives
    ↓
Components
    ↓
Patterns
    ↓
Pages / Screens
```

## Tokens

Colors, radii, typography, spacing, shadows, transitions.

## Primitives

Examples:

```text
Text
Heading
Button
Input
Badge
Icon
Divider
```

## Components

Examples:

```text
Navbar
FeatureCard
CodeBlock
FormField
Modal
Toast
```

## Patterns

Examples:

```text
AuthForm
Hero
SettingsPanel
DocumentationHeader
DashboardSection
```

## Pages

Complete routes/screens composed from the above.

---

# 29. Source-of-Truth Enforcement

The agent must treat this file as canonical.

## Before creating a new UI component

Check this document for:

1. color
2. typography
3. radius
4. spacing
5. state behavior
6. interaction language
7. responsive behavior

Only introduce a new token when an existing token truly cannot express the required semantic.

## Before introducing a new color

Ask:

> Can an existing OpenAuth token express this?

Usually the answer should be yes.

Do not create:

```text
random purple
random gray
random blue
random white
```

to solve local visual problems.

## Before introducing a new radius

Prefer:

```text
8px
12px
20px
```

or an explicitly documented nearby component value.

## Before introducing a new shadow

Prefer no shadow first.

Then use a soft indigo-toned elevation treatment.

## Before introducing animation

Ask:

> Does this communicate state or hierarchy?

If not, do not add it.

---

# 30. Figma / Prototype vs Production Implementation

The Figma-generated implementation is a **visual reference**, not a requirement to copy prototype code literally.

The agent may refactor implementation details while preserving visual output.

Examples:

- inline styles may become design-token classes
- repeated colors may become semantic variables
- demo-only state props may be removed from production components
- fake navigation anchors may become real links
- responsive behavior may be added
- component logic may be split into reusable primitives

### What must not change during refactoring

The following are visual contracts:

- palette
- hierarchy
- type scale
- overall spacing philosophy
- restrained glow
- subtle borders
- dark indigo surfaces
- silver CTA language
- muted semantic colors
- technical typography language
- overall calm / precise visual identity

---

# 31. Recommended Token Definition

The following is a canonical starting point for implementation:

```css
@theme {
  --color-bg-base: #0D0B1A;
  --color-bg-elevated: #131128;
  --color-bg-card: #17152E;
  --color-bg-modal: #1C1A38;

  --color-neutral-100: #1E1C36;
  --color-neutral-200: #2A2845;
  --color-neutral-300: #3C3959;
  --color-neutral-400: #524F72;
  --color-neutral-500: #6E6B8F;
  --color-neutral-600: #9896B8;
  --color-neutral-700: #C8C4E0;

  --color-silver-primary: #DDD9F0;
  --color-silver-bright: #ECEAF8;
  --color-silver-dim: #B8B4D4;

  --color-accent-mid: #5A5680;
  --color-error: #C17070;
  --color-success: #7BB8A4;

  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
}
```

This is the canonical palette represented by the current visual system.

---

# 32. Quick Reference

## Colors

```text
COSMIC BASE      #0D0B1A
DEEP SPACE       #131128
CARD SURFACE     #17152E
MODAL SURFACE    #1C1A38

NEUTRAL 100      #1E1C36
NEUTRAL 200      #2A2845
NEUTRAL 300      #3C3959
NEUTRAL 400      #524F72
NEUTRAL 500      #6E6B8F
NEUTRAL 600      #9896B8
NEUTRAL 700      #C8C4E0

STARLIGHT        #DDD9F0
SILVER BRIGHT    #ECEAF8
SILVER DIM       #B8B4D4
INDIGO MID       #5A5680

ERROR            #C17070
SUCCESS          #7BB8A4
```

## Fonts

```text
UI / Display:    Inter
Code / Technical: JetBrains Mono
```

## Main Weights

```text
300 → display / major headlines
400 → body / normal UI
500 → labels / compact emphasis
```

## Main Radii

```text
8px
12px
20px
```

## Core Visual Formula

```text
Deep Indigo
+
Purple-Tinted Neutrals
+
Sparse Silver Highlights
+
Subtle Indigo Glow
+
Generous Whitespace
+
Light Typography
+
Technical Mono Details
=
OpenAuth UI
```

---

# 33. Final Agent Rule

When an implementation decision is visually ambiguous:

> **Choose the quieter option.**

When choosing between two colors:

> **Choose the existing token.**

When choosing between two typography weights:

> **Choose the lighter weight.**

When choosing between adding and removing a glow:

> **Remove it unless it materially improves hierarchy or feedback.**

When choosing between filling space and leaving space:

> **Leave the space.**

When choosing between a new visual effect and an existing component pattern:

> **Reuse the existing pattern.**

The goal is not to make OpenAuth look impressive through decoration.

The goal is to make it look **deliberate, technical, trustworthy, and effortless to use**.

---

## Canonical Status

This document is the project's **UI source of truth**.

Any future UI work should preserve this system unless the UI guide itself is intentionally updated.

**Do not silently redefine the design system inside individual pages or components.**
