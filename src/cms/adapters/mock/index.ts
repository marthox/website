import type { CMSAdapter } from '@/cms/types';
import { navFixture } from './fixtures/nav';
import { pagesFixture } from './fixtures/pages';
import { footerFixture } from './fixtures/footer';
import { themeFixture } from './fixtures/theme';

export const MockAdapter: CMSAdapter = {
    getNavigation: async () => navFixture,
    getPages:      async () => pagesFixture,
    getFooter:     async () => footerFixture,
    getSiteTheme:  async () => themeFixture,
};
