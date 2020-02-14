// Assertation 1:
// check if openapi field exist

// Assertation 2:
// make sure the field is of type string

// Assertation 3:
// make sure the string follows semantic versioning 2.0.0

const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec }) {
  const messages = new MessageCarrier();

  // Regex taken from Semantic Versioning 2.0.0 documentation to check if string follows Semantic Versioning
  // https://semver.org/
  // Regex from: https://regex101.com/r/vkijKf/1/

  const semverRegex = new RegExp(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gm
  );

  const openapi = jsSpec.openapi;

  if (!openapi) {
    messages.addMessage(
      ['openapi'],
      'API definition must have an `openapi` field',
      'error'
    );
  } else if (typeof openapi !== 'string') {
    messages.addMessage(
      ['openapi'],
      'API definition must have an `openapi` field as type string',
      'error'
    );
  } else if (!openapi.match(semverRegex)) {
    messages.addMessage(
      ['openapi'],
      '`openapi` string must follow Semantic Versioning 2.0.0',
      'error'
    );
  }
  return messages;
};
