import type { Entry, EntrySkeletonType } from 'contentful';

import type { NavElement } from '@/types/nav';
import type { include_depth, ContentfulNav, ContentfulNavElement } from '@/types/contentful';

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

export async function getNavElements(): Promise<NavElement[]> { 
    const entries = await fetchEntriesByContentType<ContentfulNav>('nav', 2);
    const navElements = entries[0]?.fields.navElements ?? [];
    return mapNavEntries(navElements);
}
