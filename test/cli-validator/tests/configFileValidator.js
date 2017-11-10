const intercept = require("intercept-stdout");
const expect = require("expect");
const stripAnsiFrom = require('strip-ansi');
const chalk = require('chalk');

const configFileValidator = require("../../../dist/src/cli-validator/processConfiguration").validate;

describe('cli tool - test config file validator', function() {

  it('should print no errors with a clean config object', function() {

    let config = {
      "operations" : {
        "no_consumes_for_put_or_post": "error",
        "get_op_has_consumes": "warning",
        "no_produces_for_get": "error",
        "no_operation_id": "warning",
        "no_summary": "warning",
        "no_array_responses": "error"
      },
      "parameters" : {
        "no_parameter_description": "error",
        "snake_case_only": "warning",
        "invalid_type_format_pair": "error"
      },
      "schemas" : {
        "invalid_type_format_pair": "error",
        "snake_case_only": "warning",
        "no_property_description": "warning",
        "description_mentions_json": "warning"
      },
      "walker" : {
        "no_empty_descriptions" : "error"
      }
    };

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let res = configFileValidator(config, chalk);

    unhook_intercept();

    expect(captured_text.length).toEqual(0);
  });

  it('should print an error for an unsupported category', function() {

    let config = {
      "operations" : {
        "no_consumes_for_put_or_post": "error",
        "get_op_has_consumes": "warning",
        "no_produces_for_get": "error",
        "no_operation_id": "warning",
        "no_summary": "warning",
        "no_array_responses": "error"
      },
      "nonValidCategory" : {
        "no_parameter_description": "error",
        "snake_case_only": "warning",
        "invalid_type_format_pair": "error"
      },
      "schemas" : {
        "invalid_type_format_pair": "error",
        "snake_case_only": "warning",
        "no_property_description": "warning",
        "description_mentions_json": "warning"
      },
      "walker" : {
        "no_empty_descriptions" : "error"
      }
    };

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let res = configFileValidator(config, chalk);

    unhook_intercept();

    expect(captured_text[0]).toEqual('\nError Invalid configuration in .validaterc file. See below for details.\n\n');
    expect(captured_text[1].split('\n')[0]).toEqual(' - \'nonValidCategory\' is not a valid category.');
  });

  it('should print an error for an unsupported rule name', function() {

    let config = {
      "operations" : {
        "nonValidRule": "error",
        "get_op_has_consumes": "warning",
        "no_produces_for_get": "error",
        "no_operation_id": "warning",
        "no_summary": "warning",
        "no_array_responses": "error"
      },
      "parameters" : {
        "no_parameter_description": "error",
        "snake_case_only": "warning",
        "invalid_type_format_pair": "error"
      },
      "schemas" : {
        "invalid_type_format_pair": "error",
        "snake_case_only": "warning",
        "no_property_description": "warning",
        "description_mentions_json": "warning"
      },
      "walker" : {
        "no_empty_descriptions" : "error"
      }
    };

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let res = configFileValidator(config, chalk);

    unhook_intercept();

    expect(captured_text[0]).toEqual('\nError Invalid configuration in .validaterc file. See below for details.\n\n');
    expect(captured_text[1].split('\n')[0]).toEqual(' - \'nonValidRule\' is not a valid rule for the operations category');
  });

  it('should print an error for an unsupported rule status', function() {

    let config = {
      "operations" : {
        "no_consumes_for_put_or_post": "error",
        "get_op_has_consumes": "warning",
        "no_produces_for_get": "error",
        "no_operation_id": "warning",
        "no_summary": "warning",
        "no_array_responses": "error"
      },
      "parameters" : {
        "no_parameter_description": "error",
        "snake_case_only": "warning",
        "invalid_type_format_pair": "error"
      },
      "schemas" : {
        "invalid_type_format_pair": "error",
        "snake_case_only": "warning",
        "no_property_description": "warning",
        "description_mentions_json": "warning"
      },
      "walker" : {
        "no_empty_descriptions" : "nonValidStatus"
      }
    };

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let res = configFileValidator(config, chalk);

    unhook_intercept();

    expect(captured_text[0]).toEqual('\nError Invalid configuration in .validaterc file. See below for details.\n\n');
    expect(captured_text[1]).toEqual(' - \'nonValidStatus\' is not a valid status for the no_empty_descriptions rule in the walker category.\n   For any rule, the only valid statuses are: error, warning, off\n\n');
  });

  it('should fill in default values for rules that are not included', function() {

    let defaults = {
      "operations" : {
        "no_consumes_for_put_or_post": "error",
        "get_op_has_consumes": "warning",
        "no_produces_for_get": "error",
        "no_operation_id": "warning",
        "no_summary": "warning",
        "no_array_responses": "error"
      },
      "parameters" : {
        "no_parameter_description": "error",
        "snake_case_only": "warning",
        "invalid_type_format_pair": "error"
      },
      "schemas" : {
        "invalid_type_format_pair": "error",
        "snake_case_only": "warning",
        "no_property_description": "warning",
        "description_mentions_json": "warning"
      },
      "walker" : {
        "no_empty_descriptions" : "error"
      }
    };

    let config = {
      "operations" : {
        "no_consumes_for_put_or_post": "error",
        "get_op_has_consumes": "warning",
        "no_produces_for_get": "error",
        "no_operation_id": "warning",
        "no_summary": "warning",
        "no_array_responses": "error"
      }
    };

    let captured_text = [];
     
    let unhook_intercept = intercept(function(txt) {
      captured_text.push(stripAnsiFrom(txt));
      return '';
    });

    let res = configFileValidator(config, chalk);

    unhook_intercept();

    let defaultSchemas = JSON.stringify(defaults.schemas, null, 2);
    let configSchemas = JSON.stringify(res.schemas, null, 2);

    expect(captured_text.length).toEqual(0);
    expect(defaultSchemas).toEqual(configSchemas);
  });
});