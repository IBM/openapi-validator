/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  categorizedScores,
  primary,
  ruleViolationDetails,
  errorSummary,
  scoringData,
  warningSummary,
} = require('./tables');

function getReport({ apiDefinition }, results) {
  return `# ${apiDefinition.info.title}

Version: ${apiDefinition.info.version}

## Quick view
${primary(results)}

The API impact score, also known as the "Automated Quality Screening" score, is calculated
by the IBM OpenAPI Validator to help users understand the impact of the rule violations
reported by the validator. The scores are designed to help users evaluate risk and make
decisions about investing in the quality of their service's API.
For more information, see [the AQS documentation](https://github.com/IBM/openapi-validator/blob/main/docs/automated-quality-screening.md).

## Breakdown by category
${categorizedScores(results)}

The "overall" impact score is the average (mean) of the categorized scores. The categorized scores are
inherently weighted by the scoring algorithm, so that security violations are 5 times as severe
as usability violations, evolution 3 times, and robustness 2 times.

## Scoring information
${scoringData(results)}

## Error summary
${errorSummary(results)}

## Warning summary
${warningSummary(results)}

## Detailed results
${ruleViolationDetails(results)}
`;
}

module.exports = getReport;
