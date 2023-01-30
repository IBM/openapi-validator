[![Build Status](https://travis-ci.com/IBM/openapi-validator.svg?branch=main)](https://travis-ci.com/IBM/openapi-validator)
[![npm-version](https://img.shields.io/npm/v/ibm-openapi-validator.svg)](https://www.npmjs.com/package/ibm-openapi-validator)
[![codecov](https://codecov.io/gh/ibm/openapi-validator/branch/main/graph/badge.svg)](https://codecov.io/gh/ibm/openapi-validator)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Gitter](https://badges.gitter.im/openapi-validator/community.svg)](https://gitter.im/openapi-validator/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![CLA assistant](https://cla-assistant.io/readme/badge/ibm/openapi-validator)](https://cla-assistant.io/ibm/openapi-validator)


# OpenAPI Validator
This command line tool lets you validate OpenAPI documents according to their specification, either [2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) or [3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md),
as well as IBM-defined best practices.

#### Prerequisites
- Node 14.x
- NPM 7.x

## Table of contents

<!--
  The TOC below is generated using the `markdown-toc` node package.

      https://github.com/jonschlinkert/markdown-toc

  You should regenerate the TOC after making changes to this file.

      markdown-toc --maxdepth 4 -i README.md
  -->

<!-- toc -->

- [Getting Started](#getting-started)
  * [Customization](#customization)
- [Installation](#installation)
  * [Install with NPM (recommended)](#install-with-npm-recommended)
  * [Download an executable binary](#download-an-executable-binary)
  * [Build from source](#build-from-source)
    + [Build platform-specific binaries](#build-platform-specific-binaries)
  * [Docker container](#docker-container)
- [Usage](#usage)
  * [Command line](#command-line)
  * [Node module](#node-module)
    + [API](#api)
    + [Validation results](#validation-results)
- [Configuration](#configuration)
  * [IBM Cloud Validation Ruleset](#ibm-cloud-validation-ruleset)
- [Warnings Limit](#warnings-limit)
- [License](#license)

<!-- tocstop -->

## Getting Started
The validator analyzes your API definition and reports any problems within. The validator is highly customizable, and supports both OpenAPI 3.0 and OpenAPI 2.0 (Swagger 2.0) formats. The tool also supports a number of rules from [Spectral](https://stoplight.io/open-source/spectral/). You can easily extend the tool with custom rules to meet your specific needs and ensure compliance to your standards.

Get started by [installing the tool](#installation), then [run the tool](#usage) on your API definition.

### Customization

You can modify the behavior of the validator for your project to meet your preferred standards. See the [customization documentation](docs/ibm-cloud-rules.md#customization) for more information.

## Installation
There are three ways to install the validator: using NPM, downloading a platform-specific binary, or building from source.

### Install with NPM (recommended)

`npm install -g ibm-openapi-validator`

The `-g` flag installs the tool globally so that the validator can be run from anywhere in the file system. Alternatively, you can pass no flag or the `--save-dev` flag to add the validator as a dependency to your project and run it from your NPM scripts or JavaScript code.

### Download an executable binary

Platform-specific binary files are packaged with each release for MacOS, Linux, and Windows. See [the releases](https://github.com/IBM/openapi-validator/releases) page to download the executable for your platform. These do not depend on Node.JS being installed.

### Build from source
1. Clone or download this repository
2. Navigate to the root directory of this project.
3. Install the dependencies using `npm install`
4. Build the command line tool by running `npm run link`.

_If you installed the validator using `npm install -g ibm-openapi-validator`, you will need to run `npm uninstall -g ibm-openapi-validator` before running `npm run link`._

#### Build platform-specific binaries
It is also possible to build platform specific binaries from the source code by running `npm run pkg` in the project root directory.  The binaries (lint-openapi-macos, lint-openapi-linux, lint-openapi-windows.exe) will be in the project's `packages/validator/bin` directory.

### Docker container
A community Docker image is [publicly available on Docker hub](https://hub.docker.com/r/jamescooke/openapi-validator).

`docker pull jamescooke/openapi-validator`

Once pulled, the container can be run directly, but mount a volume containing the OpenAPI specification file so that it can be accessed.

`docker run --volume "$PWD":/data jamescooke/openapi-validator [options] [command] [<files>]`

## Usage
### Command line
`lint-openapi [options] [<files>]`

##### [options]
-  -d (--default_mode) : This option turns off [configuration](#configuration) and runs the validator in [default mode](#default-mode).
-  -e (--errors_only) : Only print the errors, ignore the warnings.
-  -j (--json) : Output results as a JSON object
-  -l (--loglevel) `<loggername>=<loglevel> ...` : Set loglevel of logger named `<loggername>` to `<loglevel>` (e.g. `-l root=info -l ibm-schema-description=debug`)
-  -n (--no_colors) : The output is colored by default. If this bothers you, this flag will turn off the coloring.
-  -p (--print_validator_modules) : Print the name of the validator source file the error/warning was caught it. This can be helpful for developing validations.
-  -v (--verbose) : Increase verbosity of reported results.  Use this option to display the rule for each reported result.
-  -r (--ruleset) `<path/to/your/ruleset>` : Path to Spectral ruleset file, used instead of .spectral.yaml if provided.
-  -s (--report_statistics) : Print a simple report at the end of the output showing the frequency, in percentage, of each error/warning.
-  --debug : Enable debugging output.
-  --version : Print the current semantic version of the validator
-  -h (--help) : This option prints the usage menu.

_These options only apply to running the validator on a file, not to any commands._

##### \<files>
- The OpenAPI document(s) to be validated. All files must be a valid JSON or YAML (only .json, .yml, and .yaml file extensions are supported).
- Multiple, space-separated files can be passed in and each will be validated. This includes support for globs (e.g. `lint-openapi files/*` will run the validator on all files in `files/`)

### Node module
```javascript
const validator = require('ibm-openapi-validator');

validator(openApiDoc)
  .then(validationResults => {
    console.log(JSON.stringify(validationResults, null, 2));
  });

// or, if inside `async` function
const validationResults = await validator(openApiDoc);
console.log(JSON.stringify(validationResults, null, 2));
```

#### API
##### validator(openApiDoc, [defaultMode = false])
Returns a `Promise` with the validation results.

###### openApiDoc
Type: `Object`
An object that represents an OpenAPI document.

###### defaultMode
Type: `boolean`
Default: `false`
If set to true, the validator will ignore the `.validaterc` file and will use the [configuration defaults](#default-values).

###### debug
Type: `boolean`
Default: `false`
If set to true, the validator will log additional debug information during execution.

#### Validation results
The Promise returned from the validator resolves into a JSON object. The structure of the object is:
```
{
  errors:
  [
    {
      path: 'path.to.error.in.object'
      message: 'Major problem in the OpenAPI document.'
    }
  ],
  warnings:
  [
    {
      path: 'path.to.warning.in.object'
      message: 'Minor problem in the OpenAPI document.'
    }
  ]
}
```
The object will always have `errors` and `warnings` keys that map to arrays. If an array is empty, that means there were no errors/warnings in the OpenAPI document.

## Configuration
Within the openapi-validator project, we have transitioned our legacy rules
to the new IBM Cloud Validation Ruleset (npm package `@ibm-cloud/openapi-ruleset`).

### IBM Cloud Validation Ruleset
For information on how to configure and use the IBM Cloud Validation Ruleset, [click here](docs/ibm-cloud-rules.md).

## Warnings Limit

You may impose a warning limit on your API definitions. If the number of warnings issued exceeds the warning limit, the **exit code will be set to 1**. If the Validator is part of your CI build, this will cause the build to fail.

To impose a warnings limit on a project, add a `.thresholdrc` to your project. It is recommended to add this file to the root of the project. The validator recursively searches up the filesystem from whichever directory the validator is invoked, and the nearest `.thresholdrc` will be used.

The format for the `.thresholdrc` file is a top-level JSON object with a `"warnings"` field (shown below).

    {
      "warnings": 0
    }

###### limits
| Limit                   | Default   |
| ----------------------- | --------- |
| warnings                | MAX_VALUE |

## License

Copyright 2017 SmartBear Software

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
