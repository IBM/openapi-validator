const { validateSubschemas } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, arrayOfArrays, true, false);
};

function arrayOfArrays(schema, path) {
  const errors = [];

  if (schema.type === 'array' && schema.items) {
    if (schema.items.type === 'array') {
      errors.push({
        message: 'Array schemas should avoid having items of type array.',
        path
      });
    }
  }

  return errors;
}
