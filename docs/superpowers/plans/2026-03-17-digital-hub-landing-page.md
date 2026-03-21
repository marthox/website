# Digital Hub Landing Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Digital Hub landing page by updating the Astro design system, section components, and Nav to match the approved mockup, then populating the Contentful space with all required content entries.

**Architecture:** CSS custom-property design tokens are overhauled for Digital Hub's cyan/magenta/navy palette with `[data-theme="dark"]` for full dark mode. A new `Nav.astro` component is created and wired into `PageLayout.astro` (replacing the existing `Header` component). Six existing section components are updated to support the new layouts and icon rendering. All page content is managed via Contentful (space b29bkr806w5b).

**Tech Stack:** Astro 5, TypeScript, SCSS CSS custom properties, Contentful Management API (via CLI), `@contentful/rich-text-types`.

---

## Chunk 1: Design System & Foundation (Tasks 1-4)

These are the foundational changes everything else depends on.

### Task 1: Update design tokens (`src/styles/tokens.scss`)

**Goal:** Replace the warm-brown `#8B6F47` palette with Digital Hub's cyan/magenta/navy palette. Keep all variable names intact so components do not break.

- [ ] Open `src/styles/tokens.scss`.

- [ ] Replace the entire `:root` block with:

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

    --radius-sm:   0.25rem;
    --radius-md:   0.375rem;
    --radius-lg:   0.5rem;
    --radius-pill: 50px;

    // Gradient definitions (referenced by components)
    --gradient-brand:     linear-gradient(135deg, #00B4FF, #FF2D7A);
    --gradient-hero-dark: linear-gradient(135deg, #0D1B2A, #1B3A5C, #0D2240);
}
```

- [ ] Replace the `:root, [data-theme="light"]` block with:

```scss
:root,
[data-theme="light"] {
    --section-bg:           var(--color-bg);
    --section-surface:      var(--color-surface);
    --section-border:       var(--color-border);
    --section-text:         var(--color-text);
    --section-text-muted:   var(--color-text-muted);

    --btn-primary-bg:       var(--color-accent);
    --btn-primary-text:     #FFFFFF;
    --btn-secondary-border: var(--color-text);
    --btn-secondary-text:   var(--color-text);
    --btn-ghost-text:       var(--color-accent);
}
```

- [ ] Replace the `[data-theme="dark"]` block with:

```scss
[data-theme="dark"] {
    --section-bg:           #080C14;
    --section-surface:      #0D1525;
    --section-border:       #1E2D45;
    --section-text:         #F0F4FF;
    --section-text-muted:   #8892B0;

    --btn-primary-bg:       #00CFFF;
    --btn-primary-text:     #080C14;
    --btn-secondary-border: #F0F4FF;
    --btn-secondary-text:   #F0F4FF;
    --btn-ghost-text:       #00CFFF;
}
```

- [ ] Remove the entire `[data-theme="accent"]` block (dead code — no element will carry this attribute in the Digital Hub project).

- [ ] Add a new page-level dark mode block at the end of the file:

```scss
// Page-level dark mode — applied to <html data-theme-mode="dark">
html[data-theme-mode="dark"] {
    --color-bg:           #080C14;
    --color-surface:      #0D1525;
    --color-border:       #1E2D45;
    --color-text:         #F0F4FF;
    --color-text-muted:   #8892B0;
    --color-accent:       #00CFFF;
}
```

- [ ] Verify: `cd /Users/marthox/Dev/website/.claude/worktrees/vigilant-bose && npx tsc --noEmit`
  - Expected: zero TypeScript errors.
- [ ] Verify: `npm test`
  - Expected: all 65 tests pass.

- [ ] Commit:
  ```bash
  git add src/styles/tokens.scss
  git commit -m "feat: overhaul design tokens for Digital Hub cyan/magenta/navy palette"
  ```

---

### Task 2: Update `theme.ts` (`src/types/theme.ts`)

**Goal:** Add four optional fields for the full page-level dark mode palette. The existing `colorDarkBg` and `colorDarkText` fields are already present — do not rename or duplicate them.

- [ ] Open `src/types/theme.ts`.

- [ ] Add the four new optional fields after the existing `colorDarkText?` line:

```typescript
export interface SiteTheme {
    // Base palette
    colorBg?:         string;
    colorSurface?:    string;
    colorBorder?:     string;
    colorText?:       string;
    colorTextMuted?:  string;
    colorAccent?:     string;

    // Dark section variant (existing)
    colorDarkBg?:     string;
    colorDarkText?:   string;

    // Dark section variant — new extended fields
    colorDarkSurface?:   string;   // default #0D1525
    colorDarkBorder?:    string;   // default #1E2D45
    colorDarkTextMuted?: string;   // default #8892B0
    colorDarkAccent?:    string;   // default #00CFFF

    // Accent section variant (kept for adapter compatibility — not used by Digital Hub)
    colorAccentBg?:   string;
    colorAccentText?: string;

    // Typography
    fontHeading?: string;
    fontBody?:    string;
}
```

- [ ] Verify: `npx tsc --noEmit`
  - Expected: zero TypeScript errors.

- [ ] Commit:
  ```bash
  git add src/types/theme.ts
  git commit -m "feat: add colorDarkSurface/Border/TextMuted/Accent fields to SiteTheme"
  ```

---

### Task 3: Update `ThemeStyle.astro` (`src/components/ThemeStyle.astro`)

**Goal:** Extend `darkVars` to map the four new `SiteTheme` fields added in Task 2. Remove dead `accentVars`/`accentBlock` code. Update the CSS assembly.

> Note: Task 3 depends on Task 2 (`theme.ts` must have the new fields before `ThemeStyle.astro` can reference them). Execute Task 2 first, then return here.

- [ ] Open `src/components/ThemeStyle.astro`.

- [ ] Replace the `darkVars` array with:

```typescript
const darkVars: [string, string | undefined][] = theme ? [
    ['--section-bg',         theme.colorDarkBg],
    ['--section-surface',    theme.colorDarkSurface],
    ['--section-border',     theme.colorDarkBorder],
    ['--section-text',       theme.colorDarkText],
    ['--section-text-muted', theme.colorDarkTextMuted],
] : [];
```

- [ ] Add a new `darkAccentVars` block that targets `html[data-theme-mode="dark"]` to inject `--color-accent` when `colorDarkAccent` is set:

```typescript
const darkAccentVars: [string, string | undefined][] = theme ? [
    ['--color-accent', theme.colorDarkAccent],
] : [];
```

- [ ] Delete the `accentVars` array and the `accentBlock` constant entirely.

- [ ] Update the `darkBlock` constant to use the same `renderBlock` helper:

```typescript
const darkBlock       = renderBlock('[data-theme="dark"]',          darkVars);
const darkAccentBlock = renderBlock('html[data-theme-mode="dark"]', darkAccentVars);
```

- [ ] Update the `css` assembly line to remove `accentBlock` and add `darkAccentBlock`:

```typescript
const css = [rootBlock, darkBlock, darkAccentBlock].filter(Boolean).join('\n\n');
```

- [ ] Verify: `npx tsc --noEmit`
  - Expected: zero TypeScript errors.

- [ ] Commit:
  ```bash
  git add src/components/ThemeStyle.astro
  git commit -m "feat: extend ThemeStyle darkVars for full dark section tokens, remove dead accentBlock"
  ```

---

### Task 4: Create `Nav.astro` + update `PageLayout.astro`

**Files:** `src/components/Nav.astro` (new), `src/layouts/PageLayout.astro` (update)

**Goal:** Create a sticky, backdrop-blur Nav with the Digital Hub brand, nav links from CMS, a hardcoded gradient pill "Conectar" CTA, and a dark mode toggle. Wire it into PageLayout by replacing the existing `<Header>` component.

#### 4a. Create `src/components/Nav.astro`

- [ ] Create `src/components/Nav.astro` with the following content:

```astro
---
import type { NavBrand, NavElement, NavLink, NavMenu } from '@/types/nav';

interface Props {
    brand: NavBrand | null;
    elements: NavElement[];
}

const { brand, elements } = Astro.props;

// Type guards
function isNavMenu(el: NavElement): el is NavMenu {
    return 'submenu' in el;
}
function isNavLink(el: NavElement): el is NavLink {
    return 'href' in el && !('src' in el);
}
---

<nav class="site-nav" aria-label="Main navigation">
    <div class="site-nav__inner">
        <a class="site-nav__brand" href={brand?.href ?? '/'}>
            {brand?.label ?? 'Digital Hub'}
        </a>

        <ul class="site-nav__links" role="list">
            {elements.filter(isNavLink).map(el => (
                <li>
                    <a href={el.href} class="site-nav__link">{el.label}</a>
                </li>
            ))}
        </ul>

        <div class="site-nav__actions">
            <a class="site-nav__cta" href="#contact">Conectar</a>
            <button
                class="site-nav__toggle"
                id="theme-toggle"
                aria-label="Toggle dark mode"
                type="button"
            >
                ☀
            </button>
        </div>
    </div>
</nav>

<script>
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    function applyTheme(mode: string) {
        if (mode === 'dark') {
            html.dataset.themeMode = 'dark';
            if (toggle) toggle.textContent = '🌙';
        } else {
            delete html.dataset.themeMode;
            if (toggle) toggle.textContent = '☀';
        }
    }

    // Initialise from localStorage
    const saved = localStorage.getItem('theme') ?? 'light';
    applyTheme(saved);

    toggle?.addEventListener('click', () => {
        const current = html.dataset.themeMode === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
    });
</script>

<style>
    .site-nav {
        position: sticky;
        top: 0;
        z-index: 100;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        background-color: rgba(255, 255, 255, 0.85);
        border-bottom: 1px solid var(--color-border);
    }

    html[data-theme-mode="dark"] .site-nav {
        background-color: rgba(8, 12, 20, 0.9);
    }

    .site-nav__inner {
        max-width: var(--container-width, 1200px);
        margin: 0 auto;
        padding: 0.875rem var(--section-padding-x, 1.5rem);
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .site-nav__brand {
        color: var(--color-accent);
        font-weight: 800;
        font-size: 1.25rem;
        text-decoration: none;
        flex-shrink: 0;
    }

    .site-nav__links {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
        flex: 1;
    }

    .site-nav__link {
        color: var(--color-text);
        text-decoration: none;
        font-size: 0.9375rem;
        font-weight: 500;
        transition: color 0.15s;
    }

    .site-nav__link:hover {
        color: var(--color-accent);
    }

    .site-nav__actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-shrink: 0;
    }

    .site-nav__cta {
        background: var(--gradient-brand);
        color: #FFFFFF;
        border-radius: var(--radius-pill, 50px);
        padding: 0.5rem 1.25rem;
        font-weight: 600;
        font-size: 0.9375rem;
        text-decoration: none;
        transition: opacity 0.15s;
    }

    .site-nav__cta:hover {
        opacity: 0.88;
    }

    .site-nav__toggle {
        background: none;
        border: 1px solid var(--color-border);
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text);
        transition: border-color 0.15s;
    }

    .site-nav__toggle:hover {
        border-color: var(--color-accent);
    }

    @media (max-width: 767px) {
        .site-nav__links {
            display: none;
        }
    }
