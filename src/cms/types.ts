import type { NavBrand, NavElement } from '@/types/nav';
import type { Page } from '@/types/page';

export interface CMSAdapter {
    getNavigation(): Promise<[NavBrand | null, NavElement[]]>;
    getPages(): Promise<Page[]>;
}
