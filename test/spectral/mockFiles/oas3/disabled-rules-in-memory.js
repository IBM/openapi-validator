const yaml = require('js-yaml');
const fs = require('fs');

module.exports = yaml.safeLoad(
  fs.readFileSync('./test/spectral/mockFiles/oas3/disabled-rules.yml', 'utf8')
);