</style>
```

#### 4b. Update `src/layouts/PageLayout.astro`

- [ ] Open `src/layouts/PageLayout.astro`.

- [ ] Replace the existing `import Header from ...` line with `import Nav from "@components/Nav.astro";` — do NOT add a second `getNavigation()` call, it is already present in this file.

- [ ] Replace the existing `<Header brandElement={navBrand} navElements={navElements} />` with:

```astro
<Nav brand={navBrand} elements={navElements} />
```

- [ ] Verify: `npx tsc --noEmit`
  - Expected: zero TypeScript errors.
- [ ] Verify: `npm test`
  - Expected: all 65 tests pass.

- [ ] Commit:
  ```bash
  git add src/components/Nav.astro src/layouts/PageLayout.astro
  git commit -m "feat: create Nav.astro with dark mode toggle, wire into PageLayout replacing Header"
  ```

---

## Chunk 2: Section Components (Tasks 5-11)

Update each section component for Digital Hub layouts and icon rendering. No new content types required.

### Task 5: Update `Hero.astro` (`src/components/sections/Hero.astro`)

**Goal:** Full-viewport dark gradient background, eyebrow label from `subtitle`, animated scroll arrow at bottom center.

- [ ] Open `src/components/sections/Hero.astro`.

- [ ] Update the template to render `section.subtitle` as an eyebrow above `<h1>`, and to add the scroll arrow. The rendering order changes from `title → subtitle → body → CTAs` to `subtitle (eyebrow) → title → body → CTAs`:

```astro
<section class={`hero ${layoutClass}`} data-theme={section.theme}>
    <div class="hero__inner">
        <div class="hero__content">
            {section.subtitle && <span class="hero__eyebrow">{section.subtitle}</span>}
            {section.title && <h1 class="hero__title">{section.title}</h1>}
            <RichText doc={section.body} />
            {section.ctas && section.ctas.length > 0 && (
                <div class="hero__ctas">
                    {section.ctas.map(cta => (
                        <a
                            href={cta.href}
                            class={`hero__cta hero__cta--${cta.variant ?? 'primary'}`}
                            target={cta.openInNewTab ? '_blank' : undefined}
                            rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
                        >
                            {cta.icon && <span aria-hidden="true">{cta.icon}</span>}
                            {cta.label}
                        </a>
                    ))}
                </div>
            )}
        </div>
        {section.mediaUrl && (
            <div class="hero__media">
                <img src={section.mediaUrl} alt={section.title ?? ''} class="hero__image" />
            </div>
        )}
    </div>
    <div class="hero__scroll-arrow" aria-hidden="true">↓</div>
