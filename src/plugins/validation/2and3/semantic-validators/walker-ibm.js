// Assertation 1:
// The description, when present, should not be empty or contain empty space

// Assertation 2:
// Description siblings to $refs should not exist if identical to referenced description

const at = require('lodash/at');
const {
  walk
} = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');

const custom = {
  'produces': {
    'array': [{
      'value': 'r',
      'fail': false,
      'casesensitive': true,
      'level': 'error'
    }]
  },

  'paths': {
    'key': [{
      'value': '/',
      'fail': false,
      'casesensitive': true,
      'level': 'error'
    }]
  },
  'info': {
    'title': {
      'value': [{
        'value': 'f',
        'fail': true,
        'casesensitive': true,
        'level': 'error'
      }]
    }
  }
}
// Walks an entire spec.
module.exports.validate = function({
  jsSpec,
  resolvedSpec
}, config) {
  const messages = new MessageCarrier();

  config = config.walker;

  walk(jsSpec, [], function(obj, path) {
    if (path) {
      var customEntry = custom
      flag = true
      for (var i = 0; i < path.length - 1; i++) {
        if (customEntry[path[i]] == undefined) {
          flag = false;
          break;
        } else {
          customEntry = customEntry[path[i]]
        }
      }
      console.log(customEntry)
      if (flag && customEntry && customEntry.key) {
        customEntry.key.forEach(function(action) {
          console.log(path)
          console.log(customEntry)
          checkString(path, path[path.length - 1], action, messages)
        })
      } else if (customEntry && customEntry.array) {
        customEntry.array.forEach(function(action) {
          obj.forEach(function(e) {
            checkString(path, e, action, messages)
          })
        })
      } else if (customEntry && customEntry.value) {
        customEntry.value.forEach(function(action) {
            checkString(path, obj, action, messages)
        })
      }
      // check for empty descriptions
      if (obj.description !== undefined && obj.description !== null) {
        const description = obj.description.toString();

        // verify description is not empty
        if (description.length === 0 || !description.trim()) {
          messages.addMessage(
            [...path, 'description'],
            'Items with a description must have content in it.',
            config.no_empty_descriptions
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
              config.duplicate_sibling_description
            );
          }
        }
      }
    }
    // check for and flag null values - they are not allowed by the spec and are likely mistakes
    Object.keys(obj).forEach(key => {
      if (obj[key] === null) {
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


function checkString(path, value, action, messages) {
  // console.log(value)
  if (action.casesensitive) {
    value = value.toLowerCase();
  }
  if (value.split(action.value).length > 1) {
    console.log(value.split(action.value).length)
    if (action.fail) {
      messages.addMessage(
        [...path, ' invalid substring'],
        value + ' contained an invalid string "' + action.value + '"',
        action.level
      );
    }
  } else {
    if (!action.fail) {
      messages.addMessage(
        [...path, ' missing substring'],
        value + ' does not contain a required string "' + action.value + '"',
        action.level
      );
    }
  }
}
