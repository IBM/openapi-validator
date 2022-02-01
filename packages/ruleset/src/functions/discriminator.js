// Assertation 1:
// if discriminator exist inside schema object, it must be of type Object
// enforced by Spectral's oas3-schema rule

// Assertion 2:
// discriminator object must have a field name propertyName
// enforced by Spectral's oas3-schema rule

// Assertation 3:
// propertyName is of type string
// enforced by Spectral's oas3-schema rule

// Assertation 4:
// properties inside a schema object must include propertyName from discriminator object

const { checkSubschemasForProperty, validateSubschemas } = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, validateDiscriminators);
};

function validateDiscriminators(schema, path) {
  const errors = [];

  const { discriminator } = schema;
  if (!discriminator || !typeof discriminator === 'object') {
    return errors;
  }

  const { propertyName } = discriminator;
  if (!checkSubschemasForProperty(schema, propertyName)) {
    errors.push({
      message:
        'The discriminator property name used must be defined in this schema',
      path: [...path, 'discriminator', 'propertyName']
    });
  }

  return errors;
}