</section>
```

- [ ] Add `position: relative` to `.hero` base rule.

- [ ] Add the following CSS rules to the `<style>` block:

```css
.hero {
    position: relative;
}

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

- [ ] Remove the `<span class={`icon icon--${cta.icon}`} aria-hidden="true" />` pattern for CTA icons — replace with `{cta.icon && <span aria-hidden="true">{cta.icon}</span>}` (already done in template above).

- [ ] Verify: `npx tsc --noEmit`
  - Expected: zero TypeScript errors.

- [ ] Commit:
  ```bash
  git add src/components/sections/Hero.astro
  git commit -m "feat: update Hero for full-vh dark gradient, eyebrow label, scroll arrow"
  ```

---

### Task 6: Update `TextSection.astro` (`src/components/sections/TextSection.astro`)

**Goal:** Add two-column `layout: 'left'` support with cyan left border accent and eyebrow label from `subtitle`.

- [ ] Open `src/components/sections/TextSection.astro`.

- [ ] Update the `isSplit` constant and add an `isLeft` constant:

```typescript
const isSplit = section.layout === 'split' && section.form;
const isLeft  = section.layout === 'left';
```

- [ ] Update the `<section>` element class to include the `text-section--left` modifier:

```astro
<section
  class={`text-section ${isLeft ? 'text-section--left' : ''} ${isSplit ? 'text-section--split' : ''}`}
  data-theme={section.theme}
>
```

