# CMS Mock Adapter Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `MockAdapter` that implements `CMSAdapter` with full fixture data for all section types, activated via `CMS_ADAPTER=mock`, so the site renders locally without Contentful credentials.

**Architecture:** `src/cms/index.ts` reads `import.meta.env.CMS_ADAPTER` and selects between `ContentfulAdapter` and `MockAdapter`. The mock adapter is a plain object literal returning typed fixture constants for each of its four methods. Both adapters are statically imported, so the Contentful client must be lazily initialized (inside the function, not at module level) to avoid a throw when `CONTENTFUL_ACCESS_TOKEN` is unset.

**Tech Stack:** TypeScript, Astro 5, Vite env vars (`import.meta.env`), `@contentful/rich-text-types` (already installed).

---

## Files Changed

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `src/cms/adapters/contentful/client.ts` | Make client lazy (prerequisite) |
| Modify | `src/cms/index.ts` | Env-var factory |
| Create | `src/cms/adapters/mock/index.ts` | `MockAdapter` object |
| Create | `src/cms/adapters/mock/fixtures/nav.ts` | Nav fixture |
| Create | `src/cms/adapters/mock/fixtures/theme.ts` | Theme fixture |
| Create | `src/cms/adapters/mock/fixtures/footer.ts` | Footer fixture |
| Create | `src/cms/adapters/mock/fixtures/pages.ts` | Pages fixture (all 9 section types + form) |
| Modify | `.env.example` | Document `CMS_ADAPTER` variable |

---

## Chunk 1: Prerequisites and Scaffolding

### Task 1: Make Contentful client initialization lazy

**Why:** `client.ts` currently calls `createClient(...)` at module level. With empty/missing `CONTENTFUL_ACCESS_TOKEN`, this throws `Expected parameter accessToken` at import time — even when `CMS_ADAPTER=mock`. Moving it inside the function prevents the throw when the mock adapter is selected.

**Files:**
- Modify: `src/cms/adapters/contentful/client.ts`

- [ ] **Step 1: Read the current file**

```bash
cat src/cms/adapters/contentful/client.ts
```

- [ ] **Step 2: Replace eager client creation with a lazy getter**

Replace the full contents of `src/cms/adapters/contentful/client.ts` with:

```typescript
import type { Entry, EntrySkeletonType } from 'contentful';
import type { include_depth } from './types';
import { createClient } from 'contentful';

function getClient() {
    return createClient({
        space:       import.meta.env.CONTENTFUL_SPACE_ID     || '',
        accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN || '',
        environment: import.meta.env.CONTENTFUL_ENVIRONMENT  ?? 'master',
    }).withoutUnresolvableLinks;
}

export async function fetchEntriesByContentType<T extends EntrySkeletonType>(
    contentType: string,
    depth: include_depth
): Promise<Entry<T, 'WITHOUT_UNRESOLVABLE_LINKS'>[]> {
    try {
        const entries = await getClient().getEntries<T>({
            content_type: contentType,
            include: depth,
        });
        return entries.items;
    } catch (error) {
        console.error(`Error fetching entries for content type "${contentType}":`, error);
        return [];
    }
}
```

- [ ] **Step 3: Verify existing tests still pass**

```bash
npm test
```

Expected: all 65 tests pass (the tests mock `fetchEntriesByContentType` directly, so this change is transparent to them).

- [ ] **Step 4: Commit**

```bash
git add src/cms/adapters/contentful/client.ts
git commit -m "fix: lazy-initialize Contentful client to allow mock adapter import"
```

---

### Task 2: Scaffold mock adapter + update factory

**Files:**
- Modify: `src/cms/index.ts`
- Create: `src/cms/adapters/mock/index.ts`
- Create: `src/cms/adapters/mock/fixtures/nav.ts` (stub)
- Create: `src/cms/adapters/mock/fixtures/theme.ts` (stub)
- Create: `src/cms/adapters/mock/fixtures/footer.ts` (stub)
- Create: `src/cms/adapters/mock/fixtures/pages.ts` (stub)

- [ ] **Step 1: Create stub fixture files**

`src/cms/adapters/mock/fixtures/nav.ts`:
```typescript
import type { NavBrand, NavElement } from '@/types/nav';

export const navFixture: [NavBrand | null, NavElement[]] = [null, []];
```

`src/cms/adapters/mock/fixtures/theme.ts`:
```typescript
import type { SiteTheme } from '@/types/theme';

export const themeFixture: SiteTheme = {};
```

`src/cms/adapters/mock/fixtures/footer.ts`:
```typescript
import type { Footer } from '@/types/page';

export const footerFixture: Footer = {};
```

`src/cms/adapters/mock/fixtures/pages.ts`:
```typescript
import type { Page } from '@/types/page';

export const pagesFixture: Page[] = [];
```

