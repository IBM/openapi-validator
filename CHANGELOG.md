## [0.51.3](https://github.com/IBM/openapi-validator/compare/v0.51.2...v0.51.3) (2021-10-11)


### Bug Fixes

* remove npm_force_resolutions from pre-install step to fix user package install ([#337](https://github.com/IBM/openapi-validator/issues/337)) ([0a02977](https://github.com/IBM/openapi-validator/commit/0a02977760716fc42afa5eb6e5bf09be2e7835de))

## [0.51.2](https://github.com/IBM/openapi-validator/compare/v0.51.1...v0.51.2) (2021-10-08)


### Bug Fixes

* pac-resolver force dependency to 5.0.0 ([#335](https://github.com/IBM/openapi-validator/issues/335)) ([03154e3](https://github.com/IBM/openapi-validator/commit/03154e341eafb0b56199131ccb3359367a01359e))

## [0.51.1](https://github.com/IBM/openapi-validator/compare/v0.51.0...v0.51.1) (2021-10-01)


### Bug Fixes

* false positive when minLength, maxLength are 0 ([#334](https://github.com/IBM/openapi-validator/issues/334)) ([e8c5220](https://github.com/IBM/openapi-validator/commit/e8c5220aa51e6779216db53cdba2616d5b9f7c52))

# [0.51.0](https://github.com/IBM/openapi-validator/compare/v0.50.1...v0.51.0) (2021-09-30)


### Features

* add configFileOverride to in-code validator ([#331](https://github.com/IBM/openapi-validator/issues/331)) ([9a259d1](https://github.com/IBM/openapi-validator/commit/9a259d19486aec0e370c9ac8a4bc87894a3c483d))

## [0.50.1](https://github.com/IBM/openapi-validator/compare/v0.50.0...v0.50.1) (2021-09-29)


### Bug Fixes

* handle multi-file spec circular reference edge case ([#333](https://github.com/IBM/openapi-validator/issues/333)) ([172c027](https://github.com/IBM/openapi-validator/commit/172c027f32a8831b6100c4e7fac9ef38de2c940c))

# [0.50.0](https://github.com/IBM/openapi-validator/compare/v0.49.0...v0.50.0) (2021-09-29)


### Features

* examples' name should not contain space ([#332](https://github.com/IBM/openapi-validator/issues/332)) ([053d9da](https://github.com/IBM/openapi-validator/commit/053d9da387624e56006197354be2fcc82ae3ef70))

# [0.49.0](https://github.com/IBM/openapi-validator/compare/v0.48.0...v0.49.0) (2021-09-27)


### Features

* prohibit sentence style summaries ([20bf923](https://github.com/IBM/openapi-validator/commit/20bf9237ef87e66e9141ccc61e6dbffd1515c38e))

# [0.48.0](https://github.com/IBM/openapi-validator/compare/v0.47.1...v0.48.0) (2021-09-16)


### Features

* server variables must have default value ([#322](https://github.com/IBM/openapi-validator/issues/322)) ([483f4bf](https://github.com/IBM/openapi-validator/commit/483f4bf122f7f4222735c4ce74d3502b0bfce363))

## [0.47.1](https://github.com/IBM/openapi-validator/compare/v0.47.0...v0.47.1) (2021-09-13)


### Bug Fixes

* add 101 and 202 responses as exceptions for `content-entry-provided` rule ([#320](https://github.com/IBM/openapi-validator/issues/320)) ([cdb0e47](https://github.com/IBM/openapi-validator/commit/cdb0e47d29f1bcdd8400b928b05de349882e453a))

# [0.47.0](https://github.com/IBM/openapi-validator/compare/v0.46.4...v0.47.0) (2021-09-03)


### Features

* check for missing required properties ([#314](https://github.com/IBM/openapi-validator/issues/314)) ([c6ebc28](https://github.com/IBM/openapi-validator/commit/c6ebc282447e6a1419b5af0baf977458d0641277))
* string schema should define enum or pattern, minLength, maxLength ([#315](https://github.com/IBM/openapi-validator/issues/315)) ([27b7c7d](https://github.com/IBM/openapi-validator/commit/27b7c7dd733bcca84b55bc3b0f825499ad9961e8))

## [0.46.4](https://github.com/IBM/openapi-validator/compare/v0.46.3...v0.46.4) (2021-07-26)


### Bug Fixes

* enable disabling of `operation_id_case_convention` ([#313](https://github.com/IBM/openapi-validator/issues/313)) ([5ffb9fb](https://github.com/IBM/openapi-validator/commit/5ffb9fb847d48c5fab1b93b0e01b0be73cee0d7d))

## [0.46.3](https://github.com/IBM/openapi-validator/compare/v0.46.2...v0.46.3) (2021-07-23)


### Bug Fixes

* vulnerability fix updating package ([#309](https://github.com/IBM/openapi-validator/issues/309)) ([2418feb](https://github.com/IBM/openapi-validator/commit/2418febf54ac8b9d3f296a9262eaefca0bf332ed))

## [0.46.2](https://github.com/IBM/openapi-validator/compare/v0.46.1...v0.46.2) (2021-07-14)


### Bug Fixes

* don't crash when parameter is missing required "in" property ([#308](https://github.com/IBM/openapi-validator/issues/308)) ([8bf7df5](https://github.com/IBM/openapi-validator/commit/8bf7df55464f5df5c62badadbacec3be99576659))

## [0.46.1](https://github.com/IBM/openapi-validator/compare/v0.46.0...v0.46.1) (2021-06-16)


### Bug Fixes

* allow null values inside enum property ([#306](https://github.com/IBM/openapi-validator/issues/306)) ([cbe6269](https://github.com/IBM/openapi-validator/commit/cbe62694dc6a64186de6bf3d22a1b95ca7590cb9))

# [0.46.0](https://github.com/IBM/openapi-validator/compare/v0.45.0...v0.46.0) (2021-05-05)


### Features

* validate `x-sdk-operations` extension ([#290](https://github.com/IBM/openapi-validator/issues/290)) ([019c06f](https://github.com/IBM/openapi-validator/commit/019c06ffc6975962de6d851e59a6df1840d25128))

# [0.45.0](https://github.com/IBM/openapi-validator/compare/v0.44.0...v0.45.0) (2021-05-04)


### Features

* error for non-object request bodies ([#288](https://github.com/IBM/openapi-validator/issues/288)) ([ba00a8d](https://github.com/IBM/openapi-validator/commit/ba00a8dfffb202e131bb51ecb95b7eabfc77cc96))

# [0.44.0](https://github.com/IBM/openapi-validator/compare/v0.43.1...v0.44.0) (2021-04-28)


### Features

* warn for */* content types ([733b534](https://github.com/IBM/openapi-validator/commit/733b534b9d716508f070d36bab055cf3020e5869))
* warn when error response content type is not application/json ([82f6398](https://github.com/IBM/openapi-validator/commit/82f63983a8c75ccbe0c57b0dad999fe826eccabf))

## [0.43.1](https://github.com/IBM/openapi-validator/compare/v0.43.0...v0.43.1) (2021-04-28)


### Bug Fixes

* false positive when `limit` and `offset` properties included in `allOf` ([#284](https://github.com/IBM/openapi-validator/issues/284)) ([33f8a1c](https://github.com/IBM/openapi-validator/commit/33f8a1c4fc71d1ab90848060c17c03f7330ae1ed))

# [0.43.0](https://github.com/IBM/openapi-validator/compare/v0.42.0...v0.43.0) (2021-04-21)


### Features

* error for parameter without schema or content ([8b6e8bd](https://github.com/IBM/openapi-validator/commit/8b6e8bd7bb36aa70b97abc645db4178a0b9ecd42))

# [0.42.0](https://github.com/IBM/openapi-validator/compare/v0.41.0...v0.42.0) (2021-04-14)


### Features

* add rule to check for consistent major version in path ([b6c8e65](https://github.com/IBM/openapi-validator/commit/b6c8e652c301267250c4ad152e7ff71f7ce5920f))

# [0.41.0](https://github.com/IBM/openapi-validator/compare/v0.40.3...v0.41.0) (2021-04-14)


### Features

* show path to component that caused error in verbose mode ([#272](https://github.com/IBM/openapi-validator/issues/272)) ([3c1c458](https://github.com/IBM/openapi-validator/commit/3c1c458726f60fdb15828fdc1b99906ef53aa020))

## [0.40.3](https://github.com/IBM/openapi-validator/compare/v0.40.2...v0.40.3) (2021-04-14)


### Bug Fixes

* soften the response-example-provided rule to look only at success responses ([#273](https://github.com/IBM/openapi-validator/issues/273)) ([b5dac3e](https://github.com/IBM/openapi-validator/commit/b5dac3e206eef9c44412a005b03a3de7a7405144))

## [0.40.2](https://github.com/IBM/openapi-validator/compare/v0.40.1...v0.40.2) (2021-04-14)


### Bug Fixes

* cannot find ajv module when ibm:oas ruleset extended ([#279](https://github.com/IBM/openapi-validator/issues/279)) ([fd2cb29](https://github.com/IBM/openapi-validator/commit/fd2cb29fb691308fdea314a97b20444ad6411976))

## [0.40.1](https://github.com/IBM/openapi-validator/compare/v0.40.0...v0.40.1) (2021-04-07)


### Bug Fixes

* set the exit code for json output ([#269](https://github.com/IBM/openapi-validator/issues/269)) ([b6e9899](https://github.com/IBM/openapi-validator/commit/b6e98990835876b87a51d5076554d736fe7ccfa2))

# [0.40.0](https://github.com/IBM/openapi-validator/compare/v0.39.0...v0.40.0) (2021-04-06)


### Features

* validate x-sdk-operations extension ([#268](https://github.com/IBM/openapi-validator/issues/268)) ([b025eac](https://github.com/IBM/openapi-validator/commit/b025eac8802e6691a470e167ac14fd65d40a8b91))

# [0.39.0](https://github.com/IBM/openapi-validator/compare/v0.38.0...v0.39.0) (2021-03-26)


### Features

* remove error for partial path templating ([#262](https://github.com/IBM/openapi-validator/issues/262)) ([2838875](https://github.com/IBM/openapi-validator/commit/2838875151857d94a1c98a4509b2ca5eaed19ea0))

# [0.38.0](https://github.com/IBM/openapi-validator/compare/v0.37.1...v0.38.0) (2021-03-19)


### Features

* warn for missing response examples ([#265](https://github.com/IBM/openapi-validator/issues/265)) ([0f10376](https://github.com/IBM/openapi-validator/commit/0f103760dc316d172c77ab3300513ccbd7cc16fe))

## [0.37.1](https://github.com/IBM/openapi-validator/compare/v0.37.0...v0.37.1) (2021-03-16)


### Bug Fixes

* correct the minimum required version of Node ([#264](https://github.com/IBM/openapi-validator/issues/264)) ([8b3bad4](https://github.com/IBM/openapi-validator/commit/8b3bad46d25d39b22b5feca8628d74b951825af0))

# [0.37.0](https://github.com/IBM/openapi-validator/compare/v0.36.0...v0.37.0) (2021-03-16)


### Features

* custom Spectral rule to ensure content objects contain schema ([#258](https://github.com/IBM/openapi-validator/issues/258)) ([bb9e419](https://github.com/IBM/openapi-validator/commit/bb9e419e347a407b9a8126ff28ddad80b4923e80))

# [0.36.0](https://github.com/IBM/openapi-validator/compare/v0.35.2...v0.36.0) (2021-03-12)


### Features

* synchronize the inCodeValidator output to match the CLI -json output ([#260](https://github.com/IBM/openapi-validator/issues/260)) ([e61f803](https://github.com/IBM/openapi-validator/commit/e61f8032dbe1299eec1612d3e15f8650fadf3ecf))

## [0.35.2](https://github.com/IBM/openapi-validator/compare/v0.35.1...v0.35.2) (2021-03-09)


### Bug Fixes

* bundle original spec to account for multi-file API definitions ([#252](https://github.com/IBM/openapi-validator/issues/252)) ([f241c8b](https://github.com/IBM/openapi-validator/commit/f241c8b5275a36e01c8f88090f99c57105bb72a3))

## [0.35.1](https://github.com/IBM/openapi-validator/compare/v0.35.0...v0.35.1) (2021-03-08)


### Bug Fixes

* no error for inline array schema when items field is a ref ([#257](https://github.com/IBM/openapi-validator/issues/257)) ([4dd3708](https://github.com/IBM/openapi-validator/commit/4dd370802110acb5dee6de78f02d0f9adc812980))

# [0.35.0](https://github.com/IBM/openapi-validator/compare/v0.34.4...v0.35.0) (2021-03-05)


### Features

* include the validator version in the JSON output ([#256](https://github.com/IBM/openapi-validator/issues/256)) ([6442a0b](https://github.com/IBM/openapi-validator/commit/6442a0b4f126891510713b1a5d48455af2af2ed4))

## [0.34.4](https://github.com/IBM/openapi-validator/compare/v0.34.3...v0.34.4) (2021-03-01)


### Bug Fixes

* properly handle circular regressions to prevent call stack exceptions ([#253](https://github.com/IBM/openapi-validator/issues/253)) ([3696487](https://github.com/IBM/openapi-validator/commit/3696487e2e6bf4b61d527aeeff3bb659d0ff032e))

## [0.34.3](https://github.com/IBM/openapi-validator/compare/v0.34.2...v0.34.3) (2021-02-22)


### Bug Fixes

* fix object type validations ([#242](https://github.com/IBM/openapi-validator/issues/242)) ([c08c5c7](https://github.com/IBM/openapi-validator/commit/c08c5c74257e1d5040424352e456a7478d6771b4))

## [0.34.2](https://github.com/IBM/openapi-validator/compare/v0.34.1...v0.34.2) (2021-02-18)


### Bug Fixes

* add validation for use of 101 status code ([#237](https://github.com/IBM/openapi-validator/issues/237)) ([52e1319](https://github.com/IBM/openapi-validator/commit/52e13198cd5d01e407c0732c0f8a25453e647c5d))
* run travis deploy step on main branch ([#239](https://github.com/IBM/openapi-validator/issues/239)) ([6b5abbb](https://github.com/IBM/openapi-validator/commit/6b5abbb9e1a7ec387ed4ad33d9ad9c3384577788))
* update releaserc to use main branch ([#238](https://github.com/IBM/openapi-validator/issues/238)) ([4b1569b](https://github.com/IBM/openapi-validator/commit/4b1569b10946151e9c42ac2ec2701d7bd44939a3))
* update semantic-release dependencies ([#240](https://github.com/IBM/openapi-validator/issues/240)) ([6edf60c](https://github.com/IBM/openapi-validator/commit/6edf60c6d2754fd97db5d6bbf11de368090ba8bd))

## [0.34.1](https://github.com/IBM/openapi-validator/compare/v0.34.0...v0.34.1) (2021-01-27)


### Bug Fixes

* allow rules with flexible second options ([2b1d876](https://github.com/IBM/openapi-validator/commit/2b1d876f2e46d54471f75fe9fa31b58ce48665f7))

# [0.34.0](https://github.com/IBM/openapi-validator/compare/v0.33.2...v0.34.0) (2021-01-26)


### Features

* exclude common inconsistent property names ([#230](https://github.com/IBM/openapi-validator/issues/230)) ([d1b9909](https://github.com/IBM/openapi-validator/commit/d1b9909c3c99ddf7dd687b2ddd8f1f8f944f0347))

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
