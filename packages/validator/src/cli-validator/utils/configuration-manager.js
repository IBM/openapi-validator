/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const path = require('path');
const {
  getFileExtension,
  supportedFileExtension,
} = require('./file-extension-validator');
const { LoggerFactory } = require('@ibm-cloud/openapi-ruleset/src/utils');
const { validate } = require('./schema-validator');
const createCLIOptions = require('./cli-options');
const { readYaml } = require('./read-yaml');

// Lazy initializer for the logger.
let logger;
function getLogger() {
  if (!logger) {
    logger = LoggerFactory.getInstance().getLogger('root');
  }
  return logger;
}

// Our default config object.
const defaultConfig = {
  colorizeOutput: true,
  errorsOnly: false,
  files: [
    // 'my-api.yaml'
  ],
  input_paths: [
    // alternative to files for CodeClimate compatibility
  ],
  limits: {
    warnings: -1,
  },
  ignoreFiles: [
    // '/full/path/to/file/ignoreMe.json'
  ],
  logLevels: {
    // 'root': 'info'
    // 'ibm-schema-description-exists': 'debug'
  },
  outputFormat: 'text',
  ruleset: null,
  summaryOnly: false,
};

const supportedConfigFileTypes = ['json', 'yaml', 'yml', 'js'];

/**
 * Returns the default validator configuration.
 * @returns default config
 */
function getDefaultConfig() {
  // Make a copy that can be modified by the caller.
  return JSON.parse(JSON.stringify(defaultConfig));
}

/**
 * Loads the specified file as a validator config object.
 * @param {*} filename the name of the file to load
 * @returns the loaded config object or the default config in case of an error
 */
async function loadConfig(filename) {
  let userConfig = null;

  try {
    // Get fully-qualified filename.
    const configFile = path.resolve(filename);

    if (supportedFileExtension(configFile, supportedConfigFileTypes)) {
      const extension = getFileExtension(configFile);
      try {
        switch (extension) {
          case 'json':
          case 'js': {
            userConfig = require(configFile);
            break;
          }

          case 'yaml':
          case 'yml': {
            userConfig = await readYaml(configFile);
            break;
          }
        }
      } catch (err) {
        throw new Error(`Unable to load config file '${configFile}': ${err}`);
      }
    } else {
      throw new Error(
        `Unsupported config file type: '${configFile}'; supported extensions are: ${supportedConfigFileTypes.join(
          ', '
        )}`
      );
    }

    // If we loaded the user's config object above, then we need to validate it
    // against our schema.
    if (userConfig) {
      const schema = await getConfigFileSchema();
      const results = validate(userConfig, schema);
      if (results.length) {
        let msg = `Invalid configuration file '${configFile}' detected:`;
        results.forEach(result => {
          msg += '\n  ' + result;
        });
        throw new Error(msg);
      }
    }
  } catch (err) {
    // Rather than propagate any exceptions up to the caller, we'll just log the error messages,
    // and then return the default configuration object.
    getLogger().error(err.message);
    getLogger().error(
      `The validator will use a default config due to the previous error(s).`
    );
    userConfig = null;
  }

  // Return a fully-populated config object by overlaying the user config on top
  // of our default configuration.
  const configObj = Object.assign(
    {},
    defaultConfig,
    userConfig ? userConfig : {}
  );

  return configObj;
}

/**
 * Process the specified command-line arguments ('args') to produce
 * a validator context.
 * @param {*} args an array of command-line arguments
 * @param {*} cliParseOptions options for parsing the CLI args
 * @returns an object with fields "context" and "command"
 */
async function processArgs(args, cliParseOptions) {
  // 'command' will be a "Command" instance that describes our CLI options.
  const command = createCLIOptions();

  command.parse(args, cliParseOptions);

  // Set default loglevel of the root logger to be 'warn'.
  // The user can change this via options.
  const loggerFactory = LoggerFactory.getInstance();
  loggerFactory.addLoggerSetting('root', 'warn');
  logger = loggerFactory.getLogger('root');

  // "context" will serve as a container for the validator's configuration
  // and state information.
  const context = {
    logger,
  };

  // Retrieve the options that were set by the user on the command-line.
  const opts = command.opts();

  // Load the user's config file (if -c/--config specified on command-line),
  // or use the default config.
  const configObj = opts.config
    ? await loadConfig(opts.config)
    : getDefaultConfig();

  // Save the config object in our context.
  context.config = configObj;

  // Command-line options should take precedence over options contained in the config file,
  // so overlay CLI options onto our config object.

  // Filenames specified on the command-line will be in the "args" field.
  const prioFiles = command.args || configObj.input_paths || [];
  if (prioFiles.length) {
    configObj.files = prioFiles;
  }

  // Process each loglevel entry supplied on the command line.
  // During this first pass, we just want to parse the CLI -l/--logLevel options
  // and build an object ("cliLogLevels") that maps logger name -> logging level
  // (e.g. {'root': 'debug'}).
  const cliLogLevels = {};
  const logLevels = opts.logLevel || [];
  for (const entry of logLevels) {
    let [loggerName, logLevel] = entry.split('=');

    // No logLevel was parsed (e.g. -l info); assume root logger.
    if (!logLevel) {
      logLevel = loggerName;
      loggerName = 'root';
    }

    cliLogLevels[loggerName] = logLevel;
  }

  // If we in fact received log level options via the CLI, then overlay them
  // onto the config object.
  if (Object.keys(cliLogLevels).length) {
    configObj.logLevels = cliLogLevels;
  }

  // Now we just need to process the log level settings within the config object,
  // and update the LoggerFactory instance.
  for (const [loggerName, logLevel] of Object.entries(configObj.logLevels)) {
    loggerFactory.addLoggerSetting(loggerName, logLevel);
  }

  //
  // Retrieve the rest of the command-line options and apply them to "configObj".
  //
  if ('colors' in opts) {
    configObj.colorizeOutput = !!opts.colors;
  }

  if ('errorsOnly' in opts) {
    configObj.errorsOnly = !!opts.errorsOnly;
  }

  const ignoreFiles = opts.ignore || [];
  if (ignoreFiles.length) {
    configObj.ignoreFiles = ignoreFiles;
  }

  if ('json' in opts) {
    configObj.outputFormat = 'json';
  }

  if ('codeclimate' in opts) {
    configObj.outputFormat = 'codeclimate';
  }

  if ('ruleset' in opts) {
    configObj.ruleset = opts.ruleset;
  }

  if ('summaryOnly' in opts) {
    configObj.summaryOnly = !!opts.summaryOnly;
  }

  if ('warningsLimit' in opts) {
    configObj.limits.warnings = opts.warningsLimit;
  }

  return { context, command };
}

/**
 * Loads the configuration file schema from 'config-file.yaml'.
 * @returns the config file schema
 */
let configFileSchema;
async function getConfigFileSchema() {
  if (!configFileSchema) {
    configFileSchema = await readYaml(
      path.join(__dirname, '../../schemas/config-file.yaml')
    );
  }

  return configFileSchema;
}

module.exports = {
  getConfigFileSchema,
  getDefaultConfig,
  loadConfig,
  processArgs,
};
