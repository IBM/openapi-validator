const { validateSubschemas } = require('../utils');
const isPlainObject = require('lodash/isPlainObject');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, arrayItems, true, false);
};

function arrayItems(schema, path) {
  if (schema.type === 'array' && !isPlainObject(schema.items)) {
    return [
      {
        message: 'Array schemas must specify "items" property',
        path
      }
    ];
  }

  return [];
}