- [ ] After changing `subtitle` to render as `.text-section__eyebrow`, remove the now-dead `.text-section__subtitle` CSS rule from the `<style>` block.

- [ ] Update the template to render `section.subtitle` as eyebrow and add a `text-section__body-col` wrapper when `isLeft`:

```astro
<div class="text-section__inner">
    <div class="text-section__content">
        {section.subtitle && <span class="text-section__eyebrow">{section.subtitle}</span>}
        {section.title && <h2 class="text-section__title">{section.title}</h2>}
        {!isLeft && <RichText doc={section.body} />}
        {section.ctas && section.ctas.length > 0 && (
            <div class="text-section__ctas">
                {section.ctas.map(cta => (
                    <a
                        href={cta.href}
                        class={`text-section__cta text-section__cta--${cta.variant ?? 'primary'}`}
                        target={cta.openInNewTab ? '_blank' : undefined}
                        rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
                    >
                        {cta.label}
                    </a>
                ))}
            </div>
        )}
    </div>
    {isLeft && (
        <div class="text-section__body-col">
            <RichText doc={section.body} />
        </div>
    )}
    {section.form && (
        <div class="text-section__form">
            <FormRenderer form={section.form} />
        </div>
    )}
</div>
```

- [ ] Add the following CSS rules:

```css
.text-section__eyebrow {
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-accent);
}

.text-section--left .text-section__inner {
    flex-direction: row;
    align-items: flex-start;
    gap: 4rem;
}

.text-section--left .text-section__content {
    flex: 0 0 40%;
    border-left: 3px solid var(--color-accent);
    padding-left: 1.5rem;
}

.text-section--left .text-section__body-col {
    flex: 1;
}

@media (max-width: 767px) {
    .text-section--left .text-section__inner {
        flex-direction: column;
    }

    .text-section--left .text-section__content {
        border-left: none;
        padding-left: 0;
        border-top: 3px solid var(--color-accent);
        padding-top: 1rem;
    }
}
```

- [ ] Verify: `npx tsc --noEmit`
  - Expected: zero TypeScript errors.

- [ ] Commit:
  ```bash
  git add src/components/sections/TextSection.astro
  git commit -m "feat: add two-column layout:left support with eyebrow and cyan border to TextSection"
  ```

---

### Task 7: Update `Cards.astro` (`src/components/sections/Cards.astro`)

**Goal:** Change icon rendering from CSS class to text content (emoji support), add icon badge, pin 3-column grid, add card top border accent, add list styling for rich text bullets.

- [ ] Open `src/components/sections/Cards.astro`.

- [ ] Change the icon rendering in the card template from the CSS-class pattern to text content:

  **Before:**
  ```astro
  {item.icon && <span class={`card__icon icon icon--${item.icon}`} aria-hidden="true" />}
  ```

  **After:**
  ```astro
  {item.icon && <span class="card__icon" aria-hidden="true">{item.icon}</span>}
  ```

- [ ] Update `.card__icon` styles and add the gradient badge background:

```css
.card__icon {
    font-size: 2rem;
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 180, 255, 0.1);
    border-radius: var(--radius-lg, 0.5rem);
    margin-bottom: 0.75rem;
    flex-shrink: 0;
}
```

- [ ] Add cyan top border accent to `.card`:

```css
.card {
    border-top: 2px solid var(--color-accent);
    /* existing rules continue below */
    border-inline: 1px solid var(--section-border);
    border-bottom: 1px solid var(--section-border);
    border-radius: var(--radius-lg, 0.5rem);
    background-color: var(--section-surface);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s, border-top-color 0.2s;
}

.card:hover {
    box-shadow: 0 8px 32px rgba(0, 180, 255, 0.12);
}
```

- [ ] Pin the grid to 3 columns on desktop:

```css
.cards-section__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

@media (max-width: 900px) {
    .cards-section__grid {
        grid-template-columns: 1fr;
    }
}
```

- [ ] Add list styling for `RichText` output inside card body:

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
    line-height: 1.5;
}

.card__body :global(li::before) {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--color-accent);
    font-weight: 600;
}

.card__body :global(h4) {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-accent);
    margin: 1rem 0 0.25rem;
}
```

- [ ] Verify: `npx tsc --noEmit`
  - Expected: zero TypeScript errors.

- [ ] Commit:
  ```bash
  git add src/components/sections/Cards.astro
  git commit -m "feat: update Cards with emoji icons, gradient badge, 3-col grid, list styling"
  ```

---

### Task 8: Update `Features.astro` (`src/components/sections/Features.astro`)

**Goal:** Add `layout: 'split'` two-column support (header left, 2×3 grid right with CSS orb), change icon rendering to text content, add eyebrow label from `subtitle`, add italic quote styling from `body`.

- [ ] Open `src/components/sections/Features.astro`.

- [ ] Add a `isSplit` constant in the frontmatter:

```typescript
const isSplit = section.layout === 'split';
```

- [ ] Update the `<section>` element:

```astro
<section
  class={`features ${isSplit ? 'features--split' : ''}`}
  data-theme={section.theme}
