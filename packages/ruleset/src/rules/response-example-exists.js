const { responseExampleExists } = require('../functions');

module.exports = {
  description: 'Each response should include an example',
  message: '{{error}}',
  given:
    '$.paths[*][*].responses[?(@property >= 200 && @property < 300)].content.application/json',
  severity: 'warn',
  resolved: true,
  then: {
    function: responseExampleExists
  }
};
