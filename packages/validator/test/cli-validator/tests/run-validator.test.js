/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getCapturedText, testValidator } = require('../../test-utils');

describe('run-validator tests', function () {
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

  it.each(['oas3', 'oas31'])(
    'should show error/exit code 1 when warnings limit exceeded (config)',
    async function (oasVersion) {
      const exitCode = await testValidator([
        '--config',
        './test/cli-validator/mock-files/config/five-warnings.json',
        `./test/cli-validator/mock-files/${oasVersion}/warn-threshold.yml`,
      ]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
      expect(exitCode).toEqual(1);

      expect(capturedText[3]).toMatch(
        /^\[ERROR\] Number of warnings .* exceeds warnings limit/
      );
    }
  );
  it.each(['-w5', '--warnings-limit=5'])(
    'should show error/exit code 1 when -w/--warnings-limit used',
    async function (option) {
      const exitCode = await testValidator([
        option,
        './test/cli-validator/mock-files/oas3/warn-threshold.yml',
      ]);
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
      expect(exitCode).toEqual(1);

      expect(capturedText[3]).toMatch(
        /^\[ERROR\] Number of warnings .* exceeds warnings limit/
      );
    }
  );

  it('should show errors/use default config when config file fails validation', async function () {
    const exitCode = await testValidator([
      '-c',
      './test/cli-validator/mock-files/config/invalid-values.json',
      './test/cli-validator/mock-files/oas3/clean.yml',
    ]);

    // The config file is invalid, so we should end up using the default config instead.
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
    expect(exitCode).toEqual(0);
    const allOutput = capturedText.join('');

    expect(allOutput).toMatch(/Invalid configuration file/);
    expect(allOutput).toMatch(
      /schema validation error: must NOT have additional properties/
    );
    expect(allOutput).toMatch(/validator will use a default config/);
  });

  it('should get exit code 0 when warnings limit not exceeded', async function () {
    const exitCode = await testValidator([
      './test/cli-validator/mock-files/oas3/clean.yml',
      '-c',
      './test/cli-validator/mock-files/config/zero-warnings.json',
    ]);
    expect(exitCode).toEqual(0);
  });

  it('should print errors/use default config when config file is invalid JSON', async function () {
    const exitCode = await testValidator([
      '-c',
      './test/cli-validator/mock-files/config/invalid-json.json',
      './test/cli-validator/mock-files/oas3/clean.yml',
    ]);

    // The config file is invalid, so we should end up using the default config instead.
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
    expect(exitCode).toEqual(0);
    const allOutput = capturedText.join('');

    expect(allOutput).toMatch(/Unable to load config file/);
    expect(allOutput).toMatch(/SyntaxError: Unexpected token/);
    expect(allOutput).toMatch(/validator will use a default config/);
  });
});
