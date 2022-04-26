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
    // we need to leave the categories in the structure for
    // the deprecation logic to behave in a helpful way
    'operations': {},
    'parameters': {},
    'pagination': {},
    'security_definitions': {},
    'security': {},
    'paths': {},
    'responses': {},
    'schemas': {},
    'walker': {
      'has_circular_references': 'warning',
      'incorrect_ref_pattern': 'warning'
    }
  },
  'swagger2': {
    'operations': {}
  },
  'oas3': {
    'operations': {},
    'responses': {},
    'schemas': {}
  }
};

// Put deprecated rules here. If the rule was replaced by a new one,
// add that as a string property. If not, make the property an empty string.
// Example:
/*
{
  'replaced_rule': 'new_rule',
  'unreplaced_rule': ''
}
*/
const deprecated = {
  'no_produces_for_get': '',
  'parameters.snake_case_only': 'parameter-case-convention (spectral rule)',
  'undefined_required_properties': 'missing-required-property (spectral rule)',
  'array_of_arrays': 'array-of-arrays (spectral rule)',
  'no_schema_description': 'schema-description (spectral rule)',
  'no_property_description': 'property-description (spectral rule)',
  'description_mentions_json': 'description-mentions-json (spectral rule)',
  'no_parameter_description': 'parameter-description (spectral rule)',
  'required_param_has_default': 'parameter-default (spectral rule)',
  'param_name_case_convention': 'parameter-case-convention (spectral rule)',
  'authorization_parameter': 'authorization-parameter (spectral rule)',
  'accept_type_parameter': 'accept-parameter (spectral rule)',
  'content_type_parameter': 'content-type-parameter (spectral rule)',
  'property_case_convention': 'property-case-convention (spectral rule)',
  'enum_case_convention': 'enum-case-convention (spectral rule)',
  'pagination_style': 'pagination-style (spectral rule)',
  'property_case_collision': 'property-case-collision (spectral rule)',
  'inconsistent_property_type': 'property-inconsistent-name-and-type (spectral rule)',
  'unused_security_schemes': 'security-schemes (spectral rule)',
  'unused_security_scopes': 'security-schemes (spectral rule)',
  'invalid_non_empty_security_array': 'security-schemes (spectral rule)',
  'no_summary': 'operation-summary (spectral rule)',
  'no_operation_id': 'operation-operationId (spectral rule)',
  'undefined_tag': 'operation-tag-defined (spectral rule)',
  'unused_tag': 'unused-tag (spectral rule)',
  'no_request_body_name': 'request-body-name (spectral rule)',
  'operation_id_case_convention': 'operation-id-case-convention (spectral rule)',
  'operation_id_naming_convention': 'operation-id-naming-convention (spectral rule)',
  'no_array_responses': 'array-responses (spectral rule)',
  'parameter_order': 'parameter-order (spectral rule)',
  'missing_path_parameter': 'path-params and path-declarations-must-exist (spectral rule)',
  'duplicate_path_parameter': 'duplicate-path-parameter (spectral rule)',
  'paths.snake_case_only': 'path-segment-case-convention (spectral rule)',
  'paths_case_convention': 'path-segment-case-convention (spectral rule)',
  'inline_response_schema': 'inline-response-schema (spectral rule)',
  'no_success_response_codes': 'response-status-codes (spectral rule)',
  'protocol_switching_and_success_code': 'response-status-codes (spectral rule)',
  'no_response_body': 'response-status-codes (spectral rule)',
  'ibm_status_code_guidelines': 'response-status-codes (spectral rule)',
  'invalid_type_format_pair': 'valid-type-format (spectral rule)',
  'schemas.snake_case_only': 'property-case-convention (spectral rule)',
  'no_consumes_for_put_or_post': '',
  'get_op_has_consumes': '',
  'no_produces': '',
  'parameters.invalid_type_format_pair': 'valid-type-format (spectral rule)',
  'schemas.snake_case_only': 'property-case-convention (spectral rule)',
  'json_or_param_binary_string': 'binary-schemas (spectral rule)',
  'no_empty_descriptions': 'schema-description, property-description, operation-description or parameter-description (spectral rules)',
  '$ref_siblings': 'no-$ref-siblings (spectral rule)',
  'duplicate_sibling_description': '',
};

const configOptions = {
  'case_conventions': [
    'lower_snake_case',
    'upper_snake_case',
    'upper_camel_case',
    'lower_camel_case',
    'k8s_camel_case',
    'lower_dash_case',
    'upper_dash_case'
  ]
};

module.exports.defaults = defaults;
module.exports.deprecated = deprecated;
module.exports.options = configOptions;
