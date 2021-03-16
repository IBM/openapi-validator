# Custom Spectral Rules

This document outlines the custom Spectral rules implemented in `ibm:oas` ruleset.

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
