# Digital Hub — Tabs Component, Dark Default & Content Refresh

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Tabs section component, flip dark mode to default, add Technology + Segmented CTA sections, and refresh all Contentful content with updated copy from the client brief.

**Architecture:** Dark mode is the CSS `:root` default; light mode is an override via `html[data-theme-mode="light"]`. The new `tabs` section type renders a centered tab bar with per-tab badge pills split from `item.value` (pipe-separated). A cleanup script wipes the duplicated Contentful entries before fresh repopulation.

**Tech Stack:** Astro 5, TypeScript, SCSS, Contentful Management API, contentful-cli at `/opt/homebrew/bin/contentful`, Node.js ESM scripts.

**Worktree:** `/Users/marthox/Dev/website/.claude/worktrees/digital-hub-v2` on branch `feat/digital-hub-v2`. All commands below assume you are inside this worktree unless stated otherwise.

---

## Chunk 1: Worktree + Dark Mode Default

### Task 1: Create worktree

**Files:** none (git plumbing)

- [ ] **Step 1: Create the worktree**

```bash
cd /Users/marthox/Dev/website
git worktree add .claude/worktrees/digital-hub-v2 -b feat/digital-hub-v2
cd .claude/worktrees/digital-hub-v2
```

- [ ] **Step 2: Verify**

```bash
git worktree list
# Expected: /Users/marthox/Dev/website/.claude/worktrees/digital-hub-v2  <sha> [feat/digital-hub-v2]
```

---

### Task 2: Dark mode as default — `tokens.scss`

**Files:**
- Modify: `src/styles/tokens.scss`

The current `:root` has light colours. We swap it to dark, rename the `html[data-theme-mode="dark"]` block to `html[data-theme-mode="light"]` with light values, and update the section-level variant selectors so `:root` + `[data-theme="dark"]` share one block.

- [ ] **Step 1: Replace the full `:root` block**

Open `src/styles/tokens.scss`. Replace the existing `:root { ... }` block (lines that declare `--color-bg`, `--color-surface`, etc.) with:

```scss
:root {
    // Base palette — Digital Hub DARK (default)
    --color-bg:           #080C14;
    --color-surface:      #0D1525;
    --color-border:       #1E2D45;
    --color-text:         #F0F4FF;
    --color-text-muted:   #8892B0;
    --color-accent:       #00CFFF;          // brighter cyan for dark bg
    --color-accent-alt:   #FF2D7A;          // magenta

    --color-accent-dark:  #00B4FF;
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

    --gradient-brand:     linear-gradient(135deg, #00B4FF, #FF2D7A);
    --gradient-hero-dark: linear-gradient(135deg, #0D1B2A, #1B3A5C, #0D2240);
}
```

- [ ] **Step 2: Replace the section-level light block**

Find the existing `:root, [data-theme="light"] { ... }` block and replace it with TWO separate blocks:

```scss
// ── Dark section tokens (default when no data-theme set) ──────────────────
:root,
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

// ── Light section tokens (explicit override) ──────────────────────────────
[data-theme="light"] {
    --section-bg:           #FFFFFF;
    --section-surface:      #F8F9FF;
    --section-border:       #E2E6F0;
    --section-text:         #0A0A1A;
    --section-text-muted:   #5A6080;

    --btn-primary-bg:       #00B4FF;
    --btn-primary-text:     #FFFFFF;
    --btn-secondary-border: #0A0A1A;
    --btn-secondary-text:   #0A0A1A;
    --btn-ghost-text:       #00B4FF;
}
```

- [ ] **Step 3: Delete stale blocks and add the light-mode override**

Delete TWO blocks that are now obsolete:

1. The **standalone `[data-theme="dark"] { ... }` block** (currently around lines 61-73) — its content is now merged into the new `:root, [data-theme="dark"]` block from Step 2. Leaving it would create a duplicate `[data-theme="dark"]` selector.
2. The **entire `html[data-theme-mode="dark"] { ... }` block** — it must be gone completely; dark is now the `:root` default and needs no CSS override.

Add in its place:

```scss
// Page-level LIGHT mode override (when user toggles away from dark default)
html[data-theme-mode="light"] {
    --color-bg:           #FFFFFF;
    --color-surface:      #F8F9FF;
    --color-border:       #E2E6F0;
    --color-text:         #0A0A1A;
    --color-text-muted:   #5A6080;
    --color-accent:       #00B4FF;
}
```

- [ ] **Step 4: Run tests**

