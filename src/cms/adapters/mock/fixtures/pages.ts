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

function h2(text: string) {
    return {
        nodeType: BLOCKS.HEADING_2,
        data: {},
        content: [{ nodeType: 'text', value: text, marks: [], data: {} }],
    };
}

function h3(text: string) {
    return {
        nodeType: BLOCKS.HEADING_3,
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
                layout: 'left',
                subtitle: 'Performance Infrastructure · LATAM & US',
                title: 'We Build <span class="accent">Revenue</span> Infrastructure.',
                body: doc(p('Digital Hub is a multi-model performance infrastructure operating across LATAM and the US — integrating Affiliate Networks, Pay Per Call and Real-Time Lead Distribution through proprietary technology and intelligent optimization systems.')),
                ctas: [
                    { label: 'Explore Partnerships', href: '#solutions', variant: 'primary' },
                    { label: 'Our Solutions →', href: '#solutions', variant: 'secondary' },
                ],
            },

            // ── 2a. About — two-column intro ──────────────────────────────────
            {
                kind: 'section',
                type: 'features',
                theme: 'dark',
                layout: 'split',
                subtitle: 'ABOUT US',
                title: "We Don't Manage Campaigns.<br><span class=\"accent\">We Architect Acquisition Ecosystems.</span>",
                body: doc(
                    p('Digital Hub was built to solve one problem: how to scale customer acquisition predictably, across markets, verticals and channels.'),
                ),
                ctas: [
                    { label: 'Explore Our Solutions →', href: '#solutions', variant: 'ghost' },
                ],
                items: [
                    {
                        type: 'feature',
                        icon: '/icons/systems no campaigns.svg',
                        title: 'Systems, Not Campaigns',
                        subtitle: 'Traffic controlled. Data actionable. Revenue optimised.',
                        body: doc(p('We design systems where traffic is controlled, data is actionable, revenue is optimised and performance is predictable.')),
                    },
                    {
                        type: 'feature',
                        icon: '/icons/cross-border operaton.svg',
                        title: 'Cross-Border Operations',
                        subtitle: 'LATAM & US multi-vertical performance infrastructure.',
                        body: doc(p('Today we operate a multi-vertical performance infrastructure that connects advertisers, publishers and buyers through proprietary technology and measurable acquisition models.')),
                    },
                    {
                        type: 'feature',
                        icon: '/icons/Acquisition ecosystem.svg',
                        title: 'Acquisition Ecosystems',
                        subtitle: 'Built for scalability, automation and intelligent decisioning.',
                        body: doc(p('Operating across LATAM and the United States, Digital Hub has evolved into a performance engine designed for scalability, automation and intelligent decisioning.')),
                    },
                    {
                        type: 'testimonial',
                        body: doc(p('"We create acquisition environments where performance compounds over time."')),
                    },
                ],
            },

            // ── 2b. About — agency vs infrastructure comparison ───────────────
            {
                kind: 'section',
                type: 'text',
                theme: 'dark',
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
                theme: 'dark',
                subtitle: 'TECH SOLUTIONS',
                title: 'Performance Models Powered by Proprietary Technology',
                body: doc(p('Our infrastructure is structured around three high-growth acquisition engines. Each one is designed to maximise revenue efficiency and deliver measurable outcomes.')),
                items: [
                    {
                        type: 'card',
                        icon: '/icons/Affilia.svg',
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
                        icon: '/icons/Pay per call.svg',
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
                        icon: '/icons/ping post.svg',
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
                        icon: '/icons/Owned infraestructure.svg',
                        title: 'Owned Infrastructure',
                        subtitle: 'No dependency on third-party platforms',
                        body: doc(p('We own and operate our own technology stack. No platform dependencies, no margin compression, no single points of failure.')),
                    },
                    {
                        type: 'feature',
                        icon: '/icons/multimarket expertise.svg',
                        title: 'Multi-Market Expertise',
                        subtitle: 'UK and US operational presence',
                        body: doc(p('We understand both markets at the data and regulatory level.')),
                    },
                    {
                        type: 'feature',
                        icon: '/icons/Data first culture.svg',
                        title: 'Data-First Culture',
                        subtitle: 'Every decision made from real-time signals',
                        body: doc(p('Traffic quality, lead scoring, campaign optimisation, routing logic — all driven by real-time signals, not intuition.')),
                    },
                    {
                        type: 'feature',
                        icon: '/icons/automated optimization systems.svg',
                        title: 'Automated Optimisation Systems',
                        subtitle: 'Performance compounds over time',
                        body: doc(p("Performance doesn't require manual intervention. Our systems detect underperformance and optimise autonomously — ensuring results compound over time.")),
                    },
                    {
                        type: 'feature',
                        icon: '/icons/long term partner.svg',
                        title: 'Long-Term Strategic Partnerships',
                        subtitle: 'We build deep, lasting relationships',
                        body: doc(p("We don't work with everyone. We build deep, long-term relationships with partners who are serious about scale — and we invest in their growth accordingly.")),
                    },
                    {
                        type: 'feature',
                        icon: '/icons/compliance ready infra.svg',
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
                theme: 'dark',
                subtitle: 'TRACK RECORD',
                title: 'By the Numbers',
                items: [
                    { type: 'stat', value: '$2B+', title: 'Revenue Generated' },
                    { type: 'stat', value: '500+', title: 'Publisher Partners' },
                    { type: 'stat', value: '15M+', title: 'Leads Processed' },
                    { type: 'stat', value: '12', title: 'Markets Served' },
                ],
            },

            // ── 7. Technology ──────────────────────────────────────────────────
            {
                kind: 'section',
                type: 'cards',
                theme: 'dark',
                layout: 'tech',
                subtitle: 'OUR TECHNOLOGY',
                title: 'Technology Is Not a Support Function. It Is Our Competitive Advantage.',
                body: doc(p("Every layer of Digital Hub's infrastructure is built on proprietary technology developed specifically for performance acquisition. We don't use off-the-shelf solutions because off-the-shelf solutions weren't built for the complexity we operate at.")),
                ctas: [{ label: 'Built for speed. Built for control. Built for scale.', href: '#contact', variant: 'primary' }],
                items: [
                    {
                        type: 'card',
                        icon: '/icons/custom attribution tracking.svg',
                        title: 'Custom Tracking',
                        subtitle: 'Full attribution across every touchpoint',
                        ctas: [{ label: 'Learn More', href: '#contact', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        icon: '/icons/real time analytics.svg',
                        title: 'Real-Time Analytics',
                        subtitle: 'Live performance signals and dashboards',
                        ctas: [{ label: 'Learn More', href: '#contact', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        icon: '/icons/FRAUD DETECTION.svg',
                        title: 'Fraud Detection',
                        subtitle: 'Multi-layer protection for every campaign',
                        ctas: [{ label: 'Learn More', href: '#contact', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        icon: '/icons/API INFRAESTRUCTURE.svg',
                        title: 'API Infrastructure',
                        subtitle: 'Seamless partner integration connectivity',
                        ctas: [{ label: 'Learn More', href: '#contact', variant: 'ghost' }],
                    },
                    {
                        type: 'card',
                        icon: '/icons/intelligent optimisation.svg',
                        title: 'Intelligent Optimisation',
                        subtitle: 'Algorithms that improve performance autonomously',
                        ctas: [{ label: 'Learn More', href: '#contact', variant: 'ghost' }],
                    },
                ],
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
                    { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name', required: true },
                    { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@company.com', required: true },
                    { label: 'Message', name: 'message', type: 'textarea', placeholder: 'Tell us about your goals', required: true },
                ],
                submitLabel: 'Send Message',
                successMessage: "Thank you — we'll be in touch within one business day.",
            },
        ],
    },

    // ── Privacy Policy ─────────────────────────────────────────────────────
    {
        slug: 'privacy-policy',
        seoTitle: 'Privacy Policy — Digital Hub',
        seoDescription: 'Learn how Digital Hub LLC collects, uses, and protects your personal information.',
        pageElements: [
            {
                kind: 'section',
                type: 'hero',
                theme: 'dark',
                layout: 'center',
                title: 'Privacy Policy',
                subtitle: 'Last updated: January 2026',
                body: doc(p('Digital Hub LLC ("Digital Hub," "Company," "we," "us," or "our") is a marketing agency registered in the State of Delaware, with offices at 1441 Brickell Ave, Suite 1018, Miami, FL 33131. We operate owned-and-operated (O&O) digital properties across multiple verticals, including Life Insurance, Auto Insurance, Finance, and Sweepstakes (the "Services").')),
            },
            {
                kind: 'section',
                type: 'text',
                theme: 'dark',
                body: doc(
                    p('This Privacy Policy explains how we collect, use, share, and protect personal information collected through our websites, landing pages, forms, and related technologies (collectively, the "Sites"). This policy is designed to meet strict U.S. advertiser and network compliance standards.'),
                    p('By accessing or using the Services, you acknowledge that you have read, understood, and agreed to this Privacy Policy.'),

                    h2('1. Scope of This Policy'),
                    p('This Privacy Policy applies to the following Digital Hub O&O domains, including any subdomains, landing pages, or campaign-specific URLs:'),
                    ul(
                        'https://completecoveragehub.com/',
                        'https://smartautoprice.com/',
                        'https://freegiftgrabber.com/',
                        'https://cashloanmatch.com/',
                    ),
                    p('The Services are intended exclusively for users located in the United States.'),

                    h2('2. Information We Collect'),
                    h3('2.1 Personal Information'),
                    p('Depending on the campaign and vertical, we may collect the following categories of personal information directly from users:'),
                    ul(
                        'Full name',
                        'Email address',
                        'Telephone number',
                        'Date of birth',
                        'Residential address and ZIP code',
                        'Insurance-related information',
                        'Financial-related information',
                        'Household-related information, including income and dependents (where applicable)',
                    ),
                    p('We do not knowingly collect Social Security numbers or detailed medical records.'),

                    h3('2.2 Automatically Collected Information'),
                    p('We may automatically collect certain information when users interact with the Sites, including:'),
                    ul(
                        'IP address',
                        'Browser type and device information',
                        'Operating system',
                        'Referring URLs and timestamps',
                        'Interaction and submission metadata',
                    ),

                    h2('3. Purpose of Data Collection'),
                    p('We collect and process personal information for the following purposes:'),
                    ul(
                        'Marketing and lead generation activities',
                        'Matching consumers with relevant insurance, finance, or promotional offers',
                        'Transmitting leads to third-party advertisers, carriers, brokers, or licensed agents',
                        'Campaign analytics, attribution, and quality control',
                        'Fraud prevention, risk assessment, and traffic validation',
                        'Compliance with applicable legal and regulatory obligations',
                    ),

                    h2('4. Consent and User Acknowledgment'),
                    p('By submitting information through any Digital Hub Site, you expressly authorize Digital Hub to collect, store, process, and share your information with third parties for marketing and lead distribution purposes.'),
                    p('You acknowledge and agree that:'),
                    ul(
                        'Your information may be shared with multiple third-party advertisers or partners',
                        'Digital Hub acts as a marketing agency and lead generator, not as an insurer or lender',
                        'Digital Hub does not provide insurance, financial, or legal advice',
                    ),
                    p('Digital Hub does not initiate outbound phone calls, SMS messages, or prerecorded communications. Email communications, where applicable, are sent by third-party advertisers or partners, not directly by Digital Hub.'),

                    h2('5. Data Sharing and Lead Distribution'),
                    p('Digital Hub may share personal information with:'),
                    ul(
                        'Licensed insurance agents, brokers, and carriers',
                        'Financial service providers and lenders',
                        'Sweepstakes and promotional partners',
                        'Technology and compliance service providers',
                    ),
                    p('Lead distribution may occur through real-time technologies, including ping-post methodologies, where permitted.'),
                    p('Digital Hub does not distribute leads to third-party call centers for outbound solicitation.'),

                    h2('6. Cookies, Tracking, and Technology'),
                    p('Digital Hub limits the use of tracking technologies. We currently utilize:'),
                    ul(
                        'Fraud detection and traffic quality tools',
                        'Call tracking technologies (where applicable)',
                    ),
                    p('We do not use behavioral profiling, retargeting pixels, or session recording technologies.'),

                    h2('7. Data Retention'),
                    p('Personal information is retained only for as long as reasonably necessary to:'),
                    ul(
                        'Fulfill marketing and lead delivery purposes',
                        'Meet advertiser, network, and regulatory requirements',
                        'Resolve disputes and enforce contractual obligations',
                    ),
                    p('Retention periods are reviewed periodically and data is securely deleted when no longer required.'),

                    h2('8. Consumer Rights (U.S. State Privacy Laws)'),
                    p('Pursuant to applicable U.S. privacy laws, including the California Consumer Privacy Act (CCPA/CPRA), Virginia Consumer Data Protection Act (VCDPA), and Colorado Privacy Act (CPA), eligible consumers may have the right to:'),
                    ul(
                        'Request access to personal information collected',
                        'Request correction or deletion of personal information',
                        'Request information regarding data sharing practices',
                    ),
                    p('Requests may be submitted via email to privacy@dh-techs.com. Requests will be processed within 30 days, subject to verification requirements.'),

                    h2('9. Opt-Out and Communications'),
                    p('While Digital Hub does not engage in direct outbound communications, users may submit opt-out or data-related requests by contacting: privacy@dh-techs.com'),
                    p('Requests will be honored within 30 days of receipt, where applicable.'),

                    h2('10. Children\'s Privacy'),
                    p('The Services are intended solely for individuals aged 18 or older. We do not knowingly collect personal information from minors.'),

                    h2('11. Data Security'),
                    p('Digital Hub implements reasonable administrative, technical, and organizational safeguards to protect personal information. However, no system can be guaranteed to be completely secure.'),

                    h2('12. International Data Transfers'),
                    p('All data collected through the Services is processed and stored in the United States. We do not target or knowingly collect data from users outside the United States.'),

                    h2('13. Policy Updates'),
                    p('We reserve the right to update this Privacy Policy at any time. Updates will be effective immediately upon posting.'),

                    h2('14. Contact Information'),
                    p('Digital Hub LLC\n1441 Brickell Ave, Suite 1018\nMiami, FL 33131'),
                    p('Privacy: privacy@dh-techs.com\nLegal: legal@dh-techs.com\nCompliance: compliance@dh-techs.com'),
                ),
            },
        ],
    },

    // ── Terms & Conditions ─────────────────────────────────────────────────
    {
        slug: 'terms-and-conditions',
        seoTitle: 'Terms & Conditions — Digital Hub',
        seoDescription: 'Read the Terms and Conditions governing access to and use of Digital Hub LLC\'s Sites and Services.',
        pageElements: [
            {
                kind: 'section',
                type: 'hero',
                theme: 'dark',
                layout: 'center',
                title: 'Terms & Conditions',
                subtitle: 'Last updated: January 2026',
                body: doc(p('These Terms and Conditions ("Terms") govern access to and use of Digital Hub LLC\'s Sites and Services.')),
            },
            {
                kind: 'section',
                type: 'text',
                theme: 'dark',
                body: doc(
                    h2('1. Nature of Services'),
                    p('Digital Hub LLC operates as a marketing agency and lead generator. We do not provide insurance policies, financial products, lending decisions, or professional advice of any kind.'),

                    h2('2. Eligibility'),
                    p('You must be at least 18 years of age and located in the United States to use the Services.'),

                    h2('3. User Obligations'),
                    p('You agree to:'),
                    ul(
                        'Provide accurate and truthful information',
                        'Refrain from fraudulent, abusive, or misleading conduct',
                        'Use the Services solely for lawful purposes',
                    ),

                    h2('4. No Professional Advice'),
                    p('Content and information provided through the Sites are for marketing and informational purposes only and do not constitute insurance, legal, or financial advice.'),

                    h2('5. Intellectual Property'),
                    p('All Site content, trademarks, and proprietary materials are owned by Digital Hub LLC or its licensors and may not be reproduced without prior written consent.'),

                    h2('6. Disclaimers'),
                    p('The Services are provided on an "as is" and "as available" basis without warranties of any kind.'),

                    h2('7. Limitation of Liability'),
                    p('To the fullest extent permitted by law, Digital Hub LLC shall not be liable for any indirect, incidental, consequential, or punitive damages arising from use of the Services.'),

                    h2('8. Indemnification'),
                    p('You agree to indemnify and hold harmless Digital Hub LLC from any claims arising out of your use of the Services or violation of these Terms.'),

                    h2('9. Governing Law'),
                    p('These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to conflict of law principles.'),

                    h2('10. Modifications and Termination'),
                    p('We reserve the right to modify these Terms or suspend Services at any time without notice.'),

                    h2('11. Contact'),
                    p('Legal inquiries may be directed to legal@dh-techs.com'),
                ),
            },
        ],
    },
];
