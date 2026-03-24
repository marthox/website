import type { Footer } from '@/types/page';

export const footerFixture: Footer = {
    tagline: 'Performance infrastructure for predictable acquisition.',
    columns: [
        {
            title: 'Solutions',
            links: [
                { label: 'Affilia',       href: '#solutions' },
                { label: 'Pay Per Call',  href: '#solutions' },
                { label: 'Ping Post',     href: '#solutions' },
            ],
        },
        {
            title: 'Company',
            links: [
                { label: 'About',    href: '#about'   },
                { label: 'Contact',  href: '#contact' },
            ],
        },
    ],
    legalLinks: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Use',   href: '/terms'   },
    ],
    copyright: '© 2026 Digital Hub. All rights reserved.',
};
