# manuelaeaguirre.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fork the `website` Astro 5 + Contentful base template into a new `manuelaeaguirre` project with template extensions (embed support, blog system, centered nav, new card layouts) and Manuela's content in mock fixtures.

**Architecture:** The project is a copy of `/Users/marthox/Dev/website`. Template extensions are made to the shared code (types, adapters, components) so they remain reusable. Manuela's content lives in mock fixtures and Contentful — not in component code. `Nav.astro` is reworked to support centered layout and dropdowns. A new `BlogFeed.astro` section component + a `getPostsForFeed()` pure utility handle the blog system.

**Tech Stack:** Astro 5, TypeScript, Contentful, SCSS, Vitest

---

## Pre-flight: one important discovery

The `navElement` Contentful content type **already has a `submenu` field** (created in migration `20260306-01-nav-element.cjs`). The TypeScript `NavMenu` type and `nav.ts` Contentful adapter already map it. Migration #19 from the spec is therefore **not needed**. This plan uses 5 migrations instead of 6, renumbered 17–21.

---

## File Map

**Created:**
- `src/utils/blog.ts` — pure `getPostsForFeed()` utility
- `src/utils/__tests__/blog.unit.test.ts` — unit tests
- `src/components/sections/BlogFeed.astro` — blog feed section
- `src/cms/adapters/contentful/migrations/20260524-17-item-embed-url.cjs`
- `src/cms/adapters/contentful/migrations/20260524-18-page-blog-fields.cjs`
- `src/cms/adapters/contentful/migrations/20260524-19-section-blog-feed-type.cjs`
- `src/cms/adapters/contentful/migrations/20260524-20-section-new-layouts.cjs`
- `src/cms/adapters/contentful/migrations/20260524-21-site-theme-nav-layout.cjs`

**Modified:**
- `src/types/page.ts` — `embedUrl` on `Item`, `publishedAt`/`excerpt` on `Page`
- `src/types/theme.ts` — `navLayout` on `SiteTheme`
- `src/cms/adapters/contentful/types.ts` — raw Contentful types for new fields
- `src/cms/adapters/contentful/pages.ts` — map `embedUrl`, `publishedAt`, `excerpt`
- `src/cms/adapters/contentful/theme.ts` — map `navLayout`, fix missing dark fields
- `src/cms/adapters/mock/fixtures/theme.ts` — parchment palette + Lora + `navLayout`
- `src/cms/adapters/mock/fixtures/nav.ts` — Música dropdown, brand
- `src/cms/adapters/mock/fixtures/footer.ts` — minimal Manuela footer
- `src/cms/adapters/mock/fixtures/pages.ts` — all 8 Manuela pages
- `src/layouts/BaseLayout.astro` — Lora font, `lang="es"`, accent strip
- `src/layouts/PageLayout.astro` — pass `navLayout` + `socialLinks` to Nav
- `src/styles/tokens.scss` — parchment defaults, update light section tokens
- `src/components/Nav.astro` — centered layout, dropdowns, light theme
- `src/components/SectionRenderer.astro` — add `blog-feed`, pass `pageSlug`, remove DH anchors
- `src/components/sections/Cards.astro` — `audiovisual` and `gallery` layout branches
- `src/pages/[pages].astro` — pass `page.slug` to `SectionRenderer`
- `package.json` — update `name`
- `.gitignore` — add `.superpowers/`

---

## Task 1: Project scaffold

**Files:**
- Create: `/Users/marthox/Dev/manuelaeaguirre/` (copy of website)

- [ ] **Step 1: Copy the base project (excluding node_modules and dist)**

```bash
rsync -a --exclude=node_modules --exclude=dist --exclude=.git \
  /Users/marthox/Dev/website/ /Users/marthox/Dev/manuelaeaguirre/
```

Expected: new directory exists with all source files.

- [ ] **Step 2: Update package.json name**

In `/Users/marthox/Dev/manuelaeaguirre/package.json`, change:
```json
{
  "name": "manuelaeaguirre"
}
```

- [ ] **Step 3: Add .superpowers/ to .gitignore**

Append to `/Users/marthox/Dev/manuelaeaguirre/.gitignore`:
```
.superpowers/
```

If `.gitignore` doesn't exist, create it with that line.

- [ ] **Step 4: Add logo placeholder**

```bash
cp /Users/marthox/Downloads/IMG_9386.jpg /Users/marthox/Dev/manuelaeaguirre/public/logo.jpg
```

If the file doesn't exist yet, create a 1×1 placeholder:
```bash
touch /Users/marthox/Dev/manuelaeaguirre/public/logo.jpg
```
(Manuela will replace this with the final optimized file.)

- [ ] **Step 5: Install dependencies**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 6: Verify dev server starts**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm run dev:mock
```

Expected: `Local: http://localhost:4323/` (or similar). Stop with Ctrl+C.

- [ ] **Step 7: Init git and first commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git init && git add -A && git commit -m "chore: scaffold manuelaeaguirre from website base"
```

---

## Task 2: TypeScript type extensions

**Files:**
- Modify: `src/types/page.ts`
- Modify: `src/types/theme.ts`

- [ ] **Step 1: Add `embedUrl` to `Item` and `publishedAt`/`excerpt` to `Page` in `src/types/page.ts`**

Replace the `Item` interface:
```typescript
export interface Item {
    type?: 'card' | 'slide' | 'product' | 'testimonial' | 'stat' | 'feature' | 'tab';
    title?: string;
    subtitle?: string;
    body?: Document;
    mediaUrl?: string;
    embedUrl?: string;
    ctas?: CTA[];
    icon?: string;
    value?: string;
}
```

Replace the `Page` interface:
```typescript
export interface Page {
    slug: string;
    pageElements: PageElement[];
    seoTitle?: string;
    seoDescription?: string;
    ogImageUrl?: string;
    publishedAt?: string;
    excerpt?: string;
}
```

- [ ] **Step 2: Add `navLayout` to `SiteTheme` in `src/types/theme.ts`**

Append to the `SiteTheme` interface (after `fontBody`):
```typescript
    navLayout?: 'default' | 'centered';
