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
    // check for empty descriptions
    if (obj.description !== undefined && obj.description !== null) {
      const description = obj.description.toString();
      if (description.length === 0 || !description.trim()) {
        const checkStatus = config.no_empty_descriptions;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path: [...path, 'description'],
            message: 'Items with a description must have content in it.'
          });
        }
      }
    }

    // check for and flag null values - they are not allowed by the spec and are likely mistakes
    Object.keys(obj).forEach(key => {
      if (obj[key] === null) {
        result.error.push({
          path: [...path, key],
          message: 'Null values are not allowed for any property.'
        });
      }
    });
  });

  return { errors: result.error, warnings: result.warning };
};
