// Builds a minimal Contentful Entry sys object
export function makeSys(id: string, contentTypeId: string) {
    return {
        id,
        type: 'Entry' as const,
        contentType: { sys: { id: contentTypeId } },
        space: { sys: { id: 'test-space' } },
        environment: { sys: { id: 'master' } },
        revision: 1,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        locale: 'es',
    };
}

export function makeCTA(id = 'cta1', overrides: Record<string, unknown> = {}) {
    return {
        sys: makeSys(id, 'cta'),
        fields: { label: 'Get Started', href: '/contact', variant: 'primary', openInNewTab: false, ...overrides },
    };
}

export function makeFormField(id = 'ff1', overrides: Record<string, unknown> = {}) {
    return {
        sys: makeSys(id, 'formField'),
        fields: { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Jane Doe', required: true, ...overrides },
    };
}

export function makeForm(id = 'form1', formFields: unknown[] = [], overrides: Record<string, unknown> = {}) {
    return {
        sys: makeSys(id, 'form'),
        fields: {
            title: 'Contact Us', subtitle: 'Get in touch', type: 'contact',
            fields: formFields, submitLabel: 'Send', successMessage: 'Thanks!', theme: 'light',
            ...overrides,
        },
    };
}

export function makeItem(id = 'item1', overrides: Record<string, unknown> = {}) {
    return {
        sys: makeSys(id, 'item'),
        fields: { type: 'card', title: 'Test Item', subtitle: 'A subtitle', icon: 'star', value: '42', ctas: [], ...overrides },
    };
}

export function makeSection(id = 'section1', overrides: Record<string, unknown> = {}) {
    return {
        sys: makeSys(id, 'section'),
        fields: { type: 'hero', title: 'Test Section', subtitle: 'A subtitle', theme: 'dark', layout: 'center', items: [], ctas: [], ...overrides },
    };
}

export function makePage(id = 'page1', elements: unknown[] = [], overrides: Record<string, unknown> = {}) {
    return {
        sys: makeSys(id, 'page'),
        fields: { slug: 'test-page', pageElements: elements, ...overrides },
    };
}

export function makeNavElement(id = 'navEl1', overrides: Record<string, unknown> = {}) {
    return {
        sys: makeSys(id, 'navElement'),
        fields: { label: 'Home', href: '/', ...overrides },
    };
}

export function makeNavEntry(id = 'nav1', elements: unknown[] = [], overrides: Record<string, unknown> = {}) {
    return {
        sys: makeSys(id, 'nav'),
        fields: { name: 'Main Nav', navBrand: undefined, navElements: elements, ...overrides },
    };
}
