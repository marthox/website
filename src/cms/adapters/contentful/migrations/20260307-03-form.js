/**
 * Migration: form content type
 *
 * A form that can be placed as a standalone page element or embedded
 * inside a section. Holds an ordered list of formField entries.
 *
 * Depends on: 20260307-02-form-field.js
 */
module.exports = function (migration) {
  const form = migration
    .createContentType('form')
    .name('Form')
    .description('A form element — standalone on a page or embedded inside a section.')
    .displayField('title');

  form
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(false)
    .localized(true);

  form
    .createField('subtitle')
    .name('Subtitle')
    .type('Symbol')
    .required(false)
    .localized(true);

  form
    .createField('type')
    .name('Type')
    .type('Symbol')
    .required(false)
    .validations([{ in: ['contact', 'newsletter', 'booking'] }]);

  form
    .createField('fields')
    .name('Fields')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['formField'] }],
    });

  form
    .createField('submitLabel')
    .name('Submit Label')
    .type('Symbol')
    .required(false)
    .localized(true);

  form
    .createField('successMessage')
    .name('Success Message')
    .type('Symbol')
    .required(false)
    .localized(true);

  form
    .createField('theme')
    .name('Theme')
    .type('Symbol')
    .required(false)
    .validations([{ in: ['light', 'dark', 'accent'] }]);
};
