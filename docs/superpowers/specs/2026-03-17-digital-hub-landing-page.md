# Digital Hub Landing Page — Design & Integration Spec

**Date**: 2026-03-17
**Branch**: feat/digital-hub-landing
**Contentful space**: `b29bkr806w5b`, environment: `master`
**Status**: Draft — ready for implementation

---

## 1. Overview

This spec defines the complete implementation plan for the Digital Hub landing page, built on the existing Astro 5 + Contentful architecture. The page is driven entirely by Contentful content entries. No new content types are needed — all sections map to the existing `Section.type` union (`hero | banner | carousel | cards | features | testimonials | stats | text | gallery`).

The work is split into six tracks that can be executed sequentially:

1. Design token overhaul (`src/styles/tokens.scss`)
2. Dark mode system (`src/layouts/BaseLayout.astro`)
3. Nav component update (`src/components/Nav.astro`)
4. Section component updates (six components)
5. Contentful content entry creation
6. `SiteTheme` type extension for dark-mode base colors

---

## 2. Visual Design

### 2.1 Color Palette

| Token role | Light value | Dark value |
|---|---|---|
| Page background (primary) | `#FFFFFF` | `#080C14` |
| Page background (secondary / surface) | `#F8F9FF` | `#0D1525` |
| Body text | `#0A0A1A` | `#F0F4FF` |
| Muted text | `#5A6080` | `#8892B0` |
| Border | `#E2E6F0` | `#1E2D45` |
| Accent cyan | `#00B4FF` | `#00CFFF` |
| Accent magenta | `#FF2D7A` | `#FF2D7A` |

Hero dark section background (always dark regardless of page mode):
`linear-gradient(135deg, #0D1B2A, #1B3A5C, #0D2240)`

"Why Digital Hub" section background (always dark navy regardless of page mode):
`#050D1A` with `--section-bg` set via `data-theme="dark"` override class `.features--always-dark`

### 2.2 Typography

- **Font**: Inter only (drop Playfair Display for this project)
- Google Fonts URL: `https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap`
- Heading sizes follow the existing `clamp()` pattern

### 2.3 Gradient Text

