// the rule names are all snake case and need to stay that way. don't lint them
/* eslint-disable camelcase */

const chalk = require('chalk');
const { getCapturedText } = require('../../test-utils');

const { defaults } = require('../../../src/.defaultsForValidator');

const configFileValidator = require('../../../src/cli-validator/utils/process-configuration')
  .validate;

describe('cli tool - test config file validator', function() {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
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
          no_operation_id: 'warning',
          no_summary: 'warning',
          no_array_responses: 'error'
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
        operations: {
          no_operation_id: 'warning',
          no_summary: 'warning',
          no_array_responses: 'error'
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
      "- 'nonValidCategory' is not a valid category."
    );
  });

  it('should print an error for an unsupported rule name', function() {
    const config = {
      shared: {
        operations: {
          nonValidRule: 'error',
          no_operation_id: 'warning',
          no_summary: 'warning',
          no_array_responses: 'error'
        },
        parameters: {
          no_parameter_description: 'error',
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
      "- 'nonValidRule' is not a valid rule for the operations category"
    );
  });

  it('should print an error for an unsupported rule status', function() {
    const config = {
      swagger2: {
        operations: {
          no_consumes_for_put_or_post: 'error',
          get_op_has_consumes: 'warning',
          no_produces: 'nonValidStatus'
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(res.invalid).toEqual(true);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid configuration in .validaterc file. See below for details.'
    );
    expect(capturedText[1].trim()).toEqual(
      "- 'nonValidStatus' is not a valid status for the no_produces rule in the operations category.\n   Valid statuses are: error, warning, info, hint, off"
    );
  });

  it('should fill in default values for rules that are not included', function() {
    const config = {
      shared: {
        operations: {
          no_operation_id: 'warning',
          no_summary: 'warning',
          no_array_responses: 'error'
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const defaultSchemas = JSON.stringify(defaults.shared.schemas, null, 2);
    const configSchemas = JSON.stringify(res.shared.schemas, null, 2);

    expect(typeof configSchemas).toEqual('string');
    expect(res.invalid).toEqual(false);
    expect(capturedText.length).toEqual(0);
    expect(defaultSchemas).toEqual(configSchemas);
  });

  it('should print no errors with a config object that includes a deprecated rule', function() {
    const config = {
      swagger2: {
        operations: {
          no_consumes_for_put_or_post: 'error',
          get_op_has_consumes: 'warning',
          no_produces_for_get: 'warning'
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(res.invalid).toEqual(false);
    expect(capturedText.length).toEqual(1);
    expect(capturedText[0].trim()).toEqual(
      "[Warning] The rule 'no_produces_for_get' has been deprecated. It will not be checked. Use 'no_produces' instead."
    );
  });

  it('should error when given an array for rules without config options', function() {
    const config = {
      shared: {
        operations: {
          no_array_responses: ['error', 'camel_case']
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(res.invalid).toEqual(true);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid configuration in .validaterc file. See below for details.'
    );
    expect(capturedText[1].trim()).toEqual(
      '- Array-value configuration options are not supported for the no_array_responses rule in the operations category.\n   Valid statuses are: error, warning, info, hint, off'
    );
  });
});
