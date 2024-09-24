/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  printCategorizedScoresTable,
  printScoringDataTable,
} = require('./output');
const { scoreResults } = require('./score');
const { computeMetrics } = require('./compute-metrics');

async function produceImpactScore(validatorResults, { apiDefinition, logger }) {
  const metrics = await computeMetrics(apiDefinition);
  logger.debug(`API scaling metrics: ${metrics.toString()}`);

  // Execute scoring logic.
  return scoreResults(validatorResults, metrics, logger);
}

function printScoreTables(results, { config }) {
  printCategorizedScoresTable(results);

  if (!config.summaryOnly) {
    printScoringDataTable(results);
  }
}

module.exports = {
  produceImpactScore,
  printScoreTables,
};
