const { casing } = require('@stoplight/spectral-functions');
const { validateSubschemas } = require('../utils');

let casingConfig;

module.exports = function(schema, options, { path }) {
  // Save this rule's "functionOptions" value since we need
  // to pass it on to Spectral's "casing" function.
  casingConfig = options;

  return validateSubschemas(schema, path, checkEnumCaseConvention);
};

function checkEnumCaseConvention(schema, path) {
  const errors = [];

  // If 'schema' has an enum field with string values,
  // we'll check each enum value to make sure it complies
  // with the configured case convention.
  if (schema.enum) {
    for (let i = 0; i < schema.enum.length; i++) {
      const enumValue = schema.enum[i];
      if (typeof enumValue === 'string') {
        const result = casing(enumValue, casingConfig);

        // If casing() returns an error, then we'll augment the message and path
        // to reflect the offending enum value.
        // casing() will return either an array with 1 element or undefined.
        if (result) {
          result[0].message = 'Enum values ' + result[0].message;
          result[0].path = [...path, 'enum', i.toString()];
          errors.push(result[0]);
        }
      }
    }
  }

  return errors;
}
