/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { validateSubschemas } from '@ibm-cloud/openapi-ruleset-utilities';
import { LoggerFactory, mergeAllOfSchemaProperties } from '../utils/index.js';

let ruleId;
let logger;

export default function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return validateSubschemas(schema, context.path, schemaTypeExists);
}

function schemaTypeExists(schema, path) {
  // If we're looking at an allOf list element schema, then
  // bail out as this would not necessarily provide the full
  // definition of a schema or schema property.
  if (path[path.length - 2] === 'allOf') {
    logger.debug(
      `${ruleId}: skipping type check for allOf member at location: ${path.join(
        '.'
      )}`
    );
    return [];
  }

  const mergedSchema = mergeAllOfSchemaProperties(schema);

  if (!schemaHasType(mergedSchema)) {
    logger.debug(
      `${ruleId}: schema with no type at location: ${path.join('.')}`
    );
    return [
      {
        message: 'Schemas should have a non-empty type field',
        path,
      },
    ];
  }

  return [];
}

/**
 * Returns true iff schema 's' explicitly defines its type.
 * The type could be a non-empty string or a list of non-empty strings.
 * @param {*} s the schema to check
 * @returns boolean true if 's' explicitly defines its type, false otherwise
 */
function schemaHasType(s) {
  return (
    s &&
    'type' in s &&
    ((typeof s.type === 'string' && s.type.toString().trim().length) ||
      (Array.isArray(s.type) &&
        s.type.length &&
        s.type.every(t => {
          return typeof t === 'string' && t.trim().length;
        })))
  );
}
