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