>
```

- [ ] Update the template to include: eyebrow from `subtitle`, `RichText(body)` inside the header (left column), and wrap grid + orb in `.features__right`:

```astro
<div class="features__inner">
    {(section.title || section.subtitle || section.body) && (
        <div class="features__header">
            {section.subtitle && <span class="features__eyebrow">{section.subtitle}</span>}
            {section.title && <h2 class="features__title">{section.title}</h2>}
            <RichText doc={section.body} />
        </div>
    )}
    {section.items && section.items.length > 0 && (
        <div class="features__right">
            <div class="features__grid">
                {section.items.map(item => (
                    <div class="feature">
                        {item.icon && (
                            <div class="feature__icon-wrap">
                                <span class="feature__icon" aria-hidden="true">{item.icon}</span>
                            </div>
                        )}
                        <div class="feature__content">
                            {item.title && <h3 class="feature__title">{item.title}</h3>}
                            {item.subtitle && <p class="feature__subtitle">{item.subtitle}</p>}
                            <RichText doc={item.body} />
                        </div>
                    </div>
                ))}
            </div>
            {isSplit && <div class="features__orb" aria-hidden="true" />}
        </div>
    )}
</div>
```

- [ ] Add the following CSS rules:

```css
.features__eyebrow {
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-accent);
}

/* Split layout */
.features--split .features__inner {
    flex-direction: row;
    align-items: flex-start;
    gap: 4rem;
}

.features--split .features__header {
    flex: 0 0 35%;
    text-align: left;
}

.features--split .features__right {
    flex: 1;
    position: relative;
}

.features--split .features__grid {
    grid-template-columns: repeat(2, 1fr);
}

/* Italic quote rendered via RichText <em> in body */
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

/* CSS orb decorative element */
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

@media (max-width: 900px) {
    .features--split .features__inner {
        flex-direction: column;
    }

    .features__orb {
        display: none;
    }
}
```

- [ ] Verify: `npx tsc --noEmit`
  - Expected: zero TypeScript errors.

- [ ] Commit:
  ```bash
  git add src/components/sections/Features.astro
  git commit -m "feat: update Features with split layout, emoji icons, orb graphic, italic quote"
  ```

---

### Task 9: Update `Stats.astro` (`src/components/sections/Stats.astro`)

**Goal:** Add counter animation via IntersectionObserver + requestAnimationFrame (easeOutQuart, 2s), parse prefix/suffix from `item.value`, apply gradient text to stat numbers.

- [ ] Open `src/components/sections/Stats.astro`.

- [ ] Update the stat value rendering to add `data-count-target` and `aria-label` attributes:

```astro
{item.value && (
    <span
        class="stat__value"
        data-count-target={item.value}
        aria-label={item.value}
    >
        {item.value}
    </span>
)}
```

- [ ] Add gradient text CSS to `.stat__value`:

```css
.stat__value {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    line-height: 1;
    background: var(--gradient-brand);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
```

- [ ] Add dividers between stats in `.stats__grid`:

```css
.stats__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 2rem;
    text-align: center;
}

.stat + .stat {
    border-left: 1px solid var(--section-border);
    padding-left: 2rem;
}

@media (max-width: 600px) {
    .stat + .stat {
        border-left: none;
        padding-left: 0;
        border-top: 1px solid var(--section-border);
        padding-top: 1.5rem;
    }
}
```

- [ ] Add the counter animation `<script>` block at the end of the file (before the closing of any wrappers):

```astro
<script>
function easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4);
}

function parseTarget(raw: string): { prefix: string; end: number; suffix: string } {
    const match = raw.match(/^([^0-9]*)(\d+(?:\.\d+)?)([^0-9]*)$/);
    if (!match) return { prefix: '', end: 0, suffix: raw };
    return { prefix: match[1], end: parseFloat(match[2]), suffix: match[3] };
}

