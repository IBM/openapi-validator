const checkSubschemasForProperty = (schema, name) => {
  if (!schema) {
    return false;
  }

  let propertyIsDefined = false;

  // first check the properties
  if (schema.properties) {
    propertyIsDefined = name in schema.properties;
  } else if (schema.oneOf || schema.anyOf) {
    // every schema in a oneOf or anyOf must contain the property
    const subschemas = schema.oneOf || schema.anyOf;
    if (Array.isArray(subschemas)) {
      propertyIsDefined = true;
      for (const s of subschemas) {
        if (!checkSubschemasForProperty(s, name)) {
          propertyIsDefined = false;
          break;
        }
      }
    }
  } else if (Array.isArray(schema.allOf)) {
    // at least one schema in an allOf must contain the property
    for (const s of schema.allOf) {
      if (checkSubschemasForProperty(s, name)) {
        propertyIsDefined = true;
        break;
      }
    }
  }

  return propertyIsDefined;
};

module.exports = checkSubschemasForProperty;
