'use strict';

module.exports = function (migration) {
    const page = migration.editContentType('page');

    page.createField('seoTitle')
        .name('SEO Title')
        .type('Symbol')
        .required(false);

    page.createField('seoDescription')
        .name('SEO Description')
        .type('Text')
        .required(false);

    page.createField('ogImage')
        .name('OG Image')
        .type('Link')
        .linkType('Asset')
        .required(false);
};
