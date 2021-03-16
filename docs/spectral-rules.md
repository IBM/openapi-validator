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
