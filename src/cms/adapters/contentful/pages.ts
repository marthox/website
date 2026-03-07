import type { Entry, EntrySkeletonType, Asset } from 'contentful';
import { fetchEntriesByContentType } from './client';
import type {
    ContentfulPage,
    ContentfulSection,
    ContentfulForm,
    ContentfulItem,
    ContentfulCTA,
    ContentfulFormField,
} from './types';
import type { Page, PageElement, Section, Form, Item, CTA, FormField } from '@/types/page';

type CTAEntry       = Entry<ContentfulCTA,       'WITHOUT_UNRESOLVABLE_LINKS'>;
type FormFieldEntry = Entry<ContentfulFormField,  'WITHOUT_UNRESOLVABLE_LINKS'>;
type FormEntry      = Entry<ContentfulForm,       'WITHOUT_UNRESOLVABLE_LINKS'>;
type ItemEntry      = Entry<ContentfulItem,       'WITHOUT_UNRESOLVABLE_LINKS'>;
type SectionEntry   = Entry<ContentfulSection,    'WITHOUT_UNRESOLVABLE_LINKS'>;

function isEntry<T extends EntrySkeletonType>(
    e: Entry<T, 'WITHOUT_UNRESOLVABLE_LINKS'> | undefined
): e is Entry<T, 'WITHOUT_UNRESOLVABLE_LINKS'> {
    return Boolean(e);
}

function mapCTA(entry: CTAEntry): CTA {
    return {
        label: entry.fields.label,
        href: entry.fields.href,
        variant: entry.fields.variant as CTA['variant'],
        openInNewTab: entry.fields.openInNewTab,
    };
}

function mapFormField(entry: FormFieldEntry): FormField {
    return {
        label: entry.fields.label,
        name: entry.fields.name,
        type: entry.fields.type as FormField['type'],
        placeholder: entry.fields.placeholder,
        required: entry.fields.required,
        options: entry.fields.options,
        helpText: entry.fields.helpText,
    };
}

function mapForm(entry: FormEntry): Form {
    return {
        kind: 'form',
        title: entry.fields.title,
        subtitle: entry.fields.subtitle,
        type: entry.fields.type as Form['type'],
        fields: (entry.fields.fields ?? []).filter(isEntry).map(mapFormField),
        submitLabel: entry.fields.submitLabel,
        successMessage: entry.fields.successMessage,
        theme: entry.fields.theme as Form['theme'],
    };
}

function mapItem(entry: ItemEntry): Item {
    const media = entry.fields.media as Asset<'WITHOUT_UNRESOLVABLE_LINKS'> | undefined;
    return {
        type: entry.fields.type as Item['type'],
        title: entry.fields.title,
        subtitle: entry.fields.subtitle,
        body: entry.fields.body,
        mediaUrl: media?.fields?.file?.url,
        ctas: (entry.fields.ctas ?? []).filter(isEntry).map(mapCTA),
        icon: entry.fields.icon,
        value: entry.fields.value,
    };
}

function mapSection(entry: SectionEntry): Section {
    const media = entry.fields.media as Asset<'WITHOUT_UNRESOLVABLE_LINKS'> | undefined;
    const form  = entry.fields.form as FormEntry | undefined;
    return {
        kind: 'section',
        type: entry.fields.type as Section['type'],
        title: entry.fields.title,
        subtitle: entry.fields.subtitle,
        body: entry.fields.body,
        mediaUrl: media?.fields?.file?.url,
        items: (entry.fields.items ?? []).filter(isEntry).map(mapItem),
        ctas: (entry.fields.ctas ?? []).filter(isEntry).map(mapCTA),
        form: form ? mapForm(form) : undefined,
        layout: entry.fields.layout as Section['layout'],
        theme: entry.fields.theme as Section['theme'],
    };
}

export async function getPages(): Promise<Page[]> {
    const entries = await fetchEntriesByContentType<ContentfulPage>('page', 3);

    return entries.map(entry => {
        const pageElements: PageElement[] = (entry.fields.pageElements ?? [])
            .filter(isEntry)
            .map(element => {
                const contentTypeId = (element as SectionEntry).sys.contentType.sys.id;
                if (contentTypeId === 'section') {
                    return mapSection(element as unknown as SectionEntry);
                }
                return mapForm(element as unknown as FormEntry);
            });

        return {
            slug: entry.fields.slug,
            pageElements,
        };
    });
}
