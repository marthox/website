import type { Document } from '@contentful/rich-text-types';

export interface CTA {
    label: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    openInNewTab?: boolean;
    icon?: string;
}

export interface FormField {
    label: string;
    name: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'date';
    placeholder?: string;
    required?: boolean;
    options?: string[];
    helpText?: string;
}

export interface Form {
    kind: 'form';
    title?: string;
    subtitle?: string;
    type?: 'contact' | 'newsletter' | 'booking';
    fields?: FormField[];
    submitLabel?: string;
    successMessage?: string;
    theme?: 'light' | 'dark' | 'accent';
}

export interface Item {
    type?: 'card' | 'slide' | 'product' | 'testimonial' | 'stat' | 'feature' | 'tab';
    title?: string;
    subtitle?: string;
    body?: Document;
    mediaUrl?: string;
    ctas?: CTA[];
    icon?: string;
    value?: string;
}

export interface Section {
    kind: 'section';
    type: 'hero' | 'banner' | 'carousel' | 'cards' | 'features' | 'testimonials' | 'stats' | 'text' | 'gallery' | 'tabs';
    title?: string;
    subtitle?: string;
    body?: Document;
    mediaUrl?: string;
    items?: Item[];
    ctas?: CTA[];
    form?: Form;
    layout?: 'left' | 'right' | 'center' | 'split' | 'roles' | 'comparison';
    theme?: 'light' | 'dark' | 'accent';
}

export type PageElement = Section | Form;

export interface Page {
    slug: string;
    pageElements: PageElement[];
    seoTitle?: string;
    seoDescription?: string;
    ogImageUrl?: string;
}

export interface FooterColumn {
    title?: string;
    links?: CTA[];
}

export interface Footer {
    brand?: { src: string; alt: string; href: string };
    tagline?: string;
    columns?: FooterColumn[];
    socialLinks?: CTA[];
    legalLinks?: CTA[];
    copyright?: string;
}
