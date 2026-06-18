/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { printCategorizedScoresTable, printScoringDataTable } from './output.js';
import { scoreResults } from './score.js';
import computeMetricsModule from './compute-metrics.js';
const { computeMetrics } = computeMetricsModule;

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

export default {
  produceQualityScore,
  printScoreTables,
};
