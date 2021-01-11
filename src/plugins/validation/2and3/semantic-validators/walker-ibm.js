// Assertation 1:
// The description, when present, should not be empty or contain empty space

// Assertation 2:
// Description siblings to $refs should not exist if identical to referenced description

const at = require('lodash/at');
const { walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');

// Walks an entire spec.
module.exports.validate = function({ jsSpec, resolvedSpec }, config) {
  const messages = new MessageCarrier();

  config = config.walker;

  walk(jsSpec, [], function(obj, path) {
    // check for empty descriptions
    if (obj.description !== undefined && obj.description !== null) {
      const description = obj.description.toString();

      // verify description is not empty
      if (description.length === 0 || !description.trim()) {
        messages.addMessage(
          [...path, 'description'],
          'Items with a description must have content in it.',
          config.no_empty_descriptions,
          'no_empty_descriptions'
        );
      }

      // check description siblings to $refs
      // note: in general, siblings to $refs are discouraged and validated elsewhere.
      // this is a more specific check to flag duplicated descriptions for referenced schemas
      // (probably most useful when users turn of the $ref sibling validation)
      if (obj.$ref) {
        const referencedSchema = at(resolvedSpec, [path])[0];
        if (
          referencedSchema &&
          referencedSchema.description &&
          referencedSchema.description === description
        ) {
          messages.addMessage(
            [...path, 'description'],
            'Description sibling to $ref matches that of the referenced schema. This is redundant and should be removed.',
            config.duplicate_sibling_description,
            'duplicate_sibling_description'
          );
        }
      }
    }

    // check for and flag null values - they are not allowed by the spec and are likely mistakes
    Object.keys(obj).forEach(key => {
      if (key !== 'default' && obj[key] === null) {
        messages.addMessage(
          [...path, key],
          'Null values are not allowed for any property.',
          'error'
        );
      }
    });
  });

  return messages;
};
