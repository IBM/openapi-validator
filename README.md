# Swagger-Validator-IBM
This command line tool lets you validate Swagger files according to the OpenAPI specification, either [2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) or [3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md), as well as [custom IBM-defined best practices](http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style).
#### Prerequisites
- Node 8.9.x
- NPM 5.x

## Table of contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [NPM](#install-with-npm-recommended)
  - [Source](#build-from-source)
- [Usage](#usage)
  - [Command line](#command-line)
  - [Node module](#node-module)
    - [API](#api)
    - [Structure of validation results](#validation-results)
- [Configuration](#configuration)
  - [Setup](#setup)
  - [Definitions](#definitions)
    - [Specs](#specs)
    - [Categories](#categories)
    - [Rules](#rules)
    - [Statuses](#statuses)
  - [Configuration file](#configuration-file)
  - [Default mode](#default-mode)
    - [Default values](#default-values)
- [Troubleshooting](#troubleshooting)
  - [Installing with NPM through a proxy](#installing-with-npm-through-a-proxy)
- [License](#license)

## Installation

### Install with NPM (recommended)
This package can be installed with NPM using a git url. Installing this way can be authorized using SSH or HTTPS (these are the two options used for cloning repositories also).

#### SSH
1. Make sure you have an SSH key set up. If you have used SSH to clone an IBM GHE repository, this should be set up already. ([Instructions](https://help.github.com/articles/connecting-to-github-with-ssh/))
2. Run the following command `npm install -g git+ssh://git@github.ibm.com:dustinpopp/swagger-validator-ibm.git`

#### HTTPS
1. Make sure you a have a personal access token set up. If you have used HTTPS to clone an IBM GHE repository, this should be set up already. ([Instructions]())
2. Run the following command `npm install -g git+https://github.ibm.com/dustinpopp/swagger-validator-ibm.git`

The `-g` flag installs the tool globally so that the validator can be run from anywhere in the file system. Alternatively, you can pass the `--save` or `--save-dev` flag to add the vaidator as a dependency to your project and run it from your NPM scripts.

### Build from source
1. Clone or download this repository
2. Navigate to the root directory of this project.
3. Install the dependencies using `npm install`
4. Build the command line tool, run `npm run build-and-link`.

## Usage
### Command line
`lint-swagger [options] [command] [<files>]`

#### [options]
-  -v (print_validator_modules) : Print the name of the validator source file the error/warning was caught it. This is primarliy for developing validations.
-  -n (no_colors) : The output is colored by default. If this bothers you, this flag will turn off the coloring.
-  -d (default_mode) : This option turns off [configuration](#configuration) and runs the validator in [default mode](#default-mode).
-  -s (report_statistics) : Print a simple report at the end of the output showing the frequency, in percentage, of each error/warning.
-  -h (help) : This option prints the usage menu.

_These options only apply to running the validator on a file, not to any commands._

#### [command]
`$ lint-swagger init`
- init : The `init` command initializes a .validaterc file, used to [configure](#configuration) the validator. It can also be used to reset the configurable rules to their default values.

_None of the above options pertain to this command._

#### \<files>
- The Swagger file(s) to be validated. All files must be a valid JSON or YAML (only .json, .yml, and .yaml file extensions are supported).
- Multiple, space-separated files can be passed in and each will be validated. This includes support for globs (e.g. `lint-swagger files/*` will run the validator on all files in "files/")

### Node module
_Assumes the module was installed with a `--save` or `--save-dev` flag._
```javascript
const validator = require('swagger-validator-ibm');
validator(swaggerObject)
  .then(validationResults => {
    console.log(JSON.stringify(validationResults, null, 2));
  });
// or, if inside `async` function
const validationResults = await validator(swaggerObject);
console.log(JSON.stringify(validationResults, null, 2));
```

#### API
##### validator(swaggerObject, [defaultMode = false])
Returns a `Promise` with the validation results.

###### swaggerObject
Type: `Object`  
An object that represents a Swagger file.

###### defaultMode
Type: `boolean`  
Default: `false`  
If set to true, the validator will ignore the `.validaterc` file and will use the [configuration defaults](#default-values).

#### Validation results
The Promise returned from the validator resolves into a JSON object. The structure of the object is:
```
{
  errors:
  [
    {
      path: 'path.to.error.in.object'
      message: 'Major problem in the Swagger.'
    }
  ],
  warnings:
  [
    {
      path: 'path.to.warning.in.object'
      message: 'Minor problem in the Swagger.'
    }
  ]
}
```
The object will always have `errors` and `warnings` keys that map to arrays. If an array is empty, that means there were no errors/warnings in the Swagger.

## Configuration
The command line validator is built so that each IBM validation can be configured. To get started configuring the validator, [set up](#setup) a [file](#configuration-file) with the name `.validaterc` and continue reading this section.
Specfic validation "rules" can be turned off, or configured to trigger either errors or warnings in the validator.
Additionally, certain files files can be ignored by the validator. Any glob placed in a file called `.validateignore` will always be ignored by the validator at runtime. This is set up like a `.gitignore` or a `.eslintignore` file.

### Setup
To set up the configuration capability, simply run the command `lint-swagger init`
This will create a `.validaterc` file with all rules set to their [default value](#default-values). This command does not create a `.validateignore`. That file must be created manually. These rules can then be changed to configure the validator. Continue reading for more details.

_WARNING: If a `.validaterc` file already exists and has been customized, this command will reset all rules to their default values._

It is recommended to place these files in the root directory of your project. The code will recursively search up the filesystem for these files from wherever the validator is being run. Wherever in the file system the validator is being run, the nearest versions of these files will be used.

### Definitions

#### Specs

The validator supports two API definition specifications - Swagger 2.0 and OpenAPI 3.0. There are some rules in the the validator that only apply to one of the specific specs and some rules that apply to both. The configuration structure is organizaed by these "specs".
The supported specs are described below:

| Spec     | Description                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| swagger2 | Rules pertaining only to the [Swagger 2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) specification.  |
| oas3     | Rules pertaining only to the [OpenAPI 3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md) specification |
| shared   | Rules pertaining to both of the above specifications.                                                                                |

#### Categories

Rules are further organized by categories. Not every category is supported in every spec - these are a superset of the available categories. For the actual structure, see the [default values](#default-values).
The supported categories are described below:

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

Each category contains a group of rules. The spec that each rule applies to is marked in the third column. For the actual configuration structure, see the [default values](#default-values).
The supported rules are described below:

##### operations
| Rule                        | Description                                                                         | Spec     |
| --------------------------- | ----------------------------------------------------------------------------------- | -------- |
| no_consumes_for_put_or_post | Flag 'put' or 'post' operations that do not have a 'consumes' field.                | swagger2 |
| get_op_has_consumes         | Flag 'get' operations that contain a 'consumes' field.                              | swagger2 |
| no_produces_for_get         | Flag 'get' operations that do not have a 'produces' field.                          | swagger2 |
| no_operation_id             | Flag any operations that do not have an 'operationId' field.                        | shared   |
| no_summary                  | Flag any operations that do not have a 'summary' field.                             | shared   |
| no_array_responses          | Flag any operations with a top-level array response.                                | shared   |
| parameter_order             | Flag any operations with optional parameters before a required param.               | shared   |
| no_request_body_content     | [Flag any operations with a 'requestBody' that does not have a 'content' field.][3] | oas3     |

##### parameters
| Rule                        | Description                                                              | Spec   |
| --------------------------- | ------------------------------------------------------------------------ | ------ |
| no_parameter_description    | Flag any parameter that does not contain a 'description' field.          | shared |
| snake_case_only             | Flag any parameter with a 'name' field that does not use snake case.     | shared |
| invalid_type_format_pair    | Flag any parameter that does not follow the [data type/format rules.][2] | shared |
| content_type_parameter      | [Flag any parameter that explicitly defines a `Content-Type`. That should be defined by the `consumes` field.][2] | shared |
| accept_type_parameter       | [Flag any parameter that explicitly defines an `Accept` type. That should be defined by the `produces` field.][2] | shared |
| authorization_parameter     | [Flag any parameter that explicitly defines an `Authorization` type. That should be defined by the `securityDefinitions`/`security` fields.][2] | shared |

##### paths
| Rule                        | Description                                                                                                  | Spec   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| missing_path_parameter      | For a path that contains path parameters, flag any operations that do not correctly define those parameters. | shared |

##### schemas
| Rule                        | Description                                                                   | Spec     |
| --------------------------- | ----------------------------------------------------------------------------- | -------- |
| invalid_type_format_pair    | Flag any schema that does not follow the [data type/format rules.][2]         | swagger2 |
| snake_case_only             | Flag any property with a 'name' that is not lower snake case.                 | swagger2 |
| no_property_description     | Flag any schema that contains a 'property' without a 'description' field.     | swagger2 |
| description_mentions_json   | Flag any schema with a 'property' description that mentions the word 'JSON'.  | swagger2 |
| array_of_arrays             | Flag any schema with a 'property' of type 'array' with items of type 'array'. | swagger2 |

##### security_definitions
| Rule                        | Description                                                                           | Spec   |
| --------------------------- | ------------------------------------------------------------------------------------- | ------ |
| unused_security_schemes     | Flag any security scheme defined in securityDefinitions that is not used in the spec. | shared |
| unused_security_scopes      | Flag any security scope defined in securityDefinitions that is not used in the spec.  | shared |

##### security
| Rule                             | Description                                                  | Spec   |
| -------------------------------- | ------------------------------------------------------------ | ------ |
| invalid_non_empty_security_array | Flag any non-empty security array this is not of type OAuth2 | shared |

##### walker
| Rule                        | Description                                                                  | Spec   |
| --------------------------- | ---------------------------------------------------------------------------- | ------ |
| no_empty_descriptions       | Flag any 'description' field in the spec with an empty or whitespace string. | shared |
| has_circular_references     | Flag any circular references found in the Swagger spec.                      | shared |
| $ref_siblings               | Flag any properties that are siblings of a `$ref` property.                  | shared |

[1]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat
[2]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#parameter-object
[3]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#requestBodyObject

#### Statuses

Each rule can be assigned a status. The supported statuses are `error`, `warning`, and `off`.

### Configuration file

Configurations are defined in a file, titled __.validaterc__.

The configuration file must be structured as a JSON object with categories as first-level keys, rules as second-level keys, and statuses as values for the 'rules' objects.

If a rule is not included in the file, that rule will be set to the default status automatically. See the [Default Values](#default-values) for more info.

For an example of the structure, see the [defaults file](https://github.ibm.com/MIL/swagger-editor-ibm/blob/master/src/.defaultsForValidator.js).

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
| --------------------------- | --------|
| no_consumes_for_put_or_post | error   |
| get_op_has_consumes         | warning |
| no_produces_for_get         | error   |

###### schemas
| Rule                        | Default |
| --------------------------- | --------|
| invalid_type_format_pair    | error   |
| snake_case_only             | warning |
| no_property_description     | warning |
| description_mentions_json   | warning |
| array_of_arrays             | warning |


##### oas3

###### operations
| Rule                        | Default |
| --------------------------- | --------|
| no_request_body_content     | error   |


##### shared

###### operations
| Rule                        | Default |
| --------------------------- | --------|
| no_operation_id             | warning |
| no_summary                  | warning |
| no_array_responses          | error   |
| parameter_order             | warning |

###### parameters
| Rule                        | Default |
| --------------------------- | --------|
| no_parameter_description    | error   |
| snake_case_only             | warning |
| invalid_type_format_pair    | error   |
| content_type_parameter      | error   |
| accept_type_parameter       | error   |
| authorization_parameter     | warning |

###### paths
| Rule                        | Default |
| --------------------------- | --------|
| missing_path_parameter      | error   |

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
| has_circular_references     | warning |
| $ref_siblings               | off     |

## Troubleshooting
This section will be periodically updated with frequently seen user issues.

### Installing with NPM through a proxy
If you are trying to install this package with NPM but get a `404` error from a dependency installation, it is likely that you are running into a proxy issue.

You are using a proxy if you have a registry defined in your `.npmrc` file, most likely located in your home directory.

To resolve this issue, try temporarily commenting out the registry definition(s) in your `.npmrc` file, as some public NPM packages may be unaccessible through a proxy.


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
