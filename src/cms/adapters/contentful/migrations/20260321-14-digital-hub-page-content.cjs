/**
 * Migration: Digital Hub page content entries
 *
 * Creates (in dependency order):
 *  - 5 cta entries
 *  - 3 solution card item entries (AFFILIA, PAY PER CALL, PING POST)
 *  - 6 feature item entries
 *  - 4 stat item entries
 *  - 5 section entries (hero, about, solutions, why, stats)
 *  - 3 formField entries
 *  - 1 form entry (contact)
 *  - 1 page entry (home)
 *
 * All entries are published after creation.
 */
module.exports = async function (migration, { makeRequest }) {
  // ── Helpers ───────────────────────────────────────────────────────────────

  async function createEntry(contentTypeId, fields) {
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

  function field(val) {
    return { 'en-US': val };
  }

  function rtDoc(...nodes) {
    return {
      nodeType: 'document',
      data: {},
      content: nodes,
    };
  }

  function rtParagraph(text, marks) {
    return {
      nodeType: 'paragraph',
      data: {},
      content: [{ nodeType: 'text', value: text, marks: marks || [], data: {} }],
    };
  }

  function rtHeading4(text) {
    return {
      nodeType: 'heading-4',
      data: {},
      content: [{ nodeType: 'text', value: text, marks: [], data: {} }],
    };
  }

  function rtUL(items) {
    return {
      nodeType: 'unordered-list',
      data: {},
      content: items.map((text) => ({
        nodeType: 'list-item',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [{ nodeType: 'text', value: text, marks: [], data: {} }],
          },
        ],
      })),
    };
  }

  // ── A. CTA entries ────────────────────────────────────────────────────────

  const ctaHeroPrimary = await createEntry('cta', {
    label: field('Explorar Soluciones'),
    href: field('#solutions'),
    variant: field('primary'),
  });

  const ctaHeroSecondary = await createEntry('cta', {
    label: field('Conocer Más'),
    href: field('#about'),
    variant: field('secondary'),
  });

  const ctaAffilia = await createEntry('cta', {
    label: field('Explorar AFFILIA'),
    href: field('#solutions'),
    variant: field('ghost'),
  });

  const ctaPpc = await createEntry('cta', {
    label: field('Explorar Pay Per Call'),
    href: field('#solutions'),
    variant: field('ghost'),
  });

  const ctaPingpost = await createEntry('cta', {
    label: field('Explorar Ping Post'),
    href: field('#solutions'),
    variant: field('ghost'),
  });

  // ── B. Solution card item entries ─────────────────────────────────────────

  const itemAffilia = await createEntry('item', {
    type: field('card'),
    title: field('AFFILIA'),
    subtitle: field('Affiliate Infrastructure at Scale'),
    icon: field('🔗'),
    body: field(
      rtDoc(
        rtHeading4('Capabilities'),
        rtUL([
          'Multi-tier affiliate network management',
          'Real-time tracking and attribution',
          'Automated fraud prevention',
          'Dynamic commission structures',
          'Publisher quality scoring',
        ]),
        rtHeading4('Strategic Value'),
        rtUL([
          'Scale affiliate programs without overhead',
          'Reduce fraud by up to 40%',
          'Optimize publisher mix automatically',
          'Real-time performance reporting',
          'Cross-border affiliate operations',
        ])
      )
    ),
    ctas: field([link(ctaAffilia.sys.id)]),
  });

  const itemPpc = await createEntry('item', {
    type: field('card'),
    title: field('PAY PER CALL'),
    subtitle: field('High-Intent Acquisition Engine'),
    icon: field('📞'),
    body: field(
      rtDoc(
        rtHeading4('Capabilities'),
        rtUL([
          'Inbound call routing and tracking',
          'IVR qualification systems',
          'Real-time bidding for calls',
          'Call quality scoring algorithms',
          'Multi-vertical call distribution',
        ]),
        rtHeading4('Strategic Value'),
        rtUL([
          'Higher conversion rates vs digital leads',
          'Pay only for qualified conversations',
          'Expand into high-value verticals',
          'Automated call quality assurance',
          'Revenue optimization at scale',
        ])
      )
    ),
    ctas: field([link(ctaPpc.sys.id)]),
  });

  const itemPingpost = await createEntry('item', {
    type: field('card'),
    title: field('PING POST'),
    subtitle: field('Real-Time Lead Marketplace Infrastructure'),
    icon: field('💱'),
    body: field(
      rtDoc(
        rtHeading4('Capabilities'),
        rtUL([
          'Real-time lead bidding marketplace',
          'Intelligent lead routing engine',
          'Multi-buyer distribution system',
          'Lead quality scoring and filtering',
          'Automated compliance management',
        ]),
        rtHeading4('Strategic Value'),
        rtUL([
          'Maximize revenue per lead',
          'Connect buyers and sellers at scale',
          'Reduce lead acquisition costs',
          'Ensure regulatory compliance',
          'Data-driven optimization',
        ])
      )
    ),
    ctas: field([link(ctaPingpost.sys.id)]),
  });

  // ── C. Feature item entries ───────────────────────────────────────────────

  const featureItems = [];
  const featuresData = [
    { title: 'Proprietary Technology Stack', icon: '⚡' },
    { title: 'Multi-Model Acquisition Engines', icon: '🔄' },
    { title: 'Cross-Border Operations', icon: '🌎' },
    { title: 'Data-First Culture', icon: '📊' },
    { title: 'Automated Optimization Systems', icon: '🤖' },
    { title: 'Long-Term Strategic Partnerships', icon: '🤝' },
  ];

  for (const { title, icon } of featuresData) {
    const item = await createEntry('item', {
      type: field('feature'),
      title: field(title),
      icon: field(icon),
    });
    featureItems.push(item);
  }

  // ── D. Stat item entries ──────────────────────────────────────────────────

  const statItems = [];
  const statsData = [
    { value: '500+', title: 'Clientes Activos' },
    { value: '15',   title: 'Mercados' },
    { value: '$2B+', title: 'Revenue Optimizado' },
    { value: '98%',  title: 'Retención' },
  ];

  for (const { value, title } of statsData) {
    const item = await createEntry('item', {
      type: field('stat'),
      value: field(value),
      title: field(title),
    });
    statItems.push(item);
  }

  // ── E. Section entries ────────────────────────────────────────────────────

  // Hero section
  const sectionHero = await createEntry('section', {
    type: field('hero'),
    theme: field('dark'),
    layout: field('center'),
    title: field('We Build Revenue Infrastructure.'),
    subtitle: field('PERFORMANCE MARKETING INFRASTRUCTURE'),
    body: field(
      rtDoc(
        rtParagraph(
          'Digital Hub is a multi-model performance infrastructure operating across LATAM and the US — integrating Affiliate Networks, Pay Per Call and Real-Time Lead Distribution through proprietary technology and intelligent optimization systems.'
        )
      )
    ),
    ctas: field([link(ctaHeroPrimary.sys.id), link(ctaHeroSecondary.sys.id)]),
  });

  // About section
  const sectionAbout = await createEntry('section', {
    type: field('text'),
    layout: field('left'),
    title: field("We Are Not an Agency. We're Infrastructure."),
    subtitle: field('QUIÉNES SOMOS'),
    body: field(
      rtDoc(
        rtParagraph(
          'Digital Hub was born from a simple observation: performance marketing infrastructure in LATAM was fragmented, inefficient, and intermediary-heavy. We built the technology layer that was missing — a unified system that connects acquisition channels, optimizes performance in real time, and compounds results over time. Today we operate across 15+ markets with 500+ active clients generating over $2B in optimized revenue.'
        )
      )
    ),
  });

  // Solutions section
  const sectionSolutions = await createEntry('section', {
    type: field('cards'),
    title: field('Performance Models Powered by Proprietary Technology'),
    subtitle: field(
      'Our infrastructure is structured around three high-growth acquisition engines. Each one is designed to maximize revenue efficiency.'
    ),
    items: field([
      link(itemAffilia.sys.id),
      link(itemPpc.sys.id),
      link(itemPingpost.sys.id),
    ]),
  });

  // Why Digital Hub section
  const sectionWhy = await createEntry('section', {
    type: field('features'),
    theme: field('dark'),
    layout: field('split'),
    title: field('Infrastructure Over Intermediation.'),
    subtitle: field('POR QUÉ DIGITAL HUB'),
    body: field(
      rtDoc(
        rtParagraph(
          'Most companies act as intermediaries. We operate as infrastructure. We create acquisition environments where performance compounds over time.'
        ),
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                '"We don\'t place ads. We build the systems that make performance marketing compoundable."',
              marks: [{ type: 'italic' }],
              data: {},
            },
          ],
        }
      )
    ),
    items: field(featureItems.map((item) => link(item.sys.id))),
  });

  // Stats section
  const sectionStats = await createEntry('section', {
    type: field('stats'),
    title: field('By the Numbers'),
    items: field(statItems.map((item) => link(item.sys.id))),
  });

  // ── F. FormField + Form entries ───────────────────────────────────────────

  const formFieldsData = [
    { label: 'Nombre',  name: 'name',    type: 'text',     placeholder: 'Tu nombre completo',          required: true },
    { label: 'Email',   name: 'email',   type: 'email',    placeholder: 'tu@empresa.com',              required: true },
    { label: 'Mensaje', name: 'message', type: 'textarea', placeholder: 'Cuéntanos sobre tu proyecto...', required: true },
  ];

  const formFields = [];
  for (const { label, name, type, placeholder, required } of formFieldsData) {
    const ff = await createEntry('formField', {
      label: field(label),
      name: field(name),
      type: field(type),
      placeholder: field(placeholder),
      required: field(required),
    });
    formFields.push(ff);
  }

  const contactForm = await createEntry('form', {
    type: field('contact'),
    theme: field('dark'),
    title: field('Ready to Plug Into Our Infrastructure?'),
    subtitle: field("Let's build your acquisition ecosystem together."),
    submitLabel: field('Enviar Mensaje'),
    fields: field(formFields.map((ff) => link(ff.sys.id))),
  });

  // ── G. Page entry ─────────────────────────────────────────────────────────

  await createEntry('page', {
    slug: field('home'),
    seoTitle: field('Digital Hub — Revenue Infrastructure for Performance Marketing'),
    seoDescription: field(
      'Multi-model performance infrastructure operating across LATAM and the US. Affiliate networks, Pay Per Call and Real-Time Lead Distribution.'
    ),
    pageElements: field([
      link(sectionHero.sys.id),
      link(sectionAbout.sys.id),
      link(sectionSolutions.sys.id),
      link(sectionWhy.sys.id),
      link(sectionStats.sys.id),
      link(contactForm.sys.id),
    ]),
  });
};
