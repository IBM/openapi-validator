const each = require('lodash/each');
const pad = require('pad');
const fs = require('fs');
const snakeCase = require('snake-case');

// get line-number-producing, 'magic' code from Swagger Editor
const getLineNumberForPath = require(__dirname + '/../../plugins/ast/ast')
  .getLineNumberForPath;

// this function prints all of the output
module.exports = function print(
  results,
  chalk,
  printValidators,
  reportingStats,
  originalFile,
  errorsOnly,
  fixProblems
) {
  const types = errorsOnly ? ['errors'] : ['errors', 'warnings'];
  const colors = {
    errors: 'bgRed',
    warnings: 'bgYellow'
  };

  // define an object template in the case that statistics reporting is turned on
  const stats = {
    errors: {
      total: 0
    },
    warnings: {
      total: 0
    }
  };

  console.log();

  types.forEach(type => {
    let color = colors[type];
    if (Object.keys(results[type]).length) {
      console.log(chalk[color].bold(`${type}\n`));
    }

    // convert 'color' from a background color to foreground color
    color = color.slice(2).toLowerCase(); // i.e. 'bgRed' -> 'red'

    each(results[type], (problems, validator) => {
      if (printValidators) {
        console.log(`Validator: ${validator}`);
      }

      problems.forEach(problem => {
        // To allow messages with fillins to be grouped properly in the statistics,
        // truncate the message at the first ':'
        const message = problem.message.split(':')[0];
        let path = problem.path;

        // collect info for stats reporting, if applicable

        stats[type].total += 1;

        if (!stats[type][message]) {
          stats[type][message] = 0;
        }

        stats[type][message] += 1;

        // path needs to be an array to get the line number
        if (!Array.isArray(path)) {
          path = path.split('.');
        }

        // get line number from the path of strings to the problem
        // as they say in src/plugins/validation/semantic-validators/hook.js,
        //
        //                  "it's magic!"
        //
        const lineNumber = getLineNumberForPath(originalFile, path);

        // print the path array as a dot-separated string
        console.log(chalk[color](`  Message :   ${problem.message}`));
        console.log(chalk[color](`  Path    :   ${path.join('.')}`));
        console.log(chalk[color](`  Line    :   ${lineNumber}`));
        console.log();
      });
    });
  });

  // print the stats here, if applicable
  if (reportingStats && (stats.errors.total || stats.warnings.total)) {
    console.log(chalk.bgCyan('statistics\n'));

    console.log(
      chalk.cyan(`  Total number of errors   : ${stats.errors.total}`)
    );
    console.log(
      chalk.cyan(`  Total number of warnings : ${stats.warnings.total}\n`)
    );

    types.forEach(type => {
      // print the type, either error or warning
      if (stats[type].total) {
        console.log('  ' + chalk.underline.cyan(type));
      }

      Object.keys(stats[type]).forEach(message => {
        if (message !== 'total') {
          // calculate percentage
          const number = stats[type][message];
          const total = stats[type].total;
          const percentage = Math.round((number / total) * 100).toString();

          // pad(<number>, <string>) right-aligns <string> to the <number>th column, padding with spaces.
          // use 4, two for the appended spaces of every line and two for the number
          //   (assuming errors/warnings won't go to triple digits)
          const numberString = pad(4, number.toString());
          // use 6 for largest case of '(100%)'
          const frequencyString = pad(6, `(${percentage}%)`);

          console.log(
            chalk.cyan(`${numberString} ${frequencyString} : ${message}`)
          );
        }
      });
      if (stats[type].total) {
        console.log();
      }
    });
  }

  if (fixProblems) {

    let originalJSON = JSON.parse(originalFile);

    let paramsToDelete = {};
    let paramsToPrepend = {};
    let newPathNames = {};
    let definitionsToDelete = {};

    let markForDeletion = (path) => {
      let pathstr = path.slice(0, path.length-1).join(',');
      if (pathstr in paramsToDelete) {
        paramsToDelete[pathstr].push(path[path.length-1]);
      } else {
        paramsToDelete[pathstr] = [path[path.length-1]];
      }
    };

    let markForMoving = (path, parent) => {
      let pathstr = path.slice(0, path.length-1).join(',');
      if (!(pathstr in paramsToDelete && path[path.length-1] in paramsToDelete[pathstr])) {
        if (pathstr in paramsToPrepend) {
          paramsToPrepend[pathstr].push(parent[path[path.length-1]]);
        } else {
          paramsToPrepend[pathstr] = [parent[path[path.length-1]]];
        }
      }
    };

    let unmarkIfMarkedForMoving = (path, parent) => {
      let pathstr = path.slice(0, path.length-1).join(',');
      let compFunc = (param) => JSON.stringify(param) === JSON.stringify(parent[path[path.length-1]]);
      if (pathstr in paramsToPrepend && paramsToPrepend[pathstr].findIndex(compFunc) != -1) {
        paramsToPrepend[pathstr].splice(paramsToPrepend[pathstr].findIndex(compFunc), 1);
      }
    };

    let getObjectFromPath = (path) => {
      let pathcopy = path.slice(0);
      let obj = originalJSON;
      let parent, pParent, ppParent;
      while (pathcopy.length) {
        ppParent = pParent;
        pParent = parent;
        parent = obj;
        obj = obj[pathcopy.shift()];
      }
      return {obj, parent, pParent, ppParent};
    }

    types.forEach(type => {
      each(results[type], (problems, validator) => {
        problems.forEach(problem => {
          const message = problem.message.split(':')[0];
          let path = problem.path;
          // path needs to be an array to get the line number
          if (!Array.isArray(path)) {
            path = path.split('.');
          }
          if (path[path.length-1].includes('[')) {
            path.push(path[path.length-1].split(']')[0].split('[')[1]);
            path[path.length-2] = path[path.length-2].split(['['])[0];
          }
          const {obj, parent, ppParent} = getObjectFromPath(path, originalJSON);
          if (message.includes("Schema must have a non-empty description")) {
            obj['description'] = path[path.length-1];
          } else if (message.includes("Schema properties must have a description with content in it")) {
            parent['description'] = path[path.length-2];
          } else if (message.includes("Definition was declared but never used in document")) {
            definitionsToDelete[path.join(',')] = true;
          } else if (message.includes("Common path parameters should be defined on path object")) {
            if ('parameters' in ppParent) {
              let params = ppParent['parameters'];
              let paramToAdd = parent[path[path.length-1]];
              let exists = false;
              params.forEach((param) => {
                if (param.name === paramToAdd.name) {
                  exists = true;
                }
              });
              if (!exists) {
                ppParent['parameters'].push(parent[path[path.length-1]]);
              }
            } else {
              ppParent['parameters'] = [parent[path[path.length-1]]];
            }
            markForDeletion(path);
            unmarkIfMarkedForMoving(path, parent);
          } else if (message.includes("Rely on the `securitySchemas` and `security` fields to specify authorization methods.")) {
            if (!('security' in originalJSON)) {
              originalJSON['security'] = [{"IAM": []}];
              originalJSON["components"]["securitySchemes"] = {
                "IAM": {
                    "type": "apiKey",
                    "name": "Authorization",
                    "description": "Your IBM Cloud IAM access token.",
                    "in": "header"
                }
              };
            }
            markForDeletion(path);
            unmarkIfMarkedForMoving(path, parent);
          } else if (message.includes("operationIds must follow case convention")) {
            parent[path[path.length-1]] = snakeCase.snakeCase(parent[path[path.length-1]]);
          } else if (message.includes("Required parameters should appear before optional parameters.")) {
            markForDeletion(path);
            markForMoving(path, parent);
          } else if (message.includes("Property names must follow case convention")) {
            // parent[snakeCase.snakeCase(path[path.length-1])] = parent[path[path.length-1]];
            // delete parent[path[path.length-1]];
          } else if (message.includes("Path segments must follow case convention")) {
            // newPathNames[path.join('.')] = 1;
          } else if (message.includes("Parameter names must follow case convention")) {
            // obj['name'] = snakeCase.snakeCase(obj['name']);
          } else if (message.includes("A 204 response MUST NOT include a message-body")) {
            delete parent['content'];
          }
        });
      });
    });

    console.log("Deleting Definitions");
    Object.keys(definitionsToDelete).forEach((path) => {
      patharr = path.split(',');
      const {parent} = getObjectFromPath(patharr);
      delete parent[patharr[patharr.length-1]];
    });

    console.log("Deleting/moving Parameters");
    Object.keys(paramsToDelete).forEach((path) => {
      patharr = path.split(',');
      const {obj} = getObjectFromPath(patharr);
      paramsToDelete[path].sort().reverse();
      paramsToDelete[path].forEach((paramToDelete) => {
        obj.splice(paramToDelete, 1);
      });
      if (path in paramsToPrepend) {
        paramsToPrepend[path].forEach((paramToPrepend) => {
          obj.unshift(paramToPrepend);
        });
        paramsToPrepend[path] = []
      }
    });

    console.log("Renaming Paths");
    Object.keys(newPathNames).forEach((path) => {
      path = path.split('.');
      const {parent} = getObjectFromPath(path);
      let pathSegments = path[path.length-1].split("/");
      pathSegments.forEach((segment, i) => {
        if (segment.includes("{")) {
          // pathSegments[i] = "{" + snakeCase.snakeCase(segment) + "}";
        } else {
          pathSegments[i] = snakeCase.snakeCase(segment);
        }
      });
      parent[pathSegments.join("/")] = parent[path[path.length-1]];
      delete parent[path[path.length-1]];
    });

    let fixedJSON = JSON.stringify(originalJSON, null, 4);
    fs.writeFileSync('test1_new.json', fixedJSON);
  }
};
