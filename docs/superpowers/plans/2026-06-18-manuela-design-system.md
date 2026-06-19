# Manuela E. Aguirre — Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing neon/dark tech aesthetic with an Editorial Literary design system — cream paper, dark ink, coral accent, Playfair Display + Lato typography, and Manuela's custom hand-lettered logotype.

**Architecture:** All visual changes are confined to `tokens.scss` (CSS custom properties), `BaseLayout.astro` (fonts + background), `Nav.astro` (structural + styling rewrite), and individual section component styles. No CMS schema changes, no routing changes, no Astro config changes.

**Tech Stack:** Astro 5, SCSS, Google Fonts (Playfair Display + Lato), Contentful CMS (theme values updated via Contentful UI, not migration)

---

## File Map

| File | Action | What changes |
|---|---|---|
| `public/fondo-pagina.png` | Create | Copy background texture from Downloads |
| `public/logo-manuela.png` | Create | Copy logotype from Downloads |
| `src/styles/tokens.scss` | Modify | Full token replacement — new palette, fonts, no gradients |
| `src/layouts/BaseLayout.astro` | Modify | New Google Fonts URL, `lang="es"`, body background image |
| `src/components/Nav.astro` | Modify | Structural rewrite — centered logo, split links, editorial styling, coral mobile drawer |
| `src/components/sections/Hero.astro` | Modify | Add portrait-split layout variant (photo left, text right) |
| `src/components/sections/Cards.astro` | Modify | Remove neon styles, add editorial card styles |
| `src/components/sections/TextSection.astro` | Modify | Typography and spacing aligned to new tokens |
| `src/components/sections/Gallery.astro` | Modify | Remove neon borders, editorial grid style |
| `src/components/Footer.astro` | Modify | Remove dark bg, match cream paper + ink aesthetic |
| `src/components/sections/Form.astro` | Modify | Editorial form inputs, coral submit button |

---

## Task 1: Copy public assets

**Files:**
- Create: `public/fondo-pagina.png`
- Create: `public/logo-manuela.png`

- [ ] **Step 1: Copy the background texture**

```bash
cp "/Users/marthox/Downloads/11. PÁGINA WEB /03. FOTOS E IMAGENES/FONDO DE PAG WEB .png" public/fondo-pagina.png
```

- [ ] **Step 2: Copy the logotype**

```bash
cp "/Users/marthox/Downloads/11. PÁGINA WEB /03. FOTOS E IMAGENES/IMG_9386.jpg" public/logo-manuela.jpg
```

- [ ] **Step 3: Copy media assets**

```bash
mkdir -p public/media/posters public/media/libros
cp "/Users/marthox/Downloads/11. PÁGINA WEB /01. POSTERS DE PELIS Y SERIES/1. CUANDO VUELVEN LAS BRISAS png.png" public/media/posters/cuando-vuelven-las-brisas.png
cp "/Users/marthox/Downloads/11. PÁGINA WEB /01. POSTERS DE PELIS Y SERIES/1_Líneas de la memoria _impresion_principal.jpg" public/media/posters/lineas-de-la-memoria.jpg
cp "/Users/marthox/Downloads/11. PÁGINA WEB /01. POSTERS DE PELIS Y SERIES/Geurra de las gallinas poster.jpg" public/media/posters/guerra-de-las-gallinas.jpg
cp "/Users/marthox/Downloads/11. PÁGINA WEB /02. LIBROS/84522.jpg" public/media/libros/el-corazon-inambrico.jpg
cp "/Users/marthox/Downloads/11. PÁGINA WEB /02. LIBROS/LAS CICLISTAS.jpg" public/media/libros/las-ciclistas.jpg
cp "/Users/marthox/Downloads/11. PÁGINA WEB /02. LIBROS/LO DESCONOSCIBLE .jpg" public/media/libros/lo-desconocible.jpg
cp "/Users/marthox/Downloads/11. PÁGINA WEB /02. LIBROS/Los allás .jpg" public/media/libros/los-allas.jpg
cp "/Users/marthox/Downloads/11. PÁGINA WEB /02. LIBROS/Palestina en palabras .webp" public/media/libros/palestina-en-palabras.webp
```

- [ ] **Step 4: Verify files exist**

