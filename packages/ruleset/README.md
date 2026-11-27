# OpenAPI Ruleset
This package contains a custom Spectral ruleset for validating OpenAPI documents. It extends the `spectral:oas` ruleset, for which it defines custom severity levels. It also contains a number of additional rules based on API design requirements and guidance from IBM Cloud. This is the default ruleset used in the [`ibm-openapi-validator`](https://www.npmjs.com/package/ibm-openapi-validator) package.

## Installation

`npm install @ibm-cloud/openapi-ruleset`

Note that installation is only required if using this package programmatically or extending it in a Spectral config file written in JavaScript. It is not required if extending the ruleset in a Spectral config file written in YAML or JSON.

## Usage
### Spectral config file - YAML or JSON
* Note - no installation required. Spectral handles the import internally.

```yaml
# .spectral.yaml
extends: '@ibm-cloud/openapi-ruleset'
rules:
  content-entry-provided: off
```

### Spectral config file - JavaScript
```js
// .spectral.js
import ibmOpenapiRuleset from '@ibm-cloud/openapi-ruleset';

export default {
  extends: ibmOpenapiRuleset,
  rules: {
    'content-entry-provided': 'off'
  }
};
```

CommonJS config files still work: `const ibmOpenapiRuleset = require('@ibm-cloud/openapi-ruleset');` returns the ruleset object,
and `module.exports = { ... }` is still valid. ES module config files must use `import` and `export default`.
Only the package root, `/src/functions`, `/src/utils` and `/package.json` can be imported; other deep imports are not exported.
See the [migration note](https://github.com/IBM/openapi-validator/blob/main/docs/ibm-cloud-rules.md#migration-note-for-existing-javascript-rulesets) for details.

### Programmatically running Spectral
```js
// your-module.js
import ibmOpenapiRuleset from '@ibm-cloud/openapi-ruleset';
import { Spectral } from '@stoplight/spectral-core';

async function runSpectral(openapiDocument) {
  const spectral = new Spectral();
  spectral.setRuleset(ibmOpenapiRuleset);
  const results = await spectral.run(openapiDocument);
  console.log(results);
}
```
