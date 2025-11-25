/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

const fs = require('fs');
const util = require('util');
const jsYaml = require('js-yaml');

async function readYaml(path) {
  // Use a "promisified" version of fs.readFile().
  const readFile = util.promisify(fs.readFile);
  const fileContents = await readFile(path, 'utf8');
  return jsYaml.load(fileContents);
}

module.exports = readYaml;
