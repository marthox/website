import { fetchEntriesByContentType } from './client';
import type { ContentfulSiteTheme } from './types';
import type { SiteTheme } from '@/types/theme';

export async function getSiteTheme(): Promise<SiteTheme | null> {
    const entries = await fetchEntriesByContentType<ContentfulSiteTheme>('siteTheme', 0);
    const entry = entries[0];
    if (!entry) return null;

    const f = entry.fields;
    return {
        colorBg:         f.colorBg,
        colorSurface:    f.colorSurface,
        colorBorder:     f.colorBorder,
        colorText:       f.colorText,
        colorTextMuted:  f.colorTextMuted,
        colorAccent:     f.colorAccent,
        colorDarkBg:     f.colorDarkBg,
        colorDarkText:   f.colorDarkText,
        colorAccentBg:   f.colorAccentBg,
        colorAccentText: f.colorAccentText,
        fontHeading:     f.fontHeading,
        fontBody:        f.fontBody,
    };
}
