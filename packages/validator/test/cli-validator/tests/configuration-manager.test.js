/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { getCapturedText } = require('../../test-utils');
const {
  getDefaultConfig,
  loadConfig,
  processArgs,
} = require('../../../src/cli-validator/utils');

// Use these parse options since we're not actually retrieving process args.
const cliParseOptions = { from: 'user' };

describe('Configuration Manager tests', function () {
  let consoleSpy;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    console.warn = console.log;
    console.error = console.log;
    console.info = console.log;
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    console.warn = originalWarn;
    console.error = originalError;
    console.info = originalInfo;
  });

  describe('getDefaultConfig()', function () {
    it('should return correct default configuration object', async function () {
      const defaultConfig = getDefaultConfig();

      expect(typeof defaultConfig).toBe('object');
      expect(defaultConfig.colorizeOutput).toBe(true);
      expect(defaultConfig.errorsOnly).toBe(false);
      expect(defaultConfig.files).toStrictEqual([]);
      expect(defaultConfig.limits).toMatchObject({ warnings: -1 });
      expect(defaultConfig.ignoreFiles).toStrictEqual([]);
      expect(defaultConfig.logLevels).toMatchObject({});
      expect(defaultConfig.outputFormat).toBe('text');
      expect(defaultConfig.ruleset).toBe(null);
      expect(defaultConfig.summaryOnly).toBe(false);
      expect(defaultConfig.produceImpactScore).toBe(false);
      expect(defaultConfig.markdownReport).toBe(false);
    });
  });

  describe('loadConfig()', function () {
    const expectedConfig = {
      limits: {
        warnings: 10,
      },
      ignoreFiles: ['ignored/file/numero_uno', 'another/ignored/file'],
      logLevels: {
        logger1: 'debug',
        root: 'info',
        logger2: 'error',
      },
    };

    it('should return correct config object for .json', async function () {
      const config = await loadConfig(
        './test/cli-validator/mock-files/config/valid-config.json'
      );
      // originalError(`config = ${JSON.stringify(config, null, 2)}`);
      expect(config).toMatchObject(expectedConfig);
    });

    it('should return correct config object for .yaml', async function () {
      const config = await loadConfig(
        './test/cli-validator/mock-files/config/valid-config.yaml'
      );
      expect(config).toMatchObject(expectedConfig);
    });

    it('should return correct config object for .js', async function () {
      const config = await loadConfig(
        './test/cli-validator/mock-files/config/valid-config.js'
      );
      expect(config).toMatchObject(expectedConfig);
    });

    it('should return correct config object for five-warnings.json', async function () {
      const config = await loadConfig(
        './test/cli-validator/mock-files/config/five-warnings.json'
      );
      expect(config.limits.warnings).toBe(5);
    });

    it('should log error and return default config for invalid config file', async function () {
      const defaultConfig = getDefaultConfig();

      const config = await loadConfig(
        './test/cli-validator/mock-files/config/invalid-config.yaml'
      );
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
      expect(capturedText).toHaveLength(2);
      expect(capturedText[0]).toMatch(/Invalid configuration file/);
      expect(capturedText[0]).toMatch(
        /schema validation error: '\/errorsOnly': must be boolean/
      );
      expect(capturedText[1]).toMatch(
        /The validator will use a default config/
      );
      expect(config).toMatchObject(defaultConfig);
    });
  });

  describe('processArgs()', function () {
    it('should return default config when no CLI args', async function () {
      const defaultConfig = getDefaultConfig();

      const { context } = await processArgs([], cliParseOptions);
      // const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
      expect(context).toBeDefined();
      expect(context).toMatchObject({ config: defaultConfig });
    });

    it('should return default config if invalid config file (bad JSON)', async function () {
      const defaultConfig = getDefaultConfig();

      const { context } = await processArgs(
        ['-c', './test/cli-validator/mock-files/bad-json.json'],
        cliParseOptions
      );
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
      expect(capturedText).toHaveLength(2);
      expect(capturedText[0]).toMatch(
        /\[ERROR\] Unable to load config file.*SyntaxError:/
      );
      expect(capturedText[1]).toMatch(
        /The validator will use a default config/
      );
      expect(context).toBeDefined();
      expect(context).toMatchObject({ config: defaultConfig });
    });

    it('should return default config if invalid config file (schema)', async function () {
      const defaultConfig = getDefaultConfig();

      const { context } = await processArgs(
        ['-c', './test/cli-validator/mock-files/config/invalid-config.yaml'],
        cliParseOptions
      );
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
      expect(capturedText).toHaveLength(2);
      expect(capturedText[0]).toMatch(/Invalid configuration file/);
      expect(capturedText[0]).toMatch(
        /schema validation error: '\/errorsOnly': must be boolean/
      );
      expect(capturedText[1]).toMatch(
        /The validator will use a default config/
      );
      expect(context).toBeDefined();
      expect(context).toMatchObject({ config: defaultConfig });
    });

    it('should return correct config if valid config file', async function () {
      const { context } = await processArgs(
        ['-c', './test/cli-validator/mock-files/config/config1.yaml'],
        cliParseOptions
      );
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
      expect(capturedText).toHaveLength(0);
      expect(context).toBeDefined();
      expect(context.config).toMatchObject({
        colorizeOutput: true,
        errorsOnly: true,
        files: ['file1.yaml', 'file2.json'],
        ignoreFiles: ['ignored/file1'],
        limits: {
          warnings: 5,
        },
        logLevels: {
          'ibm-schema-description-exists': 'debug',
          root: 'info',
        },
        outputFormat: 'text',
        summaryOnly: false,
        produceImpactScore: false,
        markdownReport: false,
        ruleset: null,
      });
    });

    it('should return correct config if valid config file AND cli options used', async function () {
      const { context } = await processArgs(
        [
          '-c',
          './test/cli-validator/mock-files/config/config1.yaml',
          'file3.json',
          '--log-level',
          'debug',
          '-n',
          '--json',
          'file4.yaml',
          '--ignore',
          'ignored/file2.json',
          '--ruleset',
          'my-rules.yml',
          '--summary-only',
          '--warnings-limit',
          '-1',
          '--impact-score',
          '--markdown-report',
        ],
        cliParseOptions
      );
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
      expect(capturedText).toHaveLength(0);
      expect(context).toBeDefined();
      expect(context.config).toMatchObject({
        colorizeOutput: false,
        errorsOnly: true,
        files: ['file3.json', 'file4.yaml'],
        ignoreFiles: ['ignored/file2.json'],
        limits: {
          warnings: -1,
        },
        logLevels: {
          root: 'debug',
        },
        ruleset: 'my-rules.yml',
        summaryOnly: true,
        produceImpactScore: true,
        markdownReport: true,
      });
    });

    it('should log error and use default if invalid warnings value', async function () {
      const { context } = await processArgs(
        ['--warnings-limit', 'foo'],
        cliParseOptions
      );
      const capturedText = getCapturedText(consoleSpy.mock.calls);
      // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
      expect(capturedText).toHaveLength(1);
      expect(capturedText[0]).toBe(
        `error: option '-w, --warnings-limit <number>' argument 'foo' is invalid; using default (-1) instead`
      );
      expect(context).toBeDefined();
      expect(context.config).toBeDefined();
      expect(context.config.limits).toBeDefined();
      expect(context.config.limits.warnings).toBe(-1);
    });

    describe('CLI options', function () {
      it.each(['-c', '--config'])(
        `should load correct config with -c/--config option`,
        async function (option) {
          const expectedConfig = {
            colorizeOutput: true,
            errorsOnly: true,
            files: ['file1.yaml', 'file2.json'],
            limits: {
              warnings: 5,
            },
            logLevels: {
              root: 'info',
              'ibm-schema-description-exists': 'debug',
            },
            outputFormat: 'text',
            summaryOnly: false,
            produceImpactScore: false,
            markdownReport: false,
          };

          const { context } = await processArgs(
            [option, './test/cli-validator/mock-files/config/config1.yaml'],
            cliParseOptions
          );
          const capturedText = getCapturedText(consoleSpy.mock.calls);
          // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
          expect(capturedText).toHaveLength(0);
          expect(context).toBeDefined();
          expect(context.config).toMatchObject(expectedConfig);
        }
      );

      it.each(['-e', '--errors-only'])(
        `should produce correct config with -e/--errors-only option`,
        async function (option) {
          const expectedConfig = {
            errorsOnly: true,
          };

          const { context } = await processArgs([option], cliParseOptions);
          const capturedText = getCapturedText(consoleSpy.mock.calls);
          // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
          expect(capturedText).toHaveLength(0);
          expect(context).toBeDefined();
          expect(context.config).toMatchObject(expectedConfig);
        }
      );

      it.each(['-i', '--ignore'])(
        `should produce correct config with -i/--ignore option`,
        async function (option) {
          const expectedConfig = {
            ignoreFiles: ['ignoredFile1.yaml', 'ignoredFile2.json'],
          };

          const { context } = await processArgs(
            [option, 'ignoredFile1.yaml', option, 'ignoredFile2.json'],
            cliParseOptions
          );
          const capturedText = getCapturedText(consoleSpy.mock.calls);
          // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
          expect(capturedText).toHaveLength(0);
          expect(context).toBeDefined();
          expect(context.config).toMatchObject(expectedConfig);
        }
      );

      it.each(['-j', '--json'])(
        `should produce correct config with -j/--json option`,
        async function (option) {
          const expectedConfig = {
            outputFormat: 'json',
          };

          const { context } = await processArgs([option], cliParseOptions);
          const capturedText = getCapturedText(consoleSpy.mock.calls);
          // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
          expect(capturedText).toHaveLength(0);
          expect(context).toBeDefined();
          expect(context.config).toMatchObject(expectedConfig);
        }
      );

      it.each(['-lroot=debug', '--log-level=root=debug'])(
        `should produce correct config with -l/--log-level option`,
        async function (option) {
          const expectedConfig = {
            logLevels: {
              root: 'debug',
            },
          };

          const { context } = await processArgs([option], cliParseOptions);
          const capturedText = getCapturedText(consoleSpy.mock.calls);
          // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
          expect(capturedText).toHaveLength(0);
          expect(context).toBeDefined();
          expect(context.config).toMatchObject(expectedConfig);
        }
      );

      it.each(['-n', '--no-colors'])(
        `should produce correct config with -n/--no-colors option`,
        async function (option) {
          const expectedConfig = {
            colorizeOutput: false,
          };

          const { context } = await processArgs([option], cliParseOptions);
          const capturedText = getCapturedText(consoleSpy.mock.calls);
          // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
          expect(capturedText).toHaveLength(0);
          expect(context).toBeDefined();
          expect(context.config).toMatchObject(expectedConfig);
        }
      );

      it.each(['-r', '--ruleset'])(
        `should produce correct config with -r/--ruleset option`,
        async function (option) {
          const expectedConfig = {
            ruleset: 'my-custom-rules.yaml',
          };

          const { context } = await processArgs(
            [option, 'my-custom-rules.yaml'],
            cliParseOptions
          );
          const capturedText = getCapturedText(consoleSpy.mock.calls);
          // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
          expect(capturedText).toHaveLength(0);
          expect(context).toBeDefined();
          expect(context.config).toMatchObject(expectedConfig);
        }
      );

      it.each(['-s', '--summary-only'])(
        `should produce correct config with -s/--summary-only option`,
        async function (option) {
          const expectedConfig = {
            summaryOnly: true,
          };

          const { context } = await processArgs([option], cliParseOptions);
          const capturedText = getCapturedText(consoleSpy.mock.calls);
          // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
          expect(capturedText).toHaveLength(0);
          expect(context).toBeDefined();
          expect(context.config).toMatchObject(expectedConfig);
        }
      );

      it.each(['-q', '--impact-score'])(
        `should produce correct config with -q/--impact-score option`,
        async function (option) {
          const expectedConfig = {
            produceImpactScore: true,
          };

          const { context } = await processArgs([option], cliParseOptions);
          const capturedText = getCapturedText(consoleSpy.mock.calls);
          // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
          expect(capturedText).toHaveLength(0);
          expect(context).toBeDefined();
          expect(context.config).toMatchObject(expectedConfig);
        }
      );

      it.each(['-m', '--markdown-report'])(
        `should produce correct config with -m/--markdown-report option`,
        async function (option) {
          const expectedConfig = {
            markdownReport: true,
          };

          const { context } = await processArgs([option], cliParseOptions);
          const capturedText = getCapturedText(consoleSpy.mock.calls);
          expect(capturedText).toHaveLength(0);
          expect(context).toBeDefined();
          expect(context.config).toMatchObject(expectedConfig);
        }
      );

      it.each(['-w', '--warnings-limit'])(
        `should produce correct config with -2/--warnings-limit option`,
        async function (option) {
          const expectedConfig = {
            limits: {
              warnings: 38,
            },
          };

          const { context } = await processArgs([option, 38], cliParseOptions);
          const capturedText = getCapturedText(consoleSpy.mock.calls);
          // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
          expect(capturedText).toHaveLength(0);
          expect(context).toBeDefined();
          expect(context.config).toMatchObject(expectedConfig);
        }
      );

      it('should not throw error for --version option', async function () {
        const { command } = await processArgs(['--version'], cliParseOptions);
        expect(command.opts().version).toBe(true);
        const capturedText = getCapturedText(consoleSpy.mock.calls);
        expect(capturedText).toHaveLength(0);
      });

      it('should throw error for --help option', async function () {
        let caughtException;
        try {
          await processArgs(['--help'], cliParseOptions);
        } catch (err) {
          caughtException = true;
          expect(err.exitCode).toBe(0);
        }
        const capturedText = getCapturedText(consoleSpy.mock.calls);
        // originalError(`Captured text: ${JSON.stringify(capturedText, null, 2)}`);
        expect(capturedText).toHaveLength(2);
        expect(capturedText[0]).toMatch(
          /IBM OpenAPI Validator.*validator:.*Copyright.*/
        );
        expect(capturedText[1]).toMatch(/Usage:/);
        expect(caughtException).toBe(true);
      });
    });
  });
});
