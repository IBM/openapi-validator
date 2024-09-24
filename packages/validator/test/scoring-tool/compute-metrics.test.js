/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { readFile } = require('node:fs/promises');
const readYaml = require('js-yaml');
const { computeMetrics } = require('../../src/scoring-tool/compute-metrics');
const rubric = require('../../src/scoring-tool/rubric');

describe('scoring-tool compute-metrics tests', function () {
  let metrics;

  beforeAll(async function () {
    const fileToTest = `${__dirname}/../cli-validator/mock-files/oas3/clean.yml`;
    const contents = await readFile(fileToTest, { encoding: 'utf8' });
    const apiDef = readYaml.safeLoad(contents);
    metrics = await computeMetrics(apiDef);
  });

  it('should set up and return metrics for an API', function () {
    const expectedMetrics = [
      'operations',
      'schemas',
      'string-schemas',
      'object-schemas',
      'array-schemas',
      'binary-schemas',
    ];

    const metricsObject = JSON.parse(metrics.toString());
    const actualMetrics = Object.keys(metricsObject);
    expect(actualMetrics.length).toEqual(expectedMetrics.length);
    expectedMetrics.forEach(c => {
      expect(actualMetrics.includes(c)).toBe(true);
    });

    expect(metrics.get('operations')).toBe(3);
    expect(metrics.get('schemas')).toBe(20);
    expect(metrics.get('string-schemas')).toBe(8);
    expect(metrics.get('object-schemas')).toBe(7);
    expect(metrics.get('array-schemas')).toBe(1);
    expect(metrics.get('binary-schemas')).toBe(0);
  });

  it('should set up all metrics that we expect to find in the rubric', function () {
    // Grab all of the denominators in the rubric - these need to correspond to
    // supported metrics.
    const rubricMetrics = Object.values(rubric).reduce((denominators, data) => {
      const { denominator } = data;

      // Not every rubric entry has a denominator.
      // Also, we want a unique list.
      if (denominator && !denominators.includes(denominator)) {
        denominators.push(denominator);
      }

      return denominators;
    }, []);

    rubricMetrics.forEach(m => {
      expect(metrics.get(m)).toBeDefined();
    });
  });
});