function animateCounter(el: Element): void {
    const raw = (el as HTMLElement).dataset.countTarget;
    if (!raw) return;
    const { prefix, end, suffix } = parseTarget(raw);
    const duration = 2000;
    const start = performance.now();
    function frame(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(easeOutQuart(progress) * end);
        el.textContent = prefix + value + suffix;
        if (progress < 1) requestAnimationFrame(frame);
        else el.textContent = raw; // snap to exact final value
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
</script>
```

- [ ] Verify: `npx tsc --noEmit`
  - Expected: zero TypeScript errors.

- [ ] Commit:
  ```bash
  git add src/components/sections/Stats.astro
  git commit -m "feat: add counter animation, gradient text, and dividers to Stats"
  ```

---

### Task 10: Update `Form.astro` (`src/components/sections/Form.astro`)

**Goal:** Widen `standalone-form__inner` to 48rem, add dark-variant input styles and gradient submit button via `:global()` selectors targeting `FormRenderer`'s existing markup.

> Note: `FormRenderer.astro` already renders `form.title` and `form.subtitle`. Do NOT add a second title/subtitle render in `Form.astro` — that would duplicate them on-page. Apply visual styling via `:global()` selectors only.

- [ ] Open `src/components/sections/Form.astro`.

- [ ] Update `.standalone-form__inner` max-width:

```css
.standalone-form__inner {
    max-width: 48rem;
    margin: 0 auto;
}
```

- [ ] Add scoped `:global()` overrides for FormRenderer title, dark inputs, and submit button:

```css
/* Center the form title and subtitle rendered by FormRenderer */
.standalone-form :global(.form__title) {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 0.5rem;
}

.standalone-form :global(.form__subtitle) {
    color: var(--section-text-muted);
    text-align: center;
    margin-bottom: 2rem;
}

/* Dark variant — ensure inputs pick up dark section tokens */
.standalone-form[data-theme="dark"] :global(input),
.standalone-form[data-theme="dark"] :global(textarea),
.standalone-form[data-theme="dark"] :global(select) {
    background-color: var(--section-surface);
    border-color: var(--section-border);
    color: var(--section-text);
}

/* Gradient pill submit button */
.standalone-form :global(button[type="submit"]) {
    background: var(--gradient-brand);
    color: #FFFFFF;
    border: none;
    border-radius: var(--radius-pill, 50px);
    padding: 0.75rem 2rem;
    font-weight: 600;
    cursor: pointer;
    font-size: 1rem;
    transition: opacity 0.15s;
}

.standalone-form :global(button[type="submit"]):hover {
    opacity: 0.88;
}
```

- [ ] Verify: `npx tsc --noEmit`
  - Expected: zero TypeScript errors.
- [ ] Verify: `npm test`
  - Expected: all 65 tests pass.

- [ ] Commit:
  ```bash
  git add src/components/sections/Form.astro
  git commit -m "feat: update Form with wider inner, dark input styles, gradient submit button"
  ```

---

### Task 11: Fix `[pages].astro` routing (`src/pages/[pages].astro`)

**Goal:** Prevent the `home` slug from generating a `/home` route that would conflict with `src/pages/index.astro` (which already renders `slug === 'home'` at `/`).

- [ ] Open `src/pages/[pages].astro`.

- [ ] Add `.filter(page => page.slug !== 'home')` in `getStaticPaths`:

```typescript
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

- [ ] Verify: `npx tsc --noEmit`
  - Expected: zero TypeScript errors.
- [ ] Verify: `npm test`
  - Expected: all 65 tests pass.

- [ ] Commit:
  ```bash
  git add src/pages/[pages].astro
  git commit -m "fix: exclude home slug from [pages].astro static paths to prevent duplicate route"
  ```

---

## Chunk 3: Contentful Content + Final Build (Tasks 12-15)

Populate the Contentful space (`b29bkr806w5b`, environment `master`) with all required content entries, then verify the full build.

### Task 12: Add migration for new siteTheme dark variant fields

**Goal:** Extend the `siteTheme` content type in Contentful to support the four new dark variant fields added to `SiteTheme` in Task 2.

- [ ] Create the migration file at `src/cms/adapters/contentful/migrations/20260321-12-site-theme-dark-fields.cjs` with the following content:

```javascript
module.exports = function (migration) {
  const siteTheme = migration.editContentType('siteTheme');

  siteTheme.createField('colorDarkSurface')
    .name('Dark Surface Color')
    .type('Symbol')
    .required(false);

  siteTheme.createField('colorDarkBorder')
    .name('Dark Border Color')
    .type('Symbol')
    .required(false);

  siteTheme.createField('colorDarkTextMuted')
    .name('Dark Muted Text Color')
    .type('Symbol')
    .required(false);

  siteTheme.createField('colorDarkAccent')
    .name('Dark Accent Color')
    .type('Symbol')
    .required(false);
};
```

- [ ] Run the migration:
  ```bash
  cd /Users/marthox/Dev/website/.claude/worktrees/vigilant-bose && /opt/homebrew/bin/contentful space migration --space-id b29bkr806w5b --environment-id master --yes src/cms/adapters/contentful/migrations/20260321-12-site-theme-dark-fields.cjs
  ```
  Expected: migration completes with no errors, 4 new fields added to `siteTheme`.

- [ ] Also update the `ContentfulSiteTheme` interface in `src/cms/adapters/contentful/types.ts` to include the four new fields:
  ```typescript
  colorDarkSurface?:   string;
  colorDarkBorder?:    string;
  colorDarkTextMuted?: string;
  colorDarkAccent?:    string;
  ```

- [ ] Commit:
  ```bash
  git add src/cms/adapters/contentful/migrations/20260321-12-site-theme-dark-fields.cjs src/cms/adapters/contentful/types.ts
  git commit -m "feat: add migration for siteTheme dark variant fields (colorDarkSurface/Border/TextMuted/Accent)"
  ```

---

### Task 13: Create `siteTheme` + `nav` entries in Contentful

**Target space:** `b29bkr806w5b`, environment: `master`

- [ ] Authenticate with Contentful CLI if not already done:
  ```bash
  /opt/homebrew/bin/contentful login
  ```

- [ ] Create the `siteTheme` entry using the Management API. Write and run a migration script at `src/cms/adapters/contentful/migrations/YYYYMMDD-NN-digital-hub-theme.cjs` (replace `YYYYMMDD-NN` following the sequential convention):

  The migration must create a `siteTheme` entry with:

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
  | `colorDarkSurface` | `#0D1525` |
  | `colorDarkBorder` | `#1E2D45` |
  | `colorDarkTextMuted` | `#8892B0` |
  | `colorDarkAccent` | `#00CFFF` |
  | `fontHeading` | `Inter` |
  | `fontBody` | `Inter` |

- [ ] Create 4 `navElement` entries (or inline nav links per the existing content model):

  | Label | href |
  |---|---|
  | Infraestructura | `#about` |
  | Soluciones | `#solutions` |
  | Tecnología | `#why` |
  | Nosotros | `#about` |

- [ ] Create a `nav` entry with:
  - Brand: upload a text-based brand asset OR skip navBrand (leave as null) — the Nav component already handles null brand by showing the text 'Digital Hub' as a fallback, href: `/`
  - `distribution`: `end`
  - `hamburgerPosition`: `right`
  - Link references: the 4 nav element entries above

- [ ] Publish all created entries.

- [ ] Verify the CMS adapter returns the nav correctly:
  ```bash
  cd /Users/marthox/Dev/website/.claude/worktrees/vigilant-bose && node -e "
  const { cms } = require('./src/cms/index.js');
  cms.getNavigation().then(([brand, els]) => {
    console.log('brand:', brand);
    console.log('elements:', els.length);
  });
  "
  ```
  Expected: brand object with `label: 'Digital Hub'`, 4 nav elements.

- [ ] Commit:
  ```bash
  git add src/cms/adapters/contentful/migrations/
  git commit -m "feat: add Contentful migration for Digital Hub siteTheme and nav entries"
  ```

---

### Task 14: Create page content entries in Contentful

Create in dependency order: CTAs and items before sections, sections before page.

#### 14a. CTA entries

- [ ] Create the following `cta` entries and note their Contentful entry IDs:

  | Alias | label | href | variant |
  |---|---|---|---|
  | `cta-hero-primary` | `Explorar Soluciones` | `#solutions` | `primary` |
  | `cta-hero-secondary` | `Conocer Más` | `#about` | `secondary` |
  | `cta-affilia` | `Explorar AFFILIA` | `#solutions` | `ghost` |
  | `cta-ppc` | `Explorar Pay Per Call` | `#solutions` | `ghost` |
  | `cta-pingpost` | `Explorar Ping Post` | `#solutions` | `ghost` |

#### 14b. Solution card `item` entries

- [ ] Create `item` entry for **AFFILIA**:
  - `type`: `card`
  - `title`: `AFFILIA`
  - `subtitle`: `Affiliate Infrastructure at Scale`
  - `icon`: `🔗`
  - `body` (rich text): Two sections — "Capabilities" heading + 5 bullet points, "Strategic Value" heading + 5 bullet points (see spec §5.4 for full text)
  - `ctas`: reference to `cta-affilia`

- [ ] Create `item` entry for **PAY PER CALL**:
  - `type`: `card`
  - `title`: `PAY PER CALL`
  - `subtitle`: `High-Intent Acquisition Engine`
  - `icon`: `📞`
  - `body` (rich text): Two sections — "Capabilities" heading + 5 bullet points, "Strategic Value" heading + 5 bullet points (see spec §5.4 for full text)
  - `ctas`: reference to `cta-ppc`

- [ ] Create `item` entry for **PING POST**:
  - `type`: `card`
  - `title`: `PING POST`
  - `subtitle`: `Real-Time Lead Marketplace Infrastructure`
  - `icon`: `💱`
  - `body` (rich text): Two sections — "Capabilities" heading + 5 bullet points, "Strategic Value" heading + 5 bullet points (see spec §5.4 for full text)
  - `ctas`: reference to `cta-pingpost`

#### 14c. Feature `item` entries (Why Digital Hub)

- [ ] Create 6 `item` entries (type: `feature`, title only — no body or subtitle):

  | title | icon |
  |---|---|
  | `Proprietary Technology Stack` | `⚡` |
  | `Multi-Model Acquisition Engines` | `🔄` |
  | `Cross-Border Operations` | `🌎` |
  | `Data-First Culture` | `📊` |
  | `Automated Optimization Systems` | `🤖` |
  | `Long-Term Strategic Partnerships` | `🤝` |

#### 14d. Stat `item` entries

- [ ] Create 4 `item` entries (type: `stat`):

  | value | title |
  |---|---|
  | `500+` | `Clientes Activos` |
  | `15` | `Mercados` |
  | `$2B+` | `Revenue Optimizado` |
  | `98%` | `Retención` |

#### 14e. `section` entries

- [ ] Create **Hero** section entry:
  - `kind`: `section`, `type`: `hero`, `theme`: `dark`, `layout`: `center`
  - `title`: `We Build Revenue Infrastructure.`
  - `subtitle`: `PERFORMANCE MARKETING INFRASTRUCTURE`
  - `body` (rich text): `Digital Hub is a multi-model performance infrastructure operating across LATAM and the US — integrating Affiliate Networks, Pay Per Call and Real-Time Lead Distribution through proprietary technology and intelligent optimization systems.`
  - `ctas`: references to `cta-hero-primary` and `cta-hero-secondary`

- [ ] Create **About** section entry:
  - `kind`: `section`, `type`: `text`, `layout`: `left`
  - `title`: `We Are Not an Agency. We're Infrastructure.`
  - `subtitle`: `QUIÉNES SOMOS`
  - `body` (rich text): Full paragraph text from spec §5.7

- [ ] Create **Solutions** section entry:
  - `kind`: `section`, `type`: `cards`
  - `title`: `Performance Models Powered by Proprietary Technology`
  - `subtitle`: `Our infrastructure is structured around three high-growth acquisition engines. Each one is designed to maximize revenue efficiency.`
  - `items`: references to AFFILIA, PAY PER CALL, and PING POST item entries (in order)

- [ ] Create **Why Digital Hub** section entry:
  - `kind`: `section`, `type`: `features`, `theme`: `dark`, `layout`: `split`
  - `title`: `Infrastructure Over Intermediation.`
  - `subtitle`: `POR QUÉ DIGITAL HUB`
  - `body` (rich text): Paragraph + italic quote (see spec §5.7): `Most companies act as intermediaries. We operate as infrastructure. We create acquisition environments where performance compounds over time.` + italic line: `"We don't place ads. We build the systems that make performance marketing compoundable."`
  - `items`: references to the 6 feature item entries (in order)

- [ ] Create **Stats** section entry:
  - `kind`: `section`, `type`: `stats`
  - `title`: `By the Numbers`
  - `items`: references to the 4 stat item entries (in order)

#### 14f. `formField` + `form` entries

- [ ] Create 3 `formField` entries:

  | label | name | type | placeholder | required |
  |---|---|---|---|---|
  | `Nombre` | `name` | `text` | `Tu nombre completo` | `true` |
  | `Email` | `email` | `email` | `tu@empresa.com` | `true` |
  | `Mensaje` | `message` | `textarea` | `Cuéntanos sobre tu proyecto...` | `true` |

- [ ] Create the contact `form` entry:
  - `kind`: `form`, `type`: `contact`, `theme`: `dark`
  - `title`: `Ready to Plug Into Our Infrastructure?`
  - `subtitle`: `Let's build your acquisition ecosystem together.`
  - `submitLabel`: `Enviar Mensaje`
  - `fields`: references to the 3 formField entries above

#### 14g. `page` entry

- [ ] Create the `page` entry with slug `home`:
  - `slug`: `home`
  - `seoTitle`: `Digital Hub — Revenue Infrastructure for Performance Marketing`
  - `seoDescription`: `Multi-model performance infrastructure operating across LATAM and the US. Affiliate networks, Pay Per Call and Real-Time Lead Distribution.`
  - `pageElements`: references in order: Hero section, About section, Solutions section, Why Digital Hub section, Stats section, Contact form

- [ ] Publish all entries created in Task 14.

- [ ] Commit:
  ```bash
  git add src/cms/adapters/contentful/migrations/
  git commit -m "feat: add Contentful migrations for Digital Hub page content entries"
  ```

---

### Task 15: Full build verification

- [ ] Run TypeScript check:
  ```bash
  cd /Users/marthox/Dev/website/.claude/worktrees/vigilant-bose && npx tsc --noEmit
  ```
  Expected output: zero errors.

- [ ] Run full test suite:
  ```bash
  cd /Users/marthox/Dev/website/.claude/worktrees/vigilant-bose && npm test
  ```
  Expected: all 65 tests pass, no failures.

- [ ] Run production build:
  ```bash
  cd /Users/marthox/Dev/website/.claude/worktrees/vigilant-bose && npm run build
  ```
  Expected: completes without errors. Output in `dist/`.

- [ ] Verify the home page was generated:
  ```bash
  ls /Users/marthox/Dev/website/.claude/worktrees/vigilant-bose/dist/index.html
  ```
  Expected: file exists.

- [ ] Spot-check that `dist/index.html` contains Digital Hub content:
  ```bash
  grep -c "Digital Hub\|Revenue Infrastructure\|AFFILIA" /Users/marthox/Dev/website/.claude/worktrees/vigilant-bose/dist/index.html
  ```
  Expected: count > 0.

- [ ] Verify no `/home` route was generated (would conflict with `index.astro`). This is handled by the `.filter(page => page.slug !== 'home')` added in Task 11 — if that fix is in place this check must pass:
  ```bash
  ls /Users/marthox/Dev/website/.claude/worktrees/vigilant-bose/dist/home 2>/dev/null && echo "CONFLICT: /home route exists" || echo "OK: no /home route"
  ```
  Expected: `OK: no /home route`.

- [ ] Final commit:
  ```bash
  git add -A
  git commit -m "feat: complete Digital Hub landing page implementation"
  ```

- [ ] Open a pull request from `feat/digital-hub-landing` into `main`.
