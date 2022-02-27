const { oas2, oas3 } = require('@stoplight/spectral-formats');
const { parameterCaseConvention } = require('../functions');
const { parameters } = require('../collections');

module.exports = {
  description: 'Parameter names must follow case conventions',
  message: '{{error}}',
  formats: [oas2, oas3],
  given: parameters,
  severity: 'error',
  resolved: true,
  then: {
    function: parameterCaseConvention,

    // The configuration of this rule should be an object
    // with keys that represent the different parameter types
    // to be checked for property casing conventions: 'query', 'path', and 'header'.
    // The value of each key should be an object that is the appropriate
    // configuration needed by Spectral's casing() function to enforce the desired
    // case convention for parameters of that type.
    // To disable case convention checks for a particular parameter type,
    // simply remove that entry from the config object.
    functionOptions: {
      // Allow snake case for query parameter names,
      // but also allow '.' within the name.
      query: {
        type: 'snake',
        separator: {
          char: '.'
        }
      },

      // Allow snake case for path parameter names.
      path: {
        type: 'snake'
      },

      // Allow header parameter names to be in canonical header name form (e.g. X-My-Header).
      header: {
        type: 'pascal',
        separator: {
          char: '-'
        }
      }
    }
  }
};