- [ ] **Step 2: Create the MockAdapter**

`src/cms/adapters/mock/index.ts`:
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

- [ ] **Step 3: Update the factory**

Replace the full contents of `src/cms/index.ts` with:
```typescript
import type { CMSAdapter } from './types';
import { ContentfulAdapter } from './adapters/contentful';
import { MockAdapter } from './adapters/mock';

export const cms: CMSAdapter =
    import.meta.env.CMS_ADAPTER === 'mock' ? MockAdapter : ContentfulAdapter;
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Verify tests still pass**

```bash
npm test
```

Expected: 65 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/cms/index.ts src/cms/adapters/mock/
git commit -m "feat: scaffold mock adapter with stub fixtures and env-var factory"
```

> **Note:** All fields in both `SiteTheme` and `Footer` are optional (`?`), so `{}` is a valid stub that satisfies both types without TypeScript errors. The `.env.example` update is intentionally deferred to Task 6 (Chunk 3) after the full fixture data is in place.

---

## Chunk 2: Fixture Data

### Task 3: Fill nav + theme fixtures

**Files:**
- Modify: `src/cms/adapters/mock/fixtures/nav.ts`
- Modify: `src/cms/adapters/mock/fixtures/theme.ts`

- [ ] **Step 1: Fill nav fixture**

Replace `src/cms/adapters/mock/fixtures/nav.ts`:
```typescript
import type { NavBrand, NavElement } from '@/types/nav';

export const navFixture: [NavBrand | null, NavElement[]] = [
    {
        src: 'https://placehold.co/120x40/8B6F47/FAFAF8?text=MEA',
        alt: 'Manuela E. Aguirre',
        label: 'Manuela E. Aguirre',
        href: '/',
    },
    [
        { label: 'Home',    href: '/' },
        { label: 'About',   href: '/about' },
        {
            label: 'Works',
            submenu: [
                { label: 'Novels',  href: '/novels' },
                { label: 'Stories', href: '/stories' },
            ],
        },
        { label: 'Contact', href: '/contact' },
    ],
];
```

- [ ] **Step 2: Fill theme fixture**

Replace `src/cms/adapters/mock/fixtures/theme.ts`:
```typescript
import type { SiteTheme } from '@/types/theme';

export const themeFixture: SiteTheme = {
    colorBg:          '#FAFAF8',
    colorSurface:     '#F0EDE8',
    colorBorder:      '#E5E0D8',
    colorText:        '#1A1A1A',
    colorTextMuted:   '#6B6560',
    colorAccent:      '#8B6F47',
    colorDarkBg:      '#1A1A1A',
    colorDarkText:    '#FAFAF8',
    colorAccentBg:    '#8B6F47',
    colorAccentText:  '#FAFAF8',
    fontHeading:      'Playfair Display',
    fontBody:         'Inter',
};
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/cms/adapters/mock/fixtures/nav.ts src/cms/adapters/mock/fixtures/theme.ts
git commit -m "feat: add mock nav and theme fixtures"
```

---

### Task 4: Fill footer fixture

**Files:**
- Modify: `src/cms/adapters/mock/fixtures/footer.ts`

- [ ] **Step 1: Fill footer fixture**

Replace `src/cms/adapters/mock/fixtures/footer.ts`:
```typescript
import type { Footer } from '@/types/page';

export const footerFixture: Footer = {
    brand: {
        src: 'https://placehold.co/120x40/8B6F47/FAFAF8?text=MEA',
        alt: 'Manuela E. Aguirre',
        href: '/',
    },
    tagline: 'Literature that moves you.',
    columns: [
        {
            title: 'Navigation',
            links: [
                { label: 'Home',    href: '/' },
                { label: 'About',   href: '/about' },
                { label: 'Works',   href: '/works' },
                { label: 'Contact', href: '/contact' },
            ],
        },
        {
            title: 'Works',
            links: [
                { label: 'Novels',  href: '/novels' },
                { label: 'Stories', href: '/stories' },
            ],
        },
    ],
    socialLinks: [
        { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
        { label: 'Twitter',   href: 'https://x.com',        icon: 'twitter'   },
    ],
    legalLinks: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Use',   href: '/terms'   },
    ],
    copyright: '© 2026 Manuela E. Aguirre. All rights reserved.',
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/cms/adapters/mock/fixtures/footer.ts
git commit -m "feat: add mock footer fixture"
```

---

### Task 5: Fill pages fixture

This is the largest fixture. It produces one `home` page with all 9 section types and a contact form.

**Note on rich text:** The `body` field on `Section` and `Item` is typed as `Document` from `@contentful/rich-text-types`. Use the `paragraph()` helper defined at the top of the file — it creates a minimal valid `Document` node.

