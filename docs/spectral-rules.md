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
