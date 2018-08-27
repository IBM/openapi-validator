// the rule names are all snake case and need to stay that way. don't lint them
/* eslint-disable camelcase */

const intercept = require('intercept-stdout');
const expect = require('expect');
const stripAnsiFrom = require('strip-ansi');
const chalk = require('chalk');

const defaults = require('../../../src/.defaultsForValidator');

const configFileValidator = require('../../../src/cli-validator/utils/processConfiguration')
  .validate;

describe('cli tool - test config file validator', function() {
  it('should print no errors with a clean config object', function() {
    const config = {
      shared: {
        operations: {
          no_operation_id: 'warning',
          no_summary: 'warning',
          no_array_responses: 'error',
          parameter_order: 'warning'
        },
        parameters: {
          no_parameter_description: 'error',
          snake_case_only: 'warning',
          invalid_type_format_pair: 'error',
          content_type_parameter: 'error',
          accept_type_parameter: 'error'
        },
        paths: {
          missing_path_parameter: 'error'
        },
        security_definitions: {
          unused_security_schemes: 'warning',
          unused_security_scopes: 'warning'
        },
        security: {
          invalid_non_empty_security_array: 'error'
        },
        schemas: {
          invalid_type_format_pair: 'error',
          snake_case_only: 'warning',
          no_property_description: 'warning',
          description_mentions_json: 'warning',
          array_of_arrays: 'warning'
        },
        walker: {
          no_empty_descriptions: 'error',
          has_circular_references: 'warning',
          $ref_siblings: 'off'
        }
      },
      swagger2: {
        operations: {
          no_consumes_for_put_or_post: 'error',
          get_op_has_consumes: 'warning',
          no_produces_for_get: 'error'
        }
      },
      oas3: {
        operations: {
          no_request_body_content: 'error'
        }
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

    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const res = configFileValidator(config, chalk);

    unhookIntercept();

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

    const capturedText = [];

    const unhookIntercept = intercept(function(txt) {
      capturedText.push(stripAnsiFrom(txt));
      return '';
    });

    const res = configFileValidator(config, chalk);

    unhookIntercept();

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
          snake_case_only: 'warning',
          invalid_type_format_pair: 'error'
        },
        walker: {
          no_empty_descriptions: 'error'
        }
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
          no_produces_for_get: 'nonValidStatus'
        }
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
    expect(capturedText[0].trim()).toEqual(
      '[Error] Invalid configuration in .validaterc file. See below for details.'
    );
    expect(capturedText[1].trim()).toEqual(
      "- 'nonValidStatus' is not a valid status for the no_produces_for_get rule in the operations category.\n   For any rule, the only valid statuses are: error, warning, off"
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
