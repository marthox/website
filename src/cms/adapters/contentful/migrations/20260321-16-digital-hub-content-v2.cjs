/**
 * Migration 16: Digital Hub content v2
 *
 * Fresh population after cleanup. Updated copy from client brief.
 * New sections: Core Pillars (tabs), Technology (text), Segmented CTA (cards/roles).
 *
 * Page element order:
 *  1. hero
 *  2. about (text/left)
 *  3. core-pillars (tabs)
 *  4. solutions (cards)
 *  5. why-dh (features)
 *  6. stats
 *  7. technology (text/center)
 *  8. contact (form)
 *  9. segmented-cta (cards/roles)
 */
module.exports = async function (migration, { makeRequest }) {
    // ── Helpers ───────────────────────────────────────────────────────────

    async function create(contentTypeId, fields) {
        const entry = await makeRequest({
            method: 'POST',
            url: '/entries',
            headers: { 'X-Contentful-Content-Type': contentTypeId },
            data: { fields },
        });
        await makeRequest({
            method: 'PUT',
            url: `/entries/${entry.sys.id}/published`,
            headers: { 'X-Contentful-Version': String(entry.sys.version) },
        });
        return entry;
    }

    function link(id) {
        return { sys: { type: 'Link', linkType: 'Entry', id } };
    }

    function f(val) { return { 'en-US': val }; }

    function doc(...nodes) {
        return { nodeType: 'document', data: {}, content: nodes };
    }

    function p(text, marks) {
        return {
            nodeType: 'paragraph', data: {},
            content: [{ nodeType: 'text', value: text, marks: marks ?? [], data: {} }],
        };
    }

    function ul(...items) {
        return {
            nodeType: 'unordered-list', data: {},
            content: items.map(text => ({
                nodeType: 'list-item', data: {},
                content: [p(text)],
            })),
        };
    }

    // ── siteTheme ─────────────────────────────────────────────────────────

    await create('siteTheme', {
        name:               f('Digital Hub Theme'),
        colorBg:            f('#080C14'),
        colorText:          f('#E8EDF5'),
        colorAccent:        f('#00CFFF'),
        fontHeading:        f('Inter'),
        fontBody:           f('Inter'),
        colorDarkBg:        f('#080C14'),
        colorDarkText:      f('#E8EDF5'),
        colorDarkSurface:   f('#0D1525'),
        colorDarkBorder:    f('#1E2D45'),
        colorDarkTextMuted: f('#8892B0'),
        colorDarkAccent:    f('#00CFFF'),
    });

    // ── navElements ────────────────────────────────────────────────────────

    const navSolutions = await create('navElement', {
        label: f('Solutions'),
        href:  f('#solutions'),
    });
    const navWhyUs = await create('navElement', {
        label: f('Why Us'),
        href:  f('#why-dh'),
    });
    const navContact = await create('navElement', {
        label: f('Contact'),
        href:  f('#contact'),
    });

    // ── nav ────────────────────────────────────────────────────────────────

    // navBrand omitted (optional Asset field — no logo to upload yet)
    await create('nav', {
        navElements:       f([link(navSolutions.sys.id), link(navWhyUs.sys.id), link(navContact.sys.id)]),
        distribution:      f('end'),
        hamburgerPosition: f('right'),
    });

    // ── CTAs ───────────────────────────────────────────────────────────────

    const ctaExplore = await create('cta', {
        label:   f('Explore Our Solutions'),
        href:    f('#solutions'),
        variant: f('primary'),
    });
    const ctaTalk = await create('cta', {
        label:   f('Talk to Our Team'),
        href:    f('#contact'),
        variant: f('secondary'),
    });
    const ctaConnect = await create('cta', {
        label:   f('Explore Affilia'),
        href:    f('#solutions'),
        variant: f('ghost'),
    });
    const ctaConvert = await create('cta', {
        label:   f('Explore Ping Post'),
        href:    f('#solutions'),
        variant: f('ghost'),
    });
    const ctaControl = await create('cta', {
        label:   f('Learn About Our Tech'),
        href:    f('#technology'),
        variant: f('ghost'),
    });
    const ctaAdvertiser = await create('cta', {
        label:   f('Explore Advertiser Solutions'),
        href:    f('#contact'),
        variant: f('ghost'),
    });
    const ctaPublisher = await create('cta', {
        label:   f('Join Our Publisher Network'),
        href:    f('#contact'),
        variant: f('ghost'),
    });
    const ctaBuyer = await create('cta', {
        label:   f('Access the Lead Marketplace'),
        href:    f('#contact'),
        variant: f('ghost'),
    });
    const ctaStrategy = await create('cta', {
        label:   f('Schedule a Strategy Call'),
        href:    f('#contact'),
        variant: f('primary'),
    });

    // ── Tab items (Core Pillars) ───────────────────────────────────────────

    const tabConnect = await create('item', {
        type:     f('tab'),
        title:    f('Connect'),
        subtitle: f('Traffic that means something.'),
        body:     f(doc(
            p('We source, qualify and route high-intent traffic across affiliate and inbound call channels. Every impression and every call is filtered, tracked and tied to an outcome.'),
        )),
        value: f('Affilia|Pay Per Call'),
        ctas:  f([link(ctaConnect.sys.id)]),
    });
    const tabConvert = await create('item', {
        type:     f('tab'),
        title:    f('Convert'),
        subtitle: f('Data that makes decisions.'),
        body:     f(doc(
            p('Our real-time infrastructure scores, bids and matches every lead in milliseconds — maximising revenue for sellers and reducing acquisition cost for buyers.'),
        )),
        value: f('Ping Post|Lead Marketplace'),
        ctas:  f([link(ctaConvert.sys.id)]),
    });
    const tabControl = await create('item', {
        type:     f('tab'),
        title:    f('Control'),
        subtitle: f('Infrastructure you own.'),
        body:     f(doc(
            p('No black boxes. Our proprietary tracking, fraud detection and optimisation layers give you full visibility and full control over every layer of the acquisition chain.'),
        )),
        value: f('Proprietary Tech Stack'),
        ctas:  f([link(ctaControl.sys.id)]),
    });

    // ── Solution card items ────────────────────────────────────────────────

    const cardAffilia = await create('item', {
        type:     f('card'),
        icon:     f('🔗'),
        title:    f('Affilia'),
        subtitle: f('Affiliate Infrastructure at Scale'),
        body:     f(doc(
            p('Affilia is not just an affiliate network. It\'s a controlled performance ecosystem built on proprietary tracking and optimisation technology.'),
            ul(
                'Real-time campaign intelligence',
                'In-house tracking technology',
                'Automated optimisation layers',
                'Fraud prevention architecture',
                'International publisher network',
            ),
        )),
    });
    const cardPayPerCall = await create('item', {
        type:     f('card'),
        icon:     f('📞'),
        title:    f('Pay Per Call'),
        subtitle: f('High-Intent Acquisition Engine'),
        body:     f(doc(
            p('We don\'t deliver leads. We deliver live consumer intent. Our Pay Per Call division is engineered to generate and route high-intent inbound calls in the US market.'),
            ul(
                'High-intent inbound acquisition',
                'Intelligent call routing with IVR logic',
                'Vertical campaign specialisation',
                'Real-time performance dashboards',
                'Conversion optimisation layers',
            ),
        )),
    });
    const cardPingPost = await create('item', {
        type:     f('card'),
        icon:     f('⚡'),
        title:    f('Ping Post'),
        subtitle: f('Real-Time Lead Marketplace Infrastructure'),
        body:     f(doc(
            p('Every lead is pinged, scored and matched before it\'s ever delivered. Our real-time lead exchange operates on millisecond decisioning and intelligent routing.'),
            ul(
                'Real-time bidding with millisecond decisioning',
                'API-based CRM integrations',
                'Lead scoring with custom criteria',
                'Intelligent routing architecture',
                'Revenue maximisation algorithms',
            ),
        )),
    });

    // ── Feature items (Why Digital Hub) ───────────────────────────────────

    const feat1 = await create('item', {
        type:     f('feature'),
        icon:     f('🛠'),
        title:    f('Proprietary Technology Stack'),
        subtitle: f('Our tracking, routing, fraud detection and analytics are built and owned by us — giving our partners a competitive edge that can\'t be replicated.'),
    });
    const feat2 = await create('item', {
        type:     f('feature'),
        icon:     f('⚙️'),
        title:    f('Multi-Model Acquisition Engines'),
        subtitle: f('Three distinct revenue engines — Affiliate, Pay Per Call and Ping Post — operating under one infrastructure. Flexibility without fragmentation.'),
    });
    const feat3 = await create('item', {
        type:     f('feature'),
        icon:     f('🌎'),
        title:    f('Cross-Border Operations'),
        subtitle: f('Native operations across LATAM and the US. Not expansion — infrastructure. We understand both markets at the data and regulatory level.'),
    });
    const feat4 = await create('item', {
        type:     f('feature'),
        icon:     f('📊'),
        title:    f('Data-First Culture'),
        subtitle: f('Every decision is made from data. Traffic quality, lead scoring, campaign optimisation, routing logic — all driven by real-time signals, not intuition.'),
    });
    const feat5 = await create('item', {
        type:     f('feature'),
        icon:     f('🤖'),
        title:    f('Automated Optimisation Systems'),
        subtitle: f('Performance doesn\'t require manual intervention. Our systems detect underperformance and optimise autonomously — ensuring results compound over time.'),
    });
    const feat6 = await create('item', {
        type:     f('feature'),
        icon:     f('🤝'),
        title:    f('Long-Term Strategic Partnerships'),
        subtitle: f('We don\'t work with everyone. We build deep, long-term relationships with partners who are serious about scale — and we invest in their growth accordingly.'),
    });

    // ── Stat items ─────────────────────────────────────────────────────────

    const stat1 = await create('item', {
        type:  f('stat'),
        value: f('$2B+'),
        title: f('Revenue Generated'),
    });
    const stat2 = await create('item', {
        type:  f('stat'),
        value: f('500+'),
        title: f('Publisher Partners'),
    });
    const stat3 = await create('item', {
        type:  f('stat'),
        value: f('15M+'),
        title: f('Leads Processed'),
    });
    const stat4 = await create('item', {
        type:  f('stat'),
        value: f('12'),
        title: f('Markets Served'),
    });

    // ── Role items (Segmented CTA) ─────────────────────────────────────────

    const roleAdvertiser = await create('item', {
        type:     f('card'),
        title:    f("I'M AN ADVERTISER"),
        subtitle: f('Scale your customer acquisition with performance-only models.'),
        ctas:     f([link(ctaAdvertiser.sys.id)]),
    });
    const rolePublisher = await create('item', {
        type:     f('card'),
        title:    f("I'M A PUBLISHER"),
        subtitle: f('Monetise your traffic with full control and real-time data.'),
        ctas:     f([link(ctaPublisher.sys.id)]),
    });
    const roleBuyer = await create('item', {
        type:     f('card'),
        title:    f("I'M A LEAD BUYER"),
        subtitle: f('Access pre-scored leads matched to your exact criteria.'),
        ctas:     f([link(ctaBuyer.sys.id)]),
    });

    // ── Form fields + form ─────────────────────────────────────────────────

    const ffName = await create('formField', {
        label:       f('Full Name'),
        name:        f('name'),
        type:        f('text'),
        placeholder: f('Your full name'),
        required:    f(true),
    });
    const ffEmail = await create('formField', {
        label:       f('Email Address'),
        name:        f('email'),
        type:        f('email'),
        placeholder: f('you@company.com'),
        required:    f(true),
    });
    const ffMessage = await create('formField', {
        label:       f('Message'),
        name:        f('message'),
        type:        f('textarea'),
        placeholder: f('Tell us about your goals'),
        required:    f(true),
    });

    const contactForm = await create('form', {
        title:          f("Let's Connect"),
        subtitle:       f('Tell us where you are in your growth journey and we\'ll match you with the right acquisition engine.'),
        type:           f('contact'),
        fields:         f([link(ffName.sys.id), link(ffEmail.sys.id), link(ffMessage.sys.id)]),
        submitLabel:    f('Send Message'),
        successMessage: f("Thank you — we'll be in touch within one business day."),
        theme:          f('dark'),
    });

    // ── Sections ──────────────────────────────────────────────────────────

    // 1. Hero
    const secHero = await create('section', {
        type:     f('hero'),
        title:    f('We Build the Infrastructure That Makes Acquisition Predictable.'),
        subtitle: f('DIGITAL HUB'),
        body:     f(doc(p('Not an agency. Not a platform. Infrastructure.'))),
        ctas:     f([link(ctaExplore.sys.id), link(ctaTalk.sys.id)]),
        theme:    f('dark'),
    });

    // 2. About
    const secAbout = await create('section', {
        type:     f('text'),
        layout:   f('left'),
        title:    f("We Don't Manage Campaigns. We Architect Acquisition Ecosystems."),
        subtitle: f('ABOUT US'),
        body:     f(doc(
            p('Digital Hub was built to solve one problem: how to scale customer acquisition predictably, across markets, verticals and channels.'),
            p('Today we operate a multi-vertical performance infrastructure that connects advertisers, publishers and buyers through proprietary technology and measurable acquisition models.'),
            p('Operating across LATAM and the United States, Digital Hub has evolved into a performance engine designed for scalability, automation and intelligent decisioning.'),
            p('The difference between an agency and infrastructure:'),
            ul(
                'Agencies optimise campaigns. We architect the system that campaigns run on.',
                'Agencies report on performance. We engineer the conditions that create it.',
                'Agencies depend on platforms. We build ours.',
            ),
        )),
        theme: f('light'),
    });

    // 3. Core Pillars (TABS)
    const secPillars = await create('section', {
        type:     f('tabs'),
        title:    f('Connect. Convert. Control.'),
        subtitle: f('CORE PILLARS'),
        items:    f([link(tabConnect.sys.id), link(tabConvert.sys.id), link(tabControl.sys.id)]),
        theme:    f('dark'),
    });

    // 4. Solutions (CARDS)
    const secSolutions = await create('section', {
        type:     f('cards'),
        title:    f('Performance Models Powered by Proprietary Technology'),
        subtitle: f('TECH SOLUTIONS'),
        body:     f(doc(p('Our infrastructure is structured around three high-growth acquisition engines. Each one is designed to maximise revenue efficiency and deliver measurable outcomes.'))),
        items:    f([link(cardAffilia.sys.id), link(cardPayPerCall.sys.id), link(cardPingPost.sys.id)]),
        theme:    f('light'),
    });

    // 5. Why Digital Hub (FEATURES)
    const secWhy = await create('section', {
        type:     f('features'),
        title:    f('Infrastructure Over Intermediation.'),
        subtitle: f('WHY DIGITAL HUB'),
        body:     f(doc(p('Most companies position themselves between advertisers and results. We position ourselves beneath them — as the infrastructure that makes results possible.'))),
        items:    f([
            link(feat1.sys.id), link(feat2.sys.id), link(feat3.sys.id),
            link(feat4.sys.id), link(feat5.sys.id), link(feat6.sys.id),
        ]),
        theme:    f('dark'),
    });

    // 6. Stats
    const secStats = await create('section', {
        type:     f('stats'),
        title:    f('By the Numbers'),
        subtitle: f('TRACK RECORD'),
        items:    f([link(stat1.sys.id), link(stat2.sys.id), link(stat3.sys.id), link(stat4.sys.id)]),
        theme:    f('light'),
    });

    // 7. Technology (TEXT)
    const secTech = await create('section', {
        type:     f('text'),
        layout:   f('center'),
        title:    f('Technology Is Not a Support Function. It Is Our Competitive Advantage.'),
        subtitle: f('OUR TECHNOLOGY'),
        body:     f(doc(
            p('Every layer of Digital Hub\'s infrastructure is built on proprietary technology developed specifically for performance acquisition. We don\'t use off-the-shelf solutions because off-the-shelf solutions weren\'t built for the complexity we operate at.'),
            p('What our tech stack enables:'),
            ul(
                'Custom tracking systems with full attribution across every touchpoint',
                'Real-time analytics dashboards with live performance signals',
                'Multi-layer fraud detection that protects every campaign',
                'API connectivity infrastructure for seamless partner integration',
                'Intelligent optimisation algorithms that improve performance autonomously',
            ),
            p('Built for speed. Built for control. Built for scale.'),
        )),
        theme: f('dark'),
    });

    // 9. Segmented CTA (CARDS / roles layout)
    const secCTA = await create('section', {
        type:     f('cards'),
        layout:   f('roles'),
        title:    f('Ready to Plug Into Our Infrastructure?'),
        subtitle: f('GET STARTED'),
        body:     f(doc(p("Whether you're looking to scale customer acquisition, monetise high-quality traffic or buy pre-qualified leads at volume — there's a Digital Hub engine built for your model."))),
        items:    f([link(roleAdvertiser.sys.id), link(rolePublisher.sys.id), link(roleBuyer.sys.id)]),
        ctas:     f([link(ctaStrategy.sys.id)]),
        theme:    f('dark'),
    });

    // ── Home page ─────────────────────────────────────────────────────────

    await create('page', {
        slug:  f('home'),
        pageElements: f([
            link(secHero.sys.id),
            link(secAbout.sys.id),
            link(secPillars.sys.id),
            link(secSolutions.sys.id),
            link(secWhy.sys.id),
            link(secStats.sys.id),
            link(secTech.sys.id),
            link(contactForm.sys.id),
            link(secCTA.sys.id),
        ]),
    });
};
