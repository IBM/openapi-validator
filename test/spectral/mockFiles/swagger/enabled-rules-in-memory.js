const yaml = require('js-yaml');
const fs = require('fs');

module.exports = yaml.safeLoad(
  fs.readFileSync('./test/spectral/mockFiles/swagger/enabled-rules.yml', 'utf8')
);
