import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client');

import { fetchEntriesByContentType } from '../client';
import { getFooter } from '../footer';
import { makeFooter, makeAsset, makeItem, makeCTA } from './helpers';

const mockFetch = vi.mocked(fetchEntriesByContentType);

beforeEach(() => mockFetch.mockReset());

describe('getFooter', () => {
    it('returns null when no entries exist', async () => {
        mockFetch.mockResolvedValue([]);
        expect(await getFooter()).toBeNull();
    });

    it('returns footer with tagline and copyright', async () => {
        mockFetch.mockResolvedValue([makeFooter()] as any);
        const footer = await getFooter();
        expect(footer?.tagline).toBe('Building digital experiences.');
        expect(footer?.copyright).toBe('© 2026 Acme');
    });

    it('returns null brand when no brand asset is set', async () => {
        mockFetch.mockResolvedValue([makeFooter()] as any);
        const footer = await getFooter();
        expect(footer?.brand).toBeUndefined();
    });

    it('maps brand asset to { src, alt, href }', async () => {
        const brand = makeAsset('logo1');
        mockFetch.mockResolvedValue([makeFooter('f1', { brand })] as any);
        const footer = await getFooter();
        expect(footer?.brand).toEqual({
            src: '//images.ctfassets.net/logo.png',
            alt: 'Site logo',
            href: '/',
        });
    });

    it('maps column items to FooterColumn[]', async () => {
        const col = makeItem('col1', {
            title: 'Company',
            ctas: [
                makeCTA('cta1', { label: 'About', href: '/about', variant: undefined, openInNewTab: false }),
            ],
        });
        mockFetch.mockResolvedValue([makeFooter('f1', { columns: [col] })] as any);
        const footer = await getFooter();
        expect(footer?.columns).toHaveLength(1);
        expect(footer?.columns?.[0].title).toBe('Company');
        expect(footer?.columns?.[0].links?.[0]).toMatchObject({ label: 'About', href: '/about' });
    });

    it('maps socialLinks with icon field', async () => {
        const social = makeCTA('cta2', { label: 'Twitter', href: 'https://x.com', icon: 'twitter' });
        mockFetch.mockResolvedValue([makeFooter('f1', { socialLinks: [social] })] as any);
        const footer = await getFooter();
        expect(footer?.socialLinks).toHaveLength(1);
        expect(footer?.socialLinks?.[0]).toMatchObject({ label: 'Twitter', icon: 'twitter' });
    });

    it('maps legalLinks correctly', async () => {
        const legal = makeCTA('cta3', { label: 'Privacy Policy', href: '/privacy' });
        mockFetch.mockResolvedValue([makeFooter('f1', { legalLinks: [legal] })] as any);
        const footer = await getFooter();
        expect(footer?.legalLinks).toHaveLength(1);
        expect(footer?.legalLinks?.[0].label).toBe('Privacy Policy');
    });

    it('handles undefined optional fields gracefully', async () => {
        const minimal = makeFooter('f1', { tagline: undefined, columns: undefined, socialLinks: undefined, legalLinks: undefined, copyright: undefined });
        mockFetch.mockResolvedValue([minimal] as any);
        const footer = await getFooter();
        expect(footer).not.toBeNull();
        expect(footer?.tagline).toBeUndefined();
        expect(footer?.columns).toEqual([]);
        expect(footer?.socialLinks).toEqual([]);
        expect(footer?.legalLinks).toEqual([]);
    });

    it('uses first entry when multiple exist', async () => {
        mockFetch.mockResolvedValue([
            makeFooter('f1', { copyright: 'First' }),
            makeFooter('f2', { copyright: 'Second' }),
        ] as any);
        const footer = await getFooter();
        expect(footer?.copyright).toBe('First');
    });
});
