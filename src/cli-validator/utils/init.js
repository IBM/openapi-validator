const fs = require('fs');
const util = require('util');
const findUp = require('find-up');
const printError = require('./printError');

const { defaults } = require('../../.defaultsForValidator');
const fileToCreate = process.cwd() + '/.validaterc';

module.exports.printDefaults = async function(chalk) {
  const successMessage = `'.validaterc' file created and set to defaults.`;
  return await writeConfigFile(defaults, successMessage, chalk);
};

module.exports.migrate = async function(chalk) {
  let oldConfigFile;
  try {
    oldConfigFile = await readCurrentConfig();
  } catch (err) {
    return err;
  }

  for (const category in oldConfigFile) {
    for (const rule in oldConfigFile[category]) {
      if (defaults.shared[category] && defaults.shared[category][rule]) {
        defaults.shared[category][rule] = oldConfigFile[category][rule];
      } else if (
        defaults.swagger2[category] &&
        defaults.swagger2[category][rule]
      ) {
        defaults.swagger2[category][rule] = oldConfigFile[category][rule];
      }
    }
  }

  const successMessage = `'.validaterc' file converted to new format.`;
  return await writeConfigFile(defaults, successMessage, chalk);
};

async function writeConfigFile(configObject, successMessage, chalk) {
  const writeFile = util.promisify(fs.writeFile);
  try {
    const indentationSpaces = 2;
    await writeFile(
      fileToCreate,
      JSON.stringify(defaults, null, indentationSpaces)
    );
    console.log('\n' + chalk.green('[Success]') + ` ${successMessage}\n`);
    return Promise.resolve(0);
  } catch (err) {
    const description =
      'Problem writing the .validaterc file. See below for details.';
    printError(chalk, description, err);
    return Promise.reject(2);
  }
}

async function readCurrentConfig(chalk) {
  let configObject;
  const configFile = await findUp('.validaterc');

  // if the user does not have a config file,
  // there is no need for the migration step
  if (configFile === null) {
    console.log(`No .validaterc file found to migrate.`);
    return Promise.reject(2);
  }

  const readFile = util.promisify(fs.readFile);

  try {
    // the config file must be in the root folder of the project
    const fileAsString = await readFile(configFile, 'utf8');
    configObject = JSON.parse(fileAsString);
  } catch (err) {
    // this most likely means there is a problem in the json syntax itself
    const description =
      'Could not read the .validaterc file. See below for details.';
    printError(chalk, description, err);
    return Promise.reject(2);
  }

  return configObject;
}
