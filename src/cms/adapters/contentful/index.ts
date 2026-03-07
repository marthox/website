import type { CMSAdapter } from '@/cms/types';
import { getNavElements } from './nav';
import { getPages } from './pages';
import { getFooter } from './footer';

export const ContentfulAdapter: CMSAdapter = {
    getNavigation: getNavElements,
    getPages,
    getFooter,
};
