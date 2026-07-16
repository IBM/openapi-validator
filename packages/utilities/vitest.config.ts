import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            enabled: true,
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage/',
        },
    },
    resolve: {
        alias: {
            'nimma/legacy': '../../node_modules/@stoplight/spectral-core/node_modules/nimma/dist/legacy/cjs',
            'nimma/fallbacks': '../../node_modules/@stoplight/spectral-core/node_modules/nimma/dist/legacy/cjs/fallbacks/',
        },
    },
});