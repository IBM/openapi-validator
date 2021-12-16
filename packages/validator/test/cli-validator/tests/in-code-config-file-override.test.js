const inCodeValidator = require('../../../src/lib');
const config = require('../../../src/cli-validator/utils/process-configuration');

const defaultConfig = require('../../../src/.defaultsForValidator').defaults;

const chalk = require('chalk');
const yaml = require('yaml-js');
const fs = require('fs');

describe('configFileOverride', function() {
  it('should call processConfiguration.get with the correct argument', async function() {
    const mockConfig = jest.spyOn(config, 'get').mockReturnValue(defaultConfig);

    const content = fs
      .readFileSync('./test/cli-validator/mock-files/clean.yml')
      .toString();
    const spec = yaml.load(content);

    const defaultMode = false;
    const configFileOverride = 'config-file-name.yaml';
    await inCodeValidator(spec, defaultMode, configFileOverride);

    expect(mockConfig).toBeCalledWith(defaultMode, chalk, configFileOverride);
  });
});
