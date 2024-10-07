/**
 * Copyright 2017 - 2024 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const { LoggerFactory } = require('../../src/utils');

describe('LoggerFactory tests', () => {
  let consoleSpy;
  let loggerFactory;
  const originalDebug = console.debug;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    console.debug = console.log;
    console.info = console.log;
    console.warn = console.log;
    console.error = console.log;
    loggerFactory = new LoggerFactory();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    console.debug = originalDebug;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
    loggerFactory = null;
  });

  it('Root logger has default loglevel WARN', async () => {
    const logger = loggerFactory.getLogger(null);
    expect(logger.getLevel()).toBe(logger.levels.WARN);
  });

  it('addLoggerSetting() before root logger is created', async () => {
    loggerFactory.addLoggerSetting('root', 'info');
    const logger = loggerFactory.getLogger(null);
    expect(logger.getLevel()).toBe(logger.levels.INFO);
  });

  it('addLoggerSetting() after root logger is created', async () => {
    const logger = loggerFactory.getLogger(null);
    loggerFactory.addLoggerSetting('root', 'info');
    loggerFactory.applySettingsToAllLoggers();
    expect(logger.getLevel()).toBe(logger.levels.INFO);
  });

  it('addLoggerSetting() before non-root logger is created', async () => {
    loggerFactory.addLoggerSetting('ibm-*', 'debug');
    const logger = loggerFactory.getLogger('ibm-rule1');
    expect(logger.getLevel()).toBe(logger.levels.DEBUG);
  });

  it('addLoggerSetting() after non-root logger is created', async () => {
    const logger = loggerFactory.getLogger('ibm-rule2');
    loggerFactory.addLoggerSetting('ibm-*', 'error');
    loggerFactory.applySettingsToAllLoggers();
    expect(logger.getLevel()).toBe(logger.levels.ERROR);
  });

  it('addLoggerSetting() should throw exception for invalid level', async () => {
    expect(() => {
      loggerFactory.addLoggerSetting('ibm-*', 'BADLEVEL');
    }).toThrow(/Invalid log level 'BADLEVEL'/);
  });

  it('Ensure level=error is honored', async () => {
    loggerFactory.addLoggerSetting('rule-logger-error', 'error');
    loggerFactory.applySettingsToAllLoggers();
    const logger = loggerFactory.getLogger('rule-logger-error');
    expect(logger.getLevel()).toBe(logger.levels.ERROR);

    logger.debug('This debug message should not be displayed');
    logger.info('This info message should not be displayed');
    logger.warn('This warn message should not be displayed');
    logger.error('This error message should be displayed');

    const messages = captureMessages(consoleSpy.mock.calls);
    // originalError(`captured messages:\n${messages}`);

    expect(messages).toHaveLength(1);
    expect(messages[0]).toContain('should be');
  });

  it('Ensure level=warn is honored', async () => {
    loggerFactory.addLoggerSetting('rule-logger-warn', 'warn');
    loggerFactory.applySettingsToAllLoggers();
    const logger = loggerFactory.getLogger('rule-logger-warn');
    expect(logger.getLevel()).toBe(logger.levels.WARN);

    logger.debug('This debug message should not be displayed');
    logger.info('This info message should not be displayed');
    logger.warn('This warn message should be displayed');
    logger.error('This error message should be displayed');

    const messages = captureMessages(consoleSpy.mock.calls);
    // originalError(`captured messages:\n${messages}`);

    expect(messages).toHaveLength(2);
    expect(messages[0]).toContain('should be');
    expect(messages[1]).toContain('should be');
  });

  it('Ensure level=info is honored', async () => {
    loggerFactory.addLoggerSetting('rule-logger-info', 'info');
    loggerFactory.applySettingsToAllLoggers();
    const logger = loggerFactory.getLogger('rule-logger-info');
    expect(logger.getLevel()).toBe(logger.levels.INFO);

    logger.debug('This debug message should not be displayed');
    logger.info('This info message should be displayed');
    logger.warn('This warn message should be displayed');
    logger.error('This error message should be displayed');

    const messages = captureMessages(consoleSpy.mock.calls);
    // originalError(`captured messages:\n${messages}`);

    expect(messages).toHaveLength(3);
    expect(messages[0]).toContain('should be');
    expect(messages[1]).toContain('should be');
    expect(messages[2]).toContain('should be');
  });

  it('Ensure level=debug is honored', async () => {
    loggerFactory.addLoggerSetting('rule-logger-debug', 'debug');
    loggerFactory.applySettingsToAllLoggers();
    const logger = loggerFactory.getLogger('rule-logger-debug');
    expect(logger.getLevel()).toBe(logger.levels.DEBUG);

    logger.debug('This debug message should be displayed');
    logger.info('This info message should be displayed');
    logger.warn('This warn message should be displayed');
    logger.error('This error message should be displayed');

    const messages = captureMessages(consoleSpy.mock.calls);
    // originalError(`captured messages:\n${messages}`);

    expect(messages).toHaveLength(4);
    expect(messages[0]).toContain('should be');
    expect(messages[1]).toContain('should be');
    expect(messages[2]).toContain('should be');
    expect(messages[3]).toContain('should be');
  });

  it('Ensure correct levels with root and non-root loggers', async () => {
    loggerFactory.addLoggerSetting('root', 'debug');
    loggerFactory.applySettingsToAllLoggers();
    let logger = loggerFactory.getLogger('root');
    expect(logger.getLevel()).toBe(logger.levels.DEBUG);

    logger = loggerFactory.getLogger('my-rule');
    expect(logger.getLevel()).toBe(logger.levels.WARN);
  });
});

/**
 * Returns a list consisting of the first argument within each "call" entry.
 * We only use the first argument since we only pass one arg to each of the
 * logger methods.
 * @param {*} calls the list of calls made to the mock object
 * @returns a list of messages logged
 */
function captureMessages(calls) {
  return calls.map(args => {
    return args[0];
  });
}
