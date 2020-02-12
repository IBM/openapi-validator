// Assertation 1:
// check if openapi field exist

// Assertation 2:
// make sure the field is of type string

// Assertation 3:
// make sure the string follows semantic versioning 2.0.0

module.exports.validate = function({ jsSpec }) {
  const errors = [];
  const warnings = [];

  // Regex taken from Semantic Versioning 2.0.0 documentation to check if string follows Semantic Versioning
  // https://semver.org/
  // Regex from: https://regex101.com/r/vkijKf/1/

  const semverRegex = new RegExp(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm
  );

  const openapi = jsSpec.openapi;

  if (!openapi) {
    errors.push({
      path: ['openapi'],
      message: 'API definition must have an `openapi` field'
    });
  } else if (typeof openapi !== 'string') {
    errors.push({
      path: ['openapi'],
      message: 'API definition must have an `openapi` field as type string'
    });
  } else if (!openapi.match(semverRegex)) {
    errors.push({
      path: ['openapi'],
      message: '`openapi` string must follow Semantic Versioning 2.0.0'
    });
  }
  return { errors, warnings };
};
