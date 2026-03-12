import { BLOCKS } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';
import type { Page } from '@/types/page';

/** Creates a minimal valid Contentful Document with a single paragraph. */
function paragraph(text: string): Document {
    return {
        nodeType: BLOCKS.DOCUMENT,
        data: {},
        content: [
            {
                nodeType: BLOCKS.PARAGRAPH,
                data: {},
                content: [{ nodeType: 'text', value: text, marks: [], data: {} }],
            },
        ],
    };
}

export const pagesFixture: Page[] = [
    {
        slug: 'home',
        pageElements: [
            // ── 1. Hero ────────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'hero',
                title: 'Stories That Live In You',
                subtitle: 'Award-winning fiction exploring the human condition.',
                body: paragraph(
                    'From the mountains of Colombia to the streets of Buenos Aires, my novels weave together memory, identity, and the quiet revolutions of everyday life.'
                ),
                mediaUrl: 'https://placehold.co/1200x600/1A1A1A/FAFAF8?text=Hero+Image',
                ctas: [
                    { label: 'Explore My Works', href: '/works',  variant: 'primary'   },
                    { label: 'About Me',          href: '/about', variant: 'secondary' },
                ],
            },

            // ── 2. Banner ──────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'banner',
                title: 'New Novel: La Memoria del Agua',
                subtitle: 'Available now from Editorial Planeta.',
                theme: 'dark',
                ctas: [
                    { label: 'Buy Now', href: '/novels/la-memoria-del-agua', variant: 'primary' },
                ],
            },

            // ── 3. Features ────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'features',
                title: 'Why Readers Return',
                subtitle: 'Three things that define my writing.',
                items: [
                    {
                        type: 'feature',
                        icon: 'pen',
                        title: 'Lyrical Prose',
                        subtitle: 'Language as landscape',
                        body: paragraph(
                            'Each sentence is crafted to carry both meaning and music, drawing readers into worlds that feel lived-in and true.'
                        ),
                    },
                    {
                        type: 'feature',
                        icon: 'heart',
                        title: 'Human Stories',
                        subtitle: 'The personal made universal',
                        body: paragraph(
                            'My characters face ordinary struggles that illuminate something essential about what it means to be alive in this century.'
                        ),
                    },
                    {
                        type: 'feature',
                        icon: 'map',
                        title: 'Vivid Landscapes',
                        subtitle: 'Place as character',
                        body: paragraph(
                            'Latin America is not backdrop but protagonist — its light, its grief, and its stubborn beauty alive on every page.'
                        ),
                    },
                ],
            },

            // ── 4. Cards ───────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'cards',
                title: 'Recent Works',
                subtitle: 'Fiction for readers who want to feel something.',
                items: [
                    {
                        type: 'card',
                        title: 'La Memoria del Agua',
                        subtitle: '2024 · Novel',
                        body: paragraph(
                            'A woman returns to her childhood village after decades abroad and must piece together what happened the summer the river changed course.'
                        ),
                        mediaUrl: 'https://placehold.co/400x560/8B6F47/FAFAF8?text=Book+1',
                        ctas: [{ label: 'Read More', href: '/novels/la-memoria-del-agua', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        title: 'El Año de los Pájaros',
                        subtitle: '2021 · Novel',
                        body: paragraph(
                            'Three siblings reunite after their mother\'s death and discover the letters she never sent — and the life she never spoke of.'
                        ),
                        mediaUrl: 'https://placehold.co/400x560/6B6560/FAFAF8?text=Book+2',
                        ctas: [{ label: 'Read More', href: '/novels/el-año-de-los-pajaros', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        title: 'Pequeñas Revoluciones',
                        subtitle: '2019 · Short Stories',
                        body: paragraph(
                            'Seven stories about the small acts of defiance that hold ordinary lives together.'
                        ),
                        mediaUrl: 'https://placehold.co/400x560/1A1A1A/FAFAF8?text=Book+3',
                        ctas: [{ label: 'Read More', href: '/stories/pequenas-revoluciones', variant: 'ghost' }],
                    },
                ],
            },

            // ── 5. Testimonials ────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'testimonials',
                title: 'What Readers Say',
                items: [
                    {
                        type: 'testimonial',
                        title: 'Elena Vargas',
                        subtitle: '"A novel that stays with you for years."',
                        body: paragraph('— The Buenos Aires Review'),
                    },
                    {
                        type: 'testimonial',
                        title: 'Marcos Ibáñez',
                        subtitle: '"Aguirre writes with the precision of a poet and the heart of a storyteller."',
                        body: paragraph('— El País Cultural'),
                    },
                ],
            },

            // ── 6. Stats ───────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'stats',
                title: 'By the Numbers',
                items: [
                    { type: 'stat', value: '8',    title: 'Published Novels'    },
                    { type: 'stat', value: '23',   title: 'Languages'           },
                    { type: 'stat', value: '1.2M', title: 'Readers Worldwide'   },
                    { type: 'stat', value: '4',    title: 'Literary Awards'     },
                ],
            },

            // ── 7. Text ────────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'text',
                title: 'About My Writing',
                layout: 'left',
                body: paragraph(
                    'I began writing at fourteen in a notebook my grandmother gave me. She told me to write down everything I didn\'t want to forget. I\'ve been writing ever since — not to remember, but to understand. My novels are explorations: of family, of place, of the stories we tell ourselves to survive.'
                ),
                ctas: [{ label: 'Read My Full Story', href: '/about', variant: 'ghost' }],
            },

            // ── 8. Gallery ─────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'gallery',
                title: 'From the Road',
                subtitle: 'Events, readings, and the places that inspire the work.',
                items: [
                    { type: 'slide', title: 'Hay Festival, Cartagena',        mediaUrl: 'https://placehold.co/600x400/8B6F47/FAFAF8?text=Gallery+1' },
                    { type: 'slide', title: 'Book Launch, Buenos Aires',       mediaUrl: 'https://placehold.co/600x400/6B6560/FAFAF8?text=Gallery+2' },
                    { type: 'slide', title: 'Literary Festival, Barcelona',    mediaUrl: 'https://placehold.co/600x400/1A1A1A/FAFAF8?text=Gallery+3' },
                    { type: 'slide', title: 'Writing Residency, Medellín',     mediaUrl: 'https://placehold.co/600x400/E5E0D8/1A1A1A?text=Gallery+4' },
                ],
            },

            // ── 9. Carousel ────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'carousel',
                title: 'Press Highlights',
                items: [
                    {
                        type: 'slide',
                        title: 'Shortlisted for the Premio Biblioteca Breve',
                        subtitle: 'One of the most anticipated novels of the year.',
                        ctas: [{ label: 'Read Coverage', href: '/press', variant: 'ghost' }],
                    },
                    {
                        type: 'slide',
                        title: 'Featured in El País "100 Books of the Decade"',
                        subtitle: 'El Año de los Pájaros named among the decade\'s best.',
                        ctas: [{ label: 'Read Coverage', href: '/press', variant: 'ghost' }],
                    },
                    {
                        type: 'slide',
                        title: 'New York Times Book Review',
                        subtitle: '"Aguirre is the voice of a generation."',
                        ctas: [{ label: 'Read Coverage', href: '/press', variant: 'ghost' }],
                    },
                ],
            },

            // ── 10. Form ───────────────────────────────────────────────────────
            {
                kind: 'form',
                title: 'Get in Touch',
                subtitle: 'For speaking engagements, rights inquiries, or reader mail.',
                type: 'contact',
                fields: [
                    { label: 'Your Name',      name: 'name',    type: 'text',     placeholder: 'Jane Smith',               required: true  },
                    { label: 'Email Address',  name: 'email',   type: 'email',    placeholder: 'jane@example.com',         required: true  },
                    { label: 'Message',        name: 'message', type: 'textarea', placeholder: 'Write your message here...', required: true },
                ],
                submitLabel:    'Send Message',
                successMessage: 'Thank you! I\'ll be in touch soon.',
            },
        ],
    },
];
