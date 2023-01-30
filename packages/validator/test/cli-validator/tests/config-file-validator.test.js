// the rule names are all snake case and need to stay that way. don't lint them
/* eslint-disable camelcase */

const chalk = require('chalk');
const { getCapturedText } = require('../../test-utils');

const { defaults } = require('../../../src/.defaultsForValidator');

const configFileValidator = require('../../../src/cli-validator/utils/process-configuration')
  .validate;

describe('cli tool - test config file validator', function() {
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

  it('should print no errors with a clean config object', function() {
    // defaults should not throw any errors in the validator
    const config = defaults;

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(res.invalid).toEqual(false);
    expect(capturedText.length).toEqual(0);
  });

  it('should print an error for an unsupported spec', function() {
    const config = {
      openApi4: {
        operations: {
          no_operation_id: 'warning'
        },
        nonValidCategory: {
          no_parameter_description: 'error',
          snake_case_only: 'warning',
          invalid_type_format_pair: 'error'
        },
        walker: {
          no_empty_descriptions: 'error'
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(res.invalid).toEqual(true);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid configuration in .validaterc file. See below for details.'
    );
    expect(capturedText[1].trim().split('\n')[0]).toEqual(
      "- 'openApi4' is not a valid spec."
    );
  });

  it('should print an error for an unsupported category', function() {
    const config = {
      shared: {
        nonValidCategory: {
          no_parameter_description: 'error',
          snake_case_only: 'warning',
          invalid_type_format_pair: 'error'
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(res.invalid).toEqual(true);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid configuration in .validaterc file. See below for details.'
    );
    expect(capturedText[1].trim().split('\n')[0]).toEqual(
      "- 'nonValidCategory' is not a valid category."
    );
  });

  it('should print an error for an unsupported rule name', function() {
    const config = {
      shared: {
        operations: {
          nonValidRule: 'error'
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(res.invalid).toEqual(true);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid configuration in .validaterc file. See below for details.'
    );
    expect(capturedText[1].trim().split('\n')[0]).toEqual(
      "- 'nonValidRule' is not a valid rule for the operations category"
    );
  });

  it('should print no errors with a config object that includes a deprecated rule', function() {
    const config = {
      shared: {
        operations: {
          inline_response_schema: 'error'
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);
    // console.warn(`Captured text: ${capturedText}`);

    expect(res.invalid).toEqual(false);
    expect(capturedText.length).toEqual(1);
    expect(capturedText[0].trim()).toEqual(
      "[Warning] The rule 'inline_response_schema' has been deprecated. It will not be checked. Use 'inline-response-schema (spectral rule)' instead."
    );
  });
});
