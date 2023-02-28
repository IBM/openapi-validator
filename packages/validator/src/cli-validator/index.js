#!/usr/bin/env node
/**
 * Copyright 2017 - 2023 IBM Corporation.
 * SPDX-License-Identifier: Apache2.0
 */

// this module enforces that the user is running a supported version
// of Node by exiting the process if the version is less than
// the passed in argument (currently 14.0.0)
require('./utils/check-version')('14.0.0');

const runValidator = require('./run-validator');
runValidator(process.argv)
  .then(exitCode => {
    process.exitCode = exitCode;
    return exitCode;
  })
  .catch(err => {
    // if err is 2, it is because the message was caught
    // and printed already
    if (err !== 2) {
      console.log(err);
    }
    process.exitCode = 2;
    return 2;
  });

//
// exitCode/err guide:
//
// exitCode
// 0: the validator finished and passed with no errors/warnings
// 1: the validator finished but there were errors or warnings
//    in the Swagger file
// err
// 2: the program encountered an error that prevented
//    the validator from running on all the files
