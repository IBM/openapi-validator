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
const ibmOpenapiRuleset = require('@ibm-cloud/openapi-ruleset');

module.exports = {
  extends: ibmOpenapiRuleset,
  rules: {
    'content-entry-provided': 'off'
  }
};
```

### Programmatically running Spectral
```js
// your-module.js
const ibmOpenapiRuleset = require('@ibm-cloud/openapi-ruleset');
const { Spectral } = require('@stoplight/spectral-core');

function async runSpectral(openapiDocument) {
  const spectral = new Spectral();
  spectral.setRuleset(ibmOpenapiRuleset);
  results = await spectral.run(openapiDocument);
  console.log(results);
}
```
