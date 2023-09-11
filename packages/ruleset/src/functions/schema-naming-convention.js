/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { schemaHasProperty } = require('@ibm-cloud/openapi-ruleset-utilities');

const {
  LoggerFactory,
  getRequestBodySchemaForOperation,
  getResourceSpecificSiblingPath,
  getSuccessResponseSchemaForOperation,
} = require('../utils');

let ruleId;
let logger;

/**
 * The implementation for this rule makes assumptions that are dependent on the
 * presence of the following other rules:
 *
 * - ibm-request-and-response-content: all request bodies and relevant success
 *   responses define content objects
 *
 * - ibm-content-contains-schema: the content objects define schemas
 *
 * - ibm-avoid-inline-schemas: all schemas are named (defined with references)
 *
 * - ibm-collection-array-property: the presence and correct name of the
 *   property in a collection schema that holds the resource list
 *
 * - (yet to be developed): schema names use upper camel case
 */

module.exports = function schemaNames(apidef, options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return checkSchemaNames(apidef, context.documentInventory.graph.nodes);
};

/**
 * This function checks for most of the API Handbook's schema naming conventions.
 * For each pair of resource-oriented paths, it determines the name of the
 * canonical schema, then checks the name of the collection schema, collection
 * schema resource list property items schema, creation schemas, and patch schema
 * against the canonical schema to ensure they are appropriately named.
 *
 * The conventions we are unable to cover in this rule are:
 * - The name of the canonical schema relative to the path segments (pluralization is
 *   too difficult of a problem to solve for in a robust way)
 * - The names of Identity or Reference schemas (no solid heuristic for determining these)
 *
 * @param {*} apidef the entire, resolved API definition as an object
 * @param {*} nodes the spectral-computed graph nodes mapping paths to referenced schemas
 * @returns an array containing the violations found or [] if no violations
 */
