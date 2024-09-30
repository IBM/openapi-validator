/**
 * Copyright 2023 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

/**
 * Takes a resolved path to a schema and un-resolves it to the format in which
 * it will be stored in the graph nodes map by Spectral. The nodes provide a
 * map from resolved path locations to the locations in 'components' they
 * reference (if there is a reference at that location). Each path will be
 * resolved to their nearest parent. For example if a request body schema
 * references a schema in components, there will be an entry mapping the path
 * to the request body schema to the schema path in components - but if that
 * referenced schema has a property defined by a reference to another schema,
 * there will not be an entry in the map including the path leading through
 * the request body to the sub-property, there will be an entry mapping from
 * the location of the schema in components. Here are example entries:
 * - paths./v1/things.post.requestBody.content.application/json.schema:
 *     components.schemas.ThingPrototype
 * - components.schemas.ThingPrototype.properties.data:
 *     components.schemas.DataObject
 *
 * The purpose of this function is to take the fully resolved path (in the
 * example above, something like 'paths./v1/things.post.requestBody.content.
 * application/json.schema.properties.data') and un-resolve enough that it
 * will match the format Spectral uses in nodes (e.g. 'components.schemas.
 * ThingPrototype.properties.data').
 *
 * @param {string} path - the resolved JSON path to a schema, as a dot-separated string
 * @param {object} pathToReferencesMap - the graph nodes map from Spectral, which has
 *                                       been sanitzed for our purposes. it maps referenced
 *                                       schema locations to their reference location.
 * @returns {string} - the name of the referenced schema at a given path, or undefined
 */
function getSchemaNameAtPath(path, pathToReferencesMap) {
  if (!path || typeof path !== 'string') {
    return;
  }

  // Build the path, replacing each path that resolves to a reference with the
  // referenced path in order to match the expected format in the
  // pathToReferencesMap (which comes from graph nodes that Spectral gives us).
  // See the function documentation above for more info.
  let pathBuilder = '';
  const pathSegments = path.split('.');

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    if (pathBuilder) {
      pathBuilder += '.';
    }

    pathBuilder += `${segment}`;
    const schemaReference = pathToReferencesMap[pathBuilder];

    // If it is the last time through the loop, we should definitely
    // find a schema reference - but we don't want to throw away the
    // path. We'll find the reference again at the end of this function.
    const lastTimeThrough = i === pathSegments.length - 1;
    if (schemaReference && !lastTimeThrough) {
      pathBuilder = schemaReference;
    }
  }

  return getSchemaNameFromReference(pathToReferencesMap[pathBuilder]);
}

/**
 * Takes a path to a referenced schema (as a string) and extracts the last element,
 * which will be the name of the schema.
 *
 * Note: This is just an internal helper for the above function.
 *
 * @param {string} reference - the ref value as a dot-separated string (e.g. 'components.schemas.Thing')
 * @returns {string} - the name of the schema (e.g. 'Thing')
 */
function getSchemaNameFromReference(reference) {
  if (!reference || typeof reference !== 'string') {
    return;
  }

  return reference.split('.').at(-1);
}

module.exports = getSchemaNameAtPath;
