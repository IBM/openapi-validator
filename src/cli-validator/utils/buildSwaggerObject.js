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
  const parser = new RefParser();

  // in case of multi-file specifications, bundle the spec into one file with
  // only internal refs. use this for the spec string and the js spec
  const bundledSpec = await parser.bundle(copyObject(input));

  // formatting the JSON string with indentations is necessary for the
  //   validations that use it with regular expressions (e.g. refs.js)
  const indentationSpaces = 2;
  swagger.specStr = JSON.stringify(bundledSpec, null, indentationSpaces);

  // deep copy input to a jsSpec by parsing the spec string.
  // just setting it equal to 'input' and then calling 'dereference'
  //   replaces 'input' with the dereferenced object, which is bad
  swagger.jsSpec = JSON.parse(swagger.specStr);

  // dereference() resolves all references. it esentially returns the resolvedSpec,
  //   but without the $$ref tags (which are not used in the validations)
  parser.dereference.circular = false;
  // passes the parser a copy of the spec to keep the original spec intact
  swagger.resolvedSpec = await parser.dereference(copyObject(input));
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

// copy an object such that changes to the copy won't affect the original
function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}
