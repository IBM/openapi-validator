const {
  isPrimitiveSchema,
  validateSubschemas,
  getCompositeSchemaAttribute,
  getSchemaType,
  isObjectSchema,
  isArraySchema,
  isObject,
  mergeAllOfSchemaProperties,
  SchemaType
} = require('../utils');

let unresolvedSpec;
module.exports = function(schema, opts, context) {
  unresolvedSpec = context.document.parserResult.data;
  return validateSubschemas(schema, context.path, composedSchemaRestrictions);
};

/**
 * This function checks "schema" to make sure that if it's a composed schema
 * using oneOf or anyOf that it complies with the restrictions imposed by the
 * SDK generator.
 * The specific checks that are performed here are:
 * 1. Any schema that is a primitive or an array, or contains no oneOf or anyOf
 *    is skipped (automatically passes).
 * 2. A schema's oneOf or anyOf list must contain only object schemas.
 *    Any non-object schema is rejected.
 * 3. The union of the properties defined by the main schema and its
 *    oneOf/anyOf sub-schemas is examined to detect any duplicates.
 *    Duplicate properties with different types are rejected.
 *
 * @param {*} schema the schema to check
 * @param {*} path the array of path segments indicating the location of "schema" within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function composedSchemaRestrictions(schema, path) {
  // We're mainly interested in object schemas within this validation rule.
  // If "schema" is a primitive, then the SDK generator will unconditionally
  // replace it with an equivalent schema without the oneOf/anyOf list,
  // so nothing more to check for that scenario.
  // If "schema" is an array schema, then it can't have an allOf/oneOf/anyOf list,
  // so this scenario is not interesting either (the array's "items" field will be
  // validated separately).
  if (isPrimitiveSchema(schema) || isArraySchema(schema)) {
    return [];
  }

  // Next, we'll look for oneOf and then anyOf.  Only one should be present.
  let subSchemas = getCompositeSchemaAttribute(schema, 'oneOf');
  let fieldName = 'oneOf';
  if (!isNonemptyArray(subSchemas)) {
    subSchemas = getCompositeSchemaAttribute(schema, 'anyOf');
    fieldName = 'anyOf';
  }

  // If we found neither oneOf nor anyOf, then bail out now.
  if (!isNonemptyArray(subSchemas)) {
    return [];
  }

  // Next, we need to verify that it's oneOf/anyOf list complies.
  return checkSchemaList(schema, subSchemas, fieldName, path);
}

/**
 * This function checks "schema" and it's oneOf/anyOf list "subSchemas" to verify that
 * it complies with the generator restrictions around the use of oneOf/anyOf.
 * @param {*} schema the main schema to check
 * @param {*} subSchemas the oneOf or anyOf list belonging to "schema"
 * @param {*} fieldName the name of the field containing "subSchemas" within "schema" ('oneOf' or 'anyOf')
 * @param {*} path the array of path segments indicating the location of "schema" within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function checkSchemaList(schema, subSchemas, fieldName, path) {
  const errors = [];

  schema = mergeAllOfSchemaProperties(schema);

  // "targetProperties" will initially contain the properties defined in the main schema,
  // then we'll add each property from the subSchemas to it to simulate the SDK generator's
  // handling of the oneOf/anyOf list (hybrid hierarchy mode).
  const targetProperties = isObject(schema.properties)
    ? copyObject(schema.properties)
    : {};

  for (let i = 0; i < subSchemas.length; i++) {
    const s = mergeAllOfSchemaProperties(subSchemas[i]);

    // "s" should be an object schema. If not, return an error.
    if (!isObjectSchema(s)) {
      errors.push({
        message: 'A schema within a oneOf/anyOf list must be an object schema',
        path: [...path, fieldName, i.toString()]
      });
    } else {
      // "s" is an object schema as expected, so let's check each of its properties.
      const properties = isObject(s.properties) ? s.properties : {};
      for (const [name, prop] of Object.entries(properties)) {
        const targetProp = targetProperties[name];
        if (targetProp) {
          // If "targetProperties" contains a like-named property, make sure the types are compatible.
          // We can only guess at the paths associated with target and sub-schema properties
          // due to the allOf processing that needs to be performed on each schema.
          const propsAreCompatible = propsHaveCompatibleTypes(
            targetProp,
            [...path, 'properties', name],
            prop,
            [...path, fieldName, i, 'properties', name]
          );
          if (!propsAreCompatible) {
            const error = {
              message: `Duplicate property with incompatible type defined in schema within a oneOf/anyOf list: ${name}`,
              path: [...path, fieldName, i.toString()]
            };
            errors.push(error);
          }
        } else {
          // Property doesn't exist in main schema, so just add it.
          targetProperties[name] = prop;
        }
      }
    }
  }

  return errors;
}

/**
 * Returns true iff "s" is an array with at least one element.
 * @param {} s the object to check
 * @returns boolean
 */
