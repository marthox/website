import type { Entry, Asset } from 'contentful';
import { fetchEntriesByContentType } from './client';
import type { ContentfulFooter, ContentfulCTA, ContentfulItem } from './types';
import type { Footer, FooterColumn, CTA } from '@/types/page';

type CTAEntry  = Entry<ContentfulCTA,  'WITHOUT_UNRESOLVABLE_LINKS'>;
type ItemEntry = Entry<ContentfulItem, 'WITHOUT_UNRESOLVABLE_LINKS'>;

function isEntry<T>(e: T | undefined): e is T {
    return Boolean(e);
}

function mapCTA(entry: CTAEntry): CTA {
    return {
        label: entry.fields.label,
        href: entry.fields.href,
        variant: entry.fields.variant as CTA['variant'],
        openInNewTab: entry.fields.openInNewTab,
        icon: entry.fields.icon,
    };
}

function mapColumn(entry: ItemEntry): FooterColumn {
    return {
        title: entry.fields.title,
        links: (entry.fields.ctas ?? []).filter(isEntry).map(mapCTA),
    };
}

export async function getFooter(): Promise<Footer | null> {
    const entries = await fetchEntriesByContentType<ContentfulFooter>('footer', 2);
    if (!entries.length) return null;

    const entry = entries[0];
    const brand = entry.fields.brand as Asset<'WITHOUT_UNRESOLVABLE_LINKS'> | undefined;

    const rawUrl = brand?.fields?.file?.url;
    const brandSrc = rawUrl ? (rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl) : undefined;

    return {
        brand: brandSrc
            ? { src: brandSrc, alt: brand!.fields.description ?? '', href: '/' }
            : undefined,
        tagline: entry.fields.tagline,
        columns: (entry.fields.columns ?? []).filter(isEntry).map(mapColumn),
        socialLinks: (entry.fields.socialLinks ?? []).filter(isEntry).map(mapCTA),
        legalLinks: (entry.fields.legalLinks ?? []).filter(isEntry).map(mapCTA),
        copyright: entry.fields.copyright,
    };
}