function checkSchemaNames(apidef, nodes) {
  const pathToReferencesMap = computeRefsAtPaths(nodes);
  const resourceOrientedPaths = collectResourceOrientedPaths(apidef);

  if (Object.keys(resourceOrientedPaths).length === 0) {
    logger.debug(`${ruleId}: no resource-oriented paths found, skipping rule`);
  }

  const errors = [];

  for (const [genericPath, specificPath] of Object.entries(
    resourceOrientedPaths
  )) {
    logger.debug(
      `${ruleId}: found resource path pair: "${genericPath}" and "${specificPath}"`
    );

    // Look for the canonical schema by checking the GET operation on the
    // resource-specific path. If we can't find it, we'll exit because we'll
    // have no basis of comparison for the other schema names.
    const canonicalSchemaInfo = getSuccessResponseSchemaForOperation(
      apidef.paths[specificPath].get,
      `paths.${specificPath}.get`
    );

    const canonicalSchemaPath = canonicalSchemaInfo.schemaPath;
    logger.debug(
      `${ruleId}: found the path to the canonical schema to be ${canonicalSchemaPath}`
    );

    const canonicalSchemaName = getSchemaNameAtPath(
      canonicalSchemaPath,
      pathToReferencesMap
    );
    logger.debug(
      `${ruleId}: found the name of the canonical schema to be ${canonicalSchemaName}`
    );

    // If we can't find the canonical schema,
    // don't perform the rest of the checks.
    if (!canonicalSchemaName) {
      continue;
    }

    // 2. Collection schemas
    const collectionSchemaInfo = getSuccessResponseSchemaForOperation(
      apidef.paths[genericPath].get,
      `paths.${genericPath}.get`
    );

    const collectionSchemaPath = collectionSchemaInfo.schemaPath;
    logger.debug(
      `${ruleId}: found the path to the collection schema to be ${collectionSchemaPath}`
    );

    if (collectionSchemaPath) {
      const collectionSchemaName = getSchemaNameAtPath(
        collectionSchemaPath,
        pathToReferencesMap
      );
      logger.debug(
        `${ruleId}: found the name of the collection schema to be ${collectionSchemaName}`
      );

      // 2a) Check the name of the collection schema itself
      if (
        collectionSchemaName &&
        collectionSchemaName !== `${canonicalSchemaName}Collection`
      ) {
        logger.debug(
          `${ruleId}: error! collection schema does not follow conventions`
        );

        errors.push({
          message: `Collection schema for path '${genericPath}' should use the name: ${canonicalSchemaName}Collection`,
          path: collectionSchemaPath.split('.'),
        });
      }

      // Locate the actual schema in order to check its list property.
      const collectionSchema = collectionSchemaPath
        .split('.')
        .reduce(
          (openApiArtifact, pathElement) => openApiArtifact[pathElement],
          apidef
        );

      if (collectionSchema) {
        logger.debug(`${ruleId}: found collection schema object`);

        // The name of the array property should match the last segment of the
        // generic path. We already check for this in `ibm-collection-array-property`.
        const resourceListPropName = genericPath.split('/').at(-1);
        logger.debug(
          `${ruleId}: expecting the resource list property to be called ${resourceListPropName}`
        );

        if (schemaHasProperty(collectionSchema, resourceListPropName)) {
          logger.debug(
            `${ruleId}: found resource list property named ${resourceListPropName}`
          );

          const resourceListSchemaPath = computePathToProperty(
            resourceListPropName,
            collectionSchemaPath,
            collectionSchema
          );
          logger.debug(
            `${ruleId}: found the path to the resource list property to be ${resourceListSchemaPath}`
          );

          const listPropItemsSchemaPath = `${resourceListSchemaPath}.items`;
          logger.debug(
            `${ruleId}: found the path to the resource list property items to be ${listPropItemsSchemaPath}`
          );

          const listPropItemsSchemaName = getSchemaNameAtPath(
            listPropItemsSchemaPath,
            pathToReferencesMap
          );
          logger.debug(
            `${ruleId}: found the name of the resource list property items schema to be ${listPropItemsSchemaName}`
          );

          if (
            listPropItemsSchemaName &&
            listPropItemsSchemaName !== canonicalSchemaName &&
            listPropItemsSchemaName !== `${canonicalSchemaName}Summary`
          ) {
            logger.debug(
              `${ruleId}: reporting error! list prop in collection is wrong`
            );
            errors.push({
              message: `Items schema for collection resource list property '${resourceListPropName}' should use the name: ${canonicalSchemaName} or ${canonicalSchemaName}Summary`,
              path: listPropItemsSchemaPath.split('.'),
            });
          }
        }
      }
    }

    // 3. Prototype schema
    // 3a) post
    const postRequestSchemaInfo = getRequestBodySchemaForOperation(
      apidef.paths[genericPath].post,
      `paths.${genericPath}.post`
    );

    const postRequestSchemaPath = postRequestSchemaInfo.schemaPath;
    logger.debug(
      `${ruleId}: found the path to the prototype schema (for post) to be ${postRequestSchemaPath}`
    );

    if (postRequestSchemaPath) {
      const postRequestSchemaName = getSchemaNameAtPath(
        postRequestSchemaPath,
        pathToReferencesMap
      );
      logger.debug(
        `${ruleId}: found the name of the prototype schema (for post) to be ${postRequestSchemaName}`
      );

      if (
        postRequestSchemaName &&
        postRequestSchemaName !== `${canonicalSchemaName}Prototype` &&
        // The API Handbook makes an exception for cases where the canonical
        // schema itself should be used for creation
        postRequestSchemaName !== canonicalSchemaName
      ) {
        logger.debug(`${ruleId}: reporting error! post prototype is wrong`);
        errors.push({
          message: `Prototype schema (POST request body) for path '${genericPath}' should use the name: ${canonicalSchemaName}Prototype`,
          path: postRequestSchemaPath.split('.'),
        });
      }
    }

    // 3a) put
    const putRequestSchemaInfo = getRequestBodySchemaForOperation(
      apidef.paths[specificPath].put,
      `paths.${specificPath}.put`
    );

    const putRequestSchemaPath = putRequestSchemaInfo.schemaPath;
    logger.debug(
      `${ruleId}: found the path to the prototype schema (for put) to be ${putRequestSchemaPath}`
    );

    if (putRequestSchemaPath) {
      const putRequestSchemaName = getSchemaNameAtPath(
        putRequestSchemaPath,
        pathToReferencesMap
      );
      logger.debug(
        `${ruleId}: found the name of the prototype schema (for put) to be ${putRequestSchemaName}`
      );

      if (
        putRequestSchemaName &&
        putRequestSchemaName !== `${canonicalSchemaName}Prototype` &&
        // The API Handbook makes an exception for cases where the canonical
        // schema itself should be used for creation
        putRequestSchemaName !== canonicalSchemaName
      ) {
        logger.debug(`${ruleId}: reporting error! put prototype is wrong`);
        errors.push({
          message: `Prototype schema (PUT request body) for path '${specificPath}' should use the name: ${canonicalSchemaName}Prototype`,
          path: putRequestSchemaPath.split('.'),
        });
      }
    }

    // 4. Patch schema
    const patchRequestSchemaInfo = getRequestBodySchemaForOperation(
      apidef.paths[specificPath].patch,
      `paths.${specificPath}.patch`
    );

    const patchRequestSchemaPath = patchRequestSchemaInfo.schemaPath;
    logger.debug(
      `${ruleId}: found the path to the patch schema to be ${patchRequestSchemaPath}`
    );

    if (patchRequestSchemaPath) {
      const patchRequestSchemaName = getSchemaNameAtPath(
        patchRequestSchemaPath,
        pathToReferencesMap
      );
      logger.debug(
        `${ruleId}: found the name of the patch schema to be ${patchRequestSchemaName}`
      );

      if (
        patchRequestSchemaName &&
        patchRequestSchemaName !== `${canonicalSchemaName}Patch`
      ) {
        logger.debug(`${ruleId}: reporting error! patch schema is wrong`);
        errors.push({
          message: `Patch schema for path '${specificPath}' should use the name: ${canonicalSchemaName}Patch`,
          path: patchRequestSchemaPath.split('.'),
        });
      }
    }
  }

  return errors;
}

