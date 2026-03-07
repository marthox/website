import type { CMSAdapter } from './types';
import { ContentfulAdapter } from './adapters/contentful';

export const cms: CMSAdapter = ContentfulAdapter;
