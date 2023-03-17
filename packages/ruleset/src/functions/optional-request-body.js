/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getCompositeSchemaAttribute } = require('../utils');

module.exports = function (schema, _opts, { path }) {
  return checkOptionalRequestBodySchema(schema, path);
};

function checkOptionalRequestBodySchema(schema, path) {
  // If the schema has any required properties, then return a warning.
  const required = getCompositeSchemaAttribute(schema, 'required');
  if (Array.isArray(required)) {
    return [
      {
        message: '',

        // Return the path to the requestBody, not the schema.
        path: path.slice(0, 4),
      },
    ];
  }

  return [];
}
