module.exports = function (migration) {
  const siteTheme = migration.editContentType('siteTheme');

  siteTheme.createField('colorDarkSurface')
    .name('Dark Surface Color')
    .type('Symbol')
    .required(false);

  siteTheme.createField('colorDarkBorder')
    .name('Dark Border Color')
    .type('Symbol')
    .required(false);

  siteTheme.createField('colorDarkTextMuted')
    .name('Dark Muted Text Color')
    .type('Symbol')
    .required(false);

  siteTheme.createField('colorDarkAccent')
    .name('Dark Accent Color')
    .type('Symbol')
    .required(false);
};
