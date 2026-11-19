/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

import { gte, satisfies } from 'semver';
import chalk from 'chalk';
const { red, yellow } = chalk;

// this module can be used to handle any version-specific functionality
// it will be called immediately when the program is run

export default function (requiredVersion) {
  // this is called since the code uses features that require `requiredVersion`
  const isSupportedVersion = gte(process.version, requiredVersion);
  if (!isSupportedVersion) {
    console.log(
      '\n' +
        red('[Error]') +
        ` Node version must be ${requiredVersion} or above.` +
        ` Your current version is ${process.version}\n`
    );
    process.exit(2);
  }

  // print deprecation warnings for specific node versions that will no longer be supported
  const isNodeTen = satisfies(process.version, '10.x');
  if (isNodeTen) {
    console.log(
      '\n' +
        yellow('[Warning]') +
        ` Support for Node 10.x is deprecated. Support will be officially dropped when it reaches end of life` +
        ` (30 April 2021).\n`
    );
  }
}