function collectResourceOrientedPaths(apidef) {
  const paths = Object.keys(apidef.paths);
  const pathStore = {};
  paths.forEach(p => {
    // Skip paths that have already been discovered
    if (pathStore[p]) {
      return;
    }

    // This can only receive a value for resource generic paths
    const sibling = getResourceSpecificSiblingPath(p, apidef);
    if (sibling) {
      pathStore[p] = sibling;
    }
  });

  return pathStore;
}

/**
 * Takes the graph nodes object computed by the Spectral resolver and converts
 * it to a new format that is better suited for our purposes. The nodes have
 * extra info we don't need and all of the paths are encoded in a unique way.
 * We need to cut out the fluff, decode the paths, and convert the paths
 * to use the dot-separated standard we employ for paths in our rule functions.
 *
 * @param {object} nodes - graph nodes object computed by the Spectral resolver
 * @returns {object} - the re-formatted object
 */
function computeRefsAtPaths(nodes) {
  const resultMap = {};
  Object.keys(nodes).forEach(source => {
    // We need to ensure our source is a file (except when running tests)
    if (
      source.toLowerCase().endsWith('yaml') ||
      source.toLowerCase().endsWith('yml') ||
      source.toLowerCase().endsWith('json') ||
      source === 'root' // This is necessary for running the tests
    ) {
      const refMap = nodes[source].refMap;

      // Each resolved path to a schema is stored with a path to its referenced
      // schema in 'components'. Sub-schemas within components also have their
      // paths stored with the path to the schema they reference. This gathers
      // the paths, transforming them from Spectral's internal format, and maps
      // them to the name of the schema they reference.
      Object.keys(refMap).forEach(pathWithRef => {
        const path = pathWithRef
          .split('/')
          .map(p => decodeURIComponent(p.replaceAll('~1', '/')))
          .join('.')
          .slice(2);
        resultMap[path] = refMap[pathWithRef].slice(2).replaceAll('/', '.');
      });
    }
  });

  return resultMap;
}

/**
 * Takes an unresolved path to a schema and un-resolves it to the format in which
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
  for (const pathSegment of path.split('.')) {
    if (pathBuilder) {
      pathBuilder += '.';
    }
    pathBuilder += `${pathSegment}`;
    const schemaReference = pathToReferencesMap[pathBuilder];

    // If it is the last time through the loop, we should definitely
    // find a schema reference - but we don't want to throw away the
    // path. We'll find the reference again at the end of this function.
    if (schemaReference && pathSegment !== path.split('.').at(-1)) {
      pathBuilder = schemaReference;
    }
  }

  if (path !== pathBuilder) {
    logger.debug(`${ruleId}: resolved path to be ${pathBuilder}`);
  }

  return getSchemaNameFromReference(pathToReferencesMap[pathBuilder]);
}

/**
 * Takes a path to a referenced schema (as a string) and extracts the last element,
 * which will be the name of the schema.
 *
 * @param {string} reference - the ref value as a dot-separated string (e.g. 'components.schemas.Thing')
 * @returns {string} - the name of the schema (e.g. 'Thing')
 */
function getSchemaNameFromReference(reference) {
  if (!reference || typeof reference !== 'string') {
    return;
  }

  logger.debug(`${ruleId}: getting name from reference ${reference}`);
  return reference.split('.').at(-1);
}

/**
 * Given a property name, a path to a given schema, and that schema object,
 * compute the path to the property definition while handling the potential for
 * composed models (and nested composed models). Returns the first instance it
 * finds.
 *
 * @param {string} name - the name of the property to look for
 * @param {string} path - the resolved JSON path to the schema, as a dot-separated string
 * @param {object} schema - the resolved schema object
 * @returns {string} - the resolved JSON path to the property, as a dot-separated string,
 *                     or `undefined` if the property is not found.
 */
function computePathToProperty(name, path, schema) {
  if (schema.properties && schema.properties[name]) {
    return `${path}.properties.${name}`;
  }

  for (const applicator of ['allOf', 'oneOf', 'anyOf']) {
    if (Array.isArray(schema[applicator])) {
      for (let i = 0; i < schema[applicator].length; i++) {
        const subschema = schema[applicator][i];
        const checkPath = computePathToProperty(
          name,
          `${path}.${applicator}.${i.toString()}`,
          subschema
        );
        if (checkPath && checkPath.endsWith(`properties.${name}`)) {
          return checkPath;
        }
      }
    }
  }
}