```bash
ls public/fondo-pagina.png public/logo-manuela.jpg public/media/posters/ public/media/libros/
```

Expected: all files listed, no errors.

- [ ] **Step 5: Add .superpowers to .gitignore if not present**

```bash
grep -q '.superpowers' .gitignore || echo '.superpowers/' >> .gitignore
```

- [ ] **Step 6: Commit**

```bash
git add public/fondo-pagina.png public/logo-manuela.jpg public/media/ .gitignore
git commit -m "feat: add Manuela media assets to public/"
```

---

## Task 2: Replace design tokens

**Files:**
- Modify: `src/styles/tokens.scss`

- [ ] **Step 1: Replace the entire file**

Replace `src/styles/tokens.scss` with:

```scss
// =============================================================================
// Design Tokens — Manuela E. Aguirre
// Editorial Literary palette: cream paper, dark ink, coral accent
// =============================================================================

:root {
    // ── Base palette ──────────────────────────────────────────────────────────
    --color-bg:           #F7F3EC;
    --color-surface:      #FDFAF4;
    --color-border:       #D4C9B0;
    --color-text:         #1A0F08;
    --color-text-muted:   #6B5040;
    --color-accent:       #D4694A;
    --color-ink:          #2C1810;

    // ── Typography ────────────────────────────────────────────────────────────
    --font-heading: 'Playfair Display', Georgia, serif;
    --font-body:    'Lato', system-ui, sans-serif;
    --font-size-base: 16px;

    // ── Layout ────────────────────────────────────────────────────────────────
    --container-width:   1200px;
    --section-padding-y: 5rem;
    --section-padding-x: 1.5rem;

    // ── Radius — hard editorial edges ─────────────────────────────────────────
    --radius-sm:   0px;
    --radius-md:   0px;
    --radius-lg:   1px;
    --radius-xl:   1px;
    --radius-pill: 2px;
}

// =============================================================================
// Section theme tokens — light only (no dark mode)
// =============================================================================

:root,
[data-theme="light"],
[data-theme="dark"] {
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

// ── Mobile ────────────────────────────────────────────────────────────────────
@media (max-width: 767px) {
    :root {
        --section-padding-y: 3.5rem;
        --section-padding-x: 1.25rem;
    }
}

html { scroll-behavior: smooth; }
```

- [ ] **Step 2: Start dev server and check for build errors**

```bash
npm run dev
```

Expected: server starts, no SCSS compilation errors in terminal.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.scss
git commit -m "feat: replace design tokens with editorial literary palette"
```

---

## Task 3: Update BaseLayout — fonts and background

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Replace the font import and add body background**

In `src/layouts/BaseLayout.astro`, replace the existing Google Fonts `<link>` tag:

```html
<!-- OLD — remove this line -->
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
```

With:

```html
<!-- NEW -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Change `lang` attribute to Spanish**

Change `<html lang="en">` to `<html lang="es">`.

- [ ] **Step 3: Add body background styles**

After the closing `</head>` and before `<body>`, add a `<style is:global>` block inside `<head>`:

```html
<style is:global>
  body {
    background-image: url('/fondo-pagina.png');
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    min-height: 100vh;
    font-family: var(--font-body);
    color: var(--color-text);
  }

  @media (max-width: 767px) {
    body {
      background-attachment: scroll;
    }
  }
</style>
```

Note: `background-attachment: fixed` is disabled on mobile because iOS Safari doesn't support it correctly — `scroll` is used instead.

- [ ] **Step 4: Remove `data-themeMode` dark forcing in Nav.astro**

In `src/components/Nav.astro`, in the `<script>` block, remove this line:

```typescript
// DELETE this line:
document.documentElement.dataset.themeMode = 'dark';
```

- [ ] **Step 5: Verify in browser**

