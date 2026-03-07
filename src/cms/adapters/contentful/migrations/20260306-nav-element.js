/**
 * Migration: navElement content type
 *
 * Represents a single navigation item. Can be a plain link or a menu
 * with nested navElement entries (submenu).
 */
module.exports = function (migration) {
  const navElement = migration
    .createContentType('navElement')
    .name('Nav Element')
    .description('A navigation item — either a link or a dropdown menu.')
    .displayField('label');

  navElement
    .createField('label')
    .name('Label')
    .type('Symbol')
    .required(true)
    .localized(true);

  navElement
    .createField('href')
    .name('Href')
    .type('Symbol')
    .required(false)
    .localized(true);

  navElement
    .createField('submenu')
    .name('Submenu')
    .type('Array')
    .required(false)
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['navElement'] }],
    });
};
