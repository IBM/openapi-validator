# Migration Guide
This migration guide is intended to help users migrate from the version 0.x pre-release of the IBM OpenAPI Validator
to the new version 1.0 official release.

## Minimum Node version
The minimum supported version of Node.js remains at version 14.x.

## API
The v0.x pre-release validator supported an API to enable users to invoke the validator programmatically
from a javascript application.
This API is no longer supported in the v1.x validator; however, if there is a need to enable the
validator to be invoked programmatically from the user's application, then it could be considered
for a future release.

## CLI Changes
Changes were made to the command-line options supported by the validator:  
1. In the v0.x pre-release validator, the `-c`/`--config` option was used to specify the name
of the user's configuration file to use instead of `.validaterc`.  In the new v1.x validator,
this same option is now used to specify the name of your validator configuration file, which
now has a completely different structure (see below).
2. In the v0.x pre-release validator, the `-s`/`--report_statistics` option was used to
include the summary section in the validator output.  In the new v1.x validator, the output will
always include the summary section and you can now use the `-s`/`--summary-only` option to
cause the validator to include *only* the summary section in the output and avoid logging
individual validation messages.
3. The `-d`/`--default_mode` option is no longer supported.  To achieve "default mode" with
the new  1.x validator, simply avoid specifying any options (other than the files to be validated, perhaps),
and the validator will revert to default behavior with respect to each of the options (e.g. validator
output is colorized by default).
4. The `-p`/`--print_validator_modules` option is no longer supported.
5. The `--debug` option is no longer supported.  In the new v1.x validator, you can achieve something
similar by simply setting the log-level of the "root" logger to "debug" (e.g. `--log-level debug`).
6. In the v0.x pre-release validator, multi-word options (e.g. `--report_statistics`) would include `_`
(underscore) as the word delimiter, but the new v1.x validator uses `-` (dash) as the 
word delimiter (e.g. `--errors_only` is now `--errors-only`).

More details about the command-line options supported by the new v1.x validator can be found [here](README.md#usage).

## New Validator Configuration File
The v0.x pre-release validator supported two different configuration files:
- `.thresholdrc`: this is where the warnings limit could be defined
- `.validaterc`: this is where you could configure rules, etc.

These files are no longer supported, but the new v1.x validator supports
a more consistent interface in which each of the command-line options is also
supported as a field within the new configuration file.
This gives users the freedom to specify input options on the command-line, within a configuration file,
or even a combination of the two (options specified on the command-line will take precedence over options
defined in a configuration file).   In addition, the new 1.x validator supports JSON, YAML and Javascript formats.

More details regarding the new v1.x validator's configuration file can be found [here](README.md#configuration).

## Validator Output
### Text
The text output produced by the new v1.x validator is largely the same as that produced by the v0.x pre-release validator.
One main difference is that the v1.x validator will now *always* include the summary section in the output and the
`-s`/`--summary-only` option can be used to include *only* the summary section in the output.

### JSON
The structure of the JSON output produced by the new 1.x validator is slightly different, and is now
described by [this schema](packages/validator/src/schemas/results-object.yaml).
Also, the new 1.x validator will honor the `--errors-only` and `--summary-only` options when producing JSON output, whereas
the v0.x pre-release validator did not.
More details related to validator output can be found [here](README.md#validator-output).

## Ruleset Changes
This section contains information about changes that were made to the
rules contained in the IBM Cloud Validation Ruleset.

TBD
