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

export type ContentfulCTA = EntrySkeletonType<
    {
        label: EntryFieldTypes.Text;
        href: EntryFieldTypes.Text;
        variant?: EntryFieldTypes.Text;
        openInNewTab?: EntryFieldTypes.Boolean;
        icon?: EntryFieldTypes.Text;
    },
    'cta'
>;

export type ContentfulFormField = EntrySkeletonType<
    {
        label: EntryFieldTypes.Text;
        name: EntryFieldTypes.Text;
        type: EntryFieldTypes.Text;
        placeholder?: EntryFieldTypes.Text;
        required?: EntryFieldTypes.Boolean;
        options?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        helpText?: EntryFieldTypes.Text;
    },
    'formField'
>;

export type ContentfulForm = EntrySkeletonType<
    {
        title?: EntryFieldTypes.Text;
        subtitle?: EntryFieldTypes.Text;
        type?: EntryFieldTypes.Text;
        fields?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulFormField>>;
        submitLabel?: EntryFieldTypes.Text;
        successMessage?: EntryFieldTypes.Text;
        theme?: EntryFieldTypes.Text;
    },
    'form'
>;

export type ContentfulItem = EntrySkeletonType<
    {
        type?: EntryFieldTypes.Text;
        title?: EntryFieldTypes.Text;
        subtitle?: EntryFieldTypes.Text;
        body?: EntryFieldTypes.RichText;
        media?: EntryFieldTypes.AssetLink;
        ctas?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulCTA>>;
        icon?: EntryFieldTypes.Text;
        value?: EntryFieldTypes.Text;
    },
    'item'
>;

export type ContentfulSection = EntrySkeletonType<
    {
        type: EntryFieldTypes.Text;
        title?: EntryFieldTypes.Text;
        subtitle?: EntryFieldTypes.Text;
        body?: EntryFieldTypes.RichText;
        media?: EntryFieldTypes.AssetLink;
        items?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulItem>>;
        ctas?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulCTA>>;
        form?: EntryFieldTypes.EntryLink<ContentfulForm>;
        layout?: EntryFieldTypes.Text;
        theme?: EntryFieldTypes.Text;
    },
    'section'
>;

export type ContentfulPage = EntrySkeletonType<
    {
        slug: EntryFieldTypes.Text;
        pageElements?: EntryFieldTypes.Array<
            EntryFieldTypes.EntryLink<ContentfulSection | ContentfulForm>
        >;
    },
    'page'
>;

export type ContentfulFooter = EntrySkeletonType<
    {
        brand?: EntryFieldTypes.AssetLink;
        tagline?: EntryFieldTypes.Text;
        columns?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulItem>>;
        socialLinks?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulCTA>>;
        legalLinks?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ContentfulCTA>>;
        copyright?: EntryFieldTypes.Text;
    },
    'footer'
>;
