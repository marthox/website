/**
 * Migration: footer content type
 *
 * Site-wide footer. Columns reuse the item content type (title + ctas),
 * and social/legal links reuse the cta content type (with icon support).
 *
 * Depends on: 20260307-03-cta.js, 20260307-06-item.js
 */
module.exports = function (migration) {
  const footer = migration
    .createContentType('footer')
    .name('Footer')
    .description('Site-wide footer with brand, link columns, social links, and legal info.')
    .displayField('copyright');

  footer
    .createField('brand')
    .name('Brand')
    .type('Link')
    .linkType('Asset')
    .required(false);

  footer
    .createField('tagline')
    .name('Tagline')
    .type('Symbol')
    .required(false)
    .localized(true);

  footer
    .createField('columns')
    .name('Columns')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['item'] }],
    });

  footer
    .createField('socialLinks')
    .name('Social Links')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['cta'] }],
    });

  footer
    .createField('legalLinks')
    .name('Legal Links')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['cta'] }],
    });

  footer
    .createField('copyright')
    .name('Copyright')
    .type('Symbol')
    .required(false)
    .localized(true);
};
