This page displays abbreviated usage info for getting started. Visit https://github.com/IBM/openapi-validator/blob/main/README.md to see the full documentation for this tool.

# OpenAPI Validator
This command line tool lets you validate OpenAPI documents according to their specification, either [2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) or [3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md),
as well as IBM-defined best practices.

## Installation
`npm install -g ibm-openapi-validator`

The `-g` flag installs the tool globally so that the validator can be run from anywhere in the file system. Alternatively, you can pass no flag or the `--save-dev` flag to add the validator as a dependency to your project and run it from your NPM scripts or JavaScript code.

## Usage
### Command line
`lint-openapi [options] [command] [<files>]`

##### [options]
-  -e (--errors-only) : Only print the errors, ignore the warnings.
-  -j (--json) : Output results as a JSON object.
-  -l (--log-level) `<loggername>=<loglevel> ...` : Set log level of logger named `<loggername>` to `<loglevel>` (e.g. `-l root=info -l ibm-schema-description=debug`). If you omit the logger name, then `root` is assumed (e.g. `-l info`).
-  -n (--no-colors) : Disables colorization of the output messages, which is enabled by default.
-  -v (--verbose) : Display verbose output.
-  -r (--ruleset) `<path/to/your/ruleset>` : Path to Spectral ruleset file, used instead of .spectral.yaml if provided.
-  -s (--summary-only) : Display only the summary section, and avoid displaying individual errors and warnings. This applies to both JSON and non-JSON output.
-  --version : Print the current semantic version of the validator
-  -h (--help) : This option prints the usage menu.
