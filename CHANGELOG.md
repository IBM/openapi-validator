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