```

Full updated file:
```typescript
export interface SiteTheme {
    colorBg?:         string;
    colorSurface?:    string;
    colorBorder?:     string;
    colorText?:       string;
    colorTextMuted?:  string;
    colorAccent?:     string;
    colorDarkBg?:     string;
    colorDarkText?:   string;
    colorDarkSurface?:   string;
    colorDarkBorder?:    string;
    colorDarkTextMuted?: string;
    colorDarkAccent?:    string;
    colorAccentBg?:   string;
    colorAccentText?: string;
    fontHeading?: string;
    fontBody?:    string;
    navLayout?:   'default' | 'centered';
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npx astro check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add src/types/ && git commit -m "feat: extend Item, Page, SiteTheme types with embedUrl, blog fields, navLayout"
```

---

## Task 3: Contentful raw type extensions

**Files:**
- Modify: `src/cms/adapters/contentful/types.ts`

- [ ] **Step 1: Add `embedUrl` to `ContentfulItem`**

In `src/cms/adapters/contentful/types.ts`, update `ContentfulItem`:
```typescript
export type ContentfulItem = EntrySkeletonType<
    {
        type?: EntryFieldTypes.Text;
        title?: EntryFieldTypes.Text;
        subtitle?: EntryFieldTypes.Text;
        body?: EntryFieldTypes.RichText;
        media?: EntryFieldTypes.AssetLink;
        ctas?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulCTA>>;
        icon?: EntryFieldTypes.Text;
        value?: EntryFieldTypes.Text;
        embedUrl?: EntryFieldTypes.Text;
    },
    'item'
>;
```

- [ ] **Step 2: Add `publishedAt` and `excerpt` to `ContentfulPage`**

Update `ContentfulPage`:
```typescript
export type ContentfulPage = EntrySkeletonType<
    {
        slug: EntryFieldTypes.Text;
        pageElements?: EntryFieldTypes.Array<
            EntryFieldTypes.EntryLink<ContentfulSection | ContentfulForm>
        >;
        seoTitle?: EntryFieldTypes.Symbol;
        seoDescription?: EntryFieldTypes.Text;
        ogImage?: EntryFieldTypes.AssetLink;
        publishedAt?: EntryFieldTypes.Date;
        excerpt?: EntryFieldTypes.Text;
    },
    'page'
>;
```

- [ ] **Step 3: Add `navLayout` to `ContentfulSiteTheme`**

Append to `ContentfulSiteTheme` fields (after `fontBody`):
```typescript
        navLayout?: EntryFieldTypes.Symbol;
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npx astro check
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add src/cms/adapters/contentful/types.ts && git commit -m "feat: add embedUrl, blog fields, navLayout to Contentful raw types"
```

---

## Task 4: Contentful migrations

**Files:**
- Create: `src/cms/adapters/contentful/migrations/20260524-17-item-embed-url.cjs`
- Create: `src/cms/adapters/contentful/migrations/20260524-18-page-blog-fields.cjs`
- Create: `src/cms/adapters/contentful/migrations/20260524-19-section-blog-feed-type.cjs`
- Create: `src/cms/adapters/contentful/migrations/20260524-20-section-new-layouts.cjs`
- Create: `src/cms/adapters/contentful/migrations/20260524-21-site-theme-nav-layout.cjs`

- [ ] **Step 1: Create migration 17 — embedUrl on item**

`src/cms/adapters/contentful/migrations/20260524-17-item-embed-url.cjs`:
```javascript
/**
 * Migration: add embedUrl to item
 * Allows items to carry an iframe src for SoundCloud, YouTube, Spotify, Vimeo.
 */
module.exports = function (migration) {
  const item = migration.editContentType('item');

  item
    .createField('embedUrl')
    .name('Embed URL')
    .type('Symbol')
    .required(false);

  item.moveField('embedUrl').afterField('value');
};
```

- [ ] **Step 2: Create migration 18 — publishedAt and excerpt on page**

`src/cms/adapters/contentful/migrations/20260524-18-page-blog-fields.cjs`:
```javascript
/**
 * Migration: add publishedAt and excerpt to page
 * Enables pages to be used as blog posts in a blog-feed section.
 */
module.exports = function (migration) {
  const page = migration.editContentType('page');

  page
    .createField('publishedAt')
    .name('Published At')
    .type('Date')
    .required(false);

  page
    .createField('excerpt')
    .name('Excerpt')
    .type('Text')
    .required(false)
    .localized(true);

  page.moveField('publishedAt').afterField('ogImage');
  page.moveField('excerpt').afterField('publishedAt');
};
```

- [ ] **Step 3: Create migration 19 — blog-feed section type**

`src/cms/adapters/contentful/migrations/20260524-19-section-blog-feed-type.cjs`:
```javascript
/**
 * Migration: add blog-feed to section.type validation
 */
module.exports = function (migration) {
  const section = migration.editContentType('section');

  section.editField('type').validations([{
    in: [
      'hero', 'banner', 'carousel', 'cards', 'features',
      'testimonials', 'stats', 'text', 'gallery', 'tabs', 'blog-feed'
    ]
  }]);
};
```

- [ ] **Step 4: Create migration 20 — new layout values**

`src/cms/adapters/contentful/migrations/20260524-20-section-new-layouts.cjs`:
```javascript
/**
 * Migration: add audiovisual and gallery to section.layout validation
 */
module.exports = function (migration) {
  const section = migration.editContentType('section');

  section.editField('layout').validations([{
    in: [
      'left', 'right', 'center', 'split',
      'roles', 'comparison', 'tech',
      'audiovisual', 'gallery'
    ]
  }]);
};
```

- [ ] **Step 5: Create migration 21 — navLayout on siteTheme**

`src/cms/adapters/contentful/migrations/20260524-21-site-theme-nav-layout.cjs`:
```javascript
/**
 * Migration: add navLayout to siteTheme
 * Controls whether the header renders logo left-aligned (default) or centered.
 */
module.exports = function (migration) {
  const siteTheme = migration.editContentType('siteTheme');

  siteTheme
    .createField('navLayout')
    .name('Nav Layout')
    .type('Symbol')
    .required(false)
    .validations([{ in: ['default', 'centered'] }]);
};
```

- [ ] **Step 6: Commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add src/cms/adapters/contentful/migrations/ && git commit -m "feat: add Contentful migrations 17-21 for embedUrl, blog fields, layouts, navLayout"
```

---

## Task 5: Contentful adapter updates

**Files:**
- Modify: `src/cms/adapters/contentful/pages.ts`
- Modify: `src/cms/adapters/contentful/theme.ts`

- [ ] **Step 1: Map `embedUrl` in `mapItem()` in `pages.ts`**

Find the `mapItem` function in `src/cms/adapters/contentful/pages.ts`. It currently ends like this:
```typescript
function mapItem(entry: ItemEntry): Item {
    const f = entry.fields;
    return {
        ...
        icon: f.icon,
        value: f.value,
    };
}
```

Add `embedUrl` to the return:
```typescript
function mapItem(entry: ItemEntry): Item {
    const f = entry.fields;
    const media = f.media;
    return {
        type: f.type as Item['type'],
        title: f.title,
        subtitle: f.subtitle,
        body: f.body,
        mediaUrl: media?.fields?.file?.url,
        embedUrl: f.embedUrl,
        ctas: (f.ctas ?? []).filter(isEntry).map(mapCTA),
        icon: f.icon,
        value: f.value,
    };
}
```

- [ ] **Step 2: Map `publishedAt` and `excerpt` in the page mapper in `pages.ts`**

Find the function that maps a `ContentfulPage` entry to a `Page`. It currently returns:
```typescript
return {
    slug: f.slug,
    pageElements: ...,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
    ogImageUrl: f.ogImage?.fields?.file?.url,
};
```

Add the new fields:
```typescript
return {
    slug: f.slug,
    pageElements: ...,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
    ogImageUrl: f.ogImage?.fields?.file?.url,
    publishedAt: f.publishedAt,
    excerpt: f.excerpt,
};
```

- [ ] **Step 3: Fix `theme.ts` — add missing dark fields + navLayout**

Replace the entire `getSiteTheme` return with:
```typescript
return {
    colorBg:             f.colorBg,
    colorSurface:        f.colorSurface,
    colorBorder:         f.colorBorder,
    colorText:           f.colorText,
    colorTextMuted:      f.colorTextMuted,
    colorAccent:         f.colorAccent,
    colorDarkBg:         f.colorDarkBg,
    colorDarkText:       f.colorDarkText,
    colorDarkSurface:    f.colorDarkSurface,
    colorDarkBorder:     f.colorDarkBorder,
    colorDarkTextMuted:  f.colorDarkTextMuted,
    colorDarkAccent:     f.colorDarkAccent,
    colorAccentBg:       f.colorAccentBg,
    colorAccentText:     f.colorAccentText,
    fontHeading:         f.fontHeading,
    fontBody:            f.fontBody,
    navLayout:           f.navLayout as SiteTheme['navLayout'],
};
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npx astro check
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add src/cms/adapters/contentful/ && git commit -m "feat: map embedUrl, blog fields, navLayout in Contentful adapter"
```

---

## Task 6: Blog utility (TDD)

**Files:**
- Create: `src/utils/blog.ts`
- Create: `src/utils/__tests__/blog.unit.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/utils/__tests__/blog.unit.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { getPostsForFeed } from '../blog';
import type { Page } from '@/types/page';

function makePage(slug: string, publishedAt?: string): Page {
    return { slug, pageElements: [], publishedAt };
}

describe('getPostsForFeed', () => {
    it('returns only pages whose slug starts with parentSlug/', () => {
        const pages = [
            makePage('leeme/post-a', '2026-01-01'),
            makePage('leeme/post-b', '2026-02-01'),
            makePage('other/post-c', '2026-03-01'),
            makePage('leeme'),
        ];
        const result = getPostsForFeed(pages, 'leeme');
        expect(result.map(p => p.slug)).toEqual(['leeme/post-b', 'leeme/post-a']);
    });

    it('excludes pages without publishedAt', () => {
        const pages = [
            makePage('leeme/draft'),
            makePage('leeme/published', '2026-05-01'),
        ];
        const result = getPostsForFeed(pages, 'leeme');
        expect(result).toHaveLength(1);
        expect(result[0].slug).toBe('leeme/published');
    });

    it('sorts descending by publishedAt', () => {
        const pages = [
            makePage('blog/old', '2025-01-01'),
            makePage('blog/new', '2026-06-01'),
            makePage('blog/mid', '2025-08-15'),
        ];
        const result = getPostsForFeed(pages, 'blog');
        expect(result.map(p => p.slug)).toEqual(['blog/new', 'blog/mid', 'blog/old']);
    });

    it('returns empty array when no matching posts', () => {
        const pages = [makePage('home'), makePage('about')];
        expect(getPostsForFeed(pages, 'leeme')).toEqual([]);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm test -- blog.unit
```

Expected: FAIL — `Cannot find module '../blog'`

- [ ] **Step 3: Create `src/utils/blog.ts`**

```typescript
import type { Page } from '@/types/page';

export function getPostsForFeed(pages: Page[], parentSlug: string): Page[] {
    const prefix = `${parentSlug}/`;
    return pages
        .filter(p => p.slug.startsWith(prefix) && Boolean(p.publishedAt))
        .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm test -- blog.unit
```

Expected: PASS — 4 tests passed.

- [ ] **Step 5: Commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add src/utils/ && git commit -m "feat: add getPostsForFeed utility with unit tests"
```

---

## Task 7: Mock fixtures

**Files:**
- Modify: `src/cms/adapters/mock/fixtures/theme.ts`
- Modify: `src/cms/adapters/mock/fixtures/nav.ts`
- Modify: `src/cms/adapters/mock/fixtures/footer.ts`
- Modify: `src/cms/adapters/mock/fixtures/pages.ts`

- [ ] **Step 1: Update `theme.ts`**

Replace `src/cms/adapters/mock/fixtures/theme.ts` entirely:
```typescript
import type { SiteTheme } from '@/types/theme';

export const themeFixture: SiteTheme = {
    colorBg:            '#F5F2EE',
    colorSurface:       '#EDE9E4',
    colorBorder:        'rgba(0,0,0,0.07)',
    colorText:          '#1A1814',
    colorTextMuted:     'rgba(26,24,20,0.45)',
    colorAccent:        '#D94F38',
    colorDarkBg:        '#0E0C0A',
    colorDarkSurface:   '#1C1814',
    colorDarkBorder:    'rgba(255,255,255,0.07)',
    colorDarkText:      '#F5F2EE',
    colorDarkTextMuted: 'rgba(245,242,238,0.45)',
    colorDarkAccent:    '#D94F38',
    fontHeading:        "'Lora', Georgia, serif",
    fontBody:           "'Lora', Georgia, serif",
    navLayout:          'centered',
};
```

- [ ] **Step 2: Update `nav.ts`**

Replace `src/cms/adapters/mock/fixtures/nav.ts` entirely:
```typescript
import type { NavBrand, NavElement } from '@/types/nav';

export const navFixture: [NavBrand | null, NavElement[]] = [
    {
        src: '/logo.jpg',
        alt: 'Manuela E. Aguirre',
        label: 'Manuela E. Aguirre',
        href: '/',
    },
    [
        { label: 'Biografía', href: '/biografia' },
        {
            label: 'Música',
            submenu: [
                { label: 'Audiovisuales', href: '/musica/audiovisuales' },
                { label: 'Catálogo',      href: '/musica/catalogo'      },
            ],
        },
        { label: 'Libros',    href: '/libros'    },
        { label: 'Leeme',     href: '/leeme'     },
        { label: 'Mitilene',  href: '/mitilene'  },
        { label: 'Contacto',  href: '/contacto'  },
    ],
];
```

- [ ] **Step 3: Update `footer.ts`**

Replace `src/cms/adapters/mock/fixtures/footer.ts` entirely:
```typescript
import type { Footer } from '@/types/page';

export const footerFixture: Footer = {
    copyright: '© 2026 Manuela E. Aguirre',
    socialLinks: [
        { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' },
        { label: 'YouTube',   href: 'https://www.youtube.com/',   icon: 'youtube'   },
    ],
};
```

- [ ] **Step 4: Update `pages.ts` — home and biografía pages**

Replace `src/cms/adapters/mock/fixtures/pages.ts` entirely with the following. This is a large file — write it all at once:

```typescript
import { BLOCKS } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';
import type { Page } from '@/types/page';

function p(text: string) {
    return {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [{ nodeType: 'text', value: text, marks: [], data: {} }],
    };
}

function doc(...nodes: object[]): Document {
    return { nodeType: BLOCKS.DOCUMENT, data: {}, content: nodes } as Document;
}

export const pagesFixture: Page[] = [
    // ── Home ──────────────────────────────────────────────────────────────────
    {
        slug: 'home',
        seoTitle: 'Manuela E. Aguirre',
        seoDescription: 'Compositora, escritora y cantante colombiana.',
        pageElements: [],
    },

    // ── Biografía ─────────────────────────────────────────────────────────────
    {
        slug: 'biografia',
        seoTitle: 'Biografía — Manuela E. Aguirre',
        pageElements: [
            {
                kind: 'section',
                type: 'text',
                layout: 'left',
                theme: 'light',
                mediaUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600',
                body: doc(
                    p('Manuela E. Aguirre (1997) es compositora, escritora y cantante colombiana. Su trabajo habita los cruces entre la música contemporánea, la literatura y las artes escénicas, con un enfoque que explora la intimidad, la memoria y el ritual desde una sensibilidad narrativa y experimental. Su catálogo abarca ópera de cámara, música coral y orquestal, bandas sonoras, canciones y proyectos interdisciplinarios, estrenados en escenarios nacionales e internacionales como el Teatro Mayor Julio Mario Santo Domingo, el Teatro El Ensueño y la Feria Internacional del Libro de Monterrey, por agrupaciones como la Orquesta Sinfónica de Bogotá, la Orquesta Filarmónica de Mujeres, la Orquesta Filarmónica de Bogotá y el Coro de la Universidad de los Andes.'),
                    p('Como compositora para cine y artes vivas, ha creado música original para películas, documentales, series, teatro y cineconciertos, incluyendo Las líneas de la memoria (2026), Cuando vuelven las brisas (2025), Entre dos aguas (2024), Las líneas de la memoria (2025) y el aclamado cineconcierto del Bogotá International Film Festival en 2023 y 2024. En el ámbito literario, ha publicado cuentos de ciencia ficción en diversas antologías de la Editorial Mirabilia, destacando su participación en Las Ciclistas (2024) y su último cuento, Infinito suelo en la antología Palestina en palabras (2025).'),
                    p('Es la voz y la mente detrás del programa ¡Clásica Viva! en Javeriana Estéreo 91.9 FM, donde guía a la audiencia por los caminos menos visibles de la música clásica, todos los sábados a las 9:30 am. Paralelamente, desarrolla su proyecto como cantante y actualmente trabaja en la producción de su primer disco.'),
                ),
            },
        ],
    },

    // ── Música — Audiovisuales ────────────────────────────────────────────────
    {
        slug: 'musica/audiovisuales',
        seoTitle: 'Audiovisuales — Manuela E. Aguirre',
        pageElements: [
            {
                kind: 'section',
                type: 'cards',
                layout: 'audiovisual',
                theme: 'light',
                title: 'Audiovisuales',
                subtitle: 'Música original para cine, documentales y artes vivas',
                items: [
                    {
                        title: 'Las líneas de la memoria',
                        subtitle: '2026 · Director: Eduardo Martínez',
                        mediaUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400',
                        embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/placeholder&color=%23D94F38&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
                    },
                    {
                        title: 'Las líneas de la memoria',
                        subtitle: '2025 · Directora: Carla Low',
                        mediaUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400',
                        embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/placeholder2&color=%23D94F38&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
                    },
                    {
                        title: 'Cuando vuelven las brisas',
                        subtitle: '2025 · Directora: Carla Low',
                        mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                        embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/placeholder3&color=%23D94F38&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
                    },
                    {
                        title: 'Entre dos aguas',
                        subtitle: '2024 · Directora: Carla Low',
                        mediaUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400',
                        embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/placeholder4&color=%23D94F38&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
                    },
                ],
            },
        ],
    },

    // ── Música — Catálogo ─────────────────────────────────────────────────────
    {
        slug: 'musica/catalogo',
        seoTitle: 'Catálogo — Manuela E. Aguirre',
        pageElements: [
            {
                kind: 'section',
                type: 'cards',
                theme: 'light',
                title: 'Catálogo',
                subtitle: 'Obras de concierto, escénicas y corales',
                items: [
                    {
                        title: 'Sentimentario Doméstico',
                        subtitle: 'Ópera de cámara (2020)',
                        icon: 'Ópera de Cámara',
                        mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                        body: doc(p('Ópera en un solo acto para ensamble, cinco solistas, bailarina y coro mixto. Libreto original de la misma compositora. Duración aproximada de 35 a 40 minutos.')),
                    },
                    {
                        title: 'Solo púrpura',
                        subtitle: 'Ensamble pierrot (2019)',
                        icon: 'Música de Cámara',
                        mediaUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
                        body: doc(p('Obra experimental que explora la creación del significado y la ambivalencia que tiene la voz como instrumento, a partir de sus cualidades fonéticas y como transmisor de significado.')),
                    },
                    {
                        title: 'Four Common Chants',
                        subtitle: 'Coral (2023)',
                        icon: 'Coral',
                        mediaUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400',
                        body: doc(p('Ciclo de cuatro piezas para coro mixto con textos de Emily Dickinson, Sara Teasdale, Amy Lowell y James Joyce. Estrenadas en junio de 2023 bajo la dirección de la maestra Alejandra Yepes.')),
                    },
                    {
                        title: 'El gesto antecede la palabra',
                        subtitle: 'Coral (2025)',
                        icon: 'Coral',
                        mediaUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
                        body: doc(p('Suite basada en la música original del documental "Cuando vuelvan las brisas". Estrenada en la Feria del Libro de Monterrey (2025) por el Coro de la Universidad de los Andes.')),
                    },
                ],
            },
        ],
    },

    // ── Libros ────────────────────────────────────────────────────────────────
    {
        slug: 'libros',
        seoTitle: 'Libros — Manuela E. Aguirre',
        pageElements: [
            {
                kind: 'section',
                type: 'cards',
                layout: 'gallery',
                theme: 'light',
                title: 'Libros',
                items: [
                    {
                        title: 'Palestina en Palabras',
                        subtitle: 'Editorial Maktaba · 2025',
                        mediaUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
                    },
                    {
                        title: 'Las Ciclistas',
                        subtitle: 'Editorial Mirabilia · 2024',
                        mediaUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300',
                    },
                    {
                        title: 'El corazón inalámbrico',
                        subtitle: 'Editorial Mirabilia',
                        mediaUrl: 'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=300',
                    },
                    {
                        title: 'Lo desconocible',
                        subtitle: 'Editorial Mirabilia',
                        mediaUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300',
                    },
                    {
                        title: 'Los allás',
                        subtitle: 'Editorial Mirabilia',
                        mediaUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300',
                    },
                ],
            },
        ],
    },

    // ── Leeme (blog feed) ─────────────────────────────────────────────────────
    {
        slug: 'leeme',
        seoTitle: 'Leeme — Manuela E. Aguirre',
        pageElements: [
            {
                kind: 'section',
                type: 'blog-feed',
                theme: 'light',
                title: 'Leeme',
                subtitle: 'Notas, reflexiones y pequeñas historias.',
            },
        ],
    },

    // ── Mitilene ─────────────────────────────────────────────────────────────
    {
        slug: 'mitilene',
        seoTitle: 'Mitilene',
        pageElements: [
            {
                kind: 'section',
                type: 'banner',
                theme: 'dark',
                title: 'Mitilene',
                subtitle: 'Coming soon',
            },
        ],
    },

    // ── Contacto ─────────────────────────────────────────────────────────────
    {
        slug: 'contacto',
        seoTitle: 'Contacto — Manuela E. Aguirre',
        pageElements: [
            {
                kind: 'form',
                title: 'Contacto',
                subtitle: '¿Tienes un proyecto en mente? Escríbeme.',
                type: 'contact',
                submitLabel: 'Enviar mensaje',
                successMessage: '¡Mensaje enviado! Responderé pronto.',
                fields: [
                    { label: 'Nombre',  name: 'name',    type: 'text',  required: true,  placeholder: 'Tu nombre' },
                    { label: 'Correo',  name: 'email',   type: 'email', required: true,  placeholder: 'tu@correo.com' },
                    { label: 'Mensaje', name: 'message', type: 'textarea', required: true, placeholder: '¿En qué puedo ayudarte?' },
                ],
            },
        ],
    },
];
```

- [ ] **Step 5: Run the mock dev server to confirm no runtime errors**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm run dev:mock
```

Open `http://localhost:4323/` — should load without errors. Stop with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add src/cms/adapters/mock/fixtures/ && git commit -m "feat: add Manuela mock fixtures — theme, nav, footer, 8 pages"
```

---

## Task 8: BaseLayout, tokens, ThemeStyle

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/styles/tokens.scss`

- [ ] **Step 1: Update `BaseLayout.astro` — Lora font, `lang="es"`, accent strip**

Replace the content of `src/layouts/BaseLayout.astro`:
```astro
---
import "@styles/global.scss";
import ThemeStyle from "@components/ThemeStyle.astro";
import { cms } from "@/cms";

interface Props {
    title: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
}

const { title, description, ogTitle, ogDescription, ogImage } = Astro.props;

const theme = await cms.getSiteTheme();
---

<html lang="es">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta name="generator" content={Astro.generator} />
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={ogTitle ?? title} />
        {(ogDescription ?? description) && <meta property="og:description" content={ogDescription ?? description} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
        <ThemeStyle theme={theme} />
    </head>
    <body>
        <slot />
    </body>
</html>
```

- [ ] **Step 2: Update `tokens.scss` with parchment defaults and accent strip**

Replace the entire content of `src/styles/tokens.scss`:
```scss
// =============================================================================
// Design Tokens — Manuela E. Aguirre
// Palette: parchment warm white · coral accent · dark warm black
// =============================================================================

:root {
    // ── Base palette ──────────────────────────────────────────────────────────
    --color-bg:           #F5F2EE;
    --color-surface:      #EDE9E4;
    --color-border:       rgba(0,0,0,0.07);
    --color-text:         #1A1814;
    --color-text-muted:   rgba(26,24,20,0.45);
    --color-accent:       #D94F38;

    // ── Typography ────────────────────────────────────────────────────────────
    --font-heading: 'Lora', Georgia, serif;
    --font-body:    'Lora', Georgia, serif;
    --font-size-base: 16px;

    // ── Layout ────────────────────────────────────────────────────────────────
    --container-width:   1200px;
    --section-padding-y: 5rem;
    --section-padding-x: 1.5rem;

    // ── Radius ────────────────────────────────────────────────────────────────
    --radius-sm:   0.25rem;
    --radius-md:   0.5rem;
    --radius-lg:   0.75rem;
    --radius-xl:   1rem;
    --radius-pill: 50px;
}

// =============================================================================
// Section theme tokens
// =============================================================================

// ── Light sections (default) ─────────────────────────────────────────────────
:root,
[data-theme="light"] {
    --section-bg:           #F5F2EE;
    --section-surface:      #EDE9E4;
    --section-border:       rgba(0,0,0,0.07);
    --section-text:         #1A1814;
    --section-text-muted:   rgba(26,24,20,0.45);

    --btn-primary-bg:       #D94F38;
    --btn-primary-text:     #ffffff;
    --btn-secondary-border: rgba(26,24,20,0.3);
    --btn-secondary-text:   #1A1814;
    --btn-ghost-text:       #D94F38;
}

// ── Dark sections ─────────────────────────────────────────────────────────────
[data-theme="dark"] {
    --section-bg:           #0E0C0A;
    --section-surface:      #1C1814;
    --section-border:       rgba(255,255,255,0.07);
    --section-text:         #F5F2EE;
    --section-text-muted:   rgba(245,242,238,0.45);

    --btn-primary-bg:       #D94F38;
    --btn-primary-text:     #ffffff;
    --btn-secondary-border: rgba(245,242,238,0.3);
    --btn-secondary-text:   #F5F2EE;
    --btn-ghost-text:       #D94F38;
}

// ── Accent strip (left edge) ──────────────────────────────────────────────────
body::before {
    content: '';
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 5px;
    background: linear-gradient(to bottom, #D94F38, #C04040);
    z-index: 9999;
    pointer-events: none;
}

// ── Mobile ────────────────────────────────────────────────────────────────────
@media (max-width: 767px) {
    :root {
        --section-padding-y: 3rem;
        --section-padding-x: 1.25rem;
    }
}

html { scroll-behavior: smooth; }
```

- [ ] **Step 3: Verify dev server renders with new theme**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm run dev:mock
```

Open `http://localhost:4323/` — background should be warm parchment (`#F5F2EE`), accent strip visible on left. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add src/layouts/BaseLayout.astro src/styles/tokens.scss && git commit -m "feat: apply parchment theme, Lora font, coral accent strip"
```

---

## Task 9: Nav component

**Files:**
- Modify: `src/components/Nav.astro`
- Modify: `src/layouts/PageLayout.astro`

- [ ] **Step 1: Update `PageLayout.astro` to fetch theme and pass `navLayout` + `socialLinks` to Nav**

Replace the entire `src/layouts/PageLayout.astro`:
```astro
---
import BaseLayout from "@layouts/BaseLayout.astro";
import Nav from "@components/Nav.astro";
import Footer from "@components/Footer.astro";
import { cms } from "@/cms";

interface Props {
    title: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
}

const { title, description, ogTitle, ogDescription, ogImage } = Astro.props;

const [navBrand, navElements] = await cms.getNavigation();
const footer = await cms.getFooter();
const theme  = await cms.getSiteTheme();
---

<BaseLayout title={title} description={description} ogTitle={ogTitle} ogDescription={ogDescription} ogImage={ogImage}>
    <Nav
        brand={navBrand}
        elements={navElements}
        navLayout={theme?.navLayout ?? 'default'}
        socialLinks={footer?.socialLinks ?? []}
    />
    <slot />
    <Footer footer={footer} />
</BaseLayout>
```

- [ ] **Step 2: Rewrite `Nav.astro`**

Replace the entire content of `src/components/Nav.astro` with the following:
```astro
---
import type { NavBrand, NavElement, NavLink, NavMenu, CTA } from '@/types/nav';
import type { CTA as CTAType } from '@/types/page';

interface Props {
    brand: NavBrand | null;
    elements: NavElement[];
    navLayout?: 'default' | 'centered';
    socialLinks?: CTAType[];
}

const { brand, elements, navLayout = 'default', socialLinks = [] } = Astro.props;

function isNavMenu(el: NavElement): el is NavMenu {
    return 'submenu' in el;
}
function isNavLink(el: NavElement): el is NavLink {
    return 'href' in el && !('src' in el);
}

const isCentered = navLayout === 'centered';

// For centered layout: split elements at the midpoint so brand sits in the middle.
const mid = Math.ceil(elements.length / 2);
const leftElements  = isCentered ? elements.slice(0, mid) : elements;
const rightElements = isCentered ? elements.slice(mid)    : [];
---

<nav class="site-nav" class:list={[isCentered && 'site-nav--centered']}>
    <div class="site-nav__inner">

        {isCentered ? (
            <>
                <!-- Left links -->
                <ul class="site-nav__links" role="list">
                    {leftElements.map(el => (
                        <li class:list={[isNavMenu(el) && 'has-submenu']}>
                            {isNavMenu(el) ? (
                                <div class="nav-dropdown">
                                    <span class="site-nav__link nav-dropdown__trigger">{el.label} <span class="nav-dropdown__arrow" aria-hidden="true">▾</span></span>
                                    <ul class="nav-dropdown__menu" role="list">
                                        {el.submenu.map(sub => (
                                            <li>
                                                {isNavLink(sub) && <a href={sub.href} class="nav-dropdown__item">{sub.label}</a>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : isNavLink(el) ? (
                                <a href={el.href} class="site-nav__link">{el.label}</a>
                            ) : null}
                        </li>
                    ))}
                </ul>

                <!-- Brand (center) -->
                <a class="site-nav__brand" href={brand?.href ?? '/'}>
                    {brand?.src
                        ? <img src={brand.src} alt={brand?.alt ?? ''} class="site-nav__brand-logo" />
                        : <span class="site-nav__brand-text">{brand?.label ?? ''}</span>
                    }
                </a>

                <!-- Right links + social icons -->
                <ul class="site-nav__links" role="list">
                    {rightElements.map(el => (
                        <li class:list={[isNavMenu(el) && 'has-submenu']}>
                            {isNavMenu(el) ? (
                                <div class="nav-dropdown">
                                    <span class="site-nav__link nav-dropdown__trigger">{el.label} <span class="nav-dropdown__arrow" aria-hidden="true">▾</span></span>
                                    <ul class="nav-dropdown__menu" role="list">
                                        {el.submenu.map(sub => (
                                            <li>
                                                {isNavLink(sub) && <a href={sub.href} class="nav-dropdown__item">{sub.label}</a>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : isNavLink(el) ? (
                                <a href={el.href} class="site-nav__link">{el.label}</a>
                            ) : null}
                        </li>
                    ))}
                </ul>
            </>
        ) : (
            <>
                <a class="site-nav__brand" href={brand?.href ?? '/'}>
                    {brand?.src
                        ? <img src={brand.src} alt={brand?.alt ?? ''} class="site-nav__brand-logo" />
                        : <span class="site-nav__brand-text">{brand?.label ?? ''}</span>
                    }
                </a>
                <ul class="site-nav__links" role="list">
                    {elements.filter(isNavLink).map(el => (
                        <li><a href={(el as NavLink).href} class="site-nav__link">{el.label}</a></li>
                    ))}
                </ul>
            </>
        )}

        <!-- Hamburger (mobile only) -->
        <button
            class="site-nav__hamburger"
            id="mobile-menu-toggle"
            aria-label="Abrir menú"
            aria-expanded="false"
            type="button"
        >
            <span class="site-nav__hamburger-bar"></span>
            <span class="site-nav__hamburger-bar"></span>
            <span class="site-nav__hamburger-bar"></span>
        </button>
    </div>
</nav>

<!-- Fixed social icons (right side of viewport) -->
{socialLinks.length > 0 && (
    <div class="social-float" aria-label="Redes sociales">
        {socialLinks.map(link => (
            <a href={link.href} class="social-float__link" target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                {link.icon === 'instagram' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <circle cx="12" cy="12" r="4"/>
                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                    </svg>
                )}
                {link.icon === 'youtube' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                    </svg>
                )}
            </a>
        ))}
    </div>
)}

<!-- Mobile overlay -->
<div class="site-nav__overlay" id="mobile-menu" aria-hidden="true" role="dialog" aria-label="Menú de navegación">
    <div class="site-nav__overlay-header">
        <a class="site-nav__overlay-brand" href={brand?.href ?? '/'}>
            {brand?.src
                ? <img src={brand.src} alt={brand?.alt ?? ''} class="site-nav__brand-logo" style="height:40px;" />
                : <span>{brand?.label ?? ''}</span>
            }
        </a>
        <button class="site-nav__overlay-close" id="mobile-menu-close" aria-label="Cerrar menú" type="button">
            <span></span>
            <span></span>
        </button>
    </div>
    <nav class="site-nav__overlay-nav" aria-label="Navegación móvil">
        <ul class="site-nav__overlay-links" role="list">
            {[...leftElements, ...rightElements].map(el => (
                isNavMenu(el) ? (
                    el.submenu.map(sub => isNavLink(sub) && (
                        <li>
                            <a href={sub.href} class="site-nav__overlay-link site-nav__overlay-link--sub">{sub.label}</a>
                        </li>
                    ))
                ) : isNavLink(el) ? (
                    <li>
                        <a href={(el as NavLink).href} class="site-nav__overlay-link">{el.label}</a>
                    </li>
                ) : null
            ))}
        </ul>
    </nav>
</div>

<script>
    const nav = document.querySelector('.site-nav') as HTMLElement | null;
    function updateNavHeight() {
        if (nav) document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
    }
    updateNavHeight();
    new ResizeObserver(updateNavHeight).observe(document.documentElement);

    const hamburger = document.getElementById('mobile-menu-toggle');
    const closeBtn  = document.getElementById('mobile-menu-close');
    const overlay   = document.getElementById('mobile-menu');

    function setMenuOpen(open: boolean) {
        hamburger?.setAttribute('aria-expanded', String(open));
        overlay?.setAttribute('aria-hidden', String(!open));
        overlay?.classList.toggle('is-open', open);
        hamburger?.classList.toggle('is-active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger?.addEventListener('click', () => setMenuOpen(true));
    closeBtn?.addEventListener('click',  () => setMenuOpen(false));
    overlay?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
</script>

<style>
    .site-nav {
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: rgba(245, 242, 238, 0.97);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    }

    .site-nav__inner {
        max-width: var(--container-width, 1200px);
        margin: 0 auto;
        padding: 0.75rem var(--section-padding-x, 1.5rem);
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    /* Centered layout: three equal columns */
    .site-nav--centered .site-nav__inner {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
    }
    .site-nav--centered .site-nav__links:first-child { justify-content: flex-end; }
    .site-nav--centered .site-nav__links:last-child  { justify-content: flex-start; }

    .site-nav__brand {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        flex-shrink: 0;
    }
    .site-nav--centered .site-nav__brand { justify-self: center; }

    .site-nav__brand-logo {
        height: 56px;
        width: auto;
        max-width: 220px;
        object-fit: contain;
        display: block;
    }

    .site-nav__brand-text {
        font-family: var(--font-heading);
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--color-text);
    }

    .site-nav__links {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .site-nav__link {
        color: var(--color-text);
        text-decoration: none;
        font-size: 0.9375rem;
        font-family: var(--font-body);
        transition: color 0.15s;
        cursor: pointer;
    }
    .site-nav__link:hover { color: var(--color-accent); }

    /* Dropdown */
    .has-submenu { position: relative; }

    .nav-dropdown { position: relative; }

    .nav-dropdown__trigger {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        user-select: none;
    }

    .nav-dropdown__arrow { font-size: 0.65em; opacity: 0.6; }

    .nav-dropdown__menu {
        display: none;
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 50%;
        transform: translateX(-50%);
        background: #F5F2EE;
        border: 1px solid rgba(0,0,0,0.08);
        border-radius: var(--radius-md, 0.5rem);
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        list-style: none;
        margin: 0;
        padding: 0.375rem 0;
        min-width: 160px;
        z-index: 200;
        white-space: nowrap;
    }

    .has-submenu:hover .nav-dropdown__menu,
    .has-submenu:focus-within .nav-dropdown__menu { display: block; }

    .nav-dropdown__item {
        display: block;
        padding: 0.5rem 1.25rem;
        color: var(--color-text);
        text-decoration: none;
        font-size: 0.875rem;
        font-family: var(--font-body);
        transition: background 0.1s, color 0.1s;
    }
    .nav-dropdown__item:hover {
        background: rgba(0,0,0,0.04);
        color: var(--color-accent);
    }

    /* Social float */
    .social-float {
        position: fixed;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 50;
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
    }

    .social-float__link {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--color-accent);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        transition: opacity 0.15s, transform 0.15s;
    }
    .social-float__link:hover { opacity: 0.85; transform: scale(1.08); }

    /* Hamburger */
    .site-nav__hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        width: 2rem;
        height: 2rem;
        margin-left: auto;
    }
    .site-nav__hamburger-bar {
        display: block;
        width: 22px;
        height: 2px;
        background: var(--color-text);
        border-radius: 2px;
        transition: transform 0.2s, opacity 0.2s;
        transform-origin: center;
    }
    .site-nav__hamburger.is-active .site-nav__hamburger-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .site-nav__hamburger.is-active .site-nav__hamburger-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .site-nav__hamburger.is-active .site-nav__hamburger-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* Mobile overlay */
    .site-nav__overlay {
        position: fixed;
        inset: 0;
        z-index: 200;
        background: #F5F2EE;
        display: flex;
        flex-direction: column;
        padding: 0 var(--section-padding-x, 1.5rem);
        transform: translateY(-100%);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease;
    }
    .site-nav__overlay.is-open { transform: translateY(0); opacity: 1; pointer-events: auto; }

    .site-nav__overlay-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.875rem 0;
        border-bottom: 1px solid rgba(0,0,0,0.07);
        flex-shrink: 0;
    }

    .site-nav__overlay-brand {
        color: var(--color-text);
        text-decoration: none;
        display: inline-flex;
        align-items: center;
    }

    .site-nav__overlay-close {
        background: none;
        border: none;
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        position: relative;
        padding: 0;
    }
    .site-nav__overlay-close span {
        display: block;
        position: absolute;
        width: 22px;
        height: 2px;
        background: var(--color-text);
        border-radius: 2px;
        top: 50%;
        left: 50%;
        translate: -50% -50%;
    }
    .site-nav__overlay-close span:first-child { rotate: 45deg; }
    .site-nav__overlay-close span:last-child  { rotate: -45deg; }

    .site-nav__overlay-nav { flex: 1; display: flex; align-items: center; }

    .site-nav__overlay-links {
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .site-nav__overlay-link {
        display: block;
        padding: 1.125rem 0;
        color: var(--color-text);
        text-decoration: none;
        font-size: clamp(1.25rem, 6vw, 2rem);
        font-family: var(--font-heading);
        border-bottom: 1px solid rgba(0,0,0,0.07);
        transition: color 0.15s;
        line-height: 1.2;
    }
    .site-nav__overlay-link--sub {
        font-size: clamp(1rem, 4vw, 1.4rem);
        padding-left: 1rem;
        color: var(--color-text-muted);
    }
    .site-nav__overlay-link:hover { color: var(--color-accent); }

    @media (max-width: 767px) {
        .site-nav__links    { display: none; }
        .site-nav__hamburger { display: flex; }
        .social-float { display: none; }
        .site-nav--centered .site-nav__inner {
            display: flex;
            justify-content: space-between;
        }
    }

    @media (min-width: 768px) {
        .site-nav__overlay { display: none; }
    }
</style>
```

- [ ] **Step 3: Verify nav renders correctly**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm run dev:mock
```

Open `http://localhost:4323/`. Verify:
- Logo centered
- "Biografía · Música · Libros" on left, "Leeme · Mitilene · Contacto" on right
- Hovering "Música" shows dropdown with "Audiovisuales" and "Catálogo"
- Instagram and YouTube circular icons floating on right edge

- [ ] **Step 4: Commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add src/components/Nav.astro src/layouts/PageLayout.astro && git commit -m "feat: centered nav with dropdown support, social float icons, parchment theme"
```

---

## Task 10: Cards — audiovisual and gallery layouts

**Files:**
- Modify: `src/components/sections/Cards.astro`

- [ ] **Step 1: Add `audiovisual` layout branch to `Cards.astro`**

After the existing `section.layout === 'tech'` block and before the default grid block, add the following inside the `<section>` element in `Cards.astro`:

```astro
{
    section.layout === 'audiovisual' &&
        section.items &&
        section.items.length > 0 && (
            <div class="audiovisual-list">
                {section.items.map((item) => (
                    <div class="av-card">
                        {item.mediaUrl && (
                            <div class="av-card__poster">
                                <img src={item.mediaUrl} alt={item.title ?? ''} class="av-card__poster-img" />
                            </div>
                        )}
                        <div class="av-card__content">
                            {item.title && <h3 class="av-card__title">{item.title}</h3>}
                            {item.subtitle && <p class="av-card__subtitle">{item.subtitle}</p>}
                            {item.embedUrl && (
                                <div class="av-card__embed">
                                    <iframe
                                        width="100%"
                                        height="166"
                                        scrolling="no"
                                        frameborder="no"
                                        allow="autoplay"
                                        src={item.embedUrl}
                                        title={item.title ?? 'Audio player'}
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )
}
```

Also update the default grid condition to exclude `audiovisual`:
```astro
{
    section.layout !== 'roles' &&
        section.layout !== 'tech' &&
        section.layout !== 'audiovisual' &&
        section.layout !== 'gallery' &&
        ...
```

- [ ] **Step 2: Add `gallery` layout branch**

After the `audiovisual` block, add:
```astro
{
    section.layout === 'gallery' &&
        section.items &&
        section.items.length > 0 && (
            <div class="book-gallery">
                {section.items.map((item) => (
                    <div class="book-card">
                        {item.mediaUrl && (
                            <div class="book-card__cover">
                                <img
                                    src={item.mediaUrl}
                                    alt={item.title ?? ''}
                                    class="book-card__img"
                                />
                            </div>
                        )}
                        <div class="book-card__meta">
                            {item.title && <h3 class="book-card__title">{item.title}</h3>}
                            {item.subtitle && <p class="book-card__publisher">{item.subtitle}</p>}
                            {item.ctas && item.ctas.length > 0 && (
                                <a href={item.ctas[0].href} class="book-card__link" target="_blank" rel="noopener noreferrer">
                                    {item.ctas[0].label}
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )
}
```

- [ ] **Step 3: Add SCSS for both new layouts**

Append to the `<style lang="scss">` block in `Cards.astro`:
```scss
    // ── Audiovisual layout ────────────────────────────────────────────────────
    .audiovisual-list {
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }

    .av-card {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 2rem;
        align-items: start;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }

    .av-card__poster {
        border-radius: var(--radius-lg);
        overflow: hidden;
        aspect-ratio: 2 / 3;
    }

    .av-card__poster-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .av-card__content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding-top: 0.5rem;
    }

    .av-card__title {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
        color: var(--section-text);
    }

    .av-card__subtitle {
        font-size: 0.9rem;
        color: var(--section-text-muted);
        margin: 0;
    }

    .av-card__embed {
        margin-top: 0.5rem;
        border-radius: var(--radius-md);
        overflow: hidden;
    }

    .av-card__embed iframe {
        display: block;
        border-radius: var(--radius-md);
    }

    // ── Gallery (books) layout ────────────────────────────────────────────────
    .book-gallery {
        display: flex;
        gap: 2rem;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        padding-bottom: 0.5rem;

        &::-webkit-scrollbar { display: none; }
    }

    .book-card {
        flex: 0 0 160px;
        scroll-snap-align: start;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
    }

    .book-card__cover {
        aspect-ratio: 2 / 3;
        border-radius: var(--radius-md);
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        }
    }

    .book-card__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .book-card__meta {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .book-card__title {
        font-size: 0.875rem;
        font-weight: 600;
        margin: 0;
        color: var(--section-text);
        line-height: 1.3;
    }

    .book-card__publisher {
        font-size: 0.75rem;
        color: var(--section-text-muted);
        margin: 0;
    }

    .book-card__link {
        font-size: 0.75rem;
        color: var(--color-accent);
        text-decoration: none;
        font-weight: 600;

        &:hover { text-decoration: underline; }
    }
```

- [ ] **Step 4: Verify in dev server**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm run dev:mock
```

Navigate to `http://localhost:4323/musica/audiovisuales` — should show film poster + embed pairs.
Navigate to `http://localhost:4323/libros` — should show horizontal book gallery.

- [ ] **Step 5: Commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add src/components/sections/Cards.astro && git commit -m "feat: add audiovisual and gallery layout branches to Cards section"
```

---

## Task 11: BlogFeed section component

**Files:**
- Create: `src/components/sections/BlogFeed.astro`

- [ ] **Step 1: Create `BlogFeed.astro`**

Create `src/components/sections/BlogFeed.astro`:
```astro
---
import type { Section, Page } from '@/types/page';
import { getPostsForFeed } from '@/utils/blog';
import { cms } from '@/cms';

interface Props {
    section: Section;
    pageSlug: string;
}

const { section, pageSlug } = Astro.props;

const allPages = await cms.getPages();
const posts = getPostsForFeed(allPages, pageSlug);

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
---

<section class="blog-feed" data-theme={section.theme}>
    <div class="blog-feed__inner">
        {(section.title || section.subtitle) && (
            <div class="blog-feed__header">
                {section.title && <h1 class="blog-feed__title">{section.title}</h1>}
                {section.subtitle && <p class="blog-feed__subtitle">{section.subtitle}</p>}
            </div>
        )}

        {posts.length === 0 ? (
            <p class="blog-feed__empty">Próximamente.</p>
        ) : (
            <ul class="blog-feed__list" role="list">
                {posts.map(post => (
                    <li class="blog-post-card">
                        <a href={`/${post.slug}`} class="blog-post-card__link">
                            <div class="blog-post-card__meta">
                                {post.publishedAt && (
                                    <time datetime={post.publishedAt} class="blog-post-card__date">
                                        {formatDate(post.publishedAt)}
                                    </time>
                                )}
                            </div>
                            <h2 class="blog-post-card__title">{post.seoTitle ?? post.slug}</h2>
                            {post.excerpt && <p class="blog-post-card__excerpt">{post.excerpt}</p>}
                            <span class="blog-post-card__read">Leer →</span>
                        </a>
                    </li>
                ))}
            </ul>
        )}
    </div>
</section>

<style>
    .blog-feed {
        padding: var(--section-padding-y, 4rem) var(--section-padding-x, 1.5rem);
        background-color: var(--section-bg);
        color: var(--section-text);
    }

    .blog-feed__inner {
        max-width: var(--container-width, 1200px);
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }

    .blog-feed__header {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .blog-feed__title {
        font-size: clamp(2rem, 5vw, 3rem);
        font-weight: 600;
        margin: 0;
    }

    .blog-feed__subtitle {
        color: var(--section-text-muted);
        font-style: italic;
        margin: 0;
    }

    .blog-feed__empty {
        color: var(--section-text-muted);
        font-style: italic;
    }

    .blog-feed__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .blog-post-card {
        border-top: 1px solid var(--section-border);
    }

    .blog-post-card:last-child {
        border-bottom: 1px solid var(--section-border);
    }

    .blog-post-card__link {
        display: block;
        padding: 1.75rem 0;
        text-decoration: none;
        color: inherit;
        transition: opacity 0.15s;
    }

    .blog-post-card__link:hover { opacity: 0.75; }
    .blog-post-card__link:hover .blog-post-card__read { color: var(--color-accent); }

    .blog-post-card__meta {
        margin-bottom: 0.375rem;
    }

    .blog-post-card__date {
        font-size: 0.8125rem;
        color: var(--section-text-muted);
        letter-spacing: 0.04em;
    }

    .blog-post-card__title {
        font-size: clamp(1.125rem, 2.5vw, 1.375rem);
        font-weight: 600;
        margin: 0 0 0.5rem;
        line-height: 1.3;
    }

    .blog-post-card__excerpt {
        font-size: 0.9375rem;
        color: var(--section-text-muted);
        margin: 0 0 0.75rem;
        line-height: 1.6;
        max-width: 65ch;
    }

    .blog-post-card__read {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--section-text-muted);
        transition: color 0.15s;
    }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add src/components/sections/BlogFeed.astro src/utils/blog.ts && git commit -m "feat: add BlogFeed section component"
```

---

## Task 12: SectionRenderer + routing

**Files:**
- Modify: `src/components/SectionRenderer.astro`
- Modify: `src/pages/[pages].astro`

- [ ] **Step 1: Update `SectionRenderer.astro` — add `blog-feed`, pass `pageSlug`, remove DH anchor IDs**

Replace the entire content of `src/components/SectionRenderer.astro`:
```astro
---
import type { PageElement } from '@/types/page';

import Hero from '@components/sections/Hero.astro';
import Banner from '@components/sections/Banner.astro';
import Cards from '@components/sections/Cards.astro';
import Features from '@components/sections/Features.astro';
import Testimonials from '@components/sections/Testimonials.astro';
import Stats from '@components/sections/Stats.astro';
import TextSection from '@components/sections/TextSection.astro';
import Carousel from '@components/sections/Carousel.astro';
import Gallery from '@components/sections/Gallery.astro';
import Form from '@components/sections/Form.astro';
import Tabs from '@components/sections/Tabs.astro';
import BlogFeed from '@components/sections/BlogFeed.astro';

interface Props {
    element: PageElement;
    pageSlug?: string;
}

const { element, pageSlug = '' } = Astro.props;

const sectionMap: Record<string, any> = {
    hero:         Hero,
    banner:       Banner,
    cards:        Cards,
    features:     Features,
    testimonials: Testimonials,
    stats:        Stats,
    text:         TextSection,
    carousel:     Carousel,
    gallery:      Gallery,
    tabs:         Tabs,
    'blog-feed':  BlogFeed,
};

const isBlogFeed = element.kind === 'section' && element.type === 'blog-feed';

const Component = element.kind === 'form'
    ? Form
    : (sectionMap[element.type] ?? null);

const props = element.kind === 'form'
    ? { form: element }
    : isBlogFeed
        ? { section: element, pageSlug }
        : { section: element };
---

{Component && <Component {...props} />}
```

- [ ] **Step 2: Update `[pages].astro` to pass `page.slug` to `SectionRenderer`**

Replace the entire content of `src/pages/[pages].astro`:
```astro
---
import PageLayout from '@layouts/PageLayout.astro';
import SectionRenderer from '@components/SectionRenderer.astro';
import { cms } from '@/cms';
import type { Page } from '@/types/page';

export async function getStaticPaths() {
    const pages = await cms.getPages();
    return pages
        .filter(page => page.slug !== 'home')
        .map(page => ({
            params: { pages: page.slug },
            props: { page },
        }));
}

type Props = { page: Page };

const { page } = Astro.props;
---

<PageLayout
    title={page.seoTitle ?? page.slug}
    description={page.seoDescription}
    ogTitle={page.seoTitle}
    ogDescription={page.seoDescription}
    ogImage={page.ogImageUrl}
>
    {page.pageElements.map(element => (
        <SectionRenderer element={element} pageSlug={page.slug} />
    ))}
</PageLayout>
```

- [ ] **Step 3: Verify all pages render**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm run dev:mock
```

Check each route:
- `http://localhost:4323/` — home (blank parchment)
- `http://localhost:4323/biografia` — text section, left layout
- `http://localhost:4323/musica/audiovisuales` — audiovisual cards
- `http://localhost:4323/musica/catalogo` — 3-col grid
- `http://localhost:4323/libros` — book gallery
- `http://localhost:4323/leeme` — blog feed (empty, "Próximamente.")
- `http://localhost:4323/mitilene` — dark banner, "Coming soon"
- `http://localhost:4323/contacto` — contact form

All routes should load without JS console errors.

- [ ] **Step 4: Run all tests**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm test
```

Expected: all existing tests + new `blog.unit` tests pass.

- [ ] **Step 5: Commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add src/components/SectionRenderer.astro src/pages/[pages].astro && git commit -m "feat: register blog-feed in SectionRenderer, pass pageSlug for blog feed filtering"
```

---

## Task 13: Final build check

- [ ] **Step 1: Production build**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm run build
```

Expected: build succeeds with no errors. You may see warnings about unused CSS — these are safe to ignore.

- [ ] **Step 2: Preview the build**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && npm run preview
```

Open `http://localhost:4321/` and verify all pages render correctly in production mode.

- [ ] **Step 3: Final commit**

```bash
cd /Users/marthox/Dev/manuelaeaguirre && git add -A && git commit -m "chore: verify production build"
```

---

## Post-launch checklist (not in scope for this plan)

- Replace placeholder `public/logo.jpg` with Manuela's final optimized image
- Set up new Contentful space and run migrations 17–21
- Populate Contentful with Manuela's actual content (bio photo, SoundCloud URLs, book covers)
- Configure Netlify deployment and domain
- Set up form submission handler (Netlify Forms or Formspree) for the Contacto page