Open `http://localhost:4321`. The background should show the cream paper texture. No neon colors should appear anywhere.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Nav.astro
git commit -m "feat: update fonts to Playfair Display + Lato, apply paper background"
```

---

## Task 4: Rewrite Nav — editorial split layout

**Files:**
- Modify: `src/components/Nav.astro`

The current nav has brand-left, links-right. We need: links-left | centered logotype image | links-right. The mobile drawer becomes cream paper with Playfair italic links.

- [ ] **Step 1: Replace the nav HTML template**

Replace everything between the `---` frontmatter closing and `<script>` in `src/components/Nav.astro` with:

```astro
<nav class="site-nav" aria-label="Navegación principal">
    <div class="site-nav__inner">
        <!-- Left links (desktop) -->
        <ul class="site-nav__links site-nav__links--left" role="list">
            {elements.slice(0, Math.ceil(elements.length / 2)).filter(isNavLink).map(el => (
                <li>
                    <a href={(el as NavLink).href} class="site-nav__link">{el.label}</a>
                </li>
            ))}
        </ul>

        <!-- Centered logotype -->
        <a class="site-nav__brand" href="/" aria-label="Manuela E. Aguirre — inicio">
            <img
                src="/logo-manuela.jpg"
                alt="Manuela E. Aguirre"
                class="site-nav__logo"
                width="180"
                height="72"
            />
        </a>

        <!-- Right links (desktop) + hamburger (mobile) -->
        <div class="site-nav__right">
            <ul class="site-nav__links site-nav__links--right" role="list">
                {elements.slice(Math.ceil(elements.length / 2)).filter(isNavLink).map(el => (
                    <li>
                        <a href={(el as NavLink).href} class="site-nav__link">{el.label}</a>
                    </li>
                ))}
            </ul>
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
    </div>
</nav>

<!-- Mobile overlay -->
<div class="site-nav__overlay" id="mobile-menu" aria-hidden="true" role="dialog" aria-label="Menú de navegación">
    <div class="site-nav__overlay-header">
        <a class="site-nav__overlay-brand" href="/" aria-label="Inicio">
            <img src="/logo-manuela.jpg" alt="Manuela E. Aguirre" class="site-nav__overlay-logo" />
        </a>
        <button class="site-nav__overlay-close" id="mobile-menu-close" aria-label="Cerrar menú" type="button">
            <span></span>
            <span></span>
        </button>
    </div>
    <nav class="site-nav__overlay-nav" aria-label="Navegación móvil">
        <ul class="site-nav__overlay-links" role="list">
            {elements.filter(isNavLink).map(el => (
                <li>
                    <a href={(el as NavLink).href} class="site-nav__overlay-link">{el.label}</a>
                </li>
            ))}
        </ul>
    </nav>
    <div class="site-nav__overlay-footer">
        <a class="site-nav__overlay-social" href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
        <a class="site-nav__overlay-social" href="https://youtube.com" target="_blank" rel="noopener">YouTube</a>
    </div>
</div>
```

- [ ] **Step 2: Replace the nav `<style>` block**

Replace the entire `<style>` block at the bottom of `Nav.astro` with:

```css
<style>
/* ── Desktop nav ─────────────────────────────────────────────────────────── */
.site-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background-color: #FDFAF4;
    border-bottom: 2px solid #2C1810;
}

.site-nav__inner {
    max-width: var(--container-width, 1200px);
    margin: 0 auto;
    padding: 0.75rem var(--section-padding-x, 1.5rem);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
}

/* Logotype */
.site-nav__brand { display: flex; justify-content: center; text-decoration: none; }
.site-nav__logo  { height: 52px; width: auto; display: block; object-fit: contain; }

/* Link groups */
.site-nav__links {
    display: flex;
    align-items: center;
    gap: 1.75rem;
    list-style: none;
    margin: 0;
    padding: 0;
}
.site-nav__links--right { justify-content: flex-end; }

.site-nav__link {
    color: var(--color-text-muted);
    text-decoration: none;
    font-family: var(--font-body);
    font-size: 0.8125rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: color 0.15s;
}
.site-nav__link:hover,
.site-nav__link[aria-current="page"] { color: var(--color-accent); }
.site-nav__link[aria-current="page"] { text-decoration: underline; text-underline-offset: 3px; }

/* Right column wrapper */
.site-nav__right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

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
}
.site-nav__hamburger-bar {
    display: block;
    width: 22px;
    height: 1.5px;
    background: var(--color-ink);
    transition: transform 0.2s, opacity 0.2s;
    transform-origin: center;
}
.site-nav__hamburger.is-active .site-nav__hamburger-bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.site-nav__hamburger.is-active .site-nav__hamburger-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
.site-nav__hamburger.is-active .site-nav__hamburger-bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* ── Mobile overlay ──────────────────────────────────────────────────────── */
.site-nav__overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background-color: #F7F3EC;
    background-image: url('/fondo-pagina.png');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    padding: 0 var(--section-padding-x, 1.5rem);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}
