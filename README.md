[![Build Status](https://travis-ci.com/IBM/openapi-validator.svg?branch=main)](https://travis-ci.com/IBM/openapi-validator)
[![npm-version](https://img.shields.io/npm/v/ibm-openapi-validator.svg)](https://www.npmjs.com/package/ibm-openapi-validator)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Gitter](https://badges.gitter.im/openapi-validator/community.svg)](https://gitter.im/openapi-validator/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![CLA assistant](https://cla-assistant.io/readme/badge/ibm/openapi-validator)](https://cla-assistant.io/ibm/openapi-validator)

# OpenAPI Validator
The IBM OpenAPI Validator lets you validate [OpenAPI 3.0.x](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md)
and [OpenAPI 3.1.x](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md) documents for compliance with the OpenAPI specifications, as well as IBM-defined best practices.

#### Prerequisites
- Node 16.0.0+
- NPM 8.3.0+

## Table of contents

<!--
  The TOC below is generated using the `markdown-toc` node package.

      https://github.com/jonschlinkert/markdown-toc

  You should regenerate the TOC after making changes to this file.

      npm run format-readme-toc
  -->

<!-- toc -->

- [Getting Started](#getting-started)
  * [Ruleset](#ruleset)
  * [Customization](#customization)
- [Installation](#installation)
  * [Install with NPM (recommended)](#install-with-npm-recommended)
  * [Download an executable binary](#download-an-executable-binary)
  * [Build from source](#build-from-source)
    + [Build platform-specific binaries](#build-platform-specific-binaries)
- [Usage](#usage)
  * [Command Syntax](#command-syntax)
  * [Configuration](#configuration)
    + [Configuration Properties](#configuration-properties)
      - [colorizeOutput](#colorizeoutput)
      - [errorsOnly](#errorsonly)
      - [files](#files)
      - [ignoreFiles](#ignorefiles)
      - [limits](#limits)
      - [logLevels](#loglevels)
      - [outputFormat](#outputformat)
      - [ruleset](#ruleset)
      - [summaryOnly](#summaryonly)
- [Validator Output](#validator-output)
  * [Text](#text)
  * [JSON](#json)
- [Logging](#logging)
- [Contributing](#contributing)
- [License](#license)

<!-- tocstop -->

## Getting Started
The validator analyzes your API definition and reports any problems within. The validator is highly customizable,
and supports OpenAPI 3.0.x and 3.1.x documents.
The tool also supports a number of rules from [Spectral](https://stoplight.io/open-source/spectral/). You can easily extend the tool with custom rules to meet your specific needs and ensure compliance to your standards.

Get started by [installing the tool](#installation), then [run the tool](#usage) on your API definition.

### Ruleset
By default, the validator will use the [IBM Cloud Validation Ruleset](docs/ibm-cloud-rules.md) (npm package `@ibm-cloud/openapi-ruleset`).
However, if the validator detects the presence of any of the standard Spectral ruleset files (`spectral.yaml`, `spectral.yml`, `spectral.json`,
or `spectral.js`) in the current directory (from which the validator is being run) or in any containing directory within the file system,
then that ruleset file will be used instead.
To explicitly specify an alternate ruleset, you can use the `-r`/`--ruleset` option (or the `ruleset` configuration property)
to specify the name of your custom ruleset file.

If one of the standard Spectral ruleset files are present and you'd like to force the use of the IBM Cloud Validation Ruleset instead,
you can use `-r default` or `--ruleset default` (or set the `ruleset` configuration property to the value `'default'`).

Details about these options are provided below in the [Usage](#usage) section.

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

## Usage
### Command Syntax
```bash
Usage: lint-openapi [options] [file...]

Run the validator on one or more OpenAPI 3.x documents

Options:
  -c, --config <file>            use configuration stored in <file> (*.json, *.yaml, *.js)
  -e, --errors-only              include only errors in the output and skip warnings (default is false)
  -i, --ignore <file>            avoid validating <file> (e.g. -i /dir1/ignore-file1.json --ignore /dir2/ignore-file2.yaml ...) (default is []) (default: [])
  -j, --json                     produce JSON output (default is text)
  -l, --log-level <loglevel>     set the log level for one or more loggers (e.g. -l root=info -l ibm-schema-description-exists=debug ...)  (default: [])
  -n, --no-colors                disable colorizing of the output (default is false)
  -r, --ruleset <file>           use Spectral ruleset contained in `<file>` ("default" forces use of default IBM Cloud Validation Ruleset)
  -s, --summary-only             include only the summary information and skip individual errors and warnings (default is false)
  -w, --warnings-limit <number>  set warnings limit to <number> (default is -1)
  --version                      output the version number
  -h, --help                     display help for command
```
where `[file...]` is a space-separated list containing the filenames of one or more OpenAPI 3.x documents to be validated.
The validator supports OpenAPI documents in either JSON or YAML format, using these supported file extensions:
```
.json
.yaml
.yml
```
Assuming your command shell supports the use of wildcards, you can use wildcards when specifying the names of files to be validated.
For example, to run the validator on all `.yaml` files contained in the `/my/apis` directory, you could use
this command:
```bash
lint-openapi /my/apis/*.yaml
```

Note that the `-i`/`--ignore` option can be particularly useful when using wildcards because it allows you to skip the
validation of specific files which might otherwise be included in a validation run.
For example, to validate all `.yaml` files in the `/my/apis` directory, except for `/my/apis/broken-api.yaml` use the command:
```bash
lint-openapi /my/apis/*.yaml -i /my/apis/broken-api.yaml
```

### Configuration
In addition to command-line options, the validator supports the use of a configuration file containing options as well.
A configuration file can be in JSON, YAML or Javascript format, using these supported extensions: `.json`, `.yaml`, `.yml`, and `.js`.
Its structure must comply with [this JSON schema](packages/validator/src/schemas/config-file.yaml).

You can specify the name of your configuration file with the `-c`/`--config` option.  Here's an example:
```bash
lint-openapi -c my-config.yaml my-api.json
```
where `my-config.yaml` might contain the following:
```yaml
errorsOnly: true
limits:
  warnings: 25
outputFormat: 'json'
summaryOnly: true
```
This would be equivalent to this command:
```bash
lint-openapi --errors-only --warnings-limit=25 --json --summary-only my-api.json
```
When using both a configuration file and various command-line options, be aware that the options specified
via the command-line will take precendence and override any corresponding properties specified in the configuration file.

#### Configuration Properties
This section provides information about each of the properties that are supported within a configuration file.

##### colorizeOutput
<table border=1>
<tr>
<td><b>Description</b></td>
<td width=25%><b>Default</b></td>
</tr>
<tr>
<td>The <code>colorizeOutput</code> configuration property corresponds to the <code>-n</code>/<code>--no-colors</code>
command-line option. If set to true, then the validator will colorize its output.</td>
<td><code>true</code></td>
</tr>
</table>
<b>Examples:</b>
<table border=1>
<tr>
</tr>
<tr>
<td><code>.yaml/.yml</code></td>
<td><code>.json</code></td>
<td><code>.js</code></td>
</tr>
<tr>
<td>
<pre>
colorizeOutput: false
</pre>
</td>
<td>
<pre>
{
  "colorizeOutput": false
}
</pre>
</td>
<td>
<pre>
module.exports = {
  colorizeOutput: false
};
</pre>
</td>
</tr>
</table>

##### errorsOnly
<table border=1>
<tr>
<td><b>Description</b></td>
<td width=25%><b>Default</b></td>
</tr>
<tr>
<td>The <code>errorsOnly</code> configuration property corresponds to the <code>-e</code>/<code>--errors-only</code> command-line option.
If set to <code>true</code>, the validator will include only errors in its output, while messages of severity warning,
info or hint will be skipped.</td>
<td><code>false</code></td>
</tr>
</table>
<b>Examples:</b>
<table border=1>
<tr>
</tr>
<tr>
<td><code>.yaml/.yml</code></td>
<td><code>.json</code></td>
<td><code>.js</code></td>
</tr>
<tr>
<td>
<pre>
errorsOnly: true
</pre>
</td>
<td>
<pre>
{
  "errorsOnly": true
}
</pre>
</td>
<td>
<pre>
module.exports = {
  errorsOnly: true
};
</pre>
</td>
</tr>
</table>

##### files
<table border=1>
<tr>
<td><b>Description</b></td>
<td width=25%><b>Default</b></td>
</tr>
<tr>
<td>The <code>files</code> configuration property corresponds to positional command-line arguments (i.e. <code>[file...]</code>).
You can set this property to the names of the OpenAPI documents to be validated. If any filenames are also entered as positional arguments
on the command-line, they will override any values specified in this configuration property.</td>
<td><code>[]</code>(empty list)</td>
</tr>
</table>
<b>Examples:</b>
<table border=1>
<tr>
</tr>
<tr>
<td><code>.yaml/.yml</code></td>
<td><code>.json</code></td>
<td><code>.js</code></td>
</tr>
<tr>
<td>
<pre>
files:
  - file1.json
  - file2.yaml
</pre>
</td>
<td>
<pre>
{
  "files": [
    "file1.json",
    "file2.yaml"
  ]
}
</pre>
</td>
<td>
<pre>
module.exports = {
  files: [
    'file1.json',
    'file2.yaml'
  ]
};
</pre>
</td>
</tr>
</table>

##### ignoreFiles
<table border=1>
<tr>
<td><b>Description</b></td>
<td width=25%><b>Default</b></td>
</tr>
<tr>
<td>The <code>ignoreFiles</code> configuration property corresponds to the <code>-i</code>/<code>--ignore</code> command-line option.
Set this property to the fully-qualified filenames of OpenAPI documents to be excluded from validation.
This property can be particularly useful when using wildcards for specifying the OpenAPI documents to be validated,
because it allows you to skip the validation of specific files which might otherwise be included in a validation run.
For example, to validate all <code>.yaml</code> files in the <code>/my/apis</code> directory, except for
<code>/my/apis/broken-api.yaml</code> use the command:
<pre>
    lint-openapi /my/apis/*.yaml --ignore /my/apis/broken-api.yaml
</pre>
</td>
<td><code>[]</code>(empty list)</td>
</tr>
</table>
<b>Examples:</b>
<table border=1>
<tr>
</tr>
<tr>
<td><code>.yaml/.yml</code></td>
<td><code>.json</code></td>
<td><code>.js</code></td>
</tr>
<tr>
<td>
<pre>
ignoreFiles:
  - /my/apis/file1.yml
</pre>
</td>
<td>
<pre>
{
  "ignoreFiles": [
    "/my/apis/file1.yml"
  ]
}
</pre>
</td>
<td>
<pre>
module.exports = {
  ignoreFiles: [
    '/my/apis/file1.yml'
  ]
};
</pre>
</td>
</tr>
</table>

##### limits
<table border=1>
<tr>
<td><b>Description</b></td>
<td width=25%><b>Default</b></td>
</tr>
<tr>
<td>The <code>limits</code> configuration property corresponds to the <code>-w</code>/<code>--warnings-limit</code> command-line option.
Use this property to set the warnings limit.  When validating an OpenAPI document, the validator will compare the number of warnings
it encounters with the warnings limit.  If the number of warnings exceeds the limit, then an error will be logged and the
validator will return exitCode 1, similar to if actual errors were found. If the warnings limit is set to a negative number,
then no warnings limit check will be performed by the validator.</td>
<td><code>{ warnings: -1 }</code>(warnings limit check disabled)</td>
</tr>
</table>
<b>Examples:</b>
<table border=1>
<tr>
</tr>
<tr>
<td><code>.yaml/.yml</code></td>
<td><code>.json</code></td>
<td><code>.js</code></td>
</tr>
<tr>
<td>
<pre>
limits:
  warnings: 25
</pre>
</td>
<td>
<pre>
{
  "limits": {
    "warnings": 25
  }
}
</pre>
</td>
<td>
<pre>
module.exports = {
  limits: {
    warnings: 25
  }
};
</pre>
</td>
</tr>
</table>

##### logLevels
<table border=1>
<tr>
<td><b>Description</b></td>
<td width=25%><b>Default</b></td>
</tr>
<tr>
<td>The <code>logLevels</code> property is an object that specifies the logging level
(<code>error</code>, <code>warn</code>, <code>info</code>, or <code>debug</code>)
associated with each logger within the validator.  It corresponds to the <code>-l</code>/<code>--log-level</code> command-line option.</td>
<td><code>{ root: 'info' }</code></td>
</tr>
</table>
<b>Examples:</b>
<table border=1>
<tr>
</tr>
<tr>
<td><code>.yaml/.yml</code></td>
<td><code>.json</code></td>
<td><code>.js</code></td>
</tr>
<tr>
<td>
<pre>
logLevels:
  root: error
  ibm-schema-description-exists: debug
</pre>
</td>
<td>
<pre>
{
  "logLevels": {
    "root": "error",
    "ibm-schema-description-exists": "debug"
  }
}
</pre>
</td>
<td>
<pre>
module.exports = {
  logLevels: {
    root: 'error',
    'ibm-schema-description-exists': 'debug'
  }
};
</pre>
</td>
</tr>
</table>

##### outputFormat
<table border=1>
<tr>
<td><b>Description</b></td>
<td width=25%><b>Default</b></td>
</tr>
<tr>
<td>You can set the <code>outputFormat</code> configuration property to either <code>text</code> or <code>json</code>
to indicate the type of output you want the validator to produce.
This property corresponds to the <code>-j</code>/<code>--json</code> command-line option.</td>
<td><code>text</code></td>
</tr>
</table>
<b>Examples:</b>
<table border=1>
<tr>
</tr>
<tr>
<td><code>.yaml/.yml</code></td>
<td><code>.json</code></td>
<td><code>.js</code></td>
</tr>
<tr>
<td>
<pre>
outputFormat: json
</pre>
</td>
<td>
<pre>
{
  "outputFormat": "json"
}
</pre>
</td>
<td>
<pre>
module.exports = {
  outputFormat: 'json'
};
</pre>
</td>
</tr>
</table>

##### ruleset
<table border=1>
<tr>
<td><b>Description</b></td>
<td width=25%><b>Default</b></td>
</tr>
<tr>
<td>You can use the <code>ruleset</code> configuration property to specify a custom ruleset to be used by the validator.
This corresponds to the <code>-r</code>/<code>--ruleset</code> command-line option.

By default, the validator will look for the standard Spectral ruleset files (<code>.spectral.yaml</code>, <code>.spectral.yml</code>,
<code>.spectral.json</code>, or <code>.spectral.js</code>) in the current working directory and
its parent directories within the filesystem.  If none are found, then the IBM Cloud Validation Ruleset
will be used.

If you want to force the use of the IBM Cloud Validation Ruleset even if one of the standard Spectral ruleset files are present,
you can specify <code>'default'</code> for the <code>ruleset</code> configuration property.
</td>
<td><code>null</code>, which implies that a standard Spectral ruleset file will be used (if present),
otherwise the IBM Cloud Validation Ruleset will be used.</td>
</tr>
</table>
<b>Examples:</b>
<table border=1>
<tr>
</tr>
<tr>
<td><code>.yaml/.yml</code></td>
<td><code>.json</code></td>
<td><code>.js</code></td>
</tr>
<tr>
<td>
<pre>
ruleset: my-custom-rules.yaml
</pre>
</td>
<td>
<pre>
{
  "ruleset": "my-custom-rules.yaml"
}
</pre>
</td>
<td>
<pre>
module.exports = {
  ruleset: 'my-custom-rules.yaml'
};
</pre>
</td>
</tr>
</table>

##### summaryOnly
<table border=1>
<tr>
<td><b>Description</b></td>
<td width=25%><b>Default</b></td>
</tr>
<tr>
<td>The <code>summaryOnly</code> configuration property corresponds to the <code>-s</code>/<code>--summary-only</code> command-line option.
If set to true, the validator will include only the summary section in its output.
</td>
<td><code>false</code></td>
</tr>
</table>
<b>Examples:</b>
<table border=1>
<tr>
</tr>
<tr>
<td><code>.yaml/.yml</code></td>
<td><code>.json</code></td>
<td><code>.js</code></td>
</tr>
<tr>
<td>
<pre>
summaryOnly: true
</pre>
</td>
<td>
<pre>
{
  "summaryOnly": true
}
</pre>
</td>
<td>
<pre>
module.exports = {
  summaryOnly: true
};
</pre>
</td>
</tr>
</table>

## Validator Output
The validator can produce output in either text or JSON format.  The default is `text` output, and this can be
controlled with the `-j`/`--json` command-line option or `outputFormat` configuration property.

### Text
Here is an example of text output:
```
IBM OpenAPI Validator (validator: 0.97.5; ruleset: 0.45.5), @Copyright IBM Corporation 2017, 2023.

Validation Results for /my/directory/my-api.yaml:

Errors:

  Message :   Path contains two or more consecutive path parameter references: /v1/clouds/{cloud_id}/{region_id}
  Rule    :   ibm-no-consecutive-path-parameter-segments
  Path    :   paths./v1/clouds/{cloud_id}/{region_id}
  Line    :   332

Warnings:

  Message :   Operation summaries should not have a trailing period
  Rule    :   ibm-summary-sentence-style
  Path    :   paths./v1/clouds.post.summary
  Line    :   46

  Message :   Operation summaries should not have a trailing period
  Rule    :   ibm-summary-sentence-style
  Path    :   paths./v1/clouds.get.summary
  Line    :   93

Summary:

  Total number of errors   : 1
  Total number of warnings : 2

  Errors:
   1 (100%) : Path contains two or more consecutive path parameter references

  Warnings:
   2 (100%) : Operation summaries should not have a trailing period
```
As you can see, any errors detected by the validator are listed first, then
warnings, and finally a summary section.  The `-s`/`--summary-only` command-line option or the
`summaryOnly` configuration property can be used to request that only the summary
is display.
Also, the `-e`/`--errors-only` option or `errorsOnly` configuration property can be used
to cause the validator to display only errors in the output.

### JSON
When displaying JSON output, the validator will produce a JSON object which complies with
[this JSON schema](packages/validator/src/schemas/results-object.yaml).
Here is an example of JSON output:
```json
{
  "error": {
    "results": [
      {
        "message": "Path contains two or more consecutive path parameter references: /v1/clouds/{cloud_id}/{region_id}",
        "path": [
          "paths",
          "/v1/clouds/{cloud_id}/{region_id}"
        ],
        "rule": "ibm-consecutive-path-segments",
        "line": 332
      }
    ],
    "summary": {
      "total": 1,
      "entries": [
        {
          "generalizedMessage": "Path contains two or more consecutive path parameter references",
          "count": 1,
          "percentage": 100
        }
      ]
    }
  },
  "warning": {
    "results": [
      {
        "message": "Operation summaries should not have a trailing period",
        "path": [
          "paths",
          "/v1/clouds",
          "post",
          "summary"
        ],
        "rule": "ibm-summary-sentence-style",
        "line": 46
      },
      {
        "message": "Operation summaries should not have a trailing period",
        "path": [
          "paths",
          "/v1/clouds",
          "get",
          "summary"
        ],
        "rule": "ibm-summary-sentence-style",
        "line": 93
      }
    ],
    "summary": {
      "total": 2,
      "entries": [
        {
          "generalizedMessage": "Operation summaries should not have a trailing period",
          "count": 2,
          "percentage": 100
        }
      ]
    }
  },
  "info": {
    "results": [],
    "summary": {
      "total": 0,
      "entries": []
    }
  },
  "hint": {
    "results": [],
    "summary": {
      "total": 0,
      "entries": []
    }
  },
  "hasResults": true
}

```
The JSON output is also affected by the `-s`/`--summary-only` and `-e`/`--errors-only` options as well as the `summaryOnly` and `errorsOnly`
configuration properties.

## Logging
The validator uses a *logger* for displaying messages on the console.
The core validator uses a single logger named `root`, while each of the rules contained in the
IBM Cloud Validation Ruleset uses their own unique logger whose name will match the rule's id
(e.g. `ibm-accept-header`, `ibm-schema-description-exists`, etc.).

Each logger has a logging level associated with it: `error`, `warn`, `info`, and `debug`.
Each of these levels implicitly includes the levels that precede it in the list.
For example, if you set the logging level of a logger to `info`, then all messages of type
`info`, `warn`, and `error` will be displayed, but `debug` messages will not.

To set the level of the `root` logger to `info`, you could use this option: `--log-level root=info`.

To set the level of the logger used by the `ibm-accept-header` rule to `debug`,
you could use this option: `-l ibm-accept-header=debug`.

You can also use a glob-like value for a logger name to set the level on multiple loggers.
For example, to set the level for *all* loggers whose name starts with `ibm-property`, try this:
`-l ibm-property*=debug`.

Enabling debug logging for a specific rule might be useful in a situation where the rule is
reporting violations which seem to be inexplicable. In this case, additional debug information
might be helpful in determining why the violations are occurring, and could possibly lead to a solution.
For example, suppose the `ibm-pagination-style` rule is reporting several violations,
but yet at first glance it's not obvious why these violations are occurring.
To enable debug logging for this rule, use a command like this:
```
lint_openapi -l ibm-pagination-style=debug my-new-api.yaml
```

The default log level for the `root` logger is `info`, while the default log level for
rule-specific loggers is `warn`.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md).

## License

This project is licensed under Apache 2.0.  Full license text is available in [LICENSE](LICENSE).
