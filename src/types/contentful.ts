import type { EntryFieldTypes, EntrySkeletonType, Asset } from 'contentful';

export type include_depth = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ContentfulNavElement = EntrySkeletonType<
    {
        label: EntryFieldTypes.Text;
        href?: EntryFieldTypes.Text;
        submenu?: EntryFieldTypes.Array<
            EntryFieldTypes.EntryLink<ContentfulNavElement>
        >;
    },
    'navElement'
>;

export type ContentfulNavBrand = Asset<'WITHOUT_UNRESOLVABLE_LINKS', string>;

export type ContentfulNav = EntrySkeletonType<
    {
        name: EntryFieldTypes.Text;
        navBrand?: EntryFieldTypes.AssetLink;
        navElements: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulNavElement>>;
    },
    'nav'
>;
