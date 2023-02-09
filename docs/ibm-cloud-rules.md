# IBM Cloud Validation Ruleset

This document outlines how to configure and use the IBM Cloud Validation Ruleset,
which is delivered in the `@ibm-cloud/openapi-ruleset` NPM package.

## Table of contents

<!--
  The TOC below is generated using the `markdown-toc` node package.

      https://github.com/jonschlinkert/markdown-toc

  You should regenerate the TOC after making changes to this file.

      markdown-toc --maxdepth 4 -i docs/ibm-cloud-rules.md
  -->

<!-- toc -->

- [Ruleset Contents](#ruleset-contents)
  * [Overview of IBM Cloud validation rules](#overview-of-ibm-cloud-validation-rules)
  * [Overview of `spectral:oas` rules](#overview-of-spectraloas-rules)
- [Customization](#customization)
  * [Modify a rule's severity](#modify-a-rules-severity)
  * [Advanced rule customization](#advanced-rule-customization)
  * [Define custom rules](#define-custom-rules)
    + [Replace a rule from `@ibm-cloud/openapi-ruleset`](#replace-a-rule-from-ibm-cloudopenapi-ruleset)
    + [Define a new rule](#define-a-new-rule)
  * [Spectral Overrides](#spectral-overrides)
- [Reference](#reference)
  * [ibm-accept-parameter](#ibm-accept-parameter)
  * [ibm-array-attributes](#ibm-array-attributes)
  * [ibm-array-of-arrays](#ibm-array-of-arrays)
  * [ibm-array-responses](#ibm-array-responses)
  * [ibm-authorization-parameter](#ibm-authorization-parameter)
  * [ibm-binary-schemas](#ibm-binary-schemas)
  * [ibm-circular-refs](#ibm-circular-refs)
  * [ibm-collection-array-property](#ibm-collection-array-property)
  * [ibm-consecutive-path-segments](#ibm-consecutive-path-segments)
  * [ibm-content-contains-schema](#ibm-content-contains-schema)
  * [ibm-content-exists](#ibm-content-exists)
  * [ibm-content-type-is-specific](#ibm-content-type-is-specific)
  * [ibm-content-type-parameter](#ibm-content-type-parameter)
  * [ibm-delete-body](#ibm-delete-body)
  * [ibm-description-mentions-json](#ibm-description-mentions-json)
  * [ibm-discriminator-property-exists](#ibm-discriminator-property-exists)
  * [ibm-duplicate-path-parameter](#ibm-duplicate-path-parameter)
  * [ibm-enum-case](#ibm-enum-case)
  * [ibm-error-content-type-is-json](#ibm-error-content-type-is-json)
  * [ibm-examples-name-contains-space](#ibm-examples-name-contains-space)
  * [ibm-if-modified-since-parameter](#ibm-if-modified-since-parameter)
  * [ibm-if-unmodified-since-parameter](#ibm-if-unmodified-since-parameter)
  * [ibm-inline-property-schema](#ibm-inline-property-schema)
  * [ibm-inline-request-schema](#ibm-inline-request-schema)
  * [ibm-inline-response-schema](#ibm-inline-response-schema)
  * [ibm-major-version-in-path](#ibm-major-version-in-path)
  * [ibm-merge-patch-optional-properties](#ibm-merge-patch-optional-properties)
  * [ibm-missing-required-property](#ibm-missing-required-property)
  * [ibm-no-etag-header](#ibm-no-etag-header)
  * [ibm-operation-id-case-convention](#ibm-operation-id-case-convention)
  * [ibm-operation-id-naming-convention](#ibm-operation-id-naming-convention)
  * [ibm-operation-summary](#ibm-operation-summary)
  * [ibm-optional-request-body](#ibm-optional-request-body)
  * [ibm-pagination-style](#ibm-pagination-style)
  * [ibm-parameter-case-convention](#ibm-parameter-case-convention)
  * [ibm-parameter-default](#ibm-parameter-default)
  * [ibm-parameter-description](#ibm-parameter-description)
  * [ibm-parameter-order](#ibm-parameter-order)
  * [ibm-parameter-schema-or-content](#ibm-parameter-schema-or-content)
  * [ibm-patch-request-content-type](#ibm-patch-request-content-type)
  * [ibm-path-param-not-crn](#ibm-path-param-not-crn)
  * [ibm-path-segment-case-convention](#ibm-path-segment-case-convention)
  * [ibm-precondition-header](#ibm-precondition-header)
  * [ibm-prohibit-summary-sentence-style](#ibm-prohibit-summary-sentence-style)
  * [ibm-property-attributes](#ibm-property-attributes)
  * [ibm-property-case-collision](#ibm-property-case-collision)
  * [ibm-property-case-convention](#ibm-property-case-convention)
  * [ibm-property-description](#ibm-property-description)
  * [ibm-property-inconsistent-name-and-type](#ibm-property-inconsistent-name-and-type)
  * [ibm-ref-pattern](#ibm-ref-pattern)
  * [ibm-ref-sibling-duplicate-description](#ibm-ref-sibling-duplicate-description)
  * [ibm-request-body-name](#ibm-request-body-name)
  * [ibm-request-body-object](#ibm-request-body-object)
  * [ibm-response-error-response-schema](#ibm-response-error-response-schema)
  * [ibm-response-example-provided](#ibm-response-example-provided)
  * [ibm-response-status-codes](#ibm-response-status-codes)
  * [ibm-schema-description](#ibm-schema-description)
  * [ibm-schema-type](#ibm-schema-type)
  * [ibm-sdk-operations](#ibm-sdk-operations)
  * [ibm-security-scheme-attributes](#ibm-security-scheme-attributes)
  * [ibm-security-schemes](#ibm-security-schemes)
  * [ibm-server-variable-default-value](#ibm-server-variable-default-value)
  * [ibm-string-attributes](#ibm-string-attributes)
  * [ibm-unused-tag](#ibm-unused-tag)
  * [ibm-valid-path-segments](#ibm-valid-path-segments)
  * [ibm-valid-type-format](#ibm-valid-type-format)

<!-- tocstop -->

## Ruleset Contents
The IBM Cloud Validation Ruleset consists of:
- IBM Cloud validation rules: a collection of rules that implement and enforce the best practices found
in the [IBM Cloud API Handbook](https://cloud.ibm.com/docs/api-handbook).
- Spectral's [“oas" ruleset](https://meta.stoplight.io/docs/spectral/docs/reference/openapi-rules.md): 
the IBM Cloud Validation Ruleset extends the `spectral:oas` ruleset, so all of the rules contained in
that ruleset are also available to users of the `@ibm-cloud/openapi-ruleset` package as well. 

### Overview of IBM Cloud validation rules
This table provides an overview of the IBM Cloud validation rules.  More detailed information for each rule
is provided in the [Reference](#reference) section below.

<table>
<tr>
<th>Rule Id</th><th>Severity</th><th>Description</th><th>OpenAPI Versions</th>
<tr>
<tr>
<td><a href="#ibm-accept-parameter">ibm-accept-parameter</a></td>
<td>warn</td>
<td>Operations should not explicitly define the <code>Accept</code> header parameter</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-array-attributes">ibm-array-attributes</a></td>
<td>warn</td>
<td>Array schemas must define the <code>items</code> field, and should define the <code>minItems</code> and <code>maxItems</code> fields</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-array-of-arrays">ibm-array-of-arrays</a></td>
<td>warn</td>
<td>Array schemas with <code>items</code> of type array should be avoided</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-array-responses">ibm-array-responses</a></td>
<td>error</td>
<td>Operations should not return an array as the top-level structure of a response.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-authorization-parameter">ibm-authorization-parameter</a></td>
<td>warn</td>
<td>Operations should not explicitly define the <code>Authorization</code> header parameter</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-binary-schemas">ibm-binary-schemas</a></td>
<td>warn</td>
<td>Makes sure that binary schemas are used only in proper locations within the API definition</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-circular-refs">ibm-circular-refs</a></td>
<td>warn</td>
<td>Makes sure that the API definition doesn't contain any circular references</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-collection-array-property">ibm-collection-array-property</a></td>
<td>warn</td>
<td>The [API Handbook](https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-collections-overview#response-format) states that the response
to a "list" operation returning a collection must be an object that contains an array property whose name matches the plural form of the
resource type.
For example, the "GET /v1/things" operation should return an object with an array property named "things"
(which is presumably defined as an array of Thing instances).
<p>This rule enforces this requirement by checking each operation that appears to be a
"list"-type operation (with or without support for pagination) to make sure that the operation's
response schema defines an array property whose name matches the last path segment
within the operation's path string, which should also match the plural form of the resource type.
</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-consecutive-path-segments">ibm-consecutive-path-segments</a></td>
<td>error</td>
<td>Checks each path string in the API definition to detect the presence of two or more consecutive
path segments that contain a path parameter reference (e.g. <code>/v1/foos/{foo_id}/{bar_id}</code>), 
which is not allowed.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-content-contains-schema">ibm-content-contains-schema</a></td>
<td>warn</td>
<td>Content entries must specify a schema</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-content-exists">ibm-content-exists</a></td>
<td>warn</td>
<td>Request bodies and non-204 responses should define a content field</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-content-type-is-specific">ibm-content-type-is-specific</a></td>
<td>warn</td>
<td><code>*/*</code> should only be used when all content types are supported</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-content-type-parameter">ibm-content-type-parameter</a></td>
<td>warn</td>
<td>Operations should not explicitly define the <code>Content-Type</code> header parameter</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-delete-body">ibm-delete-body</a></td>
<td>warn</td>
<td>"delete" operations should not contain a requestBody.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-description-mentions-json">ibm-description-mentions-json</a></td>
<td>warn</td>
<td>Schema descriptions should avoid mentioning <code>JSON</code></td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-discriminator-property-exists">ibm-discriminator-property-exists</a></td>
<td>error</td>
<td>The discriminator property must be defined in the schema</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-duplicate-path-parameter">ibm-duplicate-path-parameter</a></td>
<td>error</td>
<td>Common path parameters should be defined on the path object.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-enum-case">ibm-enum-case</a></td>
<td>error</td>
<td>Enum values should follow a specific case convention</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-error-content-type-is-json">ibm-error-content-type-is-json</a></td>
<td>warn</td>
<td>Error response should support <code>application/json</code></td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-examples-name-contains-space">ibm-examples-name-contains-space</a></td>
<td>warn</td>
<td>The name of an entry in an <code>examples</code> field should not contain a space</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-sdk-operations">ibm-sdk-operations</a></td>
<td>warn</td>
<td>Validates the structure of each <code>x-sdk-operations</code> object</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-if-modified-since-parameter">ibm-if-modified-since-parameter</a></td>
<td>warn</td>
<td>Operations should avoid supporting the <code>If-Modified-Since</code> header parameter</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-if-unmodified-since-parameter">ibm-if-unmodified-since-parameter</a></td>
<td>warn</td>
<td>Operations should avoid supporting the <code>If-Unmodified-Since</code> header parameter</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-inline-property-schema">ibm-inline-property-schema</a></td>
<td>warn</td>
<td>Nested objects should be defined as a $ref to a named schema</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-inline-request-schema">ibm-inline-request-schema</a></td>
<td>warn</td>
<td>Request body schemas should be defined as a $ref to a named schema</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-inline-response-schema">ibm-inline-response-schema</a></td>
<td>warn</td>
<td>Response schemas should be defined as a $ref to a named schema</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-major-version-in-path">ibm-major-version-in-path</a></td>
<td>warn</td>
<td>All paths must contain the API major version as a distinct path segment</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-merge-patch-optional-properties">ibm-merge-patch-optional-properties</a></td>
<td>warn</td>
<td>JSON merge-patch requestBody schemas should have no required properties</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-missing-required-property">ibm-missing-required-property</a></td>
<td>error</td>
<td>A schema property defined as <code>required</code> must be defined within the schema</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-etag-header">ibm-no-etag-header</a></td>
<td>error</td>
<td>Verifies that the <code>ETag</code> response header is defined in the <code>GET</code> operation
for any resources (paths) that support the <code>If-Match</code> and/or <code>If-None-Match</code> header parameters.
</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-operation-id-case-convention">ibm-operation-id-case-convention</a></td>
<td>warn</td>
<td>Operation ids should follow a specific case convention</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-operation-id-naming-convention">ibm-operation-id-naming-convention</a></td>
<td>warn</td>
<td>Operation ids should follow a naming convention</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-operation-summary">ibm-operation-summary</a></td>
<td>warn</td>
<td>Operation <code>summary</code> must be present and non-empty string.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-optional-request-body">ibm-optional-request-body</a></td>
<td>info</td>
<td>An optional requestBody with required properties should probably be required</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-pagination-style">ibm-pagination-style</a></td>
<td>warn</td>
<td>List operations should have correct pagination style</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-parameter-case-convention">ibm-parameter-case-convention</a></td>
<td>error</td>
<td>Parameter names should follow a specific case convention</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-parameter-default">ibm-parameter-default</a></td>
<td>warn</td>
<td>Required parameters should not define a default value</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-parameter-description">ibm-parameter-description</a></td>
<td>warn</td>
<td>Parameters should have a non-empty description</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-parameter-order">ibm-parameter-order</a></td>
<td>warn</td>
<td>All required operation parameters should be listed before optional parameters.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-parameter-schema-or-content">ibm-parameter-schema-or-content</a></td>
<td>error</td>
<td>Parameters must provide either a schema or content</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-patch-request-content-type">ibm-patch-request-content-type"</a></td>
<td>error</td>
<td>Verifies that PATCH operations support only requestBody content types <code>application/json-patch+json</code>
or <code>application/merge-patch+json</code>.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-path-param-not-crn">ibm-path-param-not-crn</a></td>
<td>warn</td>
<td>Verifies that path parameters are not defined as CRN (Cloud Resource Name) values</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-path-segment-case-convention">ibm-path-segment-case-convention</a></td>
<td>error</td>
<td>Path segments must follow a specific case convention</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-precondition-header">ibm-precondition-header</a></td>
<td>error</td>
<td>Operations that return a 412 status code must support at least one of the following header parameters: <code>If-Match</code>, <code>If-None-Match</code>, <code>If-Modified-Since</code>, <code>If-Unmodified-Since</code></td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-prohibit-summary-sentence-style">ibm-prohibit-summary-sentence-style</a></td>
<td>warn</td>
<td>An operation's <code>summary</code> field should not have a trailing period</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-property-attributes">ibm-property-attributes</a></td>
<td>error</td>
<td>Performs a series of checks on the attributes defined for various schema types</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-property-case-collision">ibm-property-case-collision</a></td>
<td>error</td>
<td>Avoid duplicate property names within a schema, even if they differ by case convention</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-property-case-convention">ibm-property-case-convention</a></td>
<td>error</td>
<td>Schema property names should follow a specific case convention</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-property-description">ibm-property-description</a></td>
<td>warn</td>
<td>Schema properties should have a non-empty description</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-property-inconsistent-name-and-type">ibm-property-inconsistent-name-and-type</a></td>
<td>off</td>
<td>Avoid using the same property name for properties of different types. This rule is disabled by default.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-ref-pattern">ibm-ref-pattern</a></td>
<td>warn</td>
<td>Ensures that <code>$ref</code> values follow the correct patterns.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-ref-sibling-duplicate-description">ibm-ref-sibling-duplicate-description</a></td>
<td>warn</td>
<td>Ensures that the "ref-sibling" <code>allOf</code> pattern is not used unnecessarily to define a duplicate description.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-request-body-name">ibm-request-body-name</a></td>
<td>warn</td>
<td>An operation should specify a request body name (with the <code>x-codegen-request-body-name</code> extension) if its requestBody
has non-form content.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-request-body-object">ibm-request-body-object</a></td>
<td>warn</td>
<td>A request body should be defined as an object</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-response-error-response-schema">ibm-response-error-response-schema</a></td>
<td>warn</td>
<td>Error response schemas should comply with API Handbook guidance</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-response-example-provided">ibm-response-example-provided</a></td>
<td>warn</td>
<td>Response should provide an example</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-response-status-codes">ibm-response-status-codes</a></td>
<td>warn</td>
<td>Performs multiple checks on the status codes used in operation responses.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-schema-description">ibm-schema-description</a></td>
<td>warn</td>
<td>Schemas should have a non-empty description</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-schema-type">ibm-schema-type</a></td>
<td>off</td>
<td>Schemas and schema properties should have a non-empty <code>type</code> field. <b>This rule is disabled by default.</b></td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-security-scheme-attributes">ibm-security-schemes</a></td>
<td>warn</td>
<td>Performs a series of validations on the content within security schemes</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-security-schemes">ibm-security-schemes</a></td>
<td>warn</td>
<td>Verifies the security schemes and security requirement objects</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-server-variable-default-value">ibm-server-variable-default-value</a></td>
<td>warn</td>
<td>Server variables should have a default value</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-string-attributes">ibm-string-attributes</a></td>
<td>warn</td>
<td>String schema properties should define the <code>pattern</code>, <code>minLength</code> and <code>maxLength</code> fields</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-unused-tag">ibm-unused-tag</a></td>
<td>warn</td>
<td>Verifies that each defined tag is referenced by at least one operation</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-valid-path-segments">ibm-valid-path-segments</a></td>
<td>error</td>
<td>Checks each path string in the API to make sure path parameter references are valid within path segments</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-valid-type-format">ibm-valid-type-format</a></td>
<td>error</td>
<td>Schema must use a valid combination of <code>type</code> and <code>format</code></td>
<td>oas3</td>
</tr>
</table>


### Overview of `spectral:oas` rules
As mentioned above, the IBM Cloud Validation Ruleset (`@ibm-cloud/openapi-ruleset`) extends
the `spectral:oas` ruleset.  
While all of the `spectral:oas` rules are included, only the following rules are enabled by default:
```
'operation-operationId-unique': true,
'operation-parameters': true,
'operation-tag-defined': true,
'info-description': 'off',
'no-script-tags-in-markdown': true,
'openapi-tags': true,
'operation-description': true,
'operation-operationId': true,
'operation-tags': true,
'path-params': true,
'path-declarations-must-exist': true,
'path-keys-no-trailing-slash': true,
'path-not-include-query': true,
'no-$ref-siblings': true,
'typed-enum': true,
'oas2-operation-formData-consume-check': true,
'oas2-api-host': true,
'oas2-api-schemes': true,
'oas2-host-trailing-slash': true,
'oas2-valid-schema-example': 'warn',
'oas2-anyOf': true,
'oas2-oneOf': true,
'oas2-unused-definition': true,
'oas3-api-servers': true,
'oas3-examples-value-or-externalValue': true,
'oas3-server-trailing-slash': true,
'oas3-valid-media-example': 'warn',
'oas3-valid-schema-example': 'warn',
'oas3-schema': true,
'oas3-unused-component': true
```

## Customization
You can customize any of the rules contained in the `@ibm-cloud/openapi-ruleset`
(including the rules in the `spectral:oas` ruleset) by creating a custom ruleset.
For detailed information on creating your own ruleset and how to extend other rulesets, please read
the [Spectral Rulesets](https://meta.stoplight.io/docs/spectral/ZG9jOjYyMDc0NA-rulesets) documentation.

There are two different ways that you can supply your custom ruleset file to the IBM OpenAPI Validator:
1. Name your custom ruleset file with one of the names (`.spectral.yaml`, `.spectral.yml`, `.spectral.json` or `.spectral.js`)
and place it in the current directory where you will be running the validator.
2. Use an arbitrary filename for your custom ruleset file (e.g. `/User/myuser/rules/my-rules.yaml`) and use
the `--ruleset` command line option to specify the name when running the validator.
Example:
```
    lint-openapi --ruleset /User/myuser/rules/my-rules.yaml my-service-api.yaml
```

In this document, we'll focus on how to customize and extend the rules found in the IBM Cloud Validation Ruleset.

There are a few different ways in which you can customize and extend rules.  The customization options available to you
will depend on the type of customization that you need to do.  This is described in the following sections.

**Note:** If you extend the `@ibm-cloud/openapi-ruleset` package in your custom ruleset file,
you MUST install the npm package first, using a command like this:
```
npm install @ibm-cloud/openapi-ruleset
```

### Modify a rule's severity

If you would simply like to modify a rule's severity or disable a rule altogether,
follow the instructions in this section.

Any rule in the `@ibm-cloud/openapi-ruleset` package can be configured to trigger an error, warning, info,
or hint message in the validator output.  
For example, to configure the `schema-description` rule to trigger an `info` message instead of a `warning`,
specify the following in your custom ruleset file (this example uses the yaml format):
```yaml
extends: '@ibm-cloud/openapi-ruleset'
rules:
  schema-description: info
```

To completely disable a rule, use the severity of `off`.
For example, to disable the `schema-description` rule, specify the following in your custom ruleset file:
```yaml
extends: '@ibm-cloud/openapi-ruleset'
rules:
  schema-description: off
```

Since the `@ibm-cloud/openapi-ruleset` package includes all the rules in `spectral:oas`, you can also enable rules from that
ruleset that are disabled by default.
For example, to enable the `info-contact` rule with its default severity (`warning`), specify the following in your custom ruleset file:
```yaml
extends: '@ibm-cloud/openapi-ruleset'
rules:
  info-contact: true
```

You could also set the severity of `info-contact` explicitly to `error`, `warn`, `info`, or `hint`.

### Advanced rule customization

You can customize more than just a rule's severity.  You can also customize a rule's configuration to select non-default
options, etc.  Not all rules support a configuration, but some do (for details about which rules support a configuration object,
please see the [Reference](#reference) section below).

In order to customize the configuration of a rule, you will need to re-define the entire rule within your custom ruleset.
For these types of customizations, please follow the instructions in the [Custom Rules](#custom-rules) section below.

### Define custom rules

If you would like to modify the configuration of an existing rule or define your own new rule, you can define custom rules
within your own ruleset. 

For reference information on how to define your own custom rules, please read the
[Spectral custom rulesets](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets) documentation.

#### Replace a rule from `@ibm-cloud/openapi-ruleset`
In this section, we'll focus on the goal of defining a new custom rule that replaces the `property-case-convention` rule
within the `@ibm-cloud/openapi-ruleset` package.
Specifically, we'll configure our custom rule to enforce camel case within schema property names rather than the default snake case.

In this scenario, we will re-define the `property-case-convention` rule within our custom ruleset, but we will re-use the
`propertyCaseConvention` custom function within the `@ibm-cloud/openapi-ruleset` package that implements the logic of this rule.
For this reason, we must implement our custom ruleset using javascript instead of yaml.

Here is our custom ruleset file (`.spectral.js`):

```javascript
const ibmCloudValidationRules = require('@ibm-cloud/openapi-ruleset');                           // Note 1
const { propertyCaseConvention } = require('@ibm-cloud/openapi-ruleset/src/functions');
const { schemas } = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');

module.exports = {
  extends: ibmCloudValidationRules,
  rules: {
    'property-case-convention': {                                                                // Note 2
      description: 'Property names must follow camel case',
      message: '{{error}}',
      resolved: true,                                                                            // Note 3
      given: schemas,                                                                            // Note 4
      severity: 'warn',
      then: {
        function: propertyCaseConvention,                                                        // Note 5
        functionOptions: {                                                                       // Note 6
          type: 'camel'
        }
      }
    }
  }
};
```
Notes:
1. This custom ruleset extends `@ibm-cloud/openapi-ruleset` and also references the `propertyCaseConvention` function and the
`schemas` JSONPath collection, so we need to import each of these with `require` statements.  In addition, be sure to install
the `@ibm-cloud/openapi-ruleset` package: `npm install @ibm-cloud/openapi-ruleset`.
2. This custom rule is re-defining (overriding) the `property-case-convention` rule from the `@ibm-cloud/openapi-ruleset` package
so we need to use the same rule id (`property-case-convention`).  Alternatively, we could have used a different rule id of our choosing,
but we would then need to separately disable the existing `property-case-convention` rule so that we don't end up using both rules which would result in
the simultaneous enforcement of two competing case conventions.
3. The `resolved=true` setting means that the rule will be invoked on the _resolved_ version of the API definition (i.e. each `$ref`
will be resolved by replacing with the referenced entity).
4. The use of the `schemas` collection for the value of the `given` field is a convenient way to express that the rule should be invoked
on each location within the _resolved_ API definition where a schema might appear.
5. Our custom rule uses the same function (`propertyCaseConvention`) that is used by the original `property-case-convention` rule
within the `@ibm-cloud/openapi-ruleset` package.
6. We set the `functionOptions` field to configure the rule to enforce camel case instead of the default snake case.

#### Define a new rule
To define a new rule as part of your custom ruleset, please read the [Spectral Custom Rulesets](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets) documentation.


### Spectral Overrides

Rather than turning off a Spectral rule entirely, Spectral overrides allow you to customize ruleset usage for different
files and projects without having to duplicate any rules.
For details on how to add overrides to your custom ruleset, please read the
[Spectral overrides](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets#overrides) documentation.


## Reference
This section provides reference documentation about the IBM Cloud Validation Rules contained
in the `@ibm-cloud/openapi-ruleset` package.


### ibm-accept-parameter
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-accept-parameter</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operations should not explicitly define the <code>Accept</code> header parameter.
Instead, the value of the <code>Accept</code> parameter is inferred from the <code>responses</code> field.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      parameters:
        - name: Accept
          in: header
          description: The expected content type within the response.
          schema:
            type: string
      responses:
        '200':
          description: 'Success response!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      responses:
        '200':
          description: 'Success response!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'

</pre>
</td>
</tr>
</table>


### ibm-array-attributes
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-array-attributes</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Array schemas must define the <code>items</code> field, and should define the <code>minItems</code> and <code>maxItems</code> fields.
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-types#array">1</a>].</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Array:
      description: An Array instance.
      type: array
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Array:
      description: An Array instance.
      type: array
      minItems: 0
      maxItems: 16
      items:
        type: string
        pattern: '^[a-zA-Z0-9]*$'
        minLength: 0
        maxLength: 50
</pre>
</td>
</tr>
</table>


### ibm-array-of-arrays
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-array-of-arrays</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Array schemas with items of type array should be avoided</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
requestBody:
  content:
    application/json:
      schema:
        type: array
        items:
          type: array
          items:
            type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
requestBody:
  content:
    application/json:
      schema:
        type: array
        items:
          type: string
</pre>
</td>
</tr>
</table>


### ibm-array-responses
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-array-responses</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks to make sure that operations do not define an array as the top-level structure within a response.
The recommendation is to instead use an object with a property that contains the array.
This will allow you to expand the definition of the response body (e.g. add new properties) in a compatible way
in the future if needed.
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      responses:
        '200':
          content:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Thing'

sample response body:
[ {"name": "thing-1"}, {"name": "thing-2"} ]
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      responses:
        '200':
          content:
            schema:
              type: object
              properties:
                things:
                  type: array
                  items:
                    $ref: '#/components/schemas/Thing'

sample response body:
{"things": [ {"name": "thing-1"}, {"name": "thing-2"} ]}
</pre>
</pre>
</td>
</tr>
</table>


### ibm-authorization-parameter
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-authorization-parameter</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operations should not explicitly define the <code>Authorization</code> header parameter.
Instead, the <code>security</code> object should be used to indicate the supported authentication
mechanisms.
The <code>security</code> object can be defined at an operation level (which would apply only to
that operation) or at a global level within the API definition (which would apply to all operations).
<p>Within generated SDKs, the <code>Authorization</code> header will be managed automatically by the
built-in authenticator support.
<p>Non-SDK users (those using <code>curl</code>, for example) can infer
the use of the Authorization header from the <code>security</code> object in the API definition
together with other documentation provided for the service.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      parameters:
        - name: Authorization
          in: header
          description: The IAM access token in the form of a Bearer token.
          schema:
            type: string
            pattern: '^Bearer .*$'
      responses:
        '200':
          description: 'Success response!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
security:
  - IAM: []
components:
  securitySchemes:
    IAM:
      description: Service supports normal IAM-based authentication/authorization.
      in: header
      name: Authorization
      type: apiKey
paths:
  '/v1/things':
    get:
      operationId: list_things
      responses:
        '200':
          description: 'Success response!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'

</pre>
</td>
</tr>
</table>


### ibm-binary-schemas
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-binary-schemas</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks to make sure that binary schemas are used only in proper locations within the API definition.
Specifically, the rule will check to make sure a binary schema is NOT used in the following locations:
<ul>
<li>A schema associated with an operation parameter.</li>
<li>A schema associated with a requestBody with JSON content.</li>
<li>A schema associated with a response with JSON content.</li>
</ul>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/logfile':
    get:
      operationId: download_logfile
      responses:
        '200':
          description: 'Download confirmed!'
          content:
            application/json:
              schema:
                type: string
                format: binary
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/logfile':
    get:
      operationId: download_logfile
      responses:
        '200':
          description: 'Download confirmed!'
          content:
            application/octet-stream:
              schema:
                type: string
                format: binary
</pre>
</td>
</tr>
</table>


### ibm-circular-refs
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-circular-refs</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks to make sure that the API definition doesn't contain circular references.
A circular reference (or cycle) would be a <code>$ref</code> to some sort of object (e.g. a schema) 
where traversing the referenced object's various sub-objects (e.g. schema properties, allOf/anyOf/oneOf lists, 
"additionalProperties", "items", etc.) leads us to a <code>$ref</code> that is a reference to the original referenced object.
One example of a circular reference would be a schema "Foo" that contains a property "foo" that is
an instance of "Foo" itself.  Another example would be a "Foo" schema that contains property
"bar" that is an instance of the "Bar" schema, and "Bar" contains a property "foo" that is an instance of the "Foo" schema.
Any reference to either "Foo" or "Bar" will be a circular reference.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Foo:
      type: object
      properties:
        bar:
          $ref: '#/components/schemas/Bar'
    Bar:
      type: object
      properties:
        foo:
          $ref: '#/components/schemas/Foo'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Foo:
      type: object
      properties:
        bar:
          $ref: '#/components/schemas/Bar'
    Bar:
      type: object
      properties:
        foo_id:               # include only the Foo instance's id,
          type: string        # not the entire Foo instance

</pre>
</td>
</tr>
</table>


### ibm-collection-array-property
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-collection-array-property</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The [API Handbook](https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-collections-overview#response-format)
states that the response to a "list" operation returning a collection must be an object that contains an array property
whose name matches the plural form of the resource type.
For example, the "GET /v1/things" operation should return an object
with an array property named "things" (which is presumably defined as an array of Thing instances).
<p>This rule enforces this requirement by checking each operation that appears to be a
"list"-type operation (with or without support for pagination) to make sure that the operation's
response schema defines an array property whose name matches the last path segment
within the operation's path string, which should also match the plural form of the resource type.
<p>For the purposes of this rule, an operation is considered to be a "list"-type operation
if it is a "get" request and one of the following are also true:
<ol>
<li>the operation's operationId starts with "list" (e.g. "list_things")
<li>the operation's path string does not end with a path parameter reference, but there is a
companion path string that does end with a path parameter reference (e.g. "/v1/things" vs "/v1/things/{thing_id}").
</ol>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
  get:
    operationId: list_things
    responses:
      '200':
        content:
          'application/json':
            schema:
              type: object
              properties:
                abuncha_things:
                  type: array
                  items:
                    $ref: '#/components/schemas/Thing'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
  get:
    operationId: list_things
    responses:
      '200':
        content:
          'application/json':
            schema:
              type: object
              properties:
                things:
                  type: array
                  items:
                    $ref: '#/components/schemas/Thing'
</pre>
</td>
</tr>
</table>


### ibm-consecutive-path-segments
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-consecutive-path-segments</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks each path string in the API to detect the presence of two or more path segments that contain
a parameter reference, which is not allowed.
For example, the path <code>/v1/foos/{foo_id}/{bar_id}</code> is invalid and should probably be <code>/v1/foos/{foo_id}/bars/{bar_id}</code>.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/foos/{foo_id}/{bar_id}':
    parameters:
      - $ref: '#/components/parameters/FooIdParam'
      - $ref: '#/components/parameters/BarIdParam'
  get:
    operationId: get_foobar
    ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/foos/{foo_id}/bars/{bar_id}':
    parameters:
      - $ref: '#/components/parameters/FooIdParam'
      - $ref: '#/components/parameters/BarIdParam'
  get:
    operationId: get_foobar
    ...
</pre>
</td>
</tr>
</table>


### ibm-content-contains-schema
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-content-contains-schema</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Each request body and response <code>content</code> field should contain a schema.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
responses:
  200:
    description: 'Success response!'
    content:
      application/json:
        # schema not provided
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
responses:
  200:
    description: 'Success response!'
    content:
      application/json:
        schema:
          type: string
</pre>
</td>
</tr>
</table>


### ibm-content-exists
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-content-exists</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Each request body and non-204 response should have a <code>content</code> field.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
responses:
  200:
    description: 'Success response!'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
responses:
  200:
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Thing'
</pre>
</td>
</tr>
</table>


### ibm-content-type-is-specific
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-content-type-is-specific</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The use of <code>*/*</code> as a mimetype within a <code>content</code> field should be avoided
unless the API actually supports all content types.
<p>If the API in fact supports all content types, this warning should be ignored.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
requestBody:
  content:
    '*/*':
      ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
requestBody:
  content:
    'application/json':
      ...
    'text/plain':
      ...
</pre>
</td>
</tr>
</table>


### ibm-content-type-parameter
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-content-type-parameter</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operations should not explicitly define the <code>Content-Type</code> header parameter.
Instead, the value of the <code>Content-Type</code> parameter is inferred from the <code>requestBody</code> field.
Note that the <code>Content-Type</code> header parameter is managed automatically by generated SDKs.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      parameters:
        - name: Content-Type
          in: header
          description: The content type of the request body.
          schema:
            type: string
      requestBody:
          description: 'The new Thing instance'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      requestBody:
          description: 'The new Thing instance'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
</pre>
</td>
</tr>
</table>


### ibm-delete-body
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-delete-body</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks each "delete" operation and will return a warning if the operation contains a <code>requestBody</code>.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#/components/parameters/ThingIdParam'
    delete:
      operationId: delete_thing
      requestBody:
          description: 'The Thing instance to be deleted.'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
      responses:
        '204':
          description: 'The thing was deleted'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#/components/parameters/ThingIdParam'
    delete:
      operationId: delete_thing
      responses:
        '204':
          description: 'The thing was deleted'
</pre>
</td>
</tr>
</table>


### ibm-description-mentions-json
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-description-mentions-json</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Schema and schema property descriptions should avoid mentioning <code>JSON</code>.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      description: A JSON object representing a Thing instance.
      type: object
      properties:
        thing_type:
          type: string
        thing_version:
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      description: An object representing a Thing resource.
      type: object
      properties:
        thing_type:
          type: string
        thing_version:
          type: string
</pre>
</td>
</tr>
</table>


### ibm-discriminator-property-exists
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-discriminator-property-exists</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule is used in conjunction with Spectral's <code>oas3-schema</code> rule to verify that a
<code>discriminator</code> object (if present) is defined properly within a schema.
This includes the following validations:
<ol>
<li>The <code>discriminator</code> field must be an object.</li>
<li>The <code>discriminator</code> object must have a field named <code>propertyName</code> that defines the name of the discriminator property.</li>
<li>The <code>propertyName</code> field must be of type string.</li>
<li>The schema property whose name is specified with the <code>propertyName</code> field must exist within the schema.</li>
</ol>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schema:
    Thing:
      description: A Thing instance.
      type: object
      properties:
        thing_id:
          type: string
        thing_version:
          type: string
      discriminator:
        propertyName: thing_type
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schema:
    Thing:
      description: A Thing instance.
      type: object
      properties:
        thing_type:
          type: string
        thing_id:
          type: string
        thing_version:
          type: string
      discriminator:
        propertyName: thing_type
</pre>
</td>
</tr>
</table>


### ibm-duplicate-path-parameter
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-duplicate-path-parameter</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>When defining a path parameter, it's a good practice to define it once in the path object's `parameters` field rather than
defining it separately within each of the operations that exist for that path.
<p>This rule checks for situations in which a path parameter is defined identically within multiple operations under a given path,
and returns a warning to alert the user that the path parameter should be defined on the path object instead.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    get:
      operationId: get_thing
      parameters:
        - name: thing_id
          in: path
          description: The id of the thing instance.
          schema:
            type: string
    delete:
      operationId: delete_thing
      parameters:
        - name: thing_id
          in: path
          description: The id of the thing instance.
          schema:
            type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - name: thing_id
        in: path
        description: The id of the thing instance.
        schema:
          type: string
    get:
      operationId: get_thing
    delete:
      operationId: delete_thing
</pre>
</td>
</tr>
</table>


### ibm-enum-case
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-enum-case</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that <code>enum</code> fields specified for string-type schema properties
contain values that follow a specific case convention, with the default being snake case.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Configuration:</b></td>
<td>This rule can be configured to enforce a specific case convention for enum values.
To configure the rule, set the <code>functionOptions</code> field within the rule definition to be an object
that is the appropriate configuration to be used by Spectral's <code>casing()</code> function
[<a href="https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions#casing">1</a>]
to enforce the desired case convention for enum values.
<p>The default configuration object provided in the rule definition is:
<pre>
{
  type: 'snake'
}
</pre>
<p>To enforce a different case convention for enum values, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration such that the value of the <code>type</code> field 
specifies the desired case convention.
For example, to enforce camel case for enum values, the configuration object would look like this:
<pre>
{
  type: 'camel'
}
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    ThingType:
      type: string
      enum:
        - thingType1
        - thingType2
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    ThingType:
      type: string
      enum:
        - thing_type_1
        - thing_type_2
</pre>
</td>
</tr>
</table>


### ibm-error-content-type-is-json
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-error-content-type-is-json</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>An error response likely returns <code>application/json</code> content and this rule warns when <code>application/json</code> 
is not the content mimetype.
This rule should be ignored when the API actually returns an error response that is not <code>application/json</code>.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
responses:
  400:
    content:
      'application/octet-stream':
        ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
responses:
  400:
    content:
      'application/json':
        ...
</pre>
</td>
</tr>
</table>


### ibm-examples-name-contains-space
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-examples-name-contains-space</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The name of an entry in an <code>examples</code> field should not contain a space.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  /v1/things:
    post:
      operationId: create_thing
      description: Create a new Thing instance.
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Thing'
            examples:
              'Create Thing Example':
                value:
                  thing_id: 1ac38d2z89
                  thing_type: type1
      responses:
        ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  /v1/things:
    post:
      operationId: create_thing
      description: Create a new Thing instance.
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Thing'
            examples:
              CreateThingExample:
                value:
                  thing_id: 1ac38d2z89
                  thing_type: type1
      responses:
        ...
</pre>
</td>
</tr>
</table>


### ibm-if-modified-since-parameter
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-if-modified-since-parameter</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-headers#conditional-headers">API Handbook</a>
recommends against the use of the <code>If-Modified-Since</code> and <code>If-Unmodified-Since</code> header parameters.
Operations should support <code>If-Match</code> and <code>If-None-Match</code> headers instead.
<p>This rule warns about operations that support the <code>If-Modified-Since</code> header parameter.
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#components/parameters/ThingIdParam'
    get:
      operationId: get_thing
      parameters:
        - name: If-Modified-Since
          in: header
          description: |-
            The operation will succeed only if the resource has been last modified 
            after the date specified for this header parameter.
          schema:
            type: string
      responses:
        '200':
          description: 'Resource was retrieved successfully!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
        '412':
          description: 'Resource has not been modified after If-Modified-Since date.'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#components/parameters/ThingIdParam'
    get:
      operationId: get_thing
      parameters:
        - name: If-None-Match
          in: header
          description: |-
            The operation will succeed only if the resource's current ETag value 
            does not match the value specified for this header parameter.
          schema:
            type: string
      responses:
        '200':
          description: 'Resource was retrieved successfully!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
        '412':
          description: 'Resource current ETag matches If-None-Match value.'
</pre>
</td>
</tr>
</table>


### ibm-if-unmodified-since-parameter
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-if-unmodified-since-parameter</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-headers#conditional-headers">API Handbook</a>
recommends against the use of the <code>If-Modified-Since</code> and <code>If-Unmodified-Since</code> header parameters.
Operations should support <code>If-Match</code> and <code>If-None-Match</code> headers instead.
<p>This rule warns about operations that support the <code>If-Unmodified-Since</code> header parameter.
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#components/parameters/ThingIdParam'
    delete:
      operationId: delete_thing
      parameters:
        - name: If-Unmodified-Since
          in: header
          description: |-
            The operation will succeed only if the resource has not been modified 
            after the date specified for this header parameter.
          schema:
            type: string
      responses:
        '204':
          description: 'Resource was deleted successfully!'
        '412':
          description: 'Resource was last modified after the If-Unmodified-Since date.'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#components/parameters/ThingIdParam'
    delete:
      operationId: delete_thing
      parameters:
        - name: If-Match
          in: header
           description: |-
            The operation will succeed only if the resource's current ETag value
            matches the value specified for this header parameter.
          schema:
            type: string
      responses:
        '204':
          description: 'Resource was deleted successfully!'
        '412':
          description: 'Resource current ETag value does not match the If-Match value.'
</pre>
</td>
</tr>
</table>


### ibm-inline-property-schema
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-inline-property-schema</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>If a nested schema (perhaps a schema property, an array <code>items</code> schema,
an <code>additionalProperties</code> schema, etc.) is an object with user-defined properties,
it is a best practice to define the schema as a named schema within the <code>components.schemas</code> section
of the API definition, and then reference it with a schema $ref instead of defining it as an inline object schema.
This is documented in the
[API Handbook](https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-schemas#nested-object-schemas).
<p>The use of a schema $ref is preferred instead of a nested object schema, because the SDK generator will
use the schema $ref when determining the datatype associated with the nested object within the generated SDK code.
If the SDK generator encounters a nested objet schema, it must refactor it by moving it to the <code>components.schemas</code>
section of the API definition and then replacing it with a schema $ref.
However, the names computed by the SDK generator are not optimal (e.g. MyModelProp1),
so the recommendation is to define any nested object schema as a $ref so that the SDK generator's
refactoring (and it's sub-optimal name computation) can be avoided.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        id:
          type: string
        version:
          type: object
          properties:
            major:
              type: string
            minor:
              type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        id:
          type: string
        version:
          $ref: '#/components/schemas/ThingVersion'
    ThingVersion:
      type: object
      properties:
        major:
          type: string
        minor:
          type: string
</pre>
</td>
</tr>
</table>


### ibm-inline-request-schema
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-inline-request-schema</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>If a requestBody schema contains properties (i.e. a user-defined model), it is a best practice to
define the schema as a named schema within the <code>components.schemas</code> section
of the API definition, and then reference it with a schema $ref within the requestBody object.
Following this best practice allows user-defined models to be re-used within the API definition.
<p>In addition to re-usability, there is an added benefit during SDK code generation.
In certain scenarios, the SDK generator will refactor an inline requestBody schema by moving it to
<code>components.schemas</code> and replacing it with a schema $ref.
When doing this refactoring, the SDK generator is likely to compute a name for the new schema that is
not optimal (e.g. CreateThingRequest), so the recommendation is to specify user-defined models
as a named schema in <code>components.schemas</code>, and then reference where needed with a schema $ref 
instead of an inline schema.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  /v1/things:
    post:
      operationId: create_thing
      description: Create a new Thing instance.
      requestBody:
        content:
          application/json:
            schema:
              type: object
              description: A Thing instance.
              properties:
                thing_id:
                  type: string
                thing_style:
                  type: string
              additionalProperties: true
      ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      description: A Thing instance.
      properties:
        thing_id:
          type: string
        thing_style:
          type: string
      additionalProperties: true
paths:
  /v1/things:
    post:
      operationId: create_thing
      description: Create a Thing instance.
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Thing'
      ...
</pre>
</td>
</tr>
</table>


### ibm-inline-response-schema
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-inline-response-schema</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>A response schema should be defined as a reference to a named schema instead of defined as an inline schema.
This is a best practice because the SDK generator will use the schema reference when determining the operation's return type
within the generated SDK code.
<p>The SDK generator will refactor any inline response schemas that it finds by moving them to the <code>components.schemas</code>
section of the API definition and then replacing them with a reference.  However, the names computed by the SDK generator are
not optimal (e.g. GetThingResponse), so the recommendation is for API authors to define the response schema as a $ref.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    get:
      operationId: get_thing
      description: Retrieve a Thing instance by id.
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                description: A Thing instance.
                properties:
                  thing_id:
                    type: string
                  thing_style:
                    type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      description: A Thing instance.
      properties:
        thing_id:
          type: string
        thing_style:
          type: string
paths:
  '/v1/things/{thing_id}':
    get:
      operationId: get_thing
      description: Retrieve a Thing instance by id.
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
</pre>
</td>
</tr>
</table>


### ibm-major-version-in-path
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-major-version-in-path</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Each path defined within the API definition should include a path segment for the API major version,
of the form <code>v&lt;n&gt;</code>, and all paths should have the same API major version segment.
The API major version can appear in either the server URL or in each path entry.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
openapi: 3.0.1
info:
  version: 1.0.0
  ...
paths:
  /things:
    ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
openapi: 3.0.1
info:
  version: 1.0.0
  ...
paths:
  /v1/things:
    ...
</pre>
</td>
</tr>
</table>


### ibm-merge-patch-optional-properties
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-merge-patch-optional-properties</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>In order to adhere to the "merge-patch" semantics, the requestBody schema for a patch operation
with <code>application/merge-patch+json</code> requestBody content should not
define any required properties or specify a non-zero value for the <code>minProperties</code> field.
<p>This rule verifies that "merge-patch" operations adhere to this requirement.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  /v1/things/{thing_id}:
    patch:
      operationId: update_thing
      requestBody:
        content:
          'application/merge-patch+json':
            schema:
              $ref: '#/components/schemas/ThingPatch'
components:
  schemas:
    ThingPatch:
      type: object
      required:
        - name
        - long_description
      properties:
        name:
          description: The name of the Thing
          type: string
        long_description:
          description: The long description of the Thing
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  /v1/things/{thing_id}:
    patch:
      operationId: update_thing
      requestBody:
        content:
          'application/merge-patch+json':
            schema:
              $ref: '#/components/schemas/ThingPatch'
components:
  schemas:
    ThingPatch:          &lt;&lt;&lt; no longer defines any required properties
      type: object
      properties:
        name:
          description: The name of the Thing
          type: string
        long_description:
          description: The long description of the Thing
</pre>
</td>
</tr>
</table>

### ibm-missing-required-property
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-missing-required-property</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that for each property name included in a schema's <code>required</code> list, 
that property must be defined within the schema.
The property could be defined in any of the following ways:
<ol>
<li>within the schema's <code>properties</code> field</li>
<li>within <b>one or more</b> of the schemas listed in the <code>allOf</code> field</li>
<li>within <b>each</b> of the schemas listed in the <code>anyOf</code> or <code>oneOf</code> field</li>
</ol>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
      required:
        - thing_id
        - thing_version
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
        thing_version:
          type: string
      required:
        - thing_id
        - thing_version
</pre>
</td>
</tr>
</table>


### ibm-no-etag-header
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-etag-header</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks each path item (the object containing operations with keys 'get', 'post', 'delete', etc.) to make sure that
the path item's <code>GET</code> operation defines the <code>ETag</code> response header if it is, in fact, needed.
An <code>ETag</code> response header is needed if there are operations within the same
path item that support the <code>If-Match</code> or <code>If-Not-Match</code> header parameters.
<p>The reasoning behind this rule is that if a given path has one or more operations in which the user needs
to provide a value for the <code>If-Match</code> or <code>If-None-Match</code> header parameters
(sometimes referred to as an "etag value"), then the API
must provide a way for the user to obtain the etag value.
And, the standard way for a service to provide an etag value to the user is by returning it as the <code>ETag</code> response header
within the <code>GET</code> operation's response.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - name: thing_id
        description: The id of the Thing.
        in: path
        required: true
        schema:
          type: string
    get:
      operationId: get_thing
      responses:
        '200':
          description: 'Success response!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'
    delete:
      operationId: delete_thing
      parameters:
        - name: 'If-Match'
          description: The etag value associated with the Thing instance to be deleted.
          in: header
          required: true
          schema:
            type: string
      responses:
        '204':
          description: 'Success response!'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - name: thing_id
        description: The id of the Thing.
        in: path
        required: true
        schema:
          type: string
    get:
      operationId: get_thing
      responses:
        '200':
          description: 'Success response!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'
          headers:
            ETag:
              description: The unique etag value associated with the instance that was retrieved.
              schema:
                type: string
    delete:
      operationId: delete_thing
      parameters:
        - name: 'If-Match'
          description: The etag value associated with the Thing instance to be deleted.
          in: header
          required: true
          schema:
            type: string
      responses:
        '204':
          description: 'Success response!'
</pre>
</td>
</tr>
</table>


### ibm-operation-id-case-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-operation-id-case-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operation ids should follow a specific case convention, with the default being snake case.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Configuration:</b></td>
<td>This rule can be configured to enforce a specific case convention for <code>operationId</code> values.
To configure the rule, set the <code>functionOptions</code> field within the rule definition to be an object
that is the appropriate configuration to be used by Spectral's <code>casing()</code> function
[<a href="https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions#casing">1</a>]
to enforce the desired case convention for <code>operationId</code> values.
<p>The default configuration object provided in the rule definition is:
<pre>
{
  type: 'snake'
}
</pre>
<p>To enforce a different case convention for <code>operationId</code> values, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration such that the value of the <code>type</code> field 
specifies the desired case convention.
For example, to enforce camel case for operation ids, the configuration object would look like this:
<pre>
{
  type: 'camel'
}
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: createThing
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
</pre>
</td>
</tr>
</table>


### ibm-operation-id-naming-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-operation-id-naming-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operation ids should follow a naming convention using standard, predictable verbs.
For example, <code>create_thing</code> would be preferred over <code>manufacture_thing</code>
when deciding on an operationId for the <code>POST /v1/things</code> operation.
Likewise, for the <code>GET /v1/things/{thing_id}</code> operation, we might prefer
<code>get_thing</code> over <code>retrieve_thing</code> for the operationId.
<p>This rule will analyze the operations, looking for operationId values that are not using the recommended verbs.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: manufacture_thing
      description: Create a new Thing instance.
      summary: Create a Thing
  '/v1/things/{thing_id}':
    get:
      operationId: retrieve_thing
      description: Get a Thing instance.
      summary: Get a Thing
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      description: Create a new Thing instance.
      summary: Create a Thing
  '/v1/things/{thing_id}':
    get:
      operationId: get_thing
      description: Get a Thing instance.
      summary: Get a Thing
</pre>
</td>
</tr>
</table>


### ibm-operation-summary
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-operation-summary</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that each operation has a non-empty summary.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      description: Create a new Thing instance.
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: create_thing
      description: Create a new Thing instance.
      summary: Create a Thing
</pre>
</td>
</tr>
</table>


### ibm-optional-request-body
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-optional-request-body</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule scrutinizes optional request bodies because in most cases, they should be required.
Specifically, this rule examines the schemas associated with optional request bodies and
if there are required properties, then it is likely that the API author intended for the
request body to be required.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>info</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      requestBody:
        required: false
        content:
          'application/json':
            schema:
              $ref: '#/components/schemas/Thing'    # Assume "Thing" schema has required properties
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      requestBody:
        required: true
        content:
          'application/json':
            schema:
              $ref: '#/components/schemas/Thing'    # Assume "Thing" schema has required properties
</pre>
</td>
</tr>
</table>


### ibm-pagination-style
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-pagination-style</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that list-type operations implement pagination correctly per the guidelines in the 
<a href="https://cloud.ibm.com/docs/api-handbook">API Handbook</a>.
<p>An operation is recognized as a <i>paginated</i> list-type operation if all of the following are true:
<ul>
<li>The path doesn't end in a path segment that is a path parameter reference
(e.g. <code>/v1/things</code> vs <code>/v1/things/{thing_id}</code>).</li>
<li>The operation is a <b>get</b>.</li>
<li>The operation's response schema is an object containing an array property.</li>
<li>The operation defines either the <code>offset</code> query parameter or a page-token type
query parameter whose name is one of the following: <code>start</code>(preferred), 
<code>token</code>, <code>cursor</code>, <code>page</code>, or <code>page_token</code>.</li>
</ul>
<p>If an operation is recognized as a paginated list-type operation, then the following checks are
performed:
<ul>
<li>If the operation has a <code>limit</code> query parameter, then it must be of type <code>integer</code>,
optional, and have default and maximum values defined for it [<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#limit-with-page-token">1</a>,
<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#limit-with-offset">2</a>].
</li>
<li>If the operation has an <code>offset</code> query parameter, then it must be of type <code>integer</code> and
optional [<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#offset">3</a>].
</li>
<li>If the operation has an <code>offset</code> query parameter, then it must also have a <code>limit</code>
query parameter [<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#offset-and-limit-pagination">4</a>].
This is because the presence of the <code>offset</code> parameter indicates that the <i>offset/limit</i> style pagination is being used.
</li>
<li>If the operation has a <i>page-token</i> type query parameter, then it must be of type <code>string</code>
and optional, and its name should be <code>start</code> [<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#token-based-pagination">5</a>].
</li>
<li>If the operation has a <code>limit</code> query parameter, then the response body schema must 
contain a <code>limit</code> schema property that is of type <code>integer</code> and required
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-token">6</a>,
<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-offset">7</a>].
</li>
<li>If the operation has an <code>offset</code> query parameter, then the response body schema must 
contain an <code>offset</code> schema property that is of type <code>integer</code> and required
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-offset">8</a>].
</li>
<li>If the operation's response body schema contains a <code>total_count</code> property, then it must 
be of type <code>integer</code> and required
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-token">9</a>,
<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#additional-response-fields-with-offset">10</a>].
</li>
<li>The operation's response body schema should contain properties named
<code>first</code>, <code>last</code>, <code>previous</code> and <code>next</code> that provide links to the first, last,
previous and next page of results, respectively.
Each of these properties should be defined as an object with a property named <code>href</code>
of type <code>string</code> which contains the appropriate request URL string to be used to obtain
that page of results [<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#pagination-links">11</a>].
</li>
</ul>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
n/a
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
n/a
</td>
</tr>
</table>


### ibm-parameter-case-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-parameter-case-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Parameter names should be snake case</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Configuration:</b></td>
<td>This rule can be configured to enforce specific case conventions for each parameter type.
To configure the rule, set the <code>functionOptions</code> field within the rule definition to be an object
with keys that represent the different parameter types to be checked for proper case conventions
('query', 'path', and 'header').  The value associated with each entry should be an object that is the
appropriate configuration to be used by Spectral's <code>casing()</code> function
[<a href="https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions#casing">1</a>]
to enforce the desired case convention for that parameter type.
<p>The default configuration object provided in the rule definition is:
<pre>
{
  query: {
    type: 'snake',
    separator: {
      char: '.'
    }
  },
  path: {
    type: 'snake'
  },
  header: {
    type: 'pascal',
    separator: {
      char: '-'
    }
  }
}
</pre>
This enforces:
<ul>
<li>Query parameter names to be snake case, while also allowing "." within the name</li>
<li>Path parameter names to be snake case</li>
<li>Header parameter names to be in http header canonical form, which amounts to
<code>pascal</code> casing with a hyphen (<code>"-"</code>) separating the words
(e.g. <code>X-My-Header</code>).
</li>
</ul>
<p>To disable the case convention checks for a particular parameter type, simply remove
the entry for that parameter type from the configuration object.  
<p>If you want to use a different configuration for this rule other than the default configuration
mentioned above, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration appropriately for your needs.
For example, to disable the case convention checks on header parameter names, while enforcing camel case conventions
on query and path parameter names, the configuration object would look like this:
<pre>
{
  query: {
    type: 'camel'
  },
  path: {
    type: 'camel'
  }
}
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sortOrder           &lt;&lt; camel case
      description: The sort order.
      in: query
      required: false
      schema:
        type: string
        enum:
          - asc
          - desc
        default: asc
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sort_order        &lt;&lt; snake case
      description: The sort order.
      in: query
      required: false
      schema:
        type: string
        enum:
          - asc
          - desc
        default: asc
</pre>
</td>
</tr>
</table>


### ibm-parameter-default
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-parameter-default</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Required parameters should not define a default value.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sort_order
      description: The sort order.
      in: query
      required: true
      schema:
        type: string
        enum:
          - asc
          - desc
        default: asc
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sort_order
      description: The sort order.
      in: query
      required: true
      schema:
        type: string
        enum:
          - asc
          - desc
</pre>
</td>
</tr>
</table>


### ibm-parameter-description
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-parameter-description</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Parameters should have a non-empty description.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sort_order
      in: query
      required: false
      schema:
        type: string
        enum:
          - asc
          - desc
        default: asc
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  parameters:
    SortOrderParam:
      name: sort_order
      description: An optional ordering to be performed on the results that are returned.
      in: query
      required: false
      schema:
        type: string
        enum:
          - asc
          - desc
        default: asc
</pre>
</td>
</tr>
</table>


### ibm-parameter-order
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-parameter-order</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>It is a good practice to list the parameters within an operation such that all required parameters are
listed first, then any optional parameters.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      description: List the set of Things.
      summary: List Things
      parameters:
        - name: offset
          required: false
          in: query
          schema:
            type: integer
        - name: limit
          required: false
          in: query
          schema:
            type: integer
        - name: filter
          required: true
          in: query
          schema:
            type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    get:
      operationId: list_things
      description: List the set of Things.
      summary: List Things
      parameters:
        - name: filter
          required: true
          in: query
          schema:
            type: string
        - name: offset
          required: false
          in: query
          schema:
            type: integer
        - name: limit
          required: false
          in: query
          schema:
            type: integer
</pre>
</td>
</tr>
</table>


### ibm-parameter-schema-or-content
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-parameter-schema-or-content</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Each parameter must provide either a <code>schema</code> or <code>content</code> object.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
parameters:
- name: param1
  in: query
  description: query param
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
parameters:
- name: param1
  in: query
  description: query param
  schema:
    type: string
</pre>
</td>
</tr>
</table>


### ibm-patch-request-content-type
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-patch-request-content-type</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-methods#patch">API Handbook</a>
recommends that PATCH operations contain request bodies that support only content types
<code>application/json-patch+json</code> and <code>application/merge-patch+json</code>.
<p>This rule verifies that each PATCH operation complies with this recommendation.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#/components/parameters/ThingIdParam'
    patch:
      operationId: update_thing
      description: Update a Thing instance.
      requestBody:
        content:
          application/json:
            schema:
              - $ref: '#/components/schemas/Thing'
      responses:
        '200':
          description: 'Thing updated successfully!'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#/components/parameters/ThingIdParam'
    patch:
      operationId: update_thing
      description: Update a Thing instance.
      requestBody:
        content:
          application/merge-patch+json:
            schema:
              - $ref: '#/components/schemas/Thing'
      responses:
        '200':
          description: 'Thing updated successfully!'
</pre>
</td>
</tr>
</table>


### ibm-path-param-not-crn
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-path-param-not-crn</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks to make sure that there are no path parameters that are defined as a CRN (Cloud Resource Name) value.
<p>In order to determine whether or not a path parameter is considered to be defined as a CRN value, this validation rule
will perform the following checks:
<ul>
<li>The parameter's <code>name</code> field contains "crn" (e.g. "resource_crn")</li>
<li>The parameter's schema is defined with type=string, format=crn</li>
<li>The parameter's schema is defined with a pattern field that starts with either "crn" or "^crn" (e.g. 'crn:[-0-9A-Fa-f]+')</li>
<li>The parameter's <code>example</code> field contains a CRN-like value (e.g. "crn:0afd-0138-2636")</li>
<li>The parameter's <code>examples</code> field contains an entry containing a CRN-like value, as in this example:
<pre>
</pre>
components:
  parameters:
    ThingIdParam:
      name: thing_id
      description: The id of the Thing instance
      in: path
      required: true
      schema:
        type: string
      examples:
        crn_example:
          value: 'crn:0afd-0138-2636'
</li>
<li>The parameter schema's <code>example</code> field contains a CRN-like value (e.g. "crn:0afd-0138-2636")</li>
<li>The parameter's <code>description</code> field contains either "CRN" or "Cloud Resource Name"</li>
<li>The parameter schema's <code>description</code> field contains either "CRN" or "Cloud Resource Name"</li>
</ul>
These checks are logically OR'd together, so that if any one or more of these checks
are true for a particular parameter, then a warning is raised for that parameter. 
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  parameters:
    ThingCrnParam:
      name: thing_crn
      description: The CRN associated with the Thing instance
      in: path
      required: true
      schema:
        type: string
        format: crn
        pattern: '^crn:[-0-9A-Fa-f]+$'
        minLength: 5
        maxLength: 32
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  parameters:
    ThingIdParam:
      name: thing_id
      description: The id associated with the Thing instance
      in: path
      required: true
      schema:
        type: string
        format: identifier
        pattern: '^id:[-0-9A-Fa-f]+$'
        minLength: 5
        maxLength: 32
</pre>
</td>
</tr>
</table>


### ibm-path-segment-case-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-path-segment-case-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Path segments must follow a specific case convention, with the default being snake case.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Configuration:</b></td>
<td>This rule's default configuration will enforce snake case for path segments, but the rule can be configured
to enforce a different case convention if desired.
<p>To enforce a different case convention for path segments, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration such that the value of the <code>type</code> field 
specifies the desired case convention.
For example, to enforce camel case for path segments, the configuration object would look like this:
<pre>
{
  type: 'camel'
}
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/someThings/{thing_id}':
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/some_things/{thing_id}':
</pre>
</td>
</tr>
</table>


### ibm-precondition-header
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-precondition-header</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operations that return a 412 status code must support at least one of the following header parameters: <code>If-Match</code>, <code>If-None-Match</code>, <code>If-Modified-Since</code>, <code>If-Unmodified-Since</code></td>. For more details, please see the API Handbook on [Conditional Headers](https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-headers#conditional-headers).
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#components/parameters/ThingIdParam'
    get:
      operationId: get_thing
      responses:
        '200':
          description: 'Resource was retrieved successfully!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
        '412':
          description: 'Resource current ETag matches If-None-Match value.'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#components/parameters/ThingIdParam'
    get:
      operationId: get_thing
      parameters:
        - name: If-None-Match
          in: header
          description: |-
            The operation will succeed only if the resource's current ETag value 
            does not match the value specified for this header parameter.
          schema:
            type: string
      responses:
        '200':
          description: 'Resource was retrieved successfully!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
        '412':
          description: 'Resource current ETag matches If-None-Match value.'
</pre>
</td>
</tr>
</table>


### ibm-prohibit-summary-sentence-style
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-prohibit-summary-sentence-style</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>An operation's <code>summary</code> field should not have a trailing period.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  /v1/things
    get:
      operationId: list_things
      summary: List Things.
      description: Retrieve a paginated collection of Thing instances.
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  /v1/things
    get:
      operationId: list_things
      summary: List Things
      description: Retrieve a paginated collection of Thing instances.
</pre>
</td>
</tr>
</table>


### ibm-property-attributes
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-property-attributes</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule performs the following checks on schemas and schema properties:
<dl>
<dt>Numeric schemas (type=integer, type=number):</dt>
<dd>
<ul>
<li><code>minimum</code> must not be greater than <code>maximum</code>.</li>
<li><code>minimum</code> must not be defined for a schema type other than <code>integer</code> or <code>number</code>.</li>
<li><code>maximum</code> must not be defined for a schema type other than <code>integer</code> or <code>number</code>.</li>
</ul>
</dd>
<dt>Object schemas (type=object):</dt>
<dd>
<ul>
<li><code>minProperties</code> must not be greater than <code>maxProperties</code>.</li>
<li><code>minProperties</code> must not be defined for a schema type other than <code>object</code>.</li>
<li><code>maxProperties</code> must not be defined for a schema type other than <code>object</code>.</li>
</ul>
</dd>
</dl>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_size:
          type: integer,
          minimum: 5
          maximum: 4
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_size:
          type: integer,
          minimum: 4
          maximum: 5
</pre>
</td>
</tr>
</table>


### ibm-property-case-collision
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-property-case-collision</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Property names within a schema must be unique, even if they differ by case convention
(e.g. properties <code>thingType</code> and <code>thing_type</code> defined within the same schema would violate this rule).</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
        thing_type:
          type: string
        thingType:
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
        thing_type:
          type: string
</pre>
</td>
</tr>
</table>


### ibm-property-case-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-property-case-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Schema property names should follow a specific case convention, with the default being snake case.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Configuration:</b></td>
<td>This rule can be configured to enforce a specific case convention for schema property names.
To configure the rule, set the <code>functionOptions</code> field within the rule definition to be an object
that is the appropriate configuration to be used by Spectral's <code>casing()</code> function
[<a href="https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions#casing">1</a>]
to enforce the desired case convention for property names.
<p>The default configuration object provided in the rule definition is:
<pre>
{
  type: 'snake'
}
</pre>
<p>To enforce a different case convention for property names, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration such that the value of the <code>type</code> field 
specifies the desired case convention.
For example, to enforce camel case for property names, the configuration object would look like this:
<pre>
{
  type: 'camel'
}
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thingId:
          type: string
        thingType:
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
        thing_type:
          type: string
</pre>
</td>
</tr>
</table>


### ibm-property-description
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-property-description</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Schema properties should have a non-empty description.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
        thing_type:
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          description: The ID associated with the Thing instance.
          type: string
        thing_type:
          description: The type associated with the Thing instance.
          type: string
</pre>
</td>
</tr>
</table>


### ibm-property-inconsistent-name-and-type
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-property-inconsistent-name-and-type</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Avoid using the same property name for properties of different types.
<br><br>
<b>This rule is disabled by default. Enable it in your Spectral config file to utilize this validation.</b>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>off</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        name:
          description: The name of the Thing.
          type: string
    OtherThing:
      type: object
      properties:
        name:
          description: The name of the OtherThing.
          type: integer # The property 'name' should use consistent types throughout the API
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        name:
          description: The name of the Thing.
          type: string
    OtherThing:
      type: object
      properties:
        name:
          description: The name of the OtherThing.
          type: string
</pre>
</td>
</tr>
</table>


### ibm-ref-pattern
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-ref-pattern</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks each <code>$ref</code> value to make sure it follows the correct pattern based on
the type of object it references.  For example, a reference to a schema should follow the pattern 
<code>#/components/schemas/&lt;schema-name&gt;</code>.
<p>Here is the full set of valid patterns for <code>$ref</code> values:
<ul>
<li><code>#/components/callbacks/&lt;name&gt;</code></li>
<li><code>#/components/examples/&lt;name&gt;</code></li>
<li><code>#/components/headers/&lt;name&gt;</code></li>
<li><code>#/components/links/&lt;name&gt;</code></li>
<li><code>#/components/parameters/&lt;name&gt;</code></li>
<li><code>#/components/requestBodies/&lt;name&gt;</code></li>
<li><code>#/components/responses/&lt;name&gt;</code></li>
<li><code>#/components/schemas/&lt;name&gt;</code></li>
<li><code>#/components/securitySchemes/&lt;name&gt;</code></li>
</ul>
The validator uses the <code>$ref</code> property's location within the API definition
to determine the type of object being referenced.  For example, if the
<code>$ref</code> property is found where a parameter object is expected, then the validator assumes
that the <code>$ref</code> is referencing a parameter object, and that the reference should follow
the pattern <code>#/components/parameters/&lt;param-name&gt;</code>.
Incidentally, this rule also has the effect of ensuring that various types of objects are defined in their
proper locations within the API definition's <code>components</code>field. 
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Foo:
      type: object
      properties:
        bar:
          $ref: '#/definitions/Bar'
definitions:
  Bar:
    type: object
    properties:
      bar:
        type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Foo:
      type: object
      properties:
        bar:
          $ref: '#/components/schemas/Bar'
    Bar:
      type: object
      properties:
        bar:
          type: string
</pre>
</td>
</tr>
</table>


### ibm-ref-sibling-duplicate-description
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-ref-sibling-duplicate-description</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks for instances where the "ref sibling" allOf pattern is used to override
the description of a referenced schema, but yet the overridden description is the same as that defined inside
the referenced schema.

Prior to OpenAPI 3.0, when defining a schema one could use a <code>$ref</code> along with additional attributes in order to
reference a named schema and also override those attributes defined within the referenced schema.
A common use of this pattern was to override a referenced schema's description with a more
specific description. Here is an example (a swagger 2.0 fragment):
<pre>
definitions:
  PageLink:
    description: 'A link to a page of results'        &lt;&lt;&lt; general description
    type: object
    properties:
      href:
        description: 'The URL string pointing to a specific page of results'
        type: string
  ResourceCollection:
    description: 'A collection of resources returned by the list_resources operation'
    type: object
    properties:
      first:
        $ref: '#/definitions/PageLink'
        description: 'A link to the first page of results'     &lt;&lt;&lt; more specific description
      next:
        $ref: '#/definitions/PageLink'
        description: 'A link to the next page of results'      &lt;&lt;&lt; more specific description
</pre>
In this example, the "first" and "next" properties are given specific descriptions that indicate they point to
the first and next page of results, respectively.
<p>Starting with OpenAPI 3.0, one can no longer use this pattern.  If a schema definition contains the <code>$ref</code> attribute,
then no other attributes are allowed to be defined alongsize it.   So to work around this restriction, 
API authors typically use the "ref sibling" allOf pattern.   The above example might look like this:
<pre>
components:
  schemas:
    PageLink:
      description: 'A link to a page of results'        &lt;&lt;&lt; general description
      type: object
      properties:
        href:
          description: 'The URL string pointing to a specific page of results'
          type: string
    ResourceCollection:
      description: 'A collection of resources returned by the list_resources operation'
      type: object
      properties:
        first:
          allOf:
            - $ref: '#/components/schemas/PageLink'
            - description: 'A link to the first page of results'     &lt;&lt;&lt; more specific description
        next:
          description: 'A link to the next page of results'      &lt;&lt;&lt; more specific description
          allOf:
            - $ref: '#/components/schemas/PageLink'
</pre>
In this example the "first" property uses an allOf with two list elements, where the second list element schema overrides
the description of the PageLink schema.   The "next" property is defined using a variation of the "ref sibling" allOf pattern
where the overridden description is defined directly as an attribute of the "next" schema itself rather than in the 
second allOf list element.  Both are considered to be examples of the "ref sibling" allOf pattern.

<p>This rule specifically looks for instances of this pattern where the overridden description is the same as the
description defined within the reference schema, thus rending the use of the "ref sibling" pattern unnecessary.
Here is an example of this:
<pre>
components:
  schemas:
    PageLink:
      description: 'A link to a page of results'        &lt;&lt;&lt; general description
      type: object
      properties:
        href:
          description: 'The URL string pointing to a specific page of results'
          type: string
    ResourceCollection:
      description: 'A collection of resources returned by the list_resources operation'
      type: object
      properties:
        page_link:
          allOf:
            - $ref: '#/components/schemas/PageLink'
            - description: 'A link to a page of results'     &lt;&lt;&lt; duplicate description
</pre>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    PageLink:
      description: 'A link to a page of results'
      type: object
      properties:
        href:
          description: 'The URL string pointing to a specific page of results'
          type: string
    ResourceCollection:
      description: 'A collection of resources returned by the list_resources operation'
      type: object
      properties:
        page_link:
          allOf:
            - $ref: '#/components/schemas/PageLink'
            - description: 'A link to a page of results'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    PageLink:
      description: 'A link to a page of results'
      type: object
      properties:
        href:
          description: 'The URL string pointing to a specific page of results'
          type: string
    ResourceCollection:
      description: 'A collection of resources returned by the list_resources operation'
      type: object
      properties:
        page_link:
          $ref: '#/components/schemas/PageLink'
</pre>
</td>
</tr>
</table>


### ibm-request-body-name
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-request-body-name</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The <code>x-codegen-request-body-name</code> extension can be set on an operation to provide a language-agnostic
name for any body parameter that might appear within generated SDK code.
For operations that support multipart-form-based request body content, this isn't necessary since the
names of the form parameters are inferred from the property names within the request body schema.
However, for operations that support other non-form-based request body content (json-based and non-json-based content alike),
it is a good practice to provide the request body name via the extension, especially in situations where there is no other
way to infer a logical name for the operation's body parameter.
<p>This rule analyzes each operation to determine if a request body name is needed, and if so, checks to make sure 
that the <code>x-codegen-request-body-name</code> extension is set on the operation.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/logs':
    post:
      operationId: upload_logfile
      requestBody:
        content:
          'application/octet-stream':
            schema:
              type: string
              format: binary
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/logs':
    post:
      operationId: upload_logfile
      x-code-gen-request-body-name: log_file   &lt;&lt;&lt;
      requestBody:
        content:
          'application/octet-stream':
            schema:
              type: string
              format: binary
</pre>
</td>
</tr>
</table>


### ibm-request-body-object
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-request-body-object</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Each request body should be defined as an object.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
requestBody:
  content:
    application/json:
      schema:
        type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
requestBody:
  content:
    application/json:
      schema:
        type: object
        properties:
          prop1:
            type: string
</pre>
</td>
</tr>
</table>


### ibm-response-error-response-schema
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-response-error-response-schema</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule implements the guidance related to error response schemas found in the <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-errors">API Handbook</a>.
<p>Specifically, the following checks are performed against each schema associated with an error response:
<ul>
<li>The error response schema should form a valid
<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-errors#error-container-model">error container model</a> as
described by the API Handbook.</li>
<li>The <code>errors</code> property must be an array whose <code>items</code> field is a schema that forms a valid
<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-errors#error-model">error model</a>
as described in the API Handbook.</li>
<li>If present, the <code>target</code> property must contain a valid
<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-errors#error-target-model">error target model</a>
as described in the API Handbook.</li>
</ul>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Thing'
    responses:
      '201':
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Thing'
      '400':
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ErrorContainer'
components:
  schemas:
    ErrorContainer: {
      description: 'An error response for an operation.',
      type: 'object',
      properties: {
        error: {
          $ref: '#/components/schemas/Error'
        },
        trace: {
          description: 'The error trace information.',
          type: 'string',
          format: 'uuid'
        }
      }
    },
    Error: {
      description: 'An error response entry.',
      type: 'object',
      properties: {
        code: {
          description: 'The error code.',
          type: 'integer'
        },
        message: {
          description: 'The error message.',
          type: 'string'
        },
        more_info: {
          description: 'Additional info about the error.',
          type: 'string'
        },
      }
    }
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Thing'
    responses:
      '201':
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Thing'
      '400':
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ErrorContainer'
components:
  schemas:
    ErrorContainer: {
      description: 'An error response for an operation.',
      type: 'object',
      properties: {
        errors: {
          type: 'array',
          minItems: 0,
          maxItems: 100,
          description: 'The array of error entries associated with the error response',
          items: {
            $ref: '#/components/schemas/Error'
          }
        },
        trace: {
          description: 'The error trace information.',
          type: 'string',
          format: 'uuid'
        }
      }
    },
    Error: {
      description: 'An error response entry.',
      type: 'object',
      properties: {
        code: {
          description: 'The error code.',
          type: 'string',
          enum: ['bad_request', 'not_authorized', 'no_need_to_know']
        },
        message: {
          description: 'The error message.',
          type: 'string'
        },
        more_info: {
          description: 'Additional info about the error.',
          type: 'string'
        },
      }
    }
</pre>
</td>
</tr>
</table>


### ibm-response-example-provided
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-response-example-provided</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Response examples should be provided in the schema object - or as a sibling to the schema object -
within each response <code>content</code> field entry, in order to aid in the generation of API reference documentation.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
responses:
  200:
    content:
      application/json:
        schema:
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
The example may be provided in the schema object.
<pre>
responses:
  200:
    content:
      application/json:
        schema:
          type: string
          example: 'example string'
</pre>
<p>Alternatively, the example may be provided as a sibling to the schema object.
<pre>
responses:
  200:
    content:
      application/json:
        schema:
          type: string
        example: 'example string'
<pre>
</td>
</tr>
</table>


### ibm-response-status-codes
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-response-status-codes</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule performs a few different checks on the status codes used in operation responses:
<ul>
<li>The use of the <code>422 - Unprocessable Entity</code> status code is discouraged. Use <code>400 - Bad Request</code> instead.</li>
<li>The use of the <code>302 - Found</code> status code is discouraged. Use <code>303 - See Other</code> or 
<code>307 - Temporary Redirect</code> instead.</li>
<li>The <code>101 - Switching Protocols</code> status code should not be used if any success status codes (2xx) are also present.</li>
<li>Each operation should include at least one success status code (2xx).  An exception to this is when the 
<code>101 - Switching Protocols</code> status code is used, which should be extremely rare (it's normally used with websockets).</li>
<li>A <code>204 - No Content</code> response should not include content.</li>
<li>A non-204 success status code (e.g. <code>200 - OK</code>, <code>201 - Created</code>, etc.) should include content.</li>
<li>A "create"-type operation must return either a <code>201 - Created</code>
or a <code>202 - Accepted</code> status code.
<p>Note that for the purposes of this rule, an operation is considered to be a "create"-type operation if the
operationId starts with "create" or the operation is a POST request and there is another path
present in the API that is similar to the path of the "create" operation, but with a trailing path parameter reference.
For example, "process_things" would be considered a "create"-type operation:
<pre>
  paths:
    '/v1/things':
      post:
        operationId: process_things
        ...
    '/v1/things/{thing_id}':
      get:
        operationId: get_thing
</pre>
but "handle_things" would not:
<pre>
  paths:
    '/v1/things':
      post:
        operationId: handle_things
        ...
</pre>
The difference being that with the "handle_things" operation, there is no corresponding path
with a trailing path parameter reference that would give us a hint that "handle_things" is a create-type operation.
</li>
<li>An operation that returns a <code>202 - Accepted</code> status code should not return any other
success (2xx) status codes. This is because an operation should be unambiguous in terms of whether or not
it is a synchronous or asynchronous operation.
</ul>
<p>References: 
<ul>
<li><a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-status-codes">IBM Cloud API Handbook: Fundamentals/Status Codes</a></li>
<li><a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-methods#post">IBM Cloud API Handbook: Fundamentals/Methods/POST</a></li>
<li><a href="https://datatracker.ietf.org/doc/html/rfc7231#section-6">RFC7231 - Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content</a></li>
</ul>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      description: 'Create a Thing instance.'
      responses:
        '204':
          description: 'should not have content'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
        '101':
          description: 'invalid use of status code 101'
        '422':
          description: 'should use status code 400 instead'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      description: 'Create a Thing instance.'
      responses:
        '201':
          description: 'Successfully created a new Thing instance.'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
        '400':
          description: 'Thing instance was invalid'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
</pre>
</td>
</tr>
</table>


### ibm-schema-description
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-schema-description</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Schemas should have a non-empty description.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      description: >-
        A Thing instance is used as a way to demonstrate how various
        validation rules may be applied to an API definition.
      type: object
      properties:
        ...
</pre>
</td>
</tr>
</table>


### ibm-schema-type
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-schema-type</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>
Schemas should have a non-empty <code>type</code> field.
<br><br>
<b>This rule is disabled by default. Enable it in your Spectral config file to utilize this validation.</b>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>off</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      description: An underspecified schema
        ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: string
      description: An string schema
        ...
</pre>
</td>
</tr>
</table>


### ibm-sdk-operations
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-sdk-operations</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule validates the structure of values specified for the <code>x-sdk-operations</code>
extension, using <a href="/packages/ruleset/src/schemas/x-sdk-operations.json">this JSON Schema document</a>.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
n/a
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
n/a
</td>
</tr>
</table>


### ibm-security-scheme-attributes
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-security-scheme-attributes</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Performs a series of validations on the content within security schemes to ensure they comply
with the constraints outlined in the <a href="https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.2.md#security-scheme-object">OpenAPI Specification</a>.
<p>Specifically, the rule will perform these checks:
<ol>
<li>Each security scheme must specify the <code>type</code> property. Valid values for the <code>type</code> property are:
<ul>
<li><code>apiKey</code></li>
<li><code>http</code></li>
<li><code>oauth2</code></li>
<li><code>openIdConnect</code></li>
</ul>
</li>
<li>A security scheme with type <code>apiKey</code> must specify the <code>name</code> and <code>in</code> properties.
Valid values for the <code>in</code> property are:
<ul>
<li><code>cookie</code></li>
<li><code>header</code></li>
<li><code>query</code></li>
</ul>
</li>
<li>A security scheme with type <code>http</code> must specify the <code>scheme</code> property.
</li>
<li>A security scheme with type <code>oauth2</code> must specify the <code>flows</code> property.
<p>Furthermore, the <code>flows</code> property must be an object that defines at least one of the following keys:
<ul>
<li><code>implicit</code></li>
<li><code>authorizationcode</code></li>
<li><code>clientCredentials</code></li>
<li><code>password</code></li>
</ul>
</p>
<p>An <code>implicit</code> oauth2 flow must specify the <code>scopes</code> and <code>authorizationUrl</code> properties.</p>
<p>A <code>password</code> or <code>clientCredentials</code> oauth2 flow must specify the <code>scopes</code> and <code>tokenUrl</code> properties.</p>
<p>An <code>authorizationCode</code> oauth2 flow must specify the <code>scopes</code>, <code>authorizationUrl</code>, and <code>tokenUrl</code> properties.</p>
</li>
<li>A security scheme with type <code>openIdConnect</code> must specify the <code>openIdConnectUrl</code> property.
</li>
</ol>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  securitySchemes:
    BasicAuthScheme:
      type: http
    IAMAuthScheme:
      type: apiKey
    OAuth2Scheme:
      type: oauth2
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  securitySchemes:
    BasicAuthScheme:
      type: http
      description: Basic authentication via the Authorization header
      scheme: Basic
      bearerFormat: bearer
    IAMAuthScheme:
      type: apiKey,
      description: An IAM access token provided via the Authorization header
      in: header
      name: Authorization
    OAuth2Scheme:
      type: oauth2
      description: Supported oauth2 authorizaton flows
      flows:
        implicit:
          authorizationUrl: https://myoauthserver.com/auth
          scopes:
            writer: User can create resources
        authorizationCode:
          authorizationUrl: https://myoauthserver.com/auth
          tokenUrl: https://myoauthserver.com/token
          scopes:
            reader: User can retrieve resources
</pre>
</td>
</tr>
</table>


### ibm-security-schemes
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-security-schemes</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Verifies the security schemes and security requirement objects.
<p>Specifically, the rule will perform these checks:
<ol>
<li>The name used within a security requirement object must correspond to a
security scheme that is properly defined in "components.securitySchemes".
</li>
<li>Each security scheme defined in "components.securitySchemes" should be referenced
by at least one security requirement object.
</li>
<li>Each scope referenced within a security requirement object for an oauth2-type security scheme
must be defined within that security scheme.
</li>
<li>Each scope that is defined within an oath2-type security scheme should be
referenced by at least one security requirement object.
</li>
<li>If a security requirement object is associated with a security scheme that does not support
scopes, then its scopes array MUST be empty.
</li>
</ol>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      security:
        - IAM: []   # refers to undefined security scheme "IAM"
components:
  securitySchemes:
    Basic:
      type: http
      scheme: basic
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
      security:
        - IAM: []
components:
  securitySchemes:
    IAM:
      in: header
      name: Authorization
      type: apiKey
</pre>
</td>
</tr>
</table>


### ibm-server-variable-default-value
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-server-variable-default-value</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Server variables should have a default value.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
servers:
- url: https://{region}.myservice.cloud.ibm.com
  description: The region-based endpoints available for My Service.
  variables:
    region:
      description: >-
        The name of the region, which should be one of:
          "global", "us-south", "us-east", "us-west", "us-north"
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
servers:
- url: https://{region}.myservice.cloud.ibm.com
  description: The region-based endpoints available for My Service.
  variables:
    region:
      default: global
      description: >-
        The name of the region, which should be one of:
          "global", "us-south", "us-east", "us-west", "us-north"
</pre>
</td>
</tr>
</table>


### ibm-string-attributes
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-string-attributes</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks to make sure that string schema properties define the <code>pattern</code>, <code>minLength</code> and <code>maxLength</code>
fields in order to clearly define the set of valid values for the property.
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-types#string">1</a>].
<p>Note that these checks are bypassed for the following scenarios:
<ul>
<li>All checks are bypassed for string schemas that are used only within an operation response.
<li>All checks are bypassed for string schemas that contain an <code>enum</code> field.</li>
<li>The check for the <code>pattern</code> field is bypassed if <code>format</code> is set to 
<code>binary</code>, <code>byte</code>, <code>date</code>, <code>date-time</code>, or <code>url</code>.</li>
<li>The check for the <code>minLength</code> field is bypassed if <code>format</code> is set to
<code>date</code>, <code>identifier</code>, or <code>url</code>.</li>
<li>The check for the <code>maxLength</code> field is bypassed if <code>format</code> is set to <code>date</code>.</li>
</ul>
<p>This rule also checks non-string schema properties to make sure they do not define the
code>pattern</code>, <code>minLength</code> and <code>maxLength</code> fields since these fields are applicable
only for string schemas.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      description: A Thing instance.
      type: object
      properties:
        thing_id:
          description: The unique identifier of the Thing instance.
          type: string
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      description: A Thing instance.
      type: object
      properties:
        thing_id:
          description: The unique identifier of the Thing instance.
          type: string
          pattern: '^[a-zA-Z0-9]*$'
          minLength: 8
          maxLength: 64
          example: 'ab38dd26z'
</pre>
</td>
</tr>
</table>


### ibm-unused-tag
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-unused-tag</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that each tag (defined in the <code>tags</code> field) is referenced by one or more operations.</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warn</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
tags:
  - name: Things
    description: Operations related to Things.
  - name: UnusedTag
    description: This tag is not used.

paths:
  '/v1/things':
    post:
      operationId: create_thing
      description: Create a new Thing instance.
      summary: Create a Thing
      tags:
        - Things
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
tags:
  - name: Things
    description: Operations related to Things.

paths:
  '/v1/things':
    post:
      operationId: create_thing
      description: Create a new Thing instance.
      summary: Create a Thing
      tags:
        - Things
</pre>
</td>
</tr>
</table>


### ibm-valid-path-segments
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-valid-path-segments</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule validates the path segments within each path string found in the API.
Specifically, the rule makes sure that any path segment containing a path parameter reference contains
only that parameter reference and nothing more.
For example, the path <code>/v1/foos/_{foo_id}_</code> is invalid and should probably be <code>/v1/foos/{foo_id}</code>.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/foos/_{foo_id}_':
    parameters:
      - $ref: '#/components/parameters/FooIdParam'
  get:
    operationId: get_foo
    ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/foos/{foo_id}':
    parameters:
      - $ref: '#/components/parameters/FooIdParam'
  get:
    operationId: get_foo
    ...
</pre>
</td>
</tr>
</table>


### ibm-valid-type-format
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-valid-type-format</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Schemas and schema properties must use a valid combination of the <code>type</code> and <code>format</code> fields
[<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-types">1</a>].
The following table defines the valid combinations:
<table>
<tr><th>Type</th><th>Formats</th></tr>
<tr>
<td valign=top>string</td>
<td>
<ul>
<li>binary</li>
<li>byte</li>
<li>crn</li>
<li>date</li>
<li>date-time</li>
<li>email</li>
<li>identifier</li>
<li>password</li>
<li>url</li>
<li>uuid</li>
</ul>
</td>
</tr>
<tr><td>boolean</td><td></td></tr>
<tr><td valign=top>integer</td><td><ul><li>int32</li><li>int64</li></ul></td></tr>
<tr><td valign=top>number</td><td><ul><li>float</li><li>double</li></ul></td></tr>
<tr><td>object</td><td></td></tr>
<tr><td>array</td><td></td></tr>
</table>
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: bad_object
      properties:
        thing_url:
          type: url
        thing_crn:
          type: crn
        thing_cost:
          type: float
        thing_contents:
          type: byte-array
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_url:
          type: string
          format: url
        thing_crn:
          type: string
          format: crn
        thing_cost:
          type: number
          format: float
        thing_contents:
          type: string
          format: byte
</pre>
</td>
</tr>
</table>
