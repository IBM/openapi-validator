const SwaggerParser = require('swagger-parser');

// get the api schema to perform structural validation against
const apiSchema = require('../../plugins/validation/apis/schema').default;

// ### all validations expect an object with three properties: ###
// ###          jsSpec, resolvedSpec, and specStr              ###

module.exports = async function(input) {
  // initialize an object to be passed through all the validators
  const swagger = {};

  // the structural validation expects a `settings` object
  //  describing which schemas to validate against
  swagger.settings = {
    schemas: [apiSchema],
    testSchema: apiSchema
  };

  // formatting the JSON string with indentations is necessary for the
  //   validations that use it with regular expressions (e.g. refs.js)
  const indentationSpaces = 2;
  swagger.specStr = JSON.stringify(input, null, indentationSpaces);

  // deep copy input to a jsSpec by parsing the spec string.
  // just setting it equal to 'input' and then calling 'dereference'
  //   replaces 'input' with the dereferenced object, which is bad
  swagger.jsSpec = JSON.parse(swagger.specStr);

  // dereference() resolves all references. it esentially returns the resolvedSpec,
  //   but without the $$ref tags (which are not used in the validations)
  const parser = new SwaggerParser();
  parser.dereference.circular = false;
  swagger.resolvedSpec = await parser.dereference(input);
  swagger.circular = parser.$refs.circular;

  return swagger;
};
