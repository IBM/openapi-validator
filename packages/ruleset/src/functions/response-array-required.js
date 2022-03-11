const {
  getPropertyNamesForSchema,
  isArraySchema,
  isObjectSchema,
  schemaRequiresProperty,
  validateNestedSchemas
} = require('../utils');

module.exports = function(schema, _opts, { path }) {
  return validateNestedSchemas(schema, path, checkRequiredArrayProperties);
};

function checkRequiredArrayProperties(schema, path) {
  const errors = [];

  if (!isObjectSchema(schema)) {
    return errors;
  }

  const arrayTypePropertyNames = getPropertyNamesForSchema(schema, (_, s) =>
    isArraySchema(s)
  );

  for (const propertyName of arrayTypePropertyNames) {
    if (!schemaRequiresProperty(schema, propertyName)) {
      errors.push({
        message: `Array property \`${propertyName}\` must be required by the response schema`,
        path
      });
    }
  }

  return errors;
}
