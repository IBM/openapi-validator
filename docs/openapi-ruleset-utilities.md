# @ibm-cloud/openapi-ruleset-utilities

This package provides utilities for working with OpenAPI 3.x definitions
in the context of a Spectral ruleset.

## Constants

### `collections`

A group of predefined "collections" of OpenAPI locations to validate,
to be re-used by multiple rules.

#### Members
- **`collections.operations`**: locations of operation definitions
- **`collections.parameters`**: locations of parameter definitions; this does not include `components.parameters` because this
collection should be used with `resolved` set to `true` and we want to avoid duplication.
- **`collections.patchOperations`**: locations of patch operation definitions
- **`collections.paths`**: locations of path definitions
- **`collections.requestBodySchemas`**: locations of top-level request body schema definitions
- **`collections.responseSchemas`**: locations of top-level response schema definitions
- **`collections.schemas`**: locations where schemas are used; this does not include `components.schemas` because this
collection should be used with `resolved` set to `true` and we want to avoid duplication.
- **`collections.securitySchemes`**: locations of security scheme definitions
- **`collections.unresolvedRequestBodySchemas`**: locations of request body schema definitions within an unresolved API definition
- **`collections.unresolvedResponseSchemas`**: locations of response schema definitions within an unresolved API definition
- **`collections.unresolvedSchemas`**: locations of schema definitions could be defined within an unresolved API definition

### `SchemaType`

An enumeration of non-mutually-exclusive schema types.

Types present in this enumeration may expand over time, so consuming code should not assume that
it is comprehensive as it currently exists. In general, a type should be included in this
enumeration if it requires special handling by a client (for example, if it needs to be mapped
to a specific language type or data structure in an SDK).

#### Members
- **`SchemaType.ARRAY`**: Schemas with an explicit `array` type or including an `items` keyword
- **`SchemaType.BINARY`**: Schemas with an explicit `string` type and `binary` format
- **`SchemaType.BOOLEAN`**: Schemas with an explicit `boolean` type
- **`SchemaType.BYTE`**: Schemas with an explicit `string` type and `byte` format
- **`SchemaType.DATE`**: Schemas with an explicit `string` type and `date` format
- **`SchemaType.DATE_TIME`**: Schemas with an explicit `string` type and `date-time` format
- **`SchemaType.DOUBLE`**: Schemas with an explicit `number` type and `double` format
- **`SchemaType.ENUMERATION`**: Schemas with an explicit `string` type and including an `enum` keyword
- **`SchemaType.FLOAT`**: Schemas with an explicit `number` type and `float` format
- **`SchemaType.INT32`**: Schemas with an explicit `integer` type and `int32` format
- **`SchemaType.INT64`**: Schemas with an explicit `integer` type and `int64` format
- **`SchemaType.INTEGER`**: Schemas with an explicit `integer` type
- **`SchemaType.NUMBER`**: Schemas with an explicit `number` type
- **`SchemaType.OBJECT`**: Schemas with an explicit `object` type or including a `properties`, `additionalProperties`, or
`patternProperties` keyword
- **`SchemaType.STRING`**: Schemas with an explicit `string` type
- **`SchemaType.UNKNOWN`**: Schemas not matching any other type criteria


## Functions

### `collectFromComposedSchemas(schema, collector, includeSelf, includeNot)`

Returns an array of items collected by the provided `collector(schema) => item[]` function for a
simple or composite schema, and deduplicates primitives in the result. The collector function is
not run for `null` or `undefined` schemas.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object
- **`collector`** `<function>`: a `(schema) => item[]` function to collect items from each simple schema
- **`includeSelf`** `<boolean>`: collect from the provided schema in addition to its composed schemas (defaults to `true`)
- **`includeNot`** `<boolean>`: collect from schemas composed with `not` (defaults to `false`)

#### Returns `Array`: collected items

### `getExamplesForSchema(schema)`

Returns an array of examples for a simple or composite schema. For each composed schema, if
`schema.examples` is present (and an array), `schema.example` is ignored.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `Array`: examples

### `getPropertyNamesForSchema(schema, propertyFilter)`

