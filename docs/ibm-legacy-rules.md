# IBM Cloud Legacy Validation Ruleset
This document outlines how to configure and use the IBM Cloud Legacy Validation ruleset.


## Table of contents

<!--
  The TOC below is generated using the `markdown-toc` node package.

      https://github.com/jonschlinkert/markdown-toc

  You should regenerate the TOC after making changes to this file.

      markdown-toc --maxdepth 4 -i docs/ibm-legacy-rules.md
  -->

<!-- toc -->

- [Setup](#setup)
- [Definitions](#definitions)
  * [Specs](#specs)
  * [Categories](#categories)
  * [Rules](#rules)
  * [Statuses](#statuses)
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
| schemas    | Rules pertaining to [Schema Objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schemaObject)       |
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

##### schemas
| Rule                        | Description                                                                   | Spec     |
| --------------------------- | ----------------------------------------------------------------------------- | -------- |
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


##### oas3

##### schemas

| Rule                        | Default |
| --------------------------- | ------- |
| json_or_param_binary_string | warning |

##### shared

###### walker
| Rule                          | Default |
| ----------------------------- | ------- |
| no_empty_descriptions         | error   |
| has_circular_references       | warning |
| $ref_siblings                 | off     |
| duplicate_sibling_description | warning |
| incorrect_ref_pattern        | warning |
