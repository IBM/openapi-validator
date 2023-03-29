/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const each = require('lodash/each');
const pad = require('pad');

// this function prints all of the output
module.exports = function print(context, results) {
  const { chalk, config } = context;
  const types = ['error', 'warning', 'info', 'hint'];

  if (config.summaryOnly) {
    printSummary(results, types, context);
    return;
  }

  const colors = {
    error: 'red',
    warning: 'yellow',
    info: 'green',
    hint: 'grey',
  };

  types.forEach(type => {
    if (!results[type].summary.total) {
      return; // continue
    }

    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1) + 's';
    const color = colors[type];
    console.log(chalk[color](`${typeLabel}:`));
    console.log('');

    each(results[type].results, result => {
      // print the path array as a dot-separated string
      console.log(chalk[color](`  Message :   ${result.message}`));
      console.log(chalk[color](`  Rule    :   ${result.rule}`));
      console.log(chalk[color](`  Path    :   ${result.path.join('.')}`));
      console.log(chalk[color](`  Line    :   ${result.line}`));
      console.log('');
    });
  });

  // Print the summary here
  printSummary(results, types, context);
};

function printSummary(results, types, { chalk, config }) {
  console.log(chalk.cyan('Summary:'));
  console.log('');

  console.log(
    chalk.cyan(`  Total number of errors   : ${results.error.summary.total}`)
  );
  if (!config.errorsOnly) {
    console.log(
      chalk.cyan(
        `  Total number of warnings : ${results.warning.summary.total}`
      )
    );
  }
  if (results.info.summary.total > 0) {
    console.log(
      chalk.cyan(`  Total number of infos    : ${results.info.summary.total}`)
    );
  }
  if (results.hint.summary.total > 0) {
    console.log(
      chalk.cyan(`  Total number of hints    : ${results.hint.summary.total}`)
    );
  }

  types.forEach(type => {
    // print the type, either error or warning
    if (results[type].summary.total) {
      const typeLabel = type.charAt(0).toUpperCase() + type.slice(1) + 's';
      console.log('');
      console.log('  ' + chalk.underline.cyan(typeLabel + ':'));
    }

    results[type].summary.entries.forEach(entry => {
      // pad(<number>, <string>) right-aligns <string> to the <number>th column, padding with spaces.
      // use 4, two for the appended spaces of every line and two for the number
      //   (assuming errors/warnings won't go to triple digits)
      const numberString = pad(4, entry.count);
      // use 6 for largest case of '(100%)'
      const frequencyString = pad(6, `(${entry.percentage}%)`);

      console.log(
        chalk.cyan(
          `${numberString} ${frequencyString} : ${entry.generalizedMessage}`
        )
      );
    });
  });
  console.log('');
}
