/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isArraySchema,
  isIntegerSchema,
  isObject,
  isStringSchema,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return checkErrorContainerModelSchema(schema, context.path);
};

/**
 * This function will verify that "schema" complies with the API Handbook's
 * "Errors" section (https://cloud.ibm.com/docs/api-handbook?topic=api-handbook-errors), specifically
 * that it complies with the "Error container model" design requirements.
 * Here are the specific checks that are performed:
 * 1. "schema" contains the "trace" property (a string)
 * 2. "schema" contains the "errors" property (an array)
 * 3. if "schema" contains the "status_code" property it must be an integer
 * 4. the "errors" property's "items" field must be a valid "error model"
 * 5. the error model schema (i.e. errors.items) contains the "code" string property
 * which must have an enum identifying the valid error codes that could be returned by
 * the server.
 * 6. the error model schema contains the "message" property (a string)
 * 7. the error model schema contains the "more_info" property (a string)
 * 8. if the error model schema contains the "target" property, it must be a valid
 * error target model with string properties "type" and "name" present
 * @param {*} schema the schema to be verified as an "Error container model" schema
 * @param {*} path the array of path segments indicating the "location" of the schema within the API definition
 * (e.g. ['paths','/v1/clouds/{id}', 'get', 'responses', '400', 'content', 'application/json', 'schema'])
 * @returns an array containing the violations found or [] if no violations
 */
function checkErrorContainerModelSchema(schema, path) {
  logger.debug(
    `${ruleId}: checking error container model at location: ${path.join('.')}`
  );
  if (!schemaIsObjectWithProperties(schema)) {
    logger.debug(`${ruleId}: it's not an object with properties!`);
    return [
      {
        message: 'Error container model must be an object with properties',
        path,
      },
    ];
  }

  const properties = schema.properties;
  path = [...path, 'properties'];

  const errors = [];
  errors.push(...checkTraceProperty(properties, path));
  errors.push(...checkStatusCodeProperty(properties, path));
  errors.push(...checkErrorsProperty(properties, path));
  if (errors.length) {
    logger.debug(
      `${ruleId}: found one or more violations:\n${JSON.stringify(errors)}`
    );
  } else {
    logger.debug(`${ruleId}: PASSED!`);
  }
  return errors;
}

function checkTraceProperty(properties, path) {
  const prop = properties.trace;
  if (prop) {
    path = [...path, 'trace'];
  }
  if (!isObject(prop) || !isStringSchema(prop)) {
    return [
      {
        message: `Error container model should contain property 'trace' of type string`,
        path,
      },
    ];
  }
  return [];
}

function checkStatusCodeProperty(properties, path) {
  // It's ok to omit the status_code property.  But if present, it MUST be an integer.
  const prop = properties.status_code;
  if (!prop) {
    return [];
  }

  if (!isObject(prop) || !isIntegerSchema(prop)) {
    return [
      {
        message: `Error container model property 'status_code' must be of type integer`,
        path: [...path, 'status_code'],
      },
    ];
  }
  return [];
}

function checkErrorsProperty(properties, path) {
  path = [...path];

  const prop = properties.errors;
  if (prop) {
    path.push('errors');
  }
  if (!isObject(prop) || !isArraySchema(prop)) {
    return [
      {
        message: `Error container model must contain property 'errors' which must be an array of error models`,
        path,
      },
    ];
  }

  const items = prop.items;
  if (items) {
    path.push('items');
  }
  if (!schemaIsObjectWithProperties(items)) {
    return [
      {
        message: `Error container model 'errors.items' field must be an object with properties`,
        path,
      },
    ];
  }

  return validateErrorModelSchema(items, path);
}

function validateErrorModelSchema(schema, path) {
  path = [...path, 'properties'];
  const properties = schema.properties;

  const errors = [];
  errors.push(...checkCodeProperty(properties, path));
  errors.push(...checkMessageProperty(properties, path));
  errors.push(...checkMoreInfoProperty(properties, path));
  errors.push(...checkTargetProperty(properties, path));
  return errors;
}

