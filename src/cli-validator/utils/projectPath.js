const path = require('path');

// this module assumes that the validator will be used in one of two ways:
// 1: as a node module within a separate project (production)
//    example: `project/node_modules/swagger-validator-ibm/dist/src/...`
// 2: as a standalone repository used to build the validator (development)
//    example: `project/dist/src/...`

let relativePathToProjectRoot;
if (__dirname.includes('node_modules')) {
  // option 1
  relativePathToProjectRoot = '/../../../../../../';
} else {
  // option 2
  relativePathToProjectRoot = '/../../../../';
}

const pathToRoot = path.resolve(__dirname + relativePathToProjectRoot);
module.exports = pathToRoot + '/';
