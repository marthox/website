import type { CMSAdapter } from '@/cms/types';
import { getNavElements } from './nav';
import { getPages } from './pages';

export const ContentfulAdapter: CMSAdapter = {
    getNavigation: getNavElements,
    getPages,
};
