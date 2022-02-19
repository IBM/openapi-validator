// invalid_type_format_pair:
// Schemas need to have properly matching type/format pairs

// snake_case_only:
// Property names and enum values MUST be lower snake case.
// https://pages.github.ibm.com/CloudEngineering/api_handbook/design/terminology.html#formatting

// no_schema_description: [REMOVED]
// Schema objects should have a description

// no_property_description: [REMOVED]
// Properties within schema objects should have descriptions

// description_mentions_json: [REMOVED]
// Schema property descriptions should not state that model will be a JSON object

// array_of_arrays: [REMOVED]
// Schema properties that are arrays should avoid having items that are also arrays

const forIn = require('lodash/forIn');
const { checkCase, walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/message-carrier');

module.exports.validate = function({ jsSpec, isOAS3 }, config) {
  const messages = new MessageCarrier();

  config = config.schemas;

  const schemas = [];

  walk(jsSpec, [], function(obj, path) {
    const current = path[path.length - 1];

    /*
      Collect all schemas for later analysis.  The logic should capture the following:
      - Swagger2
        - Everything in the top-level "definitions" object
        - Properties within all models
        - The schema for all body parameters,
            both in operations and the top-level "parameters" object
        - The schema for all responses,
            both in operations and the top-level "responses" object
      - OpenAPI 3
        - Everything in the "schemas" section of the top-level "components" object
        - Properties within all models
        - The schema for all parameters (that have a schema),
            both in operations and the "parameters" section of the top-level "components" object
        - The schema for all media type objects (any object within a "content" property)
            This includes responses, request bodies, parameters (with content rather than schema),
            both at the operation level and within the top-level "components" object
    */
    const modelLocations = [
      'definitions',
      'schemas',
      'properties',
      'parameters'
    ];
    if (
      current === 'schema' ||
      current === 'items' ||
      modelLocations.includes(path[path.length - 2])
    ) {
      const pushLeafSchemas = (obj, path) => {
        if (obj.allOf && Array.isArray(obj.allOf)) {
          obj.allOf.forEach((e, i) =>
            pushLeafSchemas(e, [...path, 'allOf', i])
          );
        } else if (isOAS3 && obj.oneOf && Array.isArray(obj.oneOf)) {
          obj.oneOf.forEach((e, i) =>
            pushLeafSchemas(e, [...path, 'oneOf', i])
          );
        } else if (isOAS3 && obj.anyOf && Array.isArray(obj.anyOf)) {
          obj.anyOf.forEach((e, i) =>
            pushLeafSchemas(e, [...path, 'anyOf', i])
          );
        } else {
          schemas.push({ schema: obj, path });
        }
      };
      pushLeafSchemas(obj, path);
    }
  });

  // Collect the properties info. Pass it to checkProperties to catch
  // properties that have the same name but an inconsistent type.
  const propertiesToCompare = {};

  schemas.forEach(({ schema, path }) => {
    generateFormatErrors(schema, path, config, isOAS3, messages);

    const checkStatus = config.snake_case_only;
    if (checkStatus !== 'off') {
      checkPropNames(schema, path, config, messages);
    }
    if (config.inconsistent_property_type !== 'off') {
      checkProperties(
        schema,
        propertiesToCompare,
        path,
        config.inconsistent_property_type,
        messages
      );
    }
  });

  return messages;
};

// Flag as an error any property that does not have a recognized "type" and "format" according to the
// [Swagger 2.0 spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types)
function generateFormatErrors(schema, contextPath, config, isOAS3, messages) {
  if (schema.$ref) {
    return;
  }

  const checkStatus = config.invalid_type_format_pair;
  if (checkStatus !== 'off') {
    typeFormatErrors(schema, contextPath, isOAS3, messages, checkStatus);
  }
}

function typeFormatErrors(obj, path, isOAS3, messages, checkStatus) {
  // we will check ref in defintions section
  // only proceed if type defined
  if (obj.$ref || !obj.type) {
    return;
  }

  const validTypes = [
    'integer',
    'number',
    'string',
    'boolean',
    'object',
    'array'
  ];
  if (!isOAS3) {
    validTypes.push('file');
  }
  switch (obj.type) {
    case 'integer':
    case 'number':
    case 'string':
    case 'boolean':
    case 'object':
    case 'array':
      // ignoring all these types in favor of the new valid-type-format rule.
      break;
    case 'file':
      // schemas of type file are allowed in swagger2 for responses and parameters
      // of type 'formData'
      // note: type file is only allowed for root schemas (not properties, etc.)
      if (isOAS3 || (!obj.in && !isRootSchema(path))) {
        messages.addMessage(
          path.concat(['type']),
          'File type only valid for swagger2 and must be used as root schema.',
          checkStatus,
          'invalid_type_format_pair'
        );
      } else if (obj.in && obj.in !== 'formData') {
        messages.addMessage(
          path.concat(['type']),
          'File type parameter must use in: formData.',
          checkStatus,
          'invalid_type_format_pair'
        );
      }
      // Format should not be defined for schema of type file.
      // Error reported in addition to potential error above.
      // Only check for swagger2 because type file should not be used in OAS3.
      if (!isOAS3 && obj.format !== undefined) {
        messages.addMessage(
          path.concat(['type']),
          'Schema of type file should not have a format.',
          checkStatus,
          'invalid_type_format_pair'
        );
      }
      break;
  }
}

// https://pages.github.ibm.com/CloudEngineering/api_handbook/design/terminology.html#formatting
function checkPropNames(schema, contextPath, config, messages) {
  if (!schema.properties) {
    return;
  }

  // flag any property whose name is not "lower snake case"
  forIn(schema.properties, (property, propName) => {
    if (propName.slice(0, 2) === 'x-') return;

    // Skip snake_case_only checks for deprecated properties
    if (property.deprecated === true) return;

    const checkStatus = config.snake_case_only || 'off';
    if (checkStatus.match('error|warning')) {
      if (!checkCase(propName, 'lower_snake_case')) {
        messages.addMessage(
          contextPath.concat(['properties', propName]),
          'Property names must be lower snake case.',
          checkStatus,
          'snake_case_only'
        );
      }
    }
  });
}

// NOTE: this function is Swagger 2 specific and would need to be adapted to be used with OAS
function isRootSchema(path) {
  const current = path[path.length - 1];
  const parent = path[path.length - 2];

  // `schema` can only exist in parameter or response objects
  // root schemas can also appear under a variable key in the `definitions` section
  // if it is the top level `definitions` section (rather than some property named "definitions"),
  // the path length will be 2
  return (
    current === 'schema' || (parent === 'definitions' && path.length === 2)
  );
}

// Flag any properties that have the same name but an inconsistent type.
function checkProperties(
  schema,
  propertiesToCompare,
  contextPath,
  configOption,
  messages
) {
  if (!schema.properties) return;

  for (const [key, value] of Object.entries(schema.properties)) {
    // skips properties that use $ref
    if (value.type) {
      if (propertiesToCompare[key]) {
        if (propertiesToCompare[key].type !== value.type) {
          // First property that appeared in API def, should only print once.
          if (!propertiesToCompare[key].printed) {
            propertiesToCompare[key].printed = true;
            messages.addMessage(
              propertiesToCompare[key].path,
              `Property has inconsistent type: ${key}.`,
              configOption[0],
              'inconsistent_property_type'
            );
          }
          messages.addMessage(
            contextPath.concat(['properties', key]).join('.'),
            `Property has inconsistent type: ${key}.`,
            configOption[0],
            'inconsistent_property_type'
          );
        }
      } else {
        if (configOption && configOption[1] && !configOption[1].includes(key)) {
          // add property if the name is not excluded
          propertiesToCompare[key] = {
            type: value.type,
            path: contextPath.concat(['properties', key]).join('.'),
            printed: false
          };
        }
      }
    }
  }
}
