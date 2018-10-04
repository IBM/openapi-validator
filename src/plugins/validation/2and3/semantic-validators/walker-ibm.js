// Assertation 1:
// The description, when present, should not be empty or contain empty space

const walk = require('../../../utils/walk');

// Walks an entire spec.
module.exports.validate = function({ jsSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.walker;

  walk(jsSpec, [], function(obj, path) {
    const description = obj.description;
    if (description === undefined) return;
    if (description.length === 0 || !description.trim()) {
      const checkStatus = config.no_empty_descriptions;
      if (checkStatus !== 'off') {
        result[checkStatus].push({
          path: [...path, 'description'],
          message: 'Items with a description must have content in it.'
        });
      }
    }
  });

  return { errors: result.error, warnings: result.warning };
};
