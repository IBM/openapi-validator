## [0.19.2](https://github.com/IBM/openapi-validator/compare/v0.19.1...v0.19.2) (2020-02-11)


### Bug Fixes

* resolve refs when checking for success response schemas ([#136](https://github.com/IBM/openapi-validator/issues/136)) ([b286c69](https://github.com/IBM/openapi-validator/commit/b286c69))

## [0.19.1](https://github.com/IBM/openapi-validator/compare/v0.19.0...v0.19.1) (2020-02-11)


### Bug Fixes

* updated code and test to reflect updated naming convention ([#133](https://github.com/IBM/openapi-validator/issues/133)) ([c44f2fa](https://github.com/IBM/openapi-validator/commit/c44f2fa))

# [0.19.0](https://github.com/IBM/openapi-validator/compare/v0.18.0...v0.19.0) (2020-02-10)


### Features

* added configurable warning limits through .thresholdrc file ([#132](https://github.com/IBM/openapi-validator/issues/132)) ([2c3a919](https://github.com/IBM/openapi-validator/commit/2c3a919))

# [0.18.0](https://github.com/IBM/openapi-validator/compare/v0.17.1...v0.18.0) (2020-02-07)


### Features

* add warning, non-204 success response should have response body ([#127](https://github.com/IBM/openapi-validator/issues/127)) ([90689c8](https://github.com/IBM/openapi-validator/commit/90689c8))

## [0.17.1](https://github.com/IBM/openapi-validator/compare/v0.17.0...v0.17.1) (2020-02-07)


### Bug Fixes

* use correct property case for `tokenUrl` ([#134](https://github.com/IBM/openapi-validator/issues/134)) ([4395600](https://github.com/IBM/openapi-validator/commit/4395600))

# [0.17.0](https://github.com/IBM/openapi-validator/compare/v0.16.2...v0.17.0) (2020-01-29)


### Features

* operationId should conform to naming convention ([#124](https://github.com/IBM/openapi-validator/issues/124)) ([79ca9b8](https://github.com/IBM/openapi-validator/commit/79ca9b8))

## [0.16.2](https://github.com/IBM/openapi-validator/compare/v0.16.1...v0.16.2) (2020-01-27)


### Bug Fixes

* swagger2 validator should only report error if there's body parameter but no consume ([#123](https://github.com/IBM/openapi-validator/issues/123)) ([1d97cb2](https://github.com/IBM/openapi-validator/commit/1d97cb2))

## [0.16.1](https://github.com/IBM/openapi-validator/compare/v0.16.0...v0.16.1) (2020-01-16)


### Bug Fixes

* add command name for improved usage output ([#122](https://github.com/IBM/openapi-validator/issues/122)) ([53382eb](https://github.com/IBM/openapi-validator/commit/53382eb))

# [0.16.0](https://github.com/IBM/openapi-validator/compare/v0.15.2...v0.16.0) (2019-12-10)


### Features

* Add rule to check pagination list operations conform to API Handbook ([#118](https://github.com/IBM/openapi-validator/issues/118)) ([875ea4c](https://github.com/IBM/openapi-validator/commit/875ea4c))

## [0.15.2](https://github.com/IBM/openapi-validator/compare/v0.15.1...v0.15.2) (2019-11-25)


### Bug Fixes

* Fix duplicate parameter checking when all parameters are defined at the path level ([#116](https://github.com/IBM/openapi-validator/issues/116)) ([f40bd6f](https://github.com/IBM/openapi-validator/commit/f40bd6f))


### Reverts

* Back out duplicated tests for duplicate path parameter rule ([#115](https://github.com/IBM/openapi-validator/issues/115)) ([4d58a82](https://github.com/IBM/openapi-validator/commit/4d58a82))

## [0.15.1](https://github.com/IBM/openapi-validator/compare/v0.15.0...v0.15.1) (2019-10-04)


### Bug Fixes

* allow multiple schemes in a security requirement object ([#109](https://github.com/IBM/openapi-validator/issues/109)) ([f02ef2b](https://github.com/IBM/openapi-validator/commit/f02ef2b)), closes [#108](https://github.com/IBM/openapi-validator/issues/108)

# [0.15.0](https://github.com/IBM/openapi-validator/compare/v0.14.0...v0.15.0) (2019-10-01)


### Features

* validate discriminator properties conform to specifications ([#107](https://github.com/IBM/openapi-validator/issues/107)) ([0ecd539](https://github.com/IBM/openapi-validator/commit/0ecd539))

# [0.14.0](https://github.com/IBM/openapi-validator/compare/v0.13.6...v0.14.0) (2019-09-10)


### Features

* adds k8s_camel_case validator for k8s API conventions ([#106](https://github.com/IBM/openapi-validator/issues/106)) ([bb82222](https://github.com/IBM/openapi-validator/commit/bb82222))

## [0.13.6](https://github.com/IBM/openapi-validator/compare/v0.13.5...v0.13.6) (2019-09-09)


### Bug Fixes

* prevent crash when `parameters` is illegally not an array ([#104](https://github.com/IBM/openapi-validator/issues/104)) ([5d8a429](https://github.com/IBM/openapi-validator/commit/5d8a429))

## [0.13.5](https://github.com/IBM/openapi-validator/compare/v0.13.4...v0.13.5) (2019-08-28)


### Bug Fixes

* do not crash when operation has illegal $ref, print error instead ([#103](https://github.com/IBM/openapi-validator/issues/103)) ([3d34205](https://github.com/IBM/openapi-validator/commit/3d34205))

## [0.13.4](https://github.com/IBM/openapi-validator/compare/v0.13.3...v0.13.4) (2019-08-27)


### Bug Fixes

* treat response schemas with an `items` field as arrays, even if there is no `type` ([#99](https://github.com/IBM/openapi-validator/issues/99)) ([3383114](https://github.com/IBM/openapi-validator/commit/3383114))

## [0.13.3](https://github.com/IBM/openapi-validator/compare/v0.13.2...v0.13.3) (2019-08-06)


### Bug Fixes

* use parameter-determining method in all parameters validations ([#97](https://github.com/IBM/openapi-validator/issues/97)) ([ee1168f](https://github.com/IBM/openapi-validator/commit/ee1168f))

## [0.13.2](https://github.com/IBM/openapi-validator/compare/v0.13.1...v0.13.2) (2019-07-23)


### Bug Fixes

* filter out [#9](https://github.com/IBM/openapi-validator/issues/9)d chars from input ([#89](https://github.com/IBM/openapi-validator/issues/89)) ([0b154d4](https://github.com/IBM/openapi-validator/commit/0b154d4))

## [0.13.1](https://github.com/IBM/openapi-validator/compare/v0.13.0...v0.13.1) (2019-07-22)


### Bug Fixes

* Skip case_convention checks on deprecated parameters and properties ([#88](https://github.com/IBM/openapi-validator/issues/88)) ([6b195aa](https://github.com/IBM/openapi-validator/commit/6b195aa))

# [0.13.0](https://github.com/IBM/openapi-validator/compare/v0.12.5...v0.13.0) (2019-07-17)


### Features

* change default for all case convention validations to error (#86) ([#86](https://github.com/IBM/openapi-validator/issues/86)) ([873d6035cc72a04e58bbe6142cbce22ebb3f041a](https://github.com/IBM/openapi-validator/commit/873d6035cc72a04e58bbe6142cbce22ebb3f041a))

  * This applies to the following rules: `param_name_case_convention`, `paths_case_convention`, `property_case_convention`, `enum_case_convention`

  * The rule `snake_case_only` (in categories `paths` and `schemas`) is now set to `off` by default. They will be deprecated in a future release.

## [0.12.5](https://github.com/IBM/openapi-validator/compare/v0.12.4...v0.12.5) (2019-07-17)


### Bug Fixes

* add more specific checks for parameter objects ([#83](https://github.com/IBM/openapi-validator/issues/83)) ([9282e17](https://github.com/IBM/openapi-validator/commit/9282e17))

## [0.12.4](https://github.com/IBM/openapi-validator/compare/v0.12.3...v0.12.4) (2019-07-04)


### Bug Fixes

* make $ref pattern check configurable - new rule `incorrect_ref_pattern` ([#78](https://github.com/IBM/openapi-validator/issues/78)) ([20f0911](https://github.com/IBM/openapi-validator/commit/20f0911))

## [0.12.3](https://github.com/IBM/openapi-validator/compare/v0.12.2...v0.12.3) (2019-07-01)


### Bug Fixes

* remove support for `links` in swagger2 ([#76](https://github.com/IBM/openapi-validator/issues/76)) ([8b28d67](https://github.com/IBM/openapi-validator/commit/8b28d67))

## [0.12.2](https://github.com/IBM/openapi-validator/compare/v0.12.1...v0.12.2) (2019-06-28)


### Bug Fixes

* response schema support for oneOf, anyOf, and allOf refs ([#70](https://github.com/IBM/openapi-validator/issues/70)) - real ([10d99a4](https://github.com/IBM/openapi-validator/commit/10d99a4))

## [0.12.1](https://github.com/IBM/openapi-validator/compare/v0.12.0...v0.12.1) (2019-06-28)


### Bug Fixes

* flag any operations with array responses ([#73](https://github.com/IBM/openapi-validator/issues/73)) ([7b1a9d3](https://github.com/IBM/openapi-validator/commit/7b1a9d3))

# [0.12.0](https://github.com/IBM/openapi-validator/compare/v0.11.2...v0.12.0) (2019-06-24)


### Features

* new cli option, `--errors_only`, for printing only the errors ([#68](https://github.com/IBM/openapi-validator/issues/68)) ([a338bf0](https://github.com/IBM/openapi-validator/commit/a338bf0))

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
