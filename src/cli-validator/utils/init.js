const fs = require('fs');
const util = require('util');

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
    console.log(
      '\n' +
        chalk.red('\n[Error]') +
        ' Problem writing the .validaterc file. See below for details.\n' +
        chalk.magenta(err) +
        '\n'
    );
    return Promise.reject(2);
  }
};
