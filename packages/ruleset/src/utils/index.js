module.exports = {
  getCompositeSchemaAttribute: require('./get-composite-schema-attribute'),
  isDeprecated: require('./is-deprecated'),
  isEmptyObjectSchema: require('./is-empty-object-schema'),
  isRefSiblingSchema: require('./is-ref-sibling-schema'),
  mergeAllOfSchemaProperties: require('./merge-allof-schema-properties'),
  ...require('./mimetype-utils'),
  operationMethods: require('./constants'),
  pathMatchesRegexp: require('./path-matches-regexp')
};
