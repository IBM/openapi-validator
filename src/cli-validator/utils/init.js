const fs = require('fs');
const util = require('util');
const printError = require('./printError');

const defaults = require('../../.defaultsForValidator');
const fileToCreate = process.cwd() + '/.validaterc';

module.exports = async function(chalk) {
  const writeFile = util.promisify(fs.writeFile);
  try {
    const indentationSpaces = 2;
    await writeFile(
      fileToCreate,
      JSON.stringify(defaults, null, indentationSpaces)
    );
    console.log(
      '\n' +
        chalk.green('[Success]') +
        ` '.validaterc' file created and set to defaults.\n`
    );
    return Promise.resolve(0);
  } catch (err) {
    const description =
      'Problem writing the .validaterc file. See below for details.';
    printError(chalk, description, err);
    return Promise.reject(2);
  }
};
