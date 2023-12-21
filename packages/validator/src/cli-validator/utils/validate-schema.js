/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const Ajv = require('ajv');

/**
 * This function verifies that "data" complies with "schema".
 * @param {*} data  the data to be validated
 * @param {*} schema the schema used to perform the validation
 * @returns [] if no validation errors were detected, or an array strings
 * containing the error messages.
 */
function validateSchema(data, schema) {
  const ajv = new Ajv({ allErrors: false });

  const validate = ajv.compile(schema);
  const valid = validate(data);

  const messages = [];
  if (!valid) {
    const errors = validate.errors || [];
    errors.forEach(e => {
      const instancePath = e.instancePath ? `'${e.instancePath}': ` : '';
      messages.push(`schema validation error: ${instancePath}${e.message}`);
    });
  }

  return messages;
}

module.exports = validateSchema;