Key headline words use gradient text via:
```css
background: linear-gradient(135deg, #00B4FF, #FF2D7A);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

Applied by wrapping target words in `<em>` inside the Contentful rich text `body` field (rendered by `RichText.astro`), or via a dedicated `.gradient-text` utility class applied in section components when `section.subtitle` is used as an eyebrow label.

### 2.4 CTA Button — "Conectar" Pill

```css
background: linear-gradient(135deg, #00B4FF, #FF2D7A);
color: #FFFFFF;
border-radius: 50px;
padding: 0.625rem 1.5rem;
font-weight: 600;
border: none;
```

This style is applied to any CTA with `variant: "primary"` inside the Nav component. Section CTAs retain the standard `--btn-primary-bg` token system.

### 2.5 Scroll Arrow (Hero)

A CSS-only animated downward chevron rendered unconditionally at the bottom of the Hero section. Uses `@keyframes bounce` with `transform: translateY`. No JS required.

---

## 3. Architecture Changes

### 3.1 Design Tokens — `src/styles/tokens.scss`

**What changes**: Complete palette replacement. The existing warm-brown (`#8B6F47`) palette is replaced with the Digital Hub cyan/magenta palette. The `[data-theme="dark"]` block is updated to match the new dark values. All existing token names are preserved so section components continue to work without structural changes.

**New `:root` block:**

```scss
:root {
    // Base palette — Digital Hub
    --color-bg:           #FFFFFF;
    --color-surface:      #F8F9FF;
    --color-border:       #E2E6F0;
    --color-text:         #0A0A1A;
    --color-text-muted:   #5A6080;
    --color-accent:       #00B4FF;          // cyan
    --color-accent-alt:   #FF2D7A;          // magenta

    --color-accent-dark:  #0099DD;
    --color-accent-light: #7DD8FF;

    --font-heading: 'Inter', system-ui, -apple-system, sans-serif;
    --font-body:    'Inter', system-ui, -apple-system, sans-serif;
    --font-size-base: 16px;

    --container-width:   1200px;
    --section-padding-y: 5rem;
    --section-padding-x: 1.5rem;

    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-pill: 50px;

    // Gradient definitions (referenced by components)
    --gradient-brand: linear-gradient(135deg, #00B4FF, #FF2D7A);
    --gradient-hero-dark: linear-gradient(135deg, #0D1B2A, #1B3A5C, #0D2240);
}
```

**New `:root, [data-theme="light"]` section-level block:**

```scss
:root,
[data-theme="light"] {
    --section-bg:         var(--color-bg);
    --section-surface:    var(--color-surface);
    --section-border:     var(--color-border);
    --section-text:       var(--color-text);
    --section-text-muted: var(--color-text-muted);

    --btn-primary-bg:       var(--color-accent);
    --btn-primary-text:     #FFFFFF;
    --btn-secondary-border: var(--color-text);
    --btn-secondary-text:   var(--color-text);
    --btn-ghost-text:       var(--color-accent);
}
```

**New `[data-theme="dark"]` section-level block:**

```scss
[data-theme="dark"] {
    --section-bg:         #080C14;
    --section-surface:    #0D1525;
    --section-border:     #1E2D45;
    --section-text:       #F0F4FF;
    --section-text-muted: #8892B0;

    --btn-primary-bg:       #00CFFF;
    --btn-primary-text:     #080C14;
    --btn-secondary-border: #F0F4FF;
    --btn-secondary-text:   #F0F4FF;
    --btn-ghost-text:       #00CFFF;
}
```

**New page-level dark mode block** (applied to `<html data-theme-mode="dark">`):

```scss
html[data-theme-mode="dark"] {
    // Override :root palette for full dark mode
    --color-bg:           #080C14;
    --color-surface:      #0D1525;
    --color-border:       #1E2D45;
    --color-text:         #F0F4FF;
    --color-text-muted:   #8892B0;
    --color-accent:       #00CFFF;
}
```

The `[data-theme="accent"]` block is removed (unused in Digital Hub). The `[data-theme="dark"]` block on section elements continues to override to the dark navy palette regardless of the page-level mode — this is the mechanism that keeps Hero and "Why Digital Hub" always dark.

### 3.2 Dark Mode System — `src/layouts/BaseLayout.astro`

**What changes**:

1. Add `data-theme-mode` attribute to `<html>` (empty by default = light).
2. Replace the Google Fonts `<link>` with the Inter-only URL.
3. Add an inline `<script>` in `<head>` that reads `localStorage.getItem('theme')` and sets `document.documentElement.dataset.themeMode` before first paint — preventing a flash of wrong theme.

**Inline script** (goes immediately before `</head>`):

```html
<script is:inline>
  (function () {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.dataset.themeMode = 'dark';
    }
  })();
</script>
```

The toggle logic (read/write `localStorage` + flip `data-theme-mode`) lives in `Nav.astro` as a `<script>` block.

**Updated font `<link>`:**

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />
```

No change to the `ThemeStyle.astro` injection mechanism — it continues to override tokens from the Contentful `siteTheme` entry.

### 3.3 Nav Component — `src/components/Nav.astro`

**What changes**: `Nav.astro` does not exist yet and must be **created** at `src/components/Nav.astro`. Once created, it must be imported into `src/layouts/BaseLayout.astro` and rendered immediately above the `<slot />` inside `<body>`:

```astro
import Nav from "@components/Nav.astro";
```

```astro
<body>
    <Nav />
    <slot />
</body>
```

1. Sticky positioning with `backdrop-filter: blur(12px)`.
2. Brand text "Digital Hub" rendered in `--color-accent` (cyan).
3. Nav links rendered as plain `<a>` elements.
4. "Conectar" CTA rendered as a pill button with `var(--gradient-brand)` background.
5. Dark mode toggle button (sun/moon text icons `☀` / `🌙`) appended after the CTA.
6. Toggle script: clicks flip `html[data-theme-mode]` between `""` and `"dark"` and persist to `localStorage`.

**Data binding**: `Nav.astro` receives its data via `cms.getNavigation()`, which already exists on `CMSAdapter` and returns `Promise<[NavBrand | null, NavElement[]]>`. In `BaseLayout.astro` (which already fetches CMS data), add `const [navBrand, navElements] = await cms.getNavigation()` alongside the existing CMS calls and pass the values as props to `<Nav brand={navBrand} elements={navElements} />`. The component prop signature must be:

```typescript
interface Props {
    brand: NavBrand | null;
    elements: NavElement[];
}
```

The "Conectar" CTA button is hardcoded in `Nav.astro` (not sourced from Contentful) since it is always the primary action — this is intentional.

**Nav structure** (pseudocode):

```
<nav class="site-nav">
  <div class="site-nav__inner">
    <a class="site-nav__brand" href="/">Digital Hub</a>
    <ul class="site-nav__links">
      { navElements.map(el => <li><a href={el.href}>{el.label}</a></li>) }
    </ul>
    <div class="site-nav__actions">
      { cta && <a class="site-nav__cta" href={cta.href}>{cta.label}</a> }
      <button class="site-nav__toggle" aria-label="Toggle dark mode" id="theme-toggle">☀</button>
    </div>
  </div>
</nav>
```

**Key CSS rules** (scoped to `Nav.astro`):

```css
.site-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background-color: rgba(255, 255, 255, 0.85);    /* light */
    border-bottom: 1px solid var(--color-border);
}

html[data-theme-mode="dark"] .site-nav {
    background-color: rgba(8, 12, 20, 0.9);
}

.site-nav__brand {
    color: var(--color-accent);
    font-weight: 800;
    font-size: 1.25rem;
    text-decoration: none;
}

.site-nav__cta {
    background: var(--gradient-brand);
    color: #FFFFFF;
    border-radius: var(--radius-pill);
    padding: 0.5rem 1.25rem;
    font-weight: 600;
    text-decoration: none;
}

