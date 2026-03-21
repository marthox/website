// scripts/contentful-reset.mjs
// Deletes all entries in the Contentful space.
// Run: node scripts/contentful-reset.mjs

import pkg from 'contentful-management';
const { createClient } = pkg;
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// .env lives at the main repo root, not inside the worktree directory
const __dirname = dirname(fileURLToPath(import.meta.url));
const env = dotenv.parse(readFileSync(resolve(__dirname, '../../../../.env')));
const SPACE_ID = env.CONTENTFUL_SPACE_ID;
const TOKEN    = env.CONTENTFUL_MANAGEMENT_TOKEN;

const client = createClient({ accessToken: TOKEN });

async function main() {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');

    let skip = 0;
    const all = [];
    while (true) {
        const batch = await environment.getEntries({ limit: 200, skip });
        all.push(...batch.items);
        if (batch.items.length < 200) break;
        skip += 200;
    }
    console.log(`Found ${all.length} entries. Unpublishing…`);

    for (const entry of all) {
        try {
            if (entry.isPublished()) await entry.unpublish();
        } catch { /* already unpublished */ }
    }

    console.log('Deleting…');
    for (const entry of all) {
        try {
            await entry.delete();
            console.log(`  deleted ${entry.sys.id}`);
        } catch (e) {
            console.warn(`  FAILED ${entry.sys.id}: ${e.message}`);
        }
    }
    console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
