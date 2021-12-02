To address a vulnerability in a dependency of Spectral, we updated this tool to use the latest major version of Spectral. This version does not support loading of static assets for custom rulesets so to maintain consistent behavior, we re-organized our repo and released our [custom ruleset as its own NPM package](https://www.npmjs.com/package/@ibm-cloud/openapi-ruleset). Due to these changes, a number of incompatible changes have been released in `v0.52.0`. These changes are outlined in this document, along with steps to migrate to this version.

### IBM ruleset name change
Formerly, our custom ruleset was named `ibm:oas`. Any user rulesets extending our base rules would “extend” this set. The same ruleset is available to extend but it is under a new name: `@ibm-cloud/openapi-ruleset`. The only change a user needs to make to migrate is change this name in their Spectral config file:
```yaml
# example .spectral.yaml file

# extends: ibm:oas -> this will no longer work
extends: '@ibm-cloud/openapi-ruleset'
rules:
...
```

The tool will not fail if you do not make this change, it will just ignore the user’s ruleset and proceed with the default (which is the IBM ruleset).

### No configuring Spectral rules in the .validaterc file
Formerly, certain Spectral rules could be configured in the `.validaterc` file. Now, these configurations will be ignored. Users must specify their Spectral rule configurations in a [Spectral config file](https://github.com/IBM/openapi-validator#spectral-configuration).

### Spectral rule changes
- The `@ibm-cloud/openapi-ruleset` ruleset extends the `spectral:oas` ruleset. A number of their rules were updated in their last major release. This could affect any users configuring those rules through our ruleset.

For details on how these rules changed, see [this Spectral migration guide](https://meta.stoplight.io/docs/spectral/ZG9jOjg2MDIwMDM-spectral-v5-to-v6-migration-guide#rulesets).

### Spectral exceptions / overrides
Spectral `exceptions` are no longer supported by Spectral. They have been replaced with [`overrides`](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets#overrides).

However, neither are currently supported by this tool. Enabling `overrides` causes more things to break. The goal is to add support for this feature soon. For now, users must not include either field in their Spectral config files. It will cause Spectral to crash.

### Minimum Node version
Support for Node 10 is dropped, as it reached EOL in April 2021. The minimum Node version is now v12.
