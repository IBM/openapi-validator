// Assertation 1:
// check if swagger field exist

// Assertation 2:
// make sure the swagger field is of type string

// Assertation 3:
// make sure the value of swagger field must be "2.0"

module.exports.validate = function({ jsSpec }) {
  const errors = [];
  const warnings = [];

  const swagger = jsSpec.swagger;

  if (!swagger) {
    errors.push({
      path: ['swagger'],
      message: 'API definition must have an `swagger` field'
    });
  } else if (typeof swagger !== 'string') {
    errors.push({
      path: ['swagger'],
      message: 'API definition must have an `swagger` field as type string'
    });
  } else if (swagger !== '2.0') {
    errors.push({
      path: ['swagger'],
      message: '`swagger` string must have the value `2.0`'
    });
  }
  return { errors, warnings };
};
