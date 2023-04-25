## ibm-openapi-validator [1.0.4](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@1.0.3...ibm-openapi-validator@1.0.4) (2023-04-25)


### Bug Fixes

* include missing dependencies in ruleset package ([#585](https://github.com/IBM/openapi-validator/issues/585)) ([240980c](https://github.com/IBM/openapi-validator/commit/240980c4139905cc4b65f8fb5bb361e7c4acaa62))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 1.0.1

## ibm-openapi-validator [1.0.3](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@1.0.2...ibm-openapi-validator@1.0.3) (2023-04-13)


### Bug Fixes

* bump minimum node version to 16 ([#582](https://github.com/IBM/openapi-validator/issues/582)) ([7849314](https://github.com/IBM/openapi-validator/commit/784931457a236297cb509c83bb1d447d9cb08497))

## ibm-openapi-validator [1.0.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@1.0.1...ibm-openapi-validator@1.0.2) (2023-04-04)


### Bug Fixes

* avoid sec vulnerability in ajv dependency ([#579](https://github.com/IBM/openapi-validator/issues/579)) ([7285361](https://github.com/IBM/openapi-validator/commit/7285361edc1d6b1a74b431ed7aab7950fd197a88))

## ibm-openapi-validator [1.0.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@1.0.0...ibm-openapi-validator@1.0.1) (2023-03-31)


### Bug Fixes

* use node v18 for travis deployment ([#577](https://github.com/IBM/openapi-validator/issues/577)) ([1692f4d](https://github.com/IBM/openapi-validator/commit/1692f4d1d72d0d4e13209d312fea85b0174ece31))

# ibm-openapi-validator [1.0.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.97.5...ibm-openapi-validator@1.0.0) (2023-03-31)


### Bug Fixes

* apply config options to all output formats ([#567](https://github.com/IBM/openapi-validator/issues/567)) ([587860e](https://github.com/IBM/openapi-validator/commit/587860effabd567141bad2db0f1f45050727cd56))


### Build System

* require node v16 as minimum version ([#574](https://github.com/IBM/openapi-validator/issues/574)) ([dc7c8fe](https://github.com/IBM/openapi-validator/commit/dc7c8fee2bca21ac1c93a7ccbb46eabbafc7eeef))


### Code Refactoring

* re-structure results format ([#561](https://github.com/IBM/openapi-validator/issues/561)) ([a04ec0d](https://github.com/IBM/openapi-validator/commit/a04ec0db5510458bc92b9f4288dcbfa72617e5a3))
* remove validator module API ([#539](https://github.com/IBM/openapi-validator/issues/539)) ([7f54364](https://github.com/IBM/openapi-validator/commit/7f5436448e9c2678b3286dbb44d000a8c3ae1cef))
* update all rules and rule names ([2520648](https://github.com/IBM/openapi-validator/commit/2520648a331a7a0a3c77d14a5f168dec4bc6071d))


### Features

* **logger:** add logger facility to validator core ([#537](https://github.com/IBM/openapi-validator/issues/537)) ([f5aa2fc](https://github.com/IBM/openapi-validator/commit/f5aa2fc42ba886b86b4d861949c035ebe9d48d1a))
* unify all configuration options ([#559](https://github.com/IBM/openapi-validator/issues/559)) ([ef93371](https://github.com/IBM/openapi-validator/commit/ef9337175feaac95addcb0a8ac0c9a074a1419a9))
* update command-line options ([53f4fbb](https://github.com/IBM/openapi-validator/commit/53f4fbb07bc97468da30b8af59c90eda83663d87))
* use consistent format/color for logs ([#572](https://github.com/IBM/openapi-validator/issues/572)) ([1ae158e](https://github.com/IBM/openapi-validator/commit/1ae158edb7d476b2f27ee73e1c25937ea10d2704))


### BREAKING CHANGES

* Node v16 is now the minimum supported version of Node for running this tool.
* The 'verbose' option is no longer supported. Use the logger to see additional output.
* Support for the .thresholdrc and .validateignore files is removed. Use CLI options or the newly-supported configuration file.
* The structure of the JSON output is now different. See the documented JSON Schema for the new structure.
* The Node interface of this tool is no longer supported, it is now a CLI tool only.
* The 'summary-only', 'debug', 'print-validators' options have been removed.


### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 1.0.0

## ibm-openapi-validator [0.97.5](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.97.4...ibm-openapi-validator@0.97.5) (2023-02-28)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.45.5

## ibm-openapi-validator [0.97.4](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.97.3...ibm-openapi-validator@0.97.4) (2023-02-24)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.45.4

## ibm-openapi-validator [0.97.3](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.97.2...ibm-openapi-validator@0.97.3) (2023-01-09)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.45.3

## ibm-openapi-validator [0.97.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.97.1...ibm-openapi-validator@0.97.2) (2022-12-14)


### Bug Fixes

* move `validator` dependency to correct package within monorepo ([#529](https://github.com/IBM/openapi-validator/issues/529)) ([6904445](https://github.com/IBM/openapi-validator/commit/6904445cbe9a19ddb16c44c06df2c8715336b13f))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.45.2

## ibm-openapi-validator [0.97.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.97.0...ibm-openapi-validator@0.97.1) (2022-12-14)


### Bug Fixes

* **property-case-convention:** report correct path in errors ([#526](https://github.com/IBM/openapi-validator/issues/526)) ([3fd84cf](https://github.com/IBM/openapi-validator/commit/3fd84cf96ee90a0229635ea696b6ec97651e48b8))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.45.1

# ibm-openapi-validator [0.97.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.96.5...ibm-openapi-validator@0.97.0) (2022-12-12)


### Features

* bump min node version to 14 ([#525](https://github.com/IBM/openapi-validator/issues/525)) ([249c33e](https://github.com/IBM/openapi-validator/commit/249c33e52687f0933b14039ab515a5e69c88c59e))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.45.0

## ibm-openapi-validator [0.96.5](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.96.4...ibm-openapi-validator@0.96.5) (2022-12-07)


### Bug Fixes

* create executables in correct package ([c289a16](https://github.com/IBM/openapi-validator/commit/c289a164f3a834f22bedd5d74b700d46f3bc5e6b))
* force new release of the project ([1208d82](https://github.com/IBM/openapi-validator/commit/1208d8276e43c4a12d979a51ac4a0f071cde14de))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.44.4

## ibm-openapi-validator [0.96.4](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.96.3...ibm-openapi-validator@0.96.4) (2022-11-22)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.44.3

## ibm-openapi-validator [0.96.3](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.96.2...ibm-openapi-validator@0.96.3) (2022-11-22)


### Bug Fixes

* remove buggy support for tolerating trailing commas ([#518](https://github.com/IBM/openapi-validator/issues/518)) ([9aaa580](https://github.com/IBM/openapi-validator/commit/9aaa580d2f1798798cd96af1bfc2517a678deaf9))

## ibm-openapi-validator [0.96.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.96.1...ibm-openapi-validator@0.96.2) (2022-10-31)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.44.2

## ibm-openapi-validator [0.96.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.96.0...ibm-openapi-validator@0.96.1) (2022-10-18)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.44.1

# ibm-openapi-validator [0.96.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.95.1...ibm-openapi-validator@0.96.0) (2022-10-05)


### Features

* add ruleset version string to `--version` output ([#501](https://github.com/IBM/openapi-validator/issues/501)) ([1d7e028](https://github.com/IBM/openapi-validator/commit/1d7e0289e818194c43827bf92e11b86f418adae9)), closes [#498](https://github.com/IBM/openapi-validator/issues/498)

## ibm-openapi-validator [0.95.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.95.0...ibm-openapi-validator@0.95.1) (2022-10-03)


### Bug Fixes

* fix broken pkg script and publish binaries to github ([#499](https://github.com/IBM/openapi-validator/issues/499)) ([ba19b7b](https://github.com/IBM/openapi-validator/commit/ba19b7b9caafd8f648a28f1befac8bdb3fcddc4d))

# ibm-openapi-validator [0.95.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.94.0...ibm-openapi-validator@0.95.0) (2022-09-20)


### Features

* **inline-property-schema:** add new spectral-style rule ([1447515](https://github.com/IBM/openapi-validator/commit/14475150b0b30befd44a16fd96a9690ffdaef855))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.44.0

# ibm-openapi-validator [0.94.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.93.0...ibm-openapi-validator@0.94.0) (2022-09-19)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.43.0

# ibm-openapi-validator [0.93.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.92.0...ibm-openapi-validator@0.93.0) (2022-09-15)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.42.0

# ibm-openapi-validator [0.92.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.91.0...ibm-openapi-validator@0.92.0) (2022-09-09)


### Features

* **collection-array-property:** add new spectral-style rule ([e24fc67](https://github.com/IBM/openapi-validator/commit/e24fc67b770bf6ea7a08e53ee1898aabd7440b98))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.41.0

# ibm-openapi-validator [0.91.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.90.0...ibm-openapi-validator@0.91.0) (2022-08-30)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.40.0

# ibm-openapi-validator [0.90.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.89.0...ibm-openapi-validator@0.90.0) (2022-08-25)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.39.0

# ibm-openapi-validator [0.89.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.88.3...ibm-openapi-validator@0.89.0) (2022-08-25)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.38.0

## ibm-openapi-validator [0.88.3](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.88.2...ibm-openapi-validator@0.88.3) (2022-08-19)


### Bug Fixes

* **response-status-codes:** avoid false positives for 'create' operations ([#483](https://github.com/IBM/openapi-validator/issues/483)) ([09aeb17](https://github.com/IBM/openapi-validator/commit/09aeb17aada639c27a36da05ad6ada34ed520ebe))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.37.3

## ibm-openapi-validator [0.88.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.88.1...ibm-openapi-validator@0.88.2) (2022-08-19)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.37.2

## ibm-openapi-validator [0.88.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.88.0...ibm-openapi-validator@0.88.1) (2022-08-19)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.37.1

# ibm-openapi-validator [0.88.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.87.0...ibm-openapi-validator@0.88.0) (2022-08-12)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.37.0

# ibm-openapi-validator [0.87.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.86.0...ibm-openapi-validator@0.87.0) (2022-08-11)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.36.0

# ibm-openapi-validator [0.86.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.85.0...ibm-openapi-validator@0.86.0) (2022-08-10)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.35.0

# ibm-openapi-validator [0.85.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.84.2...ibm-openapi-validator@0.85.0) (2022-08-10)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.34.0

## ibm-openapi-validator [0.84.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.84.1...ibm-openapi-validator@0.84.2) (2022-08-10)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.33.2

## ibm-openapi-validator [0.84.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.84.0...ibm-openapi-validator@0.84.1) (2022-08-09)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.33.1

# ibm-openapi-validator [0.84.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.83.3...ibm-openapi-validator@0.84.0) (2022-08-08)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.33.0

## ibm-openapi-validator [0.83.3](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.83.2...ibm-openapi-validator@0.83.3) (2022-08-05)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.32.3

## ibm-openapi-validator [0.83.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.83.1...ibm-openapi-validator@0.83.2) (2022-07-28)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.32.2

## ibm-openapi-validator [0.83.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.83.0...ibm-openapi-validator@0.83.1) (2022-07-22)


### Bug Fixes

* update spectral version to resolve path mapping bug ([#465](https://github.com/IBM/openapi-validator/issues/465)) ([e6520fb](https://github.com/IBM/openapi-validator/commit/e6520fb06ecc23d516c1844f6022b140a81e0f2b))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.32.1

# ibm-openapi-validator [0.83.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.82.1...ibm-openapi-validator@0.83.0) (2022-07-14)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.32.0

## ibm-openapi-validator [0.82.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.82.0...ibm-openapi-validator@0.82.1) (2022-07-14)


### Bug Fixes

* **response-status-codes:** add check for 201/202 response for 'create' operation ([4c663c2](https://github.com/IBM/openapi-validator/commit/4c663c261fc97f4498ba8ee816fa36c9f7640cda))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.31.1

# ibm-openapi-validator [0.82.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.81.2...ibm-openapi-validator@0.82.0) (2022-07-14)


### Features

* **array-boundary:** new rule to enforce contraints set on arrays ([#462](https://github.com/IBM/openapi-validator/issues/462)) ([5d499d7](https://github.com/IBM/openapi-validator/commit/5d499d76e571c8eb5f2e13e01099639f624894f7))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.31.0

## ibm-openapi-validator [0.81.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.81.1...ibm-openapi-validator@0.81.2) (2022-07-08)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.30.1

## ibm-openapi-validator [0.81.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.81.0...ibm-openapi-validator@0.81.1) (2022-07-07)


### Bug Fixes

* remove update-notifier from package ([a0658ef](https://github.com/IBM/openapi-validator/commit/a0658ef7ba747ae25510fa98f517a30bbd6e016d))

# ibm-openapi-validator [0.81.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.80.0...ibm-openapi-validator@0.81.0) (2022-06-13)


### Features

* **ref-sibling-duplicate-description:** add new spectral-style rule ([#454](https://github.com/IBM/openapi-validator/issues/454)) ([1adfa60](https://github.com/IBM/openapi-validator/commit/1adfa600799689b708416fb84d2ff9045fec91ef))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.30.0

# ibm-openapi-validator [0.80.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.79.0...ibm-openapi-validator@0.80.0) (2022-06-07)


### Features

* **schema-type:** add new 'schema-type' rule (disabled by default) ([#448](https://github.com/IBM/openapi-validator/issues/448)) ([4af3e9a](https://github.com/IBM/openapi-validator/commit/4af3e9a3522862c7540e6daba8e0cf4b7ba30874))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.29.0

# ibm-openapi-validator [0.79.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.78.0...ibm-openapi-validator@0.79.0) (2022-06-03)


### Features

* **security-scheme-attributes:** add new security-scheme-attributes rule ([#450](https://github.com/IBM/openapi-validator/issues/450)) ([68aad84](https://github.com/IBM/openapi-validator/commit/68aad84a9a8334f03ab5ddcf83ed36fd6649fd56))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.28.0

# ibm-openapi-validator [0.78.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.77.1...ibm-openapi-validator@0.78.0) (2022-05-26)


### Features

* **property-attributes:** add new 'property-attributes' spectral-style rule ([#446](https://github.com/IBM/openapi-validator/issues/446)) ([dbc9980](https://github.com/IBM/openapi-validator/commit/dbc998095afe09481f547a9d7e290408529fa025))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.27.0

## ibm-openapi-validator [0.77.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.77.0...ibm-openapi-validator@0.77.1) (2022-05-24)


### Bug Fixes

* **pagination-style:** fix issues in 'pagination-style' rule ([#447](https://github.com/IBM/openapi-validator/issues/447)) ([f3b2483](https://github.com/IBM/openapi-validator/commit/f3b2483d08700ffc134e8c1afa97f749e3ad9a1f))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.26.1

# ibm-openapi-validator [0.77.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.76.2...ibm-openapi-validator@0.77.0) (2022-05-23)


### Features

* **array-items:** add new 'array-items' spectral-style rule ([#445](https://github.com/IBM/openapi-validator/issues/445)) ([defa1d6](https://github.com/IBM/openapi-validator/commit/defa1d6752c2da35d08653012fb88cf13f2e8e55))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.26.0

## ibm-openapi-validator [0.76.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.76.1...ibm-openapi-validator@0.76.2) (2022-05-13)


### Bug Fixes

* **operation-id-naming-convention:** update rule with latest guidance ([#442](https://github.com/IBM/openapi-validator/issues/442)) ([cd42eaf](https://github.com/IBM/openapi-validator/commit/cd42eafaffa6c130dbb59a11d4845f5a6aa0ffe9))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.25.2

## ibm-openapi-validator [0.76.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.76.0...ibm-openapi-validator@0.76.1) (2022-05-11)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.25.1

# ibm-openapi-validator [0.76.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.75.0...ibm-openapi-validator@0.76.0) (2022-05-02)


### Features

* **circular-refs:** add new 'circular-refs' rule ([#441](https://github.com/IBM/openapi-validator/issues/441)) ([71d3c74](https://github.com/IBM/openapi-validator/commit/71d3c744f4f4666bd35dcfa1032834f62119db51))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.25.0

# ibm-openapi-validator [0.75.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.74.0...ibm-openapi-validator@0.75.0) (2022-04-28)


### Features

* **ref-pattern:** add new 'ref-pattern' rule ([#439](https://github.com/IBM/openapi-validator/issues/439)) ([bdacf51](https://github.com/IBM/openapi-validator/commit/bdacf510941d808ee7ec4abcda2248b71d06dbdf))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.24.0

# ibm-openapi-validator [0.74.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.73.0...ibm-openapi-validator@0.74.0) (2022-04-26)


### Features

* enable spectral:oas 'no-$ref-siblings' rule ([#437](https://github.com/IBM/openapi-validator/issues/437)) ([aa93294](https://github.com/IBM/openapi-validator/commit/aa93294013379a6527ab6b9e161da18cd5d0958f))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.23.0

# ibm-openapi-validator [0.73.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.72.2...ibm-openapi-validator@0.73.0) (2022-04-26)


### Features

* **binary-schemas:** add new 'binary-schemas' rule ([#436](https://github.com/IBM/openapi-validator/issues/436)) ([9480fa0](https://github.com/IBM/openapi-validator/commit/9480fa04481f1dfbbe9c4b10d488804b2b2ba8d5))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.22.0

## ibm-openapi-validator [0.72.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.72.1...ibm-openapi-validator@0.72.2) (2022-04-25)


### Bug Fixes

* remove swagger2 legacy rules ([#435](https://github.com/IBM/openapi-validator/issues/435)) ([03c8a77](https://github.com/IBM/openapi-validator/commit/03c8a77d9bd5ccd5db1b9a0f5a931c6877dafa43))

## ibm-openapi-validator [0.72.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.72.0...ibm-openapi-validator@0.72.1) (2022-04-21)


### Bug Fixes

* fix rule deprecation support ([#434](https://github.com/IBM/openapi-validator/issues/434)) ([4958719](https://github.com/IBM/openapi-validator/commit/4958719b1ef3befd2634db1e272ba66ba467f8fa))

# ibm-openapi-validator [0.72.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.71.0...ibm-openapi-validator@0.72.0) (2022-04-21)


### Features

* **response-status-codes:** add new 'response-status-codes' rule ([#433](https://github.com/IBM/openapi-validator/issues/433)) ([1dc6cb4](https://github.com/IBM/openapi-validator/commit/1dc6cb4eeb92a75c1b37529ff4f62d3a6c567442))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.21.0

# ibm-openapi-validator [0.71.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.70.0...ibm-openapi-validator@0.71.0) (2022-04-21)


### Features

* **inline-response-schema:** add new 'inline-response-schema' rule ([#431](https://github.com/IBM/openapi-validator/issues/431)) ([7fd31c7](https://github.com/IBM/openapi-validator/commit/7fd31c78e2edd5ceeb98557939ac63ee18dd446b))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.20.0

# ibm-openapi-validator [0.70.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.69.0...ibm-openapi-validator@0.70.0) (2022-04-21)


### Features

* **path-segment-case-convention:** add new 'path-segment-case-convention' rule ([#430](https://github.com/IBM/openapi-validator/issues/430)) ([af52002](https://github.com/IBM/openapi-validator/commit/af5200268e38dfbed2ad06f0c330433d2117104a))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.19.0

# ibm-openapi-validator [0.69.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.68.0...ibm-openapi-validator@0.69.0) (2022-04-21)


### Features

* **duplicate-path-parameter:** add new 'duplicate-path-parameter' rule ([#429](https://github.com/IBM/openapi-validator/issues/429)) ([bc8bcb2](https://github.com/IBM/openapi-validator/commit/bc8bcb2fb131133e7b326c49c57cd3fdf97790d7))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.18.0

# ibm-openapi-validator [0.68.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.67.0...ibm-openapi-validator@0.68.0) (2022-04-19)


### Features

* **missing_path_parameter:** replace rule with spectral:oas rules ([#428](https://github.com/IBM/openapi-validator/issues/428)) ([4b7719f](https://github.com/IBM/openapi-validator/commit/4b7719f51489b80474e6ae4c8d5a56d139ec9f0b))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.17.0

# ibm-openapi-validator [0.67.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.66.0...ibm-openapi-validator@0.67.0) (2022-04-19)


### Features

* **parameter-order:** add new 'parameter-order' rule ([#423](https://github.com/IBM/openapi-validator/issues/423)) ([3304225](https://github.com/IBM/openapi-validator/commit/33042257cab50dda1aa602cd3c3bd8ee33749b12))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.16.0

# ibm-openapi-validator [0.66.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.65.1...ibm-openapi-validator@0.66.0) (2022-04-19)


### Features

* **array-responses:** add new 'array-responses' rule ([#422](https://github.com/IBM/openapi-validator/issues/422)) ([88cf48c](https://github.com/IBM/openapi-validator/commit/88cf48c1c9da04f49da6d82528b3c97be01ba356))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.15.0

## ibm-openapi-validator [0.65.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.65.0...ibm-openapi-validator@0.65.1) (2022-04-19)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.14.1

# ibm-openapi-validator [0.65.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.64.0...ibm-openapi-validator@0.65.0) (2022-04-14)


### Features

* **operation-id-naming-convention:** add new operation-id-naming-convention rule ([#421](https://github.com/IBM/openapi-validator/issues/421)) ([669e6d9](https://github.com/IBM/openapi-validator/commit/669e6d9e63880bed215cfd746fedb3625925d94a))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.14.0

# ibm-openapi-validator [0.64.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.63.0...ibm-openapi-validator@0.64.0) (2022-04-14)


### Features

* **operation-id-case-convention:** add new operation-id-case-convention rule ([#420](https://github.com/IBM/openapi-validator/issues/420)) ([c9e25f8](https://github.com/IBM/openapi-validator/commit/c9e25f8f629e17e2f77aaa7872a2a2a63f427b2b))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.13.0

# ibm-openapi-validator [0.63.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.62.1...ibm-openapi-validator@0.63.0) (2022-04-13)


### Features

* **request-body-name:** add new request-body-name rule ([#419](https://github.com/IBM/openapi-validator/issues/419)) ([4494537](https://github.com/IBM/openapi-validator/commit/44945375d208dca023161610a260e9b6d668320a))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.12.0

## ibm-openapi-validator [0.62.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.62.0...ibm-openapi-validator@0.62.1) (2022-04-13)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.11.1

# ibm-openapi-validator [0.62.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.61.0...ibm-openapi-validator@0.62.0) (2022-04-12)


### Features

* **unused-tag:** add unused-tag rule ([#418](https://github.com/IBM/openapi-validator/issues/418)) ([a065b61](https://github.com/IBM/openapi-validator/commit/a065b61e9300a169bb64c5747d66ff34ac88d41a))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.11.0

# ibm-openapi-validator [0.61.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.60.0...ibm-openapi-validator@0.61.0) (2022-04-11)


### Features

* **operation-summary:** add new 'operation-summary' rule ([#416](https://github.com/IBM/openapi-validator/issues/416)) ([f0e0908](https://github.com/IBM/openapi-validator/commit/f0e09086542d9c66608dcbca22d7a95d04a93c0c))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.10.0

# ibm-openapi-validator [0.60.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.59.0...ibm-openapi-validator@0.60.0) (2022-04-08)


### Features

* **security-schemes:** add new 'security-schemes' rule ([#415](https://github.com/IBM/openapi-validator/issues/415)) ([15a2332](https://github.com/IBM/openapi-validator/commit/15a2332fc8751a0f8f0f011069b1ccf134443fa1))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.9.0

# ibm-openapi-validator [0.59.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.58.2...ibm-openapi-validator@0.59.0) (2022-04-07)


### Features

* add new `property-inconsistent-name-and-type` rule and remove old rule ([#408](https://github.com/IBM/openapi-validator/issues/408)) ([a3462e0](https://github.com/IBM/openapi-validator/commit/a3462e006318e4b925059ec20b4f7b674f3365d8))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.8.0

## ibm-openapi-validator [0.58.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.58.1...ibm-openapi-validator@0.58.2) (2022-03-25)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.7.2

## ibm-openapi-validator [0.58.1](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.58.0...ibm-openapi-validator@0.58.1) (2022-03-15)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.7.1

# ibm-openapi-validator [0.58.0](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.57.4...ibm-openapi-validator@0.58.0) (2022-03-10)


### Features

* add new header-related rules and remove old rules ([444924a](https://github.com/IBM/openapi-validator/commit/444924a94e21093fc1721888a8a381ea3061bff7))
* **enum-case-convention:** add new enum-case-convention spectral rule, remove old rule ([ac286ff](https://github.com/IBM/openapi-validator/commit/ac286ff4b4d4828fcf08480ce0f3a93989c88371))
* **pagination-style:** add new 'pagination-style' rule and remove old rule ([3ad7a35](https://github.com/IBM/openapi-validator/commit/3ad7a3531bee3ec779d6cd8b4daeb6742ff42e1f))
* **parameter-case-convention:** add new 'parameter-case-convention' rule and remove old rule ([5eed197](https://github.com/IBM/openapi-validator/commit/5eed197e7653e3822c6864ce523fb99a2215eaf1))
* **parameter-default:** add new 'parameter-default' rule and remove old rule ([ae95925](https://github.com/IBM/openapi-validator/commit/ae95925fa99d3367eba3dc9b454a6aeb60faa861))
* **parameter-description:** add new 'parameter-description' rule and remove old rule ([#387](https://github.com/IBM/openapi-validator/issues/387)) ([ee51ef6](https://github.com/IBM/openapi-validator/commit/ee51ef6a5312601dc6cf4d45b7693655f62d475f))
* **property-description:** add new 'property-description' rule ([#392](https://github.com/IBM/openapi-validator/issues/392)) ([21f8536](https://github.com/IBM/openapi-validator/commit/21f853612ac02c4fe4e645f64c55301df3eb16b8))





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.7.0

## ibm-openapi-validator [0.57.4](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.57.3...ibm-openapi-validator@0.57.4) (2022-02-24)


### Bug Fixes

* add debug option to programmatic validator api ([b64a666](https://github.com/IBM/openapi-validator/commit/b64a666ad570fd6e50ddec8e06a1582f39eea9ad))

## ibm-openapi-validator [0.57.3](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.57.2...ibm-openapi-validator@0.57.3) (2022-02-24)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.6.2

## ibm-openapi-validator [0.57.2](https://github.com/IBM/openapi-validator/compare/ibm-openapi-validator@0.57.1...ibm-openapi-validator@0.57.2) (2022-02-23)





### Dependencies

* **@ibm-cloud/openapi-ruleset:** upgraded to 0.6.1

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
