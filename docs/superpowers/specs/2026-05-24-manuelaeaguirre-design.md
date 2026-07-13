# manuelaeaguirre.com — Design Spec

## Overview

A personal website for Manuela E. Aguirre (1997), Colombian composer, writer, and singer-songwriter. The site serves as both a public fan-facing destination and a professional press kit. It is forked from the `website` base template (Astro 5 + Contentful) and extends it with reusable additions.

**URL:** manuelaeaguirre.com  
**Language:** Spanish  
**CMS:** Contentful (Manuela manages content herself)  
**Base:** `/Users/marthox/Dev/website` → new project `/Users/marthox/Dev/manuelaeaguirre`

---

## Design Principles

- **Minimal CMS models:** Zero new content type models. All additions are new fields on existing models or new enum values on existing fields.
- **Template-first:** Every extension (embedUrl, blog-feed, nav dropdowns, gallery layout) is generic and reusable for future sites built from this base.
- **Content-forward:** The visual design is restrained so Manuela's work takes center stage.

---

## Visual Design

### Color Palette

**Light theme (main site):**

| Token | Value |
|---|---|
| `colorBg` | `#F5F2EE` |
| `colorSurface` | `#EDE9E4` |
| `colorBorder` | `rgba(0,0,0,0.07)` |
| `colorText` | `#1A1814` |
| `colorTextMuted` | `rgba(26,24,20,0.45)` |
| `colorAccent` | `#D94F38` |

**Dark theme (Mitilene alter-ego sections):**

| Token | Value |
|---|---|
| `colorDarkBg` | `#0E0C0A` |
| `colorDarkSurface` | `#1C1814` |
| `colorDarkBorder` | `rgba(255,255,255,0.07)` |
| `colorDarkText` | `#F5F2EE` |
| `colorDarkTextMuted` | `rgba(245,242,238,0.45)` |
| `colorDarkAccent` | `#D94F38` |

### Typography

| Token | Value |
|---|---|
| `fontBody` | `'Lora', Georgia, serif` |
| `fontHeading` | `'Lora', Georgia, serif` |

The logo is a **custom hand-drawn image asset** (not a web font). It is placed in `public/logo.png` (or `.svg`) and used via `NavBrand.src`. No display font is needed.

### Accent Strip

A coral/red vertical gradient strip (`#D94F38` → `#C04040`) runs along the left edge of the viewport. Implemented as a fixed `::before` pseudo-element on `<body>` or as part of `BaseLayout.astro`. Width: `5–6px`.

---

## Navigation

**Layout:** `centered` variant — logo is centered in the header, nav links split symmetrically left/right.

```
Biografía   Música ▾   Libros       [LOGO]       Leeme   Mitilene   Contacto   [IG] [YT]
```

- **Música** has a dropdown with two children: `Audiovisuales` and `Catálogo`
- Social icons (Instagram, YouTube) float to the right as `NavElement` entries with `icon` set
- The `centered` layout is a new variant on `Header.astro` (code only, no CMS field needed)
- Dropdowns are driven by the new `NavElement.children` field

---

## Pages

| Route | Slug in CMS | Section types used |
|---|---|---|
| `/` | `home` | Empty page — just the nav/footer shell |
| `/biografia` | `biografia` | `text` with `layout: 'left'` (photo + bio) |
| `/musica/audiovisuales` | `musica/audiovisuales` | `cards` with `layout: 'audiovisual'` |
| `/musica/catalogo` | `musica/catalogo` | `cards` (default 3-col grid) |
| `/libros` | `libros` | `cards` with `layout: 'gallery'` |
| `/leeme` | `leeme` | `blog-feed` section |
| `/leeme/[slug]` | `leeme/[slug]` | Any section types (regular Page entries) |
| `/mitilene` | `mitilene` | Coming soon — `text` or `banner` with `theme: 'dark'` |
| `/contacto` | `contacto` | `form` section |

All routes are handled by the existing `src/pages/[pages].astro` dynamic route. No new page files are needed.

### Home

Intentionally minimal. The parchment background, centered logo, and nav create the first impression. No content sections on this page in the initial launch.

### Biografía

Single `text` section, `layout: 'left'`:
- `mediaUrl`: Manuela's portrait photo
- `body`: Full biography (rich text)

### Música — Audiovisuales

Single `cards` section, `layout: 'audiovisual'` (new layout):
- Each `Item` represents one audiovisual work
- `Item.mediaUrl`: film/documentary poster image
- `Item.title`: work title (e.g. "Las líneas de la memoria")
- `Item.subtitle`: year + director (e.g. "2026 · Director: Eduardo Martínez")
- `Item.embedUrl`: SoundCloud embed URL (new field)

The `audiovisual` layout renders each card as a two-column pair: poster on the left, embedded SoundCloud player on the right.

### Música — Catálogo

Single `cards` section, default 3-column grid layout:
- Each `Item` represents one musical composition
- `Item.mediaUrl`: performance photo or work image
- `Item.title`: work title
- `Item.icon`: category tag (e.g. "Coral", "Ópera de Cámara", "Banda Sonora")
- `Item.body`: work description (rich text)

### Libros

Single `cards` section, `layout: 'gallery'` (new layout):
- Each `Item` represents one book/anthology
- `Item.mediaUrl`: book cover image
- `Item.title`: book title
- `Item.subtitle`: publisher name
- `Item.ctas`: optional buy/info link

