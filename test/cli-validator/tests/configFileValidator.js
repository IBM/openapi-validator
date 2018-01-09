require('babel-polyfill');

// the rule names are all snake case and need to stay that way. don't lint them
/* eslint-disable camelcase */

const intercept = require('intercept-stdout');
const expect = require('expect');
const stripAnsiFrom = require('strip-ansi');
const chalk = require('chalk');

const configFileValidator = require('../../../dist/src/cli-validator/utils/processConfiguration')
  .validate;

describe('cli tool - test config file validator', function() {
  it('should print no errors with a clean config object', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error',
        get_op_has_consumes: 'warning',
        no_produces_for_get: 'error',
        no_operation_id: 'warning',
        no_summary: 'warning',
        no_array_responses: 'error'
      },
      parameters: {
        no_parameter_description: 'error',
        snake_case_only: 'warning',
        invalid_type_format_pair: 'error'
      },
      schemas: {
        invalid_type_format_pair: 'error',
        snake_case_only: 'warning',
        no_property_description: 'warning',
        description_mentions_json: 'warning'
      },
      walker: {
        no_empty_descriptions: 'error'
      }
    };

    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const res = configFileValidator(config, chalk);

    unhookIntercept();

    expect(res.invalid).toEqual(false);
    expect(capturedText.length).toEqual(0);
  });

  it('should print an error for an unsupported category', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error',
        get_op_has_consumes: 'warning',
        no_produces_for_get: 'error',
        no_operation_id: 'warning',
        no_summary: 'warning',
        no_array_responses: 'error'
      },
      nonValidCategory: {
        no_parameter_description: 'error',
        snake_case_only: 'warning',
        invalid_type_format_pair: 'error'
      },
      schemas: {
        invalid_type_format_pair: 'error',
        snake_case_only: 'warning',
        no_property_description: 'warning',
        description_mentions_json: 'warning'
      },
      walker: {
        no_empty_descriptions: 'error'
      }
    };

    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const res = configFileValidator(config, chalk);

    unhookIntercept();

    expect(res.invalid).toEqual(true);
    expect(capturedText[0]).toEqual(
      '\n[Error] Invalid configuration in .validaterc file. See below for details.\n\n'
    );
    expect(capturedText[1].split('\n')[0]).toEqual(
      " - 'nonValidCategory' is not a valid category."
    );
  });

  it('should print an error for an unsupported rule name', function() {
    const config = {
      operations: {
        nonValidRule: 'error',
        get_op_has_consumes: 'warning',
        no_produces_for_get: 'error',
        no_operation_id: 'warning',
        no_summary: 'warning',
        no_array_responses: 'error'
      },
      parameters: {
        no_parameter_description: 'error',
        snake_case_only: 'warning',
        invalid_type_format_pair: 'error'
      },
      schemas: {
        invalid_type_format_pair: 'error',
        snake_case_only: 'warning',
        no_property_description: 'warning',
        description_mentions_json: 'warning'
      },
      walker: {
        no_empty_descriptions: 'error'
      }
    };

    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const res = configFileValidator(config, chalk);

    unhookIntercept();

    expect(res.invalid).toEqual(true);
    expect(capturedText[0]).toEqual(
      '\n[Error] Invalid configuration in .validaterc file. See below for details.\n\n'
    );
    expect(capturedText[1].split('\n')[0]).toEqual(
      " - 'nonValidRule' is not a valid rule for the operations category"
    );
  });

  it('should print an error for an unsupported rule status', function() {
    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error',
        get_op_has_consumes: 'warning',
        no_produces_for_get: 'error',
        no_operation_id: 'warning',
        no_summary: 'warning',
        no_array_responses: 'error'
      },
      parameters: {
        no_parameter_description: 'error',
        snake_case_only: 'warning',
        invalid_type_format_pair: 'error'
      },
      schemas: {
        invalid_type_format_pair: 'error',
        snake_case_only: 'warning',
        no_property_description: 'warning',
        description_mentions_json: 'warning'
      },
      walker: {
        no_empty_descriptions: 'nonValidStatus'
      }
    };

    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const res = configFileValidator(config, chalk);

    unhookIntercept();

    expect(res.invalid).toEqual(true);
    expect(capturedText[0]).toEqual(
      '\n[Error] Invalid configuration in .validaterc file. See below for details.\n\n'
    );
    expect(capturedText[1]).toEqual(
      " - 'nonValidStatus' is not a valid status for the no_empty_descriptions rule in the walker category.\n   For any rule, the only valid statuses are: error, warning, off\n\n"
    );
  });

  it('should fill in default values for rules that are not included', function() {
    const defaults = {
      operations: {
        no_consumes_for_put_or_post: 'error',
        get_op_has_consumes: 'warning',
        no_produces_for_get: 'error',
        no_operation_id: 'warning',
        no_summary: 'warning',
        no_array_responses: 'error'
      },
      parameters: {
        no_parameter_description: 'error',
        snake_case_only: 'warning',
        invalid_type_format_pair: 'error'
      },
      schemas: {
        invalid_type_format_pair: 'error',
        snake_case_only: 'warning',
        no_property_description: 'warning',
        description_mentions_json: 'warning'
      },
      walker: {
        no_empty_descriptions: 'error'
      }
    };

    const config = {
      operations: {
        no_consumes_for_put_or_post: 'error',
        get_op_has_consumes: 'warning',
        no_produces_for_get: 'error',
        no_operation_id: 'warning',
        no_summary: 'warning',
        no_array_responses: 'error'
      }
    };

    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const res = configFileValidator(config, chalk);

    unhookIntercept();

    const defaultSchemas = JSON.stringify(defaults.schemas, null, 2);
    const configSchemas = JSON.stringify(res.schemas, null, 2);

    expect(res.invalid).toEqual(false);
    expect(capturedText.length).toEqual(0);
    expect(defaultSchemas).toEqual(configSchemas);
  });
});
