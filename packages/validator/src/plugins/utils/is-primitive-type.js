/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// takes a schema object that has a 'type' field
module.exports = function(schema) {
  return (
    schema.type &&
    ['boolean', 'integer', 'number', 'string'].includes(schema.type)
  );
};
