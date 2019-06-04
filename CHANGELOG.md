# [0.10.0](https://github.com/IBM/openapi-validator/compare/v0.9.1...v0.10.0) (2019-06-04)


### Features

* add script to build platform specific standalone binaries ([f821707](https://github.com/IBM/openapi-validator/commit/f821707))

## [0.9.1](https://github.com/IBM/openapi-validator/compare/v0.9.0...v0.9.1) (2019-06-04)


### Bug Fixes

* replace jsSpec with resolvedSpec in security-definitons-ibm ([bb460c4](https://github.com/IBM/openapi-validator/commit/bb460c4))

# [0.9.0](https://github.com/IBM/openapi-validator/compare/v0.8.0...v0.9.0) (2019-06-04)


### Features

* Added --config option, adding support for explicit config file ([ab6bcc2](https://github.com/IBM/openapi-validator/commit/ab6bcc2))

# [0.8.0](https://github.com/IBM/openapi-validator/compare/v0.7.0...v0.8.0) (2019-05-31)


### Features

* Added -j/--json output option to cli-validator ([759856f](https://github.com/IBM/openapi-validator/commit/759856f)), closes [#43](https://github.com/IBM/openapi-validator/issues/43)

# [0.7.0](https://github.com/IBM/openapi-validator/compare/v0.6.0...v0.7.0) (2019-05-31)


### Features

* added explicit control of case conventions in paths, schema properties and schema enums ([ecde7da](https://github.com/IBM/openapi-validator/commit/ecde7da)), closes [#38](https://github.com/IBM/openapi-validator/issues/38) [#40](https://github.com/IBM/openapi-validator/issues/40)

# [0.6.0](https://github.com/IBM/openapi-validator/compare/v0.5.0...v0.6.0) (2019-05-24)


### Features

* added check in the validator for info section. ([8d21781](https://github.com/IBM/openapi-validator/commit/8d21781))

# [0.5.0](https://github.com/IBM/openapi-validator/compare/v0.4.0...v0.5.0) (2019-05-16)


### Features

* **new-validation:** flag descriptions sibling to `$ref` if identical to referenced description ([91178cf](https://github.com/IBM/openapi-validator/commit/91178cf))

# [0.4.0](https://github.com/IBM/openapi-validator/compare/v0.3.1...v0.4.0) (2019-05-14)


### Features

* flag operations with non-form request bodies that do not specify a name ([a229fc0](https://github.com/IBM/openapi-validator/commit/a229fc0))

## [0.3.1](https://github.com/IBM/openapi-validator/compare/v0.3.0...v0.3.1) (2019-04-22)


### Bug Fixes

* Fix operationID case convention to match API Handbook (lower_snake_case) ([b7fafe2](https://github.com/IBM/openapi-validator/commit/b7fafe2))

# [0.3.0](https://github.com/IBM/openapi-validator/compare/v0.2.4...v0.3.0) (2019-04-22)


### Bug Fixes

* handle null values for descriptions and schemas properties ([9ecbfbe](https://github.com/IBM/openapi-validator/commit/9ecbfbe))


### Features

* validate for null values in the api document, return an error ([cc53855](https://github.com/IBM/openapi-validator/commit/cc53855))

## [0.2.4](https://github.com/IBM/openapi-validator/compare/v0.2.3...v0.2.4) (2019-04-11)


### Bug Fixes

* exapand check for operation id duplciates to include referenced paths ([21e2460](https://github.com/IBM/openapi-validator/commit/21e2460))

## [0.2.3](https://github.com/IBM/openapi-validator/compare/v0.2.2...v0.2.3) (2019-02-19)


### Bug Fixes

* dont error on schemas with type file for oas2 specs ([eeb826a](https://github.com/IBM/openapi-validator/commit/eeb826a))

## [0.2.2](https://github.com/IBM/openapi-validator/compare/v0.2.1...v0.2.2) (2019-02-05)


### Features

* **(new-validation)** warn when top-level schemas do not have descriptions

### Bug Fixes

* $ref format issues are now warnings and only internal refs are checked
* handle "allOf", "anyOf", and "oneOf" properly
* run security validations on security objects only ([59f26b0](https://github.com/IBM/openapi-validator/commit/59f26b0))

# 0.2.0
- The options `-v` or `--version` now prints the semantic version of the validator
- The `--print_validator_modules` short-hand option is renamed to `-p`
