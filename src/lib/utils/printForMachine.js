const each = require('lodash/each');
const validatorVersion = require('../../../package.json').version;

// this module generates machine readable output,
// rather than the human-readable-focused module,
// `cli -validator/utils/printResults`
module.exports = function generateOutput(results) {
  const output = {};
  const types = ['errors', 'warnings'];

  types.forEach(type => {
    output[type] = [];
    each(results[type], problems => {
      problems.forEach(problem => {
        if (Array.isArray(problem.path)) {
          problem.path = problem.path.join('.');
        }
      });
      output[type].push(...problems);
    });
  });

  output['version'] = validatorVersion;

  return output;
};
