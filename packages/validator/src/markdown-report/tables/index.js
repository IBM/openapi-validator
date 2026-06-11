/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

export default {
  categorizedScores: require('./categorized-scores').default,
  primary: require('./primary').default,
  ruleViolationDetails: require('./rule-violation-details').default,
  ...require('./rule-violation-summary').default,
  scoringData: require('./scoring-data').default,
};
