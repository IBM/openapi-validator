const {
  schemaHasProperty,
  validateSubschemas
} = require('@ibm-cloud/openapi-ruleset-utilities');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, checkRequiredProperties, true, false);
};

function checkRequiredProperties(schema, path) {
  const errors = [];
  if (Array.isArray(schema.required)) {
    schema.required.forEach(function(requiredPropName) {
      if (!schemaHasProperty(schema, requiredPropName)) {
        let message;
        if (schema.allOf) {
          message = `Required property, ${requiredPropName}, must be defined in at least one of the allOf schemas`;
        } else if (schema.anyOf || schema.oneOf) {
          message = `Required property, ${requiredPropName}, must be defined in all of the anyOf/oneOf schemas`;
        } else {
          message = `Required property, ${requiredPropName}, not in the schema`;
        }
        errors.push({
          message,
          path
        });
      }
    });
  }
  return errors;
}
