# Swagger-Editor-IBM

Swagger Editor lets you edit [Swagger API specifications](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md) in YAML inside your browser and to preview documentations in real time.
This version of the swagger editor adds custom validations based on finds and guidelines working with SDK generation team.  

This repository also includes a command line tool for validating Swagger files outside of the browser. See the [Command Line Tool section](#command-line-tool) for installation and usage details.

Here is the squad info plus information around SDK and API reference generation [sdk-squad](https://pages.github.ibm.com/arf/planning-sdk-squad/)

## Running locally

To run a local instance with validation and hot-reload funcationlity then invoke `npm run dev`. 

To run the tests then invoke `npm run test`. 

##### Prerequisites
- Node 6.x
- NPM 3.x

If you have Node.js and npm installed, you can run `npm start` to spin up a static server.

Otherwise, you can open `index.html` directly from your filesystem in your browser.

Note: At this time, if the editor is opened using `npm start` or `index.html`, the validations will __not__ be run.

If you'd like to make code changes to Swagger-Editor, you can start up a Webpack hot-reloading dev server via `npm run dev`. 

##### Browser support

Swagger UI works in the latest versions of Chrome, Safari, Firefox, Edge and IE11.

## Command Line Tool

### Installation

1. Clone or download this repository
2. Navigate to the root directory of this project.
3. Install the dependencies using `npm install`
4. To install the command line tool, run `npm run build-cli-all`.

Note: This creates a symbolic link so if this project folder is moved, the tool will need to be re-installed by running `npm run build-command-for-cli` in the new location.

### Usage

`validate-swagger [options] <file>`

#### [options]

-  -v (print_validator_modules) : Print the name of the validator source file the error/warning was caught it. This is primarliy for developing validations.
-  -n (no_colors) : The output is colored by default. If this bothers you, this flag will turn off the coloring.
-  -d (default_mode) : This option turns off [configuration](#configuration) and runs the validator in [default mode](#default-mode).
-  -s (report_statistics) : Print a simple report at the end of the output showing the frequency, in percentage, of each error/warning.
-  -h (help) : This option prints the usage menu.

#### \<file>

- The Swagger file to be validated. It must be a valid JSON or YAML file (only .json, .yml, and .yaml file extensions are supported).

_Currently, this tool only runs semantic validations._

### Configuration

The command line validator is built so that each IBM validation can be configured.

Specfic validation "rules" can be turned off, or configured to trigger either errors or warnings in the validator.

#### Categories

Rules are organized by categories. The supported categories are described below:

| Category   | Description                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| operations | Rules pertaining to [Operation Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#operationObject) |
| parameters | Rules pertaining to [Parameter Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterObject) |
| schemas    | Rules pertaining to [Schema Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject)       |
| walker     | Rules pertaining to the entire spec.                                                                                              |

#### Rules

Each category contains a group of rules. The supported rules are described below:

##### operations
| Rule                        | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| no_consumes_for_put_or_post | Flag 'put' or 'post' operations that do not have a 'consumes' field. |
| get_op_has_consumes         | Flag 'get' operations that contain a 'consumes' field.               |
| no_produces_for_get         | Flag 'get' operations that do not have a 'prodcues' field.           |
| no_operation_id             | Flag any operations that do not have an 'operationId' field.         |
| no_summary                  | Flag any operations that do not have a 'summary' field.              |

##### parameters
| Rule                        | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| no_parameter_description    | Flag any parameter that does not contain a 'description' field.      |
| snake_case_only             | Flag any parameter with a 'name' field that does not use snake case. |
| invalid_type_format_pair    | Flag any parameter that does not follow the [data type/format rules.](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat) |

##### schemas
| Rule                        | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| invalid_type_format_pair    | Flag any schema that does not follow the [data type/format rules.](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat) |
| no_property_description     | Flag any schema that contains a 'property' without a 'description' field.    |
| description_mentions_json   | Flag any schema with a 'property' description that mentions the word 'JSON'. |


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

An [example file](https://github.ibm.com/MIL/swagger-editor-ibm/blob/master/.validaterc) is included in the repo to get started with.

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

###### parameters
| Rule                        | Default |
| --------------------------- | --------|
| no_parameter_description    | error   |
| snake_case_only             | warning |
| invalid_type_format_pair    | error   |

###### schemas
| Rule                        | Default |
| --------------------------- | --------|
| invalid_type_format_pair    | error   |
| no_property_description     | warning |
| description_mentions_json   | warning |


###### walker
| Rule                        | Default |
| --------------------------- | --------|
| no_empty_descriptions       | error   |


_Note, configuration is only supported for the command line tool. The Swagger Editor in the browser is not configurable._

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
