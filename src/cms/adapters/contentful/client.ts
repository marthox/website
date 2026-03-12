import type { Entry, EntrySkeletonType } from 'contentful';
import type { include_depth } from './types';
import { createClient } from 'contentful';

function getClient() {
    return createClient({
        space:       import.meta.env.CONTENTFUL_SPACE_ID     || '',
        accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN || '',
        environment: import.meta.env.CONTENTFUL_ENVIRONMENT  ?? 'master',
    }).withoutUnresolvableLinks;
}

export async function fetchEntriesByContentType<T extends EntrySkeletonType>(
    contentType: string,
    depth: include_depth
): Promise<Entry<T, 'WITHOUT_UNRESOLVABLE_LINKS'>[]> {
    try {
        const entries = await getClient().getEntries<T>({
            content_type: contentType,
            include: depth,
        });
        return entries.items;
    } catch (error) {
        console.error(`Error fetching entries for content type "${contentType}":`, error);
        return [];
    }
}