**Files:**
- Modify: `src/cms/adapters/mock/fixtures/pages.ts`

- [ ] **Step 1: Replace pages fixture with full content**

Replace `src/cms/adapters/mock/fixtures/pages.ts`:
```typescript
import { BLOCKS } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';
import type { Page } from '@/types/page';

/** Creates a minimal valid Contentful Document with a single paragraph. */
function paragraph(text: string): Document {
    return {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
            {
                nodeType: BLOCKS.PARAGRAPH,
                data: {},
                content: [{ nodeType: 'text', value: text, marks: [], data: {} }],
            },
        ],
    };
}

export const pagesFixture: Page[] = [
    {
        slug: 'home',
        pageElements: [
            // ── 1. Hero ────────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'hero',
                title: 'Stories That Live In You',
                subtitle: 'Award-winning fiction exploring the human condition.',
                body: paragraph(
                    'From the mountains of Colombia to the streets of Buenos Aires, my novels weave together memory, identity, and the quiet revolutions of everyday life.'
                ),
                mediaUrl: 'https://placehold.co/1200x600/1A1A1A/FAFAF8?text=Hero+Image',
                ctas: [
                    { label: 'Explore My Works', href: '/works',  variant: 'primary'   },
                    { label: 'About Me',          href: '/about', variant: 'secondary' },
                ],
            },

            // ── 2. Banner ──────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'banner',
                title: 'New Novel: La Memoria del Agua',
                subtitle: 'Available now from Editorial Planeta.',
                theme: 'dark',
                ctas: [
                    { label: 'Buy Now', href: '/novels/la-memoria-del-agua', variant: 'primary' },
                ],
            },

            // ── 3. Features ────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'features',
                title: 'Why Readers Return',
                subtitle: 'Three things that define my writing.',
                items: [
                    {
                        type: 'feature',
                        icon: 'pen',
                        title: 'Lyrical Prose',
                        subtitle: 'Language as landscape',
                        body: paragraph(
                            'Each sentence is crafted to carry both meaning and music, drawing readers into worlds that feel lived-in and true.'
                        ),
                    },
                    {
                        type: 'feature',
                        icon: 'heart',
                        title: 'Human Stories',
                        subtitle: 'The personal made universal',
                        body: paragraph(
                            'My characters face ordinary struggles that illuminate something essential about what it means to be alive in this century.'
                        ),
                    },
                    {
                        type: 'feature',
                        icon: 'map',
                        title: 'Vivid Landscapes',
                        subtitle: 'Place as character',
                        body: paragraph(
                            'Latin America is not backdrop but protagonist — its light, its grief, and its stubborn beauty alive on every page.'
                        ),
                    },
                ],
            },

            // ── 4. Cards ───────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'cards',
                title: 'Recent Works',
                subtitle: 'Fiction for readers who want to feel something.',
                items: [
                    {
                        type: 'card',
                        title: 'La Memoria del Agua',
                        subtitle: '2024 · Novel',
                        body: paragraph(
                            'A woman returns to her childhood village after decades abroad and must piece together what happened the summer the river changed course.'
                        ),
                        mediaUrl: 'https://placehold.co/400x560/8B6F47/FAFAF8?text=Book+1',
                        ctas: [{ label: 'Read More', href: '/novels/la-memoria-del-agua', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        title: 'El Año de los Pájaros',
                        subtitle: '2021 · Novel',
                        body: paragraph(
                            'Three siblings reunite after their mother\'s death and discover the letters she never sent — and the life she never spoke of.'
                        ),
                        mediaUrl: 'https://placehold.co/400x560/6B6560/FAFAF8?text=Book+2',
                        ctas: [{ label: 'Read More', href: '/novels/el-año-de-los-pajaros', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        title: 'Pequeñas Revoluciones',
                        subtitle: '2019 · Short Stories',
                        body: paragraph(
                            'Seven stories about the small acts of defiance that hold ordinary lives together.'
                        ),
                        mediaUrl: 'https://placehold.co/400x560/1A1A1A/FAFAF8?text=Book+3',
                        ctas: [{ label: 'Read More', href: '/stories/pequenas-revoluciones', variant: 'ghost' }],
                    },
                ],
            },

            // ── 5. Testimonials ────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'testimonials',
                title: 'What Readers Say',
                items: [
                    {
                        type: 'testimonial',
                        title: 'Elena Vargas',
                        subtitle: '"A novel that stays with you for years."',
                        body: paragraph('— The Buenos Aires Review'),
                    },
                    {
                        type: 'testimonial',
                        title: 'Marcos Ibáñez',
                        subtitle: '"Aguirre writes with the precision of a poet and the heart of a storyteller."',
                        body: paragraph('— El País Cultural'),
                    },
                ],
            },

            // ── 6. Stats ───────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'stats',
                title: 'By the Numbers',
                items: [
                    { type: 'stat', value: '8',    title: 'Published Novels'    },
                    { type: 'stat', value: '23',   title: 'Languages'           },
                    { type: 'stat', value: '1.2M', title: 'Readers Worldwide'   },
                    { type: 'stat', value: '4',    title: 'Literary Awards'     },
                ],
            },

            // ── 7. Text ────────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'text',
                title: 'About My Writing',
                layout: 'left',
                body: paragraph(
                    'I began writing at fourteen in a notebook my grandmother gave me. She told me to write down everything I didn\'t want to forget. I\'ve been writing ever since — not to remember, but to understand. My novels are explorations: of family, of place, of the stories we tell ourselves to survive.'
                ),
                ctas: [{ label: 'Read My Full Story', href: '/about', variant: 'ghost' }],
            },

            // ── 8. Gallery ─────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'gallery',
                title: 'From the Road',
                subtitle: 'Events, readings, and the places that inspire the work.',
                items: [
                    { type: 'slide', title: 'Hay Festival, Cartagena',        mediaUrl: 'https://placehold.co/600x400/8B6F47/FAFAF8?text=Gallery+1' },
                    { type: 'slide', title: 'Book Launch, Buenos Aires',       mediaUrl: 'https://placehold.co/600x400/6B6560/FAFAF8?text=Gallery+2' },
                    { type: 'slide', title: 'Literary Festival, Barcelona',    mediaUrl: 'https://placehold.co/600x400/1A1A1A/FAFAF8?text=Gallery+3' },
                    { type: 'slide', title: 'Writing Residency, Medellín',     mediaUrl: 'https://placehold.co/600x400/E5E0D8/1A1A1A?text=Gallery+4' },
                ],
            },

            // ── 9. Carousel ────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'carousel',
                title: 'Press Highlights',
                items: [
                    {
                        type: 'slide',
                        title: 'Shortlisted for the Premio Biblioteca Breve',
                        subtitle: 'One of the most anticipated novels of the year.',
                        ctas: [{ label: 'Read Coverage', href: '/press', variant: 'ghost' }],
                    },
                    {
                        type: 'slide',
                        title: 'Featured in El País "100 Books of the Decade"',
                        subtitle: 'El Año de los Pájaros named among the decade\'s best.',
                        ctas: [{ label: 'Read Coverage', href: '/press', variant: 'ghost' }],
                    },
                    {
                        type: 'slide',
                        title: 'New York Times Book Review',
                        subtitle: '"Aguirre is the voice of a generation."',
                        ctas: [{ label: 'Read Coverage', href: '/press', variant: 'ghost' }],
                    },
                ],
            },

            // ── 10. Form ───────────────────────────────────────────────────────
            {
                kind: 'form',
                title: 'Get in Touch',
                subtitle: 'For speaking engagements, rights inquiries, or reader mail.',
                type: 'contact',
                fields: [
                    { label: 'Your Name',      name: 'name',    type: 'text',     placeholder: 'Jane Smith',              required: true  },
                    { label: 'Email Address',  name: 'email',   type: 'email',    placeholder: 'jane@example.com',        required: true  },
                    { label: 'Message',        name: 'message', type: 'textarea', placeholder: 'Write your message here...', required: true },
                ],
                submitLabel:    'Send Message',
                successMessage: 'Thank you! I\'ll be in touch soon.',
            },
        ],
    },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: 65 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/cms/adapters/mock/fixtures/pages.ts
git commit -m "feat: add mock pages fixture with all section types"
```

---

## Chunk 3: Wiring and Verification

### Task 6: Update .env.example and verify full build

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add CMS_ADAPTER to .env.example**

Open `.env.example` and add these lines before `SITE_URL`:

```env
# Set to "mock" to use local fixture data (no Contentful credentials needed)
# CMS_ADAPTER=mock
# (omit or set to any other value to use ContentfulAdapter)
```

The final file should look like:
```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token
# Set to "mock" to use local fixture data (no Contentful credentials needed)
# CMS_ADAPTER=mock
# (omit or set to any other value to use ContentfulAdapter)
SITE_URL=https://your-domain.com
```

- [ ] **Step 2: Verify the mock adapter builds successfully**

```bash
CMS_ADAPTER=mock npm run build
```

Expected: build completes with no errors. The `dist/` directory is populated.

If it fails with TypeScript errors, run `npx tsc --noEmit` to diagnose.

- [ ] **Step 3: Run tests one final time**

```bash
npm test
```

Expected: 65 tests pass.

- [ ] **Step 4: Commit**

```bash
git add .env.example
git commit -m "docs: document CMS_ADAPTER env var in .env.example"
```
