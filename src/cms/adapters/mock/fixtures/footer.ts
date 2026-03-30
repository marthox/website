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
                { label: 'About Us',    href: '#about'       },
                { label: 'Technology',  href: '#technology'  },
                { label: 'Contact',     href: '#contact'     },
            ],
        },
        {
            title: 'Markets',
            links: [
                { label: 'United States', href: '#solutions' },
                { label: 'LATAM',         href: '#solutions' },
            ],
        },
    ],
    socialLinks: [
        { label: 'LinkedIn',  href: 'https://linkedin.com',  icon: 'linkedin'  },
        { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
        { label: 'Twitter',   href: 'https://twitter.com',   icon: 'twitter'   },
    ],
    legalLinks: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Use',   href: '/terms'   },
    ],
    copyright: '© 2026 Digital Hub. All rights reserved.',
};
