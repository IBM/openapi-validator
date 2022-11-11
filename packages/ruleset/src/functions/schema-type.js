const {
  SchemaType,
  JSONSchemaType,
  JSONSchemaFormat,
  checkCompositeSchemaForConstraint,
  getAllComposedSchemas,
  getSchemaType,
  validateNestedSchemas
} = require('../utils');

module.exports = function(schema, options, { path }) {
  return validateNestedSchemas(schema, path, schemaType);
};

function schemaType(schema, path) {
  const type = getSchemaType(schema);
  let message = null;

  if (type === SchemaType.UNKNOWN) {
    message =
      'Schema does not have a clear, consistent combination of `type` and `format`.';
  } else if (hasAmbiguousType(schema, type)) {
    message = '`type` is undefined for a variation of the schema.';
  } else if (hasContradictoryType(schema, type)) {
    message = '`type` is contradictory in the schema composition.';
  } else if (type in JSONSchemaFormat) {
    if (hasAmbiguousFormat(schema, type)) {
      message = '`format` is undefined for a variation of the schema.';
    } else if (hasContradictoryFormat(schema, type)) {
      message = '`format` is contradictory in the schema composition.';
    }
  }

  if (message !== null) {
    return [{ message, path }];
  } else {
    return [];
  }
}

const hasAmbiguousType = (schema, type) => {
  return !checkCompositeSchemaForConstraint(
    schema,
    s => s.type === JSONSchemaType[type]
  );
};

const hasContradictoryType = (schema, type) => {
  const schemas = getAllComposedSchemas(schema);

  for (const s of schemas) {
    if ('type' in s && s.type !== JSONSchemaType[type]) {
      return true;
    }
  }

  return false;
};

const hasAmbiguousFormat = (schema, type) => {
  return !checkCompositeSchemaForConstraint(
    schema,
    s => s.format === JSONSchemaFormat[type]
  );
};

const hasContradictoryFormat = (schema, type) => {
  const schemas = getAllComposedSchemas(schema);

  for (const s of schemas) {
    if ('format' in s && s.format !== JSONSchemaFormat[type]) {
      return true;
    }
  }

  return false;
};
