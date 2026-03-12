import type { CMSAdapter } from './types';
import { ContentfulAdapter } from './adapters/contentful';
import { MockAdapter } from './adapters/mock';

export const cms: CMSAdapter =
    import.meta.env.CMS_ADAPTER === 'mock' ? MockAdapter : ContentfulAdapter;
