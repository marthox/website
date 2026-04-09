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
                { label: 'About Us',    href: '/#about'       },
                { label: 'Technology',  href: '/#technology'  },
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
        { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/dh-techs',  icon: 'linkedin'  },
        { label: 'Instagram', href: 'https://www.instagram.com/digitalhub_techs', icon: 'instagram' },
        { label: 'Facebook',  href: 'https://www.facebook.com/DigitalHubTechs/',  icon: 'facebook'  },
    ],
    legalLinks: [
        { label: 'Privacy Policy',     href: '/privacy-policy'      },
        { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    ],
    copyright: '© 2026 Digital Hub. All rights reserved.',
};
