const each = require('lodash/each');
const getPathAsArray = require('./get-path-as-array');

// get line-number-producing, 'magic' code from Swagger Editor
const getLineNumberForPath = require(__dirname + '/../../plugins/ast/ast')
  .getLineNumberForPath;
const validatorVersion = require('../../../package.json').version;

// function to print the results as json to the console.
function printJson(
  logger,
  results,
  originalFile = null,
  verbose = false,
  errorsOnly = false,
  summaryOnly = false
) {
  // render the results to json in the console with 2 char spacing
  results = formatResultsAsObject(
    results,
    originalFile,
    verbose,
    errorsOnly,
    summaryOnly
  );
  logger.info(JSON.stringify(results, null, 2));
}

function formatResultsAsObject(
  results,
  originalFile = null,
  verbose = false,
  errorsOnly = false,
  summaryOnly = false
) {
  // initialize the results with the validator version and the initial summary section
  const formattedResults = {
    version: validatorVersion,
    summary: {
      errors: 0,
      warnings: 0,
      infos: 0,
      hints: 0
    }
  };

  const allErrorCategories = ['errors', 'warnings', 'infos', 'hints'];
  const types = errorsOnly ? ['errors'] : allErrorCategories;
  types.forEach(type => {
    each(results[type], problems => {
      problems.forEach(problem => {
        let path = problem.path;

        // path needs to be an array to get the line number
        path = getPathAsArray(path);

        if (originalFile) {
          // get line number from the path of strings to the problem
          // as they say in src/plugins/validation/semantic-validators/hook.js,
          //
          //                  "it's magic!"
          //
          const line = getLineNumberForPath(originalFile, path);

          // add the line number to the result JSON
          problem.line = line;

          if (verbose && problem.componentPath) {
            problem.componentLine = getLineNumberForPath(
              originalFile,
              getPathAsArray(problem.componentPath)
            );
          }
        }
        // initialize object for this type of error (e.g. error, warning, info, hint)
        if (!summaryOnly) {
          if (!formattedResults[type]) {
            formattedResults[type] = [];
          }
          formattedResults[type].push(problem);
        }
        formattedResults.summary[type]++;
      });
    });
  });

  return formattedResults;
}

module.exports.formatResultsAsObject = formatResultsAsObject;
module.exports.printJson = printJson;
