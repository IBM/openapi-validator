---
name: add-openapi-rule
description: >
  Use when the user wants to add a new lint rule to the IBM OpenAPI Validator project
  (openapi-validator / ibm-cloud/openapi-ruleset). Walks through creating the function file,
  rule definition file, barrel exports, ibm-oas registration, test file, scoring rubric entry,
  and documentation — in the correct order with all required conventions applied.
---

# Add a New Rule to the IBM OpenAPI Validator

Follow these steps in order. Do not skip any step; missing any one of them will cause test failures
or leave the rule undocumented / unscored.

---

## Step 0 — Gather Inputs Interactively

**Before doing anything else**, send the user a single message that:
1. Asks for the rule description (if not already given).
2. Based on the description — whether supplied by the user or inferred from their request —
   proposes concrete values for every field below and asks the user to confirm or adjust.

Do NOT proceed to Step 1 until the user has confirmed all four items.

### Fields to confirm

1. **Description** — plain English, one sentence. What is the violation?
   - If the user already described the rule, restate it as a clean one-sentence description and
     ask them to confirm.

2. **Rule name** — kebab-case, no `ibm-` prefix (that is added automatically).
   - Derive a short, specific name from the description (e.g. `no-nullable-properties`,
     `operation-summary-exists`, `schema-description-exists`).
   - The full rule ID will be `ibm-<rule-name>`.

3. **Severity** — propose the most appropriate one based on the description:
   - `error` — structural mistake that will break SDKs or clients
   - `warn` *(most common)* — convention or style violation
   - `info` — informational; no immediate impact
   - `hint` — rarely used

4. **Scoring rubric** — propose values based on the description:
   - `coefficient` — `1` for typical rules; `2`–`3` for high-impact structural rules
   - `denominator` — what the score is measured against:
     - `schemas` if the rule targets schema definitions
     - `operations` if the rule targets operations or request/response behaviour
     - `paths` if the rule targets path-level structure
   - `categories` — one or more of `usability`, `security`, `robustness`, `evolution`; suggest
     the best fit(s) based on the rule's purpose:
     - `usability` — readability, discoverability, developer experience
     - `security` — auth, credentials, sensitive data
     - `robustness` — correctness, completeness, error handling
     - `evolution` — versioning, backward compatibility
   - If the rule has no meaningful impact on API quality scoring, propose a comment-only entry.

---

## Step 1 — Check for Existing Coverage

**Before writing any code**, check the existing ruleset for potential overlap.

### 1a — Read the live rule list

Run this command to get the current rule IDs and descriptions directly from source:

```bash
grep -rh "description:" packages/ruleset/src/rules/*.js | grep -v "^description:$" | sort -u
```

Also list the rule filenames to get their IDs:

```bash
ls packages/ruleset/src/rules/*.js | grep -v index.js | sed 's|.*/||; s|\.js$||' | sort
```

Use the output — not any cached list — to check for overlap with the user's described violation.

### 1b — Decide: new rule or extend existing?

After reviewing the list, present one of these outcomes to the user:

**If the description overlaps significantly with an existing rule**, say so:
> "This sounds similar to `ibm-<existing-rule>` which already checks `<existing description>`.
> Would you like to:
> (a) extend that rule's function to cover your case too, or
> (b) create a separate rule anyway (e.g. different severity or `given` scope)?"
>
> If the user chooses (a), read `packages/ruleset/src/functions/<existing-rule>.js` and
> `packages/ruleset/test/rules/<existing-rule>.test.js` before proceeding — the extension goes
> into those files instead of creating new ones. Skip Steps 2, 3, 4, 5 (new files only) and adapt
> accordingly.

**If there is no meaningful overlap**, confirm:
> "No existing rule covers this. Proceeding with a new rule `ibm-<rule-name>`."

---

## Step 2 — Create the Function File

Path: `packages/ruleset/src/functions/<rule-name>.js`

