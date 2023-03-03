/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

module.exports = function printError(chalk, description, message = '') {
  console.log('\n' + chalk.red('[Error]') + ` ${description}`);
  if (message) {
    console.log(chalk.magenta(message));
  }
  console.log();
};
