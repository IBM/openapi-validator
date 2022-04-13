# IBM Cloud Legacy Validation Ruleset
This document outlines how to configure and use the IBM Cloud Legacy Validation ruleset.


## Table of contents

<!--
  The TOC below is generated using the `markdown-toc` node package.

      https://github.com/jonschlinkert/markdown-toc

  You should regenerate the TOC after making changes to this file.

      markdown-toc --maxdepth 4 -i ibm-legacy-rules.md
  -->

<!-- toc -->

- [Setup](#setup)
- [Definitions](#definitions)
  * [Specs](#specs)
  * [Categories](#categories)
  * [Rules](#rules)
  * [Statuses](#statuses)
  * [Configuration Options](#configuration-options)
- [Configuration file](#configuration-file)
- [Default mode](#default-mode)
  * [Default values](#default-values)

<!-- tocstop -->

### Setup
To prepare for creating a customized configuration of the legacy validation rules, simply run the command `lint-openapi init`.
This will create (or overwrite) a `.validaterc` file with all rules set to their [default value](#default-values).
This command does not create a `.validateignore`. That file must be created manually. These rules can then be changed to configure the validator. Continue reading for more details.

_WARNING: If a `.validaterc` file already exists and has been customized, this command will reset all rules to their default values._

It is recommended to place these files in the root directory of your project. The code will recursively search up the filesystem for these files from wherever the validator is being run. Wherever in the file system the validator is being run, the nearest versions of these files will be used.

### Definitions

#### Specs

The validator supports two API definition specifications - OpenAPI 2.0, aka Swagger 2.0, and OpenAPI 3.0. The validator will automatically determine which spec a document is written in. There are some rules in the validator that only apply to one of the specs and some rules that apply to both. The configuration structure is organized by these "specs".
The supported specs are described below:

| Spec     | Description                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| swagger2 | Rules pertaining only to the [OpenAPI 2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) specification.  |
| oas3     | Rules pertaining only to the [OpenAPI 3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md) specification |
| shared   | Rules pertaining to both of the above specifications.                                                                                |

#### Categories

Rules are further organized by categories. Not every category is supported in every spec - these are a superset of the available categories. For the actual structure, see the [default values](#default-values).
The supported categories are described below:

| Category   | Description                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| operations | Rules pertaining to [Operation Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#operationObject) |
| paths      | Rules pertaining to [Paths Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#pathsObject)         |
| schemas    | Rules pertaining to [Schema Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject)       |
| security_definitions | Rules pertaining to [Security Definition Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#securityDefinitionsObject) |
| security   | Rules pertaining to [Security Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#securityRequirementObject) |
| walker     | Rules pertaining to the entire document.                                                                                              |

#### Rules

Each category contains a group of rules. The spec that each rule applies to is marked in the third column. For the actual configuration structure, see the [default values](#default-values).
You can use the `-v` option of the CLI validator to display the rule for each reported result.
The supported rules are described below:

##### operations
| Rule                         | Description                                                                         | Spec     |
| ---------------------------- | ----------------------------------------------------------------------------------- | -------- |
| no_consumes_for_put_or_post  | Flag `put` or `post` operations that do not have a `consumes` field.                | swagger2 |
| get_op_has_consumes          | Flag `get` operations that contain a `consumes` field.                              | swagger2 |
| no_produces                  | Flag operations that do not have a `produces` field (except for `head` and operations that return a 204). | swagger2 |
| no_array_responses           | Flag any operations with a top-level array response.                                | shared   |
| parameter_order              | Flag any operations with optional parameters before a required param.               | shared   |


##### paths
| Rule                        | Description                                                                                                  | Spec   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| missing_path_parameter      | For a path that contains path parameters, flag any operations that do not correctly define those parameters. | shared |
| snake_case_only             | Flag any path segment that does not use snake case.                                                          | shared |
| paths_case_convention       | Flag any path segment that does not follow a given case convention. snake_case_only must be 'off' to use.    | shared |
| duplicate_path_parameter    | Flag any path parameters that have identical definitions in all operations. | shared |

##### [responses][4]
| Rule                      | Description                                                  | Spec |
| ------------------------- | ------------------------------------------------------------ | ---- |
| inline_response_schema    | Flag any response object with a schema that doesn't reference a named model. Even if the model is only used once, naming it offers significant benefits for SDK generation. | shared |
| no_success_response_codes | Flag any response object that has no success response codes. | oas3 |
| no_response_body          | Flag any non-204 success responses without a response body.  | oas3 |
| ibm_status_code_guidelines| Flag any violations of status code conventions per IBM API Handbook  | oas3 |

##### schemas
| Rule                        | Description                                                                   | Spec     |
| --------------------------- | ----------------------------------------------------------------------------- | -------- |
| invalid_type_format_pair    | Flag any schema that does not follow the [data type/format rules.][2]         | shared   |
| snake_case_only             | Flag any property with a `name` that is not lower snake case.                 | shared   |
| json_or_param_binary_string | Flag parameters or application/json request/response bodies with schema type: string, format: binary. | oas3 |

##### walker
| Rule                          | Description                                                                  | Spec   |
| ----------------------------- | ---------------------------------------------------------------------------- | ------ |
| no_empty_descriptions         | Flag any `description` field in the spec with an empty or whitespace string. | shared |
| has_circular_references       | Flag any circular references found in the API document.                      | shared |
| $ref_siblings                 | Flag any properties that are siblings of a `$ref` property.                  | shared |
| duplicate_sibling_description | Flag descriptions sibling to `$ref` if identical to referenced description.  | shared |
| incorrect_ref_pattern        | Flag internal `$ref` values that do not point to the section they should (e.g. referencing `parameters` from a `schema` field). | shared |

[1]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat
[2]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#parameter-object
[3]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#requestBodyObject
[4]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#responseObject

#### Statuses

Each rule can be assigned a status. The supported statuses are `error`, `warning`, `info`, `hint` and `off`.
Some rules can be configured further with configuration options. The format of this configuration is to provide an array, rather than just a string. e.g.
`"paths_case_convention": ["error", "lower_camel_case"]`
If just a string is provided for these rule, the default configuration option will be used. If only one value is provided in the array, it **MUST** be a status. The default configuration option will be used in this case as well. The rules that support configuration options will have **two** values in the [defaults](#default-values) table.

#### Configuration Options

For rules that accept additional configuration, there will be a limited set of available options.

##### Case Convention Options
- Some rules check strings for adherence to a specific case convention. In some cases, the case convention checked is configurable.
- Rules with configurable case conventions will end in `_case_convention`, such as `paths_case_convention`.

| Option           | Description                                              | Example           |
| ---------------- | -------------------------------------------------------- | ----------------- |
| lower_snake_case | Words must follow standard lower snake case conventions. | learning_opt_out  |
| upper_snake_case | Words must follow standard upper snake case conventions. | LEARNING_OPT_OUT  |
| upper_camel_case | Words must follow standard upper camel case conventions. | LearningOptOut    |
| lower_camel_case | Words must follow standard lower camel case conventions. | learningOptOut    |
| k8s_camel_case   | Words must follow Kubernetes API camel case conventions. | learningOptOutAPI |
| lower_dash_case  | Words must follow standard lower dash case conventions.  | learning-opt-out  |
| upper_dash_case  | Words must follow standard upper dash case conventions.  | LEARNING-OPT-OUT  |

### Configuration file

Non-Spectral configurations are defined in a file, titled __.validaterc__. **Spectral rules must be configured in `.spectral.yaml` rather than in `.validaterc`.**
Additionally, certain files can be ignored by the validator. Any glob placed in a file called `.validateignore` will always be ignored by the validator at runtime. This is set up like a `.gitignore` or a `.eslintignore` file.

The configuration file must be structured as a JSON object with specs as first-level keys, categories as second-level keys, rules as third-level keys, and statuses as values for the 'rules' objects.

If a rule is not included in the file, that rule will be set to the default status automatically. See the [Default Values](#default-values) for more info.

For an example of the structure, see the [defaults file](https://github.com/IBM/openapi-validator/blob/main/src/.defaultsForValidator.js).

The easiest way to create a `.validaterc` file is using the [initialization command](#setup).

### Default mode

The validator has a set of predefined default statuses for each rule that are used in 'default mode'.

Default mode can be turned on with the command line option `-d`. If this option is given, the `.validaterc` file will be ignored.

If a `.validaterc` file does not exist at the root directory of your project, the validator will automatically run in default mode.

The default values for each rule are described below.

#### Default values

##### swagger2

###### operations
| Rule                        | Default |
| --------------------------- | ------- |
| no_consumes_for_put_or_post | error   |
| get_op_has_consumes         | warning |
| no_produces                 | error   |


##### oas3

###### operations
| Rule                        | Default |
| --------------------------- | ------- |

##### responses
| Rule                      | Default |
| ------------------------- | ------- |
| no_success_response_codes | warning |
| no_response_body          | warning |
| ibm_status_code_guidelines| warning |

##### schemas

| Rule                        | Default |
| --------------------------- | ------- |
| json_or_param_binary_string | warning |

##### shared

###### operations
| Rule                         | Default |
| ---------------------------- | ------- |
| no_array_responses           | error   |
| parameter_order              | warning |

###### paths
| Rule                        | Default |
| --------------------------- | ------- |
| missing_path_parameter      | error   |
| snake_case_only             | off     |
| paths_case_convention       | error, lower_snake_case |

##### responses
| Rule                      | Default |
| ------------------------- | ------- |
| inline_response_schema    | warning |

###### schemas
| Rule                        | Default |
| --------------------------- | ------- |
| invalid_type_format_pair    | error   |
| snake_case_only             | off     |

###### walker
| Rule                          | Default |
| ----------------------------- | ------- |
| no_empty_descriptions         | error   |
| has_circular_references       | warning |
| $ref_siblings                 | off     |
| duplicate_sibling_description | warning |
| incorrect_ref_pattern        | warning |