function isNonemptyArray(s) {
  return Array.isArray(s) && s.length;
}

/**
 * Performs a rudimentary deep copy by simply marshalling, then unmarshalling "obj".
 * @param {*} obj the object to copy
 * @returns a deep copy of "obj"
 */
function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * This function is a wrapper around the "getSchemaType()" utility that maps
 * the "ENUMERATION" type to be "STRING". We need to do this mapping to ensure that
 * the type-compatibility checks will work correctly.
 * @param {} s the schema
 * @returns SchemaType enum value
 */
function getType(s) {
  const schemaType = getSchemaType(s);
  return schemaType === SchemaType.ENUMERATION ? SchemaType.STRING : schemaType;
}

/**
 * Returns true iff properties "p1" and "p2" have the same type.
 * @param {*} p1 the first property to compare
 * @param {*} p2 the second property to compare
 * @returns boolean
 */
function propsHaveCompatibleTypes(p1, path1, p2, path2) {
  if (isArraySchema(p1) && isArraySchema(p2)) {
    return propsHaveCompatibleTypes(p1.items, [...path1, 'items'], p2.items, [
      ...path2,
      'items'
    ]);
  }

  const type1 = getType(p1);
  const type2 = getType(p2);

  // If p1 and p2 are object schemas, then in order for them to be
  // compatible in the context of this rule, they must have been defined
  // with the same $ref within the original unresolved API definition.
  // Unfortunately, we're using the resolved API def and so the $ref's have
  // been resolved. To accommodate this, we'll try to "unresolve" the path
  // associated with each of the properties to try to find the original object
  // within the unresolved spec.
  // If we're able to "unresolve" both properties, then we'll take the position
  // that they SHOULD have a $ref and the $refs should be the same in order to
  // declare the two properties compatible.
  // If we're unable to unresolve one property or the other (which is not unexpected
  // due to the rudimentary unresolver), then the next best thing would be to compare
  // the JSON-stringified versions of p1 and p2 and if they are in fact exactly the same,
  // we can make a (hopefully educated) guess that they originated from the same $ref.
  if (type1 === SchemaType.OBJECT && type2 === SchemaType.OBJECT) {
    // Unresolve each path to find the original object in the unresolved spec.
    const p1Orig = unresolvePath(path1, unresolvedSpec);
    const p2Orig = unresolvePath(path2, unresolvedSpec);

    if (p1Orig && p2Orig) {
      // If both properties have a $ref field, then we'll compare them.
      if (p1Orig.$ref && p2Orig.$ref) {
        return p1Orig.$ref === p2Orig.$ref;
      } else {
        // We unresolved both paths successfully, but one or both of the original
        // objects lacks a $ref field, so the properties are NOT compatible.
        return false;
      }
    }

    // Just compare their JSON strings.
    const p1String = JSON.stringify(p1);
    const p2String = JSON.stringify(p2);
    return p1String === p2String;
  }

  // For non-object types, just compare the actual type values.
  return type1 === type2;
}

