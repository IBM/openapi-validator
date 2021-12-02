const semver = require('semver');
const chalk = require('chalk');

// this module can be used to handle any version-specific functionality
// it will be called immediately when the program is run

module.exports = function(requiredVersion) {
  // this is called since the code uses features that require `requiredVersion`
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

  // print deprecation warnings for specific node versions that will no longer be supported
  const isNodeTen = semver.satisfies(process.version, '10.x');
  if (isNodeTen) {
    console.log(
      '\n' +
        chalk.yellow('[Warning]') +
        ` Support for Node 10.x is deprecated. Support will be officially dropped when it reaches end of life` +
        ` (30 April 2021).\n`
    );
  }
};
