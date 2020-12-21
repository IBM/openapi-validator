// the rule names are all snake case and need to stay that way. don't lint them
/* eslint-disable camelcase */

const chalk = require('chalk');
const { getCapturedText } = require('../../test-utils');

const { defaults, options } = require('../../../src/.defaultsForValidator');

const configFileValidator = require('../../../src/cli-validator/utils/processConfiguration')
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

  // deprecated rule with the period in it
  it('should print no errors with a config object that includes a nested deprecated rule', function() {
    const config = {
      shared: {
        parameters: {
          snake_case_only: 'error',
          content_type_parameter: 'error',
          accept_type_parameter: 'error'
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(res.invalid).toEqual(false);
    expect(capturedText.length).toEqual(1);
    expect(capturedText[0].trim()).toEqual(
      "[Warning] The rule 'parameters.snake_case_only' has been deprecated. It will not be checked. Use 'param_name_case_convention' instead."
    );
  });

  // just a string when supposed to be an array, corrects the array when string is valid
  it('should create array when given a valid status string for rules with config options', function() {
    const config = {
      shared: {
        parameters: {
          param_name_case_convention: 'error'
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const status = res.shared.parameters.param_name_case_convention;
    const defaultStatus = defaults.shared.parameters.param_name_case_convention;

    expect(res.invalid).toEqual(false);
    expect(capturedText.length).toEqual(0);
    expect(Array.isArray(status)).toEqual(true);
    expect(status[0]).toEqual(defaultStatus[0]);
    expect(status[1]).toEqual(defaultStatus[1]);
  });

  // just a string when supposed to be an array, throws error when string is invalid
  it('should error when given an invalid status string for rules with config options', function() {
    const config = {
      shared: {
        parameters: {
          param_name_case_convention: 'snake_case'
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
      "- 'snake_case' is not a valid status for the param_name_case_convention rule in the parameters category.\n   Valid statuses are: error, warning, info, hint, off"
    );
  });

  // handles empty array
  it('should error when given an empty array for rules with config options', function() {
    const config = {
      shared: {
        parameters: {
          param_name_case_convention: []
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
      "- '' is not a valid status for the param_name_case_convention rule in the parameters category.\n   Valid statuses are: error, warning, info, hint, off"
    );
  });

  // handles array with one value that is valid
  it('should not error when given an array with one valid status for a rule with config options', function() {
    const config = {
      shared: {
        parameters: {
          param_name_case_convention: ['error']
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    expect(res.invalid).toEqual(false);
    expect(capturedText.length).toEqual(0);
    expect(res.shared.parameters.param_name_case_convention[0]).toEqual(
      'error'
    );
  });

  // handles array with only one value that is not valid
  it('should error when given an array with one invalid status for rule with config options', function() {
    const config = {
      shared: {
        parameters: {
          param_name_case_convention: ['camel_case']
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
      "- 'camel_case' is not a valid status for the param_name_case_convention rule in the parameters category.\n   Valid statuses are: error, warning, info, hint, off"
    );
  });

  it('should error when given an array for rules without config options', function() {
    const config = {
      shared: {
        parameters: {
          no_parameter_description: ['error', 'camel_case']
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
      '- Array-value configuration options are not supported for the no_parameter_description rule in the parameters category.\n   Valid statuses are: error, warning, info, hint, off'
    );
  });

  it('should error when given an invalid config option', function() {
    const config = {
      shared: {
        parameters: {
          param_name_case_convention: ['error', 'nowordseparatorscase']
        }
      }
    };

    const res = configFileValidator(config, chalk);
    const capturedText = getCapturedText(consoleSpy.mock.calls);

    const validOptions = options.case_conventions.join(', ');

    expect(res.invalid).toEqual(true);
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid configuration in .validaterc file. See below for details.'
    );
    expect(capturedText[1].trim()).toEqual(
      `- 'nowordseparatorscase' is not a valid option for the param_name_case_convention rule in the parameters category.\n   Valid options are: ${validOptions}`
    );
  });
});
