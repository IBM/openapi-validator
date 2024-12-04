/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = {
  categorizedScores: require('./categorized-scores'),
  primary: require('./primary'),
  ruleViolationDetails: require('./rule-violation-details'),
  ...require('./rule-violation-summary'),
  scoringData: require('./scoring-data'),
};
