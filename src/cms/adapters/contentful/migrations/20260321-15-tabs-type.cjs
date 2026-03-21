/**
 * Migration 15: add 'tabs' to section.type validation,
 * 'roles' to section.layout validation,
 * and 'tab' to item.type validation.
 */
module.exports = function (migration) {
    const section = migration.editContentType('section');
    section.editField('type').validations([
        {
            in: [
                'hero', 'banner', 'carousel', 'cards', 'features',
                'testimonials', 'stats', 'text', 'gallery', 'tabs',
            ],
        },
    ]);
    // Add 'roles' to layout validation so Migration 16's Segmented CTA entry is accepted
    section.editField('layout').validations([
        { in: ['left', 'right', 'center', 'split', 'roles'] },
    ]);

    const item = migration.editContentType('item');
    item.editField('type').validations([
        {
            in: [
                'card', 'slide', 'product', 'testimonial',
                'stat', 'feature', 'tab',
            ],
        },
    ]);
};
