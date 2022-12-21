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
// The discriminator property (whose name is specified by the discriminator.propertyName field)
// must be defined in the schema.

const {
  schemaHasProperty,
  validateSubschemas
} = require('@ibm-cloud/openapi-ruleset-utilities');

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
  if (!schemaHasProperty(schema, propertyName)) {
    errors.push({
      message:
        'The discriminator property name used must be defined in this schema',
      path: [...path, 'discriminator', 'propertyName']
    });
  }

  return errors;
}
