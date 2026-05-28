/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import fs from 'fs';
import util from 'util';
import jsYaml from 'js-yaml';

async function readYaml(path) {
  // Use a "promisified" version of fs.readFile().
  const readFile = util.promisify(fs.readFile);
  const fileContents = await readFile(path, 'utf8');
  return jsYaml.load(fileContents);
}

export default readYaml;
