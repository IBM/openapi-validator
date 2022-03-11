const { allSchemasDocument, testRule } = require('./utils');
const { schemas } = require('../src/collections');
const { validateSubschemas } = require('../src/utils');

describe('Utility: validateSubschemas', () => {
  const visitedSchemas = [];

  function pathRecorder(schema, path) {
    visitedSchemas.push(path.join('.'));
    return [];
  }

  function ruleFunction(schema, _opts, { path }) {
    return validateSubschemas(schema, path, pathRecorder);
  }

  // this needs to be executed as a spectral rule to resolve the document
  const ruleForTesting = {
    given: schemas,
    resolved: true,
    then: {
      function: ruleFunction
    }
  };

  it('should find all subschemas', async () => {
    await testRule('rule-name', ruleForTesting, allSchemasDocument);

    expect(visitedSchemas.length).toBe(24);

    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_property_schema'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_property_schema.properties.property_schema'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_additional_properties_schema'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_additional_properties_schema.additionalProperties'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_items_schema'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_items_schema.items'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_all_of_schema'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_all_of_schema.allOf.0'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_one_of_schema'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_one_of_schema.oneOf.0'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_any_of_schema'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_any_of_schema.anyOf.0'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_not_schema'
    );
    expect(visitedSchemas).toContain(
      'paths./schema.get.responses.200.content.application/json.schema.properties.schema_with_not_schema.not'
    );
    expect(visitedSchemas).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema'
    );
    expect(visitedSchemas).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.properties.property_schema'
    );
    expect(visitedSchemas).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.properties.property_schema.properties.property_schema'
    );
    expect(visitedSchemas).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.items'
    );
    expect(visitedSchemas).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.additionalProperties'
    );
    expect(visitedSchemas).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.not'
    );
    expect(visitedSchemas).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.allOf.0'
    );
    expect(visitedSchemas).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.oneOf.0'
    );
    expect(visitedSchemas).toContain(
      'paths./every_flavor.get.responses.200.content.application/json.schema.anyOf.0'
    );
  });
});