Returns an array of property names for a simple or composite schema,
optionally filtered by a lambda function.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object
- **`propertyFilter`** `<function>`: a `(propertyName, propertySchema) => boolean` function to perform filtering

#### Returns `Array`: property names

### `getSchemaType(schema)`

Returns a symbol from `SchemaType` based on the most specific schema type detected for a schema.

This function is a heuristic and does not attempt to account for contradictions or schemas which
give no consistent indication of type. It also does not attempt to account for `type` and
`format` defined separately across a composite schema.

WARNING: Code consuming this function should assume that a more specific value for a particular
schema might be returned in the future.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `symbol`: a symbol from `SchemaType`

### `schemaIsOfType(schema, type)`

Check whether a schema is of a specific type. This means that one of the following must be true:
1. `schema`'s type field is a string and is equal to `type`.
2. `schema`'s type field is a list and contains `type`.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object
- **`type`** `<string>`: the type value to check

#### Returns `boolean`

### `isArraySchema(schema)`

Returns `true` for an array schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isBinarySchema(schema)`

Returns `true` for an arbitrary octet sequence binary schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isBooleanSchema(schema)`

Returns `true` for a boolean schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isByteSchema(schema)`

Returns `true` for a base64-encoded byte string schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isDateSchema(schema)`

Returns `true` for a date schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isDateTimeSchema(schema)`

Returns `true` for a date-time schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isDoubleSchema(schema)`

Returns `true` for a double (IEEE 754 64-bit floating point value) schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isEnumerationSchema(schema)`

Returns `true` for a string enumeration schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isFloatSchema(schema)`

Returns `true` for a double (IEEE 754 32-bit floating point value) schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isInt32Schema(schema)`

Returns `true` for an int32 (32-bit signed "short") schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isInt64Schema(schema)`

Returns `true` for an int64 (64-bit signed "long") schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isIntegerSchema(schema)`

Returns `true` for an integer (32-bit, 64-bit, or ambiguous format) schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isNumberSchema(schema)`

Returns `true` for a number (32-bit, 64-bit, or ambiguous format floating point) schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isObjectSchema(schema)`

Returns `true` for an object schema.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isStringSchema(schema)`

