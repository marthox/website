/**
 * Migration: Digital Hub siteTheme + nav entries
 *
 * Creates:
 *  - 1 siteTheme entry (Digital Hub palette, Inter fonts)
 *  - 4 navElement entries
 *  - 1 nav entry linking the 4 navElements
 *
 * All entries are published at the end.
 */
module.exports = async function (migration, { makeRequest }) {
  // ── siteTheme entry ────────────────────────────────────────────────────────

  const theme = await makeRequest({
    method: 'POST',
    url: '/entries',
    headers: { 'X-Contentful-Content-Type': 'siteTheme' },
    data: {
      fields: {
        name:               { 'en-US': 'Digital Hub Theme' },
        colorBg:            { 'en-US': '#FFFFFF' },
        colorSurface:       { 'en-US': '#F8F9FF' },
        colorBorder:        { 'en-US': '#E2E6F0' },
        colorText:          { 'en-US': '#0A0A1A' },
        colorTextMuted:     { 'en-US': '#5A6080' },
        colorAccent:        { 'en-US': '#00B4FF' },
        colorDarkBg:        { 'en-US': '#080C14' },
        colorDarkText:      { 'en-US': '#F0F4FF' },
        colorDarkSurface:   { 'en-US': '#0D1525' },
        colorDarkBorder:    { 'en-US': '#1E2D45' },
        colorDarkTextMuted: { 'en-US': '#8892B0' },
        colorDarkAccent:    { 'en-US': '#00CFFF' },
        fontHeading:        { 'en-US': 'Inter' },
        fontBody:           { 'en-US': 'Inter' },
      },
    },
  });

  await makeRequest({
    method: 'PUT',
    url: `/entries/${theme.sys.id}/published`,
    headers: { 'X-Contentful-Version': String(theme.sys.version) },
  });

  // ── navElement entries ─────────────────────────────────────────────────────

  const navElementsData = [
    { label: 'Infraestructura', href: '#about' },
    { label: 'Soluciones',      href: '#solutions' },
    { label: 'Tecnología',      href: '#why' },
    { label: 'Nosotros',        href: '#about' },
  ];

  const navElements = [];

  for (const { label, href } of navElementsData) {
    const el = await makeRequest({
      method: 'POST',
      url: '/entries',
      headers: { 'X-Contentful-Content-Type': 'navElement' },
      data: {
        fields: {
          label: { 'en-US': label },
          href:  { 'en-US': href },
        },
      },
    });

    await makeRequest({
      method: 'PUT',
      url: `/entries/${el.sys.id}/published`,
      headers: { 'X-Contentful-Version': String(el.sys.version) },
    });

    navElements.push(el);
  }

  // ── nav entry ──────────────────────────────────────────────────────────────

  const nav = await makeRequest({
    method: 'POST',
    url: '/entries',
    headers: { 'X-Contentful-Content-Type': 'nav' },
    data: {
      fields: {
        name:              { 'en-US': 'Digital Hub Nav' },
        distribution:      { 'en-US': 'end' },
        hamburgerPosition: { 'en-US': 'right' },
        navElements: {
          'en-US': navElements.map((el) => ({
            sys: { type: 'Link', linkType: 'Entry', id: el.sys.id },
          })),
        },
      },
    },
  });

  await makeRequest({
    method: 'PUT',
    url: `/entries/${nav.sys.id}/published`,
    headers: { 'X-Contentful-Version': String(nav.sys.version) },
  });
};
