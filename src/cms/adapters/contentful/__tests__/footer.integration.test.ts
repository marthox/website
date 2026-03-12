/**
 * Integration tests for the footer adapter.
 *
 * Mocks fetchEntriesByContentType with realistic data and verifies the
 * complete pipeline produces a correctly shaped Footer object.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('../client');

import { fetchEntriesByContentType } from '../client';
import { getFooter } from '../footer';
import { makeFooter, makeAsset, makeItem, makeCTA } from './helpers';
import type { Footer } from '@/types/page';

// ── Realistic fixture data ────────────────────────────────────────────────────

const fixtureBrand = makeAsset('logo', {
    title: 'Manuela E. Aguirre',
    description: 'Author logo',
    file: { url: '//images.ctfassets.net/brand.svg', contentType: 'image/svg+xml', details: { size: 512 } },
});

const fixtureFooter = makeFooter('footer1', {
    brand: fixtureBrand,
    tagline: 'Literature that moves you.',
    columns: [
        makeItem('col1', {
            title: 'Navigation',
            ctas: [
                makeCTA('link1', { label: 'Home',    href: '/',         variant: undefined, openInNewTab: false }),
                makeCTA('link2', { label: 'About',   href: '/about',    variant: undefined, openInNewTab: false }),
                makeCTA('link3', { label: 'Contact', href: '/contact',  variant: undefined, openInNewTab: false }),
            ],
        }),
        makeItem('col2', {
            title: 'Works',
            ctas: [
                makeCTA('link4', { label: 'Novels',  href: '/novels',  variant: undefined, openInNewTab: false }),
                makeCTA('link5', { label: 'Stories', href: '/stories', variant: undefined, openInNewTab: false }),
            ],
        }),
    ],
    socialLinks: [
        makeCTA('social1', { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram', variant: undefined }),
        makeCTA('social2', { label: 'Twitter',   href: 'https://x.com',         icon: 'twitter',   variant: undefined }),
    ],
    legalLinks: [
        makeCTA('legal1', { label: 'Privacy Policy', href: '/privacy', variant: undefined, openInNewTab: false }),
        makeCTA('legal2', { label: 'Terms of Use',   href: '/terms',   variant: undefined, openInNewTab: false }),
    ],
    copyright: '© 2026 Manuela E. Aguirre. All rights reserved.',
});

// ── Tests ────────────────────────────────────────────────────────────────────

let footer: Footer | null;

beforeAll(async () => {
    vi.mocked(fetchEntriesByContentType).mockResolvedValue([fixtureFooter] as any);
    footer = await getFooter();
});

describe('getFooter (integration)', () => {
    it('returns a non-null Footer', () => {
        expect(footer).not.toBeNull();
    });

    it('brand has correct src, alt and href', () => {
        expect(footer?.brand).toEqual({
            src: 'https://images.ctfassets.net/brand.svg',
            alt: 'Author logo',
            href: '/',
        });
    });

    it('has correct tagline and copyright', () => {
        expect(footer?.tagline).toBe('Literature that moves you.');
        expect(footer?.copyright).toBe('© 2026 Manuela E. Aguirre. All rights reserved.');
    });

    it('has 2 columns', () => {
        expect(footer?.columns).toHaveLength(2);
    });

    it('first column has title and 3 links', () => {
        const col = footer?.columns?.[0];
        expect(col?.title).toBe('Navigation');
        expect(col?.links).toHaveLength(3);
    });

    it('second column has title and 2 links', () => {
        const col = footer?.columns?.[1];
        expect(col?.title).toBe('Works');
        expect(col?.links).toHaveLength(2);
    });

    it('has 2 social links with icon field', () => {
        expect(footer?.socialLinks).toHaveLength(2);
        footer?.socialLinks?.forEach(link => {
            expect(typeof link.icon).toBe('string');
            expect(link.icon!.length).toBeGreaterThan(0);
        });
    });

    it('social links have correct icons', () => {
        const icons = footer?.socialLinks?.map(l => l.icon);
        expect(icons).toEqual(['instagram', 'twitter']);
    });

    it('has 2 legal links', () => {
        expect(footer?.legalLinks).toHaveLength(2);
        footer?.legalLinks?.forEach(link => {
            expect(typeof link.label).toBe('string');
            expect(typeof link.href).toBe('string');
        });
    });
});
