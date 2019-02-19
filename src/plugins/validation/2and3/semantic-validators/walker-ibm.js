// Assertation 1:
// The description, when present, should not be empty or contain empty space

// Assertation 2:
// Description siblings to $refs should not exist if identical to referenced description

const at = require('lodash/at');
const walk = require('../../../utils/walk');

// Walks an entire spec.
module.exports.validate = function({ jsSpec, resolvedSpec }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.walker;

  walk(jsSpec, [], function(obj, path) {
    // check for empty descriptions
    if (obj.description !== undefined && obj.description !== null) {
      const description = obj.description.toString();

      // verify description is not empty
      if (description.length === 0 || !description.trim()) {
        const checkStatus = config.no_empty_descriptions;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path: [...path, 'description'],
            message: 'Items with a description must have content in it.'
          });
        }
      }

      // check description siblings to $refs
      // note: in general, siblings to $refs are discouraged and validated elsewhere.
      // this is a more specific check to flag duplicated descriptions for referenced schemas
      // (probably most useful when users turn of the $ref sibling validation)
      if (obj.$ref) {
        const referencedSchema = at(resolvedSpec, [path])[0];
        if (
          referencedSchema.description &&
          referencedSchema.description === description
        ) {
          const checkStatus = config.duplicate_sibling_description;
          if (checkStatus !== 'off') {
            result[checkStatus].push({
              path: [...path, 'description'],
              message:
                'Description sibling to $ref matches that of the referenced schema. This is redundant and should be removed.'
            });
          }
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
