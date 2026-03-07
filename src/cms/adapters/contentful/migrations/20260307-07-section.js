/**
 * Migration: section content type
 *
 * The primary page building block. The type field determines which
 * frontend component renders it. Can contain items, CTAs, and/or
 * an embedded form.
 *
 * Depends on: 20260307-01-cta.js, 20260307-03-form.js, 20260307-04-item.js
 */
module.exports = function (migration) {
  const section = migration
    .createContentType('section')
    .name('Section')
    .description('A generic page building block. The type field determines how it is rendered.')
    .displayField('title');

  section
    .createField('type')
    .name('Type')
    .type('Symbol')
    .required(true)
    .validations([{ in: ['hero', 'banner', 'carousel', 'cards', 'features', 'testimonials', 'stats', 'text', 'gallery'] }]);

  section
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(false)
    .localized(true);

  section
    .createField('subtitle')
    .name('Subtitle')
    .type('Symbol')
    .required(false)
    .localized(true);

  section
    .createField('body')
    .name('Body')
    .type('RichText')
    .required(false)
    .localized(true);

  section
    .createField('media')
    .name('Media')
    .type('Link')
    .linkType('Asset')
    .required(false);

  section
    .createField('items')
    .name('Items')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['item'] }],
    });

  section
    .createField('ctas')
    .name('CTAs')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['cta'] }],
    });

  section
    .createField('form')
    .name('Form')
    .type('Link')
    .linkType('Entry')
    .required(false)
    .validations([{ linkContentType: ['form'] }]);

  section
    .createField('layout')
    .name('Layout')
    .type('Symbol')
    .required(false)
    .validations([{ in: ['left', 'right', 'center', 'split'] }]);

  section
    .createField('theme')
    .name('Theme')
    .type('Symbol')
    .required(false)
    .validations([{ in: ['light', 'dark', 'accent'] }]);
};
