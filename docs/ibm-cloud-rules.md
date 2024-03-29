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
  * [ibm-api-symmetry](#ibm-api-symmetry)
  * [ibm-array-attributes](#ibm-array-attributes)
  * [ibm-avoid-inline-schemas](#ibm-avoid-inline-schemas)
  * [ibm-avoid-multiple-types](#ibm-avoid-multiple-types)
  * [ibm-avoid-property-name-collision](#ibm-avoid-property-name-collision)
  * [ibm-avoid-repeating-path-parameters](#ibm-avoid-repeating-path-parameters)
  * [ibm-binary-schemas](#ibm-binary-schemas)
  * [ibm-collection-array-property](#ibm-collection-array-property)
  * [ibm-content-contains-schema](#ibm-content-contains-schema)
  * [ibm-content-type-is-specific](#ibm-content-type-is-specific)
  * [ibm-define-required-properties](#ibm-define-required-properties)
  * [ibm-discriminator-property](#ibm-discriminator-property)
  * [ibm-dont-require-merge-patch-properties](#ibm-dont-require-merge-patch-properties)
  * [ibm-enum-casing-convention](#ibm-enum-casing-convention)
  * [ibm-error-content-type-is-json](#ibm-error-content-type-is-json)
  * [ibm-error-response-schemas](#ibm-error-response-schemas)
  * [ibm-etag-header](#ibm-etag-header)
  * [ibm-major-version-in-path](#ibm-major-version-in-path)
  * [ibm-no-accept-header](#ibm-no-accept-header)
  * [ibm-no-ambiguous-paths](#ibm-no-ambiguous-paths)
  * [ibm-no-array-of-arrays](#ibm-no-array-of-arrays)
  * [ibm-no-array-responses](#ibm-no-array-responses)
  * [ibm-no-authorization-header](#ibm-no-authorization-header)
  * [ibm-no-body-for-delete](#ibm-no-body-for-delete)
  * [ibm-no-circular-refs](#ibm-no-circular-refs)
  * [ibm-no-consecutive-path-parameter-segments](#ibm-no-consecutive-path-parameter-segments)
  * [ibm-no-content-type-header](#ibm-no-content-type-header)
  * [ibm-no-crn-path-parameters](#ibm-no-crn-path-parameters)
  * [ibm-no-default-for-required-parameter](#ibm-no-default-for-required-parameter)
  * [ibm-no-duplicate-description-with-ref-sibling](#ibm-no-duplicate-description-with-ref-sibling)
  * [ibm-no-if-modified-since-header](#ibm-no-if-modified-since-header)
  * [ibm-no-if-unmodified-since-header](#ibm-no-if-unmodified-since-header)
  * [ibm-no-nullable-properties](#ibm-no-nullable-properties)
  * [ibm-no-operation-requestbody](#ibm-no-operation-requestbody)
  * [ibm-no-optional-properties-in-required-body](#ibm-no-optional-properties-in-required-body)
  * [ibm-no-space-in-example-name](#ibm-no-space-in-example-name)
  * [ibm-no-unsupported-keywords](#ibm-no-unsupported-keywords)
  * [ibm-openapi-tags-used](#ibm-openapi-tags-used)
  * [ibm-operation-responses](#ibm-operation-responses)
  * [ibm-operation-summary](#ibm-operation-summary)
  * [ibm-operationid-casing-convention](#ibm-operationid-casing-convention)
  * [ibm-operationid-naming-convention](#ibm-operationid-naming-convention)
  * [ibm-pagination-style](#ibm-pagination-style)
  * [ibm-parameter-casing-convention](#ibm-parameter-casing-convention)
  * [ibm-parameter-description](#ibm-parameter-description)
  * [ibm-parameter-order](#ibm-parameter-order)
  * [ibm-parameter-schema-or-content](#ibm-parameter-schema-or-content)
  * [ibm-patch-request-content-type](#ibm-patch-request-content-type)
  * [ibm-path-segment-casing-convention](#ibm-path-segment-casing-convention)
  * [ibm-pattern-properties](#ibm-pattern-properties)
  * [ibm-precondition-headers](#ibm-precondition-headers)
  * [ibm-prefer-token-pagination](#ibm-prefer-token-pagination)
  * [ibm-property-attributes](#ibm-property-attributes)
  * [ibm-property-casing-convention](#ibm-property-casing-convention)
  * [ibm-property-consistent-name-and-type](#ibm-property-consistent-name-and-type)
  * [ibm-property-description](#ibm-property-description)
  * [ibm-ref-pattern](#ibm-ref-pattern)
  * [ibm-request-and-response-content](#ibm-request-and-response-content)
  * [ibm-requestbody-is-object](#ibm-requestbody-is-object)
  * [ibm-requestbody-name](#ibm-requestbody-name)
  * [ibm-resource-response-consistency](#ibm-resource-response-consistency)
  * [ibm-response-status-codes](#ibm-response-status-codes)
  * [ibm-schema-casing-convention](#ibm-schema-casing-convention)
  * [ibm-schema-description](#ibm-schema-description)
  * [ibm-schema-keywords](#ibm-schema-keywords)
  * [ibm-schema-naming-convention](#ibm-schema-naming-convention)
  * [ibm-schema-type](#ibm-schema-type)
  * [ibm-schema-type-format](#ibm-schema-type-format)
  * [ibm-sdk-operations](#ibm-sdk-operations)
  * [ibm-securityscheme-attributes](#ibm-securityscheme-attributes)
  * [ibm-securityschemes](#ibm-securityschemes)
  * [ibm-server-variable-default-value](#ibm-server-variable-default-value)
  * [ibm-string-attributes](#ibm-string-attributes)
  * [ibm-success-response-example](#ibm-success-response-example)
  * [ibm-summary-sentence-style](#ibm-summary-sentence-style)
  * [ibm-unevaluated-properties](#ibm-unevaluated-properties)
  * [ibm-unique-parameter-request-property-names](#ibm-unique-parameter-request-property-names)
  * [ibm-valid-path-segments](#ibm-valid-path-segments)
  * [ibm-well-defined-dictionaries](#ibm-well-defined-dictionaries)

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
</tr>
<tr>
<td><a href="#ibm-api-symmetry">ibm-api-symmetry</a></td>
<td>warn</td>
<td>Schemas should follow the API Handbook guidance on symmetrical structure between requests and responses.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-array-attributes">ibm-array-attributes</a></td>
<td>warn</td>
<td>Array schemas must define the <code>items</code> field, and should define the <code>minItems</code> and <code>maxItems</code> fields.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-avoid-inline-schemas">ibm-avoid-inline-schemas</a></td>
<td>warn</td>
<td>Inline object schemas should be avoided within requestBody schemas, response schemas, and schema properties.
Instead, use a ref to a named schema.
</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-avoid-multiple-types">ibm-avoid-multiple-types</a></td>
<td>warn</td>
<td>Multiple types within a schema's <code>type</code> field should be avoided because it creates ambiguity.
</td>
<td>oas3_1</td>
</tr>
<tr>
<td><a href="#ibm-avoid-property-name-collision">ibm-avoid-property-name-collision</a></td>
<td>error</td>
<td>Avoid duplicate property names within a schema, even if they differ by case convention.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-avoid-repeating-path-parameters">ibm-avoid-repeating-path-parameters</a></td>
<td>warn</td>
<td>Common path parameters should be defined on the path object instead of on each operation.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-binary-schemas">ibm-binary-schemas</a></td>
<td>warn</td>
<td>Makes sure that binary schemas are used only in proper locations within the API definition</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-collection-array-property">ibm-collection-array-property</a></td>
<td>warn</td>
<td>Makes sure that each "list"-type operation's response schema defines an array property whose name matches the last path segment
within the operation's path string, which should also match the plural form of the resource type.
</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-content-contains-schema">ibm-content-contains-schema</a></td>
<td>warn</td>
<td>Content entries must specify a schema.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-content-type-is-specific">ibm-content-type-is-specific</a></td>
<td>warn</td>
<td><code>*/*</code> should only be used when all content types are supported.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-define-required-properties">ibm-define-required-properties</a></td>
<td>error</td>
<td>If a schema's <code>required</code> field contains the name of a property, then that
property should defined within the schema.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-discriminator-property">ibm-discriminator-property</a></td>
<td>error</td>
<td>The discriminator property must be defined in the schema.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-dont-require-merge-patch-properties">ibm-dont-require-merge-patch-properties</a></td>
<td>warn</td>
<td>JSON merge-patch requestBody schemas should have no required properties.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-enum-casing-convention">ibm-enum-casing-convention</a></td>
<td>error</td>
<td>Enum values should follow a specific case convention.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-error-content-type-is-json">ibm-error-content-type-is-json</a></td>
<td>warn</td>
<td>Error responses should support <code>application/json</code>.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-error-response-schemas">ibm-error-response-schemas</a></td>
<td>warn</td>
<td>Error response schemas should comply with API Handbook guidance.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-etag-header">ibm-etag-header</a></td>
<td>error</td>
<td>Verifies that the <code>ETag</code> response header is defined in the <code>GET</code> operation
for any resources (paths) that support the <code>If-Match</code> and/or <code>If-None-Match</code> header parameters.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-major-version-in-path">ibm-major-version-in-path</a></td>
<td>warn</td>
<td>All paths must contain the API major version as a distinct path segment.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-accept-header">ibm-no-accept-header</a></td>
<td>warn</td>
<td>Operations should not explicitly define the <code>Accept</code> header parameter.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-ambiguous-paths">ibm-no-ambiguous-paths</a></td>
<td>warn</td>
<td>Checks for the presence of ambiguous path strings.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-array-of-arrays">ibm-no-array-of-arrays</a></td>
<td>warn</td>
<td>Array schemas with <code>items</code> of type array should be avoided.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-array-responses">ibm-no-array-responses</a></td>
<td>error</td>
<td>Operations should avoid defining an array as the top-level structure of a response.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-authorization-header">ibm-no-authorization-header</a></td>
<td>warn</td>
<td>Operations should not explicitly define the <code>Authorization</code> header parameter.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-body-for-delete">ibm-no-body-for-delete</a></td>
<td>warn</td>
<td>[Deprecated] DELETE operations should not contain a requestBody.  This rule has been deprecated; please use
the <code>ibm-no-operation-requestbody</code> rule instead.
</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-circular-refs">ibm-no-circular-refs</a></td>
<td>warn</td>
<td>Makes sure that the API definition doesn't contain any circular references.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-consecutive-path-parameter-segments">ibm-no-consecutive-path-parameter-segments</a></td>
<td>error</td>
<td>Checks each path string in the API definition to detect the presence of two or more consecutive
path segments that contain a path parameter reference (e.g. <code>/v1/foos/{foo_id}/{bar_id}</code>), 
which is not allowed.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-content-type-header">ibm-no-content-type-header</a></td>
<td>warn</td>
<td>Operations should not explicitly define the <code>Content-Type</code> header parameter.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-crn-path-parameters">ibm-no-crn-path-parameters</a></td>
<td>warn</td>
<td>Verifies that path parameters are not defined as CRN (Cloud Resource Name) values.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-default-for-required-parameter">ibm-no-default-for-required-parameter</a></td>
<td>warn</td>
<td>Required parameters should not define a default value.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-duplicate-description-with-ref-sibling">ibm-no-duplicate-description-with-ref-sibling</a></td>
<td>warn</td>
<td>Ensures that the "ref-sibling" <code>allOf</code> pattern is not used unnecessarily to define a duplicate description.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-if-modified-since-header">ibm-no-if-modified-since-header</a></td>
<td>warn</td>
<td>Operations should avoid supporting the <code>If-Modified-Since</code> header parameter.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-if-unmodified-since-header">ibm-no-if-unmodified-since-header</a></td>
<td>warn</td>
<td>Operations should avoid supporting the <code>If-Unmodified-Since</code> header parameter.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-nullable-properties">ibm-no-nullable-properties</a></td>
<td>warn</td>
<td>Ensures that nullable properties are defined only within JSON merge-patch requestBody schemas, per API Handbook guidance.
</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-operation-requestbody">ibm-no-operation-requestbody</a></td>
<td>warn</td>
<td>Ensures that DELETE, GET, HEAD, and OPTIONS operations do not define a <code>requestBody</code>.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-optional-properties-in-required-body">ibm-no-optional-properties-in-required-body</a></td>
<td>info</td>
<td>If a requestBody schema contains properties that are defined as required, then the requestBody itself
should probably be required instead of optional.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-space-in-example-name">ibm-no-space-in-example-name</a></td>
<td>warn</td>
<td>The name of an entry in an <code>examples</code> field should not contain a space.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-no-unsupported-keywords">ibm-no-unsupported-keywords</a></td>
<td>error</td>
<td>Checks for the use of unsupported keywords within an OpenAPI 3.1.x document.</td>
<td>oas3_1</td>
</tr>
<tr>
<td><a href="#ibm-openapi-tags-used">ibm-openapi-tags-used</a></td>
<td>warn</td>
<td>Verifies that each defined tag is referenced by at least one operation.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-operation-summary">ibm-operation-summary</a></td>
<td>warn</td>
<td>Each operation should have a non-empty <code>summary</code>.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-operation-responses">ibm-operation-responses</a></td>
<td>error</td>
<td>Verifies that each operation has a <code>responses</code> field.</td>
<td>oas3_1</td>
</tr>
<tr>
<td><a href="#ibm-operationid-casing-convention">ibm-operationid-casing-convention</a></td>
<td>warn</td>
<td>Operation ids should follow a specific case convention.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-operationid-naming-convention">ibm-operationid-naming-convention</a></td>
<td>warn</td>
<td>Operation ids should follow a naming convention.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-pagination-style">ibm-pagination-style</a></td>
<td>warn</td>
<td>Paginated list operations should comply with the API Handbook's pagination guidance.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-parameter-casing-convention">ibm-parameter-casing-convention</a></td>
<td>error</td>
<td>Parameter names should follow a specific case convention.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-parameter-description">ibm-parameter-description</a></td>
<td>warn</td>
<td>Parameters should have a non-empty description.</td>
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
<td>Parameters must provide either a schema or content.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-patch-request-content-type">ibm-patch-request-content-type</a></td>
<td>error</td>
<td>Verifies that PATCH operations support only requestBody content types <code>application/json-patch+json</code>
or <code>application/merge-patch+json</code>.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-path-segment-casing-convention">ibm-path-segment-casing-convention</a></td>
<td>error</td>
<td>Path segments must follow a specific case convention.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-pattern-properties">ibm-pattern-properties</a></td>
<td>error</td>
<td>Enforces certain restrictions on the use of <code>patternProperties</code> within a schema.</td>
<td>oas3_1</td>
</tr>
<tr>
<td><a href="#ibm-precondition-headers">ibm-precondition-headers</a></td>
<td>error</td>
<td>Operations that return a 412 status code must support at least one of the following header parameters: <code>If-Match</code>, <code>If-None-Match</code>, <code>If-Modified-Since</code>, <code>If-Unmodified-Since</code></td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-prefer-token-pagination">ibm-prefer-token-pagination</a></td>
<td>warn</td>
<td>Paginated list operations should use token-based pagination, rather than offset/limit pagination</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-property-attributes">ibm-property-attributes</a></td>
<td>error</td>
<td>Performs a series of checks on the attributes defined for various schema types.</td>
<td>oas3</td>
</tr>
<tr>
<tr>
<td><a href="#ibm-property-casing-convention">ibm-property-casing-convention</a></td>
<td>error</td>
<td>Schema property names should follow a specific case convention.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-property-consistent-name-and-type">ibm-property-consistent-name-and-type</a></td>
<td>off</td>
<td>Schema properties that share the same name should also share the same type. <b>This rule is disabled by default</b>.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-property-description">ibm-property-description</a></td>
<td>warn</td>
<td>Schema properties should have a non-empty description.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-ref-pattern">ibm-ref-pattern</a></td>
<td>warn</td>
<td>Ensures that <code>$ref</code> values follow the correct patterns.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-request-and-response-content">ibm-request-and-response-content</a></td>
<td>warn</td>
<td>Request bodies and non-204 responses should define a content field.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-requestbody-is-object">ibm-requestbody-is-object</a></td>
<td>warn</td>
<td>A non-form request body should be defined as an object.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-requestbody-name">ibm-requestbody-name</a></td>
<td>warn</td>
<td>An operation should specify a request body name (with the <code>x-codegen-request-body-name</code> extension) if its requestBody
has non-form content.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-resource-response-consistency">ibm-resource-response-consistency</a></td>
<td>warn</td>
<td>Operations that create or update a resource should return the same schema as the "GET" request for the resource.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-response-status-codes">ibm-response-status-codes</a></td>
<td>warn</td>
<td>Performs multiple checks on the status codes used in operation responses.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-schema-casing-convention">ibm-schema-casing-convention</a></td>
<td>warm</td>
<td>Schema names should follow a specific case convention.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-schema-description">ibm-schema-description</a></td>
<td>warn</td>
<td>Schemas should have a non-empty description.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-schema-keywords">ibm-schema-keywords</a></td>
<td>error</td>
<td>Verifies that schemas and schema properties in an OpenAPI 3.1 document are defined using only
specific "allow-listed" keywords.</td>
<td>oas3_1</td>
</tr>
<tr>
<td><a href="#ibm-schema-naming-convention">ibm-schema-naming-convention</a></td>
<td>warn</td>
<td>Schemas should follow the API Handbook naming conventions.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-schema-type">ibm-schema-type</a></td>
<td>off</td>
<td>Schemas and schema properties should have a non-empty <code>type</code> field. <b>This rule is disabled by default.</b></td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-schema-type-format">ibm-schema-type-format</a></td>
<td>error</td>
<td>Schemas and schema properties must use a valid combination of <code>type</code> and <code>format</code>.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-sdk-operations">ibm-sdk-operations</a></td>
<td>warn</td>
<td>Validates the structure of each <code>x-sdk-operations</code> object.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-securityscheme-attributes">ibm-securityscheme-attributes</a></td>
<td>warn</td>
<td>Performs a series of validations on the content within security schemes.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-securityschemes">ibm-securityschemes</a></td>
<td>warn</td>
<td>Verifies the security schemes and security requirement objects.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-server-variable-default-value">ibm-server-variable-default-value</a></td>
<td>warn</td>
<td>Server variables should have a default value.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-string-attributes">ibm-string-attributes</a></td>
<td>warn</td>
<td>String schema properties should define the <code>pattern</code>, <code>minLength</code> and <code>maxLength</code> fields.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-success-response-example">ibm-success-response-example</a></td>
<td>warn</td>
<td>Each "success" response should provide an example.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-summary-sentence-style">ibm-summary-sentence-style</a></td>
<td>warn</td>
<td>An operation's <code>summary</code> field should not have a trailing period.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-unevaluated-properties">ibm-unevaluated-properties</a></td>
<td>error</td>
<td>Ensures that <code>unevaluatedProperties</code> is not enabled within a schema.</td>
<td>oas3_1</td>
</tr>
<tr>
<td><a href="#ibm-unique-parameter-request-property-names">ibm-unique-parameter-request-property-names</a></td>
<td>error</td>
<td>Checks each operation for name collisions between the operation's parameters and its request body schema properties.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-valid-path-segments">ibm-valid-path-segments</a></td>
<td>error</td>
<td>Checks each path string in the API to make sure path parameter references are valid within path segments.</td>
<td>oas3</td>
</tr>
<tr>
<td><a href="#ibm-well-defined-dictionaries">ibm-well-defined-dictionaries</a></td>
<td>warn</td>
<td>Dictionaries must be well defined and all values must share a single type.</td>
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
In this section, we'll focus on the goal of defining a new custom rule that replaces the `ibm-property-casing-convention` rule
within the `@ibm-cloud/openapi-ruleset` package.
Specifically, we'll configure our custom rule to enforce camel case within schema property names rather than the default snake case.

In this scenario, we will re-define the `ibm-property-casing-convention` rule within our custom ruleset, but we will re-use the
`propertyCasingConvention` custom function within the `@ibm-cloud/openapi-ruleset` package that implements the logic of this rule.
For this reason, we must implement our custom ruleset using javascript instead of yaml.

Here is our custom ruleset file (`.spectral.js`):

```javascript
const ibmCloudValidationRules = require('@ibm-cloud/openapi-ruleset');                           // Note 1
const { propertyCasingConvention } = require('@ibm-cloud/openapi-ruleset/src/functions');
const { schemas } = require('@ibm-cloud/openapi-ruleset-utilities/src/collections');

module.exports = {
  extends: ibmCloudValidationRules,
  rules: {
    'ibm-property-casing-convention': {                                                          // Note 2
      description: 'Property names must follow camel case',
      message: '{{error}}',
      resolved: true,                                                                            // Note 3
      given: schemas,                                                                            // Note 4
      severity: 'warn',
      then: {
        function: propertyCasingConvention,                                                      // Note 5
        functionOptions: {                                                                       // Note 6
          type: 'camel'
        }
      }
    }
  }
};
```
Notes:
1. This custom ruleset extends `@ibm-cloud/openapi-ruleset` and also references the `propertyCasingConvention` function and the
`schemas` JSONPath collection, so we need to import each of these with `require` statements.  In addition, be sure to install
the `@ibm-cloud/openapi-ruleset` package: `npm install @ibm-cloud/openapi-ruleset`.
2. This custom rule is re-defining (overriding) the `ibm-property-casing-convention` rule from the `@ibm-cloud/openapi-ruleset` package
so we need to use the same rule id (`ibm-property-casing-convention`).  Alternatively, we could have used a different rule id of our choosing,
but we would then need to separately disable the existing `ibm-property-casing-convention` rule so that we don't end up using both rules
which would result in the simultaneous enforcement of two competing case conventions.
3. The `resolved=true` setting means that the rule will be invoked on the _resolved_ version of the API definition (i.e. each `$ref`
will be resolved by replacing it with the referenced entity).
4. The use of the `schemas` collection for the value of the `given` field is a convenient way to express that the rule should be invoked
on each location within the _resolved_ API definition where a schema might appear.
5. Our custom rule uses the same function (`propertyCasingConvention`) that is used by the original `ibm-property-casing-convention` rule
within the `@ibm-cloud/openapi-ruleset` package.
6. We set the `functionOptions` field to configure the rule to enforce camel case instead of the default snake case.

#### Define a new rule
To define a new rule as part of your custom ruleset, please read the [Spectral Custom Rulesets](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTg5-custom-rulesets) documentation.


### Spectral Overrides

Rather than turning off a Spectral rule entirely, Spectral overrides allow you to customize ruleset usage for different
files and projects without having to duplicate any rules.
For details on how to add overrides to your custom ruleset, please read the
[Spectral overrides](https://meta.stoplight.io/docs/spectral/293426e270fac-overrides) documentation.


## Reference
This section provides reference documentation about the IBM Cloud Validation Rules contained
in the `@ibm-cloud/openapi-ruleset` package.


### ibm-api-symmetry
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-api-symmetry</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>
Each resource-representing schema should follow the <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-schemas">IBM Cloud API Handbook schema structure conventions</a>. Specifically, this rule ensures that Summary, Prototype, and Patch schemas are proper graph fragments of the canonical schema they are variants of. According to the Handbook, "a graph fragment schema has the same structure as its canonical schema with some properties omitted from the schema or from any nested object schemas."

This convention ensures that resource-oriented APIs are symmetrical between requests and responses in how resources are represented.

Note: the rule will report additional details about each violation of the graph fragment pattern through "info" level logs. Pass the option <code>--log-level ibm-api-symmetry=info</code> to see more info about any violations that occur.
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
        name:
          type: string
        age:
          type: integer
    ThingPrototype:
      name:
        type: string
      age:
        type: integer
      color:            # Does not exist on the resource!
        type: string
paths:
  /v1/things:
    post:
      requestBody:
        content:
          'application/json':
            schema:
              $ref: '#/components/schemas/ThingPrototype'
  /v1/things/{id}:
    get:
      responses:
        200:
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/Thing'
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
          name:
            type: string
          age:
            type: integer
      ThingPrototype:      # A proper subset of properties
        name:
          type: string
        age:
          type: integer
  paths:
    /v1/things:
      post:
        requestBody:
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/ThingPrototype'
    /v1/things/{id}:
      get:
        responses:
          200:
            content:
              'application/json':
                schema:
                  $ref: '#/components/schemas/Thing'
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


### ibm-avoid-inline-schemas
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-avoid-inline-schemas</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The use of inline object schemas within certain locations in your API definition are discouraged because
the SDK generator typically needs to refactor these inline schemas in order to correctly generate SDK code, and the schema names
computed by the SDK generator are unlikely to be optimal from a readability standpoint.
<p>Specifically, this rule warns about the use of inline object schemas within request bodies, responses,
and nested schemas (e.g. a schema property, an array <code>items</code> schema, an <code>additionalProperties</code> schema, etc.).
<p>More information about this can be found in the
<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-schemas#nested-object-schemas">API Handbook</a>.
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
                id:
                  type: string
                version:
                  type: object
                  properties:
                  major:
                    type: string
                  minor:
                    type: string
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                description: A Thing instance.
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


### ibm-avoid-multiple-types
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-avoid-multiple-types</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The OpenAPI 3.1 Specification allows multiple types to be used within a schema's <code>type</code> field, but this can create
ambiguity in an API definition.  Therefore, multiple types should be avoided.
<p>This rule will return an error for schemas that are defined with multiple types (e.g. <code>['string', 'integer', 'boolean']</code>).
One exception to this is that the special type <code>"null"</code> is simply ignored by the rule when counting 
the number of elements in the schema's <code>type</code> field.  So, the type value <code>['string', 'integer']</code>
would cause an error, but the type value <code>['string', 'null']</code> would not.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3_1</td>
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
        metadata:
          description: additional info about the thing
          type:
            - string
            - boolean
            - integer
            - null
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
        metadata:
          description: additional info about the thing
          type:
            - string
            - null
</pre>
</td>
</tr>
</table>


### ibm-avoid-property-name-collision
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-avoid-property-name-collision</b></td>
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


### ibm-avoid-repeating-path-parameters
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-avoid-repeating-path-parameters</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>When defining a path parameter, it's a good practice to define it once in the path object's <code>parameters</code> field rather than
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


### ibm-collection-array-property
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-collection-array-property</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-collections-overview#response-format">API Handbook</a>
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


### ibm-define-required-properties
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-define-required-properties</b></td>
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


### ibm-discriminator-property
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-discriminator-property</b></td>
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


### ibm-dont-require-merge-patch-properties
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-dont-require-merge-patch-properties</b></td>
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


### ibm-enum-casing-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-enum-casing-convention</b></td>
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


### ibm-error-response-schemas
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-error-response-schemas</b></td>
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
    ErrorContainer:
      description: 'An error response for an operation.'
      type: object
      properties:
        error:
          $ref: '#/components/schemas/Error'
        trace:
          description: 'The error trace information.'
          type: string
          format: uuid
    Error:
      description: 'An error response entry.'
      type: object
      properties:
        code:
          description: 'The error code.'
          type: integer
        message:
          description: 'The error message.'
          type: string
        more_info:
          description: 'Additional info about the error.'
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
    ErrorContainer:
      description: 'An error response for an operation.'
      type: object
      properties:
        errors:
          type: array
          minItems: 0,
          maxItems: 100,
          description: 'The array of error entries associated with the error response',
          items:
            $ref: '#/components/schemas/Error'
        trace:
          description: 'The error trace information.'
          type: string
          format: uuid
        }
      }
    },
    Error:
      description: 'An error response entry.'
      type: object
      properties:
        code:
          description: 'The error code.'
          type: string
          enum:
            - 'bad_request'
            - 'not_authorized'
            - 'no_need_to_know'
        },
        message:
          description: 'The error message.'
          type: string
        more_info:
          description: 'Additional info about the error.'
          type: string
</pre>
</td>
</tr>
</table>


### ibm-etag-header
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-etag-header</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks each path item (the object containing operations with keys 'get', 'post', 'delete', etc.) to make sure that
the path item's <code>GET</code> operation defines the <code>ETag</code> response header if it is, in fact, needed.
An <code>ETag</code> response header is needed if there are operations within the same
path item that support the <code>If-Match</code> or <code>If-Not-Match</code> header parameters.
<p>The reasoning behind this rule is that if a given path has one or more operations in which the user needs
to provide a value for the <code>If-Match</code> or <code>If-None-Match</code> header parameters
(sometimes referred to as an "etag value"), then the API should provide a way for the user to obtain the etag value.
And the standard way for a service to provide an etag value to the user is by returning it as the <code>ETag</code> response header
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


### ibm-no-accept-header
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-accept-header</b></td>
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


### ibm-no-ambiguous-paths
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-ambiguous-paths</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The path strings defined within an OpenAPI document must be unique and <code>unambiguous</code>.
In general, two paths are ambiguous if the following are true:
<ul>
<li>the two paths contain the same number of path segments (e.g. /v1/foo, /v1/{foo})</li>
<li>when comparing each of the respective path segments in each path string:
<ol>
<li>both path segments are non-parameterized and are equal (e.g. 'foo' vs 'foo')</li>
<li>one or the other of the path segments is parameterized (e.g. 'foo' vs '{foo_id}')</li>
<li>both of the path segments are parameterized (e.g. '{foo_id}' vs '{id}')</li>
</ol>
</ul>
Here are examples of paths that are ambiguous despite being unique:
<ul>
<li><code>/v1/things/{thing_id}</code>, <code>/v1/things/{id}</code>
<li><code>/v1/things/{thing_id}</code>, <code>/v1/things/other_things</code>
<li><code>/{version}/things</code>, <code>/v1/{things}</code>
</ul>
Each of the pairs of path strings above would be considered ambiguous.
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
<td valign=top><b>Non-compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    ...
  '/v1/things/{foo_id}':
    ...
  '/v1/things/other_things':
    ...
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/{thing_id}':
    ...
  '/v1/foos/{foo_id}':
    ...
  '/v1/things/{thing_id}/other_things':
    ...
</pre>
</td>
</tr>
</table>


### ibm-no-array-of-arrays
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-array-of-arrays</b></td>
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


### ibm-no-array-responses
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-array-responses</b></td>
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


### ibm-no-authorization-header
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-authorization-header</b></td>
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


### ibm-no-body-for-delete
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-body-for-delete [Deprecated]</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks each DELETE operation and will return a warning if the operation contains a <code>requestBody</code>.
<p>This rule has been deprecated and is now disabled in the IBM Cloud Validation Ruleset. Please use the <code>ibm-no-operation-requestbody</code> rule instead.
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


### ibm-no-circular-refs
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-circular-refs</b></td>
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


### ibm-no-consecutive-path-parameter-segments
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-consecutive-path-parameter-segments</b></td>
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


### ibm-no-content-type-header
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-content-type-header</b></td>
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


### ibm-no-crn-path-parameters
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-crn-path-parameters</b></td>
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


### ibm-no-default-for-required-parameter
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-default-for-required-parameter</b></td>
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


### ibm-no-duplicate-description-with-ref-sibling
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-duplicate-description-with-ref-sibling</b></td>
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
description defined within the referenced schema, thus making the use of the "ref sibling" pattern unnecessary.
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


### ibm-no-if-modified-since-header
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-if-modified-since-header</b></td>
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


### ibm-no-if-unmodified-since-header
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-if-unmodified-since-header</b></td>
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


### ibm-no-nullable-properties
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-nullable-properties</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>
The <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-models#required-optional-and-nullable">API Handbook</a>
provides guidance related to the use of <code>nullable</code> schema properties.  Specifically, the API Handbook
allows nullable schema properties to be defined only within JSON merge-patch request body schemas.
This rule ensures that nullable properties are not defined elsewhere.
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
        thing_id:
          type: string
        thing_name:
          type: string
        thing_size:
          type: integer
        thing_type:
          type: string
          nullable: true   &lt;&lt;&lt; not valid in a response schema
    ThingPatch:
      type: object
      properties:
        thing_name:
          type: string
           nullable: true   &lt;&lt;&lt; valid only in a merge-path requestBody schema
        thing_size:
          type: integer
          nullable: true   &lt;&lt;&lt; valid only in a merge-path requestBody schema
        thing_type:
          type: string
          nullable: true   &lt;&lt;&lt; valid only in a merge-path requestBody schema
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#/components/parameters/ThingIdParameter'
    patch:
      operationId: update_thing
      requestBody:
        description: An object used to modify an existing Thing instance
        content:
          application/merge-patch+json:
            schema:
              $ref: '#/components/schemas/ThingPatch'
      responses:
        '200':
          description: Thing instance was updated successfully
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
components:
  schemas:
    Thing:
      type: object
      properties:
        thing_id:
          type: string
        thing_name:
          type: string
        thing_size:
          type: integer
        thing_type:    &lt;&lt;&lt; property is no longer nullable
          type: string
    ThingPatch:
      type: object
      properties:
        thing_name:
          type: string
           nullable: true
        thing_size:
          type: integer
          nullable: true
        thing_type:
          type: string
          nullable: true
paths:
  '/v1/things/{thing_id}':
    parameters:
      - $ref: '#/components/parameters/ThingIdParameter'
    patch:
      operationId: update_thing
      requestBody:
        description: An object used to modify an existing Thing instance
        content:
          application/merge-patch+json:
            schema:
              $ref: '#/components/schemas/ThingPatch'
      responses:
        '200':
          description: Thing instance was updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Thing'
</pre>
</td>
</tr>
</table>


### ibm-no-operation-requestbody
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-operation-requestbody</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>
The <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-methods#summary">API Handbook</a>
provides guidance related to the use of various HTTP methods.
In particular, the API Handbook discourages the use of a <code>requestBody</code>
with <code>DELETE</code>, <code>GET</code>, <code>HEAD</code> and <code>OPTIONS</code> operations.
This rule ensures that these operations do not define a <code>requestBody</code>.
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
<td valign=top><b>Configuration:</b></td>
<td>This rule supports a configuration that specifies the set of HTTP methods that are checked
for a <code>requestBody</code>.
<p>The default configuration object provided with the rule is:
<pre>
{
  httpMethods: ['delete', 'get', 'head', 'options']
}
</pre>
<p>To configure the rule with a different set of HTTP methods, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration such that the value of the <code>httpMethods</code> field 
specifies the desired set of HTTP methods to be checked.
For example, to enforce the rule for DELETE, HEAD and OPTIONS operations, the configuration object would look like this:
<pre>
{
  httpMethods: ['delete', 'head', 'options']
}
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things/search':
    get:
      operationId: search_things
      requestBody:
        description: 'An object containing the search-related properties: filter, sort'
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ThingSearchRequest'
      responses:
        '200':
          description: 'Search completed successfully'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingSearchResponse'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/search':
    get:
      parameters:
        - name: filter
          in: query
          description: The search filter to use.
          schema:
            type: string
        - name: sort
          in: query
          description: The sort order.
          schema:
            type: string
      operationId: search_things
      responses:
        '200':
          description: 'Search completed successfully'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingSearchResponse'
</pre>
</td>
</tr>
</table>


### ibm-no-optional-properties-in-required-body
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-optional-properties-in-required-body</b></td>
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


### ibm-no-space-in-example-name
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-space-in-example-name</b></td>
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


### ibm-no-unsupported-keywords
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-no-unsupported-keywords</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule checks for the presence of specific keywords within an OpenAPI 3.1.x document that are not yet supported
by IBM's SDK-related tooling - specifically the <code>jsonSchemaDialect</code> and
<code>webhooks</code> keywords.  An error is logged if either of these keywords is found in the document.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3_1</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
openapi: 3.1.0
info:
  title: Thing Service
  description: A service that manages Things
  version: 1.0.0
jsonSchemaDialect: 'https://spec.openapis.org/oas/3.1/dialect/base'    &lt;&lt;&lt; not supported
webhooks:                                                              &lt;&lt;&lt; not supported
  newThingTypeAvailable:
    post:
      description: |-
        A callback-like operation to be implemented by the client so that it
        can be informed of a new type of Thing supported by the server.
      requestBody:
        description: 'A new type of Thing can now be created on the server.'
          content:
            application/json:
              schema:
                type: object,
                properties:
                  thing_type:
                    description: 'The new type value that can be used to create a Thing instance.'
                    type: string
      responses:
        '200':
          description: |-
            Return a 200 status code to the server to indicate that the new Thing type
            was received successfully by the client.
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
openapi: 3.1.0
info:
  title: Thing Service
  description: A service that manages Things
  version: 1.0.0
</pre>
</td>
</tr>
</table>


### ibm-openapi-tags-used
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-openapi-tags-used</b></td>
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


### ibm-operation-responses
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-operation-responses</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that each operation has a <code>responses</code> field.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3_1</td>
</tr>
<tr>
<td valign=top><b>Non-compliant example:<b></td>
<td>
<pre>
paths:
  '/v1/things':
    post:
      operationId: create_thing
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
      responses:
        '201':
          description: 'The Thing instance was created successfully'
          content:
            application/json:
              schema:
                type: object
                properties:
                  thing_id:
                    type: string
                  thing_description:
                    type: string
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
<td>This rule verifies that each operation has a non-empty <code>summary</code>.
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


### ibm-operationid-casing-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-operationid-casing-convention</b></td>
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


### ibm-operationid-naming-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-operationid-naming-convention</b></td>
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


### ibm-parameter-casing-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-parameter-casing-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule verifies that each parameter name complies with the casing convention associated with that parameter's type.
For example, the default casing convention for query parameters is snake-case (e.g. <code>my_query_param</code>), the default for path parameters
is snake-case (e.g. <code>my_path_param</code>), and the default casing convention for header params is kebab-separated pascal-case with provision for capitalized abbreviations (e.g. <code>IBM-CustomHeader-Name</code>).
These default casing conventions constitute the default configuration for the rule, although the rule's configuration can be modified to
fit your needs (see below).
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
<td valign=top><b>Configuration:</b></td>
<td>This rule can be configured to enforce specific case conventions for each parameter type.
To configure the rule, set the <code>functionOptions</code> field within the rule definition to be an object
with keys that represent the different parameter types to be checked for proper case conventions
('query', 'path', and 'header').  The value associated with each entry should be an object that is the
appropriate configuration to be used by either Spectral's <code>casing()</code> function
[<a href="https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions#casing">1</a>]
or <code>pattern()</code> function [<a href="https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions#pattern">2</a>]
(for greater control over the case convention check) to enforce the desired case convention for that parameter type.
Additionally, you can define custom messages in the form "{parameter-type}Message".
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
  // Spectral casing convention types aren't robust enough to handle
  // the complexity of headers, so we define our own kebab/pascal case regex.
  header: {
    match: '/^[A-Z]+[a-z0-9]*-*([A-Z]+[a-z0-9]*-*)*$/',
  },
  headerMessage: 'Header parameter names must be kebab-separated pascal case',
}
</pre>
This enforces:
<ul>
<li>Query parameter names to be snake-case, while also allowing "." within the name</li>
<li>Path parameter names to be snake-case</li>
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
For example, to disable the case convention checks on header parameter names, while enforcing camel-case conventions
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
      name: sortOrder           &lt;&lt; camel-case
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
      name: sort_order        &lt;&lt; snake-case
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


### ibm-path-segment-casing-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-path-segment-casing-convention</b></td>
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


### ibm-pattern-properties
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-pattern-properties</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule enforces certain restrictions related to the use of the <code>patternProperties</code> field
within a schema:
<ul>
<li>The <code>patternProperties</code> field must be an object with exactly one entry.
<li>The <code>patternProperties</code> and <code>additionalProperties</code> fields are mutually exclusive within a particular schema.
</ul>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3_1</td>
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
        metadata:
          description: additional info about the thing
          type: object
          patternProperties:
            '^foo.*$':
              type: string
            '^bar.*$':
              type: integer
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
        metadata:
          description: additional info about the thing
          type: object
          patternProperties:
            '^(foo|bar).*$':
              type: string
</pre>
</td>
</tr>
</table>


### ibm-precondition-headers
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-precondition-headers</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Operations that return a 412 status code must support at least one of the following header parameters: <code>If-Match</code>, <code>If-None-Match</code>, <code>If-Modified-Since</code>, <code>If-Unmodified-Since</code>.
For more details, please see the API Handbook section on
<a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-headers#conditional-headers">Conditional headers</a>.</td>
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


### ibm-prefer-token-pagination
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-prefer-token-pagination</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>As per the <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-pagination#token-based-pagination">API Handbook guidance on pagination</a>, paginated list operations should use token-based pagination, rather than offset/limit pagination, wherever feasible.</td>
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
  '/v1/things/':
    get:
      operationId: list_things
      parameters:
        - name: offset
          in: query
          description: 'The offset of the first item to return.'
          required: false
          schema:
            type: integer
            format: int32
            minimum: 0
        - name: limit
          in: query
          description: 'The number of items to return per page.'
          required: false
          schema:
            type: integer
            format: int32
            minimum: 0
            maximum: 100
            default: 10
      responses:
        '200':
          description: 'Resources retrieved successfully!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'
        '400':
          description: 'List operation failed.'
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
paths:
  '/v1/things/':
    get:
      operationId: list_things
      parameters:
        - name: start
          in: query
          description: 'The token representing the first item to return.'
          required: false
          schema:
            type: string
            minLength: 1
            maxLength: 64
            pattern: '[a-zA-Z0-9 ]+'
        - name: limit
          in: query
          description: 'The number of items to return per page.'
          required: false
          schema:
            type: integer
            format: int32
            minimum: 0
            maximum: 100
            default: 10
      responses:
        '200':
          description: 'Resources retrieved successfully!'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThingCollection'
        '400':
          description: 'List operation failed.'
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


### ibm-property-casing-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-property-casing-convention</b></td>
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


### ibm-property-consistent-name-and-type
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-property-consistent-name-and-type</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Like-named schema properties (from different schemas) should have the same type to ensure consistency
throughout the API definition.
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


### ibm-request-and-response-content
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-request-and-response-content</b></td>
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


### ibm-requestbody-is-object
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-requestbody-is-object</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Each non-form-based request body should be defined as an object.</td>
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


### ibm-requestbody-name
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-requestbody-name</b></td>
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

### ibm-resource-response-consistency
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-requestbody-name</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>Synchronous responses for create-style POST or update (PUT/PATCH) operations on a given resource instance should return the canonical schema for the resource, which is the schema returned in the GET operation on the single-instance path (e.g. `/resources/{id}`). Synchronous responses for bulk replace (PUT) operations should return the collection schema, which is the schema returned in the GET operation on the collection path (e.g. `/resources`).</td>
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
  '/v1/thing':
    post:
      operationId: create_thing
      requestBody:
        content:
          'application/json':
            schema:
              $ref: '#/components/schemas/ThingPrototype'
      responses:
        201:
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/OtherThing' # should be a ref to 'Thing'
  '/v1/thing/{id}':
    get:
      operationId: get_thing
      responses:
        200:
          content:
            'application/json':
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
  '/v1/thing':
    post:
      operationId: create_thing
      requestBody:
        content:
          'application/json':
            schema:
              $ref: '#/components/schemas/ThingPrototype'
      responses:
        201:
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/Thing'
  '/v1/thing/{id}':
    get:
      operationId: get_thing
      responses:
        200:
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/Thing'
</pre>
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
or a <code>202 - Accepted</code> status code. The one exception is, it may return a <code>204 - No Content</code> status code
if the corresponding GET request for the same resource also returns a <code>204 - No Content</code> status code (which indicates
there is no body representation for the resource).</li>
<li>A PUT operation must return either a <code>200 - OK</code>, <code>201 - Created</code>,
or <code>202 - Accepted</code> status code.</li>
<li>A PATCH operation must return either a <code>200 - OK</code>
or a <code>202 - Accepted</code> status code.</li>
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
it is a synchronous or asynchronous operation.</li>
</ul>
<p>References: 
<ul>
<li><a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-status-codes">IBM Cloud API Handbook: Fundamentals/Status Codes</a></li>
<li><a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-methods">IBM Cloud API Handbook: Fundamentals/Methods</a></li>
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


### ibm-schema-casing-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-schema-casing-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>
Schema names (the keys in `components -> schemas`) should follow the "upper camel case" convention
as required by the <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-schemas#naming">IBM Cloud API Handbook</a>. Note that acronyms are allowed to be capitalized.
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
<td valign=top><b>Configuration:</b></td>
<td>This rule can be configured to define the specific regular expression used to enforce a case convention for schema name values.
To configure the rule, set the <code>functionOptions</code> field within the rule definition to be an object
that is the appropriate configuration to be used by Spectral's <code>pattern()</code> function
[<a href="https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions#pattern">1</a>]
to enforce the desired case convention for schema name values.
<p>The default configuration object provided in the rule definition is:
<pre>
{
  match: '/^[A-Z]+[a-z0-9]+([A-Z]+[a-z0-9]*)*$/'
}
</pre>
<p>To enforce a different case convention for schema name values, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration such that the value of the <code>match</code> field 
specifies the desired case convention.
For example, to disallow capitalized acronymns for schema names, the configuration object would look like this:
<pre>
{
  match: '/^[A-Z][a-z0-9]+([A-Z][a-z0-9]+)*$/'
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
    specific_thing:
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
    SpecificThing:
      type: object
      properties:
        ...
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
<td>Each schema should include a description.</td>
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


### ibm-schema-keywords
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-schema-keywords</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>
This rule verifies that only certain keywords (fields) are used when defining schemas and schema properties
in an OpenAPI 3.1.x document. The allowable keywords are configurable (see the <code>Configuration</code> section below).
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3_1</td>
</tr>
<tr>
<td valign=top><b>Configuration:</b></td>
<td>This rule supports a configuration object that specifies the set of keywords that are allowed within a schema
or schema property.
<p>The default configuration object provided with the rule is:
<pre>
{
  keywordAllowList: [
    '$ref',
    'additionalProperties',
    'allOf',
    'anyOf',
    'default',
    'description',
    'discriminator',
    'enum',
    'example',
    'exclusiveMaximum',
    'exclusiveMinimum',
    'format',
    'items',
    'maximum',
    'maxItems',
    'maxLength',
    'maxProperties',
    'minimum',
    'minItems',
    'minLength',
    'minProperties',
    'multipleOf',
    'not',
    'oneOf',
    'pattern',
    'patternProperties',
    'properties',
    'readOnly',
    'required',
    'title',
    'type',
    'uniqueItems',
    'unevaluatedProperties',
    'writeOnly',
  ]
}
</pre>
<p>To configure the rule with a different set of allowable keywords, you'll need to
<a href="#replace-a-rule-from-ibm-cloudopenapi-ruleset">replace this rule with a new rule within your
custom ruleset</a> and modify the configuration such that the value of the <code>keywordAllowList</code> field 
contains the desired set of keywords to be checked.
For example, to configure the rule so that <code>uniqueItems</code> and <code>unevaluatedProperties</code> are disallowed, 
modify the configuration to remove these keywords from the <code>keywordAllowList</code>
configuration field, like this:
<pre>
{
  keywordAllowList: [
    '$ref',
    'additionalProperties',
    'allOf',
    'anyOf',
    'default',
    'description',
    'discriminator',
    'enum',
    'example',
    'exclusiveMaximum',
    'exclusiveMinimum',
    'format',
    'items',
    'maximum',
    'maxItems',
    'maxLength',
    'maxProperties',
    'minimum',
    'minItems',
    'minLength',
    'minProperties',
    'multipleOf',
    'not',
    'oneOf',
    'pattern',
    'patternProperties',
    'properties',
    'readOnly',
    'required',
    'title',
    'type',
    'writeOnly',
  ]
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
    Things:
      type: object
      properties:
        thing_id:
          type: string
          $comment: A comment about this property definition
          nullable: true
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
components:
  schemas:
    Things:
      type: object
      properties:
        thing_id:
          description: A comment about this property definition
          type:
            - string
            - null
</pre>
</td>
</tr>
</table>


### ibm-schema-naming-convention
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-schema-naming-convention</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>
The name of each schema should follow the <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-schemas#naming">IBM Cloud API Handbook schema naming conventions</a>.

The rule checks the names of collection schemas, resource collection element schemas, creation/replacement schemas, and patch schemas against the name of the associated canonical schema to ensure the names follow the guidelines.
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
      requestBody:
        content:
          'application/json':
            schema:
              $ref: '#/components/schemas/ThingCreator' # Should be ThingPrototype
  /v1/things/{id}:
    get:
      responses:
        200:
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/Thing' # Canonical schema
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
      requestBody:
        content:
          'application/json':
            schema:
              $ref: '#/components/schemas/ThingPrototype'
  /v1/things/{id}:
    get:
      responses:
        200:
          content:
            'application/json':
              schema:
                $ref: '#/components/schemas/Thing'
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
Schemas and schema properties should have a non-empty <code>type</code> field.
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


### ibm-schema-type-format
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-schema-type-format</b></td>
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


### ibm-securityscheme-attributes
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-securityscheme-attributes</b></td>
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


### ibm-securityschemes
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-securityschemes</b></td>
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


### ibm-success-response-example
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-success-response-example</b></td>
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


### ibm-summary-sentence-style
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-summary-sentence-style</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>An operation's <code>summary</code> field should contain a very brief description of the operation and should
not have a trailing period.</td>
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
      summary: List the Thing objects.
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
      summary: List things
      description: Retrieve a paginated collection of Thing instances.
</pre>
</td>
</tr>
</table>


### ibm-unevaluated-properties
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-unevaluated-properties</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>This rule ensures that <code>unevaluatedProperties</code> is not enabled within a schema.
It checks to make sure that if the <code>unevaluatedProperties</code> field
is set on a schema, then it is set to the value <code>false</code> (i.e. disabled).
</tr>
<tr>
<td><b>Severity:</b></td>
<td>error</td>
</tr>
<tr>
<td><b>OAS Versions:</b></td>
<td>oas3_1</td>
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
        metadata:
          description: additional info about the thing
          type: object
      unevaluatedProperties:
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
        metadata:
          description: additional info about the thing
          type: object
      unevaluatedProperties: false
</pre>
</td>
</tr>
</table>


### ibm-unique-parameter-request-property-names
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-unique-parameter-request-property-names</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>The <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-uris#path-parameter-names">IBM Cloud API Handbook</a>
discourages the use of path parameter names that match any of the names of 
top-level properties in the operation's request body schema.
The primary justification for this guidance is that if the names of operation parameters collide with the names of top-level
request body properties, then it creates ambiguity and perhaps a lack of clarity for users of the API.
In fact, the guidance applies equally well for all parameter types, not just path parameters.
<p>And more specifically, IBM's OpenAPI SDK Generator will "explode" an operation's request body under certain circumstances in order to
simplify the application code required to invoke the operation.
This means that, instead of representing the operation's request body as a single operation parameter, the generator
will expose each of the properties defined in the operation's request body
schema such that they appear to be individual operation parameters.   This optimization makes it easier for
an SDK user to construct an instance of the request body schema (class, struct, etc.) when invoking the operation.
<p>Because the request body schema properties are exposed as operation parameters, the generator must detect if there are
any name collisions between these schema properties and the operation's other parameters.
The generator will rename the request body schema properties if any collisions are detected,
but the names computed by the generator are not optimal from a usability standpoint, so it's better for the API
to be defined such that the name collisions are avoided altogether.
<p>This validation rule checks each operation for name collisions between the operation's parameters and its request body
schema properties.  An error is logged for each collision.  Each of these errors should be addressed by renaming either 
the parameter or request body schema property to avoid the collision.
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
  /v1/things:
    parameters:
      - in: query
        name: thing_type
        schema:
          type: string
    post:
      operationId: create_thing
      parameters:
        - in: query
          name: thing_size
          schema:
            type: integer
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                thing_type:
                  type: string
                thing_size:
                  type: integer
                created_at:
                  type: string
                  format: date-time
                created_by:
                  type: string
                  format: email
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
To avoid the collisions, the schema properties `thing_type` and `thing_size` were renamed to `type` and `size` respectively.
We could have instead renamed the parameters in order to avoid the collisions.
<pre>
paths:
  /v1/things:
    parameters:
      - in: query
        name: thing_type
        schema:
          type: string
    post:
      operationId: create_thing
      parameters:
        - in: query
          name: thing_size
          schema:
            type: integer
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                type:
                  type: string
                size:
                  type: integer
                created_at:
                  type: string
                  format: date-time
                created_by:
                  type: string
                  format: email
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

### ibm-well-defined-dictionaries
<table>
<tr>
<td><b>Rule id:</b></td>
<td><b>ibm-well-defined-dictionaries</b></td>
</tr>
<tr>
<td valign=top><b>Description:</b></td>
<td>
  This rule validates that any dictionary schemas are well defined and that all values share a single type.
  Dictionaries are defined as object type schemas that have variable key names. They are distinct from model types,
  which are objects with pre-defined properties. A schema must not define both concrete properties and variable key names.
  Practically, this means a schema must explicitly define a `properties` object or an `additionalProperties` schema, but not both.
  If used, the `additionalProperties` schema must define a concrete type. See the <a href="https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-types">IBM Cloud API Handbook documentation on types</a> for more info.
</td>
</tr>
<tr>
<td><b>Severity:</b></td>
<td>warning</td>
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
    AmbiguousDictionary:
      type: object
      additionalProperties: true # No type description of the values in the dictionary
    ProblematicHybird:
      type: object
      properties:
        name:
          type: string
      additionalProperties: # If the schema is a model, all property names/types should be explicit
        type: integer
</pre>
</td>
</tr>
<tr>
<td valign=top><b>Compliant example:</b></td>
<td>
<pre>
  components:
    schemas:
      DefinedDictionary:
        type: object
        additionalProperties:
          type: string # Map of string to type string
          minLength: 1
          maxLength: 42
      DefinedModel:
        type: object
        properties:
          name:
            type: string
</pre>
</td>
</tr>
</table>
