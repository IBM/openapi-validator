const { casing } = require('@stoplight/spectral-functions');
const { validateSubschemas } = require('../utils');

let opts;

module.exports = function(schema, options, { path }) {
  // store the options to pass to 'casing'
  // note that 'casing' doesn't take the "context" (the third argument)
  opts = options;
  return validateSubschemas(schema, path, checkPropertyCaseConvention);
};

function checkPropertyCaseConvention(schema, path) {
  if (schema.properties) {
    const errors = [];
    for (const propName of Object.keys(schema.properties)) {
      // skip deprecated properties
      if (schema.properties[propName].deprecated === true) {
        continue;
      }

      const result = casing(propName, opts);
      // 'casing' will only return 'undefined' or an array of length 1
      if (result) {
        // 'casing' only reports the message - add the path to it
        // the message itself isn't great either - add some detail to it
        result[0].message = 'Property names ' + result[0].message;
        result[0].path = [...path, 'properties', propName];
        errors.push(result[0]);
      }
    }

    return errors;
  }

  return [];
}