.site-nav__toggle {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    font-size: 1rem;
}
```

### 3.4 `SiteTheme` Type Extension — `src/types/theme.ts`

**What changes**: Add four optional fields to support the full page-level dark mode palette. The existing interface already has `colorDarkBg` and `colorDarkText`; the following fields are genuinely missing and must be added:

```typescript
// Page-level dark mode palette overrides (new fields)
colorDarkSurface?:    string;   // default #0D1525
colorDarkBorder?:     string;   // default #1E2D45
colorDarkTextMuted?:  string;   // default #8892B0
colorDarkAccent?:     string;   // default #00CFFF
```

The existing `colorDarkBg` and `colorDarkText` fields are already present in `theme.ts` and must **not** be renamed or duplicated.

**`ThemeStyle.astro` must also be updated** to inject the new dark-mode tokens into `[data-theme="dark"]`. The updated `darkVars` array should map:

```typescript
const darkVars: [string, string | undefined][] = theme ? [
    ['--section-bg',         theme.colorDarkBg],
    ['--section-surface',    theme.colorDarkSurface],
    ['--section-border',     theme.colorDarkBorder],
    ['--section-text',       theme.colorDarkText],
    ['--section-text-muted', theme.colorDarkTextMuted],
] : [];
```

And a new `darkRootVars` block targeting `html[data-theme-mode="dark"] :root` (or inlined into `:root` conditionally) should inject `--color-accent: ${theme.colorDarkAccent}` when set.

**Accent cleanup**: Since `[data-theme="accent"]` is being removed from `tokens.scss` (see §3.1), also remove the `accentVars` array and the `accentBlock` template string from `ThemeStyle.astro`. They are dead code once the selector is gone and would generate orphaned CSS rules that target a selector no element will ever carry. The `css` assembly line must be updated accordingly (remove `accentBlock` from the array).

**Cascade contract**: The `[data-theme="dark"]` block in `tokens.scss` provides the fallback defaults for dark sections (always-dark Hero, Features). `ThemeStyle.astro` overrides those same properties at runtime when a `siteTheme` Contentful entry exists. Because both the SCSS defaults and the `ThemeStyle.astro` runtime overrides target the same `[data-theme="dark"]` selector, they are consistent — the SCSS values apply when no theme entry is present; the Contentful values win when one is.

---

## 4. Section Component Changes

### 4.1 `Hero.astro`

**File**: `src/components/sections/Hero.astro`

**Current state**: Renders `hero__title`, `hero__subtitle`, `RichText(body)`, CTAs, optional media image. Supports `layout` variants (center/left/right/split) and `data-theme`.

**Required changes**:

1. **Full viewport height**: Add `min-height: 100vh` and `display: flex; align-items: center` to `.hero` when `section.theme === 'dark'` (the Hero is always dark). Add class `.hero--full-vh` for this.

2. **Background gradient**: When `section.theme === 'dark'`, replace `background-color: var(--section-bg)` with `background: var(--gradient-hero-dark)`.

3. **Eyebrow label**: `section.subtitle` is repurposed as the eyebrow label rendered above the `<h1>` as a `<span class="hero__eyebrow">`. The actual subtitle paragraph (longer text block) comes from `section.body` via `RichText`.

   Current rendering order: `title → subtitle → body → CTAs`
   New rendering order: `subtitle (as eyebrow) → title → body → CTAs`

4. **Scroll arrow**: Add a `<div class="hero__scroll-arrow">` containing a `↓` character rendered at the bottom of `.hero` (via absolute positioning). Animate with `@keyframes bounce`.

5. **CSS for gradient background** (added to scoped `<style>`):

```css
.hero[data-theme="dark"] {
    background: var(--gradient-hero-dark);
    min-height: 100vh;
    display: flex;
    align-items: center;
}

.hero__eyebrow {
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-accent);
}

.hero__scroll-arrow {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.5rem;
    color: var(--color-accent);
    animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50%       { transform: translateX(-50%) translateY(8px); }
}
```

6. **Positioning context**: Add `position: relative` to `.hero` to contain the absolutely positioned scroll arrow.

### 4.2 `TextSection.astro`

**File**: `src/components/sections/TextSection.astro`

**Current state**: Renders title, subtitle, `RichText(body)`, CTAs. Supports `layout: 'split'` which puts a form alongside the content. Padding/margin via tokens.

**Required changes**:

1. **Two-column layout for `layout: 'left'`**: The About section uses `layout: 'left'`. Currently `left` layout has no special two-column handling in `TextSection` (only `split` does). Add a `.text-section--two-col` modifier that fires when `section.layout === 'left'` and splits content 50/50 — but since the About section has no second column content, the "second column" is the body text itself while the title/subtitle/eyebrow occupy the left column.

   Alternatively (simpler): treat `layout: 'left'` in `TextSection` the same as the current `split` layout — flex-row with `flex: 1` on each child. The content div gets title + subtitle + eyebrow; a second `.text-section__body` div gets the `RichText(body)`.

2. **Cyan left border accent**: Add a left border rule when `layout === 'left'`:

```css
.text-section--left .text-section__content {
    border-left: 3px solid var(--color-accent);
    padding-left: 1.5rem;
}
```

3. **Eyebrow label**: `section.subtitle` is the eyebrow ("QUIÉNES SOMOS") — render as `<span class="text-section__eyebrow">` above `<h2>`. The body paragraph content comes from `section.body` (rich text).

4. **Layout modifier class**: Change the existing class assignment to include `text-section--left` when `section.layout === 'left'`:

```astro
<section
  class={`text-section ${section.layout === 'left' ? 'text-section--left' : ''} ${isSplit ? 'text-section--split' : ''}`}
  data-theme={section.theme}