Returns `true` for a string schema of any format.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isPrimitiveSchema(schema)`

Returns `true` for a primitive schema (anything encoded as a JSON string, number, or boolean).

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object

#### Returns `boolean`

### `isObject(thing)`

Returns `true` if `thing` is a non-`null` object and not an array.

#### Parameters

- **`thing`** `<any>`: input to check

#### Returns `boolean`

### `schemaHasConstraint(schema, hasConstraint)`

This function will return `true` if all possible variations of a (possibly composite) schema
enforce a constraint, as checked by a `(schema) => boolean` function which checks for the
constraint on a simple (non-composite) schema. It does this by recursively checking if:

- a schema has the constraint itself, or
- any of the schemas it composes with `allOf` has the constraint, or
- all of the schemas it composes with `oneOf` have the constraint, or
- all of the schemas it composes with `anyOf` have the constraint

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object
- **`hasConstraint`** `<function>`: a `(schema) => boolean` function to check for a constraint

#### Returns `boolean`

### `schemaHasProperty(schema, propertyName)`

This function will return `true` if all possible variations of a (possibly composite) schema
define a property with the specified name.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object
- **`propertyName`** `<string>`: name of the object schema property to check for

#### Returns `boolean`

### `schemaLooselyHasConstraint(schema, hasConstraint)`

This function is a looser adaptation of the `schemaHasConstraint()` function.
Here, we process `oneOf` and `anyOf` lists the same as `allOf`, returning `true` if:

- a schema has the constraint itself, or
- any of the schemas it composes with `allOf` has the constraint, or
- any of the schemas it composes with `oneOf` has the constraint, or
- any of the schemas it composes with `anyOf` has the constraint

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object
- **`hasConstraint`** `<function>`: a `(schema) => boolean` function to check for a constraint

#### Returns `boolean`

### `schemaRequiresProperty(schema, propertyName)`

This function will return `true` if all possible variations of a (possibly composite) schema
require a property with the specified name. Note that this method may not behave as expected
for OpenAPI documents where a `required` property is not defined under the `properties` keyword.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object
- **`propertyName`** `<object>`: name of the object schema property to check for

#### Returns `boolean`

### `validateComposedSchemas(schema, path, validate, includeSelf, includeNot)`

Performs validation on a schema and all of its composed schemas.

This function is useful when a certain syntactic practice is prescribed or proscribed within
every simple schema composed by a schema.

For example, if a rule enforced that non-`false` `additionalProperties` and `patternProperties`
keywords were never to be used in a top-level request body object schema, this function could run
that validation on every composed schema independently.

Composed schemas are those referenced by `allOf`, `anyOf`, `oneOf`, or `not`, plus all schemas
composed by those schemas.

Composed schemas **do not** include nested schemas (`property`, `additionalProperties`,
`patternProperties`, and `items` schemas).

WARNING: It is only safe to use this function for a "resolved" schema — it cannot traverse `$ref`
references.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object
- **`path`** `<Array>`: path array for the provided schema
- **`validate`** `<function>`: a `(schema, path) => errors` function to validate a simple schema
- **`includeSelf`** `<boolean>`: validate the provided schema in addition to its composed schemas (defaults to `true`)
- **`includeNot`** `<boolean>`: validate schemas composed with `not` (defaults to `true`)

#### Returns `Array`: validation errors

### `validateNestedSchemas(schema, path, validate, includeSelf, includeNot)`

Performs validation on a schema and all of its nested schemas.

This function is useful when a certain semantic quality is required for every composite schema
nested by a schema. The `validate` function passed to this function must itself be
"composition-aware." Usually this means it will use other utilities (such as `getSchemaType()` or
`schemaHasConstraint()`) to determine the semantic qualities of a composite schema.

For example, if a rule enforced that all of an object schema's properties be required, this
function could be passed a validation function that itself used the composition-aware
`getPropertyNamesForSchema()` and `schemaRequiresProperty()`.

Nested schemas include `property`, `additionalProperties`, and `patternProperties` schemas
(for an object schema), `items` schemas (for an array schema), plus all nested schemas of those
schemas.

Nested schemas included via `allOf`, `oneOf`, and `anyOf` are validated, but composed schemas
are not themselves validated. By default, nested schemas included via `not` are not validated.

WARNING: It is only safe to use this function for a "resolved" schema — it cannot traverse `$ref`
references.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object
- **`path`** `<Array>`: path array for the provided schema
- **`validate`** `<function>`: a `(schema, path) => errors` function to validate a simple schema
- **`includeSelf`** `<boolean>`: validate the provided schema in addition to its nested schemas (defaults to `true`)
- **`includeNot`** `<boolean>`: validate schemas composed with `not` (defaults to `false`)

#### Returns `Array`: validation errors

### `validateSubschemas(schema, path, validate, includeSelf, includeNot)`

Performs validation on a schema and all of its subschemas.

This function is useful when a certain syntactic practice is prescribed or proscribed within
every simple schema composed and/or nested by a schema.

For example, if a rule enforced that the `format` keyword must only appear directly alongside the
`type` keyword (rather than being indirectly composed together with a `type`), this function
could run that validation on every simple schema independently.

Subschemas include property schemas, 'additionalProperties', and 'patternProperties' schemas
(for an object schema), 'items' schemas (for an array schema), and applicator schemas
(such as those in an 'allOf', 'anyOf' or 'oneOf' property), plus all subschemas
of those schemas.

WARNING: It is only safe to use this function for a "resolved" schema — it cannot traverse `$ref`
references.

#### Parameters

- **`schema`** `<object>`: simple or composite OpenAPI 3.x schema object
- **`path`** `<Array>`: path array for the provided schema
- **`validate`** `<function>`: a `(schema, path) => errors` function to validate a simple schema
- **`includeSelf`** `<boolean>`: validate the provided schema in addition to its subschemas (defaults to `true`)
- **`includeNot`** `<boolean>`: validate schemas composed with `not` (defaults to `true`)

#### Returns `Array`: validation errors

