/**
 * Migration: item content type
 *
 * A generic building block used inside sections. The type field
 * determines how the frontend renders it (card, slide, stat, etc.).
 *
 * Depends on: 20260307-01-cta.js
 */
module.exports = function (migration) {
  const item = migration
    .createContentType('item')
    .name('Item')
    .description('A generic item used inside sections — card, slide, stat, feature, testimonial, etc.')
    .displayField('title');

  item
    .createField('type')
    .name('Type')
    .type('Symbol')
    .required(false)
    .validations([{ in: ['card', 'slide', 'product', 'testimonial', 'stat', 'feature'] }]);

  item
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(false)
    .localized(true);

  item
    .createField('subtitle')
    .name('Subtitle')
    .type('Symbol')
    .required(false)
    .localized(true);

  item
    .createField('body')
    .name('Body')
    .type('RichText')
    .required(false)
    .localized(true);

  item
    .createField('media')
    .name('Media')
    .type('Link')
    .linkType('Asset')
    .required(false);

  item
    .createField('ctas')
    .name('CTAs')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['cta'] }],
    });

  item
    .createField('icon')
    .name('Icon')
    .type('Symbol')
    .required(false);

  item
    .createField('value')
    .name('Value')
    .type('Symbol')
    .required(false);
};