>
```

5. **Two-column CSS**:

```css
.text-section--left .text-section__inner {
    flex-direction: row;
    align-items: flex-start;
    gap: 4rem;
}

.text-section--left .text-section__content {
    flex: 0 0 40%;
}

.text-section--left .text-section__body-col {
    flex: 1;
}

@media (max-width: 767px) {
    .text-section--left .text-section__inner {
        flex-direction: column;
    }
}
```

The `text-section__body-col` div is a new wrapper around `<RichText doc={section.body} />` rendered only when `layout === 'left'`.

### 4.3 `Cards.astro`

**File**: `src/components/sections/Cards.astro`

**Current state**: Renders a header (title + subtitle), then an auto-fill grid of cards. Each card has: media, icon, title, subtitle, `RichText(body)`, CTAs.

**Required changes**:

The Solutions cards require structured list content inside each card: capability bullets (✓ checkmarks) and strategic value items (→ arrows). This content is stored in the Contentful `item.body` rich text field as an unordered list. `RichText.astro` renders `<ul>/<li>` already, so no structural change to `Cards.astro` is needed — the visual styling must be applied.

1. **Card icon rendering — emoji support**: The existing `Cards.astro` renders icons as `<span class={`icon--${item.icon}`} />`, treating `item.icon` as a CSS class name. Because `item.icon` now contains emoji strings (`🔗`, `📞`, `💱`), this must be changed to render the emoji as text content:

   ```astro
   {item.icon && <span class="card__icon">{item.icon}</span>}
   ```

   Remove any `class={`icon--${item.icon}`}` pattern from `Cards.astro`.

2. **Card icon sizing**: Increase `.card__icon` to `2rem` and render it inside a styled badge:

```css
.card__icon {
    font-size: 2rem;
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 180, 255, 0.1);
    border-radius: var(--radius-lg);
    margin-bottom: 0.75rem;
}
```

2. **Card border accent**: Add a top border gradient on `.card`:

```css
.card {
    border-top: 2px solid transparent;
    background-image: var(--gradient-brand);
    background-origin: border-box;
    /* Use outline trick instead — simpler: */
    border-top: 2px solid var(--color-accent);
}
```

   Simple approach: `border-top: 2px solid var(--color-accent)` on `.card`.

3. **Grid column count**: Pin to exactly 3 columns on desktop for the 3-card layout:

```css
.cards-section__grid {
    grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 900px) {
    .cards-section__grid {
        grid-template-columns: 1fr;
    }
}
```

4. **List styling inside card body**: The `RichText.astro` renders `<ul>` inside `.card__body`. Scope styles:

```css
.card__body :global(ul) {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.card__body :global(li) {
    font-size: 0.875rem;
    color: var(--section-text-muted);
    padding-left: 1.25rem;
    position: relative;
}

.card__body :global(li::before) {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--color-accent);
}
```

   For the strategic value items (arrows), the Contentful body will use two separate `<ul>` blocks with a `<h4>` separator. The `→` prefix is added via the same `::before` trick on a second list, or by using a different list marker character in Contentful.

### 4.4 `Features.astro`

**File**: `src/components/sections/Features.astro`

**Current state**: Renders header (title + subtitle + body), then an `auto-fill` grid of feature items (icon + title + subtitle).

**Required changes**:

1. **Feature icon rendering — emoji support**: The existing `Features.astro` renders icons as `<span class={`icon--${item.icon}`} />`. Because `item.icon` contains emoji strings (`⚡`, `🔄`, `🌎`, `📊`, `🤖`, `🤝`), change this to render the emoji as text content:

   ```astro
   {item.icon && <span class="feature__icon">{item.icon}</span>}
   ```

   Remove any `class={`icon--${item.icon}`}` pattern from `Features.astro`.

2. **Always-dark background**: The "Why Digital Hub" section must always display with the dark navy background regardless of the page-level light/dark mode toggle. This is already handled by setting `section.theme = 'dark'` in the Contentful entry — `data-theme="dark"` on the `<section>` element will apply `--section-bg: #080C14` via the token override. No code change needed for this; confirm that `[data-theme="dark"]` CSS specificity beats `html[data-theme-mode="dark"]` for dark→dark (it does, since they're the same values).

2. **Split layout — header left, grid right**: The "Why Digital Hub" section layout is `split`: header content occupies the left column, the 2×3 feature grid occupies the right column. Add a `.features--split` modifier:

```css
.features--split .features__inner {
    flex-direction: row;
    align-items: flex-start;
    gap: 4rem;
}

.features--split .features__header {
    flex: 0 0 35%;
    text-align: left;
}

.features--split .features__grid {
    flex: 1;
    grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 900px) {
    .features--split .features__inner {
        flex-direction: column;
    }
}
```

