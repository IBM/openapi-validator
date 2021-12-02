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
-  -c (--config) <path/to/your/config> : Path to a validator configuration file.  If provided, this is used instead of .validaterc.
-  -d (--default_mode) : This option turns off [configuration](#configuration) and runs the validator in [default mode](#default-mode).
-  -e (--errors_only) : Only print the errors, ignore the warnings.
-  -j (--json) : Output results as a JSON object
-  -n (--no_colors) : The output is colored by default. If this bothers you, this flag will turn off the coloring.
-  -p (--print_validator_modules) : Print the name of the validator source file the error/warning was caught it. This can be helpful for developing validations.
-  -v (--verbose) : Increase verbosity of reported results.  Use this option to display the rule for each reported result.
-  -r (--ruleset) <path/to/your/ruleset> : Path to Spectral ruleset file, used instead of .spectral.yaml if provided.
-  -s (--report_statistics) : Print a simple report at the end of the output showing the frequency, in percentage, of each error/warning.
-  --debug : Enable debugging output.
-  --version : Print the current semantic version of the validator
-  -h (--help) : This option prints the usage menu.


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
