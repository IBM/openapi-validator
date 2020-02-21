// Assertation 1:
// Referenceable definitions should be used by being referenced in the appropriate way

const uniq = require('lodash/uniq');
const filter = require('lodash/filter');
const startsWith = require('lodash/startsWith');
const each = require('lodash/each');
const MessageCarrier = require('../../../utils/messageCarrier');

module.exports.validate = function({ jsSpec, specStr, isOAS3 }) {
  const messages = new MessageCarrier();

  if (isOAS3 && !jsSpec.components) {
    // prevent trying to access components.schemas if components is undefined
    return messages;
  }

  // Collects all refs in the API definition
  const refRegex = /\$ref.*["'](.*)["']/g;
  let match = refRegex.exec(specStr);
  const refs = [];
  while (match !== null) {
    refs.push(match[1]);
    match = refRegex.exec(specStr);
  }

  const definitionSectionName = isOAS3 ? 'components' : 'definitions';
  // de-dupe the array, and filter out non-definition refs
  const definitionsRefs = filter(uniq(refs), v =>
    startsWith(v, `#/${definitionSectionName}`)
  );

  // checks if the definitions are used, and if not, record a warning
  if (isOAS3) {
    // securitySchemes definition type excluded because
    // security-definitions-ibm.js checks for unused security schemes
    const definitionTypeList = [
      'schemas',
      'parameters',
      'responses',
      'examples',
      'requestBodies',
      'headers',
      'links',
      'callbacks'
    ];
    definitionTypeList.forEach(function(definitionType) {
      if (jsSpec.components && jsSpec.components[definitionType]) {
        recordDefinitionsNotUsed(
          jsSpec.components[definitionType],
          definitionsRefs,
          ['components', definitionType],
          messages
        );
      }
    });
  } else {
    if (jsSpec.definitions) {
      recordDefinitionsNotUsed(
        jsSpec.definitions,
        definitionsRefs,
        ['definitions'],
        messages
      );
    }
  }

  return messages;
};

function recordDefinitionsNotUsed(
  definitions,
  definitionsRefs,
  basePath,
  messages
) {
  each(definitions, (_, defName) => {
    if (!definitionsRefs.includes(`#/${basePath.join('/')}/${defName}`)) {
      messages.addMessage(
        `${basePath.join('.')}.${defName}`,
        'Definition was declared but never used in document',
        'warning'
      );
    }
  });
}
