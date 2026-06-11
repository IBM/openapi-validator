/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { readFile as _readFile } from 'fs';
import { promisify } from 'util';
import { load } from 'js-yaml';

async function readYaml(path) {
  // Use a "promisified" version of fs.readFile().
  const readFile = promisify(_readFile);
  const fileContents = await readFile(path, 'utf8');
  return load(fileContents);
}

export default readYaml;
