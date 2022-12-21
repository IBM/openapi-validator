const { validateSubschemas } = require('@ibm-cloud/openapi-ruleset-utilities');

module.exports = function(schema, _opts, { path }) {
  return validateSubschemas(schema, path, checkDuplicateDescription);
};

function checkDuplicateDescription(schema, path) {
  // We're only interested in a schema or schema property that has an allOf list.
  if (!Array.isArray(schema.allOf) || !schema.allOf.length) {
    return [];
  }

  // Get the description from the first allOf entry.
  // This is the first description to be used in the comparison.
  const description1 = cleanString(schema.allOf[0].description);
  if (!description1) {
    return [];
  }

  // Next, if 'schema' itself has a description, then we'll use that
  // as the second description in the comparison.
  let description2 = cleanString(schema.description);

  // If 'schema' has no description, then we'll walk the rest of the allOf entries
  // and use the last description that we find.
  if (!description2) {
    for (let i = 1; i < schema.allOf.length; i++) {
      const desc = cleanString(schema.allOf[i].description);
      if (desc) {
        description2 = desc;
      }
    }
  }

  if (!description2) {
    return [];
  }

  // We have non-empty descriptions to compare...
  if (description1 === description2) {
    return [
      {
        message: 'Duplicate ref-sibling description is unnecessary',
        path
      }
    ];
  }

  return [];
}

function cleanString(s) {
  return s ? s.toString().trim() : undefined;
}
