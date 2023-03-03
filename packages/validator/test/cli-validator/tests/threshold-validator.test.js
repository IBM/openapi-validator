/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getCapturedText, testValidator } = require('../../test-utils');

describe('test the .thresholdrc limits', function() {
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

  it('should show error and set exit code to 1 when warning limit exceeded', async function() {
    const exitCode = await testValidator([
      '--limits',
      './test/cli-validator/mock-files/thresholds/five-warnings.json',
      './test/cli-validator/mock-files/oas3/warn-threshold.yml'
    ]);
    expect(exitCode).toEqual(1);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);

    expect(capturedText[0].slice(14, 32)).toEqual(`Number of warnings`);
  });

  it('should print errors for unsupported limit options and invalid limit values', async function() {
    const exitCode = await testValidator([
      '--limits',
      './test/cli-validator/mock-files/thresholds/invalid-values.json',
      './test/cli-validator/mock-files/oas3/clean.yml'
    ]);
    // limit values invalid, so default limit, Number.MAX_VALUE, used
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
    expect(exitCode).toEqual(0);
    const allOutput = capturedText.join('');

    expect(allOutput.includes('"population" limit not supported.')).toEqual(
      true
    );

    expect(allOutput.includes('Value provided for warnings')).toEqual(true);
  });

  it('should give exit code 0 when warnings limit not exceeded', async function() {
    const exitCode = await testValidator([
      './test/cli-validator/mock-files/oas3/clean.yml',
      '--limits',
      './test/cli-validator/mock-files/thresholds/zero-warnings.json'
    ]);
    expect(exitCode).toEqual(0);
  });

  it('should give an error for invalid JSON', async function() {
    const args = [
      '--limits',
      './test/cli-validator/mock-files/thresholds/invalid-json.json',
      './test/cli-validator/mock-files/oas3/clean.yml'
    ];
    await expect(testValidator(args)).rejects.toBe(2);

    const capturedText = getCapturedText(consoleSpy.mock.calls);
    const allOutput = capturedText.join('');
    expect(
      allOutput.includes(
        '[Error] There is a problem with the .thresholdrc file.'
      )
    );
  });
});
