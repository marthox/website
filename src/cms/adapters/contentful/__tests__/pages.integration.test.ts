/**
 * Integration tests for the pages adapter.
 *
 * These tests mock fetchEntriesByContentType with a comprehensive, realistic
 * dataset that mirrors what the Contentful SDK returns. The goal is to verify
 * that the complete pipeline (client → mappers → generic Page[]) works correctly
 * end-to-end, not to test individual mapping behaviours in isolation.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('../client');

import { fetchEntriesByContentType } from '../client';
import { getPages } from '../pages';
import { makePage, makeSection, makeForm, makeItem, makeCTA, makeFormField } from './helpers';
import type { Page, Section, Form } from '@/types/page';

// ── Realistic fixture data ────────────────────────────────────────────────────

const fixture = makePage('pageExample', [
    makeSection('sectionHero', {
        type: 'hero',
        title: 'We Build Digital Experiences That Matter',
        subtitle: 'From concept to launch, we craft fast, scalable, and beautiful websites.',
        theme: 'dark',
        layout: 'center',
        ctas: [
            makeCTA('ctaGetStarted', { label: 'Get Started', href: '/contact', variant: 'primary', openInNewTab: false }),
            makeCTA('ctaLearnMore',  { label: 'Learn More',  href: '#features', variant: 'secondary', openInNewTab: false }),
        ],
    }),
    makeSection('sectionStats', {
        type: 'stats',
        title: 'Trusted by Businesses Worldwide',
        theme: 'accent',
        items: [
            makeItem('itemStat1', { type: 'stat', title: 'Projects Delivered', value: '150+', ctas: [] }),
            makeItem('itemStat2', { type: 'stat', title: 'Client Satisfaction', value: '98%',  ctas: [] }),
            makeItem('itemStat3', { type: 'stat', title: 'Years of Experience', value: '5+',   ctas: [] }),
        ],
    }),
    makeSection('sectionFeatures', {
        type: 'features',
        title: 'Why Work With Us',
        subtitle: 'We combine design, technology, and strategy.',
        theme: 'light',
        layout: 'center',
        items: [
            makeItem('itemFeat1', { type: 'feature', title: 'Performance First', icon: 'zap',         ctas: [] }),
            makeItem('itemFeat2', { type: 'feature', title: 'Content-Driven',    icon: 'edit',        ctas: [] }),
            makeItem('itemFeat3', { type: 'feature', title: 'Built to Scale',    icon: 'trending-up', ctas: [] }),
        ],
    }),
    makeSection('sectionCards', {
        type: 'cards',
        title: 'What We Do',
        theme: 'light',
        layout: 'center',
        items: [
            makeItem('itemCard1', { type: 'card', title: 'Web Design',       subtitle: 'Pixel-perfect', ctas: [] }),
            makeItem('itemCard2', { type: 'card', title: 'Development',      subtitle: 'Modern stack',  ctas: [] }),
            makeItem('itemCard3', { type: 'card', title: 'SEO & Performance',subtitle: 'Rank higher',   ctas: [] }),
        ],
    }),
    makeSection('sectionContact', {
        type: 'text',
        title: "Let's Talk",
        theme: 'light',
        layout: 'split',
        form: makeForm('formContact', [
            makeFormField('ffName',    { label: 'Full Name',     name: 'name',    type: 'text',     required: true }),
            makeFormField('ffEmail',   { label: 'Email Address', name: 'email',   type: 'email',    required: true }),
            makeFormField('ffMessage', { label: 'Message',       name: 'message', type: 'textarea', required: true }),
        ], { type: 'contact', submitLabel: 'Send Message', successMessage: 'Thanks!' }),
    }),
], { slug: 'example' });

// ── Tests ────────────────────────────────────────────────────────────────────

let pages: Page[];

beforeAll(async () => {
    vi.mocked(fetchEntriesByContentType).mockResolvedValue([fixture] as any);
    pages = await getPages();
});

describe('getPages (integration)', () => {
    it('returns one page', () => {
        expect(pages).toHaveLength(1);
    });

    it('page has the correct slug', () => {
        expect(pages[0].slug).toBe('example');
    });

    it('page has 5 page elements', () => {
        expect(pages[0].pageElements).toHaveLength(5);
    });

    it('all page elements are sections', () => {
        const kinds = pages[0].pageElements.map(el => el.kind);
        expect(kinds).toEqual(['section', 'section', 'section', 'section', 'section']);
    });

    it('sections have the correct types in order', () => {
        const types = pages[0].pageElements
            .filter((el): el is Section => el.kind === 'section')
            .map(s => s.type);
        expect(types).toEqual(['hero', 'stats', 'features', 'cards', 'text']);
    });

    it('hero section has 2 ctas', () => {
        const hero = pages[0].pageElements[0] as Section;
        expect(hero.ctas).toHaveLength(2);
        expect(hero.ctas?.[0]).toMatchObject({ label: 'Get Started', href: '/contact', variant: 'primary' });
        expect(hero.ctas?.[1]).toMatchObject({ label: 'Learn More', variant: 'secondary' });
    });

    it('stats section has 3 stat items with value fields', () => {
        const stats = pages[0].pageElements[1] as Section;
        expect(stats.items).toHaveLength(3);
        stats.items?.forEach(item => {
            expect(item.type).toBe('stat');
            expect(item.value).toBeDefined();
            expect(item.title).toBeDefined();
        });
    });

    it('features section has 3 feature items with icon fields', () => {
        const features = pages[0].pageElements[2] as Section;
        expect(features.items).toHaveLength(3);
        features.items?.forEach(item => {
            expect(item.type).toBe('feature');
            expect(item.icon).toBeDefined();
        });
    });

    it('cards section has 3 card items with subtitle', () => {
        const cards = pages[0].pageElements[3] as Section;
        expect(cards.items).toHaveLength(3);
        cards.items?.forEach(item => {
            expect(item.type).toBe('card');
            expect(item.subtitle).toBeDefined();
        });
    });

    it('contact section has an embedded form', () => {
        const contact = pages[0].pageElements[4] as Section;
        expect(contact.form?.kind).toBe('form');
        expect(contact.form?.type).toBe('contact');
    });

    it('embedded form has 3 fields with required name and type', () => {
        const contact = pages[0].pageElements[4] as Section;
        const form = contact.form as Form;
        expect(form.fields).toHaveLength(3);
        form.fields?.forEach(field => {
            expect(field.name).toBeDefined();
            expect(field.type).toBeDefined();
            expect(field.label).toBeDefined();
        });
    });

    it('all sections satisfy the Section interface shape', () => {
        pages[0].pageElements
            .filter((el): el is Section => el.kind === 'section')
            .forEach(section => {
                expect(section.kind).toBe('section');
                expect(typeof section.type).toBe('string');
            });
    });
});
