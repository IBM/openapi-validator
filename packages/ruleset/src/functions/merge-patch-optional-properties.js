const { checkCompositeSchemaForConstraint } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return mergePatchOptionalProperties(schema, path);
};

/**
 * This function is invoked for each merge-patch operation's requestBody schema and
 * will check to make sure the schema doesn't define any required properties.
 *
 * @param {} schema the requestBody schema to check for required properties
 * @param {*} path the array of path segments indicating the "location" of a
 * requestBody schema for a merge-patch operation (e.g. ['paths', '/v1/things/{thing_id}',
 * 'patch', 'requestBody', 'content', 'application/merge-patch+json', 'schema'])).
 * @returns an array containing the violations found or [] if no violations
 */
function mergePatchOptionalProperties(schema, path) {
  if (containsRequiredProperties(schema) || hasMinProperties(schema)) {
    return [
      {
        // The rule's description field is used as the error message.
        message: '',
        path
      }
    ];
  }

  return [];
}

function containsRequiredProperties(schema) {
  return checkCompositeSchemaForConstraint(
    schema,
    s => s && Array.isArray(s.required) && s.required.length > 0
  );
}

function hasMinProperties(schema) {
  return checkCompositeSchemaForConstraint(schema, s => s && s.minProperties);
}
