# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Codebase Navigation

- `packages/ruleset/src/functions/` — rule *implementations* (the JS functions Spectral calls)
- `packages/ruleset/src/rules/` — rule *definitions* (Spectral rule objects with `given`, `severity`, etc.)
- These are intentionally separate: a function can be reused across multiple rules
- `packages/utilities/src/collections/index.js` — canonical JSONPath location collections reused by many rules (e.g., `requestBodySchemas`, `responseSchemas`, `schemas`)
- `packages/ruleset/src/utils/` — ruleset-private utilities (not exported publicly)
- `packages/utilities/src/utils/` — public utilities exported as `@ibm-cloud/openapi-ruleset-utilities`

## Documentation Locations

- Rule docs: `docs/ibm-cloud-rules.md` (main reference for all IBM Cloud rules)
- Migration guide: `Migration-Guide.md`
- Utilities API: auto-generated from JSDoc via `npm run generate-utilities-docs`
- Types for utilities: auto-generated via `npm run generate-utilities-types` (outputs to `packages/utilities/types/`)

## Counterintuitive Structure

- The root `package.json` version (`0.0.0`) is a placeholder — actual package versions are in each workspace's `package.json`
- `packages/ruleset/src/ibm-oas.js` is the entry point for the ruleset (`main` field), not `src/index.js`
- The `app/` directory at the root is unrelated to the npm packages — it contains separate application code
- Test utilities at `packages/ruleset/test/test-utils/` are not published; `root-document.js` is the shared baseline API for all rule tests
