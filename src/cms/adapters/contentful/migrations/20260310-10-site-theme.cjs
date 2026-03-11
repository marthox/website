/**
 * Migration: siteTheme content type
 *
 * Single-entry content type that drives all CSS custom properties at runtime.
 * Fields map 1-to-1 to design tokens defined in src/styles/tokens.scss.
 * Only one entry should exist per environment.
 */
module.exports = function (migration) {
  const siteTheme = migration
    .createContentType('siteTheme')
    .name('Site Theme')
    .description('Design tokens for the site. One entry configures the full visual style.')
    .displayField('name');

  siteTheme
    .createField('name')
    .name('Name')
    .type('Symbol')
    .required(true);

  // --- Base palette ---

  siteTheme
    .createField('colorBg')
    .name('Background Color')
    .type('Symbol')
    .required(false);

  siteTheme
    .createField('colorSurface')
    .name('Surface Color')
    .type('Symbol')
    .required(false);

  siteTheme
    .createField('colorBorder')
    .name('Border Color')
    .type('Symbol')
    .required(false);

  siteTheme
    .createField('colorText')
    .name('Text Color')
    .type('Symbol')
    .required(false);

  siteTheme
    .createField('colorTextMuted')
    .name('Muted Text Color')
    .type('Symbol')
    .required(false);

  siteTheme
    .createField('colorAccent')
    .name('Accent Color')
    .type('Symbol')
    .required(false);

  // --- Dark section variant ---

  siteTheme
    .createField('colorDarkBg')
    .name('Dark Section Background')
    .type('Symbol')
    .required(false);

  siteTheme
    .createField('colorDarkText')
    .name('Dark Section Text')
    .type('Symbol')
    .required(false);

  // --- Accent section variant ---

  siteTheme
    .createField('colorAccentBg')
    .name('Accent Section Background')
    .type('Symbol')
    .required(false);

  siteTheme
    .createField('colorAccentText')
    .name('Accent Section Text')
    .type('Symbol')
    .required(false);

  // --- Typography ---

  siteTheme
    .createField('fontHeading')
    .name('Heading Font')
    .type('Symbol')
    .required(false);

  siteTheme
    .createField('fontBody')
    .name('Body Font')
    .type('Symbol')
    .required(false);
};
