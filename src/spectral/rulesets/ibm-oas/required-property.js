module.exports = function(schema, _opts, paths) {
  const rootPath = paths.target !== void 0 ? paths.target : paths.given;
  return getErrorsForMissingRequiredProperties(schema, rootPath);
};

function getErrorsForMissingRequiredProperties(schema, path) {
  const errors = [];
  errors.push(...checkRequiredProperties(schema, path));
  if (schema.properties) {
    Object.entries(schema.properties).forEach(function(prop) {
      const propName = prop[0];
      const propSchema = prop[1];
      errors.push(
        ...getErrorsForMissingRequiredProperties(propSchema, [
          ...path,
          'properties',
          propName
        ])
      );
    });
  } else if (schema.items) {
    errors.push(
      ...getErrorsForMissingRequiredProperties(schema.items, [...path, 'items'])
    );
  }
  return errors;
}

function checkRequiredProperties(schema, path) {
  const errors = [];
  if (Array.isArray(schema.required)) {
    schema.required.forEach(function(requiredPropName) {
      if (!checkSchemaForProp(requiredPropName, schema)) {
        let message;
        if (schema.allOf) {
          message = `Required property, ${requiredPropName}, must be defined in at least one of the allOf schemas`;
        } else if (schema.anyOf || schema.allOf) {
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

function checkSchemaForProp(requiredProp, schema) {
  if (schema.properties && schema.properties[requiredProp]) {
    return true;
  } else if (Array.isArray(schema.allOf)) {
    let reqPropDefined = false;
    schema.allOf.forEach(childObj => {
      if (checkSchemaForProp(requiredProp, childObj)) {
        reqPropDefined = true;
      }
    });
    return reqPropDefined;
  } else if (Array.isArray(schema.anyOf) || Array.isArray(schema.oneOf)) {
    const childList = schema.anyOf || schema.oneOf;
    let reqPropDefined = true;
    childList.forEach(childObj => {
      if (!checkSchemaForProp(requiredProp, childObj)) {
        reqPropDefined = false;
      }
    });
    return reqPropDefined;
  }
  return false;
}
