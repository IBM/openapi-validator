# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Architectural Constraints

- **Rules are stateless** — Spectral re-runs rule functions per document node; no state should be stored outside the lazy logger/ruleId initialization pattern
- **Functions vs Rules separation is intentional** — a single function (e.g., `enumCasingConvention`) can back multiple rule definitions; don't merge them
- **`resolved: true` vs `resolved: false`** in rule definitions changes whether `$ref`s are dereferenced before the function runs — rules using `validateNestedSchemas()` require `resolved: true` (it cannot traverse `$ref`s)
- **`formats: [oas3]`** on a rule means it only runs for OpenAPI 3.x; omitting `formats` runs it on all versions — most IBM rules should specify `oas3`
- The ruleset extends Spectral's built-in `oas` ruleset with overrides; some Spectral rules are deliberately turned off in `ibm-oas.js`

## Dependency Architecture

```
packages/validator
  └── @ibm-cloud/openapi-ruleset (packages/ruleset)
       └── @ibm-cloud/openapi-ruleset-utilities (packages/utilities)
```

Circular dependencies would break workspace linking — utilities must have no dependency on ruleset or validator.

## Adding Rules: Required Checklist

1. `src/functions/<name>.js` — implementation
2. `src/rules/<name>.js` — Spectral rule object
3. Export in `src/functions/index.js`
4. Export in `src/rules/index.js`
5. Register (with severity) in `src/ibm-oas.js`
6. Test file at `test/rules/<name>.test.js`
7. Documentation entry in `docs/ibm-cloud-rules.md`

Missing any step causes silent omission from the ruleset or test failures.

## Commit & Release

- Commits must follow Angular commit message format (`feat:`, `fix:`, `docs:`, etc.)
- `semantic-release` auto-generates CHANGELOG and publishes to npm based on commit messages
- Breaking changes require `BREAKING CHANGE:` footer in commit body to trigger major version bump
