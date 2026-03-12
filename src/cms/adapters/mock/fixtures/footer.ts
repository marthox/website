import type { Footer } from '@/types/page';

export const footerFixture: Footer = {
    brand: {
        src: 'https://placehold.co/120x40/8B6F47/FAFAF8?text=MEA',
        alt: 'Manuela E. Aguirre',
        href: '/',
    },
    tagline: 'Literature that moves you.',
    columns: [
        {
            title: 'Navigation',
            links: [
                { label: 'Home',    href: '/' },
                { label: 'About',   href: '/about' },
                { label: 'Works',   href: '/works' },
                { label: 'Contact', href: '/contact' },
            ],
        },
        {
            title: 'Works',
            links: [
                { label: 'Novels',  href: '/novels' },
                { label: 'Stories', href: '/stories' },
            ],
        },
    ],
    socialLinks: [
        { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
        { label: 'Twitter',   href: 'https://x.com',        icon: 'twitter'   },
    ],
    legalLinks: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Use',   href: '/terms'   },
    ],
    copyright: '© 2026 Manuela E. Aguirre. All rights reserved.',
};
