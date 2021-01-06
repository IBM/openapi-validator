[![Build Status](https://travis-ci.com/IBM/openapi-validator.svg?branch=master)](https://travis-ci.com/IBM/openapi-validator)
[![npm-version](https://img.shields.io/npm/v/ibm-openapi-validator.svg)](https://www.npmjs.com/package/ibm-openapi-validator)
[![codecov](https://codecov.io/gh/ibm/openapi-validator/branch/master/graph/badge.svg)](https://codecov.io/gh/ibm/openapi-validator)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Gitter](https://badges.gitter.im/openapi-validator/community.svg)](https://gitter.im/openapi-validator/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![CLA assistant](https://cla-assistant.io/readme/badge/ibm/openapi-validator)](https://cla-assistant.io/ibm/openapi-validator)


# OpenAPI Validator
This command line tool lets you validate OpenAPI documents according to their specification, either [2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) or [3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md),
as well as IBM-defined best practices.

#### Notice
Support for Node v8 is deprecated. Support will be officially dropped when it reaches end of life (31 December 2019) or when v1.0 of this package is released, whichever happens first.

#### Prerequisites
- Node 8.9.x
- NPM 5.x

## Table of contents

<!--
  The TOC below is generated using the `markdown-toc` node package.

      https://github.com/jonschlinkert/markdown-toc

  You should regenerate the TOC after making changes to this file.

      markdown-toc --maxdepth 4 -i README.md
  -->

<!-- toc -->

- [Installation](#installation)
  * [Install with NPM (recommended)](#install-with-npm-recommended)
  * [Build from source](#build-from-source)
  * [Platform specific binaries](#platform-specific-binaries)
  * [Docker container](#docker-container)
- [Usage](#usage)
  * [Command line](#command-line)
  * [Node module](#node-module)
    + [API](#api)
    + [Validation results](#validation-results)
- [Configuration](#configuration)
  * [Setup](#setup)
  * [Definitions](#definitions)
    + [Specs](#specs)
    + [Categories](#categories)
    + [Rules](#rules)
    + [Statuses](#statuses)
    + [Configuration Options](#configuration-options)
  * [Configuration file](#configuration-file)
  * [Default mode](#default-mode)
    + [Default values](#default-values)
  * [Spectral configuration](#spectral-configuration)
    + [Changing rule severity](#changing-rule-severity)
    + [Custom rules](#custom-rules)
- [Warnings Limit](#warnings-limit)
- [Turning off `update-notifier`](#turning-off-update-notifier)
- [License](#license)

<!-- tocstop -->

## Installation

### Install with NPM (recommended)

`npm install -g ibm-openapi-validator`

The `-g` flag installs the tool globally so that the validator can be run from anywhere in the file system. Alternatively, you can pass no flag or the `--save-dev` flag to add the validator as a dependency to your project and run it from your NPM scripts.

### Build from source
1. Clone or download this repository
2. Navigate to the root directory of this project.
3. Install the dependencies using `npm install`
4. Build the command line tool by running `npm run link`.

_If you installed the validator using `npm install -g ibm-openapi-validator`, you will need to run `npm uninstall -g ibm-openapi-validator` before running `npm run link`._

### Platform specific binaries
It is possible to build platform specific binaries for Linux, MacOS, and Windows that do not depend on having node.js installed.

To build these, run `npm run pkg` in the root.  The binaries (lint-openapi-linux, lint-openapi-macos, lint-openapi-windows.exe respectively) are built in the 'bin' directory in the root.

### Docker container
A community Docker image is [publicly available on Docker hub](https://hub.docker.com/r/jamescooke/openapi-validator).

`docker pull jamescooke/openapi-validator`

Once pulled, the container can be run directly, but mount a volume containing the OpenAPI specification file so that it can be accessed.

`docker run --volume "$PWD":/data jamescooke/openapi-validator [options] [command] [<files>]`

## Usage
### Command line
`lint-openapi [options] [command] [<files>]`

##### [options]
-  -c (--config) <path/to/your/config> : Path to a validator configuration file.  If provided, this is used instead of .validaterc.
-  -d (--default_mode) : This option turns off [configuration](#configuration) and runs the validator in [default mode](#default-mode).
-  -e (--errors_only) : Only print the errors, ignore the warnings.
-  -j (--json) : Output results as a JSON object
-  -n (--no_colors) : The output is colored by default. If this bothers you, this flag will turn off the coloring.
-  -p (--print_validator_modules) : Print the name of the validator source file the error/warning was caught it. This can be helpful for developing validations.
-  -v (--verbose) : Increase verbosity of reported results.  Use this option to display the rule for each reported result.
-  -r (--ruleset) <path/to/your/ruleset> : Path to Spectral ruleset file, used instead of .spectral.yaml if provided.
-  -s (--report_statistics) : Print a simple report at the end of the output showing the frequency, in percentage, of each error/warning.
-  --debug : Enable debugging output.
-  --version : Print the current semantic version of the validator
-  -h (--help) : This option prints the usage menu.

_These options only apply to running the validator on a file, not to any commands._

##### [command]
`$ lint-openapi init`
- init : The `init` command initializes a `.validaterc` file, used to [configure](#configuration) the validator. It can also be used to reset the configurable rules to their default values.

##### [command]
`$ lint-openapi migrate`
- migrate : The `migrate` command migrates a `.validaterc` file from the legacy format to the current format, retaining all custom rules. The new format is required - this command provides an option to keep custom rules without manually updating the file or initializing a new configuration file with all rules set to the defaults using `lint-openapi init`.

_None of the above options pertain to these commands._

##### \<files>
- The OpenAPI document(s) to be validated. All files must be a valid JSON or YAML (only .json, .yml, and .yaml file extensions are supported).
- Multiple, space-separated files can be passed in and each will be validated. This includes support for globs (e.g. `lint-openapi files/*` will run the validator on all files in `files/`)

### Node module
```javascript
const validator = require('ibm-openapi-validator');

validator(openApiDoc)
  .then(validationResults => {
    console.log(JSON.stringify(validationResults, null, 2));
  });

// or, if inside `async` function
const validationResults = await validator(openApiDoc);
console.log(JSON.stringify(validationResults, null, 2));
```

#### API
##### validator(openApiDoc, [defaultMode = false])
Returns a `Promise` with the validation results.

###### openApiDoc
Type: `Object`
An object that represents an OpenAPI document.

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
      message: 'Major problem in the OpenAPI document.'
    }
  ],
  warnings:
  [
    {
      path: 'path.to.warning.in.object'
      message: 'Minor problem in the OpenAPI document.'
    }
  ]
}
```
The object will always have `errors` and `warnings` keys that map to arrays. If an array is empty, that means there were no errors/warnings in the OpenAPI document.

## Configuration
The command line validator is built so that each IBM validation can be configured. To get started configuring the validator, [set up](#setup) a [configuration file](#configuration-file) and continue reading this section.
Specific validation "rules" can be turned off, or configured to trigger an error, warning, info, or hint message in the validator output.
Some validations can be configured even further, such as switching the case convention to validate against for parameter names.
There are also currently some validations that cannot be disabled or configured to a different severity.
You can see the rule associated with each message produced by the validator with the `-v` command line option.
Rules that are not configurable will show the name `builtin`.

Additionally, certain files can be ignored by the validator. Any glob placed in a file called `.validateignore` will always be ignored by the validator at runtime. This is set up like a `.gitignore` or a `.eslintignore` file.

The validator also employs the [`Spectral`](https://github.com/stoplightio/spectral) validation/linting engine to detect certain issues in the API document.
Spectral rules can also be configured to trigger an error, warning, info, or hint message in the validator output with the `.spectral.yaml` configuration file.
When the validator issues a message as the result of a Spectral rule, the rule name displayed will correspond to the Spectral rule.
Spectral rules must be configured in `.spectral.yaml` rather than in `.validaterc`.
Spectral further supports the creation of custom rules using a simple but powerful yaml syntax or custom Javascript functions.
See the [Spectral configuration](#spectral-configuration) section for more details.

### Setup
To set up the configuration capability, simply run the command `lint-openapi init`.
This will create (or overwrite) a `.validaterc` file with all rules set to their [default value](#default-values). This command does not create a `.validateignore`. That file must be created manually. These rules can then be changed to configure the validator. Continue reading for more details.

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
| parameters | Rules pertaining to [Parameter Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterObject) |
| paths      | Rules pertaining to [Paths Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#pathsObject)         |
| schemas    | Rules pertaining to [Schema Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject)       |
| security_definitions | Rules pertaining to [Security Definition Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#securityDefinitionsObject) |
| security   | Rules pertaining to [Security Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#securityRequirementObject) |
| walker     | Rules pertaining to the entire document.                                                                                              |
| pagination | Rules pertaining to pagination   |
#### Rules

Each category contains a group of rules. The spec that each rule applies to is marked in the third column. For the actual configuration structure, see the [default values](#default-values).
You can use the `-v` option of the CLI validator to display the rule for each reported result.
The supported rules are described below:

##### operations
| Rule                         | Description                                                                         | Spec     |
| ---------------------------- | ----------------------------------------------------------------------------------- | -------- |
| undefined_tag                | Flag a tag that is in operations and not listed in `tags` on the top level.         | shared   |
| unused_tag                   | Flag a tag that is listed in `tags` on the top level that is not used in the spec.  | shared   |
| no_consumes_for_put_or_post  | Flag `put` or `post` operations that do not have a `consumes` field.                | swagger2 |
| get_op_has_consumes          | Flag `get` operations that contain a `consumes` field.                              | swagger2 |
| no_produces                  | Flag operations that do not have a `produces` field (except for `head` and operations that return a 204). | swagger2 |
| no_operation_id              | Flag any operations that do not have an `operationId` field.                        | shared   |
| operation_id_case_convention | Flag any `operationId` that does not follow a given case convention.                | shared   |
| no_summary                   | Flag any operations that do not have a `summary` field.                             | shared   |
| no_array_responses           | Flag any operations with a top-level array response.                                | shared   |
| parameter_order              | Flag any operations with optional parameters before a required param.               | shared   |
| operation_id_naming_convention | Flag any `operationId` that does not follow naming convention.                    | shared   |
| no_request_body_content      | [Flag any operations with a `requestBody` that does not have a `content` field.][3] | oas3     |
| no_request_body_name         | Flag any operations with a non-form `requestBody` that does not have a name set with `x-codegen-request-body-name`. | oas3|


##### pagination
| Rule                        | Description                                                              | Spec   |
| --------------------------- | ------------------------------------------------------------------------ | ------ |
| pagination_style            | Flag any parameter or response schema that does not follow pagination requirements. | oas3 |


##### parameters
| Rule                        | Description                                                              | Spec   |
| --------------------------- | ------------------------------------------------------------------------ | ------ |
| required_param_has_default  | Flag any required parameter that specifies a default value.              | shared |
| no_parameter_description    | Flag any parameter that does not contain a `description` field.          | shared |
| param_name_case_convention  | Flag any parameter with a `name` field that does not follow a given case convention. | shared |
| invalid_type_format_pair    | Flag any parameter that does not follow the [data type/format rules.][2] | shared |
| content_type_parameter      | [Flag any parameter that explicitly defines a `Content-Type`. That should be defined by the `consumes` field.][2] | shared |
| accept_type_parameter       | [Flag any parameter that explicitly defines an `Accept` type. That should be defined by the `produces` field.][2] | shared |
| authorization_parameter     | [Flag any parameter that explicitly defines an `Authorization` type. That should be defined by the `securityDefinitions`/`security` fields.][2] | shared |
| no_in_property              | Flag any parameter that does not define an `in` property.                         | oas3 |
| invalid_in_property         | Flag any parameter that has an invalid `in` property.                             | oas3 |
| missing_schema_or_content   | Flag any parameter that does not define its data type with `schema` or `content`. | oas3 |
| has_schema_and_content      | Flag any parameter that defines data type with both `schema` and `content`.       | oas3 |

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
| no_response_codes         | Flag any response object that has no valid response codes.   | oas3 |
| no_success_response_codes | Flag any response object that has no success response codes. | oas3 |
| no_response_body          | Flag any non-204 success responses without a response body.  | oas3 |
| ibm_status_code_guidelines| Flag any violations of status code conventions per IBM API Handbook  | oas3 |

##### schemas
| Rule                        | Description                                                                   | Spec     |
| --------------------------- | ----------------------------------------------------------------------------- | -------- |
| invalid_type_format_pair    | Flag any schema that does not follow the [data type/format rules.][2]         | shared   |
| snake_case_only             | Flag any property with a `name` that is not lower snake case.                 | shared   |
| no_schema_description       | Flag any schema without a `description` field.                                | shared   |
| no_property_description     | Flag any schema that contains a 'property' without a `description` field.     | shared   |
| description_mentions_json   | Flag any schema with a 'property' description that mentions the word 'JSON'.  | shared   |
| array_of_arrays             | Flag any schema with a 'property' of type `array` with items of type `array`. | shared   |
| inconsistent_property_type  | Flag any properties that have the same name but an inconsistent type.         | shared   |
| property_case_convention    | Flag any property with a `name` that does not follow a given case convention. snake_case_only must be 'off' to use. | shared |
| property_case_collision     | Flag any property with a `name` that is identical to another property's `name` except for the naming convention | shared |
| enum_case_convention        | Flag any enum with a `value` that does not follow a given case convention. snake_case_only must be 'off' to use.    | shared |
| json_or_param_binary_string | Flag parameters or application/json request/response bodies with schema type: string, format: binary. | oas3 |
| undefined_required_properties| Flag any schema with undefined required properties                       | shared   |

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
`"param_name_case_convention": ["error", "lower_camel_case"]`
If just a string is provided for these rule, the default configuration option will be used. If only one value is provided in the array, it **MUST** be a status. The default configuration option will be used in this case as well. The rules that support configuration options will have **two** values in the [defaults](#default-values) table.

#### Configuration Options

For rules that accept additional configuration, there will be a limited set of available options.

##### Case Convention Options
- Some rules check strings for adherence to a specific case convention. In some cases, the case convention checked is configurable.
- Rules with configurable case conventions will end in `_case_convention`, such as `param_name_case_convention`.

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

Configurations are defined in a file, titled __.validaterc__.

The configuration file must be structured as a JSON object with specs as first-level keys, categories as second-level keys, rules as third-level keys, and statuses as values for the 'rules' objects.

If a rule is not included in the file, that rule will be set to the default status automatically. See the [Default Values](#default-values) for more info.

For an example of the structure, see the [defaults file](https://github.com/IBM/openapi-validator/blob/master/src/.defaultsForValidator.js).

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
| no_request_body_content     | error   |
| no_request_body_name        | warning |

###### parameters
| Rule                        | Default |
| --------------------------- | ------- |
| no_in_property              | error   |
| invalid_in_property         | error   |
| missing_schema_or_content   | error   |
| has_schema_and_content      | error   |

##### responses
| Rule                      | Default |
| ------------------------- | ------- |
| no_response_codes         | error   |
| no_success_response_codes | warning |
| no_response_body          | warning |
| ibm_status_code_guidelines| warning |

##### schemas

| Rule                        | Default |
| --------------------------- | ------- |
| json_or_param_binary_string | warning |
| undefined_required_properties    | warning |

##### shared

###### operations
| Rule                         | Default |
| ---------------------------- | ------- |
| undefined_tag                | warning |
| unused_tag                   | warning |
| no_operation_id              | warning |
| operation_id_case_convention | warning, lower_snake_case |
| no_summary                   | warning |
| no_array_responses           | error   |
| parameter_order              | warning |
| operation_id_naming_convention | warning |

###### pagination
| Rule                        | Default |
| --------------------------- | --------|
| pagination_style            | warning |

###### parameters
| Rule                        | Default |
| --------------------------- | --------|
| no_parameter_description    | error   |
| param_name_case_convention  | error, lower_snake_case |
| invalid_type_format_pair    | error   |
| content_type_parameter      | error   |
| accept_type_parameter       | error   |
| authorization_parameter     | warning |
| required_param_has_default  | warning |

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

###### security_definitions
| Rule                        | Default |
| --------------------------- | ------- |
| unused_security_schemes     | warning |
| unused_security_scopes      | warning |

###### security
| Rule                             | Default |
| -------------------------------- | ------- |
| invalid_non_empty_security_array | error   |

###### schemas
| Rule                        | Default |
| --------------------------- | ------- |
| invalid_type_format_pair    | error   |
| snake_case_only             | off     |
| no_schema_description       | warning |
| no_property_description     | warning |
| description_mentions_json   | warning |
| array_of_arrays             | warning |
| inconsistent_property_type  | warning |
| property_case_convention    | error, lower_snake_case |
| property_case_collision     | error   |
| enum_case_convention        | warning, lower_snake_case |

###### walker
| Rule                          | Default |
| ----------------------------- | ------- |
| no_empty_descriptions         | error   |
| has_circular_references       | warning |
| $ref_siblings                 | off     |
| duplicate_sibling_description | warning |
| incorrect_ref_pattern        | warning |

### Spectral configuration

Currently the validator configures Spectral to check the following rules from its
[“oas" ruleset](https://meta.stoplight.io/docs/spectral/docs/reference/openapi-rules.md):
```
no-eval-in-markdown: true
no-script-tags-in-markdown: true
openapi-tags: true
operation-description: true
operation-tags: true
operation-tag-defined: true
path-keys-no-trailing-slash: true
typed-enum: true
oas2-api-host: true
oas2-api-schemes: true
oas2-host-trailing-slash: true
oas2-valid-example: true
oas2-valid-definition-example: true
oas2-anyOf: true
oas2-oneOf: true
oas3-api-servers: true
oas3-examples-value-or-externalValue: true
oas3-server-trailing-slash: true
oas3-valid-example: true
oas3-valid-schema-example: true
```

This ruleset has the alias `ibm:oas`, and you can "extend" this ruleset or specify your own custom ruleset
with a [Spectral ruleset file](https://meta.stoplight.io/docs/spectral/docs/getting-started/3-rulesets.md).
Note that all of the rules in the `spectral:oas` ruleset are defined in `ibm:oas` but only the rules listed above are enabled by default.

You can provide a Spectral ruleset file to the IBM OpenAPI validator in a file named `.spectral.yaml`
in the current directory or with the `--ruleset` command line option of the validator.

#### Changing rule severity

Any rule in the `ibm:oas` ruleset can be configured to trigger an error, warning, info, or hint message in the validator output.
For example, to configure the `openapi-tags` rule to trigger an `info` message instead of a `warning`, specify the following in your Spectral ruleset file:
```
extends: ibm:oas
rules:
  openapi-tags: warn
```

To completely disable a rule, use the severity of `off`.
For example, to disable the `operation-tags` rule, specify the following in your Spectral ruleset file:
```
extends: ibm:oas
rules:
  operation-tags: off
```

Since the `ibm:oas` ruleset includes all the rules in `spectral:oas`, you can also enable rules from that ruleset that are disabled by default in `ibm:oas`.
For example, to enable the `info-contact` rule with it's default severity (`warning`), specify the following in your Spectral ruleset file:
```
extends: ibm:oas
rules:
  info-contact: true
```

You could also set the severity of `info-contact` explicitly to `error`, `warn`, `info`, or `hint`.

#### Custom rules

You can also specify custom rules in the Spectral ruleset file.
Custom rules can be specified using a simple but powerful yaml syntax or with custom Javascript functions.
See the Spectral documentation for detailed documentation on [Spectral custom rules](https://meta.stoplight.io/docs/spectral/docs/guides/4-custom-rulesets.md).

## Warnings Limit

You may impose a warning limit on your API definitions. If the number of warnings issued exceeds the warning limit, the **exit code will be set to 1**. If the Validator is part of your CI build, this will cause the build to fail.

To impose a warnings limit on a project, add a `.thresholdrc` to your project. It is recommended to add this file to the root of the project. The validator recursively searches up the filesystem from whichever directory the validator is invoked, and the nearest `.thresholdrc` will be used.

The format for the `.thresholdrc` file is a top-level JSON object with a `"warnings"` field (shown below).

    {
      "warnings": 0
    }

###### limits
| Limit                   | Default   |
| ----------------------- | --------- |
| warnings                | MAX_VALUE |

## Turning off `update-notifier`
This package uses [`update-notifier`](https://github.com/yeoman/update-notifier) to alert users when new versions of the tool are available. To turn this feature _off_, follow [these instructions](https://github.com/yeoman/update-notifier/tree/8df01b35fbb8093e91d79fdf9900c344c2236f08#user-settings) from the package authors. It is recommended to keep this feature _on_ to help stay up to date with the latest changes.

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