Rules:
- Start with the IBM copyright block (use the current year).
- Lazy-initialize `ruleId` and `logger` at first call via `context.rule.name`.
- Return an array of `{ message, path }` objects, or `[]`.
- Import shared schema traversal helpers from `@ibm-cloud/openapi-ruleset-utilities`
  (e.g. `validateNestedSchemas`, `isStringSchema`).
- Import internal utilities via `require('../utils')` (e.g. `LoggerFactory`).
- Use `validateNestedSchemas()` / `validateComposedSchemas()` / `validateSubschemas()` to recurse —
  never manually recurse into schemas.
- JSDoc `@param` and `@returns` on every exported function.

Template:

```js
/**
 * Copyright <YEAR> IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

/**
 * <Describe what this rule checks>
 * @param {object} input - the resolved schema/path/operation node
 * @param {object} _opts - rule options (unused unless the rule has options)
 * @param {object} context - Spectral context (path, rule)
 * @returns {Array} array of { message, path } violation objects, or []
 */
module.exports = function <camelCaseRuleName>(input, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  const errors = [];

  // TODO: implement check logic here

  return errors;
};
```

---

## Step 3 — Create the Rule Definition File

Path: `packages/ruleset/src/rules/<rule-name>.js`

Rules:
- Import the collection or JSONPath for `given` from
  `@ibm-cloud/openapi-ruleset-utilities/src/collections` where possible.
- The `given` JSONPath must NOT use implicit `.[]` recursion
  (e.g. `$.paths.[*]` is invalid; use `$.paths[*]`).
