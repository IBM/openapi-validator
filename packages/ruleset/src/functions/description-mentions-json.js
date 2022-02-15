const { validateSubschemas } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, descriptionMentionsJSON);
};

const errorMsg = 'Schema descriptions should avoid mentioning "JSON"';

function descriptionMentionsJSON(schema, path) {
  const results = [];

  if (
    schema.description &&
    schema.description
      .toString()
      .toLowerCase()
      .includes('json')
  ) {
    results.push({
      message: errorMsg,
      path
    });
  }

  return results;
}
