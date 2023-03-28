# Migration Guide
This migration guide is intended to help users migrate from the version 0.x pre-release of the IBM OpenAPI Validator
to the new version 1.0 official release.

## Minimum Node version
The minimum supported version of Node.js is now version 16.x (formerly 14.x).

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
6. The new v1.x validator will consider it an error if you request JSON output (e.g. `--json`) and specify
more than one file to be validated on the command line.
The v0.x pre-release validator did not detect this and would simply display each JSON results object one after
another on the console, which would technically not be valid JSON.
The JSON output mode is intended to be used with a single file argument so that only one JSON results object is
displayed on the console.  Therefore, the new v1.x validator will enforce that restriction.
7. In the v0.x pre-release validator, multi-word options (e.g. `--report_statistics`) would include `_`
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

<table style="width=100%">
    <tr>
        <th style="width=35%">Previous Rule Id</th>
        <th style="width=35%">New Rule Id</th>
        <th style="width=30%">Notes</th>
    </tr>
    <tr>
        <td>array-boundary, array-items</td>
        <td>ibm-array-attributes</td>
        <td>rules 'array-boundary' and 'array-items' were combined into the new 'ibm-array-attributes' rule</td>
    </tr>
    <tr>
        <td>inline-property-schema, inline-request-schema, inline-response-schema</td>
        <td>ibm-avoid-inline-schemas</td>
        <td>rules 'inline-property-schema', 'inline-request-schema' and 'inline-response-schema' were combined into the new 'ibm-avoid-inline-schemas' rule</td>
    </tr>
    <tr>
        <td>property-case-collision</td>
        <td>ibm-avoid-property-name-collision</td>
        <td></td>
    </tr>
    <tr>
        <td>duplicate-path-parameter</td>
        <td>ibm-avoid-repeating-path-parameters</td>
        <td></td>
    </tr>
    <tr>
        <td>binary-schemas</td>
        <td>ibm-binary-schemas</td>
        <td></td>
    </tr>
    <tr>
        <td>collection-array-property</td>
        <td>ibm-collection-array-property</td>
        <td></td>
    </tr>
    <tr>
        <td>content-entry-contains-schema</td>
        <td>ibm-content-contains-schema</td>
        <td></td>
    </tr>
    <tr>
        <td>ibm-content-type-is-specific</td>
        <td>ibm-content-type-is-specific</td>
        <td></td>
    </tr>
    <tr>
        <td>missing-required-property</td>
        <td>ibm-define-required-properties</td>
        <td></td>
    </tr>
    <tr>
        <td>discriminator</td>
        <td>ibm-discriminator-property</td>
        <td></td>
    </tr>
    <tr>
        <td>merge-patch-optional-properties</td>
        <td>ibm-dont-require-merge-patch-properties</td>
        <td></td>
    </tr>
    <tr>
        <td>enum-case-convention</td>
        <td>ibm-enum-casing-convention</td>
        <td></td>
    </tr>
    <tr>
        <td>ibm-error-content-type-is-json</td>
        <td>ibm-error-content-type-is-json</td>
        <td></td>
    </tr>
    <tr>
        <td>response-error-response-schema</td>
        <td>ibm-error-response-schemas</td>
        <td></td>
    </tr>
    <tr>
        <td>no-etag-header</td>
        <td>ibm-etag-header</td>
        <td></td>
    </tr>
    <tr>
        <td>major-version-in-path</td>
        <td>ibm-major-version-in-path</td>
        <td></td>
    </tr>
    <tr>
        <td>accept-parameter</td>
        <td>ibm-no-accept-header</td>
        <td></td>
    </tr>
    <tr>
        <td>array-of-arrays</td>
        <td>ibm-no-array-of-arrays</td>
        <td></td>
    </tr>
    <tr>
        <td>array-responses</td>
        <td>ibm-no-array-responses</td>
        <td></td>
    </tr>
    <tr>
        <td>authorization-parameter</td>
        <td>ibm-no-authorization-header</td>
        <td></td>
    </tr>
    <tr>
        <td>delete-body</td>
        <td>ibm-no-body-for-delete</td>
        <td></td>
    </tr>
    <tr>
        <td>circular-refs</td>
        <td>ibm-no-circular-refs</td>
        <td></td>
    </tr>
    <tr>
        <td>consecutive-path-param-segments</td>
        <td>ibm-no-consecutive-path-parameter-segments</td>
        <td></td>
    </tr>
    <tr>
        <td>content-type-parameter</td>
        <td>ibm-no-content-type-header</td>
        <td></td>
    </tr>
    <tr>
        <td>path-param-not-crn</td>
        <td>ibm-no-crn-path-parameters</td>
        <td></td>
    </tr>
    <tr>
        <td>parameter-default</td>
        <td>ibm-no-default-for-required-parameter</td>
        <td></td>
    </tr>
    <tr>
        <td>ref-sibling-duplicate-description</td>
        <td>ibm-no-duplicate-description-with-ref-sibling</td>
        <td></td>
    </tr>
    <tr>
        <td>if-modified-since-parameter</td>
        <td>ibm-no-if-modified-since-header</td>
        <td></td>
    </tr>
    <tr>
        <td>if-unmodified-since-parameter</td>
        <td>ibm-no-if-unmodified-since-header</td>
        <td></td>
    </tr>
    <tr>
        <td>optional-request-body</td>
        <td>ibm-no-optional-properties-in-required-body</td>
        <td></td>
    </tr>
    <tr>
        <td>examples-name-contains-space</td>
        <td>ibm-no-space-in-example-name</td>
        <td></td>
    </tr>
    <tr>
        <td>unused-tag</td>
        <td>ibm-openapi-tags-used</td>
        <td></td>
    </tr>
    <tr>
        <td>operation-summary</td>
        <td>ibm-operation-summary</td>
        <td></td>
    </tr>
    <tr>
        <td>operation-id-case-convention</td>
        <td>ibm-operationid-casing-convention</td>
        <td></td>
    </tr>
    <tr>
        <td>operation-id-naming-convention</td>
        <td>ibm-operationid-naming-convention</td>
        <td></td>
    </tr>
    <tr>
        <td>pagination-style</td>
        <td>ibm-pagination-style</td>
        <td></td>
    </tr>
    <tr>
        <td>parameter-case-convention</td>
        <td>ibm-parameter-casing-convention</td>
        <td></td>
    </tr>
    <tr>
        <td>parameter-description</td>
        <td>ibm-parameter-description</td>
        <td></td>
    </tr>
    <tr>
        <td>parameter-order</td>
        <td>ibm-parameter-order</td>
        <td></td>
    </tr>
    <tr>
        <td>parameter-schema-or-content</td>
        <td>ibm-parameter-schema-or-content</td>
        <td></td>
    </tr>
    <tr>
        <td>patch-request-content-type</td>
        <td>ibm-patch-request-content-type</td>
        <td></td>
    </tr>
    <tr>
        <td>path-segment-case-convention</td>
        <td>ibm-path-segment-casing-convention</td>
        <td></td>
    </tr>
    <tr>
        <td>precondition-header</td>
        <td>ibm-precondition-headers</td>
        <td></td>
    </tr>
    <tr>
        <td>property-attributes</td>
        <td>ibm-property-attributes</td>
        <td></td>
    </tr>
    <tr>
        <td>property-case-convention</td>
        <td>ibm-property-casing-convention</td>
        <td></td>
    </tr>
    <tr>
        <td>property-inconsistent-name-and-type</td>
        <td>ibm-property-consistent-name-and-type</td>
        <td></td>
    </tr>
    <tr>
        <td>property-description</td>
        <td>ibm-property-description</td>
        <td></td>
    </tr>
    <tr>
        <td>ref-pattern</td>
        <td>ibm-ref-pattern</td>
        <td></td>
    </tr>
    <tr>
        <td>content-entry-provided</td>
        <td>ibm-request-and-response-content</td>
        <td></td>
    </tr>
    <tr>
        <td>request-body-object</td>
        <td>ibm-requestbody-is-object</td>
        <td></td>
    </tr>
    <tr>
        <td>request-body-name</td>
        <td>ibm-requestbody-name</td>
        <td></td>
    </tr>
    <tr>
        <td>response-status-codes</td>
        <td>ibm-response-status-codes</td>
        <td></td>
    </tr>
    <tr>
        <td>schema-description</td>
        <td>ibm-schema-description</td>
        <td></td>
    </tr>
    <tr>
        <td>schema-type</td>
        <td>ibm-schema-type</td>
        <td></td>
    </tr>
    <tr>
        <td>valid-type-format</td>
        <td>ibm-schema-type-format</td>
        <td></td>
    </tr>
    <tr>
        <td>ibm-sdk-operations</td>
        <td>ibm-sdk-operations</td>
        <td></td>
    </tr>
    <tr>
        <td>security-scheme-attributes</td>
        <td>ibm-securityscheme-attributes</td>
        <td></td>
    </tr>
    <tr>
        <td>security-schemes</td>
        <td>ibm-securityschemes</td>
        <td></td>
    </tr>
    <tr>
        <td>server-variable-default-value</td>
        <td>ibm-server-variable-default-value</td>
        <td></td>
    </tr>
    <tr>
        <td>string-boundary</td>
        <td>ibm-string-attributes</td>
        <td></td>
    </tr>
    <tr>
        <td>response-example-provided</td>
        <td>ibm-success-response-example</td>
        <td></td>
    </tr>
    <tr>
        <td>prohibit-summary-sentence-style</td>
        <td>ibm-summary-sentence-style</td>
        <td></td>
    </tr>
    <tr>
        <td>valid-path-segments</td>
        <td>ibm-valid-path-segments</td>
        <td></td>
    </tr>
    <tr>
        <td>description-mentions-json</td>
        <td>n/a</td>
        <td>this rule was removed</td>
    </tr>
</table>

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