Apply when `section.layout === 'split'` via class:

```astro
<section
  class={`features ${section.layout === 'split' ? 'features--split' : ''}`}
  data-theme={section.theme}
>
```

3. **Tech orb graphic (right column)**: The design shows a CSS-only decorative graphic in the right column alongside the grid. Since this is complex and not data-driven, it is implemented as an inline CSS element rendered conditionally when `section.layout === 'split'`. Add a `<div class="features__orb" aria-hidden="true">` after `features__grid`:

```css
.features__orb {
    position: absolute;
    right: -2rem;
    bottom: 2rem;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(0, 180, 255, 0.15), rgba(255, 45, 122, 0.05) 60%, transparent);
    border: 1px solid rgba(0, 180, 255, 0.2);
    pointer-events: none;
}
```

   Wrap `features__grid` + `features__orb` in a `<div class="features__right" style="position:relative">`.

4. **Italic quote**: `section.body` (rich text) contains the italic quote. `RichText.astro` renders `<em>` for italic text. The quote appears below the eyebrow/title in the left column. Style via:

```css
.features--split .features__header :global(em) {
    display: block;
    font-style: italic;
    color: var(--section-text-muted);
    margin-top: 1.5rem;
    font-size: 0.9375rem;
    line-height: 1.7;
    border-left: 2px solid var(--color-accent);
    padding-left: 1rem;
}
```

5. **Subtitle as eyebrow**: Same pattern as Hero/Text — `section.subtitle` is the eyebrow label ("POR QUÉ DIGITAL HUB"), rendered as `<span class="features__eyebrow">`.

### 4.5 `Stats.astro`

**File**: `src/components/sections/Stats.astro`

**Current state**: Renders header (title + subtitle + body), then a grid of stat items with `stat__value`, `stat__label`, `stat__description`. Values are plain text strings from `item.value`.

**Required changes**:

1. **Counter animation**: Replace static `{item.value}` with a `<span>` that carries `data-count-target` and `data-count-prefix`/`data-count-suffix` attributes. A `<script>` block uses `IntersectionObserver` to trigger counting when the stats section enters the viewport.

   The `item.value` strings are: `"500+"`, `"15"`, `"$2B+"`, `"98%"`. Parse logic:
   - Strip prefix characters that are not digits (e.g., `$`)
   - Strip suffix characters that are not digits (e.g., `+`, `%`, `B+`)
   - Count from 0 to the numeric portion
   - Re-attach prefix/suffix on each frame

2. **Counter attribute pattern**:

```astro
<span
  class="stat__value"
  data-count-target={item.value}
  aria-label={item.value}
>
  {item.value}
</span>
```

3. **Client-side script** (in `<script>` block at bottom of `Stats.astro`):

```javascript
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function parseTarget(raw) {
  const match = raw.match(/^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/);
  if (!match) return { prefix: '', end: 0, suffix: raw };
  return { prefix: match[1], end: parseFloat(match[2]), suffix: match[3] };
}

function animateCounter(el) {
  const raw = el.dataset.countTarget;
  if (!raw) return;
  const { prefix, end, suffix } = parseTarget(raw);
  const duration = 2000;
  const start = performance.now();
  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutQuart(progress) * end);
    el.textContent = prefix + value + suffix;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = raw; // snap to exact value
  }
  requestAnimationFrame(frame);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count-target]').forEach(animateCounter);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stats').forEach(el => observer.observe(el));
```

4. **Gradient accent on values**: Apply gradient text styling to `.stat__value`:

```css
.stat__value {
    background: var(--gradient-brand);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

### 4.6 `Form.astro`

**File**: `src/components/sections/Form.astro`

**Current state**: Receives a `Form` prop, wraps `FormRenderer.astro` in a `.standalone-form` section with `data-theme={form.theme}`. Max-width `40rem` centered. No header.

**Required changes**:

1. **Section header**: `FormRenderer.astro` already renders `form.title` and `form.subtitle` — do **not** add a second title/subtitle render in `Form.astro`. Doing so would display the title and subtitle twice. Instead, apply the visual styling (size, spacing, center alignment) for the title and subtitle via scoped styles in `FormRenderer.astro`, or via `:global()` selectors in `Form.astro` targeting `FormRenderer`'s existing title elements:

```css
/* In Form.astro scoped <style> */
.standalone-form :global(.form-renderer__title) {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 0.5rem;
}