function checkCodeProperty(properties, path) {
  path = [...path];

  const prop = properties.code;
  if (!prop) {
    return [
      {
        message: `Error model must contain property 'code' of type string`,
        path,
      },
    ];
  }

  path.push('code');

  if (!isStringSchema(prop)) {
    return [
      {
        message: `Error model must contain property 'code' of type string`,
        path,
      },
    ];
  }

  if (!prop.enum) {
    return [
      {
        message: `Error model property 'code' must include an enumeration of the valid error codes`,
        path,
      },
    ];
  }

  path.push('enum');

  if (!Array.isArray(prop.enum)) {
    return [
      {
        message: `Error model property 'code' must include an enumeration of the valid error codes`,
        path,
      },
    ];
  }

  return [];
}

function checkMessageProperty(properties, path) {
  const prop = properties.message;
  if (prop) {
    path = [...path, 'message'];
  }
  if (!isObject(prop) || !isStringSchema(prop)) {
    return [
      {
        message: `Error model must contain property 'message' of type string`,
        path,
      },
    ];
  }
  return [];
}

function checkMoreInfoProperty(properties, path) {
  const prop = properties.more_info;
  if (prop) {
    path = [...path, 'more_info'];
  }
  if (!isObject(prop) || !isStringSchema(prop)) {
    return [
      {
        message: `Error model should contain property 'more_info' of type string`,
        path,
      },
    ];
  }
  return [];
}

function checkTargetProperty(properties, path) {
  // It's ok to omit the target property.
  const target = properties.target;
  if (!target) {
    return [];
  }

  path = [...path, 'target'];

  // If target is defined, it must comply with the API Handbook.
  if (!schemaIsObjectWithProperties(target)) {
    return [
      {
        message: `Error model property 'target' must be a valid error target model object`,
        path,
      },
    ];
  }

  const targetModelProps = target.properties;
  path.push('properties');

  const errors = [];

  // 1. The 'type' property must be defined as an enumeration: ['field', 'header', 'parameter'].
  const typeProp = targetModelProps.type;
  if (!typeProp) {
    errors.push({
      message: `Error target model must contain property 'type' of type string`,
      path,
    });
  } else if (!isStringSchema(typeProp)) {
    errors.push({
      message: `Error target model must contain property 'type' of type string`,
      path: [...path, 'type'],
    });
  } else {
    // We know that 'type' is a string property. Now make sure its enum complies.
    const enumValue = typeProp.enum;
    const message = `Error target model property 'type' must define an enumeration containing ['field', 'header', 'parameter']`;
    if (!enumValue) {
      errors.push({
        message,
        path: [...path, 'type'],
      });
    } else if (!Array.isArray(enumValue)) {
      errors.push({
        message,
        path: [...path, 'type', 'enum'],
      });
    } else {
      const validEnum = ['field', 'parameter', 'header'];
      if (!listsEqual(validEnum, enumValue)) {
        errors.push({
          message,
          path: [...path, 'type', 'enum'],
        });
      }
    }
  }

  // 2. The 'name' property must be of type string.
  const nameProp = targetModelProps.name;
  if (!nameProp) {
    errors.push({
      message: `Error target model must contain property 'name' of type string`,
      path,
    });
  } else if (!isStringSchema(nameProp)) {
    errors.push({
      message: `Error target model must contain property 'name' of type string`,
      path: [...path, 'name'],
    });
  }

  return errors;
}

/**
 * Returns true iff "list1" equals "list2" without regard to the order of elements.
 * @param {*} list1 the first list to compare
 * @param {*} list2 the second list to compare
 * @returns boolean true iff the lists contain the same elements even if in a different order
 */
function listsEqual(list1, list2) {
  if (list1.length != list2.length) {
    return false;
  }
  return list1.every(x => list2.includes(x));
}

function schemaIsObjectWithProperties(s) {
  return s && isObject(s) && isObject(s.properties);
}
