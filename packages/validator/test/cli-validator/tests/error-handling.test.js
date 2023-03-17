/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getCapturedText, testValidator } = require('../../test-utils');

describe('cli tool - test error handling', function () {
  let consoleSpy;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    console.warn = console.log;
    console.error = console.log;
    console.info = console.log;
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    console.warn = originalWarn;
    console.error = originalError;
    console.info = originalInfo;
  });

  it('should display help text and return an error when no filename is given', async function () {
    let exitCode;
    try {
      exitCode = await testValidator([]);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError(`Captured text: ${capturedText}`);

    expect(exitCode).toEqual(2);
    expect(capturedText).toHaveLength(1);
    expect(capturedText[0]).toMatch(/^IBM OpenAPI Validator/);
    expect(capturedText[0]).toMatch(
      /Usage: lint-openapi \[options\] \[file...\]/
    );
    expect(capturedText[0]).toMatch(/-h, --help +display help for command/);
  });

  it('should return an error when there is no file extension', async function () {
    let exitCode;
    try {
      exitCode = await testValidator(['json']);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError('Captured text:\n', capturedText);

    expect(exitCode).toEqual(2);
    expect(capturedText.length).toEqual(3);
    expect(capturedText[0].trim()).toEqual(
      '[Warning] Skipping file with unsupported file type: json'
    );
    expect(capturedText[1].trim()).toEqual(
      'Supported file types are JSON (.json) and YAML (.yml, .yaml)'
    );
    expect(capturedText[2].trim()).toEqual('[Error] No files to validate.');
  });

  it('should return an error when there is an invalid file extension', async function () {
    let exitCode;
    try {
      exitCode = await testValidator(['badExtension.jsob']);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError('Captured text:\n', capturedText);

    expect(exitCode).toEqual(2);
    expect(capturedText.length).toEqual(3);
    expect(capturedText[0].trim()).toEqual(
      '[Warning] Skipping file with unsupported file type: badExtension.jsob'
    );
    expect(capturedText[1].trim()).toEqual(
      'Supported file types are JSON (.json) and YAML (.yml, .yaml)'
    );
    expect(capturedText[2].trim()).toEqual('[Error] No files to validate.');
  });

  it('should return an error when a file contains an invalid object', async function () {
    let exitCode;
    try {
      exitCode = await testValidator([
        './test/cli-validator/mock-files/bad-json.json',
      ]);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError('Captured text:\n', capturedText);

    expect(exitCode).toEqual(1);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid input file: ./test/cli-validator/mock-files/bad-json.json. See below for details.'
    );
    expect(capturedText[1].trim()).toEqual(
      'SyntaxError: Unexpected token ; in JSON at position 14'
    );
  });

  it('should return an error when a json file has duplicated key mappings', async function () {
    let exitCode;
    try {
      exitCode = await testValidator([
        './test/cli-validator/mock-files/oas3/duplicate-keys.json',
      ]);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError('Captured text:\n', capturedText);

    expect(exitCode).toEqual(1);
    expect(capturedText.length).toEqual(2);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid input file: ./test/cli-validator/mock-files/oas3/duplicate-keys.json. See below for details.'
    );
    expect(capturedText[1].trim()).toEqual(
      'Syntax error: duplicated keys "version" near sion": "1.'
    );
  });

  it('should return an error when a JSON document contains a trailing comma', async function () {
    let exitCode;
    try {
      exitCode = await testValidator([
        './test/cli-validator/mock-files/oas3/trailing-comma.json',
      ]);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(1);

    expect(capturedText[0].trim()).toContain('[Error] Invalid input file');
    expect(capturedText[1].trim()).toEqual(
      'SyntaxError: Unexpected token ] in JSON at position 634'
    );
  });
});
