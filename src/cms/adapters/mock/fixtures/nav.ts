import type { NavBrand, NavElement } from '@/types/nav';

export const navFixture: [NavBrand | null, NavElement[]] = [
    {
        src: null,
        alt: 'Digital Hub',
        label: 'Digital Hub',
        href: '/',
    },
    [
        { label: 'Solutions', href: '#solutions' },
        { label: 'Why Us',    href: '#why-dh' },
        { label: 'Contact',   href: '#contact' },
    ],
];
