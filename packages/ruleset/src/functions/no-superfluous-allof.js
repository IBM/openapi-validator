/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { validateSubschemas } from '@ibm-cloud/openapi-ruleset-utilities';
import { LoggerFactory } from '../utils';

let ruleId;
let logger;

export default function (schema, _opts, context) {
  if (!logger) {
    ruleId = context.rule.name;
    logger = LoggerFactory.getInstance().getLogger(ruleId);
  }

  return validateSubschemas(schema, context.path, checkForSuperfluousAllOf);
};

function checkForSuperfluousAllOf(schema, path) {
  // We're interested only in schemas that contain ONLY a single-element allOf list.
  if (
    Array.isArray(schema.allOf) &&
    schema.allOf.length === 1 &&
    Object.keys(schema).length === 1
  ) {
    return [
      {
        // Use rule description for error message.
        message: '',
        path,
      },
    ];
  }

  return [];
}