.site-nav__overlay.is-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
}

.site-nav__overlay-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 0;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
}
.site-nav__overlay-logo  { height: 44px; width: auto; }

/* Close button */
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
    height: 1.5px;
    background: var(--color-ink);
    top: 50%;
    left: 50%;
    translate: -50% -50%;
}
.site-nav__overlay-close span:first-child { rotate: 45deg; }
.site-nav__overlay-close span:last-child  { rotate: -45deg; }

/* Overlay nav links */
.site-nav__overlay-nav  { flex: 1; display: flex; align-items: center; }
.site-nav__overlay-links { list-style: none; margin: 0; padding: 0; width: 100%; display: flex; flex-direction: column; gap: 0; }
.site-nav__overlay-link {
    display: block;
    padding: 1.1rem 0;
    color: var(--color-text);
    text-decoration: none;
    font-family: var(--font-heading);
    font-style: italic;
    font-size: clamp(1.4rem, 6.5vw, 2rem);
    border-bottom: 1px solid var(--color-border);
    transition: color 0.15s;
    line-height: 1.2;
}
.site-nav__overlay-link:hover { color: var(--color-accent); }

/* Social links in footer of overlay */
.site-nav__overlay-footer { padding: 1.5rem 0; display: flex; gap: 1.5rem; flex-shrink: 0; }
.site-nav__overlay-social {
    font-family: var(--font-body);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color 0.15s;
}
.site-nav__overlay-social:hover { color: var(--color-accent); }

/* ── Responsive breakpoints ──────────────────────────────────────────────── */
@media (max-width: 767px) {
    .site-nav__links  { display: none; }
    .site-nav__hamburger { display: flex; }
    .site-nav__inner  { grid-template-columns: auto 1fr auto; }
    .site-nav__logo   { height: 40px; }
}
@media (min-width: 768px) {
    .site-nav__overlay { display: none; }
}
</style>
```

- [ ] **Step 3: Verify nav renders correctly**

Open `http://localhost:4321`. Confirm:
- Nav has cream background with dark ink bottom border
- Logotype image is centered
- Links are split left/right (desktop)
- Hamburger appears on mobile (<768px)
- Mobile drawer opens with cream paper background and Playfair italic links

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: redesign nav to editorial split layout with logotype"
```

---

## Task 5: Add portrait-split Hero variant

**Files:**
- Modify: `src/components/sections/Hero.astro`

The existing hero has `hero--split` layout class but no split-specific styling. We add the portrait-left, text-right layout used on the homepage.

- [ ] **Step 1: Read the current Hero.astro styles**

Read `src/components/sections/Hero.astro` lines 60–end to understand the current CSS.

- [ ] **Step 2: Add the split variant styles**

In the `<style>` block of `Hero.astro`, add after the existing styles:

```css
/* ── Portrait-split layout (homepage hero) ─────────────────────────────── */
.hero--split {
    background: transparent;
    border-bottom: 2px solid var(--section-border);
    padding: 0;
    min-height: 520px;
}

.hero--split .hero__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: var(--container-width, 1200px);
    margin: 0 auto;
    min-height: 520px;
}

/* Left side — photo */
.hero--split .hero__image-col {
    position: relative;
    overflow: hidden;
    border-right: 2px solid var(--section-border);
}

.hero--split .hero__image-col img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
}

/* Right side — text */
.hero--split .hero__content {
    padding: 3rem 2.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    border-left: 3px solid var(--color-ink);
}

.hero--split .hero__eyebrow {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin: 0;
}

.hero--split .hero__title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: var(--section-text);
    line-height: 1.05;
    margin: 0;
}

.hero--split .hero__rule {
    width: 32px;
    height: 2px;
    background: var(--color-accent);
    flex-shrink: 0;
}

.hero--split .hero__body {
    font-family: var(--font-heading);
    font-style: italic;
    font-size: 1rem;
    color: var(--section-text-muted);
    line-height: 1.6;
    margin: 0;
}

