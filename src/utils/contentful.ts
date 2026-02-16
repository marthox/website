import type { Entry, EntrySkeletonType, Asset } from 'contentful';

import type { NavElement, NavBrand } from '@/types/nav';
import type { include_depth, ContentfulNav, ContentfulNavElement, ContentfulNavBrand } from '@/types/contentful';

import { createClient } from 'contentful';

const client = createClient({
    space: import.meta.env.CONTENTFUL_SPACE_ID || '',
    accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN || '',
}).withoutUnresolvableLinks;

type NavEntry = Entry<ContentfulNavElement, 'WITHOUT_UNRESOLVABLE_LINKS'>;

export async function fetchEntriesByContentType<T extends EntrySkeletonType>(
    contentType: string,
    depth: include_depth
): Promise<Entry<T, 'WITHOUT_UNRESOLVABLE_LINKS'>[]> {
    try {
        const entries = await client.getEntries<T>({
            content_type: contentType,
            include: depth,
        });
        return entries.items;
    } catch (error) {
        console.error(`Error fetching entries for content type "${contentType}":`, error);
        return [];
    }
}

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
