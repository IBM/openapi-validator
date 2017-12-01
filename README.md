# Swagger-Validator-IBM

This command line tool lets you validate Swagger files according to the [Swagger API specifications](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md), as well as [custom IBM-defined best practices](http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style). 

##### Prerequisites
- Node 8.9.x
- NPM 5.x

### Installation

1. Clone or download this repository
2. Navigate to the root directory of this project.
3. Install the dependencies using `npm install`
4. Build the command line tool, run `npm run build`.

### Usage

`lint-swagger [options] [command] [<file>]`

#### [options]

-  -v (print_validator_modules) : Print the name of the validator source file the error/warning was caught it. This is primarliy for developing validations.
-  -n (no_colors) : The output is colored by default. If this bothers you, this flag will turn off the coloring.
-  -d (default_mode) : This option turns off [configuration](#configuration) and runs the validator in [default mode](#default-mode).
-  -s (report_statistics) : Print a simple report at the end of the output showing the frequency, in percentage, of each error/warning.
-  -h (help) : This option prints the usage menu.

_These options only apply to running the validator on a file, not to any commands._

#### [command]

- init : The `init` command initializes a .validaterc file, used to [configure](#configuration) the validator. It can also be used to reset the configurable rules to their default values.

None of the above options pertain to this command.

#### \<file>

- The Swagger file to be validated. It must be a valid JSON or YAML file (only .json, .yml, and .yaml file extensions are supported).

### Configuration

The command line validator is built so that each IBM validation can be configured. To get started configuring the validator, [set up](#setup) a file in the root directory of this project with the name `.validaterc` and continue reading this section.

Specfic validation "rules" can be turned off, or configured to trigger either errors or warnings in the validator.

#### Setup

To set up the configuration capability, simply run the command `validate-swagger init`
This will create a .validaterc file with all rules set to their [default value](#default-values). These rules can then be changed to configure the validator. Continue reading for more details.

Note: If a .validaterc file already exists and has been customized, this command will reset all rules to their default values.

#### Categories

Rules are organized by categories. The supported categories are described below:

| Category   | Description                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| operations | Rules pertaining to [Operation Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#operationObject) |
| parameters | Rules pertaining to [Parameter Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterObject) |
| paths      | Rules pertaining to [Paths Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#pathsObject)         |
| schemas    | Rules pertaining to [Schema Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject)       |
| security_definitions | Rules pertaining to [Security Definition Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#securityDefinitionsObject) |
| security   | Rules pertaining to [Security Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#securityRequirementObject) |
| walker     | Rules pertaining to the entire spec.                                                                                              |

#### Rules

Each category contains a group of rules. The supported rules are described below:

##### operations
| Rule                        | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| no_consumes_for_put_or_post | Flag 'put' or 'post' operations that do not have a 'consumes' field. |
| get_op_has_consumes         | Flag 'get' operations that contain a 'consumes' field.               |
| no_produces_for_get         | Flag 'get' operations that do not have a 'produces' field.           |
| no_operation_id             | Flag any operations that do not have an 'operationId' field.         |
| no_summary                  | Flag any operations that do not have a 'summary' field.              |
| no_array_responses          | Flag any operations with a top-level array response.                 |

##### parameters
| Rule                        | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| no_parameter_description    | Flag any parameter that does not contain a 'description' field.      |
| snake_case_only             | Flag any parameter with a 'name' field that does not use snake case. |
| invalid_type_format_pair    | Flag any parameter that does not follow the [data type/format rules.](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat) |

##### paths
| Rule                        | Description                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| missing_path_parameter      | For a path that contains path parameters, flag any operations that do not correctly define those parameters. |

##### schemas
| Rule                        | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| invalid_type_format_pair    | Flag any schema that does not follow the [data type/format rules.](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat) |
| snake_case_only             | Flag any property with a 'name' that is not lower snake case. |
| no_property_description     | Flag any schema that contains a 'property' without a 'description' field.    |
| description_mentions_json   | Flag any schema with a 'property' description that mentions the word 'JSON'. |

##### security_definitions
| Rule                        | Description                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------- |
| unused_security_schemes     | Flag any security scheme defined in securityDefinitions that is not used in the spec. |
| unused_security_scopes      | Flag any security scope defined in securityDefinitions that is not used in the spec.  |

##### security
| Rule                             | Description                                                  |
| -------------------------------- | ------------------------------------------------------------ |
| invalid_non_empty_security_array | Flag any non-empty security array this is not of type OAuth2 |

##### walker
| Rule                        | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| no_empty_descriptions       | Flag any 'description' field in the spec with an empty or whitespace string. |


#### Status

Each rule can be assigned a status. The supported statuses are "error", "warning", and "off".


#### Configuration file

Configurations are defined in a file, titled __.validaterc__, that must be at the root directory of this project.

The configuration file must be structured as a JSON object with categories as first-level keys, rules as second-level keys, and statuses as values for the 'rules' objects.

If a rule is not included in the file, that rule will be set to the default status automatically. See the [Default Values](#default-values) for more info.

For an example of the structure, see the [defaults file](https://github.ibm.com/MIL/swagger-editor-ibm/blob/master/src/.defaultsForValidator.js). The JSON object in this file can be copied and pasted into the .validaterc file to get started configuring the validator.

#### Default Mode

The validator has a set of predefined default statuses for each rule that are used in 'default mode'.

Default mode can be turned on with the command line option '-d'. If this option is given, the .validaterc file will be ignored.

If a .validaterc file does not exist at the root directory of this project, the validator will automatically run in default mode.

The default values for each rule are described below.

##### Default Values

###### operations
| Rule                        | Default |
| --------------------------- | --------|
| no_consumes_for_put_or_post | error   |
| get_op_has_consumes         | warning |
| no_produces_for_get         | error   |
| no_operation_id             | warning |
| no_summary                  | warning |
| no_array_responses          | error   |

###### parameters
| Rule                        | Default |
| --------------------------- | --------|
| no_parameter_description    | error   |
| snake_case_only             | warning |
| invalid_type_format_pair    | error   |

###### paths
| Rule                        | Default |
| --------------------------- | --------|
| missing_path_parameter      | error   |

###### schemas
| Rule                        | Default |
| --------------------------- | --------|
| invalid_type_format_pair    | error   |
| snake_case_only             | warning |
| no_property_description     | warning |
| description_mentions_json   | warning |

###### security_definitions
| Rule                        | Default |
| --------------------------- | --------|
| unused_security_schemes     | warning |
| unused_security_scopes      | warning |

###### security
| Rule                             | Default |
| -------------------------------- | ------- |
| invalid_non_empty_security_array | error   |

###### walker
| Rule                        | Default |
| --------------------------- | --------|
| no_empty_descriptions       | error   |

## License

Copyright 2017 SmartBear Software

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