.standalone-form :global(.form-renderer__subtitle) {
    color: var(--section-text-muted);
    text-align: center;
    margin-bottom: 2rem;
}
```

2. **Center layout**: The contact section is centered with max-width `48rem`. Update `.standalone-form__inner`:

```css
.standalone-form__inner {
    max-width: 48rem;
    margin: 0 auto;
    text-align: center;
}
```

3. **Dark variant styles**: When `form.theme === 'dark'`, the `data-theme="dark"` on the `<section>` already applies the dark section tokens. Ensure `FormRenderer.astro` input fields pick up token-based borders and backgrounds. Add to `Form.astro` scoped styles:

```css
.standalone-form[data-theme="dark"] :global(input),
.standalone-form[data-theme="dark"] :global(textarea) {
    background-color: var(--section-surface);
    border-color: var(--section-border);
    color: var(--section-text);
}
```

4. **Submit button gradient**: The "Enviar Mensaje" submit button should use the gradient pill style:

```css
.standalone-form :global(button[type="submit"]) {
    background: var(--gradient-brand);
    color: #FFFFFF;
    border: none;
    border-radius: var(--radius-pill);
    padding: 0.75rem 2rem;
    font-weight: 600;
    cursor: pointer;
    font-size: 1rem;
}
```

---

## 5. Contentful Content Entries

All entries target space `b29bkr806w5b`, environment `master`. Listed in creation dependency order (items/CTAs before sections, sections before page).

### 5.1 `siteTheme` entry

| Field | Value |
|---|---|
| `colorBg` | `#FFFFFF` |
| `colorSurface` | `#F8F9FF` |
| `colorBorder` | `#E2E6F0` |
| `colorText` | `#0A0A1A` |
| `colorTextMuted` | `#5A6080` |
| `colorAccent` | `#00B4FF` |
| `colorDarkBg` | `#080C14` |
| `colorDarkText` | `#F0F4FF` |
| `fontHeading` | `Inter` |
| `fontBody` | `Inter` |

### 5.2 `nav` entry

| Field | Value |
|---|---|
| Brand label | `Digital Hub` |
| Brand href | `/` |
| Nav links | 4 elements (see below) |
| CTA | 1 CTA entry (see below) |

Nav element entries (type: `navElement` or inline, depending on Contentful content model):

| Label | href |
|---|---|
| Infraestructura | `#about` |
| Soluciones | `#solutions` |
| Tecnología | `#why` |
| Nosotros | `#about` |

CTA entry for Nav:

| Field | Value |
|---|---|
| `label` | `Conectar` |
| `href` | `/contact` |
| `variant` | `primary` |

### 5.3 CTA entries (shared)

| ID alias | label | href | variant |
|---|---|---|---|
| `cta-hero-primary` | Explorar Soluciones | `#solutions` | `primary` |
| `cta-hero-secondary` | Conocer Más | `#about` | `secondary` |
| `cta-affilia` | Explorar AFFILIA | `#solutions` | `ghost` |
| `cta-ppc` | Explorar Pay Per Call | `#solutions` | `ghost` |
| `cta-pingpost` | Explorar Ping Post | `#solutions` | `ghost` |

### 5.4 `item` entries — Solution Cards

**Card 1: AFFILIA**

| Field | Value |
|---|---|
| `type` | `card` |
| `title` | `AFFILIA` |
| `subtitle` | `Affiliate Infrastructure at Scale` |
| `icon` | `🔗` |
| `body` (rich text) | See content below |
| `ctas` | `cta-affilia` |

Body rich text content:

```
Capabilities
• Managed affiliate network with publisher quality controls
• Multi-vertical offer distribution (finance, insurance, health, home services)
• Custom tracking & attribution infrastructure
• Publisher performance scoring and automated optimization
• Fraud detection and traffic quality enforcement

Strategic Value
→ Predictable CPA-based acquisition costs
→ Scalable traffic volume without linear cost increases
→ Diversified publisher base reduces concentration risk
→ Real-time reporting dashboard for all stakeholders
→ Dedicated publisher success management
```

**Card 2: PAY PER CALL**

| Field | Value |
|---|---|
| `type` | `card` |
| `title` | `PAY PER CALL` |
| `subtitle` | `High-Intent Acquisition Engine` |
| `icon` | `📞` |
| `body` (rich text) | See content below |
| `ctas` | `cta-ppc` |

Body rich text content:

```
Capabilities
• Inbound call routing and intelligent IVR systems
• Real-time call scoring and quality verification
• Multi-buyer call marketplace with dynamic pricing
• Geographic and demographic targeting for call traffic
• Compliance-first call recording and documentation

Strategic Value
→ Highest-intent buyer signals in performance marketing
→ Direct buyer-to-seller connections without intermediaries
→ Dynamic CPL pricing based on verified call quality
→ Scalable across verticals: insurance, legal, medical, home
→ Real-time conversion data for continuous optimization
```

**Card 3: PING POST**

| Field | Value |
|---|---|
| `type` | `card` |
| `title` | `PING POST` |
| `subtitle` | `Real-Time Lead Marketplace Infrastructure` |
| `icon` | `💱` |
| `body` (rich text) | See content below |
| `ctas` | `cta-pingpost` |

Body rich text content:

```
Capabilities
• Real-time lead bidding and distribution infrastructure
• Multi-buyer auction system with configurable priority tiers
• Lead data validation and enrichment pipeline
• Vertical-specific routing rules (insurance, finance, solar)
• Compliance screening and TCPA/DNC enforcement

Strategic Value
→ Maximum revenue per lead through competitive bidding
→ Automated lead quality scoring reduces manual review
→ Flexible buyer caps and budget management
→ API-first integration with all major CRM platforms
→ Complete data lineage and audit trail for compliance
```

### 5.5 `item` entries — Feature Items (Why Digital Hub)

