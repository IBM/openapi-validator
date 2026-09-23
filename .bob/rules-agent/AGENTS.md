# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Critical Coding Rules

- Every source file **must** start with the IBM copyright block (`Copyright <year> IBM Corporation. / SPDX-License-Identifier: Apache2.0`)
- Rule implementations (`functions/`) and rule definitions (`rules/`) are separate files — both are required for every rule; adding only one will cause test failures
- Both `functions/index.js` and `rules/index.js` are manual barrel files — new entries must be added to both
- New rules must also be registered in `packages/ruleset/src/ibm-oas.js`
- Rule `given` JSONPath expressions must NOT use implicit `.[]` recursion (e.g., `$.paths.[*]` is invalid; use `$.paths[*]`) — enforced by `test/meta/rule-style.test.js`

## Rule Function Conventions

- The logger must be lazily initialized at first call using `context.rule.name` (the rule ID is not available at module load time):
  ```js
  let ruleId, logger;
  module.exports = function(input, _opts, context) {
    if (!logger) {
      ruleId = context.rule.name;
      logger = LoggerFactory.getInstance().getLogger(ruleId);
    }
  };
  ```
- Rule functions return an array of `{ message, path }` objects (or `[]`), not throw errors
- Import shared utilities from `@ibm-cloud/openapi-ruleset-utilities`, internal utils from `'../utils'`
- Use `validateNestedSchemas()` / `validateComposedSchemas()` / `validateSubschemas()` from utilities to recurse into schemas (don't manually recurse)

## Adding Rules: Required Checklist

1. `src/functions/<name>.js` — implementation
2. `src/rules/<name>.js` — Spectral rule object
3. Export in `src/functions/index.js`
4. Export in `src/rules/index.js`
5. Register (with severity) in `src/ibm-oas.js`
6. Test file at `test/rules/<name>.test.js`
7. Scoring rubric entry in `packages/validator/src/scoring-tool/rubric.js`
8. Documentation entry in `docs/ibm-cloud-rules.md`

Missing any step causes silent omission from the ruleset, test failures, or an unscored rule.

## Test Patterns

- Always start from `makeCopy(rootDocument)` and mutate — never mutate `rootDocument` directly
- Use `testRule(ruleId, rule, document)` for integration-style rule tests (full Spectral pipeline)
- Use `unitTestRule(ruleId, rule, input)` when you need to bypass `given`/`formats` (e.g., testing the function directly with a partial schema)
- Severity codes are numbers: `error=0, warning=1, info=2, hint=3` — assert with `severityCodes.error` not the string `'error'`
- `all-schemas-document.js` provides a document with schemas in every possible location — useful for coverage tests

## Running Tests

```bash
# Single test file from root
npm run jest --workspace packages/ruleset -- --testPathPattern="string-attributes"

# All tests in a workspace
npm run test-ruleset

# With verbose output
cd packages/ruleset && npx jest --verbose test/rules/string-attributes.test.js
```
