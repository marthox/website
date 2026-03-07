/**
 * Migration: page content type
 *
 * The top-level page container. A page is identified by its slug and
 * composed of an ordered list of sections and/or forms.
 *
 * Depends on: 20260307-03-form.js, 20260307-05-section.js
 */
module.exports = function (migration) {
  const page = migration
    .createContentType('page')
    .name('Page')
    .description('A page composed of ordered sections and forms.')
    .displayField('slug');

  page
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }]);

  page
    .createField('pageElements')
    .name('Page Elements')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['section', 'form'] }],
    });
};
