/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const each = require('lodash/each');
const pad = require('pad');

// this function prints all of the output
module.exports = function print(
  logger,
  results,
  chalk,
  summaryOnly,
  errorsOnly
) {
  const types = errorsOnly ? ['error'] : ['error', 'warning', 'info', 'hint'];

  if (summaryOnly) {
    printSummary(results, types, logger, chalk, errorsOnly);
    return;
  }

  const colors = {
    error: 'bgRed',
    warning: 'bgYellow',
    info: 'bgGrey',
    hint: 'bgGreen'
  };

  types.forEach(type => {
    if (!results[type].summary.total) {
      return; // continue
    }

    let color = colors[type];
    logger.info(chalk[color].bold(`${type}s\n`));
    // convert 'color' from a background color to foreground color
    color = color.slice(2).toLowerCase(); // i.e. 'bgRed' -> 'red'

    each(results[type].results, result => {
      // print the path array as a dot-separated string
      logger.info(chalk[color](`  Message :   ${result.message}`));
      logger.info(chalk[color](`  Rule    :   ${result.rule}`));
      logger.info(chalk[color](`  Path    :   ${result.path.join('.')}`));
      logger.info(chalk[color](`  Line    :   ${result.line}`));
      logger.info('');
    });
  });

  // Print the summary here
  printSummary(results, types, logger, chalk, errorsOnly);
};

function printSummary(results, types, logger, chalk, errorsOnly) {
  logger.info(chalk.bgCyan('summary\n'));

  logger.info(
    chalk.cyan(`  Total number of errors   : ${results.error.summary.total}`)
  );
  if (!errorsOnly) {
    logger.info(
      chalk.cyan(
        `  Total number of warnings : ${results.warning.summary.total}`
      )
    );
  }
  if (results.info.summary.total > 0) {
    logger.info(
      chalk.cyan(`  Total number of infos    : ${results.info.summary.total}`)
    );
  }
  if (results.hint.summary.total > 0) {
    logger.info(
      chalk.cyan(`  Total number of hints    : ${results.hint.summary.total}`)
    );
  }
  logger.info('');

  types.forEach(type => {
    // print the type, either error or warning
    if (results[type].summary.total) {
      logger.info('  ' + chalk.underline.cyan(type + 's'));
    }

    results[type].summary.entries.forEach(entry => {
      // pad(<number>, <string>) right-aligns <string> to the <number>th column, padding with spaces.
      // use 4, two for the appended spaces of every line and two for the number
      //   (assuming errors/warnings won't go to triple digits)
      const numberString = pad(4, entry.count);
      // use 6 for largest case of '(100%)'
      const frequencyString = pad(6, `(${entry.percentage}%)`);

      logger.info(
        chalk.cyan(
          `${numberString} ${frequencyString} : ${entry.generalized_message}`
        )
      );
    });
    if (results[type].summary.total) {
      logger.info('');
    }
  });
}
