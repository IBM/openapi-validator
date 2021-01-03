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
const { checkCase, walk } = require('../../../utils');
const MessageCarrier = require('../../../utils/messageCarrier');

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
        if (obj.allOf && !Array.isArray(obj.allOf)) {
          messages.addMessage(
            path.concat(['allOf']),
            'allOf value should be an array',
            'error'
          );
        } else if (isOAS3 && obj.oneOf && !Array.isArray(obj.oneOf)) {
          messages.addMessage(
            path.concat(['oneOf']),
            'oneOf value should be an array',
            'error'
          );
        } else if (isOAS3 && obj.anyOf && !Array.isArray(obj.anyOf)) {
          messages.addMessage(
            path.concat(['anyOf']),
            'anyOf value should be an array',
            'error'
          );
        } else if (obj.allOf && Array.isArray(obj.allOf)) {
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

    generateDescriptionWarnings(schema, path, config, isOAS3, messages);

    const checkStatus = config.snake_case_only;
    if (checkStatus !== 'off') {
      checkPropNames(schema, path, config, messages);

      checkEnumValues(schema, path, config, messages);
    } else {
      // optional support for property_case_convention, property_case_collision, and enum_case_convention
      // in config.  In the else block because support should be mutually exclusive
      // with config.snake_case_only since it is overlapping functionality
      if (config.property_case_convention) {
        const checkCaseStatus = config.property_case_convention[0];
        if (checkCaseStatus !== 'off') {
          checkPropNamesCaseConvention(
            schema,
            path,
            config.property_case_convention,
            messages
          );
        }
      }
      if (config.property_case_collision) {
        const checkCaseStatus = config.property_case_collision;
        if (checkCaseStatus !== 'off') {
          checkPropNamesCaseCollision(
            schema,
            path,
            config.property_case_collision,
            messages
          );
        }
      }
      if (config.enum_case_convention) {
        const checkCaseStatus = config.enum_case_convention[0];
        if (checkCaseStatus !== 'off') {
          checkEnumCaseConvention(
            schema,
            path,
            config.enum_case_convention,
            messages
          );
        }
      }
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

  // Special case: check for arrays of arrays
  let checkStatus = config.array_of_arrays;
  if (checkStatus !== 'off' && schema.type === 'array' && schema.items) {
    if (schema.items.type === 'array') {
      messages.addMessage(
        contextPath.concat(['items', 'type']),
        'Array properties should avoid having items of type array.',
        checkStatus,
        'array_of_arrays'
      );
    }
  }

  checkStatus = config.invalid_type_format_pair;
  if (checkStatus !== 'off') {
    typeFormatErrors(schema, contextPath, isOAS3, messages, checkStatus);
  }
}

function typeFormatErrors(obj, path, isOAS3, messages, checkStatus) {
  // error if format defined but not type
  if (!obj.type && obj.format) {
    messages.addMessage(
      path.concat(['format']),
      'Format defined without a type.',
      checkStatus,
      'invalid_type_format_pair'
    );
  }

  // we will check ref in defintions section
  // only proceed if type defined
  if (obj.$ref || !obj.type) {
    return;
  }

  const validIntegerFormats = ['int32', 'int64'];
  const validNumberFormats = ['float', 'double'];
  const validStringFormats = [
    'byte',
    'binary',
    'date',
    'date-time',
    'password'
  ];
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
      if (
        obj.format &&
        !includes(validIntegerFormats, obj.format.toLowerCase())
      ) {
        messages.addMessage(
          path.concat(['type']),
          `Schema of type integer should use one of the following formats: ${validIntegerFormats.join(
            ', '
          )}.`,
          checkStatus,
          'invalid_type_format_pair'
        );
      }
      break;
    case 'number':
      if (
        obj.format &&
        !includes(validNumberFormats, obj.format.toLowerCase())
      ) {
        messages.addMessage(
          path.concat(['type']),
          `Schema of type number should use one of the following formats: ${validNumberFormats.join(
            ', '
          )}.`,
          checkStatus,
          'invalid_type_format_pair'
        );
      }
      break;
    case 'string':
      if (
        obj.format &&
        !includes(validStringFormats, obj.format.toLowerCase())
      ) {
        messages.addMessage(
          path.concat(['type']),
          `Schema of type string should use one of the following formats: ${validStringFormats.join(
            ', '
          )}.`,
          checkStatus,
          'invalid_type_format_pair'
        );
      }
      break;
    case 'boolean':
      // No valid formats for boolean, format should be undefined
      if (obj.format !== undefined) {
        messages.addMessage(
          path.concat(['type']),
          `Schema of type boolean should not have a format.`,
          checkStatus,
          'invalid_type_format_pair'
        );
      }
      break;
    case 'object':
      // No valid format pairings for object, format should be undefined
      if (obj.format !== undefined) {
        messages.addMessage(
          path.concat(['type']),
          'Schema of type object should not have a format.',
          checkStatus,
          'invalid_type_format_pair'
        );
      }
      break;
    case 'array':
      // No valid format pairings for array, format should be undefined
      if (obj.format !== undefined) {
        messages.addMessage(
          path.concat(['type']),
          'Schema of type array should not have a format.',
          checkStatus,
          'invalid_type_format_pair'
        );
      }
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
    default:
      // invalid type
      messages.addMessage(
        path.concat(['type']),
        `Invalid type. Valid types are: ${validTypes.join(', ')}.`,
        checkStatus,
        'invalid_type_format_pair'
      );
  }
}

// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#models
function generateDescriptionWarnings(
  schema,
  contextPath,
  config,
  isOAS3,
  messages
) {
  // determine if this is a top-level schema
  const isTopLevelSchema = isOAS3
    ? contextPath.length === 3 &&
      contextPath[0] === 'components' &&
      contextPath[1] === 'schemas'
    : contextPath.length === 2 && contextPath[0] === 'definitions';

  // Check description in schema only for "top level" schema
  const hasDescription =
    schema.description && schema.description.toString().trim().length;
  if (isTopLevelSchema && !hasDescription) {
    messages.addMessage(
      contextPath,
      'Schema must have a non-empty description.',
      config.no_schema_description,
      'no_schema_description'
    );
  }

  if (!schema.properties) {
    return;
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
      messages.addMessage(
        path,
        'Schema properties must have a description with content in it.',
        config.no_property_description,
        'no_property_description'
      );
    } else {
      // if the property does have a description, "Avoid describing a model as a 'JSON object' since this will be incorrect for some SDKs."
      const mentionsJSON = includes(property.description.toLowerCase(), 'json');
      if (mentionsJSON) {
        messages.addMessage(
          path,
          'Not all languages use JSON, so descriptions should not state that the model is a JSON object.',
          config.description_mentions_json,
          'description_mentions_json'
        );
      }
    }
  });
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

/**
 * Check that property names follow the specified case convention
 * @param schema
 * @param contextPath
 * @param checkStatus a string, 'off' | 'warning' | 'error'
 * @param messages
 */
function checkPropNamesCaseCollision(
  schema,
  contextPath,
  checkStatus,
  messages
) {
  if (!schema.properties) {
    return;
  }

  // flag any property whose name is identical to another property in a different case
  const prevProps = [];
  forIn(schema.properties, (property, propName) => {
    if (propName.slice(0, 2) === 'x-') return;

    // Skip case_convention checks for deprecated properties
    if (propName.deprecated === true) return;

    const caselessPropName = propName.replace(/[_-]/g, '').toLowerCase();
    if (prevProps.includes(caselessPropName)) {
      messages.addMessage(
        contextPath.concat(['properties', propName]),
        `Property name is identical to another property except for the naming convention: ${propName}`,
        checkStatus,
        'property_case_collision'
      );
    } else {
      prevProps.push(caselessPropName);
    }
  });
}

/**
 * Check that property names follow the specified case convention
 * @param schema
 * @param contextPath
 * @param caseConvention an array, [0]='off' | 'warning' | 'error'. [1]='lower_snake_case' etc.
 * @param messages
 */
function checkPropNamesCaseConvention(
  schema,
  contextPath,
  caseConvention,
  messages
) {
  if (!schema.properties || !caseConvention) {
    return;
  }

  // flag any property whose name does not follow the case convention
  forIn(schema.properties, (property, propName) => {
    if (propName.slice(0, 2) === 'x-') return;

    // Skip case_convention checks for deprecated properties
    if (property.deprecated === true) return;

    const checkStatus = caseConvention[0] || 'off';
    if (checkStatus.match('error|warning')) {
      const caseConventionValue = caseConvention[1];

      const isCorrectCase = checkCase(propName, caseConventionValue);
      if (!isCorrectCase) {
        messages.addMessage(
          contextPath.concat(['properties', propName]),
          `Property names must follow case convention: ${caseConventionValue}`,
          checkStatus,
          'property_case_convention'
        );
      }
    }
  });
}

function checkEnumValues(schema, contextPath, config, messages) {
  if (!schema.enum) {
    return;
  }

  for (let i = 0; i < schema.enum.length; i++) {
    const enumValue = schema.enum[i];
    if (typeof enumValue === 'string') {
      const checkStatus = config.snake_case_only || 'off';
      if (checkStatus.match('error|warning')) {
        if (!checkCase(enumValue, 'lower_snake_case')) {
          messages.addMessage(
            contextPath.concat(['enum', i.toString()]),
            'Enum values must be lower snake case.',
            checkStatus,
            'snake_case_only'
          );
        }
      }
    }
  }
}

/**
 * Check that enum values follow the specified case convention
 * @param schema
 * @param contextPath
 * @param caseConvention an array, [0]='off' | 'warning' | 'error'. [1]='lower_snake_case' etc.
 * @param messages
 */
function checkEnumCaseConvention(
  schema,
  contextPath,
  caseConvention,
  messages
) {
  if (!schema.enum || !caseConvention) {
    return;
  }

  for (let i = 0; i < schema.enum.length; i++) {
    const enumValue = schema.enum[i];
    if (typeof enumValue === 'string') {
      const checkStatus = caseConvention[0] || 'off';
      if (checkStatus.match('error|warning')) {
        const caseConventionValue = caseConvention[1];
        const isCorrectCase = checkCase(enumValue, caseConventionValue);
        if (!isCorrectCase) {
          messages.addMessage(
            contextPath.concat(['enum', i.toString()]),
            `Enum values must follow case convention: ${caseConventionValue}`,
            checkStatus,
            'enum_case_convention'
          );
        }
      }
    }
  }
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
              configOption,
              'inconsistent_property_type'
            );
          }
          messages.addMessage(
            contextPath.concat(['properties', key]).join('.'),
            `Property has inconsistent type: ${key}.`,
            configOption,
            'inconsistent_property_type'
          );
        }
      } else {
        propertiesToCompare[key] = {
          type: value.type,
          path: contextPath.concat(['properties', key]).join('.'),
          printed: false
        };
      }
    }
  }
}