.hero--split .hero__ctas {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
}

.hero--split .hero__cta {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 0.6rem 1.25rem;
    transition: background 0.15s, color 0.15s;
}
.hero--split .hero__cta--primary {
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
}
.hero--split .hero__cta--primary:hover { background: var(--color-accent); }
.hero--split .hero__cta--secondary {
    border: 1px solid var(--btn-secondary-border);
    color: var(--btn-secondary-text);
    background: transparent;
}
.hero--split .hero__cta--secondary:hover { background: var(--color-accent); color: #FDFAF4; border-color: var(--color-accent); }

/* Mobile — stack vertically */
@media (max-width: 767px) {
    .hero--split .hero__inner {
        grid-template-columns: 1fr;
        min-height: unset;
    }
    .hero--split .hero__image-col {
        height: 55vw;
        border-right: none;
        border-bottom: 2px solid var(--section-border);
    }
    .hero--split .hero__content {
        padding: 2rem 1.25rem;
        border-left: none;
        border-top: none;
    }
}
```

- [ ] **Step 3: Add the image column to the split layout in the template**

In the `Hero.astro` template, inside the `hero--split` variant rendering, the existing `hero__content` div needs an image column sibling. Find the section tag and add conditional image rendering before `hero__content` when layout is split:

```astro
<section class={`hero ${layoutClass}`} data-theme={section.theme}>
    <div class="hero__inner">
        {section.layout === 'split' && section.image && (
            <div class="hero__image-col">
                <img src={section.image.src} alt={section.image.alt ?? ''} />
            </div>
        )}
        <div class="hero__content">
            {/* ... existing content unchanged ... */}
        </div>
    </div>
</section>
```

Also add a `.hero__rule` div after the eyebrow in the split content:

```astro
{section.layout === 'split' && <div class="hero__rule" aria-hidden="true"></div>}
```

- [ ] **Step 4: Check the Section type supports `image`**

```bash
grep -n "image" src/types/page.ts
```

If `image` is not in the `Section` type, add it:

```typescript
image?: { src: string; alt?: string };
```

- [ ] **Step 5: Verify in browser**

The homepage hero (if using `layout: 'split'`) should now show photo left, text right. On mobile, photo stacks above text.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Hero.astro src/types/page.ts
git commit -m "feat: add portrait-split hero layout variant"
```

---

## Task 6: Restyle Cards section

**Files:**
- Modify: `src/components/sections/Cards.astro`

Remove neon/gradient styles, apply editorial card aesthetic — no border-radius, cream surface, ink text, coral hover.

- [ ] **Step 1: Replace CSS custom properties in Cards.astro**

In the `<style>` block of `src/components/sections/Cards.astro`, find and replace these patterns:

Replace all instances of:
- `border-radius: var(--radius-*)` → `border-radius: 0`
- `border-radius: *rem` → `border-radius: 0`
- `background: var(--gradient-brand*)` → `background: var(--color-accent)`
- `color: #ff0087` → `color: var(--color-accent)`
- `#0099ff` → `var(--color-accent)`
- `box-shadow: 0 * rgba(255, 0, 135*)` → `box-shadow: 0 4px 16px rgba(44, 24, 16, 0.08)`
- `box-shadow: 0 * rgba(0, 153, 255*)` → `box-shadow: 0 4px 16px rgba(44, 24, 16, 0.08)`

Then ensure card base styles read:

```css
.cards__card {
    background: var(--section-surface);
    border: 1px solid var(--section-border);
    border-radius: 0;
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.15s;
}
.cards__card:hover {
    box-shadow: 0 6px 24px rgba(44, 24, 16, 0.1);
    transform: translateY(-2px);
}
```

Card titles should use `var(--font-heading)` and card body text `var(--font-body)`.

- [ ] **Step 2: Verify in browser**

Cards should render with cream backgrounds, ink borders, no neon accents.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Cards.astro
git commit -m "feat: restyle Cards section for editorial aesthetic"
```

---

## Task 7: Restyle TextSection

**Files:**
- Modify: `src/components/sections/TextSection.astro`

- [ ] **Step 1: Update styles in TextSection.astro**

In the `<style>` block, ensure:

```css
.text-section {
    background: var(--section-bg);
    color: var(--section-text);
    padding: var(--section-padding-y) var(--section-padding-x);
}

.text-section__inner {
    max-width: var(--container-width);
    margin: 0 auto;
}

.text-section__eyebrow {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin-bottom: 0.75rem;
    display: block;
}

.text-section__title {
    font-family: var(--font-heading);
    font-size: clamp(1.6rem, 3vw, 2.5rem);
    font-weight: 700;
    color: var(--section-text);
    line-height: 1.15;
    margin-bottom: 1rem;
}

.text-section__rule {
    width: 32px;
    height: 2px;
    background: var(--color-accent);
    margin-bottom: 1.5rem;
}

.text-section__body {
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.75;
    color: var(--section-text);
    max-width: 680px;
}
```

Remove any neon color references (`#ff0087`, `#0099ff`, gradients).

Add a `.text-section__rule` div after the title in the template (if not present).

- [ ] **Step 2: Verify in browser**

Text sections render with clean cream background, dark ink text, coral rule.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/TextSection.astro
git commit -m "feat: restyle TextSection for editorial aesthetic"
```

---

## Task 8: Restyle Gallery

**Files:**
- Modify: `src/components/sections/Gallery.astro`

- [ ] **Step 1: Update Gallery.astro styles**

In the `<style>` block:

```css
.gallery {
    background: var(--section-bg);
    padding: var(--section-padding-y) var(--section-padding-x);
}

.gallery__inner {
    max-width: var(--container-width);
    margin: 0 auto;
}

.gallery__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1px;
    border: 1px solid var(--section-border);
}

