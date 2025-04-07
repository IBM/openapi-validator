/**
 * Copyright 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  schemaHasProperty,
  getNodes,
} = require('@ibm-cloud/openapi-ruleset-utilities');

const {
  LoggerFactory,
  computeRefsAtPaths,
  getCanonicalSchemaForPath,
  getRequestBodySchemaForOperation,
  getResourceOrientedPaths,
  getSchemaNameAtPath,
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
 * - ibm-schema-casing-convention: schema names use upper camel case
 */

module.exports = function schemaNames(apidef, options, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return checkSchemaNames(apidef, getNodes(context));
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
  const resourceOrientedPaths = getResourceOrientedPaths(apidef);

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

    const { canonicalSchemaName } = getCanonicalSchemaForPath(
      specificPath,
      apidef,
      pathToReferencesMap,
      {
        logger,
        ruleId,
      }
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