/**
 * This function will try to "unresolve" the specified path (i.e. find the object
 * corresponding to "resolvedPath" within the (original) unresolved API definition).
 *
 * The overall approach taken by this function is the following:
 * Given the unresolved spec and a jsonpath from the resolved spec, the function
 * will traverse the unresolved spec, one path segment at a time.  At each hop,
 * if the current object contains a $ref, then the "cursor" is changed from its current
 * position (where the $ref was found) to the object referenced by the $ref.  Then the traveral
 * continues with the next path segment.  Once we've exhausted the path segments, the final
 * cursor postion is the desired object.
 * This algorithm isn't foolproof:
 * 1. The algorithm doesn't support external references.
 * 2. "resolvedPath" may point to an object that has had allOf processing performed on it, therefore
 * it might not be possible to find the corresponding object within the unresolved spec.
 * 3. At any point if we're unable to traverse to the next path segment, we simply give up.
 *
 * @param {*} resolvedPath an array of path segments that specifies the location of
 * an object within the resolved API definition.
 * For example, for a scenario like the following:
 *    components:
 *      schemas:
 *        Foo:
 *          properties:
 *            foo:
 *              $ref: '#/components/schemas/Bar'
 *        Bar:
 *          properties:
 *            bar:
 *              type: string
 * the path ['components', 'schemas', 'Foo', 'properties', 'foo', 'properties', 'bar'] would
 * be mapped to the "bar" property within the Bar schema.
 * @param {*} spec the unresolved API definition
 * @returns the object within the unresolved API definition that corresponds to the
 * object located at "resolvedPath" within the resolved API definition, or undefined if
 * the mapping failes
 */
function unresolvePath(resolvedPath, spec) {
  // Start our journey at the root of the unresolvedSpec.
  let cursor = spec;

  for (const pathSeg of resolvedPath) {
    // Make sure we're currently at a valid node in the document.
    if (!cursor) {
      return undefined;
    }

    // If "cursor" is a $ref, then move to the referenced object before
    // traversing to the "pathSeg" segment.
    if (cursor.$ref) {
      // Convert the reference to a jsonpath
      // (e.g. '#/components/schemas/Bar' --> ['components', 'schemas', 'Bar'])
      const newPath = refToPath(cursor.$ref);
      if (!newPath || !newPath.length) {
        return undefined;
      }

      // Reset our cursor to the referenced object.
      cursor = objectAtLocation(spec, newPath);
      if (!cursor) {
        return undefined;
      }
    }

    // Finally, take the next step in the path by traversing to the "pathSeg" segment.
    cursor = objectAtLocation(cursor, [pathSeg]);
  }

  return cursor;
}

/**
 * Starting at "rootObject", traverse to the object indicated by "path".
 * @param {*} rootObject an object to be traversed
 * @param {*} path an array of path segments indicating the location of the object
 * (e.g. ['components', 'schemas', 'Foo', 'properties', 'foo'])
 * @returns the object located at "path" or undefined if not found
 */
function objectAtLocation(rootObject, path) {
  let obj = rootObject;
  for (const segment of path) {
    if (Array.isArray(obj)) {
      const index = typeof segment === 'number' ? segment : parseInt(segment);
      obj = obj[index];
    } else {
      obj = obj[segment];
    }

    if (!obj) {
      return undefined;
    }
  }

  return obj;
}

/**
 * Returns the path for the specified internal reference.
 * @param {*} ref the reference (e.g. '#/components/schemas/Foo')
 * @returns an array of path segments (e.g. ['components', 'schemas', 'Foo'])
 * or undefined if "ref" is not an internal reference.
 */
function refToPath(ref) {
  const parts = ref.split('#');

  // Make sure that "ref" is an internal $ref.
  const filename = parts[0] ? parts[0].trim() : undefined;
  if (filename) {
    return undefined;
  }

  return parts[1].split('/').slice(1);
}
