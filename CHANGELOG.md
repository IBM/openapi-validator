## [0.33.2](https://github.com/IBM/openapi-validator/compare/v0.33.1...v0.33.2) (2021-01-11)


### Bug Fixes

* allow null values for default property ([#227](https://github.com/IBM/openapi-validator/issues/227)) ([b7e2aa8](https://github.com/IBM/openapi-validator/commit/b7e2aa8326e4c95856d1c4ca482f11f6ace494fe))

## [0.33.1](https://github.com/IBM/openapi-validator/compare/v0.33.0...v0.33.1) (2021-01-04)


### Bug Fixes

* specify rule name for all configurable rules ([38526f3](https://github.com/IBM/openapi-validator/commit/38526f3e34c70eeeb540ba20065e120cc155d48a))

# [0.33.0](https://github.com/IBM/openapi-validator/compare/v0.32.0...v0.33.0) (2020-12-30)


### Features

* command line option to print config option associated with each message ([7a56dde](https://github.com/IBM/openapi-validator/commit/7a56ddeb4cc54c7cdb3a6b1316001ab5659158b2))

# [0.32.0](https://github.com/IBM/openapi-validator/compare/v0.31.1...v0.32.0) (2020-12-28)


### Features

* **spectral:** allow spectral ruleset file to be specified with command line option ([db60c11](https://github.com/IBM/openapi-validator/commit/db60c11e9bd218e99071a63b110ffd7daf8c42ba))
* **spectral:** rework default spectral rules and expose as static "ibm:oas" ruleset ([cafad9e](https://github.com/IBM/openapi-validator/commit/cafad9e15671df4e52b5e477a12b92abd25e5e30))

## [0.31.1](https://github.com/IBM/openapi-validator/compare/v0.31.0...v0.31.1) (2020-10-23)


### Bug Fixes

* **findOctetSequencePaths:** Show path to erring element ([#190](https://github.com/IBM/openapi-validator/issues/190)) ([0247888](https://github.com/IBM/openapi-validator/commit/0247888de580b42abb9ee64c1e115cccd22ee079)), closes [#180](https://github.com/IBM/openapi-validator/issues/180)

# [0.31.0](https://github.com/IBM/openapi-validator/compare/v0.30.1...v0.31.0) (2020-10-15)


### Features

* allow spectral rule severity to be modified in the validaterc ([#202](https://github.com/IBM/openapi-validator/issues/202)) ([dc81079](https://github.com/IBM/openapi-validator/commit/dc81079bbe620790868ce957e12bdab400fbcd64))

## [0.30.1](https://github.com/IBM/openapi-validator/compare/v0.30.0...v0.30.1) (2020-10-02)


### Bug Fixes

* fix spectral file path resolving ([#201](https://github.com/IBM/openapi-validator/issues/201)) ([8227946](https://github.com/IBM/openapi-validator/commit/8227946588404f1eda7af66e784209d0b2f894be))

# [0.30.0](https://github.com/IBM/openapi-validator/compare/v0.29.4...v0.30.0) (2020-09-23)


### Features

* initial Spectral integration ([#195](https://github.com/IBM/openapi-validator/issues/195)) ([ccbc7a6](https://github.com/IBM/openapi-validator/commit/ccbc7a6f73e121b360cb4b30b8ab8ff9cbdb6edb))

## [0.29.4](https://github.com/IBM/openapi-validator/compare/v0.29.3...v0.29.4) (2020-09-22)


### Bug Fixes

* recognize `application/merge-patch+json` media type as JSON ([#198](https://github.com/IBM/openapi-validator/issues/198)) ([958b6af](https://github.com/IBM/openapi-validator/commit/958b6af12736f5daabcd0c8d3dc914e25bead966))

## [0.29.3](https://github.com/IBM/openapi-validator/compare/v0.29.2...v0.29.3) (2020-09-02)


### Bug Fixes

* dont validate schema properties called 'responses' as responses ([#194](https://github.com/IBM/openapi-validator/issues/194)) ([4277079](https://github.com/IBM/openapi-validator/commit/4277079d2651ef8324dc76fb226033f19273aab6))

## [0.29.2](https://github.com/IBM/openapi-validator/compare/v0.29.1...v0.29.2) (2020-08-27)


### Bug Fixes

* **validator:** typo in `isURL` function call ([#189](https://github.com/IBM/openapi-validator/issues/189)) ([58f75a0](https://github.com/IBM/openapi-validator/commit/58f75a0d0213ab9e4ac2b258aff54ef8e14d1b7a))

## [0.29.1](https://github.com/IBM/openapi-validator/compare/v0.29.0...v0.29.1) (2020-08-26)


### Bug Fixes

* Required properties warning now checked in child refs ([#187](https://github.com/IBM/openapi-validator/issues/187)) ([5f2ae83](https://github.com/IBM/openapi-validator/commit/5f2ae839623130edb483ff7e93a390b3faaeb9a8))

# [0.29.0](https://github.com/IBM/openapi-validator/compare/v0.28.1...v0.29.0) (2020-08-11)


### Features

* Validate missing response descriptions ([#186](https://github.com/IBM/openapi-validator/issues/186)) ([751c18d](https://github.com/IBM/openapi-validator/commit/751c18df5e50e5c87859a6d002ce4f7fe2873f28))

## [0.28.1](https://github.com/IBM/openapi-validator/compare/v0.28.0...v0.28.1) (2020-08-06)


### Bug Fixes

* Reduce default severity of enum case convention ([d09c4e8](https://github.com/IBM/openapi-validator/commit/d09c4e830556ea49a30162b771f39548c1b28f49))

# [0.28.0](https://github.com/IBM/openapi-validator/compare/v0.27.1...v0.28.0) (2020-06-23)


### Features

* rule `unused_tag` renamed to `undefined_tag` ([#171](https://github.com/IBM/openapi-validator/issues/171)) ([95a4308](https://github.com/IBM/openapi-validator/commit/95a430838566e9ece4df8b9ec994870540e6b282))

## [0.27.1](https://github.com/IBM/openapi-validator/compare/v0.27.0...v0.27.1) (2020-05-04)


### Bug Fixes

* dont crash when only a subset of ops contain redundant path params ([#168](https://github.com/IBM/openapi-validator/issues/168)) ([d9000d2](https://github.com/IBM/openapi-validator/commit/d9000d23999c241d7cd2e39bd551f1e3f10cfc9f))

# [0.27.0](https://github.com/IBM/openapi-validator/compare/v0.26.1...v0.27.0) (2020-04-28)


### Features

* adds check for case-insensitive property name collisions ([#162](https://github.com/IBM/openapi-validator/issues/162)) ([85a797e](https://github.com/IBM/openapi-validator/commit/85a797e405d0acdb0d7700df284e22c105308893))

## [0.26.1](https://github.com/IBM/openapi-validator/compare/v0.26.0...v0.26.1) (2020-04-11)


### Bug Fixes

* Only check operationId naming convention for resource-oriented operations ([8da9d37](https://github.com/IBM/openapi-validator/commit/8da9d37e561e806cd43495b4b0440eb23ab9cf44))
* Tweak message text for better summarization ([80f2302](https://github.com/IBM/openapi-validator/commit/80f2302408ad90ef179874d989baf83247d84fb0))

# [0.26.0](https://github.com/IBM/openapi-validator/compare/v0.25.0...v0.26.0) (2020-03-16)


### Features

* adds a check for 422 and 302 status codes ([#154](https://github.com/IBM/openapi-validator/issues/154)) ([4d5ba65](https://github.com/IBM/openapi-validator/commit/4d5ba65870fb9d773122f57223593ee680c66a2f))

# [0.25.0](https://github.com/IBM/openapi-validator/compare/v0.24.3...v0.25.0) (2020-03-11)


### Features

* flag properties with the same name but different type ([#140](https://github.com/IBM/openapi-validator/issues/140)) ([3ab9c3a](https://github.com/IBM/openapi-validator/commit/3ab9c3ad59f60987d663e7162fa869cbfc1e1542))

## [0.24.3](https://github.com/IBM/openapi-validator/compare/v0.24.2...v0.24.3) (2020-03-11)


### Bug Fixes

* Fix crashes found on real API docs ([ddab1a0](https://github.com/IBM/openapi-validator/commit/ddab1a0a6c83d08fe8f49e2f1d3a60f7a833c093))
* Pass path as array to preseve path segments containing periods. ([d1ed5c0](https://github.com/IBM/openapi-validator/commit/d1ed5c0eef42f95aaac6befc80ae02a9fdb5bb04))

## [0.24.2](https://github.com/IBM/openapi-validator/compare/v0.24.1...v0.24.2) (2020-03-09)


### Bug Fixes

* Add debug option ([2bb6df9](https://github.com/IBM/openapi-validator/commit/2bb6df94df97313b4d400c091625ade28378a613))

## [0.24.1](https://github.com/IBM/openapi-validator/compare/v0.24.0...v0.24.1) (2020-03-04)


### Bug Fixes

* make operationId naming convention check configurable ([#149](https://github.com/IBM/openapi-validator/issues/149)) ([c8b07ff](https://github.com/IBM/openapi-validator/commit/c8b07ff))

# [0.24.0](https://github.com/IBM/openapi-validator/compare/v0.23.0...v0.24.0) (2020-02-25)


### Features

* list valid types and formats in error messages ([#145](https://github.com/IBM/openapi-validator/issues/145)) ([600bf8e](https://github.com/IBM/openapi-validator/commit/600bf8e))

# [0.23.0](https://github.com/IBM/openapi-validator/compare/v0.22.0...v0.23.0) (2020-02-24)


### Features

* error for oneOf, anyOf, allOf schema that does not use array ([#143](https://github.com/IBM/openapi-validator/issues/143)) ([1db6b27](https://github.com/IBM/openapi-validator/commit/1db6b27))

# [0.22.0](https://github.com/IBM/openapi-validator/compare/v0.21.0...v0.22.0) (2020-02-21)


### Features

* flag definitions that are defined but never used ([#144](https://github.com/IBM/openapi-validator/issues/144)) ([a131408](https://github.com/IBM/openapi-validator/commit/a131408))

# [0.21.0](https://github.com/IBM/openapi-validator/compare/v0.20.0...v0.21.0) (2020-02-18)


### Features

* add validator warning for binary string in "application/json" or parameter ([#139](https://github.com/IBM/openapi-validator/issues/139)) ([9497333](https://github.com/IBM/openapi-validator/commit/9497333))

# [0.20.0](https://github.com/IBM/openapi-validator/compare/v0.19.3...v0.20.0) (2020-02-17)


### Features

* validator should check for mandatory swagger or openapi field ([#137](https://github.com/IBM/openapi-validator/issues/137)) ([b4275d3](https://github.com/IBM/openapi-validator/commit/b4275d3))

## [0.19.3](https://github.com/IBM/openapi-validator/compare/v0.19.2...v0.19.3) (2020-02-12)


### Bug Fixes

* print usage menu for an unknown flag ([#130](https://github.com/IBM/openapi-validator/issues/130)) ([def7dcc](https://github.com/IBM/openapi-validator/commit/def7dcc))

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
