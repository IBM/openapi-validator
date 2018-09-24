/*
    **********   DO NOT MODIFY THIS FILE   **********


    To configure the validator, edit the '.validaterc'
    file in the root folder of this project.

    This file contains the defaults rules for the
    validator. It is used to check for errors in
    the .validaterc file and for running the
    validator in default mode.

    NOTE: If you are contributing a validation to this code
    base, you should add the default rule to this object.
    In that case, please modify this file.

    Additionally, if a rule is being deprecated and/or replaced,
    this file must be modified (see bottom of file).
*/

const defaults = {
  'shared': {
    'operations': {
      'no_operation_id': 'warning',
      'no_summary': 'warning',
      'no_array_responses': 'error',
      'parameter_order': 'warning'
    },
    'parameters': {
      'no_parameter_description': 'error',
      'param_name_case_convention': ['warning', 'lower_snake_case'],
      'invalid_type_format_pair': 'error',
      'content_type_parameter': 'error',
      'accept_type_parameter': 'error',
      'authorization_parameter': 'warning',
      'required_param_has_default': 'warning'
    },
    'paths': {
      'missing_path_parameter': 'error',
      'snake_case_only': 'warning'
    },
    'security_definitions': {
      'unused_security_schemes': 'warning',
      'unused_security_scopes': 'warning'
    },
    'security': {
      'invalid_non_empty_security_array': 'error'
    },
    'schemas': {
      'invalid_type_format_pair': 'error',
      'snake_case_only': 'warning',
      'no_property_description': 'warning',
      'description_mentions_json': 'warning',
      'array_of_arrays': 'warning'
    },
    'walker': {
      'no_empty_descriptions': 'error',
      'has_circular_references': 'warning',
      '$ref_siblings': 'off'
    }
  },
  'swagger2': {
    'operations': {
      'no_consumes_for_put_or_post': 'error',
      'get_op_has_consumes': 'warning',
      'no_produces': 'warning'
    }
  },
  'oas3': {
    'operations': {
      'no_request_body_content': 'error'
    },
    'parameters': {
      'no_in_property': 'error',
      'invalid_in_property': 'error',
      'missing_schema_or_content': 'error',
      'has_schema_and_content': 'error'
    },
    'responses': {
      'no_response_codes': 'error',
      'no_success_response_codes': 'warning'
    }
  }
};

// Put deprecated rules here. If the rule was replaced by a new one,
// add that as a string property. If not, make the property an empty string.
// Example:
/*
{
  'replaced_rule': 'new_rule',
  'unreplaced_rule': '
}
*/
const deprecated = {
  'no_produces_for_get': 'no_produces',
  'parameters.snake_case_only': 'param_name_case_convention'
};

const configOptions = {
  'case_conventions': [
    'lower_snake_case',
    'upper_camel_case',
    'lower_camel_case',
    'lower_dash_case',
    'operation_id_case'
  ]
};


module.exports.defaults = defaults;
module.exports.deprecated = deprecated;
module.exports.options = configOptions;
