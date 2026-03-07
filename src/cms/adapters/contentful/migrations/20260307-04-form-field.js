/**
 * Migration: formField content type
 *
 * A single input field within a form. Supports all common HTML
 * input types plus textarea and select.
 */
module.exports = function (migration) {
  const formField = migration
    .createContentType('formField')
    .name('Form Field')
    .description('A single input field within a form.')
    .displayField('label');

  formField
    .createField('label')
    .name('Label')
    .type('Symbol')
    .required(true)
    .localized(true);

  formField
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true);

  formField
    .createField('type')
    .name('Type')
    .type('Symbol')
    .required(true)
    .validations([{ in: ['text', 'email', 'tel', 'textarea', 'select', 'checkbox', 'radio', 'number', 'date'] }]);

  formField
    .createField('placeholder')
    .name('Placeholder')
    .type('Symbol')
    .required(false)
    .localized(true);

  formField
    .createField('required')
    .name('Required')
    .type('Boolean')
    .required(false);

  formField
    .createField('options')
    .name('Options')
    .type('Array')
    .required(false)
    .items({ type: 'Symbol' });

  formField
    .createField('helpText')
    .name('Help Text')
    .type('Symbol')
    .required(false)
    .localized(true);
};