.gallery__item {
    position: relative;
    overflow: hidden;
    aspect-ratio: 3/4;
    background: var(--section-surface);
}

.gallery__item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
}

.gallery__item:hover img { transform: scale(1.03); }

.gallery__caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.75rem 1rem;
    background: linear-gradient(transparent, rgba(26, 15, 8, 0.7));
    color: #F7F3EC;
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 300;
    letter-spacing: 0.06em;
}

@media (max-width: 767px) {
    .gallery__grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

Remove all neon border/glow styles.

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Gallery.astro
git commit -m "feat: restyle Gallery section for editorial aesthetic"
```

---

## Task 9: Restyle Footer

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Read the current Footer.astro**

Read `src/components/Footer.astro` fully to understand its structure.

- [ ] **Step 2: Replace Footer styles**

In the `<style>` block of `Footer.astro`, replace all styles with:

```css
.site-footer {
    background: var(--color-ink);
    color: #F7F3EC;
    padding: 3rem var(--section-padding-x) 1.5rem;
    border-top: 2px solid var(--color-ink);
    margin-top: 4rem;
}

.site-footer__inner {
    max-width: var(--container-width);
    margin: 0 auto;
}

.site-footer__top {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: start;
    gap: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(247, 243, 236, 0.15);
    margin-bottom: 1.5rem;
}

.site-footer__brand img {
    height: 44px;
    width: auto;
    filter: invert(1);
    opacity: 0.9;
}

.site-footer__tagline {
    font-family: var(--font-heading);
    font-style: italic;
    font-size: 0.875rem;
    color: rgba(247, 243, 236, 0.6);
    margin-top: 0.5rem;
}

.site-footer__links {
    display: flex;
    gap: 2rem;
}

.site-footer__col h4 {
    font-family: var(--font-body);
    font-size: 0.65rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin-bottom: 0.75rem;
}

.site-footer__col ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.site-footer__col a {
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 300;
    color: rgba(247, 243, 236, 0.75);
    text-decoration: none;
    transition: color 0.15s;
}

.site-footer__col a:hover { color: var(--color-accent); }

.site-footer__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.site-footer__copy {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 300;
    color: rgba(247, 243, 236, 0.4);
    letter-spacing: 0.06em;
}

@media (max-width: 767px) {
    .site-footer__top {
        grid-template-columns: 1fr;
    }
    .site-footer__links {
        flex-wrap: wrap;
        gap: 1.5rem;
    }
    .site-footer__bottom {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
```

Also update the logotype in the footer template to use `/logo-manuela.jpg` with `filter: invert(1)` (to make the black lettering white on the dark footer):

```astro
<div class="site-footer__brand">
    <a href="/">
        <img src="/logo-manuela.jpg" alt="Manuela E. Aguirre" />
    </a>
</div>
```

- [ ] **Step 3: Verify in browser**

Footer should show dark ink background, cream text, coral accent on column headings, inverted logotype.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: restyle Footer with editorial dark ink aesthetic"
```

---

## Task 10: Restyle Form (Contacto)

**Files:**
- Modify: `src/components/sections/Form.astro`

- [ ] **Step 1: Update Form.astro styles**

In the `<style>` block of `src/components/sections/Form.astro`:

```css
.form-section {
    background: var(--section-bg);
    padding: var(--section-padding-y) var(--section-padding-x);
}

.form-section__inner {
    max-width: 600px;
    margin: 0 auto;
}

.form-section__title {
    font-family: var(--font-heading);
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    font-weight: 700;
    color: var(--section-text);
    margin-bottom: 0.5rem;
}

.form-section__subtitle {
    font-family: var(--font-heading);
    font-style: italic;
    font-size: 1rem;
    color: var(--section-text-muted);
    margin-bottom: 2rem;
}

.form__field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 1.25rem;
}

.form__label {
    font-family: var(--font-body);
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--section-text-muted);
}

.form__input,
.form__textarea {
    font-family: var(--font-body);
    font-size: 0.9375rem;
    font-weight: 300;
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0;
    padding: 0.65rem 0.875rem;
    width: 100%;
    transition: border-color 0.15s;
    outline: none;
}

.form__input:focus,
.form__textarea:focus {
    border-color: var(--color-accent);
}

.form__textarea { min-height: 120px; resize: vertical; }

.form__submit {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    border: none;
    padding: 0.8rem 2rem;
    cursor: pointer;
    transition: background 0.15s;
    border-radius: 0;
}

.form__submit:hover { background: var(--color-accent); }
```

- [ ] **Step 2: Remove neon focus rings and pill shapes**

Search for `border-radius` and `#ff0087` / `#0099ff` in Form.astro and remove them.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Form.astro
git commit -m "feat: restyle Form section with editorial inputs"
```

---

## Task 11: Final visual verification

- [ ] **Step 1: Run a full dev build check**

```bash
npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors, no SCSS errors, build completes.

- [ ] **Step 2: Check each page in the browser at `http://localhost:4321`**

Verify the following on both desktop (1280px) and mobile (375px):

| Check | Expected |
|---|---|
| Body background | Cream paper texture visible |
| Nav | Cream bg, dark ink border, centered logotype, coral hover |
| Nav mobile | Hamburger opens cream drawer with Playfair italic links |
| Hero (if split) | Photo left, text right with coral rule; stacks on mobile |
| Cards | No neon colors, cream surface, ink border |
| Footer | Dark ink background, inverted logotype, coral column headings |
| Form | Cream inputs, coral focus border, dark submit button |
| All text | Playfair Display headings, Lato body — no Syne/Montserrat/Open Sans |

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Manuela E. Aguirre editorial design system"
```

---

## Self-Review

**Spec coverage:**
- ✅ Color tokens — Task 2
- ✅ Typography (Playfair + Lato) — Tasks 2, 3
- ✅ Logotype as image — Tasks 1, 4
- ✅ Background texture — Tasks 1, 3
- ✅ Nav split layout desktop — Task 4
- ✅ Nav mobile drawer (Playfair italic, cream) — Task 4
- ✅ Portrait-split hero — Task 5
- ✅ Cards editorial — Task 6
- ✅ TextSection — Task 7
- ✅ Gallery — Task 8
- ✅ Footer dark ink — Task 9
- ✅ Form/Contacto — Task 10
- ✅ Mobile layouts on every component — Tasks 4–10
- ✅ Media assets copied — Task 1
- ⚠️ Portrait photo for homepage hero: not available yet — hero image column will render empty until Manuela provides a photo. The column is gracefully hidden if no `section.image` is set.
- ⚠️ Mitilene page content: not in scope for this plan — the design system applies once content is entered in Contentful.

**Type consistency:** `section.image` added to `Section` type in Task 5; referenced only in Hero.astro — consistent.

**No placeholders:** All CSS is complete and explicit. No TBD blocks.