The `gallery` layout renders items in a horizontal row with portrait-ratio images (book covers), title and publisher below each.

### Leeme (Blog)

Single `blog-feed` section (new Section type):
- `Section.title`: e.g. "Leeme"
- `Section.subtitle`: optional tagline
- The component queries all `Page` entries whose `slug` starts with `leeme/`, ordered by `Page.publishedAt` descending
- Each post card shows: `Page.seoTitle` (post title), `Page.excerpt`, `Page.publishedAt` (formatted date), link to `/[slug]`

Individual blog posts are regular `Page` entries in Contentful with:
- `slug`: `leeme/post-slug`
- `publishedAt`: ISO 8601 date string (new field)
- `excerpt`: short preview text (new field)
- `pageElements`: any section types (e.g. `text` for the post body)

### Mitilene

Manuela's musician alter-ego page. Starts as "coming soon" — a single `banner` or `text` section with `theme: 'dark'`. Content to be built out later entirely in Contentful without code changes.

### Contacto

Single `form` section using the existing `Form` type. No changes needed.

---

## Template Extensions

### New fields on existing models

**`Item`** — add `embedUrl?: string`
- Holds an iframe `src` URL for embedding external players (SoundCloud, YouTube, Spotify, Vimeo)
- Used by the `audiovisual` layout of `cards`
- Generic enough for any future site needing embeds in card items

**`Page`** — add `publishedAt?: string` and `excerpt?: string`
- `publishedAt`: ISO 8601 date, used to order and display blog posts
- `excerpt`: short preview text shown in blog feed cards
- Both are optional — non-blog pages leave them empty

**`SiteTheme`** — add `navLayout?: 'default' | 'centered'`
- Controls whether the header renders the logo left-aligned (default) or center with links split symmetrically
- Reusable for any future site that wants a centered logo nav

**`NavElement`** — add `children?: NavElement[]`
- Enables dropdown submenus
- Used for the Música dropdown (Audiovisuales / Catálogo)
- Renders as a hover/click dropdown in the `centered` nav layout

### New Section type

**`blog-feed`** — new value added to `Section.type` enum
- New component: `src/components/sections/BlogFeed.astro`
- Receives the containing page's own `slug` as a prop (passed down from `[pages].astro`)
- Fetches all pages from the CMS, filters to those whose `slug` starts with `{containingPage.slug}/`, orders by `publishedAt` descending, renders a post grid
- No extra field needed — the parent page slug is the natural namespace

### New Section layouts

**`audiovisual`** — new value for `Section.layout`, applied to `cards`
- Renders items as poster + embed player pairs
- New rendering branch inside `src/components/sections/Cards.astro`

**`gallery`** — new value for `Section.layout`, applied to `cards`
- Renders items as a horizontal portrait-image row
- New rendering branch inside `src/components/sections/Cards.astro`

### New Nav layout

**`centered`** — new value for `SiteTheme.navLayout?: 'default' | 'centered'`
- Add `navLayout?: 'default' | 'centered'` field to the `SiteTheme` model (1 new field on existing model)
- `Header.astro` reads `navLayout` from the theme and switches layout accordingly
- `centered`: logo center, nav links split left and right at the midpoint
- `default` (or unset): existing left-aligned logo layout unchanged

---

## Contentful Migrations

6 new migrations, numbered sequentially after the existing 16:

| File | Purpose |
|---|---|
| `20260524-17-item-embed-url.cjs` | Add `embedUrl` text field to `item` content type |
| `20260524-18-page-blog-fields.cjs` | Add `publishedAt` (Date) and `excerpt` (Text) to `page` content type |
| `20260524-19-nav-element-children.cjs` | Add `children` (Array of `navElement` references) to `navElement` content type |
| `20260524-20-section-blog-feed-type.cjs` | Add `blog-feed` as valid value to `section.type` field validation |
| `20260524-21-section-new-layouts.cjs` | Add `audiovisual` and `gallery` as valid values to `section.layout` field validation |
| `20260524-22-site-theme-nav-layout.cjs` | Add `navLayout` text field to `siteTheme` content type |

---

## Mock Fixtures

Updated mock adapter fixtures for local development without Contentful credentials:

| Fixture | Content |
|---|---|
| `theme.ts` | Parchment palette, Lora font, dark Mitilene variants |
| `nav.ts` | Centered layout, Música dropdown, Instagram + YouTube icons |
| `pages.ts` | All 8 pages with representative content |
| `footer.ts` | Minimal — name, social links, copyright |

---

## Project Setup

1. Copy `website/` to `manuelaeaguirre/` in `/Users/marthox/Dev/`
2. Update `package.json` `name` to `manuelaeaguirre`
3. Add `public/logo.png` (Manuela's hand-drawn logo image)
4. Create new `.env` for the new Contentful space credentials
5. Add `.superpowers/` to `.gitignore`
6. Initialize new git repository

---

## Out of Scope (initial launch)

- Leeme blog post content (Manuela writes these herself in Contentful)
- Mitilene full page content (coming soon placeholder only)
- Form submission backend (Contacto form — needs a form handler service like Netlify Forms or Formspree)
- Search or filtering within Catálogo or Libros
