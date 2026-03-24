import { BLOCKS } from '@contentful/rich-text-types';
import type { Document } from '@contentful/rich-text-types';
import type { Page } from '@/types/page';

function p(text: string) {
    return {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [{ nodeType: 'text', value: text, marks: [], data: {} }],
    };
}

function ul(...items: string[]) {
    return {
        nodeType: BLOCKS.UL_LIST,
        data: {},
        content: items.map(item => ({
            nodeType: BLOCKS.LIST_ITEM,
            data: {},
            content: [p(item)],
        })),
    };
}

function doc(...nodes: object[]): Document {
    return { nodeType: BLOCKS.DOCUMENT, data: {}, content: nodes } as Document;
}

export const pagesFixture: Page[] = [
    {
        slug: 'home',
        pageElements: [
            // ── 1. Hero ────────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'hero',
                theme: 'dark',
                subtitle: 'DIGITAL HUB',
                title: 'We Build the Infrastructure That Makes Acquisition Predictable.',
                body: doc(p('Not an agency. Not a platform. Infrastructure.')),
                ctas: [
                    { label: 'Explore Our Solutions', href: '#solutions', variant: 'primary'   },
                    { label: 'Talk to Our Team',      href: '#contact',       variant: 'secondary' },
                ],
            },

            // ── 2a. About — two-column intro ──────────────────────────────────
            {
                kind: 'section',
                type: 'text',
                theme: 'light',
                layout: 'left',
                subtitle: 'ABOUT US',
                title: "We Don't Manage Campaigns. We Architect Acquisition Ecosystems.",
                body: doc(
                    p('Digital Hub was built to solve one problem: how to scale customer acquisition predictably, across markets, verticals and channels.'),
                    p('Today we operate a multi-vertical performance infrastructure that connects advertisers, publishers and buyers through proprietary technology and measurable acquisition models.'),
                    p('Operating across LATAM and the United States, Digital Hub has evolved into a performance engine designed for scalability, automation and intelligent decisioning.'),
                ),
            },

            // ── 2b. About — agency vs infrastructure comparison ───────────────
            {
                kind: 'section',
                type: 'text',
                theme: 'light',
                layout: 'comparison',
                body: doc(
                    p('The difference between an agency and infrastructure:'),
                    ul(
                        'Agencies optimise campaigns. We architect the system that campaigns run on.',
                        'Agencies report on performance. We engineer the conditions that create it.',
                        'Agencies depend on platforms. We build ours.',
                    ),
                ),
            },

            // ── 3. Core Pillars (TABS) ─────────────────────────────────────────
            {
                kind: 'section',
                type: 'tabs',
                theme: 'dark',
                subtitle: 'CORE PILLARS',
                title: 'Connect. Convert. Control.',
                items: [
                    {
                        type: 'tab',
                        title: 'Connect',
                        value: 'AFFILIA|PAY PER CALL',
                        subtitle: 'Traffic That Means Business',
                        body: doc(p('Affilia is our publisher network and affiliate infrastructure. We connect premium advertisers with qualified traffic sources across verticals — from finance and insurance to utilities and telecoms — operating in both the UK and US markets.')),
                        ctas: [{ label: 'Explore Affilia', href: '#solutions', variant: 'ghost' }],
                    },
                    {
                        type: 'tab',
                        title: 'Convert',
                        value: 'PING POST|LEAD MARKETPLACE',
                        subtitle: 'Turning Data Into Decisions at Scale',
                        body: doc(p('Our Pay Per Call division engineers the entire acquisition pipeline — from generating high-intent consumer demand to routing calls and leads with precision to the right buyer, at the right moment.')),
                        ctas: [{ label: 'Explore Pay Per Call', href: '#solutions', variant: 'ghost' }],
                    },
                    {
                        type: 'tab',
                        title: 'Control',
                        value: 'ANALYTICS|OPTIMISATION',
                        subtitle: 'Intelligent Systems That Improve Themselves',
                        body: doc(p('Our Ping Post infrastructure operates a real-time lead exchange that pings potential buyers with anonymised lead data before committing to a full post. Decisioning happens in milliseconds.')),
                        ctas: [{ label: 'Explore Ping Post', href: '#solutions', variant: 'ghost' }],
                    },
                ],
            },

            // ── 4. Solutions (CARDS) ───────────────────────────────────────────
            {
                kind: 'section',
                type: 'cards',
                theme: 'light',
                subtitle: 'TECH SOLUTIONS',
                title: 'Performance Models Powered by Proprietary Technology',
                body: doc(p('Our infrastructure is structured around three high-growth acquisition engines. Each one is designed to maximise revenue efficiency and deliver measurable outcomes.')),
                items: [
                    {
                        type: 'card',
                        icon: '🌐',
                        title: 'Affilia',
                        subtitle: 'Publisher Network & Affiliate Infrastructure',
                        body: doc(
                            p('Our multi-vertical affiliate network connects advertisers with premium publishers across finance, insurance, utilities and telecoms.'),
                            ul(
                                'Multi-vertical publisher network',
                                'UK and US market coverage',
                                'Automated optimisation layers',
                                'Fraud prevention architecture',
                                'International publisher network',
                            ),
                        ),
                        ctas: [{ label: 'Learn More →', href: '#contact', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        icon: '📞',
                        title: 'Pay Per Call',
                        subtitle: 'High-Intent Acquisition Engine',
                        body: doc(
                            p("We don't deliver leads. We deliver live consumer intent. Our Pay Per Call division is engineered to generate and route high-intent inbound calls in the US market."),
                            ul(
                                'High-intent inbound acquisition',
                                'Intelligent call routing with IVR logic',
                                'Vertical campaign specialisation',
                                'Real-time performance dashboards',
                                'Conversion optimisation layers',
                            ),
                        ),
                        ctas: [{ label: 'Learn More →', href: '#contact', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        icon: '⚡',
                        title: 'Ping Post',
                        subtitle: 'Real-Time Lead Marketplace Infrastructure',
                        body: doc(
                            p("Every lead is pinged, scored and matched before it's ever delivered. Our real-time lead exchange operates on millisecond decisioning and intelligent routing."),
                            ul(
                                'Real-time bidding with millisecond decisioning',
                                'API-based CRM integrations',
                                'Lead scoring with custom criteria',
                                'Intelligent routing architecture',
                                'Revenue maximisation algorithms',
                            ),
                        ),
                        ctas: [{ label: 'Learn More →', href: '#contact', variant: 'ghost' }],
                    },
                ],
            },

            // ── 5. Why Digital Hub (FEATURES) ─────────────────────────────────
            {
                kind: 'section',
                type: 'features',
                theme: 'dark',
                subtitle: 'WHY DIGITAL HUB',
                title: 'Infrastructure Over Intermediation.',
                body: doc(p('Most companies position themselves between advertisers and results. We position ourselves beneath them — as the infrastructure that makes results possible.')),
                items: [
                    {
                        type: 'feature',
                        icon: '🏗️',
                        title: 'Owned Infrastructure',
                        subtitle: 'No dependency on third-party platforms',
                        body: doc(p('We own and operate our own technology stack. No platform dependencies, no margin compression, no single points of failure.')),
                    },
                    {
                        type: 'feature',
                        icon: '🌍',
                        title: 'Multi-Market Expertise',
                        subtitle: 'UK and US operational presence',
                        body: doc(p('We understand both markets at the data and regulatory level.')),
                    },
                    {
                        type: 'feature',
                        icon: '📊',
                        title: 'Data-First Culture',
                        subtitle: 'Every decision made from real-time signals',
                        body: doc(p('Traffic quality, lead scoring, campaign optimisation, routing logic — all driven by real-time signals, not intuition.')),
                    },
                    {
                        type: 'feature',
                        icon: '🤖',
                        title: 'Automated Optimisation Systems',
                        subtitle: 'Performance compounds over time',
                        body: doc(p("Performance doesn't require manual intervention. Our systems detect underperformance and optimise autonomously — ensuring results compound over time.")),
                    },
                    {
                        type: 'feature',
                        icon: '🤝',
                        title: 'Long-Term Strategic Partnerships',
                        subtitle: 'We build deep, lasting relationships',
                        body: doc(p("We don't work with everyone. We build deep, long-term relationships with partners who are serious about scale — and we invest in their growth accordingly.")),
                    },
                    {
                        type: 'feature',
                        icon: '🔒',
                        title: 'Compliance-Ready Architecture',
                        subtitle: 'Built for regulated verticals',
                        body: doc(p('Every system is designed with compliance in mind. From data handling to consent management, we operate within the strictest regulatory frameworks.')),
                    },
                ],
            },

            // ── 6. Stats ───────────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'stats',
                theme: 'light',
                subtitle: 'TRACK RECORD',
                title: 'By the Numbers',
                items: [
                    { type: 'stat', value: '$2B+',  title: 'Revenue Generated'   },
                    { type: 'stat', value: '500+',  title: 'Publisher Partners'  },
                    { type: 'stat', value: '15M+',  title: 'Leads Processed'     },
                    { type: 'stat', value: '12',    title: 'Markets Served'      },
                ],
            },

            // ── 7. Technology ──────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'text',
                theme: 'dark',
                subtitle: 'OUR TECHNOLOGY',
                title: 'Technology Is Not a Support Function. It Is Our Competitive Advantage.',
                body: doc(
                    p("Every layer of Digital Hub's infrastructure is built on proprietary technology developed specifically for performance acquisition. We don't use off-the-shelf solutions because off-the-shelf solutions weren't built for the complexity we operate at."),
                    p('What our tech stack enables:'),
                    ul(
                        'Custom tracking systems with full attribution across every touchpoint',
                        'Real-time analytics dashboards with live performance signals',
                        'Multi-layer fraud detection that protects every campaign',
                        'API connectivity infrastructure for seamless partner integration',
                        'Intelligent optimisation algorithms that improve performance autonomously',
                    ),
                    p('Built for speed. Built for control. Built for scale.'),
                ),
            },

            // ── 8. Segmented CTA (CARDS / roles) ──────────────────────────────
            {
                kind: 'section',
                type: 'cards',
                theme: 'dark',
                layout: 'roles',
                subtitle: 'GET STARTED',
                title: 'Ready to Plug Into Our Infrastructure?',
                body: doc(p("Whether you're looking to scale customer acquisition, monetise high-quality traffic or buy pre-qualified leads at volume — there's a Digital Hub engine built for your model.")),
                items: [
                    {
                        type: 'card',
                        title: "I'M AN ADVERTISER",
                        subtitle: 'Scale your customer acquisition with performance-only models.',
                        ctas: [{ label: 'Explore Advertiser Solutions', href: '#contact', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        title: "I'M A PUBLISHER",
                        subtitle: 'Monetise your traffic with full control and real-time data.',
                        ctas: [{ label: 'Explore Publisher Solutions', href: '#contact', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        title: "I'M A LEAD BUYER",
                        subtitle: 'Access pre-qualified, scored leads at the volume you need.',
                        ctas: [{ label: 'Explore Lead Buyer Solutions', href: '#contact', variant: 'ghost' }],
                    },
                ],
                ctas: [{ label: 'Schedule a Strategy Call', href: '#contact', variant: 'primary' }],
            },

            // ── 9. Contact Form ────────────────────────────────────────────────
            {
                kind: 'form',
                theme: 'dark',
                title: "Let's Connect",
                subtitle: "Tell us where you are in your growth journey and we'll match you with the right acquisition engine.",
                type: 'contact',
                fields: [
                    { label: 'Full Name',      name: 'name',    type: 'text',     placeholder: 'Your full name',           required: true },
                    { label: 'Email Address',  name: 'email',   type: 'email',    placeholder: 'you@company.com',          required: true },
                    { label: 'Message',        name: 'message', type: 'textarea', placeholder: 'Tell us about your goals', required: true },
                ],
                submitLabel:    'Send Message',
                successMessage: "Thank you — we'll be in touch within one business day.",
            },
        ],
    },
];
