## ibm-openapi-validator [0.57.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.57.0...ibm-openapi-validator@0.57.1) (2022-02-22)


### Bug Fixes

* display details for 'Error running Nimma' errors ([#381](https://github.com/IBM/openapi-validator/issues/381)) ([397d1d2](https://github.com/IBM/openapi-validator/commit/397d1d22dc1fe6f4cce78468a75dad71cf1c7b10))

# ibm-openapi-validator [0.57.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.56.2...ibm-openapi-validator@0.57.0) (2022-02-16)


### Features

* convert 'property-case-collision' rule to spectral style ([#377](https://github.com/IBM/openapi-validator/issues/377)) ([fbfda97](https://github.com/IBM/openapi-validator/commit/fbfda97fff5b85654bac0baf265ad58e924701ed))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.6.0

## ibm-openapi-validator [0.56.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.56.1...ibm-openapi-validator@0.56.2) (2022-02-15)


### Bug Fixes

* pin spectral dependencies to avoid configuration bugs ([#376](https://github.com/IBM/openapi-validator/issues/376)) ([92a927b](https://github.com/IBM/openapi-validator/commit/92a927bd4d67c5bfa3d5da0dd565ed0ccea2a9c2))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.5.1

## ibm-openapi-validator [0.56.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.56.0...ibm-openapi-validator@0.56.1) (2022-02-15)


### Bug Fixes

* remove property-case-convention rule in favor of new Spectral rule ([2915b20](https://github.com/IBM/openapi-validator/commit/2915b20597d285a8439ffa20aa453de61cff1a1d))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.5.0

# ibm-openapi-validator [0.56.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.55.0...ibm-openapi-validator@0.56.0) (2022-02-15)


### Features

* add 'description-mentions-json' spectral rule and remove old rules ([#374](https://github.com/IBM/openapi-validator/issues/374)) ([9ff243b](https://github.com/IBM/openapi-validator/commit/9ff243bacdfcb13212dbdd200c36726ec6d31b05))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.4.0

# ibm-openapi-validator [0.55.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.54.1...ibm-openapi-validator@0.55.0) (2022-02-11)


### Features

* add 'schema-description' spectral rule and remove old rules ([#372](https://github.com/IBM/openapi-validator/issues/372)) ([9bfdc81](https://github.com/IBM/openapi-validator/commit/9bfdc81bdb436badd9e44d0d21de440d108a0f21))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.3.0

## ibm-openapi-validator [0.54.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.54.0...ibm-openapi-validator@0.54.1) (2022-02-08)


### Bug Fixes

* convert type/format rule to spectral style ([#371](https://github.com/IBM/openapi-validator/issues/371)) ([0263e7a](https://github.com/IBM/openapi-validator/commit/0263e7a2c9e0805bfc8897fb78844a08a0d1d4fd))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.2.1

# ibm-openapi-validator [0.54.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.53.1...ibm-openapi-validator@0.54.0) (2022-02-04)


### Features

* add new spectral `discriminator` rule and remove old rule ([#367](https://github.com/IBM/openapi-validator/issues/367)) ([390afc9](https://github.com/IBM/openapi-validator/commit/390afc91e745c4ac73bf7fcd6a027107a5bc8021))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.2.0

## ibm-openapi-validator [0.53.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.53.0...ibm-openapi-validator@0.53.1) (2022-01-21)


### Bug Fixes

* add supported formats to invalid_type_format_pair rule ([#363](https://github.com/IBM/openapi-validator/issues/363)) ([8b1ba0d](https://github.com/IBM/openapi-validator/commit/8b1ba0da8754f44cec51e4725f6edfb088b1aa2f))

# ibm-openapi-validator [0.53.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.52.2...ibm-openapi-validator@0.53.0) (2022-01-13)


### Features

* enable spectral overrides ([#358](https://github.com/IBM/openapi-validator/issues/358)) ([2e04e38](https://github.com/IBM/openapi-validator/commit/2e04e38de5e0c319cdbbd02992e3ff4a86a0ee0b))

## ibm-openapi-validator [0.52.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.52.1...ibm-openapi-validator@0.52.2) (2022-01-10)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.1.2

## ibm-openapi-validator [0.52.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.52.0...ibm-openapi-validator@0.52.1) (2022-01-04)


### Bug Fixes

* replace custom 'unused component' validation with spectral rule ([#353](https://github.com/IBM/openapi-validator/issues/353)) ([c898d10](https://github.com/IBM/openapi-validator/commit/c898d103ca142d221a91fc00d0b5d788a80f3f0c))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.1.1

# ibm-openapi-validator [0.52.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.51.3...ibm-openapi-validator@0.52.0) (2021-12-16)


### Features

* upgrade to spectral 6 and convert to monorepo ([#349](https://github.com/IBM/openapi-validator/issues/349)) ([970ef85](https://github.com/IBM/openapi-validator/commit/970ef85371f915b490a7394eb0cfe06752773623))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.1.0
