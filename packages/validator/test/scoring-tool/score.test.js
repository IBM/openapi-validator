/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const {
  scoreResults,
  compute,
  computeCategorizedScores,
  getFunc,
  tally,
  computeOverallScore,
} = require('../../src/scoring-tool/score');

const { Metrics } = require('../../src/scoring-tool/metrics');

describe('scoring-tool score tests', function () {
  const debug = jest.fn();
  const mockLogger = { debug };
  const metrics = new Metrics();
  // Fake the metrics by hardcoding the metadata.
  metrics.counts = { operations: 4 };

  it('should scoreResults', function () {
    const results = scoreResults(
      getMockValidatorResults(),
      metrics,
      mockLogger
    );

    expect(results).toEqual({
      categorizedSummary: {
        usability: 83,
        security: 100,
        robustness: 82,
        evolution: 88,
        overall: 88,
      },
      scoringData: [
        {
          rule: 'ibm-avoid-property-name-collision',
          count: 2,
          func: '2×10÷operations',
          demerits: {
            usability: 5.0,
            total: 5.0,
          },
        },
        {
          rule: 'ibm-etag-header',
          count: 3,
          func: '3×1÷operations',
          demerits: {
            usability: 0.75,
            robustness: 1.5,
            total: 2.25,
          },
        },
        {
          rule: 'ibm-no-array-responses',
          count: 1,
          func: '1×10÷operations',
          demerits: {
            evolution: 7.5,
            total: 7.5,
          },
        },
        {
          rule: 'ibm-operation-summary',
          count: 2,
          func: '2×10÷operations',
          demerits: {
            usability: 5.0,
            robustness: 10.0,
            total: 15.0,
          },
        },
      ],
    });
  });

  it('should compute', function () {
    const rubricEntry = {
      coefficient: 2,
      denominator: 'operations',
      categories: ['usability'],
    };

    const baselineScore = compute(rubricEntry, 4, metrics);
    expect(baselineScore).toBe(2);
  });

  it('should compute with default denominator of 1 if not defined by rule', function () {
    const rubricEntry = {
      coefficient: 2,
      categories: ['usability'],
    };

    const baselineScore = compute(rubricEntry, 4, metrics);
    expect(baselineScore).toBe(8);
  });

  it('should compute with default coefficient of 1 if not defined by rule', function () {
    const rubricEntry = {
      denominator: 'operations',
      categories: ['usability'],
    };

    const baselineScore = compute(rubricEntry, 4, metrics);
    expect(baselineScore).toBe(1);
  });

  it('should computeCategorizedScores', function () {
    const rubricEntry = {
      coefficient: 2,
      denominator: 'operations',
      categories: ['usability', 'evolution'],
    };

    const scores = computeCategorizedScores(rubricEntry, 4, metrics);
    expect(scores).toEqual({
      usability: 2.0,
      evolution: 6.0,
    });
  });

  it('should getFunc with both coefficient and denominator', function () {
    const rubricEntry = {
      coefficient: 2,
      denominator: 'operations',
      categories: ['usability'],
    };

    expect(getFunc(rubricEntry, 5)).toBe('5×2÷operations');
  });

  it('should getFunc with coefficient but no denominator', function () {
    const rubricEntry = {
      coefficient: 2,
      categories: ['usability'],
    };

    expect(getFunc(rubricEntry, 5)).toBe('5×2');
  });

  it('should getFunc with denominator but no coefficient', function () {
    const rubricEntry = {
      denominator: 'operations',
      categories: ['usability'],
    };

    expect(getFunc(rubricEntry, 5)).toBe('5÷operations');
  });

  it('should getFunc without denominator or coefficient', function () {
    const rubricEntry = {
      categories: ['usability'],
    };

    expect(getFunc(rubricEntry, 5)).toBe('5');
  });

  it('should tally', function () {
    const tallied = tally(getMockValidatorResults(), mockLogger);
    expect(tallied).toEqual({
      'ibm-avoid-property-name-collision': {
        count: 2,
      },
      'ibm-etag-header': {
        count: 3,
      },
      'ibm-no-array-responses': {
        count: 1,
      },
      'ibm-operation-summary': {
        count: 2,
      },
    });

    expect(debug).toHaveBeenCalled();
    expect(debug.mock.calls[0][0]).toMatch('ibm-no-accept-header');
    debug.mockClear();
  });

  it('should computeOverallScore', function () {
    expect(computeOverallScore(0)).toBe(100);
    expect(computeOverallScore(3.4)).toBe(95);
    expect(computeOverallScore(12.7)).toBe(80);
    expect(computeOverallScore(58)).toBe(38);
    expect(computeOverallScore(123.45)).toBe(20);
    expect(computeOverallScore(700.08)).toBe(4);
  });
});

function getMockValidatorResults() {
  // The scoring logic only cares about the name of the rule so that's
  // all we need to include in the mock results object.
  return {
    error: {
      results: [
        {
          rule: 'ibm-avoid-property-name-collision',
        },
        {
          rule: 'ibm-avoid-property-name-collision',
        },
        {
          rule: 'ibm-etag-header',
        },
        {
          rule: 'ibm-etag-header',
        },
        {
          rule: 'ibm-etag-header',
        },
        {
          rule: 'ibm-no-array-responses',
        },
      ],
    },
    warning: {
      results: [
        {
          rule: 'ibm-no-accept-header', // Not in rubric, testing the logger.
        },
        {
          rule: 'ibm-operation-summary',
        },
        {
          rule: 'ibm-operation-summary',
        },
      ],
    },
  };
}
