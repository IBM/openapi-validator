/**
 * Copyright 2024 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const getReport = require('../../src/markdown-report/report');
const validatorResults = require('../test-utils/mock-json-output.json');

describe('getReport tests', function () {
  it('should create a markdown report from the results', function () {
    const report = getReport({ apiDefinition: getMockAPI() }, validatorResults);

    // Check main title.
    expect(report.startsWith('# Swagger Petstore\n\nVersion: 1.0.0')).toBe(
      true
    );

    // Check all subtitle-level headers.
    const headers = report
      .split('\n')
      .filter(l => l.startsWith('## '))
      .map(l => l.slice(3));
    expect(headers).toEqual([
      'Quick view',
      'Breakdown by category',
      'Scoring information',
      'Error summary',
      'Warning summary',
      'Detailed results',
    ]);

    // Check that it ends with an emptly line.
    expect(report.endsWith('\n')).toBe(true);
  });
});

function getMockAPI() {
  // These are the only fields actually used in the code.
  return {
    info: {
      title: 'Swagger Petstore',
      version: '1.0.0',
    },
  };
}
