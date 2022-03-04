# IBM Cloud Validation Ruleset

This document outlines how to configure and use the IBM Cloud Validation Ruleset,
which is delivered in the `@ibm-cloud/openapi-ruleset` NPM package.

## Table of contents

<!--
  The TOC below is generated using the `markdown-toc` node package.

      https://github.com/jonschlinkert/markdown-toc

  You should regenerate the TOC after making changes to this file.

      markdown-toc --maxdepth 4 -i ibm-cloud-rules.md
  -->

<!-- toc -->

- [Configuration](#configuration)
  * [Customizing the IBM Cloud Validation Ruleset](#customizing-the-ibm-cloud-validation-ruleset)
    + [Configuring individual rules](#configuring-individual-rules)
  * [Custom rules](#custom-rules)
  * [Spectral exceptions](#spectral-exceptions)
- [IBM Cloud Validation rules documentation](#ibm-cloud-validation-rules-documentation)
  * [Overview](#overview)
  * [Reference information](#reference-information)
    + [Rule: content-entry-provided](#rule-content-entry-provided)
    + [Rule: content-entry-contains-schema](#rule-content-entry-contains-schema)
    + [Rule: ibm-content-type-is-specific](#rule-ibm-content-type-is-specific)
    + [Rule: ibm-error-content-type-is-json](#rule-ibm-error-content-type-is-json)
    + [Rule: ibm-sdk-operations](#rule-ibm-sdk-operations)
    + [Rule: major-version-in-path](#rule-major-version-in-path)
    + [Rule: response-error-response-schema](#rule-response-error-response-schema)
    + [Rule: parameter-schema-or-content](#rule-parameter-schema-or-content)
    + [Rule: request-body-object](#rule-request-body-object)
    + [Rule: response-example-provided](#rule-response-example-provided)

<!-- tocstop -->

## Configuration

The IBM Cloud Validation Ruleset extends Spectral's
[“oas" ruleset](https://meta.stoplight.io/docs/spectral/docs/reference/openapi-rules.md).
While all of the `spectral:oas` rules are included in the IBM Cloud Validation Ruleset,
only the following are enabled by default:
```
oas2-operation-formData-consume-check: true
operation-operationId-unique: true
operation-parameters: true
operation-tag-defined: true
no-eval-in-markdown: true
no-script-tags-in-markdown: true
openapi-tags: true
operation-description: true
operation-tags: true
path-keys-no-trailing-slash: true
path-not-include-query: true
typed-enum: true
oas2-api-host: true
oas2-api-schemes: true
oas2-host-trailing-slash: true
oas2-valid-schema-example: 'warn'
oas2-anyOf: true
oas2-oneOf: true
oas2-unused-definition: true
oas3-api-servers: true
oas3-examples-value-or-externalValue: true
oas3-server-trailing-slash: true
oas3-valid-media-example: 'warn'
oas3-valid-schema-example: 'warn'
oas3-schema: true
oas3-unused-component: true
```

In addition to the `spectral:oas` rules mentioned above, the IBM Cloud Validation Ruleset also
includes an additional set of IBM Cloud validation rules that implement the best practices found
in the [IBM Cloud API Handbook](https://cloud.ibm.com/docs/api-handbook).

### Customizing the IBM Cloud Validation Ruleset

You can extend the IBM Cloud Validation Ruleset (`@ibm-cloud/openapi-ruleset`) or specify
your own custom ruleset with a [Spectral ruleset file](https://meta.stoplight.io/docs/spectral/docs/getting-started/3-rulesets.md).

You can provide a Spectral ruleset file to the IBM OpenAPI validator in a file named `.spectral.yaml`
in the current directory or with the `--ruleset` command line option of the validator.

#### Configuring individual rules

Any rule in the `@ibm-cloud/openapi-ruleset` package can be configured to trigger an error, warning, info,
or hint message in the validator output.
For example, to configure the `openapi-tags` rule to trigger an `info` message instead of a `warning`,
specify the following in your Spectral ruleset file:
```
extends: '@ibm-cloud/openapi-ruleset'
rules:
  openapi-tags: info
```

To completely disable a rule, use the severity of `off`.
For example, to disable the `operation-tags` rule, specify the following in your Spectral ruleset file:
```
extends: '@ibm-cloud/openapi-ruleset'
rules:
  operation-tags: off
```

Since the `@ibm-cloud/openapi-ruleset` package includes all the rules in `spectral:oas`, you can also enable rules from that
ruleset that are disabled by default.
For example, to enable the `info-contact` rule with it's default severity (`warning`), specify the following in your Spectral ruleset file:
```
extends: '@ibm-cloud/openapi-ruleset'
rules:
  info-contact: true
```

You could also set the severity of `info-contact` explicitly to `error`, `warn`, `info`, or `hint`.

Note: if you are writing your Spectral config file in JavaScript, you must install and import the `@ibm-cloud/openapi-ruleset`
NPM package as a dependency:
```
const ibmOpenapiRuleset = require('@ibm-cloud/openapi-ruleset');

module.exports = {
  extends: ibmOpenapiRuleset,
  rules: {
    'info-contact': true,
  }
};
```

### Custom rules

You can define your own custom rules using a simple but powerful yaml syntax or with custom Javascript functions.
Use the documentation on [Spectral custom rules](https://meta.stoplight.io/docs/spectral/docs/guides/4-custom-rulesets.md) in order to add these to your __.spectral.yaml__ file.

### Spectral exceptions

Rather than turning off a Spectral rule entirely, Spectral exceptions allow you to exclude some directories/files from being validated against a rule.
Use the documentation on [Spectral exceptions](https://meta.stoplight.io/docs/spectral/docs/guides/6-exceptions.md) to add exceptions to your __.spectral.yaml__ file.


## IBM Cloud Validation rules documentation
This section provides information about the IBM Cloud validation rules contained
in the `@ibm-cloud/openapi-ruleset` package.

### Overview
This table provides an overview of the IBM Cloud validation rules:

| Rule                          | Sev   | Description                                                              | Spec     |
| ----------------------------- | ------|--------------------------------------------------------------------------| -------- |
| [content-entry-contains-schema](#rule-content-entry-contains-schema) | warn  | Content entries must specify a schema                                    | oas3     |
| [content-entry-provided](#rule-content-entry-provided)        | warn  | Request bodies and non-204 responses should define a content object      | oas3     |
| [ibm-content-type-is-specific](#rule-ibm-content-type-is-specific)  | warn  | `*/*` should only be used when all content types are supported           | oas3     |
| [ibm-error-content-type-is-json](#rule-ibm-error-content-type-is-json)| warn  | Error response should support application/json                           | oas3     |
| [ibm-sdk-operations  ](#rule-ibm-sdk-operations)          | warn  | Validates the structure of the `x-sdk-operations` object                 | oas3     |
| [major-version-in-path](#rule-major-version-in-path)         | warn  | All paths must contain the API major version as a distinct path segment  | oas2, oas3 |
| [response-error-response-schema](#rule-response-error-response-schema)| warn  | Error response should follow design guidelines                           | oas3     |
| [parameter-schema-or-content](#rule-parameter-schema-or-content)   | error | Parameter must provide either a schema or content                        | oas3     |
| [request-body-object](#rule-request-body-object)           | error | All request bodies MUST be structured as an object                       | oas3     |
| [response-example-provided](#rule-response-example-provided)     | warn  | Response should provide an example                                       | oas3     |

### Reference information
This section provides detailed reference information on each of the IBM Cloud validation rules.

#### Rule: content-entry-provided

Checks for `content` entry for all request bodies and non-204 responses.

**Default Severity**: warn

##### Non-compliant example

```yaml
responses:
  200:
    description: 'example error description`
```

##### Compliant example

```yaml
responses:
  200:
    content:
      application/json:
        schema:
          type: object
          properties:
            $ref: '#/components/responses/SuccessSchema'
```

#### Rule: content-entry-contains-schema

Any request or response body that has `content` should contain a schema.

**Default Severity**: warn

##### Non-compliant example

```yaml
responses:
  200:
    content:
      application/json:
        # schema not provided
```

##### Compliant example

```yaml
responses:
  200:
    content:
      application/json:
        schema:
          type: string
```

#### Rule: ibm-content-type-is-specific

Should avoid the use of `*/*` content type unless the API actually supports all content types. When the API does support all content types, this warning should be ignored.

**Default Severity**: warn

##### Non-compliant example

```yaml
responses:
  200:
    content:
      '*/*':
```

##### Compliant example

```yaml
responses:
  200:
    content:
      'application/json':
        ...
      'text/plain':
        ...
```

#### Rule: ibm-error-content-type-is-json

An error response likely returns `application/json` and this rule warns when `application/json` is not the content type. This rule should be ignored when the API actually returns an error response that is not `application/json`.

**Default Severity**: warn

##### Non-compliant example

```yaml
responses:
  400:
    content:
      'application/octet-stream':
```

##### Compliant example

```yaml
responses:
  400:
    content:
      'application/json':
```

#### Rule: ibm-sdk-operations

Validates the structure of the `x-sdk-operations` object using [this JSON Schema document](/src/spectral/schemas/x-sdk-operations.json).

**Default Severity**: warn

#### Rule: major-version-in-path

Validates that every path contains a path segment for the API major version, of the form `v<n>`, and that all paths have the same major version segment. The major version can appear in either the server URL (oas3), the basePath (oas2), or in each path entry.

**Default Severity**: warn

#### Rule: response-error-response-schema

`4xx` and `5xx` error responses should provide good information to help the user resolve the error. The error response validations are based on the design principles outlined in the [errors section of the IBM API Handbook](https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-errors). The `response-error-response-schema` rule is more lenient than what is outlined in the handbook. Specifically, the `response-error-response-schema` rule does not require an Error Container Model and allows for a single Error Model to be provided at the top level of the error response schema or in an `error` field.

**Default Severity**: warn

#### Rule: parameter-schema-or-content

Parameters must provide either a schema or content object.

**Default Severity**: error

##### Non-compliant example

```yaml
parameters:
- name: param1
  in: query
  description: query param
```

##### Compliant example

```yaml
parameters:
- name: param1
  in: query
  description: query param
  schema:
    type: string
```

#### Rule: request-body-object

Request bodies should be objects.

**Default Severity**: warn

##### Non-compliant example

```yaml
requestBody:
  content:
    application/json:
      schema:
        type: string
```

##### Compliant example

```yaml
requestBody:
  content:
    application/json:
      schema:
        type: object
        properties:
          prop1:
            type: string
```

#### Rule: response-example-provided

Response examples are used to generate documentation. To improve the generated documentation, response examples should be provided in the schema object or "next to" the schema object.

**Default Severity**: warn

##### Non-compliant example

```yaml
responses:
  200:
    content:
      application/json:
        schema:
          type: string
```

##### Compliant examples

The example may be provided in the schema object.

```yaml
responses:
  200:
    content:
      application/json:
        schema:
          type: string
          example: 'example string'
```

The example may be provided at the response level as a sibling to the schema object.

```yaml
responses:
  200:
    content:
      application/json:
        schema:
          type: string
        example: 'example string'
```
