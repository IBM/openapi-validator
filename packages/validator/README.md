# OpenAPI Validator
The IBM OpenAPI Validator lets you validate OpenAPI 3.x documents according to the [OpenAPI 3.x specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md), as well as IBM-defined best practices.

Note: this page displays abbreviated usage info for getting started. Visit [this page](../../README.md) for the full documentation.

## Installation
`npm install -g ibm-openapi-validator`

The `-g` flag installs the tool globally so that the validator can be run from anywhere in the file system. Alternatively, you can pass no flag or the `--save-dev` flag to add the validator as a dependency to your project and run it from your NPM scripts or JavaScript code.

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
  -r, --ruleset <file>           use Spectral ruleset contained in `<file>` (default is IBM Cloud Validation Ruleset)
  -s, --summary-only             include only the summary information and skip individual errors and warnings (default is false)
  -v, --verbose                  display verbose results (default is false)
  -w, --warnings-limit <number>  set warnings limit to <number> (default is -1)
  --version                      output the version number
  -h, --help                     display help for command
```
where `[file...]` is a space-separated list containing the filenames of one or more OpenAPI 3.x documents to be validated.

Detailed usage information for the validator can be found [here](../../README.md).
