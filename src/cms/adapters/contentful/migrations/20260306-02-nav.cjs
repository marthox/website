/**
 * Migration: nav content type
 *
 * Represents the top-level navigation bar. Holds a brand asset,
 * layout options, and an ordered list of navElement entries.
 *
 * Depends on: 20260306-nav-element.js
 */
module.exports = function (migration) {
  const nav = migration
    .createContentType('nav')
    .name('Nav')
    .description('Top-level navigation bar configuration.')
    .displayField('name');

  nav
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(false);

  nav
    .createField('distribution')
    .name('Distribution')
    .type('Symbol')
    .required(true)
    .validations([{ in: ['start', 'center', 'end'] }]);

  nav
    .createField('hamburgerPosition')
    .name('Hamburger Position')
    .type('Symbol')
    .required(true)
    .validations([{ in: ['left', 'right'] }]);

  nav
    .createField('navBrand')
    .name('Nav Brand')
    .type('Link')
    .linkType('Asset')
    .required(false);

  nav
    .createField('navElements')
    .name('Nav Elements')
    .type('Array')
    .required(true)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['navElement'] }],
    });
};
