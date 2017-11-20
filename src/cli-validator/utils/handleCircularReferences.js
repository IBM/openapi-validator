const last = require('lodash/last');
const getLineNumberForPath = require(__dirname + '/../../plugins/ast/ast').getLineNumberForPath;

// find the circular references and print them out
module.exports = function handleCircularReferences(jsSpec, originalFile, chalk) {

  const circularReferenceInfo = findCircularRef(jsSpec, originalFile);

  // ref_s_ = reference(s) - determine if plural or not
  const ref_s_ = circularReferenceInfo.length > 1 ? 'references' : 'reference';

  console.log('\n' + chalk.red('Error') + ` Circular ${ref_s_} detected. See below for details.\n`);

  // print all detected cicular references
  circularReferenceInfo.forEach(function(model) {
    console.log(chalk.magenta(`  Model   :   ${model.name}`));
    console.log(chalk.magenta(`  Path    :   ${model.path.join('.')}`));
    console.log(chalk.magenta(`  Line    :   ${model.line}`));
    console.log();
  });
}

// this function recursively walks the spec looking for a circular reference
function findCircularRef(jsSpec, originalFile) {

  let circularReferenceInfo = [];

  function walk(object, path) {

    if (object === null) {
      return null;
    }

    if (typeof object !== 'object') {
      return null;
    }

    const keys = Object.keys(object);

    if (!keys.length) {
      return null;
    }

    return keys.forEach(function(key) {

      if (key === '$ref') {
        let ref = object[key];
        let modelName = last(ref.split('/'));
        if (path.includes(modelName)) {
          path = [...path, key];
          let lineNumber = getLineNumberForPath(originalFile, path);
          circularReferenceInfo.push({
            name: modelName,
            path: path,
            line: lineNumber
          });
        }
      }
      return walk(object[key], [...path, key]);
    });
  }

  walk(jsSpec, []);
  return circularReferenceInfo;
}