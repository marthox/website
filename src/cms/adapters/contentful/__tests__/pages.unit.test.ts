import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../client');

import { fetchEntriesByContentType } from '../client';
import { getPages } from '../pages';
import { makePage, makeSection, makeForm, makeItem, makeCTA, makeFormField } from './helpers';

const mockFetch = vi.mocked(fetchEntriesByContentType);

beforeEach(() => mockFetch.mockReset());

describe('getPages', () => {
    describe('page structure', () => {
        it('returns empty array when no pages exist', async () => {
            mockFetch.mockResolvedValue([]);
            expect(await getPages()).toEqual([]);
        });

        it('maps slug correctly', async () => {
            mockFetch.mockResolvedValue([makePage('p1', [], { slug: 'my-slug' })] as any);
            const [page] = await getPages();
            expect(page.slug).toBe('my-slug');
        });

        it('returns empty pageElements when field is undefined', async () => {
            const page = makePage('p1');
            page.fields.pageElements = undefined as any;
            mockFetch.mockResolvedValue([page] as any);
            const [result] = await getPages();
            expect(result.pageElements).toEqual([]);
        });

        it('filters out undefined page elements', async () => {
            mockFetch.mockResolvedValue([makePage('p1', [undefined, undefined])] as any);
            const [result] = await getPages();
            expect(result.pageElements).toEqual([]);
        });
    });

    describe('section mapping', () => {
        it('assigns kind: section to section entries', async () => {
            mockFetch.mockResolvedValue([makePage('p1', [makeSection()])] as any);
            const [{ pageElements }] = await getPages();
            expect(pageElements[0].kind).toBe('section');
        });

        it('maps section type', async () => {
            mockFetch.mockResolvedValue([makePage('p1', [makeSection('s1', { type: 'carousel' })])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'section') expect(pageElements[0].type).toBe('carousel');
        });

        it('maps section title, subtitle, theme, layout', async () => {
            const s = makeSection('s1', { title: 'T', subtitle: 'S', theme: 'accent', layout: 'split' });
            mockFetch.mockResolvedValue([makePage('p1', [s])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'section') {
                expect(pageElements[0]).toMatchObject({ title: 'T', subtitle: 'S', theme: 'accent', layout: 'split' });
            }
        });

        it('maps section ctas', async () => {
            const cta = makeCTA('c1', { label: 'Go', href: '/go', variant: 'ghost', openInNewTab: true });
            const s = makeSection('s1', { ctas: [cta] });
            mockFetch.mockResolvedValue([makePage('p1', [s])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'section') {
                expect(pageElements[0].ctas?.[0]).toEqual({ label: 'Go', href: '/go', variant: 'ghost', openInNewTab: true });
            }
        });

        it('filters undefined ctas from section', async () => {
            const s = makeSection('s1', { ctas: [undefined, makeCTA()] });
            mockFetch.mockResolvedValue([makePage('p1', [s])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'section') expect(pageElements[0].ctas).toHaveLength(1);
        });

        it('maps section items', async () => {
            const item = makeItem('i1', { type: 'stat', title: 'Revenue', value: '$1M', icon: 'dollar', ctas: [] });
            const s = makeSection('s1', { items: [item] });
            mockFetch.mockResolvedValue([makePage('p1', [s])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'section') {
                expect(pageElements[0].items?.[0]).toMatchObject({ type: 'stat', title: 'Revenue', value: '$1M', icon: 'dollar' });
            }
        });

        it('filters undefined items from section', async () => {
            const s = makeSection('s1', { items: [undefined, makeItem()] });
            mockFetch.mockResolvedValue([makePage('p1', [s])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'section') expect(pageElements[0].items).toHaveLength(1);
        });

        it('maps embedded form inside section', async () => {
            const form = makeForm('f1', [], { title: 'Newsletter', type: 'newsletter' });
            const s = makeSection('s1', { form });
            mockFetch.mockResolvedValue([makePage('p1', [s])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'section') {
                expect(pageElements[0].form?.kind).toBe('form');
                expect(pageElements[0].form?.title).toBe('Newsletter');
            }
        });

        it('sets form to undefined when section has no form field', async () => {
            const s = makeSection('s1', { form: undefined });
            mockFetch.mockResolvedValue([makePage('p1', [s])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'section') expect(pageElements[0].form).toBeUndefined();
        });
    });

    describe('form mapping', () => {
        it('assigns kind: form to form entries', async () => {
            mockFetch.mockResolvedValue([makePage('p1', [makeForm()])] as any);
            const [{ pageElements }] = await getPages();
            expect(pageElements[0].kind).toBe('form');
        });

        it('maps form title, type, submitLabel, successMessage, theme', async () => {
            const form = makeForm('f1', [], { title: 'Book', type: 'booking', submitLabel: 'Book Now', successMessage: 'Booked!', theme: 'dark' });
            mockFetch.mockResolvedValue([makePage('p1', [form])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'form') {
                expect(pageElements[0]).toMatchObject({ title: 'Book', type: 'booking', submitLabel: 'Book Now', successMessage: 'Booked!', theme: 'dark' });
            }
        });

        it('maps form fields array', async () => {
            const ff = makeFormField('ff1', { label: 'Email', name: 'email', type: 'email', required: true });
            const form = makeForm('f1', [ff]);
            mockFetch.mockResolvedValue([makePage('p1', [form])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'form') {
                expect(pageElements[0].fields?.[0]).toMatchObject({ label: 'Email', name: 'email', type: 'email', required: true });
            }
        });

        it('filters undefined form fields', async () => {
            const form = makeForm('f1', [undefined, makeFormField()]);
            mockFetch.mockResolvedValue([makePage('p1', [form])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'form') expect(pageElements[0].fields).toHaveLength(1);
        });
    });

    describe('item mapping', () => {
        it('maps item ctas', async () => {
            const cta = makeCTA('c1', { label: 'Buy', href: '/buy', variant: 'primary', openInNewTab: false });
            const item = makeItem('i1', { ctas: [cta] });
            const s = makeSection('s1', { items: [item] });
            mockFetch.mockResolvedValue([makePage('p1', [s])] as any);
            const [{ pageElements }] = await getPages();
            if (pageElements[0].kind === 'section') {
                expect(pageElements[0].items?.[0].ctas?.[0]).toMatchObject({ label: 'Buy', href: '/buy' });
            }
        });
    });
});
