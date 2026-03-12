import type { NavBrand, NavElement } from '@/types/nav';

export const navFixture: [NavBrand | null, NavElement[]] = [
    {
        src: 'https://placehold.co/120x40/8B6F47/FAFAF8?text=MEA',
        alt: 'Manuela E. Aguirre',
        label: 'Manuela E. Aguirre',
        href: '/',
    },
    [
        { label: 'Home',    href: '/' },
        { label: 'About',   href: '/about' },
        {
            label: 'Works',
            submenu: [
                { label: 'Novels',  href: '/novels' },
                { label: 'Stories', href: '/stories' },
            ],
        },
        { label: 'Contact', href: '/contact' },
    ],
];
