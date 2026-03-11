import type { NavBrand, NavElement } from '@/types/nav';
import type { Page, Footer } from '@/types/page';
import type { SiteTheme } from '@/types/theme';

export interface CMSAdapter {
    getNavigation(): Promise<[NavBrand | null, NavElement[]]>;
    getPages(): Promise<Page[]>;
    getFooter(): Promise<Footer | null>;
    getSiteTheme(): Promise<SiteTheme | null>;
}
