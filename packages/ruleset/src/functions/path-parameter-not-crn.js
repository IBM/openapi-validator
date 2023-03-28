/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  isStringSchema,
  schemaHasConstraint,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { LoggerFactory } = require('../utils');

let ruleId;
let logger;

module.exports = function (pathParam, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }
  return pathParameterNotCRN(pathParam, context.path);
};

/**
 * This function will check "pathParam" (assumed to be a path parameter object)
 * to make sure that it is not defined as a "CRN" (Cloud Resource Name) value.
 * @param {*} pathParam the path parameter object to check
 * @param {*} path the jsonpath location of "pathParam" within the API definition
 * @returns an array containing the violations found or [] if no violations
 */
function pathParameterNotCRN(pathParam, path) {
  logger.debug(
    `${ruleId}: checking path parameter '${
      pathParam.name
    }' at location: ${path.join('.')}`
  );
  const subPath = isCRNParameter(pathParam);
  if (subPath && subPath.length > 0) {
    logger.debug(`${ruleId}: it's a CRN value!`);
    return [
      {
        message: 'Path parameters should not be defined as a CRN value',
        path: [...path, ...subPath],
      },
    ];
  }

  return [];
}

/**
 * This function checks to see if the specified parameter object "p" is defined as a CRN-like value.
 * If "p" does not appear to be defined as a CRN-like value, then [] is returned.
 * If "p" does appear to be defined as a CRN-like value, then the return value will be a
 * list of one or more jsonpath segments that represent the relative location of the violation
 * (relative to "p"'s location within the API definition)
 * @param {} p the parameter object to check
 * @returns a list of zero or more jsonpath segments to indicate that a violation
 * was found at that relative location
 */
function isCRNParameter(p) {
  // Check if the parameter name contains "crn".
  if (
    p.name &&
    typeof p.name === 'string' &&
    /crn/.test(p.name.toLowerCase())
  ) {
    return ['name'];
  }

  // Grab the parameter's schema object.
  let schema = p.schema;
  if (!schema) {
    // If not set directly on the parameter, grab the first schema within the content map instead.
    if (p.content && typeof p.content === 'object' && p.content.size > 0) {
      schema = p.content.values()[0];
    }
  }

  // Check if the schema is defined as type=string/format=crn.
  if (
    schema &&
    isStringSchema(schema) &&
    schemaHasConstraint(schema, s => s.format === 'crn')
  ) {
    return ['schema', 'format'];
  }

  // Check if the schema defines a pattern field that starts with "crn" or "^crn".
  if (
    schema &&
    schemaHasConstraint(
      schema,
      s =>
        s.pattern &&
        typeof s.pattern === 'string' &&
        /^\^?crn.*/.test(s.pattern.trim().toLowerCase())
    )
  ) {
    return ['schema', 'pattern'];
  }

  // Check if the parameter's "example" field is a CRN-like value.
  if (p.example && isCRNValue(p.example)) {
    return ['example'];
  }

  // Check if the parameter's "examples" field contains an entry with a CRN-like value.
  if (p.examples && typeof p.examples === 'object') {
    for (const [name, obj] of Object.entries(p.examples)) {
      if (obj && obj.value && isCRNValue(obj.value)) {
        return ['examples', name, 'value'];
      }
    }
  }

  // Check if the parameter schema's "example" field is a CRN-like value.
  if (schema && schema.example && isCRNValue(schema.example)) {
    return ['schema', 'example'];
  }

  // Check if the parameter's description contains "CRN" or "Cloud Resource Name".
  if (isCRNInDescription(p)) {
    return ['description'];
  }

  // Check if the parameter schema's description contains "CRN" or "Cloud Resource Name".
  if (isCRNInDescription(schema)) {
    return ['schema', 'description'];
  }

  // If we made it through the gauntlet unscathed, then return an empty list to
  // indicate no violations.
  return [];
}

/**
 * Returns true iff the specified example value appears to be an example of
 * a CRN value.
 * @param {} value the value to check
 * @return boolean
 */
function isCRNValue(value) {
  return value && typeof value === 'string' && /^crn:.*/.test(value.trim());
}

/**
 * Returns true iff "obj" is an object with a "description" field that contains
 * "CRN" or "Cloud Resource Name".
 * @param {*} obj the objet whose "description" field should be checked
 * @return boolean
 */
function isCRNInDescription(obj) {
  return (
    obj &&
    obj.description &&
    typeof obj.description === 'string' &&
    /^.*((CRN)|(Cloud\s*Resource\s*Name)).*$/.test(obj.description)
  );
}
