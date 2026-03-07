import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        environment: 'node',
        env: {
            CONTENTFUL_SPACE_ID: 'test-space',
            CONTENTFUL_ACCESS_TOKEN: 'test-token',
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
});
