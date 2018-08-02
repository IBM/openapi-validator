const RefParser = require('json-schema-ref-parser');
const getVersion = require('./getOpenApiVersion');

// get the api schema to perform structural validation against
const apiSchema2 = require('../../plugins/validation/swagger2/apis/swagger2-schema')
  .default;

const apiSchema3 = require('../../plugins/validation/oas3/apis/oas3-schema')
  .default;

const schemas = {
  '2': {
    apiSchema: apiSchema2
  },
  '3': {
    apiSchema: apiSchema3
  }
};

// ### all validations expect an object with three properties: ###
// ###          jsSpec, resolvedSpec, and specStr              ###
module.exports = async function(input) {
  // initialize an object to be passed through all the validators
  const swagger = {};

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
  const parser = new RefParser();
  parser.dereference.circular = false;
  swagger.resolvedSpec = await parser.dereference(input);
  swagger.circular = parser.$refs.circular;

  const version = getVersion(swagger.jsSpec);
  const { apiSchema } = schemas[version];

  // the structural validation expects a `settings` object
  //  describing which schemas to validate against
  swagger.settings = {
    schemas: [apiSchema],
    testSchema: apiSchema
  };

  return swagger;
};
