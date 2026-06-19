# Manuela E. Aguirre — Website Design System

**Date:** 2026-06-18  
**Project:** manuelaeaguirre.com  
**Stack:** Astro 5 + Contentful CMS

---

## 1. Design Direction

**Style:** Editorial Literary — the aesthetic of a serious literary journal or museum catalogue. Warm, harmonious, and organized. Artistic but authoritative. No neon, no aggressive minimalism.

**Reference touchstone:** The book covers Manuela has designed — bold typographic confidence, controlled palette, black & white with selective color, surreal/editorial sensibility.

**Mood keywords:** Parchment, ink, intimacy, memory, ritual.

---

## 2. Color Tokens

Replace all existing tokens in `src/styles/tokens.scss`.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#F7F3EC` | Page background (cream paper) |
| `--color-surface` | `#FDFAF4` | Cards, panels, inset blocks |
| `--color-text` | `#1A0F08` | All body text and headings |
| `--color-text-muted` | `#6B5040` | Secondary text, nav links, captions |
| `--color-accent` | `#D4694A` | Coral — rules, eyebrows, CTAs, active states |
| `--color-border` | `#D4C9B0` | Card borders, horizontal rules, dividers |
| `--color-ink` | `#2C1810` | Nav top bar, strong borders, section dividers |

**Section theme tokens** (light only — no dark mode on this site):

```scss
:root {
  --section-bg:           #F7F3EC;
  --section-surface:      #FDFAF4;
  --section-border:       #D4C9B0;
  --section-text:         #1A0F08;
  --section-text-muted:   #6B5040;

  --btn-primary-bg:       #2C1810;
  --btn-primary-text:     #F7F3EC;
  --btn-secondary-border: #D4694A;
  --btn-secondary-text:   #D4694A;
  --btn-ghost-text:       #D4694A;
}
```

---

## 3. Typography

### Fonts

| Role | Font | Weight | Style |
|---|---|---|---|
| **Logotype** | Custom hand-lettered image (`IMG_9386.jpg`) | — | — |
| **Display headings** | Playfair Display | 700 | normal |
| **Section headings** | Playfair Display | 400 | italic |
| **Pull quotes** | Playfair Display | 400 | italic |
| **Body text** | Lato | 300 | normal |
| **Nav links, labels, eyebrows** | Lato | 400 | normal, uppercase, wide tracking |
| **Captions** | Lato | 300 | normal |

