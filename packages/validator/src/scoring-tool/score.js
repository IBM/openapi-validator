/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getCategories, getCategoryCoefficient } = require('./categories');
const rubric = require('./rubric');

/**
 * Uses the validator results to calculate categorized demerits for each rule
 * violation, which are then used to compute categorized impact scores for the API.
 *
 * @param object result - the validator results
 * @param Metrics metrics - the metric tracking class instance for scaling rule violations
 * @param object logger - the root logger from the validator context
 * @returns void
 */
function scoreResults(result, metrics, logger) {
  // The `talliedResults` variable contains an object where each key is the name
  // of a validator rule and each value is an object that contains a "count" field
  // representing how many times the validator rule was violated by the given API.
  const talliedResults = tally(result, logger);

  // Initialize the categorized demerit sums.
  const demeritSumsByCategory = {};
  getCategories().forEach(c => (demeritSumsByCategory[c] = 0.0));

  // Initialize the list of scoring data entries.
  const scoringData = [];

  Object.keys(talliedResults).forEach(rule => {
    // Add the "func", which is a string representation of the formula
    // used to compute the demerit value, as well as the demerit value
    // itself, for each rule present in the validator results (each
    // rule, not each instance of each rule).
    const { count } = talliedResults[rule];
    const data = {
      rule,
      count,
      func: getFunc(rubric[rule], count),
      demerits: computeCategorizedScores(rubric[rule], count, metrics),
    };

    // Count up category totals as we go.
    for (const [category, demerit] of Object.entries(data.demerits)) {
      demeritSumsByCategory[category] += demerit;
    }

    // After adding category totals, we can calculate the total impact for the given rule.
    data.demerits.total = includeDecimals(
      Object.values(data.demerits).reduce((sum, num) => sum + num, 0.0),
      2
    );

    scoringData.push(data);
  });

  // Compute the categorized summary object.
  const categorizedSummary = {};
  getCategories().forEach(c => {
    categorizedSummary[c] = computeOverallScore(demeritSumsByCategory[c]);
  });

  // Average the categorized scores to produce the overall score.
  // They are already weighted through their coefficients.
  categorizedSummary.overall = includeDecimals(
    getCategories()
      .map(c => categorizedSummary[c])
      .reduce((total, score) => total + score) / getCategories().length,
    0
  );

  return {
    categorizedSummary,
    scoringData,
  };
}

// Calculate the numerical demerit severity for each rule.
function compute(rule, count, metrics) {
  let denom = 1;
  let coef = 1;

  if (rule.denominator !== undefined) {
    denom = metrics.get(rule.denominator);
  }

  if (rule.coefficient !== undefined) {
    coef = rule.coefficient;
  }

  return (coef * count) / denom;
}

function computeCategorizedScores(rule, count, metrics) {
  const baseScore = compute(rule, count, metrics);
  // Initialize categories to zero to see "0" values in table.
  const result = {};

  // Base the categories on those defined for the given rule in the rubric.
  rule.categories.forEach(c => {
    result[c] = includeDecimals(baseScore * getCategoryCoefficient(c), 2);
  });

  return result;
}

// Show the user the formula used to calculate the demerit, as a string.
function getFunc(rule, count) {
  let func = String(count);

  if (rule.coefficient !== undefined) {
    func += '×' + String(rule.coefficient);
  }

  if (rule.denominator !== undefined) {
    func += '÷' + String(rule.denominator);
  }

  return func;
}

// Tally up the number of occurances for each rule present in the results.
// Returns an object where the keys are rule names and the values are objects
// with the total stored under the field name "count".
function tally(result, logger) {
  const results = [...result.error.results, ...result.warning.results];

  return results.reduce((tallies, result) => {
    // Do not include rules that are not present in the rubric. This includes
    // rules that have no actual API impact, are deprecated, etc.
    if (!rubric[result.rule]) {
      logger.debug(`Rule ${result.rule} is not present in the rubric`);
      return tallies;
    }

    if (tallies[result.rule] === undefined) {
      return { ...tallies, [result.rule]: { count: 1 } };
    }

    return {
      ...tallies,
      [result.rule]: { count: tallies[result.rule].count + 1 },
    };
  }, {});
}

// Do some magic to compute the overall score :)
// From @hudlow: the idea is to use a function that's not TOO far from a
// linear slope for 0 < x < 100 but leveled out with an asymptote so
// that it couldn't go below zero. The thing that's kind of arbitrary
// is the "/40", which is just scaling the input subjectively — it's
// a number we will keep tuning alongside tuning the demerit coefficients.
function computeOverallScore(demeritSum) {
  return includeDecimals(
    100 - (100 * Math.atan(demeritSum / 40)) / Math.asin(1),
    0
  );
}

// In order to display numbers with meaningful precision,
// only use the first "number" of decimal places.
function includeDecimals(value, number) {
  return parseFloat(value.toFixed(number));
}

module.exports = {
  scoreResults,
  // The following functions are only exported for testing purposes.
  compute,
  computeCategorizedScores,
  getFunc,
  tally,
  computeOverallScore,
};
