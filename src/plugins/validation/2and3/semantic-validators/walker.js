// Walks an entire spec.

// Assertation 1:
// `type` values for properties must be strings
// multi-type properties are not allowed

// Assertation 2:
// In specific areas of a spec, allowed $ref values are restricted.

// Assertation 3:
// Sibling keys with $refs are not allowed - default set to `off`
// http://watson-developer-cloud.github.io/api-guidelines/swagger-coding-style#sibling-elements-for-refs

const match = require('matcher');
const { walk } = require('../../../utils');

module.exports.validate = function({ jsSpec, isOAS3 }, config) {
  const result = {};
  result.error = [];
  result.warning = [];

  config = config.walker;

  walk(jsSpec, [], function(obj, path) {
    // parent keys that allow non-string "type" properties. for example,
    // having a definition called "type" is allowed
    const allowedParents = isOAS3
      ? [
          'schemas',
          'properties',
          'responses',
          'parameters',
          'requestBodies',
          'headers',
          'securitySchemes'
        ]
      : [
          'definitions',
          'properties',
          'parameters',
          'responses',
          'securityDefinitions'
        ];

    ///// "type" should always have a string-type value, everywhere.
    if (obj.type && allowedParents.indexOf(path[path.length - 1]) === -1) {
      if (typeof obj.type !== 'string') {
        result.error.push({
          path: [...path, 'type'],
          message: '"type" should be a string'
        });
      }
    }

    ///// Minimums and Maximums

    if (obj.maximum && obj.minimum) {
      if (greater(obj.minimum, obj.maximum)) {
        result.error.push({
          path: path.concat(['minimum']),
          message: 'Minimum cannot be more than maximum'
        });
      }
    }

    if (obj.maxProperties && obj.minProperties) {
      if (greater(obj.minProperties, obj.maxProperties)) {
        result.error.push({
          path: path.concat(['minProperties']),
          message: 'minProperties cannot be more than maxProperties'
        });
      }
    }

    if (obj.maxLength && obj.minLength) {
      if (greater(obj.minLength, obj.maxLength)) {
        result.error.push({
          path: path.concat(['minLength']),
          message: 'minLength cannot be more than maxLength'
        });
      }
    }

    ///// Restricted $refs -- only check internal refs
    if (obj.$ref && obj.$ref.startsWith('#')) {
      const blacklistPayload = getRefPatternBlacklist(path, isOAS3);
      const refBlacklist = blacklistPayload.blacklist || [];
      const matches = match([obj.$ref], refBlacklist);

      if (refBlacklist && refBlacklist.length && matches.length) {
        // Assertation 2
        // use the slice(1) to remove the `!` negator from the string
        const checkStatus = config.incorrect_ref_pattern;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path: [...path, '$ref'],
            message: `${
              blacklistPayload.location
            } $refs must follow this format: ${refBlacklist[0].slice(1)}`
          });
        }
      }
    }

    const keys = Object.keys(obj);
    keys.forEach(k => {
      if (keys.indexOf('$ref') > -1 && k !== '$ref') {
        const checkStatus = config.$ref_siblings;
        if (checkStatus !== 'off') {
          result[checkStatus].push({
            path: path.concat([k]),
            message: 'Values alongside a $ref will be ignored.'
          });
        }
      }
    });
  });

  return { errors: result.error, warnings: result.warning };
};

// values are globs!
const unacceptableRefPatternsS2 = {
  responses: ['!*#/responses*'],
  schema: ['!*#/definitions*'],
  parameters: ['!*#/parameters*']
};

const unacceptableRefPatternsOAS3 = {
  responses: ['!*#/components/responses*'],
  schema: ['!*#/components/schemas*'],
  parameters: ['!*#/components/parameters*'],
  requestBody: ['!*#/components/requestBodies*'],
  security: ['!*#/components/securitySchemes*'],
  callbacks: ['!*#/components/callbacks*'],
  examples: ['!*#/components/examples*'],
  headers: ['!*#/components/headers*'],
  links: ['!*#/components/links*']
};

const exceptionedParents = ['properties'];

function getRefPatternBlacklist(path, isOAS3) {
  const unacceptableRefPatterns = isOAS3
    ? unacceptableRefPatternsOAS3
    : unacceptableRefPatternsS2;
  let location = '';
  const blacklist = path.reduce((prev, curr, i) => {
    const parent = path[i - 1];
    if (
      unacceptableRefPatterns[curr] &&
      exceptionedParents.indexOf(parent) === -1
    ) {
      location = curr;
      return unacceptableRefPatterns[curr];
    } else {
      return prev;
    }
  }, null);
  return { blacklist, location };
}

function greater(a, b) {
  // is a greater than b?
  return a > b;
}
