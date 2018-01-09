const semver = require('semver');
const chalk = require('chalk');

module.exports = function(requiredVersion) {
  const isSupportedVersion = semver.gte(process.version, requiredVersion);
  if (!isSupportedVersion) {
    console.log(
      '\n' +
        chalk.red('[Error]') +
        ` Node version must be ${requiredVersion} or above.` +
        ` Your current version is ${process.version}\n`
    );
    process.exit(2);
  }
};
