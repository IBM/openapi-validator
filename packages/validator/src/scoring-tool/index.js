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

async function produceQualityScore(
  validatorResults,
  { apiDefinition, logger }
) {
  const metrics = await computeMetrics(apiDefinition);
  logger.debug(`API scaling metrics: ${metrics.toString()}`);

  // Execute scoring logic.
  return scoreResults(validatorResults, metrics, logger);
}

function printScoreTables({ config }, { qualityScore }) {
  printCategorizedScoresTable(qualityScore);

  if (!config.summaryOnly) {
    printScoringDataTable(qualityScore);
  }

  // Print a new line at the end to be consistent with other validator output.
  console.log();
}

module.exports = {
  produceQualityScore,
  printScoreTables,
};
