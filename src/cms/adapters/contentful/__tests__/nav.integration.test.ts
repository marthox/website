/**
 * Integration tests for the nav adapter.
 *
 * These tests mock fetchEntriesByContentType with realistic data that mirrors
 * what the Contentful SDK returns, and verify the complete pipeline produces
 * a correctly shaped [NavBrand | null, NavElement[]] tuple.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('../client');

import { fetchEntriesByContentType } from '../client';
import { getNavElements } from '../nav';
import { makeNavEntry, makeNavElement } from './helpers';
import type { NavBrand, NavElement, NavLink, NavMenu } from '@/types/nav';

// ── Realistic fixture data ────────────────────────────────────────────────────

const fixtureNavBrand = {
    fields: {
        title: 'Manuela E. Aguirre',
        description: 'Site logo',
        file: { url: '//images.ctfassets.net/logo.png' },
    },
};

const fixtureNavEntry = makeNavEntry('nav1', [
    makeNavElement('el1', { label: 'Biografia', href: '/biografia' }),
    makeNavElement('el2', { label: 'Musica',    href: '/musica'    }),
    makeNavElement('el3', { label: 'Libros',    href: undefined, submenu: [
        makeNavElement('sub1', { label: 'Novelas',    href: '/libros/novelas'    }),
        makeNavElement('sub2', { label: 'Cuentos',    href: '/libros/cuentos'    }),
    ]}),
    makeNavElement('el4', { label: 'Contacto',  href: '/contacto'  }),
], { navBrand: fixtureNavBrand });

// ── Tests ────────────────────────────────────────────────────────────────────

let brand: NavBrand | null;
let elements: NavElement[];

beforeAll(async () => {
    vi.mocked(fetchEntriesByContentType).mockResolvedValue([fixtureNavEntry] as any);
    [brand, elements] = await getNavElements();
});

describe('getNavigation (integration)', () => {
    it('returns a tuple of [NavBrand, NavElement[]]', () => {
        expect(brand).not.toBeNull();
        expect(Array.isArray(elements)).toBe(true);
    });

    it('navBrand has all required fields', () => {
        expect(brand).toMatchObject({
            label: 'Manuela E. Aguirre',
            src: '//images.ctfassets.net/logo.png',
            alt: 'Site logo',
            href: '/',
        });
    });

    it('returns 4 nav elements', () => {
        expect(elements).toHaveLength(4);
    });

    it('nav links have label and href', () => {
        const links = elements.filter((el): el is NavLink => 'href' in el);
        expect(links.length).toBeGreaterThan(0);
        links.forEach(link => {
            expect(typeof link.label).toBe('string');
            expect(typeof link.href).toBe('string');
        });
    });

    it('nav menus have label and submenu array', () => {
        const menus = elements.filter((el): el is NavMenu => 'submenu' in el);
        expect(menus).toHaveLength(1);
        expect(menus[0].label).toBe('Libros');
        expect(menus[0].submenu).toHaveLength(2);
    });

    it('submenu items are valid NavLinks', () => {
        const menu = elements.find((el): el is NavMenu => 'submenu' in el) as NavMenu;
        menu.submenu.forEach(item => {
            expect(item).toHaveProperty('label');
            expect(item).toHaveProperty('href');
        });
    });

    it('nav elements preserve order from CMS', () => {
        const labels = elements.map(el => el.label);
        expect(labels).toEqual(['Biografia', 'Musica', 'Libros', 'Contacto']);
    });
});
