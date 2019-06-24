const each = require('lodash/each');

// get line-number-producing, 'magic' code from Swagger Editor
const getLineNumberForPath = require(__dirname + '/../../plugins/ast/ast')
  .getLineNumberForPath;

// function to print the results as json to the console.
module.exports = function printJson(results, originalFile, errorsOnly) {
  const types = errorsOnly ? ['errors'] : ['errors', 'warnings'];
  types.forEach(type => {
    each(results[type], problems => {
      problems.forEach(problem => {
        // TODO figure out how to include the config option that caused the error/warning
        // and inject that as additional data.

        let path = problem.path;

        // path needs to be an array to get the line number
        if (!Array.isArray(path)) {
          path = path.split('.');
        }

        // get line number from the path of strings to the problem
        // as they say in src/plugins/validation/semantic-validators/hook.js,
        //
        //                  "it's magic!"
        //
        const line = getLineNumberForPath(originalFile, path);

        // add the line number to the result JSON
        problem.line = line;
      });
    });
  });
  if (errorsOnly) {
    delete results.warnings;
  }
  // render the results to json in the console with 2 char spacing
  const jsonstr = JSON.stringify(results, null, 2);
  console.log(jsonstr);
};