| `type` | `title` | `icon` |
|---|---|---|
| `feature` | Proprietary Technology Stack | `⚡` |
| `feature` | Multi-Model Acquisition Engines | `🔄` |
| `feature` | Cross-Border Operations | `🌎` |
| `feature` | Data-First Culture | `📊` |
| `feature` | Automated Optimization Systems | `🤖` |
| `feature` | Long-Term Strategic Partnerships | `🤝` |

Each feature item has no `body` or `subtitle` — title only.

### 5.6 `item` entries — Stat Items

| `type` | `value` | `title` |
|---|---|---|
| `stat` | `500+` | `Clientes Activos` |
| `stat` | `15` | `Mercados` |
| `stat` | `$2B+` | `Revenue Optimizado` |
| `stat` | `98%` | `Retención` |

### 5.7 `section` entries

**Hero section**

| Field | Value |
|---|---|
| `kind` | `section` |
| `type` | `hero` |
| `theme` | `dark` |
| `layout` | `center` |
| `title` | `We Build Revenue Infrastructure.` |
| `subtitle` | `PERFORMANCE MARKETING INFRASTRUCTURE` |
| `body` (rich text) | Digital Hub is a multi-model performance infrastructure operating across LATAM and the US — integrating Affiliate Networks, Pay Per Call and Real-Time Lead Distribution through proprietary technology and intelligent optimization systems. |
| `ctas` | `cta-hero-primary`, `cta-hero-secondary` |

**About section**

| Field | Value |
|---|---|
| `kind` | `section` |
| `type` | `text` |
| `layout` | `left` |
| `title` | `We Are Not an Agency. We're Infrastructure.` |
| `subtitle` | `QUIÉNES SOMOS` |
| `body` (rich text) | Digital Hub was built to solve one problem: How to scale customer acquisition predictably. Today, we operate a multi-vertical performance infrastructure that connects advertisers, publishers and buyers through proprietary technology and measurable acquisition models. We design systems where traffic is controlled, data is actionable, revenue is optimized and performance is predictable. We don't manage campaigns. We architect acquisition ecosystems. Operating across LATAM and the United States, Digital Hub has evolved into a performance engine designed for scalability, automation and intelligent decisioning. |

**Solutions section**

| Field | Value |
|---|---|
| `kind` | `section` |
| `type` | `cards` |
| `title` | `Performance Models Powered by Proprietary Technology` |
| `subtitle` | `Our infrastructure is structured around three high-growth acquisition engines. Each one is designed to maximize revenue efficiency.` |
| `items` | AFFILIA card, PAY PER CALL card, PING POST card |

**Why Digital Hub section**

| Field | Value |
|---|---|
| `kind` | `section` |
| `type` | `features` |
| `theme` | `dark` |
| `layout` | `split` |
| `title` | `Infrastructure Over Intermediation.` |
| `subtitle` | `POR QUÉ DIGITAL HUB` |
| `body` (rich text) | Most companies act as intermediaries. We operate as infrastructure. We create acquisition environments where performance compounds over time. *(italic)* "We don't place ads. We build the systems that make performance marketing compoundable." |
| `items` | 6 feature items (see 5.5) |

**Stats section**

| Field | Value |
|---|---|
| `kind` | `section` |
| `type` | `stats` |
| `title` | `By the Numbers` |
| `items` | 4 stat items (see 5.6) |

### 5.8 `form` entry

| Field | Value |
|---|---|
| `kind` | `form` |
| `title` | `Ready to Plug Into Our Infrastructure?` |
| `subtitle` | `Let's build your acquisition ecosystem together.` |
| `type` | `contact` |
| `theme` | `dark` |
| `submitLabel` | `Enviar Mensaje` |
| `fields` | 3 fields (see below) |

Form fields:

| `label` | `name` | `type` | `placeholder` | `required` |
|---|---|---|---|---|
| Nombre | `name` | `text` | `Tu nombre completo` | `true` |
| Email | `email` | `email` | `tu@empresa.com` | `true` |
| Mensaje | `message` | `textarea` | `Cuéntanos sobre tu proyecto...` | `true` |

### 5.9 `page` entry (slug: `home`)

| Field | Value |
|---|---|
| `slug` | `home` |
| `seoTitle` | `Digital Hub — Revenue Infrastructure for Performance Marketing` |
| `seoDescription` | `Multi-model performance infrastructure operating across LATAM and the US. Affiliate networks, Pay Per Call and Real-Time Lead Distribution.` |
| `pageElements` | \[Hero section, About section, Solutions section, Why section, Stats section, Contact form\] — in this order |

**Important — duplicate route prevention**: The `home` slug is consumed exclusively by `src/pages/index.astro`, which already queries `cms.getPages()` and finds the entry with `slug === 'home'` to render at `/`. The `src/pages/[pages].astro` dynamic route also calls `cms.getPages()` and would generate a `/home` URL, creating a duplicate route that conflicts with `index.astro`.

To prevent this, `getStaticPaths` in `[pages].astro` must filter out the `home` slug:

