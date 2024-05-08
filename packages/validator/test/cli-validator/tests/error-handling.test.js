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
    expect(capturedText[0]).toMatch(/IBM OpenAPI Validator/);
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
    expect(capturedText.length).toEqual(4);
    expect(capturedText[1].trim()).toEqual(
      '[WARN] Skipping file with unsupported file type: json'
    );
    expect(capturedText[2].trim()).toEqual(
      '[WARN] Supported file types are JSON (.json) and YAML (.yml, .yaml)'
    );
    expect(capturedText[3].trim()).toEqual('[ERROR] No files to validate.');
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
    expect(capturedText.length).toEqual(4);
    expect(capturedText[1].trim()).toEqual(
      '[WARN] Skipping file with unsupported file type: badExtension.jsob'
    );
    expect(capturedText[2].trim()).toEqual(
      '[WARN] Supported file types are JSON (.json) and YAML (.yml, .yaml)'
    );
    expect(capturedText[3].trim()).toEqual('[ERROR] No files to validate.');
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
    expect(capturedText.length).toEqual(5);
    expect(capturedText[3].trim()).toEqual(
      '[ERROR] Invalid input file: ./test/cli-validator/mock-files/bad-json.json. See below for details.'
    );
    expect(capturedText[4].trim()).toMatch(
      /^\[ERROR\] SyntaxError:.*in JSON at position 14$/
    );
  });

  it('should return an error when a file contains a Swagger 2 document', async function () {
    let exitCode;
    try {
      exitCode = await testValidator([
        './test/cli-validator/mock-files/swagger-2.json',
      ]);
    } catch (err) {
      exitCode = err;
    }

    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(exitCode).toEqual(1);
    expect(capturedText.length).toEqual(5);
    expect(capturedText[3].trim()).toEqual(
      '[ERROR] Invalid input file: ./test/cli-validator/mock-files/swagger-2.json. See below for details.'
    );
    expect(capturedText[4].trim()).toEqual(
      '[ERROR] Only OpenAPI 3.0.x and 3.1.x documents are currently supported.'
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
    expect(capturedText.length).toEqual(5);
    expect(capturedText[3].trim()).toEqual(
      '[ERROR] Invalid input file: ./test/cli-validator/mock-files/oas3/duplicate-keys.json. See below for details.'
    );
    expect(capturedText[4].trim()).toEqual(
      '[ERROR] Syntax error: duplicated keys "version" near sion": "1.'
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
    // originalError('Captured text:\n', capturedText);

    expect(exitCode).toEqual(1);
    expect(capturedText.length).toEqual(5);

    expect(capturedText[3].trim()).toContain('[ERROR] Invalid input file');
    expect(capturedText[4].trim()).toContain(
      '[ERROR] SyntaxError: Unexpected token'
    );
  });

  it.each(['-j', '--json'])(
    'should return an error if multiple files specified along with --json option',
    async function (option) {
      let exitCode;
      try {
        exitCode = await testValidator([
          option,
          './test/cli-validator/mock-files/oas3/err-and-warn.yaml',
          './test/cli-validator/mock-files/oas3/clean.yml',
        ]);
      } catch (err) {
        exitCode = err;
      }
      expect(exitCode).toEqual(2);

      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError('Captured text:\n', capturedText);

      expect(capturedText.length).toEqual(1);
      expect(capturedText[0].trim()).toEqual(
        '[ERROR] At most one file can be specified when JSON output is requested.'
      );
    }
  );
});
