# Migration Guide
This migration guide is intended to help users migrate from the version 0.x pre-release of the IBM OpenAPI Validator
to the new version 1.0 official release.

## Minimum Node version
The minimum supported version of Node.js remains at version 14.x.

## Supported OpenAPI versions
The old v0.x pre-release validator supported both Swagger 2.x and OpenAPI 3.x documents.
The new v1.x validator supports only OpenAPI 3.x documents.

## CLI Changes
Changes were made to the command-line options supported by the validator:  
1. In the v0.x pre-release validator, the `-c`/`--config` option was used to specify the name
of the user's configuration file to use instead of `.validaterc`.  In the new v1.x validator,
this same option is now used to specify the name of your validator configuration file, which
now has a completely different structure (see below).
2. In the v0.x pre-release validator, the `-s`/`--report_statistics` option was used to
include the summary section in the validator output.  In the new v1.x validator, the output will
always include the summary section and you can now use the `-s`/`--summary-only` option to
cause the validator to include *only* the summary section in the output and avoid logging
individual validation messages.
3. The `-d`/`--default_mode` option is no longer supported.  To achieve "default mode" with
the new  1.x validator, simply avoid specifying any options (other than the files to be validated, perhaps),
and the validator will revert to default behavior with respect to each of the options (e.g. validator
output is colorized by default).
4. The `-p`/`--print_validator_modules` option is no longer supported.
5. The `--debug` option is no longer supported.  In the new v1.x validator, you can achieve something
similar by simply setting the log-level of the "root" logger to "debug" (e.g. `--log-level debug`).
6. In the v0.x pre-release validator, multi-word options (e.g. `--report_statistics`) would include `_`
(underscore) as the word delimiter, but the new v1.x validator uses `-` (dash) as the 
word delimiter (e.g. `--errors_only` is now `--errors-only`).

