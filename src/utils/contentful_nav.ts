import type { Entry, Asset } from 'contentful';
import { fetchEntriesByContentType } from '@utils/contentful';

import type { NavElement, NavBrand } from '@/types/nav';
import type { ContentfulNav, ContentfulNavElement } from '@/types/contentful';

type NavEntry = Entry<ContentfulNavElement, 'WITHOUT_UNRESOLVABLE_LINKS'>;

function isNavEntry(entry: NavEntry | undefined): entry is NavEntry {
    return Boolean(entry);
}

function mapNavEntries(entries: Array<NavEntry | undefined>): NavElement[] {
    return entries
        .filter(isNavEntry)
        .map(mapNavEntry);
}

function mapNavEntry(entry: NavEntry): NavElement {
    const { label, href, submenu } = entry.fields;
    const mappedSubmenu = mapNavEntries(submenu ?? []);

    if (mappedSubmenu.length > 0) {
        return { label, submenu: mappedSubmenu };
    }

    return { label, href: href ?? '' };
}

function mapNavBrand(asset: Asset<'WITHOUT_UNRESOLVABLE_LINKS', string> | null): NavBrand | null {
    const fields = asset?.fields;
    if (!fields?.title || !fields?.description || !fields?.file?.url) {
        return null;
    }

    const href = "/"; // Brand always links to home page
    return {
        label: fields.title,
        src: fields.file.url,
        alt: fields.description,
        href,
    };
}

export async function getNavElements(): Promise<[NavBrand | null, NavElement[]]> {
    const entries = await fetchEntriesByContentType<ContentfulNav>('nav', 2);
    if (entries.length < 1) return [null, []];
    const entry = entries[0];
    const navBrand = entry.fields.navBrand ?? null;
    const navElements = entry.fields.navElements ?? [];
    return [mapNavBrand(navBrand), mapNavEntries(navElements)];
}