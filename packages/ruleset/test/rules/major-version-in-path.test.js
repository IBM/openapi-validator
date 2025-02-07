/**
 * Copyright 2017 - 2025 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { majorVersionInPath } = require('../../src/rules');
const {
  makeCopy,
  rootDocument,
  testRule,
  severityCodes,
} = require('../test-utils');

const ruleId = 'ibm-major-version-in-path';
const rule = majorVersionInPath;

describe(`Spectral rule: ${ruleId}`, () => {
  it('should not error with a clean spec', async () => {
    const results = await testRule(ruleId, rule, rootDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error when servers object contains parameterized urls', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.servers = [
      {
        url: 'https://some-madeup-url.com:{port}/api/{apiVersion}',
        variables: {
          port: {
            default: '443',
          },
          apiVersion: {
            default: 'v1',
          },
        },
      },
      {
        url: 'https://some-madeup-url.com:443/api/v1',
      },
    ];

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error when server.url is unparseable', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.servers = [
      {
        url: 'https://some-madeup-url.com:{port}/api/{apiVersion}',
        variables: {
          port: {
            description: 'No default value for this one',
          },
          apiVersion: {
            default: 'v1',
          },
        },
      },
    ];

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should not error when there are no paths', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths = {};

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(0);
  });

  it('should error when servers have urls with different versions', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.servers = [
      {
        url: 'https://some-madeup-url.com/api/v1',
      },
      {
        url: 'https://some-madeup-url.com/api/v2',
      },
    ];

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Major version segments of urls in servers object do not match. Found: v1, v2'
    );
    expect(validation.path).toStrictEqual(['servers']);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error when paths start with different versions', async () => {
    const testDocument = makeCopy(rootDocument);
    testDocument.paths['/v2/some_path'] = {};

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Major version segments in paths do not match. Found: v1, v2'
    );
    expect(validation.path).toStrictEqual(['paths']);
    expect(validation.severity).toBe(severityCodes.warning);
  });

  it('should error when no version is indicated anywhere', async () => {
    const testDocument = makeCopy(rootDocument);
    delete testDocument.paths;
    testDocument.paths = {
      '/movies': {},
    };

    const results = await testRule(ruleId, rule, testDocument);

    expect(results).toHaveLength(1);

    const validation = results[0];
    expect(validation.code).toBe(ruleId);
    expect(validation.message).toBe(
      'Major version segment not present in either server URLs or paths'
    );
    expect(validation.path).toStrictEqual([]);
    expect(validation.severity).toBe(severityCodes.warning);
  });
});
