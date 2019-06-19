// invalid_type_format_pair:
// Schemas need to have properly matching type/format pairs

// snake_case_only:
// Property names and enum values MUST be lower snake case.
// https://pages.github.ibm.com/CloudEngineering/api_handbook/design/terminology.html#formatting

// no_schema_description:
// Schema objects should have a description

// no_property_description:
// Properties within schema objects should have descriptions

// description_mentions_json:
// Schema property descriptions should not state that model will be a JSON object

// array_of_arrays:
// Schema properties that are arrays should avoid having items that are also arrays

const forIn = require('lodash/forIn');
const includes = require('lodash/includes');
const isSnakecase = require('../../../utils/checkSnakeCase');
const checkCase = require('../../../utils/caseConventionCheck');
const walk = require('../../../utils/walk');

module.exports.validate = function({ jsSpec, isOAS3 }, config) {
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

  schemas.forEach(({ schema, path }) => {
    let res = generateFormatErrors(schema, path, config, isOAS3);
    errors.push(...res.error);
    warnings.push(...res.warning);

    res = generateDescriptionWarnings(schema, path, config, isOAS3);
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
    } else {
      // optional support for property_case_convention and enum_case_convention
      // in config.  In the else block because support should be mutually exclusive
      // with config.snake_case_only since it is overlapping functionality
      if (config.property_case_convention) {
        const checkCaseStatus = config.property_case_convention[0];
        if (checkCaseStatus !== 'off') {
          res = checkPropNamesCaseConvention(
            schema,
            path,
            config.property_case_convention
          );
          errors.push(...res.error);
          warnings.push(...res.warning);
        }
      }
      if (config.enum_case_convention) {
        const checkCaseStatus = config.enum_case_convention[0];
        if (checkCaseStatus !== 'off') {
          res = checkEnumCaseConvention(
            schema,
            path,
            config.enum_case_convention
          );
          errors.push(...res.error);
          warnings.push(...res.warning);
        }
      }
    }
  });

  return { errors, warnings };
};

// Flag as an error any property that does not have a recognized "type" and "format" according to the
// [Swagger 2.0 spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types)
function generateFormatErrors(schema, contextPath, config, isOAS3) {
  const result = {};
  result.error = [];
  result.warning = [];

  if (schema.$ref) {
    return result;
  }

  // Special case: check for arrays of arrays
  let checkStatus = config.array_of_arrays;
  if (checkStatus !== 'off' && schema.type === 'array' && schema.items) {
    if (schema.items.type === 'array') {
      const path = contextPath.concat(['items', 'type']);
      const message =
        'Array properties should avoid having items of type array.';
      result[checkStatus].push({ path, message });
    }
  }

  checkStatus = config.invalid_type_format_pair;
  if (checkStatus !== 'off' && !formatValid(schema, contextPath, isOAS3)) {
    const path = contextPath.concat(['type']);
    const message = 'Property type+format is not well-defined.';
    result[checkStatus].push({ path, message });
  }

  return result;
}

function formatValid(property, path, isOAS3) {
  if (property.$ref) {
    return true;
  }
  // if type is not present, skip validation of format
  if (!property.type) {
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
    case 'array':
      valid = true;
      break;
    case 'file':
      // schemas of type file are allowed in swagger2 for responses and parameters
      // of type 'formData' - the violating parameters are caught by parameters-ibm
      // note: type file is only allowed for root schemas (not properties, etc.)
      valid = !isOAS3 && isRootSchema(path);
      break;
    default:
      valid = false;
  }
  return valid;
}

// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#models
function generateDescriptionWarnings(schema, contextPath, config, isOAS3) {
  const result = {};
  result.error = [];
  result.warning = [];

  // determine if this is a top-level schema
  const isTopLevelSchema = isOAS3
    ? contextPath.length === 3 &&
      contextPath[0] === 'components' &&
      contextPath[1] === 'schemas'
    : contextPath.length === 2 && contextPath[0] === 'definitions';

  // Check description in schema only for "top level" schema
  if (isTopLevelSchema) {
    const checkStatus = config.no_schema_description;
    if (result[checkStatus]) {
      const hasDescription =
        schema.description && schema.description.toString().trim().length;
      if (!hasDescription) {
        const message = 'Schema must have a non-empty description.';
        result[checkStatus].push({
          path: contextPath,
          message: message
        });
      }
    }
  }

  if (!schema.properties) {
    return result;
  }

  // verify that every property of the model has a description
  forIn(schema.properties, (property, propName) => {
    // if property is defined by a ref, it does not need a description
    if (!property || property.$ref || propName.slice(0, 2) === 'x-') return;

    // if property has a allOf, anyOf, or oneOf schema, it does not needs a description
    if (property.allOf || property.anyOf || property.oneOf) return;

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

/**
 * Check that property names follow the specified case convention
 * @param schema
 * @param contextPath
 * @param caseConvention an array, [0]='off' | 'warning' | 'error'. [1]='lower_snake_case' etc.
 */
function checkPropNamesCaseConvention(schema, contextPath, caseConvention) {
  const result = {};
  result.error = [];
  result.warning = [];

  if (!schema.properties) {
    return result;
  }
  if (!caseConvention) {
    return result;
  }

  // flag any property whose name does not follow the case convention
  forIn(schema.properties, (property, propName) => {
    if (propName.slice(0, 2) === 'x-') return;

    const checkStatus = caseConvention[0] || 'off';
    if (checkStatus.match('error|warning')) {
      const caseConventionValue = caseConvention[1];

      const isCorrectCase = checkCase(propName, caseConventionValue);
      if (!isCorrectCase) {
        result[checkStatus].push({
          path: contextPath.concat(['properties', propName]),
          message: `Property names must follow case convention: ${caseConventionValue}`
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
    if (typeof enumValue === 'string') {
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
  }

  return result;
}

/**
 * Check that enum values follow the specified case convention
 * @param schema
 * @param contextPath
 * @param caseConvention an array, [0]='off' | 'warning' | 'error'. [1]='lower_snake_case' etc.
 */
function checkEnumCaseConvention(schema, contextPath, caseConvention) {
  const result = {};
  result.error = [];
  result.warning = [];

  if (!schema.enum) {
    return result;
  }
  if (!caseConvention) {
    return result;
  }

  for (let i = 0; i < schema.enum.length; i++) {
    const enumValue = schema.enum[i];
    if (typeof enumValue === 'string') {
      const checkStatus = caseConvention[0] || 'off';
      if (checkStatus.match('error|warning')) {
        const caseConventionValue = caseConvention[1];
        const isCorrectCase = checkCase(enumValue, caseConventionValue);
        if (!isCorrectCase) {
          result[checkStatus].push({
            path: contextPath.concat(['enum', i.toString()]),
            message: `Enum values must follow case convention: ${caseConventionValue}`
          });
        }
      }
    }
  }

  return result;
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

