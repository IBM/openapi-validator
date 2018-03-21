module.exports = function printError(chalk, description, message = '') {
  console.log('\n' + chalk.red('[Error]') + ` ${description}`);
  if (message) {
    console.log(chalk.magenta(message));
  }
  console.log();
};
