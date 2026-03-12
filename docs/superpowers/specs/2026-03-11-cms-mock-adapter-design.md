# CMS Mock Adapter Design

## Goal

Add a `MockAdapter` that implements `CMSAdapter` and returns fully-typed fixture data, activated via the `CMS_ADAPTER=mock` environment variable, so the site can be developed and tested locally without Contentful credentials — and to prove that any conforming adapter will render correctly.

## Architecture

The existing `CMSAdapter` interface is the sole contract. `src/cms/index.ts` selects the adapter at build time based on `import.meta.env.CMS_ADAPTER`. The mock adapter returns domain types directly (no Contentful raw format), which validates that the rendering pipeline is independent of the CMS implementation.

**Tech stack:** TypeScript, Astro 5, Vite env vars (`import.meta.env`).

**`@/` path alias** is already configured in `tsconfig.json` and `astro.config.mjs` and is used throughout the codebase — no changes needed.

**`CMS_ADAPTER` is a build-time, server-side variable.** It is read by `src/cms/index.ts` only during the Astro static build (Node.js context). It is never exposed to the browser bundle and does not need a `VITE_` prefix. It will not work in client-side components.

---

## File Structure

```
src/cms/
  index.ts                  ← updated: env-var factory
  types.ts                  ← unchanged
  adapters/
    contentful/             ← unchanged
    mock/
      index.ts              ← MockAdapter satisfying CMSAdapter
      fixtures/
        nav.ts              ← [NavBrand | null, NavElement[]]
        pages.ts            ← Page[] (one "home" page, all section types)
        footer.ts           ← Footer
        theme.ts            ← SiteTheme (design token values)

.env.example                ← add CMS_ADAPTER=mock (commented)
```

---

## Factory (`src/cms/index.ts`)

```typescript
import type { CMSAdapter } from './types';
import { ContentfulAdapter } from './adapters/contentful';
import { MockAdapter } from './adapters/mock';

export const cms: CMSAdapter =
    import.meta.env.CMS_ADAPTER === 'mock' ? MockAdapter : ContentfulAdapter;
```

- Default (unset or any other value): `ContentfulAdapter` — no change for existing deployments.
- `CMS_ADAPTER=mock`: `MockAdapter` — local dev and CI without Contentful credentials.

---

## MockAdapter (`src/cms/adapters/mock/index.ts`)

```typescript
import type { CMSAdapter } from '@/cms/types';
import { navFixture } from './fixtures/nav';
import { pagesFixture } from './fixtures/pages';
import { footerFixture } from './fixtures/footer';
import { themeFixture } from './fixtures/theme';

export const MockAdapter: CMSAdapter = {
    getNavigation: async () => navFixture,
    getPages:      async () => pagesFixture,
    getFooter:     async () => footerFixture,
    getSiteTheme:  async () => themeFixture,
};
```

Each fixture is a typed constant. TypeScript enforces the domain type shape at compile time.

Both adapters are plain object literals (not classes) — no instantiation needed.

**Fixture constant types:**
- `navFixture` — type `[NavBrand | null, NavElement[]]` (a tuple, not a plain array)
- `pagesFixture` — type `Page[]`
- `footerFixture` — type `Footer` (not `Footer | null`; returning a concrete value satisfies `Promise<Footer | null>`)
- `themeFixture` — type `SiteTheme` (same reasoning)

---

## Fixture Data

### `nav.ts`
Export: `navFixture` typed as `[NavBrand | null, NavElement[]]` (tuple — the first element is `NavBrand | null`, the second is `NavElement[]`).
- `NavBrand`: `{ src, alt, label, href }` — logo image URL, alt text, site name label, href `/`
- `NavElement[]`: 4 top-level links (Home, About, Works, Contact) + 1 dropdown menu (`NavMenu` shape: `{ label, submenu: NavElement[] }`) with 2 items

### `theme.ts`
- Hardcoded design token values matching the existing defaults:
  - `colorAccent: '#8B6F47'`, `colorBg: '#FAFAF8'`, `colorText: '#1A1A1A'`
  - `fontHeading: 'Playfair Display'`, `fontBody: 'Inter'`

### `footer.ts`
- Brand logo + tagline
- 2 columns: Navigation (4 links), Works (2 links)
- 2 social links: Instagram + Twitter (with `icon` field)
- 2 legal links: Privacy Policy, Terms of Use
- Copyright string

### `pages.ts`
`PageElement = Section | Form` — a discriminated union on the `kind` field (`'section'` or `'form'`). `Section` also has a `type` field narrowing which section component renders.

One page (`slug: 'home'`) with `pageElements` containing all section and form types in reading order:

| Order | Kind (`PageElement.kind`) | `Section.type` | Key fields exercised |
|-------|--------------------------|----------------|----------------------|
| 1 | `section` | `hero` | title, subtitle, body (rich text), mediaUrl, 2 CTAs (primary + secondary) |
| 2 | `section` | `banner` | dark theme, title, subtitle, single CTA |
| 3 | `section` | `features` | 3 items each with icon, title, subtitle, body |
| 4 | `section` | `cards` | 3 items with mediaUrl, title, subtitle, body, CTA |
| 5 | `section` | `testimonials` | 2 items with subtitle (quote), body (attribution) |
| 6 | `section` | `stats` | 4 items with value + label (title) |
| 7 | `section` | `text` | left layout, body rich text, ghost CTA |
| 8 | `section` | `gallery` | 4 items with mediaUrl + title |
| 9 | `section` | `carousel` | 3 slide items with title, subtitle, CTA |
| 10 | `form` | n/a | contact form: text, email, textarea fields; submit label; success message |

Rich text `body` fields use a minimal Contentful `Document` node (single paragraph) so `RichText.astro` renders real output.

**Note on the `Document` type:** `body` is typed as `Document` from `@contentful/rich-text-types`. This package is already installed and is a pure-types package (no API credentials required). Importing it in the mock fixtures is acceptable — it represents the rich text data format, not a Contentful API dependency.

---

## `.env.example` update

```env
# Set to "mock" to use local fixture data (no Contentful credentials needed)
# CMS_ADAPTER=mock
# (omit or set to any other value to use ContentfulAdapter)
```

---

## Testing

No unit tests are needed for the mock adapter — it is pure data with no logic. TypeScript compilation is the test: if a fixture violates the domain type, the build fails.

The mock adapter provides implicit contract coverage: if the site builds and renders with `CMS_ADAPTER=mock`, the rendering pipeline is proven to depend only on the `CMSAdapter` interface, not on Contentful internals.
