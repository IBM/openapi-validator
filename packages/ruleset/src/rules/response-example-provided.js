const { responseExampleProvided } = require('../functions');

module.exports = {
  description: 'Response should provide an example',
  message: '{{error}}',
  given:
    '$.paths[*][*].responses[?(@property >= 200 && @property < 300)].content.application/json',
  severity: 'warn',
  resolved: true,
  then: {
    function: responseExampleProvided
  }
};