```astro
export async function getStaticPaths() {
    const pages = await cms.getPages();
    return pages
        .filter(page => page.slug !== 'home')
        .map(page => ({
            params: { pages: page.slug },
            props: { page },
        }));
}
```

Alternatively, the Contentful adapter's `getPages()` implementation can be updated to exclude the `home` slug from its results, keeping the filtering in one place. Either approach is acceptable; the `[pages].astro` filter is preferred because it makes the exclusion explicit at the routing layer without changing adapter semantics.

### 5.10 `footer` entry

| Field | Value |
|---|---|
| Brand `href` | `/` |
| Brand `alt` | `Digital Hub` |
| `tagline` | `Revenue Infrastructure for Performance Marketing` |
| `copyright` | `© 2026 Digital Hub. All rights reserved.` |
| Column 1 title | `Navigation` |
| Column 1 links | Home `/`, Nosotros `#about`, Soluciones `#solutions`, Tecnología `#why` |
| Column 2 title | `Solutions` |
| Column 2 links | Affilia `#solutions`, Pay Per Call `#solutions`, Ping Post `#solutions` |

**Footer CSS additions** (in `Footer.astro` or equivalent):

```css
.footer {
    background-color: #050D1A;  /* always dark */
    color: #8892B0;
}

.footer::before {
    content: '';
    display: block;
    height: 2px;
    background: var(--gradient-brand);
}

.footer__brand {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-accent);
    text-decoration: none;
}
```

---

## 6. File Change Summary

| File | Change type | Description |
|---|---|---|
| `src/styles/tokens.scss` | **Full overhaul** | New Digital Hub palette, dark mode page tokens, `--gradient-brand`, `--gradient-hero-dark`, `--radius-pill` |
| `src/layouts/BaseLayout.astro` | **Update** | Inter-only Google Fonts URL, `data-theme-mode` on `<html>`, localStorage flash-prevention script |
| `src/types/theme.ts` | **Minor extension** | Add `colorDarkSurface`, `colorDarkBorder`, `colorDarkTextMuted`, `colorDarkAccent` optional fields (existing `colorDarkBg` and `colorDarkText` already present) |
| `src/components/ThemeStyle.astro` | **Update** | Extend `darkVars` to inject all dark section tokens (`colorDarkSurface`, `colorDarkBorder`, `colorDarkTextMuted`) |
| `src/components/Nav.astro` | **Create** | New file — dark mode toggle, gradient pill CTA, backdrop-blur sticky nav, toggle script; import into `BaseLayout.astro` above `<slot />` |
| `src/components/sections/Hero.astro` | **Update** | Full-vh dark gradient background, eyebrow label, scroll arrow |
| `src/components/sections/TextSection.astro` | **Update** | Two-column `layout: 'left'` support, cyan left border, eyebrow label |
| `src/components/sections/Cards.astro` | **Update** | Fixed 3-col grid, icon badge, card top accent border, list styling for bullets |
| `src/components/sections/Features.astro` | **Update** | Split layout, tech orb graphic, eyebrow label, italic quote styling |
| `src/components/sections/Stats.astro` | **Update** | Counter animation script, gradient text on values |
| `src/components/sections/Form.astro` | **Update** | Section header, dark variant input styles, gradient submit button |

No new files need to be created. No new Contentful content types are required.

---

## 7. Implementation Order

Execute in this order to avoid broken intermediate states:

1. **Tokens** (`tokens.scss`) — palette change takes effect everywhere immediately; existing pages may temporarily look different until Nav/sections are updated.
2. **BaseLayout** — font swap + dark mode infrastructure.
3. **Nav** — dark mode toggle becomes functional.
4. **Hero** — most visible section; validate gradient background + scroll arrow.
5. **TextSection** — About section.
6. **Cards** — Solutions section (most complex content).
7. **Features** — Why section (split layout + always-dark).
8. **Stats** — counter animation.
9. **Form** — Contact section.
10. **Contentful entries** — create in dependency order (CTAs → items → sections → form → page → theme → footer).
11. **`SiteTheme` type extension** — minor, can be done any time before Contentful migration.

---

## 8. Open Questions

1. **Contentful migration script**: This spec does not define a migration `.cjs` file for content entry creation. If entries are to be created programmatically (rather than via the Contentful UI), a migration file following the `YYYYMMDD-NN-name.cjs` naming convention should be authored separately.

The following items were previously listed as open questions and are now resolved:

- **`Nav.astro` existence** — resolved in §3.3: `Nav.astro` must be created and imported into `BaseLayout.astro` above `<slot />`.
- **`FormRenderer.astro` title rendering** — resolved in §4.6: `FormRenderer.astro` already renders `form.title` and `form.subtitle`; `Form.astro` must not duplicate them.
- **`[pages].astro` slug routing** — resolved in §5.9: `index.astro` owns the `home` slug; `[pages].astro` must filter it out.
- **`ThemeStyle.astro` dark mode injection** — resolved in §3.4: `ThemeStyle.astro` injects into `:root` (light tokens) and `[data-theme="dark"]` (dark section tokens); the SCSS `[data-theme="dark"]` block provides fallback defaults and `ThemeStyle.astro` overrides them at runtime from Contentful values.
