/**
 * Copyright 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getTitle } = require('../../src/scoring-tool/get-title');

describe('scoring-tool get-title tests', function () {
  it('should use title from info object and version if present', function () {
    const apiDef = { info: { title: 'Service API', version: '1.3.0' } };
    const filename = 'not-used.yaml';
    expect(getTitle(apiDef, filename)).toBe('Service API 1.3.0');
  });

  it('should use title from info object without version if not present', function () {
    const apiDef = { info: { title: 'Service API' } };
    const filename = 'not-used.yaml';
    expect(getTitle(apiDef, filename)).toBe('Service API');
  });

  it('should use x-alternate-name from info object and version if present', function () {
    const apiDef = {
      info: { 'x-alternate-name': 'Service API', version: '1.3.0' },
    };
    const filename = 'not-used.yaml';
    expect(getTitle(apiDef, filename)).toBe('Service API 1.3.0');
  });

  it('should use x-alternate-name from info object without version if not present', function () {
    const apiDef = { info: { 'x-alternate-name': 'Service API' } };
    const filename = 'not-used.yaml';
    expect(getTitle(apiDef, filename)).toBe('Service API');
  });

  it('should use filename if there is no info object', function () {
    const apiDef = {};
    const filename = 'will-be-used.yaml';
    expect(getTitle(apiDef, filename)).toBe('will-be-used.yaml');
  });

  it('should use filename if there is no title supplied in expected places', function () {
    const apiDef = { info: {} };
    const filename = 'will-be-used.yaml';
    expect(getTitle(apiDef, filename)).toBe('will-be-used.yaml');
  });

  it('should resolve filepath to a single filename', function () {
    const apiDef = {};
    const filename = 'path/to/will-be-used.yaml';
    expect(getTitle(apiDef, filename)).toBe('will-be-used.yaml');
  });
});
