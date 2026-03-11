import type { CMSAdapter } from '@/cms/types';
import { getNavElements } from './nav';
import { getPages } from './pages';
import { getFooter } from './footer';
import { getSiteTheme } from './theme';

export const ContentfulAdapter: CMSAdapter = {
    getNavigation: getNavElements,
    getPages,
    getFooter,
    getSiteTheme,
};
