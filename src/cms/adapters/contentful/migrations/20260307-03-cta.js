/**
 * Migration: cta content type
 *
 * A reusable call-to-action button or link. Referenced by sections
 * and items anywhere on a page.
 */
module.exports = function (migration) {
  const cta = migration
    .createContentType('cta')
    .name('CTA')
    .description('A reusable call-to-action button or link.')
    .displayField('label');

  cta
    .createField('label')
    .name('Label')
    .type('Symbol')
    .required(true)
    .localized(true);

  cta
    .createField('href')
    .name('Href')
    .type('Symbol')
    .required(true);

  cta
    .createField('variant')
    .name('Variant')
    .type('Symbol')
    .required(false)
    .validations([{ in: ['primary', 'secondary', 'ghost'] }]);

  cta
    .createField('openInNewTab')
    .name('Open in New Tab')
    .type('Boolean')
    .required(false);

  cta
    .createField('icon')
    .name('Icon')
    .type('Symbol')
    .required(false);
};
