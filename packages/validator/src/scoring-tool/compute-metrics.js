/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  collections,
  isArraySchema,
  isBinarySchema,
  isIntegerSchema,
  isObjectSchema,
  isStringSchema,
} = require('@ibm-cloud/openapi-ruleset-utilities');
const { Metrics } = require('./metrics');

async function computeMetrics(unresolvedApiDef) {
  // For some metrics, we just want to identify every unique instance
  // identified by a JSONPath. For others, we need a more specific condition.
  // Use this callback for the simple instances.
  const countEveryInstance = () => true;

  // Register all the metrics needed by the grading rubric.
  const metrics = new Metrics(unresolvedApiDef);
  metrics.register('operations', collections.operations, countEveryInstance);
  metrics.registerSchemas('schemas', collections.schemas, countEveryInstance);
  metrics.registerSchemas(
    'string-schemas',
    collections.schemas,
    isStringSchema
  );
  metrics.registerSchemas(
    'object-schemas',
    collections.schemas,
    isObjectSchema
  );
  metrics.registerSchemas('array-schemas', collections.schemas, isArraySchema);
  metrics.registerSchemas(
    'binary-schemas',
    collections.schemas,
    isBinarySchema
  );
  metrics.registerSchemas(
    'integer-schemas',
    collections.schemas,
    isIntegerSchema
  );

  // Populate the metrics for the API.
  await metrics.compute();

  return metrics;
}

module.exports = {
  computeMetrics,
};
