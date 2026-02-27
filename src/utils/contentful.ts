import type { Entry, EntrySkeletonType } from 'contentful';

import type { include_depth } from '@/types/contentful';

import { createClient } from 'contentful';

const client = createClient({
    space: import.meta.env.CONTENTFUL_SPACE_ID || '',
    accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN || '',
}).withoutUnresolvableLinks;

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