### Google Fonts import

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400&display=swap" rel="stylesheet">
```

### Typographic rules

- Eyebrows/category labels: `font-family: Lato; font-weight: 400; letter-spacing: 0.18em; text-transform: uppercase; color: var(--color-accent)`
- Section divider rule: `2px solid var(--color-ink)` above major sections
- Accent rule under eyebrows: `width: 28px; height: 2px; background: var(--color-accent)`
- No border-radius on cards or panels — hard edges only (0px or 1px max)

---

## 4. Background & Texture

**Source:** `03. FOTOS E IMAGENES/FONDO DE PAG WEB.png`

Manuela designed a custom paper texture with grain and soft coral edge washes baked in. This image is used as the body background across all pages — it replaces any CSS-generated texture. It should be copied into `public/` and referenced in the base layout.

```css
body {
  background-image: url('/fondo-pagina.png');
  background-repeat: repeat;  /* or cover — test at full width */
  background-attachment: fixed;
}
```

---

## 5. Logotype

**Source:** `03. FOTOS E IMAGENES/IMG_9386.jpg`

The hand-lettered "MANUELA E. AGUIRRE" is a custom drawn asset and must never be replicated with a font. It is used as an `<img>` element in the nav header.

- Convert to PNG with transparent background (remove white) before use
- Desktop: centered in the nav between left and right link groups
- Mobile: centered above the hamburger menu, scaled to ~60% width
- Alt text: `"Manuela E. Aguirre"`

---

## 6. Navigation

### Desktop
- Top bar: `background: var(--color-ink)` with `1px solid var(--color-ink)` bottom border
- Layout: `[Sobre mí · Música · Libros]` — [LOGOTYPE IMAGE] — `[Leeme · Mitilene · Contacto]`
- Link style: Lato 400, uppercase, `letter-spacing: 0.14em`, color `var(--color-text-muted)`, hover → `var(--color-accent)`
- Active page: underline in `var(--color-accent)`
- Música has a dropdown sub-nav: Audiovisuales · Catálogo

### Mobile
- Logotype centered at top
- Hamburger icon right-aligned (`☰` or SVG)
- Drawer: full-width overlay, links stacked in large Playfair italic — feels like a table of contents
- Close button top-right

---

## 7. Pages & Layouts

### Homepage
**Desktop:**
1. Nav
2. Hero — split 50/50: left = portrait photo; right = eyebrow + logotype image + tagline (Playfair italic) + coral rule + two CTAs (Biografía, Obra)
3. Featured works strip — 3 columns: one book, one music piece, one recent event/project
4. Bio pull quote — centered, Playfair italic, large, coral ornament above and below
5. Contact CTA — simple centered block with button

**Mobile:**
1. Nav
2. Portrait photo full-width
3. Logotype + eyebrow + tagline stacked below
4. CTAs stacked full-width
5. Featured works — single column scroll
6. Pull quote
7. Contact CTA

### Biografía
- Left: portrait photo
- Right: long-form bio text in justified columns (Lato 300, generous line-height)
- Mobile: photo full-width, bio below as single column

### Música
Sub-navigation tabs: **Audiovisuales** · **Catálogo**

**Audiovisuales:** Cards with film/theatre poster image + title + director + year + embedded SoundCloud player  
**Catálogo:** Work cards — title (Playfair bold), type (ópera de cámara, coral, etc.), year, description paragraph

Cards: `1px solid var(--color-border)`, no radius, hover lifts with shadow  
Desktop: 3 columns · Mobile: 1 column

### Libros
Grid of book covers — image dominant, title + publication below  
Desktop: 4 columns · Mobile: 2 columns  
Click opens a modal or detail page with full publication info

### Leeme
Blog/reading section — essay or short fiction excerpts  
List layout: date · title (Playfair italic large) · excerpt (Lato 300) · "Leer más" link  
Desktop: constrained centered column (max 680px) · Mobile: full width with generous padding

### Mitilene
Dedicated standalone project page — content TBD by Manuela  
Layout: full-page editorial with large header image, long-form text, links

### Contacto
- Simple form: Name · Email · Message · Send button (primary style)
- Social links below: Instagram · YouTube (from her mockup)
- No map needed

---

## 8. Media Assets

All source assets in `Downloads/11. PÁGINA WEB /`:

| File | Destination | Used on |
|---|---|---|
| `FONDO DE PAG WEB.png` | `public/fondo-pagina.png` | All pages (body bg) |
| `IMG_9386.jpg` | `public/logo-manuela.png` (convert to transparent PNG) | Nav, everywhere |
| `01. POSTERS/` (3 images) | `public/media/posters/` | Música → Audiovisuales |
| `02. LIBROS/` (5 images) | `public/media/libros/` | Libros page |
| `TEXTOS PARA PAGINA WEB.docx` | Content reference for Contentful | All pages |

**Still needed (not blocking implementation):**
- Portrait photo of Manuela for the homepage hero
- Additional performance/event photos for Catálogo

---

## 9. Contentful Content Model Changes

The existing CMS model (Page → Section → Items) can accommodate this design. No new content types needed for Phase 1. The following section types will be used:

- `hero` — portrait split layout
- `cards` — Música Catálogo and Libros grids
- `textSection` — Biografía and Leeme entries
- `gallery` — Audiovisuales posters
- `form` — Contacto

The `SiteTheme` content type will be updated with the new token values above.

---

## 10. What Does NOT Change

- Astro 5 + Contentful architecture — unchanged
- `CMSAdapter` interface — unchanged
- `SectionRenderer` dispatch pattern — unchanged
- URL structure — unchanged

The design system change is entirely contained in `tokens.scss`, the base layout (fonts + background), and the individual section components (visual styling only, not structure).