More details about the command-line options supported by the new v1.x validator can be found [here](README.md#usage).

## New Validator Configuration File
The v0.x pre-release validator supported two different configuration files:
- `.thresholdrc`: this is where the warnings limit could be defined
- `.validaterc`: this is where you could configure rules, etc.

These files are no longer supported, but the new v1.x validator supports
a more consistent interface in which each of the command-line options is also
supported as a field within the new configuration file.
This gives users the freedom to specify input options on the command-line, within a configuration file,
or even a combination of the two (options specified on the command-line will take precedence over options
defined in a configuration file).   In addition, the new 1.x validator supports JSON, YAML and Javascript formats.

More details regarding the new v1.x validator's configuration file can be found [here](README.md#configuration).

## Validator Output
### Text
The text output produced by the new v1.x validator is largely the same as that produced by the v0.x pre-release validator.
One main difference is that the v1.x validator will now *always* include the summary section in the output and the
`-s`/`--summary-only` option can be used to include *only* the summary section in the output.

### JSON
The structure of the JSON output produced by the new 1.x validator is slightly different, and is now
described by [this schema](packages/validator/src/schemas/results-object.yaml).
Also, the new 1.x validator will honor the `--errors-only` and `--summary-only` options when producing JSON output, whereas
the v0.x pre-release validator did not.
More details related to validator output can be found [here](README.md#validator-output).

## API
The v0.x pre-release validator supported an API to enable users to invoke the validator programmatically
from a javascript application.
This API is no longer supported in the v1.x validator; however, the Spectral validator (on which the 
IBM OpenAPI Validator is based) provides a [programmatic API](https://meta.stoplight.io/docs/spectral/eb68e7afd463e-spectral-in-java-script)
for invoking Spectral from your javascript application code.

## Ruleset Changes
This section contains information about changes that were made to the
rules contained in the IBM Cloud Validation Ruleset.

### Rule Id Changes
In the new v1.x validator, the rule id's were changed so that they now follow a more consistent
naming convention.  The following table provides a detailed mapping of old vs new rule id, along with any other
change-related notes:

| Previous Rule Id | New Rule Id | Notes |
|------------------|-------------|-------|
| accept-parameter                    | ibm-accept-header                          | |
| array-boundary                      | ibm-array-attributes                       | old rules 'array-boundary' and 'array-items' were combined into the new 'ibm-array-attributes' rule |
| array-items                         | ibm-array-attributes                       | |
| array-of-arrays                     | ibm-array-of-arrays                        | |
| array-responses                     | ibm-array-responses                        | |
| authorization-parameter             | ibm-authorization-header                   | |
| binary-schemas                      | ibm-binary-schemas                         | |
| circular-refs                       | ibm-circular-refs                          | |
| collection-array-property           | ibm-collection-array-property              | |
| consecutive-path-param-segments     | ibm-consecutive-path-segments              | |
| content-entry-contains-schema       | ibm-content-contains-schema                | |
| content-entry-provided              | ibm-content-exists                         | |
| content-type-parameter              | ibm-content-type-header                    | |
| delete-body                         | ibm-delete-body                            | |
| description-mentions-json           | ibm-description-mentions-json              | |
| discriminator                       | ibm-discriminator-property-exists          | |
| duplicate-path-parameter            | ibm-duplicate-path-parameter               | |
| enum-case-convention                | ibm-enum-casing-convention                 | |
| examples-name-contains-space        | ibm-examples-name-contains-space           | |
| ibm-content-type-is-specific        | ibm-content-type-is-specific               | |
| ibm-error-content-type-is-json      | ibm-error-content-type-is-json             | |
| ibm-sdk-operations                  | ibm-sdk-operations                         | |
| if-modified-since-parameter         | ibm-if-modified-since-header               | |
| if-unmodified-since-parameter       | ibm-if-unmodified-since-header             | |
| inline-property-schema              | ibm-inline-property-schema                 | |
| inline-request-schema               | ibm-inline-request-schema                  | |
| inline-response-schema              | ibm-inline-response-schema                 | |
| major-version-in-path               | ibm-major-version-in-path                  | |
| merge-patch-optional-properties     | ibm-merge-patch-properties                 | |
| missing-required-property           | ibm-required-property-missing              | |
| no-etag-header                      | ibm-etag-header-exists                     | |
| operation-id-case-convention        | ibm-operationid-casing-convention          | |
| operation-id-naming-convention      | ibm-operationid-naming-convention          | |
| operation-summary                   | ibm-operation-summary-exists               | |
| optional-request-body               | ibm-optional-requestbody                   | |
| pagination-style                    | ibm-pagination-style                       | |
| parameter-case-convention           | ibm-parameter-casing-convention            | |
| parameter-default                   | ibm-parameter-default                      | |
| parameter-description               | ibm-parameter-description-exists           | |
| parameter-order                     | ibm-parameter-order                        | |
| parameter-schema-or-content         | ibm-parameter-schema-or-content-exists     | |
| patch-request-content-type          | ibm-patch-request-content-type             | |
| path-param-not-crn                  | ibm-path-parameter-crn                     | |
| path-segment-case-convention        | ibm-path-segment-casing-convention         | |
| precondition-header                 | ibm-precondition-header                    | |
| prohibit-summary-sentence-style     | ibm-summary-sentence-style                 | |
| property-attributes                 | ibm-property-attributes                    | |
| property-case-collision             | ibm-property-name-collision                | |
| property-case-convention            | ibm-property-casing-convention             | |
| property-description                | ibm-property-description-exists            | |
| property-inconsistent-name-and-type | ibm-property-consistent-name-and-type      | |
| ref-pattern                         | ibm-ref-pattern                            | |
| ref-sibling-duplicate-description   | ibm-ref-sibling-duplicate-description      | |
| request-body-name                   | ibm-requestbody-name-exists                | |
| request-body-object                 | ibm-requestbody-is-object                  | |
| response-error-response-schema      | ibm-error-response-schemas                 | |
| response-example-provided           | ibm-response-example-exists                | |
| response-status-codes               | ibm-response-status-codes                  | |
| schema-description                  | ibm-schema-description-exists              | |
| schema-type                         | ibm-schema-type-exists                     | |
| security-scheme-attributes          | ibm-securityscheme-attributes              | |
| security-schemes                    | ibm-securityschemes                        | |
| server-variable-default-value       | ibm-server-variable-default-value          | |
| string-boundary                     | ibm-string-attributes                      | |
| unused-tag                          | ibm-unused-tags                            | |
| valid-path-segments                 | ibm-valid-path-segments                    | |
| valid-type-format                   | ibm-schema-type-format                     | |

Detailed reference information about each rule can be found [here](./docs/ibm-cloud-rules.md#reference).

### Logging Implemented
In the new v1.x validator, we've implemented a common message logging facility that is
described [here](README.md#logging).

One of the benefits of this change is that it is now fairly easy to obtain more detailed
information (i.e. debug information) from a particular rule.
Simply set the rule's log-level to be `debug`.  

For example, suppose that the `ibm-pagination-style`
rule is detecting violations in your API, but you're not quite sure why those violations are being flagged,
and hence you're not sure how to fix them.  You could add the `--log-level ibm-pagination-style=debug`
(or `-l ibm-pagination-style=debug`) option to your validator command to enable debug logging for this rule.
You would then see additional information displayed by the validator as the rule examines your API.  Hopefully this
can then lead to a solution.

