import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client');

import { fetchEntriesByContentType } from '../client';
import { getNavElements } from '../nav';
import { makeNavEntry, makeNavElement } from './helpers';

const mockFetch = vi.mocked(fetchEntriesByContentType);

beforeEach(() => mockFetch.mockReset());

describe('getNavElements', () => {
    it('returns [null, []] when no entries exist', async () => {
        mockFetch.mockResolvedValue([]);
        expect(await getNavElements()).toEqual([null, []]);
    });

    describe('navBrand', () => {
        it('returns null when navBrand is undefined', async () => {
            mockFetch.mockResolvedValue([makeNavEntry('n1', [makeNavElement()])] as any);
            const [brand] = await getNavElements();
            expect(brand).toBeNull();
        });

        it('returns null when navBrand is missing required fields', async () => {
            const navBrand = { fields: { title: 'Logo' } }; // missing description and file
            mockFetch.mockResolvedValue([makeNavEntry('n1', [], { navBrand })] as any);
            const [brand] = await getNavElements();
            expect(brand).toBeNull();
        });

        it('maps navBrand correctly when all fields are present', async () => {
            const navBrand = {
                fields: {
                    title: 'My Logo',
                    description: 'Site logo',
                    file: { url: '//images.ctfassets.net/logo.png' },
                },
            };
            mockFetch.mockResolvedValue([makeNavEntry('n1', [], { navBrand })] as any);
            const [brand] = await getNavElements();
            expect(brand).toEqual({ label: 'My Logo', src: '//images.ctfassets.net/logo.png', alt: 'Site logo', href: '/' });
        });
    });

    describe('navElements', () => {
        it('maps a nav element with href to a NavLink', async () => {
            const el = makeNavElement('el1', { label: 'About', href: '/about' });
            mockFetch.mockResolvedValue([makeNavEntry('n1', [el])] as any);
            const [, elements] = await getNavElements();
            expect(elements[0]).toEqual({ label: 'About', href: '/about' });
        });

        it('defaults href to empty string when missing', async () => {
            const el = makeNavElement('el1', { label: 'Home', href: undefined });
            mockFetch.mockResolvedValue([makeNavEntry('n1', [el])] as any);
            const [, elements] = await getNavElements();
            expect(elements[0]).toEqual({ label: 'Home', href: '' });
        });

        it('maps a nav element with submenu to a NavMenu', async () => {
            const child = makeNavElement('child1', { label: 'Sub', href: '/sub' });
            const el = makeNavElement('el1', { label: 'Menu', href: undefined, submenu: [child] });
            mockFetch.mockResolvedValue([makeNavEntry('n1', [el])] as any);
            const [, elements] = await getNavElements();
            expect(elements[0]).toEqual({ label: 'Menu', submenu: [{ label: 'Sub', href: '/sub' }] });
        });

        it('handles nested submenus', async () => {
            const grandchild = makeNavElement('gc1', { label: 'Deep', href: '/deep' });
            const child = makeNavElement('c1', { label: 'Child', href: undefined, submenu: [grandchild] });
            const el = makeNavElement('el1', { label: 'Top', href: undefined, submenu: [child] });
            mockFetch.mockResolvedValue([makeNavEntry('n1', [el])] as any);
            const [, elements] = await getNavElements();
            const top = elements[0] as { label: string; submenu: any[] };
            expect(top.submenu[0].submenu[0]).toEqual({ label: 'Deep', href: '/deep' });
        });

        it('filters out undefined nav elements', async () => {
            mockFetch.mockResolvedValue([makeNavEntry('n1', [undefined, makeNavElement()])] as any);
            const [, elements] = await getNavElements();
            expect(elements).toHaveLength(1);
        });

        it('returns multiple nav elements in order', async () => {
            const els = [
                makeNavElement('el1', { label: 'Home', href: '/' }),
                makeNavElement('el2', { label: 'About', href: '/about' }),
                makeNavElement('el3', { label: 'Contact', href: '/contact' }),
            ];
            mockFetch.mockResolvedValue([makeNavEntry('n1', els)] as any);
            const [, elements] = await getNavElements();
            expect(elements.map((e: any) => e.label)).toEqual(['Home', 'About', 'Contact']);
        });
    });
});