- Import the function by its camelCase export name from `'../functions'`.
- `message` should be `'{{error}}'` (delegates to the function's returned message string).

Template:

```js
/**
 * Copyright <YEAR> IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { <collection> } = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');
const { oas3 } = require('@stoplight/spectral-formats');
const { <camelCaseRuleName> } = require('../functions');

module.exports = {
  description: '<Short description of what the rule enforces>',
  message: '{{error}}',
  severity: '<warn|error|info|hint>',
  formats: [oas3],
  resolved: true,
  given: <collection>,
  then: {
    function: <camelCaseRuleName>,
  },
};
```

---

## Step 4 — Register in Barrel Files

Both barrel files are **manually maintained** — new entries must be added in alphabetical order.

### `packages/ruleset/src/functions/index.js`

Add one line in alphabetical order:
```js
<camelCaseRuleName>: require('./<rule-name>'),
```

### `packages/ruleset/src/rules/index.js`

Add one line in alphabetical order:
```js
<camelCaseRuleName>: require('./<rule-name>'),
```

Read the current contents of both files first with `read_file` to find the correct insertion point.

---

## Step 5 — Register in `ibm-oas.js`

Path: `packages/ruleset/src/ibm-oas.js`

Add one line under the `// IBM Custom Rules` section, in alphabetical order by rule ID:
```js
'ibm-<rule-name>': ibmRules.<camelCaseRuleName>,
```

Read the current file first to find the correct insertion point.

---

## Step 6 — Create the Test File

Path: `packages/ruleset/test/rules/<rule-name>.test.js`

Rules:
- Start with the IBM copyright block.
- Import from `'../../src/rules'` (not from the package).
- Import test utilities from `'../test-utils'`: `{ makeCopy, rootDocument, testRule, unitTestRule, severityCodes }`.
- Always start with `makeCopy(rootDocument)` and mutate — never mutate `rootDocument` directly.
- Use `testRule(ruleId, rule, document)` for integration-style tests.
- Use `unitTestRule(ruleId, rule, input)` only when you need to bypass `given`/`formats`.
- Severity codes are numbers: `severityCodes.error` (0), `severityCodes.warning` (1), etc.
- Provide at least: one "clean spec passes" test and one test per violation type.

Template:

```js
/**
 * Copyright <YEAR> IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { <camelCaseRuleName> } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  unitTestRule,
  severityCodes,
} = require('../test-utils');

const rule = <camelCaseRuleName>;
const ruleId = 'ibm-<rule-name>';
const expectedSeverity = severityCodes.<warning|error|info|hint>;

describe(`Spectral rule: ${ruleId}`, () => {
  describe('Should not yield errors', () => {
    it('Clean spec', async () => {
      const results = await testRule(ruleId, rule, rootDocument);
      expect(results).toHaveLength(0);
    });

    // Add more passing cases here
  });

  describe('Should yield errors', () => {
    it('<describe the violation>', async () => {
      const testDocument = makeCopy(rootDocument);
      // mutate testDocument to trigger the rule
      const results = await testRule(ruleId, rule, testDocument);
      expect(results).toHaveLength(<N>);
      for (const r of results) {
        expect(r.severity).toBe(expectedSeverity);
        expect(r.message).toMatch(/<expected message fragment>/);
      }
    });
  });
});
```

---

## Step 7 — Add Scoring Rubric Entry

Path: `packages/validator/src/scoring-tool/rubric.js`

Every IBM rule should have a scoring entry. Add it in alphabetical order by rule ID using the
`coefficient`, `denominator`, and `categories` values confirmed in Step 0:

```js
'ibm-<rule-name>': {
  coefficient: <N>,       // weight of the rule in scoring (from Step 0; default 1)
  denominator: '<schemas|operations|paths>',  // from Step 0
  categories: ['<usability|security|robustness|evolution>'],  // from Step 0
},
```

If the user indicated no meaningful impact on scoring, add a comment entry instead:
```js
// 'ibm-<rule-name>' - no impact
```

Read the file first to find the correct alphabetical insertion point near the surrounding `ibm-valid-*` / `ibm-well-*` entries.

---

## Step 8 — Update Documentation

Path: `docs/ibm-cloud-rules.md`

Three locations must be updated:

### 8a — Table of Contents

Find the alphabetical TOC list (the bullet list under `<!-- toc -->`). Add:
```markdown
  * [ibm-<rule-name>](#ibm-<rule-name>)
```
in alphabetical order among the other `ibm-*` entries.

### 8b — Summary Table

Find the HTML summary table (rows of `<td><a href=...>` entries, one per rule). Add a `<tr>` block
in alphabetical order:
```html
<tr>
<td><a href="#ibm-<rule-name>">ibm-<rule-name></a></td>
<td><severity></td>
<td><One-sentence description of what the rule checks.></td>
<td>oas3</td>
</tr>
```

### 8c — Full Rule Section

Append a full `### ibm-<rule-name>` section at the correct alphabetical position among the other
`###` rule sections. Follow the exact HTML table format used by neighbouring rules. Include:
- Rule ID
- Description (a few sentences)
- Severity
- OAS Versions
- A non-compliant example (YAML code block)
- A compliant example (YAML code block)

Template (copy the structure from any nearby rule section, e.g. `### ibm-valid-path-segments`):

```markdown
### ibm-<rule-name>
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-<rule-name></b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td><Full description of the rule.>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td><severity></td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:</b></td>
<td>
<pre>
<non-compliant YAML example>
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
<compliant YAML example>
</pre>
</td>
</tr>
</table>
```

---

## Step 9 — Run Tests and Lint

After all files and docs are updated, run:

```bash
# Run the new rule's tests
npm run jest --workspace packages/ruleset -- --testPathPattern="<rule-name>"

# Run the full meta/style check (validates JSONPath expressions in all rules)
npm run jest --workspace packages/ruleset -- --testPathPattern="rule-style"

# Auto-fix lint/formatting
npm run fix
```

Fix any failures before reporting completion. If `rule-style` fails, the `given` JSONPath in
the rule definition is invalid — check for implicit `.[]` recursion.

---

## Step 10 — Report Completion

Summarise:
- Files created (function, rule, test)
- Lines added in `functions/index.js`, `rules/index.js`, and `ibm-oas.js`
- Rubric entry added in `rubric.js`
- Documentation updated in `docs/ibm-cloud-rules.md` (TOC, summary table, rule section)
- Test results (pass/fail counts)

Remind the user that commits must follow Angular commit message guidelines
(e.g. `feat(ruleset): add ibm-<rule-name> rule`).
