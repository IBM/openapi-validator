/**
 * @copyright IBM Corporation 2017–2024
 * @license Apache-2.0
 */

// NOTE: Duplicated from ruleset package. Need to revisit
const { Spectral } = require('@stoplight/spectral-core');

module.exports = async (ruleName, rule, doc) => {
  const spectral = new Spectral();

  spectral.setRuleset({
    rules: {
      [ruleName]: rule,
    },
  });

  try {
    const results = await spectral.run(doc);
    return results;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
