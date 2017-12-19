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
*/

const defaults = {
  "operations": {
    "no_consumes_for_put_or_post": "error",
    "get_op_has_consumes": "warning",
    "no_produces_for_get": "error",
    "no_operation_id": "warning",
    "no_summary": "warning",
    "no_array_responses": "error"
  },
  "parameters": {
    "no_parameter_description": "error",
    "snake_case_only": "warning",
    "invalid_type_format_pair": "error"
  },
  "paths": {
    "missing_path_parameter": "error"
  },
  "schemas": {
    "invalid_type_format_pair": "error",
    "snake_case_only": "warning",
    "no_property_description": "warning",
    "description_mentions_json": "warning"
  },
  "security_definitions": {
    "unused_security_schemes": "warning",
    "unused_security_scopes": "warning"
  },
  "security": {
    "invalid_non_empty_security_array": "error"
  },
  "walker": {
    "no_empty_descriptions" : "error",
    "has_circular_references": "warning"
  }
};

module.exports = defaults;
