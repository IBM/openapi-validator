// invalid_type_format_pair:
// Schemas need to have properly matching type/format pairs

// snake_case_only:
// Property names and enum values MUST be lower snake case.
// https://pages.github.ibm.com/CloudEngineering/api_handbook/design/terminology.html#formatting

// no_property_description:
// Properties within schema objects should have descriptions

// description_mentions_json:
// Schema property descriptions should not state that model will be a JSON object

// array_of_arrays:
// Schema properties that are arrays should avoid having items that are also arrays

const forIn = require('lodash/forIn');
const includes = require('lodash/includes');
const isSnakecase = require('../../../utils/checkSnakeCase');
const walk = require('../../../utils/walk');

const compositeKeywords = ['allOf', 'anyOf', 'oneOf'];

module.exports.validate = function({ jsSpec }, config) {
  const errors = [];
  const warnings = [];

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
    const modelLocations = ['definitions', 'schemas', 'properties'];
    if (
      current === 'schema' ||
      current === 'items' ||
      modelLocations.indexOf(path[path.length - 2]) > -1
    ) {
      schemas.push({ schema: obj, path });
    }
  });

  schemas.forEach(({ schema, path }) => {
    let res = generateFormatErrors(schema, path, config);
    errors.push(...res.error);
    warnings.push(...res.warning);

    res = generateDescriptionWarnings(schema, path, config);
    errors.push(...res.error);
    warnings.push(...res.warning);

    const checkStatus = config.snake_case_only;
    if (checkStatus !== 'off') {
      res = checkPropNames(schema, path, config);
      errors.push(...res.error);
      warnings.push(...res.warning);

      res = checkEnumValues(schema, path, config);
      errors.push(...res.error);
      warnings.push(...res.warning);
    }
  });

  return { errors, warnings };
};

// Flag as an error any property that does not have a recognized "type" and "format" according to the
// [Swagger 2.0 spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types)
function generateFormatErrors(schema, contextPath, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  const f = (property, propName) => {
    if (property.$ref || propName.slice(0, 2) === 'x-') return;
    let path = contextPath.concat(['properties', propName, 'type']);
    let valid = true;

    compositeKeywords.forEach(compositeKeyword => {
      if (property[compositeKeyword]) {
        valid = false;
      }
    });

    if (!valid) {
      return;
    }

    switch (property.type) {
      case 'integer':
      case 'number':
      case 'string':
      case 'boolean':
        valid = formatValid(property);
        break;
      case 'array':
        path = contextPath.concat(['properties', propName, 'items', 'type']);
        if (property.items) {
          if (property.items.type === 'array') {
            const message =
              'Array properties should avoid having items of type array.';
            const checkStatus = config.array_of_arrays;
            if (checkStatus !== 'off') {
              result[checkStatus].push({ path, message });
            }
          } else {
            valid = formatValid(property.items);
          }
        }
        break;
      case 'object':
        valid = true; // TODO: validate nested schemas
        break;
      case null:
        valid = true; // Not valid, but should be flagged because type is required
        break;
      default:
        valid = false;
    }

    if (!valid) {
      const message = 'Property type+format is not well-defined.';
      const checkStatus = config.invalid_type_format_pair;
      if (checkStatus !== 'off') {
        result[checkStatus].push({
          path,
          message
        });
      }
    }
  };

  if (schema.properties) {
    forIn(schema.properties, f);
  } else {
    compositeKeywords.forEach(compositeKeyword => {
      if (schema[compositeKeyword]) {
        forIn(schema[compositeKeyword], f);
      }
    });
  }

  return result;
}

function formatValid(property) {
  if (property.$ref) {
    return true;
  }
  let valid = true;
  switch (property.type) {
    case 'integer':
      valid =
        !property.format ||
        includes(['int32', 'int64'], property.format.toLowerCase());
      break;
    case 'number':
      valid =
        !property.format ||
        includes(['float', 'double'], property.format.toLowerCase());
      break;
    case 'string':
      valid =
        !property.format ||
        includes(
          ['byte', 'binary', 'date', 'date-time', 'password'],
          property.format.toLowerCase()
        );
      break;
    case 'boolean':
      valid = property.format === undefined; // No valid formats for boolean -- should be omitted
      break;
    case 'object':
      valid = true; // TODO: validate nested schemas
      break;
    default:
      valid = false;
  }
  return valid;
}

// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#models
function generateDescriptionWarnings(schema, contextPath, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  if (!schema.properties) {
    return result;
  }

  // verify that every property of the model has a description
  forIn(schema.properties, (property, propName) => {
    // if property is defined by a ref, it does not need a description
    if (property.$ref || propName.slice(0, 2) === 'x-') return;

    const path = contextPath.concat(['properties', propName, 'description']);

    const hasDescription =
      property.description && property.description.toString().trim().length;
    if (!hasDescription) {
      const message =
        'Schema properties must have a description with content in it.';
      const checkStatus = config.no_property_description;
      if (checkStatus !== 'off') {
        result[checkStatus].push({
          path,
          message
        });
      }
    } else {
      // if the property does have a description, "Avoid describing a model as a 'JSON object' since this will be incorrect for some SDKs."
      const mentionsJSON = includes(property.description.toLowerCase(), 'json');
      if (mentionsJSON) {
        const message =
          'Not all languages use JSON, so descriptions should not state that the model is a JSON object.';
        const checkStatus = config.description_mentions_json;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path,
            message
          });
        }
      }
    }
  });

  return result;
}

// https://pages.github.ibm.com/CloudEngineering/api_handbook/design/terminology.html#formatting
function checkPropNames(schema, contextPath, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  if (!schema.properties) {
    return result;
  }

  // flag any property whose name is not "lower snake case"
  forIn(schema.properties, (property, propName) => {
    if (propName.slice(0, 2) === 'x-') return;

    const checkStatus = config.snake_case_only || 'off';
    if (checkStatus.match('error|warning')) {
      if (!isSnakecase(propName)) {
        result[checkStatus].push({
          path: contextPath.concat(['properties', propName]),
          message: 'Property names must be lower snake case.'
        });
      }
    }
  });

  return result;
}

function checkEnumValues(schema, contextPath, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  if (!schema.enum) {
    return result;
  }

  for (let i = 0; i < schema.enum.length; i++) {
    const enumValue = schema.enum[i];

    const checkStatus = config.snake_case_only || 'off';
    if (checkStatus.match('error|warning')) {
      if (!isSnakecase(enumValue)) {
        result[checkStatus].push({
          path: contextPath.concat(['enum', i.toString()]),
          message: 'Enum values must be lower snake case.'
        });
      }
    }
  }

  return result;
}
