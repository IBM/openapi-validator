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

  const basePath = isOAS3 ? ['components', 'schemas'] : ['definitions'];

  // Assertation 1
  // This is a "creative" way to approach the problem of collecting used $refs,
  // but other solutions required walking the jsSpec recursively to detect $refs,
  // which can be quite slow.
  const refRegex = /\$ref.*["'](.*)["']/g;
  let match = refRegex.exec(specStr);
  const refs = [];
  while (match !== null) {
    refs.push(match[1]);
    match = refRegex.exec(specStr);
  }

  // de-dupe the array, and filter out non-definition refs
  const definitionsRefs = filter(uniq(refs), v =>
    startsWith(v, `#/${basePath.join('/')}`)
  );

  const definitions = isOAS3 ? jsSpec.components.schemas : jsSpec.definitions;
  each(definitions, (def, defName) => {
    if (definitionsRefs.indexOf(`#/${basePath.join('/')}/${defName}`) === -1) {
      messages.addMessage(
        `${basePath.join('.')}.${defName}`,
        'Definition was declared but never used in document',
        'warning'
      );
    }
  });

  return messages;
};
