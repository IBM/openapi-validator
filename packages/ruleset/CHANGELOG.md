# @ibm-cloud/openapi-ruleset [0.38.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.37.3...@ibm-cloud/openapi-ruleset@0.38.0) (2022-08-25)


### Features

* **precondition-header:** add new `precondition-header` spectral-style rule ([#484](https://github.com/IBM/openapi-validator/issues/484)) ([2471a14](https://github.com/IBM/openapi-validator/commit/2471a14e617a74f5f83fbbf368159a7245a69d0c))

## @ibm-cloud/openapi-ruleset [0.37.3](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.37.2...@ibm-cloud/openapi-ruleset@0.37.3) (2022-08-19)


### Bug Fixes

* **response-status-codes:** avoid false positives for 'create' operations ([#483](https://github.com/IBM/openapi-validator/issues/483)) ([09aeb17](https://github.com/IBM/openapi-validator/commit/09aeb17aada639c27a36da05ad6ada34ed520ebe))

## @ibm-cloud/openapi-ruleset [0.37.2](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.37.1...@ibm-cloud/openapi-ruleset@0.37.2) (2022-08-19)


### Bug Fixes

* **request-body-name:** support json-patch/merge-patch operations ([#482](https://github.com/IBM/openapi-validator/issues/482)) ([41daa3e](https://github.com/IBM/openapi-validator/commit/41daa3e190f44c8a2ac250d3ddf0b6188a095901))

## @ibm-cloud/openapi-ruleset [0.37.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.37.0...@ibm-cloud/openapi-ruleset@0.37.1) (2022-08-19)


### Bug Fixes

* **response-error-response-schema:** bring rule in sync with API Handbook ([#481](https://github.com/IBM/openapi-validator/issues/481)) ([656cfb1](https://github.com/IBM/openapi-validator/commit/656cfb111eb35b07a154bc5b59f1b600b502d02c))

# @ibm-cloud/openapi-ruleset [0.37.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.36.0...@ibm-cloud/openapi-ruleset@0.37.0) (2022-08-12)


### Features

* **patch-request-content-type:** add new spectral-style rule ([#480](https://github.com/IBM/openapi-validator/issues/480)) ([e8208a3](https://github.com/IBM/openapi-validator/commit/e8208a34f960d5a1283061bbcabf4f13989f0e8f))

# @ibm-cloud/openapi-ruleset [0.36.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.35.0...@ibm-cloud/openapi-ruleset@0.36.0) (2022-08-11)


### Features

* add new rules 'if-modified-since-parameter' and if-unmodified-since-parameter ([#478](https://github.com/IBM/openapi-validator/issues/478)) ([fec1b25](https://github.com/IBM/openapi-validator/commit/fec1b257315edd84fe90f3f6f0e5bc5ff4efd9dd))

# @ibm-cloud/openapi-ruleset [0.35.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.34.0...@ibm-cloud/openapi-ruleset@0.35.0) (2022-08-10)


### Features

* **property-inconsistent-name-and-type:** disable rule in default configuration ([01845f2](https://github.com/IBM/openapi-validator/commit/01845f295cb36fdcf222bbf447fc76417a39106a))

# @ibm-cloud/openapi-ruleset [0.34.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.33.2...@ibm-cloud/openapi-ruleset@0.34.0) (2022-08-10)


### Features

* **no-etag-header:** add new 'no-etag-header' spectral-style rule ([791ec7d](https://github.com/IBM/openapi-validator/commit/791ec7da0460c65a23e525445542a72f1978cc2e))

## @ibm-cloud/openapi-ruleset [0.33.2](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.33.1...@ibm-cloud/openapi-ruleset@0.33.2) (2022-08-10)


### Bug Fixes

* **content-entry-provided:** make exceptions for head, options, and trace operations ([#476](https://github.com/IBM/openapi-validator/issues/476)) ([e5bc535](https://github.com/IBM/openapi-validator/commit/e5bc535f559e2243fde5fb4033d971637911f502)), closes [#235](https://github.com/IBM/openapi-validator/issues/235)

## @ibm-cloud/openapi-ruleset [0.33.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.33.0...@ibm-cloud/openapi-ruleset@0.33.1) (2022-08-09)


### Bug Fixes

* **security-scheme-attributes:** allow relative urls in scheme attributes ([#475](https://github.com/IBM/openapi-validator/issues/475)) ([da4436a](https://github.com/IBM/openapi-validator/commit/da4436a4e0a3c9b0a863163c4ef6a1577437e360)), closes [#466](https://github.com/IBM/openapi-validator/issues/466)

# @ibm-cloud/openapi-ruleset [0.33.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.32.3...@ibm-cloud/openapi-ruleset@0.33.0) (2022-08-08)


### Features

* add 2 new rules related to path segments ([014f8a9](https://github.com/IBM/openapi-validator/commit/014f8a95aac125b31309d644376461f3dbae857a))

## @ibm-cloud/openapi-ruleset [0.32.3](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.32.2...@ibm-cloud/openapi-ruleset@0.32.3) (2022-08-05)


### Bug Fixes

* **string-boundary:** improve handling of composed schemas ([#473](https://github.com/IBM/openapi-validator/issues/473)) ([1dfa961](https://github.com/IBM/openapi-validator/commit/1dfa9618c76ba040a9b864efad1a6d3b68ed1938))

## @ibm-cloud/openapi-ruleset [0.32.2](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.32.1...@ibm-cloud/openapi-ruleset@0.32.2) (2022-07-28)


### Bug Fixes

* stop considering x-sdk-excluded annotation in validations ([#472](https://github.com/IBM/openapi-validator/issues/472)) ([e7f4e63](https://github.com/IBM/openapi-validator/commit/e7f4e63b96ec2084ce7039743e7dc28e60cf9245))

## @ibm-cloud/openapi-ruleset [0.32.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.32.0...@ibm-cloud/openapi-ruleset@0.32.1) (2022-07-22)


### Bug Fixes

* update spectral version to resolve path mapping bug ([#465](https://github.com/IBM/openapi-validator/issues/465)) ([e6520fb](https://github.com/IBM/openapi-validator/commit/e6520fb06ecc23d516c1844f6022b140a81e0f2b))

# @ibm-cloud/openapi-ruleset [0.32.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.31.1...@ibm-cloud/openapi-ruleset@0.32.0) (2022-07-14)


### Features

* **delete-body:** add new spectral-style 'delete-body' rule ([989ae62](https://github.com/IBM/openapi-validator/commit/989ae625469fe8684af58e8e271a352718dee61d))

## @ibm-cloud/openapi-ruleset [0.31.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.31.0...@ibm-cloud/openapi-ruleset@0.31.1) (2022-07-14)


### Bug Fixes

* **response-status-codes:** add check for 201/202 response for 'create' operation ([4c663c2](https://github.com/IBM/openapi-validator/commit/4c663c261fc97f4498ba8ee816fa36c9f7640cda))

# @ibm-cloud/openapi-ruleset [0.31.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.30.1...@ibm-cloud/openapi-ruleset@0.31.0) (2022-07-14)


### Features

* **array-boundary:** new rule to enforce contraints set on arrays ([#462](https://github.com/IBM/openapi-validator/issues/462)) ([5d499d7](https://github.com/IBM/openapi-validator/commit/5d499d76e571c8eb5f2e13e01099639f624894f7))

## @ibm-cloud/openapi-ruleset [0.30.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.30.0...@ibm-cloud/openapi-ruleset@0.30.1) (2022-07-08)


### Bug Fixes

* modify 'parameters' collection for new nimma version ([92032aa](https://github.com/IBM/openapi-validator/commit/92032aa71e97e698c352f2d3847a9d82f98cf769))

# @ibm-cloud/openapi-ruleset [0.30.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.29.0...@ibm-cloud/openapi-ruleset@0.30.0) (2022-06-13)


### Features

* **ref-sibling-duplicate-description:** add new spectral-style rule ([#454](https://github.com/IBM/openapi-validator/issues/454)) ([1adfa60](https://github.com/IBM/openapi-validator/commit/1adfa600799689b708416fb84d2ff9045fec91ef))

# @ibm-cloud/openapi-ruleset [0.29.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.28.0...@ibm-cloud/openapi-ruleset@0.29.0) (2022-06-07)


### Features

* **schema-type:** add new 'schema-type' rule (disabled by default) ([#448](https://github.com/IBM/openapi-validator/issues/448)) ([4af3e9a](https://github.com/IBM/openapi-validator/commit/4af3e9a3522862c7540e6daba8e0cf4b7ba30874))

# @ibm-cloud/openapi-ruleset [0.28.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.27.0...@ibm-cloud/openapi-ruleset@0.28.0) (2022-06-03)


### Features

* **security-scheme-attributes:** add new security-scheme-attributes rule ([#450](https://github.com/IBM/openapi-validator/issues/450)) ([68aad84](https://github.com/IBM/openapi-validator/commit/68aad84a9a8334f03ab5ddcf83ed36fd6649fd56))

# @ibm-cloud/openapi-ruleset [0.27.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.26.1...@ibm-cloud/openapi-ruleset@0.27.0) (2022-05-26)


### Features

* **property-attributes:** add new 'property-attributes' spectral-style rule ([#446](https://github.com/IBM/openapi-validator/issues/446)) ([dbc9980](https://github.com/IBM/openapi-validator/commit/dbc998095afe09481f547a9d7e290408529fa025))

## @ibm-cloud/openapi-ruleset [0.26.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.26.0...@ibm-cloud/openapi-ruleset@0.26.1) (2022-05-24)


### Bug Fixes

* **pagination-style:** fix issues in 'pagination-style' rule ([#447](https://github.com/IBM/openapi-validator/issues/447)) ([f3b2483](https://github.com/IBM/openapi-validator/commit/f3b2483d08700ffc134e8c1afa97f749e3ad9a1f))

# @ibm-cloud/openapi-ruleset [0.26.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.25.2...@ibm-cloud/openapi-ruleset@0.26.0) (2022-05-23)


### Features

* **array-items:** add new 'array-items' spectral-style rule ([#445](https://github.com/IBM/openapi-validator/issues/445)) ([defa1d6](https://github.com/IBM/openapi-validator/commit/defa1d6752c2da35d08653012fb88cf13f2e8e55))

## @ibm-cloud/openapi-ruleset [0.25.2](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.25.1...@ibm-cloud/openapi-ruleset@0.25.2) (2022-05-13)


### Bug Fixes

* **operation-id-naming-convention:** update rule with latest guidance ([#442](https://github.com/IBM/openapi-validator/issues/442)) ([cd42eaf](https://github.com/IBM/openapi-validator/commit/cd42eafaffa6c130dbb59a11d4845f5a6aa0ffe9))

## @ibm-cloud/openapi-ruleset [0.25.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.25.0...@ibm-cloud/openapi-ruleset@0.25.1) (2022-05-11)


### Bug Fixes

* Exclude inapplicable validation from not schemas ([#443](https://github.com/IBM/openapi-validator/issues/443)) ([9ea589e](https://github.com/IBM/openapi-validator/commit/9ea589ef41c9e6b1fd98f5bb122c560c55d9ff6c))

# @ibm-cloud/openapi-ruleset [0.25.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.24.0...@ibm-cloud/openapi-ruleset@0.25.0) (2022-05-02)


### Features

* **circular-refs:** add new 'circular-refs' rule ([#441](https://github.com/IBM/openapi-validator/issues/441)) ([71d3c74](https://github.com/IBM/openapi-validator/commit/71d3c744f4f4666bd35dcfa1032834f62119db51))

# @ibm-cloud/openapi-ruleset [0.24.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.23.0...@ibm-cloud/openapi-ruleset@0.24.0) (2022-04-28)


### Features

* **ref-pattern:** add new 'ref-pattern' rule ([#439](https://github.com/IBM/openapi-validator/issues/439)) ([bdacf51](https://github.com/IBM/openapi-validator/commit/bdacf510941d808ee7ec4abcda2248b71d06dbdf))

# @ibm-cloud/openapi-ruleset [0.23.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.22.0...@ibm-cloud/openapi-ruleset@0.23.0) (2022-04-26)


### Features

* enable spectral:oas 'no-$ref-siblings' rule ([#437](https://github.com/IBM/openapi-validator/issues/437)) ([aa93294](https://github.com/IBM/openapi-validator/commit/aa93294013379a6527ab6b9e161da18cd5d0958f))

# @ibm-cloud/openapi-ruleset [0.22.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.21.0...@ibm-cloud/openapi-ruleset@0.22.0) (2022-04-26)


### Features

* **binary-schemas:** add new 'binary-schemas' rule ([#436](https://github.com/IBM/openapi-validator/issues/436)) ([9480fa0](https://github.com/IBM/openapi-validator/commit/9480fa04481f1dfbbe9c4b10d488804b2b2ba8d5))

# @ibm-cloud/openapi-ruleset [0.21.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.20.0...@ibm-cloud/openapi-ruleset@0.21.0) (2022-04-21)


### Features

* **response-status-codes:** add new 'response-status-codes' rule ([#433](https://github.com/IBM/openapi-validator/issues/433)) ([1dc6cb4](https://github.com/IBM/openapi-validator/commit/1dc6cb4eeb92a75c1b37529ff4f62d3a6c567442))

# @ibm-cloud/openapi-ruleset [0.20.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.19.0...@ibm-cloud/openapi-ruleset@0.20.0) (2022-04-21)


### Features

* **inline-response-schema:** add new 'inline-response-schema' rule ([#431](https://github.com/IBM/openapi-validator/issues/431)) ([7fd31c7](https://github.com/IBM/openapi-validator/commit/7fd31c78e2edd5ceeb98557939ac63ee18dd446b))

# @ibm-cloud/openapi-ruleset [0.19.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.18.0...@ibm-cloud/openapi-ruleset@0.19.0) (2022-04-21)


### Features

* **path-segment-case-convention:** add new 'path-segment-case-convention' rule ([#430](https://github.com/IBM/openapi-validator/issues/430)) ([af52002](https://github.com/IBM/openapi-validator/commit/af5200268e38dfbed2ad06f0c330433d2117104a))

# @ibm-cloud/openapi-ruleset [0.18.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.17.0...@ibm-cloud/openapi-ruleset@0.18.0) (2022-04-21)


### Features

* **duplicate-path-parameter:** add new 'duplicate-path-parameter' rule ([#429](https://github.com/IBM/openapi-validator/issues/429)) ([bc8bcb2](https://github.com/IBM/openapi-validator/commit/bc8bcb2fb131133e7b326c49c57cd3fdf97790d7))

# @ibm-cloud/openapi-ruleset [0.17.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.16.0...@ibm-cloud/openapi-ruleset@0.17.0) (2022-04-19)


### Features

* **missing_path_parameter:** replace rule with spectral:oas rules ([#428](https://github.com/IBM/openapi-validator/issues/428)) ([4b7719f](https://github.com/IBM/openapi-validator/commit/4b7719f51489b80474e6ae4c8d5a56d139ec9f0b))

# @ibm-cloud/openapi-ruleset [0.16.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.15.0...@ibm-cloud/openapi-ruleset@0.16.0) (2022-04-19)


### Features

* **parameter-order:** add new 'parameter-order' rule ([#423](https://github.com/IBM/openapi-validator/issues/423)) ([3304225](https://github.com/IBM/openapi-validator/commit/33042257cab50dda1aa602cd3c3bd8ee33749b12))

# @ibm-cloud/openapi-ruleset [0.15.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.14.1...@ibm-cloud/openapi-ruleset@0.15.0) (2022-04-19)


### Features

* **array-responses:** add new 'array-responses' rule ([#422](https://github.com/IBM/openapi-validator/issues/422)) ([88cf48c](https://github.com/IBM/openapi-validator/commit/88cf48c1c9da04f49da6d82528b3c97be01ba356))

## @ibm-cloud/openapi-ruleset [0.14.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.14.0...@ibm-cloud/openapi-ruleset@0.14.1) (2022-04-19)


### Bug Fixes

* **content-entry-provided:** dont require content entry for 304 responses ([82c0c0a](https://github.com/IBM/openapi-validator/commit/82c0c0af2b2d41e8fc1ebdaf6ff2740a39d4ac06))

# @ibm-cloud/openapi-ruleset [0.14.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.13.0...@ibm-cloud/openapi-ruleset@0.14.0) (2022-04-14)


### Features

* **operation-id-naming-convention:** add new operation-id-naming-convention rule ([#421](https://github.com/IBM/openapi-validator/issues/421)) ([669e6d9](https://github.com/IBM/openapi-validator/commit/669e6d9e63880bed215cfd746fedb3625925d94a))

# @ibm-cloud/openapi-ruleset [0.13.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.12.0...@ibm-cloud/openapi-ruleset@0.13.0) (2022-04-14)


### Features

* **operation-id-case-convention:** add new operation-id-case-convention rule ([#420](https://github.com/IBM/openapi-validator/issues/420)) ([c9e25f8](https://github.com/IBM/openapi-validator/commit/c9e25f8f629e17e2f77aaa7872a2a2a63f427b2b))

# @ibm-cloud/openapi-ruleset [0.12.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.11.1...@ibm-cloud/openapi-ruleset@0.12.0) (2022-04-13)


### Features

* **request-body-name:** add new request-body-name rule ([#419](https://github.com/IBM/openapi-validator/issues/419)) ([4494537](https://github.com/IBM/openapi-validator/commit/44945375d208dca023161610a260e9b6d668320a))

## @ibm-cloud/openapi-ruleset [0.11.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.11.0...@ibm-cloud/openapi-ruleset@0.11.1) (2022-04-13)


### Bug Fixes

* **string-boundary:** update string-boundary rule with new formats ([#417](https://github.com/IBM/openapi-validator/issues/417)) ([cf6bb3a](https://github.com/IBM/openapi-validator/commit/cf6bb3a5440f5152bf8b8f269773c63c17cadec2))

# @ibm-cloud/openapi-ruleset [0.11.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.10.0...@ibm-cloud/openapi-ruleset@0.11.0) (2022-04-12)


### Features

* **unused-tag:** add unused-tag rule ([#418](https://github.com/IBM/openapi-validator/issues/418)) ([a065b61](https://github.com/IBM/openapi-validator/commit/a065b61e9300a169bb64c5747d66ff34ac88d41a))

# @ibm-cloud/openapi-ruleset [0.10.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.9.0...@ibm-cloud/openapi-ruleset@0.10.0) (2022-04-11)


### Features

* **operation-summary:** add new 'operation-summary' rule ([#416](https://github.com/IBM/openapi-validator/issues/416)) ([f0e0908](https://github.com/IBM/openapi-validator/commit/f0e09086542d9c66608dcbca22d7a95d04a93c0c))

# @ibm-cloud/openapi-ruleset [0.9.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.8.0...@ibm-cloud/openapi-ruleset@0.9.0) (2022-04-08)


### Features

* **security-schemes:** add new 'security-schemes' rule ([#415](https://github.com/IBM/openapi-validator/issues/415)) ([15a2332](https://github.com/IBM/openapi-validator/commit/15a2332fc8751a0f8f0f011069b1ccf134443fa1))

# @ibm-cloud/openapi-ruleset [0.8.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.7.2...@ibm-cloud/openapi-ruleset@0.8.0) (2022-04-07)


### Features

* add new `property-inconsistent-name-and-type` rule and remove old rule ([#408](https://github.com/IBM/openapi-validator/issues/408)) ([a3462e0](https://github.com/IBM/openapi-validator/commit/a3462e006318e4b925059ec20b4f7b674f3365d8))

## @ibm-cloud/openapi-ruleset [0.7.2](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.7.1...@ibm-cloud/openapi-ruleset@0.7.2) (2022-03-25)


### Bug Fixes

* **major-version-in-path:** tolerate invalid server.url value ([#404](https://github.com/IBM/openapi-validator/issues/404)) ([43539c0](https://github.com/IBM/openapi-validator/commit/43539c0bf8715aeb8eee95d7c7e4820a421f86d6))

## @ibm-cloud/openapi-ruleset [0.7.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.7.0...@ibm-cloud/openapi-ruleset@0.7.1) (2022-03-15)


### Bug Fixes

* **pagination-style:** fix bug in pagination-style rule ([#402](https://github.com/IBM/openapi-validator/issues/402)) ([b9c364a](https://github.com/IBM/openapi-validator/commit/b9c364a87e7c84f293adf00501c76d89babcc123))

# @ibm-cloud/openapi-ruleset [0.7.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.6.2...@ibm-cloud/openapi-ruleset@0.7.0) (2022-03-10)


### Features

* add new header-related rules and remove old rules ([444924a](https://github.com/IBM/openapi-validator/commit/444924a94e21093fc1721888a8a381ea3061bff7))
* **enum-case-convention:** add new enum-case-convention spectral rule, remove old rule ([ac286ff](https://github.com/IBM/openapi-validator/commit/ac286ff4b4d4828fcf08480ce0f3a93989c88371))
* **pagination-style:** add new 'pagination-style' rule and remove old rule ([3ad7a35](https://github.com/IBM/openapi-validator/commit/3ad7a3531bee3ec779d6cd8b4daeb6742ff42e1f))
* **parameter-case-convention:** add new 'parameter-case-convention' rule and remove old rule ([5eed197](https://github.com/IBM/openapi-validator/commit/5eed197e7653e3822c6864ce523fb99a2215eaf1))
* **parameter-default:** add new 'parameter-default' rule and remove old rule ([ae95925](https://github.com/IBM/openapi-validator/commit/ae95925fa99d3367eba3dc9b454a6aeb60faa861))
* **parameter-description:** add new 'parameter-description' rule and remove old rule ([#387](https://github.com/IBM/openapi-validator/issues/387)) ([ee51ef6](https://github.com/IBM/openapi-validator/commit/ee51ef6a5312601dc6cf4d45b7693655f62d475f))
* **property-description:** add new 'property-description' rule ([#392](https://github.com/IBM/openapi-validator/issues/392)) ([21f8536](https://github.com/IBM/openapi-validator/commit/21f853612ac02c4fe4e645f64c55301df3eb16b8))

## @ibm-cloud/openapi-ruleset [0.6.2](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.6.1...@ibm-cloud/openapi-ruleset@0.6.2) (2022-02-24)


### Bug Fixes

* **schema-description:** consider descriptions within allOf/anyOf/oneOf ([#385](https://github.com/IBM/openapi-validator/issues/385)) ([a5469a3](https://github.com/IBM/openapi-validator/commit/a5469a30403051317a4c6bff12427b7eafcb7997))

## @ibm-cloud/openapi-ruleset [0.6.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.6.0...@ibm-cloud/openapi-ruleset@0.6.1) (2022-02-23)


### Bug Fixes

* bugs in checkSubschemasForProperty (now checkCompositeSchemaForProperty) ([46a61cb](https://github.com/IBM/openapi-validator/commit/46a61cbd08e7f15ea777050338bf6eb2e2f3d2d7))

# @ibm-cloud/openapi-ruleset [0.6.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.5.1...@ibm-cloud/openapi-ruleset@0.6.0) (2022-02-16)


### Features

* convert 'property-case-collision' rule to spectral style ([#377](https://github.com/IBM/openapi-validator/issues/377)) ([fbfda97](https://github.com/IBM/openapi-validator/commit/fbfda97fff5b85654bac0baf265ad58e924701ed))

## @ibm-cloud/openapi-ruleset [0.5.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.5.0...@ibm-cloud/openapi-ruleset@0.5.1) (2022-02-15)


### Bug Fixes

* pin spectral dependencies to avoid configuration bugs ([#376](https://github.com/IBM/openapi-validator/issues/376)) ([92a927b](https://github.com/IBM/openapi-validator/commit/92a927bd4d67c5bfa3d5da0dd565ed0ccea2a9c2))

# @ibm-cloud/openapi-ruleset [0.5.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.4.0...@ibm-cloud/openapi-ruleset@0.5.0) (2022-02-15)


### Features

* **new rule:** property names must be snake case (property-case-convention) ([364ef90](https://github.com/IBM/openapi-validator/commit/364ef90ac588d36cde8a54e44c610d0a3f74ca95))

# @ibm-cloud/openapi-ruleset [0.4.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.3.0...@ibm-cloud/openapi-ruleset@0.4.0) (2022-02-15)


### Features

* add 'description-mentions-json' spectral rule and remove old rules ([#374](https://github.com/IBM/openapi-validator/issues/374)) ([9ff243b](https://github.com/IBM/openapi-validator/commit/9ff243bacdfcb13212dbdd200c36726ec6d31b05))

# @ibm-cloud/openapi-ruleset [0.3.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.2.1...@ibm-cloud/openapi-ruleset@0.3.0) (2022-02-11)


### Features

* add 'schema-description' spectral rule and remove old rules ([#372](https://github.com/IBM/openapi-validator/issues/372)) ([9bfdc81](https://github.com/IBM/openapi-validator/commit/9bfdc81bdb436badd9e44d0d21de440d108a0f21))

## @ibm-cloud/openapi-ruleset [0.2.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.2.0...@ibm-cloud/openapi-ruleset@0.2.1) (2022-02-08)


### Bug Fixes

* convert type/format rule to spectral style ([#371](https://github.com/IBM/openapi-validator/issues/371)) ([0263e7a](https://github.com/IBM/openapi-validator/commit/0263e7a2c9e0805bfc8897fb78844a08a0d1d4fd))

# @ibm-cloud/openapi-ruleset [0.2.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.1.2...@ibm-cloud/openapi-ruleset@0.2.0) (2022-02-04)


### Features

* add new spectral `discriminator` rule and remove old rule ([#367](https://github.com/IBM/openapi-validator/issues/367)) ([390afc9](https://github.com/IBM/openapi-validator/commit/390afc91e745c4ac73bf7fcd6a027107a5bc8021))

## @ibm-cloud/openapi-ruleset [0.1.2](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.1.1...@ibm-cloud/openapi-ruleset@0.1.2) (2022-01-10)


### Bug Fixes

* **string-boundary:** include parameters defined at path level ([#357](https://github.com/IBM/openapi-validator/issues/357)) ([4e30d8a](https://github.com/IBM/openapi-validator/commit/4e30d8a35e488642a2896e7ee94208930ef72889))

## @ibm-cloud/openapi-ruleset [0.1.1](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.1.0...@ibm-cloud/openapi-ruleset@0.1.1) (2022-01-04)


### Bug Fixes

* replace custom 'unused component' validation with spectral rule ([#353](https://github.com/IBM/openapi-validator/issues/353)) ([c898d10](https://github.com/IBM/openapi-validator/commit/c898d103ca142d221a91fc00d0b5d788a80f3f0c))

# @ibm-cloud/openapi-ruleset [0.1.0](https://github.com/IBM/openapi-validator/compare/@ibm-cloud/openapi-ruleset@0.0.1...@ibm-cloud/openapi-ruleset@0.1.0) (2021-12-16)


### Features

* upgrade to spectral 6 and convert to monorepo ([#349](https://github.com/IBM/openapi-validator/issues/349)) ([970ef85](https://github.com/IBM/openapi-validator/commit/970ef85371f915b490a7394eb0cfe06752773623))
