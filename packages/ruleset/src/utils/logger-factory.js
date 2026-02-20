/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const log = require('loglevel');
const minimatch = require('minimatch');
const prefix = require('loglevel-plugin-prefix');
const chalk = require('chalk');

const colors = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.green,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

/**
 * This class serves as a factory for creating loggers implemented by the 'loglevel' package.
 * The primary benefit provided by this factory class is the ability to honor logging-level-related
 * command-line options for loggers that haven't yet been created.
 */
module.exports = class LoggerFactory {
  constructor() {
    this.rootLogger = log;
    this.loggerSettings = [];

    // Register the prefix handler with the loglevel.
    // This will control the [<level>] message prefixes.
    prefix.reg(log);
    prefix.apply(log, {
      levelFormatter(level) {
        return level.toUpperCase();
      },
      format(level) {
        return `${colors[level](`[${level}]`)}`;
      },
    });
  }

  /**
   * @returns a single instance of our factory.
   */
  static getInstance() {
    if (!global.__ibm_openapi_validator_logger_factory) {
      global.__ibm_openapi_validator_logger_factory = new LoggerFactory();
    }

    return global.__ibm_openapi_validator_logger_factory;
  }

  /**
   * A logger setting consists of a logger name (a glob-like string,
   * e.g. 'my-*-logger' or 'my-first-logger') and a log level
   * (e.g. 'error', 'warn', 'info', 'debug', or 'trace').
   * This function adds the logger setting specified by "name" and
   * "logLevel" to the current array of logger settings.
   * @param {*} name the name of the logger (glob-like string)
   * @param {*} logLevel the log level to set on the logger
   */
  addLoggerSetting(name, logLevel) {
    checkLevel(logLevel);
    this.loggerSettings.push({
      loggerName: name,
      logLevel,
    });
    this.applySettingsToAllLoggers();
  }

  /**
   * Returns the logger with name "<name>".
   * If "name" is falsy or the string "root", then the root logger is returned.
   * The resulting logger will have the current logger settings applied to it, which
   * might affect the logging level.
   * @param {*} name the name of the logger to be retrieved
   * @returns the logger with the specified name
   */
  getLogger(name) {
    const logger =
      name && name !== 'root'
        ? this.rootLogger.getLogger(name)
        : this.rootLogger;

    // If the root logger already has a loglevel set on it
    // that is different from the default ("warn"), then any
    // new loggers created from the root logger will also have
    // that same level set on it automatically.
    // So, to avoid that, we'll set the new logger's level
    // immediately to the default ("warn"), then let the
    // "applyLoggerSettings()" method potentially set it to the
    // correct level per user-supplied command-line options.
    logger.setLevel('warn');

    this.applyLoggerSettings(name, logger);
    return logger;
  }

  /**
   * Applies the currently-defined logger settings to the specified logger with name "<name>".
   * @param {*} name the name of the logger
   * @param {*} logger the logger to apply logger settings to
   */
  applyLoggerSettings(name, logger) {
    if (!name) {
      name = 'root';
    }

    for (const setting of this.loggerSettings) {
      // If the name of the logger matches the (potential) glob-pattern
      // previously-specified via the command-line, then apply the
      // specified log level to that logger.
      if (minimatch(name, setting.loggerName)) {
        logger.setLevel(setting.logLevel);
      }
    }
  }

  /**
   * Visits all existing loggers and applies the currently-defined logger settings
   * to each one.  This is useful in situations where some loggers might already exist
   * prior to the command-line arguments being processed.
   */
  applySettingsToAllLoggers() {
    this.applyLoggerSettings('root', this.rootLogger);
    for (const key in this.rootLogger.getLoggers()) {
      this.applyLoggerSettings(key, this.rootLogger.getLogger(key));
    }
  }
};

const validLevels = ['error', 'warn', 'info', 'debug', 'trace'];
function checkLevel(logLevel) {
  if (!validLevels.includes(logLevel.toLowerCase())) {
    throw `Invalid log level '${logLevel}'. Valid log levels: ${validLevels}`;
  }
}