```bash
npm test
# Expected: all tests pass (tokens.scss changes don't affect TS tests)
```

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.scss
git commit -m "feat: make dark mode the default theme"
```

---

### Task 3: Update Nav.astro toggle to default dark

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: Update the `<script>` block**

Find the `<script>` block in `src/components/Nav.astro`. Replace the entire script with:

```typescript
<script>
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    function applyTheme(mode: string) {
        html.dataset.themeMode = mode;           // always set explicitly
        if (toggle) {
            toggle.textContent = mode === 'dark' ? '☀' : '🌙';
            toggle.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }

    // Initialise — dark is the default
    const saved = localStorage.getItem('theme') ?? 'dark';
    applyTheme(saved);

    toggle?.addEventListener('click', () => {
        const current = html.dataset.themeMode ?? 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });
</script>
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: default theme toggle to dark mode"
```

---

## Chunk 2: Type System + New Components

### Task 4: Add `'tabs'` and `'tab'` to TypeScript types

**Files:**
- Modify: `src/types/page.ts`

- [ ] **Step 1: Update `Item.type`**

In `src/types/page.ts`, find:

```typescript
    type?: 'card' | 'slide' | 'product' | 'testimonial' | 'stat' | 'feature';
```

Replace with:

```typescript
    type?: 'card' | 'slide' | 'product' | 'testimonial' | 'stat' | 'feature' | 'tab';
```

- [ ] **Step 2: Update `Section.type`**

Find:

```typescript
    type: 'hero' | 'banner' | 'carousel' | 'cards' | 'features' | 'testimonials' | 'stats' | 'text' | 'gallery';
```

Replace with:

```typescript
    type: 'hero' | 'banner' | 'carousel' | 'cards' | 'features' | 'testimonials' | 'stats' | 'text' | 'gallery' | 'tabs';
```

- [ ] **Step 3: Add `'roles'` to `Section.layout`**

Find:

```typescript
    layout?: 'left' | 'right' | 'center' | 'split';
```

Replace with:

```typescript
    layout?: 'left' | 'right' | 'center' | 'split' | 'roles';
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

- [ ] **Step 4: Commit**

```bash
git add src/types/page.ts
git commit -m "feat: add tabs section type and tab item type"
```

---

### Task 5: Create `Tabs.astro` component

**Files:**
- Create: `src/components/sections/Tabs.astro`

- [ ] **Step 1: Create the file**

```astro
---
import type { Section } from '@/types/page';
import RichText from '@components/RichText.astro';

interface Props {
    section: Section;
}

const { section } = Astro.props;
const tabs = section.items ?? [];
---

<section class="tabs-section" data-theme="dark">
    <div class="tabs-section__inner">
        {section.subtitle && (
            <div class="tabs-section__eyebrow">{section.subtitle}</div>
        )}
        {section.title && (
            <h2 class="tabs-section__title">{section.title}</h2>
        )}

        <div class="tabs-section__tab-bar" role="tablist">
            {tabs.map((tab, i) => (
                <button
                    class={`tabs-section__tab${i === 0 ? ' is-active' : ''}`}
                    role="tab"
                    data-tab-index={String(i)}
                    aria-selected={String(i === 0)}
                >
                    {tab.title}
                </button>
            ))}
        </div>

        <div class="tabs-section__panels">
            {tabs.map((tab, i) => {
                const badges = tab.value
                    ? tab.value.split('|').map(b => b.trim())
                    : [];
                return (
                    <div
                        class={`tabs-section__panel${i === 0 ? ' is-active' : ''}`}
                        role="tabpanel"
                        data-panel-index={String(i)}
                    >
                        {badges.length > 0 && (
                            <div class="tabs-section__badges">
                                {badges.map((badge, bi) => (
                                    <span class={`tabs-section__badge tabs-section__badge--${bi === 0 ? 'cyan' : 'magenta'}`}>
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        )}
                        <div class="tabs-section__divider"></div>
                        {tab.subtitle && (
                            <h3 class="tabs-section__panel-title">{tab.subtitle}</h3>
                        )}
                        {tab.body && (
                            <div class="tabs-section__panel-body">
                                <RichText doc={tab.body} />
                            </div>
                        )}
                        {tab.ctas && tab.ctas.length > 0 && (
                            <div class="tabs-section__ctas">
                                {tab.ctas.map(cta => (
                                    <a
                                        href={cta.href}
                                        class="tabs-section__cta"
                                        target={cta.openInNewTab ? '_blank' : undefined}
                                    >
                                        {cta.label} {cta.icon ?? '→'}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
</section>

<style lang="scss">
.tabs-section {
    background: var(--gradient-hero-dark);
    padding: var(--section-padding-y) var(--section-padding-x);
    text-align: center;

    &__inner {
        max-width: var(--container-width);
        margin: 0 auto;
    }

    &__eyebrow {
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #00CFFF;
        margin-bottom: 0.75rem;
    }

    &__title {
        font-size: clamp(1.75rem, 4vw, 2.75rem);
        font-weight: 800;
        color: #F0F4FF;
        margin: 0 0 2.5rem;
        line-height: 1.15;
    }

    &__tab-bar {
        display: flex;
        justify-content: center;
        border-bottom: 1px solid #1E2D45;
        margin-bottom: 3rem;
    }

    &__tab {
        padding: 0.875rem 2rem;
        font-size: 0.95rem;
        font-weight: 600;
        color: #8892B0;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;

        &:hover { color: #F0F4FF; }

        &.is-active {
            color: #00CFFF;
            border-bottom-color: #00CFFF;
        }
    }

    &__panels {
        max-width: 620px;
        margin: 0 auto;
    }

    &__panel {
        display: none;
        animation: tabFadeIn 0.25s ease;

        &.is-active { display: block; }
    }

    &__badges {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }

    &__badge {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 0.3rem 0.85rem;
        border-radius: var(--radius-pill);

        &--cyan    { color: #00CFFF; border: 1.5px solid #00CFFF; }
        &--magenta { color: #FF6BAE; border: 1.5px solid #FF6BAE; }
    }

    &__divider {
        width: 40px;
        height: 2px;
        background: var(--gradient-brand);
        margin: 0 auto 1.5rem;
    }

    &__panel-title {
        font-size: 1.6rem;
        font-weight: 700;
        color: #F0F4FF;
        margin: 0 0 0.875rem;
        line-height: 1.25;
    }

    &__panel-body {
        color: #8892B0;
        line-height: 1.75;
        font-size: 1rem;

        :global(p) { margin: 0 0 0.75rem; }
        :global(p:last-child) { margin-bottom: 0; }
    }

    &__ctas {
        margin-top: 1.75rem;
    }

    &__cta {
        color: #00CFFF;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
        transition: opacity 0.15s;

        &:hover { opacity: 0.8; }
    }
}

@keyframes tabFadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
}
</style>

<script>
    const tabBtns = document.querySelectorAll<HTMLButtonElement>('.tabs-section__tab');
    const panels  = document.querySelectorAll<HTMLElement>('.tabs-section__panel');

    tabBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('is-active');
                b.setAttribute('aria-selected', 'false');
            });
            panels.forEach(p => p.classList.remove('is-active'));

            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');
            panels[i]?.classList.add('is-active');
        });
    });
</script>
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Tabs.astro
git commit -m "feat: add Tabs section component with badge pills and keyboard-accessible tab bar"
```

---

### Task 6: Register Tabs in SectionRenderer

**Files:**
- Modify: `src/components/SectionRenderer.astro`

- [ ] **Step 1: Add import and mapping**

After the existing imports, add:

```astro
import Tabs from '@components/sections/Tabs.astro';
```

In the `sectionMap` object, add:

```typescript
    tabs: Tabs,
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SectionRenderer.astro
git commit -m "feat: register Tabs component in SectionRenderer"
```

---

### Task 7: Add `roles` layout to Cards component

**Files:**
- Modify: `src/components/sections/Cards.astro`

The Segmented CTA section (Section 9) uses `type: 'cards'` with `layout: 'roles'`. Each role card has: `title` (role label, gradient text), `subtitle` (description), `ctas[0]` (CTA button). The section-level `ctas[0]` is the "Schedule a Strategy Call" button below the grid.

- [ ] **Step 1: Read the file first to understand current structure**

```bash
cat src/components/sections/Cards.astro
```

- [ ] **Step 2: Add roles layout conditional in the template**

Add a conditional block before the closing `</section>` tag that handles `layout === 'roles'` differently. The pattern is: if `section.layout === 'roles'` render the roles layout; otherwise render the existing cards grid.

Wrap the existing grid in `{section.layout !== 'roles' && ( ... )}` and add a new roles block:

```astro
{section.layout === 'roles' && (
    <div class="cards-section__roles">
        {section.items?.map(item => (
            <div class="role-card">
                <div class="role-card__title">{item.title}</div>
                <p class="role-card__subtitle">{item.subtitle}</p>
                {item.ctas && item.ctas.length > 0 && (
                    <a href={item.ctas[0].href} class="role-card__cta">
                        {item.ctas[0].label} →
                    </a>
                )}
            </div>
        ))}
    </div>
)}
{section.layout === 'roles' && section.ctas && section.ctas.length > 0 && (
    <div class="cards-section__roles-footer">
        <p class="cards-section__roles-note">Or speak directly with our team.</p>
        <a href={section.ctas[0].href} class="btn btn--primary">
            {section.ctas[0].label}
        </a>
    </div>
)}
```

- [ ] **Step 3: Change `<style>` to `<style lang="scss">`**

In `Cards.astro`, find the opening `<style>` tag and change it to `<style lang="scss">`. The existing plain CSS is valid SCSS — no content changes needed.

- [ ] **Step 4: Add SCSS for roles layout**

Add at the end of the `<style lang="scss">` block:

```scss
// ── Roles layout (Segmented CTA) ─────────────────────────────────────────
.cards-section__roles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 3rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}

.role-card {
    border: 1px solid var(--section-border);
    border-radius: var(--radius-lg);
    padding: 2.5rem 2rem;
    text-align: center;
    background: var(--section-surface);
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__title {
        font-size: 1rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        background: var(--gradient-brand);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    &__subtitle {
        font-size: 0.9rem;
        color: var(--section-text-muted);
        line-height: 1.6;
        margin: 0;
        flex: 1;
    }

    &__cta {
        display: inline-block;
        color: var(--btn-ghost-text);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.875rem;
        transition: opacity 0.15s;

        &:hover { opacity: 0.75; }
    }
}

.cards-section__roles-footer {
    margin-top: 3rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.cards-section__roles-note {
    font-size: 0.9rem;
    color: var(--section-text-muted);
    margin: 0;
}

.btn {
    display: inline-block;
    padding: 0.875rem 2rem;
    border-radius: var(--radius-pill);
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    transition: opacity 0.15s;

    &--primary {
        background: var(--gradient-brand);
        color: #fff;

        &:hover { opacity: 0.85; }
    }
}
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Cards.astro
git commit -m "feat: add roles layout to Cards section for segmented CTA"
```

---

## Chunk 3: Contentful Data

### Task 8: Create and run the entry cleanup script

**Files:**
- Create: `scripts/contentful-reset.mjs`

This script deletes all existing entries from the Contentful space (which currently has 3× duplicates from multiple migration runs).

- [ ] **Step 1: Create the script**

```javascript
// scripts/contentful-reset.mjs
// Deletes all entries in the Contentful space.
// Run: node scripts/contentful-reset.mjs

import { createClient } from 'contentful-management';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// .env lives at the main repo root, not inside the worktree directory
const __dirname = dirname(fileURLToPath(import.meta.url));
const env = dotenv.parse(readFileSync(resolve(__dirname, '../.env')));
const SPACE_ID = env.CONTENTFUL_SPACE_ID;
const TOKEN    = env.CONTENTFUL_MANAGEMENT_TOKEN;

const client = createClient({ accessToken: TOKEN });

async function main() {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');

    let skip = 0;
    const all = [];
    while (true) {
        const batch = await environment.getEntries({ limit: 200, skip });
        all.push(...batch.items);
        if (batch.items.length < 200) break;
        skip += 200;
    }
    console.log(`Found ${all.length} entries. Unpublishing…`);

    for (const entry of all) {
        try {
            if (entry.isPublished()) await entry.unpublish();
        } catch { /* already unpublished */ }
    }

    console.log('Deleting…');
    for (const entry of all) {
        try {
            await entry.delete();
            console.log(`  deleted ${entry.sys.id}`);
        } catch (e) {
            console.warn(`  FAILED ${entry.sys.id}: ${e.message}`);
        }
    }
    console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Install dependency if needed**

```bash
cd /Users/marthox/Dev/website
npm ls contentful-management --depth=0 2>/dev/null || npm install contentful-management --save-dev
```

- [ ] **Step 3: Run the script**

```bash
node scripts/contentful-reset.mjs
# Expected: "Found N entries. Unpublishing… Deleting… Done."
```

- [ ] **Step 4: Verify space is empty**

```bash
curl -s "https://cdn.contentful.com/spaces/b29bkr806w5b/environments/master/entries?access_token=J5A6LFFtBXukVEF_0JlcifBw-WjzrHZxwvWT8yVTqxA" | python3 -c "import sys,json; d=json.load(sys.stdin); print('entries:', d['total'])"
# Expected: entries: 0
```

- [ ] **Step 5: Commit the script**

```bash
git add scripts/contentful-reset.mjs
git commit -m "chore: add Contentful entry cleanup script"
```

---

### Task 9: Migration 15 — add `tabs` to Contentful type validations

**Files:**
- Create: `src/cms/adapters/contentful/migrations/20260321-15-tabs-type.cjs`

- [ ] **Step 1: Create the migration file**

```javascript
/**
 * Migration 15: add 'tabs' to section.type validation
 * and 'tab' to item.type validation.
 */
module.exports = function (migration) {
    const section = migration.editContentType('section');
    section.editField('type').validations([
        {
            in: [
                'hero', 'banner', 'carousel', 'cards', 'features',
                'testimonials', 'stats', 'text', 'gallery', 'tabs',
            ],
        },
    ]);
    // Add 'roles' to layout validation so Migration 16's Segmented CTA entry is accepted
    section.editField('layout').validations([
        { in: ['left', 'right', 'center', 'split', 'roles'] },
    ]);

    const item = migration.editContentType('item');
    item.editField('type').validations([
        {
            in: [
                'card', 'slide', 'product', 'testimonial',
                'stat', 'feature', 'tab',
            ],
        },
    ]);
};
```

- [ ] **Step 2: Run the migration**

```bash
/opt/homebrew/bin/contentful space migration \
  --space-id b29bkr806w5b \
  --environment-id master \
  --yes \
  src/cms/adapters/contentful/migrations/20260321-15-tabs-type.cjs
# Expected: 🎉 Migration successful
```

- [ ] **Step 3: Commit**

```bash
git add src/cms/adapters/contentful/migrations/20260321-15-tabs-type.cjs
git commit -m "feat: add tabs section type and tab item type to Contentful schema"
```

---

### Task 10: Migration 16 — repopulate all content with updated copy

**Files:**
- Create: `src/cms/adapters/contentful/migrations/20260321-16-digital-hub-content-v2.cjs`

This creates all entries fresh with the updated copy from the client brief. Page element order: Hero → About → Core Pillars (tabs) → Solutions → Why DH → Stats → Technology → Contact → Segmented CTA.

- [ ] **Step 1: Create the migration file**

```javascript
/**
 * Migration 16: Digital Hub content v2
 *
 * Fresh population after cleanup. Updated copy from client brief.
 * New sections: Core Pillars (tabs), Technology (text), Segmented CTA (cards/roles).
 *
 * Page element order:
 *  1. hero
 *  2. about (text/left)
 *  3. core-pillars (tabs)
 *  4. solutions (cards)
 *  5. why-dh (features)
 *  6. stats
 *  7. technology (text/center)
 *  8. contact (form)
 *  9. segmented-cta (cards/roles)
 */
module.exports = async function (migration, { makeRequest }) {
    // ── Helpers ───────────────────────────────────────────────────────────

    async function create(contentTypeId, fields) {
        const entry = await makeRequest({
            method: 'POST',
            url: '/entries',
            headers: { 'X-Contentful-Content-Type': contentTypeId },
            data: { fields },
        });
        await makeRequest({
            method: 'PUT',
            url: `/entries/${entry.sys.id}/published`,
            headers: { 'X-Contentful-Version': String(entry.sys.version) },
        });
        return entry;
    }

    function link(id) {
        return { sys: { type: 'Link', linkType: 'Entry', id } };
    }

    function f(val) { return { 'en-US': val }; }

    function doc(...nodes) {
        return { nodeType: 'document', data: {}, content: nodes };
    }

    function p(text, marks) {
        return {
            nodeType: 'paragraph', data: {},
            content: [{ nodeType: 'text', value: text, marks: marks ?? [], data: {} }],
        };
    }

    function ul(...items) {
        return {
            nodeType: 'unordered-list', data: {},
            content: items.map(text => ({
                nodeType: 'list-item', data: {},
                content: [p(text)],
            })),
        };
    }

    // ── siteTheme ─────────────────────────────────────────────────────────

    await create('siteTheme', {
        name:               f('Digital Hub Theme'),
        colorPrimary:       f('#080C14'),
        colorAccent:        f('#00CFFF'),
        fontHeading:        f('Inter'),
        fontBody:           f('Inter'),
        colorDarkSurface:   f('#0D1525'),
        colorDarkBorder:    f('#1E2D45'),
        colorDarkTextMuted: f('#8892B0'),
        colorDarkAccent:    f('#00CFFF'),
    });

    // ── navElements ────────────────────────────────────────────────────────

    const navSolutions = await create('navElement', {
        label: f('Solutions'),
        href:  f('#solutions'),
        kind:  f('link'),
    });
    const navWhyUs = await create('navElement', {
        label: f('Why Us'),
        href:  f('#why-dh'),
        kind:  f('link'),
    });
    const navContact = await create('navElement', {
        label: f('Contact'),
        href:  f('#contact'),
        kind:  f('link'),
    });

    // ── nav ────────────────────────────────────────────────────────────────

    // navBrand omitted (optional Asset field — no logo to upload yet)
    await create('nav', {
        navElements:       f([link(navSolutions.sys.id), link(navWhyUs.sys.id), link(navContact.sys.id)]),
        distribution:      f('end'),
        hamburgerPosition: f('right'),
    });

    // ── CTAs ───────────────────────────────────────────────────────────────

    const ctaExplore = await create('cta', {
        label:   f('Explore Our Solutions'),
        href:    f('#solutions'),
        variant: f('primary'),
    });
    const ctaTalk = await create('cta', {
        label:   f('Talk to Our Team'),
        href:    f('#contact'),
        variant: f('secondary'),
    });
    const ctaConnect = await create('cta', {
        label:   f('Explore Affilia'),
        href:    f('#solutions'),
        variant: f('ghost'),
    });
    const ctaConvert = await create('cta', {
        label:   f('Explore Ping Post'),
        href:    f('#solutions'),
        variant: f('ghost'),
    });
    const ctaControl = await create('cta', {
        label:   f('Learn About Our Tech'),
        href:    f('#technology'),
        variant: f('ghost'),
    });
    const ctaAdvertiser = await create('cta', {
        label:   f('Explore Advertiser Solutions'),
        href:    f('#contact'),
        variant: f('ghost'),
    });
    const ctaPublisher = await create('cta', {
        label:   f('Join Our Publisher Network'),
        href:    f('#contact'),
        variant: f('ghost'),
    });
    const ctaBuyer = await create('cta', {
        label:   f('Access the Lead Marketplace'),
        href:    f('#contact'),
        variant: f('ghost'),
    });
    const ctaStrategy = await create('cta', {
        label:   f('Schedule a Strategy Call'),
        href:    f('#contact'),
        variant: f('primary'),
    });

    // ── Tab items (Core Pillars) ───────────────────────────────────────────

    const tabConnect = await create('item', {
        type:     f('tab'),
        title:    f('Connect'),
        subtitle: f('Traffic that means something.'),
        body:     f(doc(
            p('We source, qualify and route high-intent traffic across affiliate and inbound call channels. Every impression and every call is filtered, tracked and tied to an outcome.'),
        )),
        value: f('Affilia|Pay Per Call'),
        ctas:  f([link(ctaConnect.sys.id)]),
    });
    const tabConvert = await create('item', {
        type:     f('tab'),
        title:    f('Convert'),
        subtitle: f('Data that makes decisions.'),
        body:     f(doc(
            p('Our real-time infrastructure scores, bids and matches every lead in milliseconds — maximising revenue for sellers and reducing acquisition cost for buyers.'),
        )),
        value: f('Ping Post|Lead Marketplace'),
        ctas:  f([link(ctaConvert.sys.id)]),
    });
    const tabControl = await create('item', {
        type:     f('tab'),
        title:    f('Control'),
        subtitle: f('Infrastructure you own.'),
        body:     f(doc(
            p('No black boxes. Our proprietary tracking, fraud detection and optimisation layers give you full visibility and full control over every layer of the acquisition chain.'),
        )),
        value: f('Proprietary Tech Stack'),
        ctas:  f([link(ctaControl.sys.id)]),
    });

    // ── Solution card items ────────────────────────────────────────────────

    const cardAffilia = await create('item', {
        type:     f('card'),
        icon:     f('🔗'),
        title:    f('Affilia'),
        subtitle: f('Affiliate Infrastructure at Scale'),
        body:     f(doc(
            p('Affilia is not just an affiliate network. It\'s a controlled performance ecosystem built on proprietary tracking and optimisation technology.'),
            ul(
                'Real-time campaign intelligence',
                'In-house tracking technology',
                'Automated optimisation layers',
                'Fraud prevention architecture',
                'International publisher network',
            ),
        )),
    });
    const cardPayPerCall = await create('item', {
        type:     f('card'),
        icon:     f('📞'),
        title:    f('Pay Per Call'),
        subtitle: f('High-Intent Acquisition Engine'),
        body:     f(doc(
            p('We don\'t deliver leads. We deliver live consumer intent. Our Pay Per Call division is engineered to generate and route high-intent inbound calls in the US market.'),
            ul(
                'High-intent inbound acquisition',
                'Intelligent call routing with IVR logic',
                'Vertical campaign specialisation',
                'Real-time performance dashboards',
                'Conversion optimisation layers',
            ),
        )),
    });
    const cardPingPost = await create('item', {
        type:     f('card'),
        icon:     f('⚡'),
        title:    f('Ping Post'),
        subtitle: f('Real-Time Lead Marketplace Infrastructure'),
        body:     f(doc(
            p('Every lead is pinged, scored and matched before it\'s ever delivered. Our real-time lead exchange operates on millisecond decisioning and intelligent routing.'),
            ul(
                'Real-time bidding with millisecond decisioning',
                'API-based CRM integrations',
                'Lead scoring with custom criteria',
                'Intelligent routing architecture',
                'Revenue maximisation algorithms',
            ),
        )),
    });

    // ── Feature items (Why Digital Hub) ───────────────────────────────────

    const feat1 = await create('item', {
        type:     f('feature'),
        icon:     f('🛠'),
        title:    f('Proprietary Technology Stack'),
        subtitle: f('Our tracking, routing, fraud detection and analytics are built and owned by us — giving our partners a competitive edge that can\'t be replicated.'),
    });
    const feat2 = await create('item', {
        type:     f('feature'),
        icon:     f('⚙️'),
        title:    f('Multi-Model Acquisition Engines'),
        subtitle: f('Three distinct revenue engines — Affiliate, Pay Per Call and Ping Post — operating under one infrastructure. Flexibility without fragmentation.'),
    });
    const feat3 = await create('item', {
        type:     f('feature'),
        icon:     f('🌎'),
        title:    f('Cross-Border Operations'),
        subtitle: f('Native operations across LATAM and the US. Not expansion — infrastructure. We understand both markets at the data and regulatory level.'),
    });
    const feat4 = await create('item', {
        type:     f('feature'),
        icon:     f('📊'),
        title:    f('Data-First Culture'),
        subtitle: f('Every decision is made from data. Traffic quality, lead scoring, campaign optimisation, routing logic — all driven by real-time signals, not intuition.'),
    });
    const feat5 = await create('item', {
        type:     f('feature'),
        icon:     f('🤖'),
        title:    f('Automated Optimisation Systems'),
        subtitle: f('Performance doesn\'t require manual intervention. Our systems detect underperformance and optimise autonomously — ensuring results compound over time.'),
    });
    const feat6 = await create('item', {
        type:     f('feature'),
        icon:     f('🤝'),
        title:    f('Long-Term Strategic Partnerships'),
        subtitle: f('We don\'t work with everyone. We build deep, long-term relationships with partners who are serious about scale — and we invest in their growth accordingly.'),
    });

    // ── Stat items ─────────────────────────────────────────────────────────

    const stat1 = await create('item', {
        type:  f('stat'),
        value: f('$2B+'),
        title: f('Revenue Generated'),
    });
    const stat2 = await create('item', {
        type:  f('stat'),
        value: f('500+'),
        title: f('Publisher Partners'),
    });
    const stat3 = await create('item', {
        type:  f('stat'),
        value: f('15M+'),
        title: f('Leads Processed'),
    });
    const stat4 = await create('item', {
        type:  f('stat'),
        value: f('12'),
        title: f('Markets Served'),
    });

    // ── Role items (Segmented CTA) ─────────────────────────────────────────

    const roleAdvertiser = await create('item', {
        type:     f('card'),
        title:    f("I'M AN ADVERTISER"),
        subtitle: f('Scale your customer acquisition with performance-only models.'),
        ctas:     f([link(ctaAdvertiser.sys.id)]),
    });
    const rolePublisher = await create('item', {
        type:     f('card'),
        title:    f("I'M A PUBLISHER"),
        subtitle: f('Monetise your traffic with full control and real-time data.'),
        ctas:     f([link(ctaPublisher.sys.id)]),
    });
    const roleBuyer = await create('item', {
        type:     f('card'),
        title:    f("I'M A LEAD BUYER"),
        subtitle: f('Access pre-scored leads matched to your exact criteria.'),
        ctas:     f([link(ctaBuyer.sys.id)]),
    });

    // ── Form fields + form ─────────────────────────────────────────────────

    const ffName = await create('formField', {
        label:       f('Full Name'),
        name:        f('name'),
        type:        f('text'),
        placeholder: f('Your full name'),
        required:    f(true),
    });
    const ffEmail = await create('formField', {
        label:       f('Email Address'),
        name:        f('email'),
        type:        f('email'),
        placeholder: f('you@company.com'),
        required:    f(true),
    });
    const ffMessage = await create('formField', {
        label:       f('Message'),
        name:        f('message'),
        type:        f('textarea'),
        placeholder: f('Tell us about your goals'),
        required:    f(true),
    });

    const contactForm = await create('form', {
        title:          f("Let's Connect"),
        subtitle:       f('Tell us where you are in your growth journey and we\'ll match you with the right acquisition engine.'),
        type:           f('contact'),
        fields:         f([link(ffName.sys.id), link(ffEmail.sys.id), link(ffMessage.sys.id)]),
        submitLabel:    f('Send Message'),
        successMessage: f("Thank you — we'll be in touch within one business day."),
        theme:          f('dark'),
    });

    // ── Sections ──────────────────────────────────────────────────────────

    // 1. Hero
    const secHero = await create('section', {
        type:     f('hero'),
        title:    f('We Build the Infrastructure That Makes Acquisition Predictable.'),
        subtitle: f('DIGITAL HUB'),
        body:     f(doc(p('Not an agency. Not a platform. Infrastructure.'))),
        ctas:     f([link(ctaExplore.sys.id), link(ctaTalk.sys.id)]),
        theme:    f('dark'),
    });

    // 2. About
    const secAbout = await create('section', {
        type:     f('text'),
        layout:   f('left'),
        title:    f("We Don't Manage Campaigns. We Architect Acquisition Ecosystems."),
        subtitle: f('ABOUT US'),
        body:     f(doc(
            p('Digital Hub was built to solve one problem: how to scale customer acquisition predictably, across markets, verticals and channels.'),
            p('Today we operate a multi-vertical performance infrastructure that connects advertisers, publishers and buyers through proprietary technology and measurable acquisition models.'),
            p('Operating across LATAM and the United States, Digital Hub has evolved into a performance engine designed for scalability, automation and intelligent decisioning.'),
            p('The difference between an agency and infrastructure:'),
            ul(
                'Agencies optimise campaigns. We architect the system that campaigns run on.',
                'Agencies report on performance. We engineer the conditions that create it.',
                'Agencies depend on platforms. We build ours.',
            ),
        )),
        theme: f('light'),
    });

    // 3. Core Pillars (TABS)
    const secPillars = await create('section', {
        type:     f('tabs'),
        title:    f('Connect. Convert. Control.'),
        subtitle: f('CORE PILLARS'),
        items:    f([link(tabConnect.sys.id), link(tabConvert.sys.id), link(tabControl.sys.id)]),
        theme:    f('dark'),
    });

    // 4. Solutions (CARDS)
    const secSolutions = await create('section', {
        type:     f('cards'),
        title:    f('Performance Models Powered by Proprietary Technology'),
        subtitle: f('TECH SOLUTIONS'),
        body:     f(doc(p('Our infrastructure is structured around three high-growth acquisition engines. Each one is designed to maximise revenue efficiency and deliver measurable outcomes.'))),
        items:    f([link(cardAffilia.sys.id), link(cardPayPerCall.sys.id), link(cardPingPost.sys.id)]),
        theme:    f('light'),
    });

    // 5. Why Digital Hub (FEATURES)
    const secWhy = await create('section', {
        type:     f('features'),
        title:    f('Infrastructure Over Intermediation.'),
        subtitle: f('WHY DIGITAL HUB'),
        body:     f(doc(p('Most companies position themselves between advertisers and results. We position ourselves beneath them — as the infrastructure that makes results possible.'))),
        items:    f([
            link(feat1.sys.id), link(feat2.sys.id), link(feat3.sys.id),
            link(feat4.sys.id), link(feat5.sys.id), link(feat6.sys.id),
        ]),
        theme:    f('dark'),
    });

    // 6. Stats
    const secStats = await create('section', {
        type:     f('stats'),
        title:    f('By the Numbers'),
        subtitle: f('TRACK RECORD'),
        items:    f([link(stat1.sys.id), link(stat2.sys.id), link(stat3.sys.id), link(stat4.sys.id)]),
        theme:    f('light'),
    });

    // 7. Technology (TEXT)
    const secTech = await create('section', {
        type:     f('text'),
        layout:   f('center'),
        title:    f('Technology Is Not a Support Function. It Is Our Competitive Advantage.'),
        subtitle: f('OUR TECHNOLOGY'),
        body:     f(doc(
            p('Every layer of Digital Hub\'s infrastructure is built on proprietary technology developed specifically for performance acquisition. We don\'t use off-the-shelf solutions because off-the-shelf solutions weren\'t built for the complexity we operate at.'),
            p('What our tech stack enables:'),
            ul(
                'Custom tracking systems with full attribution across every touchpoint',
                'Real-time analytics dashboards with live performance signals',
                'Multi-layer fraud detection that protects every campaign',
                'API connectivity infrastructure for seamless partner integration',
                'Intelligent optimisation algorithms that improve performance autonomously',
            ),
            p('Built for speed. Built for control. Built for scale.'),
        )),
        theme: f('dark'),
    });

    // 9. Segmented CTA (CARDS / roles layout)
    const secCTA = await create('section', {
        type:     f('cards'),
        layout:   f('roles'),
        title:    f('Ready to Plug Into Our Infrastructure?'),
        subtitle: f('GET STARTED'),
        body:     f(doc(p("Whether you're looking to scale customer acquisition, monetise high-quality traffic or buy pre-qualified leads at volume — there's a Digital Hub engine built for your model."))),
        items:    f([link(roleAdvertiser.sys.id), link(rolePublisher.sys.id), link(roleBuyer.sys.id)]),
        ctas:     f([link(ctaStrategy.sys.id)]),
        theme:    f('dark'),
    });

    // ── Home page ─────────────────────────────────────────────────────────

    await create('page', {
        slug:  f('home'),
        pageElements: f([
            link(secHero.sys.id),
            link(secAbout.sys.id),
            link(secPillars.sys.id),
            link(secSolutions.sys.id),
            link(secWhy.sys.id),
            link(secStats.sys.id),
            link(secTech.sys.id),
            link(contactForm.sys.id),
            link(secCTA.sys.id),
        ]),
    });
};
```

- [ ] **Step 2: Run the migration**

```bash
/opt/homebrew/bin/contentful space migration \
  --space-id b29bkr806w5b \
  --environment-id master \
  --yes \
  src/cms/adapters/contentful/migrations/20260321-16-digital-hub-content-v2.cjs
# Expected: 🎉 Migration successful
```

- [ ] **Step 3: Verify entries exist**

```bash
curl -s "https://cdn.contentful.com/spaces/b29bkr806w5b/environments/master/entries?content_type=section&access_token=J5A6LFFtBXukVEF_0JlcifBw-WjzrHZxwvWT8yVTqxA" | python3 -c "
import sys,json; d=json.load(sys.stdin)
print('sections:', d['total'])
for e in d['items']:
    f=e['fields']
    print(' ', f['type']['en-US'], '|', f.get('title',{}).get('en-US','—'))
"
# Expected: sections: 9  (one of each type, no duplicates)
```

- [ ] **Step 4: Commit**

```bash
git add src/cms/adapters/contentful/migrations/20260321-16-digital-hub-content-v2.cjs
git commit -m "feat: populate Digital Hub content v2 with updated copy and new sections"
```

---

## Chunk 4: Verification + PR

### Task 11: TypeScript check, tests, build, and PR

**Files:** none (validation only)

- [ ] **Step 1: TypeScript check**

```bash
npx tsc --noEmit
# Expected: no errors from our changes (pre-existing ImportMeta.env errors are acceptable)
```

- [ ] **Step 2: Run tests**

```bash
npm test
# Expected: all tests pass (≥ 65)
```

- [ ] **Step 3: Build**

```bash
npm run build
# Expected: no build errors; dist/ is populated
```

- [ ] **Step 4: Verify key outputs**

```bash
grep -i "Connect. Convert. Control" dist/index.html && echo "✅ tabs title found"
grep -i "Infrastructure Over Intermediation" dist/index.html && echo "✅ features section found"
grep -i "Technology Is Not a Support" dist/index.html && echo "✅ technology section found"
grep -i "Ready to Plug" dist/index.html && echo "✅ segmented CTA found"
# All 4 should print ✅
```

- [ ] **Step 5: Confirm no /home route**

```bash
ls dist/home* 2>/dev/null && echo "❌ /home route conflict" || echo "✅ no /home route"
```

- [ ] **Step 6: Open PR**

```bash
git push -u origin feat/digital-hub-v2
gh pr create \
  --title "feat: tabs component, dark mode default, content refresh" \
  --body "$(cat <<'EOF'
## Summary
- Dark mode is now the site default; light mode is an opt-in toggle
- New **Tabs** section component (`type: tabs`) with centered layout, badge pills, and animated tab switching
- New **Technology** text section (Section 7) with updated copy from client brief
- New **Segmented CTA** section (Section 9) using `cards` component with `layout: roles`
- All Contentful content refreshed with final copy from the latest client document
- Cleaned up 3× duplicate entries left by previous migration runs

## Test plan
- [ ] Toggle dark/light — page starts dark, toggle persists across reload
- [ ] Tabs switch: Connect → Convert → Control, badges update correctly
- [ ] `/` renders all 9 sections in correct order
- [ ] No `/home` route in dist
- [ ] All tests pass (`npm test`)
- [ ] Clean build (`npm run build`)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---
