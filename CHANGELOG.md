## [0.11.2](https://github.com/IBM/openapi-validator/compare/v0.11.1...v0.11.2) (2019-06-19)


### Bug Fixes

* response links are not validated as responses ([#63](https://github.com/IBM/openapi-validator/issues/63)) ([061b09b](https://github.com/IBM/openapi-validator/commit/061b09b))

## [0.11.1](https://github.com/IBM/openapi-validator/compare/v0.11.0...v0.11.1) (2019-06-19)


### Bug Fixes

* skips validation for non-string enum values ([#67](https://github.com/IBM/openapi-validator/issues/67)) ([fe4211f](https://github.com/IBM/openapi-validator/commit/fe4211f))

# [0.11.0](https://github.com/IBM/openapi-validator/compare/v0.10.5...v0.11.0) (2019-06-18)


### Features

* add security definition validations for OAS3 ([0a44980](https://github.com/IBM/openapi-validator/commit/0a44980))

## [0.10.5](https://github.com/IBM/openapi-validator/compare/v0.10.4...v0.10.5) (2019-06-18)


### Bug Fixes

* use correct working dir when resolving multi-file definitions ([43a22b8](https://github.com/IBM/openapi-validator/commit/43a22b8))

## [0.10.4](https://github.com/IBM/openapi-validator/compare/v0.10.3...v0.10.4) (2019-06-18)


### Bug Fixes

* skips warning for non-ref response schemas when not content is not json ([624d41a](https://github.com/IBM/openapi-validator/commit/624d41a))

## [0.10.3](https://github.com/IBM/openapi-validator/compare/v0.10.2...v0.10.3) (2019-06-13)


### Bug Fixes

* raises warning for tag that hasnt been defined in global tags list ([b0ac126](https://github.com/IBM/openapi-validator/commit/b0ac126))

## [0.10.2](https://github.com/IBM/openapi-validator/compare/v0.10.1...v0.10.2) (2019-06-05)


### Bug Fixes

* don't crash validator when path has a period in it ([01aa679](https://github.com/IBM/openapi-validator/commit/01aa679))

## [0.10.1](https://github.com/IBM/openapi-validator/compare/v0.10.0...v0.10.1) (2019-06-04)


### Bug Fixes

* alllow absolute filepaths to be passed to --config ([ab2e7ff](https://github.com/IBM/openapi-validator/commit/ab2e7ff))

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
