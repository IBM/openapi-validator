# Custom Spectral Rules

This document outlines the custom Spectral rules implemented in `ibm:oas` ruleset.

## content-entry-provided

Checks for `content` entry for all request bodies and non-204 responses.

**Bad Example**

```yaml
responses:
  200:
    description: 'example error description`
```

**Good Example**

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

**Default Severity**: warn

## content-entry-contains-schema

Any request or response body that has `content` should contain a schema.

**Bad Example**

```yaml
responses:
  200:
    content:
      application/json:
        # schema not provided
```

**Good Example**

```yaml
responses:
  200:
    content:
      application/json:
        schema:
          type: string
```

**Default Severity**: warn

## ibm-content-type-is-specific

Should avoid the use of `*/*` content type unless the API actually supports all content types. When the API does support all content types, this warning should be ignored.

**Bad Example**

```yaml
responses:
  200:
    content:
      '*/*':
```

**Good Example**

```yaml
responses:
  200:
    content:
      'application/json':
        ...
      'text/plain':
        ...
```

**Default Severity**: warn

## ibm-error-content-type-is-json

An error response likely returns `application/json` and this rule warns when `application/json` is not the content type. This rule should be ignored when the API actually returns an error response that is not `application/json`.

**Bad Example**

```yaml
responses:
  400:
    content:
      'application/octet-stream':
```

**Good Example**

```yaml
responses:
  400:
    content:
      'application/json':
```

**Default Severity**: warn

## ibm-sdk-operations

Validates the structure of the `x-sdk-operations` object using [this JSON Schema document](/src/spectral/schemas/x-sdk-operations.json).

**Default Severity**: warn

## major-version-in-path

Validates that every path contains a path segment for the API major version, of the form `v<n>`, and that all paths have the same major version segment. The major version can appear in either the server URL (oas3), the basePath (oas2), or in each path entry.

**Default Severity**: warn

## response-error-response-schema

`4xx` and `5xx` error responses should provide good information to help the user resolve the error. The error response validations are based on the design principles outlined in the [errors section of the IBM API Handbook](https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-errors). The `response-error-response-schema` rule is more lenient than what is outlined in the handbook. Specifically, the `response-error-response-schema` rule does not require an Error Container Model and allows for a single Error Model to be provided at the top level of the error response schema or in an `error` field.

**Default Severity**: warn

## parameter-schema-or-content

Parameters must provide either a schema or content object.

**Bad Example**

```yaml
parameters:
- name: param1
  in: query
  description: query param
```

**Good Example**

```yaml
parameters:
- name: param1
  in: query
  description: query param
  schema:
    type: string
```

**Default Severity**: error

## request-body-object

Request bodies should be objects.

**Bad Example**

```yaml
requestBody:
  content:
    application/json:
      schema:
        type: string
```

**Good Example**

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

**Default Severity**: warn

## response-example-provided

Response examples are used to generate documentation. To improve the generated documentation, response examples should be provided in the schema object or "next to" the schema object.

**Bad Example**

```yaml
responses:
  200:
    content:
      application/json:
        schema:
          type: string
```

**Good Example**

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

**Good Example**

The example may be provided at the response level "next to" the schema object.

```yaml
responses:
  200:
    content:
      application/json:
        schema:
          type: string
        example: 'example string'
```

**Default Severity**: warn
