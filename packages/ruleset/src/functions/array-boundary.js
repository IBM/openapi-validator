const {
  getSchemaType,
  schemaHasConstraint,
  validateNestedSchemas,
  SchemaType
} = require('@ibm-cloud/openapi-ruleset-utilities');

module.exports = function(schema, _opts, { path }) {
  return validateNestedSchemas(schema, path, arrayBoundaryErrors, true, false);
};

const debugEnabled = false;
function debug(msg) {
  if (debugEnabled) {
    console.log(msg);
  }
}

function arrayBoundaryErrors(schema, path) {
  if (getSchemaType(schema) !== SchemaType.ARRAY) {
    return [];
  }

  const errors = [];

  const hasMinItems = schemaHasConstraint(
    schema,
    s => s && isDefined(s.minItems) && typeof s.minItems === 'number'
  );

  if (!hasMinItems) {
    errors.push({
      message: 'Array schemas should define a numeric minItems field',
      path
    });
    debug('>>> minItems field missing for: ' + path.join('.'));
  }

  const hasMaxItems = schemaHasConstraint(
    schema,
    s => s && isDefined(s.maxItems) && typeof s.maxItems === 'number'
  );

  if (!hasMaxItems) {
    errors.push({
      message: 'Array schemas should define a numeric maxItems field',
      path
    });
    debug('>>> maxItems field missing for: ' + path.join('.'));
  }

  return errors;
}

function isDefined(x) {
  return x !== null && x !== undefined;
}
